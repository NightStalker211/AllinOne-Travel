// ============================================================
// AllinOne Travel — driving route with provider chain.
//
// One route per search (city point to city point): OSRM public
// demo first (keyless), then GraphHopper (keyed), then
// OpenRouteService (keyed) if the previous did not answer. The
// result carries `source` so the card can attribute the numbers
// to whichever router answered (§5.1.4); on total failure the
// caller renders nothing. Never mixed into curated rows.
// ============================================================

export interface DriveRoute {
  km: number;
  minutes: number;
  /** HH:MM when the route was fetched this session. */
  fetchedAt: string;
  /** Router that produced the route. */
  source: "OSRM" | "GraphHopper" | "OpenRouteService";
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
// the same promise (public demos must not be hammered).
const cache = new Map<string, Promise<DriveResult>>();

async function getJson(url: string, init?: RequestInit, timeoutMs = 8000): Promise<unknown | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function viaOsrm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<DriveResult> {
  const json = (await getJson(
    `${OSRM}/${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(
      6
    )},${to.lat.toFixed(6)}?overview=false&alternatives=false&steps=false`
  )) as { code?: string; routes?: { distance?: number; duration?: number }[] } | null;
  const best = json?.routes?.[0];
  if (!json || json.code !== "Ok" || !best?.distance || !best?.duration) {
    return { state: "error", reason: "osrm" };
  }
  return {
    state: "ok",
    route: {
      km: best.distance / 1000,
      minutes: Math.round(best.duration / 60),
      fetchedAt: nowHhmm(),
      source: "OSRM",
    },
  };
}

async function viaGraphHopper(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<DriveResult> {
  const key = process.env.NEXT_PUBLIC_GRAPHHOPPER_KEY;
  if (!key) return { state: "error", reason: "gh-no-key" };
  const params = new URLSearchParams();
  params.append("point", `${from.lat},${from.lng}`);
  params.append("point", `${to.lat},${to.lng}`);
  params.set("vehicle", "car");
  params.set("locale", "en");
  params.set("key", key);
  params.set("points_encoded", "false");
  const json = (await getJson(
    `https://graphhopper.com/api/1/route?${params}`
  )) as { paths?: { distance?: number; time?: number }[] } | null;
  const best = json?.paths?.[0];
  if (!best?.distance || !best?.time) return { state: "error", reason: "gh" };
  return {
    state: "ok",
    route: {
      km: best.distance / 1000,
      minutes: Math.round(best.time / 60),
      fetchedAt: nowHhmm(),
      source: "GraphHopper",
    },
  };
}

async function viaOpenRouteService(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<DriveResult> {
  const key = process.env.NEXT_PUBLIC_OPENROUTESERVICE_KEY;
  if (!key) return { state: "error", reason: "ors-no-key" };
  const json = (await getJson(
    `https://api.openrouteservice.org/v2/directions/driving-car?start=${from.lng},${from.lat}&end=${to.lng},${to.lat}`,
    // ORS answers 406 for Accept: application/json — geo+json is its format.
    { headers: { Authorization: key, Accept: "application/geo+json" } }
  )) as {
    features?: { properties?: { segments?: { distance?: number; duration?: number }[] } }[];
  } | null;
  const seg = json?.features?.[0]?.properties?.segments?.[0];
  if (!seg?.distance || !seg?.duration) return { state: "error", reason: "ors" };
  return {
    state: "ok",
    route: {
      km: seg.distance / 1000,
      minutes: Math.round(seg.duration / 60),
      fetchedAt: nowHhmm(),
      source: "OpenRouteService",
    },
  };
}

/** Driving route between two points: OSRM → GraphHopper → ORS.
 *  Never throws. */
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
    const a = { lat: flat as number, lng: flng as number };
    const b = { lat: tlat as number, lng: tlng as number };
    const osrm = await viaOsrm(a, b);
    if (osrm.state === "ok") return osrm;
    const gh = await viaGraphHopper(a, b);
    if (gh.state === "ok") return gh;
    const ors = await viaOpenRouteService(a, b);
    if (ors.state === "ok") return ors;
    // Every configured router failed — report the keyless one's reason.
    return { state: "error", reason: "no-route" };
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set(key, run);
  });
  return run;
}
