// ============================================================
// verify-visa-portals.ts — load-verify every official visa portal.
//
// Network-dependent like verify-search-links: NOT part of `npm run
// verify`. Plain fetch first (fast); anything that is not a clean
// 2xx is retried in a real headless browser, because most visa
// sites sit behind bot-walls that real users pass fine.
//
// Classification:
//   OK   — page loads (fetch or browser)
//   WALL — loads behind a browser challenge (Cloudflare/WAF interstitial)
//   BAD  — dead: DNS failure, hard error, challenge never clears
//
// Run: npm run verify:visa   (exit 1 if any URL is truly dead)
// ============================================================

import { chromium } from "playwright";
import {
  GENERIC_VISA_GUIDE_URL,
  ENTRY_INFO_URL,
  STATUS_PORTALS,
  VISA_PORTALS,
} from "../src/data/visa-portals";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const FETCH_TIMEOUT = 20_000;
const NAV_TIMEOUT = 30_000;
const CHALLENGE_RE =
  /just a moment|verifying your browser|attention required|checking your browser|ddos protection|are you a robot/i;

type Cls = "OK" | "WALL" | "BAD";
interface Row {
  cc: string;
  url: string;
  status: number;
  cls: Cls;
  via: "fetch" | "browser";
}

/** Statuses that mean "WAF / bot-wall / rate-limit", not a dead page. */
const WALL_STATUSES = new Set([401, 403, 406, 429, 503, 999]);

function targets(): Array<[string, string]> {
  const rows: Array<[string, string]> = Object.entries(VISA_PORTALS);
  for (const [cc, byStatus] of Object.entries(STATUS_PORTALS)) {
    for (const url of Object.values(byStatus)) {
      if (!rows.some(([c, u]) => u === url)) rows.push([`${cc}*`, url]);
    }
  }
  rows.push(["GENERIC", GENERIC_VISA_GUIDE_URL]);
  rows.push(["ENTRY", ENTRY_INFO_URL]);
  return rows;
}

async function tryFetch(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const r = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
    });
    return { ok: r.ok, status: r.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function browserProbe(
  browser: import("playwright").Browser,
  url: string
): Promise<{ status: number; cls: Cls }> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const ctx = await browser.newContext({ userAgent: UA });
    const page = await ctx.newPage();
    try {
      const res = await page.goto(url, { timeout: NAV_TIMEOUT, waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1_200);
      const title = await page.title().catch(() => "");
      const status = res?.status() ?? 0;
      if (CHALLENGE_RE.test(title)) {
        await ctx.close();
        return { status, cls: "WALL" };
      }
      if (status >= 400 && status !== 0) {
        // e.g. 503 "Verifying your browser" without a matching title
        const body = (await page.innerText("body").catch(() => "")).slice(0, 400);
        if (CHALLENGE_RE.test(body)) {
          await ctx.close();
          return { status, cls: "WALL" };
        }
        if (WALL_STATUSES.has(status)) {
          await ctx.close();
          return { status, cls: "WALL" };
        }
        await ctx.close();
        if (attempt === 1) continue;
        return { status, cls: "BAD" };
      }
      await ctx.close();
      return { status, cls: "OK" };
    } catch {
      await ctx.close().catch(() => {});
      if (attempt === 1) continue;
      return { status: 0, cls: "BAD" };
    }
  }
  return { status: 0, cls: "BAD" };
}

async function main() {
  const rows = targets();
  console.log(`verify-visa-portals: ${rows.length} official URLs`);

  const browser = await chromium.launch();
  const results: Row[] = [];
  const CONCURRENCY = 6;
  let i = 0;

  async function worker() {
    while (i < rows.length) {
      const idx = i++;
      const [cc, url] = rows[idx];
      const f = await tryFetch(url);
      let row: Row;
      if (f.ok) {
        row = { cc, url, status: f.status, cls: "OK", via: "fetch" };
      } else if (f.status !== 0 && WALL_STATUSES.has(f.status)) {
        // WAF / rate-limit by IP — the page is alive for a real user.
        row = { cc, url, status: f.status, cls: "WALL", via: "fetch" };
      } else {
        const b = await browserProbe(browser, url);
        row = { cc, url, status: b.status, cls: b.cls, via: "browser" };
      }
      results[idx] = row;
      const flag = row.cls === "OK" ? "ok  " : row.cls === "WALL" ? "wall" : "BAD ";
      console.log(
        `${flag} ${row.cc.padEnd(7)} ${String(row.status).padEnd(4)} [${row.via}] ${row.url}`
      );
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();

  const ok = results.filter((r) => r.cls === "OK").length;
  const wall = results.filter((r) => r.cls === "WALL").length;
  const bad = results.filter((r) => r.cls === "BAD");
  console.log(`\nTOTAL ${results.length} | OK ${ok} | WALL ${wall} | DEAD ${bad.length}`);
  for (const b of bad) console.log(`  DEAD ${b.cc} ${b.url}`);
  if (bad.length) {
    console.log("RESULT: FAIL");
    process.exit(1);
  }
  console.log("RESULT: PASS");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
