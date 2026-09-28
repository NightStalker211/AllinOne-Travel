"use client";

// Explore layout (REBUILD §7.1): heading + search box + 60/40 map /
// panel split, country grid below the map. The panel is `children`
// — the server route passes either the prompt (index) or the full
// country panel (/explore/[cc]).

import { Compass, MapPinned } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { WORLD_SHAPE_STATS } from "@/data/worldPaths";
import { ExploreSearch } from "./ExploreSearch";
import { WorldMap } from "./WorldMap";
import { CountryGrid } from "./CountryGrid";

export function ExploreShell({
  selected,
  children,
}: {
  selected?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up space-y-5" data-testid="explore-page">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Compass size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Explore</h1>
          <p className="text-sm text-fg-muted">
            One hub per country — terminals, carriers, sights, entry rules.
          </p>
        </div>
        <Badge className="ml-auto" data-testid="map-badge">
          <MapPinned size={12} />
          {WORLD_SHAPE_STATS.shapes} bundled shapes · offline
        </Badge>
      </div>

      <ExploreSearch />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="space-y-3 p-3 sm:p-4">
          <WorldMap selected={selected} />
          <CountryGrid selected={selected} />
        </Card>
        <div>{children}</div>
      </div>
    </div>
  );
}
