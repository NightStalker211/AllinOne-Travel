import Link from "next/link";
import { Suspense } from "react";
import { Compass, Luggage, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SearchForm } from "@/components/search/SearchForm";
import { PopularRoutes } from "@/components/search/PopularRoutes";

const FEATURES = [
  {
    href: "/explore/",
    icon: Compass,
    title: "Explore",
    phase: "Phase 3",
    body: "One country hub: map, terminals, carriers, sights, entry rules and local links — all in a single panel.",
  },
  {
    href: "/trips/",
    icon: Luggage,
    title: "Trips",
    phase: "Phase 4",
    body: "Build an itinerary from real search results, track what you actually paid, export anytime.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="animate-fade-up space-y-10" data-testid="home">
      {/* Hero */}
      <section className="space-y-5 pt-4 text-center">
        <Badge tone="accent" className="mx-auto">
          <ShieldCheck size={12} />
          Live prices only — no estimated fares
        </Badge>
        <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          Where to <span className="text-accent">next</span>?
        </h1>
        <p className="mx-auto max-w-2xl text-base text-fg-muted sm:text-lg">
          Search flights with live fares, trains, buses and ferries with honest
          deep links — plus a unified country explorer. If we don&apos;t know a
          price, we say so instead of guessing.
        </p>
      </section>

      {/* Hero search card — Suspense: SearchForm reads useSearchParams
          for ?from=/&to= prefill (Explore quick actions). */}
      <Card className="mx-auto max-w-3xl p-4 sm:p-6" data-testid="hero-search">
        <Suspense fallback={null}>
          <SearchForm />
        </Suspense>
      </Card>

      {/* Popular routes — derived from curated known-routes data */}
      <PopularRoutes />

      {/* Feature cards */}
      <section className="grid gap-4 sm:grid-cols-2" aria-label="Sections">
        {FEATURES.map((f) => (
          <Link key={f.title} href={f.href} className="group">
            <Card className="h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-pop">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <f.icon size={20} />
                </span>
                <Badge>{f.phase}</Badge>
              </div>
              <h2 className="font-display text-lg font-bold">{f.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{f.body}</p>
            </Card>
          </Link>
        ))}
      </section>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-fg-subtle">
        <Sparkles size={11} />
        Rail, bus and ferry never show prices — they link to operators instead.
      </p>
    </div>
  );
}
