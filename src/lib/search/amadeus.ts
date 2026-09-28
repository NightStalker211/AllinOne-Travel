// ============================================================
// AllinOne Travel — Amadeus live fare client
//
// REBUILD §5.1: the ONLY source of rendered price figures.
// Missing key / rate limit / network failure => "unavailable" with
// zero numbers. There is no fallback price path — ever.
//
// NEXT_PUBLIC_* values are inlined at build time (static export).
// ============================================================

import type { LiveFaresResult, LiveOffer } from "@/lib/types/search";

interface AmadeusConfig {
  key: string;
  secret: string;
  baseUrl: string;
}

export function amadeusConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_AMADEUS_API_KEY &&
      process.env.NEXT_PUBLIC_AMADEUS_API_SECRET
  );
}

function config(): AmadeusConfig | null {
  const key = process.env.NEXT_PUBLIC_AMADEUS_API_KEY;
  const secret = process.env.NEXT_PUBLIC_AMADEUS_API_SECRET;
  if (!key || !secret) return null;
  const baseUrl = (
    process.env.NEXT_PUBLIC_AMADEUS_API_BASE_URL || "https://test.api.amadeus.com"
  ).replace(/\/$/, "");
  return { key, secret, baseUrl };
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(cfg: AmadeusConfig): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  try {
    const res = await fetch(`${cfg.baseUrl}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        clientId: cfg.key,
        clientSecret: cfg.secret,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;
    cachedToken = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in ?? 1799) * 1000,
    };
    return cachedToken.value;
  } catch {
    return null;
  }
}

/** "PT8H30M" → 510 */
function parseIsoDuration(s: string | undefined): number {
  if (!s) return 0;
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(s);
  if (!m) return 0;
  return (Number(m[1] ?? 0) * 60) + Number(m[2] ?? 0);
}

function hhmm(iso: string | undefined): string {
  return iso && iso.length >= 16 ? iso.slice(11, 16) : "--:--";
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface AmadeusOfferJson {
  price?: { total?: string; currency?: string };
  itineraries?: {
    duration?: string;
    segments?: {
      carrierCode?: string;
      number?: string;
      departure?: { iataCode?: string; at?: string };
      arrival?: { iataCode?: string; at?: string };
    }[];
  }[];
}

export interface LiveFareQuery {
  origin: string;
  destination: string;
  date: string;
  adults: number;
  currency: string;
}

/**
 * Search live flight offers. Never throws; never invents a number.
 * reason: "no-key" | "auth" | "http" | "network" | "bad-data"
 */
export async function searchLiveFares(
  q: LiveFareQuery
): Promise<LiveFaresResult> {
  const cfg = config();
  if (!cfg) return { state: "unavailable", reason: "no-key" };

  const token = await getToken(cfg);
  if (!token) return { state: "unavailable", reason: "auth" };

  const params = new URLSearchParams({
    originLocationCode: q.origin,
    destinationLocationCode: q.destination,
    departureDate: q.date,
    adults: String(q.adults),
    currencyCode: q.currency,
    max: "10",
    nonStop: "false",
  });

  try {
    const res = await fetch(`${cfg.baseUrl}/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Session-fresh quotes only — never a cached "live" price.
      cache: "no-store",
    });
    if (!res.ok) return { state: "unavailable", reason: "http" };
    const json = (await res.json()) as { data?: AmadeusOfferJson[] };
    if (!Array.isArray(json.data)) return { state: "unavailable", reason: "bad-data" };

    const fetchedAt = nowHHMM();
    const offers: LiveOffer[] = [];
    for (const o of json.data) {
      const total = Number(o.price?.total);
      const itinerary = o.itineraries?.[0];
      const segments = itinerary?.segments ?? [];
      const first = segments[0];
      const last = segments[segments.length - 1];
      if (!Number.isFinite(total) || !first || !last) continue;
      offers.push({
        fare: {
          price: total,
          currency: o.price?.currency ?? q.currency,
          source: "Amadeus",
          fetchedAt,
        },
        departAt: hhmm(first.departure?.at),
        arriveAt: hhmm(last.arrival?.at),
        flightNumbers: segments.map((s) => `${s.carrierCode ?? ""}${s.number ?? ""}`),
        durationMin: parseIsoDuration(itinerary?.duration),
        stops: Math.max(0, segments.length - 1),
      });
    }
    return { state: "ok", offers };
  } catch {
    return { state: "unavailable", reason: "network" };
  }
}
