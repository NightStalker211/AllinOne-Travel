// ============================================================
// AllinOne Travel — Skyscanner route fares via RapidAPI (FEAT-8).
//
// GET /v1/skyscanner/route answers with the cheapest quoted fare
// between two place codes on Skyscanner's 12-month calendar (any
// upcoming date, quote age in the deal legs). It is NOT a
// date-specific search, so it never merges into the date-fare
// rows — it renders as its own card with an explicit any-date
// context (REBUILD §5). Prices arrive in GBP (the host ignores
// a currency parameter); we display them exactly as quoted with
// the "Live · Skyscanner" badge. Failure => honest error, no
// numbers.
// ============================================================

import { rapidConfigured, rapidJson } from "./rapid";

export function skyscannerConfigured(): boolean {
  return rapidConfigured("skyscanner");
}

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export interface CheapestFare {
  price: number;
  currency: string;
  source: string;
  fetchedAt: string;
  /** When Skyscanner's quote was observed (YYYY-MM-DD), when present. */
  quotedAt?: string;
  /** True when the cheapest quote is nonstop. */
  direct?: boolean;
  /** Skyscanner's own route title, used as the card subtitle. */
  routeTitle: string;
}

export type CheapestResult =
  | { state: "ok"; fare: CheapestFare }
  | { state: "error"; reason: string };

interface RouteJson {
  data?: {
    cheapest_price?: number;
    currency?: string;
    title?: string;
    deals?: Array<{
      direct?: boolean;
      legs?: Array<{ quoted_at?: string }>;
    }>;
  };
}

const cache = new Map<string, Promise<CheapestResult>>();

/** Cheapest quoted fare between two IATA codes. Never throws. */
export function fetchCheapestFare(
  originIata: string,
  destinationIata: string
): Promise<CheapestResult> {
  const origin = (originIata ?? "").trim().toLowerCase();
  const destination = (destinationIata ?? "").trim().toLowerCase();
  if (!skyscannerConfigured()) {
    return Promise.resolve({ state: "error", reason: "no-key" });
  }
  if (!/^[a-z]{3}$/.test(origin) || !/^[a-z]{3}$/.test(destination)) {
    return Promise.resolve({ state: "error", reason: "no-route" });
  }

  const cacheKey = `${origin}|${destination}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const run = (async (): Promise<CheapestResult> => {
    try {
      let httpStatus = 0;
      const json = await rapidJson<RouteJson>(
        "skyscanner",
        `/v1/skyscanner/route?origin=${origin}&destination=${destination}`,
        {
          timeoutMs: 20000,
          onStatus: (s) => {
            httpStatus = s;
          },
        }
      );
      // 429 = the plan's monthly request quota is spent (the BASIC
      // plan allows 20 requests/month) — an honest rate-limit state,
      // not an outage; the gate accepts it as such.
      if (httpStatus === 429) return { state: "error", reason: "rate-limit" };
      const data = json?.data;
      if (!data) return { state: "error", reason: "network" };
      const price = Number(data.cheapest_price);
      if (!Number.isFinite(price) || price <= 0) {
        return { state: "error", reason: "no-fare" };
      }
      const deal = Array.isArray(data.deals) ? data.deals[0] : undefined;
      const quotedAt = deal?.legs?.[0]?.quoted_at?.slice(0, 10);
      return {
        state: "ok",
        fare: {
          price,
          currency: (data.currency || "GBP").toUpperCase(),
          source: "Skyscanner",
          fetchedAt: hhmmNow(),
          ...(quotedAt ? { quotedAt } : {}),
          ...(typeof deal?.direct === "boolean" ? { direct: deal.direct } : {}),
          routeTitle: String(data.title ?? "").trim(),
        },
      };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set(cacheKey, run);
  });
  return run;
}
