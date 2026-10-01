"use client";

// Live Deutsche Bahn station board for the Rail tab (FEAT-9) —
// rendered only when a route endpoint is in Germany. Station, the
// two-hour window and every row come from the IRIS feed of this
// session; failure renders an honest note (REBUILD §5.1, §5.5).

import { useEffect, useState } from "react";
import { TrainFront } from "lucide-react";
import {
  fetchDbBoard,
  searchDbStations,
  type DbBoard,
  type DbErrorReason,
  type DbStation,
} from "@/lib/search/db";

interface Props {
  city: string;
  railName?: string;
}

type CardState =
  | { phase: "loading" }
  | { phase: "error"; reason: DbErrorReason }
  | { phase: "ok"; board: DbBoard };

const MAX_ROWS = 14;

const ERROR_TEXT: Record<string, string> = {
  "not-configured":
    "Deutsche Bahn timetables are not configured in this build — nothing shown instead of guessed.",
  "bad-request":
    "Deutsche Bahn rejected the request — nothing shown instead of guessed.",
  "no-data":
    "Deutsche Bahn has no timetable for this station in this window — nothing shown instead of guessed.",
  unavailable:
    "Deutsche Bahn did not answer — nothing shown instead of guessed.",
  "no-station":
    "No Deutsche Bahn station matched this city — nothing shown instead of guessed.",
};

/** Prefer an Hbf for the requested city; never adopt an unrelated town. */
function pickStation(stations: DbStation[], city: string): DbStation | null {
  const n = city.toLowerCase();
  const inCity = stations.filter((s) => s.name.toLowerCase().includes(n));
  return (
    inCity.find((s) => /(hbf|bahnhof)/.test(s.name.toLowerCase())) ??
    inCity[0] ??
    null
  );
}

export function DbDeparturesCard({ city, railName }: Props) {
  const [state, setState] = useState<CardState | null>(null);
  const [segment, setSegment] = useState<"departure" | "arrival">("departure");

  useEffect(() => {
    let cancelled = false;
    setState(null);
    setSegment("departure");
    (async () => {
      const candidates = [
        ...new Set(
          [railName, `${city} Hbf`, city].filter(
            (q): q is string => Boolean(q && q.trim())
          )
        ),
      ];
      for (const q of candidates) {
        const found = await searchDbStations(q);
        if (cancelled) return;
        if (found.state === "error") {
          setState({ phase: "error", reason: found.reason });
          return;
        }
        const station = pickStation(found.stations, city);
        if (!station) continue;
        const res = await fetchDbBoard(station.eva);
        if (cancelled) return;
        if (res.state === "error") {
          setState({ phase: "error", reason: res.reason });
          return;
        }
        setSegment(res.board.departures.length > 0 ? "departure" : "arrival");
        setState({ phase: "ok", board: res.board });
        return;
      }
      if (!cancelled) setState({ phase: "error", reason: "no-station" });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, railName]);

  const board = state?.phase === "ok" ? state.board : null;
  const rows =
    board && segment === "arrival" ? board.arrivals : board?.departures ?? [];

  return (
    <div
      className="rounded-2xl border bg-raised p-4"
      data-testid="db-departures"
      data-db-state={!state ? "loading" : state.phase === "ok" ? "ok" : "error"}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
        <TrainFront size={14} className="text-accent" />
        Station board · {city}
      </h3>

      {!state && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="db-loading">
          Resolving the Deutsche Bahn station and fetching the live board…
        </p>
      )}

      {state?.phase === "error" && (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="db-error">
          {ERROR_TEXT[state.reason] ?? ERROR_TEXT.unavailable}
        </p>
      )}

      {state?.phase === "ok" && (
        <>
          <p
            className="mt-1.5 text-[11px] text-fg-subtle"
            data-testid="db-window"
          >
            {state.board.station} · {state.board.windowLabel} (Europe/Berlin)
          </p>

          {state.board.departures.length === 0 &&
          state.board.arrivals.length === 0 ? (
            <p className="mt-1.5 text-xs text-fg-muted" data-testid="db-empty">
              Deutsche Bahn returned no stops for this station in the window
              above — nothing shown instead of guessed.
            </p>
          ) : (
            <>
              <div className="mt-2 flex gap-1">
                {state.board.departures.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSegment("departure")}
                    data-testid="db-seg-dep"
                    aria-pressed={segment === "departure"}
                    className={
                      segment === "departure"
                        ? "rounded-lg border border-accent px-2 py-1 text-[11px] font-semibold text-accent"
                        : "rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-fg-muted"
                    }
                  >
                    Departures ({state.board.departures.length})
                  </button>
                )}
                {state.board.arrivals.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSegment("arrival")}
                    data-testid="db-seg-arr"
                    aria-pressed={segment === "arrival"}
                    className={
                      segment === "arrival"
                        ? "rounded-lg border border-accent px-2 py-1 text-[11px] font-semibold text-accent"
                        : "rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-fg-muted"
                    }
                  >
                    Arrivals ({state.board.arrivals.length})
                  </button>
                )}
              </div>
              <ul className="mt-2 space-y-1.5">
                {rows.slice(0, MAX_ROWS).map((r) => (
                  <li
                    key={`${r.kind}-${r.id}`}
                    data-testid="db-row"
                    className="flex items-center justify-between gap-2 rounded-xl border bg-raised/60 px-3 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-fg tabular-nums">
                        <span className="mr-1.5">{r.time.slice(11)}</span>
                        {r.train || "—"}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-fg-muted">
                        {r.direction
                          ? r.kind === "departure"
                            ? `→ ${r.direction}`
                            : `← ${r.direction}`
                          : "\u00A0"}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      {(r.changedPlatform || r.platform) && (
                        <span className="text-xs text-fg-muted tabular-nums">
                          Pl. {r.changedPlatform ?? r.platform}
                          {r.changedPlatform &&
                            r.platform &&
                            r.changedPlatform !== r.platform && (
                              <span className="ml-1 text-fg-subtle">
                                was {r.platform}
                              </span>
                            )}
                        </span>
                      )}
                      {r.delayMinutes != null && r.delayMinutes !== 0 && (
                        <span className="text-[10px] font-semibold text-warn tabular-nums">
                          {r.delayMinutes > 0
                            ? `+${r.delayMinutes} min`
                            : `${r.delayMinutes} min`}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {rows.length > MAX_ROWS && (
                <p
                  className="mt-1.5 text-[11px] text-fg-muted"
                  data-testid="db-more"
                >
                  +{rows.length - MAX_ROWS} more in this window — the board is
                  capped at {MAX_ROWS} rows.
                </p>
              )}
            </>
          )}
          <p
            className="mt-2 text-[11px] text-fg-subtle"
            data-testid="db-source"
          >
            Live · Deutsche Bahn · fetched {state.board.fetchedAt} · times
            station-local (Europe/Berlin)
            {!state.board.changesAvailable &&
              " · live changes feed unavailable (planned times only)"}
          </p>
        </>
      )}
    </div>
  );
}
