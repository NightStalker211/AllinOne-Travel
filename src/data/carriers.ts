import type { CountryCarriers } from "@/lib/types/data";

// ============================================================
// AllinOne Travel — Global Native Carriers Database
// Exhaustive list of air, rail, bus & sea carriers per country
// Covers 60 entries: 59 countries + cross-border continental giants
// ============================================================

export const europeCarriers: CountryCarriers[] = [
  // ─────────────────────────────────────────────
  // 1. TURKEY (TR)
  // ─────────────────────────────────────────────
  {
    code: "TR",
    name: "Turkey",
    flag: "🇹🇷",
    continent: "europe",
    air: [
      { name: "Turkish Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Pegasus Airlines", mode: "air", tags: ["low-cost"] },
      { name: "AJet", mode: "air", tags: ["low-cost"] },
      { name: "SunExpress", mode: "air", tags: ["low-cost"] },
      { name: "Corendon Airlines", mode: "air", tags: ["low-cost", "charter"] },
      { name: "Tailwind Airlines", mode: "air", tags: ["charter"] },
      { name: "Freebird Airlines", mode: "air", tags: ["charter"] },
      { name: "AtlasGlobal (Atlasjet)", mode: "air", tags: ["full-service", "charter"], status: "defunct", notes: "filed for bankruptcy February 2020" },
      { name: "Onur Air", mode: "air", tags: ["low-cost", "charter"], status: "defunct", notes: "operating licence not renewed December 2021, bankrupt April 2022" },
    ],
    rail: [
      { name: "TCDD Taşımacılık", mode: "rail", tags: ["high-speed", "mainline", "regional"], notes: "YHT, Mainline, Regional, Marmaray" },
    ],
    bus: [
      { name: "Pamukkale Turizm", mode: "bus" },
      { name: "Metro Turizm", mode: "bus" },
      { name: "Kamil Koç / FlixBus", mode: "bus" },
      { name: "Ali Osman Ulusoy", mode: "bus" },
      { name: "Kale Seyahat", mode: "bus" },
      { name: "Efe Tur", mode: "bus" },
      { name: "Kontur", mode: "bus" },
      { name: "Nilüfer Turizm", mode: "bus" },
      { name: "Buzlu Turizm", mode: "bus" },
      { name: "Vangölü Turizm", mode: "bus" },
      { name: "Ben Turizm", mode: "bus" },
    ],
    sea: [
      { name: "İDO", mode: "sea", tags: ["ferry"] },
      { name: "BUDO", mode: "sea", tags: ["ferry"] },
      { name: "İZDENİZ", mode: "sea", tags: ["ferry"] },
      { name: "Gestaş", mode: "sea", tags: ["ferry"] },
      { name: "Dentur Avrasya", mode: "sea", tags: ["ferry"] },
      { name: "Turyol", mode: "sea", tags: ["ferry"] },
      { name: "Yeşil Marmaris Lines", mode: "sea", tags: ["ferry"] },
      { name: "Ertürk Lines", mode: "sea", tags: ["ferry"] },
      { name: "Meander Travel", mode: "sea", tags: ["ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. GERMANY (DE)
  // ─────────────────────────────────────────────
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    continent: "europe",
    air: [
      { name: "Lufthansa", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Eurowings", mode: "air", tags: ["low-cost"] },
      { name: "Condor", mode: "air", tags: ["leisure"] },
      { name: "Sundair", mode: "air", tags: ["leisure"] },
      { name: "Air Hamburg", mode: "air", tags: ["regional"] },
      { name: "Germanwings", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased operations 2020, folded into Eurowings" },
      { name: "Air Berlin", mode: "air", tags: ["full-service"], status: "defunct", notes: "ceased operations October 2017" },
    ],
    rail: [
      { name: "Deutsche Bahn (ICE/IC)", mode: "rail", tags: ["high-speed"] },
      { name: "FlixTrain", mode: "rail", tags: ["low-cost"] },
      { name: "RegioJet (DE)", mode: "rail", tags: ["low-cost"] },
      { name: "Transdev Deutschland", mode: "rail", tags: ["regional"] },
      { name: "Metronom", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
      { name: "Pinkbus", mode: "bus" },
      { name: "Roadjet", mode: "bus" },
      { name: "Blaguss Deutschland", mode: "bus" },
    ],
    sea: [
      { name: "Scandlines", mode: "sea", tags: ["ferry"] },
      { name: "FRS Baltic", mode: "sea", tags: ["ferry"] },
      { name: "Wyker Dampfschiffs-Reederei", mode: "sea", tags: ["ferry"] },
      { name: "AG Ems", mode: "sea", tags: ["ferry"] },
      { name: "Adler-Schiffe", mode: "sea", tags: ["ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. FRANCE (FR)
  // ─────────────────────────────────────────────
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    continent: "europe",
    air: [
      { name: "Air France", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Transavia France", mode: "air", tags: ["low-cost"] },
      { name: "French Bee", mode: "air", tags: ["low-cost", "long-haul"] },
      { name: "Corsair", mode: "air", tags: ["leisure"] },
      { name: "Air Corsica", mode: "air", tags: ["regional"] },
      { name: "Chalair Aviation", mode: "air", tags: ["regional"] },
      { name: "Twin Jet", mode: "air", tags: ["regional"] },
      { name: "HOP!", mode: "air", tags: ["regional"] },
      { name: "Amelia", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "SNCF (TGV INOUI)", mode: "rail", tags: ["high-speed"] },
      { name: "OUIGO", mode: "rail", tags: ["high-speed", "low-cost"] },
      { name: "SNCF TER", mode: "rail", tags: ["regional"] },
      { name: "SNCF Intercités", mode: "rail", tags: ["intercity"] },
      { name: "Eurostar", mode: "rail", tags: ["international", "high-speed"] },
      { name: "Renfe France", mode: "rail", tags: ["international"] },
      { name: "SNCF Intercités de Nuit", mode: "rail", tags: ["night-train"] },
    ],
    bus: [
      { name: "BlaBlaCar Bus", mode: "bus", tags: ["pan-european"] },
      { name: "FlixBus France", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [
      { name: "Corsica Linea", mode: "sea", tags: ["ferry"] },
      { name: "La Méridionale", mode: "sea", tags: ["ferry"] },
      { name: "Brittany Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "DFDS", mode: "sea", tags: ["ferry", "international"] },
      { name: "Condor Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "Corsica Ferries / Sardinia Ferries", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. ITALY (IT)
  // ─────────────────────────────────────────────
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    continent: "europe",
    air: [
      { name: "ITA Airways", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Neos", mode: "air", tags: ["leisure"] },
      { name: "Air Dolomiti", mode: "air", tags: ["regional"] },
      { name: "Aeroitalia", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "Trenitalia Frecciarossa", mode: "rail", tags: ["high-speed"] },
      { name: "Trenitalia Intercity", mode: "rail", tags: ["intercity"] },
      { name: "Trenitalia Regionale", mode: "rail", tags: ["regional"] },
      { name: "Italo (NTV)", mode: "rail", tags: ["high-speed"] },
      { name: "Trenord", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "MarinoBus", mode: "bus" },
      { name: "Itabus", mode: "bus" },
      { name: "FlixBus Italia", mode: "bus", tags: ["pan-european"] },
      { name: "Autostradale", mode: "bus" },
      { name: "SAIS Autolinee", mode: "bus" },
      { name: "COTRAL", mode: "bus", tags: ["regional"] },
      { name: "Tiemme", mode: "bus", tags: ["regional"] },
      { name: "Interbus", mode: "bus", tags: ["regional"] },
    ],
    sea: [
      { name: "Grimaldi Lines", mode: "sea", tags: ["ferry"] },
      { name: "GNV (Grandi Navi Veloci)", mode: "sea", tags: ["ferry"] },
      { name: "Liberty Lines", mode: "sea", tags: ["ferry"] },
      { name: "Tirrenia", mode: "sea", tags: ["ferry"] },
      { name: "Siremar", mode: "sea", tags: ["ferry"] },
      { name: "Alilauro", mode: "sea", tags: ["hydrofoil"] },
      { name: "Caremar", mode: "sea", tags: ["ferry"] },
      { name: "Corsica Ferries / Sardinia Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "SNAV", mode: "sea", tags: ["ferry"] },
      { name: "Moby Lines", mode: "sea", tags: ["ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. SPAIN (ES)
  // ─────────────────────────────────────────────
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    continent: "europe",
    air: [
      { name: "Iberia", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Vueling", mode: "air", tags: ["low-cost"] },
      { name: "Air Europa", mode: "air", tags: ["full-service"] },
      { name: "Volotea", mode: "air", tags: ["low-cost"] },
      { name: "Iberia Express", mode: "air", tags: ["low-cost"] },
      { name: "Binter Canarias", mode: "air", tags: ["regional", "island"] },
      { name: "Canaryfly", mode: "air", tags: ["regional", "island"] },
      { name: "Spanair", mode: "air", tags: ["full-service"], status: "defunct", notes: "ceased January 2012" },
      { name: "Air Nostrum", mode: "air", tags: ["regional"] },
      { name: "Swiftair", mode: "air", tags: ["regional", "charter"] },
      { name: "World2Fly", mode: "air", tags: ["charter", "long-haul"] },
    ],
    rail: [
      { name: "Renfe AVE", mode: "rail", tags: ["high-speed"] },
      { name: "Renfe Avlo", mode: "rail", tags: ["high-speed", "low-cost"] },
      { name: "Renfe Alvia", mode: "rail", tags: ["intercity"] },
      { name: "Ouigo España", mode: "rail", tags: ["high-speed", "low-cost"] },
      { name: "Iryo", mode: "rail", tags: ["high-speed"] },
      { name: "Euskotren", mode: "rail", tags: ["regional"] },
      { name: "Renfe Cercanías", mode: "rail", tags: ["commuter", "regional"] },
      { name: "Renfe Media Distancia", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "ALSA", mode: "bus" },
      { name: "Avanza Bus", mode: "bus" },
      { name: "Monbus", mode: "bus" },
      { name: "Hife", mode: "bus" },
      { name: "Socibus", mode: "bus" },
    ],
    sea: [
      { name: "Baleària", mode: "sea", tags: ["ferry"] },
      { name: "Naviera Armas", mode: "sea", tags: ["ferry"] },
      { name: "Trasmed", mode: "sea", tags: ["ferry"] },
      { name: "Fred. Olsen Express", mode: "sea", tags: ["ferry", "island"] },
      { name: "FRS Iberia / DFDS", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. UNITED KINGDOM (GB)
  // ─────────────────────────────────────────────
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    continent: "europe",
    air: [
      { name: "British Airways", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "easyJet", mode: "air", tags: ["low-cost"] },
      { name: "Jet2.com", mode: "air", tags: ["low-cost", "leisure"] },
      { name: "Virgin Atlantic", mode: "air", tags: ["full-service", "long-haul"] },
      { name: "Loganair", mode: "air", tags: ["regional"] },
      { name: "Eastern Airways", mode: "air", tags: ["regional"] },
      { name: "Monarch Airlines", mode: "air", tags: ["leisure"], status: "defunct", notes: "collapsed October 2017" },
      { name: "Thomas Cook Airlines", mode: "air", tags: ["leisure"], status: "defunct", notes: "collapsed September 2019" },
      { name: "Flybe", mode: "air", tags: ["regional"], status: "defunct", notes: "second collapse April 2024" },
    ],
    rail: [
      { name: "LNER", mode: "rail", tags: ["intercity"] },
      { name: "Avanti West Coast", mode: "rail", tags: ["intercity"] },
      { name: "GWR (Great Western Railway)", mode: "rail", tags: ["intercity"] },
      { name: "TransPennine Express", mode: "rail", tags: ["intercity"] },
      { name: "ScotRail", mode: "rail", tags: ["regional"] },
      { name: "Transport for Wales", mode: "rail", tags: ["regional"] },
      { name: "Northern Trains", mode: "rail", tags: ["regional"] },
      { name: "CrossCountry", mode: "rail", tags: ["intercity"] },
      { name: "Caledonian Sleeper", mode: "rail", tags: ["night-train"] },
      { name: "Lumo", mode: "rail", tags: ["high-speed", "low-cost"] },
      { name: "Hull Trains", mode: "rail", tags: ["intercity"] },
      { name: "Chiltern Railways", mode: "rail", tags: ["intercity"] },
      { name: "Greater Anglia", mode: "rail", tags: ["intercity", "regional"] },
      { name: "South Western Railway", mode: "rail", tags: ["intercity", "commuter"] },
      { name: "Southeastern", mode: "rail", tags: ["intercity", "commuter"] },
      { name: "Thameslink", mode: "rail", tags: ["intercity", "commuter"] },
      { name: "Gatwick Express", mode: "rail", tags: ["commuter"] },
    ],
    bus: [
      { name: "National Express", mode: "bus" },
      { name: "Megabus", mode: "bus", tags: ["low-cost"] },
      { name: "Stagecoach", mode: "bus" },
      { name: "First Bus", mode: "bus" },
      { name: "Arriva UK", mode: "bus" },
      { name: "FlixBus UK", mode: "bus", tags: ["pan-european", "low-cost"] },
    ],
    sea: [
      { name: "P&O Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "DFDS Seaways", mode: "sea", tags: ["ferry", "international"] },
      { name: "Brittany Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "Condor Ferries", mode: "sea", tags: ["ferry", "channel-islands"] },
      { name: "Isle of Man Steam Packet", mode: "sea", tags: ["ferry", "island"] },
      { name: "CalMac", mode: "sea", tags: ["ferry", "scotland"] },
      { name: "Wightlink", mode: "sea", tags: ["ferry", "island"] },
      { name: "Red Funnel", mode: "sea", tags: ["ferry", "island"] },
      { name: "Hovertravel", mode: "sea", tags: ["ferry", "hovercraft"] },
      { name: "Stena Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "NorthLink Ferries", mode: "sea", tags: ["ferry", "scotland"] },
      { name: "Irish Ferries", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. NETHERLANDS (NL)
  // ─────────────────────────────────────────────
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    continent: "europe",
    air: [
      { name: "KLM", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Transavia", mode: "air", tags: ["low-cost"] },
      { name: "Corendon Dutch Airlines", mode: "air", tags: ["low-cost", "charter"] },
      { name: "KLM Cityhopper", mode: "air", tags: ["regional"] },
      { name: "TUI fly Netherlands", mode: "air", tags: ["leisure"] },
    ],
    rail: [
      { name: "NS (Nederlandse Spoorwegen)", mode: "rail", tags: ["intercity", "regional"] },
      { name: "Arriva Nederland", mode: "rail", tags: ["regional"] },
      { name: "Keolis Nederland", mode: "rail", tags: ["regional"] },
      { name: "Eurostar", mode: "rail", tags: ["international", "high-speed"] },
    ],
    bus: [
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
      { name: "Connexxion", mode: "bus" },
      { name: "EBS", mode: "bus" },
      { name: "HTM", mode: "bus" },
      { name: "Qbuzz", mode: "bus" },
    ],
    sea: [
      { name: "Stena Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Rederij Doeksen", mode: "sea", tags: ["ferry", "island"] },
      { name: "Wagenborg", mode: "sea", tags: ["ferry", "island"] },
      { name: "TESO", mode: "sea", tags: ["ferry", "island"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. BELGIUM (BE)
  // ─────────────────────────────────────────────
  {
    code: "BE",
    name: "Belgium",
    flag: "🇧🇪",
    continent: "europe",
    air: [
      { name: "Brussels Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "TUI fly Belgium", mode: "air", tags: ["leisure"] },
    ],
    rail: [
      { name: "NMBS / SNCB", mode: "rail", tags: ["intercity", "regional"] },
      { name: "Eurostar", mode: "rail", tags: ["international", "high-speed"] },
    ],
    bus: [
      { name: "De Lijn", mode: "bus" },
      { name: "TEC", mode: "bus" },
      { name: "STIB/MIVB", mode: "bus" },
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [
      { name: "Port of Antwerp-Bruges waterbuses", mode: "sea", tags: ["waterbus"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. AUSTRIA (AT)
  // ─────────────────────────────────────────────
  {
    code: "AT",
    name: "Austria",
    flag: "🇦🇹",
    continent: "europe",
    air: [
      { name: "Austrian Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "People's", mode: "air", tags: ["low-cost", "charter"] },
      { name: "Niki", mode: "air", tags: ["leisure"], status: "defunct", notes: "ceased December 2017" },
    ],
    rail: [
      { name: "ÖBB Railjet/Nightjet", mode: "rail", tags: ["high-speed", "night-train"] },
      { name: "WESTbahn", mode: "rail", tags: ["intercity", "low-cost"] },
      { name: "Raaberbahn", mode: "rail", tags: ["regional", "cross-border"] },
    ],
    bus: [
      { name: "Postbus", mode: "bus" },
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
      { name: "Blaguss", mode: "bus" },
    ],
    sea: [
      { name: "Twin City Liner", mode: "sea", tags: ["hydrofoil"] },
      { name: "DDSG Blue Danube", mode: "sea", tags: ["river-cruise"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. SWITZERLAND (CH)
  // ─────────────────────────────────────────────
  {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    continent: "europe",
    air: [
      { name: "SWISS", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Edelweiss Air", mode: "air", tags: ["leisure"] },
      { name: "Chair Airlines", mode: "air", tags: ["regional"] },
      { name: "Helvetic Airways", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "SBB CFF FFS", mode: "rail", tags: ["intercity", "regional"] },
      { name: "BLS AG", mode: "rail", tags: ["regional"] },
      { name: "Rhätische Bahn", mode: "rail", tags: ["regional", "scenic"] },
      { name: "Matterhorn Gotthard Bahn", mode: "rail", tags: ["regional"] },
      { name: "Glacier Express", mode: "rail", tags: ["scenic"] },
      { name: "Bernina Express", mode: "rail", tags: ["scenic"] },
    ],
    bus: [
      { name: "PostBus (PostAuto)", mode: "bus", tags: ["mountain-routes"] },
    ],
    sea: [
      { name: "CGN (Lake Geneva)", mode: "sea", tags: ["lake-ferry"] },
      { name: "BLS Navigation", mode: "sea", tags: ["lake-ferry"] },
      { name: "SGV", mode: "sea", tags: ["lake-ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 11. GREECE (GR)
  // ─────────────────────────────────────────────
  {
    code: "GR",
    name: "Greece",
    flag: "🇬🇷",
    continent: "europe",
    air: [
      { name: "Aegean Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Olympic Air", mode: "air", tags: ["regional"] },
      { name: "Sky Express", mode: "air", tags: ["regional", "island"] },
    ],
    rail: [
      { name: "Hellenic Train", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "KTEL (Regional network)", mode: "bus", tags: ["regional"] },
    ],
    sea: [
      { name: "Blue Star Ferries", mode: "sea", tags: ["ferry", "island"] },
      { name: "SeaJets", mode: "sea", tags: ["hydrofoil", "island"] },
      { name: "Minoan Lines", mode: "sea", tags: ["ferry", "international"] },
      { name: "ANEK Lines", mode: "sea", tags: ["ferry"] },
      { name: "Hellenic Seaways", mode: "sea", tags: ["hydrofoil", "island"] },
      { name: "Golden Star Ferries", mode: "sea", tags: ["ferry", "island"] },
      { name: "Superfast Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "Ventouris Ferries", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 12. PORTUGAL (PT)
  // ─────────────────────────────────────────────
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    continent: "europe",
    air: [
      { name: "TAP Air Portugal", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Azores Airlines", mode: "air", tags: ["regional", "island"] },
      { name: "SATA Air Açores", mode: "air", tags: ["regional", "island"] },
      { name: "Sevenair", mode: "air", tags: ["regional"] },
      { name: "EuroAtlantic Airways", mode: "air", tags: ["charter", "long-haul"] },
    ],
    rail: [
      { name: "CP (Comboios de Portugal)", mode: "rail", tags: ["intercity", "regional"] },
      { name: "Fertagus", mode: "rail", tags: ["commuter"] },
    ],
    bus: [
      { name: "Rede Expressos", mode: "bus" },
      { name: "FlixBus Portugal", mode: "bus", tags: ["pan-european"] },
      { name: "Gypsyy", mode: "bus" },
      { name: "Eva Transportes", mode: "bus", tags: ["regional"] },
    ],
    sea: [
      { name: "Atlanticoline", mode: "sea", tags: ["ferry", "island"] },
      { name: "Transtejo Softlusa", mode: "sea", tags: ["ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 13. SWEDEN (SE)
  // ─────────────────────────────────────────────
  {
    code: "SE",
    name: "Sweden",
    flag: "🇸🇪",
    continent: "europe",
    air: [
      { name: "SAS", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "BRA (Braathens Regional Airways)", mode: "air", tags: ["regional"] },
      { name: "Amapola Flyg", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "SJ", mode: "rail", tags: ["intercity", "night-train"] },
      { name: "Snälltåget", mode: "rail", tags: ["night-train"] },
      { name: "MTRX", mode: "rail", tags: ["intercity"] },
      { name: "Vy Tåg", mode: "rail", tags: ["regional"] },
      { name: "Öresundståg", mode: "rail", tags: ["regional", "cross-border"] },
    ],
    bus: [
      { name: "Vy Bus4You", mode: "bus" },
      { name: "FlixBus Sweden", mode: "bus", tags: ["pan-european"] },
      { name: "Ybuss", mode: "bus" },
    ],
    sea: [
      { name: "Destination Gotland", mode: "sea", tags: ["ferry", "island"] },
      { name: "Stena Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Viking Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Tallink Silja", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 14. NORWAY (NO)
  // ─────────────────────────────────────────────
  {
    code: "NO",
    name: "Norway",
    flag: "🇳🇴",
    continent: "europe",
    air: [
      { name: "Norwegian Air Shuttle", mode: "air", tags: ["low-cost"] },
      { name: "Widerøe", mode: "air", tags: ["regional"] },
      { name: "SAS", mode: "air", tags: ["full-service"] },
    ],
    rail: [
      { name: "Vy", mode: "rail", tags: ["intercity", "regional"] },
      { name: "Go-Ahead Nordic", mode: "rail", tags: ["intercity"] },
      { name: "SJ Norge", mode: "rail", tags: ["intercity"] },
    ],
    bus: [
      { name: "Vy Buss", mode: "bus" },
      { name: "NOR-WAY Bussekspress", mode: "bus" },
      { name: "Tide Buss", mode: "bus" },
    ],
    sea: [
      { name: "Fjord Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Color Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Hurtigruten", mode: "sea", tags: ["cruise", "coastal"] },
      { name: "Havila Kystruten", mode: "sea", tags: ["cruise", "coastal"] },
      { name: "Torghatten Nord", mode: "sea", tags: ["ferry"] },
      { name: "Norled", mode: "sea", tags: ["ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 15. DENMARK (DK)
  // ─────────────────────────────────────────────
  {
    code: "DK",
    name: "Denmark",
    flag: "🇩🇰",
    continent: "europe",
    air: [
      { name: "Alsie Express", mode: "air", tags: ["regional"] },
      { name: "DAT (Danish Air Transport)", mode: "air", tags: ["regional", "island"] },
    ],
    rail: [
      { name: "DSB", mode: "rail", tags: ["intercity", "regional"] },
      { name: "Arriva Danmark", mode: "rail", tags: ["regional"] },
      { name: "Nordjyske Jernbaner", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Movia", mode: "bus" },
      { name: "Midttrafik", mode: "bus" },
      { name: "Kombardo Ekspresen", mode: "bus" },
      { name: "FlixBus Denmark", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [
      { name: "Molslinjen", mode: "sea", tags: ["ferry", "island"] },
      { name: "Scandlines", mode: "sea", tags: ["ferry", "international"] },
      { name: "DFDS", mode: "sea", tags: ["ferry", "international"] },
      { name: "Bornholmslinjen", mode: "sea", tags: ["ferry", "island"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 16. FINLAND (FI)
  // ─────────────────────────────────────────────
  {
    code: "FI",
    name: "Finland",
    flag: "🇫🇮",
    continent: "europe",
    air: [
      { name: "Finnair", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "NoRRA", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "VR", mode: "rail", tags: ["intercity", "night-train"] },
    ],
    bus: [
      { name: "Matkahuolto", mode: "bus" },
      { name: "OnniBus", mode: "bus" },
      { name: "Savonlinja", mode: "bus" },
    ],
    sea: [
      { name: "Viking Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Eckerö Line", mode: "sea", tags: ["ferry", "international"] },
      { name: "Tallink Silja", mode: "sea", tags: ["ferry", "international"] },
      { name: "Wasaline", mode: "sea", tags: ["ferry", "cross-border"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 17. POLAND (PL)
  // ─────────────────────────────────────────────
  {
    code: "PL",
    name: "Poland",
    flag: "🇵🇱",
    continent: "europe",
    air: [
      { name: "LOT Polish Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Enter Air", mode: "air", tags: ["charter"] },
      { name: "Buzz", mode: "air", tags: ["charter"] },
    ],
    rail: [
      { name: "PKP Intercity", mode: "rail", tags: ["intercity", "night-train"] },
      { name: "Polregio", mode: "rail", tags: ["regional"] },
      { name: "Koleje Mazowieckie", mode: "rail", tags: ["regional", "commuter"] },
      { name: "PKP SKM Tricity", mode: "rail", tags: ["commuter", "regional"] },
      { name: "Koleje Śląskie", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "FlixBus Poland", mode: "bus", tags: ["pan-european"] },
      { name: "Neobus", mode: "bus" },
      { name: "Polonus", mode: "bus" },
      { name: "Sindbad", mode: "bus", tags: ["international"] },
      { name: "Modlinbus", mode: "bus", tags: ["airport"] },
    ],
    sea: [
      { name: "Polferries", mode: "sea", tags: ["ferry", "island"] },
      { name: "Unity Line", mode: "sea", tags: ["ferry", "island"] },
      { name: "Stena Line", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 18. CZECH REPUBLIC (CZ)
  // ─────────────────────────────────────────────
  {
    code: "CZ",
    name: "Czech Republic",
    flag: "🇨🇿",
    continent: "europe",
    air: [
      { name: "Smartwings", mode: "air", tags: ["low-cost", "charter"] },
    ],
    rail: [
      { name: "České dráhy (ČD)", mode: "rail", tags: ["intercity", "regional"] },
      { name: "RegioJet", mode: "rail", tags: ["low-cost", "night-train"] },
      { name: "Leo Express", mode: "rail", tags: ["low-cost"] },
    ],
    bus: [
      { name: "RegioJet", mode: "bus" },
      { name: "Leo Express", mode: "bus" },
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [],
    notes: "Landlocked — no sea carriers",
  },

  // ─────────────────────────────────────────────
  // 19. HUNGARY (HU)
  // ─────────────────────────────────────────────
  {
    code: "HU",
    name: "Hungary",
    flag: "🇭🇺",
    continent: "europe",
    air: [
      { name: "Wizz Air", mode: "air", tags: ["low-cost", "global-hq"] },
      { name: "Malév Hungarian Airlines", mode: "air", tags: ["flag-carrier"], status: "defunct", notes: "ceased February 2012" },
    ],
    rail: [
      { name: "MÁV-START", mode: "rail", tags: ["intercity", "regional"] },
      { name: "GYSEV", mode: "rail", tags: ["regional", "cross-border"] },
    ],
    bus: [
      { name: "Volánbusz", mode: "bus" },
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [
      { name: "MAHART PassNave", mode: "sea", tags: ["river", "danube"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 20. CROATIA (HR)
  // ─────────────────────────────────────────────
  {
    code: "HR",
    name: "Croatia",
    flag: "🇭🇷",
    continent: "europe",
    air: [
      { name: "Croatia Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Trade Air", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "HŽ Putnički prijevoz (HŽPP)", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Arriva Croatia", mode: "bus" },
      { name: "Croatia Bus", mode: "bus" },
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [
      { name: "Jadrolinija", mode: "sea", tags: ["ferry", "island"] },
      { name: "Kapetan Luka (Krilo)", mode: "sea", tags: ["ferry", "island"] },
      { name: "TP Line", mode: "sea", tags: ["ferry", "island"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 21. IRELAND (IE)
  // ─────────────────────────────────────────────
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    continent: "europe",
    air: [
      { name: "Ryanair", mode: "air", tags: ["low-cost", "global-hq"] },
      { name: "Aer Lingus", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Emerald Airlines", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "Iarnród Éireann (Irish Rail)", mode: "rail", tags: ["intercity", "commuter"] },
    ],
    bus: [
      { name: "Bus Éireann", mode: "bus" },
      { name: "Dublin Bus", mode: "bus" },
      { name: "Citylink", mode: "bus" },
      { name: "Aircoach", mode: "bus", tags: ["airport", "long-distance"] },
      { name: "Go-Ahead Ireland", mode: "bus", tags: ["commuter"] },
    ],
    sea: [
      { name: "Irish Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "Stena Line", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 22. ROMANIA (RO)
  // ─────────────────────────────────────────────
  {
    code: "RO",
    name: "Romania",
    flag: "🇷🇴",
    continent: "europe",
    air: [
      { name: "TAROM", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "HiSky", mode: "air", tags: ["low-cost"] },
      { name: "Dan Air", mode: "air", tags: ["low-cost"] },
      { name: "FlyLili", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "CFR Călători", mode: "rail", tags: ["intercity", "regional"] },
      { name: "Astra Trans Carpatic", mode: "rail", tags: ["regional"] },
      { name: "Transferoviar Călători", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Tofan Grup", mode: "bus" },
      { name: "CDI Transport", mode: "bus" },
    ],
    sea: [
      { name: "Navrom Delta", mode: "sea", tags: ["river", "danube"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 23. BULGARIA (BG)
  // ─────────────────────────────────────────────
  {
    code: "BG",
    name: "Bulgaria",
    flag: "🇧🇬",
    continent: "europe",
    air: [
      { name: "Bulgaria Air", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "European Air Charter", mode: "air", tags: ["charter"] },
    ],
    rail: [
      { name: "BDZ", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Union Ivkoni", mode: "bus" },
      { name: "Biomet", mode: "bus" },
      { name: "Karat-S", mode: "bus" },
    ],
    sea: [
      { name: "Local Black Sea lines", mode: "sea", tags: ["coastal"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 24. SLOVAKIA (SK)
  // ─────────────────────────────────────────────
  {
    code: "SK",
    name: "Slovakia",
    flag: "🇸🇰",
    continent: "europe",
    air: [
      { name: "AirExplore", mode: "air", tags: ["charter"] },
      { name: "SkyEurope", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased September 2009" },
    ],
    rail: [
      { name: "ZSSK", mode: "rail", tags: ["intercity", "regional"] },
      { name: "RegioJet", mode: "rail", tags: ["low-cost", "cross-border"] },
    ],
    bus: [
      { name: "Slovak Lines", mode: "bus" },
      { name: "FlixBus", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [
      { name: "Twin City Liner (Bratislava)", mode: "sea", tags: ["hydrofoil", "danube"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 25. SLOVENIA (SI)
  // ─────────────────────────────────────────────
  {
    code: "SI",
    name: "Slovenia",
    flag: "🇸🇮",
    continent: "europe",
    air: [
      { name: "Adria Airways", mode: "air", tags: ["flag-carrier"], status: "defunct", notes: "ceased September 2019; no scheduled Slovenian carrier since" },
    ],
    rail: [
      { name: "SŽ (Slovenske železnice)", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Arriva Slovenija", mode: "bus" },
      { name: "Nomago", mode: "bus" },
    ],
    sea: [
      { name: "Trieste Lines", mode: "sea", tags: ["ferry", "cross-border"] },
    ],
    notes: "No national airline carrier — served by international carriers",
  },

  // ─────────────────────────────────────────────
  // 26. SERBIA (RS)
  // ─────────────────────────────────────────────
  {
    code: "RS",
    name: "Serbia",
    flag: "🇷🇸",
    continent: "europe",
    air: [
      { name: "Air Serbia", mode: "air", tags: ["flag-carrier", "full-service"] },
    ],
    rail: [
      { name: "Srbija Voz", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Lasta Beograd", mode: "bus" },
      { name: "Nis-Ekspres", mode: "bus" },
      { name: "BS Tours", mode: "bus" },
    ],
    sea: [],
    notes: "Landlocked — river cruises available on the Danube",
  },

  // ─────────────────────────────────────────────
  // 27. BOSNIA & HERZEGOVINA (BA)
  // ─────────────────────────────────────────────
  {
    code: "BA",
    name: "Bosnia & Herzegovina",
    flag: "🇧🇦",
    continent: "europe",
    air: [
      { name: "Air Bosna", mode: "air", tags: ["flag-carrier"], status: "defunct", notes: "ceased 2012" },
      { name: "BH Airlines", mode: "air", tags: ["regional"], status: "defunct", notes: "ceased 2015; no scheduled Bosnian carrier since" },
    ],
    rail: [
      { name: "ŽFBH", mode: "rail", tags: ["regional"] },
      { name: "ŽRS", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Centrotrans", mode: "bus" },
      { name: "Globtour", mode: "bus" },
      { name: "Kantić Line", mode: "bus" },
    ],
    sea: [],
    notes: "Landlocked — no national airline or sea carriers",
  },

  // ─────────────────────────────────────────────
  // 28. MONTENEGRO (ME)
  // ─────────────────────────────────────────────
  {
    code: "ME",
    name: "Montenegro",
    flag: "🇲🇪",
    continent: "europe",
    air: [
      { name: "Air Montenegro", mode: "air", tags: ["flag-carrier", "regional"] },
      { name: "Montenegro Airlines", mode: "air", tags: ["flag-carrier"], status: "defunct", notes: "ceased December 2020, liquidated; succeeded by Air Montenegro" },
    ],
    rail: [
      { name: "ŽPCG", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Blue Line", mode: "bus" },
      { name: "Lalatović Travel", mode: "bus" },
    ],
    sea: [
      { name: "Kompas", mode: "sea", tags: ["coastal-ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 29. ALBANIA (AL)
  // ─────────────────────────────────────────────
  {
    code: "AL",
    name: "Albania",
    flag: "🇦🇱",
    continent: "europe",
    air: [
      { name: "Air Albania", mode: "air", tags: ["flag-carrier", "regional"] },
    ],
    rail: [
      { name: "HSH (Hekurudha Shqiptare)", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "RivieraBus", mode: "bus" },
      { name: "Olsi Travel", mode: "bus" },
    ],
    sea: [
      { name: "Finikas Lines", mode: "sea", tags: ["ferry", "international"] },
      { name: "Ionian Seaways", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 30. NORTH MACEDONIA (MK)
  // ─────────────────────────────────────────────
  {
    code: "MK",
    name: "North Macedonia",
    flag: "🇲🇰",
    continent: "europe",
    air: [],
    rail: [
      { name: "ŽRSM Transport", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Rule Turs", mode: "bus" },
      { name: "Galeb Ohrid", mode: "bus" },
    ],
    sea: [
      { name: "Lake Ohrid lines", mode: "sea", tags: ["lake-ferry"] },
    ],
    notes: "No national airline — served by international carriers",
  },

  // ─────────────────────────────────────────────
  // 31. KOSOVO (XK)
  // ─────────────────────────────────────────────
  {
    code: "XK",
    name: "Kosovo",
    flag: "🇽🇰",
    continent: "europe",
    air: [],
    rail: [
      { name: "Trainkos", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Barileva Turist", mode: "bus" },
      { name: "Sharr Travel", mode: "bus" },
    ],
    sea: [],
    notes: "Landlocked — no national airline or sea carriers",
  },

  // ─────────────────────────────────────────────
  // 32. ESTONIA (EE)
  // ─────────────────────────────────────────────
  {
    code: "EE",
    name: "Estonia",
    flag: "🇪🇪",
    continent: "europe",
    air: [
      { name: "Nordica (Xfly)", mode: "air", tags: ["regional"] },
      { name: "NyxAir", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "Elron", mode: "rail", tags: ["regional", "commuter"] },
    ],
    bus: [
      { name: "Lux Express", mode: "bus", tags: ["international"] },
      { name: "Taisto Liinid", mode: "bus" },
    ],
    sea: [
      { name: "Tallink", mode: "sea", tags: ["ferry", "international"] },
      { name: "TS Laevad", mode: "sea", tags: ["ferry", "island"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 33. LATVIA (LV)
  // ─────────────────────────────────────────────
  {
    code: "LV",
    name: "Latvia",
    flag: "🇱🇻",
    continent: "europe",
    air: [
      { name: "airBaltic", mode: "air", tags: ["flag-carrier", "full-service"] },
    ],
    rail: [
      { name: "Vivi (Pasažieru vilciens)", mode: "rail", tags: ["commuter"] },
    ],
    bus: [
      { name: "Lux Express", mode: "bus", tags: ["international"] },
      { name: "Ecolines", mode: "bus", tags: ["international"] },
    ],
    sea: [
      { name: "Tallink", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 34. LITHUANIA (LT)
  // ─────────────────────────────────────────────
  {
    code: "LT",
    name: "Lithuania",
    flag: "🇱🇹",
    continent: "europe",
    air: [
      { name: "Avion Express", mode: "air", tags: ["charter"] },
      { name: "GetJet Airlines", mode: "air", tags: ["charter"] },
    ],
    rail: [
      { name: "LTG Link", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Kautra", mode: "bus" },
      { name: "TOKS", mode: "bus" },
      { name: "Ecolines", mode: "bus", tags: ["international"] },
    ],
    sea: [
      { name: "Smiltynės perkėla", mode: "sea", tags: ["ferry", "island"] },
      { name: "DFDS Seaways", mode: "sea", tags: ["ferry", "international"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 35. ICELAND (IS)
  // ─────────────────────────────────────────────
  {
    code: "IS",
    name: "Iceland",
    flag: "🇮🇸",
    continent: "europe",
    air: [
      { name: "Icelandair", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "PLAY", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased February 2024" },
      { name: "WOW air", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased March 2019" },
      { name: "Primera Air", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased October 2018" },
    ],
    rail: [],
    bus: [
      { name: "Strætó", mode: "bus" },
      { name: "Reykjavik Excursions", mode: "bus" },
    ],
    sea: [
      { name: "Herjólfur (Samskip)", mode: "sea", tags: ["ferry", "island"] },
    ],
    notes: "No rail network — air and bus are primary domestic transport",
  },

  // ─────────────────────────────────────────────
  // 36. LUXEMBOURG (LU)
  // ─────────────────────────────────────────────
  {
    code: "LU",
    name: "Luxembourg",
    flag: "🇱🇺",
    continent: "europe",
    air: [
      { name: "Luxair", mode: "air", tags: ["flag-carrier", "regional"] },
    ],
    rail: [
      { name: "CFL", mode: "rail", tags: ["intercity", "cross-border"] },
    ],
    bus: [
      { name: "RGTR", mode: "bus" },
      { name: "TICE", mode: "bus" },
    ],
    sea: [
      { name: "Navitours (Moselle)", mode: "sea", tags: ["river"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 37. MALTA (MT)
  // ─────────────────────────────────────────────
  {
    code: "MT",
    name: "Malta",
    flag: "🇲🇹",
    continent: "europe",
    air: [
      { name: "KM Malta Airlines", mode: "air", tags: ["flag-carrier", "regional"] },
      { name: "Universal Air", mode: "air", tags: ["regional"] },
      { name: "Air Malta", mode: "air", tags: ["flag-carrier"], status: "defunct", notes: "ceased March 2024, succeeded by KM Malta Airlines" },
    ],
    rail: [],
    bus: [
      { name: "Malta Public Transport", mode: "bus" },
    ],
    sea: [
      { name: "Virtu Ferries", mode: "sea", tags: ["ferry", "international"] },
      { name: "Gozo Channel", mode: "sea", tags: ["ferry", "island"] },
    ],
    notes: "No rail network — bus is primary ground transport",
  },

  // ─────────────────────────────────────────────
  // 38. CYPRUS (CY)
  // ─────────────────────────────────────────────
  {
    code: "CY",
    name: "Cyprus",
    flag: "🇨🇾",
    continent: "europe",
    air: [
      { name: "Cyprus Airways", mode: "air", tags: ["flag-carrier", "regional"] },
      { name: "Tus Airways", mode: "air", tags: ["regional"] },
      { name: "Cobalt Air", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased January 2018" },
    ],
    rail: [],
    bus: [
      { name: "Cyprus Public Transport", mode: "bus" },
      { name: "Intercity Buses", mode: "bus" },
    ],
    sea: [
      { name: "Regional port ferries", mode: "sea", tags: ["coastal"] },
    ],
    notes: "No rail network — divided island with limited sea connectivity",
  },

  // ─────────────────────────────────────────────
  // 39. UKRAINE (UA)
  // ─────────────────────────────────────────────
  {
    code: "UA",
    name: "Ukraine",
    flag: "🇺🇦",
    continent: "europe",
    air: [
      { name: "UIA", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "SkyUp", mode: "air", tags: ["low-cost"] },
      { name: "Bees Airline", mode: "air", tags: ["low-cost"] },
      { name: "Windrose", mode: "air", tags: ["regional", "charter"] },
    ],
    rail: [
      { name: "Ukrzaliznytsia (UZ)", mode: "rail", tags: ["intercity", "night-train"] },
    ],
    bus: [
      { name: "Autolux", mode: "bus" },
      { name: "Gunsel", mode: "bus" },
      { name: "Ecolines", mode: "bus", tags: ["international"] },
    ],
    sea: [
      { name: "Ukrferry", mode: "sea", tags: ["ferry"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 40. MOLDOVA (MD)
  // ─────────────────────────────────────────────
  {
    code: "MD",
    name: "Moldova",
    flag: "🇲🇩",
    continent: "europe",
    air: [
      { name: "FlyOne", mode: "air", tags: ["low-cost"] },
      { name: "HiSky Moldova", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "CFM", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Gările Auto Nationale network", mode: "bus" },
    ],
    sea: [],
    notes: "Landlocked — no sea carriers",
  },

  // ─────────────────────────────────────────────
  // 41. BELARUS (BY)
  // ─────────────────────────────────────────────
  {
    code: "BY",
    name: "Belarus",
    flag: "🇧🇾",
    continent: "europe",
    air: [
      { name: "Belavia", mode: "air", tags: ["flag-carrier", "full-service"] },
    ],
    rail: [
      { name: "BZD", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Minsktrans", mode: "bus" },
      { name: "Ecolines", mode: "bus", tags: ["international"] },
    ],
    sea: [],
    notes: "Landlocked — no sea carriers",
  },

  // ─────────────────────────────────────────────
  // 42. MICROSTATES & ISLAND TERRITORIES
  // ─────────────────────────────────────────────
  {
    code: "MC",
    name: "Monaco",
    flag: "🇲🇨",
    continent: "europe",
    air: [
      { name: "Heli Air Monaco", mode: "air", tags: ["helicopter"] },
    ],
    rail: [
      { name: "SNCF Monaco Station", mode: "rail", tags: ["cross-border", "french-rail"] },
    ],
    bus: [
      { name: "CAM", mode: "bus" },
    ],
    sea: [
      { name: "Monaco One", mode: "sea", tags: ["water-shuttle"] },
    ],
  },

  // ─────────────────────────────────────────────
  // 42b. ANDORRA
  // ─────────────────────────────────────────────
  {
    code: "AD",
    name: "Andorra",
    flag: "🇦🇩",
    continent: "europe",
    air: [],
    rail: [],
    bus: [
      { name: "Andorra Transit", mode: "bus" },
      { name: "Directbus", mode: "bus" },
    ],
    sea: [],
    notes: "Landlocked microstate — nearest airport is La Seu d'Urgell (Spain) or Toulouse (France)",
  },

  // ─────────────────────────────────────────────
  // 42c. SAN MARINO
  // ─────────────────────────────────────────────
  {
    code: "SM",
    name: "San Marino",
    flag: "🇸🇲",
    continent: "europe",
    air: [],
    rail: [],
    bus: [
      { name: "Bonelli Bus", mode: "bus" },
      { name: "TTI San Marino", mode: "bus" },
    ],
    sea: [],
    notes: "Microstate — nearest airport is Rimini Federico Fellini (Italy)",
  },

  // ─────────────────────────────────────────────
  // 42d. LIECHTENSTEIN
  // ─────────────────────────────────────────────
  {
    code: "LI",
    name: "Liechtenstein",
    flag: "🇱🇮",
    continent: "europe",
    air: [],
    rail: [
      { name: "ÖBB Liechtenstein network", mode: "rail", tags: ["cross-border", "austrian-rail"] },
    ],
    bus: [
      { name: "LIEmobil", mode: "bus" },
    ],
    sea: [],
    notes: "Microstate — fully integrated into Austrian/Swiss rail network",
  },

  // ─────────────────────────────────────────────
  // 42e. VATICAN CITY
  // ─────────────────────────────────────────────
  {
    code: "VA",
    name: "Vatican City",
    flag: "🇻🇦",
    continent: "europe",
    air: [],
    rail: [
      { name: "Vatican Railway", mode: "rail", tags: ["cargo", "special"] },
    ],
    bus: [
      { name: "ATAC Rome network", mode: "bus", tags: ["cross-border", "italian-bus"] },
    ],
    sea: [],
    notes: "Microstate — connected to Italian rail and bus network via Rome",
  },

  // ─────────────────────────────────────────────
  // 43. CROSS-BORDER CONTINENTAL GIANTS
  // ─────────────────────────────────────────────
  {
    code: "EU",
    name: "Cross-Border Continental Carriers",
    flag: "🇪🇺",
    continent: "europe",
    air: [
      { name: "Ryanair", mode: "air", tags: ["low-cost", "pan-european"] },
      { name: "Wizz Air", mode: "air", tags: ["low-cost", "pan-european"] },
      { name: "easyJet", mode: "air", tags: ["low-cost", "pan-european"] },
      { name: "Eurowings", mode: "air", tags: ["low-cost", "pan-european"] },
      { name: "Vueling", mode: "air", tags: ["low-cost", "pan-european"] },
      { name: "Norwegian", mode: "air", tags: ["low-cost", "pan-european"] },
    ],
    rail: [
      { name: "Eurostar", mode: "rail", tags: ["high-speed", "cross-border"] },
      { name: "ÖBB Nightjet", mode: "rail", tags: ["night-train", "cross-border"] },
      { name: "Thalys", mode: "rail", tags: ["high-speed", "cross-border"], status: "defunct", notes: "Brand retired in 2023 — routes now operated as Eurostar." },
      { name: "TGV Lyria", mode: "rail", tags: ["high-speed", "cross-border"] },
      { name: "DB-ÖBB EuroCity", mode: "rail", tags: ["intercity", "cross-border"] },
    ],
    bus: [
      { name: "FlixBus", mode: "bus", tags: ["pan-european", "low-cost"] },
      { name: "Ecolines", mode: "bus", tags: ["pan-european"] },
      { name: "Lux Express", mode: "bus", tags: ["pan-european"] },
      { name: "RegioJet", mode: "bus", tags: ["pan-european", "low-cost"] },
      { name: "BlaBlaCar Bus", mode: "bus", tags: ["pan-european"] },
    ],
    sea: [],
    notes: "Pan-European carriers operating across multiple countries",
  },

  // ─────────────────────────────────────────────
  // 44–56. NON-EUROPEAN COUNTRIES (C3)
  // ─────────────────────────────────────────────
  {
    code: "AM",
    name: "Armenia",
    flag: "🇦🇲",
    continent: "asia",
    air: [
      { name: "FlyOne Armenia", mode: "air", tags: ["low-cost"] },
      { name: "Armenia Airways", mode: "air", tags: ["charter"] },
    ],
    rail: [
      { name: "South Caucasus Railway", mode: "rail", tags: ["mainline", "regional"] },
    ],
    bus: [],
    sea: [],
    notes: "Landlocked; intercity buses run as marshrutka networks with no major national operator",
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    flag: "🇦🇿",
    continent: "asia",
    air: [
      { name: "Azerbaijan Airlines (AZAL)", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Buta Airways", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "Azerbaijan Railways (ADY)", mode: "rail", tags: ["mainline", "regional"] },
    ],
    bus: [],
    sea: [],
    notes: "Landlocked (Caspian coast); Baku–Turkmenbashi ferry service is intermittent",
  },
  {
    code: "GE",
    name: "Georgia",
    flag: "🇬🇪",
    continent: "asia",
    air: [
      { name: "Georgian Airways", mode: "air", tags: ["flag-carrier"] },
    ],
    rail: [
      { name: "Georgian Railway", mode: "rail", tags: ["mainline", "regional"] },
    ],
    bus: [],
    sea: [],
    notes: "Black Sea coastal ferries are seasonal/irregular; intercity travel is by marshrutka (minibus) network",
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    continent: "europe",
    air: [
      { name: "Aeroflot", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Rossiya Airlines", mode: "air", tags: ["full-service"] },
      { name: "S7 Airlines", mode: "air", tags: ["domestic-hub"] },
      { name: "Ural Airlines", mode: "air", tags: ["full-service"] },
      { name: "Pobeda", mode: "air", tags: ["low-cost"] },
      { name: "Nordwind Airlines", mode: "air", tags: ["full-service"] },
      { name: "Smartavia", mode: "air", tags: ["domestic"] },
      { name: "Red Wings", mode: "air", tags: ["domestic"] },
    ],
    rail: [
      { name: "Russian Railways (RZD)", mode: "rail", tags: ["high-speed", "mainline", "night-train"], notes: "Sapsan high-speed, overnight trains" },
      { name: "Federal Passenger Company", mode: "rail", tags: ["regional"] },
    ],
    bus: [],
    sea: [],
    notes: "Intercity buses are regional; passenger ferry services are limited to seasonal routes",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    continent: "middle-east",
    air: [
      { name: "Emirates", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Etihad Airways", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "flydubai", mode: "air", tags: ["low-cost"] },
      { name: "Air Arabia", mode: "air", tags: ["low-cost"] },
      { name: "Wizz Air Abu Dhabi", mode: "air", tags: ["low-cost"] },
    ],
    rail: [],
    bus: [
      { name: "RTA Dubai (urban & intercity buses)", mode: "bus", tags: ["urban"] },
    ],
    sea: [
      { name: "Abu Dhabi Maritime", mode: "sea", tags: ["ferry", "urban"] },
    ],
    notes: "No intercity rail — Dubai Metro and Abu Dhabi metro systems are urban only",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    continent: "oceania",
    air: [
      { name: "Qantas", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Virgin Australia", mode: "air", tags: ["full-service"] },
      { name: "Jetstar", mode: "air", tags: ["low-cost"] },
      { name: "Rex (Regional Express)", mode: "air", tags: ["regional"] },
      { name: "Bonza", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased operations April 2024" },
      { name: "Airnorth", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "Great Southern Rail (The Ghan / Indian Pacific)", mode: "rail", tags: ["scenic", "long-distance"] },
      { name: "NSW TrainLink", mode: "rail", tags: ["intercity", "regional"] },
      { name: "V/Line", mode: "rail", tags: ["regional"] },
    ],
    bus: [
      { name: "Greyhound Australia", mode: "bus", tags: ["long-distance"] },
      { name: "Premier Motor Service", mode: "bus", tags: ["long-distance"] },
      { name: "Firefly", mode: "bus", tags: ["long-distance"] },
    ],
    sea: [
      { name: "Spirit of Tasmania", mode: "sea", tags: ["ferry", "international"] },
      { name: "SeaLink", mode: "sea", tags: ["ferry"] },
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    continent: "americas",
    air: [
      { name: "LATAM Brasil", mode: "air", tags: ["full-service"] },
      { name: "GOL Linhas Aéreas", mode: "air", tags: ["low-cost"] },
      { name: "Azul Linhas Aéreas", mode: "air", tags: ["domestic-hub"] },
      { name: "Avianca Brasil", mode: "air", tags: ["full-service"], status: "defunct", notes: "ceased operations May 2019" },
      { name: "VOEPASS", mode: "air", tags: ["regional"] },
    ],
    rail: [],
    bus: [
      { name: "Auto Viação 1001", mode: "bus", tags: ["long-distance"] },
      { name: "Viação Águia Branca", mode: "bus", tags: ["long-distance"] },
    ],
    sea: [
      { name: "Line Verde (Salvador–Itaparica)", mode: "sea", tags: ["ferry"] },
    ],
    notes: "No intercity passenger rail — long-distance buses and domestic flights carry the load",
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    continent: "asia",
    air: [
      { name: "IndiGo", mode: "air", tags: ["domestic-hub", "low-cost"] },
      { name: "Air India", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "SpiceJet", mode: "air", tags: ["low-cost"] },
      { name: "Akasa Air", mode: "air", tags: ["low-cost"] },
      { name: "Vistara", mode: "air", tags: ["full-service"], status: "defunct", notes: "merged into Air India, last flight September 2024" },
      { name: "Jet Airways", mode: "air", tags: ["full-service"], status: "defunct", notes: "ceased April 2019, liquidation ordered November 2024" },
      { name: "Go First (GoAir)", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased May 2023, liquidation ordered January 2025" },
      { name: "Alliance Air", mode: "air", tags: ["regional"] },
      { name: "Air India Express", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "Indian Railways (IRCTC)", mode: "rail", tags: ["mainline", "high-speed-pending", "regional"], notes: "13,000+ trains daily — the country's backbone" },
    ],
    bus: [
      { name: "State RTC network (KSRTC / APSRTC / TSRTC)", mode: "bus", tags: ["state-run", "regional"] },
    ],
    sea: [
      { name: "Kerala State Water Transport (KSWTD)", mode: "sea", tags: ["ferry", "backwaters"] },
      { name: "Andaman ferry network", mode: "sea", tags: ["ferry", "island"] },
    ],
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    continent: "asia",
    air: [
      { name: "ANA (All Nippon Airways)", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Japan Airlines (JAL)", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Peach Aviation", mode: "air", tags: ["low-cost"] },
      { name: "Jetstar Japan", mode: "air", tags: ["low-cost"] },
      { name: "Spring Japan", mode: "air", tags: ["low-cost"] },
      { name: "Skymark Airlines", mode: "air", tags: ["domestic"] },
      { name: "Air Do", mode: "air", tags: ["regional"] },
      { name: "StarFlyer", mode: "air", tags: ["domestic"] },
      { name: "IBEX Airlines", mode: "air", tags: ["regional"] },
      { name: "Solaseed Air", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "JR Group (Shinkansen & limited express)", mode: "rail", tags: ["high-speed", "mainline", "regional"] },
      { name: "Tobu Railway", mode: "rail", tags: ["intercity", "regional"] },
    ],
    bus: [
      { name: "Willer Express", mode: "bus", tags: ["highway", "overnight"] },
      { name: "JR Bus Company", mode: "bus", tags: ["highway"] },
    ],
    sea: [
      { name: "Ferry Sunflower", mode: "sea", tags: ["ferry", "overnight"] },
      { name: "Taiyo Ferry", mode: "sea", tags: ["ferry", "overnight"] },
      { name: "MOL Sun Ferry", mode: "sea", tags: ["ferry"] },
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    continent: "asia",
    air: [
      { name: "Singapore Airlines", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Scoot", mode: "air", tags: ["low-cost"] },
      { name: "Jetstar Asia", mode: "air", tags: ["low-cost"], status: "defunct", notes: "ceased operations July 2025" },
    ],
    rail: [],
    bus: [
      { name: "SBS Transit", mode: "bus", tags: ["urban"] },
      { name: "SMRT Buses", mode: "bus", tags: ["urban"] },
    ],
    sea: [
      { name: "Sindo Ferry", mode: "sea", tags: ["ferry", "international"] },
      { name: "Batam Fast Ferry", mode: "sea", tags: ["ferry", "international"] },
    ],
    notes: "No cross-border rail — Singapore MRT is urban only; ferries run to Batam/Bintan (Indonesia)",
  },
  {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    continent: "asia",
    air: [
      { name: "Thai Airways", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "Bangkok Airways", mode: "air", tags: ["full-service", "regional"] },
      { name: "Thai AirAsia", mode: "air", tags: ["low-cost"] },
      { name: "Nok Air", mode: "air", tags: ["low-cost"] },
      { name: "Thai Vietjet", mode: "air", tags: ["low-cost"] },
      { name: "Thai Lion Air", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "State Railway of Thailand", mode: "rail", tags: ["mainline", "regional"] },
    ],
    bus: [
      { name: "Transport Co. Ltd (BKS)", mode: "bus", tags: ["state-run", "long-distance"] },
    ],
    sea: [
      { name: "Raja Ferry", mode: "sea", tags: ["ferry", "gulf"] },
      { name: "Lomprayah", mode: "sea", tags: ["ferry", "high-speed"] },
    ],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    continent: "americas",
    air: [
      { name: "United Airlines", mode: "air", tags: ["full-service"] },
      { name: "Delta Air Lines", mode: "air", tags: ["full-service"] },
      { name: "American Airlines", mode: "air", tags: ["full-service"] },
      { name: "Southwest Airlines", mode: "air", tags: ["low-cost"] },
      { name: "Alaska Airlines", mode: "air", tags: ["full-service"] },
      { name: "JetBlue", mode: "air", tags: ["low-cost"] },
      { name: "Frontier Airlines", mode: "air", tags: ["ultra-low-cost"] },
      { name: "Allegiant Air", mode: "air", tags: ["ultra-low-cost"] },
      { name: "Spirit Airlines", mode: "air", tags: ["ultra-low-cost"], status: "defunct", notes: "ceased operations May 2026, orderly wind-down after second bankruptcy" },
      { name: "Sun Country Airlines", mode: "air", tags: ["leisure", "ultra-low-cost"] },
      { name: "Breeze Airways", mode: "air", tags: ["low-cost"] },
      { name: "Avelo Airlines", mode: "air", tags: ["low-cost"] },
    ],
    rail: [
      { name: "Amtrak", mode: "rail", tags: ["mainline", "long-distance", "regional"] },
    ],
    bus: [
      { name: "Greyhound", mode: "bus", tags: ["long-distance"] },
      { name: "Peter Pan Bus Lines", mode: "bus", tags: ["long-distance"] },
      { name: "FlixBus US", mode: "bus", tags: ["long-distance", "low-cost"] },
    ],
    sea: [
      { name: "Staten Island Ferry", mode: "sea", tags: ["ferry", "urban"] },
      { name: "Washington State Ferries", mode: "sea", tags: ["ferry"] },
      { name: "NYC Ferry", mode: "sea", tags: ["ferry", "urban"] },
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    continent: "africa",
    air: [
      { name: "South African Airways", mode: "air", tags: ["flag-carrier", "full-service"] },
      { name: "FlySafair", mode: "air", tags: ["low-cost"] },
      { name: "Airlink", mode: "air", tags: ["regional"] },
      { name: "Lift", mode: "air", tags: ["domestic"] },
      { name: "Comair", mode: "air", tags: ["full-service", "regional"], status: "defunct", notes: "British Airways franchise and kulula.com owner — ceased May 2022, liquidated June 2022" },
      { name: "kulula.com", mode: "air", tags: ["low-cost"], status: "defunct", notes: "Comair's low-cost brand — ceased June 2022" },
      { name: "CemAir", mode: "air", tags: ["regional"] },
    ],
    rail: [
      { name: "Shosholoza Meyl", mode: "rail", tags: ["long-distance", "regional"] },
    ],
    bus: [
      { name: "Intercape", mode: "bus", tags: ["long-distance"] },
      { name: "Translux", mode: "bus", tags: ["long-distance"] },
      { name: "Greyhound South Africa", mode: "bus", tags: ["long-distance"], status: "defunct", notes: "ceased operations February 2021" },
    ],
    sea: [
      { name: "Robben Island ferries (Nelson Mandela Gateway)", mode: "sea", tags: ["ferry", "heritage"] },
    ],
  },
];

// ---------- Helper Utilities ----------

/** Get carriers for a specific country by ISO code */
export function getCountryByCode(code: string): CountryCarriers | undefined {
  return europeCarriers.find((c) => c.code === code);
}

/** Normalize string: lowercase + remove diacritics */
function normalizeStr(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Search countries by name (case-insensitive + diacritic-insensitive) */
export function searchCountries(query: string): CountryCarriers[] {
  const q = normalizeStr(query);
  return europeCarriers.filter(
    (c) =>
      normalizeStr(c.name).includes(q) ||
      c.code.toLowerCase().includes(q)
  );
}

/** Get all carriers of a specific transport mode across all countries */
export function getAllCarriersByMode(
  mode: "air" | "rail" | "bus" | "sea"
): Array<{ country: string; carrier: string; tags?: string[] }> {
  return europeCarriers.flatMap((country) =>
    country[mode].map((carrier) => ({
      country: country.name,
      carrier: carrier.name,
      tags: carrier.tags,
    }))
  );
}

/** Operating status of a carrier — data field may be omitted (= active). */
export function carrierStatus(
  carrier: { status?: "active" | "defunct" }
): "active" | "defunct" {
  return carrier.status ?? "active";
}

/** Search carriers across all countries (name, country, tags, notes — diacritic-insensitive) */
export function searchCarriers(query: string): Array<{
  country: CountryCarriers;
  carrier: string;
  mode: string;
  tags?: string[];
  status?: "active" | "defunct";
}> {
  const q = normalizeStr(query);
  const results: Array<{
    country: CountryCarriers;
    carrier: string;
    mode: string;
    tags?: string[];
    status?: "active" | "defunct";
  }> = [];

  for (const country of europeCarriers) {
    // Check if query matches the country name or code
    const countryNameMatch = normalizeStr(country.name).includes(q);
    const countryCodeMatch = country.code.toLowerCase().includes(q);
    const countryMatch = countryNameMatch || countryCodeMatch;

    for (const mode of ["air", "rail", "bus", "sea"] as const) {
      for (const carrier of country[mode]) {
        const nameMatch = normalizeStr(carrier.name).includes(q);
        const tagsMatch = carrier.tags?.some((t) => normalizeStr(t).includes(q)) ?? false;
        const notesMatch = carrier.notes ? normalizeStr(carrier.notes).includes(q) : false;

        // Include if: carrier name matches, OR tags match, OR notes match, OR entire country matches
        if (nameMatch || tagsMatch || notesMatch || countryMatch) {
          results.push({
            country,
            carrier: carrier.name,
            mode,
            tags: carrier.tags,
            status: carrierStatus(carrier),
          });
        }
      }
    }
  }

  return results;
}

/** Get summary stats */
export function getCarrierStats(): {
  totalCountries: number;
  totalCarriers: number;
  byMode: Record<string, number>;
} {
  let totalCarriers = 0;
  const byMode: Record<string, number> = { air: 0, rail: 0, bus: 0, sea: 0 };

  for (const country of europeCarriers) {
    for (const mode of ["air", "rail", "bus", "sea"] as const) {
      byMode[mode] += country[mode].length;
      totalCarriers += country[mode].length;
    }
  }

  return {
    totalCountries: europeCarriers.length,
    totalCarriers,
    byMode,
  };
}
