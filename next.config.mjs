import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Version + build timestamp inlined into the client bundle (footer badge).
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  // Static export — Electron serves ./out
  output: "export",
  trailingSlash: true,

  // Dev-only proxies: Travelpayouts sends no CORS headers, so the renderer
  // calls /api/tp/* and next dev relays it; DB + OpenSky (/api/db/*,
  // /api/opensky/*) carry server-side credentials and are relayed by the
  // Electron dev relay on 127.0.0.1:3100 (electron/api-relay.js). In
  // production the same paths are served by electron/main.js (static
  // export has no API routes) and the config key is omitted entirely so
  // `next build` never sees it.
  ...(process.env.NODE_ENV === "production"
    ? {}
    : {
        async rewrites() {
          return [
            {
              source: "/api/tp/:path*",
              destination: "https://api.travelpayouts.com/:path*",
            },
            {
              source: "/api/db/:path*",
              destination: "http://127.0.0.1:3100/api/db/:path*",
            },
            {
              source: "/api/opensky/:path*",
              destination: "http://127.0.0.1:3100/api/opensky/:path*",
            },
          ];
        },
      }),

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
