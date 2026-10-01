// ============================================================
// AllinOne Travel — live hotel rates (Booking.com, Expedia
// fallback via RapidAPI — FEAT-8 chain).
//
// searchHotelsByCoordinates returns booking's ranking around a
// point; we keep only rows within 60 km that carry a real gross
// amount for the searched stay, sorted nearest-first (§5.1: the
// figure is a live in-session quote rendered through PriceBadge
// with the "Live · Booking.com · HH:MM" badge). When Booking
// errors or returns nothing, Expedia (city region around the
// same point) answers with its own price-basis wording and the
// "Live · Expedia" badge; failure on both => no numbers at all.
// ============================================================

import { haversineKm } from "./model";
import { expediaConfigured, fetchExpediaHotels } from "./expedia";
import { rapidConfigured, rapidJson } from "./rapid";

export interface LiveHotelOffer {
  hotelId: string;
  name: string;
  /** Guest review score (0–10), when the provider returns one. */
  score: number | null;
  reviews: number | null;
  /** Hotel class (stars), only when numeric 1–5. */
  stars: number | null;
  /** Booking rows carry coordinates; Expedia's list does not. */
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
  /** Gross amount for the searched stay, exactly as returned. */
  price: { value: number; currency: string };
  freeCancellation: boolean;
  /** Provider shown in the price badge ("Booking.com"/"Expedia"). */
  source: string;
  /** Provider's own price-basis wording, when it differs from the
   *  caller's stay label (Expedia: "for 1 night · 15 Oct - 16 Oct"). */
  stayContext?: string;
}

export type HotelsResult =
  | { state: "ok"; offers: LiveHotelOffer[]; fetchedAt: string; provider: string }
  | { state: "error"; reason: string; provider?: string };

export interface HotelQuery {
  /** Destination city name — Expedia's /suggest region lookup. */
  city: string;
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
  return rapidConfigured("booking") || expediaConfigured();
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

/** One Booking.com attempt (never throws). */
async function bookingSearch(q: HotelQuery): Promise<HotelsResult> {
  if (!rapidConfigured("booking")) {
    return { state: "error", reason: "no-key", provider: "Booking.com" };
  }
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
    let httpStatus = 0;
    const json = await rapidJson<{ status?: boolean; data?: { result?: BookingRow[] } }>(
      "booking",
      `/api/v1/hotels/searchHotelsByCoordinates?${params}`,
      { onStatus: (s) => { httpStatus = s; } }
    );
    // 429 = the plan's monthly request quota is spent — surface it
    // as an honest rate-limit state (distinct from an outage).
    if (httpStatus === 429) {
      return { state: "error", reason: "rate-limit", provider: "Booking.com" };
    }
    if (!json) return { state: "error", reason: "network", provider: "Booking.com" };
    if (json.status !== true) return { state: "error", reason: "api", provider: "Booking.com" };
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
        source: "Booking.com",
      });
    }
    offers.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    return { state: "ok", offers: offers.slice(0, 6), fetchedAt, provider: "Booking.com" };
  } catch {
    return { state: "error", reason: "network", provider: "Booking.com" };
  }
}

/** Live hotel rates near a point: Booking.com first, Expedia
 *  fallback. Never throws. */
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
    q.city,
    q.checkIn,
    q.checkOut,
    q.adults,
    q.currency,
  ].join("|");
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const run = (async (): Promise<HotelsResult> => {
    const booking = await bookingSearch(q);
    if (booking.state === "ok" && booking.offers.length > 0) return booking;

    // Booking errored or found nothing — ask Expedia around the
    // same point (city region + our coordinates).
    if (expediaConfigured()) {
      const expedia = await fetchExpediaHotels({
        city: q.city,
        lat: q.lat,
        lng: q.lng,
        checkIn: q.checkIn,
        checkOut: q.checkOut,
        adults: q.adults,
        currency: q.currency,
      });
      if (expedia.state === "ok" && expedia.offers.length > 0) {
        return { ...expedia, provider: "Expedia" };
      }
      if (booking.state === "ok") return booking;
      // Both failed: surface the last provider tried so the note
      // names who did not answer.
      return { ...booking, provider: "Expedia" };
    }
    return booking;
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set(cacheKey, run);
  });
  return run;
}
