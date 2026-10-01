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
import { LiveFaresEmpty } from "@/components/search/LiveFaresEmpty";
import { LinkFeeBadge, PartnerBadge } from "@/components/search/LinkBadges";
import { VisaPanel } from "@/components/search/VisaPanel";
import { LiveSchedules } from "@/components/search/LiveSchedules";
import { WeatherStrip } from "@/components/search/WeatherStrip";
import { DriveRouteCard } from "@/components/search/DriveRouteCard";
import { NearbySightsCard } from "@/components/search/NearbySightsCard";
import { LiveHotelRates } from "@/components/search/LiveHotelRates";
import { DeparturesCard } from "@/components/search/DeparturesCard";
import { SkyscannerFareCard } from "@/components/search/SkyscannerFareCard";
import { TfLStatusCard } from "@/components/search/TfLStatusCard";
import {
  EmptyState,
  ResultRowView,
  SkeletonRows,
} from "@/components/search/ResultRowView";
import { buildSearch } from "@/lib/search/engine";
import { hotelsConfigured } from "@/lib/search/booking";
import { liveRows, useLiveFares, useLiveFareNote } from "@/lib/search/useLiveFares";
import { preferredAirports } from "@/data/known-routes";
import { SEARCH_LINKS, type SearchLinkMode, type SearchLinkParams } from "@/lib/search-links";
import { isPartnerUrl } from "@/lib/affiliate";
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
  // Format the LOCAL calendar date — toISOString() would return the
  // UTC date and hand back the same day for any UTC+ timezone.
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  returnDate,
  passengers,
  onOpen,
  destination,
  currency,
}: {
  city: string;
  date?: string;
  returnDate?: string;
  passengers: number;
  onOpen: (mode: SearchLinkMode) => void;
  destination: { lat: number | null; lng: number | null; cc: string };
  currency: string;
}) {
  // Return date wins as the check-out; otherwise a single night.
  const checkOut = returnDate ?? addNight(date);
  const [order, setOrder] = useState<"curated" | "az" | "za">("curated");

  const cards = useMemo(() => {
    const list = [...SEARCH_LINKS.hotels];
    if (order === "az") list.sort((a, b) => a.label.localeCompare(b.label));
    if (order === "za") list.sort((a, b) => b.label.localeCompare(a.label));
    return list;
  }, [order]);

  return (
    <div className="space-y-3" data-testid="stays-panel">
      <LiveHotelRates
        city={city}
        lat={destination.lat}
        lng={destination.lng}
        cc={destination.cc}
        checkIn={date}
        checkOut={checkOut}
        adults={passengers}
        currency={currency}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-fg-muted">
          {cards.length} stay searches for {city}
        </p>
        <label className="flex items-center gap-2 text-xs text-fg-muted">
          Order
          <select
            aria-label="Order stay links"
            data-testid="stays-order"
            value={order}
            onChange={(e) => setOrder(e.target.value as typeof order)}
            className="h-8 rounded-lg border bg-raised px-2 text-xs text-fg transition-colors hover:border-line focus:border-accent focus:outline-none"
          >
            <option value="curated">Recommended</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((l) => {
          const href = l.href({ city, checkIn: date, checkOut, passengers });
          const partner = isPartnerUrl(href);
          return (
            <a
              key={l.label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 rounded-xl border bg-raised px-4 py-3 transition-colors hover:border-accent"
              data-testid="stay-card"
              data-stay-fee={l.fee ?? "none"}
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <span className="truncate">{l.label}</span>
                  {l.region && <Badge tone="warn">{l.region}</Badge>}
                </span>
                <span className="flex flex-wrap gap-1">
                  {l.fee && <LinkFeeBadge fee={l.fee} />}
                  {partner && <PartnerBadge />}
                </span>
              </span>
              <ExternalLink size={14} className="shrink-0 text-fg-subtle group-hover:text-accent" />
            </a>
          );
        })}
      </div>
      <NoteLine>
        {hotelsConfigured()
          ? "The cards below are provider links with no prices of their own — each site quotes live on arrival. The rates above come from live room quotes (Booking.com first, Expedia as fallback); we never guess what a room costs."
          : "No prices here — providers show their live rates on their own sites, so these cards can't be sorted by price. We never guess what a room costs."}
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
  const ret = params.get("ret") ?? undefined;
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

  // Transparency line under every live price: which date the fare is
  // for, that it is one-way (we never quote a round-trip total), and
  // that multi-passenger queries show a per-traveller price.
  const liveContext = date
    ? `${date} · one-way · ${pax > 1 ? `per traveller × ${pax}` : "per traveller"}`
    : undefined;

  const { flightRows, allLive } = useMemo(() => {
    if (!outcome) return { flightRows: [] as ResultRow[], allLive: false };
    const rows = [
      ...liveRows(live.offers, outcome.origin, outcome.destination, liveContext),
      ...outcome.flights.rows,
    ];
    const all = rows.length > 0 && rows.every((r) => Boolean(r.live));
    const byDuration = (a: ResultRow, b: ResultRow) =>
      (a.liveMinutes ?? a.estMinutes ?? 9e9) - (b.liveMinutes ?? b.estMinutes ?? 9e9);
    if (all) rows.sort((a, b) => (a.live?.price ?? 0) - (b.live?.price ?? 0));
    else rows.sort(byDuration);
    return { flightRows: rows, allLive: all };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, live.offers, liveContext]);

  const dialogParams: SearchLinkParams = useMemo(() => {
    // Carry the primary IATA inside the city label ("Berlin (BER)") so
    // every provider deep link can prefill an exact airport/city code.
    const withIata = (city: string, iatas: string[]) =>
      iatas.length > 0 ? `${city} (${iatas[0]})` : city;
    return {
      origin: outcome ? withIata(outcome.origin.city, outcome.origin.iatas) : undefined,
      destination: outcome
        ? withIata(outcome.destination.city, outcome.destination.iatas)
        : undefined,
      date,
      returnDate: ret,
      passengers: pax,
      city: outcome?.destination.city,
      checkIn: date,
      checkOut: ret ?? addNight(date),
    };
  }, [outcome, date, ret, pax]);

  // Honest empty state (REBUILD §5): the live source answered "nothing
  // for this route/date" or failed outright — warn and offer live
  // searches instead of ever drawing a synthetic fare.
  const liveEmptyKind: "no-data" | "source" | null =
    live.status === "ok" && live.offers.length === 0
      ? "no-data"
      : live.status === "unavailable" &&
          live.reason !== "no-date" &&
          live.reason !== "no-route"
        ? "source"
        : null;

  const liveEmptyTargets = useMemo(() => {
    const wanted = new Set(["Aviasales", "Trip.com"]);
    return SEARCH_LINKS.air
      .filter((l) => wanted.has(l.label))
      .map((l) => ({
        label: l.label,
        href: l.href(dialogParams),
        ...(l.fee ? { fee: l.fee } : {}),
      }));
  }, [dialogParams]);

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
          {ret && (
            <Badge tone="neutral" title="Return (arrival) date">
              ↩ {ret}
            </Badge>
          )}
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
          initial={{ from, to, date, returnDate: ret, passengers: pax }}
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
            <div className="grid gap-2 sm:grid-cols-2">
              <DriveRouteCard
                origin={{
                  city: outcome.origin.city,
                  lat: outcome.origin.lat,
                  lng: outcome.origin.lng,
                }}
                destination={{
                  city: outcome.destination.city,
                  lat: outcome.destination.lat,
                  lng: outcome.destination.lng,
                }}
              />
              <NearbySightsCard
                city={outcome.destination.city}
                lat={outcome.destination.lat}
                lng={outcome.destination.lng}
                cc={outcome.destination.cc}
              />
            </div>
            <div className="rounded-2xl border bg-raised p-4" data-testid="cheaper-guide">
              <h2 className="text-sm font-semibold text-fg">
                Going for less — what actually moves the cost
              </h2>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-fg-muted">
                <li>
                  Ground first: coaches run city-centre to city-centre with no
                  airport transfers at either end — on many routes that makes
                  them the lowest-cost way to move.
                </li>
                <li>
                  Trains trade price for time: no check-in buffer, no baggage
                  rules, and you arrive downtown — a later departure can still
                  beat an earlier flight door to door.
                </li>
                <li>
                  Flying only earns its keep on long routes or far-off dates —
                  transfers, baggage fees and security time all add up on top
                  of the ticket.
                </li>
                <li>
                  Midweek and unsociable hours are when operators publish
                  their lowest fares; moving your date by a day usually matters
                  more than which site you open.
                </li>
                <li>
                  Fill the return date in the form above — providers then
                  search a real round trip instead of two separate one-ways.
                </li>
                <li>
                  We show no fares here on purpose: open each tab&apos;s
                  provider links to compare live prices on their sites.
                </li>
              </ul>
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
            {liveEmptyKind && (
              <LiveFaresEmpty
                message={
                  liveEmptyKind === "no-data"
                    ? "No live fare data for this route and date in the last 48 hours."
                    : "Live fare source unavailable — no prices shown."
                }
                detail={
                  liveEmptyKind === "no-data"
                    ? `Travelpayouts returned no observed fares for ${date} — we show no price instead of inventing one. Run a live search below to check current prices on the provider's site.`
                    : liveNote.note
                }
                targets={liveEmptyTargets}
                onAllProviders={() => setDialog("air")}
              />
            )}
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
                  {!liveEmptyKind && (
                    <Button variant="outline" size="sm" onClick={() => setDialog("air")}>
                      Search live with providers
                    </Button>
                  )}
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
            <div className="grid gap-2 sm:grid-cols-2">
              <DeparturesCard
                city={outcome.origin.city}
                iata={primary?.from ?? outcome.origin.iatas[0] ?? null}
              />
              <SkyscannerFareCard
                originCity={outcome.origin.city}
                destinationCity={outcome.destination.city}
                originIata={primary?.from ?? outcome.origin.iatas[0] ?? null}
                destinationIata={primary?.to ?? outcome.destination.iatas[0] ?? null}
              />
            </div>
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
            {(outcome.origin.city === "London" ||
              outcome.destination.city === "London") && <TfLStatusCard />}
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
            returnDate={ret}
            passengers={pax}
            onOpen={(m) => setDialog(m)}
            destination={{
              lat: outcome.destination.lat,
              lng: outcome.destination.lng,
              cc: outcome.destination.cc,
            }}
            currency={currency}
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
