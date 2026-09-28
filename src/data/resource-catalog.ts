// ============================================================
// AllinOne Travel — user-facing resource catalog (Phase 1)
//
// A large, curated set of travel resources grouped by category. It is
// deliberately SEPARATE from src/lib/utils/search-links.ts: that file
// holds the fixed per-mode link lists rendered on result cards (and is
// de-duplicated against), this file holds the browsable resource
// directory.
//
// Admission rules (evidence in scripts/probe-resource-candidates.ts,
// JSON written to %TEMP%\opencode\resource-candidates-verify.json):
//   1. every URL was loaded in a headed Chromium from this machine;
//   2. no URL is a duplicate of a hostname already in SEARCH_LINKS and
//      no hostname appears twice here;
//   3. every URL is a plain live entry point — no invented route, date
//      or price parameter ever appears in a link;
//   4. anything that is not globally available carries `region`, which
//      the UI must surface.
//
// `access` records what the checker actually saw:
//   "verified"   — the page rendered normally (2xx/3xx);
//   "challenged" — the domain answered but served an anti-bot page to
//                  the automated checker; it opens normally in a real
//                  browser. Never a dead link.
// ============================================================

export type ResourceCategoryKey =
  | "flights"
  | "trains"
  | "buses"
  | "ferries"
  | "cruises"
  | "stays"
  | "tours"
  | "food"
  | "events"
  | "visa"
  | "planning"
  | "cars"
  | "transfers"
  | "money";

export interface ResourceLink {
  /** Exactly the site the URL lands on. */
  label: string;
  url: string;
  /** Availability restriction the UI must show, if any. */
  region?: string;
  access: "verified" | "challenged";
}

export interface ResourceCategory {
  key: ResourceCategoryKey;
  title: string;
  description: string;
  links: ResourceLink[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    key: "flights",
    title: "Flights",
    description:
      "Fare meta-search, OTAs and route tools beyond the links already on every flight result.",
    links: [
      { label: "Hotwire", url: "https://www.hotwire.com/", access: "verified" },
      { label: "Opodo", url: "https://www.opodo.com/", access: "verified" },
      { label: "ITA Matrix", url: "https://matrix.itasoftware.com/", access: "verified" },
      { label: "lastminute.com", url: "https://www.lastminute.com/", access: "verified" },
      { label: "FlightConnections", url: "https://www.flightconnections.com/", access: "verified" },
      { label: "Skiplagged", url: "https://skiplagged.com/", access: "verified" },
      { label: "Liligo", url: "https://www.liligo.com/", access: "verified" },
      { label: "AirHint", url: "https://www.airhint.com/", access: "verified" },
      { label: "ixigo", url: "https://www.ixigo.com/flights", region: "India", access: "verified" },
      { label: "Going", url: "https://www.going.com/", region: "deals newsletter, US-centric", access: "verified" },
      { label: "Cleartrip", url: "https://www.cleartrip.com/flights", region: "India / Gulf", access: "verified" },
      { label: "MakeMyTrip", url: "https://www.makemytrip.com/flights", region: "India", access: "verified" },
      { label: "GoToGate", url: "https://www.gotogate.com/", access: "verified" },
      { label: "Secret Flying", url: "https://www.secretflying.com/", access: "verified" },
      { label: "FlightNetwork", url: "https://www.flightnetwork.com/", region: "Canada", access: "verified" },
      { label: "Priceline", url: "https://www.priceline.com/", access: "challenged" },
      { label: "Orbitz", url: "https://www.orbitz.com/flight-search", access: "challenged" },
      { label: "Expedia", url: "https://www.expedia.com/Flights", access: "challenged" },
      { label: "Travelocity", url: "https://www.travelocity.com/Flights", access: "challenged" },
    ],
  },
  {
    key: "trains",
    title: "Trains",
    description:
      "National operators, passes and independent route guides for rail journeys.",
    links: [
      { label: "SJ", url: "https://www.sj.se/en", region: "Sweden", access: "verified" },
      { label: "Italo", url: "https://www.italotreno.it/en", region: "Italy", access: "verified" },
      { label: "DSB", url: "https://www.dsb.dk/en", region: "Denmark", access: "verified" },
      { label: "NS", url: "https://www.ns.nl/en", region: "Netherlands", access: "verified" },
      { label: "VR", url: "https://www.vr.fi/en", region: "Finland", access: "verified" },
      { label: "CD (Czech Railways)", url: "https://www.cd.cz/en/", region: "Czechia", access: "verified" },
      { label: "Interrail", url: "https://www.interrail.eu/", access: "verified" },
      { label: "PKP Intercity", url: "https://www.intercity.pl/en/", region: "Poland", access: "verified" },
      { label: "Eurail", url: "https://www.eurail.com/", access: "verified" },
      { label: "MÁV", url: "https://www.mav.hu/", region: "Hungary", access: "verified" },
      { label: "Seat61", url: "https://www.seat61.com/", access: "verified" },
      { label: "Trainline (BE/FR)", url: "https://www.thetrainline.be/", access: "verified" },
      { label: "Rail Europe", url: "https://www.raileurope.com/", access: "challenged" },
      { label: "Vy", url: "https://www.vy.no/en", region: "Norway", access: "challenged" },
    ],
  },
  {
    key: "buses",
    title: "Buses",
    description: "Coach operators and intercity bus search outside the fixed bus card links.",
    links: [
      { label: "Avanza", url: "https://www.avanza.es/", region: "Spain", access: "verified" },
      { label: "Sindbad", url: "https://sindbad.pl/en", region: "Poland / Europe", access: "verified" },
      { label: "Leo Express", url: "https://www.leoexpress.com/en", region: "Central Europe", access: "verified" },
      { label: "infobus", url: "https://infobus.eu/", access: "verified" },
      { label: "Línea Directa", url: "https://www.lineadirecta.com/", region: "Spain", access: "verified" },
      { label: "Movelia", url: "https://www.movelia.com/", region: "Spain", access: "verified" },
      { label: "Gopili", url: "https://www.gopili.com/", region: "France / Europe", access: "verified" },
      { label: "BlaBlaCar Bus", url: "https://www.blablacar.fr/bus", region: "France / Spain", access: "verified" },
      { label: "Rede Expressos", url: "https://www.rede-expressos.pt/en", region: "Portugal", access: "challenged" },
      { label: "Wanderu", url: "https://wanderu.com/", access: "challenged" },
    ],
  },
  {
    key: "ferries",
    title: "Ferries",
    description: "Operators beyond the fixed ferry card links, grouped by home waters.",
    links: [
      { label: "Minoan Lines", url: "https://www.minoanlines.com/", access: "verified" },
      { label: "Balearia", url: "https://www.balearia.com/en", region: "Spain", access: "verified" },
      { label: "Moby", url: "https://www.moby.it/", region: "Italy", access: "verified" },
      { label: "SeaJets", url: "https://www.seajets.com/en", region: "Greece", access: "verified" },
      { label: "Molslinjen", url: "https://www.molslinjen.dk/", region: "Denmark", access: "verified" },
      { label: "Fred. Olsen Express", url: "https://www.fredolsen.es/en", region: "Canary Islands", access: "verified" },
      { label: "Tirrenia", url: "https://www.tirrenia.it/", region: "Italy", access: "verified" },
      { label: "SNAV", url: "https://www.snav.it/en", region: "Italy", access: "verified" },
      { label: "Corsica Ferries", url: "https://www.corsica-ferries.co.uk/", access: "challenged" },
    ],
  },
  {
    key: "cruises",
    title: "Cruises",
    description:
      "Cruise metasearch and comparison first, then the lines themselves. Prices are theirs, never ours.",
    links: [
      { label: "CruiseDirect", url: "https://www.cruisedirect.com/", region: "US market", access: "verified" },
      { label: "ChooseCruise", url: "https://choose-cruise.com/", access: "verified" },
      { label: "CruiseCompare", url: "https://www.cruisecompare.co.uk/", region: "UK", access: "verified" },
      { label: "Iglu Cruise", url: "https://www.iglucruise.com/", region: "UK", access: "verified" },
      { label: "iCruise", url: "https://www.icruise.com/", access: "verified" },
      { label: "P&O Cruises", url: "https://www.pocruises.com/", region: "UK", access: "verified" },
      { label: "MSC Cruises", url: "https://www.msccruises.com/", access: "verified" },
      { label: "Celebrity Cruises", url: "https://www.celebritycruises.com/", access: "verified" },
      { label: "Carnival", url: "https://www.carnival.com/", region: "Americas", access: "verified" },
      { label: "Norwegian Cruise Line", url: "https://www.ncl.com/", access: "verified" },
      { label: "Princess Cruises", url: "https://www.princess.com/", access: "verified" },
      { label: "Royal Caribbean", url: "https://www.royalcaribbean.com/", access: "verified" },
      { label: "Holland America Line", url: "https://www.hollandamerica.com/", access: "verified" },
      { label: "AIDA Cruises", url: "https://www.aida.de/", region: "German-speaking markets", access: "verified" },
      { label: "Hurtigruten", url: "https://www.hurtigruten.com/", access: "verified" },
      { label: "Viking Cruises", url: "https://www.vikingcruises.com/", access: "verified" },
      { label: "Cunard", url: "https://www.cunard.com/", region: "UK / US", access: "verified" },
      { label: "Costa Cruises", url: "https://www.costacruises.com/", access: "verified" },
      { label: "Saga Cruises", url: "https://www.saga.co.uk/cruises", region: "UK, 50+", access: "verified" },
      { label: "Fred. Olsen Cruise Lines", url: "https://www.fredolsencruises.com/", region: "UK", access: "verified" },
      { label: "Disney Cruise Line", url: "https://www.disneycruiseline.com/", access: "verified" },
      { label: "Cruise Critic", url: "https://www.cruisecritic.com/", access: "challenged" },
      { label: "CruisePlum", url: "https://www.cruiseplum.com/", access: "challenged" },
      { label: "Cruises.com", url: "https://www.cruises.com/", region: "US market", access: "challenged" },
      { label: "CheapCaribbean", url: "https://www.cheapcaribbean.com/", region: "US market", access: "challenged" },
      { label: "CruisesOnly", url: "https://www.cruisesonly.com/", region: "US market", access: "challenged" },
    ],
  },
  {
    key: "stays",
    title: "Stays",
    description: "Hotel chains, apartments and hostels outside the fixed hotel card links.",
    links: [
      { label: "Hotels.com", url: "https://www.hotels.com/", access: "verified" },
      { label: "Plum Guide", url: "https://www.plumguide.com/", access: "verified" },
      { label: "OYO", url: "https://www.oyorooms.com/", access: "verified" },
      { label: "Mr & Mrs Smith", url: "https://www.mrandmrssmith.com/", access: "verified" },
      { label: "Marriott", url: "https://www.marriott.com/", access: "verified" },
      { label: "Hilton", url: "https://www.hilton.com/", access: "verified" },
      { label: "Accor", url: "https://all.accor.com/", access: "verified" },
      { label: "IHG", url: "https://www.ihg.com/", access: "verified" },
      { label: "Generator", url: "https://generatorhostels.com/", access: "verified" },
    ],
  },
  {
    key: "tours",
    title: "Tours & attractions",
    description:
      "Ticket and activity marketplaces plus walking-tour operators. We never invent a place.",
    links: [
      { label: "GetYourGuide", url: "https://www.getyourguide.com/", access: "verified" },
      { label: "Withlocals", url: "https://www.withlocals.com/", access: "verified" },
      { label: "GuruWalk", url: "https://www.guruwalk.com/", access: "verified" },
      { label: "Headout", url: "https://www.headout.com/", access: "verified" },
      { label: "Tiqets", url: "https://www.tiqets.com/", access: "verified" },
      { label: "Go City", url: "https://gocity.com/", access: "verified" },
      { label: "Context Travel", url: "https://www.contexttravel.com/", access: "verified" },
      { label: "Devour Tours", url: "https://devourtours.com/", access: "verified" },
      { label: "Viator", url: "https://www.viator.com/", access: "challenged" },
      { label: "Klook", url: "https://www.klook.com/", access: "challenged" },
      { label: "Tripadvisor", url: "https://www.tripadvisor.com/", access: "challenged" },
    ],
  },
  {
    key: "food",
    title: "Food & drink",
    description:
      "Restaurant discovery and delivery. Delivery platforms are region-limited — the region note says so.",
    links: [
      { label: "OpenTable", url: "https://www.opentable.com/", region: "mainly US / UK", access: "verified" },
      { label: "Michelin Guide", url: "https://guide.michelin.com/", access: "verified" },
      { label: "Glovo", url: "https://glovoapp.com/", region: "delivery, select countries", access: "verified" },
      { label: "Eater", url: "https://www.eater.com/", access: "verified" },
      { label: "Wolt", url: "https://wolt.com/", region: "delivery, select countries", access: "verified" },
      { label: "Uber Eats", url: "https://www.ubereats.com/", region: "delivery, select cities", access: "verified" },
      { label: "Deliveroo", url: "https://www.deliveroo.com/", region: "delivery, select countries", access: "verified" },
      { label: "foodpanda", url: "https://www.foodpanda.com/", region: "delivery, Asia / E. Europe", access: "verified" },
      { label: "Just Eat Takeaway", url: "https://www.just-eat.com/", region: "delivery, select countries", access: "verified" },
      { label: "talabat", url: "https://www.talabat.com/", region: "delivery, Middle East", access: "verified" },
      { label: "Zomato", url: "https://www.zomato.com/", region: "mainly India", access: "verified" },
      { label: "TheFork", url: "https://www.thefork.com/", access: "challenged" },
    ],
  },
  {
    key: "events",
    title: "Events",
    description: "Concert, festival and match listings — every listing comes from the source.",
    links: [
      { label: "Songkick", url: "https://www.songkick.com/", access: "verified" },
      { label: "Bandsintown", url: "https://www.bandsintown.com/", access: "verified" },
      { label: "DICE", url: "https://dice.fm/", access: "verified" },
      { label: "EVENTIM", url: "https://www.eventim.com/", region: "Europe", access: "verified" },
      { label: "See Tickets", url: "https://www.seetickets.com/", access: "verified" },
      { label: "Time Out", url: "https://www.timeout.com/", access: "verified" },
      { label: "Meetup", url: "https://www.meetup.com/", access: "verified" },
      { label: "Ticketmaster", url: "https://www.ticketmaster.com/", access: "challenged" },
      { label: "Resident Advisor", url: "https://ra.co/", access: "challenged" },
      { label: "StubHub", url: "https://www.stubhub.com/", access: "challenged" },
      { label: "AXS", url: "https://www.axs.com/", region: "US", access: "challenged" },
      { label: "viagogo", url: "https://www.viagogo.com/", access: "challenged" },
    ],
  },
  {
    key: "visa",
    title: "Visas & entry authorisation",
    description:
      "Official government portals first, then vetted application services. Rules change — always confirm on the official site.",
    links: [
      { label: "Turkiye e-Visa", url: "https://www.evisa.gov.tr/en/", access: "verified" },
      { label: "UK ETA (GOV.UK)", url: "https://www.gov.uk/eta", access: "verified" },
      { label: "Kenya eTA", url: "https://etakenya.go.ke/", access: "verified" },
      { label: "India e-Visa", url: "https://indianvisaonline.gov.in/evisa/", access: "verified" },
      { label: "Sri Lanka ETA", url: "https://eta.gov.lk/", access: "verified" },
      { label: "Canada eTA", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html", access: "verified" },
      { label: "US ESTA", url: "https://esta.cbp.dhs.gov/", access: "verified" },
      { label: "Egypt e-Visa", url: "https://visa2egypt.gov.eg/", access: "verified" },
      { label: "Singapore Arrival Card", url: "https://eservices.ica.gov.sg/sgarrivalcard/", access: "verified" },
      { label: "Bahrain eVisa", url: "https://www.evisa.bh/", access: "verified" },
      { label: "Saudi Arabia eVisa", url: "https://visa.visitsaudi.com/", access: "verified" },
      { label: "ETIAS (EU official)", url: "https://travel-europe.europa.eu/etias_en", access: "verified" },
      { label: "Indonesia e-Visa", url: "https://evisa.imigrasi.go.id/", access: "verified" },
      { label: "iVisa", url: "https://www.ivisa.com/", access: "verified" },
      { label: "Oman eVisa", url: "https://evisa.rop.gov.om/", access: "verified" },
      { label: "VisaHQ", url: "https://www.visahq.com/", access: "verified" },
      { label: "Passport Index", url: "https://www.passportindex.org/", access: "verified" },
      { label: "Atlys", url: "https://www.atlys.com/", access: "verified" },
      { label: "Sherpa", url: "https://apply.joinsherpa.com/", access: "verified" },
      { label: "Henley Passport Index", url: "https://www.henleyglobal.com/passport-index", access: "verified" },
      { label: "Korea K-ETA", url: "https://www.k-eta.go.kr/", access: "verified" },
    ],
  },
  {
    key: "planning",
    title: "Planning & aggregation",
    description: "Door-to-door planners and trip organizers that span several modes at once.",
    links: [
      { label: "Google Travel", url: "https://travel.google.com/", access: "verified" },
      { label: "Rome2Rio", url: "https://www.rome2rio.com/", access: "verified" },
      { label: "TripIt", url: "https://www.tripit.com/", access: "verified" },
      { label: "Polarsteps", url: "https://polarsteps.com/", access: "verified" },
      { label: "Wanderlog", url: "https://wanderlog.com/", access: "verified" },
      { label: "TravelSupermarket", url: "https://www.travelsupermarket.com/", access: "verified" },
    ],
  },
  {
    key: "cars",
    title: "Car rental",
    description: "Rental brokers and the major rental brands.",
    links: [
      { label: "Rentalcars.com", url: "https://www.rentalcars.com/", access: "verified" },
      { label: "Discover Cars", url: "https://www.discovercars.com/", access: "verified" },
      { label: "Sixt", url: "https://www.sixt.com/", access: "verified" },
      { label: "Avis", url: "https://www.avis.com/", access: "verified" },
      { label: "AutoEurope", url: "https://www.autoeurope.com/", access: "verified" },
      { label: "Europcar", url: "https://www.europcar.com/", access: "verified" },
      { label: "Enterprise", url: "https://www.enterprise.com/", access: "verified" },
      { label: "Hertz", url: "https://www.hertz.com/", access: "verified" },
      { label: "Alamo", url: "https://www.alamo.com/", access: "verified" },
      { label: "Budget", url: "https://www.budget.com/", access: "verified" },
      { label: "Green Motion", url: "https://www.greenmotion.com/", access: "verified" },
    ],
  },
  {
    key: "transfers",
    title: "Airport transfers",
    description: "Pre-booked airport shuttles and ride-hailing services.",
    links: [
      { label: "GetTransfer", url: "https://www.gettransfer.com/", access: "verified" },
      { label: "KiwiTaxi", url: "https://kiwitaxi.com/", access: "verified" },
      { label: "Welcome Pickups", url: "https://www.welcomepickups.com/", access: "verified" },
      { label: "Jayride", url: "https://www.jayride.com/", access: "verified" },
      { label: "Shuttle Direct", url: "https://www.shuttledirect.com/", access: "verified" },
      { label: "Bolt", url: "https://bolt.eu/", access: "verified" },
      { label: "Uber", url: "https://www.uber.com/", access: "verified" },
      { label: "Careem", url: "https://www.careem.com/", access: "verified" },
      { label: "HolidayTaxis", url: "https://www.holidaytaxis.com/", access: "verified" },
      { label: "Lyft", url: "https://www.lyft.com/", region: "US", access: "verified" },
    ],
  },
  {
    key: "money",
    title: "Money & costs",
    description: "Exchange rates, multi-currency accounts and cost-of-living data.",
    links: [
      { label: "XE", url: "https://www.xe.com/", access: "verified" },
      { label: "Wise", url: "https://wise.com/", access: "verified" },
      { label: "OANDA", url: "https://www.oanda.com/", access: "verified" },
      { label: "Revolut", url: "https://www.revolut.com/", access: "verified" },
      { label: "Numbeo", url: "https://www.numbeo.com/cost-of-living/", access: "verified" },
      { label: "Remitly", url: "https://www.remitly.com/", access: "verified" },
      { label: "Western Union", url: "https://www.westernunion.com/", access: "verified" },
      { label: "CurrencyFair", url: "https://currencyfair.com/", access: "verified" },
    ],
  },
];

export const RESOURCE_CATEGORY_COUNT = RESOURCE_CATEGORIES.length;

export const RESOURCE_LINK_COUNT = RESOURCE_CATEGORIES.reduce(
  (n, c) => n + c.links.length,
  0
);

/** Links the automated checker saw render normally (no anti-bot page). */
export const RESOURCE_VERIFIED_COUNT = RESOURCE_CATEGORIES.reduce(
  (n, c) => n + c.links.filter((l) => l.access === "verified").length,
  0
);

export function resourceCategory(key: ResourceCategoryKey): ResourceCategory {
  const found = RESOURCE_CATEGORIES.find((c) => c.key === key);
  if (!found) throw new Error(`unknown resource category: ${key}`);
  return found;
}
