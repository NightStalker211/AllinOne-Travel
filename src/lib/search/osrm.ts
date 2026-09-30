// ============================================================
// AllinOne Travel — driving route (OSRM public demo).
//
// Keyless, CORS-enabled open-source road routing. One route per
// search (city point to city point): real road distance and a
// driving duration straight from the router — labelled live with
// the fetch time, never mixed into curated rows. On any failure
// the caller simply renders nothing (REBUILD §5 spirit).
// ============================================================

export interface DriveRoute {
  km: number;
  minutes: number;
  /** HH:MM when the route was fetched this session. */
  fetchedAt: string;
}

export type DriveResult =
  | { state: "ok"; route: DriveRoute }
  | { state: "error"; reason: string };

const OSRM = "https://router.project-osrm.org/route/v1/driving";

function nowHhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

// Session cache — one route per coordinate pair, shared callers get
// the same promise (the public demo must not be hammered).
const cache = new Map<string, Promise<DriveResult>>();

/** Driving route between two points. Never throws. */
export function fetchDriveRoute(
  from: { lat: number | null; lng: number | null },
  to: { lat: number | null; lng: number | null }
): Promise<DriveResult> {
  const flat = from.lat;
  const flng = from.lng;
  const tlat = to.lat;
  const tlng = to.lng;
  if (flat == null || flng == null || tlat == null || tlng == null) {
    return Promise.resolve({ state: "error", reason: "no-coords" });
  }
  const key = `${flat.toFixed(3)},${flng.toFixed(3)}|${tlat.toFixed(
    3
  )},${tlng.toFixed(3)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const run = (async (): Promise<DriveResult> => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(
        `${OSRM}/${flng.toFixed(6)},${flat.toFixed(6)};${tlng.toFixed(
          6
        )},${tlat.toFixed(6)}?overview=false&alternatives=false&steps=false`,
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      if (!res.ok) return { state: "error", reason: `http-${res.status}` };
      const json = (await res.json()) as {
        code?: string;
        routes?: { distance?: number; duration?: number }[];
      };
      const best = json.routes?.[0];
      if (json.code !== "Ok" || !best?.distance || !best?.duration) {
        return { state: "error", reason: "no-route" };
      }
      return {
        state: "ok",
        route: {
          km: best.distance / 1000,
          minutes: Math.round(best.duration / 60),
          fetchedAt: nowHhmm(),
        },
      };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  cache.set(key, run);
  return run;
}
