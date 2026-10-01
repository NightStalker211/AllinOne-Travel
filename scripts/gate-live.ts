// ============================================================
// gate-live.ts — the live-integrations gate (spec §5.5 addendum).
//
// Runs the BUILT app under Playwright (Electron) and verifies the
// keyless live features actually reach their APIs and render
// honestly:
//   1. Nominatim geocoding — an unknown place ("Rjukan") appears in
//      the hero autocomplete marked data-source="osm".
//   2. Open-Meteo weather — the destination strip renders real
//      forecast chips on /search.
//   3. Transitous live schedules — the rail and bus panels show the
//      live block, and every live row carries data-row-live="1"
//      (times only from this session's response).
//   4. OSRM driving route — the Multi-modal tab shows this session's
//      road distance with the "Live · OSRM" source line.
//   5. Overpass nearby sights — named OpenStreetMap POIs render for
//      the destination with the OSM attribution line.
//   6. Frankfurter/ECB reference rate — the Iceland panel shows the
//      dated "ECB reference rate" line next to the curated facts
//      (RapidAPI Currency fallback accepted with its own attribution).
//   7. AviationStack departures — the Flights tab board renders in
//      the ok state; with rows, the "Live · AviationStack" line.
//   8. Booking.com live hotel rates — the Stays tab shows priced
//      rows, every figure inside [data-live-price] with the
//      "Live · Booking.com" badge (REBUILD §5.1.3).
//   9. Travel Advisor sights — the Zurich sights card carries the
//      live-rated section with the "Live · Travel Advisor" line.
//   10. Transport for London — Paris→London rail tab shows live
//      line statuses with the TfL attribution.
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

  // 3. OSRM driving route (Multi-modal tab is the default panel)
  await page.click('[data-testid="tab-multi"]');
  await page.waitForSelector('[data-testid="panel-multi"]', { timeout: 8000 });
  let driveOk = true;
  try {
    await page.waitForSelector(
      '[data-testid="drive-route"][data-drive-state="ok"]',
      { timeout: 15000 }
    );
    const source = await page
      .locator('[data-testid="drive-source"]')
      .textContent();
    const knownRouter = ["Live · OSRM", "Live · GraphHopper", "Live · OpenRouteService"].some(
      (s) => source?.includes(s)
    );
    if (!knownRouter) {
      driveOk = false;
      failures.push(`OSRM: source line wrong: "${source}"`);
    }
  } catch {
    driveOk = false;
    failures.push("OSRM: drive route card did not render a live route");
  }
  checks.osrmDrive = driveOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int2-drive-route.png") });

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

  // 3c. AviationStack live departure board (Flights tab, origin BER)
  await page.click('[data-testid="tab-flights"]');
  await page.waitForSelector('[data-testid="panel-flights"]', { timeout: 8000 });
  let departuresOk = true;
  try {
    await page.waitForSelector(
      '[data-testid="departures-card"][data-departures-state="ok"]',
      { timeout: 20000 }
    );
    const depRows = await page.locator('[data-testid="departure-row"]').count();
    checks.departuresRows = depRows;
    if (depRows > 0) {
      const depSource = await page
        .locator('[data-testid="departures-source"]')
        .textContent();
      if (!depSource?.includes("AviationStack")) {
        departuresOk = false;
        failures.push(`AviationStack: source line wrong: "${depSource}"`);
      }
    }
  } catch {
    departuresOk = false;
    failures.push("AviationStack: departures board did not reach the ok state");
  }
  checks.aviationstackDepartures = departuresOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int7-departures.png") });

  // 3d. Booking.com live hotel rates (Stays tab)
  await page.click('[data-testid="tab-stays"]');
  await page.waitForSelector('[data-testid="stays-panel"]', { timeout: 8000 });
  let hotelsOk = true;
  try {
    await page.waitForSelector(
      '[data-testid="live-hotels"][data-hotels-state="ok"]',
      { timeout: 25000 }
    );
    const hotelRows = await page.locator('[data-testid="live-hotel-row"]').count();
    checks.hotelRows = hotelRows;
    if (hotelRows < 1) {
      hotelsOk = false;
      failures.push("Booking: ok state but zero priced hotel rows");
    } else {
      const liveFigures = await page
        .locator('[data-testid="live-hotel-row"] [data-live-price]')
        .count();
      if (liveFigures < hotelRows) {
        hotelsOk = false;
        failures.push(
          `Booking: ${hotelRows} rows but only ${liveFigures} [data-live-price] figures`
        );
      }
      const badge = await page
        .locator('[data-testid="live-hotel-row"] [data-testid="price-badge"]')
        .first()
        .textContent();
      if (!badge?.includes("Live · Booking.com")) {
        hotelsOk = false;
        failures.push(`Booking: price badge wrong: "${badge}"`);
      }
    }
  } catch {
    hotelsOk = false;
    failures.push("Booking: live hotel rates did not reach the ok state");
  }
  checks.bookingLiveHotels = hotelsOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int7-hotel-rates.png") });

  // 4. Overpass nearby sights — checked on a Swiss destination because
  //    overpass.osm.ch (fast, reliable, CORS-enabled) answers first for
  //    CH; the general public mirrors are congested too often to make
  //    them a hard gate. Berlin–Paris stays the route for checks 2–3.
  let sightsOk = true;
  const chUrl =
    `${base}/search?` +
    new URLSearchParams({
      from: "Berlin,DE",
      to: "Zurich,CH",
      date,
      pax: "1",
      cur: "EUR",
      nat: "DE",
    }).toString();
  await page.goto(chUrl);
  await page.waitForSelector('[data-testid="panel-multi"]', { timeout: 15000 });
  try {
    await page.waitForSelector(
      '[data-testid="nearby-sights"][data-poi-state="ok"]',
      { timeout: 30000 }
    );
    const rows = await page.locator('[data-testid="sight-row"]').count();
    checks.sightRows = rows;
    if (rows < 1) {
      sightsOk = false;
      failures.push("Overpass: card rendered but zero sight rows");
    }
    const poiSource = await page
      .locator('[data-testid="sights-source"]')
      .textContent();
    if (!poiSource?.includes("OpenStreetMap")) {
      sightsOk = false;
      failures.push(`Overpass: source line wrong: "${poiSource}"`);
    }
  } catch {
    sightsOk = false;
    failures.push("Overpass: nearby sights card did not render");
  }
  checks.overpassSights = sightsOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int2-nearby-sights.png") });

  // 4b. Travel Advisor live-rated section (same sights card)
  let taOk = true;
  try {
    await page.waitForSelector('[data-testid="sights-ta"]', { timeout: 25000 });
    const taRows = await page.locator('[data-testid="sights-ta-row"]').count();
    checks.taRows = taRows;
    if (taRows < 1) {
      taOk = false;
      failures.push("Travel Advisor: section rendered but zero rows");
    }
    const taSource = await page
      .locator('[data-testid="sights-ta-source"]')
      .textContent();
    if (!taSource?.includes("Travel Advisor")) {
      taOk = false;
      failures.push(`Travel Advisor: source line wrong: "${taSource}"`);
    }
  } catch {
    taOk = false;
    failures.push("Travel Advisor: rated sights section did not render");
  }
  checks.travelAdvisorSights = taOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int7-travel-advisor.png") });

  // 4c. Transport for London line statuses (Paris → London, rail tab)
  const lonUrl =
    `${base}/search?` +
    new URLSearchParams({
      from: "Paris,FR",
      to: "London,GB",
      date,
      pax: "1",
      cur: "EUR",
      nat: "DE",
    }).toString();
  await page.goto(lonUrl);
  await page.waitForSelector('[data-testid="panel-multi"]', { timeout: 15000 });
  await page.click('[data-testid="tab-rail"]');
  await page.waitForSelector('[data-testid="panel-rail"]', { timeout: 8000 });
  let tflOk = true;
  try {
    await page.waitForSelector(
      '[data-testid="tfl-status"][data-tfl-state="ok"]',
      { timeout: 20000 }
    );
    const tflSource = await page
      .locator('[data-testid="tfl-source"]')
      .textContent();
    if (!tflSource?.includes("Transport for London")) {
      tflOk = false;
      failures.push(`TfL: source line wrong: "${tflSource}"`);
    }
  } catch {
    tflOk = false;
    failures.push("TfL: network status card did not reach the ok state");
  }
  checks.tflStatus = tflOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int7-tfl.png") });

  // 5. Explore: curated capital facts + live ECB reference rate.
  //    Iceland (ISK) differs from the default quote currency (EUR),
  //    so the dated Frankfurter line must appear.
  await page.goto(`${base}/explore/is`);
  await page.waitForSelector('[data-testid="country-panel"]', { timeout: 15000 });
  let factsOk = true;
  try {
    await page.waitForSelector('[data-testid="country-facts"]', {
      timeout: 8000,
    });
    const capital = await page
      .locator('[data-testid="country-capital"]')
      .textContent();
    if (!capital?.includes("Reykjavík")) {
      factsOk = false;
      failures.push(`country facts: unexpected capital "${capital}"`);
    }
    await page.waitForSelector('[data-testid="country-fx"]', {
      timeout: 12000,
    });
    const fx = await page.locator('[data-testid="country-fx"]').textContent();
    const attributed =
      fx?.includes("ECB reference rate") ||
      fx?.includes("Currency API via RapidAPI");
    if (!attributed) {
      factsOk = false;
      failures.push(`FX line missing attribution: "${fx}"`);
    }
  } catch {
    factsOk = false;
    failures.push("Explore facts: capital or ECB reference line missing");
  }
  checks.curatedFactsAndFx = factsOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int2-country-fx.png") });

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
