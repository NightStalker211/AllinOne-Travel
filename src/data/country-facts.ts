// ============================================================
// AllinOne Travel — curated country facts (capital + currency).
//
// Static facts for every country in the datasets (destinations +
// carriers). RestCountries, the previous candidate source, now
// requires an API key (401 authKeyMissing as of 2026), so these
// simple, slow-changing facts are curated here instead — honest
// by the "curated dataset" rule: no live claim, no staleness risk.
// Live figures (the ECB reference rate) are fetched separately and
// always labelled with their source and date.
// ============================================================

export interface CountryFacts {
  /** Capital city as commonly cited (seat of government). */
  capital: string;
  /** ISO 4217 currency code. */
  currency: string;
  /** English currency name. */
  currencyName: string;
}

export const COUNTRY_FACTS: Record<string, CountryFacts> = {
  AD: { capital: "Andorra la Vella", currency: "EUR", currencyName: "Euro" },
  AE: { capital: "Abu Dhabi", currency: "AED", currencyName: "UAE dirham" },
  AL: { capital: "Tirana", currency: "ALL", currencyName: "Albanian lek" },
  AM: { capital: "Yerevan", currency: "AMD", currencyName: "Armenian dram" },
  AT: { capital: "Vienna", currency: "EUR", currencyName: "Euro" },
  AU: { capital: "Canberra", currency: "AUD", currencyName: "Australian dollar" },
  AZ: { capital: "Baku", currency: "AZN", currencyName: "Azerbaijani manat" },
  BA: { capital: "Sarajevo", currency: "BAM", currencyName: "Convertible mark" },
  BE: { capital: "Brussels", currency: "EUR", currencyName: "Euro" },
  BG: { capital: "Sofia", currency: "EUR", currencyName: "Euro" },
  BR: { capital: "Brasília", currency: "BRL", currencyName: "Brazilian real" },
  BY: { capital: "Minsk", currency: "BYN", currencyName: "Belarusian ruble" },
  CH: { capital: "Bern", currency: "CHF", currencyName: "Swiss franc" },
  CY: { capital: "Nicosia", currency: "EUR", currencyName: "Euro" },
  CZ: { capital: "Prague", currency: "CZK", currencyName: "Czech koruna" },
  DE: { capital: "Berlin", currency: "EUR", currencyName: "Euro" },
  DK: { capital: "Copenhagen", currency: "DKK", currencyName: "Danish krone" },
  EE: { capital: "Tallinn", currency: "EUR", currencyName: "Euro" },
  ES: { capital: "Madrid", currency: "EUR", currencyName: "Euro" },
  EU: { capital: "Brussels", currency: "EUR", currencyName: "Euro" },
  FI: { capital: "Helsinki", currency: "EUR", currencyName: "Euro" },
  FR: { capital: "Paris", currency: "EUR", currencyName: "Euro" },
  GB: { capital: "London", currency: "GBP", currencyName: "Pound sterling" },
  GE: { capital: "Tbilisi", currency: "GEL", currencyName: "Georgian lari" },
  GR: { capital: "Athens", currency: "EUR", currencyName: "Euro" },
  HR: { capital: "Zagreb", currency: "EUR", currencyName: "Euro" },
  HU: { capital: "Budapest", currency: "HUF", currencyName: "Hungarian forint" },
  IE: { capital: "Dublin", currency: "EUR", currencyName: "Euro" },
  IS: { capital: "Reykjavík", currency: "ISK", currencyName: "Icelandic króna" },
  IT: { capital: "Rome", currency: "EUR", currencyName: "Euro" },
  JP: { capital: "Tokyo", currency: "JPY", currencyName: "Japanese yen" },
  LI: { capital: "Vaduz", currency: "CHF", currencyName: "Swiss franc" },
  LT: { capital: "Vilnius", currency: "EUR", currencyName: "Euro" },
  LU: { capital: "Luxembourg", currency: "EUR", currencyName: "Euro" },
  LV: { capital: "Riga", currency: "EUR", currencyName: "Euro" },
  MC: { capital: "Monaco", currency: "EUR", currencyName: "Euro" },
  MD: { capital: "Chișinău", currency: "MDL", currencyName: "Moldovan leu" },
  ME: { capital: "Podgorica", currency: "EUR", currencyName: "Euro" },
  MK: { capital: "Skopje", currency: "MKD", currencyName: "Macedonian denar" },
  MT: { capital: "Valletta", currency: "EUR", currencyName: "Euro" },
  NL: { capital: "Amsterdam", currency: "EUR", currencyName: "Euro" },
  NO: { capital: "Oslo", currency: "NOK", currencyName: "Norwegian krone" },
  PL: { capital: "Warsaw", currency: "PLN", currencyName: "Polish złoty" },
  PT: { capital: "Lisbon", currency: "EUR", currencyName: "Euro" },
  RO: { capital: "Bucharest", currency: "RON", currencyName: "Romanian leu" },
  RS: { capital: "Belgrade", currency: "RSD", currencyName: "Serbian dinar" },
  RU: { capital: "Moscow", currency: "RUB", currencyName: "Russian ruble" },
  SE: { capital: "Stockholm", currency: "SEK", currencyName: "Swedish krona" },
  SG: { capital: "Singapore", currency: "SGD", currencyName: "Singapore dollar" },
  SI: { capital: "Ljubljana", currency: "EUR", currencyName: "Euro" },
  SK: { capital: "Bratislava", currency: "EUR", currencyName: "Euro" },
  SM: { capital: "San Marino", currency: "EUR", currencyName: "Euro" },
  TH: { capital: "Bangkok", currency: "THB", currencyName: "Thai baht" },
  TR: { capital: "Ankara", currency: "TRY", currencyName: "Turkish lira" },
  UA: { capital: "Kyiv", currency: "UAH", currencyName: "Ukrainian hryvnia" },
  US: { capital: "Washington, D.C.", currency: "USD", currencyName: "US dollar" },
  VA: { capital: "Vatican City", currency: "EUR", currencyName: "Euro" },
  XK: { capital: "Prishtina", currency: "EUR", currencyName: "Euro" },
  ZA: { capital: "Pretoria", currency: "ZAR", currencyName: "South African rand" },
};

/** Curated facts for a dataset country; undefined when unknown. */
export function countryFacts(cc: string): CountryFacts | undefined {
  return COUNTRY_FACTS[cc];
}
