// ============================================================
// gate-data.ts — Phase 1 data gate
//
// Independently re-counts the source files and asserts the
// generated dataset matches: totals, unique ids, categories,
// honest coordinate provenance.
//
//   npx tsx scripts/gate-data.ts
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { TERMINALS, TERMINAL_STATS } from "../src/data/destinations";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "Travel '.ts'", "EU");

const failures: string[] = [];
function check(ok: boolean, msg: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
  if (!ok) failures.push(msg);
}

// 1. Independent source count: every object literal starts with "{ id:".
let sourceCount = 0;
const sourceIds = new Set<string>();
for (const file of fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".ts"))) {
  const text = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
  const stripped = text
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  for (const m of stripped.matchAll(/\{\s*id:\s*"([^"]+)"/g)) {
    sourceCount += 1;
    sourceIds.add(m[1]);
  }
}

check(sourceCount === TERMINALS.length, `record count matches source (${TERMINALS.length} generated vs ${sourceCount} in source)`);
check(TERMINAL_STATS.total === TERMINALS.length, `STATS.total (${TERMINAL_STATS.total}) equals array length`);

// 2. Unique ids, every generated id traceable to a source id
//    (original id, or a country-scoped "<cc>-<id>" for the known
//    cross-country collisions — never a dropped record).
const ids = new Set(TERMINALS.map((t) => t.id));
check(ids.size === TERMINALS.length, `ids unique (${ids.size}/${TERMINALS.length})`);

let untraceable = 0;
let scoped = 0;
for (const t of TERMINALS) {
  if (sourceIds.has(t.id)) continue;
  const m = /^([a-z]{2})-(.+)$/.exec(t.id);
  if (m && m[1].toUpperCase() === t.countryCode && sourceIds.has(m[2])) {
    scoped += 1;
  } else {
    untraceable += 1;
  }
}
check(untraceable === 0, `every id traces to the source (traceable=${TERMINALS.length - untraceable}/${TERMINALS.length}, country-scoped=${scoped})`);
const duplicateValues = sourceCount - sourceIds.size;
check(
  scoped === duplicateValues * 2,
  `country-scoped ids pair up source collisions (${scoped} scoped ids vs ${duplicateValues} duplicated source id values)`
);

// 3. Shape validation.
const CATEGORIES = new Set(["air", "rail", "sea", "bus"]);
let shapeErrors = 0;
let coordErrors = 0;
const byCategory: Record<string, number> = { air: 0, rail: 0, sea: 0, bus: 0 };
const byCountry = new Set<string>();
for (const t of TERMINALS) {
  if (!t.id || !t.name || !t.displayName || !t.city) shapeErrors += 1;
  if (!/^[A-Z]{2}$/.test(t.countryCode)) shapeErrors += 1;
  if (!CATEGORIES.has(t.category)) shapeErrors += 1;
  if (t.iata !== undefined && !/^[A-Z]{3}$/.test(t.iata)) shapeErrors += 1;
  if (!Array.isArray(t.tags)) shapeErrors += 1;
  byCategory[t.category] += 1;
  byCountry.add(t.countryCode);

  // Honest coords: "missing" must have NO coordinates; the other two must have both.
  const hasBoth = typeof t.lat === "number" && typeof t.lng === "number";
  if (t.coordSource === "missing" ? hasBoth : !hasBoth) coordErrors += 1;
  if (hasBoth && (Math.abs(t.lat!) > 90 || Math.abs(t.lng!) > 180)) coordErrors += 1;
}
check(shapeErrors === 0, `record shape valid (${TERMINALS.length} records)`);
check(coordErrors === 0, `coordinate provenance honest (recorded/centroid carry coords, missing carries none)`);
check(
  Object.entries(byCategory).every(([k, v]) => v === (TERMINAL_STATS.byCategory as Record<string, number>)[k]),
  `per-category counts match STATS (${JSON.stringify(byCategory)})`
);
check(byCountry.size === TERMINAL_STATS.countries, `country coverage matches STATS (${byCountry.size})`);

// 4. Coordinate coverage is reported (informational, not a pass condition).
const coords = TERMINAL_STATS.coords;
console.log(
  `INFO  coords: ${coords.recorded} recorded, ${coords.centroid} centroid, ${coords.missing} missing ` +
    `(${(((coords.recorded + coords.centroid) / TERMINALS.length) * 100).toFixed(1)}% mappable)`
);
console.log(
  `INFO  categories: ${Object.entries(byCategory).map(([k, v]) => `${k}=${v}`).join(" ")}; countries=${byCountry.size}`
);

if (failures.length) {
  console.log(`RESULT: FAIL (${failures.length} check(s) failed)`);
  process.exit(1);
}
console.log("RESULT: PASS");
