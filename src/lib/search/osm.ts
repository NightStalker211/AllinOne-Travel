// ============================================================
// AllinOne Travel — OSM geocoding (Nominatim) + session registry.
//
// The curated 4,006-record index covers known cities; Nominatim adds
// free live geocoding for everything else (REBUILD §8 addendum):
// when the local autocomplete finds few matches, the field queries
// nominatim.openstreetmap.org (CORS-enabled, no key) and offers those
// picks marked "OSM". A selected OSM place is remembered (session map
// + localStorage) so the engine can resolve it on /search and later
// reloads — with honest empty states where curated data is absent.
// ============================================================

import type { CityPlace } from "@/lib/types/search";
import type { PlaceMatch } from "./places";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const LS_KEY = "ait-osm-places";

function flagOf(cc: string): string {
  if (!/^[A-Za-z]{2}$/.test(cc)) return "";
  return String.fromCodePoint(
    ...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

interface NominatimRow {
  lat?: string;
  lon?: string;
  name?: string;
  display_name?: string;
  category?: string;
  addresstype?: string;
  address?: Record<string, string>;
}

function toPlaceMatch(r: NominatimRow): PlaceMatch | null {
  // Settlements only — waterfalls/POIs named like towns must not enter
  // the place index.
  if (r.category && r.category !== "place" && r.category !== "boundary") {
    return null;
  }
  const cc = (r.address?.country_code ?? "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return null;
  const city =
    r.address?.city ||
    r.address?.town ||
    r.address?.village ||
    r.address?.municipality ||
    r.address?.county ||
    r.name ||
    (r.display_name ?? "").split(",")[0].trim();
  if (!city) return null;
  const lat = Number(r.lat);
  const lng = Number(r.lon);
  return {
    key: `osm-${city}|${cc}`,
    city,
    cc,
    country: r.address?.country ?? "",
    flag: flagOf(cc),
    terminals: [],
    iatas: [],
    railNames: [],
    busNames: [],
    seaNames: [],
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    score: 5,
  };
}

/** Live geocode via Nominatim. Never throws; [] on any failure. */
export async function geocodeOsm(query: string, limit = 4): Promise<PlaceMatch[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(
      `${NOMINATIM}?${new URLSearchParams({
        format: "jsonv2",
        // Without this the response omits `address` entirely — and with
        // it no country_code, which every match needs.
        addressdetails: "1",
        limit: String(limit),
        q,
      })}`,
      { signal: ctrl.signal, headers: { Accept: "application/json" } }
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const rows = (await res.json()) as NominatimRow[];
    if (!Array.isArray(rows)) return [];
    return rows
      .map((r) => toPlaceMatch(r))
      .filter((m): m is PlaceMatch => m !== null);
  } catch {
    return [];
  }
}

// ---------- OSM place registry (engine fallback) ----------

const registry = new Map<string, CityPlace>();
let hydrated = false;

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return;
    const rows = JSON.parse(raw) as CityPlace[];
    if (Array.isArray(rows)) {
      for (const p of rows) {
        if (p && typeof p.key === "string") registry.set(p.key, p);
      }
    }
  } catch {
    /* corrupted storage — start empty */
  }
}

/** Remember a picked OSM/GeoDB place so getPlace() can resolve it later. */
export function rememberOsmPlace(place: CityPlace): void {
  hydrate();
  // Registry is keyed exactly like the curated index ("City|CC") so
  // getPlace() can fall back to it transparently — both provider
  // prefixes (osm-, geodb-) are stripped.
  const key = place.key.replace(/^(?:osm|geodb)-/, "");
  registry.set(key, { ...place, key });
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LS_KEY,
      JSON.stringify([...registry.values()].slice(-30))
    );
  } catch {
    /* storage full/blocked — session map still works */
  }
}

/** Session/OSM fallback for getPlace(); undefined when unknown. */
export function recallOsmPlace(key: string): CityPlace | undefined {
  hydrate();
  return registry.get(key);
}
