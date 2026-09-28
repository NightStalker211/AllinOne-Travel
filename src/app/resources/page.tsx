import Link from "next/link";
import { ArrowLeft, Library } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ResourcesPage() {
  return (
    <div className="animate-fade-up space-y-5" data-testid="resources-placeholder">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Library size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Resources
          </h1>
          <p className="text-sm text-fg-muted">
            A curated, re-verified directory of useful travel links.
          </p>
        </div>
        <Badge className="ml-auto">Phase 5</Badge>
      </div>

      <Card className="p-6 text-sm text-fg-muted">
        Search engines, rail/bus/ferry operators, hotel sites, visa portals,
        maps and planning tools — every link checked before release, grouped by
        category, with honest notes where a site blocks automated checks.
      </Card>

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft size={14} />
        Back to Search
      </Link>
    </div>
  );
}
