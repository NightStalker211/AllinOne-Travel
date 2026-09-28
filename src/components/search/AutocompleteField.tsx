"use client";

// City/terminal autocomplete over the 4,006-record index.
// Keyboard: arrows move, Enter selects, Escape closes.

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchPlaces, type PlaceMatch } from "@/lib/search/places";
import { geocodeOsm, rememberOsmPlace } from "@/lib/search/osm";
import type { PlaceRef } from "@/lib/types/search";

export interface AutocompleteFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: PlaceRef | null;
  onChange: (ref: PlaceRef | null) => void;
  /** Hide this key (picked on the other side of the form). */
  excludeKey?: string;
}

export function AutocompleteField({
  id,
  label,
  placeholder,
  value,
  onChange,
  excludeKey,
}: AutocompleteFieldProps) {
  const [text, setText] = useState(value ? value.city : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(value ? value.city : "");
  }, [value]);

  const matches = useMemo(
    () =>
      searchPlaces(text, 8).filter((m) => m.key !== excludeKey),
    [text, excludeKey]
  );

  // OSM geocoding fallback: only when the local index finds little and
  // the query is meaningful. Results are marked "OSM" in the list.
  const [osmMatches, setOsmMatches] = useState<PlaceMatch[]>([]);
  useEffect(() => {
    const q = text.trim();
    if (q.length < 3 || matches.length >= 3) {
      setOsmMatches([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      geocodeOsm(q).then((rows) => {
        if (cancelled) return;
        setOsmMatches(
          rows.filter(
            (o) =>
              o.key !== excludeKey &&
              !matches.some(
                (m) => m.cc === o.cc && m.city.toLowerCase() === o.city.toLowerCase()
              )
          )
        );
      });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, matches.length, excludeKey]);

  const visible = useMemo(
    () => [...matches, ...osmMatches],
    [matches, osmMatches]
  );

  function select(m: PlaceMatch) {
    if (m.key.startsWith("osm-")) rememberOsmPlace(m);
    onChange({ city: m.city, cc: m.cc });
    setText(m.city);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (open && visible[active]) {
        e.preventDefault();
        select(visible[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-fg-muted">
        {label}
      </label>
      <input
        id={id}
        role="combobox"
        aria-expanded={open && visible.length > 0}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        autoComplete="off"
        className={cn(
          "h-10 w-full rounded-xl border bg-raised px-3.5 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-line focus:border-accent focus:outline-none"
        )}
        placeholder={placeholder}
        value={text}
        data-testid={`ac-${id}`}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setActive(0);
          if (!e.target.value) onChange(null);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={onKeyDown}
      />
      {open && visible.length > 0 && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border bg-surface p-1 shadow-pop"
        >
          {visible.map((m, i) => (
            <li
              key={m.key}
              role="option"
              aria-selected={i === active}
              data-testid={`ac-option-${id}`}
              data-source={m.key.startsWith("osm-") ? "osm" : "index"}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                i === active ? "bg-accent/15 text-fg" : "text-fg-muted hover:bg-muted"
              )}
              // mousedown fires before input blur
              onMouseDown={(e) => {
                e.preventDefault();
                if (blurTimer.current) clearTimeout(blurTimer.current);
                select(m);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <MapPin size={14} className="shrink-0 text-fg-subtle" />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-semibold text-fg">{m.city}</span>
                <span className="text-fg-subtle"> · {m.country}</span>
              </span>
              {m.key.startsWith("osm-") && (
                <span className="shrink-0 rounded border px-1 py-0.5 text-[10px] font-semibold uppercase text-fg-subtle">
                  OSM
                </span>
              )}
              <span className="shrink-0 truncate text-[11px] text-fg-subtle tabular-nums">
                {m.matchedIata
                  ? m.matchedIata
                  : m.iatas.length > 0
                    ? m.iatas.slice(0, 3).join(" ")
                    : m.key.startsWith("osm-")
                      ? "geocoded"
                      : `${m.terminals.length} term.`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
