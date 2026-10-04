// ============================================================
// download.ts — shared helpers for the offline data download
// scripts (FEAT-10: ourairports / openflights / gtfs).
//
// Usage: imported by the download-*.ts scripts via
//   import { fetchToFile, readHeadAndRowCounts, ... } from "./lib/download";
//
// These sources need no credentials — no key or secret is ever
// printed. Every helper either returns real numbers measured from
// disk or fails loudly (non-zero exit at the call site).
// ============================================================
import { closeSync, createReadStream, mkdirSync, openSync, readSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";

export type FetchOpts = {
  timeoutMs?: number;
  minBytes?: number;
};

// Download url -> destPath atomically (write <dest>.part, then rename).
// Rejects on non-2xx, on a body shorter than minBytes, or on timeout.
// The .part file is always removed on failure.
export async function fetchToFile(url: string, destPath: string, opts: FetchOpts = {}): Promise<{ bytes: number }> {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const minBytes = opts.minBytes ?? 1;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const partPath = `${destPath}.part`;
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.byteLength < minBytes) {
      throw new Error(`only ${bytes.byteLength} bytes received (min ${minBytes}) — ${url}`);
    }
    mkdirSync(path.dirname(destPath), { recursive: true });
    writeFileSync(partPath, bytes);
    rmSync(destPath, { force: true });
    renameSync(partPath, destPath);
    return { bytes: bytes.byteLength };
  } catch (err) {
    rmSync(partPath, { force: true });
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Count non-empty lines (BOM stripped from every line) and return the
// first `headLines` of them. `rows` is the total non-empty line count,
// header included — callers decide whether to subtract 1.
export async function readHeadAndRowCounts(filePath: string, headLines: number): Promise<{ head: string[]; rows: number }> {
  const head: string[] = [];
  let rows = 0;
  const rl = createInterface({ input: createReadStream(filePath, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const raw of rl) {
    const line = raw.replace(/^﻿/, "");
    if (line.trim() === "") continue;
    rows += 1;
    if (head.length < headLines) head.push(line);
  }
  rl.close();
  return { head, rows };
}

// Quote-aware CSV splitter ("…" may contain commas and "" escapes a
// quote). Needed for OurAirports `comma` fields and OpenFlights names.
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line.charAt(i);
    if (inQuotes) {
      if (ch === '"') {
        if (line.charAt(i + 1) === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function fail(msg: string): never {
  console.error(`FAIL  ${msg}`);
  process.exit(1);
}

// Print every problem and exit 1; a no-op when nothing failed.
export function exitIfProblems(problems: string[], label: string): void {
  if (problems.length === 0) return;
  for (const p of problems) console.error(`FAIL  ${p}`);
  console.error(`\n${label}: ${problems.length} problem(s) — nothing is trusted.`);
  process.exit(1);
}

export function mb(bytes: number): string {
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

// PK magic bytes of a real zip (read the first 2 bytes).
export function isPkZip(filePath: string): boolean {
  const fd = openSync(filePath, "r");
  try {
    const magic = Buffer.alloc(2);
  const read = readSync(fd, magic, 0, 2, 0);
    return read === 2 && magic[0] === 0x50 && magic[1] === 0x4b;
  } finally {
    closeSync(fd);
  }
}
