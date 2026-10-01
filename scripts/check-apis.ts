// ============================================================
// check-apis.ts — full API key/service status report (FEAT-7).
// INFORMATIONAL only — outside the verify chain (gate:live covers
// what the UI renders; this reports every configured service in
// one table so broken keys/subscriptions are obvious).
//
// Usage: npm run check:apis
// Never prints a key or secret — only presence and probe results.
// ============================================================

import fs from "node:fs";

// ---- .env.local loader (values never printed) -----------------
function loadEnv(): void {
  try {
    const raw = fs.readFileSync(".env.local", "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2];
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = v;
    }
  } catch {
    /* no .env.local — presence checks will say so */
  }
}

type Http = {
  code: number | string;
  body?: unknown;
  text?: string;
  note?: string;
  quota?: string;
};

async function http(
  url: string,
  init?: RequestInit,
  timeoutMs = 12000
): Promise<Http> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    clearTimeout(timer);
    let text = "";
    try {
      text = await res.text();
    } catch {
      text = "";
    }
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      body = undefined;
    }
    // RapidAPI sends monthly-quota headers on every module response.
    const lim = res.headers.get("x-ratelimit-requests-limit");
    const rem = res.headers.get("x-ratelimit-requests-remaining");
    const quota = lim && rem ? `${rem}/${lim} left this month` : undefined;
    return { code: res.status, body, text, quota };
  } catch (e) {
    return { code: "ERR", note: e instanceof Error ? e.message : String(e) };
  }
}

function env(...names: string[]): string {
  for (const n of names) {
    const v = process.env[n];
    if (v) return v;
  }
  return "";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function pick(o: unknown, path: string): unknown {
  let cur: unknown = o;
  for (const part of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

interface Row {
  service: string;
  result: string;
}

async function main() {
  loadEnv();
  const rows: Row[] = [];
  const add = (service: string, result: string) => {
    rows.push({ service, result });
  };

  // ---- keyless sanity (context for the table) ----
  {
    const r = await http(
      "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD"
    );
    add("Open-Meteo / Frankfurter (keyless)", `HTTP ${r.code}`);
  }

  // ---- keyed weather ----
  {
    const k = env("NEXT_PUBLIC_OPENWEATHER_KEY", "OPENWEATHER_KEY");
    if (!k) add("OpenWeather", "key missing");
    else {
      const r = await http(
        `https://api.openweathermap.org/geo/1.0/direct?q=Berlin&limit=1&appid=${k}`
      );
      add("OpenWeather", `HTTP ${r.code} (geo lookup)`);
    }
  }

  // ---- AviationStack ----
  {
    const k = env("NEXT_PUBLIC_AVIATIONSTACK_KEY", "AVIATIONSTACK_KEY");
    if (!k) add("AviationStack", "key missing");
    else {
      const r = await http(
        `http://api.aviationstack.com/v1/flights?access_key=${k}&dep_iata=BER&limit=1`
      );
      const rowsN = Array.isArray(pick(r, "body.data"))
        ? (pick(r, "body.data") as unknown[]).length
        : 0;
      const err = typeof pick(r, "body.code") === "string" ? String(pick(r, "body.code")) : "";
      add("AviationStack", `HTTP ${r.code} · departures rows=${rowsN}${err ? ` · ${err}` : ""}`);
    }
  }

  // ---- OpenSky (relay auth scheme: HTTP Basic on /states/all) ----
  {
    const user = env("OPENSKY_USERNAME");
    const pass = env("OPENSKY_PASSWORD");
    if (!user || !pass) add("OpenSky", "username/password missing");
    else {
      const basic = Buffer.from(`${user}:${pass}`).toString("base64");
      const r = await http(
        "https://opensky-network.org/api/states/all?lamin=52.3&lomin=13.2&lamax=52.7&lomax=13.8",
        { headers: { Authorization: `Basic ${basic}`, Accept: "application/json" } },
        15000
      );
      const n = Array.isArray(pick(r, "body.states"))
        ? (pick(r, "body.states") as unknown[]).length
        : 0;
      const note =
        r.code === 401 || r.code === 403
          ? " · credentials rejected"
          : r.code === 200 && n === 0
            ? " · bbox empty"
            : "";
      add("OpenSky", `HTTP ${r.code} · ${n} aircraft in bbox${note}`);
    }
  }

  // ---- Hotelbeds (signature scheme unresolved → presence only) ----
  {
    const k = env("NEXT_PUBLIC_HOTELBEDS_HOTEL_KEY", "HOTELBEDS_HOTEL_KEY");
    const s = env("NEXT_PUBLIC_HOTELBEDS_SECRET", "HOTELBEDS_SECRET");
    if (!k || !s) add("Hotelbeds", "key/secret missing");
    else add("Hotelbeds", "keys present · not probed (X-Signature auth scheme pending)");
  }

  // ---- AirLabs ----
  {
    const k = env("NEXT_PUBLIC_AIRLABS_KEY", "AIRLABS_KEY");
    if (!k) add("AirLabs", "key missing");
    else {
      const r = await http(`https://airlabs.co/api/v9/airports?api_key=${k}&iata=BER`);
      const arr = pick(r, "body.response");
      const n = Array.isArray(arr) ? arr.length : 0;
      const ber = Array.isArray(arr)
        ? (arr as { iata_code?: string }[]).some((a) => a.iata_code === "BER")
        : false;
      add(
        "AirLabs",
        `HTTP ${r.code} · ${n} airports returned${n > 100 ? " (iata filter IGNORED on free plan — full dump)" : ber ? " (iata filter applied)" : ""}`
      );
    }
  }

  // ---- OpenRouteService ----
  {
    const k = env("NEXT_PUBLIC_OPENROUTESERVICE_KEY", "OPENROUTESERVICE_KEY");
    if (!k) add("OpenRouteService", "key missing");
    else {
      const r = await http(
        "https://api.openrouteservice.org/v2/directions/driving-car?start=13.388,52.517&end=13.405,52.52",
        { headers: { Authorization: k, Accept: "application/geo+json" } }
      );
      const has = Array.isArray(pick(r, "body.features"));
      add("OpenRouteService", `HTTP ${r.code} ${has ? "· route ok" : "· no route"}`);
    }
  }

  // ---- GraphHopper ----
  {
    const k = env("NEXT_PUBLIC_GRAPHHOPPER_KEY", "GRAPHHOPPER_KEY");
    if (!k) add("GraphHopper", "key missing");
    else {
      const r = await http(
        `https://graphhopper.com/api/1/route?point=52.517,13.388&point=52.52,13.405&vehicle=car&key=${k}`
      );
      const has = Array.isArray(pick(r, "body.paths")) && (pick(r, "body.paths") as unknown[]).length > 0;
      add("GraphHopper", `HTTP ${r.code} ${has ? "· route ok" : "· no path"}`);
    }
  }

  // ---- Deutsche Bahn timetables (DB-Client-Id + DB-Api-Key = the
  // app's client id/secret; Frankfurt Hbf is the probe station —
  // its hourly slice reliably carries data) ----
  {
    const id = env("DB_CLIENT_ID", "NEXT_PUBLIC_DB_CLIENT_ID");
    const secret = env("DB_CLIENT_SECRET", "NEXT_PUBLIC_DB_API_KEY");
    if (!id || !secret) add("Deutsche Bahn Timetables", "client id/secret missing");
    else {
      const d = new Date();
      const eva = "8000105"; // Frankfurt(Main)Hbf
      const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const hh = String(d.getHours()).padStart(2, "0");
      const r = await http(
        `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/${eva}/${ymd}/${hh}`,
        { headers: { "DB-Client-Id": id, "DB-Api-Key": secret, Accept: "application/xml" } }
      );
      const stops = ((r.text || "").match(/<s /g) || []).length;
      const note =
        r.code === 400
          ? " · bad request (eva/date format)"
          : r.code === 404
            ? " · no slice loaded for this hour"
            : r.code === 200 && stops === 0
              ? " · empty slice"
              : r.code === 403
                ? " · credentials rejected"
                : "";
      add("Deutsche Bahn Timetables", `HTTP ${r.code} · ${stops} stops${note}`);
    }
  }

  // ---- Transport for London ----
  {
    const k = env("NEXT_PUBLIC_TFL_PRIMARY_KEY", "TFL_PRIMARY_KEY");
    if (!k) add("Transport for London", "key missing");
    else {
      const r = await http(
        `https://api.tfl.gov.uk/Line/Mode/tube,dlr,overground,elizabeth-line,tram/Status?app_key=${k}`
      );
      const n = Array.isArray(pick(r, "body")) ? (pick(r, "body") as unknown[]).length : 0;
      add("Transport for London", `HTTP ${r.code} · ${n} lines`);
    }
  }

  // ---- MakCrops ----
  {
    const k = env("NEXT_PUBLIC_MAKCROPS_KEY", "MAKCROPS_KEY");
    add("MakCrops", k ? "key present · host/module unknown — tell me what it is for" : "key missing");
  }

  // ---- RapidAPI modules ----
  const rk = env("NEXT_PUBLIC_RAPIDAPI_KEY", "RAPIDAPI_KEY");
  const host = (n: string) => env(`NEXT_PUBLIC_RAPIDAPI_${n}_HOST`, `RAPIDAPI_${n}_HOST`);
  const rapid = async (label: string, h: string, path: string, post?: unknown) => {
    if (!rk || !h) {
      add(label, !rk ? "RapidAPI key missing" : "host missing");
      return;
    }
    const r = await http(
      `https://${h}${path}`,
      {
        method: post ? "POST" : "GET",
        headers: {
          "X-RapidAPI-Key": rk,
          "X-RapidAPI-Host": h,
          ...(post ? { "Content-Type": "application/json" } : {}),
        },
        body: post ? JSON.stringify(post) : undefined,
      },
      15000
    );
    const status = r.code === 429 ? "429 monthly quota EXHAUSTED" : `HTTP ${r.code}`;
    add(label, `${status}${r.quota ? ` · ${r.quota}` : ""}`);
  };

  await rapid(
    "RapidAPI · Booking",
    host("BOOKING"),
    "/api/v1/hotels/searchHotelsByCoordinates?latitude=52.52&longitude=13.405&arrival_date=" +
      new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10) +
      "&departure_date=" +
      new Date(Date.now() + 16 * 864e5).toISOString().slice(0, 10) +
      "&adults=2&children_age=0&room_qty=1&units=metric&page_number=1&temperature_unit=c&languagecode=en-us&currency_code=EUR&location=DE"
  );
  await sleep(1400);
  await rapid("RapidAPI · Currency", host("CURRENCY"), "/latest?base=EUR&symbols=USD");
  await sleep(1400);
  await rapid(
    "RapidAPI · GeoDB",
    host("GEODB"),
    "/",
    { query: '{ populatedPlaces(namePrefix: "Berl", first: 2, minPopulation: 25000) { edges { node { name country { code } } } } }' }
  );
  await sleep(1400);
  await rapid(
    "RapidAPI · Travel Advisor",
    host("TRAVEL_ADVISOR"),
    "/attractions/list-in-boundary?bl_latitude=52.51&tr_latitude=52.53&bl_longitude=13.38&tr_longitude=13.42&limit=3&currency=EUR&language=en_US"
  );
  await sleep(1400);
  // Expedia: /suggest is the cheap always-on probe (hotels flow
  // step 1). Its /flights/search backend currently answers 502
  // from the provider side — fares not wired until it recovers.
  await rapid("RapidAPI · Expedia", host("EXPEDIA"), "/suggest", {
    query: "Paris",
    lob: "HOTELS",
    limit: 3,
  });
  await sleep(1400);
  await rapid(
    "RapidAPI · Skyscanner",
    host("SKYSCANNER"),
    "/v1/skyscanner/route?origin=ber&destination=par"
  );
  await sleep(1400);
  await rapid("RapidAPI · Google Flights", host("GOOGLE_FLIGHTS"), "/");

  // ---- report ----
  const width = Math.max(...rows.map((r) => r.service.length)) + 2;
  console.log("\nAllinOne Travel — API service status (no secrets shown)\n");
  for (const r of rows) {
    console.log(`${r.service.padEnd(width)} ${r.result}`);
  }
  console.log(`\n${rows.length} services reported.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
