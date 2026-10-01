// ============================================================
// AllinOne Travel — GeoDB city autocomplete (RapidAPI GeoDB).
//
// Runs alongside the OSM Nominatim provider for the curated-town
// miss branch: same trigger (<3 matches), results merged after
// OSM with data-source="geodb" and a GeoDB badge. Keys are
// `geodb-<name>|<CC>` (rememberOsmPlace strips the prefix).
// ============================================================

import type { PlaceMatch } from "./places";
import { rapidConfigured, rapidJson } from "./rapid";

export function geodbConfigured(): boolean {
  return rapidConfigured("geodb");
}

function flagOf(cc: string): string {
  return cc
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

function escapeGql(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

interface GeoDbNode {
  id?: number | string;
  name?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
  country?: { code?: string; name?: string };
}

/** Up to `limit` city matches for a query (≥3 chars). Returns []
 *  on any failure — the caller just shows the OSM-only results. */
export async function geocodeGeoDb(query: string, limit = 4): Promise<PlaceMatch[]> {
  const q = query.trim();
  if (q.length < 3 || !geodbConfigured()) return [];
  try {
    const gql = `{ populatedPlaces(namePrefix: "${escapeGql(q)}", first: 15, minPopulation: 25000) { edges { node { id name latitude longitude population country { code name } } } } }`;
    const json = await rapidJson<{
      data?: { populatedPlaces?: { edges?: { node?: GeoDbNode }[] } };
    }>("geodb", "/", { method: "POST", body: { query: gql }, timeoutMs: 8000 });
    const edges = json?.data?.populatedPlaces?.edges;
    if (!Array.isArray(edges)) return [];

    const ql = q.toLowerCase();
    const rows: PlaceMatch[] = [];
    const seen = new Set<string>();
    for (const e of edges) {
      const n = e?.node;
      if (!n || typeof n.name !== "string" || !n.name.trim()) continue;
      const cc = String(n.country?.code ?? "").toUpperCase();
      if (!/^[A-Z]{2}$/.test(cc)) continue;
      const lat = Number(n.latitude);
      const lng = Number(n.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const dedupeKey = `${n.name.toLowerCase()}|${cc}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      rows.push({
        key: `geodb-${n.name.trim()}|${cc}`,
        city: n.name.trim(),
        cc,
        country: String(n.country?.name ?? ""),
        flag: flagOf(cc),
        terminals: [],
        iatas: [],
        railNames: [],
        busNames: [],
        seaNames: [],
        lat,
        lng,
        // Population doubles as the tie-break score for the UI sort.
        score: Number(n.population) || 0,
      });
    }
    // Exact > prefix > other; biggest city first inside each band.
    rows.sort((a, b) => {
      const rank = (name: string): number => {
        const l = name.toLowerCase();
        if (l === ql) return 2;
        if (l.startsWith(ql)) return 1;
        return 0;
      };
      const d = rank(b.city) - rank(a.city);
      if (d !== 0) return d;
      return b.score - a.score;
    });
    return rows.slice(0, limit);
  } catch {
    return [];
  }
}
