// ============================================================
// download-ourairports.ts — fetch the OurAirports CSV dumps (CC0)
// into data/ourairports/ (FEAT-10).
//
// Usage: npm run download:ourairports
// Every file must pass HTTP status, size floor, header prefix and
// row floor checks before it is trusted; exits non-zero otherwise.
// The files themselves stay gitignored — only data/README.md tracks.
// ============================================================
import path from "node:path";
import { exitIfProblems, fetchToFile, mb, readHeadAndRowCounts } from "./lib/download";

const BASE = "https://davidmegginson.github.io/ourairports-data";
const DIR = path.join("data", "ourairports");

type Spec = { file: string; minBytes: number; headerPrefix: string; minRows: number };

const SPECS: Spec[] = [
  { file: "airports.csv", minBytes: 5_000_000, headerPrefix: "id,ident,type,name", minRows: 5_000 },
  { file: "runways.csv", minBytes: 500_000, headerPrefix: "id,airport_ref", minRows: 10_000 },
  { file: "airport-frequencies.csv", minBytes: 100_000, headerPrefix: "id,airport_ref", minRows: 2_000 },
];

async function main(): Promise<void> {
  const problems: string[] = [];
  for (const spec of SPECS) {
    const dest = path.join(DIR, spec.file);
    const fileProblems: string[] = [];
    let bytes = 0;
    let dataRows = 0;
    try {
      ({ bytes } = await fetchToFile(`${BASE}/${spec.file}`, dest, { minBytes: spec.minBytes }));
      const { head, rows } = await readHeadAndRowCounts(dest, 1);
      dataRows = Math.max(rows - 1, 0);
    const header = (head[0] ?? "").replace(/"/g, "");
    if (!header.startsWith(spec.headerPrefix)) {
        fileProblems.push(`${spec.file}: header prefix mismatch (want "${spec.headerPrefix}", got "${header.slice(0, 60)}")`);
      }
      if (dataRows < spec.minRows) {
        fileProblems.push(`${spec.file}: only ${dataRows} data rows (min ${spec.minRows})`);
      }
    } catch (err) {
      fileProblems.push(`${spec.file}: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (fileProblems.length === 0) console.log(`OK    ${spec.file}  ${mb(bytes)}  ${dataRows} rows`);
    problems.push(...fileProblems);
  }
  exitIfProblems(problems, "download-ourairports");
  console.log("download-ourairports: all checks passed.");
}

main().catch((err: unknown) => {
  console.error(`FAIL  ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
