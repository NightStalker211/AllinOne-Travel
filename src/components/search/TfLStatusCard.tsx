"use client";

// London network status (Transport for London) for the Rail tab
// when either endpoint is London. Line statuses are live session
// data with the fetch time; "good service" is stated only when the
// provider says so (REBUILD §5.1).

import { useEffect, useState } from "react";
import { TrainFront } from "lucide-react";
import {
  tflConfigured,
  fetchTflStatuses,
  type TflResult,
} from "@/lib/search/tfl";

export function TfLStatusCard() {
  const [state, setState] = useState<TflResult | null>(null);

  useEffect(() => {
    if (!tflConfigured()) {
      setState(null);
      return;
    }
    let cancelled = false;
    setState(null);
    fetchTflStatuses().then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tflConfigured()) return null;

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="tfl-status"
      data-tfl-state={!state ? "loading" : state.state}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <TrainFront size={14} className="text-accent" />
        London network status
      </h3>

      {!state && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="tfl-loading">
          Fetching live line statuses…
        </p>
      )}

      {state?.state === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="tfl-error">
          Network status unavailable (Transport for London did not answer) —
          nothing shown instead of guessed.
        </p>
      )}

      {state?.state === "ok" && state.issues.length === 0 && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="tfl-good">
          Good service on all {state.totalCount} monitored lines (Tube, DLR,
          Overground, Elizabeth line, tram).
        </p>
      )}

      {state?.state === "ok" && state.issues.length > 0 && (
        <>
          <ul className="mt-2 space-y-1.5">
            {state.issues.map((l) => (
              <li
                key={`${l.line}-${l.mode}`}
                data-testid="tfl-issue"
                className="flex items-center justify-between gap-2 rounded-xl border bg-raised/60 px-3 py-2"
              >
                <span className="truncate text-xs font-semibold text-fg">
                  {l.line}
                  <span className="ml-1.5 font-normal text-fg-subtle">{l.mode}</span>
                </span>
                <span className="shrink-0 text-[11px] font-medium text-warn">
                  {l.status}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11px] text-fg-muted" data-testid="tfl-good">
            {state.goodCount} other line{state.goodCount === 1 ? "" : "s"} good
            service.
          </p>
        </>
      )}

      {state?.state === "ok" && (
        <p className="mt-2 text-[11px] text-fg-subtle" data-testid="tfl-source">
          Live · Transport for London · fetched {state.fetchedAt}
        </p>
      )}
    </div>
  );
}
