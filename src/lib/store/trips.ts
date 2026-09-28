// ============================================================
// AllinOne Travel — Trip builder state (local persistence, §15).
//
// A trip is a user-owned itinerary: every price in here was TYPED
// BY THE USER (their real bookings) — REBUILD §5.1.7. The app
// never writes a price into this store itself, so totals may only
// ever add "entered by you" figures. Persisted to localStorage.
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TripItemKind = "transport" | "stay" | "activity" | "note";

export interface TripItem {
  id: string;
  kind: TripItemKind;
  title: string;
  /** ISO date (YYYY-MM-DD), user-entered. */
  date?: string;
  from?: string;
  to?: string;
  /** Amount the user actually paid — user-typed, never computed. */
  price?: number;
  currency?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  items: TripItem[];
  createdAt: string;
  updatedAt: string;
}

interface TripsState {
  trips: Trip[];
  activeId: string | null;
  addTrip: (name: string) => string;
  removeTrip: (id: string) => void;
  setActive: (id: string | null) => void;
  updateTrip: (id: string, patch: Partial<Pick<Trip, "name" | "startDate" | "endDate">>) => void;
  addItem: (tripId: string, item: Omit<TripItem, "id">) => void;
  updateItem: (tripId: string, itemId: string, patch: Partial<TripItem>) => void;
  removeItem: (tripId: string, itemId: string) => void;
  /** Reorder one item up (-1) or down (+1); edges are no-ops. */
  moveItem: (tripId: string, itemId: string, dir: -1 | 1) => void;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function touch(trips: Trip[], id: string, fn: (t: Trip) => Trip): Trip[] {
  return trips.map((t) => (t.id === id ? { ...fn(t), updatedAt: new Date().toISOString() } : t));
}

export const useTrips = create<TripsState>()(
  persist(
    (set) => ({
      trips: [],
      activeId: null,

      addTrip(name) {
        const id = uid();
        const now = new Date().toISOString();
        const trip: Trip = { id, name: name.trim() || "Untitled trip", items: [], createdAt: now, updatedAt: now };
        set((s) => ({ trips: [...s.trips, trip], activeId: id }));
        return id;
      },

      removeTrip(id) {
        set((s) => {
          const trips = s.trips.filter((t) => t.id !== id);
          return { trips, activeId: s.activeId === id ? (trips[0]?.id ?? null) : s.activeId };
        });
      },

      setActive(id) {
        set({ activeId: id });
      },

      updateTrip(id, patch) {
        set((s) => ({ trips: touch(s.trips, id, (t) => ({ ...t, ...patch })) }));
      },

      addItem(tripId, item) {
        set((s) => ({
          trips: touch(s.trips, tripId, (t) => ({
            ...t,
            items: [...t.items, { ...item, id: uid() }],
          })),
        }));
      },

      updateItem(tripId, itemId, patch) {
        set((s) => ({
          trips: touch(s.trips, tripId, (t) => ({
            ...t,
            items: t.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
          })),
        }));
      },

      removeItem(tripId, itemId) {
        set((s) => ({
          trips: touch(s.trips, tripId, (t) => ({
            ...t,
            items: t.items.filter((i) => i.id !== itemId),
          })),
        }));
      },

      moveItem(tripId, itemId, dir) {
        set((s) => ({
          trips: touch(s.trips, tripId, (t) => {
            const idx = t.items.findIndex((i) => i.id === itemId);
            const next = idx + dir;
            if (idx < 0 || next < 0 || next >= t.items.length) return t;
            const items = [...t.items];
            [items[idx], items[next]] = [items[next], items[idx]];
            return { ...t, items };
          }),
        }));
      },
    }),
    { name: "ait-trips" }
  )
);

/** Sums the user-entered prices per currency (never converts, §6). */
export function tripTotals(trip: Trip): Array<{ currency: string; total: number; count: number }> {
  const byCur = new Map<string, { total: number; count: number }>();
  for (const item of trip.items) {
    if (typeof item.price !== "number" || !Number.isFinite(item.price)) continue;
    const cur = item.currency || "EUR";
    const agg = byCur.get(cur) ?? { total: 0, count: 0 };
    agg.total += item.price;
    agg.count += 1;
    byCur.set(cur, agg);
  }
  return [...byCur.entries()]
    .map(([currency, v]) => ({ currency, total: v.total, count: v.count }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
}
