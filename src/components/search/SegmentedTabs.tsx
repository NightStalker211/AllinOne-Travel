"use client";

// Segmented sub-tabs for results (REBUILD §6: no top tab strip —
// results use segmented sub-tabs within the Search page).

import { cn } from "@/lib/utils";
import type { TabKey } from "@/lib/types/search";

export interface TabDef {
  key: TabKey;
  label: string;
  count?: number;
}

export function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Result modes"
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border bg-raised p-1"
      data-testid="result-tabs"
    >
      {tabs.map((t) => {
        const selected = t.key === active;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={selected}
            data-testid={`tab-${t.key}`}
            onClick={() => onChange(t.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              selected
                ? "bg-accent text-ink-950 shadow-card"
                : "text-fg-muted hover:text-fg"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-[10px] tabular-nums",
                  selected ? "bg-ink-950/15" : "bg-muted text-fg-subtle"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
