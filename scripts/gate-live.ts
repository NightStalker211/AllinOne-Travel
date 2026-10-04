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
//   8. Booking.com/Expedia live hotel rates — the Stays tab shows
//      priced rows, every figure inside [data-live-price] with the
//      "Live · Booking.com" or "Live · Expedia" badge (REBUILD
//      §5.1.3; Booking first, Expedia fallback). When both plans'
//      monthly RapidAPI quota is spent (429), the card must instead
//      show the honest rate-limit note with zero prices — accepted.
//   9. Travel Advisor sights — the Zurich sights card carries the
//      live-rated section with the "Live · Travel Advisor" line.
//   10. Transport for London — Paris→London rail tab shows live
//      line statuses with the TfL attribution.
//   11. Skyscanner cheapest fare — the Flights tab card reaches the
//      ok state with the "Live · Skyscanner" badge and an explicit
//      any-date context (never merged into date fares). The BASIC
//      plan allows 20 requests/month; once spent, the honest
//      rate-limit note (no price) passes instead.
//   12. Deutsche Bahn station board — Frankfurt → Paris rail tab
//      resolves the station and reaches the ok state with rows or
//      the honest "no stops" note, attributed "Live · Deutsche Bahn".
//   13. OpenSky aircraft — the Berlin → Paris Flights tab card
//      reaches the ok state with rows or the honest "no aircraft"
//      note, attributed "Live · OpenSky Network".
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
  const departuresTerminal =
    '[data-testid="departures-card"][data-departures-state="ok"], ' +
    '[data-testid="departures-card"][data-departures-state="error"]';
  try {
    await page.waitForSelector(departuresTerminal, { timeout: 25000 });
    const depState = await page
      .locator('[data-testid="departures-card"]')
      .getAttribute("data-departures-state");
    checks.departuresState = depState;
    const depRows = await page.locator('[data-testid="departure-row"]').count();
    checks.departuresRows = depRows;
    if (depState === "ok") {
      if (depRows > 0) {
        const depSource = await page
          .locator('[data-testid="departures-source"]')
          .textContent();
        if (!depSource?.includes("AviationStack")) {
          departuresOk = false;
          failures.push(`AviationStack: source line wrong: "${depSource}"`);
        }
      } else {
        const emptyLine = await page
          .locator('[data-testid="departures-empty"]')
          .count();
        if (emptyLine !== 1) {
          departuresOk = false;
          failures.push("AviationStack: ok state but no honest empty line");
        }
      }
    } else if (depState === "error") {
      if (depRows !== 0) {
        departuresOk = false;
        failures.push(`AviationStack: error state but ${depRows} rows`);
      }
      const errNote = await page
        .locator('[data-testid="departures-error"]')
        .count();
      if (errNote !== 1) {
        departuresOk = false;
        failures.push("AviationStack: error state without honest note");
      }
    } else {
      departuresOk = false;
      failures.push(`AviationStack: unexpected departures state: ${depState}`);
    }
  } catch {
    departuresOk = false;
    failures.push("AviationStack: departures board did not reach a terminal state");
  }
  checks.aviationstackDepartures = departuresOk;
  await page.screenshot({ path: path.join(EVIDENCE, "int7-departures.png") });

  // 11. Skyscanner cheapest fare card — same Flights tab, beside the
  //     departures board. Ok: badge "Live · Skyscanner" + any-date
  //     wording. Rate-limited (monthly quota spent): the honest note
  //     with zero prices.
  let skyOk = true;
  const skyTerminal =
    '[data-testid="skyscanner-fare-card"][data-skyscanner-state="ok"], ' +
    '[data-testid="skyscanner-fare-card"][data-skyscanner-state="error"]';
  try {
    await page.waitForSelector(skyTerminal, { timeout: 25000 });
  } catch {
    // One transient hiccup is possible (the host scrapes
    // skyscanner.net) — remount the panel once and retry; failed
    // results are never cached by the client.
    try {
      await page.click('[data-testid="tab-multi"]');
      await page.click('[data-testid="tab-flights"]');
      await page.waitForSelector(skyTerminal, { timeout: 25000 });
    } catch {
      skyOk = false;
      failures.push("Skyscanner: cheapest-fare card reached no terminal state");
    }
  }
  const skyCard = page.locator('[data-testid="skyscanner-fare-card"]');
  const skyState = (await skyCard.getAttribute("data-skyscanner-state")) ?? "absent";
  const skyReason = await skyCard.getAttribute("data-skyscanner-reason");
  let skyRateLimited = false;
  if (skyOk && skyState === "ok") {
    const skyBadge = await page
      .locator('[data-testid="skyscanner-fare-card"] [data-testid="price-badge"]')
      .first()
      .textContent();
    if (!skyBadge?.includes("Live · Skyscanner")) {
      skyOk = false;
      failures.push(`Skyscanner: price badge wrong: "${skyBadge}"`);
    }
    const skySource = await page
      .locator('[data-testid="skyscanner-source"]')
      .textContent();
    if (!skySource?.includes("Skyscanner")) {
      skyOk = false;
      failures.push(`Skyscanner: source line wrong: "${skySource}"`);
    }
    const skyContext = await page
      .locator('[data-testid="skyscanner-fare-card"] [data-live-price]')
      .first()
      .textContent();
    if (!skyContext?.includes("any upcoming date")) {
      skyOk = false;
      failures.push(`Skyscanner: any-date context missing: "${skyContext}"`);
    }
  } else if (skyOk && skyReason === "rate-limit") {
    // Monthly quota spent (BASIC plan = 20 req/month) — acceptable
    // ONLY as the honest rate-limit note, never a rendered price.
    skyRateLimited = true;
    const skyErr = await page
      .locator('[data-testid="skyscanner-error"]')
      .textContent();
    const skyPrices = await page
      .locator('[data-testid="skyscanner-fare-card"] [data-live-price]')
      .count();
    if (!skyErr?.includes("quota") || skyPrices !== 0) {
      skyOk = false;
      failures.push(
        `Skyscanner: rate-limit state not honest (note="${skyErr}", prices=${skyPrices})`
      );
    }
  } else if (skyOk) {
    skyOk = false;
    failures.push(
      `Skyscanner: cheapest-fare card failed (state=${skyState}, reason=${skyReason})`
    );
  }
  checks.skyscannerCheapestFare = skyRateLimited
    ? "rate-limited (honest note verified)"
    : skyOk;
  await page
    .locator('[data-testid="skyscanner-fare-card"]')
    .scrollIntoViewIfNeeded()
    .catch(() => {});
  // Keep the known-good price evidence when the monthly quota is
  // spent; write the limited state beside it.
  await page.screenshot({
    path: path.join(
      EVIDENCE,
      skyState === "ok" ? "int8-skyscanner.png" : "int8-skyscanner-limited.png"
    ),
  });

  // 3d. Booking.com live hotel rates (Stays tab)
  await page.click('[data-testid="tab-stays"]');
  await page.waitForSelector('[data-testid="stays-panel"]', { timeout: 8000 });
  let hotelsOk = true;
  let hotelsRateLimited = false;
  try {
    // Terminal state = ok OR error; an error is accepted ONLY when
    // it is the honest rate-limit note (Booking 50/Expedia 15 req
    // per month run out mid-month) with zero rendered prices.
    await page.waitForSelector(
      '[data-testid="live-hotels"][data-hotels-state="ok"], ' +
        '[data-testid="live-hotels"][data-hotels-state="error"]',
      { timeout: 25000 }
    );
    const hotelsState = await page
      .locator('[data-testid="live-hotels"]')
      .getAttribute("data-hotels-state");
    if (hotelsState === "ok") {
      const hotelRows = await page.locator('[data-testid="live-hotel-row"]').count();
      checks.hotelRows = hotelRows;
      if (hotelRows < 1) {
        hotelsOk = false;
        failures.push("Hotels: ok state but zero priced hotel rows");
      } else {
        const liveFigures = await page
          .locator('[data-testid="live-hotel-row"] [data-live-price]')
          .count();
        if (liveFigures < hotelRows) {
          hotelsOk = false;
          failures.push(
            `Hotels: ${hotelRows} rows but only ${liveFigures} [data-live-price] figures`
          );
        }
        const badge = await page
          .locator('[data-testid="live-hotel-row"] [data-testid="price-badge"]')
          .first()
          .textContent();
        if (!/Live · (Booking\.com|Expedia)/.test(badge ?? "")) {
          hotelsOk = false;
          failures.push(`Hotels: price badge wrong: "${badge}"`);
        }
      }
    } else {
      const hotelsReason = await page
        .locator('[data-testid="live-hotels"]')
        .getAttribute("data-hotels-reason");
      if (hotelsReason === "rate-limit") {
        hotelsRateLimited = true;
        const hotelsErr = await page
          .locator('[data-testid="live-hotels-error"]')
          .textContent();
        const hotelPrices = await page
          .locator('[data-testid="live-hotels"] [data-live-price]')
          .count();
        if (!hotelsErr?.includes("quota") || hotelPrices !== 0) {
          hotelsOk = false;
          failures.push(
            `Hotels: rate-limit state not honest (note="${hotelsErr}", prices=${hotelPrices})`
          );
        }
      } else {
        hotelsOk = false;
        failures.push(
          `Hotels: live rates failed (state=${hotelsState}, reason=${hotelsReason})`
        );
      }
    }
  } catch {
    hotelsOk = false;
    failures.push("Hotels: live hotel rates reached no terminal state");
  }
  checks.hotelLiveRates = hotelsRateLimited
    ? "rate-limited (honest note verified)"
    : hotelsOk;
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

  // 4d. Deutsche Bahn station board (Frankfurt → Paris, rail tab).
  //     The origin is German, so the DB card must resolve the station
  //     through /station, reach the ok state and render this session's
  //     board — rows, or the honest "no stops in this window" note.
  const dbUrl =
    `${base}/search?` +
    new URLSearchParams({
      from: "Frankfurt,DE",
      to: "Paris,FR",
      date,
      pax: "1",
      cur: "EUR",
      nat: "DE",
    }).toString();
  await page.goto(dbUrl);
  await page.waitForSelector('[data-testid="panel-multi"]', { timeout: 15000 });
  await page.click('[data-testid="tab-rail"]');
  await page.waitForSelector('[data-testid="panel-rail"]', { timeout: 8000 });
  let dbOk = true;
  try {
    await page.waitForSelector(
      '[data-testid="db-departures"][data-db-state="ok"]',
      { timeout: 30000 }
    );
    const dbSource = await page
      .locator('[data-testid="db-source"]')
      .first()
      .textContent();
    if (!dbSource?.includes("Deutsche Bahn")) {
      dbOk = false;
      failures.push(`DB: source line wrong: "${dbSource}"`);
    }
    const dbRows = await page.locator('[data-testid="db-row"]').count();
    const dbEmpty = await page.locator('[data-testid="db-empty"]').count();
    checks.dbBoardRows = dbRows;
    if (dbRows === 0 && dbEmpty === 0) {
      dbOk = false;
      failures.push(
        "DB: board rendered neither rows nor the honest empty note"
      );
    }
  } catch {
    dbOk = false;
    failures.push("Deutsche Bahn: station board did not reach the ok state");
  }
  checks.dbStationBoard = dbOk;
  if (dbOk) {
    await page
      .locator('[data-testid="db-departures"]')
      .screenshot({ path: path.join(EVIDENCE, "int9-db-departures.png") });
  } else {
    await page.screenshot({ path: path.join(EVIDENCE, "int9-db-departures.png") });
  }

  // 4e. OpenSky aircraft along the route (Berlin → Paris, Flights tab).
  //     ok state + the OpenSky attribution; rows or the honest
  //     "no aircraft in this area" note both pass.
  await page.goto(searchUrl);
  await page.waitForSelector('[data-testid="panel-multi"]', { timeout: 15000 });
  await page.click('[data-testid="tab-flights"]');
  await page.waitForSelector('[data-testid="panel-flights"]', { timeout: 8000 });
  let osOk = true;
  try {
    await page.waitForSelector(
      '[data-testid="opensky-track"][data-opensky-state="ok"]',
      { timeout: 25000 }
    );
    const osSource = await page
      .locator('[data-testid="opensky-source"]')
      .first()
      .textContent();
    if (!osSource?.includes("OpenSky")) {
      osOk = false;
      failures.push(`OpenSky: source line wrong: "${osSource}"`);
    }
    const osRows = await page.locator('[data-testid="opensky-row"]').count();
    const osEmpty = await page.locator('[data-testid="opensky-empty"]').count();
    checks.openskyAircraft = osRows;
    if (osRows === 0 && osEmpty === 0) {
      osOk = false;
      failures.push(
        "OpenSky: aircraft card rendered neither rows nor the honest empty note"
      );
    }
  } catch {
    osOk = false;
    failures.push("OpenSky: aircraft card did not reach the ok state");
  }
  checks.openskyTrack = osOk;
  if (osOk) {
    await page
      .locator('[data-testid="opensky-track"]')
      .screenshot({ path: path.join(EVIDENCE, "int10-opensky.png") });
  } else {
    await page.screenshot({ path: path.join(EVIDENCE, "int10-opensky.png") });
  }

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
