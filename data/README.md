# data/ — bundled open data (local, gitignored subfolders)

This folder holds **locally downloaded open datasets** used by FEAT-10 scripts
and future enrichers. The subfolders below are **gitignored** (see the repo root
`.gitignore`: `/data/ourairports/`, `/data/openflights/`, `/data/gtfs/`) so raw
dumps never enter the repository. Only this README (the manifest) is committed.

## Sources & licenses

| Subfolder | Source | License | How to refresh |
| --- | --- | --- | --- |
| `data/ourairports/` | [OurAirports](https://ourairports.com/data/) CSV exports (`airports.csv`, `runways.csv`, `airport-frequencies.csv`, …) | Public domain (CC0) | `npm run download:ourairports` |
| `data/openflights/` | [OpenFlights](https://openflights.org/data.php) dumps (`airports.dat`, `airlines.dat`, `routes.dat`) | Open Database License (ODbL) — attribution required when used | `npm run download:openflights` |
| `data/gtfs/<agency>/` | Agency-published GTFS zip feeds (per operator; each has its own terms, usually CC-BY / open data) | Per-agency — see `<agency>/LICENSE.txt` written by the downloader when known | `npm run download:gtfs` |

## Expected contents

- `data/ourairports/` — CSV files as published by OurAirports. Primary consumer
  target: `airports.csv` (~8–9 MB, all airports with ICAO/IATA/LAT/LON).
- `data/openflights/` — comma-separated `.dat` files. Primary consumer targets:
  `routes.dat` (~1.5 MB) and `airlines.dat` (~300 KB).
- `data/gtfs/<agency>/` — one folder per agency containing the unzipped GTFS
  files (`stops.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`,
  `agency.txt`, …) plus the original `<agency>.gtfs.zip` if retained.

## Ground rules

1. **Never commit downloaded data** — the folders above are ignored on purpose.
   This README is the only tracked file here.
2. **Download scripts own writes** — add/refresh files only via
   `npm run download:ourairports`, `npm run download:openflights`, and
   `npm run download:gtfs`. Manual drops are not picked up by tooling.
3. **Validate after download** — every script checks HTTP status, minimum file
   size, and the CSV/`.dat` header (and a row-count sanity floor) before
   reporting success; a failed check exits non-zero.
4. **Offline first** — the shipped app must never require these files at
   runtime; they are inputs for generators/enrichers only.
5. **Attribution** — OpenFlights data is ODbL: keep attribution in any
   distributed artifact derived from it. OurAirports is public domain. GTFS
   terms vary per agency (recorded alongside each feed).
