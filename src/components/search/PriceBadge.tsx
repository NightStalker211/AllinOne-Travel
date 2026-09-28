"use client";

// The ONLY legal way to render a price figure (REBUILD §5.1):
// inside [data-live-price] with the inline source badge.

import type { LiveFare } from "@/lib/types/search";

function formatAmount(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

export function PriceBadge({ fare }: { fare: LiveFare }) {
  return (
    <span
      data-live-price
      className="inline-flex flex-col items-end gap-1"
      title={`Live quote from ${fare.source}, fetched ${fare.fetchedAt}`}
    >
      <strong
        data-testid="price-figure"
        className="text-base font-bold tabular-nums text-fg"
      >
        {formatAmount(fare.price, fare.currency)}
      </strong>
      <span
        data-testid="price-badge"
        className="inline-flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-live"
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-live" />
        Live · {fare.source} · {fare.fetchedAt}
      </span>
    </span>
  );
}
