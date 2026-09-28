# AllinOne Travel — Ground-Up Rebuild Prompt

> **Purpose of this document:** a complete, self-contained specification for
> rebuilding the AllinOne Travel desktop app **from zero** — new codebase, new
> design, honest data — in this folder. An agent or developer should be able to
> execute it phase by phase without referring to any old source code.

---

## 1. Mission

Build a **modern travel-planning desktop app** ("AllinOne Travel", v1.0.0)
whose purpose is identical to the previous app:

> Look up how to get between two places across **flights, rail, bus and
> ferry**, see which **operators (carriers)** run in a country, discover
> **tourism providers, attractions and food sources**, check **entry/visa
> rules**, keep a **trip plan**, and jump to **real booking/search sites** —
> all in one offline-capable desktop application.

Everything else — code, architecture, components, visual design — is built
**from scratch**. Do not copy, port, or "adapt" any file from the old app.

---

## 2. Project location & materials

**Project root (new repo):**
`C:\Users\USER\Desktop\Masaüstü\AllinOne Travel`
(this folder — `git init` here, all code lives here)

**Provided data materials (read-only, already in this folder):**

| Material | Path | Content |
|---|---|---|
| Destination data | `Travel '.ts'/EU/destinations_*.ts` | 50 country files, **4,006 terminal records** (airports, rail stations, ferry ports, bus hubs) as paste-ready typed object literals with tags |
| Reference docs | `Travel Docs/TravelApp EU/*.pdf` | 61 country PDFs the destination data was converted from — use for enrichment facts (operators, notes), never as a code source |

**Legacy app (retired):**
The old `TravelApp` folder was a read-only reference during the rebuild and
has been **deleted from disk**. The project is fully self-contained:
- All data it provided (carriers, tourism providers, visa portals, passport
  rules, currencies, known routes, resource catalog) was migrated into
  `src/data/` as committed data values.
- Terminal coordinates are baked into `src/data/destinations.ts`
  (4,001 `recorded` + centroid/missing fallbacks) — regeneration needs no
  external folder. The generator optionally accepts `LEGACY_APP_DIR` pointing
  at a preserved copy of the old dataset to re-derive `recorded` coords and
  **refuses to overwrite** recorded output without it.
- Country centroids live in the project's own `src/data/centroids.ts`.
- Reference PDFs remain in `Travel Docs/` (local, gitignored).

---

## 3. The three complaints this rebuild must fix

1. **Fake prices.** The old app showed numbers that were not real offers
   (modeled/estimate fares, price bands, "typical ranges"). Users perceived
   them as invented — because they were. **The new app must never display a
   price that did not come from a live source in this session.** (Full policy
   in §5.)
2. **Old-looking design.** The new app must have a **distinct, contemporary
   visual identity** — noticeably different structure, typography, color and
   layout from the old top-tabs/gradient-header app. (Design direction §9.)
3. **Fragmented features.** Interactive Map, Carrier Directory and Tourism
   Providers showed overlapping, country-scoped information in three separate
   tabs. They merge into **one unified Explore hub**. (§7.)

---

## 4. Scope — what ships

**In scope (top-level navigation):**

1. **Search** (home) — origin/destination/date/passengers/currency/nationality
   → results for **Flights, Rail, Bus, Ferry, Multi-modal (chained) routes**,
   with per-mode honest pricing (§5) and one **"Check prices" dialog per
   result** that opens pre-filled deep links to real providers.
2. **Explore** — the unified country hub: map + country detail combining
   terminals, carriers, tourism, visa and local discovery (§7).

**Removed during the rebuild (decision, no longer in the UI):**
- **Trips** (itinerary builder) and **Resources** (link directory) — routes,
  sidebar/mobile entries and `gate:trips` were deleted; the curated link
  data (`src/data/resource-catalog.ts`, `data/resources/`) stays in the
  repo and is still validated by `gate-curated`.

**Explicitly dropped from the old app:** OSINT tab, price-history charts,
price alerts, "best time to book", any rating/review numbers we don't have,
"earliest departure" sorting of unconfirmed schedules, hotel star/guest
ratings, fabricated carrier schedules or flight numbers.

---

## 5. Honest data & pricing policy (NON-NEGOTIABLE)

These rules are the reason this rebuild exists. Every phase is judged by them.

### 5.1 Price numbers
1. **A price may be rendered only if it is a live quote obtained in the
   current session** from a real API, and it must carry an inline source badge:
   `Live · Amadeus · 14:32` — the source name is the API that answered
   (Amadeus or Travelpayouts). Under the badge a **transparency line** states
   the fare's basis: `2026-10-12 · one-way · per traveller` (fare date,
   one-way because round-trip totals are never quoted, per-traveller when a
   party size applies). A fare whose departure date differs from the searched
   date must never render — a wrong-day price reads as fabricated.
2. **Flights:** the live sources are the Amadeus Flight Offers Search API
   (`NEXT_PUBLIC_AMADEUS_API_KEY/SECRET`, test vs prod host configurable) and,
   when no Amadeus key is configured, **Travelpayouts** aviasales v3 observed
   fares (`NEXT_PUBLIC_TRAVELPAYOUTS_TOKEN`, called through the app's own
   `/api/tp/*` proxy because the Travelpayouts API sends no CORS headers).
   Travelpayouts rows are fares **observed by travellers in the last 48
   hours** — the note under the results must say so, and they are never
   presented as bookable quotes. Graceful degradation is mandatory: if neither
   source is configured, the request is rate-limited, or the network fails,
   **show no price at all** — never a fallback number. When the source
   answers **empty** (no observed fare for that route/date) or **fails**
   (401/5xx/timeout), the Flights tab renders an honest empty-state card
   (`data-testid="flights-live-empty"` — "No live fare data for this route
   and date in the last 48 hours" / "Live fare source unavailable") with
   **direct Aviasales and Trip.com live-search deep-links** (marker-bearing,
   route/date/party pre-filled) plus a "Compare all providers" action —
   never a synthetic flight card. There is no mock/dummy fare generator
   anywhere in the codebase; an empty API response stays empty.
3. **Rail, bus, ferry, hotels, cruise:** there is no free live-price API.
   Therefore these results **never show a price figure**. They show route,
   duration (labeled `est.` when modeled), operator/terminal facts that are
   curated, and a **"Check live prices on …"** button group with pre-filled
   deep links (origin, destination, date, passengers in the provider URL).
4. **Forbidden anywhere in the UI:** computed fares, fare formulas, price
   tiers, "typical range", "estimated from €X", strikethrough/was-prices,
   discounts, "cheapest deal" claims across providers, price history, price
   predictions, alerts, per-provider price comparisons.
5. **Sorting/filtering by price** is available only when every visible
   flight row carries a live badge; otherwise sort by duration and show the
   reason ("prices unavailable — sorted by duration").
6. **Multi-modal chains:** never sum segment prices. Show the live price of
   each air segment individually (if any) and deep links for ground segments;
   no chain total.

### 5.2 Times, carriers and schedules
1. A clock time renders **only** for live API data; curated records show
   `--:--` + "schedule not confirmed"; modeled durations are labeled `est.`
2. Never invent flight numbers, aircraft, seat counts, baggage rules, or
   "operated by" statements. Curated carrier ↔ route facts are allowed only
   where the legacy data files assert them (e.g. known-routes), and are
   labeled `curated`.
3. Defunct carriers are labeled with their last year of operation.

### 5.3 Ratings, availability, urgency
No star ratings, guest scores, review counts, "only X left", scarcity or
urgency copy — unless a live API genuinely returns them (none do in v1).

### 5.4 Gate
Ship a `scripts/gate-honesty.ts` that runs the built app under Playwright
(Electron), scans every result surface for currency-shaped strings, and
**fails if any price figure lacks a source badge**. This gate runs in CI
alongside tsc/lint/build.

### 5.5 Live data sources (addendum)

| Need | Source | Honesty rule |
|---|---|---|
| Flight prices | Travelpayouts aviasales v3 via the app's `/api/tp/*` proxy (the API sends no CORS headers); Amadeus first when configured | Observed fares from the last 48 hours; badge `Live · Travelpayouts · HH:MM` and the note must say they are observed, not bookable quotes; any failure => zero numbers |
| Rail/bus schedules | Transitous MOTIS API (`api.transitous.org`, open GTFS feeds, `Access-Control-Allow-Origin: *`) — substitutes `hafas-client` / transport.rest, whose public HAFAS instances were answering 503 | Times render only from a live in-session response (`scheduleConfirmed`), never on curated rows; cancelled legs or empty results render nothing |
| Weather | Open-Meteo (keyless, CORS-enabled) | Real forecast numbers only; on failure the strip does not render at all |
| Geocoding | Nominatim / OpenStreetMap (keyless) | Dropdown entries are marked "OSM"; a picked OSM place resolves with honest empty states wherever curated data is absent |
| Affiliate marker | Travelpayouts `marker=782929` | Injected centrally by `withMarker` on Aviasales / Booking.com / Omio / Trip.com / Busbud redirects |

---

## 6. Information architecture (new)

```
┌ Sidebar (collapsible, icon + label) ─────────────────┐
│  Search          ← home, default                     │
│  Explore         ← map + country hub (§7)            │
│  ────────────                                        │
│  Settings: currency, nationality, theme, version     │
└──────────────────────────────────────────────────────┘
```

- **No top tab strip** (that was the old app's signature) — navigation lives
  in a left sidebar; results use segmented sub-tabs within the Search page.
- URL routing: `/`, `/search?…`, `/explore/[countryCode]`. Explore URLs are
  shareable (`#section` tabs) and the back button works.
- Default currency EUR; conversion must use a real rates source or show the
  original currency only (no invented rates).

---

## 7. The unified Explore hub (replaces Map + Carrier Directory + Tourism)

**Idea:** one surface where the *country* is the primary object. The map is
the entry point; carriers and tourism are sections *of the country*, not
standalone directories.

### 7.1 Layout
- **Left (70%):** interactive world map — bundled GeoJSON country shapes
  (e.g. world-atlas TopoJSON, committed to the repo; **no tile server, no API
  key, works offline in Electron**). Countries with data are highlighted;
  hovering shows name + record counts; clicking selects the country.
  A **search box** above the map accepts country/city/terminal names
  (keyboard-navigable — the map is never the only path).
- **Right (30%):** **Country panel** that slides in for the selected country,
  URL-synced (`/explore/mt`). Sections shown as **tabs — one at a time,
  hash-synced** (`/explore/mt#carriers`):
  1. **Overview** — country name/flag, counts (airports, stations, ports,
     carriers, providers).
  2. **Transport terminals** — the destination records (air/rail/sea/bus)
     grouped by mode, each with facts from tags; buttons:
     "Search routes from here" (jumps to Search prefilled).
  3. **Carriers** — every air/rail/bus/sea carrier of this country
     (active first, defunct listed separately with years), each row:
     name, modes, badge, **"Visit official site"** (verified URL) and
     "Search routes" action. This replaces the standalone Carrier Directory.
  4. **See & do** — tourism providers for the country (attractions,
     railways, ferry/cruise operators, hotels, experiences) with verified
     website links; category chips filter. This replaces Tourism Providers.
  5. **Entry rules** — visa status for the user's selected nationality +
     official government portal link **picked for that status** (e.g. US
     ESTA for visa-waiver passports vs. Department of State when a visa is
     required), CTA wording that matches the status, and the "not official
     guidance" disclaimer. (Data: passports/visa-portals migrated from
     legacy data; all URLs load-verified by `npm run verify:visa`.)
  6. **Local discovery** — attractions/food/events deep links per major
     city (prefilled queries to Google Maps/Wikipedia/Wikivoyage etc.).
- **Below the map:** country list grid (flag, name, counts) as a non-map
  fallback for accessibility and small screens.

### 7.2 Why this shape
- Carriers, terminals, tourism and visa data are all keyed by country —
  one join, one panel, zero duplicate navigation.
- The map gets purpose: it is a *selector*, not a separate feature.
- Everything is linkable: `/explore/fr#carriers`.

---

## 8. Search experience

1. **Home:** a single hero search card (from/to with autocomplete over all
   4,006 records + city grouping, date, optional return date, passengers,
   cabin?, currency, nationality) + quick-popular routes chips. The return
   date is optional; when present it is carried into every provider deep
   link as a real round trip (Kayak/Skyscanner/Momondo/Cheapflights/Kiwi/
   Trip.com/Aviasales/Trainline formats), verified by `npm run verify:links`.
2. **Results:** segmented sub-tabs — **Multi-modal first, then Flights, Rail,
   Bus, Ferry** (+ Visa and Compare-free layout; no Hotels in v1 unless live
   rates exist — hotels ship as deep-link cards under a "Stays" tab with
   **zero price figures**: date+guest prefill, honest ordering that cannot
   sort by price (Recommended / A–Z / Z–A), a provider-fee badge
   ("Free search" / "Service fee may apply") and an affiliate-link badge).
3. **Result rows:** mode icon, operator (only if curated/live), route,
   duration (`est.` where modeled), schedule status (`--:--` + tooltip if
   unconfirmed), live price + badge (flights only), and per-row actions:
   **Check prices** (opens the provider deep-link dialog).
4. **Multi-modal:** chains only when they beat the direct option (cheaper
   live, or clearly faster); each leg labeled with its own status; the
   synthetic 08:00-style hub times of the old engine are **forbidden** —
   transfers show "transfer time unknown" unless live data says otherwise.
   A qualitative **"Going for less"** guide sits above the chains: honest
   general advice only (ground vs. air, midweek/unsociable hours, return
   date) with **no fare figures and no clock times**.
5. **Empty states:** every suppressed mode explains why (no rail station,
   island country, distance cap) with an alternative suggestion.
6. **Loading:** skeleton rows; stale results dimmed during re-search.

---

## 9. Design direction (must NOT resemble the old app)

The old app: gradient header, centered logo, full-width top tab strip, dense
white cards, blue/purple accents. The new app must read as a different
product:

- **Structure:** left icon sidebar (collapsible) + page canvas; hero-style
  home; generous whitespace; 12-col grid with asymmetric Explore layout.
- **Theme:** dark-first with a light mode toggle (persisted). Palette:
  deep-slate/ink base, **single vivid accent (e.g. coral or electric mint)**,
  semantic colors reserved for status (live = green dot, unconfirmed = amber).
- **Typography:** a display face for headings (e.g. *Bricolage Grotesque* or
  *Space Grotesk*) + *Inter* for body, loaded via `next/font` (self-hosted at
  build — no runtime CDN). Distinct type scale; tabular numerals for times
  and prices.
- **Components:** rounded-2xl cards, 1px hairline borders, soft elevation,
  subtle framer-motion transitions (respect `prefers-reduced-motion`),
  keyboard focus rings, hover micro-states.
- **Maps/panels:** glassy side panel over the map, country flag chips,
  section anchors with scroll-spy.
- **Density:** result rows must be scannable (3-line max) — not the old
  6-line packed cards.
- Deliver a **design-system pass first** (tokens: color/spacing/radius/
  shadow/type; 8–12 primitive components) before any feature page.

---

## 10. Tech stack & structure

- **Next.js 14 (App Router, TypeScript, `output: "export"`) + Electron +
  Tailwind CSS + Zustand (persisted) + framer-motion + Playwright.**
  Same proven desktop packaging (static export served by Electron with a
  force-prod flag), but **all code newly written**.
- Map rendering: SVG from bundled TopoJSON (no Leaflet tiles, no API keys).
- Fonts via `next/font`; icons via a single icon lib (e.g. lucide).
- Suggested structure:
  ```
  src/
    app/            # routes: page.tsx, search, explore/[cc]
    components/     # ui primitives / search / explore / shell
    data/           # generated: destinations, carriers, tourism, visa, resources
    lib/            # types, store, search logic, amadeus client, deeplinks
  scripts/          # data generator + gates + network verifiers (verify:links, verify:visa)
  electron/         # main process
  ```
- Versioning: start at **1.0.0**; `package.json` is the single source of
  truth (footer/menu/installer read it).

---

## 11. Data pipeline

1. **Generator script** (`scripts/generate-destinations.ts`) reads the 50
   `destinations_*.ts` files **in place** (never move/rename the user's
   folders), strips comment blocks, parses the object literals, validates
   (unique ids, known categories, non-empty name/country, IATA shape) and
   emits typed `src/data/destinations.ts` + a per-country index.
   - **Coordinates:** each record carries `coordSource` — `recorded`
     (originally derived by `id` match from the since-deleted legacy
     dataset; values are committed in `src/data/destinations.ts`),
     `centroid` (from the project's own `src/data/centroids.ts`), or
     `missing`. The generator only re-derives `recorded` values if
     `LEGACY_APP_DIR` points at a preserved legacy copy, and refuses to
     overwrite recorded output without it.
2. **Migrate curated data from the legacy app (data values only):**
   carriers (~630), tourism providers (~153), visa portals, passport/visa
   rules, currencies, known direct routes, resource catalog (~178 links),
   search deep-link templates. Re-express them in the new schema with fresh
   file organization; re-verify links before release.
3. **Smoke checks on data:** counts per country/mode match source files
   (4,006 terminals total), zero duplicate ids after country-scoping,
   every carrier country exists
   in destinations, every external URL passes the link verifier.

---

## 12. Quality gates & evidence discipline

After **every** commit: `npx tsc --noEmit && npm run lint && npm run build`
must pass. Gates (all run before each phase is called done):

| Gate | Asserts |
|---|---|
| `gate:data` | generated datasets: totals, unique ids, categories, honest coordinate provenance |
| `gate-curated` | migrated curated data (incl. resource catalog + visa portals): counts, structural invariants, https links only |
| `gate-honesty` | no price figure without a live-source badge; no fabricated clocks/flight numbers |
| `gate-empty` | forced empty/failed fare API => honest warning card + Aviasales/Trip.com live links (marker, date), zero price figures — a synthetic fare fails this gate |
| `gate-search` | each mode renders or explains itself on 6+ route types; deep links carry dates/pax |
| `gate-live` | keyless live features (Nominatim, Open-Meteo, Transitous) actually render from this session |
| `gate-explore` | map click → six country-panel tabs (one at a time), hash URL sync, keyboard path |

Network-dependent verifiers run **outside** the chain (bots get walled;
they need a reachable network): `npm run verify:links` (every search
provider deep link loads / echoes the sample query) and
`npm run verify:visa` (all official visa portals load or sit behind a
documented browser challenge).

- Playwright Electron evidence screenshots committed under `scripts/evidence/`.
- **One git commit per logical step** with real evidence in the message
  (gate outputs, counts) — never claim what wasn't run.
- English UI strings; accessible (labels, focus order, contrast).

---

## 13. Delivery phases

| Phase | Deliverable |
|---|---|
| **0 – Foundation** | repo init, Next+Electron scaffold, design tokens + primitives, sidebar shell, tsc/lint/build green, first screenshot |
| **1 – Data** | destination generator + coord enrichment + migrated curated datasets, data smoke gates, counts report |
| **2 – Search** | hero search, results for all modes, Amadeus live pricing with graceful no-price fallback, deep-link dialogs, honesty gate |
| **3 – Explore** | unified map (70% width) + country panel (six hash-synced tabs), URL sync, accessibility path |
| **4 – Trips** | *removed from the UI during the rebuild — itinerary builder dropped, no data kept* |
| **5 – Resources** | *route removed — resource catalog data kept in `src/data/resource-catalog.ts` + `data/resources/`, still validated by `gate-curated`* |
| **6 – Release** | link verification, full gate suite, `desktop:build` (NSIS + portable), desktop shortcut, CHANGELOG/README, footer v1.0.0 |

---

## 14. Definition of done

- All phases shipped, gate table 100% green on the release build.
- **Zero price figures without a live-source badge anywhere** (proven by
  `gate-honesty` across every result surface).
- Explore hub demonstrably replaces the three old tabs (map click → carriers →
  official sites in ≤ 2 interactions).
- Fresh visual identity: sidebar-based, dark-first, new typography — a
  side-by-side screenshot against the old app should be obviously different.
- `AllinOne Travel 1.0.0` installer + portable exe build and launch; shortcut
  on the desktop; footer shows `v1.0.0`.
- Docs: README (build/run), CHANGELOG, and this spec updated to reflect
  anything decided during implementation.

## 15. Non-goals

- No copying of legacy UI/engine code; no "partial migration".
- No invented data of any kind (prices, times, ratings, availability).
- No accounts/cloud sync; no telemetry; local-only storage.
- No OSINT surfaces; no price prediction/alert features.
- No non-English UI in v1 (data stays English).
