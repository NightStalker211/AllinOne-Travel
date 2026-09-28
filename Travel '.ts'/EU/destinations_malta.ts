// ============================================================
// FreeBuff Travel — Malta (MT) destination entries
// Converted from: TravelApp_Malta.pdf
// NOTE: Island state (316 km²). Single airport, no railway.
// Sea = lifeline (international ferry + Gozo channel).
// Bus = entire public transport network (single operator).
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------

  { id: "mla", name: "Malta International Airport (Luqa / Gudja)", displayName: "Malta (MLA)", country: "MT", countryCode: "MT", category: "air", city: "Luqa", region: "Gudja", iata: "MLA", timezone: "Europe/Malta", tags: ["major-hub", "only-airport", "km-malta-airlines", "ryanair", "wizz-air", "easyjet", "schengen", "tourism-heavy", "8-9m-passengers"] },

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------
// (Yok — Malta Railway 1883-1931 arasında çalıştı, 1931'de otobüs
//  rekabetiyle kapandı (Valletta–Mdina ~11,6 km). Geriye tünel ve
//  eski istasyon binaları kaldı (Mdina istasyonu restoran/müze).
//  Metro/hafif raylı projesi 2020'lerde tartışılıyor, inşaat yok.)

// ---------- Paste into FERRY_PORTS (category: "sea") ----------

  { id: "valletta-cruise-port", name: "Valletta Cruise Port (Grand Harbour)", displayName: "Valletta Cruise Port", country: "MT", countryCode: "MT", category: "sea", city: "Valletta", region: "Grand Harbour", timezone: "Europe/Malta", tags: ["primary-cruise-port", "pozallo-italy", "catania-italy", "virtu-ferries", "unesco", "mediterranean-cruise-hub", "year-round"] },
  { id: "cirkewwa-terminal", name: "Ċirkewwa Ferry Terminal (Malta)", displayName: "Ċirkewwa Terminal", country: "MT", countryCode: "MT", category: "sea", city: "Mellieħa", region: "Ċirkewwa", timezone: "Europe/Malta", tags: ["gozo-ferry", "gozo-channel-line", "vehicle-ferry", "30-45min-frequency", "year-round", "comino-boats"] },
  { id: "mgarr-gozo-terminal", name: "Mġarr Ferry Terminal (Gozo)", displayName: "Mġarr (Gozo) Terminal", country: "MT", countryCode: "MT", category: "sea", city: "Mġarr", region: "Gozo", timezone: "Europe/Malta", tags: ["gozo-ferry", "gozo-channel-line", "vehicle-ferry", "modern-terminal", "year-round", "comino-blue-lagoon"] },
  { id: "valletta-gozo-fast-ferry", name: "Valletta–Gozo Fast Ferry", displayName: "Valletta-Gozo Fast Ferry", country: "MT", countryCode: "MT", category: "sea", city: "Valletta", timezone: "Europe/Malta", tags: ["fast-ferry", "passenger-only", "45min", "since-2021", "gozo-fast-ferry", "seasonal-reduced-winter"] },

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "valletta-bus-terminus", name: "Valletta Bus Terminus (Floriana)", displayName: "Valletta Bus Terminus", country: "MT", countryCode: "MT", category: "bus", city: "Valletta", region: "Floriana", timezone: "Europe/Malta", tags: ["main-terminal", "malta-public-transport", "tallinja", "50-plus-routes", "airport-x4-71", "cirkewwa-gozo", "modern-2015"] },
  { id: "victoria-gozo-bus", name: "Victoria (Rabat) Bus Terminal – Gozo", displayName: "Victoria Bus Terminal", country: "MT", countryCode: "MT", category: "bus", city: "Victoria", region: "Gozo", timezone: "Europe/Malta", tags: ["gozo-main-terminal", "malta-public-transport", "marr-ferry-link", "15-plus-routes", "xewkija", "marsalforn", "xlendi"] },
  { id: "sliema-ferries-bus", name: "Sliema Ferries Bus Terminus", displayName: "Sliema Ferries Bus Stop", country: "MT", countryCode: "MT", category: "bus", city: "Sliema", timezone: "Europe/Malta", tags: ["north-hub", "interchange", "valletta-ferry-taxi", "tourism"] },
  { id: "bugibba-bus", name: "Buġibba Bus Terminus (St Paul's Bay)", displayName: "Buġibba Bus Terminus", country: "MT", countryCode: "MT", category: "bus", city: "St Paul's Bay", timezone: "Europe/Malta", tags: ["north-tourism-hub", "interchange", "qawra", "hotel-district"] },

// ============================================================
// TOPLAM: 1 air + 0 rail + 4 sea + 4 bus = 9 kayıt
// Notlar:
// - Malta'nın tek sivil havalimanı MLA'dır; tüm yolcu trafiği
//   buradan geçer (~8,5 milyon yolcu, 2007'den beri Schengen).
// - Bayrak taşıyıcı 2023 sonunda Air Malta'dan KM Malta Airlines'a
//   dönüştü; Ryanair en yüksek hacimli operatördür.
// - Gozo'ya ulaşım birincil yolu Ċirkewwa feribotudur (araç+yaya,
//   her 30-45 dk); Valletta-Gozo hızlı feribotu yaya alternatifidir.
// - Marsaxlokk Malta Freeport konteyner limanıdır, düzenli yolcu
//   terminali olmadığı için kayda alınmadı (PDF de kapsam dışı bıraktı).
// - Gozo adasına doğrudan havayolu bağlantısı yoktur.
// - Malta'da resmi "şehirlerarası otobüs" kavramı yoktur; tüm ağ
//   tek operatör (Malta Public Transport / Tallinja) çatısı altındadır.
// - Uluslararası otobüs bağlantısı yoktur (ada ülkesi); en yakın
//   kara bağlantısı İtalya'ya feribotla sağlanır.
// - Adalar arası Comino tekneleri yerel tekne servisi sayıldı,
//   Ċirkewwa ve Mġarr tag'lerinde belirtildi.
// ============================================================
