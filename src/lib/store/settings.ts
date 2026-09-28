// ============================================================
// AllinOne Travel — persisted user settings (currency, nationality)
// Local-only storage, no accounts (REBUILD §15).
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  /** ISO 4217 code; default EUR (REBUILD §6). Used for live fare quotes. */
  currency: string;
  /** ISO 3166-1 alpha-2 passport code; drives the Visa tab. */
  nationality: string;
  setCurrency: (code: string) => void;
  setNationality: (code: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      currency: "EUR",
      nationality: "DE",
      setCurrency: (code) => set({ currency: code }),
      setNationality: (code) => set({ nationality: code }),
    }),
    { name: "ait-settings" }
  )
);
