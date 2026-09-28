// ============================================================
// AllinOne Travel — search engine (pure, synchronous, honest)
//
// Builds result rows ONLY from curated datasets:
//   - flights: known-routes (684 curated city pairs + carriers)
//   - rail/bus/ferry: terminal inventory of both cities
//   - visa: passport dataset + official portals
// Live fares are merged in the UI layer (useLiveFares) — this module
// can never produce a price figure (REBUILD §5).
//
// Durations from haversine are modeled => always rendered "est.";
// times render only when scheduleConfirmed (live data) (§5.2).
// ============================================================

import { TERMINALS } from "@/data/destinations";
import { curatedRoutesBetween } from "@/data/known-routes";
import { getVisaConfidence, getVisaStatus } from "@/data/passports";
import { VISA_PORTALS, getVisaPortalUrl } from "@/data/visa-portals";
import type {
  CityPlace,
  ModeTab,
  MultiSummary,
  PlaceRef,
  ResultRow,
  SearchOutcome,
  VisaInfo,
} from "@/lib/types/search";
import { estMinutes, haversineKm } from "./model";
import {
  cityDistanceKm,
  cityEstMinutes,
  getPlace,
  hubPlaces,
  terminalByIata,
} from "./places";

export interface RawQuery {
  from: PlaceRef;
  to: PlaceRef;
  /** ISO 3166-1 alpha-2 passport code for the Visa tab. */
  nationality: string;
  date?: string;
  passengers: number;
}

export type EngineResult =
  | { ok: true; outcome: SearchOutcome }
  | { ok: false; error: string };

const CC_CATEGORY = new Set<string>();
for (const t of TERMINALS) CC_CATEGORY.add(`${t.countryCode}|${t.category}`);

function countryHas(cc: string, category: "rail" | "bus" | "sea"): boolean {
  return CC_CATEGORY.has(`${cc}|${category}`);
}

function airportEstMinutes(fromIata: string, toIata: string): number | null {
  const a = terminalByIata(fromIata);
  const b = terminalByIata(toIata);
  if (!a || !b || a.lat === undefined || a.lng === undefined) return null;
  if (b.lat === undefined || b.lng === undefined) return null;
  const km = haversineKm(
    { lat: a.lat, lng: a.lng },
    { lat: b.lat, lng: b.lng }
  );
  return estMinutes(km, "air");
}

function listNames(names: string[], max = 2): string {
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} +${names.length - max}`;
}

function namesFor(place: CityPlace, kind: "rail" | "bus" | "sea"): string[] {
  if (kind === "rail") return place.railNames;
  if (kind === "bus") return place.busNames;
  return place.seaNames;
}

/**
 * Nearest terminal of a kind to a city point — pure geometry, used
 * only for honest empty-state suggestions ("nearest port: Piraeus,
 * 25 km"). Returns null beyond maxKm or without coordinates.
 */
function nearestTerminal(
  place: CityPlace,
  kind: "rail" | "bus" | "sea",
  maxKm = 100
): { name: string; city: string; km: number } | null {
  if (place.lat === null || place.lng === null) return null;
  let best: { name: string; city: string; km: number } | null = null;
  for (const t of TERMINALS) {
    if (t.category !== kind || t.lat === undefined || t.lng === undefined) continue;
    const km = haversineKm(
      { lat: place.lat, lng: place.lng },
      { lat: t.lat, lng: t.lng }
    );
    if (km > maxKm) continue;
    if (!best || km < best.km) {
      best = { name: t.displayName, city: t.city ?? t.displayName, km: Math.round(km) };
    }
  }
  return best;
}

/**
 * A port/station within NEAR_KM of a city centre genuinely serves that
 * city (Athens ↔ Piraeus). Used as a search fallback only with the
 * distance disclosed in the row — never to invent a terminal.
 */
const NEAR_KM = 35;

function namesForOrNear(
  place: CityPlace,
  kind: "rail" | "bus" | "sea"
): { names: string[]; via?: { city: string; km: number } } {
  const names = namesFor(place, kind);
  if (names.length > 0) return { names };
  const near = nearestTerminal(place, kind, NEAR_KM);
  if (near) return { names: [near.name], via: { city: near.city, km: near.km } };
  return { names };
}

function groundRow(
  kind: "rail" | "bus" | "sea",
  origin: CityPlace,
  destination: CityPlace
): ResultRow {
  const o = namesForOrNear(origin, kind);
  const d = namesForOrNear(destination, kind);
  const viaNote = [
    o.via ? `origin via ${o.via.city} (~${o.via.km} km)` : null,
    d.via ? `destination via ${d.via.city} (~${d.via.km} km)` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return {
    id: `${kind}-search`,
    mode: kind,
    route: `${origin.city} → ${destination.city}`,
    detail: `${listNames(o.names)} → ${listNames(d.names)}${viaNote ? ` (${viaNote})` : ""}`,
    estMinutes: cityEstMinutes(origin, destination, kind) ?? undefined,
    scheduleConfirmed: false,
  };
}

function groundTab(
  kind: "rail" | "bus" | "sea",
  origin: CityPlace,
  destination: CityPlace,
  others: { rail: boolean; bus: boolean; sea: boolean; air: boolean }
): ModeTab {
  const label = kind === "sea" ? "ferry" : kind;
  const oEff = namesForOrNear(origin, kind);
  const dEff = namesForOrNear(destination, kind);
  const oNames = oEff.names;
  const dNames = dEff.names;
  const suggestAvailable = (["rail", "bus", "sea", "air"] as const).filter(
    (m) => m !== kind && others[m]
  );

  if (oNames.length === 0 || dNames.length === 0) {
    const missing = oNames.length === 0 ? origin : destination;
    const bothMissing = oNames.length === 0 && dNames.length === 0;
    const networkHere = countryHas(origin.cc, kind) && countryHas(destination.cc, kind);
    const title = bothMissing
      ? `No ${label} terminals listed for either city`
      : networkHere
        ? `No ${label} terminal listed in ${missing.city}`
        : `No ${label} network in ${missing.country}`;
    const near = nearestTerminal(missing, kind);
    const suggest = suggestAvailable[0];
    const nearText = near
      ? `Nearest ${label} terminal: ${near.name} (${near.city}, ~${near.km} km).`
      : null;
    return {
      rows: [],
      empty: {
        title,
        detail: [
          kind === "sea" && !networkHere
            ? `${missing.country} has no ferry port in our data — it's landlocked here.`
            : "Our terminal dataset lists nothing for this, and we don't invent services.",
          nearText,
        ]
          .filter(Boolean)
          .join(" "),
        suggest: suggest
          ? `Try ${suggest === "air" ? "Flights" : `${suggest[0].toUpperCase()}${suggest.slice(1)}`} instead`
          : undefined,
      },
    };
  }

  return {
    rows: [groundRow(kind, origin, destination)],
    note: "Terminal facts are curated; live times and prices are on the operator's site.",
  };
}

function flightRows(origin: CityPlace, destination: CityPlace): ResultRow[] {
  const routes = curatedRoutesBetween(origin.iatas, destination.iatas);
  const byPair = new Map<string, ResultRow>();
  for (const r of routes) {
    const pairId = `${r.from}-${r.to}`;
    const existing = byPair.get(pairId);
    if (existing) {
      existing.carriers = [...(existing.carriers ?? []), r.carrier];
      continue;
    }
    byPair.set(pairId, {
      id: `flight-${pairId}`,
      mode: "air",
      route: `${origin.city} → ${destination.city}`,
      detail: `${r.from} → ${r.to}`,
      estMinutes: airportEstMinutes(r.from, r.to) ?? undefined,
      scheduleConfirmed: false,
      carriers: [r.carrier],
    });
  }
  return [...byPair.values()].sort(
    (a, b) => (a.estMinutes ?? 9e9) - (b.estMinutes ?? 9e9)
  );
}

function buildChains(
  origin: CityPlace,
  destination: CityPlace,
  bestDirectMin: number | null
): { chains: ResultRow[][]; notes: string[] } {
  const notes: string[] = [];
  if (origin.iatas.length === 0 || destination.iatas.length === 0) {
    return { chains: [], notes };
  }

  let best: { hub: CityPlace; total: number; leg1: ResultRow; leg2: ResultRow } | null =
    null;

  for (const hub of hubPlaces()) {
    if (hub.key === origin.key || hub.key === destination.key) continue;
    const first = curatedRoutesBetween(origin.iatas, hub.iatas);
    const second = curatedRoutesBetween(hub.iatas, destination.iatas);
    if (first.length === 0 || second.length === 0) continue;
    const e1 = cityEstMinutes(origin, hub, "air");
    const e2 = cityEstMinutes(hub, destination, "air");
    if (e1 === null || e2 === null) continue;
    const total = e1 + e2;
    if (best && best.total <= total) continue;
    best = {
      hub,
      total,
      leg1: {
        id: `chain-leg1-${hub.key}`,
        mode: "air",
        route: `${origin.city} → ${hub.city}`,
        detail: `${first[0].from} → ${first[0].to}`,
        estMinutes: e1,
        scheduleConfirmed: false,
        carriers: [...new Set(first.map((r) => r.carrier))],
        chainNote: `transfer at ${hub.city} — transfer time unknown`,
        leg: 1,
      },
      leg2: {
        id: `chain-leg2-${hub.key}`,
        mode: "air",
        route: `${hub.city} → ${destination.city}`,
        detail: `${second[0].from} → ${second[0].to}`,
        estMinutes: e2,
        scheduleConfirmed: false,
        carriers: [...new Set(second.map((r) => r.carrier))],
        leg: 2,
      },
    };
  }

  if (!best) {
    notes.push("No connecting itinerary found in curated routes.");
    return { chains: [], notes };
  }

  // Chain ships only when it has no direct option to beat, or is
  // clearly faster (>= 20% shorter modeled total) — REBUILD §8.4.
  if (bestDirectMin !== null && best.total >= bestDirectMin * 0.8) {
    notes.push(
      "A connection exists but isn't clearly faster than the direct options — not shown."
    );
    return { chains: [], notes };
  }

  return { chains: [[best.leg1, best.leg2]], notes };
}

function buildVisa(nat: string, destination: CityPlace): VisaInfo {
  return buildVisaForCountry(nat, destination.cc);
}

/** Same visa facts, keyed by country — used by Search and Explore. */
export function buildVisaForCountry(nat: string, cc: string): VisaInfo {
  if (nat === cc) {
    return {
      status: "visa-free",
      confidence: "confirmed",
      portalUrl: getVisaPortalUrl(cc, "visa-free"),
      officialPortal: Boolean(VISA_PORTALS[cc]),
    };
  }
  const status = getVisaStatus(nat, cc);
  return {
    status,
    confidence: getVisaConfidence(nat),
    portalUrl: getVisaPortalUrl(cc, status),
    officialPortal: Boolean(VISA_PORTALS[cc]),
  };
}

export function buildSearch(q: RawQuery): EngineResult {
  const origin = getPlace(q.from);
  const destination = getPlace(q.to);
  if (!origin) return { ok: false, error: `Unknown origin "${q.from.city}"` };
  if (!destination) {
    return { ok: false, error: `Unknown destination "${q.to.city}"` };
  }
  if (origin.key === destination.key) {
    return { ok: false, error: "Origin and destination are the same city" };
  }

  const km = cityDistanceKm(origin, destination);

  // ---- Flights (curated direct only; live fares merged in UI) ----
  const curatedFlightRows = flightRows(origin, destination);
  const flights: ModeTab = {
    rows: curatedFlightRows,
    note: "Carrier facts are curated (known-routes); times come from live data only.",
    ...(curatedFlightRows.length === 0
      ? {
          empty: {
            title: "No direct flight in curated data",
            detail:
              "Our curated dataset lists no direct route for this pair.",
            suggest: "You can still run a live search with the providers",
          },
        }
      : {}),
  };

  // ---- Ground modes ----
  const others = {
    rail: origin.railNames.length > 0 && destination.railNames.length > 0,
    bus: origin.busNames.length > 0 && destination.busNames.length > 0,
    sea: origin.seaNames.length > 0 && destination.seaNames.length > 0,
    air: curatedFlightRows.length > 0,
  };
  const rail = groundTab("rail", origin, destination, others);
  const bus = groundTab("bus", origin, destination, others);
  const ferry = groundTab("sea", origin, destination, others);

  // ---- Multi-modal summary ----
  const directEsts = [...curatedFlightRows, ...rail.rows, ...bus.rows, ...ferry.rows]
    .map((r) => r.estMinutes)
    .filter((n): n is number => typeof n === "number");
  const bestDirectMin = directEsts.length > 0 ? Math.min(...directEsts) : null;
  const { chains, notes } = buildChains(origin, destination, bestDirectMin);

  const chips: MultiSummary["chips"] = [
    { tab: "flights", label: "Flights", count: flights.rows.length, note: flights.empty?.title },
    { tab: "rail", label: "Rail", count: rail.rows.length, note: rail.empty?.title },
    { tab: "bus", label: "Bus", count: bus.rows.length, note: bus.empty?.title },
    { tab: "ferry", label: "Ferry", count: ferry.rows.length, note: ferry.empty?.title },
  ];

  return {
    ok: true,
    outcome: {
      origin,
      destination,
      km,
      multi: { chains, chips, notes },
      flights,
      rail,
      bus,
      ferry,
      visa: buildVisa(q.nationality, destination),
    },
  };
}
