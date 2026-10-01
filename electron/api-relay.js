// ============================================================
// AllinOne Travel — local API relay (FEAT-9: DB + OpenSky).
//
// The static export has no server runtime, so live credentials
// (DB_CLIENT_SECRET, OPENSKY_PASSWORD) must never enter the
// renderer bundle. This module is the app's route-handler layer:
// it answers GET /api/db/* and GET /api/opensky/* in the local
// HTTP server (production Electron) and in the dev relay on
// 127.0.0.1:3100 (next dev rewrites point here). Mirrors the
// /api/tp/* pattern documented in next.config.mjs.
//
// Contract: GET only, upstream status passed through, responses
// are always `Cache-Control: no-store` (live data under a fresh
// "Live · HH:MM" badge must never be served from a cache) and
// `Access-Control-Allow-Origin: *`. Upstream failures degrade to
// 502 JSON — the client maps that to an honest "unavailable"
// note, never to a fallback number (REBUILD §5).
//
// Endpoints:
//   GET /api/db/station?q=<pattern>            → upstream XML (stations)
//   GET /api/db/plan?eva=&date=&hour=          → upstream XML (timetable slice)
//   GET /api/db/fchg?eva=                      → upstream XML (known changes)
//   GET /api/opensky/states?south=&west=&north=&east=
//                                               → upstream JSON (aircraft states)
// ============================================================

const fs = require("fs");
const path = require("path");

const DB_BASE = "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1";
const OPENSKY_BASE = "https://opensky-network.org/api";
const UPSTREAM_TIMEOUT_MS = 15000;

// ---------- env (.env.local — plain names stay server-side) ----------

let envLoaded = false;

function loadEnvOnce() {
  if (envLoaded) return;
  envLoaded = true;
  const file = path.join(__dirname, "..", ".env.local");
  try {
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
        (value.startsWith("'") && value.endsWith("'") && value.length > 1)
      ) {
        value = value.slice(1, -1);
      }
      // Real process env wins (packaged app / CI can inject values).
      if (!(m[1] in process.env)) process.env[m[1]] = value;
    }
  } catch {
    /* missing/unreadable file => handlers report not-configured */
  }
}

function dbCreds() {
  loadEnvOnce();
  const id = process.env.DB_CLIENT_ID || "";
  const secret = process.env.DB_CLIENT_SECRET || "";
  return id && secret ? { id, secret } : null;
}

function openSkyCreds() {
  loadEnvOnce();
  const user = process.env.OPENSKY_USERNAME || "";
  const pass = process.env.OPENSKY_PASSWORD || "";
  return user && pass ? { user, pass } : null;
}

// ---------- helpers ----------

function send(res, status, contentType, body, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, "application/json; charset=utf-8", JSON.stringify(obj));
}

async function relayUpstream(res, url, headers, errorLabel) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const up = await fetch(url, { headers, signal: ctrl.signal });
    const buf = Buffer.from(await up.arrayBuffer());
    send(res, up.status, up.headers.get("content-type") || "application/octet-stream", buf);
  } catch {
    sendJson(res, 502, { error: errorLabel });
  } finally {
    clearTimeout(timer);
  }
}

// ---------- validators (bad input => 400, never an upstream hit) ----------

const EVA_RE = /^\d{6,8}$/;
const DATE_RE = /^\d{6}$/; // DB plan uses YYMMDD
const HOUR_RE = /^\d{2}$/;

function num(v, min, max) {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

// ---------- handlers ----------

async function handleDb(qs, res) {
  const route = qs.get("route");
  const creds = dbCreds();
  if (!creds) {
    sendJson(res, 503, { error: "db-not-configured" });
    return;
  }
  const hdr = {
    "DB-Client-Id": creds.id,
    "DB-Api-Key": creds.secret,
    Accept: "application/xml",
  };

  if (route === "station") {
    const q = (qs.get("q") || "").trim();
    if (q.length < 2 || q.length > 80) {
      sendJson(res, 400, { error: "bad-request", detail: "q must be 2..80 chars" });
      return;
    }
    await relayUpstream(
      res,
      `${DB_BASE}/station/${encodeURIComponent(q)}`,
      hdr,
      "db-unreachable"
    );
    return;
  }

  if (route === "plan") {
    const eva = qs.get("eva") || "";
    const date = qs.get("date") || "";
    const hour = qs.get("hour") || "";
    if (!EVA_RE.test(eva) || !DATE_RE.test(date) || !HOUR_RE.test(hour)) {
      sendJson(res, 400, {
        error: "bad-request",
        detail: "eva 6-8 digits, date YYMMDD, hour 00-23",
      });
      return;
    }
    await relayUpstream(
      res,
      `${DB_BASE}/plan/${eva}/${date}/${hour}`,
      hdr,
      "db-unreachable"
    );
    return;
  }

  if (route === "fchg") {
    const eva = qs.get("eva") || "";
    if (!EVA_RE.test(eva)) {
      sendJson(res, 400, { error: "bad-request", detail: "eva 6-8 digits" });
      return;
    }
    await relayUpstream(res, `${DB_BASE}/fchg/${eva}`, hdr, "db-unreachable");
    return;
  }

  sendJson(res, 404, { error: "unknown-db-route" });
}

async function handleOpenSky(qs, res) {
  const creds = openSkyCreds();
  if (!creds) {
    sendJson(res, 503, { error: "opensky-not-configured" });
    return;
  }
  const south = num(qs.get("south"), -90, 90);
  const north = num(qs.get("north"), -90, 90);
  const west = num(qs.get("west"), -180, 180);
  const east = num(qs.get("east"), -180, 180);
  if (south == null || north == null || west == null || east == null || south >= north || west >= east) {
    sendJson(res, 400, {
      error: "bad-request",
      detail: "south/north in [-90,90] and west/east in [-180,180] with south<north, west<east",
    });
    return;
  }
  const bbox = `lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`;
  const basic = Buffer.from(`${creds.user}:${creds.pass}`, "utf8").toString("base64");
  await relayUpstream(
    res,
    `${OPENSKY_BASE}/states/all?${bbox}`,
    {
      Authorization: `Basic ${basic}`,
      Accept: "application/json",
      // OpenSky's own CORS only ever names its origin; the relay
      // re-declares ours so the renderer may read the payload.
      "User-Agent": "AllinOne-Travel/1.0 (local relay)",
    },
    "opensky-unreachable"
  );
}

/**
 * Answer a request under /api/db/* or /api/opensky/*.
 * Returns true when the request was handled (caller must not
 * continue with the static file server), false otherwise.
 */
function handleApiRequest(req, res) {
  let url;
  try {
    url = new URL(req.url, "http://127.0.0.1");
  } catch {
    return false;
  }
  const p = url.pathname;
  const isDb = p.startsWith("/api/db/");
  const isOs = p.startsWith("/api/opensky/");
  if (!isDb && !isOs) return false;

  if (req.method === "OPTIONS") {
    send(res, 204, "text/plain", "");
    return true;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "method-not-allowed" });
    return true;
  }

  const qs = url.searchParams;
  if (isDb) {
    qs.set("route", p.slice("/api/db/".length).replace(/\/+$/, ""));
    handleDb(qs, res).catch(() => sendJson(res, 500, { error: "relay-failure" }));
  } else {
    handleOpenSky(qs, res).catch(() => sendJson(res, 500, { error: "relay-failure" }));
  }
  return true;
}

module.exports = { handleApiRequest };
