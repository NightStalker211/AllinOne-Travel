// ============================================================
// AllinOne Travel — destination weather (Open-Meteo).
// Free, keyless, CORS-enabled daily forecast. Honest failure: any
// error renders nothing (no placeholder temperatures, ever).
// ============================================================

export interface ForecastDay {
  /** YYYY-MM-DD */
  date: string;
  tmaxC: number | null;
  tminC: number | null;
  /** WMO weather interpretation code. */
  code: number;
  label: string;
}

export type ForecastResult =
  | { state: "ok"; days: ForecastDay[]; fetchedAt: string }
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

function nowHhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

/** 3-day forecast for a point. Never throws. */
export async function fetchForecast(
  lat: number,
  lng: number
): Promise<ForecastResult> {
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
    return { state: "ok", days, fetchedAt: nowHhmm() };
  } catch {
    return { state: "error", reason: "network" };
  }
}
