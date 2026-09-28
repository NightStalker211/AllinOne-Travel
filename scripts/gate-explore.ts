// ============================================================
// gate-explore.ts — REBUILD §7 / §12 gate-explore.
//
// Proves the Explore hub works as the ONE place for country info:
//  * the bundled offline map renders (no tile server / API key)
//  * hovering a data country shows name + honest counts
//  * clicking it opens /explore/[cc] with all six panel sections
//  * the country grid gives a non-map path to every data country
//  * the search box works by keyboard alone (map never required)
//  * anchor sub-nav syncs the URL (#carriers)
//  * "Search from this country" deep-links into the pre-filled form
//  * no page errors anywhere
//
// Run: npm run build && npx tsx scripts/gate-explore.ts
// ============================================================

import { _electron as electron, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SECTION_IDS = [
  "overview",
  "terminals",
  "carriers",
  "see-do",
  "entry-rules",
  "local",
] as const;

async function textOf(page: Page, selector: string): Promise<string> {
  return (await page.locator(selector).first().textContent().catch(() => null)) ?? "";
}

async function main() {
  const ROOT = process.cwd();
  const EVIDENCE = path.join(ROOT, "scripts", "evidence");
  fs.mkdirSync(EVIDENCE, { recursive: true });

  const errors: string[] = [];
  const failures: string[] = [];
  const coverage: Record<string, unknown> = {};

  const app = await electron.launch({
    args: [".", "--force-prod"],
    env: { ...process.env, ALLINONE_FORCE_PROD: "1" },
  });
  const page = await app.firstWindow();
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.waitForSelector('[data-testid="home"]', { timeout: 15000 });
  const base = page.url().replace(/\/$/, "");

  // ---------- 1. /explore hub ----------
  await page.goto(`${base}/explore`);
  await page.waitForSelector('[data-testid="explore-page"]', { timeout: 15000 });

  const pathCount = await page.locator('[data-testid="explore-map"] svg path').count();
  if (pathCount < 150) failures.push(`map has only ${pathCount} shapes (need >150)`);

  const gridCount = await page.locator('[data-testid^="grid-country-"]').count();
  if (gridCount < 50) failures.push(`country grid has only ${gridCount} entries (need >=50)`);

  const hasSearch = await page.locator('[data-testid="explore-search-input"]').count();
  if (hasSearch !== 1) failures.push("explore search box missing");

  const hasPrompt = await page.locator('[data-testid="panel-prompt"]').count();
  if (hasPrompt !== 1) failures.push("panel prompt missing on hub");

  coverage.hub = { paths: pathCount, grid: gridCount };
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(EVIDENCE, "p3-gate-explore-hub.png") });

  // ---------- 2. hover tooltip ----------
  await page.locator('[data-testid="map-country-DE"]').hover();
  await page.waitForSelector('[data-testid="map-tooltip"]', { timeout: 5000 });
  const tip = await textOf(page, '[data-testid="map-tooltip"]');
  if (!tip.includes("Germany")) failures.push(`tooltip missing country name: "${tip}"`);
  if (!/terminals.*carriers.*providers/.test(tip.replace(/\s+/g, " "))) {
    failures.push(`tooltip missing counts: "${tip}"`);
  }
  coverage.tooltip = tip.replace(/\s+/g, " ").slice(0, 80);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(EVIDENCE, "p3-gate-map-tooltip.png") });

  // ---------- 3. click → /explore/de with six sections ----------
  await page.locator('[data-testid="map-country-DE"]').click();
  await page.waitForURL(/\/explore\/de\/?$/, { timeout: 10000 });
  await page.waitForSelector('[data-testid="country-panel"]', { timeout: 15000 });

  const sections: Record<string, boolean> = {};
  sections["panel-overview"] = (await page.locator('[data-testid="panel-overview"]').count()) === 1;
  for (const id of SECTION_IDS.slice(1)) {
    sections[id] = (await page.locator(`[data-testid="panel-heading-${id}"]`).count()) === 1;
  }
  for (const [k, ok] of Object.entries(sections)) {
    if (!ok) failures.push(`section missing: ${k}`);
  }

  const navCount = await page.locator('[data-testid^="nav-"]').count();
  if (navCount !== 6) failures.push(`anchor nav has ${navCount} links (need 6)`);

  const termRows = await page.locator('[data-testid="terminal-row"]').count();
  const carrierRows = await page.locator('[data-testid="carrier-row"]').count();
  const providerRows = await page.locator('[data-testid="provider-row"]').count();
  const defunctRows = await page.locator('[data-testid="defunct-row"]').count();
  const discoveryLinks = await page.locator('[data-testid="discovery-link"]').count();
  if (termRows === 0) failures.push("Germany: no terminal rows");
  if (carrierRows === 0) failures.push("Germany: no carrier rows");
  if (providerRows === 0) failures.push("Germany: no provider rows");
  if (defunctRows === 0) failures.push("Germany: expected defunct carriers section");
  if (discoveryLinks < 5) failures.push(`Germany: only ${discoveryLinks} discovery links`);

  // entry rules: nationality select updates the visa card
  const visaBefore = await textOf(page, '[data-testid="visa-panel"]');
  await page.selectOption('[data-testid="explore-nationality"]', "US");
  await page.waitForTimeout(250);
  const visaAfter = await textOf(page, '[data-testid="visa-panel"]');
  if (!visaAfter.includes("United States")) failures.push("nationality change not reflected in visa panel");
  if (visaAfter === visaBefore) failures.push("visa panel did not react to nationality change");

  coverage.germany = { termRows, carrierRows, providerRows, defunctRows, discoveryLinks };
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(EVIDENCE, "p3-gate-germany-panel.png") });

  // ---------- 4. anchor sub-nav syncs URL ----------
  await page.locator('[data-testid="nav-carriers"]').click();
  await page
    .waitForURL(/\/explore\/de\/?#carriers$/, { timeout: 5000 })
    .catch(() => {
      failures.push(`anchor nav did not update URL hash: ${page.url()}`);
    });

  // ---------- 5. quick action → pre-filled search form ----------
  const fromHref = await page
    .locator('[data-testid="action-search-from"]')
    .getAttribute("href");
  if (!fromHref?.includes("from=")) {
    failures.push(`action-search-from href odd: ${fromHref}`);
  } else {
    const expectedCity = decodeURIComponent(fromHref.split("from=")[1]).split(",")[0];
    await page.locator('[data-testid="action-search-from"]').click();
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 15000 });
    const inputValue = await page
      .locator('[data-testid="ac-from"]')
      .inputValue()
      .catch(() => "");
    if (inputValue !== expectedCity) {
      failures.push(`form prefill: expected "${expectedCity}", got "${inputValue}"`);
    }
    coverage.quickAction = { expectedCity, inputValue };
  }

  // ---------- 6. keyboard-only path (map never required) ----------
  await page.goto(`${base}/explore`);
  await page.waitForSelector('[data-testid="explore-search-input"]', { timeout: 15000 });
  await page.locator('[data-testid="explore-search-input"]').click();
  await page.keyboard.type("iceland");
  await page.waitForSelector('[data-testid="explore-search-list"]', { timeout: 5000 });
  const optCount = await page.locator('[data-testid="explore-search-option"]').count();
  if (optCount === 0) failures.push("search box: no suggestions for 'iceland'");
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(EVIDENCE, "p3-gate-search-suggestions.png") });
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/explore\/is\/?$/, { timeout: 10000 });
  await page.waitForSelector('[data-testid="country-panel"]', { timeout: 15000 });

  const icelandName = await textOf(page, '[data-testid="panel-overview"] h2');
  if (!icelandName.includes("Iceland")) failures.push(`keyboard path landed wrong: "${icelandName}"`);

  // Iceland honesty: no rail network → filter must show Rail 0, list only air/sea
  const railFilter = await textOf(page, '[data-testid="filter-mode-rail"]');
  if (!railFilter.includes("0")) failures.push(`Iceland rail filter should show 0: "${railFilter}"`);
  const icelandRows = await page.locator('[data-testid="terminal-row"]').count();
  if (icelandRows === 0) failures.push("Iceland: terminals missing entirely");
  const icelandDiscovery = await page.locator('[data-testid="discovery-link"]').count();
  if (icelandDiscovery < 5) failures.push(`Iceland: only ${icelandDiscovery} discovery links`);

  coverage.iceland = { icelandRows, icelandDiscovery, railFilter };
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(EVIDENCE, "p3-gate-iceland.png") });

  // ---------- 7. browser back restores the hub ----------
  await page.goBack();
  await page.waitForSelector('[data-testid="explore-page"]', { timeout: 15000 });
  const gridAgain = await page.locator('[data-testid^="grid-country-"]').count();
  if (gridAgain < 50) failures.push(`after back: grid has ${gridAgain} entries`);

  await app.close();

  const checks = {
    mapShapes: pathCount,
    mapShapesRequired: 150,
    gridCountries: gridCount,
    gridRequired: 50,
    sections: Object.keys(sections).length,
    sectionsRequired: 6,
    failures: failures.length,
    pageErrors: errors.length,
  };
  console.log(JSON.stringify(checks, null, 2));
  console.log(JSON.stringify(coverage, null, 2));
  if (failures.length) console.log("failures:", failures);
  if (errors.length) console.log("page errors:", errors);
  console.log("screenshots: scripts/evidence/p3-gate-*.png");

  const pass =
    checks.mapShapes >= checks.mapShapesRequired &&
    checks.gridCountries >= checks.gridRequired &&
    checks.sections === checks.sectionsRequired &&
    checks.failures === 0 &&
    checks.pageErrors === 0;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
