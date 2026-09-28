// ============================================================
// FreeBuff Travel — Vatican City (VA) destination entries
// Converted from: TravelApp_Vatican.pdf
// NOTE: World's smallest state (0.44 km²), fully enclaved inside
// Rome. No civil airport, no seacoast, no intercity bus terminal.
// All practical access runs through Rome's (IT) infrastructure.
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------
// (Yok — Vatikan'da sivil yolcu havalimanı yok. Tek heliport yalnızca
//  Papa'nın resmi kullanımına açık. Kullanım: Roma FCO / CIA.)

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------

  { id: "vatican-rail", name: "Stazione Ferroviaria Vaticana (Vatican Railway Station)", displayName: "Vatican Railway Station", country: "VA", countryCode: "VA", category: "rail", city: "Vatican City", region: "Vatican City", timezone: "Europe/Rome", tags: ["cargo-only", "no-regular-passenger-service", "historic", "1934", "300m-line", "roma-san-pietro-nearby"] },

// ---------- Paste into FERRY_PORTS (category: "sea") ----------
// (Yok — denize kıyısı yok / landlocked. En yakın kruvaziyer limanı:
//  Roma/Civitavecchia ~80 km.)

// ---------- Paste into BUS_HUBS (category: "bus") ----------
// (Yok — 0,44 km² içinde otogar altyapısı yok. Kullanım: Roma
//  Tiburtina çevresi otobüs durakları — FlixBus, MarinoBus vb.)

// ============================================================
// TOPLAM: 0 air + 1 rail + 0 sea + 0 bus = 1 kayıt
// Notlar:
// - Vatikan Tren İstasyonu (1934, Lateran Antlaşması) fiziksel olarak
//   mevcut ancak düzenli yolcu seferi YAPMAZ; günümüzde ağırlıklı
//   olarak kargo (duty-free mağaza malzemeleri, posta) için kullanılır.
//   Nadiren özel papal/turistik seferler düzenlenir (Castel Gandolfo).
// - Aktif yolcu istasyonu olarak işaretlenmedi; tag'lerle durumu
//   belirtilmiştir — arama sonuçlarında "no-regular-passenger-service"
//   etiketi filtrelenebilir.
// - Ziyaretçilerin kullanması gereken istasyonlar: Roma San Pietro
//   (FL3 banliyö), Roma Termini, Roma Tiburtina (IT kayıtlarında).
// - Hava/deniz/otobüs kayıtları kasten boş bırakıldı — Vatikan'ın
//   tüm ulaşim ihtiyacı fiilen Roma (İtalya) altyapısıyla karşılanır.
// ============================================================
