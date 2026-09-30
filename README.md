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
npm run verify:links # network: loads every provider deep link (bot-walls tolerated)
npm run verify:visa  # network: loads every official visa portal
```

## Data sources (read-only, local-only — not in git)

- `Travel '.ts'/EU/destinations_*.ts` — 50 country files, 4,006 terminal records
- `Travel Docs/` — country reference PDFs (not committed; local only)

## Live open-data sources (keyless)

| Need | Source | Notes |
|---|---|---|
| Weather | Open-Meteo | 3-day forecast strip on /search |
| Geocoding | Nominatim / OpenStreetMap | autocomplete fallback, marked "OSM" |
| Rail/bus schedules | Transitous MOTIS | live times, rendered only when confirmed |
| Driving route | OSRM public demo | road km + drive time on the Multi-modal tab |
| Nearby sights | Overpass (OSM) | named POIs within 5 km of the destination |
| Reference FX rates | Frankfurter (ECB) | `1 XXX = YYY` line on the Explore panel, dated |
| Flight prices | Travelpayouts via `/api/tp` | observed fares, badge + transparency line |

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

1. A price renders only with a live source badge from this session.
2. Rail/bus/ferry/hotel results never show price figures — they deep-link.
3. No fabricated times, flight numbers, ratings, discounts or urgency copy.
