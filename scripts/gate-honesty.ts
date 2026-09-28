// ============================================================
// gate-honesty.ts — REBUILD §5.4: the price-honesty gate.
//
// Runs the BUILT app under Playwright (Electron), visits the home
// and every /search result surface (all 7 tabs + a deep-link
// dialog), and fails if:
//   - any currency-shaped figure renders outside [data-live-price]
//     (or without the inline "Live ·" source badge),
//   - forbidden copy appears (typical range / estimated from /
//     cheapest deal / urgency / strikethrough prices),
//   - a clock time renders on a non-live result row,
//   - any page error is thrown.
// With no live fare source configured (CI truth), the expected state is
// zero price figures + the "Prices unavailable" note. With Amadeus or
// Travelpayouts configured, live rows are allowed — still only inside
// [data-live-price] with the "Live ·" badge.
//
// Run: npm run build && npx tsx scripts/gate-honesty.ts
// ============================================================

import { _electron as electron } from "playwright";
import fs from "node:fs";
import path from "node:path";

/** NEXT_PUBLIC_* values live in .env.local; Next inlines them into the
 *  bundle at build time but this script's own process.env does not see
 *  them — read the file so "configured?" matches what the app renders. */
function localEnv(key: string): string | undefined {
  const direct = process.env[key];
  if (direct) return direct;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const hit = raw
      .split(/\r?\n/)
      .find((line) => line.startsWith(`${key}=`));
    const value = hit?.slice(key.length + 1).trim();
    return value ? value.replace(/^["']|["']$/g, "") : undefined;
  } catch {
    return undefined;
  }
}

interface Violation {
  kind: string;
  detail: string;
}

interface SurfaceScan {
  prices: Violation[];
  phrases: Violation[];
  strike: Violation[];
  times: Violation[];
}

const FORBIDDEN_PHRASES = [
  "typical range",
  "estimated from",
  "price estimate",
  "estimated price",
  "price history",
  "cheapest deal",
  "best price guaranteed",
  "price prediction",
];

async function scan(page: import("playwright").Page): Promise<SurfaceScan> {
  return page.evaluate(
    ({ phrases }) => {
      const out = { prices: [], phrases: [], strike: [], times: [] } as {
        prices: { kind: string; detail: string }[];
        phrases: { kind: string; detail: string }[];
        strike: { kind: string; detail: string }[];
        times: { kind: string; detail: string }[];
      };

      const currencyRe =
        /[$€£¥]\s?\d[\d.,]*|\d[\d.,]*\s?[$€£¥]|\b(?:USD|EUR|GBP|CHF|TRY|JPY|CAD|AUD)\s?\d[\d.,]*/;

      // 1. Every currency-shaped text node must sit inside
      //    [data-live-price] that carries the "Live ·" badge.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent ?? "";
        if (!currencyRe.test(text)) continue;
        const parent = node.parentElement as HTMLElement | null;
        // Non-rendered content (inline RSC payload, styles) is not UI.
        if (parent?.closest("script, style, noscript, template")) continue;
        const holder = parent?.closest("[data-live-price]");
        if (holder) {
          if (!/Live\s+·/.test(holder.textContent ?? "")) {
            out.prices.push({
              kind: "live-price-without-badge",
              detail: (holder.textContent ?? "").trim().slice(0, 140),
            });
          }
          continue;
        }
        // §5.1.7 — trip-builder figures may only be the user's own
        // bookings, and only when marked "entered by you".
        const userHolder = parent?.closest("[data-user-price]");
        if (userHolder) {
          if (!/entered by you/i.test(userHolder.textContent ?? "")) {
            out.prices.push({
              kind: "user-price-without-marker",
              detail: (userHolder.textContent ?? "").trim().slice(0, 140),
            });
          }
          continue;
        }
        out.prices.push({
          kind: "price-without-live-wrapper",
          detail: text.trim().slice(0, 140),
        });
      }

      // 2. Forbidden copy anywhere in visible text.
      const body = (document.body.innerText || "").toLowerCase();
      for (const p of phrases) {
        if (body.includes(p)) out.phrases.push({ kind: "forbidden-phrase", detail: p });
      }
      if (/\bonly\s+\d+\s+(left|rooms|seats)\b/.test(body)) {
        out.phrases.push({ kind: "urgency-copy", detail: "only N left" });
      }
      if (/\b\d{1,3}%\s+off\b/.test(body)) {
        out.phrases.push({ kind: "discount-copy", detail: "N% off" });
      }

      // 3. Strikethrough / <s> / <del> prices.
      document.querySelectorAll("s, del, .line-through").forEach((el) => {
        const t = (el.textContent ?? "").trim();
        if (/\d/.test(t)) out.strike.push({ kind: "strikethrough", detail: t.slice(0, 80) });
      });

      // 4. Clock times on non-live result rows = fabricated schedules.
      document
        .querySelectorAll('[data-testid="result-row"][data-row-live="0"]')
        .forEach((row) => {
          const t = row.getAttribute("data-row-id") ?? row.textContent?.slice(0, 60) ?? "";
          const found = (row.textContent ?? "").match(/\b\d{1,2}:\d{2}\b/g);
          if (found) {
            out.times.push({
              kind: "clock-on-curated-row",
              detail: `${t.trim()} -> ${found.join(", ")}`,
            });
          }
        });

      return out;
    },
    { phrases: FORBIDDEN_PHRASES }
  );
}

function merge(all: SurfaceScan[]): SurfaceScan {
  const out: SurfaceScan = { prices: [], phrases: [], strike: [], times: [] };
  for (const s of all) {
    out.prices.push(...s.prices);
    out.phrases.push(...s.phrases);
    out.strike.push(...s.strike);
    out.times.push(...s.times);
  }
  return out;
}

function dedupe(v: Violation[]): Violation[] {
  const seen = new Set<string>();
  return v.filter((x) => {
    const k = `${x.kind}|${x.detail}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function main() {
  const ROOT = process.cwd();
  const EVIDENCE = path.join(ROOT, "scripts", "evidence");
  fs.mkdirSync(EVIDENCE, { recursive: true });

  const errors: string[] = [];
  const scans: SurfaceScan[] = [];
  const visited: string[] = [];

  const app = await electron.launch({
    args: [".", "--force-prod"],
    env: { ...process.env, ALLINONE_FORCE_PROD: "1" },
  });
  const page = await app.firstWindow();
  page.on("pageerror", (err) => errors.push(String(err)));

  // ---------- Home ----------
  await page.waitForSelector('[data-testid="home"]', { timeout: 15000 });
  await page.waitForSelector('[data-testid="hero-search"]', { timeout: 15000 });
  scans.push(await scan(page));
  visited.push("home");

  // Autocomplete evidence. The hero hydrates after first paint; type
  // into the focused field and retry a few times so a hydration race
  // can never flake this gate.
  await page.waitForSelector("#from", { timeout: 15000 });
  await page.click("#from");
  let acOpen = false;
  for (let attempt = 1; attempt <= 4 && !acOpen; attempt++) {
    await page.fill("#from", "berl");
    acOpen = await page
      .waitForSelector('[data-testid="ac-option-from"]', { timeout: 4000 })
      .then(() => true)
      .catch(() => false);
    if (!acOpen) await page.waitForTimeout(500);
  }
  if (!acOpen) throw new Error("autocomplete did not open after 4 attempts");
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(EVIDENCE, "p2-autocomplete.png") });
  await page.keyboard.press("Escape");

  // ---------- /search: all tabs ----------
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
  scans.push(await scan(page));
  visited.push("/search");

  const tabs = ["multi", "flights", "rail", "bus", "ferry", "stays", "visa"];
  const panelWait: Record<string, string> = {
    multi: '[data-testid="panel-multi"]',
    flights: '[data-testid="panel-flights"]',
    rail: '[data-testid="panel-rail"]',
    bus: '[data-testid="panel-bus"]',
    ferry: '[data-testid="panel-ferry"]',
    stays: '[data-testid="stays-panel"]',
    visa: '[data-testid="visa-panel"]',
  };

  let noKeyNote = "";
  for (const tab of tabs) {
    await page.click(`[data-testid="tab-${tab}"]`);
    await page.waitForSelector(panelWait[tab], { timeout: 8000 });
    await page.waitForTimeout(350);
    scans.push(await scan(page));
    visited.push(`tab:${tab}`);
    if (tab === "flights") {
      const note = await page.locator('[data-testid="sort-note"]').first().textContent();
      noKeyNote = (note ?? "").trim();
      await page.screenshot({
        path: path.join(EVIDENCE, "p2-search-flights.png"),
      });
    }
    if (tab === "multi") {
      await page.screenshot({
        path: path.join(EVIDENCE, "p2-search-multi.png"),
      });
    }
    if (tab === "stays") {
      await page.screenshot({
        path: path.join(EVIDENCE, "p2-search-stays.png"),
      });
    }
    if (tab === "visa") {
      await page.screenshot({
        path: path.join(EVIDENCE, "p2-search-visa.png"),
      });
    }
  }

  // ---------- Deep-link dialog ----------
  await page.click('[data-testid="tab-flights"]');
  await page.waitForSelector('[data-testid="panel-flights"]', { timeout: 8000 });
  await page.click('[data-testid="check-prices"]');
  await page.waitForSelector('[data-testid="deep-link-dialog"]', { timeout: 8000 });
  await page.waitForTimeout(250);
  scans.push(await scan(page));
  visited.push("dialog");
  await page.screenshot({ path: path.join(EVIDENCE, "p2-deep-link-dialog.png") });
  await page.keyboard.press("Escape");

  // ---------- Explore: hub + country panel (must show zero prices) ----------
  await page.goto(`${base}/explore`);
  await page.waitForSelector('[data-testid="explore-page"]', { timeout: 15000 });
  await page.waitForTimeout(350);
  scans.push(await scan(page));
  visited.push("/explore");

  await page.goto(`${base}/explore/de`);
  await page.waitForSelector('[data-testid="country-panel"]', { timeout: 15000 });
  await page.waitForTimeout(350);
  scans.push(await scan(page));
  visited.push("/explore/de");

  await app.close();

  // ---------- Verdict ----------
  const merged = merge(scans);
  const prices = dedupe(merged.prices);
  const phrases = dedupe(merged.phrases);
  const strike = dedupe(merged.strike);
  const times = dedupe(merged.times);

  const amadeusKey = Boolean(
    process.env.NEXT_PUBLIC_AMADEUS_API_KEY &&
      process.env.NEXT_PUBLIC_AMADEUS_API_SECRET
  );
  const tpKey = Boolean(localEnv("NEXT_PUBLIC_TRAVELPAYOUTS_TOKEN"));
  const liveSourceConfigured = amadeusKey || tpKey;

  const checks = {
    surfacesVisited: visited.length,
    expectedSurfaces: 12, // home + /search + 7 tabs + dialog + explore hub + explore panel
    coverageOk: visited.length >= 12,
    priceViolations: prices.length,
    phraseViolations: phrases.length,
    strikethroughViolations: strike.length,
    fabricatedTimeViolations: times.length,
    pageErrors: errors.length,
    amadeusConfigured: amadeusKey,
    travelpayoutsConfigured: tpKey,
    noKeyNote,
    // No source configured => the note must admit prices are unavailable.
    // A configured source (Amadeus or Travelpayouts) => any honest note;
    // every figure it renders is already validated by priceViolations.
    noKeyStateOk:
      liveSourceConfigured || noKeyNote.includes("Prices unavailable"),
  };

  console.log(JSON.stringify(checks, null, 2));
  if (prices.length) console.log("price violations:", prices);
  if (phrases.length) console.log("phrase violations:", phrases);
  if (strike.length) console.log("strike violations:", strike);
  if (times.length) console.log("time violations:", times);
  if (errors.length) console.log("page errors:", errors);
  console.log("screenshots: scripts/evidence/p2-*.png");

  const pass =
    checks.coverageOk &&
    checks.priceViolations === 0 &&
    checks.phraseViolations === 0 &&
    checks.strikethroughViolations === 0 &&
    checks.fabricatedTimeViolations === 0 &&
    checks.pageErrors === 0 &&
    checks.noKeyStateOk;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
