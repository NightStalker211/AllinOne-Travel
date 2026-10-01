// ============================================================
// AllinOne Travel — Expedia Data via RapidAPI (FEAT-8).
//
// Live hotel rates as the fallback source for the Stays tab: the
// chain asks Booking.com first (nearest-first around the point)
// and Expedia second (city region around the same point via
// /suggest region_id). Prices are parsed from Expedia's own
// display strings (priceSection) and rendered through PriceBadge
// with the provider's price-basis wording, so a per-night quote
// never reads as a stay total (REBUILD §5.1.3). Every failure is
// an honest error state — no estimates.
//
// The /flights/search endpoint on this host currently answers
// HTTP 502 from the provider side ("API (not working)"), so
// Expedia fares are NOT wired; only hotels (and /suggest).
// ============================================================

import { rapidConfigured, rapidJson } from "./rapid";
import type { LiveHotelOffer } from "./booking";

export function expediaConfigured(): boolean {
  return rapidConfigured("expedia");
}

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

interface SuggestRow {
  id?: string;
  name?: string;
  type?: string;
}

/** Resolve a city name to Expedia's region_id (POST /suggest).
 *  Returns the HTTP status too so a monthly-quota 429 can be
 *  surfaced as an honest rate-limit state. */
async function suggestRegion(
  city: string
): Promise<{ regionId: string | null; status: number }> {
  let status = 0;
  const json = await rapidJson<{ results?: SuggestRow[] }>(
    "expedia",
    "/suggest",
    {
      method: "POST",
      body: { query: city, lob: "HOTELS", limit: 6 },
      onStatus: (s) => {
        status = s;
      },
    }
  );
  const rows = Array.isArray(json?.results) ? json.results : [];
  const hit = rows.find((r) => r.type === "CITY" && r.id) ?? rows.find((r) => r.id);
  return { regionId: hit?.id || null, status };
}

/** "€92" / "US$1,234.50" -> 92 / 1234.5 (never a guess: only
 *  parses a figure the provider displayed). */
function parseMoney(text?: string): number | null {
  if (!text) return null;
  const m = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseInt0(text?: string): number | null {
  if (!text) return null;
  const m = text.replace(/,/g, "").match(/(\d+)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

interface ExpediaCard {
  id?: string;
  headingSection?: {
    heading?: string;
    productRating?: { rating?: number } | null;
  };
  summarySections?: Array<{
    reviewSummary?: {
      graphic?: { text?: string } | null;
      subtexts?: Array<{ shoppingProductTitle?: { text?: string } | null }>;
    } | null;
  }>;
  priceSection?: {
    priceSummary?: {
      options?: Array<{ displayPrice?: { formatted?: string } | null }>;
      priceMessaging?: Array<{ value?: string | null }>;
    };
  };
  mediaSection?: { badges?: unknown };
}

interface SearchResponse {
  results?: ExpediaCard[];
}

export interface ExpediaHotelQuery {
  city: string;
  lat: number;
  lng: number;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  currency: string;
}

export type ExpediaHotelsResult =
  | { state: "ok"; offers: LiveHotelOffer[]; fetchedAt: string }
  | { state: "error"; reason: string };

/** Live Expedia room rates near a point. Never throws. */
export async function fetchExpediaHotels(
  q: ExpediaHotelQuery
): Promise<ExpediaHotelsResult> {
  if (!expediaConfigured()) return { state: "error", reason: "no-key" };
  if (!q.city || !Number.isFinite(q.lat) || !Number.isFinite(q.lng)) {
    return { state: "error", reason: "bad-query" };
  }
  try {
    const suggest = await suggestRegion(q.city);
    if (suggest.status === 429) return { state: "error", reason: "rate-limit" };
    if (!suggest.regionId) return { state: "error", reason: "no-region" };

    const [y1, m1, d1] = q.checkIn.split("-").map(Number);
    const [y2, m2, d2] = q.checkOut.split("-").map(Number);
    let httpStatus = 0;
    const json = await rapidJson<SearchResponse>(
      "expedia",
      "/hotels/search",
      {
        method: "POST",
        timeoutMs: 25000,
        onStatus: (s) => {
          httpStatus = s;
        },
        body: {
          destination: {
            region_id: suggest.regionId,
            latitude: q.lat,
            longitude: q.lng,
          },
          check_in: { year: y1, month: m1, day: d1 },
          check_out: { year: y2, month: m2, day: d2 },
          rooms: [{ adults: Math.max(1, q.adults) }],
          currency: (q.currency || "EUR").toUpperCase(),
          page_size: 12,
        },
      }
    );
    if (httpStatus === 429) return { state: "error", reason: "rate-limit" };
    const rows = Array.isArray(json?.results) ? json.results : [];
    const fetchedAt = hhmmNow();

    const offers: LiveHotelOffer[] = [];
    for (const card of rows) {
      const name = String(card.headingSection?.heading ?? "").trim();
      if (!name) continue;
      const price = parseMoney(
        card.priceSection?.priceSummary?.options?.[0]?.displayPrice?.formatted
      );
      if (price == null) continue;

      const rawRating = card.headingSection?.productRating?.rating;
      const stars =
        typeof rawRating === "number" && rawRating >= 1 && rawRating <= 5
          ? Math.round(rawRating)
          : null;
      const scoreText = card.summarySections?.[0]?.reviewSummary?.graphic?.text;
      const scoreRaw = scoreText ? Number(scoreText) : NaN;
      const score =
        Number.isFinite(scoreRaw) && scoreRaw > 0 && scoreRaw <= 10
          ? scoreRaw
          : null;
      const reviewsText =
        card.summarySections?.[0]?.reviewSummary?.subtexts?.[0]
          ?.shoppingProductTitle?.text;
      const reviews = parseInt0(reviewsText);

      // Expedia's own price-basis wording ("for 1 night · 15 Oct -
      // 16 Oct") — displayed verbatim as the PriceBadge context so
      // the figure always carries its exact basis.
      const messaging = (
        card.priceSection?.priceSummary?.priceMessaging ?? []
      )
        .map((m) => (m?.value ?? "").trim())
        .filter(Boolean)
        .join(" · ");

      const freeCancellation =
        /free cancellation/i.test(
          JSON.stringify(card.priceSection ?? {})
        ) ||
        /free cancellation/i.test(
          JSON.stringify(card.mediaSection?.badges ?? {})
        );

      offers.push({
        hotelId: String(card.id ?? name),
        name,
        score,
        reviews,
        stars,
        lat: null,
        lng: null,
        distanceKm: null,
        price: {
          value: price,
          currency: (q.currency || "EUR").toUpperCase(),
        },
        freeCancellation,
        source: "Expedia",
        ...(messaging ? { stayContext: messaging } : {}),
      });
    }
    return { state: "ok", offers: offers.slice(0, 6), fetchedAt };
  } catch {
    return { state: "error", reason: "network" };
  }
}
