"use client";

// Today's live departure board (AviationStack) for the Flights tab.
// Flight numbers, destinations, local times and statuses are live
// session data with the fetch time — no scheduled times are shown
// without a source (REBUILD §5.1). Failure renders an honest note.

import { useEffect, useState } from "react";
import { PlaneTakeoff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  departuresConfigured,
  fetchDepartures,
  type DeparturesResult,
} from "@/lib/search/aviationstack";

interface Props {
  city: string;
  iata: string | null;
}

const STATUS_TONE: Record<string, "neutral" | "accent" | "warn"> = {
  scheduled: "neutral",
  active: "accent",
  delayed: "warn",
};

export function DeparturesCard({ city, iata }: Props) {
  const [state, setState] = useState<DeparturesResult | null>(null);
  const code = (iata ?? "").toUpperCase();

  useEffect(() => {
    if (!code) {
      setState(null);
      return;
    }
    let cancelled = false;
    setState(null);
    fetchDepartures(code).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!code || !departuresConfigured()) return null;

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="departures-card"
      data-departures-state={!state ? "loading" : state.state}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <PlaneTakeoff size={14} className="text-accent" />
        Departures · {city} ({code})
      </h3>

      {!state && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="departures-loading">
          Fetching today&apos;s live departure board…
        </p>
      )}

      {state?.state === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="departures-error">
          {state.reason === "no-airport"
            ? "No airport code for this origin — board not shown."
            : "Departure board unavailable (AviationStack did not answer) — nothing shown instead of guessed."}
        </p>
      )}

      {state?.state === "ok" && state.rows.length === 0 && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="departures-empty">
          No upcoming departures on today&apos;s board from {code} — AviationStack
          returned none.
        </p>
      )}

      {state?.state === "ok" && state.rows.length > 0 && (
        <>
          <ul className="mt-2 space-y-1.5">
            {state.rows.map((r) => (
              <li
                key={`${r.flightNo}-${r.scheduledLocal}`}
                data-testid="departure-row"
                className="flex items-center justify-between gap-2 rounded-xl border bg-raised/60 px-3 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-fg tabular-nums">
                    {r.flightNo}
                    {r.airline && (
                      <span className="ml-1.5 font-normal text-fg-muted">
                        {r.airline}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-fg-muted">
                    → {r.destinationIata ? `${r.destinationIata} ` : ""}
                    {r.destinationAirport ?? ""}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-fg tabular-nums">
                    {r.scheduledLocal}
                    {r.estimatedLocal && (
                      <span className="ml-1 text-fg-muted line-through decoration-fg-subtle/60">
                        {r.estimatedLocal}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>
                      {r.status}
                    </Badge>
                    {r.delayMin != null && r.delayMin > 0 && (
                      <span className="text-[10px] font-semibold text-warn tabular-nums">
                        +{r.delayMin} min
                      </span>
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-fg-subtle" data-testid="departures-source">
            Live · AviationStack · fetched {state.fetchedAt} · times local at{" "}
            {code}, delays as reported by the airport
          </p>
        </>
      )}
    </div>
  );
}
