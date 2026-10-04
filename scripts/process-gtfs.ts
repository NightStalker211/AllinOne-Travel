// process-gtfs.ts — normalize downloaded GTFS feeds (FEAT-10).
//
// Usage: npm run process:gtfs -- [--agency <name>] [--help]
// Steps: sniff each core file's encoding (UTF-8 / UTF-16LE / UTF-16BE /
//        windows-1254), stream-decode, validate header columns by NAME and
//        row floors, write comma-delimited UTF-8 CSVs to
//        data/processed/<agency>/ with atomic .part -> rename, then merge
//        data/processed/manifest.json (existing feeds are preserved).
//        Outputs are kept on failure, but the script still exits non-zero
//        when any problem was recorded.

import {
  closeSync,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import type { WriteStream } from "node:fs";
import path from "node:path";
import { exitIfProblems, mb } from "./lib/download";

const AGENCIES = ["iett", "mbta", "eurostar", "sncf", "flix", "idfm"];

const USAGE =
  "Usage: npm run process:gtfs -- [--agency <name>] [--help]\n" +
  "  --agency only process this feed (default: every known feed)\n" +
  "  --help   show this help\n" +
  "Known feeds: " + AGENCIES.join(", ");

const DAY_COLUMNS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface CoreSpec {
  file: string;
  key: string;
  required: string[];
  floor: number;
  calendarDays?: boolean;
}

const CORE: CoreSpec[] = [
  { file: "agency.txt", key: "agency", required: ["agency_name"], floor: 1 },
  { file: "stops.txt", key: "stops", required: ["stop_id"], floor: 1 },
  { file: "routes.txt", key: "routes", required: ["route_id"], floor: 1 },
  { file: "trips.txt", key: "trips", required: ["trip_id", "route_id"], floor: 1 },
  {
    file: "stop_times.txt",
    key: "stop_times",
    required: ["trip_id", "stop_id", "stop_sequence"],
    floor: 10,
  },
  {
    file: "calendar.txt",
    key: "calendar",
    required: ["service_id"],
    floor: 0,
    calendarDays: true,
  },
];

interface FeedFile {
  rows: number;
  encoding: string;
  delimiter: string;
}

interface FeedManifest {
  source: string;
  files: Record<string, FeedFile>;
  otherFiles: string[];
  notes: string[];
}

interface DrainWait {
  resolve: () => void;
  reject: (err: Error) => void;
}

interface OutFile {
  stream: WriteStream;
  partPath: string;
  closed: boolean;
  writeError: string | null;
  drainWaiter: DrainWait | null;
  closeWaiters: Array<() => void>;
}

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

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

const UTF8_FATAL = new TextDecoder("utf-8", { fatal: true });

function utf8Try(buf: Uint8Array): boolean {
  try {
    UTF8_FATAL.decode(buf);
    return true;
  } catch {
    return false;
  }
}

function sniffEncoding(
  filePath: string,
  size: number,
): { encoding: string; note?: string } {
  const want = Math.min(65536, size);
  if (want <= 0) return { encoding: "utf-8" };
  const fd = openSync(filePath, "r");
  try {
    const buf = Buffer.allocUnsafe(want);
    const got = readSync(fd, buf, 0, want, 0);
    const view = buf.subarray(0, got);
    if (got >= 2 && view[0] === 0xff && view[1] === 0xfe) {
      return { encoding: "utf-16le" };
    }
    if (got >= 2 && view[0] === 0xfe && view[1] === 0xff) {
      return { encoding: "utf-16be" };
    }
    const hasBom = got >= 3 && view[0] === 0xef && view[1] === 0xbb && view[2] === 0xbf;
    const body = hasBom ? view.subarray(3) : view;
    if (utf8Try(body)) return { encoding: "utf-8" };
    if (got < size) {
      for (let trim = 1; trim <= 3 && trim < body.length; trim++) {
        if (utf8Try(body.subarray(0, body.length - trim))) {
          return { encoding: "utf-8" };
        }
      }
    }
    return {
      encoding: "windows-1254",
      note: hasBom
        ? "UTF-8 BOM present but body is not valid UTF-8 — decoded as windows-1254"
        : "head is not valid UTF-8 — decoded as windows-1254",
    };
  } finally {
    closeSync(fd);
  }
}

async function* decodeLines(filePath: string, encoding: string): AsyncGenerator<string> {
  const decoder = new TextDecoder(encoding);
  const stream = createReadStream(filePath, { highWaterMark: 1 << 20 });
  let pending = "";
  try {
    for await (const chunk of stream) {
      pending += decoder.decode(chunk as Uint8Array, { stream: true });
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      for (const line of lines) yield line.endsWith("\r") ? line.slice(0, -1) : line;
    }
    pending += decoder.decode();
    for (const line of pending.split("\n")) {
      yield line.endsWith("\r") ? line.slice(0, -1) : line;
    }
  } finally {
    stream.destroy();
  }
}

function isBlank(line: string): boolean {
  return line.trim().length === 0;
}

function stripBom(line: string, encoding: string): string {
  if (encoding === "windows-1254" && line.startsWith("ï»¿")) return line.slice(3);
  return line;
}

function countOutsideQuotes(line: string, ch: string): number {
  let n = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && c === ch) n++;
  }
  return n;
}

function detectDelimiter(header: string): string {
  let best = ",";
  let bestCount = -1;
  for (const candidate of [",", ";", "\t"]) {
    const count = countOutsideQuotes(header, candidate);
    if (count > bestCount) {
      bestCount = count;
      best = candidate;
    }
  }
  return best;
}

function splitLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function csvField(v: string): string {
  if (!/[",\r\n]/.test(v)) return v;
  return `"${v.replace(/"/g, '""')}"`;
}

function openOut(destPath: string): OutFile {
  const partPath = `${destPath}.part`;
  rmSync(partPath, { force: true });
  const stream = createWriteStream(partPath, { encoding: "utf8" });
  const out: OutFile = {
    stream,
    partPath,
    closed: false,
    writeError: null,
    drainWaiter: null,
    closeWaiters: [],
  };
  stream.on("error", (e) => {
    out.writeError = msg(e);
    const waiter = out.drainWaiter;
    if (waiter) {
      out.drainWaiter = null;
      waiter.reject(new Error(out.writeError));
    }
  });
  stream.on("drain", () => {
    const waiter = out.drainWaiter;
    if (waiter) {
      out.drainWaiter = null;
      waiter.resolve();
    }
  });
  stream.on("close", () => {
    out.closed = true;
    const waiter = out.drainWaiter;
    if (waiter) {
      out.drainWaiter = null;
      waiter.reject(new Error(out.writeError ?? "stream closed before flush"));
    }
    const waiters = out.closeWaiters.splice(0, out.closeWaiters.length);
    for (const resolve of waiters) resolve();
  });
  return out;
}

async function writeChunk(out: OutFile, s: string): Promise<void> {
  if (out.closed || out.stream.destroyed || out.writeError) return;
  try {
    const ok = out.stream.write(s);
    if (ok) return;
  } catch (e) {
    out.writeError = msg(e);
    return;
  }
  try {
    await new Promise<void>((resolve, reject) => {
      out.drainWaiter = { resolve, reject };
    });
  } catch {
    if (out.writeError === null) out.writeError = "stream closed before flush";
  }
}

async function endAndClose(out: OutFile): Promise<void> {
  if (out.closed) return;
  const waiter = new Promise<void>((resolve) => {
    out.closeWaiters.push(resolve);
  });
  if (out.stream.destroyed) out.stream.destroy();
  else out.stream.end();
  await waiter;
}

function removeQuiet(p: string): void {
  try {
    rmSync(p, { force: true });
  } catch {}
}

async function convertCoreFile(
  agency: string,
  spec: CoreSpec,
  srcDir: string,
  outDir: string,
  notes: string[],
  problems: string[],
): Promise<FeedFile | null> {
  const label = `${agency}/${spec.file}`;
  const srcPath = path.join(srcDir, spec.file);
  if (!existsSync(srcPath)) {
    if (spec.file !== "calendar.txt") {
      problems.push(`${label}: required file is missing`);
      return null;
    }
    const destPath = path.join(outDir, `${spec.key}.csv`);
    const partPath = `${destPath}.part`;
    const header =
      "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\n";
    rmSync(partPath, { force: true });
    writeFileSync(partPath, header, "utf8");
    rmSync(destPath, { force: true });
    renameSync(partPath, destPath);
    notes.push(
      `${spec.file}: absent — wrote header-only ${spec.key}.csv (calendar_dates-only feed)`,
    );
    console.log(`PASS  ${label} → 0 rows (absent — header-only ${spec.key}.csv)`);
    return { rows: 0, encoding: "utf-8", delimiter: "," };
  }

  const size = statSync(srcPath).size;
  const sniff = sniffEncoding(srcPath, size);
  if (sniff.note) notes.push(`${spec.file}: ${sniff.note}`);

  const it = decodeLines(srcPath, sniff.encoding)[Symbol.asyncIterator]();
  let headerRaw: string | null = null;
  try {
    for (;;) {
      const step = await it.next();
      if (step.done) break;
      if (isBlank(step.value)) continue;
      headerRaw = stripBom(step.value, sniff.encoding);
      break;
    }
  } finally {
    await it.return?.(undefined);
  }
  if (headerRaw === null) {
    problems.push(`${label}: no header line (file is empty)`);
    return null;
  }
  if (headerRaw.includes("�")) {
    problems.push(
      `${label}: header contains U+FFFD replacement characters — source encoding is wrong`,
    );
    return null;
  }
  const delimiter = detectDelimiter(headerRaw);
  const headerCols = splitLine(headerRaw, delimiter);
  const missing = spec.required.filter((col) => !headerCols.includes(col));
  if (missing.length > 0) {
    problems.push(`${label}: missing required column(s): ${missing.join(", ")}`);
    return null;
  }
  if (spec.calendarDays) {
    const missingDays = DAY_COLUMNS.filter((col) => !headerCols.includes(col));
    if (missingDays.length > 0) {
      notes.push(`${spec.file}: missing day column(s): ${missingDays.join(", ")}`);
    }
  }

  const destPath = path.join(outDir, `${spec.key}.csv`);
  const out = openOut(destPath);
  const fast = sniff.encoding === "utf-8" && delimiter === ",";
  let rows = 0;
  let blankSkipped = 0;
  let fffdLines = 0;
  let ragged = 0;
  let seenHeader = false;
  let chunk = "";
  try {
    for await (const raw of decodeLines(srcPath, sniff.encoding)) {
      if (!seenHeader) {
        if (isBlank(raw)) continue;
        seenHeader = true;
        continue;
      }
      if (isBlank(raw)) {
        blankSkipped++;
        continue;
      }
      if (raw.includes("�")) fffdLines++;
      if (fast) {
        chunk += `${raw}\n`;
      } else {
        const fields = splitLine(raw, delimiter);
        if (fields.length !== headerCols.length) {
          ragged++;
          while (fields.length < headerCols.length) fields.push("");
        }
        chunk += `${fields.map(csvField).join(",")}\n`;
      }
      rows++;
      if (chunk.length >= 1 << 20) {
        await writeChunk(out, chunk);
        chunk = "";
      }
    }
    if (chunk.length > 0) await writeChunk(out, chunk);
    await endAndClose(out);
  } catch (e) {
    await endAndClose(out);
    removeQuiet(out.partPath);
    problems.push(`${label}: read failed — ${msg(e)}`);
    return null;
  }
  if (out.writeError) {
    removeQuiet(out.partPath);
    problems.push(`${label}: write failed — ${out.writeError}`);
    return null;
  }
  try {
    rmSync(destPath, { force: true });
    renameSync(out.partPath, destPath);
  } catch (e) {
    removeQuiet(out.partPath);
    problems.push(`${label}: cannot finalize output — ${msg(e)}`);
    return null;
  }
  if (blankSkipped > 0) {
    notes.push(`${spec.file}: ${blankSkipped} blank line(s) skipped`);
  }
  if (fffdLines > 0) {
    notes.push(`${spec.file}: ${fffdLines} line(s) contain U+FFFD replacement characters`);
  }
  if (ragged > 0) {
    notes.push(
      `${spec.file}: ${ragged} line(s) had a field count differing from the header`,
    );
  }
  console.log(
    `PASS  ${label} → ${rows} rows (${sniff.encoding}, ${JSON.stringify(delimiter)})`,
  );
  return { rows, encoding: sniff.encoding, delimiter };
}

async function processFeed(agency: string, problems: string[]): Promise<FeedManifest | null> {
  const srcDir = path.join("data", "gtfs", agency);
  if (!existsSync(srcDir)) {
    problems.push(`${srcDir}: source directory not found`);
    return null;
  }
  const zipPath = path.join(srcDir, `${agency}.gtfs.zip`);
  const outDir = path.join("data", "processed", agency);
  mkdirSync(outDir, { recursive: true });
  const notes: string[] = [];
  const files: Record<string, FeedFile> = {};
  for (const spec of CORE) {
    const result = await convertCoreFile(agency, spec, srcDir, outDir, notes, problems);
    if (!result) continue;
    files[spec.key] = result;
    if (result.rows < spec.floor) {
      problems.push(
        `${agency}/${spec.file}: ${result.rows} rows < required floor ${spec.floor}`,
      );
    }
  }
  let otherFiles: string[] = [];
  try {
    otherFiles = readdirSync(srcDir)
      .filter((f) => f.endsWith(".txt") && !CORE.some((spec) => spec.file === f))
      .sort();
  } catch (e) {
    problems.push(`${srcDir}: cannot list directory — ${msg(e)}`);
  }
  for (const note of notes) console.log(`note  ${agency}: ${note}`);
  return {
    source: existsSync(zipPath)
      ? `data/gtfs/${agency}/${agency}.gtfs.zip`
      : `data/gtfs/${agency}`,
    files,
    otherFiles,
    notes,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if ("help" in args) {
    console.log(USAGE);
    return;
  }
  const problems: string[] = [];
  let targets = AGENCIES;
  if (args.agency !== undefined) {
    if (!AGENCIES.includes(args.agency)) {
      problems.push(`unknown agency "${args.agency}" — known: ${AGENCIES.join(", ")}`);
      exitIfProblems(problems, "process-gtfs");
    }
    targets = [args.agency];
  }

  const manifestPath = path.join("data", "processed", "manifest.json");
  const previous: Record<string, FeedManifest> = {};
  if (existsSync(manifestPath)) {
    try {
      const parsed: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
      const obj = parsed as { feeds?: unknown };
      if (obj && typeof obj === "object" && obj.feeds && typeof obj.feeds === "object") {
        Object.assign(previous, obj.feeds);
      } else {
        problems.push(
          `${manifestPath}: existing manifest has no feeds object — rebuilt from this run only`,
        );
      }
    } catch {
      problems.push(
        `${manifestPath}: existing manifest is not valid JSON — rebuilt from this run only`,
      );
    }
  }

  const feeds: Record<string, FeedManifest> = { ...previous };
  let processed = 0;
  let fileCount = 0;
  let totalBytes = 0;
  for (const agency of targets) {
    const feed = await processFeed(agency, problems);
    if (feed) {
      feeds[agency] = feed;
      processed++;
      fileCount += Object.keys(feed.files).length;
    }
    try {
      const outDir = path.join("data", "processed", agency);
      for (const f of readdirSync(outDir)) {
        if (f.endsWith(".csv")) totalBytes += statSync(path.join(outDir, f)).size;
      }
    } catch {}
  }

  try {
    const manifest = {
      script: "scripts/process-gtfs.ts",
      generatedAt: new Date().toISOString(),
      feeds,
    };
    const partPath = `${manifestPath}.part`;
    rmSync(partPath, { force: true });
    writeFileSync(partPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    rmSync(manifestPath, { force: true });
    renameSync(partPath, manifestPath);
  } catch (e) {
    problems.push(`${manifestPath}: cannot write manifest — ${msg(e)}`);
  }

  exitIfProblems(problems, "process-gtfs");
  console.log(
    `process-gtfs: ${processed} feed(s), ${fileCount} file(s), ${mb(totalBytes)} → data/processed`,
  );
}

main().catch((e) => {
  console.log(`FAIL  ${msg(e)}`);
  process.exit(1);
});
