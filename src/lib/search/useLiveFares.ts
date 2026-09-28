"use client";

// ============================================================
// AllinOne Travel — live fare hook
// Fetches Amadeus offers for the current query; merges them into
// flight rows. Unavailable (no key / network) => zero numbers.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { amadeusConfigured, searchLiveFares } from "./amadeus";
import type {
  CityPlace,
  LiveOffer,
  ResultRow,
} from "@/lib/types/search";

export interface LiveFaresQuery {
  originIata: string | null;
  destinationIata: string | null;
  date?: string;
  adults: number;
  currency: string;
}

export interface LiveFaresState {
  status: "loading" | "ok" | "unavailable";
  offers: LiveOffer[];
  reason?: string;
}

const INITIAL: LiveFaresState = { status: "loading", offers: [] };

export function useLiveFares(q: LiveFaresQuery | null): LiveFaresState {
  const [state, setState] = useState<LiveFaresState>(INITIAL);
  const key = JSON.stringify(q);

  useEffect(() => {
    if (!q || !q.originIata || !q.destinationIata) {
      setState({ status: "unavailable", offers: [], reason: "no-route" });
      return;
    }
    if (!amadeusConfigured()) {
      setState({ status: "unavailable", offers: [], reason: "no-key" });
      return;
    }
    if (!q.date) {
      setState({ status: "unavailable", offers: [], reason: "no-date" });
      return;
    }

    let cancelled = false;
    setState(INITIAL);
    searchLiveFares({
      origin: q.originIata,
      destination: q.destinationIata,
      date: q.date,
      adults: q.adults,
      currency: q.currency,
    }).then((res) => {
      if (cancelled) return;
      if (res.state === "ok") {
        setState({ status: "ok", offers: res.offers });
      } else {
        setState({ status: "unavailable", offers: [], reason: res.reason });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

/** Live offers -> flight rows (times + price + badge provenance). */
export function liveRows(
  offers: LiveOffer[],
  origin: CityPlace,
  destination: CityPlace
): ResultRow[] {
  return offers.map((o, i) => ({
    id: `live-${i}`,
    mode: "air" as const,
    route: `${origin.city} → ${destination.city}`,
    detail: `${o.flightNumbers.join(" ")} · ${
      o.stops === 0 ? "nonstop" : `${o.stops} stop${o.stops > 1 ? "s" : ""}`
    }`,
    liveMinutes: o.durationMin || undefined,
    scheduleConfirmed: true,
    departAt: o.departAt,
    live: o.fare,
  }));
}

export function useLiveFareNote(state: LiveFaresState): {
  note: string;
  tone: "warn" | "live" | "neutral";
} {
  return useMemo(() => {
    if (state.status === "loading") {
      return { note: "Fetching live fares…", tone: "neutral" };
    }
    if (state.status === "ok") {
      return state.offers.length > 0
        ? { note: `Live fares loaded — ${state.offers.length} offer${state.offers.length === 1 ? "" : "s"}.`, tone: "live" }
        : { note: "Live source returned no fares for this pair.", tone: "warn" };
    }
    switch (state.reason) {
      case "no-key":
        return {
          note: "Prices unavailable — live fare source not configured. Sorted by duration.",
          tone: "warn",
        };
      case "no-date":
        return {
          note: "Prices unavailable — add a departure date. Sorted by duration.",
          tone: "warn",
        };
      case "no-route":
        return { note: "Prices unavailable — no airport pair.", tone: "warn" };
      default:
        return {
          note: "Prices unavailable — live fare source unreachable. Sorted by duration.",
          tone: "warn",
        };
    }
  }, [state]);
}
