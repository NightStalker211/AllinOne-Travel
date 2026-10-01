// AllinOne Travel — Deutsche Bahn Timetables service (FEAT-9).
//
// The IRIS timetables (DB API Marketplace, /apis/timetables/v1) are
// reached through the app's local relay /api/db/* (electron/api-relay.js)
// so DB_CLIENT_SECRET never enters the renderer bundle. Upstream
// answers XML (the product ignores Accept: application/json); the
// format-specific parser below maps it onto typed structures —
// attributes are single letters (pt = planned time, ct = changed
// time, pp/cp = platforms, ppth/cpth = route paths, tl = train
// line). It is a parser for THIS known schema, not a general XML
// engine, and it never invents a value the feed did not send.
//
// Times are station-local wall clocks (Europe/Berlin) kept as
// "YYYY-MM-DDTHH:MM" strings — no timezone conversion is guessed;
// delays are computed as ct - pt (same wall clock, so the diff in
// minutes is exact).

export type DbErrorReason =
  | "not-configured" // relay reports missing server-side credentials
  | "bad-request" // relay rejected the parameters
  | "no-data" // 404 — no slice loaded for that station/date/hour
  | "unavailable" // network / relay / upstream failure
  | "no-station"; // client-side lookup found no matching station

export interface DbStation {
  name: string;
  eva: string;
  ds100?: string;
}

/** A time cell of one stop call: planned vs. (live) changed. */
export interface DbTime {
  /** Planned (Soll) time, station-local wall clock. */
  planned?: string;
  /** Changed (Ist) time when the feed carries one. */
  changed?: string;
  /** changed - planned, whole minutes; only when both exist. */
  delayMinutes?: number;
  platform?: string;
  changedPlatform?: string;
  /** Planned route (ppth/cpth), nearest stop first. */
  path?: string[];
}

/** One disruption/note attached to a stop (IRIS <m> element). */
export interface DbNote {
  category?: string;
  validFrom?: string;
  validTo?: string;
  since?: string;
  priority?: string;
}

/** One <s> element: a single train call at the station. */
export interface DbStop {
  id: string;
  /** Train line attributes from <tl>. */
  category?: string; // e.g. ICE, RE1, S
  number?: string; // e.g. 373
  line?: string; // e.g. "S8" (dp/ar @l)
  origin?: string; // origin eva (tl @o)
  arrival?: DbTime;
  departure?: DbTime;
  notes?: DbNote[];
  /** Present only in the changes feed (added/changed trip). */
  onlyInChanges?: boolean;
}

export interface DbTimetable {
  station?: string;
  eva?: string;
  stops: DbStop[];
}

export type DbTimetableResult =
  | { state: "ok"; timetable: DbTimetable; fetchedAt: string; changesAvailable?: boolean }
  | { state: "error"; reason: DbErrorReason };

export type DbStationsResult =
  | { state: "ok"; stations: DbStation[]; fetchedAt: string }
  | { state: "error"; reason: DbErrorReason };

const hhmmNow = (): string => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// ---------- XML helpers (IRIS-specific) ----------

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}

function attrMap(fragment: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([A-Za-z][\w-]*)\s*=\s*(["'])(.*?)\2/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fragment))) out[m[1]] = decodeEntities(m[3]);
  return out;
}

/** "2610011634" (YYMMDDHHmm) → "2026-10-01T16:34" (wall clock). */
export function dbWallTime(raw?: string): string | undefined {
  if (!raw || !/^\d{10}$/.test(raw)) return undefined;
  const yy = raw.slice(0, 2);
  const mo = raw.slice(2, 4);
  const dd = raw.slice(4, 6);
  const hh = raw.slice(6, 8);
  const mi = raw.slice(8, 10);
  if (Number(mo) < 1 || Number(mo) > 12 || Number(dd) < 1 || Number(dd) > 31) return undefined;
  if (Number(hh) > 23 || Number(mi) > 59) return undefined;
  return `20${yy}-${mo}-${dd}T${hh}:${mi}`;
}

function delayMinutes(planned?: string, changed?: string): number | undefined {
  if (!planned || !changed) return undefined;
  const p = Date.parse(planned);
  const c = Date.parse(changed);
  if (!Number.isFinite(p) || !Number.isFinite(c)) return undefined;
  return Math.round((c - p) / 60000);
}

function timeFrom(attrs: Record<string, string>): DbTime | undefined {
  const planned = dbWallTime(attrs.pt);
  const changed = dbWallTime(attrs.ct);
  const path = (attrs.cpth || attrs.ppth || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const time: DbTime = {};
  if (planned) time.planned = planned;
  if (changed) time.changed = changed;
  const delay = delayMinutes(planned, changed);
  if (delay != null) time.delayMinutes = delay;
  if (attrs.pp) time.platform = attrs.pp;
  if (attrs.cp) time.changedPlatform = attrs.cp;
  if (path.length) time.path = path;
  return planned || changed || time.platform || time.changedPlatform ? time : undefined;
}

/** Parse a <timetable> document (plan or fchg shape). */
export function parseDbTimetableXml(xml: string): DbTimetable {
  const result: DbTimetable = { stops: [] };
  if (!xml.includes("<timetable")) return result;

  const selfClosing = xml.match(/<timetable\b[^>]*\/>/);
  const root = xml.match(/<timetable\b([^>]*)>([\s\S]*?)<\/timetable>/);
  if (!root) {
    if (selfClosing) {
      // Honest empty slice (e.g. "<timetable station='…'/>") — keep
      // the station label when the feed sent one.
      const a = attrMap(selfClosing[0]);
      result.station = a.station || undefined;
      result.eva = a.eva || undefined;
      return result;
    }
    return result;
  }
  const rootAttrs = attrMap(root[1]);
  result.station = rootAttrs.station || undefined;
  result.eva = rootAttrs.eva || undefined;

  const stopRe = /<s\b([^>]*)>([\s\S]*?)<\/s>/g;
  let sm: RegExpExecArray | null;
  while ((sm = stopRe.exec(root[2]))) {
    const stopAttrs = attrMap(sm[1]);
    const body = sm[2];
    const stop: DbStop = { id: stopAttrs.id || "" };

    const tl = body.match(/<tl\b([^>]*?)\/?>/);
    if (tl) {
      const a = attrMap(tl[1]);
      if (a.c) stop.category = a.c;
      if (a.n) stop.number = a.n;
      if (a.o) stop.origin = a.o;
    }
    const line =
      (body.match(/<dp\b([^>]*?)\/?>/) || body.match(/<ar\b([^>]*?)\/?>/)) || null;
    if (line) {
      const a = attrMap(line[1]);
      if (a.l) stop.line = a.l;
    }

    const ar = body.match(/<ar\b([^>]*?)\/?>/);
    if (ar) stop.arrival = timeFrom(attrMap(ar[1]));
    const dp = body.match(/<dp\b([^>]*?)\/?>/);
    if (dp) stop.departure = timeFrom(attrMap(dp[1]));

    const noteRe = /<m\b([^>]*?)(?:\/>|>([\s\S]*?)<\/m>)/g;
    let nm: RegExpExecArray | null;
    const notes: DbNote[] = [];
    while ((nm = noteRe.exec(body))) {
      const a = attrMap(nm[1]);
      const note: DbNote = {};
      if (a.cat) note.category = a.cat;
      if (a.from) note.validFrom = a.from;
      if (a.to) note.validTo = a.to;
      if (a.ts || a["ts-tts"]) note.since = a["ts-tts"] || a.ts;
      if (a.pr) note.priority = a.pr;
      if (note.category || note.validFrom || note.since) notes.push(note);
    }
    if (notes.length) stop.notes = notes;

    if (stop.id || stop.arrival || stop.departure) result.stops.push(stop);
  }
  return result;
}

/** Parse the <stations> search document. */
export function parseDbStationsXml(xml: string): DbStation[] {
  const out: DbStation[] = [];
  const re = /<station\b([^>]*?)\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const a = attrMap(m[1]);
    if (a.eva && a.name) out.push({ name: a.name, eva: a.eva, ds100: a.ds100 || undefined });
  }
  return out;
}

/**
 * Merge the live changes feed into a planned slice, matched by the
 * stop id (the IRIS trip-stop key). Enriched plan stops gain
 * changed time/platform/delay/notes; change-only ids are added and
 * marked `onlyInChanges` (they exist only in the live feed).
 */
export function mergeDbChanges(plan: DbTimetable, changes: DbTimetable): DbStop[] {
  const byId = new Map<string, DbStop>();
  for (const stop of plan.stops) byId.set(stop.id, { ...stop });

  for (const ch of changes.stops) {
    const target = byId.get(ch.id);
    if (!target) {
      byId.set(ch.id, { ...ch, onlyInChanges: true });
      continue;
    }
    const apply = (key: "arrival" | "departure") => {
      const c = ch[key];
      if (!c) return;
      const base = target[key] || {};
      const planned = base.planned || c.planned;
      const changed = c.changed || base.changed;
      const merged: DbTime = { ...base, ...c };
      if (planned) merged.planned = planned;
      if (changed) merged.changed = changed;
      const delay = delayMinutes(planned, changed);
      if (delay != null) merged.delayMinutes = delay;
      target[key] = merged;
    };
    apply("arrival");
    apply("departure");
    if (ch.notes?.length) target.notes = [...(target.notes || []), ...ch.notes];
    if (ch.line && !target.line) target.line = ch.line;
  }
  return [...byId.values()];
}

// ---------- fetch layer ----------

async function dbGet(path: string): Promise<{ ok: true; text: string } | { ok: false; reason: DbErrorReason }> {
  try {
    const res = await fetch(`/api/db/${path}`, { cache: "no-store" });
    if (res.status === 200) return { ok: true, text: await res.text() };
    if (res.status === 400) return { ok: false, reason: "bad-request" };
    if (res.status === 404) return { ok: false, reason: "no-data" };
    if (res.status === 503) return { ok: false, reason: "not-configured" };
    return { ok: false, reason: "unavailable" };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

/** Planned timetable slice for one station/hour (date: YYMMDD, hour: 00-23). */
export async function fetchDbPlan(
  eva: string,
  date: string,
  hour: string
): Promise<DbTimetableResult> {
  const got = await dbGet(`plan?eva=${encodeURIComponent(eva)}&date=${encodeURIComponent(date)}&hour=${encodeURIComponent(hour)}`);
  if (!got.ok) return { state: "error", reason: got.reason };
  return {
    state: "ok",
    timetable: parseDbTimetableXml(got.text),
    fetchedAt: hhmmNow(),
  };
}

/** All changes known for a station today (delays, platforms, disruptions). */
export async function fetchDbChanges(eva: string): Promise<DbTimetableResult> {
  const got = await dbGet(`fchg?eva=${encodeURIComponent(eva)}`);
  if (!got.ok) return { state: "error", reason: got.reason };
  return {
    state: "ok",
    timetable: parseDbTimetableXml(got.text),
    fetchedAt: hhmmNow(),
  };
}

/** Station lookup by name/eva/ds100 prefix. */
export async function searchDbStations(q: string): Promise<DbStationsResult> {
  const got = await dbGet(`station?q=${encodeURIComponent(q)}`);
  if (!got.ok) return { state: "error", reason: got.reason };
  return { state: "ok", stations: parseDbStationsXml(got.text), fetchedAt: hhmmNow() };
}

/**
 * Departures for one station/hour: planned slice + today's known
 * changes merged. The changes feed is an optional enrichment — when
 * it fails, the plan still renders with `changesAvailable: false`
 * (honest: no delay claims without the live feed).
 */
export async function fetchDbDepartures(
  eva: string,
  date: string,
  hour: string
): Promise<DbTimetableResult> {
  const plan = await fetchDbPlan(eva, date, hour);
  if (plan.state !== "ok") return plan;
  const changes = await fetchDbChanges(eva);
  if (changes.state !== "ok") {
    return { ...plan, changesAvailable: false };
  }
  return {
    state: "ok",
    timetable: {
      station: plan.timetable.station,
      eva: plan.timetable.eva,
      stops: mergeDbChanges(plan.timetable, changes.timetable),
    },
    fetchedAt: plan.fetchedAt,
    changesAvailable: true,
  };
}

// ---------- two-hour live board ----------

export interface DbBoardRow {
  id: string;
  kind: "departure" | "arrival";
  /** Effective station-local time (changed when the feed changed it). */
  time: string;
  /** Planned (Soll) time, kept when it differs from the effective one. */
  planned?: string;
  /** changed − planned, whole minutes; only when the feed sent both. */
  delayMinutes?: number;
  platform?: string;
  changedPlatform?: string;
  /** Feed attributes only: "ICE 373", "S8", … */
  train: string;
  /** Terminating stop (departure) / origin stop (arrival) from the path. */
  direction?: string;
}

export interface DbBoard {
  /** Station name exactly as the feed labels it. */
  station: string;
  /** "14:00–15:59" — the window actually queried (Europe/Berlin). */
  windowLabel: string;
  departures: DbBoardRow[];
  arrivals: DbBoardRow[];
  changesAvailable: boolean;
  fetchedAt: string;
}

export type DbBoardResult =
  | { state: "ok"; board: DbBoard }
  | { state: "error"; reason: DbErrorReason };

interface BerlinClock {
  yy: string;
  mo: string;
  dd: string;
  hh: string;
}

/** Wall-clock parts in Europe/Berlin — IRIS times are German local time. */
function berlinClock(at: Date): BerlinClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const get = (type: string): string =>
    parts.find((p) => p.type === type)?.value ?? "00";
  const hh = get("hour");
  return {
    yy: get("year"),
    mo: get("month"),
    dd: get("day"),
    hh: hh === "24" ? "00" : hh,
  };
}

function boardRow(stop: DbStop, kind: "departure" | "arrival"): DbBoardRow | null {
  const t = kind === "departure" ? stop.departure : stop.arrival;
  if (!t) return null;
  const time = t.changed || t.planned;
  if (!time) return null;
  const train =
    stop.line || [stop.category, stop.number].filter(Boolean).join(" ");
  const path = t.path;
  const direction = path?.length
    ? kind === "departure"
      ? path[path.length - 1]
      : path[0]
    : undefined;
  return {
    id: stop.id,
    kind,
    time,
    planned: t.planned,
    delayMinutes: t.delayMinutes,
    platform: t.platform,
    changedPlatform: t.changedPlatform,
    train,
    direction,
  };
}

/**
 * Live board for the current and next hour at one station: both plan
 * slices fetched in parallel, today's changes merged once (by stop
 * id), rows filtered to the window actually queried. The window and
 * all times are German wall clocks — the browser's timezone never
 * enters the calculation. Missing changes feed ⇒ planned times only
 * (`changesAvailable: false`), never a guessed delay.
 */
export async function fetchDbBoard(eva: string): Promise<DbBoardResult> {
  const now = new Date();
  const a = berlinClock(now);
  const b = berlinClock(new Date(now.getTime() + 3600_000));
  const winStart = `20${a.yy}-${a.mo}-${a.dd}T${a.hh}:00`;
  const winEnd = `20${b.yy}-${b.mo}-${b.dd}T${b.hh}:00`;
  const windowLabel = `${a.hh}:00–${b.hh}:59`;

  const [planA, planB, changes] = await Promise.all([
    fetchDbPlan(eva, `${a.yy}${a.mo}${a.dd}`, a.hh),
    fetchDbPlan(eva, `${b.yy}${b.mo}${b.dd}`, b.hh),
    fetchDbChanges(eva),
  ]);
  if (planA.state !== "ok") return { state: "error", reason: planA.reason };
  // A missing next slice is an honest empty hour; any other failure
  // would silently shrink the window, so it fails the board instead.
  if (planB.state !== "ok" && planB.reason !== "no-data") {
    return { state: "error", reason: planB.reason };
  }

  let changesTimetable: DbTimetable | null = null;
  if (changes.state === "ok") changesTimetable = changes.timetable;
  const merge = (plan: DbTimetable): DbStop[] =>
    changesTimetable ? mergeDbChanges(plan, changesTimetable) : plan.stops;

  const stops = new Map<string, DbStop>();
  for (const stop of merge(planA.timetable)) stops.set(stop.id, stop);
  if (planB.state === "ok") {
    for (const stop of merge(planB.timetable)) {
      if (!stops.has(stop.id)) stops.set(stop.id, stop);
    }
  }

  const departures: DbBoardRow[] = [];
  const arrivals: DbBoardRow[] = [];
  for (const stop of stops.values()) {
    const dep = boardRow(stop, "departure");
    if (dep && dep.time >= winStart && dep.time < winEnd) departures.push(dep);
    const arr = boardRow(stop, "arrival");
    if (arr && arr.time >= winStart && arr.time < winEnd) arrivals.push(arr);
  }
  const byTime = (x: DbBoardRow, y: DbBoardRow) =>
    x.time < y.time ? -1 : x.time > y.time ? 1 : 0;
  departures.sort(byTime);
  arrivals.sort(byTime);

  const station =
    planA.timetable.station ||
    (planB.state === "ok" ? planB.timetable.station : undefined) ||
    (changesTimetable?.station ?? undefined) ||
    eva;

  return {
    state: "ok",
    board: {
      station,
      windowLabel,
      departures,
      arrivals,
      changesAvailable: changesTimetable !== null,
      fetchedAt: planA.fetchedAt,
    },
  };
}
