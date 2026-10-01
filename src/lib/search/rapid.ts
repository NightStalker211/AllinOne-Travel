// ============================================================
// AllinOne Travel — shared RapidAPI client (FEAT-7).
//
// One key + one host header for every RapidAPI module (Booking,
// Currency, GeoDB, Travel Advisor, Expedia, Skyscanner, Google
// Flights). The gateway answers the CORS preflight for our origin,
// so the renderer calls hosts directly — no proxy, no server
// runtime (the app is a static export). Every call is
// session-cached by its caller and NEVER throws: a failure is a
// null the caller maps to an honest state (REBUILD §5).
// ============================================================

export type RapidService =
  | "booking"
  | "currency"
  | "geodb"
  | "travelAdvisor"
  | "expedia"
  | "skyscanner"
  | "googleFlights";

// IMPORTANT: every `process.env.NEXT_PUBLIC_…` below is a STATIC
// literal so the Next.js build inlines its value into the bundle.
// A dynamic access like `process.env[SOME_VAR]` is erased at build
// time and would come back empty in the renderer.
const HOSTS: Record<RapidService, string | undefined> = {
  booking: process.env.NEXT_PUBLIC_RAPIDAPI_BOOKING_HOST,
  currency: process.env.NEXT_PUBLIC_RAPIDAPI_CURRENCY_HOST,
  geodb: process.env.NEXT_PUBLIC_RAPIDAPI_GEODB_HOST,
  travelAdvisor: process.env.NEXT_PUBLIC_RAPIDAPI_TRAVEL_ADVISOR_HOST,
  expedia: process.env.NEXT_PUBLIC_RAPIDAPI_EXPEDIA_HOST,
  skyscanner: process.env.NEXT_PUBLIC_RAPIDAPI_SKYSCANNER_HOST,
  googleFlights: process.env.NEXT_PUBLIC_RAPIDAPI_GOOGLE_FLIGHTS_HOST,
};

export function rapidKey(): string {
  return process.env.NEXT_PUBLIC_RAPIDAPI_KEY ?? "";
}

export function rapidHost(service: RapidService): string {
  return HOSTS[service] ?? "";
}

/** Key present (and host set for `service`, when given). */
export function rapidConfigured(service?: RapidService): boolean {
  if (!rapidKey()) return false;
  return service ? Boolean(rapidHost(service)) : true;
}

/** GET/POST JSON against a RapidAPI host. Returns null on any
 *  failure (network, non-2xx, bad JSON) — never throws.
 *  `onStatus` (optional) receives the HTTP status of the response
 *  (0 = network failure) so callers can distinguish a monthly
 *  quota hit (429) from a transient outage and render the honest
 *  rate-limit state instead of a generic error. */
export async function rapidJson<T>(
  service: RapidService,
  pathAndQuery: string,
  init?: {
    method?: "GET" | "POST";
    body?: unknown;
    timeoutMs?: number;
    onStatus?: (status: number) => void;
  }
): Promise<T | null> {
  const host = rapidHost(service);
  const key = rapidKey();
  if (!host || !key) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 20000);
    const res = await fetch(`https://${host}${pathAndQuery}`, {
      method: init?.method ?? "GET",
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: ctrl.signal,
      // Live quotes must never be served from an HTTP cache (stale
      // price under a fresh "Live · HH:MM" badge reads as a lie).
      cache: "no-store",
    });
    clearTimeout(timer);
    init?.onStatus?.(res.status);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    init?.onStatus?.(0);
    return null;
  }
}
