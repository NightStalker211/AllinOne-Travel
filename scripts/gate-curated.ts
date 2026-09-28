// ============================================================
// gate-curated.ts — P1b gate for the migrated curated data.
//
// The values under src/data/ (and src/lib/search-links.ts) were
// migrated data-only from the legacy dataset. This gate re-checks
// them INDEPENDENTLY of how they were written: headline counts,
// structural invariants, honesty-relevant fields (defunct carriers
// must name the year, https links only), and uniqueness rules.
//
// Run: npx tsx scripts/gate-curated.ts
// ============================================================
import { europeCarriers } from "../src/data/carriers";
import { allLocalProviders } from "../src/data/local-tourism";
import { ALL_PASSPORTS } from "../src/data/passports";
import { VISA_PORTALS } from "../src/data/visa-portals";
import { CURRENCIES } from "../src/data/currencies";
import {
  KNOWN_DIRECT_ROUTES_COUNT,
  CURATED_HUB_COUNT,
} from "../src/data/known-routes";
import {
  RESOURCE_CATEGORIES,
  RESOURCE_LINK_COUNT,
  RESOURCE_CATEGORY_COUNT,
} from "../src/data/resource-catalog";
import { COUNTRY_CENTROIDS } from "../src/data/centroids";
import { SEARCH_LINKS, type SearchLinkMode } from "../src/lib/search-links";

const problems: string[] = [];
let passed = 0;

function check(cond: boolean, label: string): void {
  if (cond) {
    passed += 1;
    console.log(`PASS  ${label}`);
  } else {
    problems.push(label);
    console.log(`FAIL  ${label}`);
  }
}

function info(label: string): void {
  console.log(`INFO  ${label}`);
}

function main(): void {
  // ---------- carriers ----------
  const EXPECTED_COUNTRIES = 60;
  const EXPECTED_CARRIERS = 630;
  const EXPECTED_DEFUNCT = 31;

  check(
    europeCarriers.length === EXPECTED_COUNTRIES,
    `carriers: ${EXPECTED_COUNTRIES} country entries (${europeCarriers.length})`
  );
  const allCarriers = europeCarriers.flatMap((c) => [
    ...c.air,
    ...c.rail,
    ...c.bus,
    ...c.sea,
  ]);
  check(
    allCarriers.length === EXPECTED_CARRIERS,
    `carriers: ${EXPECTED_CARRIERS} carrier records (${allCarriers.length})`
  );

  const codes = new Set<string>();
  let dupCode: string | null = null;
  for (const c of europeCarriers) {
    if (codes.has(c.code)) dupCode = c.code;
    codes.add(c.code);
  }
  check(
    dupCode === null && [...codes].every((c) => /^[A-Z]{2}$/.test(c)),
    "carriers: country codes unique ISO-2"
  );
  check(
    europeCarriers.every((c) => c.name && c.flag && c.continent),
    "carriers: every country has name, flag, continent"
  );

  let modeMismatch = 0;
  let insecureSite = 0;
  for (const c of europeCarriers) {
    const pairs: [string, typeof c.air][] = [
      ["air", c.air],
      ["rail", c.rail],
      ["bus", c.bus],
      ["sea", c.sea],
    ];
    for (const [mode, list] of pairs) {
      for (const carrier of list) {
        if (carrier.mode !== mode) modeMismatch += 1;
        if (carrier.website && !carrier.website.startsWith("https://")) {
          insecureSite += 1;
        }
      }
    }
  }
  check(modeMismatch === 0, `carriers: carrier.mode matches its array (${modeMismatch} mismatches)`);
  check(insecureSite === 0, `carriers: websites are https:// (${insecureSite} violations)`);

  const defunct = allCarriers.filter((c) => c.status === "defunct");
  check(
    defunct.length === EXPECTED_DEFUNCT,
    `carriers: ${EXPECTED_DEFUNCT} defunct entries (${defunct.length})`
  );
  const undated = defunct.filter(
    (c) => !/\b(19|20)\d{2}\b/.test([c.name, c.notes ?? "", ...(c.tags ?? [])].join(" "))
  );
  check(
    undated.length === 0,
    `carriers: every defunct carrier names the year (${undated.length} undated: ${undated.map((c) => c.name).join(", ")})`
  );
  const badStatus = allCarriers.filter(
    (c) => c.status !== undefined && c.status !== "active" && c.status !== "defunct"
  );
  check(badStatus.length === 0, "carriers: status field only active|defunct");

  // ---------- local tourism ----------
  const EXPECTED_PROVIDERS = 153;
  const EXPECTED_PROVIDER_COUNTRIES = 37;
  check(
    allLocalProviders.length === EXPECTED_PROVIDERS,
    `local-tourism: ${EXPECTED_PROVIDERS} providers (${allLocalProviders.length})`
  );
  const providerCountries = new Set(allLocalProviders.map((p) => p.country));
  check(
    providerCountries.size === EXPECTED_PROVIDER_COUNTRIES,
    `local-tourism: ${EXPECTED_PROVIDER_COUNTRIES} countries (${providerCountries.size})`
  );
  const providerIds = new Set(allLocalProviders.map((p) => p.id));
  check(
    providerIds.size === allLocalProviders.length,
    "local-tourism: provider ids unique"
  );
  check(
    allLocalProviders.every(
      (p) =>
        p.website.startsWith("https://") &&
        ["rail", "sea", "bus", "hotel"].includes(p.category) &&
        p.region &&
        p.tags.length > 0
    ),
    "local-tourism: https website, valid category, region + tags present"
  );

  // ---------- passports ----------
  const passportCodes = new Set(ALL_PASSPORTS.map((p) => p.code));
  check(
    ALL_PASSPORTS.length >= 190 && passportCodes.size === ALL_PASSPORTS.length,
    `passports: >=190 entries, codes unique (${ALL_PASSPORTS.length})`
  );
  check(
    ALL_PASSPORTS.every((p) => /^[A-Z]{2}$/.test(p.code) && p.name && p.emoji && p.region),
    "passports: ISO-2 code, name, emoji, region present"
  );

  // Target-code validity: every visa target must be a code we can name.
  // Universe = passports + centroids + carriers, plus valid ISO codes
  // those datasets happen to lack (HK, PY, SR). GF (French Guiana) is
  // NOT ISO 3166-1 — kept from migration, flagged as content-audit.
  const codeUniverse = new Set<string>([
    ...ALL_PASSPORTS.map((p) => p.code),
    ...Object.keys(COUNTRY_CENTROIDS),
    ...europeCarriers.map((c) => c.code),
    "HK", "PY", "SR",
  ]);
  const AUDIT_ONLY = new Set(["GF"]);

  let intraDup = 0;
  let unknownTarget = 0;
  const unknownList: string[] = [];
  const overlaps: string[] = [];
  for (const p of ALL_PASSPORTS) {
    const lists: [string, string[]][] = [
      ["visaFreeTo", p.visaFreeTo],
      ["visaOnArrival", p.visaOnArrival],
      ["eVisa", p.eVisa],
      ["visaRequired", p.visaRequired],
    ];
    const where = new Map<string, string[]>();
    for (const [listName, list] of lists) {
      const seen = new Set<string>();
      for (const cc of list) {
        // duplicate WITHIN one list = data bug
        if (seen.has(cc)) intraDup += 1;
        seen.add(cc);
        // target must be a nameable ISO-2 code
        if (!codeUniverse.has(cc) && !AUDIT_ONLY.has(cc)) {
          unknownTarget += 1;
          unknownList.push(`${p.code}->${cc}`);
        }
        if (!where.has(cc)) where.set(cc, []);
        where.get(cc)!.push(listName);
      }
    }
    // same target in two different lists = precedence case, not fatal
    for (const [cc, inLists] of where) {
      if (inLists.length > 1) overlaps.push(`${p.code}->${cc} (${inLists.join("+")})`);
    }
  }
  check(
    intraDup === 0,
    `passports: no duplicate target within a list (${intraDup} intra-list duplicates)`
  );
  check(
    unknownTarget === 0,
    `passports: all targets are nameable ISO-2 codes (${unknownTarget} unknown: ${unknownList.join(", ")})`
  );
  info(
    `passports: cross-list overlaps resolved by lookup precedence: ${overlaps.length} (${overlaps.join("; ")})`
  );
  info(
    `passports: content-audit flagged codes (non-ISO, kept from migration): GF`
  );

  // ---------- visa portals ----------
  const portalKeys = Object.keys(VISA_PORTALS);
  check(
    portalKeys.every((k) => /^[A-Z]{2}$/.test(k)),
    `visa-portals: ${portalKeys.length} ISO-2 keys, all uppercase`
  );
  const badPortal = portalKeys.filter((k) => !VISA_PORTALS[k].startsWith("https://"));
  check(
    badPortal.length === 0,
    `visa-portals: all https:// (${badPortal.length} violations)`
  );
  info(`visa-portals: ${portalKeys.length} official portal links`);

  // ---------- currencies ----------
  const curCodes = new Set(CURRENCIES.map((c) => c.code));
  check(
    curCodes.size === CURRENCIES.length,
    `currencies: ${CURRENCIES.length} entries, codes unique`
  );
  check(
    ["EUR", "USD", "GBP"].every((c) => curCodes.has(c)),
    "currencies: EUR, USD, GBP present"
  );

  // ---------- known routes ----------
  check(
    KNOWN_DIRECT_ROUTES_COUNT > 100 && CURATED_HUB_COUNT > 10,
    `known-routes: ${KNOWN_DIRECT_ROUTES_COUNT} curated routes, ${CURATED_HUB_COUNT} hubs (>100 / >10)`
  );

  // ---------- resource catalog ----------
  check(
    RESOURCE_CATEGORY_COUNT === 14,
    `resources: ${RESOURCE_CATEGORY_COUNT} categories (14)`
  );
  check(
    RESOURCE_LINK_COUNT === 178,
    `resources: ${RESOURCE_LINK_COUNT} links (178)`
  );
  const links = RESOURCE_CATEGORIES.flatMap((c) => c.links);
  const badLink = links.filter(
    (l) => !l.url.startsWith("https://") || !l.label || !["verified", "challenged"].includes(l.access)
  );
  check(
    badLink.length === 0,
    `resources: every link https + label + access (${badLink.length} violations)`
  );

  // ---------- centroids ----------
  const centroidKeys = Object.keys(COUNTRY_CENTROIDS);
  check(
    centroidKeys.length >= 55 && centroidKeys.every((k) => /^[A-Z]{2}$/.test(k)),
    `centroids: ${centroidKeys.length} ISO-2 keys (>=55)`
  );
  const badCentroid = centroidKeys.filter((k) => {
    const c = COUNTRY_CENTROIDS[k];
    return Math.abs(c.lat) > 90 || Math.abs(c.lng) > 180;
  });
  check(
    badCentroid.length === 0,
    `centroids: coordinates in range (${badCentroid.length} out of range)`
  );

  // ---------- search links ----------
  const modes: SearchLinkMode[] = ["air", "rail", "bus", "sea", "cruise", "hotels"];
  check(
    modes.every((m) => Array.isArray(SEARCH_LINKS[m]) && SEARCH_LINKS[m].length > 0),
    `search-links: all ${modes.length} modes present with >=1 entry`
  );
  const modeCounts = modes.map((m) => SEARCH_LINKS[m].length);
  info(`search-links entries per mode: ${modeCounts.join(", ")}`);
  check(
    modes.every((m) => SEARCH_LINKS[m].every((l) => l.label && typeof l.href === "function")),
    "search-links: every entry has label + href builder"
  );

  // ---------- cross-checks (informational) ----------
  const destCountries = new Set(
    europeCarriers.map((c) => c.code)
  );
  const providerOutsideCarriers = [...providerCountries].filter(
    (cc) => !destCountries.has(cc)
  );
  info(
    `local-tourism countries not in carriers: ${providerOutsideCarriers.length ? providerOutsideCarriers.join(", ") : "none"}`
  );

  // ---------- result ----------
  console.log("");
  if (problems.length) {
    console.log(`gate-curated: ${problems.length} FAILED check(s):`);
    for (const p of problems) console.log("  - " + p);
    process.exit(1);
  }
  console.log(`gate-curated: RESULT PASS (${passed} checks)`);
}

main();
