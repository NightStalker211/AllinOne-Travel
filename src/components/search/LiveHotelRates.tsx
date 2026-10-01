"use client";

// Live hotel rates for the Stays tab (Booking.com first, Expedia
// fallback — FEAT-8). Prices only inside PriceBadge —
// [data-live-price] with the "Live · <provider> · HH:MM" badge and
// the provider's stay-basis context line (REBUILD §5.1.3).
// Failure renders an honest state, never an estimate; the curated
// provider cards below stay price-free.

import { useEffect, useState } from "react";
import { BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceBadge } from "@/components/search/PriceBadge";
import {
  hotelsConfigured,
  searchLiveHotels,
  type HotelsResult,
} from "@/lib/search/booking";

interface Props {
  city: string;
  lat: number | null;
  lng: number | null;
  cc: string;
  checkIn?: string;
  checkOut?: string;
  adults: number;
  currency: string;
}

function nightsBetween(a: string, b: string): number {
  const ms = Date.parse(b) - Date.parse(a);
  if (!Number.isFinite(ms)) return 0;
  return Math.round(ms / 86400000);
}

export function LiveHotelRates({
  city,
  lat,
  lng,
  cc,
  checkIn,
  checkOut,
  adults,
  currency,
}: Props) {
  const [state, setState] = useState<HotelsResult | null>(null);
  const key = `${city},${lat},${lng},${cc},${checkIn},${checkOut},${adults},${currency}`;

  useEffect(() => {
    if (lat == null || lng == null || !checkIn || !checkOut) {
      setState(null);
      return;
    }
    let cancelled = false;
    setState(null);
    searchLiveHotels({
      city,
      lat,
      lng,
      cc,
      checkIn,
      checkOut,
      adults,
      currency,
    }).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!hotelsConfigured() || lat == null || lng == null || !checkIn || !checkOut) {
    return null;
  }
  if (!state) {
    return (
      <div
        className="rounded-2xl border bg-raised p-4"
        data-testid="live-hotels"
        data-hotels-state="loading"
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
          <BedDouble size={14} className="text-accent" />
          Live rates near {city}
        </h3>
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="live-hotels-loading">
          Fetching live room rates for {checkIn} → {checkOut}…
        </p>
      </div>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const stayLabel =
    nights > 0
      ? `${checkIn} → ${checkOut} · ${nights} night${nights === 1 ? "" : "s"} · room total`
      : `${checkIn} · room total`;

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="live-hotels"
      data-hotels-state={state.state === "ok" ? "ok" : "error"}
      data-hotels-reason={state.state === "error" ? state.reason : undefined}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <BedDouble size={14} className="text-accent" />
        Live rates near {city}
      </h3>

      {state.state === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="live-hotels-error">
          {state.reason === "no-date"
            ? "Pick travel dates to see live room rates."
            : state.reason === "same-day"
              ? "Check-out must be after check-in — no rates shown for a same-day stay."
              : state.reason === "rate-limit"
                ? "The live rate providers' monthly request quota is spent — no rates shown this month instead of guessed."
                : `${state.provider ?? "Live providers"} did not answer — no rates shown instead of guessed.`}
        </p>
      )}

      {state.state === "ok" && state.offers.length === 0 && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="live-hotels-empty">
          {state.provider === "Expedia"
            ? `Expedia returned no bookable rooms in ${city} for`
            : `Booking.com returned no bookable rooms within 60 km of ${city} for`}
          {checkIn} → {checkOut} — nothing shown instead of invented.
        </p>
      )}

      {state.state === "ok" && state.offers.length > 0 && (
        <>
          <p className="mt-1.5 text-xs text-fg-muted" data-testid="live-hotels-total">
            {state.offers.length} live rate{state.offers.length === 1 ? "" : "s"} ·{" "}
            {state.provider === "Expedia"
              ? "top matches for your stay"
              : "nearest first (max 60 km)"}
          </p>
          <ul className="mt-2 space-y-1.5">
            {state.offers.map((o) => (
              <li
                key={o.hotelId || o.name}
                data-testid="live-hotel-row"
                className="flex items-center justify-between gap-3 rounded-xl border bg-raised/60 px-3 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-fg">
                    {o.name}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-fg-muted">
                    {o.stars && <span>{o.stars}★</span>}
                    {o.score != null && (
                      <span className="font-semibold text-fg">
                        ★ {o.score.toFixed(1)}
                        {o.reviews != null ? ` (${o.reviews.toLocaleString("en-US")})` : ""}
                      </span>
                    )}
                    {o.distanceKm != null && (
                      <span>{o.distanceKm.toFixed(1)} km from centre</span>
                    )}
                    {o.freeCancellation && (
                      <Badge tone="accent">Free cancellation</Badge>
                    )}
                  </span>
                </span>
                <PriceBadge
                  fare={{
                    price: o.price.value,
                    currency: o.price.currency,
                    source: o.source,
                    fetchedAt: state.fetchedAt,
                  }}
                  context={o.stayContext ?? stayLabel}
                />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-fg-subtle" data-testid="live-hotels-source">
            Live · {state.provider} room rates · fetched {state.fetchedAt} · prices
            for the selected stay, as quoted by the provider
          </p>
        </>
      )}
    </div>
  );
}
