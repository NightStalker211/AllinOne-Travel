// ============================================================
// AllinOne Travel — affiliate marker injection.
// Travelpayouts program links carry ?marker=782929 (REBUILD addendum:
// outbound redirects to partner hosts must include the affiliate marker).
// Applied centrally so every search-links deep link gets it automatically.
// ============================================================

export const AFFILIATE_MARKER = "782929";

/** Hosts that recognise the Travelpayouts marker parameter. */
const AFFILIATE_HOSTS = [
  "aviasales.com",
  "booking.com",
  "omio.com",
  "trip.com",
  "busbud.com",
];

function hostMatches(hostname: string, host: string): boolean {
  const h = hostname.toLowerCase();
  return h === host || h.endsWith(`.${host}`);
}

/** Append the affiliate marker to a partner URL (idempotent). */
export function withMarker(href: string): string {
  try {
    const url = new URL(href);
    if (!AFFILIATE_HOSTS.some((h) => hostMatches(url.hostname, h))) return href;
    if (url.searchParams.has("marker")) return href;
    url.searchParams.set("marker", AFFILIATE_MARKER);
    return url.toString();
  } catch {
    return href;
  }
}

/** True when the URL targets a Travelpayouts partner host (for the
 *  honest "partner link" disclosure badge in the UI). */
export function isPartnerUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return AFFILIATE_HOSTS.some((h) => hostMatches(url.hostname, h));
  } catch {
    return false;
  }
}
