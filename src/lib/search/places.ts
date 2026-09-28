// ============================================================
// AllinOne Travel — place index over the 4,006 terminal records
//
// Cities are grouped from the generated destination data; country
// names/flags come from the passport dataset. Autocomplete scores
// are plain substring matches — no invented geocoding anywhere.
// ============================================================

import { TERMINALS, type Terminal } from "@/data/destinations";
import { ALL_PASSPORTS } from "@/data/passports";
import { curatedRoutesBetween, isCuratedHub } from "@/data/known-routes";
import type { CityPlace, PlaceRef } from "@/lib/types/search";
import { estMinutes, haversineKm } from "./model";

const CC_NAME = new Map<string, { name: string; emoji: string }>();
for (const p of ALL_PASSPORTS) CC_NAME.set(p.code, { name: p.name, emoji: p.emoji });

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

let cityIndex: Map<string, CityPlace> | null = null;
let iataIndex: Map<string, CityPlace> | null = null;
let iataTerminal: Map<string, Terminal> | null = null;

function buildIndex(): void {
  if (cityIndex) return;
  cityIndex = new Map();
  iataIndex = new Map();
  iataTerminal = new Map();

  const groups = new Map<string, Terminal[]>();
  for (const t of TERMINALS) {
    const key = `${t.city ?? t.displayName}|${t.countryCode}`;
    const list = groups.get(key);
    if (list) list.push(t);
    else groups.set(key, [t]);
  }

  // Component-wise MEDIAN, not mean: a single odd point (a country-
  // centroid fallback, a far-flung airport) must not drag the city
  // point off its cluster — the median always stays inside it.
  const median = (xs: number[]): number => {
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  for (const [key, terminals] of groups) {
    const cc = terminals[0].countryCode;
    const info = CC_NAME.get(cc);
    const lats: number[] = [];
    const lngs: number[] = [];
    for (const t of terminals) {
      if (t.lat !== undefined && t.lng !== undefined) {
        lats.push(t.lat);
        lngs.push(t.lng);
      }
    }
    const place: CityPlace = {
      key,
      city: terminals[0].city ?? terminals[0].displayName,
      cc,
      country: info?.name ?? cc,
      flag: info?.emoji ?? "",
      terminals,
      iatas: terminals
        .filter((t) => t.category === "air" && t.iata)
        .map((t) => t.iata as string),
      railNames: terminals.filter((t) => t.category === "rail").map((t) => t.displayName),
      busNames: terminals.filter((t) => t.category === "bus").map((t) => t.displayName),
      seaNames: terminals.filter((t) => t.category === "sea").map((t) => t.displayName),
      lat: lats.length > 0 ? median(lats) : null,
      lng: lngs.length > 0 ? median(lngs) : null,
    };
    cityIndex.set(key, place);
    for (const t of terminals) {
      if (t.category === "air" && t.iata && !iataTerminal.has(t.iata)) {
        iataTerminal.set(t.iata, t);
      }
    }
    for (const iata of place.iatas) iataIndex.set(iata, place);
  }
}

export function terminalByIata(iata: string): Terminal | undefined {
  buildIndex();
  return iataTerminal!.get(iata.toUpperCase());
}

export function getPlaces(): CityPlace[] {
  buildIndex();
  return [...cityIndex!.values()];
}

export function getPlace(ref: PlaceRef): CityPlace | undefined {
  buildIndex();
  return cityIndex!.get(`${ref.city}|${ref.cc}`);
}

export function placeByIata(iata: string): CityPlace | undefined {
  buildIndex();
  return iataIndex!.get(iata.toUpperCase());
}

export interface PlaceMatch extends CityPlace {
  score: number;
  /** IATA that matched, when the query was a code. */
  matchedIata?: string;
}

export function searchPlaces(query: string, limit = 8): PlaceMatch[] {
  buildIndex();
  const q = norm(query.trim());
  if (!q) return [];
  const out: PlaceMatch[] = [];
  const seen = new Set<string>();

  // Exact IATA hit ranks first (e.g. "BER" → Berlin).
  if (/^[a-z]{3}$/.test(q)) {
    const byIata = iataIndex!.get(q.toUpperCase());
    if (byIata) {
      out.push({ ...byIata, score: 120, matchedIata: q.toUpperCase() });
      seen.add(byIata.key);
    }
  }

  for (const p of cityIndex!.values()) {
    if (seen.has(p.key)) continue;
    const city = norm(p.city);
    let score = 0;
    if (city === q) score = 110;
    else if (city.startsWith(q)) score = 100;
    else if (city.includes(q)) score = 80;
    else if (norm(p.country).startsWith(q)) score = 55;
    else if (p.iatas.some((i) => i.toLowerCase() === q)) score = 115;
    else if (
      p.terminals.some(
        (t) => norm(t.displayName).includes(q) || norm(t.name).includes(q)
      )
    )
      score = 60;
    if (score > 0) out.push({ ...p, score });
  }

  out.sort((a, b) => b.score - a.score || a.city.localeCompare(b.city));
  return out.slice(0, limit);
}

export interface PopularRoute {
  id: string;
  from: PlaceRef;
  to: PlaceRef;
  label: string;
  carriers: number;
}

let popular: PopularRoute[] | null = null;

/**
 * Top curated direct routes by number of carriers serving the pair —
 * derived from known-routes at runtime, never hand-picked.
 */
export function popularRoutes(limit = 6): PopularRoute[] {
  if (popular) return popular;
  buildIndex();
  const iatas = [...iataIndex!.keys()];
  const counts: { a: string; b: string; n: number }[] = [];
  for (let i = 0; i < iatas.length; i++) {
    for (let j = i + 1; j < iatas.length; j++) {
      const a = iatas[i];
      const b = iatas[j];
      const n =
        curatedRoutesBetween([a], [b]).length +
        curatedRoutesBetween([b], [a]).length;
      if (n > 0) counts.push({ a, b, n });
    }
  }
  counts.sort((x, y) => y.n - x.n);
  popular = counts.slice(0, limit).map(({ a, b, n }) => {
    const pa = placeByIata(a)!;
    const pb = placeByIata(b)!;
    return {
      id: `${a}-${b}`,
      from: { city: pa.city, cc: pa.cc },
      to: { city: pb.city, cc: pb.cc },
      label: `${pa.city} → ${pb.city}`,
      carriers: n,
    };
  });
  return popular;
}

/** Distance + modeled duration between two city points, when known. */
export function cityDistanceKm(a: CityPlace, b: CityPlace): number | null {
  if (a.lat === null || a.lng === null || b.lat === null || b.lng === null) {
    return null;
  }
  return haversineKm({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng });
}

export function cityEstMinutes(a: CityPlace, b: CityPlace, mode: RowModeLocal): number | null {
  const km = cityDistanceKm(a, b);
  return km === null ? null : estMinutes(km, mode);
}

type RowModeLocal = "air" | "rail" | "bus" | "sea";

/** Cities with airports where a curated hub exists (chain building). */
export function hubPlaces(): CityPlace[] {
  return getPlaces().filter((p) => p.iatas.length > 0 && isCuratedHub(p.city));
}
