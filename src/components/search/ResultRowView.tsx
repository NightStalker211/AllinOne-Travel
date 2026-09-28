"use client";

// Result row — max 3 lines (REBUILD §9), schedule "--:--" unless
// live, duration "est." unless live, price only via PriceBadge.

import { Bus, CircleAlert, Plane, Ship, TrainFront } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDuration, formatEst } from "@/lib/search/model";
import type { EmptyReason, ResultRow } from "@/lib/types/search";
import { PriceBadge } from "./PriceBadge";

const MODE_ICON = {
  air: Plane,
  rail: TrainFront,
  bus: Bus,
  sea: Ship,
} as const;

const MODE_LABEL = {
  air: "Flight",
  rail: "Rail",
  bus: "Bus",
  sea: "Ferry",
} as const;

export function ResultRowView({
  row,
  onCheck,
}: {
  row: ResultRow;
  onCheck: () => void;
}) {
  const Icon = MODE_ICON[row.mode];
  const duration = row.liveMinutes
    ? formatDuration(row.liveMinutes)
    : row.estMinutes
      ? formatEst(row.estMinutes)
      : null;

  return (
    <Card
      className="p-4 transition-colors hover:border-line"
      data-testid="result-row"
      data-row-mode={row.mode}
      data-row-live={row.live || row.scheduleConfirmed ? "1" : "0"}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Icon size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {row.leg && (
              <Badge tone="accent">Leg {row.leg}</Badge>
            )}
            <span className="truncate text-sm font-semibold text-fg">
              {row.route}
            </span>
            <Badge tone="neutral">{MODE_LABEL[row.mode]}</Badge>
            {row.carriers && row.carriers.length > 0 && (
              <Badge tone="accent" title="Curated carrier fact">
                curated
              </Badge>
            )}
          </div>

          {/* line 2: detail */}
          <p className="mt-0.5 truncate text-xs text-fg-muted" data-testid="row-detail">
            {row.detail}
            {row.carriers && row.carriers.length > 0 && (
              <span className="text-fg-subtle"> · {row.carriers.slice(0, 3).join(", ")}{row.carriers.length > 3 ? ` +${row.carriers.length - 3}` : ""}</span>
            )}
          </p>

          {/* line 3: schedule + duration status */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            {row.scheduleConfirmed && row.departAt ? (
              <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-fg" data-testid="row-time">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-live" />
                {row.departAt}
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-fg-subtle"
                title="Schedule not confirmed"
                data-testid="row-time-unconfirmed"
              >
                --:--
                <span className="font-medium normal-case">schedule not confirmed</span>
              </span>
            )}
            {duration && (
              <span className="tabular-nums text-fg-muted" data-testid="row-duration">
                {duration}
              </span>
            )}
            {!duration && (
              <span className="text-fg-subtle">duration unknown</span>
            )}
            {row.chainNote && (
              <span className="inline-flex items-center gap-1 text-warn">
                <CircleAlert size={11} />
                {row.chainNote}
              </span>
            )}
          </div>
        </div>

        {/* price zone — live only */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          {row.live ? (
            <PriceBadge fare={row.live} />
          ) : (
            <Button size="sm" variant="outline" onClick={onCheck} data-testid="check-prices">
              Check prices
            </Button>
          )}
          {row.live && (
            <Button size="sm" variant="outline" onClick={onCheck} data-testid="check-prices">
              More providers
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function EmptyState({ reason }: { reason: EmptyReason }) {
  return (
    <Card
      className="flex flex-col items-start gap-1 border-dashed p-5"
      data-testid="empty-state"
    >
      <p
        className="flex items-center gap-2 text-sm font-semibold text-fg"
        data-testid="empty-title"
      >
        <CircleAlert size={15} className="text-warn" />
        {reason.title}
      </p>
      <p className="text-xs leading-relaxed text-fg-muted" data-testid="empty-detail">
        {reason.detail}
      </p>
      {reason.suggest && (
        <p className="text-xs font-medium text-accent">{reason.suggest}</p>
      )}
    </Card>
  );
}

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2" data-testid="skeleton-rows" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border bg-raised p-4">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
