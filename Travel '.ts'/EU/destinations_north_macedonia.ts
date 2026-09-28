// ============================================================
// FreeBuff Travel — North Macedonia (MK) destination entries
// Converted from: TravelApp_North_Macedonia.pdf
// NOTE: Landlocked. Both airports operated by TAV Macedonia.
// Rail ~925 km, diesel, slow (50-70 km/s), NO international
// passenger trains as of 2024 (RS/GR/XK suspended). Ohrid has
// NO rail connection.
// ============================================================

// ---------- Paste into AIRPORTS (category: "air") ----------

  { id: "skp", name: "Skopje International Airport", displayName: "Skopje (SKP)", country: "MK", countryCode: "MK", category: "air", city: "Skopje", region: "Petrovec", iata: "SKP", timezone: "Europe/Skopje", tags: ["major-hub", "85-90-percent-traffic", "tav-macedonia", "wizz-air-base", "turkish-airlines", "pegasus", "austrian", "2-8-3m-passengers", "former-alexander-the-great", "prespa-agreement-renamed"] },
  { id: "ohd", name: "Ohrid St. Paul the Apostle Airport", displayName: "Ohrid (OHD)", country: "MK", countryCode: "MK", category: "air", city: "Ohrid", iata: "OHD", timezone: "Europe/Skopje", tags: ["tourism-airport", "lake-ohrid-unesco", "tav-macedonia", "wizz-air", "seasonal-heavy", "100-250k-passengers", "winter-near-zero", "170km-from-skopje"] },

// ---------- Paste into RAIL_STATIONS (category: "rail") ----------

  { id: "skopje-rail", name: "Skopje Railway Station (Železnička Stanica Skopje)", displayName: "Skopje Station", country: "MK", countryCode: "MK", category: "rail", city: "Skopje", timezone: "Europe/Skopje", tags: ["mz-transport", "main-hub", "corridor-x", "next-to-bus-station", "belgrade-suspended", "thessaloniki-suspended", "1981-rebuilt"] },
  { id: "kumanovo-rail", name: "Kumanovo Railway Station", displayName: "Kumanovo Station", country: "MK", countryCode: "MK", category: "rail", city: "Kumanovo", timezone: "Europe/Skopje", tags: ["hat-1-north", "serbia-border-near", "30-40min-skopje"] },
  { id: "tabanovce-rail", name: "Tabanovce Border Station", displayName: "Tabanovce Station", country: "MK", countryCode: "MK", category: "rail", city: "Tabanovce", timezone: "Europe/Skopje", tags: ["serbia-border", "hat-1-north-terminus", "international-suspended", "presevo-direction"] },
  { id: "veles-rail", name: "Veles Railway Station", displayName: "Veles Station", country: "MK", countryCode: "MK", category: "rail", city: "Veles", timezone: "Europe/Skopje", tags: ["critical-junction", "hat-1", "hat-3-east", "hat-4-southwest", "geographic-crossroads"] },
  { id: "negotino-rail", name: "Negotino Railway Station", displayName: "Negotino Station", country: "MK", countryCode: "MK", category: "rail", city: "Negotino", timezone: "Europe/Skopje", tags: ["hat-1", "vardar-valley", "tikvesh-region"] },
  { id: "demir-kapija-rail", name: "Demir Kapija Railway Station", displayName: "Demir Kapija Station", country: "MK", countryCode: "MK", category: "rail", city: "Demir Kapija", timezone: "Europe/Skopje", tags: ["hat-1", "vardar-gorge", "scenic"] },
  { id: "gevgelija-rail", name: "Gevgelija Railway Station", displayName: "Gevgelija Station", country: "MK", countryCode: "MK", category: "rail", city: "Gevgelija", timezone: "Europe/Skopje", tags: ["hat-1-south-terminus", "greece-border-near", "international-suspended", "bogorodica-crossing"] },
  { id: "tetovo-rail", name: "Tetovo Railway Station", displayName: "Tetovo Station", country: "MK", countryCode: "MK", category: "rail", city: "Tetovo", timezone: "Europe/Skopje", tags: ["hat-2-west", "arabati-baba-teke", "few-trains-daily"] },
  { id: "gostivar-rail", name: "Gostivar Railway Station", displayName: "Gostivar Station", country: "MK", countryCode: "MK", category: "rail", city: "Gostivar", timezone: "Europe/Skopje", tags: ["hat-2-west", "mavrovo-nearby"] },
  { id: "kicevo-rail", name: "Kičevo Railway Station", displayName: "Kičevo Station", country: "MK", countryCode: "MK", category: "rail", city: "Kičevo", timezone: "Europe/Skopje", tags: ["hat-2-west-terminus", "ohrid-extension-planned", "corridor-viii", "not-yet-built"] },
  { id: "stip-rail", name: "Štip Railway Station", displayName: "Štip Station", country: "MK", countryCode: "MK", category: "rail", city: "Štip", timezone: "Europe/Skopje", tags: ["hat-3-east", "university-city"] },
  { id: "kocani-rail", name: "Kočani Railway Station", displayName: "Kočani Station", country: "MK", countryCode: "MK", category: "rail", city: "Kočani", timezone: "Europe/Skopje", tags: ["hat-3-east-terminus"] },
  { id: "prilep-rail", name: "Prilep Railway Station", displayName: "Prilep Station", country: "MK", countryCode: "MK", category: "rail", city: "Prilep", timezone: "Europe/Skopje", tags: ["hat-4-pelagonia", "tobacco-mermer"] },
  { id: "bitola-rail", name: "Bitola Railway Station", displayName: "Bitola Station", country: "MK", countryCode: "MK", category: "rail", city: "Bitola", timezone: "Europe/Skopje", tags: ["hat-4-south-terminus", "ottoman-era-building", "greece-line-inactive", "florina-historic"] },

// ---------- Paste into FERRY_PORTS (category: "sea") ----------
// (Yok — denize kiyısı yok / landlocked. Ohri Gölü ve Prespa Gölü
//  üzerindeki turistik tekne turları ve Ohri-Sv. Naum yerel servisleri
//  uluslararası feribot/kruvaziyer kapsamı DIŞIDIR. Ohri Gölü'nün
//  güney kıyısı Arnavutluk'a ait olup düzenli uluslararası feribot
//  hattı yoktur.)

// ---------- Paste into BUS_HUBS (category: "bus") ----------

  { id: "skopje-bus", name: "Skopje Central Bus Station (Avtobuska Stanica Skopje)", displayName: "Skopje Central Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Skopje", timezone: "Europe/Skopje", tags: ["largest-terminal", "next-to-train-station", "international", "belgrad", "pristina", "tirana", "thessaloniki", "sofia", "istanbul", "munich", "zurich", "stockholm", "galeb", "transkop", "vardar-express", "flixbus", "diaspora-peak"] },
  { id: "ohrid-bus", name: "Avtobuska Stanica Ohrid", displayName: "Ohrid Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Ohrid", timezone: "Europe/Skopje", tags: ["tourism-hub", "tirana", "elbasan", "pogradec", "thessaloniki-seasonal", "galeb", "struga-frequent", "unesco-lake"] },
  { id: "struga-bus", name: "Avtobuska Stanica Struga", displayName: "Struga Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Struga", timezone: "Europe/Skopje", tags: ["albanian-minority", "tirana", "albania-border-area", "ohrid-15km-frequent", "struga-trans"] },
  { id: "debar-bus", name: "Debar Bus Station", displayName: "Debar Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Debar", timezone: "Europe/Skopje", tags: ["west-border", "albania-border-area", "small-terminal"] },
  { id: "kicevo-bus", name: "Kičevo Bus Station", displayName: "Kičevo Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Kičevo", timezone: "Europe/Skopje", tags: ["skopje-ohri-route", "intermediate"] },
  { id: "bitola-bus", name: "Avtobuska Stanica Bitola", displayName: "Bitola Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Bitola", timezone: "Europe/Skopje", tags: ["second-city", "pelagonia-hub", "thessaloniki-florina", "istanbul-diaspora", "transkop-base", "galeb", "medzitlija-crossing"] },
  { id: "prilep-bus", name: "Prilep Bus Station", displayName: "Prilep Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Prilep", timezone: "Europe/Skopje", tags: ["intermediate", "transkop", "tobacco-town"] },
  { id: "resen-bus", name: "Resen Bus Station", displayName: "Resen Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Resen", timezone: "Europe/Skopje", tags: ["prespa-lake", "small-terminal", "ohrid-bitola-line"] },
  { id: "krusevo-bus", name: "Kruševo Bus Station", displayName: "Kruševo Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Kruševo", timezone: "Europe/Skopje", tags: ["highest-town", "ilinden-history", "winter-tourism", "seasonal"] },
  { id: "tetovo-bus", name: "Avtobuska Stanica Tetovo", displayName: "Tetovo Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Tetovo", timezone: "Europe/Skopje", tags: ["northwest-hub", "skopje-45min-very-frequent", "painted-mosque", "kosovo-links", "albanian-majority"] },
  { id: "gostivar-bus", name: "Gostivar Bus Station", displayName: "Gostivar Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Gostivar", timezone: "Europe/Skopje", tags: ["mavrovo-access", "west", "albanian-minority"] },
  { id: "kumanovo-bus", name: "Avtobuska Stanica Kumanovo", displayName: "Kumanovo Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Kumanovo", timezone: "Europe/Skopje", tags: ["third-city", "skopje-30-40min-frequent", "serbia-border", "belgrad", "nis", "tabanovce-crossing"] },
  { id: "veles-bus", name: "Avtobuska Stanica Veles", displayName: "Veles Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Veles", timezone: "Europe/Skopje", tags: ["geographic-crossroads", "e75-e65", "transit-heavy"] },
  { id: "gevgelija-bus", name: "Gevgelija Bus Station", displayName: "Gevgelija Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Gevgelija", timezone: "Europe/Skopje", tags: ["greece-border", "bogorodica-evzoni-60km", "thessaloniki", "casino-tourism", "free-trade-zone"] },
  { id: "strumica-bus", name: "Strumica Bus Station", displayName: "Strumica Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Strumica", timezone: "Europe/Skopje", tags: ["southeast-hub", "bulgaria-limited", "agriculture", "strumica-trans"] },
  { id: "dojran-bus", name: "Dojran Bus Stop (Star/Nov Dojran)", displayName: "Dojran Bus Stop", country: "MK", countryCode: "MK", category: "bus", city: "Dojran", timezone: "Europe/Skopje", tags: ["dojran-lake", "greece-border", "small-stop", "seasonal-tourism"] },
  { id: "stip-bus", name: "Avtobuska Stanica Štip", displayName: "Štip Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Štip", timezone: "Europe/Skopje", tags: ["east-hub", "university", "vitaminka", "deni", "bulgaria-limited"] },
  { id: "kocani-bus", name: "Kočani Bus Station", displayName: "Kočani Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Kočani", timezone: "Europe/Skopje", tags: ["east", "rice-region", "regional"] },
  { id: "berovo-bus", name: "Berovo Bus Station", displayName: "Berovo Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Berovo", timezone: "Europe/Skopje", tags: ["malesevo-mountains", "nature-tourism", "bulgaria-border-area", "limited"] },
  { id: "delcevo-bus", name: "Delčevo Bus Station", displayName: "Delčevo Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Delčevo", timezone: "Europe/Skopje", tags: ["bulgaria-border", "blagoevgrad-direction", "border-town"] },
  { id: "radovis-bus", name: "Radoviš Bus Station", displayName: "Radoviš Bus Station", country: "MK", countryCode: "MK", category: "bus", city: "Radoviš", timezone: "Europe/Skopje", tags: ["mining-region", "regional"] },

// ============================================================
// TOPLAM: 2 air + 14 rail + 0 sea + 21 bus = 37 kayıt
// Notlar:
// - Her iki havalimanı da TAV Macedonia (Türk TAV Airports) tarafından
//   2010'dan itibaren 20 yıllık konsesyonla işletilir.
// - SKP 2018 Prespa Anlaşması öncesi "Alexander the Great" adını
//   taşıyordu; isim değiştirildi (tag: former-alexander-the-great).
// - Wizz Air SKP'yi Balkanlar'daki üslerinden biri olarak kullanır;
//   uçuşların büyük çoğunluğu Wizz Air'e aittir.
// - OHD hatları YILDAN YILA büyük değişkenlik gösterir; çoğu sadece
//   yaz (Haziran-Eylül) aktiftir, kışın trafiğe sıfıra iner.
// - Landlocked: Feribot/kruvaziyer limanı YOK. Ohri/Prespa gölleri
//   üzerindeki turistik tekne turları uluslararası taşıma değildir.
// - RAY: ~925 km, ağırlıklı dizel, 50-70 km/s, yüksek hızlı tren YOK.
//   4 ana hat: Hat 1 Kuzey-Güney (Koridor X, Tabanovce-Gevgelija),
//   Hat 2 Batı (Üsküp-Kičevo), Hat 3 Doğu (Veles-Kočani),
//   Hat 4 Pelagonia (Veles-Bitola).
// - 2024 İTİBARIYLA TÜM uluslararası yolcu trenleri ASKIYA ALINMIŞ:
//   Sırbistan (2022+ bakım), Yunanistan (uzun süredir), Kosova
//   (fiziksel hat var, düzenli sefer yok). Yeniden başlatma planları.
// - OHRİ'YE DEMİRYOLU BAĞLANTISI YOK; Kiçevo-Ohrid uzatma projesi
//   Koridor VIII kapsamında planlanıyor, henüz inşa edilmedi.
// - Bitola istasyonundan Yunanistan (Florina/Selanik) hattı fiziksel
//   mevcut ama kullanılmıyor; Osmanlı dönemi istasyon binası tarihi.
// - Otobüs baskın mod: ~8-10 büyük + ~20+ küçük terminal; özel
//   sektör ağırlıklı, çok sayıda küçük/orta ölçekli firma.
// - Diaspora hatları (Almanya, İsviçre, Avusturya, İsveç) 24-36 saat
//   sürer, yaz/bayram döneminde çok yoğundur.
// - Minibüs/kombi sistemi kısa mesafelerde (Üsküp-Tetovo, Üsküp-
//   Kumanovo, Ohri-Struga) resmi otobüslerin yanında çok yaygındır.
// - Şehir içi raylı sistem (metro/tramvay/hafif raylı) YOKTUR.
// - Küçük kasaba otogarları (Makedonski Brod, Valandovo, Demir
//   Hisar, Demir Kapija vb.) hub seviyesi dışında bırakıldı.
// ============================================================
