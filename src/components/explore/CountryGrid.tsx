"use client";

// Non-map fallback for the Explore hub (REBUILD §7.1): every data
// country as a link — flag, name and counts. This is also the
// accessibility path and the coverage for microstates that have no
// 110m map shape (AD, LI, MC, MT, SG, SM, VA, XK, EU).

import Link from "next/link";
import { useMemo } from "react";
import {
  allCountryCounts,
  countryIdentity,
  dataCountryCodes,
} from "@/lib/explore/country-data";

export function CountryGrid({ selected }: { selected?: string }) {
  const ccList = useMemo(() => dataCountryCodes(), []);
  const counts = useMemo(() => allCountryCounts(), []);
  const sel = selected?.toUpperCase();

  return (
    <div data-testid="country-grid" className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
        All countries with data — no map needed
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {ccList.map((cc) => {
          const id = countryIdentity(cc);
          const c = counts[cc];
          return (
            <li key={cc}>
              <Link
                href={`/explore/${cc.toLowerCase()}`}
                data-testid={`grid-country-${cc}`}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-colors hover:border-accent ${
                  sel === cc ? "border-accent bg-accent/10" : "bg-raised"
                }`}
              >
                <span aria-hidden className="text-lg leading-none">
                  {id.flag || "•"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-fg">{id.name}</span>
                  <span className="block text-[10px] text-fg-subtle">
                    {c.terminals} terminals · {c.carriers} carriers
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
