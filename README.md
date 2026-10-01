# AllinOne Travel

A multi-modal travel planner desktop app (Next.js 14 static export + Electron)
with **honest, live-only pricing**: live flight fares where an API provides
them, pre-filled deep-link price checks everywhere else — and never a
fabricated number.

## Status

Ground-up rebuild complete through release candidates. Current scope is
**Search + Explore** (the Trips and Resources routes were removed during
the rebuild; the curated resource catalog stays as data, validated by
`gate:curated`).

| Phase | Deliverable |
|---|---|
| 0 ✅ | Scaffold, design tokens + primitives, sidebar shell, screenshot gate |
| 1 ✅ | Data pipeline (50 destination files → typed dataset, coord enrichment) |
| 2 ✅ | Search + live flight fares (Amadeus/Travelpayouts) + deep-link price checks, return date, fee badges |
| 3 ✅ | Explore hub (map 70% + country panel with six hash-synced tabs: terminals, carriers, sights, visa) |
| 4 ➖ | Trips — removed from the UI by decision |
| 5 ➖ | Resources — route removed; catalog data kept and still gate-checked |
| 6 ✅ | Release build (`npm run desktop:build`, NSIS + portable) |

## Development

```bash
npm install
npm run dev          # web dev server on :3000
npm run desktop      # dev: Next.js + Electron together
npm run build        # static export to ./out
npm run desktop:preview   # build + run Electron against ./out
npm run typecheck && npm run lint
npm run verify       # full gate suite (typecheck, lint, data, curated, build, honesty, empty-state, search, live, explore)
npm run check:apis   # network: status table for every configured API (never prints secrets)
npm run verify:links # network: loads every provider deep link (bot-walls tolerated)
npm run verify:visa  # network: loads every official visa portal
```

## Data sources (read-only, local-only — not in git)

- `Travel '.ts'/EU/destinations_*.ts` — 50 country files, 4,006 terminal records
- `Travel Docs/` — country reference PDFs (not committed; local only)

## Live sources (keyless + keyed)

Keyed services read `.env.local` (git-ignored; names in `.env.example`;
`NEXT_PUBLIC_*` mirrors are inlined into the static bundle at build time).
`npm run check:apis` prints one status table for all of them.

| Need | Source | Notes |
|---|---|---|
| Weather | Open-Meteo → OpenWeather fallback | 3-day strip on /search; the strip names the service that answered |
| Geocoding | Nominatim / OSM; GeoDB via RapidAPI | autocomplete fallback, entries marked "OSM" / "GeoDB" |
| Rail/bus schedules | Transitous MOTIS | live times, rendered only when confirmed |
| Driving route | OSRM → GraphHopper → OpenRouteService | road km + drive time; source line names the answering router |
| Nearby sights | Overpass (OSM) + Travel Advisor ratings | named POIs within 2.5 km; live-rated "Top rated nearby" section (Travel Advisor) |
| Hotel prices | Booking.com via RapidAPI | live stay rates on the Stays tab, nearest-first, badge + stay basis |
| Departures board | AviationStack | today's board from the origin airport on the Flights tab |
| London network status | Transport for London | live line statuses on the Rail tab for London routes |
| Reference FX rates | Frankfurter (ECB) → RapidAPI Currency fallback | `1 XXX = YYY` line on the Explore panel, dated + attributed |
| Flight prices | Travelpayouts via `/api/tp`; Amadeus when configured | observed fares, badge + transparency line |

All of them degrade honestly: on failure the figure simply does not
render (or an explicit "unavailable" note appears) — never a guess.

## Self-hosting open data (optional)

Public instances are fine for personal use. If you outgrow their rate
limits, `docker-compose.yml` scaffolds the open-source stack
(OSRM `:5000`, OpenTripPlanner `:8080`, Nominatim `:8081`, localhost
only):

```bash
# 1. data (git-ignored): download an OSM extract + GTFS feeds into ./data/
#    OSM:  https://download.geofabrik.de/  (e.g. europe/germany-latest.osm.pbf)
#    GTFS: https://transitfeeds.com/ or operator portals
# 2. prepare + start (see each image's docs for import steps)
docker compose up -d
```

The file has not been started on this machine (no Docker installed
here) — treat it as a documented starting point, not a tested
deployment.

## Honesty rules (enforced by gates)

1. A price renders only with a live source badge from this session —
   flights (Amadeus/Travelpayouts) and hotel stay rates (Booking.com)
   both follow this rule with their own transparency lines.
2. Rail/bus/ferry/cruise results never show price figures — they deep-link.
3. No fabricated times, flight numbers, discounts or urgency copy;
   ratings render only where a live source genuinely returned them
   (Travel Advisor), dated and attributed.
