"use client";

// Capital + currency facts for the Explore country panel. The facts
// are curated (src/data/country-facts.ts); the exchange rate next to
// them is live ECB data via Frankfurter — fetched this session, shown
// only with its source and reference date, and only when it differs
// from the user's quote currency. On any failure only the curated
// facts remain; no rate is ever guessed.

import { useEffect, useState } from "react";
import { countryFacts } from "@/data/country-facts";
import { fetchEcbRate, formatRate } from "@/lib/search/fx";

type FxState =
  | { status: "skip" }
  | { status: "loading" }
  | { status: "ok"; rate: number; date: string }
  | { status: "error"; reason: string };

export function CountryFactsBlock({
  cc,
  userCurrency,
}: {
  cc: string;
  userCurrency: string;
}) {
  const facts = countryFacts(cc);
  const sameCurrency =
    facts != null && /^[A-Z]{3}$/.test(userCurrency)
      ? facts.currency === userCurrency
      : false;
  const [fx, setFx] = useState<FxState>(
    facts && !sameCurrency ? { status: "loading" } : { status: "skip" }
  );

  useEffect(() => {
    if (!facts || sameCurrency) {
      setFx({ status: "skip" });
      return;
    }
    let cancelled = false;
    setFx({ status: "loading" });
    fetchEcbRate(facts.currency, userCurrency).then((res) => {
      if (cancelled) return;
      setFx(
        res.state === "ok"
          ? { status: "ok", rate: res.rate, date: res.date }
          : { status: "error", reason: res.reason }
      );
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facts?.currency, userCurrency]);

  if (!facts) return null;

  return (
    <div
      className="rounded-xl border bg-raised px-3 py-2.5 text-xs"
      data-testid="country-facts"
    >
      <p className="text-fg-muted">
        Capital{" "}
        <span className="font-semibold text-fg" data-testid="country-capital">
          {facts.capital}
        </span>
      </p>
      <p className="mt-0.5 text-fg-muted">
        Currency{" "}
        <span className="font-semibold text-fg" data-testid="country-currency">
          {facts.currencyName} ({facts.currency})
        </span>
      </p>
      {fx.status === "ok" && (
        <p className="mt-1 text-fg-subtle" data-testid="country-fx">
          1 {facts.currency} = {formatRate(fx.rate)} {userCurrency} · ECB
          reference rate, {fx.date} · Frankfurter
        </p>
      )}
    </div>
  );
}
