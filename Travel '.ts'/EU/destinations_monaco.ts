// ============================================================
// FreeBuff Travel — Monaco (MC) destination entries
// Converted from: TravelApp_Monaco.pdf
// NOTE: World's 2nd smallest state (2.02 km²). No civil airport,
// no classic bus station, single underground SNCF station.
// Transport is deeply integrated with France (especially Nice).
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------

  { id: "mcm", name: "Monaco Heliport (Héliport de Monaco)", displayName: "Monaco Heliport (MCM)", country: "MC", countryCode: "MC", category: "air", city: "Fontvieille", iata: "MCM", timezone: "Europe/Monaco", tags: ["heliport", "monacair", "nice-transfer", "7min-flight", "vip", "50-70k-passengers", "no-fixed-wing"] },

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------

  { id: "monaco-monte-carlo-rail", name: "Gare de Monaco-Monte-Carlo", displayName: "Monaco-Monte-Carlo Station", country: "MC", countryCode: "MC", category: "rail", city: "Monaco", region: "Monte Carlo", timezone: "Europe/Monaco", tags: ["sncf", "underground-1999", "marseille-ventimiglia-line", "ter-zou", "nice-20min", "ventimiglia-international", "no-direct-tgv", "3-4m-passengers"] },

// ---------- Paste into FERRY_PORTS (category: "sea") ----------

  { id: "port-hercule", name: "Port Hercule", displayName: "Port Hercule", country: "MC", countryCode: "MC", category: "sea", city: "Monaco", region: "Monte Carlo / La Condamine", timezone: "Europe/Monaco", tags: ["main-port", "cruise-luxury", "yacht", "seasonal-ferry", "nice-45-60min", "cannes", "saint-tropez", "ventimiglia", "trans-cote-dazur", "f1-grand-prix"] },
  { id: "port-fontvieille", name: "Port de Fontvieille", displayName: "Port de Fontvieille", country: "MC", countryCode: "MC", category: "sea", city: "Monaco", region: "Fontvieille", timezone: "Europe/Monaco", tags: ["marina", "yacht-only", "no-passenger-terminal", "heliport-nearby", "info-only"] },

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "place-darmes-bus", name: "Place d'Armes / Gare Routière Area", displayName: "Place d'Armes Bus Stops", country: "MC", countryCode: "MC", category: "bus", city: "Monaco", region: "La Condamine", timezone: "Europe/Monaco", tags: ["no-bus-station-building", "lignes-dazur", "zou", "ligne-100-nice-menton", "ligne-110-airport-express", "flixbus-limited", "international-via-nice"] },
  { id: "monaco-menton-express-bus", name: "Ligne 100X Express Stop (Monaco–Nice)", displayName: "Monaco Express Bus Stop", country: "MC", countryCode: "MC", category: "bus", city: "Monaco", timezone: "Europe/Monaco", tags: ["express", "limited-stops", "faster", "zou", "lignes-dazur", "subsidized-150eur"] },

// ============================================================
// TOPLAM: 1 air + 1 rail + 2 sea + 2 bus = 6 kayıt
// Notlar:
// - Monako'nun bağımsız ulaşım altyapısı çok sınırlıdır; ülke
//   ulaşım bakımından büyük ölçüde Fransa'ya (özellikle Nice'e)
//   bağımlıdır. Nice, Monako için fiili ulaşım hub'idir.
// - Monaco Heliport (ICAO: LNMC) sabit kanatlı uçak kabul ETMEZ;
//   Monacair ile Nice Côte d'Azur (NCE) arası ~7 dk, dünyadaki en
//   yoğun helikopter hatlarından biridir. Nice'e heliporttan
//   aktarma yapılarak dünya geneline uçuş sağlanır.
// - Port Hercule lüks kruvaziyer segmentine odaklanır; Oasis sınıfı
//   mega gemiler yanaşamaz. Feribot bağlantıları (Nice, Cannes,
//   Saint-Tropez, Ventimiglia) ağırlıklı olarak yaz sezonudur.
// - Port de Fontvieille tamamen yat marinadır, yolcu terminali
//   işlevi yoktur — bilgi amaçlı "info-only" tag'iyle eklendi.
// - Resmi otogar binası YOKTUR; sokak üstü duraklardan kalkılır.
//   Ligne 100 (Nice–Menton) en kritik hattır, bilet ~1,50 €.
// - FlixBus/BlaBlaBus Monako'ya genellikle DİREKT sefer yapmaz;
//   Nice veya Menton üzerinden aktarma gerekir.
// - Monaco istasyonuna doğrudan TGV hizmeti YOKTUR; en yakın TGV
//   istasyonu Nice-Ville (~20 dk TER ile). Thello 2021'de durduruldu.
// - Şehir içi CAM otobüs ağı (6 hat) toplu taşımadır, şehirlerarası
//   kapsam dışıdır — kayda alınmadı.
// ============================================================
