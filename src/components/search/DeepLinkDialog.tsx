"use client";

// Provider deep-link dialog: prefilled URLs from the search-links
// catalog. Prices stay on the provider's site — we render none here.

import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SEARCH_LINKS, type SearchLinkMode, type SearchLinkParams } from "@/lib/search-links";

export interface DeepLinkDialogProps {
  mode: SearchLinkMode;
  params: SearchLinkParams;
  title?: string;
  onClose: () => void;
}

export function DeepLinkDialog({ mode, params, title, onClose }: DeepLinkDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const links = SEARCH_LINKS[mode];

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      data-testid="deep-link-dialog"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Check prices with providers"}
        className="w-full max-w-lg rounded-2xl border bg-surface p-5 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold">{title ?? "Check prices"}</h2>
            <p className="mt-1 text-xs text-fg-muted">
              Opens the provider&apos;s live search with your route, date and
              passengers pre-filled. Prices are on their site — we show none here.
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-muted hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {links.map((l) => {
            const href = l.href(params);
            return (
              <li key={l.label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border bg-raised px-4 py-3 transition-colors hover:border-accent"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-fg">
                    {l.label}
                    {l.region && <Badge tone="warn">{l.region}</Badge>}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-fg-subtle transition-colors group-hover:text-accent"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
