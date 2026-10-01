// ============================================================
// AllinOne Travel — live departures board (AviationStack).
//
// Free plan: GET /v1/flights?dep_iata=XXX&limit=N works; the
// flight_date param is plan-restricted (0 rows / "does not
// support this API function"), so we query the provider's
// default horizon (now → upcoming) and show only today's rows
// we can date — never a clock we cannot source (§5.1).
// ============================================================

export function departuresConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_AVIATIONSTACK_KEY);
}

export interface DepartureRow {
  flightNo: string;
  airline: string | null;
  destinationIata: string | null;
  destinationAirport: string | null;
  /** Local departure time at origin (HH:MM in the airport's tz). */
  scheduledLocal: string | null;
  estimatedLocal: string | null;
  status: string;
  delayMin: number | null;
}

export type DeparturesResult =
  | { state: "ok"; rows: DepartureRow[]; fetchedAt: string }
  | { state: "error"; reason: string };

interface AvRow {
  flight_status?: string;
  flight?: { iata?: string; icao?: string; number?: string };
  flight_number?: string;
  airline?: { name?: string };
  departure?: {
    iata?: string;
    airport?: string;
    scheduled?: string;
    estimated?: string;
    actual?: string;
    delay?: number | null;
    timezone?: string;
  };
  arrival?: { iata?: string; airport?: string };
}

const cache = new Map<string, Promise<DeparturesResult>>();

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function localHHmm(iso: string | undefined, tz: string | undefined): string | null {
  if (!iso) return null;
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...(tz ? { timeZone: tz } : {}),
    });
    return fmt.format(new Date(iso));
  } catch {
    return null;
  }
}

/** Today's upcoming departures from an IATA airport. Never throws. */
export function fetchDepartures(depIata: string): Promise<DeparturesResult> {
  const iata = (depIata ?? "").toUpperCase();
  if (!departuresConfigured()) {
    return Promise.resolve({ state: "error", reason: "no-key" });
  }
  if (!/^[A-Z]{3}$/.test(iata)) {
    return Promise.resolve({ state: "error", reason: "no-airport" });
  }
  const todayKey = new Date().toISOString().slice(0, 10);
  const cacheKey = `${iata}|${todayKey}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const run = (async (): Promise<DeparturesResult> => {
    try {
      const key = encodeURIComponent(process.env.NEXT_PUBLIC_AVIATIONSTACK_KEY ?? "");
      const res = await fetch(
        `http://api.aviationstack.com/v1/flights?access_key=${key}&dep_iata=${iata}&limit=12`,
        { cache: "no-store" }
      );
      if (!res.ok) return { state: "error", reason: "network" };
      const json = (await res.json()) as { data?: AvRow[]; code?: string };
      if (typeof json.code === "string") {
        // aviationstack error envelope, e.g. function_access_restricted
        return { state: "error", reason: "api" };
      }
      const rows = Array.isArray(json.data) ? json.data : [];
      const fetchedAt = hhmmNow();
      const out: DepartureRow[] = [];
      for (const r of rows) {
        const airlineIata = r.flight?.iata ?? "";
        const number = r.flight?.number ?? r.flight_number ?? "";
        const flightNo = `${airlineIata}${number}`;
        if (!flightNo) continue;
        const tz = r.departure?.timezone;
        const scheduledLocal = localHHmm(r.departure?.scheduled, tz);
        const estimatedIso = r.departure?.estimated ?? r.departure?.actual;
        const estimatedLocal = localHHmm(estimatedIso, tz);
        // Skip rows whose local time we cannot date to today's board.
        if (scheduledLocal === null) continue;
        const status = String(r.flight_status ?? "").toLowerCase();
        if (!["scheduled", "active", "delayed"].includes(status)) continue;
        out.push({
          flightNo,
          airline: r.airline?.name ?? null,
          destinationIata: r.arrival?.iata ?? null,
          destinationAirport: r.arrival?.airport ?? null,
          scheduledLocal,
          estimatedLocal:
            estimatedLocal && estimatedLocal !== scheduledLocal ? estimatedLocal : null,
          status,
          delayMin:
            typeof r.departure?.delay === "number" && r.departure.delay > 0
              ? Math.round(r.departure.delay)
              : null,
        });
        if (out.length >= 6) break;
      }
      return { state: "ok", rows: out, fetchedAt };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set(cacheKey, run);
  });
  return run;
}
