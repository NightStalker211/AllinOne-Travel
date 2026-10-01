// ============================================================
// AllinOne Travel — destination weather.
//
// Primary: Open-Meteo (free, keyless, CORS, WMO codes).
// Fallback: OpenWeather /data/2.5/forecast (3-hour steps, keyed)
// when Open-Meteo is unreachable — the slots are grouped into
// daily max/min and attributed through the result's `source`
// (§5.1.6: the strip names which service answered, dated).
// Honest failure: any error renders nothing (no placeholder
// temperatures, ever).
// ============================================================

export interface ForecastDay {
  /** YYYY-MM-DD */
  date: string;
  tmaxC: number | null;
  tminC: number | null;
  /** Weather code (WMO for Open-Meteo, OWM id for OpenWeather). */
  code: number;
  label: string;
}

export type ForecastSource = "Open-Meteo" | "OpenWeather";

export type ForecastResult =
  | {
      state: "ok";
      days: ForecastDay[];
      fetchedAt: string;
      source: ForecastSource;
    }
  | { state: "error"; reason: string };

const WMO: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm, hail",
  99: "Thunderstorm, hail",
};

// OpenWeather condition ids grouped to a label (2xx thunder,
// 3xx drizzle, 5xx rain, 6xx snow, 7xx atmosphere, 8xx clouds).
const OWM_GROUPS: [RegExp, string][] = [
  [/^2/, "Thunderstorm"],
  [/^3/, "Drizzle"],
  [/^5/, "Rain"],
  [/^6/, "Snow"],
  [/^7/, "Atmosphere"],
  [/^800$/, "Clear"],
  [/^80/, "Clouds"],
];

const OWM_EXACT: Record<number, string> = {
  700: "Mist",
  711: "Smoke",
  721: "Haze",
  731: "Dust",
  741: "Fog",
  800: "Clear",
};

function owmLabel(id: number): string {
  if (OWM_EXACT[id]) return OWM_EXACT[id];
  for (const [re, label] of OWM_GROUPS) {
    if (re.test(String(id))) return label;
  }
  return "—";
}

function nowHhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

async function fromOpenMeteo(lat: number, lng: number): Promise<ForecastResult> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${new URLSearchParams({
        latitude: String(lat),
        longitude: String(lng),
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        timezone: "auto",
        forecast_days: "3",
      })}`,
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return { state: "error", reason: `http-${res.status}` };

    const json = (await res.json()) as {
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: (number | null)[];
        temperature_2m_min?: (number | null)[];
      };
    };
    const d = json.daily;
    if (!d?.time?.length) return { state: "error", reason: "empty" };

    const days: ForecastDay[] = d.time.map((date, i) => {
      const code = Number(d.weather_code?.[i] ?? -1);
      const max = d.temperature_2m_max?.[i];
      const min = d.temperature_2m_min?.[i];
      return {
        date,
        tmaxC: typeof max === "number" ? Math.round(max) : null,
        tminC: typeof min === "number" ? Math.round(min) : null,
        code,
        label: WMO[code] ?? "—",
      };
    });
    return { state: "ok", days, fetchedAt: nowHhmm(), source: "Open-Meteo" };
  } catch {
    return { state: "error", reason: "network" };
  }
}

async function fromOpenWeather(lat: number, lng: number): Promise<ForecastResult> {
  const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
  if (!key) return { state: "error", reason: "no-key" };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        units: "metric",
        appid: key,
        cnt: "24",
      })}`,
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return { state: "error", reason: `http-${res.status}` };
    const json = (await res.json()) as {
      city?: { timezone?: number };
      list?: {
        dt?: number;
        main?: { temp?: number; temp_max?: number; temp_min?: number };
        weather?: { id?: number }[];
      }[];
    };
    const slots = Array.isArray(json.list) ? json.list : [];
    if (slots.length === 0) return { state: "error", reason: "empty" };
    const tzSec = Number(json.city?.timezone ?? 0) || 0;

    interface Bucket {
      date: string;
      tmax: number;
      tmin: number;
      noonDelta: number;
      noonCode: number;
    }
    const buckets = new Map<string, Bucket>();
    for (const s of slots) {
      if (!s.dt || !s.main) continue;
      const local = new Date((s.dt + tzSec) * 1000);
      const date = local.toISOString().slice(0, 10);
      const hour = local.getUTCHours();
      const temp = Number(s.main.temp);
      const max = Number(s.main.temp_max ?? temp);
      const min = Number(s.main.temp_min ?? temp);
      const code = Number(s.weather?.[0]?.id ?? -1);
      let b = buckets.get(date);
      if (!b) {
        b = { date, tmax: -Infinity, tmin: Infinity, noonDelta: 99, noonCode: code };
        buckets.set(date, b);
      }
      if (Number.isFinite(max)) b.tmax = Math.max(b.tmax, max);
      if (Number.isFinite(min)) b.tmin = Math.min(b.tmin, min);
      const delta = Math.abs(hour - 12);
      if (delta < b.noonDelta) {
        b.noonDelta = delta;
        b.noonCode = code;
      }
    }
    const days: ForecastDay[] = [...buckets.values()]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map((b) => ({
        date: b.date,
        tmaxC: Number.isFinite(b.tmax) ? Math.round(b.tmax) : null,
        tminC: Number.isFinite(b.tmin) ? Math.round(b.tmin) : null,
        code: b.noonCode,
        label: owmLabel(b.noonCode),
      }));
    if (days.length === 0) return { state: "error", reason: "empty" };
    return { state: "ok", days, fetchedAt: nowHhmm(), source: "OpenWeather" };
  } catch {
    return { state: "error", reason: "network" };
  }
}

/** 3-day forecast for a point (Open-Meteo, OpenWeather fallback).
 *  Never throws. */
export async function fetchForecast(
  lat: number,
  lng: number
): Promise<ForecastResult> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { state: "error", reason: "bad-query" };
  }
  const primary = await fromOpenMeteo(lat, lng);
  if (primary.state === "ok") return primary;
  return fromOpenWeather(lat, lng);
}
