# Changelog

All notable changes to AllinOne Travel are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-02

First release of the rebuilt AllinOne Travel desktop app: an offline-capable
tool for multimodal transport lookup, operators per country, tourism
providers, entry/visa rules and trip planning — with honest data throughout.

### Highlights

- **Honest pricing policy (non-negotiable).** A price figure is only ever
  rendered when it comes from a live quote in the current session, with an
  inline source badge (e.g. `Live · Amadeus · 14:32`) and a transparency line
  (`2026-10-12 · one-way · per traveller`). Rail, bus and ferry never show a
  price figure — only durations (labelled `est.` when modelled) and
  "Check live prices on …" links. The `gate:honesty` Playwright check fails
  the build if any price figure lacks a source badge.
- **One Explore hub.** Interactive offline map, Carrier Directory and
  Tourism Providers were merged into a single country-centric Explore hub
  (`/explore/[countryCode]`) with six section tabs
  (`#overview`, `#terminals`, `#carriers`, `#see-do`, `#entry-rules`,
  `#local`), section tabs synced to the URL hash.
- **Unified Search experience.** Home hero search card with autocomplete
  over the full destination set, dates, passengers, currency, nationality
  and popular-route chips; results use segmented sub-tabs
  (Multi-modal, Flights, Rail, Bus, Ferry, Visa, Compare, Stays) with
  per-mode empty-state explanations and honest schedule status.
- **Offline-first map.** Bundled TopoJSON SVG rendering (no tile server, no
  API key), country hover showing honest counts, click-through to the
  country hub; countries grid as the non-map path.
- **Live sources, graceful degradation.** Flights (Amadeus / Travelpayouts),
  Transitous MOTIS rail & bus, Open-Meteo weather, Nominatim/GeoDB geocoding,
  OSRM driving, Overpass sights, Booking/Expedia stays, Skyscanner fares,
  Travel Advisor ratings, AviationStack departures, TfL status, Deutsche Bahn
  IRIS station board and OpenSky aircraft (both relayed through
  `electron/api-relay.js`), Frankfurter FX (informational only — fares are
  never converted). HTTP 429 and missing keys degrade to an honest message
  instead of fabricated data; there is no mock fare generator anywhere.

### Structure

- **Phases 0–3:** Foundation, Data pipeline, Search, Explore.
- **Phases 4–5 (Trips / Resources):** not exposed as UI. The trip-plan state,
  `src/data/resource-catalog.ts` and `data/resources/` are kept and validated
  by `gate-curated`; the routes, sidebar entries and `gate:trips` were removed.
- **Phase 6:** Release — desktop build (`desktop:build`, NSIS + portable),
  docs, final verification.

### Quality gates

`npm run verify` runs the full chain; every gate passes before a phase is
considered done:

| Gate | Purpose |
| --- | --- |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint |
| `gate:data` | generated destination data integrity |
| `gate:curated` | curated carriers, providers, visa, resource catalogue |
| `build` | Next.js static export (`output: "export"`) |
| `gate:honesty` | no price figure without a source badge |
| `gate:empty` | every empty mode explains why |
| `gate:search` | search UX behaviours |
| `gate:live` | 13 live-source checks incl. 429 honesty |
| `gate:explore` | Explore hub, offline map, section tabs |

Network-dependent link verifiers run outside the chain:

```
npm run verify:links   # external deep-link verifier
npm run verify:visa    # visa portal verifier
```

Evidence screenshots are written to `scripts/evidence/`.

### Platform

- Windows desktop build via Electron + electron-builder:
  `npm run desktop:build` → `dist-desktop/` (NSIS installer + portable).
- `NEXT_PUBLIC_APP_VERSION` and `NEXT_PUBLIC_BUILD_TIME` are injected into
  the static bundle by `next.config.mjs`; the sidebar footer shows the
  version from `package.json` (single source of truth).

[1.0.0]: https://github.com/allinone-travel/releases/tag/v1.0.0
