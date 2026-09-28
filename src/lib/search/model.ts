// ============================================================
// AllinOne Travel — geometry + modeled durations
//
// Durations here are MODELED AVERAGES from great-circle distance.
// They may only be rendered with the "est." label (REBUILD §5.2).
// Speeds are documented averages — never presented as schedules.
// ============================================================

import type { RowMode } from "@/lib/types/search";

const EARTH_KM = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(s));
}

/** Modeled average speeds (km/h) + fixed overhead — all output is `est.` */
const MODEL: Record<RowMode, { speed: number; overheadMin: number }> = {
  air: { speed: 750, overheadMin: 45 }, // taxi + climb/descend
  rail: { speed: 85, overheadMin: 15 }, // stop-adjusted average
  bus: { speed: 65, overheadMin: 10 },
  sea: { speed: 30, overheadMin: 30 }, // port handling
};

export function estMinutes(km: number, mode: RowMode): number {
  const m = MODEL[mode];
  return Math.round((km / m.speed) * 60 + m.overheadMin);
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Always the rendering form for modeled durations. */
export function formatEst(min: number): string {
  return `est. ${formatDuration(min)}`;
}
