"use client";

// Honest empty state for the Flights tab: the live fare source returned
// nothing for this route/date (or is unreachable). Renders a warning plus
// direct Travelpayouts affiliate deep-links (marker included upstream by
// withMarker) — never a price figure, never a synthetic flight card.

import { CircleAlert, ExternalLink } from "lucide-react";
import { isPartnerUrl } from "@/lib/affiliate";
import { LinkFeeBadge, PartnerBadge } from "@/components/search/LinkBadges";
import { Card } from "@/components/ui/Card";
import type { SearchLinkFee } from "@/lib/search-links";

export interface LiveSearchTarget {
  label: string;
  href: string;
  fee?: SearchLinkFee;
}

export function LiveFaresEmpty({
  message,
  detail,
  targets,
  onAllProviders,
}: {
  message: string;
  detail?: string;
  /** Direct live-search links (Aviasales / Trip.com), pre-filled + marked. */
  targets: LiveSearchTarget[];
  onAllProviders?: () => void;
}) {
  return (
    <Card
      className="space-y-3 border-warn/40 p-5"
      data-testid="flights-live-empty"
    >
      <p className="flex items-start gap-2 text-sm font-semibold text-fg">
        <CircleAlert size={15} className="mt-0.5 shrink-0 text-warn" />
        <span data-testid="live-empty-title">{message}</span>
      </p>
      {detail && (
        <p className="text-xs leading-relaxed text-fg-muted" data-testid="live-empty-detail">
          {detail}
        </p>
      )}

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-fg-muted">
          Search live now — your route, date and travellers are pre-filled:
        </p>
        <div className="flex flex-wrap gap-2">
          {targets.map((t) => {
            const partner = isPartnerUrl(t.href);
            return (
              <a
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="live-search-link"
                className="group inline-flex items-center gap-2 rounded-xl border bg-raised px-3 py-2 transition-colors hover:border-accent"
              >
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
                  {t.label}
                  <ExternalLink
                    size={13}
                    className="text-fg-subtle transition-colors group-hover:text-accent"
                  />
                </span>
                {(t.fee || partner) && (
                  <span className="flex flex-wrap gap-1">
                    {t.fee && <LinkFeeBadge fee={t.fee} />}
                    {partner && <PartnerBadge />}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {onAllProviders && (
        <button
          type="button"
          onClick={onAllProviders}
          data-testid="live-empty-all-providers"
          className="text-xs font-medium text-accent transition-colors hover:underline"
        >
          Compare all providers →
        </button>
      )}
    </Card>
  );
}
