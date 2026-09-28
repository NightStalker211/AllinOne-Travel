// ============================================================
// AllinOne Travel — Explore country data (shared, pure)
//
// One join keyed by country (REBUILD §7.2): terminals, carriers,
// tourism providers, passport/visa facts and counts for the map
// tooltip, the country grid and the country panel. No fetching,
// no side effects — safe for server components and the client.
// ============================================================

import { TERMINALS, type Terminal } from "@/data/destinations";
import { europeCarriers, getCountryByCode } from "@/data/carriers";
import { getProvidersByCountry } from "@/data/local-tourism";
import { ALL_PASSPORTS } from "@/data/passports";
import { VISA_PORTALS } from "@/data/visa-portals";
import type { Carrier, CountryCarriers, LocalProvider } from "@/lib/types/data";

export interface CountryCounts {
  terminals: number;
  air: number;
  rail: number;
  sea: number;
  bus: number;
  carriers: number;
  providers: number;
}

const terminalByCc = new Map<string, Terminal[]>();
for (const t of TERMINALS) {
  const list = terminalByCc.get(t.countryCode);
  if (list) list.push(t);
  else terminalByCc.set(t.countryCode, [t]);
}

/** Every country that has ANY dataset (map highlight + grid + routes). */
export function dataCountryCodes(): string[] {
  const set = new Set<string>();
  for (const t of TERMINALS) set.add(t.countryCode);
  for (const c of europeCarriers) set.add(c.code);
  return [...set].sort();
}

export function countryTerminals(cc: string): Terminal[] {
  return terminalByCc.get(cc) ?? [];
}

export function countryCarriers(cc: string): CountryCarriers | undefined {
  return getCountryByCode(cc);
}

export function countryProviders(cc: string): LocalProvider[] {
  return getProvidersByCountry(cc);
}

export function countryCounts(cc: string): CountryCounts {
  const terms = countryTerminals(cc);
  const cc2 = countryCarriers(cc);
  const carrierCount = cc2
    ? cc2.air.length + cc2.rail.length + cc2.bus.length + cc2.sea.length
    : 0;
  return {
    terminals: terms.length,
    air: terms.filter((t) => t.category === "air").length,
    rail: terms.filter((t) => t.category === "rail").length,
    sea: terms.filter((t) => t.category === "sea").length,
    bus: terms.filter((t) => t.category === "bus").length,
    carriers: carrierCount,
    providers: countryProviders(cc).length,
  };
}

/** Map tooltip + grid need counts for EVERY data country (fast path). */
export function allCountryCounts(): Record<string, CountryCounts> {
  const out: Record<string, CountryCounts> = {};
  for (const cc of dataCountryCodes()) out[cc] = countryCounts(cc);
  return out;
}

export interface CountryIdentity {
  cc: string;
  name: string;
  flag: string;
  continent?: string;
}

/** Flag/name from passports first (191), then carriers (60). */
export function countryIdentity(cc: string): CountryIdentity {
  const passport = ALL_PASSPORTS.find((p) => p.code === cc);
  const carriers = countryCarriers(cc);
  return {
    cc,
    name: passport?.name ?? carriers?.name ?? cc,
    flag: passport?.emoji ?? carriers?.flag ?? "",
    continent: passport?.region ?? carriers?.continent,
  };
}

/** City with the most terminals — the "search from/to here" origin. */
export function countryPrimaryCity(cc: string): string | null {
  const byCity = new Map<string, number>();
  for (const t of countryTerminals(cc)) {
    if (!t.city) continue;
    byCity.set(t.city, (byCity.get(t.city) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestN = 0;
  for (const [city, n] of byCity) {
    if (n > bestN) {
      best = city;
      bestN = n;
    }
  }
  return best;
}

/** Top cities by terminal count (local discovery picks the first 3). */
export function countryCities(cc: string, limit = 3): string[] {
  const byCity = new Map<string, number>();
  for (const t of countryTerminals(cc)) {
    if (!t.city) continue;
    byCity.set(t.city, (byCity.get(t.city) ?? 0) + 1);
  }
  return [...byCity.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([city]) => city);
}

/** All carriers flattened with their mode, active first, defunct dated. */
export interface FlatCarrier extends Carrier {
  /** Display year for a defunct carrier, when the note names one. */
  defunctYear?: string;
}

export function flatCarriers(cc: string): { active: FlatCarrier[]; defunct: FlatCarrier[] } {
  const c = countryCarriers(cc);
  const all: FlatCarrier[] = c
    ? (["air", "rail", "bus", "sea"] as const).flatMap((m) =>
        (c[m] ?? []).map((x) => {
          const year =
            x.status === "defunct"
              ? /\b(19|20)\d{2}\b/.exec(x.notes ?? "")?.[0]
              : undefined;
          return { ...x, defunctYear: year };
        })
      )
    : [];
  return {
    active: all.filter((x) => x.status !== "defunct"),
    defunct: all.filter((x) => x.status === "defunct"),
  };
}

export function hasOfficialPortal(cc: string): boolean {
  return Boolean(VISA_PORTALS[cc]);
}

export function allFlatCarriers(): Array<FlatCarrier & { cc: string }> {
  const out: Array<FlatCarrier & { cc: string }> = [];
  for (const c of europeCarriers) {
    for (const m of ["air", "rail", "bus", "sea"] as const) {
      for (const x of c[m] ?? []) out.push({ ...x, cc: c.code });
    }
  }
  return out;
}
