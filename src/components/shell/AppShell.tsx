"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Library, Luggage, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

const TABS = [
  { href: "/", label: "Search", icon: Radar },
  { href: "/explore/", label: "Explore", icon: Compass },
  { href: "/trips/", label: "Trips", icon: Luggage },
  { href: "/resources/", label: "Resources", icon: Library },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <Sidebar />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-ink-950">
            <Radar size={16} />
          </span>
          <span className="font-display text-base font-extrabold">AllinOne Travel</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="md:pl-[264px]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-surface/95 backdrop-blur md:hidden"
      >
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href.replace(/\/$/, ""));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-accent" : "text-fg-subtle"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  );
}
