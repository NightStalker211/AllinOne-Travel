"use client";

// Nearby sights card for the Multi-modal tab (Overpass /
// OpenStreetMap): named attractions within 5 km of the destination,
// fetched this session from public Overpass instances. Honest states
// for loading / empty / unavailable — never invented entries.

import { useEffect, useState } from "react";
import { Binoculars, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fetchNearbySights, type PoiResult } from "@/lib/search/overpass";

interface Props {
  city: string;
  lat: number | null;
  lng: number | null;
  cc?: string;
}

export function NearbySightsCard({ city, lat, lng, cc }: Props) {
  const [state, setState] = useState<PoiResult | null>(null);
  const key = `${lat},${lng}`;

  useEffect(() => {
    let cancelled = false;
    setState(null);
    fetchNearbySights(lat, lng, cc ?? null).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="nearby-sights"
      data-poi-state={state?.state ?? "loading"}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <Binoculars size={14} className="text-accent" />
        Sights near {city}
      </h3>

      {!state && (
        <p className="mt-1.5 text-xs text-fg-muted">
          Loading nearby places from OpenStreetMap…
        </p>
      )}

      {state?.state === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="sights-error">
          Nearby sights unavailable (OpenStreetMap Overpass did not answer) —
          no places shown instead of guessed.
        </p>
      )}

      {state?.state === "ok" && state.total === 0 && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="sights-empty">
          No tagged sights within 2.5 km of {city} — OpenStreetMap coverage
          varies by city.
        </p>
      )}

      {state?.state === "ok" && state.total > 0 && (
        <>
          <p className="mt-1.5 text-xs text-fg-muted" data-testid="sights-total">
            {state.total} tagged place{state.total === 1 ? "" : "s"} within 2.5
            km · showing {state.sights.length}
          </p>
          <ul className="mt-2 space-y-1.5">
            {state.sights.map((s) => (
              <li key={s.name} data-testid="sight-row">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${s.name}, ${city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-lg border bg-raised/60 px-3 py-2 transition-colors hover:border-accent"
                  data-testid="sight-link"
                >
                  <span className="truncate text-xs font-semibold text-fg">
                    {s.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <Badge tone="neutral">{s.kind}</Badge>
                    <ExternalLink size={11} className="text-fg-subtle" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-fg-subtle" data-testid="sights-source">
            Live · OpenStreetMap contributors (ODbL) via Overpass · fetched{" "}
            {state.fetchedAt}
          </p>
        </>
      )}
    </div>
  );
}
