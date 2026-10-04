import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const OF_AIRPORTS = path.join(ROOT, "data", "openflights", "airports.dat");
const OA_AIRPORTS = path.join(ROOT, "data", "ourairports", "airports.csv");
const OA_RUNWAYS = path.join(ROOT, "data", "ourairports", "runways.csv");
const OUT_DIR = path.join(ROOT, "data", "processed");
const OUT_FILE = path.join(OUT_DIR, "master_airports.json");

function parseCSV(text, delimiter = ",") {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function num(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === "" || s === "\\N") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function clean(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === "" || s === "\\N") return null;
  return s;
}

async function main() {
  console.log("⏳ OpenFlights airports.dat okunuyor...");
  const ofText = fs.readFileSync(OF_AIRPORTS, "utf8");
  const ofRows = parseCSV(ofText);
  console.log(`   Satır: ${ofRows.length}`);

  console.log("⏳ OurAirports airports.csv okunuyor...");
  const oaText = fs.readFileSync(OA_AIRPORTS, "utf8");
  const oaRows = parseCSV(oaText);
  const oaHeader = oaRows[0];
  const oaData = oaRows.slice(1);
  console.log(`   Satır: ${oaData.length} (başlık hariç)`);

  console.log("⏳ OurAirports runways.csv okunuyor...");
  const rwText = fs.readFileSync(OA_RUNWAYS, "utf8");
  const rwRows = parseCSV(rwText);
  const rwHeader = rwRows[0];
  const rwData = rwRows.slice(1);
  console.log(`   Satır: ${rwData.length} (başlık hariç)`);

  // --- OurAirports index ---
  const oaIdx = { ident: new Map(), icao: new Map(), iata: new Map(), gps: new Map(), local: new Map() };
  const oaCol = Object.fromEntries(oaHeader.map((h, i) => [h, i]));
  for (const r of oaData) {
    const rec = {
      ident: clean(r[oaCol.ident]),
      type: clean(r[oaCol.type]),
      name: clean(r[oaCol.name]),
      lat: num(r[oaCol.latitude_deg]),
      lon: num(r[oaCol.longitude_deg]),
      elevation_ft: num(r[oaCol.elevation_ft]),
      iso_country: clean(r[oaCol.iso_country]),
      municipality: clean(r[oaCol.municipality]),
      scheduled_service: clean(r[oaCol.scheduled_service]),
      iata: clean(r[oaCol.iata_code]),
      icao: clean(r[oaCol.icao_code]),
      gps: clean(r[oaCol.gps_code]),
      local: clean(r[oaCol.local_code]),
    };
    if (rec.ident && !oaIdx.ident.has(rec.ident)) oaIdx.ident.set(rec.ident, rec);
    if (rec.icao && !oaIdx.icao.has(rec.icao)) oaIdx.icao.set(rec.icao, rec);
    if (rec.iata && !oaIdx.iata.has(rec.iata)) oaIdx.iata.set(rec.iata, rec);
    if (rec.gps && !oaIdx.gps.has(rec.gps)) oaIdx.gps.set(rec.gps, rec);
    if (rec.local && !oaIdx.local.has(rec.local)) oaIdx.local.set(rec.local, rec);
  }

  // --- Runways index by airport_ident ---
  const rwCol = Object.fromEntries(rwHeader.map((h, i) => [h, i]));
  const runwaysByIdent = new Map();
  let rwCount = 0;
  for (const r of rwData) {
    const ident = clean(r[rwCol.airport_ident]);
    if (!ident) continue;
    const runway = {
      length_ft: num(r[rwCol.length_ft]),
      width_ft: num(r[rwCol.width_ft]),
      surface: clean(r[rwCol.surface]),
      lighted: num(r[rwCol.lighted]) === 1,
      closed: num(r[rwCol.closed]) === 1,
      le_ident: clean(r[rwCol.le_ident]),
      le_latitude_deg: num(r[rwCol.le_latitude_deg]),
      le_longitude_deg: num(r[rwCol.le_longitude_deg]),
      le_elevation_ft: num(r[rwCol.le_elevation_ft]),
      le_heading_degT: num(r[rwCol.le_heading_degT]),
      he_ident: clean(r[rwCol.he_ident]),
      he_latitude_deg: num(r[rwCol.he_latitude_deg]),
      he_longitude_deg: num(r[rwCol.he_longitude_deg]),
      he_elevation_ft: num(r[rwCol.he_elevation_ft]),
      he_heading_degT: num(r[rwCol.he_heading_degT]),
    };
    if (!runwaysByIdent.has(ident)) runwaysByIdent.set(ident, []);
    runwaysByIdent.get(ident).push(runway);
    rwCount++;
  }
  console.log(`   İndekslenen pist: ${rwCount}`);

  // --- Merge: OpenFlights base + OurArports enrich, filter alt<0 || alt>14000 ---
  const stats = { total: 0, droppedAlt: 0, joinedOA: 0, joinedMiss: 0, withRunways: 0 };
  const master = [];
  for (const r of ofRows) {
    stats.total++;
    const ofId = clean(r[0]);
    const ofName = clean(r[1]);
    const ofCity = clean(r[2]);
    const ofCountry = clean(r[3]);
    const ofIata = clean(r[4]);
    const ofIcao = clean(r[5]);
    const lat = num(r[6]);
    const lon = num(r[7]);
    const alt = num(r[8]);
    const ofType = clean(r[12]) || "airport";

    // FILTER: drop rows with negative elevation or above 14,000 ft
    if (alt !== null && (alt < 0 || alt > 14000)) {
      stats.droppedAlt++;
      continue;
    }

    // Key chain: icao → iata → gps → local (against OurAirports)
    const oa =
      (ofIcao && (oaIdx.icao.get(ofIcao) || oaIdx.ident.get(ofIcao))) ||
      (ofIata && (oaIdx.iata.get(ofIata) || oaIdx.ident.get(ofIata))) ||
      (ofIata && oaIdx.gps.get(ofIata)) ||
      (ofIata && oaIdx.local.get(ofIata)) ||
      null;

    if (oa) stats.joinedOA++;
    else stats.joinedMiss++;

    const ident = (oa && oa.ident) || ofIata || ofIcao || ofId;
    const type = (oa && oa.type) || ofType;
    const name = ofName || (oa && oa.name) || null;
    const iata_code = (ofIata || (oa && oa.iata)) || null;
    const icao_code = (ofIcao || (oa && oa.icao)) || null;

    // Runways: prefer OA ident, fall back to iata / icao lookup
    let runways = runwaysByIdent.get(ident) || null;
    if (!runways && iata_code) runways = runwaysByIdent.get(iata_code) || null;
    if (!runways && icao_code) runways = runwaysByIdent.get(icao_code) || null;
    if (runways) stats.withRunways++;

    master.push({
      id: oa ? `OA:${oa.ident}` : ofId ? `OF:${ofId}` : ident,
      ident,
      type,
      name,
      coordinates: { latitude: lat, longitude: lon },
      iata_code,
      icao_code,
      runways: runways || [],
      // enrichment / provenance
      city: ofCity || (oa && oa.municipality) || null,
      country: ofCountry || null,
      altitude_ft: alt,
      elevation_ft: oa ? oa.elevation_ft : alt,
      scheduled_service: oa ? oa.scheduled_service === "yes" : null,
      source: oa ? "openflights+ourairports" : "openflights",
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(master, null, 2), "utf8");

  const bytes = fs.statSync(OUT_FILE).size;
  console.log("");
  console.log("✅ master_airports.json oluşturuldu");
  console.log(`   Toplam OF satır : ${stats.total}`);
  console.log(`   Filtre düşen    : ${stats.droppedAlt} (alt < 0 || alt > 14000)`);
  console.log(`   Master kayıt    : ${master.length}`);
  console.log(`   OA eşleşen      : ${stats.joinedOA}`);
  console.log(`   OA eşleşmeyen   : ${stats.joinedMiss}`);
  console.log(`   Pistli kayıt    : ${stats.withRunways}`);
  console.log(`   Dosya           : ${OUT_FILE} (${bytes} bayt)`);
}

main().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});
