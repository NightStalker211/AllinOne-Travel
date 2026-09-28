// ============================================================
// AllinOne Travel — Fixed general search links per mode
//
// Replaces the deleted per-carrier system (CARRIER_URL_MAP /
// getOwnSiteUrl / getBookingProvider carrier-matching). Each mode
// has a FIXED list of general search links — the same links are
// rendered on every card of that mode, so a link can never name a
// carrier the card's route doesn't involve, and a button label can
// never drift from where it lands (the label IS the site name).
//
// Two kinds of entries:
//   - prefilled deep links → the URL carries origin/destination/
//     date (or city + check-in/out), verified to echo the params.
//   - search-home links    → the site exposes no stable public
//     prefill; the link lands on its live search page. Honest
//     label, no pretend parameters.
//
// Every URL is load-verified by scripts/verify-search-links.ts
// (evidence recorded there / in the session report).
// ============================================================

import { withMarker } from "@/lib/affiliate";

export type SearchLinkMode = "air" | "rail" | "bus" | "sea" | "cruise" | "hotels";

export interface SearchLinkParams {
  /** City name ("Istanbul"), "City, Country", "(IST)" or bare IATA. */
  origin?: string;
  destination?: string;
  /** YYYY-MM-DD departure date. */
  date?: string;
  passengers?: number;
  /** Hotels: stay city (defaults to destination). */
  city?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface SearchLink {
  /** Exactly the site the href lands on. */
  label: string;
  href: (p: SearchLinkParams) => string;
  /** Market restriction the UI must show, if any (cruise catalog). */
  region?: string;
}

// ---------- Input normalisation helpers ----------

function enc(s: string): string {
  return encodeURIComponent(s);
}

/** "(IST)" → "IST"; "Istanbul, Turkey" → "Istanbul"; bare "IST" kept. */
function iataOrCity(input?: string): string {
  const s = input || "";
  const m = s.match(/\(([A-Z]{3})\)/);
  if (m) return m[1];
  const bare = s.trim();
  if (/^[A-Z]{3}$/.test(bare)) return bare;
  return bare.replace(/\s*\([^)]*\)\s*/g, "").split(",")[0].trim();
}

/** Lowercased alphanumerics only — Skyscanner/Google path key. */
function pathKey(input?: string): string {
  return iataOrCity(input).toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** For natural-language queries: "Istanbul, Turkey" → "Istanbul". */
function cityName(input?: string): string {
  return iataOrCity(input);
}

/** YYYY-MM-DD → YYMMDD (Skyscanner path date). */
function yymmdd(iso?: string): string {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.split("-");
  return `${y.slice(2)}${m}${d}`;
}

function pax(p: SearchLinkParams): number {
  return p.passengers && p.passengers > 0 ? p.passengers : 1;
}

function stayCity(p: SearchLinkParams): string {
  return (p.city || p.destination || p.origin || "").split(",")[0].trim();
}

/** General web search — Bing verified loading + echoing the query. */
function bingSearch(query: string): string {
  return `https://www.bing.com/search?q=${enc(query)}`;
}

// ---------- FlixBus city UUIDs (only known stable prefill) ----------

const FLIXBUS_CITY_IDS: Record<string, string> = {
  berlin: "40d8f682-8646-11e6-9066-549f350fcb0c",
  prague: "40de1ad1-8646-11e6-9066-549f350fcb0c",
  vienna: "40de1f31-8646-11e6-9066-549f350fcb0c",
};

function flixBusHref(p: SearchLinkParams): string {
  const from = cityName(p.origin).toLowerCase();
  const to = cityName(p.destination).toLowerCase();
  const depId = FLIXBUS_CITY_IDS[from];
  const arrId = FLIXBUS_CITY_IDS[to];
  if (depId && arrId && p.date) {
    const [y, m, d] = p.date.split("-");
    return `https://shop.flixbus.com/search?rideDate=${d}.${m}.${y}&adult=${pax(p)}&_locale=en&currency=EUR&departureCity=${depId}&arrivalCity=${arrId}`;
  }
  return "https://shop.flixbus.com/";
}

// ============================================================
// The catalog — 10–12 fixed links per mode.
// ORDER MATTERS: index 0 is the card's primary CTA button.
// ============================================================

const RAW_SEARCH_LINKS: Record<SearchLinkMode, SearchLink[]> = {
  // ---------------- Air ----------------
  air: [
    {
      label: "Google Flights",
      href: (p) =>
        `https://www.google.com/travel/flights?q=Flights+from+${enc(
          iataOrCity(p.origin)
        )}+to+${enc(iataOrCity(p.destination))}${
          p.date ? `+on+${p.date}` : ""
        }&hl=en`,
    },
    {
      label: "Kayak",
      href: (p) =>
        `https://www.kayak.com/flights/${pathKey(p.origin)}-${pathKey(
          p.destination
        )}${p.date ? `/${p.date}` : ""}?adults=${pax(p)}`,
    },
    {
      label: "Skyscanner",
      href: (p) => {
        const d = yymmdd(p.date);
        return `https://www.skyscanner.com/transport/flights/${pathKey(
          p.origin
        )}/${pathKey(p.destination)}/${d ? `${d}/` : ""}`;
      },
    },
    {
      label: "Momondo",
      href: (p) =>
        `https://www.momondo.com/flight-search/${pathKey(p.origin)}-${pathKey(
          p.destination
        )}${p.date ? `/${p.date}` : ""}`,
    },
    {
      label: "Cheapflights",
      href: (p) =>
        `https://www.cheapflights.com/flight-search/${pathKey(p.origin)}-${pathKey(
          p.destination
        )}${p.date ? `/${p.date}` : ""}`,
    },
    {
      label: "Kiwi.com",
      href: (p) =>
        `https://www.kiwi.com/en/search/results/${pathKey(p.origin)}/${pathKey(
          p.destination
        )}/${p.date || ""}?adults=${pax(p)}&currency=usd`,
    },
    {
      label: "Trip.com",
      href: () => "https://www.trip.com/flights/",
    },
    {
      label: "eDreams",
      href: () => "https://www.edreams.com/",
    },
    {
      label: "Wego",
      href: () => "https://www.wego.com/",
    },
    {
      label: "Jetcost",
      href: () => "https://www.jetcost.com/",
    },
    {
      label: "FareCompare",
      href: () => "https://www.farecompare.com/",
    },
    {
      // Travelpayouts program host — always carries ?marker=782929
      // (added centrally by withMarker).
      label: "Aviasales",
      href: (p) => {
        const from = iataOrCity(p.origin).toUpperCase();
        const to = iataOrCity(p.destination).toUpperCase();
        const ddmm =
          p.date && p.date.length >= 10
            ? `${p.date.slice(8, 10)}${p.date.slice(5, 7)}`
            : "";
        return ddmm && /^[A-Z]{3}$/.test(from) && /^[A-Z]{3}$/.test(to)
          ? `https://www.aviasales.com/search/${from}${to}${ddmm}`
          : "https://www.aviasales.com/";
      },
    },
    {
      label: "Bing Search",
      href: (p) =>
        bingSearch(
          `flights from ${cityName(p.origin)} to ${cityName(p.destination)}${
            p.date ? ` on ${p.date}` : ""
          }`
        ),
    },
  ],

  // ---------------- Rail ----------------
  rail: [
    {
      label: "Trainline",
      href: (p) =>
        `https://www.thetrainline.com/book/results?origin=${enc(
          cityName(p.origin)
        )}&destination=${enc(cityName(p.destination))}&outwardDate=${
          p.date || ""
        }&journeyTypes=o`,
    },
    {
      label: "Deutsche Bahn",
      href: (p) =>
        `https://www.bahn.de/buchung/fahrplan/suche?from=${enc(
          cityName(p.origin)
        )}&to=${enc(cityName(p.destination))}&date=${p.date || ""}&time=00%3A00`,
    },
    {
      label: "SNCF Connect",
      href: (p) =>
        `https://www.sncf-connect.com/en/app/results/journey?departure=${enc(
          cityName(p.origin)
        )}&arrival=${enc(cityName(p.destination))}&outwardDate=${p.date || ""}`,
    },
    {
      label: "Renfe",
      href: (p) =>
        `https://www.renfe.com/es/en?dstation=${enc(
          cityName(p.origin)
        )}&astation=${enc(cityName(p.destination))}&date=${p.date || ""}`,
    },
    {
      label: "Omio",
      href: () => "https://www.omio.com/",
    },
    {
      label: "ÖBB",
      href: () => "https://fahrplan.oebb.at/webapp/?P=HimSearch&start=1&language=en",
    },
    {
      label: "Trenitalia",
      href: () => "https://www.trenitalia.com/en/information/online-ticket.html",
    },
    {
      label: "Eurostar",
      href: () => "https://www.eurostar.com/uk-en",
    },
    {
      label: "SBB",
      href: () => "https://www.sbb.ch/en",
    },
    {
      label: "National Rail",
      href: () => "https://www.nationalrail.co.uk/",
    },
    {
      label: "Bing Search",
      href: (p) =>
        bingSearch(
          `train from ${cityName(p.origin)} to ${cityName(p.destination)}${
            p.date ? ` on ${p.date}` : ""
          }`
        ),
    },
  ],

  // ---------------- Bus ----------------
  bus: [
    { label: "FlixBus", href: flixBusHref },
    { label: "Omio", href: () => "https://www.omio.com/" },
    { label: "BlaBlaCar", href: () => "https://www.blablacar.com/" },
    { label: "National Express", href: () => "https://www.nationalexpress.com/" },
    { label: "RegioJet", href: () => "https://regiojet.com/en" },
    { label: "ALSA", href: () => "https://www.alsa.com/en" },
    { label: "Greyhound", href: () => "https://www.greyhound.com/" },
    { label: "Busbud", href: () => "https://www.busbud.com/" },
    { label: "CheckMyBus", href: () => "https://www.checkmybus.com/" },
    { label: "redBus", href: () => "https://www.redbus.com/" },
    {
      label: "Bing Search",
      href: (p) =>
        bingSearch(
          `bus from ${cityName(p.origin)} to ${cityName(p.destination)}${
            p.date ? ` on ${p.date}` : ""
          }`
        ),
    },
  ],

  // ---------------- Sea / Ferry ----------------
  sea: [
    { label: "Direct Ferries", href: () => "https://www.directferries.com/" },
    { label: "Ferryhopper", href: () => "https://www.ferryhopper.com/en/ferry-routes" },
    { label: "AFerry", href: () => "https://www.aferry.com/" },
    { label: "Ferryscanner", href: () => "https://www.ferryscanner.com/" },
    { label: "Stena Line", href: () => "https://www.stenaline.com/" },
    { label: "Color Line", href: () => "https://www.colorline.com/" },
    { label: "Viking Line", href: () => "https://www.vikingline.com/" },
    { label: "DFDS", href: () => "https://www.dfds.com/" },
    { label: "Grimaldi Lines", href: () => "https://www.grimaldi-lines.com/" },
    { label: "Tallink", href: () => "https://www.tallink.com/" },
    { label: "Irish Ferries", href: () => "https://www.irishferries.com/" },
    { label: "P&O Ferries", href: () => "https://www.poferries.com/" },
    {
      label: "Bing Search",
      href: (p) =>
        bingSearch(
          `ferry from ${cityName(p.origin)} to ${cityName(p.destination)}${
            p.date ? ` on ${p.date}` : ""
          }`
        ),
    },
  ],

  // ---------------- Cruise ----------------
  // Cruises are round trips from a home port, never point-to-point: no
  // origin/destination/date is ever appended here. Every entry is a plain
  // live entry point, load-verified like the rest of the catalog, and none
  // of these hostnames appears in the browsable resource catalog.
  cruise: [
    { label: "Kayak Cruises", href: () => "https://www.kayak.com/cruises" },
    { label: "Vacations To Go", href: () => "https://www.vacationstogo.com/" },
    { label: "CruiseWatch", href: () => "https://www.cruisewatch.com/" },
    { label: "CruiseMapper", href: () => "https://www.cruisemapper.com/" },
    { label: "CruiseLine", href: () => "https://www.cruiseline.com/" },
    { label: "Silversea", href: () => "https://www.silversea.com/" },
    { label: "Seabourn", href: () => "https://www.seabourn.com/" },
    { label: "Azamara", href: () => "https://www.azamara.com/" },
    { label: "Oceania Cruises", href: () => "https://www.oceaniacruises.com/" },
    { label: "Regent Seven Seas", href: () => "https://www.regentcruises.com/" },
    { label: "Cruise.co.uk", href: () => "https://www.cruise.co.uk/", region: "UK" },
    { label: "Dreamlines", href: () => "https://www.dreamlines.com/", region: "Germany" },
  ],

  // ---------------- Hotels ----------------
  hotels: [
    {
      label: "Booking.com",
      href: (p) =>
        `https://www.booking.com/searchresults.html?ss=${enc(stayCity(p))}${
          p.checkIn ? `&checkin=${p.checkIn}` : ""
        }${p.checkOut ? `&checkout=${p.checkOut}` : ""}&group_adults=${pax(
          p
        )}&no_rooms=1&group_children=0`,
    },
    {
      label: "Google Hotels",
      href: (p) =>
        `https://www.google.com/travel/hotels?q=${enc(
          `Hotels in ${stayCity(p)}`
        )}&hl=en`,
    },
    {
      label: "Airbnb",
      href: (p) =>
        `https://www.airbnb.com/s/${enc(stayCity(p))}/homes?${
          p.checkIn ? `checkin=${p.checkIn}&` : ""
        }${p.checkOut ? `checkout=${p.checkOut}&` : ""}adults=${pax(p)}`,
    },
    {
      label: "KAYAK",
      href: (p) =>
        p.checkIn && p.checkOut
          ? `https://www.kayak.com/hotels/${encodeURIComponent(
              stayCity(p).toLowerCase().replace(/\s+/g, "-")
            )},${p.checkIn},${p.checkOut}?sort=price_a`
          : `https://www.kayak.com/hotels/${encodeURIComponent(
              stayCity(p).toLowerCase().replace(/\s+/g, "-")
            )}`,
    },
    { label: "Agoda", href: () => "https://www.agoda.com/" },
    { label: "Trivago", href: () => "https://www.trivago.com/" },
    { label: "Trip.com", href: () => "https://www.trip.com/hotels/" },
    { label: "Hostelworld", href: () => "https://www.hostelworld.com/" },
    { label: "Vrbo", href: () => "https://www.vrbo.com/" },
    { label: "HotelsCombined", href: () => "https://www.hotelscombined.com/" },
    { label: "HotelTonight", href: () => "https://www.hoteltonight.com/" },
    {
      label: "Bing Search",
      href: (p) =>
        bingSearch(
          `hotels in ${stayCity(p)}${p.checkIn ? ` ${p.checkIn}` : ""}`
        ),
    },
  ],
};

// Affiliate marker: every outbound redirect to a partner host gets
// ?marker=782929 (Travelpayouts program) at href() call time, so no
// individual entry can forget it.
export const SEARCH_LINKS: Record<SearchLinkMode, SearchLink[]> =
  Object.fromEntries(
    (Object.keys(RAW_SEARCH_LINKS) as SearchLinkMode[]).map((mode) => [
      mode,
      RAW_SEARCH_LINKS[mode].map((l) => ({
        ...l,
        href: (p: SearchLinkParams) => withMarker(l.href(p)),
      })),
    ])
  ) as Record<SearchLinkMode, SearchLink[]>;

/** The card's primary CTA target for a mode (first entry). */
export function primarySearchLink(mode: SearchLinkMode): SearchLink {
  return SEARCH_LINKS[mode][0];
}
