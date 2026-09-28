// gate-empty-state.ts — empty-fare honesty gate (REBUILD §5.1 addendum).
// Intercepts /api/tp/* to force (a) an empty data response and (b) an HTTP
// error, asserting the app renders the honest warning card + direct
// Aviasales/Trip.com links (marker, date pre-filled) and NEVER a price
// figure. A synthetic/mock fare appearing here fails the gate.
//
// Run: npm run build && npx tsx scripts/gate-empty-state.ts   (part of verify)

import path from "node:path";
import { _electron as electron, type Page } from "playwright";

const EVIDENCE = path.join(process.cwd(), "scripts", "evidence");
const failures: string[] = [];

function assert(cond: boolean, msg: string) {
  if (!cond) failures.push(msg);
}

async function checkState(
  page: Page,
  base: string,
  mode: "empty" | "error",
  expectTitle: string
) {
  let routeHits = 0;
  await page.unroute("**/api/tp/**").catch(() => {});
  await page.route("**/api/tp/**", async (route) => {
    routeHits += 1;
    if (mode === "empty") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [], currency: "eur" }),
      });
    } else {
      await route.fulfill({ status: 500, body: "boom" });
    }
  });

  const date = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
  const url =
    `${base}/search?` +
    new URLSearchParams({
      from: "Berlin,DE",
      to: "Paris,FR",
      date,
      pax: "1",
      cur: "EUR",
      nat: "DE",
      // Distinct URL per state so the SPA always remounts fresh.
      nb: `${mode}-${Date.now()}`,
    }).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // The card lives on the Flights tab (default tab is Multi).
  await page.waitForSelector('[data-testid="tab-flights"]', { timeout: 15000 });
  await page.click('[data-testid="tab-flights"]');
  await page.waitForSelector('[data-testid="panel-flights"]', { timeout: 8000 });

  const card = page.locator('[data-testid="flights-live-empty"]');
  try {
    await card.waitFor({ state: "visible", timeout: 20000 });
  } catch {
    const diag = {
      mode,
      routeHits,
      flightsPanel: await page.locator('[data-testid="panel-flights"]').count(),
      multiPanel: await page.locator('[data-testid="panel-multi"]').count(),
      priceFigures: await page.locator('[data-testid="price-figure"]').count(),
      sortNote: ((await page.locator('[data-testid="sort-note"]').first().textContent().catch(() => null)) ?? "").slice(0, 140),
      skeletons: await page.locator('[data-testid="skeleton-rows"]').count(),
    };
    await page.screenshot({ path: path.join(EVIDENCE, `p5-fail-${mode}.png`) });
    failures.push(`${mode}: empty-state card did not appear ${JSON.stringify(diag)}`);
    return;
  }

  const title = (await page.locator('[data-testid="live-empty-title"]').textContent()) ?? "";
  assert(title.includes(expectTitle), `${mode}: title "${title}" != "${expectTitle}"`);

  const links = page.locator('[data-testid="live-search-link"]');
  const n = await links.count();
  assert(n === 2, `${mode}: expected 2 live-search links, got ${n}`);
  for (let i = 0; i < n; i++) {
    const href = (await links.nth(i).getAttribute("href")) ?? "";
    assert(
      href.includes("marker=782929"),
      `${mode}: link missing marker: ${href}`
    );
    assert(
      href.includes("aviasales.com") || href.includes("trip.com"),
      `${mode}: unexpected link host: ${href}`
    );
  }

  const prices = await page.locator('[data-testid="price-figure"]').count();
  assert(prices === 0, `${mode}: ${prices} price figures rendered in empty state`);

  // Aviasales encodes the date as DDMM inside the path; Trip.com carries
  // the full ISO date. Either form proves the date was prefilled.
  const ddmm = date.slice(8, 10) + date.slice(5, 7);
  for (let i = 0; i < n; i++) {
    const href = (await links.nth(i).getAttribute("href")) ?? "";
    assert(
      href.includes(date) || href.includes(ddmm),
      `${mode}: link missing date: ${href}`
    );
  }

  await page.screenshot({
    path: path.join(EVIDENCE, `p5-live-empty-${mode}.png`),
    fullPage: false,
  });
}

async function main() {
  const app = await electron.launch({
    args: [".", "--force-prod"],
    env: { ...process.env, ALLINONE_FORCE_PROD: "1" },
  });
  const page = await app.firstWindow();
  const pageErrors: string[] = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.waitForSelector('[data-testid="home"]', { timeout: 20000 });
  const base = page.url().replace(/\/$/, "");

  await checkState(
    page,
    base,
    "empty",
    "No live fare data for this route and date in the last 48 hours."
  );
  await checkState(page, base, "error", "Live fare source unavailable — no prices shown.");

  assert(pageErrors.length === 0, `page errors: ${pageErrors.join(" | ")}`);
  await app.close();

  if (failures.length) {
    console.error("EMPTY-STATE CHECK: FAIL");
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
  console.log("EMPTY-STATE CHECK: PASS");
  console.log(
    JSON.stringify(
      {
        emptyCard: "shown with honest 48h message",
        errorCard: "shown with source-unavailable message",
        liveSearchLinks: 2,
        marker: "782929 on every link",
        priceFigures: 0,
        pageErrors: 0,
      },
      null,
      2
    )
  );
  console.log("screenshots: scripts/evidence/p5-live-empty-*.png");
}

main().catch((err) => {
  console.error("EMPTY-STATE CHECK: ERROR", err);
  process.exit(1);
});
