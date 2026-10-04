import { readFileSync, statSync } from "node:fs";

const path = "./data/processed/master_airports.json";
const raw = readFileSync(path, "utf8");
const data = JSON.parse(raw);
const st = statSync(path);

const required = ["id", "ident", "type", "name", "coordinates", "iata_code", "icao_code", "runways"];
const issues = [];
let withIata = 0, withIcao = 0, withRunways = 0;
const typeCount = {};

for (let i = 0; i < data.length; i++) {
  const rec = data[i];
  for (const k of required) {
    if (!(k in rec)) { issues.push(`[${i}] missing field: ${k} (${rec?.ident ?? "?"})`); if (issues.length > 20) break; }
  }
  if (rec.coordinates && typeof rec.coordinates.latitude === "number" && typeof rec.coordinates.longitude === "number") {} else issues.push(`[${i}] bad coordinates (${rec.ident})`);
  if (!Array.isArray(rec.runways)) issues.push(`[${i}] runways not array (${rec.ident})`);
  if (rec.iata_code) withIata++;
  if (rec.icao_code) withIcao++;
  if (Array.isArray(rec.runways) && rec.runways.length > 0) withRunways++;
  typeCount[rec.type] = (typeCount[rec.type] || 0) + 1;
  if (issues.length > 20) break;
}

console.log("Dosya:", path);
console.log("Boyut:", st.size, "bytes");
console.log("Kayıt sayısı:", data.length, data.length === 7678 ? "✅ (beklenen 7678)" : "❌ (beklenen 7678)");
console.log("IATA:", withIata, "| ICAO:", withIcao, "| Pistli:", withRunways);
console.log("Tip dağılımı:", JSON.stringify(typeCount));
console.log("İlk kayıt:", JSON.stringify(data[0], null, 2));
console.log("Son kayıt:", JSON.stringify(data[data.length - 1], null, 2));
console.log("Pistli örnek:", JSON.stringify(data.find(r => r.runways.length > 0), null, 2));
if (issues.length) { console.log("SORUNLAR:"); issues.forEach(m => console.log(" -", m)); process.exit(1); }
console.log("✅ Tüm kayıtlar gerekli alanlara sahip, yapı doğrulandı.");
