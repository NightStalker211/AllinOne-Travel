// ============================================================
// AllinOne Travel — curated data schemas
// Structural types for the data-only modules under src/data/.
// The values were migrated from the legacy dataset (commit P1-2);
// this schema is part of the fresh codebase.
// ============================================================

export type TransportType = "air" | "rail" | "bus" | "sea";

export type Continent =
  | "europe"
  | "asia"
  | "middle-east"
  | "africa"
  | "americas"
  | "oceania";

export interface Carrier {
  name: string;
  mode: TransportType;
  website?: string;
  tags?: string[];
  notes?: string;
  /** Operating status — omit when active. */
  status?: "active" | "defunct";
  /** Optional override; otherwise inherits country continent. */
  continent?: Continent;
}

export interface CountryCarriers {
  /** ISO 3166-1 alpha-2 */
  code: string;
  name: string;
  flag: string;
  continent: Continent;
  air: Carrier[];
  rail: Carrier[];
  bus: Carrier[];
  sea: Carrier[];
  notes?: string;
}

export type LocalCategory = "rail" | "sea" | "bus" | "hotel";

export interface LocalProvider {
  id: string;
  name: string;
  category: LocalCategory;
  /** ISO 3166-1 alpha-2 */
  country: string;
  continent: Continent;
  region: string;
  website: string;
  tags: string[];
  description?: string;
}
