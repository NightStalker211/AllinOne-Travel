"use client";

// ============================================================
// AllinOne Travel — /search results screen
// URL-driven, segmented sub-tabs, live fares merged over curated
// rows, deep-link dialogs, honest empty states (REBUILD §8).
// ============================================================

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Plane, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchForm } from "@/components/search/SearchForm";
import { SegmentedTabs, type TabDef } from "@/components/search/SegmentedTabs";
import { DeepLinkDialog } from "@/components/search/DeepLinkDialog";
import { VisaPanel } from "@/components/search/VisaPanel";
import { LiveSchedules } from "@/components/search/LiveSchedules";
import { WeatherStrip } from "@/components/search/WeatherStrip";
import {
  EmptyState,
  ResultRowView,
  SkeletonRows,
} from "@/components/search/ResultRowView";
import { buildSearch } from "@/lib/search/engine";
import { liveRows, useLiveFares, useLiveFareNote } from "@/lib/search/useLiveFares";
import { preferredAirports } from "@/data/known-routes";
import { SEARCH_LINKS, type SearchLinkMode, type SearchLinkParams } from "@/lib/search-links";
import { useSettings } from "@/lib/store/settings";
import type { PlaceRef, ResultRow, TabKey } from "@/lib/types/search";

function parsePlace(raw: string | null): PlaceRef | null {
  if (!raw) return null;
  const idx = raw.lastIndexOf(",");
  if (idx <= 0) return null;
  const city = raw.slice(0, idx);
  const cc = raw.slice(idx + 1);
  if (!/^[A-Z]{2}$/.test(cc)) return null;
  return { city, cc };
}

function addNight(d?: string): string | undefined {
  if (!d) return undefined;
  const x = new Date(`${d}T00:00:00`);
  if (Number.isNaN(x.getTime())) return undefined;
  x.setDate(x.getDate() + 1);
  return x.toISOString().slice(0, 10);
}

function NoteLine({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "warn" | "live" }) {
  return (
    <p
      data-testid="sort-note"
      className={
        tone === "warn"
          ? "text-xs font-medium text-warn"
          : tone === "live"
            ? "text-xs font-medium text-live"
            : "text-xs text-fg-muted"
      }
    >
      {children}
    </p>
  );
}

function StaysPanel({
  city,
  date,
  passengers,
  onOpen,
}: {
  city: string;
  date?: string;
  passengers: number;
  onOpen: (mode: SearchLinkMode) => void;
}) {
  return (
    <div className="space-y-3" data-testid="stays-panel">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {SEARCH_LINKS.hotels.map((l) => (
          <a
            key={l.label}
            href={l.href({ city, checkIn: date, checkOut: addNight(date), passengers })}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-2 rounded-xl border bg-raised px-4 py-3 transition-colors hover:border-accent"
            data-testid="stay-card"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-fg">
              <span className="truncate">{l.label}</span>
              {l.region && <Badge tone="warn">{l.region}</Badge>}
            </span>
            <ExternalLink size={14} className="shrink-0 text-fg-subtle group-hover:text-accent" />
          </a>
        ))}
      </div>
      <NoteLine>
        No prices here — providers show their live rates on their own sites.
        We never guess what a room costs.
      </NoteLine>
      <Button variant="outline" size="sm" onClick={() => onOpen("hotels")}>
        Open all stay searches for {city}
      </Button>
    </div>
  );
}

function SearchScreen() {
  const params = useSearchParams();
  const { currency, nationality, setCurrency, setNationality } = useSettings();

  const from = useMemo(() => parsePlace(params.get("from")), [params]);
  const to = useMemo(() => parsePlace(params.get("to")), [params]);
  const date = params.get("date") ?? undefined;
  const pax = Math.min(9, Math.max(1, Number(params.get("pax") ?? 1)));
  const cur = params.get("cur");
  const nat = params.get("nat");
  const effectiveNat = nat && /^[A-Z]{2}$/.test(nat) ? nat : nationality;

  // hydrate persisted settings from the URL once
  useEffect(() => {
    if (cur && cur !== currency) setCurrency(cur);
    if (nat && /^[A-Z]{2}$/.test(nat) && nat !== nationality) setNationality(nat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, nat]);

  const [tab, setTab] = useState<TabKey>("multi");
  const [dialog, setDialog] = useState<SearchLinkMode | null>(null);

  const engineKey = `${from?.city}|${from?.cc}|${to?.city}|${to?.cc}|${date}|${pax}|${effectiveNat}`;
  const engineResult = useMemo(() => {
    if (!from || !to) return null;
    return buildSearch({
      from,
      to,
      date,
      passengers: pax,
      nationality: effectiveNat,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineKey]);

  const outcome = engineResult?.ok ? engineResult.outcome : null;

  const primary = useMemo(() => {
    if (!outcome) return null;
    const originIatas = outcome.origin.iatas;
    const destIatas = outcome.destination.iatas;
    if (originIatas.length === 0 || destIatas.length === 0) return null;
    return preferredAirports(originIatas, destIatas);
  }, [outcome]);

  const live = useLiveFares(
    outcome && primary
      ? {
          originIata: primary.from,
          destinationIata: primary.to,
          date,
          adults: pax,
          currency,
        }
      : null
  );
  const liveNote = useLiveFareNote(live);

  const { flightRows, allLive } = useMemo(() => {
    if (!outcome) return { flightRows: [] as ResultRow[], allLive: false };
    const rows = [...liveRows(live.offers, outcome.origin, outcome.destination), ...outcome.flights.rows];
    const all = rows.length > 0 && rows.every((r) => Boolean(r.live));
    const byDuration = (a: ResultRow, b: ResultRow) =>
      (a.liveMinutes ?? a.estMinutes ?? 9e9) - (b.liveMinutes ?? b.estMinutes ?? 9e9);
    if (all) rows.sort((a, b) => (a.live?.price ?? 0) - (b.live?.price ?? 0));
    else rows.sort(byDuration);
    return { flightRows: rows, allLive: all };
  }, [outcome, live.offers]);

  const dialogParams: SearchLinkParams = useMemo(
    () => ({
      origin: outcome?.origin.city,
      destination: outcome?.destination.city,
      date,
      passengers: pax,
      city: outcome?.destination.city,
      checkIn: date,
      checkOut: addNight(date),
    }),
    [outcome, date, pax]
  );

  if (!from || !to || !engineResult || !outcome) {
    return (
      <Card className="space-y-3 p-6" data-testid="search-error">
        <h1 className="font-display text-xl font-bold">Search needs a route</h1>
        <p className="text-sm text-fg-muted">
          {engineResult && !engineResult.ok
            ? engineResult.error
            : "Pick a departure and destination city to see results."}
        </p>
        <Link href="/">
          <Button variant="outline">Back to search</Button>
        </Link>
      </Card>
    );
  }

  const tabs: TabDef[] = [
    { key: "multi", label: "Multi-modal" },
    { key: "flights", label: "Flights", count: flightRows.length },
    { key: "rail", label: "Rail", count: outcome.rail.rows.length },
    { key: "bus", label: "Bus", count: outcome.bus.rows.length },
    { key: "ferry", label: "Ferry", count: outcome.ferry.rows.length },
    { key: "stays", label: "Stays", count: SEARCH_LINKS.hotels.length },
    { key: "visa", label: "Visa" },
  ];

  return (
    <div className="animate-fade-up space-y-6" data-testid="search-page">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          New search
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {outcome.origin.city}{" "}
            <span className="text-accent">→</span> {outcome.destination.city}
          </h1>
          <span className="text-sm text-fg-muted">
            {outcome.origin.flag} {outcome.origin.country} → {outcome.destination.flag}{" "}
            {outcome.destination.country}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {date && <Badge tone="neutral">{date}</Badge>}
          <Badge tone="neutral">
            {pax} passenger{pax > 1 ? "s" : ""}
          </Badge>
          <Badge tone="neutral">quote in {currency}</Badge>
          {outcome.km !== null && (
            <Badge tone="neutral" title="Great-circle distance between city points">
              ≈{Math.round(outcome.km).toLocaleString("en-US")} km great-circle
            </Badge>
          )}
        </div>
        <WeatherStrip
          lat={outcome.destination.lat}
          lng={outcome.destination.lng}
          city={outcome.destination.city}
        />
      </div>

      {/* Editable query */}
      <Card className="p-4">
        <SearchForm
          compact
          initial={{ from, to, date, passengers: pax }}
        />
      </Card>

      {/* Tabs */}
      <SegmentedTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Panels */}
      <div role="tabpanel" aria-label={tab}>
        {tab === "multi" && (
          <div className="space-y-4" data-testid="panel-multi">
            {outcome.multi.chains.length > 0 && (
              <div className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <Plane size={14} className="text-accent" />
                  Connections
                </h2>
                {outcome.multi.chains.map((chain, ci) => (
                  <div key={ci} className="space-y-2">
                    {chain.map((leg) => (
                      <ResultRowView
                        key={leg.id}
                        row={leg}
                        onCheck={() => setDialog("air")}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {outcome.multi.chips.map((c) => (
                <button
                  key={c.tab}
                  onClick={() => setTab(c.tab)}
                  className="rounded-xl border bg-raised p-4 text-left transition-colors hover:border-accent"
                  data-testid="multi-chip"
                >
                  <span className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-fg">{c.label}</span>
                    <Badge tone={c.count > 0 ? "accent" : "neutral"}>
                      {c.count > 0 ? `${c.count} option${c.count > 1 ? "s" : ""}` : "none"}
                    </Badge>
                  </span>
                  {c.note && <span className="mt-1 block text-xs text-fg-muted">{c.note}</span>}
                </button>
              ))}
            </div>
            {outcome.multi.notes.map((n) => (
              <NoteLine key={n}>{n}</NoteLine>
            ))}
            <NoteLine>
              Every mode explains itself on its own tab — nothing here is a
              guessed itinerary.
            </NoteLine>
          </div>
        )}

        {tab === "flights" && (
          <div className="space-y-3" data-testid="panel-flights">
            {live.status === "loading" && <SkeletonRows count={2} />}
            {flightRows.length > 0 ? (
              <div className="space-y-2">
                {flightRows.map((row) => (
                  <ResultRowView key={row.id} row={row} onCheck={() => setDialog("air")} />
                ))}
              </div>
            ) : (
              live.status !== "loading" && (
                <div className="space-y-3">
                  <EmptyState reason={outcome.flights.empty!} />
                  <Button variant="outline" size="sm" onClick={() => setDialog("air")}>
                    Search live with providers
                  </Button>
                </div>
              )
            )}
            <NoteLine tone={allLive ? "live" : live.status === "ok" && live.offers.length === 0 ? "warn" : live.status === "unavailable" ? "warn" : undefined}>
              {allLive
                ? "Sorted by live price — every row above is a live quote."
                : liveNote.note}
            </NoteLine>
            {outcome.flights.rows.length > 0 && flightRows.some((r) => !r.live) && (
              <NoteLine>
                Rows without a badge are curated route facts — no times, no
                prices (we don&apos;t invent them).
              </NoteLine>
            )}
          </div>
        )}

        {tab === "rail" && (
          <div className="space-y-3" data-testid="panel-rail">
            <LiveSchedules
              mode="rail"
              origin={outcome.origin}
              destination={outcome.destination}
              date={date}
              onCheck={() => setDialog("rail")}
            />
            {outcome.rail.rows.length > 0 ? (
              <div className="space-y-2">
                {outcome.rail.rows.map((row) => (
                  <ResultRowView key={row.id} row={row} onCheck={() => setDialog("rail")} />
                ))}
              </div>
            ) : (
              <EmptyState reason={outcome.rail.empty!} />
            )}
            <NoteLine>{outcome.rail.note}</NoteLine>
          </div>
        )}

        {tab === "bus" && (
          <div className="space-y-3" data-testid="panel-bus">
            <LiveSchedules
              mode="bus"
              origin={outcome.origin}
              destination={outcome.destination}
              date={date}
              onCheck={() => setDialog("bus")}
            />
            {outcome.bus.rows.length > 0 ? (
              <div className="space-y-2">
                {outcome.bus.rows.map((row) => (
                  <ResultRowView key={row.id} row={row} onCheck={() => setDialog("bus")} />
                ))}
              </div>
            ) : (
              <EmptyState reason={outcome.bus.empty!} />
            )}
            <NoteLine>{outcome.bus.note}</NoteLine>
          </div>
        )}

        {tab === "ferry" && (
          <div className="space-y-3" data-testid="panel-ferry">
            {outcome.ferry.rows.length > 0 ? (
              <div className="space-y-2">
                {outcome.ferry.rows.map((row) => (
                  <ResultRowView key={row.id} row={row} onCheck={() => setDialog("sea")} />
                ))}
              </div>
            ) : (
              <EmptyState reason={outcome.ferry.empty!} />
            )}
            <NoteLine>{outcome.ferry.note}</NoteLine>
          </div>
        )}

        {tab === "stays" && (
          <StaysPanel
            city={outcome.destination.city}
            date={date}
            passengers={pax}
            onOpen={(m) => setDialog(m)}
          />
        )}

        {tab === "visa" && (
          <VisaPanel
            destination={`${outcome.destination.flag} ${outcome.destination.country}`}
            nationality={effectiveNat}
            visa={outcome.visa}
          />
        )}
      </div>

      {dialog && (
        <DeepLinkDialog
          mode={dialog}
          params={dialogParams}
          onClose={() => setDialog(null)}
        />
      )}

      <p className="flex items-center gap-1.5 pt-2 text-[11px] text-fg-subtle">
        <ShieldCheck size={12} />
        Prices appear only when a live source returns them — never estimates.
      </p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3" data-testid="search-loading">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        </div>
      }
    >
      <SearchScreen />
    </Suspense>
  );
}
