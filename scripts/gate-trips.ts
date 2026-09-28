// ============================================================
// gate-trips.ts — REBUILD §12 gate-trips: add/reorder/remove/
// persist/export.
//
// Builds a trip through the UI, proves that totals only ever add
// prices the user typed (each marked "entered by you", §5.1.7),
// reorders and removes items, survives a reload (localStorage),
// exports JSON (parseable) + Markdown, and leaves the store clean
// for the next gate.
//
// Run: npm run build && npx tsx scripts/gate-trips.ts
// ============================================================

import { _electron as electron, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function textOf(page: Page, selector: string): Promise<string> {
  return (await page.locator(selector).first().textContent().catch(() => null)) ?? "";
}

async function itemTitles(page: Page): Promise<string[]> {
  return page
    .locator('[data-testid="trip-item-title"]')
    .allTextContents()
    .catch(() => []);
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

  const date = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);

  await page.goto(`${base}/trips`);
  await page.waitForSelector('[data-testid="trips-page"]', { timeout: 15000 });

  // ---------- fresh store ----------
  await page.evaluate(() => localStorage.removeItem("ait-trips"));
  await page.reload();
  await page.waitForSelector('[data-testid="trips-page"]', { timeout: 15000 });
  if ((await page.locator('[data-testid="trips-empty"]').count()) !== 1) {
    failures.push("empty state missing on a fresh store");
  }

  // ---------- add trip ----------
  await page.fill('[data-testid="trip-create-input"]', "Iceland ring road");
  await page.click('[data-testid="trip-create"]');
  await page.waitForSelector('[data-testid="trip-detail"]', { timeout: 5000 });
  const tripName = await textOf(page, '[data-testid="trip-name"]');
  if (!tripName.includes("Iceland ring road")) failures.push(`trip name: "${tripName}"`);

  // ---------- add 3 items ----------
  async function addItem(opts: {
    kind: string;
    title: string;
    price?: string;
    from?: string;
    to?: string;
  }) {
    await page.selectOption('[data-testid="item-kind"]', opts.kind);
    await page.fill('[data-testid="item-title"]', opts.title);
    await page.fill('[data-testid="item-date"]', date);
    if (opts.from) await page.fill('[data-testid="item-from"]', opts.from);
    if (opts.to) await page.fill('[data-testid="item-to"]', opts.to);
    if (opts.price) await page.fill('[data-testid="item-price"]', opts.price);
    const before = await page.locator('[data-testid="trip-item"]').count();
    await page.click('[data-testid="item-add"]');
    await page
      .locator('[data-testid="trip-item"]')
      .nth(before)
      .waitFor({ timeout: 5000 });
  }

  await addItem({ kind: "transport", title: "Berlin → Keflavik flight", price: "180", from: "Berlin", to: "Keflavik" });
  await addItem({ kind: "stay", title: "Reykjavik hostel", price: "90" });
  await addItem({ kind: "note", title: "Ring road day 1" });

  let titles = await itemTitles(page);
  coverage.afterAdd = titles;
  if (titles.length !== 3) failures.push(`expected 3 items, got ${titles.length}`);
  if (titles[0] !== "Berlin → Keflavik flight") failures.push(`order after add: ${titles.join(" | ")}`);

  // ---------- totals: only user-entered prices, marked ----------
  const totalText = await textOf(page, '[data-testid="trip-total"]');
  if (!totalText.includes("€270")) failures.push(`total should be €270: "${totalText}"`);
  if (!/entered by you/i.test(totalText)) failures.push("total missing 'entered by you' marker");
  const unmarked = await page.evaluate(() => {
    const re = /[$€£¥]\s?\d[\d.,]*|\d[\d.,]*\s?[$€£¥]/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const out: string[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const t = n.textContent ?? "";
      if (!re.test(t)) continue;
      const p = n.parentElement;
      if (p?.closest("script, style, noscript, template")) continue;
      if (p?.closest("[data-user-price], [data-live-price]")) continue;
      out.push(t.trim().slice(0, 80));
    }
    return out;
  });
  if (unmarked.length > 0) failures.push(`unmarked price text: ${unmarked.join(" | ")}`);
  coverage.total = totalText.replace(/\s+/g, " ").trim().slice(0, 90);

  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(EVIDENCE, "p4-gate-trips.png") });

  // ---------- reorder: first item moves down ----------
  await page.locator('[data-testid="trip-item"]').first().locator('[data-testid="trip-item-down"]').click();
  titles = await itemTitles(page);
  coverage.afterReorder = titles;
  if (titles[0] !== "Reykjavik hostel") failures.push(`reorder failed: ${titles.join(" | ")}`);

  // ---------- remove: the hostel ----------
  await page
    .locator('[data-testid="trip-item"]', { hasText: "Reykjavik hostel" })
    .locator('[data-testid="trip-item-remove"]')
    .click();
  titles = await itemTitles(page);
  coverage.afterRemove = titles;
  if (titles.length !== 2) failures.push(`expected 2 items after remove, got ${titles.length}`);
  if (titles.some((t) => t.includes("hostel"))) failures.push("removed item still present");

  // ---------- persist: reload keeps everything ----------
  await page.reload();
  await page.waitForSelector('[data-testid="trip-detail"]', { timeout: 15000 });
  const persistedName = await textOf(page, '[data-testid="trip-name"]');
  const persistedTitles = await itemTitles(page);
  if (!persistedName.includes("Iceland ring road")) failures.push(`after reload: name "${persistedName}"`);
  if (persistedTitles.length !== 2) failures.push(`after reload: ${persistedTitles.length} items`);
  coverage.persisted = persistedTitles;

  // ---------- export: JSON parses and matches ----------
  await page.click('[data-testid="export-json"]');
  await page.waitForSelector('[data-testid="export-preview"]', { timeout: 5000 });
  const jsonText = await textOf(page, '[data-testid="export-preview"] pre');
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed.trip?.name !== "Iceland ring road") failures.push("json: trip name mismatch");
    if (parsed.trip?.items?.length !== 2) failures.push("json: items mismatch");
    if (!String(parsed.note ?? "").toLowerCase().includes("entered by the user")) {
      failures.push("json: missing user-price note");
    }
    coverage.jsonItems = parsed.trip?.items?.length;
  } catch {
    failures.push(`json export not parseable: ${jsonText.slice(0, 80)}`);
  }

  // ---------- export: Markdown ----------
  await page.click('[data-testid="export-markdown"]');
  await page.waitForSelector('[data-testid="export-preview"][data-format="markdown"]', { timeout: 5000 });
  const mdText = await textOf(page, '[data-testid="export-preview"] pre');
  if (!mdText.includes("# Iceland ring road")) failures.push("markdown: missing heading");
  if (!mdText.includes("Berlin → Keflavik flight")) failures.push("markdown: missing item");
  if (!/entered by you/i.test(mdText)) failures.push("markdown: missing entered-by-you note");
  coverage.markdownChars = mdText.length;

  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(EVIDENCE, "p4-trip-export.png") });

  // ---------- cleanup: leave the store clean for other gates ----------
  await page.evaluate(() => localStorage.removeItem("ait-trips"));

  await app.close();

  const checks = {
    itemsAdded: Array.isArray(coverage.afterAdd) ? coverage.afterAdd.length : 0,
    itemsRequired: 3,
    reordered: Array.isArray(coverage.afterReorder) && coverage.afterReorder[0] === "Reykjavik hostel",
    removedOk: titles.length === 2,
    persistedOk: Array.isArray(coverage.persisted) && coverage.persisted.length === 2,
    exportedJson: typeof coverage.jsonItems === "number",
    exportedMarkdownChars: typeof coverage.markdownChars === "number" ? coverage.markdownChars : 0,
    failures: failures.length,
    pageErrors: errors.length,
  };
  console.log(JSON.stringify(checks, null, 2));
  console.log(JSON.stringify(coverage, null, 2));
  if (failures.length) console.log("failures:", failures);
  if (errors.length) console.log("page errors:", errors);
  console.log("screenshots: scripts/evidence/p4-*.png");

  const pass =
    checks.itemsAdded >= 3 &&
    checks.reordered &&
    checks.removedOk &&
    checks.persistedOk &&
    checks.exportedJson &&
    checks.exportedMarkdownChars > 0 &&
    checks.failures === 0 &&
    checks.pageErrors === 0;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
