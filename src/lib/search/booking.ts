// ============================================================
// AllinOne Travel — live hotel rates (Booking.com via RapidAPI).
//
// searchHotelsByCoordinates returns booking's ranking around a
// point; we keep only rows within 60 km that carry a real gross
// amount for the searched stay, sorted nearest-first (§5.1: the
// figure is a live in-session quote rendered through PriceBadge
// with the "Live · Booking.com · HH:MM" badge; failure => no
// numbers at all).
// ============================================================

import { haversineKm } from "./model";
import { rapidConfigured, rapidJson } from "./rapid";

export interface LiveHotelOffer {
  hotelId: string;
  name: string;
  /** Guest review score (0–10), when Booking returns one. */
  score: number | null;
  reviews: number | null;
  /** Hotel class (stars), only when numeric 1–5. */
  stars: number | null;
  lat: number;
  lng: number;
  distanceKm: number;
  /** Gross amount for the whole stay, exactly as returned. */
  price: { value: number; currency: string };
  freeCancellation: boolean;
}

export type HotelsResult =
  | { state: "ok"; offers: LiveHotelOffer[]; fetchedAt: string }
  | { state: "error"; reason: string };

export interface HotelQuery {
  lat: number;
  lng: number;
  /** Destination country ISO-2 (Booking's `location` param). */
  cc: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  currency: string;
}

export function hotelsConfigured(): boolean {
  return rapidConfigured("booking");
}

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

/** Booking answers with its own relevance ranking — far-away towns
 *  rank high — so everything past this radius is dropped and the
 *  rest shown nearest-first with the distance on each row. */
const MAX_DISTANCE_KM = 60;

const cache = new Map<string, Promise<HotelsResult>>();

interface BookingRow {
  hotel_id?: number | string;
  id?: string;
  hotel_name?: string;
  latitude?: number | string;
  longitude?: number | string;
  review_score?: number;
  review_nr?: number;
  class?: number | string;
  is_free_cancellable?: number | boolean;
  composite_price_breakdown?: {
    gross_amount?: { value?: number; currency?: string };
  };
}

/** Live hotel rates near a point. Never throws. */
export function searchLiveHotels(q: HotelQuery): Promise<HotelsResult> {
  if (!hotelsConfigured()) {
    return Promise.resolve({ state: "error", reason: "no-key" });
  }
  if (!q.checkIn || !q.checkOut) {
    return Promise.resolve({ state: "error", reason: "no-date" });
  }
  // Booking rejects same-day stays outright (status:false) — refuse
  // honestly instead of relaying its generic error.
  if (q.checkOut <= q.checkIn) {
    return Promise.resolve({ state: "error", reason: "same-day" });
  }
  if (!/^[A-Za-z]{2}$/.test(q.cc) || !Number.isFinite(q.lat) || !Number.isFinite(q.lng)) {
    return Promise.resolve({ state: "error", reason: "bad-query" });
  }

  const cacheKey = [
    q.lat.toFixed(2),
    q.lng.toFixed(2),
    q.cc.toUpperCase(),
    q.checkIn,
    q.checkOut,
    q.adults,
    q.currency,
  ].join("|");
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const run = (async (): Promise<HotelsResult> => {
    try {
      const params = new URLSearchParams({
        latitude: String(q.lat),
        longitude: String(q.lng),
        arrival_date: q.checkIn,
        departure_date: q.checkOut,
        adults: String(Math.max(1, q.adults)),
        children_age: "0",
        room_qty: "1",
        units: "metric",
        page_number: "1",
        temperature_unit: "c",
        languagecode: "en-us",
        currency_code: (q.currency || "EUR").toUpperCase(),
        location: q.cc.toUpperCase(),
      });
      const json = await rapidJson<{ status?: boolean; data?: { result?: BookingRow[] } }>(
        "booking",
        `/api/v1/hotels/searchHotelsByCoordinates?${params}`
      );
      if (!json) return { state: "error", reason: "network" };
      if (json.status !== true) return { state: "error", reason: "api" };
      const rows = Array.isArray(json.data?.result) ? json.data.result : [];
      const fetchedAt = hhmmNow();

      const offers: LiveHotelOffer[] = [];
      for (const r of rows) {
        const gross = r.composite_price_breakdown?.gross_amount;
        if (!gross || typeof gross.value !== "number" || !(gross.value > 0)) continue;
        const lat = Number(r.latitude);
        const lng = Number(r.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
        const distanceKm = haversineKm({ lat: q.lat, lng: q.lng }, { lat, lng });
        if (distanceKm > MAX_DISTANCE_KM) continue;
        const name = String(r.hotel_name ?? "").trim();
        if (!name) continue;
        const rawClass = Number(r.class);
        const stars =
          Number.isFinite(rawClass) && rawClass >= 1 && rawClass <= 5
            ? Math.round(rawClass)
            : null;
        offers.push({
          hotelId: String(r.hotel_id ?? r.id ?? ""),
          name,
          score: typeof r.review_score === "number" ? r.review_score : null,
          reviews: typeof r.review_nr === "number" ? r.review_nr : null,
          stars,
          lat,
          lng,
          distanceKm,
          price: {
            value: gross.value,
            currency: String(gross.currency ?? q.currency ?? "EUR").toUpperCase(),
          },
          freeCancellation: Boolean(r.is_free_cancellable),
        });
      }
      offers.sort((a, b) => a.distanceKm - b.distanceKm);
      return { state: "ok", offers: offers.slice(0, 6), fetchedAt };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  cache.set(cacheKey, run);
  return run;
}
