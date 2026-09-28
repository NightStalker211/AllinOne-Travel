"use client";

// Explore search box (REBUILD §7.1): accepts country, city and
// terminal names — a keyboard-navigable path so the map is never
// required. Choosing any result opens the country panel.

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { norm, searchPlaces } from "@/lib/search/places";
import { countryIdentity, dataCountryCodes } from "@/lib/explore/country-data";
import { TERMINALS } from "@/data/destinations";

interface Suggestion {
  id: string;
  kind: "country" | "city" | "terminal";
  label: string;
  sub: string;
  href: string;
}

export function ExploreSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = useMemo<Suggestion[]>(() => {
    const query = norm(q.trim());
    if (query.length < 2) return [];
    const out: Suggestion[] = [];

    for (const cc of dataCountryCodes()) {
      const id = countryIdentity(cc);
      if (norm(id.name).includes(query) || cc.toLowerCase() === query) {
        out.push({
          id: `c-${cc}`,
          kind: "country",
          label: `${id.flag} ${id.name}`,
          sub: `Country (${cc})`,
          href: `/explore/${cc.toLowerCase()}`,
        });
      }
      if (out.length >= 4) break;
    }

    for (const p of searchPlaces(q.trim(), 4)) {
      out.push({
        id: `city-${p.key}`,
        kind: "city",
        label: `${p.city}, ${p.country}`,
        sub: `City · ${p.terminals.length} terminals`,
        href: `/explore/${p.cc.toLowerCase()}`,
      });
    }

    if (out.length < 6) {
      const nq = norm(q.trim());
      for (const t of TERMINALS) {
        if (out.length >= 9) break;
        if (norm(t.displayName).includes(nq)) {
          out.push({
            id: `t-${t.id}`,
            kind: "terminal",
            label: t.displayName,
            sub: `${t.city ?? ""}${t.city ? ", " : ""}${t.country} · ${t.category}`,
            href: `/explore/${t.countryCode.toLowerCase()}`,
          });
        }
      }
    }

    // de-dup by id, cap at 9
    const seen = new Set<string>();
    return out.filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true))).slice(0, 9);
  }, [q]);

  function choose(s: Suggestion) {
    setOpen(false);
    setQ("");
    router.push(s.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const s = suggestions[active];
      if (s) choose(s);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative" data-testid="explore-search">
      <label className="flex items-center gap-2 rounded-xl border bg-raised px-3 py-2.5 focus-within:border-accent">
        <Search size={15} className="shrink-0 text-fg-muted" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="explore-search-list"
          aria-autocomplete="list"
          aria-label="Search countries, cities and terminals"
          placeholder="Search country, city or terminal…"
          data-testid="explore-search-input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
        />
      </label>

      {open && suggestions.length > 0 && (
        <ul
          id="explore-search-list"
          role="listbox"
          ref={listRef}
          data-testid="explore-search-list"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-xl border bg-raised py-1 shadow-pop"
        >
          {suggestions.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                data-testid="explore-search-option"
                className={`flex w-full flex-col items-start px-3 py-2 text-left ${
                  i === active ? "bg-accent/15" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(s)}
              >
                <span className="text-sm font-semibold text-fg">{s.label}</span>
                <span className="text-xs text-fg-muted">{s.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
