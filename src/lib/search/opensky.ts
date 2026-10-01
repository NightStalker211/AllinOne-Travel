// AllinOne Travel — OpenSky Network aircraft states (FEAT-9).
//
// OpenSky's own CORS only ever names its origin (and the OAuth
// password grant answers 403), so the renderer reaches the data
// through the app's local relay /api/opensky/* (electron/api-relay.js)
// which attaches HTTP Basic auth (OPENSKY_USERNAME/OPENSKY_PASSWORD)
// server-side — those credentials never enter the bundle. The
// endpoint answers JSON: `time` plus `states` arrays in the fixed
// 17-field order documented by OpenSky; parseOpenSkyStates maps
// those arrays onto typed objects and skips nothing the feed sent.
//
// Altitudes are metres, speeds m/s, tracks degrees — exactly as
// returned; nothing is converted or estimated here.

export type OpenSkyErrorReason =
  | "not-configured" // relay reports missing server-side credentials
  | "bad-request" // relay rejected the bounding box
  | "unavailable"; // network / relay / upstream failure

export interface GeoBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface AircraftState {
  icao24: string;
  callsign: string;
  country: string;
  /** Unix seconds of the position fix (null when unknown). */
  timePosition: number | null;
  /** Unix seconds of the last state message. */
  lastContact: number | null;
  longitude: number | null;
  latitude: number | null;
  /** Barometric altitude in metres. */
  baroAltitude: number | null;
  onGround: boolean;
  /** Ground speed in m/s. */
  velocity: number | null;
  /** Heading over ground in degrees. */
  trueTrack: number | null;
  /** Climb rate in m/s. */
  verticalRate: number | null;
  /** Geometric altitude in metres. */
  geoAltitude: number | null;
  squawk: string | null;
  /** 0 = ADS-B, 1 = ASTERIX MLAT, 2 = PAN 107. */
  positionSource: number;
}

export type OpenSkyResult =
  | { state: "ok"; time: number; aircraft: AircraftState[]; fetchedAt: string }
  | { state: "error"; reason: OpenSkyErrorReason };

const hhmmNow = (): string => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const nul = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

/** Map one OpenSky states[] row (fixed 17-field order) to a typed object. */
export function parseOpenSkyRow(row: unknown): AircraftState | null {
  if (!Array.isArray(row) || row.length < 17) return null;
  return {
    icao24: str(row[0]),
    callsign: str(row[1]),
    country: str(row[2]),
    timePosition: nul(row[3]),
    lastContact: nul(row[4]),
    longitude: nul(row[5]),
    latitude: nul(row[6]),
    baroAltitude: nul(row[7]),
    onGround: row[8] === true,
    velocity: nul(row[9]),
    trueTrack: nul(row[10]),
    verticalRate: nul(row[11]),
    geoAltitude: nul(row[13]),
    squawk: typeof row[14] === "string" ? row[14].trim() : null,
    positionSource: typeof row[16] === "number" ? row[16] : 0,
  };
}

/** Parse the /states/all document (`time` + `states`). */
export function parseOpenSkyStates(payload: unknown): {
  time: number;
  aircraft: AircraftState[];
} {
  const obj = payload as { time?: unknown; states?: unknown };
  const time = typeof obj?.time === "number" ? obj.time : 0;
  const rows = Array.isArray(obj?.states) ? obj.states : [];
  const aircraft: AircraftState[] = [];
  for (const row of rows) {
    const craft = parseOpenSkyRow(row);
    if (craft && craft.icao24) aircraft.push(craft);
  }
  return { time, aircraft };
}

/**
 * Live aircraft inside a bounding box (route corridor, destination
 * area, …). Never throws; failure is an honest error state.
 */
export async function fetchAircraftStates(bounds: GeoBounds): Promise<OpenSkyResult> {
  const query = new URLSearchParams({
    south: String(bounds.south),
    west: String(bounds.west),
    north: String(bounds.north),
    east: String(bounds.east),
  });
  try {
    const res = await fetch(`/api/opensky/states?${query}`, { cache: "no-store" });
    if (res.status !== 200) {
      if (res.status === 400) return { state: "error", reason: "bad-request" };
      if (res.status === 503) return { state: "error", reason: "not-configured" };
      return { state: "error", reason: "unavailable" };
    }
    const { time, aircraft } = parseOpenSkyStates(await res.json());
    return { state: "ok", time, aircraft, fetchedAt: hhmmNow() };
  } catch {
    return { state: "error", reason: "unavailable" };
  }
}
