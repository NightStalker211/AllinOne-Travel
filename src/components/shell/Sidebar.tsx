"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Library, Luggage, Radar, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Search", icon: Radar, hint: "Live fares & price checks" },
  { href: "/explore/", label: "Explore", icon: Compass, hint: "Map, carriers, sights" },
  { href: "/trips/", label: "Trips", icon: Luggage, hint: "Your itinerary" },
  { href: "/resources/", label: "Resources", icon: Library, hint: "Verified link directory" },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  hint,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Compass;
  hint: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
        active
          ? "bg-accent/15 text-fg"
          : "text-fg-muted hover:bg-muted hover:text-fg"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          active ? "bg-accent text-ink-950" : "bg-muted text-fg-muted group-hover:text-fg"
        )}
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        <span className="block truncate text-[11px] leading-tight text-fg-subtle">
          {hint}
        </span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r bg-surface md:flex">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-ink-950">
          <Settings2 size={18} className="animate-spin [animation-duration:12s]" />
        </span>
        <span className="leading-none">
          <span className="block font-display text-[17px] font-extrabold tracking-tight">
            AllinOne
          </span>
          <span className="block text-[11px] font-medium tracking-[0.2em] text-fg-subtle uppercase">
            Travel
          </span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3" aria-label="Main">
        {NAV.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/search")
                : pathname.startsWith(item.href.replace(/\/$/, ""))
            }
          />
        ))}
      </nav>

      {/* Footer: theme + version */}
      <div className="space-y-3 border-t px-3 py-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-medium text-fg-subtle">Theme</span>
          <ThemeToggle />
        </div>
        <p
          className="px-2 text-[11px] text-fg-subtle tabular-nums"
          data-testid="app-version"
          title={`Built ${process.env.NEXT_PUBLIC_BUILD_TIME ?? "unknown"}`}
        >
          v{process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0"}
        </p>
      </div>
    </aside>
  );
}
