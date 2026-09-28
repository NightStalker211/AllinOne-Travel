"use client";

// Live rail/bus schedules (REBUILD §7 addendum): a compact block of
// real journeys from the Transitous open-data API, rendered above the
// curated rail/bus rows. Times appear only after a live response in
// this session (scheduleConfirmed), never otherwise.

import { useEffect, useState } from "react";
import { ResultRowView, SkeletonRows } from "./ResultRowView";
import {
  fetchLiveJourneys,
  type JourneyFilter,
  type LiveJourney,
} from "@/lib/search/transitous";
import type { CityPlace, ResultRow } from "@/lib/types/search";

interface LiveJourneysState {
  status: "loading" | "ok" | "error";
  rows: ResultRow[];
  fetchedAt?: string;
}

function buildRows(
  origin: CityPlace,
  destination: CityPlace,
  mode: JourneyFilter,
  journeys: LiveJourney[]
): ResultRow[] {
  return journeys.map((j, i) => ({
    id: `live-journey-${i}`,
    mode,
    route: `${origin.city} → ${destination.city}`,
    detail: `${j.legNames.join(" · ") || "public transport"} · ${
      j.transfers === 0
        ? "direct"
        : `${j.transfers} change${j.transfers > 1 ? "s" : ""}`
    }`,
    liveMinutes: j.durationMin,
    scheduleConfirmed: true,
    departAt: j.departAt,
  }));
}

export function LiveSchedules({
  mode,
  origin,
  destination,
  date,
  onCheck,
}: {
  mode: JourneyFilter;
  origin: CityPlace;
  destination: CityPlace;
  date?: string;
  onCheck: () => void;
}) {
  const [state, setState] = useState<LiveJourneysState>({
    status: "loading",
    rows: [],
  });

  const from = origin.lat != null && origin.lng != null;
  const to = destination.lat != null && destination.lng != null;
  const key = `${origin.key}|${destination.key}|${date ?? ""}|${mode}`;

  useEffect(() => {
    if (!from || !to) {
      setState({ status: "error", rows: [] });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", rows: [] });
    fetchLiveJourneys({
      fromLat: origin.lat!,
      fromLng: origin.lng!,
      toLat: destination.lat!,
      toLng: destination.lng!,
      date,
      filter: mode,
    }).then((res) => {
      if (cancelled) return;
      if (res.state === "ok") {
        setState({
          status: "ok",
          rows: buildRows(origin, destination, mode, res.journeys),
          fetchedAt: res.fetchedAt,
        });
      } else {
        setState({ status: "error", rows: [] });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (state.status === "loading") {
    return (
      <div data-testid="live-schedules-loading">
        <SkeletonRows count={1} />
      </div>
    );
  }
  if (state.status !== "ok" || state.rows.length === 0) return null;

  return (
    <div className="space-y-2" data-testid={`live-${mode}-schedules`}>
      <h2 className="text-sm font-semibold text-fg">
        Live schedules{" "}
        <span className="font-normal text-fg-muted">
          — real journeys fetched at {state.fetchedAt}
        </span>
      </h2>
      {state.rows.map((row) => (
        <ResultRowView key={row.id} row={row} onCheck={onCheck} />
      ))}
      <p data-testid="live-schedules-note" className="text-xs text-fg-muted">
        Times come from Transitous (open GTFS timetable data, queried this
        session) — not a booking. Operators can change schedules; confirm with
        the operator.
      </p>
    </div>
  );
}
