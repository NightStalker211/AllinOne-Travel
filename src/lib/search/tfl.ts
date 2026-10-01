// ============================================================
// AllinOne Travel — London network status (Transport for London).
//
// Live line statuses for Tube/DLR/Overground/Elizabeth line/tram,
// shown in the rail tab when either endpoint is London. Renders
// a fault only when there actually is one — "Good service" is a
// live statement too, dated and attributed (§5.1).
// ============================================================

export function tflConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TFL_PRIMARY_KEY);
}

export interface TfLine {
  line: string;
  mode: string;
  status: string;
}

export type TflResult =
  | {
      state: "ok";
      /** Lines NOT on good service (nearest first), capped. */
      issues: TfLine[];
      /** How many monitored lines report good service. */
      goodCount: number;
      totalCount: number;
      fetchedAt: string;
    }
  | { state: "error"; reason: string };

interface TfLineJson {
  name?: string;
  modeName?: string;
  lineStatuses?: { statusSeverityDescription?: string }[];
}

const cache = new Map<string, Promise<TflResult>>();

function hhmmNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

/** Current London line statuses. Never throws. */
export function fetchTflStatuses(): Promise<TflResult> {
  const hit = cache.get("london");
  if (hit) return hit;

  const run = (async (): Promise<TflResult> => {
    if (!tflConfigured()) return { state: "error", reason: "no-key" };
    try {
      const key = encodeURIComponent(process.env.NEXT_PUBLIC_TFL_PRIMARY_KEY ?? "");
      const res = await fetch(
        `https://api.tfl.gov.uk/Line/Mode/tube,dlr,overground,elizabeth-line,tram/Status?app_key=${key}`,
        { cache: "no-store" }
      );
      if (!res.ok) return { state: "error", reason: "network" };
      const json = (await res.json()) as TfLineJson[];
      if (!Array.isArray(json)) return { state: "error", reason: "api" };
      const lines: TfLine[] = json.map((l) => ({
        line: String(l.name ?? "?"),
        mode: String(l.modeName ?? ""),
        status: String(
          l.lineStatuses?.[0]?.statusSeverityDescription ?? "Unknown"
        ),
      }));
      const issues = lines.filter(
        (l) => !/^good service/i.test(l.status)
      );
      issues.sort((a, b) => a.line.localeCompare(b.line));
      return {
        state: "ok",
        issues: issues.slice(0, 6),
        goodCount: lines.length - issues.length,
        totalCount: lines.length,
        fetchedAt: hhmmNow(),
      };
    } catch {
      return { state: "error", reason: "network" };
    }
  })();

  // Cache only successes — a transient failure must not stick for
  // the whole session (the next mount retries honestly).
  run.then((res) => {
    if (res.state === "ok") cache.set("london", run);
  });
  return run;
}
