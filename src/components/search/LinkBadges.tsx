// Honest cost / affiliation badges for provider links.
// fee facts are per-link verified metadata in search-links.ts;
// the partner badge marks Travelpayouts affiliate links.

import type { SearchLinkFee } from "@/lib/search-links";

const FEE_TEXT: Record<SearchLinkFee, string> = {
  free: "Free search",
  "service-fee": "Service fee may apply",
};

export function LinkFeeBadge({ fee }: { fee: SearchLinkFee }) {
  return (
    <span
      data-testid="link-fee"
      data-fee={fee}
      className="rounded border border-line px-1 py-px text-[10px] font-medium text-fg-subtle"
      title={
        fee === "free"
          ? "Searching on this site costs you nothing"
          : "This site charges the traveller a service fee on bookings"
      }
    >
      {FEE_TEXT[fee]}
    </span>
  );
}

export function PartnerBadge() {
  return (
    <span
      data-testid="link-partner"
      className="rounded border border-accent/40 px-1 py-px text-[10px] font-medium text-accent"
      title="Affiliate link — we may earn a commission if you book"
    >
      Affiliate link
    </span>
  );
}
