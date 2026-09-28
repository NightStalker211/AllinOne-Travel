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

## Honesty rules (enforced by gates)

1. A price renders only with a live source badge from this session.
2. Rail/bus/ferry/hotel results never show price figures — they deep-link.
3. No fabricated times, flight numbers, ratings, discounts or urgency copy.
