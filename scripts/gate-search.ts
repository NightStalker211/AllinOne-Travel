// ============================================================
// gate-search.ts — REBUILD §8: search coverage gate.
//
// Visits 6+ distinct route types under Playwright (Electron) and
// asserts that EVERY ground/air mode tab either renders results or
// explains itself honestly (empty state with a real reason — never
// a blank panel), that the flights tab always shows the no-price /
// sort note, that the multi tab shows chips or a reason, and that
// deep links in the dialog carry the requested date and party size.
//
// Run: npm run build && npx tsx scripts/gate-search.ts
// ============================================================

import { _electron as electron } from "playwright";
import fs from "node:fs";
import path from "node:path";

interface RouteDef {
  name: string;
  from: string;
  to: string;
  expectEmpty?: Record<string, string>; // tab -> expected empty-state title fragment
  expectRow?: string[]; // tabs expected to render a row
  expectDetail?: Record<string, string>; // tab -> expected empty-detail fragment (e.g. nearest)
  expectRowDetail?: Record<string, string>; // tab -> fragment the first row must show
}

const ROUTES: RouteDef[] = [
  {
    name: "Berlin-Paris",
    from: "Berlin,DE",
    to: "Paris,FR",
    expectEmpty: { ferry: "No ferry" },
    expectRow: ["rail", "bus"],
  },
  {
    name: "Athens-Mykonos",
    from: "Athens,GR",
    to: "Mykonos,GR",
    expectEmpty: { rail: "No rail terminal listed in Mykonos" },
    expectRow: ["ferry"],
    expectRowDetail: { ferry: "via Piraeus" },
  },
  {
    name: "Vienna-Bratislava",
    from: "Vienna,AT",
    to: "Bratislava,SK",
    expectRow: ["rail", "bus", "ferry"],
  },
  {
    name: "Madrid-Lisbon",
    from: "Madrid,ES",
    to: "Lisbon,PT",
    expectRow: ["rail", "bus"],
    expectEmpty: { ferry: "No ferry" },
  },
  {
    name: "London-Reykjavik",
    from: "London,GB",
    to: "Reykjav\u00edk,IS",
    expectEmpty: { rail: "No rail network in Iceland" },
    expectDetail: { ferry: "Nearest ferry terminal:" },
  },
  {
    name: "Istanbul-Athens",
    from: "\u0130stanbul,TR",
    to: "Athens,GR",
    expectRow: ["ferry"],
  },
];

const MODE_TABS = ["flights", "rail", "bus", "ferry"] as const;

async function main() {
  const ROOT = process.cwd();
  const EVIDENCE = path.join(ROOT, "scripts", "evidence");
  fs.mkdirSync(EVIDENCE, { recursive: true });

  const errors: string[] = [];
  const failures: string[] = [];
  const visited: string[] = [];
  const coverage: Record<string, Record<string, string>> = {};

  const date = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);

  const app = await electron.launch({
    args: [".", "--force-prod"],
    env: { ...process.env, ALLINONE_FORCE_PROD: "1" },
  });
  const page = await app.firstWindow();
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.waitForSelector('[data-testid="home"]', { timeout: 15000 });
  const base = page.url().replace(/\/$/, "");

  let dialogChecked = false;

  for (const route of ROUTES) {
    const url =
      `${base}/search?` +
      new URLSearchParams({
        from: route.from,
        to: route.to,
        date,
        pax: "2",
        cur: "EUR",
        nat: "DE",
      }).toString();

    await page.goto(url);
    await page.waitForSelector('[data-testid="search-page"]', { timeout: 15000 });
    coverage[route.name] = {};

    // --- multi tab: chips or rows, never blank ---
    await page.click('[data-testid="tab-multi"]');
    await page.waitForSelector(
      '[data-testid="panel-multi"] [data-testid="result-row"], [data-testid="panel-multi"] [data-testid="multi-chip"]',
      { timeout: 8000 }
    );

    // --- mode tabs: row OR honest empty state ---
    for (const tab of MODE_TABS) {
      await page.click(`[data-testid="tab-${tab}"]`);
      const panel = `[data-testid="panel-${tab}"]`;
      await page.waitForSelector(panel, { timeout: 8000 });
      await page.waitForSelector(
        `${panel} [data-testid="result-row"], ${panel} [data-testid="empty-state"]`,
        { timeout: 8000 }
      );
      await page.waitForTimeout(150);

      const rows = await page.locator(`${panel} [data-testid="result-row"]`).count();
      let state = "";
      if (rows > 0) {
        state = `rows:${rows}`;
        const emptyCount = await page
          .locator(`${panel} [data-testid="empty-state"]`)
          .count();
        if (emptyCount > 0) failures.push(`${route.name}/${tab}: rows and empty both shown`);
      } else {
        const empty = page.locator(`${panel} [data-testid="empty-state"]`).first();
        const title = (await empty.locator('[data-testid="empty-title"]').textContent().catch(() => null)) ?? "";
        const detail = (await empty.locator('[data-testid="empty-detail"]').textContent().catch(() => null)) ?? "";
        if (!title.trim()) failures.push(`${route.name}/${tab}: empty state without title`);
        if (!detail.trim()) failures.push(`${route.name}/${tab}: empty state without detail`);
        state = `empty:${title.trim().slice(0, 60)}`;
      }
      coverage[route.name][tab] = state;

      const wantRow = route.expectRow?.includes(tab);
      const wantEmpty = route.expectEmpty?.[tab];
      if (wantRow && rows === 0) failures.push(`${route.name}/${tab}: expected rows, got empty`);
      const wantRowDetail = route.expectRowDetail?.[tab];
      if (wantRowDetail && rows > 0) {
        const rowText = (await page
          .locator(`${panel} [data-testid="result-row"]`)
          .first()
          .textContent()) ?? "";
        if (!rowText.includes(wantRowDetail)) {
          failures.push(`${route.name}/${tab}: row missing "${wantRowDetail}" in "${rowText}"`);
        }
      }
      if (wantEmpty) {
        const title = coverage[route.name][tab];
        if (rows > 0 || !title.toLowerCase().includes(wantEmpty.toLowerCase())) {
          failures.push(`${route.name}/${tab}: expected empty "${wantEmpty}", got "${title}"`);
        }
      }
      const wantDetail = route.expectDetail?.[tab];
      if (wantDetail) {
        const detailText = await page
          .locator(`${panel} [data-testid="empty-detail"]`)
          .first()
          .textContent()
          .catch(() => "");
        if (!(detailText ?? "").includes(wantDetail)) {
          failures.push(`${route.name}/${tab}: missing detail "${wantDetail}" in "${detailText}"`);
        }
      }

      // Flights must always carry the honest no-price/sort note.
      if (tab === "flights") {
        const note = await page
          .locator('[data-testid="sort-note"]')
          .first()
          .textContent()
          .catch(() => null);
        if (!note?.trim()) failures.push(`${route.name}/flights: missing sort-note`);
      }
    }
    visited.push(route.name);

    // --- deep-link dialog: carries date + party size (first route with a row) ---
    if (!dialogChecked) {
      await page.click('[data-testid="tab-flights"]');
      await page.waitForSelector('[data-testid="panel-flights"]', { timeout: 8000 });
      const canFlights = await page.locator('[data-testid="check-prices"]').count();
      let opened = false;
      if (canFlights > 0) {
        await page.click('[data-testid="check-prices"]');
        opened = true;
      } else {
        await page.click('[data-testid="tab-rail"]');
        await page.waitForSelector('[data-testid="panel-rail"]', { timeout: 8000 });
        if (await page.locator('[data-testid="check-prices"]').count()) {
          await page.click('[data-testid="check-prices"]');
          opened = true;
        }
      }
      if (opened) {
        await page.waitForSelector('[data-testid="deep-link-dialog"]', { timeout: 8000 });
        const hrefs = await page
          .locator('[data-testid="deep-link-dialog"] a')
          .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
        const dateLinks = hrefs.filter((h) => h.includes(date));
        const paxLinks = hrefs.filter((h) =>
          /(?:adults|passengers|pax|travellers|travelers)[=%]2(?:\D|$)/i.test(h)
        );
        console.log(
          JSON.stringify({
            dialog: route.name,
            links: hrefs.length,
            withDate: dateLinks.length,
            withPax: paxLinks.length,
          })
        );
        if (hrefs.length < 6) failures.push(`dialog: only ${hrefs.length} links`);
        if (dateLinks.length < 3)
          failures.push(`dialog: only ${dateLinks.length} links carry the date`);
        if (paxLinks.length < 1) failures.push(`dialog: no link carries pax=2`);
        await page.screenshot({ path: path.join(EVIDENCE, "p2-gate-dialog-links.png") });
        await page.keyboard.press("Escape");
        dialogChecked = true;
      }
    }

    // Evidence screenshots: the port-fallback row and the explicit
    // empty explanations (rail network, nearest-port suggestion).
    // 400ms lets the tab pill's CSS color transition settle so the
    // screenshot shows the final active state.
    if (route.name === "Athens-Mykonos") {
      await page.click('[data-testid="tab-ferry"]');
      await page.waitForSelector('[data-testid="panel-ferry"] [data-testid="result-row"]', {
        timeout: 8000,
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(EVIDENCE, "p2-gate-ferry-piraeus.png") });
    }
    if (route.name === "London-Reykjavik") {
      await page.click('[data-testid="tab-rail"]');
      await page.waitForSelector('[data-testid="panel-rail"] [data-testid="empty-state"]', {
        timeout: 8000,
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(EVIDENCE, "p2-gate-rail-empty.png") });
      await page.click('[data-testid="tab-ferry"]');
      await page.waitForSelector('[data-testid="panel-ferry"] [data-testid="empty-state"]', {
        timeout: 8000,
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(EVIDENCE, "p2-gate-ferry-empty.png") });
    }
  }

  await app.close();

  const checks = {
    routesVisited: visited.length,
    routesRequired: 6,
    routesOk: visited.length >= 6,
    dialogChecked,
    failures: failures.length,
    pageErrors: errors.length,
  };
  console.log(JSON.stringify(checks, null, 2));
  console.log(JSON.stringify(coverage, null, 2));
  if (failures.length) console.log("failures:", failures);
  if (errors.length) console.log("page errors:", errors);
  console.log("screenshots: scripts/evidence/p2-gate-*.png");

  const pass =
    checks.routesOk &&
    checks.dialogChecked &&
    checks.failures === 0 &&
    checks.pageErrors === 0;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
