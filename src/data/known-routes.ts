// ============================================================
// AllinOne Travel — Curated known-direct routes
//
// WHY THIS EXISTS
// ---------------
// The synthetic flight generator used to name a carrier and claim
// "Direct" for every card, purely because the airline happens to be
// based in the origin or destination country. That invented facts.
//
// This file is the honesty gate. A flight card may name a carrier and
// may say "direct" ONLY when the (carrier, origin, destination) triple
// appears in KNOWN_DIRECT_ROUTES below. Anything else must render as
// "Airline not confirmed" / "stops not confirmed".
//
// SCOPE & PROVENANCE
// ------------------
// Curated by hand from published route networks, September 2026.
// Only airports that exist in src/lib/data/destinations.ts are listed
// (a route whose airport we don't index can never be searched anyway).
//
// This is NOT a live feed. Schedules change seasonally and routes get
// suspended. That is why every card that relies on this data also
// carries "estimate" pricing and points the user at a live search to
// confirm. Cross-check against src/lib/data/destinations.ts, Wikipedia
// airline destination lists and the linked booking sites.
//
// WHAT IS DELIBERATELY NOT HERE
// -----------------------------
// - Any route where the operating carrier is seasonal, uncertain, or
//   shared between codeshare partners. Omission is safe (card says
//   "Airline not confirmed"); a wrong entry would be a false claim.
// - Flight numbers, times, aircraft and fare rules — never curated,
//   always unknown for estimate cards.
// ============================================================

export interface CuratedRoute {
  /** Carrier display name — must match AIRLINES_BY_COUNTRY entries. */
  carrier: string;
  /** Origin IATA. */
  from: string;
  /** Destination IATA. */
  to: string;
}

type Row = readonly [carrier: string, from: string, to: string];

const ROWS: readonly Row[] = [
  // ---------- Turkish Airlines (IST hub) ----------
  ...hub("Turkish Airlines", "IST", [
    "LHR", "AMS", "CDG", "FRA", "MUC", "DUS", "BER", "ZRH", "VIE", "BRU",
    "CPH", "ARN", "OSL", "HEL", "WAW", "PRG", "BUD", "OTP", "KEF", "DUB",
    "MXP", "FCO", "MAD", "BCN", "LIS", "ATH",
    "JFK", "ORD", "LAX", "MIA", "IAH", "GRU", "GIG",
    "NRT", "BKK", "SIN", "DEL", "BOM", "BLR",
    "DXB", "AUH", "JNB", "CPT", "SVO", "TBS", "EVN", "GYD",
  ]),

  // ---------- British Airways (LHR hub) ----------
  ...hub("British Airways", "LHR", [
    "CDG", "AMS", "FRA", "MUC", "DUS", "BER", "ZRH", "GVA", "VIE", "BRU",
    "CPH", "ARN", "OSL", "HEL", "WAW", "PRG", "BUD", "OTP", "KEF", "DUB",
    "MAD", "BCN", "LIS", "FCO", "MXP", "VCE", "NCE", "ATH", "IST",
    "JFK", "ORD", "LAX", "MIA", "IAH", "GRU",
    "JNB", "CPT", "DXB", "DEL", "BOM", "BLR", "MAA",
    "SIN", "BKK", "NRT", "SYD", "MEL",
  ]),

  // ---------- Air France (CDG hub) ----------
  ...hub("Air France", "CDG", [
    "LHR", "AMS", "FRA", "MUC", "ZRH", "GVA", "VIE",
    "CPH", "ARN", "OSL", "HEL", "WAW", "PRG", "BUD", "DUB",
    "MAD", "BCN", "LIS", "FCO", "MXP", "VCE", "NCE", "ATH", "IST", "BER",
    "JFK", "ORD", "LAX", "IAH", "GRU", "GIG",
    "JNB", "CPT", "DEL", "BOM", "BLR", "MAA",
    "SIN", "BKK", "NRT", "HND",
  ]),

  // ---------- Lufthansa (FRA + MUC) ----------
  ...hub("Lufthansa", "FRA", [
    "LHR", "CDG", "AMS", "ZRH", "VIE", "BRU", "CPH", "ARN", "OSL", "HEL",
    "WAW", "PRG", "BUD", "OTP", "DUB", "MAD", "BCN", "LIS", "FCO", "MXP",
    "VCE", "NCE", "ATH", "IST", "BER",
    "JFK", "ORD", "LAX", "MIA", "IAH", "GRU",
    "JNB", "CPT", "DEL", "BOM", "BLR", "MAA",
    "SIN", "BKK", "NRT", "HND",
  ]),
  ...hub("Lufthansa", "MUC", [
    "LHR", "CDG", "AMS", "ZRH", "VIE", "MAD", "BCN", "FCO", "MXP",
    "ATH", "IST", "CPH", "DUB", "BER",
    "JFK", "MIA", "ORD", "IAH", "LAX", "GRU", "JNB", "NRT", "HND",
  ]),

  // ---------- KLM (AMS hub) ----------
  ...hub("KLM", "AMS", [
    "LHR", "CDG", "FRA", "MUC", "ZRH", "GVA", "VIE", "BRU", "CPH", "ARN",
    "OSL", "HEL", "WAW", "PRG", "BUD", "DUB", "MAD", "BCN", "LIS", "FCO",
    "MXP", "VCE", "ATH", "IST",
    "JFK", "ORD", "LAX", "IAH", "GRU", "GIG", "JNB", "CPT",
    "DEL", "BOM", "BLR", "SIN", "BKK", "NRT", "HND",
  ]),

  // ---------- Iberia (MAD hub) ----------
  ...hub("Iberia", "MAD", [
    "LHR", "CDG", "AMS", "FRA", "ZRH", "BRU", "DUB",
    "FCO", "MXP", "VCE", "NCE", "ATH",
    "JFK", "LAX", "MIA", "IAH", "GRU",
  ]),

  // ---------- ITA Airways (FCO hub) ----------
  ...hub("ITA Airways", "FCO", [
    "LHR", "CDG", "AMS", "FRA", "ZRH", "VIE", "BRU",
    "MAD", "BCN", "NCE", "ATH",
    "JFK", "ORD", "GRU",
  ]),

  // ---------- SWISS (ZRH hub) ----------
  ...hub("Swiss", "ZRH", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "VIE", "BRU", "CPH", "DUB",
    "MAD", "BCN", "FCO", "MXP", "VCE", "NCE", "ATH", "IST",
    "JFK", "ORD", "LAX", "GRU", "JNB", "CPT",
    "SIN", "BKK", "NRT", "HND", "DEL", "BOM",
  ]),

  // ---------- Austrian Airlines (VIE hub) ----------
  ...hub("Austrian Airlines", "VIE", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "ZRH", "BRU", "CPH", "ARN",
    "PRG", "BUD", "OTP", "DUB", "MAD", "BCN", "FCO", "MXP", "ATH", "IST",
    "JFK", "ORD", "LAX", "BKK", "DEL", "BOM",
  ]),

  // ---------- Finnair (HEL hub) ----------
  ...hub("Finnair", "HEL", [
    "LHR", "CDG", "AMS", "FRA", "CPH", "ARN", "OSL", "WAW", "DUB",
    "FCO", "ATH",
    "JFK", "NRT",
  ]),

  // ---------- SAS (CPH / ARN / OSL) ----------
  ...hub("SAS", "CPH", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "ZRH", "ARN", "OSL", "DUB",
    "FCO", "MXP",
    "JFK", "ORD", "LAX",
  ]),
  ...pairs("SAS", [
    ["ARN", "LHR"], ["ARN", "CPH"], ["ARN", "OSL"],
    ["OSL", "LHR"], ["OSL", "CPH"], ["OSL", "ARN"],
  ]),

  // ---------- Norwegian ----------
  ...pairs("Norwegian", [
    ["OSL", "LHR"], ["ARN", "LHR"], ["OSL", "ARN"],
    ["ARN", "CPH"], ["OSL", "CPH"], ["OSL", "DUB"], ["ARN", "DUB"],
    ["OSL", "FCO"], ["ARN", "FCO"],
  ]),

  // ---------- TAP Air Portugal (LIS hub) ----------
  ...hub("TAP Air Portugal", "LIS", [
    "LHR", "CDG", "AMS", "FRA", "DUB", "FCO", "MXP", "ATH",
    "JFK", "MIA", "IAH", "GRU",
  ]),

  // ---------- Aer Lingus (DUB hub) ----------
  ...hub("Aer Lingus", "DUB", [
    "LHR", "CDG", "MAD", "BCN", "FCO", "ATH", "LIS",
    "JFK", "ORD", "LAX", "MIA",
  ]),

  // ---------- Brussels Airlines (BRU hub) ----------
  ...hub("Brussels Airlines", "BRU", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "ZRH", "VIE", "DUB",
    "MAD", "BCN", "FCO", "MXP", "ATH", "IST",
    "JFK", "ORD",
  ]),

  // ---------- LOT Polish Airlines (WAW hub) ----------
  ...hub("LOT Polish Airlines", "WAW", [
    "LHR", "CDG", "AMS", "ZRH", "VIE", "CPH", "PRG", "BUD", "OTP",
    "DUB", "MAD", "BCN", "FCO", "ATH", "IST",
    "JFK", "ORD",
  ]),

  // ---------- Air Serbia (BEG hub) ----------
  ...hub("Air Serbia", "BEG", [
    "FRA", "MUC", "ZRH", "VIE", "BRU", "FCO", "ATH", "IST",
    "JFK",
  ]),

  // ---------- Aegean Airlines (ATH hub) ----------
  ...hub("Aegean Airlines", "ATH", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "ZRH", "VIE", "BRU",
    "MAD", "BCN", "FCO", "MXP",
    "JFK",
  ]),

  // ---------- Croatia Airlines ----------
  ...pairs("Croatia Airlines", [
    ["ZAG", "FRA"], ["ZAG", "MUC"], ["ZAG", "VIE"],
    ["ZAG", "CDG"], ["ZAG", "AMS"],
  ]),

  // ---------- Bulgaria Air ----------
  ...pairs("Bulgaria Air", [
    ["SOF", "LHR"], ["SOF", "FRA"], ["SOF", "VIE"], ["SOF", "CDG"],
  ]),

  // ---------- TAROM ----------
  ...pairs("TAROM", [
    ["OTP", "LHR"], ["OTP", "CDG"], ["OTP", "FRA"],
    ["OTP", "AMS"], ["OTP", "VIE"],
  ]),

  // ---------- Icelandair (KEF hub) ----------
  ...hub("Icelandair", "KEF", [
    "LHR", "AMS", "CPH", "ARN", "OSL", "DUB", "CDG", "MAD", "BCN",
    "JFK", "ORD", "LAX", "MIA",
  ]),

  // ---------- airBaltic (RIX hub) ----------
  ...pairs("airBaltic", [
    ["RIX", "AMS"], ["RIX", "BER"], ["RIX", "ARN"],
  ]),

  // ---------- Ryanair (UK / IE / central-Europe short haul) ----------
  ...pairs("Ryanair", [
    ["STN", "DUB"], ["STN", "MAD"], ["STN", "BCN"], ["STN", "FCO"],
    ["STN", "MXP"], ["STN", "ATH"], ["STN", "BRU"], ["STN", "WAW"],
    ["STN", "BUD"], ["STN", "PRG"], ["STN", "KRK"],
    ["DUB", "BCN"], ["DUB", "FCO"], ["DUB", "MAD"], ["DUB", "ATH"],
    ["DUB", "KRK"], ["DUB", "EDI"], ["DUB", "BHX"], ["DUB", "MAN"],
  ]),

  // ---------- easyJet ----------
  ...pairs("easyJet", [
    ["LGW", "GVA"], ["LGW", "BCN"], ["LGW", "FCO"], ["LGW", "AMS"],
    ["LGW", "NCE"], ["LGW", "ATH"], ["LGW", "PMI"],
    ["LTN", "AMS"], ["LTN", "GVA"],
  ]),

  // ---------- Wizz Air ----------
  ...pairs("Wizz Air", [
    ["LTN", "BUD"], ["LTN", "OTP"], ["LTN", "WAW"], ["LTN", "SOF"],
    ["STN", "BUD"], ["BUD", "OTP"],
  ]),

  // ---------- Eurowings ----------
  ...pairs("Eurowings", [
    ["BER", "DUS"], ["DUS", "PMI"], ["HAM", "PMI"],
  ]),

  // ---------- Vueling (BCN base) ----------
  ...pairs("Vueling", [
    ["BCN", "CDG"], ["BCN", "ORY"], ["BCN", "FCO"], ["BCN", "MXP"],
    ["BCN", "LHR"], ["BCN", "AMS"], ["BCN", "LIS"],
  ]),

  // ---------- Transavia (NL / FR) ----------
  ...pairs("Transavia", [
    ["AMS", "ATH"], ["AMS", "FCO"], ["ORY", "ATH"],
  ]),

  // ---------- Condor ----------
  ...pairs("Condor", [
    ["FRA", "TFS"], ["FRA", "PMI"], ["FRA", "AGP"],
  ]),

  // ---------- SunExpress (AYT base) ----------
  ...pairs("SunExpress", [
    ["AYT", "BER"], ["AYT", "DUS"], ["AYT", "HAM"], ["AYT", "CGN"],
    ["AYT", "MUC"], ["AYT", "FRA"], ["AYT", "VIE"], ["AYT", "ZRH"],
    ["AYT", "CPH"], ["AYT", "ARN"], ["AYT", "OSL"],
  ]),

  // ---------- Corendon Airlines ----------
  ...pairs("Corendon Airlines", [
    ["AMS", "AYT"], ["BRU", "AYT"],
  ]),

  // ---------- TUI fly / TUI Airways / Jet2.com (leisure) ----------
  ...pairs("TUI fly", [
    ["DUS", "AYT"], ["HAM", "AYT"], ["CGN", "AYT"], ["BER", "AYT"],
  ]),
  ...pairs("TUI Airways", [
    ["LGW", "AYT"], ["MAN", "AYT"], ["BHX", "AYT"],
  ]),
  ...pairs("Jet2.com", [
    ["MAN", "AYT"], ["EDI", "AYT"], ["BHX", "AYT"],
    ["MAN", "PMI"], ["BHX", "PMI"], ["MAN", "AGP"],
    ["MAN", "ALC"], ["MAN", "FAO"],
  ]),

  // PLAY deliberately absent — the airline ceased operations (listed
  // status:"defunct" in europeCarriers.ts); a current route claim would be false.

  // ---------- flydubai / Emirates / Singapore / Qantas / Thai ----------
  ...pairs("flydubai", [
    ["DXB", "IST"], ["DXB", "ATH"], ["DXB", "BKK"], ["DXB", "MUC"],
    ["DXB", "VIE"], ["DXB", "DEL"], ["DXB", "BOM"], ["DXB", "BLR"],
  ]),
  ...hub("Emirates", "DXB", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "ZRH", "VIE", "BRU", "MAN",
    "BHX", "DUB", "MAD", "BCN", "FCO", "MXP", "ATH", "IST",
    "JFK", "ORD", "LAX", "MIA", "GRU", "JNB", "CPT",
    "BKK", "SIN", "NRT", "SYD", "MEL", "PER",
    "DEL", "BOM", "BLR", "MAA",
  ]),
  ...hub("Singapore Airlines", "SIN", [
    "LHR", "CDG", "AMS", "FRA", "MUC", "ZRH", "MAD",
    "JFK", "LAX", "BKK", "NRT", "HND", "SYD", "MEL",
    "DEL", "BOM", "BLR", "MAA", "JNB", "CPT",
  ]),
  ...pairs("Qantas", [
    ["SYD", "SIN"], ["SYD", "LHR"], ["SYD", "HND"], ["SYD", "LAX"],
    ["MEL", "SIN"], ["MEL", "LAX"], ["PER", "LHR"],
  ]),
  ...hub("Thai Airways", "BKK", [
    "LHR", "CDG", "FRA", "NRT", "HND", "SYD", "MEL",
  ]),

  // ---------- India / Japan ----------
  ...pairs("Air India", [
    ["DEL", "LHR"], ["DEL", "FRA"], ["DEL", "JFK"], ["BOM", "LHR"],
    ["DEL", "BKK"], ["DEL", "SIN"], ["BOM", "DXB"], ["DEL", "DXB"],
  ]),
  ...pairs("IndiGo", [
    ["DEL", "DXB"], ["BOM", "DXB"], ["DEL", "BKK"], ["BOM", "BKK"],
    ["BLR", "DXB"], ["MAA", "DXB"], ["DEL", "IST"], ["BOM", "IST"],
  ]),
  ...pairs("Japan Airlines", [
    ["HND", "LHR"], ["HND", "JFK"], ["HND", "LAX"],
    ["HND", "SIN"], ["HND", "BKK"],
  ]),
  ...pairs("ANA", [
    ["HND", "LHR"], ["HND", "JFK"], ["HND", "LAX"],
    ["HND", "FRA"], ["HND", "MUC"], ["HND", "BRU"],
  ]),

  // ---------- Americas / US majors ----------
  ...pairs("LATAM Brasil", [["GRU", "MAD"]]),
  ...pairs("Delta Air Lines", [
    ["JFK", "LHR"], ["JFK", "AMS"], ["JFK", "CDG"], ["JFK", "MAD"],
    ["JFK", "ATH"], ["JFK", "IST"], ["JFK", "FCO"], ["JFK", "MIA"],
    ["LAX", "SYD"], ["LAX", "NRT"],
  ]),
  ...pairs("United Airlines", [
    ["ORD", "LHR"], ["ORD", "FRA"], ["ORD", "CDG"],
    ["ORD", "NRT"], ["ORD", "HND"],
    ["LAX", "SYD"], ["LAX", "NRT"],
    ["IAH", "GRU"], ["IAH", "LHR"],
  ]),
  ...pairs("American Airlines", [
    ["JFK", "LHR"], ["JFK", "MAD"], ["JFK", "FCO"], ["JFK", "CDG"],
    ["ORD", "LHR"], ["LAX", "HND"], ["MIA", "GRU"], ["MIA", "MAD"],
  ]),
  ...pairs("JetBlue", [["JFK", "LHR"], ["JFK", "CDG"]]),
];

// ---------- Builders (keep the table above readable) ----------

function hub(carrier: string, origin: string, dests: string[]): Row[] {
  return dests.map((d) => [carrier, origin, d] as const);
}

function pairs(carrier: string, list: ReadonlyArray<readonly [string, string]>): Row[] {
  return list.map(([a, b]) => [carrier, a, b] as const);
}

// ---------- Index ----------

function normaliseCarrier(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

const BY_PAIR = new Map<string, CuratedRoute[]>();

function index(carrier: string, from: string, to: string): void {
  const key = pairKey(from, to);
  const list = BY_PAIR.get(key);
  const entry: CuratedRoute = { carrier, from, to };
  if (!list) {
    BY_PAIR.set(key, [entry]);
    return;
  }
  if (!list.some((r) => normaliseCarrier(r.carrier) === normaliseCarrier(carrier))) {
    list.push(entry);
  }
}

for (const [carrier, from, to] of ROWS) {
  index(carrier, from, to);
}

/**
 * All carriers in this dataset documented to fly nonstop between ANY
 * origin airport of the origin city and ANY destination airport of the
 * destination city. Result keeps each carrier's real airports so the card
 * can display the airport that carrier actually uses (e.g. IST→LHR for
 * Turkish Airlines even when the search defaulted to LGW).
 */
export function curatedRoutesBetween(
  originIatas: string[],
  destIatas: string[]
): CuratedRoute[] {
  const out: CuratedRoute[] = [];
  const seen = new Set<string>();
  for (const a of originIatas) {
    for (const b of destIatas) {
      const list = BY_PAIR.get(pairKey(a, b));
      if (!list) continue;
      for (const route of list) {
        const key = normaliseCarrier(route.carrier);
        if (seen.has(key)) continue;
        seen.add(key);
        // Rows are indexed undirected — re-orient to the search direction so
        // an IST→London search never renders a London→Istanbul card.
        if (route.from === a && route.to === b) {
          out.push(route);
        } else {
          out.push({ carrier: route.carrier, from: a, to: b });
        }
      }
    }
  }
  return out;
}

/** True only when this exact carrier is documented on this exact pair. */
export function isKnownDirect(carrier: string, from: string, to: string): boolean {
  const list = BY_PAIR.get(pairKey(from, to));
  if (!list) return false;
  const n = normaliseCarrier(carrier);
  return list.some((r) => normaliseCarrier(r.carrier) === n);
}

/**
 * Multi-airport cities default to their primary airport so an estimate
 * card never pins itself to an arbitrary secondary field (the dataset
 * lists London LGW before LHR, which would contradict most carriers).
 * When the pair has a documented route we use that route's airports
 * instead — see curatedRoutesBetween().
 */
const PRIMARY_AIRPORT_PREFERENCE = [
  "LHR", "CDG", "MXP", "JFK", "FCO", "BCN", "MAD", "AMS", "BER", "IST",
  "ATH", "VIE", "ZRH", "PRG", "BUD", "DUB", "LIS", "CPH", "ARN", "OSL",
  "HEL", "WAW", "BRU", "GVA", "DUS", "MUC", "FRA", "DXB", "BKK", "SIN",
  "DEL", "BOM", "GRU", "NRT", "HND", "SYD", "MEL", "JNB",
];

export function preferredAirports(
  originIatas: string[],
  destIatas: string[]
): { from: string; to: string } {
  return {
    from: pickPrimary(originIatas),
    to: pickPrimary(destIatas),
  };
}

function pickPrimary(iatas: string[]): string {
  if (iatas.length === 0) return "???";
  for (const code of PRIMARY_AIRPORT_PREFERENCE) {
    if (iatas.includes(code)) return code;
  }
  return iatas[0];
}

/** Total curated route rows — surfaced in reports / debug output. */
export const KNOWN_DIRECT_ROUTES_COUNT = ROWS.length;

/** Carriers covered by the curated dataset. */
export const KNOWN_DIRECT_CARRIERS = Array.from(
  new Set(ROWS.map(([carrier]) => carrier))
).sort();

/**
 * Display copy for a card with no confirmed carrier. The card's search
 * buttons come from the fixed per-mode catalog (search-links.ts), so this
 * string is only ever shown as card content — never as a link label.
 */
export const UNCONFIRMED_AIRLINE = "Airline not confirmed";

/**
 * A3 — transfer hubs the multi-modal router is allowed to suggest.
 *
 * Without this list any precise air node within 700 km could be offered as
 * "via <somewhere>", including one-airport regional towns where no sensible
 * connection exists. These are real interchange cities: large enough to
 * connect air + ground, present in destinations.ts. The chain is still only
 * ever a SUGGESTION (see MultiModalCard) — nothing here is a scheduled
 * itinerary.
 */
const CURATED_HUB_CITY_NAMES = [
  // Europe — air/rail interchange
  "Istanbul", "London", "Paris", "Amsterdam", "Rotterdam", "Brussels",
  "Frankfurt", "Cologne", "Dusseldorf", "Hamburg", "Berlin", "Munich",
  "Stuttgart", "Zurich", "Geneva", "Basel", "Vienna", "Salzburg",
  "Madrid", "Barcelona", "Lisbon", "Porto", "Rome", "Milan", "Turin",
  "Venice", "Bologna", "Naples", "Athens", "Thessaloniki", "Larnaca",
  "Copenhagen", "Aarhus", "Stockholm", "Gothenburg", "Oslo", "Bergen",
  "Helsinki", "Tallinn", "Riga", "Vilnius", "Warsaw", "Krakow", "Gdansk",
  "Prague", "Brno", "Budapest", "Bucharest", "Cluj-Napoca", "Sofia",
  "Belgrade", "Zagreb", "Split", "Ljubljana", "Sarajevo", "Skopje",
  "Tirana", "Podgorica", "Kyiv", "Lviv", "Odesa", "Moscow",
  "Saint Petersburg", "Minsk", "Chisinau", "Dublin", "Cork", "Edinburgh",
  "Manchester", "Birmingham", "Lyon", "Marseille", "Nice", "Toulouse",
  "Bordeaux", "Nuremberg", "Leipzig", "Hannover", "Gothenburg",
  // Beyond Europe — long-haul connection points
  "Dubai", "Abu Dhabi", "Doha", "Sharjah", "Tel Aviv", "Amman", "Beirut",
  "Cairo", "Casablanca", "Tunis", "Algiers", "Dakar", "Accra", "Lagos",
  "Nairobi", "Johannesburg", "Cape Town", "Addis Ababa",
  "New York", "Chicago", "Los Angeles", "Miami", "Houston", "Toronto",
  "Mexico City", "Sao Paulo", "Buenos Aires", "Bogota", "Lima", "Santiago",
  "Tokyo", "Osaka", "Seoul", "Shanghai", "Beijing", "Hong Kong",
  "Singapore", "Bangkok", "Kuala Lumpur", "Jakarta", "Manila", "Hanoi",
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
  "Colombo", "Malé", "Karachi", "Islamabad", "Dhaka",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Auckland",
];

const CURATED_HUB_SET = new Set(CURATED_HUB_CITY_NAMES.map((c) => c.toLowerCase()));

/** True when this city may be offered as a transfer hub in a chain. */
export function isCuratedHub(city: string): boolean {
  return CURATED_HUB_SET.has(city.trim().toLowerCase());
}

/** Hub list size — surfaced in reports / debug output. */
export const CURATED_HUB_COUNT = CURATED_HUB_SET.size;
