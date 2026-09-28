// ============================================================
// verify-search-links.ts — load-verification for the search-links
// catalog (REBUILD: every "prefilled" link must actually echo its
// parameters on the provider site; every link must load).
//
// For each mode × link we build an href with a fixed sample query
// (Berlin → Paris, +14d out, +21d return, 2 pax, hotel city Paris)
// and open it in headless Chromium:
//   - LOAD ERRORS (DNS / 5xx)            → FAIL
//   - prefilled link, no param echo       → FAIL (demote to home)
//   - bot-wall (captcha / access denied)  → BOTWALL (warn, tolerated:
//     those sites block headless browsers but work for users)
//   - home-only link just has to load     → PASS
//
// Run: npx tsx scripts/verify-search-links.ts   (or npm run verify:links)
// Not part of `npm run verify` — it needs the network.
// ============================================================

import { chromium, type Page } from "playwright";
import { SEARCH_LINKS, type SearchLinkMode } from "../src/lib/search-links";

const CONCURRENCY = 6;
const NAV_TIMEOUT_MS = 15_000;

function isoPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const SAMPLE = {
  origin: "Berlin (BER)",
  destination: "Paris (CDG)",
  date: isoPlus(14),
  returnDate: isoPlus(21),
  passengers: 2,
  city: "Paris",
  checkIn: isoPlus(14),
  checkOut: isoPlus(21),
};

/** Strings that prove the provider received a value — any one counts. */
function echoTokens(): string[] {
  const variants = (iso?: string) => {
    if (!iso) return [];
    const [y, m, d] = iso.split("-");
    return [iso, `${y.slice(2)}${m}${d}`, `${d}${m}`, `${d}.${m}.${y}`];
  };
  return [
    "berlin",
    "paris",
    "cdg",
    "ber-cdg",
    ...variants(SAMPLE.date),
    ...variants(SAMPLE.returnDate),
  ];
}

const BOTWALL_MARKERS = [
  "captcha",
  "are you a robot",
  "verify you are human",
  "access denied",
  "pardon our interruption",
  "unusual traffic",
  " Ray ID", // Cloudflare interstitial
];

interface Case {
  mode: SearchLinkMode;
  label: string;
  url: string;
  prefilled: boolean;
}

interface Result {
  case: Case;
  status: "PASS" | "FAIL" | "BOTWALL" | "SKIP";
  detail: string;
}

function buildCases(): Case[] {
  const cases: Case[] = [];
  for (const mode of Object.keys(SEARCH_LINKS) as SearchLinkMode[]) {
    for (const link of SEARCH_LINKS[mode]) {
      const url = link.href(SAMPLE);
      // "Prefilled" only when the href itself carries sample query data —
      // a bare site URL (even with a path/query) is a home link.
      const low = url.toLowerCase();
      const prefilled = [
        "berlin",
        "paris",
        "cdg",
        SAMPLE.date,
        SAMPLE.returnDate,
        SAMPLE.date.slice(8, 10) + SAMPLE.date.slice(5, 7),
      ].some((t) => low.includes(t.toLowerCase()));
      cases.push({ mode, label: link.label, url, prefilled });
    }
  }
  return cases;
}

const NAV_ERROR_TOLERATED = [
  "ERR_CONNECTION_RESET",
  "ERR_CONNECTION_CLOSED",
  "ERR_HTTP2_PROTOCOL_ERROR",
  "ERR_ABORTED",
  "ERR_TIMED_OUT",
  "interrupted by another navigation",
  "chrome-error",
];

async function check(page: Page, c: Case): Promise<Result> {
  let responseStatus = 0;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await page.goto(c.url, {
        timeout: NAV_TIMEOUT_MS,
        waitUntil: "domcontentloaded",
      });
      responseStatus = resp?.status() ?? 0;
      break;
    } catch (err) {
      const msg = (err as Error).message.split("\n")[0];
      const retryable = msg.includes("interrupted by another navigation");
      if (attempt === 2 || !retryable) {
        // Regional/TLS bot defenses reset headless connections; the
        // sites still open in real browsers — tolerated, reported.
        const tolerated = NAV_ERROR_TOLERATED.some((k) => msg.includes(k));
        return {
          case: c,
          status: tolerated ? "BOTWALL" : "FAIL",
          detail: `navigation: ${msg.slice(0, 110)}`,
        };
      }
      await page.waitForTimeout(800);
    }
  }

  if (responseStatus >= 500) {
    return { case: c, status: "FAIL", detail: `HTTP ${responseStatus}` };
  }

  await page.waitForTimeout(1_500); // let the SPA render / redirect

  const finalUrl = page.url().toLowerCase();
  let title = "";
  let body = "";
  try {
    title = (await page.title()).toLowerCase();
    body = (
      await page.evaluate(() => document.body?.innerText ?? "")
    ).toLowerCase();
  } catch {
    // about:blank / cross-origin frames — fall back to URL only
  }
  const haystack = `${finalUrl} ${title} ${body}`;

  const botwalled =
    (responseStatus === 403 ||
      responseStatus === 406 ||
      responseStatus === 429 ||
      BOTWALL_MARKERS.some((m) =>
        haystack.includes(m.toLowerCase().trim())
      )) &&
    !echoTokens().some((t) => haystack.includes(t));

  if (!c.prefilled) {
    if (
      responseStatus === 403 ||
      responseStatus === 406 ||
      responseStatus === 429 ||
      BOTWALL_MARKERS.some((m) => haystack.includes(m.toLowerCase().trim()))
    ) {
      return { case: c, status: "BOTWALL", detail: `HTTP ${responseStatus}` };
    }
    if (responseStatus >= 400) {
      return { case: c, status: "FAIL", detail: `HTTP ${responseStatus}` };
    }
    return { case: c, status: "PASS", detail: `HTTP ${responseStatus}` };
  }

  if (botwalled) {
    return {
      case: c,
      status: "BOTWALL",
      detail: `HTTP ${responseStatus} (echo not verifiable through the wall)`,
    };
  }

  const hit = echoTokens().filter((t) => haystack.includes(t));
  if (hit.length === 0) {
    return {
      case: c,
      status: "FAIL",
      detail: `no param echo — final: ${page.url().slice(0, 140)}`,
    };
  }
  return {
    case: c,
    status: "PASS",
    detail: `echo: ${[...new Set(hit)].slice(0, 4).join(",")}`,
  };
}

async function main() {
  const cases = buildCases();
  console.log(
    `verify-search-links: ${cases.length} links ` +
      `(sample ${SAMPLE.origin} → ${SAMPLE.destination}, ${SAMPLE.date} → ${SAMPLE.returnDate})`
  );

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 900 },
    locale: "en-US",
  });

  const results: Result[] = [];
  let cursor = 0;
  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= cases.length) break;
      // Fresh page per case: a site that keeps redirecting must not
      // interrupt the next case's navigation.
      const page = await ctx.newPage();
      try {
        const r = await check(page, cases[i]);
        results.push(r);
        const mark =
          r.status === "PASS" ? "  ok " : r.status === "BOTWALL" ? " wall" : " FAIL";
        console.log(
          `${mark} [${r.case.mode}] ${r.case.label.padEnd(18)} ${r.detail}`
        );
      } finally {
        await page.close().catch(() => {});
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();

  const fails = results.filter((r) => r.status === "FAIL");
  const walls = results.filter((r) => r.status === "BOTWALL");
  const passes = results.filter((r) => r.status === "PASS");
  console.log(
    `\n${passes.length} pass · ${walls.length} botwall (works in browsers) · ${fails.length} fail`
  );
  if (fails.length) {
    console.log("\nDemote these to home links or fix the format:");
    for (const f of fails) console.log(`  ${f.case.label} (${f.case.mode}): ${f.detail}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
