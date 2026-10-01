// ============================================================
// AllinOne Travel — nearby sights (Overpass / OpenStreetMap).
//
// Keyless POI lookup around the destination city point: named
// attractions, viewpoints, museums and monuments within 2.5 km.
// Public Overpass instances are rate-limited and often congested,
// so requests walk an instance chain (first answer wins) and
// results are cached for the session:
//   - CH destinations start with overpass.osm.ch (Swiss instance,
//     fast and reachable from here), then the general mirrors;
//   - everything else tries the general mirrors (mail.ru → kumi →
//     the official overpass-api.de / lz4 pair).
// A successful response with zero elements is a real answer ("no
// tagged sights nearby"); only a chain that exhausts every
// instance returns an error — the UI then states that nearby data
// is unavailable, never fake entries.
// ============================================================

export interface Sight {
  name: string;
  kind: string;
  lat: number | null;
  lng: number | null;
}

export type PoiResult =
  | { state: "ok"; total: number; sights: Sight[]; fetchedAt: string }
  | { state: "error"; reason: string };

// General mirrors; official overpass-api.de answers this network
// with 406 more often than not, so it rides at the back.
const GENERAL_INSTANCES = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
const CH_INSTANCE = "https://overpass.osm.ch/api/interpreter";

const RADIUS_M = 2500;
const MAX_SHOWN = 6;
const INSTANCE_TIMEOUT_MS = 20000;

// The honesty gate forbids currency-shaped strings outside live-price
// wrappers; a POI name must never trip it (e.g. a café called "€ Bar").
const CURRENCY_SHAPED =
  /[$€£¥]\s?\d|\d[\d.,]*\s?[$€£¥]|\b(?:USD|EUR|GBP|CHF|TRY|JPY|CAD|AUD)\s?\d/;

// Display order: headline sights first, niche tags after.
const KIND_ORDER = [
  "attraction",
  "castle",
  "viewpoint",
  "monument",
  "museum",
  "artwork",
  "ruins",
  "gallery",
];

function nowHhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

interface OsmElement {
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
}

function buildQuery(lat: number, lng: number): string {
  const around = `around:${RADIUS_M},${lat.toFixed(5)},${lng.toFixed(5)}`;
  return (
    `[out:json][timeout:20];` +
    `(` +
    `nw["tourism"~"^(attraction|viewpoint|museum|artwork|gallery|castle)$"](${around});` +
    `nw["historic"~"^(castle|ruins|monument)$"](${around});` +
    `);` +
    `out center tags;`
  );
}

function instancesFor(cc: string | null): string[] {
  return cc === "CH"
    ? [CH_INSTANCE, ...GENERAL_INSTANCES]
    : GENERAL_INSTANCES;
}

const cache = new Map<string, Promise<PoiResult>>();

/** Named sights around a point. Never throws. */
export function fetchNearbySights(
  lat: number | null,
  lng: number | null,
  cc: string | null = null
): Promise<PoiResult> {
  if (lat == null || lng == null) {
    return Promise.resolve({ state: "error", reason: "no-coords" });
  }
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const run = (async (): Promise<PoiResult> => {
    const query = buildQuery(lat, lng);
    for (const base of instancesFor(cc)) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), INSTANCE_TIMEOUT_MS);
        const res = await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ data: query }),
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) continue; // next instance
        const json = (await res.json()) as { elements?: OsmElement[] };
        const elements = json.elements ?? [];

        const seen = new Set<string>();
        const sights: Sight[] = [];
        for (const el of elements) {
          const name = el.tags?.name?.trim();
          if (!name || name.length > 80) continue;
          if (CURRENCY_SHAPED.test(name)) continue;
          const k = name.toLowerCase();
          if (seen.has(k)) continue;
          seen.add(k);
          const kind =
            el.tags?.tourism && KIND_ORDER.includes(el.tags.tourism)
              ? el.tags.tourism
              : el.tags?.historic && KIND_ORDER.includes(el.tags.historic)
                ? el.tags.historic
                : el.tags?.tourism || el.tags?.historic || "sight";
          const elat = el.lat ?? el.center?.lat ?? null;
          const elng = el.lon ?? el.center?.lon ?? null;
          sights.push({ name, kind, lat: elat, lng: elng });
        }
        sights.sort((a, b) => {
          const ka = KIND_ORDER.indexOf(a.kind);
          const kb = KIND_ORDER.indexOf(b.kind);
          return (
            (ka < 0 ? 99 : ka) - (kb < 0 ? 99 : kb) || a.name.localeCompare(b.name)
          );
        });
        return {
          state: "ok",
          total: sights.length,
          sights: sights.slice(0, MAX_SHOWN),
          fetchedAt: nowHhmm(),
        };
      } catch {
        // timeout / network / CORS — try the next instance
      }
    }
    return { state: "error", reason: "all-instances" };
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set(key, run);
  });
  return run;
}
