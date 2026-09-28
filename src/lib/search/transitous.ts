// ============================================================
// AllinOne Travel — live rail/bus schedules (Transitous MOTIS API).
//
// The original plan (hafas-client / transport.rest) is unavailable:
// the public transport.rest HAFAS instances answer 503/timeout at the
// time of writing, so schedules come from Transitous — a community
// open-data routing service (open GTFS feeds, FOSS MOTIS engine).
// https://api.transitous.org sends `Access-Control-Allow-Origin: *`,
// so the renderer fetches it directly (no proxy needed).
//
// Honesty (REBUILD §5): times render through ResultRowView with
// scheduleConfirmed=true only when a live response was received this
// session. Any failure, empty result, cancelled leg, or out-of-
// timetable date => zero rows (the curated panel explains itself).
// ============================================================

const API = "https://api.transitous.org/api/v1/plan";

export type JourneyFilter = "rail" | "bus";

export interface LiveJourney {
  /** First vehicle departure, origin-local "HH:MM" (live). */
  departAt: string;
  /** Last vehicle arrival, local "HH:MM" (live). */
  arriveAt: string;
  durationMin: number;
  transfers: number;
  /** Vehicle display names along the trip, in order, deduped. */
  legNames: string[];
  /** True when every leg carries a real-time feed. */
  allRealtime: boolean;
}

export type LiveJourneysResult =
  | { state: "ok"; journeys: LiveJourney[]; fetchedAt: string }
  | { state: "error"; reason: string };

interface TzPlace {
  name?: string;
  tz?: string;
}

interface MotisLeg {
  mode?: string;
  displayName?: string;
  routeShortName?: string;
  startTime?: string;
  endTime?: string;
  scheduledStartTime?: string;
  realTime?: boolean;
  cancelled?: boolean;
  from?: TzPlace;
  to?: TzPlace;
}

interface MotisItinerary {
  duration?: number;
  startTime?: string;
  endTime?: string;
  transfers?: number;
  legs?: MotisLeg[];
}

const NON_TRANSIT = new Set(["WALK", "BIKE", "CAR", "VEHICLE", "RENTAL", "OTP"]);

function isTransit(leg: MotisLeg): boolean {
  return Boolean(leg.mode) && !NON_TRANSIT.has(leg.mode!);
}

function matchesFilter(leg: MotisLeg, filter: JourneyFilter): boolean {
  const m = leg.mode ?? "";
  if (filter === "rail") return m.includes("RAIL") || m === "TRAIN";
  return m === "BUS" || m === "COACH";
}

function localHhmm(iso: string | undefined, tz?: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz || undefined,
    }).format(new Date(iso));
  } catch {
    return iso.slice(11, 16);
  }
}

function nowHhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

// Identical queries (rail + bus panels on one page) share one request.
const CACHE = new Map<string, { at: number; result: LiveJourneysResult }>();
const CACHE_TTL_MS = 60_000;

/** Fetch live journeys for a city pair. Never throws. */
export async function fetchLiveJourneys(q: {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  /** YYYY-MM-DD — journeys from the start of that day (UTC). */
  date?: string;
  filter: JourneyFilter;
}): Promise<LiveJourneysResult> {
  const cacheKey = `${q.fromLat},${q.fromLng}|${q.toLat},${q.toLng}|${q.date}|${q.filter}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.result;

  const params = new URLSearchParams({
    fromPlace: `${q.fromLat},${q.fromLng}`,
    toPlace: `${q.toLat},${q.toLng}`,
    numItineraries: "6",
  });
  if (q.date) params.set("time", `${q.date}T00:00:00.000Z`);

  let result: LiveJourneysResult;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(`${API}?${params}`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) result = { state: "error", reason: `http-${res.status}` };
    else {
      const json = (await res.json()) as { itineraries?: MotisItinerary[] };
      const list = Array.isArray(json.itineraries) ? json.itineraries : [];
      const journeys: LiveJourney[] = [];

      for (const it of list) {
        const legs = (it.legs ?? []).filter(isTransit);
        if (legs.length === 0) continue;
        // A cancelled leg means the trip as shown is not running.
        if ((it.legs ?? []).some((l) => l.cancelled)) continue;
        if (!legs.some((l) => matchesFilter(l, q.filter))) continue;

        const first = legs[0];
        const last = legs[legs.length - 1];
        const tz = first.from?.tz || first.to?.tz;
        const legNames: string[] = [];
        for (const l of legs) {
          const name = l.displayName || l.routeShortName || l.mode || "";
          if (name && legNames[legNames.length - 1] !== name) legNames.push(name);
        }
        const durationSec = Number(it.duration) || 0;
        const transfers =
          typeof it.transfers === "number"
            ? it.transfers
            : Math.max(0, legs.length - 1);

        journeys.push({
          departAt: localHhmm(first.scheduledStartTime || first.startTime, tz),
          arriveAt: localHhmm(last.endTime, tz),
          durationMin: Math.max(1, Math.round(durationSec / 60)),
          transfers,
          legNames,
          allRealtime: legs.every((l) => l.realTime === true),
        });
        if (journeys.length >= 3) break;
      }

      result = { state: "ok", journeys, fetchedAt: nowHhmm() };
    }
  } catch {
    result = { state: "error", reason: "network" };
  }

  CACHE.set(cacheKey, { at: Date.now(), result });
  return result;
}
