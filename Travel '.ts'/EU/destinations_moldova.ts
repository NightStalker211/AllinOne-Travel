// ============================================================
// FreeBuff Travel — Moldova (MD) destination entries
// Converted from: TravelApp_Moldova.pdf
// NOTE: Landlocked (only ~430m of Danube access at Giurgiuleti,
// cargo port only). One active airport. Bus/minibüs = backbone.
// Rail = Soviet-era 1520mm, diesel, slow; UA/RU links suspended
// since 2022.
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------

  { id: "kiv", name: "Chișinău International Airport", displayName: "Chișinău (KIV)", country: "MD", countryCode: "MD", category: "air", city: "Chișinău", iata: "KIV", timezone: "Europe/Chisinau", tags: ["major-hub", "only-active-airport", "avia-invest-tav", "flyone", "hisky", "wizz-air", "turkish-airlines", "pegasus", "tarom", "2-7-3m-passengers", "duty-free-hub", "russia-ukraine-flights-suspended"] },
  { id: "bzy-info", name: "Bălți International Airport (Marshaveni)", displayName: "Bălți (BZY)", country: "MD", countryCode: "MD", category: "air", city: "Bălți", iata: "BZY", timezone: "Europe/Chisinau", tags: ["not-operational", "international-status", "no-regular-flights", "former-soviet", "revival-plans", "second-city"] },
  { id: "cah-info", name: "Cahul Airport (planned)", displayName: "Cahul Airport (CAH)", country: "MD", countryCode: "MD", category: "air", city: "Cahul", iata: "CAH", timezone: "Europe/Chisinau", tags: ["not-operational", "project-stage", "romania-border", "small-airfield"] },
  { id: "mrc-info", name: "Mărculeți Air Base (civil potential)", displayName: "Mărculeți Airfield", country: "MD", countryCode: "MD", category: "air", city: "Mărculești", iata: "MRC", timezone: "Europe/Chisinau", tags: ["not-operational", "former-military", "cargo-potential", "no-passenger-terminal"] },

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------

  { id: "chisinau-rail", name: "Chișinău Railway Station (Gara Chișinău)", displayName: "Chișinău Station", country: "MD", countryCode: "MD", category: "rail", city: "Chișinău", timezone: "Europe/Chisinau", tags: ["cfm", "main-hub", "ungheni-romania-line", "belt-city-center", "monumental-soviet-building"] },
  { id: "ungheni-rail", name: "Ungheni Railway Station", displayName: "Ungheni Station", country: "MD", countryCode: "MD", category: "rail", city: "Ungheni", timezone: "Europe/Chisinau", tags: ["romania-border", "international-gate", "gauge-change-1520-1435", "iasi-connection", "eu-modernization"] },
  { id: "bialtsi-rail", name: "Bălți Railway Station", displayName: "Bălți Station", country: "MD", countryCode: "MD", category: "rail", city: "Bălți", timezone: "Europe/Chisinau", tags: ["north-hub", "sparse-trains", "chisinau-line"] },
  { id: "ocnita-rail", name: "Ocnița Railway Station", displayName: "Ocnița Station", country: "MD", countryCode: "MD", category: "rail", city: "Ocnița", timezone: "Europe/Chisinau", tags: ["north-border", "ukraine-suspended", "former-moscow-entry"] },
  { id: "bender-rail", name: "Bender / Tighina Railway Station", displayName: "Bender Station", country: "MD", countryCode: "MD", category: "rail", city: "Bender", timezone: "Europe/Chisinau", tags: ["transnistria-area", "junction", "chisinau-southeast", "border-checkpoint"] },
  { id: "tiraspol-rail", name: "Tiraspol Railway Station", displayName: "Tiraspol Station", country: "MD", countryCode: "MD", category: "rail", city: "Tiraspol", region: "Transnistria", timezone: "Europe/Chisinau", tags: ["transnistria-de-facto-control", "odessa-line-suspended", "recognitions-disputed", "checkpoints"] },
  { id: "basarabeasca-rail", name: "Basarabeasca Railway Station", displayName: "Basarabeasca Station", country: "MD", countryCode: "MD", category: "rail", city: "Basarabeasca", timezone: "Europe/Chisinau", tags: ["south-junction", "low-traffic", "former-galati-line-inactive"] },
  { id: "ribnita-rail", name: "Rîbnița Railway Station", displayName: "Rîbnița Station", country: "MD", countryCode: "MD", category: "rail", city: "Rîbnița", region: "Transnistria", timezone: "Europe/Chisinau", tags: ["transnistria", "steel-industry", "sparse-trains", "dnestr-bank"] },
  { id: "storzheny-rail", name: "Stolârceni / Revaca stop (Chișinău–Basarabeasca)", displayName: "Revaca Stop", country: "MD", countryCode: "MD", category: "rail", city: "Chișinău", timezone: "Europe/Chisinau", tags: ["commuter", "south-line", "chișinău-suburb"] },
  { id: "cahul-rail", name: "Cahul Railway Station", displayName: "Cahul Station", country: "MD", countryCode: "MD", category: "rail", city: "Cahul", timezone: "Europe/Chisinau", tags: ["south-line", "very-rare-trains", "weekly-seasonal", "romania-border-area"] },

// ---------- Paste into FERRY_PORTS (category: "sea") ----------

  { id: "giurgiuleti-port", name: "Giurgiulesti International Free Port (Danube)", displayName: "Giurgiulești Port", country: "MD", countryCode: "MD", category: "sea", city: "Giurgiulești", region: "Cahul", timezone: "Europe/Chisinau", tags: ["cargo-only", "danube-river", "no-passenger-service", "oil-terminal", "grain-terminal", "moldova-danube-access", "strategic", "ebird-supported"] },

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "chisinau-central-bus", name: "Autogara Centrală Chișinău (Merkez Otogar)", displayName: "Chișinău Central Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Chișinău", timezone: "Europe/Chisinau", tags: ["main-hub", "international", "bucharest", "iasi", "istanbul", "munich", "rome", "paris", "madrid", "warsaw", "vienna", "flixbus", "eurolines", "ecolines", "atlassib", "autolux", "autogara-md", "diaspora-critical"] },
  { id: "chisinau-sud-bus", name: "Autogara Sud Chișinău (Güney Otogar)", displayName: "Chișinău South Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Chișinău", timezone: "Europe/Chisinau", tags: ["south-direction", "cahul", "comrat", "giaurgiuleti", "bucharest", "gagauzia-routes"] },
  { id: "chisinau-nord-bus", name: "Autogara Nord Chișinău (Kuzey Otogar)", displayName: "Chișinău North Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Chișinău", timezone: "Europe/Chisinau", tags: ["north-direction", "balti", "soroca", "edinet", "suceava-romania", "ukraine-limited-suspended"] },
  { id: "chisinau-vest-bus", name: "Autogara de Vest / Piața Veche Chișinău", displayName: "Chișinău West Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Chișinău", timezone: "Europe/Chisinau", tags: ["west-direction", "ungheni", "iasi-minibuses", "smaller-scale"] },
  { id: "bialtsi-bus", name: "Autogara Bălți", displayName: "Bălți Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Bălți", timezone: "Europe/Chisinau", tags: ["north-moldova-hub", "second-city", "iasi", "suceava", "chisinau-frequent"] },
  { id: "cahul-bus", name: "Autogara Cahul", displayName: "Cahul Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Cahul", timezone: "Europe/Chisinau", tags: ["south-hub", "galati", "bucharest", "giurgiuleti-crossing", "romania-border"] },
  { id: "comrat-bus", name: "Autogara Comrat", displayName: "Comrat Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Comrat", timezone: "Europe/Chisinau", tags: ["gagauzia-capital", "istanbul-turkey-link", "gagauz-diaspora", "chisinau-frequent"] },
  { id: "ungheni-bus", name: "Autogara Ungheni", displayName: "Ungheni Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Ungheni", timezone: "Europe/Chisinau", tags: ["west-border", "iasi-frequent-minibuses", "prut-crossing", "most-active-crossing"] },
  { id: "soroca-bus", name: "Autogara Soroca", displayName: "Soroca Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Soroca", timezone: "Europe/Chisinau", tags: ["north-east", "dnestr-bank", "ukraine-border-limited"] },
  { id: "edinet-bus", name: "Autogara Edineț", displayName: "Edineț Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Edineț", timezone: "Europe/Chisinau", tags: ["north", "romania-suceava-limited"] },
  { id: "orhei-bus", name: "Autogara Orhei", displayName: "Orhei Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Orhei", timezone: "Europe/Chisinau", tags: ["central", "chisinau-frequent", "orheiul-veci-unesco-nearby", "tourism"] },
  { id: "hincesti-bus", name: "Autogara Hîncești", displayName: "Hîncești Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Hîncești", timezone: "Europe/Chisinau", tags: ["south-west", "regional"] },
  { id: "drochia-bus", name: "Autogara Drochia", displayName: "Drochia Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Drochia", timezone: "Europe/Chisinau", tags: ["north", "regional"] },
  { id: "cneni-bus", name: "Autogara Cimișli", displayName: "Cimișli Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Cimișli", timezone: "Europe/Chisinau", tags: ["south-east", "transnistria-adjacent"] },
  { id: "floresti-bus", name: "Autogara Florești", displayName: "Florești Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Florești", timezone: "Europe/Chisinau", tags: ["north-central", "regional"] },
  { id: "tiraspol-bus", name: "Tiraspol Bus Station (Transnistria)", displayName: "Tiraspol Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Tiraspol", region: "Transnistria", timezone: "Europe/Chisinau", tags: ["transnistria-de-facto", "chisinau", "bender", "odesa-suspended", "operated-locally"] },
  { id: "bender-bus", name: "Bender / Tighina Bus Station (Transnistria)", displayName: "Bender Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Bender", timezone: "Europe/Chisinau", tags: ["transnistria-area", "chisinau", "tiraspol", "cimeni"] },
  { id: "ribnita-bus", name: "Rîbnița Bus Station (Transnistria)", displayName: "Rîbnița Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Rîbnița", region: "Transnistria", timezone: "Europe/Chisinau", tags: ["transnistria", "tiraspol", "chisinau-rare", "dnestr-bank"] },
  { id: "vulcanesti-bus", name: "Autogara Vulcănești", displayName: "Vulcănești Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Vulcănești", timezone: "Europe/Chisinau", tags: ["southernmost", "gagauzia", "giaurgiuleti-romania-via"] },
  { id: "taraclia-bus", name: "Autogara Taraclia", displayName: "Taraclia Bus Station", country: "MD", countryCode: "MD", category: "bus", city: "Taraclia", timezone: "Europe/Chisinau", tags: ["south-east", "bulgarian-minority", "bulgaria-diaspora-links"] },

// ============================================================
// TOPLAM: 4 air + 10 rail + 1 sea + 20 bus = 35 kayıt
// Notlar:
// - FIİLEN AKTİF tek sivil yolcu havalimanı Chișinău (KIV)'dir.
//   Bălți (BZY), Cahul (CAH) ve Mărculeti kayıtları "not-operational"
//   tag'iyle durum bilgisi olarak eklendi — planlama/potansiyel.
// - Transdinyester'deki tesisler uluslararası sivil havacılıkta
//   TANINMADIĞI için havalimanı olarak eklenmedi (havaalanı yok).
// - Landlocked: Yolcu feribotu/kruvaziyer YOK. Giurgiulești sadece
//   kargo limanıdır (Moldova'nın Tuna'ya ~430 m erişimi) — "cargo-
//   only, no-passenger-service" tag'iyle eklendi.
// - Demiryolu: ~1.150 km, 1520 mm geniş hat, tamamına yakını dizel,
//   ortalama 40-60 km/s, yüksek hızlı tren YOK (CFM işletir).
// - EN ÖNEMLİ uluslararası hat: Chișinău-Ungheni-Iași (RO), günde
//   1-2 sefer, ~8-10 saat; Ungheni'de 1520→1435 mm geçiş olabilir.
// - Ukrayna (Odessa/Kyiv), Rusya (Moskova) trenleri 2022'den beri
//   ASKİYA ALINMIŞ; gece trenleri durdu.
// - Bender, Tiraspol, Rîbnița istasyon/otogarları fiilen
//   Transdinyester otoritelerince işletilir; Moldova bunları kendi
//   toprağı olarak tanır — "transnistria" tag'leriyle belirtildi.
// - Otobüs baskın mod: her rayon merkezinde terminal var (~20+),
//   minibüs (rutier) sistemi çok yaygın.
// - Diaspora hatları (İtalya, Romanya, Almanya, Fransa, İspanya,
//   Türkiye) kritik önemde; platform: autogara.md.
// - Rusya/Belarus otobüs hatları 2022+ ASKIYA ALINMIŞ.
// - Küçük rayon durakları (Rezina, Telenești, Ialoveni vb. ~20
//   kasaba) hub seviyesi dışında bırakıldı — gerektiğinde eklenir.
// ============================================================
