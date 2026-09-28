import Link from "next/link";
import { ArrowLeft, Luggage } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function TripsPage() {
  return (
    <div className="animate-fade-up space-y-5" data-testid="trips-placeholder">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Luggage size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Trips</h1>
          <p className="text-sm text-fg-muted">
            Your itinerary — built from real results, priced only by you.
          </p>
        </div>
        <Badge className="ml-auto">Phase 4</Badge>
      </div>

      <Card className="p-6 text-sm text-fg-muted">
        Add legs from search results or enter them manually, reorder the plan,
        keep a total of what you actually paid (never app-generated numbers) and
        export the trip as Markdown or JSON. Persistence is local.
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
