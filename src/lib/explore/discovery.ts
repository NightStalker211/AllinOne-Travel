// ============================================================
// AllinOne Travel — local discovery deep links (REBUILD §7.1 §6)
//
// Per major city: prefilled searches on stable public services.
// These are navigations, not prices — always honest labels, no
// invented content. Every URL is a well-known documented pattern.
// ============================================================

export interface DiscoveryLink {
  label: string;
  href: string;
}

function q(s: string): string {
  return encodeURIComponent(s);
}

/** Google Maps search — query prefilled, no API key needed. */
function maps(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${q(query)}`;
}

function wikipedia(city: string, cc: string): string {
  return `https://en.wikipedia.org/w/index.php?search=${q(`${city} ${cc}`)}`;
}

function wikivoyage(city: string): string {
  return `https://en.wikivoyage.org/w/index.php?search=${q(city)}`;
}

/** The five discovery links for one city — attractions/food/events. */
export function cityDiscoveryLinks(city: string, cc: string): DiscoveryLink[] {
  return [
    { label: `Google Maps — attractions in ${city}`, href: maps(`attractions in ${city}`) },
    { label: `Google Maps — restaurants in ${city}`, href: maps(`restaurants in ${city}`) },
    { label: `Google Maps — events in ${city}`, href: maps(`events in ${city}`) },
    { label: `Wikipedia — ${city}`, href: wikipedia(city, cc) },
    { label: `Wikivoyage — ${city}`, href: wikivoyage(city) },
  ];
}
