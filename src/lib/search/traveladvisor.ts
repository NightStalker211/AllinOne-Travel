// ============================================================
// AllinOne Travel — live city attractions (Travel Advisor via
// RapidAPI apidojo). list-in-boundary returns curated sights with
// genuine ratings/reviews around a bbox (§5.3: ratings are live
// session data, dated, attributed; OSM's name-only results below
// stay curated-by-import and rating-free).
// ============================================================

import { rapidConfigured, rapidJson } from "./rapid";

export interface AttractionHit {
  name: string;
  rating: number | null;
  reviews: number | null;
  lat: number;
  lng: number;
  url: string | null;
}

export type AttractionsResult =
  | { state: "ok"; items: AttractionHit[]; fetchedAt: string }
  | { state: "error"; reason: string };

export function attractionsConfigured(): boolean {
  return rapidConfigured("travelAdvisor");
}

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

interface TaRow {
  name?: string;
  rating?: number | string;
  num_reviews?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  web_url?: string;
  url?: string;
}

const cache = new Map<string, Promise<AttractionsResult>>();

/** Sights within `radiusKm` of a point, nearest kept first by the
 *  provider's relevance order. Never throws. */
export function fetchCityAttractions(
  lat: number,
  lng: number,
  radiusKm = 2.5
): Promise<AttractionsResult> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return Promise.resolve({ state: "error", reason: "bad-query" });
  }
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)},${radiusKm}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const run = (async (): Promise<AttractionsResult> => {
    if (!attractionsConfigured()) return { state: "error", reason: "no-key" };
    try {
      const cos = Math.max(0.1, Math.cos((lat * Math.PI) / 180));
      const pad = 1.3;
      const dLat = ((radiusKm / 111.045) * pad).toFixed(4);
      const dLng = ((radiusKm / (111.045 * cos)) * pad).toFixed(4);
      const params = new URLSearchParams({
        bl_latitude: (lat - Number(dLat)).toFixed(4),
        tr_latitude: (lat + Number(dLat)).toFixed(4),
        bl_longitude: (lng - Number(dLng)).toFixed(4),
        tr_longitude: (lng + Number(dLng)).toFixed(4),
        limit: "24",
        currency: "EUR",
        language: "en_US",
      });
      const json = await rapidJson<{ data?: TaRow[] }>(
        "travelAdvisor",
        `/attractions/list-in-boundary?${params}`,
        { timeoutMs: 15000 }
      );
      if (!json) return { state: "error", reason: "network" };
      const rows = Array.isArray(json.data) ? json.data : [];
      if (rows.length === 0) return { state: "ok", items: [], fetchedAt: hhmmNow() };

      const items: AttractionHit[] = [];
      for (const r of rows) {
        if (typeof r.name !== "string" || !r.name.trim()) continue;
        const rLat = Number(r.latitude);
        const rLng = Number(r.longitude);
        if (!Number.isFinite(rLat) || !Number.isFinite(rLng)) continue;
        // Keep only sights genuinely inside the walk radius.
        const dLatM = (rLat - lat) * 111.045;
        const dLngM = (rLng - lng) * 111.045 * cos;
        if (Math.hypot(dLatM, dLngM) > radiusKm) continue;
        const rating = Number(r.rating);
        const reviews = Number(r.num_reviews);
        items.push({
          name: r.name.trim(),
          rating: Number.isFinite(rating) && rating > 0 ? rating : null,
          reviews: Number.isFinite(reviews) && reviews > 0 ? reviews : null,
          lat: rLat,
          lng: rLng,
          url:
            (typeof r.web_url === "string" && r.web_url) ||
            (typeof r.url === "string" && r.url) ||
            null,
        });
        if (items.length >= 4) break;
      }
      return { state: "ok", items, fetchedAt: hhmmNow() };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  cache.set(cacheKey, run);
  return run;
}
