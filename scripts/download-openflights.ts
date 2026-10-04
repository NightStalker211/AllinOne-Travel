// ============================================================
// download-openflights.ts — fetch the OpenFlights .dat dumps
// (ODbL) into data/openflights/ (FEAT-10).
//
// Usage: npm run download:openflights
// These files have NO header row, so integrity is checked with a
// per-file field count on the first 20 lines plus size/row floors.
// Exits non-zero if any check fails.
// ============================================================
import path from "node:path";
import { exitIfProblems, fetchToFile, mb, readHeadAndRowCounts, splitCsvLine } from "./lib/download";

const BASE = "https://raw.githubusercontent.com/jpatokal/openflights/master/data";
const DIR = path.join("data", "openflights");

type Spec = { file: string; minBytes: number; fields: number; minRows: number };

const SPECS: Spec[] = [
  { file: "airports.dat", minBytes: 200_000, fields: 14, minRows: 5_000 },
  { file: "airlines.dat", minBytes: 50_000, fields: 8, minRows: 500 },
  { file: "routes.dat", minBytes: 500_000, fields: 9, minRows: 30_000 },
];

const HEAD_LINES_TO_CHECK = 20;

async function main(): Promise<void> {
  const problems: string[] = [];
  for (const spec of SPECS) {
    const dest = path.join(DIR, spec.file);
    const fileProblems: string[] = [];
    let bytes = 0;
    let rows = 0;
    try {
      ({ bytes } = await fetchToFile(`${BASE}/${spec.file}`, dest, { minBytes: spec.minBytes }));
      const counts = await readHeadAndRowCounts(dest, HEAD_LINES_TO_CHECK);
      rows = counts.rows;
      for (let i = 0; i < counts.head.length; i++) {
        const fields = splitCsvLine(counts.head[i]).length;
        if (fields !== spec.fields) {
          fileProblems.push(`${spec.file}: line ${i + 1} has ${fields} fields (want ${spec.fields})`);
          break;
        }
      }
      if (rows < spec.minRows) {
        fileProblems.push(`${spec.file}: only ${rows} rows (min ${spec.minRows})`);
      }
    } catch (err) {
      fileProblems.push(`${spec.file}: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (fileProblems.length === 0) console.log(`OK    ${spec.file}  ${mb(bytes)}  ${rows} rows  ${spec.fields} fields`);
    problems.push(...fileProblems);
  }
  exitIfProblems(problems, "download-openflights");
  console.log("download-openflights: all checks passed.");
}

main().catch((err: unknown) => {
  console.error(`FAIL  ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
