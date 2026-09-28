// ============================================================
// FreeBuff Travel — San Marino (SM) destination entries
// Converted from: TravelApp_San_Marino.pdf
// NOTE: Landlocked microstate (61 km²) enclaved inside Italy.
// No airport, no seaport, no active railway (closed 1944).
// Bus (San Marino–Rimini) is the country's only physical link.
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------
// (Yok — sivil yolcu havalimanı yok. Fiili kapı: Rimini RMI ~25 km
//  ("Rimini-S San Marino" olarak da anılır), BLQ ~130 km, AOI ~120 km
//  — İtalya kayıtlarında mevcut.)

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------
// (Yok — 1932-1944 Rimini–San Marino dar hattı 1944 bombardımanında
//  yıkıldı, bir daha açılmadı. Montale Eski Tren İstasyonu müzedir.
//  Kullanım: Rimini Centrale (IT kayıtlarında).)

// ---------- Paste into FERRY_PORTS (category: "sea") ----------
// (Yok — denize kıyısı yok / landlocked. En yakın limanlar: Rimini
//  ~25 km, Ancona ~120 km, Ravenna ~70 km — İtalya kayıtlarında.)

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "san-marino-piazzale-calcigni-bus", name: "Piazzale Calcigni Bus Terminal (San Marino Ana Terminali)", displayName: "San Marino Main Bus Terminal", country: "SM", countryCode: "SM", category: "bus", city: "San Marino", timezone: "Europe/San_Marino", tags: ["main-terminal", "bonelli-bus", "rimini", "rimini-airport", "rimini-fiera", "international-via-rimini", "tourist-info"] },
  { id: "borgo-maggiore-bus", name: "Borgo Maggiore Bus Stop / Funivia Connection", displayName: "Borgo Maggiore Bus Stop", country: "SM", countryCode: "SM", category: "bus", city: "Borgo Maggiore", timezone: "Europe/San_Marino", tags: ["intermediate-stop", "funicular-connection", "rimini-line", "teleferik"] },
  { id: "dogana-serravalle-bus", name: "Dogana Bus Stop (Serravalle)", displayName: "Dogana Bus Stop", country: "SM", countryCode: "SM", category: "bus", city: "Serravalle", timezone: "Europe/San_Marino", tags: ["border-stop", "italy-border", "rimini-line", "commercial-district", "free-crossing"] },

// ============================================================
// TOPLAM: 0 air + 0 rail + 0 sea + 3 bus = 3 kayıt
// Notlar:
// - San Marino'nun kendi topraklarındaki TEK ulaşım terminali
//   otobüs duraklarıdır. Piazzale Calcigni ana terminaldir.
// - Bonelli Bus (San Marino–Rimini hattı) ülkenin dış bağlantısının
//   bel kemiğidir: yazın 20+ sefer/gün, kışın azalmış, süre ~40-50 dk.
// - Doğrudan uluslararası otobüs hatti YOK — Rimini'ye geçilip
//   oradan FlixBus/MarinoBus/Baltour ile Avrupa'ya devam edilir.
// - İç hat ağı (9 castello arası, kamu otobüsleri) şehirlerarası
//   değil kısa mesafe olduğu için ayrı kayıt yapılmadı; 20-30 dk
//   ölçeğinde tüm gölgeler Piazzale Calcigni üzerinden geçer.
// - San Marino AB üyesi değil, Schengen'de değil — pratikte
//   İtalya sınırında pasaport/gümrük kontrolü normalde yapılmaz.
// - Rimini Tren İstasyonu önündeki Bonelli Bus kalkış noktası
//   İtalya (IT) kayıtlarındadır, burada tekrar eklenmedi.
// ============================================================
