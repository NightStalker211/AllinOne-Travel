import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ExplorePage() {
  return (
    <div className="animate-fade-up space-y-5" data-testid="explore-placeholder">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Compass size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Explore
          </h1>
          <p className="text-sm text-fg-muted">
            The unified country hub — map, carriers, sights, entry rules.
          </p>
        </div>
        <Badge className="ml-auto">Phase 3</Badge>
      </div>

      <Card className="p-6 text-sm text-fg-muted">
        The interactive world map and country panel ship in Phase 3: click a
        country to see its terminals, carriers (with official-site links),
        tourism providers, visa rules for your nationality and local discovery
        links — replacing three separate directories with one screen.
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
