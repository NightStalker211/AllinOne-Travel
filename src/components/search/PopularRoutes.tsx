"use client";

// Popular route chips — derived at runtime from the curated
// known-routes dataset (most-carried pairs), never hand-picked.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { popularRoutes } from "@/lib/search/places";

export function PopularRoutes() {
  const router = useRouter();
  const [routes, setRoutes] = useState<
    { id: string; from: { city: string; cc: string }; to: { city: string; cc: string }; label: string }[]
  >([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setRoutes(popularRoutes(6));
      setReady(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!ready || routes.length === 0) return null;

  return (
    <section
      className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2"
      aria-label="Popular curated routes"
      data-testid="popular-routes"
    >
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
        <TrendingUp size={13} className="text-accent" />
        Busy curated routes:
      </span>
      {routes.map((r) => (
        <button
          key={r.id}
          onClick={() =>
            router.push(
              `/search?${new URLSearchParams({
                from: `${r.from.city},${r.from.cc}`,
                to: `${r.to.city},${r.to.cc}`,
                date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
                pax: "1",
              })}`
            )
          }
          className="rounded-full border bg-raised px-3.5 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:border-accent hover:text-fg"
        >
          {r.label}
        </button>
      ))}
    </section>
  );
}
