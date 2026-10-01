"use client";

// Live aircraft along the route (OpenSky Network, FEAT-9) — the
// Flights tab card fetches the bounding box around both endpoints
// through the local relay. Rows render only fields the feed sent
// (metres → ft and m/s → kt are exact display conversions; a field
// the feed omitted stays omitted — never a guessed value).

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import {
  fetchAircraftStates,
  type OpenSkyResult,
} from "@/lib/search/opensky";
import type { CityPlace } from "@/lib/types/search";

interface Props {
  origin: CityPlace;
  destination: CityPlace;
}

const MAX_ROWS = 10;

const ERROR_TEXT: Record<string, string> = {
  "not-configured":
    "Aircraft tracking is not configured in this build — nothing shown instead of guessed.",
  "bad-request":
    "OpenSky rejected the route bounding box — nothing shown instead of guessed.",
  unavailable:
    "OpenSky did not answer — nothing shown instead of guessed.",
};

const ft = (m: number): string =>
  `${Math.round(m * 3.28084).toLocaleString("en-US")} ft`;
const kt = (v: number): string => `${Math.round(v * 1.94384)} kt`;

export function OpenSkyTrackCard({ origin, destination }: Props) {
  const [state, setState] = useState<OpenSkyResult | null>(null);

  const lat1 = origin.lat;
  const lng1 = origin.lng;
  const lat2 = destination.lat;
  const lng2 = destination.lng;
  const ready =
    lat1 != null && lng1 != null && lat2 != null && lng2 != null;

  useEffect(() => {
    if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) {
      setState(null);
      return;
    }
    let cancelled = false;
    setState(null);
    fetchAircraftStates({
      south: Math.min(lat1, lat2) - 0.5,
      west: Math.min(lng1, lng2) - 0.5,
      north: Math.max(lat1, lat2) + 0.5,
      east: Math.max(lng1, lng2) + 0.5,
    }).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat1, lng1, lat2, lng2]);

  if (!ready) return null;

  const aircraft =
    state?.state === "ok"
      ? [...state.aircraft].sort((a, b) => {
          if (a.onGround !== b.onGround) return a.onGround ? 1 : -1;
          const altA = a.baroAltitude ?? -Infinity;
          const altB = b.baroAltitude ?? -Infinity;
          return altB - altA;
        })
      : [];

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="opensky-track"
      data-opensky-state={!state ? "loading" : state.state}
    >
      <h3 className="flex items-center gap-2 truncate text-sm font-semibold text-fg">
        <Plane size={14} className="shrink-0 text-accent" />
        Aircraft · {origin.city} → {destination.city}
      </h3>

      {!state && (
        <p
          className="mt-1.5 text-xs text-fg-muted"
          data-testid="opensky-loading"
        >
          Fetching live aircraft positions along the route…
        </p>
      )}

      {state?.state === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="opensky-error">
          {ERROR_TEXT[state.reason] ?? ERROR_TEXT.unavailable}
        </p>
      )}

      {state?.state === "ok" && state.aircraft.length === 0 && (
        <p
          className="mt-1.5 text-xs text-fg-muted"
          data-testid="opensky-empty"
        >
          OpenSky reports no aircraft inside this route area right now —
          nothing shown instead of guessed.
        </p>
      )}

      {state?.state === "ok" && state.aircraft.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {aircraft.slice(0, MAX_ROWS).map((a) => (
            <li
              key={a.icao24}
              data-testid="opensky-row"
              className="flex items-center justify-between gap-2 rounded-xl border bg-raised/60 px-3 py-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-fg">
                  {a.callsign || a.icao24}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-fg-muted">
                  {a.country || "country not reported"}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end text-[11px] text-fg-muted tabular-nums">
                {a.onGround ? (
                  <span className="text-[10px] font-semibold text-warn">
                    on ground
                  </span>
                ) : (
                  <>
                    {a.baroAltitude != null && <span>{ft(a.baroAltitude)}</span>}
                    {a.velocity != null && <span>{kt(a.velocity)}</span>}
                  </>
                )}
                {a.trueTrack != null && <span>{Math.round(a.trueTrack)}°</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {state?.state === "ok" &&
        state.aircraft.length > MAX_ROWS && (
          <p
            className="mt-1.5 text-[11px] text-fg-muted"
            data-testid="opensky-more"
          >
            +{state.aircraft.length - MAX_ROWS} more aircraft in this area
            (list capped at {MAX_ROWS}).
          </p>
        )}

      {state?.state === "ok" && (
        <p
          className="mt-2 text-[11px] text-fg-subtle"
          data-testid="opensky-source"
        >
          Live · OpenSky Network · fetched {state.fetchedAt} · aircraft inside
          the route&apos;s bounding box
        </p>
      )}
    </div>
  );
}
