// ============================================================
// AllinOne Travel — search domain types
// Honesty-critical: a price figure may only ever live inside a
// LiveFare that a live API returned in this session (REBUILD §5).
// ============================================================

import type { Terminal } from "@/data/destinations";

export type TabKey =
  | "multi"
  | "flights"
  | "rail"
  | "bus"
  | "ferry"
  | "stays"
  | "visa";

export type RowMode = "air" | "rail" | "bus" | "sea";

export interface PlaceRef {
  city: string;
  cc: string;
}

export interface CityPlace {
  /** "Berlin|DE" */
  key: string;
  city: string;
  /** ISO 3166-1 alpha-2 */
  cc: string;
  country: string;
  flag: string;
  terminals: Terminal[];
  iatas: string[];
  railNames: string[];
  busNames: string[];
  seaNames: string[];
  /** City point: average of terminal coords, else country centroid. */
  lat: number | null;
  lng: number | null;
}

/** A price shown in the UI. Only constructible from a live API response. */
export interface LiveFare {
  price: number;
  currency: string;
  /** Source name shown in the badge, e.g. "Amadeus". */
  source: string;
  /** Local fetch time "HH:MM" for the badge. */
  fetchedAt: string;
}

/** One live flight offer (Amadeus). Times/carriers are live data. */
export interface LiveOffer {
  fare: LiveFare;
  /** "HH:MM" local airport time — live only. */
  departAt: string;
  arriveAt: string;
  flightNumbers: string[];
  durationMin: number;
  stops: number;
}

export interface ResultRow {
  id: string;
  mode: RowMode;
  /** Line 1: "Berlin → Paris" */
  route: string;
  /** Line 2: terminals / airports / carriers — curated facts only */
  detail: string;
  /** Modeled duration; never rendered without the "est." label. */
  estMinutes?: number;
  /** Duration from live API data — rendered plainly, never as "est.". */
  liveMinutes?: number;
  /** Time renders only when confirmed by live data. */
  scheduleConfirmed: boolean;
  /** Live "HH:MM" — only set alongside scheduleConfirmed. */
  departAt?: string;
  /** Curated carrier names (known-routes) — rendered labeled "curated". */
  carriers?: string[];
  /** The only path to a rendered price figure. */
  live?: LiveFare;
  /** Transparency line under the price (date, one-way, per traveller). */
  liveContext?: string;
  /** Chain-only: transfer note ("transfer time unknown"). */
  chainNote?: string;
  /** 1-based leg number when part of a chain. */
  leg?: number;
}

export interface EmptyReason {
  title: string;
  detail: string;
  /** Short suggestion text, e.g. "try the Bus tab" */
  suggest?: string;
}

export interface ModeTab {
  rows: ResultRow[];
  empty?: EmptyReason;
  /** Always-rendered honesty note (e.g. sorting reason). */
  note?: string;
}

export interface MultiSummary {
  chains: ResultRow[][];
  chips: { tab: TabKey; label: string; count: number; note?: string }[];
  notes: string[];
}

export type VisaStatus =
  | "visa-free"
  | "visa-on-arrival"
  | "e-visa"
  | "visa-required";

export interface VisaInfo {
  status: VisaStatus;
  confidence: "confirmed" | "best-effort";
  portalUrl: string;
  officialPortal: boolean;
}

export interface SearchOutcome {
  origin: CityPlace;
  destination: CityPlace;
  km: number | null;
  multi: MultiSummary;
  flights: ModeTab;
  rail: ModeTab;
  bus: ModeTab;
  ferry: ModeTab;
  visa: VisaInfo;
}

export type LiveFareStatus =
  | { state: "loading" }
  | { state: "ok"; offers: LiveOffer[] }
  | { state: "unavailable"; reason: string };

/** What the Amadeus client actually returns (never "loading"). */
export type LiveFaresResult =
  | { state: "ok"; offers: LiveOffer[] }
  | { state: "unavailable"; reason: string };
