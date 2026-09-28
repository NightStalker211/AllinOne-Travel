"use client";

// Shared visa card — REBUILD §7.1 §5: status for the user's selected
// nationality, confidence label, official portal (or an honest
// fallback note) and the "not legal advice" disclaimer. Used by the
// Search results Visa tab and the Explore country panel.

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ALL_PASSPORTS } from "@/data/passports";

export function VisaPanel({
  destination,
  nationality,
  visa,
}: {
  destination: string;
  nationality: string;
  visa: { status: string; confidence: string; portalUrl: string; officialPortal: boolean };
}) {
  const passport = ALL_PASSPORTS.find((p) => p.code === nationality);
  const label =
    visa.status === "visa-free"
      ? "Visa-free"
      : visa.status === "visa-on-arrival"
        ? "Visa on arrival"
        : visa.status === "e-visa"
          ? "eVisa"
          : "Visa required";
  const tone =
    visa.status === "visa-free"
      ? "live"
      : visa.status === "visa-required"
        ? "warn"
        : "accent";
  return (
    <Card className="space-y-4 p-5" data-testid="visa-panel">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{passport?.name ?? nationality} passport</Badge>
        <span className="text-fg-subtle">→</span>
        <Badge tone="neutral">{destination}</Badge>
        <Badge tone={tone as "live" | "warn" | "accent"}>{label}</Badge>
      </div>
      <div className="space-y-1.5 text-sm text-fg-muted">
        <p>
          Data confidence:{" "}
          <strong className={visa.confidence === "confirmed" ? "text-live" : "text-warn"}>
            {visa.confidence}
          </strong>
          {visa.confidence !== "confirmed" && " — verify before you travel."}
        </p>
        {!visa.officialPortal && (
          <p className="text-warn">
            No official portal on file for this destination — the link goes to a
            general entry guide instead.
          </p>
        )}
        <p className="text-xs text-fg-subtle">
          Not legal advice — always confirm with the official source.
        </p>
      </div>
      <a
        href={visa.portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent"
        data-testid="visa-portal-link"
      >
        {visa.officialPortal ? "Official portal" : "Entry guide"}
        <ExternalLink size={14} />
      </a>
    </Card>
  );
}
