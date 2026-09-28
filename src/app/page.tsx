import Link from "next/link";
import { ArrowRight, Compass, Luggage, Radar, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const FEATURES = [
  {
    href: "/",
    icon: Radar,
    title: "Search",
    phase: "Phase 2",
    body: "Flights with live fares, rail / bus / ferry with pre-filled price checks. No invented numbers, ever.",
  },
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
      <section className="space-y-5 pt-6 text-center">
        <Badge tone="accent" className="mx-auto">
          <ShieldCheck size={12} />
          Live prices only — no estimated fares
        </Badge>
        <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          Where to <span className="text-accent">next</span>?
        </h1>
        <p className="mx-auto max-w-2xl text-base text-fg-muted sm:text-lg">
          Compare flights, trains, buses and ferries across the world — with real
          prices from real sources, a unified country explorer and a trip builder
          that stays out of your way.
        </p>
      </section>

      {/* Search preview (honest scaffold state) */}
      <Card className="mx-auto max-w-3xl p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_160px_auto]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-fg-muted">From</span>
            <Input placeholder="City or airport" disabled aria-label="From" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-fg-muted">To</span>
            <Input placeholder="City or airport" disabled aria-label="To" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-fg-muted">Date</span>
            <Input type="date" disabled aria-label="Date" />
          </label>
          <div className="flex items-end">
            <Button className="w-full sm:w-auto" disabled>
              Search
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-warn/10 px-3 py-2 text-xs font-medium text-warn">
          Scaffold preview — the live search ships in Phase 2. Nothing here is
          simulated.
        </p>
      </Card>

      {/* Feature cards */}
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Features">
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
    </div>
  );
}
