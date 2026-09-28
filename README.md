# AllinOne Travel

A multi-modal travel planner desktop app (Next.js 14 static export + Electron)
with **honest, live-only pricing**: live flight fares where an API provides
them, pre-filled deep-link price checks everywhere else — and never a
fabricated number.

## Status

Ground-up rebuild. Phase 0 (foundation) shipped: scaffold, design system,
sidebar shell.

| Phase | Deliverable |
|---|---|
| 0 ✅ | Scaffold, design tokens + primitives, sidebar shell, screenshot gate |
| 1 | Data pipeline (50 destination files → typed dataset, coord enrichment) |
| 2 | Search + live flight fares (Amadeus) + deep-link price checks |
| 3 | Explore hub (map + country panel: terminals, carriers, sights, visa) |
| 4 | Trips (itinerary builder) |
| 5 | Resources directory |
| 6 | Release build (NSIS + portable) |

## Development

```bash
npm install
npm run dev          # web dev server on :3000
npm run build        # static export to ./out
npm run desktop:preview   # build + run Electron against ./out
npm run typecheck && npm run lint
```

## Data sources (read-only, committed)

- `Travel '.ts'/EU/destinations_*.ts` — 50 country files, 4,006 terminal records
- `Travel Docs/` — country reference PDFs (not committed; local only)

## Honesty rules (enforced by gates)

1. A price renders only with a live source badge from this session.
2. Rail/bus/ferry/hotel results never show price figures — they deep-link.
3. No fabricated times, flight numbers, ratings, discounts or urgency copy.
