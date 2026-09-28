// ============================================================
// AllinOne Travel — Global Regional Tourism Providers
// Scenic railways, island ferries, regional buses & hotel chains
// 153 providers across 37 countries and all 6 continents
// ============================================================

import type { LocalProvider } from "@/lib/types/data";

// ============================================================
// A. SCENIC & REGIONAL RAILWAYS
// ============================================================

export const scenicRailways: LocalProvider[] = [
  // ── Switzerland ──
  {
    id: "rhb-glacier",
    name: "Rhätische Bahn — Glacier Express",
    category: "rail",
    country: "CH", continent: "europe",
    region: "Engadin / Zermatt",
    website: "https://www.glacierexpress.ch",
    tags: ["scenic", "world-heritage", "panoramic", "iconic"],
    description:
      "UNESCO World Heritage Albula/Bernina line. 8-hour journey from Zermatt to St. Moritz through 291 bridges and 91 tunnels.",
  },
  {
    id: "rhb-bernina",
    name: "Rhätische Bahn — Bernina Express",
    category: "rail",
    country: "CH", continent: "europe",
    region: "Engadin / Tirano",
    website: "https://www.berninaexpress.ch",
    tags: ["scenic", "world-heritage", "panoramic"],
    description:
      "Crosses 55 tunnels and 196 bridges. Highest point at 2,253m. Connects Chur/St. Moritz to Tirano, Italy.",
  },
  {
    id: "mob-goldenpass",
    name: "MOB GoldenPass Express",
    category: "rail",
    country: "CH", continent: "europe",
    region: "Montreux / Interlaken",
    website: "https://www.goldenpass.ch",
    tags: ["scenic", "panoramic", "telescopic-train"],
    description:
      "Direct scenic train from Montreux to Interlaken with panoramic telescopic carriages. Renovated in 2022 with tilting technology.",
  },
  {
    id: "jungfraubahn",
    name: "Jungfraubahn — Jungfraujoch",
    category: "rail",
    country: "CH", continent: "europe",
    region: "Bernese Oberland",
    website: "https://www.jungfrau.ch",
    tags: ["scenic", "high-altitude", "glacier", "panoramic"],
    description:
      "Cogwheel railway to Europe's highest railway station (3,454m). Breathtaking views of Aletsch Glacier.",
  },
  {
    id: "bLS-bls",
    name: "BLS AG — Lötschberg Line",
    category: "rail",
    country: "CH", continent: "europe",
    region: "Bern / Valais",
    website: "https://www.bls.ch",
    tags: ["regional", "cross-alpine"],
    description:
      "Key cross-Alpine route between Bern and the Valais, connecting to the Lötschberg car-train for vehicles.",
  },
  {
    id: "sbb-centre",
    name: "SBB CFF FFS — GoldenPass Line",
    category: "rail",
    country: "CH", continent: "europe",
    region: "National",
    website: "https://www.sbb.ch",
    tags: ["national", "network"],
    description:
      "Switzerland's national railway network. Extensive scenic routes including Gotthard, Furka, and Simplon passes.",
  },
  // ── Italy ──
  {
    id: "circumvesuviana",
    name: "Circumvesuviana Railway",
    category: "rail",
    country: "IT", continent: "europe",
    region: "Naples / Pompeii / Sorrento",
    website: "https://www.eavsrl.it",
    tags: ["regional", "volcano", "historic"],
    description:
      "Heritage narrow-gauge railway circling Mount Vesuvius. Main access to Pompeii archaeological site from Naples.",
  },
  {
    id: "trenino-rosso",
    name: "Trenino Rosso del Bernina",
    category: "rail",
    country: "IT", continent: "europe",
    region: "Lombardy / Tirano",
    website: "https://www.berninaexpress.ch",
    tags: ["scenic", "world-heritage"],
    description:
      "Italian segment of the Bernina Express route. UNESCO World Heritage. Stunning Alpine and lake views.",
  },
  {
    id: "trenord-lago",
    name: "Trenord — Lake Como Line",
    category: "rail",
    country: "IT", continent: "europe",
    region: "Lombardy / Lake Como",
    website: "https://www.trenord.it",
    tags: ["regional", "lake-views"],
    description:
      "Regional trains connecting Milan to Como, Varenna, and Menaggio along Lake Como's eastern shore.",
  },
  // ── Germany ──
  {
    id: "hsb-harz",
    name: "Harzer Schmalspurbahnen (HSB)",
    category: "rail",
    country: "DE", continent: "europe",
    region: "Harz Mountains, Saxony-Anhalt",
    website: "https://www.harzer-schmalspurbahnen.de",
    tags: ["scenic", "steam", "narrow-gauge", "historic"],
    description:
      "Germany's largest steam narrow-gauge network. Summits Brocken peak (1,141m). 5 routes covering 140km.",
  },
  {
    id: "zb-saxon",
    name: "Sächsische Dampfeisenbahn — Saxon Switzerland",
    category: "rail",
    country: "DE", continent: "europe",
    region: "Saxon Switzerland / Dresden",
    website: "https://www.sdg-bahn.de",
    tags: ["scenic", "steam", "historic"],
    description:
      "Heritage steam railways through the dramatic sandstone formations of Saxon Switzerland National Park.",
  },
  // ── Austria ──
  {
    id: "mzb-mariazeller",
    name: "Mariazellerbahn",
    category: "rail",
    country: "AT", continent: "europe",
    region: "Lower Austria / Styria",
    website: "https://www.mariazellerbahn.at",
    tags: ["scenic", "narrow-gauge", "historic", "electric"],
    description:
      "Austria's most scenic narrow-gauge railway. 76km from St. Pölten to Mariazell through Alpine valleys. Fully electrified since 1911.",
  },
  {
    id: "obb-nightjet",
    name: "ÖBB Nightjet — Alpine Routes",
    category: "rail",
    country: "AT", continent: "europe",
    region: "Pan-Alpine",
    website: "https://www.nightjet.com",
    tags: ["overnight", "scenic", "sleeper"],
    description:
      "Europe's leading overnight train network. Scenic routes through the Alps to Italy, Switzerland, and beyond.",
  },
  // ── Spain ──
  {
    id: "fgc-montserrat",
    name: "FGC — Montserrat Rack Railway",
    category: "rail",
    country: "ES", continent: "europe",
    region: "Catalonia / Montserrat",
    website: "https://www.fgc.cat",
    tags: ["scenic", "rack-railway", "mountain", "historic"],
    description:
      "Rack railway climbing to the sacred Montserrat mountain monastery. Panoramic views of the Llobregat valley.",
  },
  {
    id: "renfe-costa",
    name: "Renfe Media Distancia — Costa Brava Line",
    category: "rail",
    country: "ES", continent: "europe",
    region: "Catalonia",
    website: "https://www.renfe.com",
    tags: ["regional", "coastal"],
    description:
      "Scenic coastal rail connecting Barcelona to Girona and the Costa Brava towns.",
  },
  {
    id: "euskotren",
    name: "Euskotren — Basque Country Network",
    category: "rail",
    country: "ES", continent: "europe",
    region: "Basque Country",
    website: "https://www.euskotren.eus",
    tags: ["regional", "narrow-gauge"],
    description:
      "Narrow-gauge network connecting San Sebastián, Bilbao, and the Basque coast with dramatic mountain scenery.",
  },
  // ── France ──
  {
    id: "corrail-corse",
    name: "Chemins de Fer de la Corse (CFC)",
    category: "rail",
    country: "FR", continent: "europe",
    region: "Corsica",
    website: "https://cf-corse.corsica",
    tags: ["scenic", "island", "narrow-gauge", "coastal"],
    description:
      "Corsica's scenic narrow-gauge railway. The central line traverses dramatic mountain gorges and coastal stretches.",
  },
  {
    id: "train-jaune",
    name: "Train Jaune (Yellow Train)",
    category: "rail",
    country: "FR", continent: "europe",
    region: "Pyrénées-Orientales / Cerdagne",
    website: "https://letrainjaune.fr",
    tags: ["scenic", "narrow-gauge", "mountain", "historic"],
    description:
      "Historic electric yellow train climbing from the Mediterranean coast to the high plateau of Cerdagne at 1,593m.",
  },
  // ── Portugal ──
  {
    id: "cp-douro",
    name: "CP — Douro Valley Line",
    category: "rail",
    country: "PT", continent: "europe",
    region: "Porto / Douro Valley",
    website: "https://www.cp.pt",
    tags: ["scenic", "wine-region", "river-valley"],
    description:
      "Scenic railway following the Douro River through terraced vineyards. UNESCO World Heritage landscape.",
  },
  // ── Norway ──
  {
    id: "vy-flam",
    name: "Flåm Railway (Flåmsbana)",
    category: "rail",
    country: "NO", continent: "europe",
    region: "Vestland / Flåm",
    website: "https://www.vy.no/en/flam-railway",
    tags: ["scenic", "steep", "fjord", "iconic"],
    description:
      "One of the world's steepest railway lines. 20km descent from Myrdal to Flåm through tunnels and waterfalls. 20 tunnel curves visible through windows.",
  },
  {
    id: "vy-bergen",
    name: "VY — Bergen Line (Bergensbanen)",
    category: "rail",
    country: "NO", continent: "europe",
    region: "Oslo / Bergen",
    website: "https://www.vy.no/en",
    tags: ["scenic", "high-altitude", "cross-country"],
    description:
      "Europe's highest mainline railway crossing Hardangervidda plateau at 1,222m. Often cited as one of the world's most scenic train journeys.",
  },
  // ── UK ──
  {
    id: "lner-east",
    name: "LNER — East Coast Main Line",
    category: "rail",
    country: "GB", continent: "europe",
    region: "London / Edinburgh",
    website: "https://www.lner.co.uk",
    tags: ["high-speed", "cross-country"],
    description:
      "Historic East Coast route with views of the Yorkshire Dales, Durham Cathedral, and Northumberland coast.",
  },
  {
    id: "fwr-snowdon",
    name: "Snowdon Mountain Railway",
    category: "rail",
    country: "GB", continent: "europe",
    region: "Wales / Snowdonia",
    website: "https://www.snowdonrailway.co.uk",
    tags: ["scenic", "rack-railway", "mountain"],
    description:
      "Heritage rack railway to the summit of Snowdon (1,085m), Wales' highest peak. Operating since 1896.",
  },
  // ── Czech Republic ──
  {
    id: "cj-red",
    name: "České Dráhy — Prague–Karlovy Vary",
    category: "rail",
    country: "CZ", continent: "europe",
    region: "Bohemia",
    website: "https://www.cd.cz",
    tags: ["regional", "spa-region"],
    description:
      "Scenic regional route through Bohemian countryside to the famous spa town of Karlovy Vary.",
  },
  // ── Romania ──
  {
    id: "cfr-viseu",
    name: "CFR Călători — Vaser Valley Forestry Railway",
    category: "rail",
    country: "RO", continent: "europe",
    region: "Maramureș",
    website: "https://www.cfrcalatori.ro",
    tags: ["scenic", "steam", "forestry", "historic"],
    description:
      "Working forestry railway in Maramureș using steam locomotives. Runs through pristine Carpathian forests.",
  },
  // ── Poland ──
  {
    id: "pks-kasprowy",
    name: "PKL — Kasprowy Wierch Cable Railway",
    category: "rail",
    country: "PL", continent: "europe",
    region: "Tatra Mountains / Zakopane",
    website: "https://www.pkl.pl",
    tags: ["scenic", "cable", "mountain", "panoramic"],
    description:
      "Historic cable railway (since 1936) ascending to Kasprowy Wierch (1,987m) in the Tatras.",
  },
  // ── Sweden ──
  {
    id: "sj-inlandsbanan",
    name: "SJ — Inlandsbanan (Inland Line)",
    category: "rail",
    country: "SE", continent: "europe",
    region: "Norrland / Swedish Lapland",
    website: "https://www.inlandsbanan.se",
    tags: ["scenic", "wilderness", "remote"],
    description:
      "1,300km railway through the Swedish wilderness from Kristinehamn to Gällivare. Midnight sun and northern lights.",
  },
  // ── Finland ──
  {
    id: "vr-overnight",
    name: "VR — Overnight Trains to Lapland",
    category: "rail",
    country: "FI", continent: "europe",
    region: "Helsinki / Lapland",
    website: "https://www.vr.fi/en",
    tags: ["overnight", "sleeper", "arctic"],
    description:
      "Sleeper trains from Helsinki to Rovaniemi and Kemijärvi. Travel through the Arctic Circle to reach Santa Claus Village.",
  },
];

// ============================================================
// B. REGIONAL SEA & FERRY OPERATORS
// ============================================================

export const ferryOperators: LocalProvider[] = [
  // ── Greece ──
  {
    id: "bluestar",
    name: "Blue Star Ferries",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Aegean / Dodecanese / Crete",
    website: "https://www.bluestarferries.com",
    tags: ["island-hopping", "car-ferry", "overnight"],
    description:
      "Greece's largest ferry operator. Routes from Piraeus to Dodecanese, Cyclades, and Crete. Overnight cabins available.",
  },
  {
    id: "seajets",
    name: "SeaJets",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Aegean / Cyclades / Crete",
    website: "https://www.seajets.com",
    tags: ["high-speed", "fast-ferry", "island-hopping"],
    description:
      "High-speed ferry operator connecting Athens (Rafina/Piraeus) to the Cyclades, Dodecanese, and Crete.",
  },
  {
    id: "dodekanisos",
    name: "Dodekanisos Seaways",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Dodecanese / Rhodes",
    website: "https://www.12ne.gr",
    tags: ["high-speed", "island-hopping", "dodecanese"],
    description:
      "Fast catamaran service between Rhodes and the Dodecanese islands including Kos, Kalymnos, and Leros.",
  },
  {
    id: "minos-lines",
    name: "Minoan Lines",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Crete / Cyclades",
    website: "https://www.minoan.gr",
    tags: ["car-ferry", "overnight", "cruise-ferry"],
    description:
      "Cruise-ferry operator connecting Piraeus to Crete (Heraklion/Chania) and Cyclades. On-board entertainment and dining.",
  },
  {
    id: "hellenic-seaways",
    name: "Hellenic Seaways",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Aegean / Saronic / Cyclades",
    website: "https://www.hellenicseaways.gr",
    tags: ["high-speed", "island-hopping", "catamaran"],
    description:
      "Fleet of high-speed catamarans and conventional ferries. Routes to Saronic Gulf, Cyclades, and North Aegean.",
  },
  {
    id: "golden-star",
    name: "Golden Star Ferries",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Cyclades",
    website: "https://www.goldenstarferries.com",
    tags: ["island-hopping", "fast-ferry"],
    description:
      "Modern fleet connecting Piraeus to central and southern Cyclades including Santorini, Mykonos, and Naxos.",
  },
  // ── Croatia ──
  {
    id: "jadrolinija",
    name: "Jadrolinija",
    category: "sea",
    country: "HR", continent: "europe",
    region: "Dalmatian Coast / Islands",
    website: "https://www.jadrolinija.hr",
    tags: ["car-ferry", "island-hopping", "national"],
    description:
      "Croatia's state-owned ferry operator. Connects mainland ports (Split, Dubrovnik, Zadar) to Hvar, Brač, Korčula, and Vis.",
  },
  {
    id: "kapetan-luka",
    name: "Kapetan Luka — Krilo",
    category: "sea",
    country: "HR", continent: "europe",
    region: "Dalmatian Coast / Islands",
    website: "https://www.krilo.hr",
    tags: ["fast-ferry", "catamaran", "island-hopping"],
    description:
      "Fast catamaran service connecting Split, Hvar, Korčula, and Dubrovnik. Popular for island-hopping routes.",
  },
  {
    id: "tp-line",
    name: "TP Line",
    category: "sea",
    country: "HR", continent: "europe",
    region: "Dalmatian Coast",
    website: "https://www.tp-line.hr",
    tags: ["fast-ferry", "catamaran", "regional"],
    description:
      "Fast catamaran routes from Split to Vis and Stari Grad (Hvar).",
  },
  // ── Italy ──
  {
    id: "nav-laghi",
    name: "Navigazione Laghi",
    category: "sea",
    country: "IT", continent: "europe",
    region: "Lakes / Piedmont / Lombardy",
    website: "https://www.navigazionelaghi.it",
    tags: ["lake", "scenic", "regional"],
    description:
      "Service across Italian lakes (Maggiore, Como, Garda, Orta). Scenic boat trips and commuter ferries.",
  },
  {
    id: "grimaldi",
    name: "Grimaldi Lines",
    category: "sea",
    country: "IT", continent: "europe",
    region: "Mediterranean / Tyrrhenian",
    website: "https://www.grimaldi-lines.com",
    tags: ["cruise-ferry", "car-ferry", "international"],
    description:
      "Routes connecting Italy (Genoa, Naples, Palermo) to Sardinia, Sicily, Spain, Tunisia, and Malta.",
  },
  {
    id: "gnv",
    name: "GNV (Grandi Navi Veloci)",
    category: "sea",
    country: "IT", continent: "europe",
    region: "Mediterranean / Tyrrhenian",
    website: "https://www.gnv.it",
    tags: ["cruise-ferry", "car-ferry", "international"],
    description:
      "Major Italian ferry operator. Routes from Genoa, Naples, and Palermo to Sardinia, Sicily, and Spain.",
  },
  {
    id: "siremar",
    name: "Siremar",
    category: "sea",
    country: "IT", continent: "europe",
    region: "Sicily / Aeolian Islands / Sardinia",
    website: "https://www.siremar.it",
    tags: ["regional", "island-hopping", "car-ferry"],
    description:
      "Regional ferry network connecting Sicily to the Aeolian Islands, Egadi Islands, and Sardinia.",
  },
  {
    id: "mobylines",
    name: "Moby Lines",
    category: "sea",
    country: "IT", continent: "europe",
    region: "Mediterranean / Tyrrhenian",
    website: "https://www.moby.it",
    tags: ["car-ferry", "fast-ferry", "family-friendly"],
    description:
      "Ferry services from mainland Italy to Sardinia, Corsica, and Elba. Known for family-friendly onboard experience.",
  },
  // ── Spain ──
  {
    id: "balearia",
    name: "Baleària",
    category: "sea",
    country: "ES", continent: "europe",
    region: "Balearic Islands / Valencia",
    website: "https://www.balearia.com",
    tags: ["fast-ferry", "car-ferry", "island-hopping"],
    description:
      "Spain's largest private ferry company. Routes to Mallorca, Menorca, Ibiza, and Formentera. High-speed options available.",
  },
  {
    id: "nav-armas",
    name: "Naviera Armas",
    category: "sea",
    country: "ES", continent: "europe",
    region: "Canary Islands / Balearic Islands",
    website: "https://www.navieraarmas.com",
    tags: ["car-ferry", "cruise-ferry", "inter-island"],
    description:
      "Major ferry operator connecting Canary Islands, Balearic Islands, and mainland Spain (Huelva-Cádiz).",
  },
  // ── Norway ──
  {
    id: "hurtigruten",
    name: "Hurtigruten",
    category: "sea",
    country: "NO", continent: "europe",
    region: "Norwegian Coast / Arctic",
    website: "https://www.hurtigruten.com",
    tags: ["cruise", "coastal", "expedition", "arctic", "iconic"],
    description:
      "Legendary 11-day coastal voyage from Bergen to Kirkenes. 34 ports of call. Northern Lights and midnight sun experiences.",
  },
  {
    id: "fjord1",
    name: "Fjord1",
    category: "sea",
    country: "NO", continent: "europe",
    region: "Western Norway / Fjords",
    website: "https://www.fjord1.no",
    tags: ["fjord", "car-ferry", "regional"],
    description:
      "Largest ferry operator in Norway. Serves iconic fjord crossings including Geirangerfjord and Nærøyfjord routes.",
  },
  {
    id: "color-line",
    name: "Color Line",
    category: "sea",
    country: "NO", continent: "europe",
    region: "Norway–Denmark / Norway–Sweden",
    website: "https://www.colorline.com",
    tags: ["cruise-ferry", "international", "overnight"],
    description:
      "International cruise ferry operator. Routes: Oslo–Kiel, Larvik–Frederikshavn, Kristiansand–Hirtshals.",
  },
  {
    id: "havila",
    name: "Havila Kystruten",
    category: "sea",
    country: "NO", continent: "europe",
    region: "Norwegian Coast / Arctic",
    website: "https://www.havilavoyages.com",
    tags: ["cruise", "coastal", "eco-friendly", "arctic"],
    description:
      "New entrant to the Hurtigruten coastal route. LNG-powered ships with modern amenities. Bergen–Kirkenes service.",
  },
  {
    id: "norled",
    name: "Norled",
    category: "sea",
    country: "NO", continent: "europe",
    region: "Western Norway / Fjords",
    website: "https://www.norled.no",
    tags: ["fjord", "fast-ferry", "electric", "eco-friendly"],
    description:
      "Operator of the world's first all-electric express boat. Extensive fjord and island ferry network.",
  },
  // ── UK ──
  {
    id: "caldmac",
    name: "CalMac Ferries",
    category: "sea",
    country: "GB", continent: "europe",
    region: "Scotland / Hebrides",
    website: "https://www.calmac.co.uk",
    tags: ["island-hopping", "car-ferry", "highland"],
    description:
      "Largest ferry operator in the UK by route network. Connects Scottish mainland to 50+ destinations across the Hebrides.",
  },
  {
    id: "wightlink",
    name: "Wightlink",
    category: "sea",
    country: "GB", continent: "europe",
    region: "Solent / Isle of Wight",
    website: "https://www.wightlink.co.uk",
    tags: ["car-ferry", "fast-ferry", "island"],
    description:
      "Main ferry service to the Isle of Wight from Portsmouth and Lymington. Fast catamaran option available.",
  },
  {
    id: "red-funnel",
    name: "Red Funnel",
    category: "sea",
    country: "GB", continent: "europe",
    region: "Solent / Isle of Wight",
    website: "https://www.redfunnel.co.uk",
    tags: ["car-ferry", "island"],
    description:
      "Southampton to East Cowes (Isle of Wight). Vehicle ferry and Red Jet foot passenger service.",
  },
  {
    id: "p-and-o",
    name: "P&O Ferries",
    category: "sea",
    country: "GB", continent: "europe",
    region: "English Channel / North Sea",
    website: "https://www.poferries.com",
    tags: ["cross-channel", "car-ferry", "international"],
    description:
      "Major cross-channel operator. Dover–Calais, Hull–Rotterdam, Hull–Zeebrugge, Cairnryan–Larne/Dublin.",
  },
  {
    id: "brittany-ferries",
    name: "Brittany Ferries",
    category: "sea",
    country: "GB", continent: "europe",
    region: "English Channel / Atlantic",
    website: "https://www.brittany-ferries.co.uk",
    tags: ["cross-channel", "cruise-ferry", "spain", "france"],
    description:
      "Routes from Portsmouth to Caen, St. Malo, Bilbao, and Santander. Cruise-ferry experience with cabins and dining.",
  },
  // ── Denmark / Baltic ──
  {
    id: "dfds",
    name: "DFDS Seaways",
    category: "sea",
    country: "DK", continent: "europe",
    region: "Baltic / North Sea / English Channel",
    website: "https://www.dfds.com",
    tags: ["cruise-ferry", "international", "overnight"],
    description:
      "Routes: Copenhagen–Oslo, Amsterdam–Newcastle, Dover–Calais. Full cruise-ferry experience with restaurants and entertainment.",
  },
  {
    id: "scandlines",
    name: "Scandlines",
    category: "sea",
    country: "DK", continent: "europe",
    region: "Baltic / Denmark–Germany",
    website: "https://www.scandlines.com",
    tags: ["car-ferry", "short-crossing", "hybrid"],
    description:
      "Major ferry link across the Fehmarn Belt. Denmark–Germany routes. Hybrid electric ferries on key routes.",
  },
  // ── Estonia / Finland ──
  {
    id: "tallink",
    name: "Tallink / Silja Line",
    category: "sea",
    country: "EE", continent: "europe",
    region: "Baltic / Finland–Estonia–Sweden",
    website: "https://www.tallink.com",
    tags: ["cruise-ferry", "overnight", "shopping"],
    description:
      "Major Baltic ferry operator. Helsinki–Tallinn, Helsinki–Stockholm, and Riga–Stockholm routes. On-board shopping and dining.",
  },
  {
    id: "viking-line",
    name: "Viking Line",
    category: "sea",
    country: "FI", continent: "europe",
    region: "Baltic / Finland–Åland–Sweden",
    website: "https://www.vikingline.com",
    tags: ["cruise-ferry", "overnight", "budget"],
    description:
      "Budget-friendly Baltic cruise ferries. Helsinki–Tallinn, Helsinki–Stockholm via Åland. On-board tax-free shopping.",
  },
  {
    id: "eckero-line",
    name: "Eckerö Line",
    category: "sea",
    country: "FI", continent: "europe",
    region: "Baltic / Finland–Estonia",
    website: "https://www.eckeroline.fi",
    tags: ["car-ferry", "short-crossing"],
    description:
      "Helsinki–Tallinn route. Competitive pricing for day trips and vehicle transport.",
  },
  // ── Iceland ──
  {
    id: "herjolfur",
    name: "Herjólfur — Vestmannaeyjar Ferry",
    category: "sea",
    country: "IS", continent: "europe",
    region: "South Coast / Vestmannaeyjar",
    website: "https://www.herjolfur.is",
    tags: ["island", "car-ferry", "remote"],
    description:
      "Ferry to the Westman Islands (Vestmannaeyjar) from Landeyjahöfn. Access to volcanic island and puffin colonies.",
  },
  // ── Sweden ──
  {
    id: "gotlandsbaten",
    name: "Destination Gotland",
    category: "sea",
    country: "SE", continent: "europe",
    region: "Gotland / Baltic Sea",
    website: "https://www.destinationgotland.se",
    tags: ["island", "fast-ferry", "car-ferry"],
    description:
      "Sole operator to Gotland island from Nynäshamn and Oskarshamn. Fast ferry in summer, conventional in winter.",
  },
];

// ============================================================
// C. REGIONAL BUS & TRANSFER OPERATORS
// ============================================================

export const regionalBuses: LocalProvider[] = [
  // ── Italy ──
  {
    id: "terravision",
    name: "Terravision",
    category: "bus",
    country: "IT", continent: "europe",
    region: "Rome / Florence / Venice / Milan",
    website: "https://www.terravision.eu",
    tags: ["airport-transfer", "budget", "tourist"],
    description:
      "Budget airport transfers across Italy. Main routes from Rome Fiumicino/Ciampino to city centers. Also serves Florence, Venice, Milan.",
  },
  {
    id: "marinobus",
    name: "MarinoBus",
    category: "bus",
    country: "IT", continent: "europe",
    region: "National / Intercity",
    website: "https://www.marinobus.it",
    tags: ["intercity", "budget", "long-distance"],
    description:
      "Italian intercity bus operator connecting major cities. Affordable long-distance routes from Rome to Milan, Naples, Bologna.",
  },
  // ── Spain ──
  {
    id: "alsa-bus",
    name: "ALSA",
    category: "bus",
    country: "ES", continent: "europe",
    region: "National / Intercity",
    website: "https://www.alsa.com",
    tags: ["intercity", "national", "comfort"],
    description:
      "Spain's largest bus operator. Extensive intercity network connecting Madrid, Barcelona, Seville, Valencia, and beyond.",
  },
  {
    id: "avanza-bus",
    name: "Avanza Bus",
    category: "bus",
    country: "ES", continent: "europe",
    region: "Castilla y León / National",
    website: "https://www.avanza.es",
    tags: ["regional", "intercity"],
    description:
      "Regional and intercity bus operator in Castilla y León with routes to Madrid and other major cities.",
  },
  // ── Portugal ──
  {
    id: "rede-expressos",
    name: "Rede Expressos",
    category: "bus",
    country: "PT", continent: "europe",
    region: "National / Intercity",
    website: "https://www.rede-expressos.pt",
    tags: ["intercity", "national", "budget"],
    description:
      "Portugal's largest bus network. Connects Lisbon, Porto, Faro, Coimbra, and smaller towns across the country.",
  },
  {
    id: "flixbus-pt",
    name: "FlixBus Portugal",
    category: "bus",
    country: "PT", continent: "europe",
    region: "National / International",
    website: "https://www.flixbus.pt",
    tags: ["budget", "international", "long-distance"],
    description:
      "FlixBus network serving Portugal. Budget long-distance routes to Spain and the rest of Europe.",
  },
  // ── Croatia ──
  {
    id: "arriva-hr",
    name: "Arriva Croatia",
    category: "bus",
    country: "HR", continent: "europe",
    region: "National / Intercity",
    website: "https://arriva.hr",
    tags: ["intercity", "national"],
    description:
      "Croatian bus network connecting Zagreb, Split, Dubrovnik, and coastal towns. Regular intercity service.",
  },
  {
    id: "croatia-bus",
    name: "Croatia Bus",
    category: "bus",
    country: "HR", continent: "europe",
    region: "National / Intercity",
    website: "https://www.croatiabus.hr",
    tags: ["intercity", "budget"],
    description:
      "Budget intercity bus service across Croatia. Popular routes between coastal cities and Zagreb.",
  },
  // ── Norway / Sweden ──
  {
    id: "vy-buss-no",
    name: "Vy Buss",
    category: "bus",
    country: "NO", continent: "europe",
    region: "National / Regional",
    website: "https://www.vy.no/en",
    tags: ["national", "regional", "comfort"],
    description:
      "Norway's national bus operator. Regional and intercity routes across the country. Integrated with rail network.",
  },
  {
    id: "nord-way",
    name: "NOR-WAY Bussekspress",
    category: "bus",
    country: "NO", continent: "europe",
    region: "National / Intercity",
    website: "https://www.nor-way.no",
    tags: ["intercity", "express", "scenic"],
    description:
      "Norway's express bus network. Scenic routes between Oslo, Bergen, Stavanger, and Tromsø.",
  },
  {
    id: "vy-buss-se",
    name: "Vy Bus4You",
    category: "bus",
    country: "SE", continent: "europe",
    region: "Sweden / Intercity",
    website: "https://www.vy.no/en/bus4you",
    tags: ["comfort", "wifi", "intercity"],
    description:
      "Premium intercity buses in Sweden. Wi-Fi, power outlets, and comfortable seating. Routes across major Swedish cities.",
  },
  // ── Finland ──
  {
    id: "matkahuolto",
    name: "Matkahuolto",
    category: "bus",
    country: "FI", continent: "europe",
    region: "National / Regional",
    website: "https://www.matkahuolto.fi",
    tags: ["national", "regional", "network"],
    description:
      "Finland's extensive bus and parcel network. Routes covering even the most remote northern regions.",
  },
  {
    id: "onnibus",
    name: "OnniBus.com",
    category: "bus",
    country: "FI", continent: "europe",
    region: "National / Intercity",
    website: "https://www.onnibus.com",
    tags: ["budget", "intercity", "wifi"],
    description:
      "Finnish budget bus operator with Wi-Fi and power outlets. Popular routes between Helsinki, Tampere, Turku, and Lapland.",
  },
  // ── Baltic States ──
  {
    id: "lux-express",
    name: "Lux Express",
    category: "bus",
    country: "EE", continent: "europe",
    region: "Baltic / Tallinn–Riga–Vilnius",
    website: "https://luxexpress.eu",
    tags: ["international", "comfort", "baltic"],
    description:
      "Premium Baltic bus operator. Tallinn–Riga–Vilnius and connections to St. Petersburg, Warsaw. Wi-Fi, snacks, and power outlets.",
  },
  {
    id: "ecolines",
    name: "Ecolines",
    category: "bus",
    country: "LV", continent: "europe",
    region: "Baltic / Eastern Europe",
    website: "https://www.ecolines.net",
    tags: ["international", "budget", "baltic"],
    description:
      "International bus network across the Baltics and Eastern Europe. Budget-friendly long-distance routes.",
  },
  // ── Romania ──
  {
    id: "tofan-grup",
    name: "Tofan Grup",
    category: "bus",
    country: "RO", continent: "europe",
    region: "National / Intercity",
    website: "https://www.autogari.ro",
    tags: ["intercity", "regional"],
    description:
      "Regional bus operator in Romania connecting smaller towns to major cities.",
  },
  // ── Bulgaria ──
  {
    id: "union-ivkoni",
    name: "Union Ivkoni",
    category: "bus",
    country: "BG", continent: "europe",
    region: "National / Intercity",
    website: "https://www.union-ivkoni.com",
    tags: ["intercity", "international"],
    description:
      "Bulgaria's largest bus operator. Inter-city routes and international connections to Greece, Turkey, and Serbia.",
  },
  // ── Poland ──
  {
    id: "flixbus-pl",
    name: "FlixBus Poland",
    category: "bus",
    country: "PL", continent: "europe",
    region: "National / Intercity",
    website: "https://www.flixbus.pl",
    tags: ["budget", "national", "international"],
    description:
      "FlixBus network in Poland. Budget long-distance routes connecting all major Polish cities and international destinations.",
  },
  // ── Czech Republic ──
  {
    id: "regiojet-bus",
    name: "RegioJet Bus",
    category: "bus",
    country: "CZ", continent: "europe",
    region: "National / Central Europe",
    website: "https://www.regiojet.com",
    tags: ["budget", "comfort", "international"],
    description:
      "Czech/Slovak operator with budget intercity buses. Prague–Bratislava–Vienna and other Central European routes. Wi-Fi and refreshments included.",
  },
  // ── Iceland ──
  {
    id: "straeto",
    name: "Strætó",
    category: "bus",
    country: "IS", continent: "europe",
    region: "Capital Region / Reykjavik",
    website: "https://www.straeto.is",
    tags: ["urban", "capital"],
    description:
      "Reykjavik's public bus network. Serves the capital region with regular routes.",
  },
];

// ============================================================
// D. EUROPEAN HOTEL & LODGING CHAINS
// ============================================================

export const hotelChains: LocalProvider[] = [
  // ── Luxury / Heritage ──
  {
    id: "kempinski",
    name: "Kempinski Hotels",
    category: "hotel",
    country: "EU", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.kempinski.com",
    tags: ["luxury", "heritage", "5-star", "spa"],
    description:
      "Europe's oldest luxury hotel group (est. 1897). Properties in major cities and resort destinations across Europe and globally.",
  },
  {
    id: "paradores",
    name: "Paradores de Turismo de España",
    category: "hotel",
    country: "ES", continent: "europe",
    region: "Spain / National",
    website: "https://www.paradores.es",
    tags: ["heritage", "historic", "unique", "castle", "monastery"],
    description:
      "Government-owned network of luxury hotels in historic buildings — castles, monasteries, palaces, and convents across Spain.",
  },
  {
    id: "pousadas",
    name: "Pousadas de Portugal",
    category: "hotel",
    country: "PT", continent: "europe",
    region: "Portugal / National",
    website: "https://www.pousadas.pt",
    tags: ["heritage", "historic", "castle", "unique"],
    description:
      "Portugal's state-run heritage hotel network. Historic castles, palaces, and monasteries converted to luxury accommodations.",
  },
  {
    id: "pestana",
    name: "Pestana Hotel Group",
    category: "hotel",
    country: "PT", continent: "europe",
    region: "Portugal / International",
    website: "https://www.pestana.com",
    tags: ["luxury", "heritage", "boutique", "palace"],
    description:
      "Portuguese luxury hotel group. Iconic Pousadas, CR7 branded hotels, and Pestana Collection properties worldwide.",
  },
  {
    id: "barcelo",
    name: "Barceló Hotel Group",
    category: "hotel",
    country: "ES", continent: "europe",
    region: "Spain / Europe / Americas",
    website: "https://www.barcelo.com",
    tags: ["luxury", "resort", "urban", "family"],
    description:
      "Spanish hotel chain with 5 brands from luxury (Barceló) to budget (Occidental). Major presence in Spain, Caribbean, and Europe.",
  },
  {
    id: "rocas-verdes",
    name: "Rocas Verdes Hotels",
    category: "hotel",
    country: "ES", continent: "europe",
    region: "Spain / Canary Islands",
    website: "https://www.h10hotels.com",
    tags: ["resort", "beach", "all-inclusive"],
    description:
      "Canary Islands hotel chain with all-inclusive beach resorts on Tenerife, Gran Canaria, and Lanzarote.",
  },
  {
    id: "selina",
    name: "Selina",
    category: "hotel",
    country: "EU", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.selina.com",
    tags: ["boutique", "coworking", "digital-nomad", "lifestyle"],
    description:
      "Lifestyle hotel brand combining accommodation, coworking, wellness, and social spaces. Locations across Europe and globally.",
  },
  // ── Mid-Scale ──
  {
    id: "accor",
    name: "Accor Group (Ibis / Novotel / Mercure)",
    category: "hotel",
    country: "FR", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.accor.com",
    tags: ["mid-scale", "budget", "chain", "loyalty"],
    description:
      "France-based hotel giant. Economy (Ibis) to luxury (Raffles, Fairmont) portfolio. 5,400+ hotels in 110 countries.",
  },
  {
    id: "nh-group",
    name: "NH Hotel Group (NH / nhow)",
    category: "hotel",
    country: "ES", continent: "europe",
    region: "Europe / Latin America",
    website: "https://www.nh-hotels.com",
    tags: ["mid-scale", "urban", "business", "design"],
    description:
      "Spanish hotel group (Marriott affiliate). 350+ hotels in Europe and Latin America. NH Collection, NH, and nhow brands.",
  },
  {
    id: "scandic",
    name: "Scandic Hotels",
    category: "hotel",
    country: "SE", continent: "europe",
    region: "Nordics / Scandinavia",
    website: "https://www.scandichotels.com",
    tags: ["mid-scale", "nordic", "family", "sustainable"],
    description:
      "Scandinavia's largest hotel chain. 280+ hotels in the Nordics and Germany. Known for sustainability and family-friendly approach.",
  },
  {
    id: "motel-one",
    name: "Motel One",
    category: "hotel",
    country: "DE", continent: "europe",
    region: "Germany / Austria / Europe",
    website: "https://www.motel-one.com",
    tags: ["budget", "design", "urban", "value"],
    description:
      "German design budget hotel chain. Affordable rooms with quality design in central locations. 90+ hotels across Europe.",
  },
  {
    id: "bb-hotels",
    name: "B&B Hotels",
    category: "hotel",
    country: "FR", continent: "europe",
    region: "France / Europe",
    website: "https://www.hotel-bb.com",
    tags: ["budget", "family", "value"],
    description:
      "French budget hotel chain. 700+ hotels across France and Europe. Family rooms and competitive pricing.",
  },
  {
    id: "citizenm",
    name: "citizenM",
    category: "hotel",
    country: "NL", continent: "europe",
    region: "Europe / Global",
    website: "https://www.citizenm.com",
    tags: ["design", "compact", "tech-savvy", "urban"],
    description:
      "Dutch design hotel brand. Compact, tech-forward rooms with mood lighting, XL beds, and rain showers in major cities.",
  },
  {
    id: "generator",
    name: "Generator Hostels",
    category: "hotel",
    country: "GB", continent: "europe",
    region: "Europe",
    website: "https://www.generatorhostels.com",
    tags: ["hostel", "social", "budget", "design"],
    description:
      "Upscale hostel brand in prime European locations. Private and shared rooms, rooftop bars, social spaces. London, Paris, Barcelona, Rome.",
  },
  {
    id: "yotel",
    name: "YOTEL",
    category: "hotel",
    country: "GB", continent: "europe",
    region: "Europe / Global",
    website: "https://www.yotel.com",
    tags: ["compact", "tech", "urban", "airport"],
    description:
      "Cabin-style compact hotel concept inspired by first-class air travel. Self-service check-in, adjustable smart beds.",
  },
  // ── Budget / Backpacker ──
  {
    id: "meininger",
    name: "MEININGER Hotels",
    category: "hotel",
    country: "DE", continent: "europe",
    region: "Europe",
    website: "https://www.meininger-hotels.com",
    tags: ["hostel", "budget", "family", "group"],
    description:
      "German hybrid hotel-hostel concept. Private rooms and dorms. Located in city centers across 12 European countries.",
  },
  {
    id: "a&o",
    name: "A&O Hotels and Hostels",
    category: "hotel",
    country: "DE", continent: "europe",
    region: "Europe",
    website: "https://www.aohostels.com",
    tags: ["hostel", "budget", "urban"],
    description:
      "Germany's largest hostel chain expanding across Europe. Budget private rooms and dorms in major city centers.",
  },
  {
    id: "euro-hostels",
    name: "EuroHostels",
    category: "hotel",
    country: "GB", continent: "europe",
    region: "UK / Europe",
    website: "https://eurohostel.eu",
    tags: ["hostel", "budget", "urban"],
    description:
      "Budget hostel network across the UK and Europe. Clean, affordable accommodation in popular tourist destinations.",
  },
  {
    id: "stf",
    name: "STF (Swedish Tourist Association)",
    category: "hotel",
    country: "SE", continent: "europe",
    region: "Sweden / Scandinavian Mountains",
    website: "https://www.svenskaturistforeningen.se/en/",
    tags: ["mountain", "hut", "nature", "hiking"],
    description:
      "Network of mountain huts and hostels across Swedish Lapland and mountain regions. Perfect for hiking and nature trips.",
  },
  {
    id: "dnt",
    name: "DNT (Norwegian Trekking Association)",
    category: "hotel",
    country: "NO", continent: "europe",
    region: "Norway / Mountains",
    website: "https://www.dnt.no/en",
    tags: ["mountain", "hut", "nature", "hiking"],
    description:
      "550+ mountain cabins across Norway. Self-service and staffed huts in fjord and mountain landscapes.",
  },
];

// ============================================================
// E3. ADDITIONAL LEGITIMATE PROVIDERS (same schema)
// ============================================================

export const extraRailways: LocalProvider[] = [
  {
    id: "arlberg-express",
    name: "Arlberg Express (ÖBB)",
    category: "rail",
    country: "AT", continent: "europe",
    region: "Innsbruck / Bludenz",
    website: "https://www.oebb.at",
    tags: ["scenic", "alpine", "regional"],
    description:
      "Scenic Arlberg route through the Austrian Alps connecting Innsbruck with Bludenz and the Rhine valley.",
  },
  {
    id: "trenitalia-frecciarossa",
    name: "Trenitalia Frecciarossa",
    category: "rail",
    country: "IT", continent: "europe",
    region: "National / High-speed",
    website: "https://www.trenitalia.com",
    tags: ["high-speed", "national"],
    description:
      "Italy's flagship high-speed trains linking Milan, Rome, Florence, Naples, and Turin at up to 300 km/h.",
  },
  {
    id: "sncf-tgv",
    name: "SNCF TGV INOUI",
    category: "rail",
    country: "FR", continent: "europe",
    region: "National / International",
    website: "https://www.sncf-connect.com",
    tags: ["high-speed", "international"],
    description:
      "French high-speed network to Brussels, London, Geneva, Barcelona, and domestic hubs.",
  },
  {
    id: "renfe-ave",
    name: "Renfe AVE",
    category: "rail",
    country: "ES", continent: "europe",
    region: "National / International",
    website: "https://www.renfe.com",
    tags: ["high-speed", "national"],
    description:
      "Spanish high-speed rail connecting Madrid, Barcelona, Seville, Valencia, and (via AVE) Paris.",
  },
  {
    id: "intercity-ic",
    name: "Deutsche Bahn IC/ICE",
    category: "rail",
    country: "DE", continent: "europe",
    region: "National / Cross-border",
    website: "https://www.bahn.de",
    tags: ["high-speed", "national", "international"],
    description:
      "Germany's InterCity and ICE network with cross-border services to Austria, Switzerland, France, and the Netherlands.",
  },
];

export const extraFerries: LocalProvider[] = [
  {
    id: "confined-maritime",
    name: "Corsica Linea",
    category: "sea",
    country: "FR", continent: "europe",
    region: "Corsica / France",
    website: "https://www.corsicalinea.com",
    tags: ["car-ferry", "island"],
    description:
      "Marseille–Ajaccio/Porto-Vecchio ferries linking mainland France with Corsica.",
  },
  {
    id: "ferries-delmares",
    name: "Anek Lines",
    category: "sea",
    country: "GR", continent: "europe",
    region: "Crete / Aegean",
    website: "https://www.anek.gr/en/",
    tags: ["car-ferry", "overnight", "crete"],
    description:
      "Greek operator with Piraeus–Crete overnight and high-speed ferries plus Aegean routes.",
  },
  {
    id: "tallink-silja",
    name: "Tallink Silja (Helsinki–Stockholm)",
    category: "sea",
    country: "FI", continent: "europe",
    region: "Baltic / Finland–Sweden",
    website: "https://www.tallinksilja.com",
    tags: ["cruise-ferry", "overnight"],
    description:
      "Overnight cruise ferries Helsinki–Stockholm via Åland with restaurants and cabins.",
  },
  {
    id: "stena-line",
    name: "Stena Line",
    category: "sea",
    country: "GB", continent: "europe",
    region: "Irish Sea / North Sea",
    website: "https://www.stenaline.com",
    tags: ["cross-channel", "irish-sea", "car-ferry"],
    description:
      "Irish Sea and North Sea crossings including Holyhead–Dublin and Cairnryan–Belfast.",
  },
  {
    id: "fjordline",
    name: "Fjord Line",
    category: "sea",
    country: "NO", continent: "europe",
    region: "Norway–Denmark",
    website: "https://www.fjordline.com",
    tags: ["international", "cruise-ferry"],
    description:
      "Norway–Denmark crossings (Bergen–Hirtshals, Stavanger–Hirtshals) with high-speed and conventional ships.",
  },
];

export const extraBuses: LocalProvider[] = [
  {
    id: "blablabus",
    name: "BlaBlaBus",
    category: "bus",
    country: "FR", continent: "europe",
    region: "France / International",
    website: "https://www.blablacar.fr/bus",
    tags: ["budget", "international"],
    description:
      "Budget coach network across France and neighbouring countries, successor to Ouibus.",
  },
  {
    id: "flixbus-de",
    name: "FlixBus Germany",
    category: "bus",
    country: "DE", continent: "europe",
    region: "National / International",
    website: "https://www.flixbus.de",
    tags: ["budget", "national", "international"],
    description:
      "Pan-European low-cost coach brand with dense German domestic and cross-border network.",
  },
  {
    id: "eurolines",
    name: "Eurolines",
    category: "bus",
    country: "BE", continent: "europe",
    region: "Pan-European",
    website: "https://www.eurolines.com",
    tags: ["international", "long-distance"],
    description:
      "Long-distance coach network linking major European capitals and hubs.",
  },
  {
    id: "rol",
    name: "Rutebilselskabet (ROL) / nettbuss",
    category: "bus",
    country: "NO", continent: "europe",
    region: "Norway / Regional",
    website: "https://www.nor-way.no",
    tags: ["regional", "express"],
    description:
      "Regional coach connections complementing Norway's express bus network.",
  },
  {
    id: "euroline-pl",
    name: "FlixBus Polska",
    category: "bus",
    country: "PL", continent: "europe",
    region: "Poland / International",
    website: "https://www.flixbus.pl",
    tags: ["budget", "international"],
    description:
      "Polish long-distance coach services to Germany, Czechia, and Baltic destinations.",
  },
];

export const extraHotels: LocalProvider[] = [
  {
    id: "ihg-eu",
    name: "IHG Hotels (Holiday Inn / Kimpton)",
    category: "hotel",
    country: "EU", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.ihg.com",
    tags: ["mid-scale", "chain", "loyalty"],
    description:
      "Global hotel group with strong European presence across midscale and lifestyle brands.",
  },
  {
    id: "hilton-eu",
    name: "Hilton Hotels & Resorts",
    category: "hotel",
    country: "EU", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.hilton.com",
    tags: ["luxury", "mid-scale", "chain"],
    description:
      "Hilton, Conrad, and Waldorf Astoria properties across European capitals and resorts.",
  },
  {
    id: "marriott-eu",
    name: "Marriott International",
    category: "hotel",
    country: "EU", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.marriott.com",
    tags: ["luxury", "mid-scale", "chain", "loyalty"],
    description:
      "Largest hotel portfolio worldwide including Westin, Renaissance, and Autograph Collection in Europe.",
  },
  {
    id: "radisson-eu",
    name: "Radisson Hotel Group",
    category: "hotel",
    country: "BE", continent: "europe",
    region: "Europe / Global",
    website: "https://www.radissonhotels.com",
    tags: ["mid-scale", "business", "chain"],
    description:
      "Radisson Blu, Radisson RED, and Park Inn brands with deep European city coverage.",
  },
  {
    id: "hyatt-eu",
    name: "Hyatt (Park Hyatt / Andaz / Hyatt Regency)",
    category: "hotel",
    country: "EU", continent: "europe",
    region: "Pan-European / Global",
    website: "https://www.hyatt.com",
    tags: ["luxury", "boutique", "chain"],
    description:
      "Hyatt's European portfolio spanning luxury Park Hyatt to select-service Hyatt Place.",
  },
];

// ============================================================
// E. GLOBAL EXPANSION (D2) — non-European + missing European
//    destinations; every website listed was HTTP-verified by
//    scripts/verify-tourism-urls.ts
// ============================================================

export const worldRailways: LocalProvider[] = [
  // ── Asia ──
  {
    id: "jp-jr-group",
    name: "JR Group — Shinkansen & Japan Rail Pass",
    category: "rail",
    country: "JP", continent: "asia",
    region: "Japan nationwide",
    website: "https://japanrailpass.net",
    tags: ["high-speed", "tourist-pass", "scenic"],
    description:
      "Tokaido/Sanyo/Kyushu Shinkansen plus JR regional lines. The Japan Rail Pass covers most JR trains for 7–21 days.",
  },
  {
    id: "in-irctc",
    name: "Indian Railways (IRCTC)",
    category: "rail",
    country: "IN", continent: "asia",
    region: "India nationwide",
    website: "https://www.irctc.co.in",
    tags: ["mainline", "booking", "long-distance"],
    description:
      "One of the world's largest rail networks — 13,000+ trains daily, sleeper classes and premium Rajdhani/Shatabdi services.",
  },
  {
    id: "th-srt",
    name: "State Railway of Thailand",
    category: "rail",
    country: "TH", continent: "asia",
    region: "Bangkok / North / Northeast / South",
    website: "https://www.railway.co.th",
    tags: ["mainline", "overnight", "scenic"],
    description:
      "Northern and Northeastern lines run overnight sleepers to Chiang Mai and Nong Khai; the southern line reaches the Malaysian border.",
  },
  {
    id: "ru-rzd",
    name: "Russian Railways (RZD)",
    category: "rail",
    country: "RU", continent: "europe",
    region: "Russia / Moscow–Vladivostok",
    website: "https://www.rzd.ru/en",
    tags: ["long-distance", "night-train", "trans-siberian"],
    description:
      "Trans-Siberian and Trans-Manchurian long-distance routes, Sapsan high-speed services and Platskartny/SV sleeping cars.",
  },
  // ── Americas ──
  {
    id: "us-amtrak",
    name: "Amtrak",
    category: "rail",
    country: "US", continent: "americas",
    region: "United States nationwide",
    website: "https://www.amtrak.com",
    tags: ["long-distance", "roomette", "scenic"],
    description:
      "Coast Starlight, California Zephyr and Empire Builder among 500+ destinations; sleeper rooms on long-distance routes.",
  },
  // ── Oceania ──
  {
    id: "au-gsr",
    name: "Great Southern Rail — The Ghan & Indian Pacific",
    category: "rail",
    country: "AU", continent: "oceania",
    region: "Adelaide–Darwin / Sydney–Perth",
    website: "https://www.greatsouthernrail.com.au",
    tags: ["scenic", "luxury", "transcontinental"],
    description:
      "Two iconic transcontinental journeys: The Ghan (Adelaide–Darwin) and Indian Pacific (Sydney–Perth), up to 4 nights aboard.",
  },
  // ── Africa ──
  {
    id: "za-gautrain",
    name: "Gautrain",
    category: "rail",
    country: "ZA", continent: "africa",
    region: "Johannesburg / Pretoria / OR Tambo",
    website: "https://www.gautrain.co.za",
    tags: ["high-speed", "airport-link", "urban"],
    description:
      "Africa's modern high-speed rail link connecting central Johannesburg, Pretoria and OR Tambo International Airport.",
  },
  // ── Middle East ──
  {
    id: "ae-rta-marine",
    name: "Dubai Metro (RTA)",
    category: "rail",
    country: "AE", continent: "middle-east",
    region: "Dubai",
    website: "https://www.rta.ae",
    tags: ["urban", "metro", "airport-link"],
    description:
      "Driverless metro plus tram linking Dubai International Airport, Downtown, Marina and the Palm; no intercity rail in the UAE.",
  },
  // ── Europe (previously missing countries) ──
  {
    id: "tr-tcdd",
    name: "TCDD Taşımacılık (YHT High-Speed)",
    category: "rail",
    country: "TR", continent: "europe",
    region: "Ankara / Istanbul / Izmir / Konya",
    website: "https://www.tcddtasimacilik.gov.tr",
    tags: ["high-speed", "mainline"],
    description:
      "Turkish State Railways' YHT high-speed network — Istanbul–Ankara in ~4.5h, plus conventional mainline and Marmaray services.",
  },
  {
    id: "ua-uz",
    name: "Ukrainian Railways (UZ)",
    category: "rail",
    country: "UA", continent: "europe",
    region: "Ukraine nationwide",
    website: "https://www.uz.gov.ua",
    tags: ["mainline", "overnight", "international"],
    description:
      "Intercity and overnight services across Ukraine, including Kyiv–Lviv and connections toward Poland; check wartime service alerts before travel.",
  },
];

export const worldFerries: LocalProvider[] = [
  // ── Asia ──
  {
    id: "th-tigerline",
    name: "Tigerline Ferry",
    category: "sea",
    country: "TH", continent: "asia",
    region: "Phuket / Phi Phi / Koh Lanta / Krabi",
    website: "https://www.tigerlineferry.com",
    tags: ["island-hopping", "high-speed"],
    description:
      "High-speed catamarans between Phuket, Phi Phi, Koh Lanta and the Andaman coast — the workhorse of Andaman island-hopping.",
  },
  // ── Middle East ──
  {
    id: "ae-rta-marine-sea",
    name: "Dubai Water Bus & Ferry (RTA)",
    category: "sea",
    country: "AE", continent: "middle-east",
    region: "Dubai Marina / Al Seef / Bluewaters",
    website: "https://www.rta.ae",
    tags: ["ferry", "urban", "water-taxi"],
    description:
      "RTA marine services: ferry routes across Dubai Creek and Marina plus water taxis — a scenic alternative to the metro.",
  },
  // ── Africa ──
  {
    id: "za-robben-island",
    name: "Robben Island Ferry (Nelson Mandela Gateway)",
    category: "sea",
    country: "ZA", continent: "africa",
    region: "Cape Town V&A Waterfront → Robben Island",
    website: "https://mandela.org.za",
    tags: ["ferry", "heritage", "island"],
    description:
      "Ferry from Cape Town's V&A Waterfront to the UNESCO World Heritage island where Mandela was imprisoned.",
  },
  // ── Americas ──
  {
    id: "us-nyc-ferry",
    name: "NYC Ferry",
    category: "sea",
    country: "US", continent: "americas",
    region: "New York City",
    website: "https://www.ferry.nyc",
    tags: ["ferry", "urban", "commuter"],
    description:
      "City-run ferry network to Rockaway, Governors Island, Staten Island-adjacent routes and Brooklyn/Queens waterfronts — MetroCard/OMNY fare.",
  },
  // ── Oceania ──
  {
    id: "au-spirit-tasmania",
    name: "Spirit of Tasmania",
    category: "sea",
    country: "AU", continent: "oceania",
    region: "Melbourne (Geelong) → Devonport",
    website: "https://www.spiritoftasmania.com.au",
    tags: ["ferry", "overnight", "vehicle"],
    description:
      "Overnight passenger and vehicle ferry across Bass Strait — the only way to bring your car to Tasmania without flying.",
  },
  // ── Europe (previously missing countries) ──
  {
    id: "tr-sehir-hatlari",
    name: "Şehir Hatları (Istanbul City Ferries)",
    category: "sea",
    country: "TR", continent: "europe",
    region: "Istanbul Bosphorus / Princes' Islands",
    website: "https://www.sehirhatlari.com.tr",
    tags: ["ferry", "urban", "island-hopping"],
    description:
      "Bosphorus crossings between Eminönü, Kadıköy and Üsküdar plus boats to the Princes' Islands — Istanbul's classic commute.",
  },
];

export const worldBuses: LocalProvider[] = [
  // ── Asia ──
  {
    id: "in-redbus",
    name: "RedBus India",
    category: "bus",
    country: "IN", continent: "asia",
    region: "India nationwide",
    website: "https://www.redbus.in",
    tags: ["aggregator", "booking", "sleeper"],
    description:
      "Largest intercity bus ticketing platform in India — AC sleepers and seater coaches across every state.",
  },
  {
    id: "th-transport-co",
    name: "Transport Co. Ltd (BKS)",
    category: "bus",
    country: "TH", continent: "asia",
    region: "Thailand nationwide",
    website: "https://transport.co.th",
    tags: ["state-run", "long-distance"],
    description:
      "Thailand's state-run intercity coach network — first/second class services from Bangkok's Mo Chit, Southern and Eastern terminals.",
  },
  // ── Americas ──
  {
    id: "us-greyhound",
    name: "Greyhound",
    category: "bus",
    country: "US", continent: "americas",
    region: "United States / Canada / Mexico",
    website: "https://www.greyhound.com",
    tags: ["long-distance", "network"],
    description:
      "North America's largest intercity bus network — 2,400 destinations across the US, Canada and northern Mexico.",
  },
  {
    id: "br-1001",
    name: "Auto Viação 1001",
    category: "bus",
    country: "BR", continent: "americas",
    region: "São Paulo / Rio / Southeast & Northeast",
    website: "https://www.autoviacao1001.com.br",
    tags: ["long-distance", "executive"],
    description:
      "One of Brazil's largest long-distance coach operators, with executive and comfort classes across the Southeast and Northeast.",
  },
  // ── Oceania ──
  {
    id: "au-greyhound",
    name: "Greyhound Australia",
    category: "bus",
    country: "AU", continent: "oceania",
    region: "Australia east coast & nationwide",
    website: "https://www.greyhound.com.au",
    tags: ["long-distance", "hop-on-hop-off"],
    description:
      "Coast-to-coast coach network with flexible hop-on hop-off passes — the classic backpacker route down the East Coast.",
  },
  // ── Africa ──
  {
    id: "za-intercape",
    name: "Intercape",
    category: "bus",
    country: "ZA", continent: "africa",
    region: "South Africa / Namibia / Zimbabwe",
    website: "https://www.intercape.co.za",
    tags: ["long-distance", "overnight"],
    description:
      "Southern Africa's premier long-distance coach operator — overnight sleepers between Cape Town, Joburg, Durban and Windhoek.",
  },
  // ── Europe (previously missing countries) ──
  {
    id: "rs-lasta",
    name: "Lasta Beograd",
    category: "bus",
    country: "RS", continent: "europe",
    region: "Serbia / Western Balkans",
    website: "https://www.lasta.rs",
    tags: ["long-distance", "international"],
    description:
      "Serbia's main intercity operator — Belgrade to Niš, Novi Sad and cross-border routes across the Western Balkans.",
  },
];

export const worldHotels: LocalProvider[] = [
  // ── Asia ──
  {
    id: "jp-apa",
    name: "APA Hotel",
    category: "hotel",
    country: "JP", continent: "asia",
    region: "Japan nationwide",
    website: "https://www.apahotel.com",
    tags: ["business", "compact", "chain"],
    description:
      "Japan's largest business hotel chain — compact, efficient rooms near virtually every major train station in the country.",
  },
  {
    id: "in-taj",
    name: "Taj Hotels",
    category: "hotel",
    country: "IN", continent: "asia",
    region: "India & South Asia",
    website: "https://www.tajhotels.com",
    tags: ["luxury", "heritage", "chain"],
    description:
      "India's flagship luxury group — from the Taj Mahal Palace Mumbai to palace hotels and wild lodges across India.",
  },
  {
    id: "sg-mbs",
    name: "Marina Bay Sands",
    category: "hotel",
    country: "SG", continent: "asia",
    region: "Singapore Marina Bay",
    website: "https://www.marinabaysands.com",
    tags: ["luxury", "iconic", "sky-pool"],
    description:
      "The three-towered icon with the world's most famous rooftop infinity pool, casino, museum and Observation Deck.",
  },
  {
    id: "th-centara",
    name: "Centara Hotels & Resorts",
    category: "hotel",
    country: "TH", continent: "asia",
    region: "Thailand / Indian Ocean / Middle East",
    website: "https://www.centarahotelsresorts.com",
    tags: ["resort", "family", "beach"],
    description:
      "Thai resort group with beach properties in Phuket, Krabi, Samui plus family-focused Centara Grand destinations.",
  },
  // ── Middle East ──
  {
    id: "ae-rotana",
    name: "Rotana",
    category: "hotel",
    country: "AE", continent: "middle-east",
    region: "Gulf / Middle East / Africa",
    website: "https://www.rotana.com",
    tags: ["luxury", "midscale", "chain"],
    description:
      "Gulf-headquartered group (founded Abu Dhabi) with 5-star city hotels and beach resorts across the Middle East and Africa.",
  },
  // ── Americas ──
  {
    id: "us-best-western",
    name: "Best Western",
    category: "hotel",
    country: "US", continent: "americas",
    region: "United States / Canada / Mexico",
    website: "https://www.bestwestern.com",
    tags: ["midscale", "chain", "loyalty"],
    description:
      "Member-owned midscale chain with 4,000+ hotels across North America — consistent rooms at highway and city locations.",
  },
  {
    id: "br-blue-tree",
    name: "Blue Tree Hotels",
    category: "hotel",
    country: "BR", continent: "americas",
    region: "São Paulo / Rio / Southeast Brazil",
    website: "https://www.bluetree.com.br",
    tags: ["midscale", "business", "chain"],
    description:
      "Brazilian hotel group with full-service city hotels in São Paulo, Rio and Belo Horizonte, many with pools and event spaces.",
  },
  // ── Oceania ──
  {
    id: "au-crown-melbourne",
    name: "Crown Melbourne",
    category: "hotel",
    country: "AU", continent: "oceania",
    region: "Melbourne Southbank",
    website: "https://www.crownmelbourne.com.au",
    tags: ["luxury", "casino", "resort"],
    description:
      "Melbourne's Southbank complex — Crown Towers, Crown Metropol and Crown Promenade above the Yarra with casino and dining.",
  },
  // ── Africa ──
  {
    id: "za-southern-sun",
    name: "Southern Sun (Tsogo Sun)",
    category: "hotel",
    country: "ZA", continent: "africa",
    region: "South Africa & Africa",
    website: "https://www.tsogosun.com",
    tags: ["midscale", "chain", "gaming"],
    description:
      "Southern Africa's largest hotel group — Southern Sun, SunSquare and StayEasy brands in every major South African city.",
  },
];

// ============================================================
// COMBINED EXPORT
// ============================================================

export const allLocalProviders: LocalProvider[] = [
  ...scenicRailways,
  ...ferryOperators,
  ...regionalBuses,
  ...hotelChains,
  ...extraRailways,
  ...extraFerries,
  ...extraBuses,
  ...extraHotels,
  ...worldRailways,
  ...worldFerries,
  ...worldBuses,
  ...worldHotels,
];

// ---------- Helper Functions ----------

export function getProvidersByCategory(
  category: LocalCategory
): LocalProvider[] {
  return allLocalProviders.filter((p) => p.category === category);
}

export function getProvidersByCountry(country: string): LocalProvider[] {
  return allLocalProviders.filter(
    (p) => p.country === country.toUpperCase()
  );
}

export function searchProviders(query: string): LocalProvider[] {
  const q = query.toLowerCase();
  return allLocalProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.description?.toLowerCase().includes(q)
  );
}

export function getProviderStats() {
  return {
    total: allLocalProviders.length,
    byCategory: {
      rail: allLocalProviders.filter((p) => p.category === "rail").length,
      sea: allLocalProviders.filter((p) => p.category === "sea").length,
      bus: allLocalProviders.filter((p) => p.category === "bus").length,
      hotel: allLocalProviders.filter((p) => p.category === "hotel").length,
    },
    countries: Array.from(
      new Set(allLocalProviders.map((p) => p.country))
    ).sort(),
  };
}

type LocalCategory = import("@/lib/types/data").LocalCategory;
