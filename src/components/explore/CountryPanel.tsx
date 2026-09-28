"use client";

// Country panel (REBUILD §7.1) — the right 30% of Explore. Six
// sections shown one at a time as tabs, URL-synced (/explore/fr#carriers):
// Overview / Transport terminals / Carriers / See & do / Entry rules
// / Local discovery. All facts come from the curated datasets; the
// only user state is the saved nationality (entry rules).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bus,
  Car,
  ExternalLink,
  Hotel,
  MapPin,
  Plane,
  Ship,
  TrainFront,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { VisaPanel } from "@/components/search/VisaPanel";
import { buildVisaForCountry } from "@/lib/search/engine";
import { useSettings } from "@/lib/store/settings";
import { ALL_PASSPORTS } from "@/data/passports";
import { cityDiscoveryLinks } from "@/lib/explore/discovery";
import {
  countryCarriers,
  countryCities,
  countryCounts,
  countryIdentity,
  countryPrimaryCity,
  countryProviders,
  countryTerminals,
  flatCarriers,
} from "@/lib/explore/country-data";
import type { LocalCategory } from "@/lib/types/data";
import type { TerminalCategory } from "@/data/destinations";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "terminals", label: "Transport terminals" },
  { id: "carriers", label: "Carriers" },
  { id: "see-do", label: "See & do" },
  { id: "entry-rules", label: "Entry rules" },
  { id: "local", label: "Local discovery" },
] as const;

const MODE_META: Record<
  TerminalCategory,
  { label: string; icon: typeof Plane; preposition: string }
> = {
  air: { label: "Air", icon: Plane, preposition: "airport" },
  rail: { label: "Rail", icon: TrainFront, preposition: "station" },
  sea: { label: "Ferry", icon: Ship, preposition: "port" },
  bus: { label: "Bus", icon: Bus, preposition: "station" },
};

function SectionHeading({ id, title, count }: { id: string; title: string; count?: number }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 font-display text-xl font-bold tracking-tight"
      data-testid={`panel-heading-${id}`}
    >
      {title}
      {typeof count === "number" && (
        <span className="ml-2 text-sm font-semibold text-fg-subtle">{count}</span>
      )}
    </h2>
  );
}

export function CountryPanel({ cc }: { cc: string }) {
  const { nationality, setNationality } = useSettings();
  const id = useMemo(() => countryIdentity(cc), [cc]);
  const counts = useMemo(() => countryCounts(cc), [cc]);
  const terms = useMemo(() => countryTerminals(cc), [cc]);
  const providers = useMemo(() => countryProviders(cc), [cc]);
  const { active, defunct } = useMemo(() => flatCarriers(cc), [cc]);
  const primary = useMemo(() => countryPrimaryCity(cc), [cc]);
  const cities = useMemo(() => countryCities(cc, 3), [cc]);
  const carriers = countryCarriers(cc);

  const [modeFilter, setModeFilter] = useState<TerminalCategory | "all">("all");
  const [catFilter, setCatFilter] = useState<LocalCategory | "all">("all");

  // Tab state: which of the six sections is shown, driven by the URL
  // hash so /explore/fr#carriers stays shareable (REBUILD §7.2).
  const [activeSection, setActiveSection] = useState<string>("overview");
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSection(SECTIONS.some((s) => s.id === hash) ? hash : "overview");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const visa = useMemo(() => buildVisaForCountry(nationality, cc), [nationality, cc]);
  const searchRef = primary ? `${primary},${cc}` : "";

  const filteredTerms =
    modeFilter === "all" ? terms : terms.filter((t) => t.category === modeFilter);
  const filteredProviders =
    catFilter === "all" ? providers : providers.filter((p) => p.category === catFilter);

  return (
    <Card
      className="space-y-6 p-5"
      data-testid="country-panel"
      aria-label={`${id.name} country panel`}
    >
      {/* Identity + tab switcher (always visible) */}
      <div className="space-y-3" data-testid="panel-overview">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none" aria-hidden>
            {id.flag || "•"}
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">{id.name}</h2>
            <p className="text-xs text-fg-subtle">
              {cc}
              {id.continent ? ` · ${id.continent}` : ""}
            </p>
          </div>
        </div>

        <nav
          aria-label="Country sections"
          data-testid="panel-section-nav"
          className="flex flex-wrap gap-1.5"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={activeSection === s.id ? "true" : undefined}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                activeSection === s.id
                  ? "border-accent bg-accent/15 text-accent"
                  : "bg-raised text-fg-muted hover:border-accent hover:text-fg"
              }`}
              data-testid={`nav-${s.id}`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <dl
          className="grid grid-cols-3 gap-2 text-center"
          data-testid="overview-counts"
          hidden={activeSection !== "overview"}
        >
          {[
            { k: "Airports", v: counts.air },
            { k: "Rail stations", v: counts.rail },
            { k: "Ferry ports", v: counts.sea },
            { k: "Bus stations", v: counts.bus },
            { k: "Carriers", v: counts.carriers },
            { k: "Providers", v: counts.providers },
          ].map((x) => (
            <div key={x.k} className="rounded-xl border bg-raised px-2 py-2.5">
              <dt className="text-[10px] uppercase tracking-wide text-fg-subtle">{x.k}</dt>
              <dd className="text-lg font-bold tabular-nums text-fg" data-testid={`count-${x.k}`}>
                {x.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---------------- Terminals ---------------- */}
      <section
        className="space-y-3"
        data-testid="panel-terminals"
        hidden={activeSection !== "terminals"}
      >
        <SectionHeading id="terminals" title="Transport terminals" count={terms.length} />
        {terms.length === 0 ? (
          <p className="text-sm text-fg-muted" data-testid="terminals-empty">
            No terminal records for {id.name} in our dataset — we don&apos;t list
            places we&apos;re not sure about.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by mode">
              {(["all", "air", "rail", "sea", "bus"] as const).map((m) => {
                const n = m === "all" ? terms.length : terms.filter((t) => t.category === m).length;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModeFilter(m)}
                    aria-pressed={modeFilter === m}
                    data-testid={`filter-mode-${m}`}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      modeFilter === m
                        ? "border-accent bg-accent/15 text-accent"
                        : "bg-raised text-fg-muted hover:text-fg"
                    }`}
                  >
                    {m === "all" ? "All" : MODE_META[m].label} {n}
                  </button>
                );
              })}
            </div>

            <ul className="space-y-2" data-testid="terminals-list">
              {filteredTerms.map((t) => {
                const meta = MODE_META[t.category];
                const Icon = meta.icon;
                const ref = `${t.city ?? ""},${t.countryCode}`;
                return (
                  <li
                    key={t.id}
                    data-testid="terminal-row"
                    className="flex items-start gap-3 rounded-xl border bg-raised p-3"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-fg">
                        {t.displayName}
                        {t.iata && (
                          <span className="ml-1.5 rounded bg-muted px-1 py-px text-[10px] font-bold text-fg-muted">
                            {t.iata}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-fg-muted">
                        {[t.city, t.region, t.country].filter(Boolean).join(" · ")}
                      </p>
                      {t.tags.length > 0 && (
                        <p className="mt-1 flex flex-wrap gap-1">
                          {t.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-muted px-1.5 py-px text-[10px] text-fg-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    {t.city && (
                      <Link
                        href={`/?from=${encodeURIComponent(ref)}`}
                        className="shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold text-fg-muted transition-colors hover:border-accent hover:text-fg"
                        data-testid="terminal-search-link"
                        title={`Search routes from ${t.displayName}`}
                      >
                        Search from here
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* ---------------- Carriers ---------------- */}
      <section
        className="space-y-3"
        data-testid="panel-carriers"
        hidden={activeSection !== "carriers"}
      >
        <SectionHeading
          id="carriers"
          title="Carriers"
          count={active.length + defunct.length}
        />
        {active.length === 0 && defunct.length === 0 ? (
          <p className="text-sm text-fg-muted" data-testid="carriers-empty">
            No carriers listed for {id.name} in the curated directory.
          </p>
        ) : (
          <>
            <ul className="space-y-2" data-testid="carriers-active">
              {active.map((c, i) => (
                <li
                  key={`${c.name}-${i}`}
                  data-testid="carrier-row"
                  className="flex flex-wrap items-center gap-2 rounded-xl border bg-raised p-3"
                >
                  <span className="text-sm font-semibold text-fg">{c.name}</span>
                  <Badge tone="neutral">{c.mode}</Badge>
                  <span className="ml-auto flex items-center gap-2">
                    {searchRef && (
                      <Link
                        href={`/?from=${encodeURIComponent(searchRef)}`}
                        className="rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold text-fg-muted transition-colors hover:border-accent hover:text-fg"
                      >
                        Search routes
                      </Link>
                    )}
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-bold text-ink-950"
                        data-testid="carrier-site"
                      >
                        Visit official site
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {defunct.length > 0 && (
              <div className="space-y-2" data-testid="carriers-defunct">
                <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                  Defunct ({defunct.length})
                </p>
                <ul className="space-y-2">
                  {defunct.map((c, i) => (
                    <li
                      key={`d-${c.name}-${i}`}
                      data-testid="defunct-row"
                      className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed bg-muted/40 p-3 opacity-85"
                    >
                      <span className="text-sm font-semibold text-fg-muted line-through decoration-fg-subtle/60">
                        {c.name}
                      </span>
                      <Badge tone="warn">
                        defunct{c.defunctYear ? ` ${c.defunctYear}` : ""}
                      </Badge>
                      <Badge tone="neutral">{c.mode}</Badge>
                      {c.notes && (
                        <span className="w-full text-xs text-fg-subtle">{c.notes}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* ---------------- See & do ---------------- */}
      <section
        className="space-y-3"
        data-testid="panel-see-do"
        hidden={activeSection !== "see-do"}
      >
        <SectionHeading id="see-do" title="See & do" count={providers.length} />
        {providers.length === 0 ? (
          <p className="text-sm text-fg-muted" data-testid="providers-empty">
            No curated tourism providers for {id.name} yet.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter providers">
              {(["all", "rail", "sea", "bus", "hotel"] as const).map((c) => {
                const n =
                  c === "all" ? providers.length : providers.filter((p) => p.category === c).length;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCatFilter(c)}
                    aria-pressed={catFilter === c}
                    data-testid={`filter-cat-${c}`}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      catFilter === c
                        ? "border-accent bg-accent/15 text-accent"
                        : "bg-raised text-fg-muted hover:text-fg"
                    }`}
                  >
                    {c === "all" ? "All" : c === "hotel" ? "Hotels" : `${c}s`} {n}
                  </button>
                );
              })}
            </div>
            <ul className="space-y-2" data-testid="providers-list">
              {filteredProviders.map((p) => (
                <li
                  key={p.id}
                  data-testid="provider-row"
                  className="rounded-xl border bg-raised p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      {p.category === "hotel" ? (
                        <Hotel size={13} />
                      ) : p.category === "bus" ? (
                        <Car size={13} />
                      ) : p.category === "sea" ? (
                        <Ship size={13} />
                      ) : (
                        <TrainFront size={13} />
                      )}
                    </span>
                    <span className="text-sm font-semibold text-fg">{p.name}</span>
                    <Badge tone="neutral">{p.category}</Badge>
                    <span className="text-xs text-fg-subtle">{p.region}</span>
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      data-testid="provider-site"
                    >
                      Visit website
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  {p.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{p.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ---------------- Entry rules ---------------- */}
      <section
        className="space-y-3"
        data-testid="panel-entry-rules"
        hidden={activeSection !== "entry-rules"}
      >
        <SectionHeading id="entry-rules" title="Entry rules" />
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-fg-muted" htmlFor="explore-nationality">
            Your nationality
          </label>
          <select
            id="explore-nationality"
            data-testid="explore-nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="h-9 rounded-xl border bg-raised px-3 text-sm text-fg transition-colors focus:border-accent focus:outline-none"
          >
            {ALL_PASSPORTS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>
        <VisaPanel
          destination={id.name}
          nationality={nationality}
          visa={visa}
        />
      </section>

      {/* ---------------- Local discovery ---------------- */}
      <section
        className="space-y-3"
        data-testid="panel-local"
        hidden={activeSection !== "local"}
      >
        <SectionHeading id="local" title="Local discovery" count={cities.length} />
        {cities.length === 0 ? (
          <p className="text-sm text-fg-muted" data-testid="local-empty">
            No cities with terminal records for {id.name} — nothing to link yet.
          </p>
        ) : (
          <div className="space-y-4">
            {cities.map((city) => (
              <div key={city} className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                  <MapPin size={13} className="text-accent" />
                  {city}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {cityDiscoveryLinks(city, cc).map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border bg-raised px-2.5 py-1.5 text-[11px] font-semibold text-fg-muted transition-colors hover:border-accent hover:text-fg"
                        data-testid="discovery-link"
                      >
                        {l.label}
                        <ExternalLink size={10} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="border-t pt-4 text-[11px] text-fg-subtle">
        {carriers?.notes ? `${carriers.notes} ` : ""}
        All figures come from our curated datasets — counts update when the data
        does, never before.
      </p>
    </Card>
  );
}

/** Empty prompt for /explore without a selected country. */
export function ExplorePanelPrompt() {
  return (
    <Card className="space-y-3 p-6" data-testid="panel-prompt">
      <p className="font-display text-lg font-bold">Pick a country</p>
      <p className="text-sm leading-relaxed text-fg-muted">
        Click any highlighted country on the map, search above, or choose one from
        the list below. You&apos;ll get its terminals, carriers, sights, entry
        rules and local links in one panel.
      </p>
      <p className="text-xs text-fg-subtle">
        Keyboard? Press the search box and type a country, city or terminal name.
      </p>
    </Card>
  );
}
