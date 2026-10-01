// ============================================================
// AllinOne Travel — reference exchange rates.
//
// Primary: Frankfurter (keyless ECB daily rates, ~16:00 CET on
// working days, CORS-enabled host). Fallback: RapidAPI Currency
// module when ECB is unreachable. Used ONLY for the
// informational "1 XXX = YYY" line on the Explore country panel —
// never as a price, never for converting fares (providers return
// fares already in the requested currency). The result carries
// WHICH provider answered so the line can attribute itself
// honestly (§5.1.7). Any failure means the line does not render.
// ============================================================

import { rapidConfigured, rapidJson } from "./rapid";

export type FxProvider = "ECB via Frankfurter" | "Currency API via RapidAPI";

export type FxResult =
  | { state: "ok"; rate: number; date: string; provider: FxProvider }
  | { state: "error"; reason: string };

const API = "https://api.frankfurter.dev/v1/latest";

const cache = new Map<string, Promise<FxResult>>();

async function fromEcb(from: string, to: string): Promise<FxResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(
      `${API}?${new URLSearchParams({ base: from, symbols: to })}`,
      { signal: ctrl.signal }
    );
    if (!res.ok) return { state: "error", reason: `http-${res.status}` };
    const json = (await res.json()) as {
      date?: string;
      rates?: Record<string, number>;
    };
    const rate = json.rates?.[to];
    if (typeof rate !== "number" || !(rate > 0) || !json.date) {
      return { state: "error", reason: "no-rate" };
    }
    return { state: "ok", rate, date: json.date, provider: "ECB via Frankfurter" };
  } catch {
    return { state: "error", reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}

async function fromRapid(from: string, to: string): Promise<FxResult> {
  if (!rapidConfigured("currency")) {
    return { state: "error", reason: "no-key" };
  }
  const json = await rapidJson<{
    success?: boolean | string;
    date?: string;
    rates?: Record<string, number>;
  }>("currency", `/latest?base=${from}&symbols=${to}`, { timeoutMs: 8000 });
  if (!json) return { state: "error", reason: "network" };
  const rate = json.rates?.[to];
  if (typeof rate !== "number" || !(rate > 0) || !json.date) {
    return { state: "error", reason: "no-rate" };
  }
  return {
    state: "ok",
    rate,
    date: json.date,
    provider: "Currency API via RapidAPI",
  };
}

/** One daily rate (to `to`): ECB first, RapidAPI as fallback.
 *  Never throws. */
export function fetchEcbRate(from: string, to: string): Promise<FxResult> {
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || from === to) {
    return Promise.resolve({ state: "error", reason: "bad-pair" });
  }
  const key = `${from}|${to}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const run = (async (): Promise<FxResult> => {
    const primary = await fromEcb(from, to);
    if (primary.state === "ok") return primary;
    return fromRapid(from, to);
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set(key, run);
  });
  return run;
}

/** Human-ish precision: 2 decimals from ~1, 4 below that. */
export function formatRate(rate: number): string {
  return rate >= 1 ? rate.toFixed(2) : rate.toFixed(4);
}
