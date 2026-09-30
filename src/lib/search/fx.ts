// ============================================================
// AllinOne Travel — reference exchange rates (Frankfurter / ECB).
//
// Keyless proxy over the European Central Bank daily reference
// rates (published ~16:00 CET on working days), fetched from
// api.frankfurter.dev — the current host; api.frankfurter.app now
// redirects and does not send CORS headers. Used ONLY for the
// informational "1 XXX = YYY" line on the Explore country panel —
// never as a price, never for converting fares (providers return
// fares already in the requested currency). Any failure means the
// line simply does not render.
// ============================================================

export type FxResult =
  | { state: "ok"; rate: number; date: string }
  | { state: "error"; reason: string };

const API = "https://api.frankfurter.dev/v1/latest";

const cache = new Map<string, Promise<FxResult>>();

/** One daily ECB rate (to from `from`). Never throws. */
export function fetchEcbRate(from: string, to: string): Promise<FxResult> {
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || from === to) {
    return Promise.resolve({ state: "error", reason: "bad-pair" });
  }
  const key = `${from}|${to}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const run = (async (): Promise<FxResult> => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(
        `${API}?${new URLSearchParams({ base: from, symbols: to })}`,
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      if (!res.ok) return { state: "error", reason: `http-${res.status}` };
      const json = (await res.json()) as {
        date?: string;
        rates?: Record<string, number>;
      };
      const rate = json.rates?.[to];
      if (typeof rate !== "number" || !(rate > 0) || !json.date) {
        return { state: "error", reason: "no-rate" };
      }
      return { state: "ok", rate, date: json.date };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  cache.set(key, run);
  return run;
}

/** Human-ish precision: 2 decimals from ~1, 4 below that. */
export function formatRate(rate: number): string {
  return rate >= 1 ? rate.toFixed(2) : rate.toFixed(4);
}
