// ============================================================
// generate-destinations.ts — Phase 1 data pipeline
//
// Reads the 50 user-provided country files in "Travel '.ts'/EU"
// (read-only, never moved), validates every terminal record and
// emits src/data/destinations.ts.
//
// Coordinate enrichment (honest provenance per record):
//   1. "recorded"  — id match in the legacy dataset (real coords)
//   2. "centroid"  — country centroid fallback (labeled as such)
//   3. "missing"   — neither available (never invented)
//
//   npx tsx scripts/generate-destinations.ts
// ============================================================
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "Travel '.ts'", "EU");
const LEGACY_DIR =
  process.env.LEGACY_APP_DIR ?? path.join(path.dirname(ROOT), "TravelApp");
const LEGACY_DEST = path.join(LEGACY_DIR, "src", "lib", "data", "destinations.ts");
const LEGACY_GEO = path.join(LEGACY_DIR, "src", "lib", "data", "geo.ts");
const OUT_FILE = path.join(ROOT, "src", "data", "destinations.ts");

const CATEGORIES = new Set(["air", "rail", "sea", "bus"]);

interface RawRecord {
  id: string;
  name: string;
  displayName: string;
  country: string;
  countryCode: string;
  category: string;
  city?: string;
  region?: string;
  iata?: string;
  timezone?: string;
  tags: string[];
}

interface Coords {
  lat: number;
  lng: number;
}

const errors: string[] = [];
function fail(msg: string) {
  errors.push(msg);
}

// ---------- parsing helpers ----------

/** Strip // line comments and /* block *\/ comments (never inside strings:
 *  none of the source records embed // outside comment lines). */
function stripComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
}

/** Quote bare keys so a flat object literal becomes valid JSON. */
function literalToJson(literal: string): string {
  return literal
    .replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g, '$1"$2":')
    .replace(/,\s*\}/g, "}");
}

function extractObjects(text: string): string[] {
  return text.match(/\{[^{}]*\}/g) ?? [];
}

function parseRecord(literal: string, file: string): RawRecord | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(literalToJson(literal));
  } catch (err) {
    fail(`${file}: unparseable record (${(err as Error).message}): ${literal.slice(0, 120)}`);
    return null;
  }
  const rec = parsed as Partial<RawRecord>;
  if (typeof rec.id !== "string" || !rec.id) {
    fail(`${file}: record without id: ${literal.slice(0, 80)}`);
    return null;
  }
  if (typeof rec.name !== "string" || !rec.name) fail(`${file}: ${rec.id}: missing name`);
  if (typeof rec.displayName !== "string" || !rec.displayName)
    fail(`${file}: ${rec.id}: missing displayName`);
  if (typeof rec.countryCode !== "string" || !/^[A-Z]{2}$/.test(rec.countryCode))
    fail(`${file}: ${rec.id}: bad countryCode "${rec.countryCode}"`);
  if (!CATEGORIES.has(rec.category as string))
    fail(`${file}: ${rec.id}: bad category "${rec.category}"`);
  if (rec.iata !== undefined && !/^[A-Z]{3,4}$/.test(rec.iata))
    fail(`${file}: ${rec.id}: bad iata "${rec.iata}"`);
  if (!Array.isArray(rec.tags)) fail(`${file}: ${rec.id}: tags is not an array`);
  return rec as RawRecord;
}

// ---------- legacy enrichment ----------

function loadLegacyCoords(): Map<string, Coords> {
  const map = new Map<string, Coords>();
  if (!fs.existsSync(LEGACY_DEST)) {
    console.warn(`[warn] legacy dataset not found at ${LEGACY_DEST} — no "recorded" coords`);
    return map;
  }
  const text = stripComments(fs.readFileSync(LEGACY_DEST, "utf8"));
  for (const lit of extractObjects(text)) {
    const id = /(?:^|[,{]\s*)id:\s*"([^"]+)"/.exec(lit)?.[1];
    const cc = /(?:^|[,{]\s*)countryCode:\s*"([A-Z]{2})"/.exec(lit)?.[1];
    const lat = /(?:^|[,{]\s*)lat:\s*(-?\d+(?:\.\d+)?)/.exec(lit)?.[1];
    const lng = /(?:^|[,{]\s*)lng:\s*(-?\d+(?:\.\d+)?)/.exec(lit)?.[1];
    if (id && cc && lat && lng) map.set(`${cc}:${id}`, { lat: Number(lat), lng: Number(lng) });
  }
  return map;
}

function loadCountryCentroids(): Map<string, Coords> {
  const map = new Map<string, Coords>();
  if (!fs.existsSync(LEGACY_GEO)) {
    console.warn(`[warn] legacy geo not found at ${LEGACY_GEO} — no centroid fallback`);
    return map;
  }
  const text = fs.readFileSync(LEGACY_GEO, "utf8");
  const re = /([A-Z]{2}):\s*\{\s*lat:\s*(-?\d+(?:\.\d+)?),\s*lng:\s*(-?\d+(?:\.\d+)?)\s*\}/g;
  for (const m of text.matchAll(re)) map.set(m[1], { lat: Number(m[2]), lng: Number(m[3]) });
  return map;
}

// ---------- main ----------

function main() {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.endsWith(".ts"))
    .sort();
  if (files.length === 0) fail(`no .ts files in ${SRC_DIR}`);

  const coordsById = loadLegacyCoords();
  const centroids = loadCountryCentroids();

  interface OutRecord extends RawRecord {
    lat?: number;
    lng?: number;
    coordSource: "recorded" | "centroid" | "missing";
  }

  // ---- Pass 1: parse every record, detect id collisions ----
  // Collisions are cross-country id clashes (name-based ids like
  // "brest-rail" in BY+FR) plus intentional dual listings (Ercan CY/TR,
  // Simferopol RU/UA). No record is ever dropped: colliding ids are
  // country-scoped to stay globally unique.
  const parsed: { file: string; rec: RawRecord }[] = [];
  const idCounts = new Map<string, number>();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
    for (const lit of extractObjects(stripComments(raw))) {
      const rec = parseRecord(lit, file);
      if (!rec) continue;
      parsed.push({ file, rec });
      idCounts.set(rec.id, (idCounts.get(rec.id) ?? 0) + 1);
    }
  }
  if (errors.length) {
    console.error(`generate-destinations: ${errors.length} error(s)`);
    for (const e of errors.slice(0, 40)) console.error("  " + e);
    process.exit(1);
  }

  const collisions = [...idCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();

  // ---- Pass 2: enrich + emit ----
  const out: OutRecord[] = [];
  const seenIds = new Set<string>();
  const perFile: Record<string, number> = {};
  const perCategory: Record<string, number> = { air: 0, rail: 0, sea: 0, bus: 0 };
  const perCountry = new Map<string, number>();
  const coordStats = { recorded: 0, centroid: 0, missing: 0 };
  const renamed: string[] = [];
  const iataRejected: string[] = [];

  for (const { file, rec } of parsed) {
    const originalId = rec.id;
    const collides = (idCounts.get(originalId) ?? 0) > 1;
    const finalId = collides
      ? `${rec.countryCode.toLowerCase()}-${originalId}`
      : originalId;
    if (seenIds.has(finalId)) {
      fail(`duplicate final id "${finalId}" (in ${file})`);
      continue;
    }
    seenIds.add(finalId);
    if (finalId !== originalId) renamed.push(`${originalId} -> ${finalId}`);

    // Non-IATA codes (3-4 letters that are ICAO-style, e.g. UGMS) are
    // dropped from `iata` — an IATA field must hold a real IATA code.
    let iata = rec.iata;
    if (iata !== undefined && !/^[A-Z]{3}$/.test(iata)) {
      iataRejected.push(`${finalId}: "${iata}" is not an IATA code`);
      iata = undefined;
    }

    const exact = coordsById.get(`${rec.countryCode}:${originalId}`);
    const centroid = centroids.get(rec.countryCode);
    const rec2: OutRecord = {
      ...rec,
      id: finalId,
      iata,
      coordSource: exact ? "recorded" : centroid ? "centroid" : "missing",
      ...(exact
        ? { lat: exact.lat, lng: exact.lng }
        : centroid
          ? { lat: centroid.lat, lng: centroid.lng }
          : {}),
    };
    coordStats[rec2.coordSource] += 1;

    out.push(rec2);
    perCategory[rec2.category] = (perCategory[rec2.category] ?? 0) + 1;
    perCountry.set(rec2.countryCode, (perCountry.get(rec2.countryCode) ?? 0) + 1);
    perFile[file] = (perFile[file] ?? 0) + 1;
  }

  if (errors.length) {
    console.error(`generate-destinations: ${errors.length} error(s)`);
    for (const e of errors.slice(0, 40)) console.error("  " + e);
    process.exit(1);
  }

  out.sort((a, b) => a.countryCode.localeCompare(b.countryCode) || a.category.localeCompare(b.category) || a.id.localeCompare(b.id));

  const header = `/* ============================================================
 * AUTO-GENERATED by scripts/generate-destinations.ts — DO NOT EDIT.
 * Source: ${files.length} files in Travel '.ts'/EU (read-only).
 * Records: ${out.length}
 * Coords: ${coordStats.recorded} recorded / ${coordStats.centroid} centroid / ${coordStats.missing} missing
 * ============================================================ */

export type TerminalCategory = "air" | "rail" | "sea" | "bus";
export type CoordSource = "recorded" | "centroid" | "missing";

export interface Terminal {
  id: string;
  name: string;
  displayName: string;
  country: string;
  countryCode: string;
  category: TerminalCategory;
  city?: string;
  region?: string;
  iata?: string;
  timezone?: string;
  tags: string[];
  /** WGS84 — see coordSource for how it was obtained. */
  lat?: number;
  lng?: number;
  coordSource: CoordSource;
}

export const TERMINALS: Terminal[] = `;

  const body =
    "[\n" +
    out
      .map((r) => "  " + JSON.stringify(r))
      .join(",\n") +
    "\n];\n\n" +
    `export const TERMINAL_STATS = {
  total: ${out.length},
  sourceFiles: ${files.length},
  byCategory: ${JSON.stringify(perCategory)},
  countries: ${perCountry.size},
  coords: ${JSON.stringify(coordStats)},
  generatedAt: ${JSON.stringify(new Date().toISOString())},
} as const;
`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, header + body, "utf8");

  console.log("generate-destinations: OK");
  console.log(`  files: ${files.length}, records: ${out.length}`);
  console.log(`  by category: ${JSON.stringify(perCategory)}`);
  console.log(`  countries: ${perCountry.size}`);
  console.log(
    `  coords: ${coordStats.recorded} recorded / ${coordStats.centroid} centroid / ${coordStats.missing} missing`
  );
  if (collisions.length) {
    console.log(`  id collisions country-scoped: ${collisions.join(", ")}`);
    console.log(`  renames: ${renamed.join(", ")}`);
  }
  if (iataRejected.length) {
    console.log(`  non-IATA codes dropped from iata: ${iataRejected.join("; ")}`);
  }
  console.log(`  output: ${path.relative(ROOT, OUT_FILE)} (${(fs.statSync(OUT_FILE).size / 1024).toFixed(0)} KB)`);
  console.log(
    `  smallest files: ${Object.entries(perFile).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([f, c]) => `${f}=${c}`).join(", ")}`
  );
}

main();
