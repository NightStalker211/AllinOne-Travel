"use client";

// Cheapest quoted fare between the searched airports (Skyscanner
// via RapidAPI) for the Flights tab. The figure comes from
// Skyscanner's 12-month calendar — any upcoming date, not the
// searched one — so it renders as its own card with an explicit
// any-date context inside PriceBadge ([data-live-price],
// "Live · Skyscanner · HH:MM"). Failure renders an honest note,
// never an estimate (REBUILD §5).

import { useEffect, useState } from "react";
import { BadgeDollarSign } from "lucide-react";
import { PriceBadge } from "@/components/search/PriceBadge";
import {
  fetchCheapestFare,
  skyscannerConfigured,
  type CheapestResult,
} from "@/lib/search/skyscanner";

interface Props {
  originCity: string;
  destinationCity: string;
  originIata: string | null;
  destinationIata: string | null;
}

export function SkyscannerFareCard({
  originCity,
  destinationCity,
  originIata,
  destinationIata,
}: Props) {
  const [state, setState] = useState<CheapestResult | null>(null);
  const o = (originIata ?? "").toUpperCase();
  const d = (destinationIata ?? "").toUpperCase();

  useEffect(() => {
    if (!o || !d) {
      setState(null);
      return;
    }
    let cancelled = false;
    setState(null);
    fetchCheapestFare(o, d).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o, d]);

  if (!o || !d || !skyscannerConfigured()) return null;

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="skyscanner-fare-card"
      data-skyscanner-state={!state ? "loading" : state.state}
      data-skyscanner-reason={
        state?.state === "error" ? state.reason : undefined
      }
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <BadgeDollarSign size={14} className="text-accent" />
        Cheapest fare · {originCity} → {destinationCity}
      </h3>

      {!state && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="skyscanner-loading">
          Asking Skyscanner for the cheapest quoted fare on this route…
        </p>
      )}

      {state?.state === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="skyscanner-error">
          {state.reason === "no-route"
            ? "No airport pair for this route — fare not shown."
            : state.reason === "no-fare"
              ? "Skyscanner has no quoted fare for this route right now — nothing shown instead of guessed."
              : state.reason === "rate-limit"
                ? "Skyscanner's monthly request quota is spent — no fare shown this month instead of guessed."
                : "Cheapest-fare lookup unavailable (Skyscanner did not answer) — nothing shown instead of guessed."}
        </p>
      )}

      {state?.state === "ok" && (
        <>
          <div className="mt-2 flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-fg">
                {state.fare.routeTitle || `${originCity} → ${destinationCity}`}
              </span>
              <span className="mt-0.5 block text-[11px] text-fg-muted">
                Lowest quote on the 12-month calendar — any upcoming date, not
                your travel date.
              </span>
              {state.fare.direct === true && (
                <span className="mt-1 inline-block">
                  <span className="text-[11px] font-semibold text-accent">
                    cheapest quote is nonstop
                  </span>
                </span>
              )}
            </span>
            <PriceBadge
              fare={{
                price: state.fare.price,
                currency: state.fare.currency,
                source: state.fare.source,
                fetchedAt: state.fare.fetchedAt,
              }}
              context={[
                "cheapest quoted fare · any upcoming date",
                state.fare.quotedAt ? `quoted ${state.fare.quotedAt}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            />
          </div>
          <p className="mt-2 text-[11px] text-fg-subtle" data-testid="skyscanner-source">
            Live · Skyscanner · fetched {state.fare.fetchedAt} · as quoted by
            Skyscanner (currency shown as returned)
          </p>
        </>
      )}
    </div>
  );
}
