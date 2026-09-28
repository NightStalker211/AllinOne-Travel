// ============================================================
// AllinOne Travel — Currency Definitions
// ============================================================

export interface CurrencyDef {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: CurrencyDef[] = [
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
];

export function formatPrice(amount: number, currencyCode: string): string {
  const cur = CURRENCIES.find((c) => c.code === currencyCode);
  const sym = cur?.symbol || currencyCode;
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: ["JPY"].includes(currencyCode) ? 0 : 0,
    maximumFractionDigits: 0,
  });
  if (["EUR", "USD", "TRY", "GBP", "CAD", "AUD"].includes(currencyCode)) {
    return `${sym}${formatted}`;
  }
  return `${formatted} ${sym}`;
}

export function getCurrencyByCode(code: string): CurrencyDef | undefined {
  return CURRENCIES.find((c) => c.code === code);
}

// ---------- Exchange Rates (relative to USD) ----------
// These are approximate static rates for conversion display.
// In production, replace with live API calls.

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 34.5,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.5,
};

/** Convert a price from one currency to another using static rates */
export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];
  if (!fromRate || !toRate) return amount;
  // Convert to USD first, then to target currency
  const inUSD = amount / fromRate;
  const converted = inUSD * toRate;
  return Math.round(converted);
}

/** Format price with currency symbol */
export function formatPriceWithCurrency(
  amount: number,
  currencyCode: string
): string {
  const cur = getCurrencyByCode(currencyCode);
  const sym = cur?.symbol || currencyCode;
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: currencyCode === "JPY" ? 0 : 0,
    maximumFractionDigits: 0,
  });
  if (["EUR", "USD", "TRY", "GBP", "CAD", "AUD"].includes(currencyCode)) {
    return `${sym}${formatted}`;
  }
  return `${formatted} ${sym}`;
}
