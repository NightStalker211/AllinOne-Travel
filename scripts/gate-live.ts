// ============================================================
// gate-live.ts — the live-integrations gate (spec §5.5 addendum).
//
// Runs the BUILT app under Playwright (Electron) and verifies the
// three keyless live features actually reach their APIs and render
// honestly:
//   1. Nominatim geocoding — an unknown place ("Rjukan") appears in
//      the hero autocomplete marked data-source="osm".
//   2. Open-Meteo weather — the destination strip renders real
//      forecast chips on /search.
//   3. Transitous live schedules — the rail and bus panels show the
//      live block, and every live row carries data-row-live="1"
//      (times only from this session's response).
// Also fails on any page error. Network down => FAIL (the feature
// could not be verified — rerun when the service is reachable).
//
// Run: npm run build && npx tsx scripts/gate-live.ts
// ============================================================

import { _electron as electron } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const ROOT = process.cwd();
  const EVIDENCE = path.join(ROOT, "scripts", "evidence");
  fs.mkdirSync(EVIDENCE, { recursive: true });

  const errors: string[] = [];
  const failures: string[] = [];
  const checks: Record<string, unknown> = {};

  const app = await electron.launch({
    args: [".", "--force-prod"],
    env: { ...process.env, ALLINONE_FORCE_PROD: "1" },
  });
  const page = await app.firstWindow();
  page.on("pageerror", (err) => errors.push(String(err)));

  // ---------- 1. Nominatim geocoding in the hero autocomplete ----------
  await page.waitForSelector('[data-testid="home"]', { timeout: 15000 });
  await page.waitForSelector("#from", { timeout: 15000 });
  await page.click("#from");
  let osmSeen = false;
  for (let attempt = 1; attempt <= 5 && !osmSeen; attempt++) {
    await page.fill("#from", "Rjukan");
    osmSeen = await page
      .waitForSelector('[data-testid="ac-option-from"][data-source="osm"]', {
        timeout: 6000,
      })
      .then(() => true)
      .catch(() => false);
    if (!osmSeen) await page.waitForTimeout(500);
  }
  checks.osmGeocode = osmSeen;
  if (!osmSeen) failures.push("Nominatim: no OSM option for 'Rjukan'");
  await page.screenshot({ path: path.join(EVIDENCE, "int2-osm-geocode.png") });
  await page.keyboard.press("Escape");

  // ---------- /search: weather strip + live schedules ----------
  const date = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
  const base = page.url().replace(/\/$/, "");
  const searchUrl =
    `${base}/search?` +
    new URLSearchParams({
      from: "Berlin,DE",
      to: "Paris,FR",
      date,
      pax: "1",
      cur: "EUR",
      nat: "DE",
    }).toString();

  await page.goto(searchUrl);
  await page.waitForSelector('[data-testid="search-page"]', { timeout: 15000 });

  // 2. Open-Meteo weather strip
  let weatherOk = true;
  try {
    await page.waitForSelector('[data-testid="weather-strip"]', {
      timeout: 12000,
    });
    const days = await page.locator('[data-testid="weather-day"]').count();
    checks.weatherDays = days;
    if (days < 1) weatherOk = false;
  } catch {
    weatherOk = false;
  }
  checks.weatherStrip = weatherOk;
  if (!weatherOk) failures.push("Open-Meteo: weather strip missing");
  await page.screenshot({ path: path.join(EVIDENCE, "int2-weather.png") });

  // 3a. Rail live schedules
  await page.click('[data-testid="tab-rail"]');
  await page.waitForSelector('[data-testid="panel-rail"]', { timeout: 8000 });
  let railLive = true;
  try {
    await page.waitForSelector('[data-testid="live-rail-schedules"]', {
      timeout: 15000,
    });
    const badRows = await page
      .locator(
        '[data-testid="live-rail-schedules"] [data-testid="result-row"][data-row-live="0"]'
      )
      .count();
    if (badRows > 0) {
      railLive = false;
      failures.push(`rail: ${badRows} live-schedule row(s) not marked data-row-live=1`);
    }
  } catch {
    railLive = false;
    failures.push("Transitous: live rail schedules block missing");
  }
  checks.liveRail = railLive;
  await page.screenshot({ path: path.join(EVIDENCE, "int2-live-rail.png") });

  // 3b. Bus live schedules (Berlin–Paris has FlixBus coach legs)
  await page.click('[data-testid="tab-bus"]');
  await page.waitForSelector('[data-testid="panel-bus"]', { timeout: 8000 });
  let busLive = true;
  try {
    await page.waitForSelector('[data-testid="live-bus-schedules"]', {
      timeout: 15000,
    });
    const badRows = await page
      .locator(
        '[data-testid="live-bus-schedules"] [data-testid="result-row"][data-row-live="0"]'
      )
      .count();
    if (badRows > 0) {
      busLive = false;
      failures.push(`bus: ${badRows} live-schedule row(s) not marked data-row-live=1`);
    }
  } catch {
    busLive = false;
    failures.push("Transitous: live bus schedules block missing");
  }
  checks.liveBus = busLive;
  await page.screenshot({ path: path.join(EVIDENCE, "int2-live-bus.png") });

  await app.close();

  checks.pageErrors = errors.length;
  checks.failures = failures.length;
  console.log(JSON.stringify(checks, null, 2));
  if (failures.length) console.log("failures:", failures);
  if (errors.length) console.log("page errors:", errors);
  console.log("screenshots: scripts/evidence/int2-*.png");

  const pass = failures.length === 0 && errors.length === 0;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
