"use client";

// Interactive world map — bundled SVG shapes (REBUILD §7.1): no tile
// server, no API key, works offline in Electron. The map is a
// SELECTOR: data countries are highlighted and clickable, everything
// else is reachable through the search box and the country grid
// below — the map is never the only path (aria-hidden, keyboard
// users go through those).

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WORLD_SHAPES, WORLD_VIEWBOX } from "@/data/worldPaths";
import { allCountryCounts, countryIdentity, type CountryCounts } from "@/lib/explore/country-data";

interface HoverState {
  cc: string;
  x: number;
  y: number;
}

export function WorldMap({ selected }: { selected?: string }) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const counts = useMemo<Record<string, CountryCounts>>(() => allCountryCounts(), []);
  const dataSet = useMemo(() => new Set(Object.keys(counts)), [counts]);

  const sel = selected?.toUpperCase();

  function enter(cc: string, e: React.MouseEvent) {
    if (!dataSet.has(cc)) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    setHover({
      cc,
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    });
  }

  function leave() {
    setHover(null);
  }

  function click(cc: string) {
    if (!dataSet.has(cc)) return;
    router.push(`/explore/${cc.toLowerCase()}`);
  }

  const hoverId = hover ? counts[hover.cc] : null;
  const hoverName = hover ? countryIdentity(hover.cc) : null;

  return (
    <div ref={wrapRef} className="relative" data-testid="explore-map">
      <svg
        viewBox={WORLD_VIEWBOX}
        className="block w-full select-none"
        aria-hidden="true"
        role="presentation"
      >
        {WORLD_SHAPES.map((s) => {
          const hasData = dataSet.has(s.cc);
          const isSelected = sel === s.cc;
          const isHovered = hover?.cc === s.cc;
          return (
            <path
              key={s.cc}
              d={s.d}
              data-testid={`map-country-${s.cc}`}
              data-has-data={hasData ? "1" : "0"}
              className={[
                "cursor-pointer transition-[fill,stroke] duration-150",
                isSelected
                  ? "fill-accent stroke-fg stroke-1"
                  : hasData
                    ? isHovered
                      ? "fill-accent/70 stroke-fg/40 stroke-1"
                      : "fill-accent/35 stroke-line stroke-1 hover:fill-accent/55"
                    : "fill-muted stroke-line stroke-[0.5] hover:fill-subtle",
              ].join(" ")}
              onClick={() => click(s.cc)}
              onMouseMove={(e) => enter(s.cc, e)}
              onMouseLeave={leave}
            />
          );
        })}
      </svg>

      {hover && hoverId && hoverName && (
        <div
          data-testid="map-tooltip"
          className="pointer-events-none absolute z-20 max-w-[240px] rounded-xl border bg-raised px-3 py-2 text-xs shadow-pop"
          style={{
            left: Math.min(hover.x + 14, 520),
            top: Math.max(hover.y - 10, 4),
          }}
        >
          <p className="font-semibold text-fg">
            {hoverName.flag} {hoverName.name} <span className="text-fg-subtle">({hover.cc})</span>
          </p>
          <p className="mt-0.5 text-fg-muted">
            {hoverId.terminals} terminals · {hoverId.carriers} carriers · {hoverId.providers}{" "}
            providers
          </p>
        </div>
      )}
    </div>
  );
}
