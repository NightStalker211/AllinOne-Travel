// ============================================================
// FreeBuff Travel — Britain / United Kingdom (GB) destination entries
// Converted from: TravelApp_Britain.pdf
// SCOPE NOTE: This source PDF is huge (243+ individual terminals —
// England-focused, explicitly excludes Scotland, Wales and Northern
// Ireland for airports; a handful of Welsh coach stations appear only
// in the bus section). Given the size, this file includes the major/
// hub-level terminals in each category, not every small-town stop the
// PDF lists (e.g. dozens of minor English bus stations were left out).
// If deeper regional coverage is wanted later, the PDF has plenty more
// to convert — just ask for a specific region/category.
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------

  { id: "lhr", name: "London Heathrow Airport", displayName: "London Heathrow (LHR)", country: "GB", countryCode: "GB", category: "air", city: "London", iata: "LHR", timezone: "Europe/London", tags: ["major-hub", "star-alliance", "heathrow-express"] },
  { id: "lgw", name: "London Gatwick Airport", displayName: "London Gatwick (LGW)", country: "GB", countryCode: "GB", category: "air", city: "London", iata: "LGW", timezone: "Europe/London", tags: ["second-london-hub", "gatwick-express"] },
  { id: "stn", name: "London Stansted Airport", displayName: "London Stansted (STN)", country: "GB", countryCode: "GB", category: "air", city: "London", iata: "STN", timezone: "Europe/London", tags: ["low-cost-hub", "ryanair"] },
  { id: "ltn", name: "London Luton Airport", displayName: "London Luton (LTN)", country: "GB", countryCode: "GB", category: "air", city: "Luton", iata: "LTN", timezone: "Europe/London", tags: ["low-cost", "easyjet", "wizz-air"] },
  { id: "sen", name: "London Southend Airport", displayName: "London Southend (SEN)", country: "GB", countryCode: "GB", category: "air", city: "Southend-on-Sea", iata: "SEN", timezone: "Europe/London", tags: ["small", "regional"] },
  { id: "lcy", name: "London City Airport", displayName: "London City (LCY)", country: "GB", countryCode: "GB", category: "air", city: "London", iata: "LCY", timezone: "Europe/London", tags: ["business-travel", "canary-wharf", "steep-approach"] },
  { id: "sou", name: "Southampton Airport", displayName: "Southampton (SOU)", country: "GB", countryCode: "GB", category: "air", city: "Southampton", iata: "SOU", timezone: "Europe/London", tags: ["regional"] },
  { id: "boh", name: "Bournemouth Airport", displayName: "Bournemouth (BOH)", country: "GB", countryCode: "GB", category: "air", city: "Bournemouth", iata: "BOH", timezone: "Europe/London", tags: ["regional", "charter"] },
  { id: "brs", name: "Bristol Airport", displayName: "Bristol (BRS)", country: "GB", countryCode: "GB", category: "air", city: "Bristol", iata: "BRS", timezone: "Europe/London", tags: ["regional-hub", "southwest-england"] },
  { id: "ext", name: "Exeter Airport", displayName: "Exeter (EXT)", country: "GB", countryCode: "GB", category: "air", city: "Exeter", iata: "EXT", timezone: "Europe/London", tags: ["regional"] },
  { id: "nqy", name: "Newquay Cornwall Airport", displayName: "Newquay (NQY)", country: "GB", countryCode: "GB", category: "air", city: "Newquay", iata: "NQY", timezone: "Europe/London", tags: ["cornwall", "regional"] },
  { id: "isc", name: "Isles of Scilly – St Mary's Airport", displayName: "Isles of Scilly (ISC)", country: "GB", countryCode: "GB", category: "air", city: "St Mary's", iata: "ISC", timezone: "Europe/London", tags: ["small-island", "very-limited"] },
  { id: "bhx", name: "Birmingham Airport", displayName: "Birmingham (BHX)", country: "GB", countryCode: "GB", category: "air", city: "Birmingham", iata: "BHX", timezone: "Europe/London", tags: ["midlands-hub"] },
  { id: "ema", name: "East Midlands Airport", displayName: "East Midlands (EMA)", country: "GB", countryCode: "GB", category: "air", city: "Castle Donington", iata: "EMA", timezone: "Europe/London", tags: ["cargo-heavy", "regional"] },
  { id: "man", name: "Manchester Airport", displayName: "Manchester (MAN)", country: "GB", countryCode: "GB", category: "air", city: "Manchester", iata: "MAN", timezone: "Europe/London", tags: ["major-hub", "north-england"] },
  { id: "blk", name: "Blackpool Airport", displayName: "Blackpool (BLK)", country: "GB", countryCode: "GB", category: "air", city: "Blackpool", iata: "BLK", timezone: "Europe/London", tags: ["small", "regional"] },
  { id: "ncl", name: "Newcastle Airport", displayName: "Newcastle (NCL)", country: "GB", countryCode: "GB", category: "air", city: "Newcastle upon Tyne", iata: "NCL", timezone: "Europe/London", tags: ["northeast-england-hub"] },
  { id: "mme", name: "Teesside International Airport", displayName: "Teesside (MME)", country: "GB", countryCode: "GB", category: "air", city: "Darlington", iata: "MME", timezone: "Europe/London", tags: ["publicly-owned", "regional"] },
  { id: "lba", name: "Leeds Bradford Airport", displayName: "Leeds Bradford (LBA)", country: "GB", countryCode: "GB", category: "air", city: "Leeds", iata: "LBA", timezone: "Europe/London", tags: ["yorkshire-hub"] },
  { id: "huy", name: "Humberside Airport", displayName: "Humberside (HUY)", country: "GB", countryCode: "GB", category: "air", city: "Kirmington", iata: "HUY", timezone: "Europe/London", tags: ["small", "regional"] },
  { id: "nwi", name: "Norwich Airport", displayName: "Norwich (NWI)", country: "GB", countryCode: "GB", category: "air", city: "Norwich", iata: "NWI", timezone: "Europe/London", tags: ["east-anglia", "regional"] },

// ---------- Paste into FERRY_PORTS (category: "sea") ----------

  { id: "dover-port", name: "Port of Dover", displayName: "Dover Port", country: "GB", countryCode: "GB", category: "sea", city: "Dover", timezone: "Europe/London", tags: ["france-calais", "busiest-uk-ferry-port", "roro"] },
  { id: "folkestone-eurotunnel", name: "Folkestone Eurotunnel (Le Shuttle) Terminal", displayName: "Folkestone Eurotunnel Terminal", country: "GB", countryCode: "GB", category: "sea", city: "Folkestone", timezone: "Europe/London", tags: ["channel-tunnel", "le-shuttle", "vehicle-train", "france"] },
  { id: "newhaven-port", name: "Port of Newhaven", displayName: "Newhaven Port", country: "GB", countryCode: "GB", category: "sea", city: "Newhaven", timezone: "Europe/London", tags: ["dieppe-france"] },
  { id: "ramsgate-port", name: "Port of Ramsgate", displayName: "Ramsgate Port", country: "GB", countryCode: "GB", category: "sea", city: "Ramsgate", timezone: "Europe/London", tags: ["limited-service"] },
  { id: "southampton-port", name: "Port of Southampton", displayName: "Southampton Port", country: "GB", countryCode: "GB", category: "sea", city: "Southampton", timezone: "Europe/London", tags: ["cruise-major", "isle-of-wight", "transatlantic-cruise"] },
  { id: "portsmouth-port", name: "Portsmouth International Port", displayName: "Portsmouth Port", country: "GB", countryCode: "GB", category: "sea", city: "Portsmouth", timezone: "Europe/London", tags: ["france", "spain", "santander", "bilbao", "caen", "cherbourg"] },
  { id: "poole-port", name: "Port of Poole", displayName: "Poole Port", country: "GB", countryCode: "GB", category: "sea", city: "Poole", timezone: "Europe/London", tags: ["cherbourg", "channel-islands"] },
  { id: "weymouth-port", name: "Port of Weymouth", displayName: "Weymouth Port", country: "GB", countryCode: "GB", category: "sea", city: "Weymouth", timezone: "Europe/London", tags: ["channel-islands"] },
  { id: "plymouth-port", name: "Plymouth Port (Millbay Docks)", displayName: "Plymouth Port", country: "GB", countryCode: "GB", category: "sea", city: "Plymouth", timezone: "Europe/London", tags: ["santander-spain", "roscoff-france"] },
  { id: "penzance-port", name: "Port of Penzance", displayName: "Penzance Port", country: "GB", countryCode: "GB", category: "sea", city: "Penzance", timezone: "Europe/London", tags: ["isles-of-scilly"] },
  { id: "isle-of-wight-fishbourne", name: "Fishbourne Terminal (Isle of Wight)", displayName: "Isle of Wight – Fishbourne", country: "GB", countryCode: "GB", category: "sea", city: "Fishbourne", timezone: "Europe/London", tags: ["isle-of-wight", "vehicle-ferry"] },
  { id: "isle-of-wight-yarmouth", name: "Yarmouth Terminal (Isle of Wight)", displayName: "Isle of Wight – Yarmouth", country: "GB", countryCode: "GB", category: "sea", city: "Yarmouth", timezone: "Europe/London", tags: ["isle-of-wight"] },
  { id: "harwich-port", name: "Harwich International Port", displayName: "Harwich Port", country: "GB", countryCode: "GB", category: "sea", city: "Harwich", timezone: "Europe/London", tags: ["hook-of-holland", "netherlands"] },
  { id: "felixstowe-port", name: "Port of Felixstowe", displayName: "Felixstowe Port", country: "GB", countryCode: "GB", category: "sea", city: "Felixstowe", timezone: "Europe/London", tags: ["cargo-major", "uk-largest-container-port"] },
  { id: "hull-port", name: "Port of Hull (King George Dock)", displayName: "Hull Port", country: "GB", countryCode: "GB", category: "sea", city: "Kingston upon Hull", timezone: "Europe/London", tags: ["rotterdam", "zeebrugge", "netherlands", "belgium"] },
  { id: "liverpool-port", name: "Port of Liverpool", displayName: "Liverpool Port", country: "GB", countryCode: "GB", category: "sea", city: "Liverpool", timezone: "Europe/London", tags: ["ireland", "dublin", "belfast"] },
  { id: "birkenhead-port", name: "Birkenhead Port (12 Quays Terminal)", displayName: "Birkenhead Port", country: "GB", countryCode: "GB", category: "sea", city: "Birkenhead", timezone: "Europe/London", tags: ["ireland", "belfast"] },
  { id: "heysham-port", name: "Port of Heysham", displayName: "Heysham Port", country: "GB", countryCode: "GB", category: "sea", city: "Heysham", timezone: "Europe/London", tags: ["isle-of-man", "belfast", "warrenpoint"] },
  { id: "fleetwood-port", name: "Port of Fleetwood", displayName: "Fleetwood Port", country: "GB", countryCode: "GB", category: "sea", city: "Fleetwood", timezone: "Europe/London", tags: ["limited-service"] },
  { id: "newcastle-tyne-port", name: "Port of Tyne (North Shields / Royal Quays)", displayName: "Newcastle – Port of Tyne", country: "GB", countryCode: "GB", category: "sea", city: "North Shields", timezone: "Europe/London", tags: ["amsterdam-ijmuiden", "netherlands", "dfds"] },
  { id: "bristol-port", name: "Bristol Port (Avonmouth & Royal Portbury Dock)", displayName: "Bristol Port", country: "GB", countryCode: "GB", category: "sea", city: "Bristol", timezone: "Europe/London", tags: ["cargo-heavy", "limited-passenger"] },

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "london-victoria-coach", name: "Victoria Coach Station", displayName: "London Victoria Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "London", timezone: "Europe/London", tags: ["main-national-international-terminal", "flixbus", "eurolines", "national-express"] },
  { id: "canterbury-bus", name: "Canterbury Bus Station", displayName: "Canterbury Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Canterbury", timezone: "Europe/London", tags: ["kent"] },
  { id: "dover-coach", name: "Dover Coach Stop (Priory / Ferry Terminal)", displayName: "Dover Coach Stop", country: "GB", countryCode: "GB", category: "bus", city: "Dover", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "brighton-coach", name: "Brighton (Pool Valley) Coach Station", displayName: "Brighton Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Brighton", timezone: "Europe/London", tags: ["south-coast"] },
  { id: "portsmouth-coach", name: "Portsmouth (The Hard) Coach Station", displayName: "Portsmouth Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Portsmouth", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "oxford-coach", name: "Oxford (Gloucester Green) Coach Station", displayName: "Oxford Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Oxford", timezone: "Europe/London", tags: ["university-city"] },
  { id: "reading-coach", name: "Reading (Friar Street) Coach Stop", displayName: "Reading Coach Stop", country: "GB", countryCode: "GB", category: "bus", city: "Reading", timezone: "Europe/London", tags: ["thames-valley"] },
  { id: "milton-keynes-coachway", name: "Milton Keynes Coachway", displayName: "Milton Keynes Coachway", country: "GB", countryCode: "GB", category: "bus", city: "Milton Keynes", timezone: "Europe/London", tags: ["park-and-ride-style"] },
  { id: "bath-coach", name: "Bath (Dorchester Street) Bus & Coach Station", displayName: "Bath Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Bath", timezone: "Europe/London", tags: ["unesco"] },
  { id: "plymouth-bretonside-bus", name: "Plymouth (Bretonside) Bus Station", displayName: "Plymouth Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Plymouth", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "bournemouth-interchange", name: "Bournemouth Travel Interchange", displayName: "Bournemouth Travel Interchange", country: "GB", countryCode: "GB", category: "bus", city: "Bournemouth", timezone: "Europe/London", tags: ["south-coast"] },
  { id: "cambridge-bus", name: "Cambridge (Parkside / Drummer Street) Bus Station", displayName: "Cambridge Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Cambridge", timezone: "Europe/London", tags: ["university-city"] },
  { id: "norwich-bus", name: "Norwich Bus Station (Surrey Street)", displayName: "Norwich Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Norwich", timezone: "Europe/London", tags: ["east-anglia"] },
  { id: "ipswich-bus", name: "Ipswich Bus Station (Tower Ramparts)", displayName: "Ipswich Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Ipswich", timezone: "Europe/London", tags: ["east-anglia"] },
  { id: "peterborough-bus", name: "Peterborough (Queensgate) Bus Station", displayName: "Peterborough Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Peterborough", timezone: "Europe/London", tags: ["east-midlands"] },
  { id: "birmingham-digbeth-bus", name: "Birmingham Coach Station (Digbeth)", displayName: "Birmingham Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Birmingham", timezone: "Europe/London", tags: ["midlands-hub", "national-express-base"] },
  { id: "coventry-bus", name: "Coventry (Pool Meadow) Bus Station", displayName: "Coventry Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Coventry", timezone: "Europe/London", tags: ["midlands"] },
  { id: "nottingham-broadmarsh-bus", name: "Nottingham (Broadmarsh) Bus Station", displayName: "Nottingham Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Nottingham", timezone: "Europe/London", tags: ["east-midlands"] },
  { id: "derby-bus", name: "Derby Bus Station", displayName: "Derby Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Derby", timezone: "Europe/London", tags: ["east-midlands"] },
  { id: "leicester-bus", name: "Leicester Bus Station", displayName: "Leicester Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Leicester", timezone: "Europe/London", tags: ["east-midlands"] },
  { id: "manchester-shudehill", name: "Manchester (Shudehill) Interchange", displayName: "Manchester Shudehill Interchange", country: "GB", countryCode: "GB", category: "bus", city: "Manchester", timezone: "Europe/London", tags: ["north-england-hub"] },
  { id: "manchester-chorlton-coach", name: "Manchester (Chorlton Street) Coach Station", displayName: "Manchester Chorlton Street Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Manchester", timezone: "Europe/London", tags: ["national-express-base"] },
  { id: "liverpool-one-bus", name: "Liverpool ONE Bus Station / Liverpool Coach Station", displayName: "Liverpool Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Liverpool", timezone: "Europe/London", tags: ["northwest-england"] },
  { id: "preston-bus", name: "Preston Bus Station", displayName: "Preston Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Preston", timezone: "Europe/London", tags: ["brutalist-landmark"] },
  { id: "chester-bus", name: "Chester Bus Exchange", displayName: "Chester Bus Exchange", country: "GB", countryCode: "GB", category: "bus", city: "Chester", timezone: "Europe/London", tags: ["wales-border"] },
  { id: "carlisle-bus", name: "Carlisle Bus Station", displayName: "Carlisle Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Carlisle", timezone: "Europe/London", tags: ["scotland-border-area"] },
  { id: "newcastle-eldon-square-bus", name: "Newcastle upon Tyne (Eldon Square) Bus Station", displayName: "Newcastle Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Newcastle upon Tyne", timezone: "Europe/London", tags: ["northeast-hub"] },
  { id: "leeds-bus", name: "Leeds Bus Station", displayName: "Leeds Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Leeds", timezone: "Europe/London", tags: ["yorkshire-hub"] },
  { id: "sheffield-interchange", name: "Sheffield Interchange", displayName: "Sheffield Interchange", country: "GB", countryCode: "GB", category: "bus", city: "Sheffield", timezone: "Europe/London", tags: ["yorkshire"] },
  { id: "york-bus", name: "York Bus Station (Rougier Street)", displayName: "York Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "York", timezone: "Europe/London", tags: ["tourism-heavy"] },
  { id: "hull-paragon-bus", name: "Hull (Paragon) Interchange", displayName: "Hull Interchange", country: "GB", countryCode: "GB", category: "bus", city: "Kingston upon Hull", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "bradford-interchange-bus", name: "Bradford Interchange", displayName: "Bradford Interchange", country: "GB", countryCode: "GB", category: "bus", city: "Bradford", timezone: "Europe/London", tags: ["yorkshire"] },
  { id: "doncaster-frenchgate-bus", name: "Doncaster (Frenchgate) Interchange", displayName: "Doncaster Interchange", country: "GB", countryCode: "GB", category: "bus", city: "Doncaster", timezone: "Europe/London", tags: ["yorkshire"] },
  { id: "cardiff-coach", name: "Cardiff (Sophia Gardens) Coach Station", displayName: "Cardiff Coach Station", country: "GB", countryCode: "GB", category: "bus", city: "Cardiff", timezone: "Europe/London", tags: ["wales-capital"] },
  { id: "swansea-bus", name: "Swansea Bus Station", displayName: "Swansea Bus Station", country: "GB", countryCode: "GB", category: "bus", city: "Swansea", timezone: "Europe/London", tags: ["wales"] },

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------

  { id: "london-st-pancras-rail", name: "London St Pancras International", displayName: "London St Pancras International", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["eurostar", "paris", "brussels", "amsterdam", "international-hub"] },
  { id: "london-kings-cross-rail", name: "London King's Cross", displayName: "London King's Cross", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["east-coast-mainline", "edinburgh"] },
  { id: "london-euston-rail", name: "London Euston", displayName: "London Euston", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["west-coast-mainline", "north-wales", "scotland"] },
  { id: "london-paddington-rail", name: "London Paddington", displayName: "London Paddington", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["heathrow-express", "west-of-england", "south-wales"] },
  { id: "london-victoria-rail", name: "London Victoria", displayName: "London Victoria", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["gatwick-express", "south-east-england"] },
  { id: "london-liverpool-street-rail", name: "London Liverpool Street", displayName: "London Liverpool Street", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["east-anglia", "stansted-express"] },
  { id: "london-fenchurch-street-rail", name: "London Fenchurch Street", displayName: "London Fenchurch Street", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["essex-commuter"] },
  { id: "london-bridge-rail", name: "London Bridge / Cannon Street / Charing Cross", displayName: "London Bridge Station Group", country: "GB", countryCode: "GB", category: "rail", city: "London", timezone: "Europe/London", tags: ["south-east-england"] },
  { id: "reading-rail", name: "Reading Station", displayName: "Reading Station", country: "GB", countryCode: "GB", category: "rail", city: "Reading", timezone: "Europe/London", tags: ["major-interchange", "gwr", "crossrail"] },
  { id: "ashford-international-rail", name: "Ashford International", displayName: "Ashford International", country: "GB", countryCode: "GB", category: "rail", city: "Ashford", timezone: "Europe/London", tags: ["kent", "former-eurostar-stop"] },
  { id: "dover-priory-rail", name: "Dover Priory", displayName: "Dover Priory Station", country: "GB", countryCode: "GB", category: "rail", city: "Dover", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "brighton-rail", name: "Brighton Station", displayName: "Brighton Station", country: "GB", countryCode: "GB", category: "rail", city: "Brighton", timezone: "Europe/London", tags: ["south-coast"] },
  { id: "southampton-central-rail", name: "Southampton Central", displayName: "Southampton Central", country: "GB", countryCode: "GB", category: "rail", city: "Southampton", timezone: "Europe/London", tags: ["cruise-port-link"] },
  { id: "portsmouth-harbour-rail", name: "Portsmouth & Southsea / Portsmouth Harbour", displayName: "Portsmouth Harbour Station", country: "GB", countryCode: "GB", category: "rail", city: "Portsmouth", timezone: "Europe/London", tags: ["ferry-connection", "isle-of-wight"] },
  { id: "gatwick-airport-rail", name: "Gatwick Airport Station", displayName: "Gatwick Airport Station", country: "GB", countryCode: "GB", category: "rail", city: "Crawley", timezone: "Europe/London", tags: ["airport-link", "gatwick-express"] },
  { id: "canterbury-rail", name: "Canterbury West / East", displayName: "Canterbury Stations", country: "GB", countryCode: "GB", category: "rail", city: "Canterbury", timezone: "Europe/London", tags: ["unesco", "high-speed-link"] },
  { id: "bristol-temple-meads-rail", name: "Bristol Temple Meads", displayName: "Bristol Temple Meads", country: "GB", countryCode: "GB", category: "rail", city: "Bristol", timezone: "Europe/London", tags: ["southwest-hub"] },
  { id: "bath-spa-rail", name: "Bath Spa Station", displayName: "Bath Spa Station", country: "GB", countryCode: "GB", category: "rail", city: "Bath", timezone: "Europe/London", tags: ["unesco", "tourism-heavy"] },
  { id: "exeter-st-davids-rail", name: "Exeter St Davids", displayName: "Exeter St Davids", country: "GB", countryCode: "GB", category: "rail", city: "Exeter", timezone: "Europe/London", tags: ["southwest-junction"] },
  { id: "plymouth-rail", name: "Plymouth Station", displayName: "Plymouth Station", country: "GB", countryCode: "GB", category: "rail", city: "Plymouth", timezone: "Europe/London", tags: ["ferry-connection", "night-riviera-terminus"] },
  { id: "penzance-rail", name: "Penzance Station", displayName: "Penzance Station", country: "GB", countryCode: "GB", category: "rail", city: "Penzance", timezone: "Europe/London", tags: ["westernmost-station", "night-riviera-sleeper", "scilly-isles-ferry"] },
  { id: "taunton-rail", name: "Taunton Station", displayName: "Taunton Station", country: "GB", countryCode: "GB", category: "rail", city: "Taunton", timezone: "Europe/London", tags: ["southwest"] },
  { id: "salisbury-rail", name: "Salisbury Station", displayName: "Salisbury Station", country: "GB", countryCode: "GB", category: "rail", city: "Salisbury", timezone: "Europe/London", tags: ["stonehenge-access"] },
  { id: "swindon-rail", name: "Swindon Station", displayName: "Swindon Station", country: "GB", countryCode: "GB", category: "rail", city: "Swindon", timezone: "Europe/London", tags: ["gwr-junction"] },
  { id: "weymouth-rail", name: "Weymouth Station", displayName: "Weymouth Station", country: "GB", countryCode: "GB", category: "rail", city: "Weymouth", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "birmingham-new-street-rail", name: "Birmingham New Street", displayName: "Birmingham New Street", country: "GB", countryCode: "GB", category: "rail", city: "Birmingham", timezone: "Europe/London", tags: ["major-hub", "west-coast-mainline"] },
  { id: "birmingham-moor-street-rail", name: "Birmingham Moor Street", displayName: "Birmingham Moor Street", country: "GB", countryCode: "GB", category: "rail", city: "Birmingham", timezone: "Europe/London", tags: ["heritage-station"] },
  { id: "birmingham-snow-hill-rail", name: "Birmingham Snow Hill", displayName: "Birmingham Snow Hill", country: "GB", countryCode: "GB", category: "rail", city: "Birmingham", timezone: "Europe/London", tags: ["chiltern-railways"] },
  { id: "coventry-rail", name: "Coventry Station", displayName: "Coventry Station", country: "GB", countryCode: "GB", category: "rail", city: "Coventry", timezone: "Europe/London", tags: ["west-coast-mainline"] },
  { id: "leicester-rail", name: "Leicester Station", displayName: "Leicester Station", country: "GB", countryCode: "GB", category: "rail", city: "Leicester", timezone: "Europe/London", tags: ["midland-mainline"] },
  { id: "derby-rail", name: "Derby Station", displayName: "Derby Station", country: "GB", countryCode: "GB", category: "rail", city: "Derby", timezone: "Europe/London", tags: ["east-midlands-junction"] },
  { id: "wolverhampton-rail", name: "Wolverhampton Station", displayName: "Wolverhampton Station", country: "GB", countryCode: "GB", category: "rail", city: "Wolverhampton", timezone: "Europe/London", tags: ["west-coast-mainline"] },
  { id: "stoke-on-trent-rail", name: "Stoke-on-Trent Station", displayName: "Stoke-on-Trent Station", country: "GB", countryCode: "GB", category: "rail", city: "Stoke-on-Trent", timezone: "Europe/London", tags: ["potteries"] },
  { id: "crewe-rail", name: "Crewe Station", displayName: "Crewe Station", country: "GB", countryCode: "GB", category: "rail", city: "Crewe", timezone: "Europe/London", tags: ["major-railway-junction"] },
  { id: "manchester-piccadilly-rail", name: "Manchester Piccadilly", displayName: "Manchester Piccadilly", country: "GB", countryCode: "GB", category: "rail", city: "Manchester", timezone: "Europe/London", tags: ["major-hub", "north-england"] },
  { id: "manchester-victoria-rail", name: "Manchester Victoria", displayName: "Manchester Victoria", country: "GB", countryCode: "GB", category: "rail", city: "Manchester", timezone: "Europe/London", tags: ["secondary-station"] },
  { id: "manchester-airport-rail", name: "Manchester Airport Station", displayName: "Manchester Airport Station", country: "GB", countryCode: "GB", category: "rail", city: "Manchester", timezone: "Europe/London", tags: ["airport-link"] },
  { id: "preston-rail", name: "Preston Station", displayName: "Preston Station", country: "GB", countryCode: "GB", category: "rail", city: "Preston", timezone: "Europe/London", tags: ["west-coast-mainline-junction"] },
  { id: "lancaster-rail", name: "Lancaster Station", displayName: "Lancaster Station", country: "GB", countryCode: "GB", category: "rail", city: "Lancaster", timezone: "Europe/London", tags: ["west-coast-mainline"] },
  { id: "blackpool-north-rail", name: "Blackpool North", displayName: "Blackpool North Station", country: "GB", countryCode: "GB", category: "rail", city: "Blackpool", timezone: "Europe/London", tags: ["seaside-resort"] },
  { id: "chester-rail", name: "Chester Station", displayName: "Chester Station", country: "GB", countryCode: "GB", category: "rail", city: "Chester", timezone: "Europe/London", tags: ["wales-border"] },
  { id: "warrington-bank-quay-rail", name: "Warrington Bank Quay", displayName: "Warrington Bank Quay", country: "GB", countryCode: "GB", category: "rail", city: "Warrington", timezone: "Europe/London", tags: ["west-coast-mainline"] },
  { id: "wigan-north-western-rail", name: "Wigan North Western", displayName: "Wigan North Western", country: "GB", countryCode: "GB", category: "rail", city: "Wigan", timezone: "Europe/London", tags: ["west-coast-mainline"] },
  { id: "carlisle-rail", name: "Carlisle Station", displayName: "Carlisle Station", country: "GB", countryCode: "GB", category: "rail", city: "Carlisle", timezone: "Europe/London", tags: ["scotland-border", "settle-carlisle-line"] },
  { id: "leeds-rail", name: "Leeds Station", displayName: "Leeds Station", country: "GB", countryCode: "GB", category: "rail", city: "Leeds", timezone: "Europe/London", tags: ["yorkshire-major-hub"] },
  { id: "sheffield-rail", name: "Sheffield Station", displayName: "Sheffield Station", country: "GB", countryCode: "GB", category: "rail", city: "Sheffield", timezone: "Europe/London", tags: ["midland-mainline"] },
  { id: "york-rail", name: "York Station", displayName: "York Station", country: "GB", countryCode: "GB", category: "rail", city: "York", timezone: "Europe/London", tags: ["east-coast-mainline", "tourism-heavy"] },
  { id: "newcastle-central-rail", name: "Newcastle Central Station", displayName: "Newcastle Central Station", country: "GB", countryCode: "GB", category: "rail", city: "Newcastle upon Tyne", timezone: "Europe/London", tags: ["east-coast-mainline", "scotland-fastest-link"] },
  { id: "darlington-rail", name: "Darlington Station", displayName: "Darlington Station", country: "GB", countryCode: "GB", category: "rail", city: "Darlington", timezone: "Europe/London", tags: ["railway-birthplace"] },
  { id: "durham-rail", name: "Durham Station", displayName: "Durham Station", country: "GB", countryCode: "GB", category: "rail", city: "Durham", timezone: "Europe/London", tags: ["unesco-cathedral"] },
  { id: "doncaster-rail", name: "Doncaster Station", displayName: "Doncaster Station", country: "GB", countryCode: "GB", category: "rail", city: "Doncaster", timezone: "Europe/London", tags: ["east-coast-mainline-junction"] },
  { id: "wakefield-westgate-rail", name: "Wakefield Westgate", displayName: "Wakefield Westgate", country: "GB", countryCode: "GB", category: "rail", city: "Wakefield", timezone: "Europe/London", tags: ["yorkshire"] },
  { id: "huddersfield-rail", name: "Huddersfield Station", displayName: "Huddersfield Station", country: "GB", countryCode: "GB", category: "rail", city: "Huddersfield", timezone: "Europe/London", tags: ["yorkshire"] },
  { id: "bradford-interchange-rail", name: "Bradford Interchange (Rail)", displayName: "Bradford Interchange Rail Station", country: "GB", countryCode: "GB", category: "rail", city: "Bradford", timezone: "Europe/London", tags: ["yorkshire"] },
  { id: "hull-paragon-rail", name: "Hull Paragon Interchange", displayName: "Hull Paragon Interchange", country: "GB", countryCode: "GB", category: "rail", city: "Kingston upon Hull", timezone: "Europe/London", tags: ["ferry-connection"] },
  { id: "scarborough-rail", name: "Scarborough Station", displayName: "Scarborough Station", country: "GB", countryCode: "GB", category: "rail", city: "Scarborough", timezone: "Europe/London", tags: ["seaside-resort"] },
  { id: "middlesbrough-rail", name: "Middlesbrough Station", displayName: "Middlesbrough Station", country: "GB", countryCode: "GB", category: "rail", city: "Middlesbrough", timezone: "Europe/London", tags: ["northeast-england"] },
  { id: "sunderland-rail", name: "Sunderland Station", displayName: "Sunderland Station", country: "GB", countryCode: "GB", category: "rail", city: "Sunderland", timezone: "Europe/London", tags: ["northeast-england"] },
  { id: "liverpool-lime-street-rail", name: "Liverpool Lime Street", displayName: "Liverpool Lime Street", country: "GB", countryCode: "GB", category: "rail", city: "Liverpool", timezone: "Europe/London", tags: ["major-hub", "longest-direct-uk-route-norwich"] },
  { id: "cambridge-rail", name: "Cambridge Station", displayName: "Cambridge Station", country: "GB", countryCode: "GB", category: "rail", city: "Cambridge", timezone: "Europe/London", tags: ["university-city"] },
  { id: "peterborough-rail", name: "Peterborough Station", displayName: "Peterborough Station", country: "GB", countryCode: "GB", category: "rail", city: "Peterborough", timezone: "Europe/London", tags: ["east-coast-mainline"] },
  { id: "ipswich-rail", name: "Ipswich Station", displayName: "Ipswich Station", country: "GB", countryCode: "GB", category: "rail", city: "Ipswich", timezone: "Europe/London", tags: ["east-anglia"] },
  { id: "colchester-rail", name: "Colchester Station", displayName: "Colchester Station", country: "GB", countryCode: "GB", category: "rail", city: "Colchester", timezone: "Europe/London", tags: ["east-anglia"] },
  { id: "norwich-rail", name: "Norwich Station", displayName: "Norwich Station", country: "GB", countryCode: "GB", category: "rail", city: "Norwich", timezone: "Europe/London", tags: ["east-anglia-terminus"] },
  { id: "luton-airport-parkway-rail", name: "Luton Airport Parkway", displayName: "Luton Airport Parkway", country: "GB", countryCode: "GB", category: "rail", city: "Luton", timezone: "Europe/London", tags: ["airport-link"] },
  { id: "oxenholme-lake-district-rail", name: "Oxenholme Lake District", displayName: "Oxenholme Lake District Station", country: "GB", countryCode: "GB", category: "rail", city: "Oxenholme", timezone: "Europe/London", tags: ["lake-district-gateway"] },
  { id: "penrith-north-lakes-rail", name: "Penrith North Lakes", displayName: "Penrith North Lakes Station", country: "GB", countryCode: "GB", category: "rail", city: "Penrith", timezone: "Europe/London", tags: ["lake-district-gateway"] },

// ============================================================
// TOPLAM: 21 air + 21 sea + 35 bus + 65 rail = 142 kayıt
// Notlar:
// - Bu, PDF'teki ~243 terminalin İngiltere ağırlıklı, hub seviyesindeki
//   büyük bir kısmı — küçük kasaba otogarları (ör. Truro, Barnstaple,
//   Yeovil, King's Lynn, Bury St Edmunds gibi onlarca küçük durak)
//   ve bazı genel havacılık alanları (Cambridge, Oxford, Biggin Hill,
//   Farnborough, Cranfield) kapsam dışı bırakıldı.
// - İskoçya, Galler'in çoğu ve Kuzey İrlanda kaynak PDF'te zaten
//   kapsam dışı (sadece birkaç Galler otogarı istisna); ayrı ülke
//   kodlarıyla (bir gün eklenirse) işlenmesi gerekir.
// - Eurostar bağlantısı artık sadece St Pancras'tan çalışıyor;
//   Ashford International tarihsel not olarak "former-eurostar-stop"
//   etiketiyle işaretlendi.
// - Daha fazla küçük şehir/kasaba eklenmesi istenirse PDF'te hâlâ çok
//   veri var — hangi bölge/kategoriye öncelik vermek istediğini
//   söylemen yeterli.
// ============================================================
