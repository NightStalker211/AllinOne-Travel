// ============================================================
// download-gtfs.ts — fetch + validate ONE GTFS feed (FEAT-10).
//
// Usage:
//   npm run download:gtfs -- --agency mbta --url https://cdn.mbta.com/MBTA_GTFS.zip
//          [--license "CC BY 3.0 — see https://…"]
//
// Steps: download to data/gtfs/<agency>/<agency>.gtfs.zip (size +
// PK-zip magic), extract (PowerShell Expand-Archive on win32),
// flatten the archive dir that holds agency.txt, then validate 5
// required files (header columns + row floors). LICENSE.txt is
// written ONLY after validation passes. Files are kept on a failed
// validation, but the script still exits non-zero.
// ============================================================
import { execFileSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { exitIfProblems, fetchToFile, mb, readHeadAndRowCounts } from "./lib/download";

type Req = { file: string; anyOf: string[]; minRows: number };

const REQUIRED: Req[] = [
  { file: "agency.txt", anyOf: ["agency_name", "agency_id"], minRows: 1 },
  { file: "stops.txt", anyOf: ["stop_id"], minRows: 5 },
  { file: "routes.txt", anyOf: ["route_id"], minRows: 1 },
  { file: "trips.txt", anyOf: ["trip_id"], minRows: 1 },
  { file: "stop_times.txt", anyOf: ["trip_id"], minRows: 10 },
];

const USAGE =
  "Usage: npm run download:gtfs -- --agency <id> --url <gtfs-zip-url> [--license <text>]\n" +
  "  --agency  folder id, must match ^[a-z0-9-]+$\n" +
  "  --url     direct https URL of the GTFS zip\n" +
  "  --license optional license text; otherwise see source url";

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (val !== undefined && !val.startsWith("--")) {
      out[key] = val;
      i++;
    } else {
      out[key] = "";
    }
  }
  return out;
}

function findMarkerDir(root: string, marker: string, maxDepth: number): string | null {
  const queue: Array<{ dir: string; depth: number }> = [{ dir: root, depth: 0 }];
  while (queue.length > 0) {
    const { dir, depth } = queue.shift() as { dir: string; depth: number };
    if (existsSync(path.join(dir, marker))) return dir;
    if (depth >= maxDepth) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) queue.push({ dir: path.join(dir, entry.name), depth: depth + 1 });
    }
  }
  return null;
}

function psQuote(p: string): string {
  return p.replace(/'/g, "''");
}

function extractZip(zipPath: string, destDir: string): void {
  mkdirSync(destDir, { recursive: true });
  if (process.platform === "win32") {
    const cmd = `Expand-Archive -LiteralPath '${psQuote(path.resolve(zipPath))}' -DestinationPath '${psQuote(path.resolve(destDir))}' -Force`;
    execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", cmd], { stdio: "pipe" });
  } else {
    execFileSync("unzip", ["-o", "-q", zipPath, "-d", destDir], { stdio: "pipe" });
  }
}

function isPkZip(filePath: string): boolean {
  const fd = openSync(filePath, "r");
  try {
    const magic = Buffer.alloc(2);
    const read = readSync(fd, magic, 0, 2, 0) as number;
    return read === 2 && magic[0] === 0x50 && magic[1] === 0x4b;
  } finally {
    closeSync(fd);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const agency = args.agency ?? "";
  const url = args.url ?? "";
  const license = args.license ?? "";

  if (!/^[a-z0-9-]+$/.test(agency) || !/^https?:\/\//.test(url)) {
    console.error(`FAIL  missing or invalid --agency / --url\n${USAGE}`);
    process.exit(1);
  }

  const dir = path.join("data", "gtfs", agency);
  const zipPath = path.join(dir, `${agency}.gtfs.zip`);
  const extractDir = path.join(dir, "_extract");
  const problems: string[] = [];

  mkdirSync(dir, { recursive: true });

  let bytes = 0;
  try {
    ({ bytes } = await fetchToFile(url, zipPath, { minBytes: 100_000 }));
  } catch (err) {
    problems.push(`download: ${err instanceof Error ? err.message : String(err)}`);
    exitIfProblems(problems, "download-gtfs");
    return;
  }

  if (!isPkZip(zipPath)) {
    rmSync(zipPath, { force: true });
    problems.push(`not a PK zip — deleted ${path.basename(zipPath)} — ${url}`);
    exitIfProblems(problems, "download-gtfs");
    return;
  }
  console.log(`OK    ${agency}.gtfs.zip  ${mb(bytes)}`);

  rmSync(extractDir, { recursive: true, force: true });
  try {
    extractZip(zipPath, extractDir);
  } catch (err) {
    problems.push(`extract: ${err instanceof Error ? err.message : String(err)}`);
    exitIfProblems(problems, "download-gtfs");
    return;
  }

  const markerDir = findMarkerDir(extractDir, "agency.txt", 4);
  if (!markerDir) {
    problems.push("agency.txt not found within 4 directory levels of the archive");
    exitIfProblems(problems, "download-gtfs");
    return;
  }

  for (const entry of readdirSync(markerDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const src = path.join(markerDir, entry.name);
    const dest = path.join(dir, entry.name);
    if (path.resolve(src) === path.resolve(dest)) continue;
    rmSync(dest, { force: true });
    renameSync(src, dest);
  }
  rmSync(extractDir, { recursive: true, force: true });

  for (const req of REQUIRED) {
    const file = path.join(dir, req.file);
    if (!existsSync(file)) {
      problems.push(`${req.file}: missing after extract`);
      continue;
    }
    try {
      const { head, rows } = await readHeadAndRowCounts(file, 1);
      const header = head[0] ?? "";
      const dataRows = Math.max(rows - 1, 0);
      if (!req.anyOf.some((c) => header.includes(c))) {
        problems.push(`${req.file}: header lacks any of [${req.anyOf.join(", ")}] — "${header.slice(0, 80)}"`);
      }
      if (dataRows < req.minRows) {
        problems.push(`${req.file}: only ${dataRows} data rows (min ${req.minRows})`);
      } else {
        console.log(`OK    ${req.file}  ${dataRows} rows`);
      }
    } catch (err) {
      problems.push(`${req.file}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  exitIfProblems(problems, "download-gtfs");

  const today = new Date().toISOString().slice(0, 10);
  const body = license && license.length > 0 ? license : `See source license at ${url}`;
  writeFileSync(path.join(dir, "LICENSE.txt"), `Agency: ${agency}\nSource: ${url}\nRetrieved: ${today}\n${body}\n`, "utf8");
  console.log(`download-gtfs: ${agency} validated — LICENSE.txt written.`);
}

main().catch((err: unknown) => {
  console.error(`FAIL  ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
