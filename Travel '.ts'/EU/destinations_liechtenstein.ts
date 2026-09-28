// ============================================================
// FreeBuff Travel — Liechtenstein (LI) destination entries
// Converted from: TravelApp_Liechtenstein.pdf
// NOTE: Landlocked microstate (160 km²) between Switzerland and
// Austria. No civil airport, no seaport. Bus = national backbone
// (LIEmobil), rail = single ÖBB line with 3 stations.
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------
// (Yok — sivil yolcu havalimanı yok. Balzers yakın küçük heliport
//  kategoriye girmez. En yakınlar: ZRH ~115 km, ACH ~50 km,
//  FDH ~85 km, INN ~150 km, FMM ~130 km — İsviçre/AL/AT kayıtlarında.)

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------

  { id: "schaan-vaduz-rail", name: "Schaan-Vaduz Bahnhof", displayName: "Schaan-Vaduz Station", country: "LI", countryCode: "LI", category: "rail", city: "Schaan", region: "Vaduz", timezone: "Europe/Vaduz", tags: ["main-station", "obb", "feldkirch-buchs-line", "rex", "transfer-to-vaduz", "no-fast-train"] },
  { id: "forst-hilti-rail", name: "Forst Hilti Bahnhof", displayName: "Forst Hilti Station", country: "LI", countryCode: "LI", category: "rail", city: "Schaan", timezone: "Europe/Vaduz", tags: ["small-halt", "obb", "regional-only", "hilti-factory"] },
  { id: "nendeln-rail", name: "Nendeln Bahnhof", displayName: "Nendeln Station", country: "LI", countryCode: "LI", category: "rail", city: "Eschen", timezone: "Europe/Vaduz", tags: ["small-halt", "obb", "north-liechtenstein", "regional-only"] },

// ---------- Paste into FERRY_PORTS (category: "sea") ----------
// (Yok — denize kıyısı yok / landlocked. Ren Nehri üzerinde düzenli
//  feribot/kruvaziyer yok; küçük ölçekli turistik tekne turları
//  düzenli feribot kapsamı dışı.)

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "vaduz-post-bus", name: "Vaduz Post (Central Bus Stop / Main Interchange)", displayName: "Vaduz Post Bus Stop", country: "LI", countryCode: "LI", category: "bus", city: "Vaduz", timezone: "Europe/Vaduz", tags: ["main-interchange", "liemobil", "international", "buchs-sg", "sargans", "feldkirch", "flixbus-possible"] },
  { id: "schaan-post-bus", name: "Schaan Post Bus Interchange", displayName: "Schaan Post Bus Stop", country: "LI", countryCode: "LI", category: "bus", city: "Schaan", timezone: "Europe/Vaduz", tags: ["interchange", "liemobil", "rail-interchange", "industrial-center", "buchs-sg", "feldkirch"] },
  { id: "bendern-eschen-bus", name: "Bendern / Eschen Bus Stops", displayName: "Bendern-Eschen Bus Stops", country: "LI", countryCode: "LI", category: "bus", city: "Eschen", timezone: "Europe/Vaduz", tags: ["north-region", "liemobil", "feldkirch", "mauren", "ruggell"] },
  { id: "balzers-post-bus", name: "Balzers Post Bus Stop", displayName: "Balzers Bus Stop", country: "LI", countryCode: "LI", category: "bus", city: "Balzers", timezone: "Europe/Vaduz", tags: ["south-region", "liemobil", "sargans-direct", "gutenberg-castle"] },
  { id: "malbun-bus", name: "Malbun Ski Resort Bus Stop", displayName: "Malbun Bus Stop", country: "LI", countryCode: "LI", category: "bus", city: "Malbun", region: "Triesenberg", timezone: "Europe/Vaduz", tags: ["ski-resort", "liemobil-hat-21", "seasonal-peak", "domestic-only", "altitude-1600m"] },

// ============================================================
// TOPLAM: 0 air + 3 rail + 0 sea + 5 bus = 8 kayıt
// Notlar:
// - Lihtenştayn'ın tek demiryolu hattı ÖBB işletiminde Feldkirch (AT)
//   – Buchs SG (CH) hattıdır; ülke içi uzunluk ~9 km, 3 istasyon.
//   Railjet/ICE/EC uzun mesafe trenleri DURMAZ — Feldkirch veya
//   Buchs'ta aktarma şart (tag: no-fast-train).
// - Klasik otogar binası yoktur; LIEmobil (~15 hat, ~700+ günlük
//   sefer, ~8-9 milyon yolcu/yıl) tüm belediyeleri birbirine bağlar.
//   Uluslararısı bağlantılar Buchs SG ve Feldkirch üzerinden yapılır.
// - FlixBus dönemsel olarak Zürih/Münih/Innsbruck yönüne sefer yapar;
//   garanti durak yok, genellikle Feldkirch/Buchs aktarmalı.
// - Komşu ülkelerin havalimanları (ZRH, ACH, FDH, INN, FMM) bu
//   dosyaya kasten eklenmedi — kendi ülke kodlarıyla AIRPORTS'ta.
// ============================================================
