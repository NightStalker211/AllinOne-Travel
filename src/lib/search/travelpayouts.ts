// ============================================================
// AllinOne Travel — Travelpayouts live fares (aviasales v3).
// The renderer never talks to api.travelpayouts.com directly (the API
// sends no CORS header): it calls our own /api/tp/* proxy, which is a
// Next dev rewrite in dev and an Electron static-server route in the
// packaged app (electron/main.js).
// Honesty (REBUILD §5): every row this returns is a live API response
// from this session — it renders only through the PriceBadge
// (Live · Travelpayouts · HH:MM). Any failure => zero numbers.
// ============================================================

import type { LiveOffer } from "@/lib/types/search";

const TOKEN = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_TOKEN ?? "";

export function tpConfigured(): boolean {
  return Boolean(TOKEN);
}

export type TpFaresResult =
  | { state: "ok"; offers: LiveOffer[] }
  | { state: "error"; reason: string };

export interface TpFaresQuery {
  origin: string; // IATA
  destination: string; // IATA
  date?: string; // YYYY-MM-DD
  currency: string;
  limit?: number;
}

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

/** Airport-local arrival clock (departure HH:MM + duration minutes). */
function arrivalClock(depHhmm: string, minutes: number): string {
  const m = depHhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m || !Number.isFinite(minutes) || minutes <= 0) return "";
  const total = (Number(m[1]) * 60 + Number(m[2]) + Math.round(minutes)) % 1440;
  const h = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

interface TpRow {
  price?: number;
  currency?: string;
  departure_at?: string;
  airline?: string;
  flight_number?: string | number;
  transfers?: number;
  duration?: number;
  duration_to?: number;
}

/** Fetch observed fares for one route/date via our proxy. Never throws. */
export async function searchTpFares(q: TpFaresQuery): Promise<TpFaresResult> {
  if (!TOKEN) return { state: "error", reason: "no-token" };

  const params = new URLSearchParams({
    origin: q.origin,
    destination: q.destination,
    one_way: "true",
    currency: (q.currency || "EUR").toLowerCase(),
    limit: String(Math.min(10, Math.max(1, q.limit ?? 6))),
    token: TOKEN,
  });
  if (q.date) params.set("departure_at", q.date);

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`/api/tp/aviasales/v3/prices_for_dates?${params}`, {
      signal: ctrl.signal,
      // Live fares must never come from the HTTP cache: a cached 200
      // would stamp a stale price with a fresh "Live · HH:MM" time.
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) return { state: "error", reason: `http-${res.status}` };

    const json = (await res.json()) as { data?: TpRow[]; currency?: string };
    const rows = Array.isArray(json.data) ? json.data : [];
    const fetchedAt = hhmmNow();
    const currency = String(json.currency || q.currency || "EUR").toUpperCase();

    const offers: LiveOffer[] = rows
      .filter((r) => typeof r.price === "number" && r.price > 0)
      // Only render a fare that departs on the searched date — a price
      // for any other day would look fabricated next to the query.
      .filter((r) => !q.date || String(r.departure_at ?? "").slice(0, 10) === q.date)
      .map((r) => {
        const dep = String(r.departure_at ?? "");
        const departAt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dep)
          ? dep.slice(11, 16)
          : "";
        const durationMin =
          Number(r.duration) || Number(r.duration_to) || 0;
        const numbers =
          r.airline && r.flight_number
            ? [`${r.airline} ${r.flight_number}`]
            : r.flight_number
              ? [String(r.flight_number)]
              : [];
        return {
          fare: {
            price: r.price as number,
            currency,
            source: "Travelpayouts",
            fetchedAt,
          },
          departAt,
          arriveAt: arrivalClock(departAt, durationMin),
          flightNumbers: numbers,
          durationMin,
          stops: Number(r.transfers) || 0,
        };
      });

    return { state: "ok", offers };
  } catch {
    return { state: "error", reason: "network" };
  }
}
