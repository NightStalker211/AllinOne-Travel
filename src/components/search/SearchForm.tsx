"use client";

// Hero search form: from/to autocomplete, date, passengers,
// currency + nationality (persisted settings). Submits to /search.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CURRENCIES } from "@/data/currencies";
import { ALL_PASSPORTS } from "@/data/passports";
import { useSettings } from "@/lib/store/settings";
import type { PlaceRef } from "@/lib/types/search";
import { AutocompleteField } from "./AutocompleteField";

function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export interface SearchFormInitial {
  from?: PlaceRef;
  to?: PlaceRef;
  date?: string;
  passengers?: number;
}

export function SearchForm({
  initial,
  compact = false,
  showPrefs = true,
}: {
  initial?: SearchFormInitial;
  compact?: boolean;
  showPrefs?: boolean;
}) {
  const router = useRouter();
  const { currency, nationality, setCurrency, setNationality } = useSettings();

  const [from, setFrom] = useState<PlaceRef | null>(initial?.from ?? null);
  const [to, setTo] = useState<PlaceRef | null>(initial?.to ?? null);
  const [date, setDate] = useState(initial?.date ?? defaultDate());
  const [passengers, setPassengers] = useState(initial?.passengers ?? 1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial?.from) setFrom(initial.from);
    if (initial?.to) setTo(initial.to);
    if (initial?.date) setDate(initial.date);
    if (initial?.passengers) setPassengers(initial.passengers);
    // hydrate once from URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) {
      setError("Pick both a departure and a destination city.");
      return;
    }
    if (from.city === to.city && from.cc === to.cc) {
      setError("Departure and destination are the same city.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({
      from: `${from.city},${from.cc}`,
      to: `${to.city},${to.cc}`,
      date,
      pax: String(passengers),
      cur: currency,
      nat: nationality,
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      data-testid="search-form"
      className="space-y-3"
      aria-label="Search form"
    >
      <div className="relative grid gap-3 sm:grid-cols-2">
        <AutocompleteField
          id="from"
          label="From"
          placeholder="City or airport"
          value={from}
          onChange={setFrom}
          excludeKey={to ? `${to.city}|${to.cc}` : undefined}
        />
        <AutocompleteField
          id="to"
          label="To"
          placeholder="City or airport"
          value={to}
          onChange={setTo}
          excludeKey={from ? `${from.city}|${from.cc}` : undefined}
        />
        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          data-testid="swap"
          className="absolute left-1/2 top-[34px] z-10 hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-surface text-fg-muted shadow-card transition-colors hover:text-fg sm:flex"
        >
          <ArrowLeftRight size={13} />
        </button>
      </div>

      <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-3 sm:grid-cols-3"}>
        <label className="space-y-1.5">
          <span className="block text-xs font-semibold text-fg-muted">Date</span>
          <Input
            type="date"
            aria-label="Departure date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-semibold text-fg-muted">Passengers</span>
          <Input
            type="number"
            aria-label="Passengers"
            min={1}
            max={9}
            value={passengers}
            onChange={(e) =>
              setPassengers(Math.min(9, Math.max(1, Number(e.target.value) || 1)))
            }
          />
        </label>
        {showPrefs && !compact && (
          <>
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-fg-muted">Currency</span>
              <select
                aria-label="Currency"
                data-testid="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 w-full rounded-xl border bg-raised px-3 text-sm text-fg transition-colors hover:border-line focus:border-accent focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-fg-muted">Nationality</span>
              <select
                aria-label="Nationality"
                data-testid="nationality-select"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="h-10 w-full rounded-xl border bg-raised px-3 text-sm text-fg transition-colors hover:border-line focus:border-accent focus:outline-none"
              >
                {ALL_PASSPORTS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {showPrefs && compact && (
          <div className="col-span-2 flex gap-3">
            <label className="flex-1 space-y-1.5">
              <span className="block text-xs font-semibold text-fg-muted">Currency</span>
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 w-full rounded-xl border bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1 space-y-1.5">
              <span className="block text-xs font-semibold text-fg-muted">Nationality</span>
              <select
                aria-label="Nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="h-10 w-full rounded-xl border bg-raised px-3 text-sm text-fg focus:border-accent focus:outline-none"
              >
                {ALL_PASSPORTS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" data-testid="form-error" className="text-xs font-medium text-warn">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" data-testid="search-submit">
        Search
        <ArrowRight size={16} />
      </Button>
    </form>
  );
}
