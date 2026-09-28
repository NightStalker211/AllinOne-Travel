"use client";

// Destination weather strip (Open-Meteo): real forecast numbers only,
// fetched this session — on any failure the strip simply does not
// render (no placeholder values, REBUILD §5 spirit).

import { useEffect, useState } from "react";
import { fetchForecast, type ForecastDay } from "@/lib/search/weather";

interface WeatherState {
  status: "loading" | "ok" | "error";
  days: ForecastDay[];
  fetchedAt?: string;
}

function weekday(date: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
      new Date(`${date}T00:00:00`)
    );
  } catch {
    return date.slice(5);
  }
}

export function WeatherStrip({
  lat,
  lng,
  city,
}: {
  lat: number | null;
  lng: number | null;
  city: string;
}) {
  const [state, setState] = useState<WeatherState>({ status: "loading", days: [] });
  const key = `${lat},${lng}`;

  useEffect(() => {
    if (lat == null || lng == null) {
      setState({ status: "error", days: [] });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", days: [] });
    fetchForecast(lat, lng).then((res) => {
      if (cancelled) return;
      if (res.state === "ok") {
        setState({ status: "ok", days: res.days, fetchedAt: res.fetchedAt });
      } else {
        setState({ status: "error", days: [] });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (state.status !== "ok" || state.days.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-testid="weather-strip"
      title={`Open-Meteo forecast for ${city}, fetched ${state.fetchedAt}`}
    >
      {state.days.map((d) => (
        <span
          key={d.date}
          data-testid="weather-day"
          className="inline-flex items-center gap-1.5 rounded-full border bg-raised px-2.5 py-1 text-[11px] text-fg-muted"
        >
          <span className="font-semibold text-fg">{weekday(d.date)}</span>
          <span className="tabular-nums text-fg">
            {d.tmaxC != null ? `${d.tmaxC}°` : "—"}
            <span className="text-fg-subtle">
              {d.tminC != null ? ` / ${d.tminC}°` : ""}
            </span>
          </span>
          <span>{d.label}</span>
        </span>
      ))}
      <span className="text-[10px] text-fg-subtle">
        Open-Meteo · {state.fetchedAt}
      </span>
    </div>
  );
}
