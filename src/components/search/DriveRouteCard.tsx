"use client";

// Driving card for the Multi-modal tab (OSRM, keyless): real road
// distance + driving time fetched this session, labelled with the
// source and fetch time. Failure renders an honest note — never a
// guessed distance.

import { useEffect, useState } from "react";
import { Car, ExternalLink } from "lucide-react";
import { fetchDriveRoute, type DriveRoute } from "@/lib/search/osrm";

interface Props {
  origin: { city: string; lat: number | null; lng: number | null };
  destination: { city: string; lat: number | null; lng: number | null };
}

type State =
  | { status: "loading" }
  | { status: "ok"; route: DriveRoute }
  | { status: "error"; reason: string };

function formatDriveTime(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function DriveRouteCard({ origin, destination }: Props) {
  const [state, setState] = useState<State>({ status: "loading" });
  const key = `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`;

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchDriveRoute(origin, destination).then((res) => {
      if (cancelled) return;
      setState(
        res.state === "ok"
          ? { status: "ok", route: res.route }
          : { status: "error", reason: res.reason }
      );
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const mapsHref =
    origin.lat != null &&
    origin.lng != null &&
    destination.lat != null &&
    destination.lng != null
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`
      : null;

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="drive-route"
      data-drive-state={state.status}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <Car size={14} className="text-accent" />
        Driving {origin.city} → {destination.city}
      </h3>

      {state.status === "loading" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="drive-loading">
          Fetching the road route from OSRM…
        </p>
      )}

      {state.status === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="drive-error">
          Road route unavailable (OSRM did not answer) — driving distance not
          shown instead of guessed.
        </p>
      )}

      {state.status === "ok" && (
        <>
          <p className="mt-1.5 text-sm text-fg" data-testid="drive-summary">
            <span className="font-semibold">
              {Math.round(state.route.km).toLocaleString("en-US")} km
            </span>{" "}
            by road · about {formatDriveTime(state.route.minutes)} behind the
            wheel
          </p>
          <p className="mt-1 text-[11px] text-fg-subtle" data-testid="drive-source">
            Live · OSRM (open road routing) · fetched {state.route.fetchedAt} ·
            no live traffic
          </p>
          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              data-testid="drive-directions"
            >
              Open driving directions
              <ExternalLink size={11} />
            </a>
          )}
        </>
      )}
    </div>
  );
}
