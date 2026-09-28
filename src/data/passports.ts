// ============================================================
// AllinOne Travel — Global Passport List
// Complete ISO-3166 countries with visa status data
//
// DATA QUALITY (2026-09-24 audit)
// --------------------------------
// passportindex.org has NO public API/feed (ToS: research-only, permission
// required) — this file is manually curated, not scraped.
//
// Confidence levels per VISA_DATA key:
//   "confirmed"  — cross-checked against official/embassy sources for the
//                  common corridors; safe to show without extra hedging
//                  beyond the standard disclaimer.
//   "best-effort"— plausible but NOT fully verified pair-by-pair; treat as
//                  a starting point only.
//
// getVisaConfidence() reports which level applies to a given passport.
// Anything NOT listed in a passport's three arrays resolves to
// "visa-required" in getVisaStatus() (unknown ≠ visa-free).
// ============================================================

export interface PassportCountry {
  code: string;          // ISO 3166-1 alpha-2
  name: string;
  emoji: string;         // Flag emoji
  region: string;
  visaFreeTo: string[];  // Country codes where visa-free
  visaOnArrival: string[];
  eVisa: string[];
  visaRequired: string[];
}

export type VisaDataConfidence = "confirmed" | "best-effort";

// Per-passport audit confidence (extend as pairs get verified).
const VISA_DATA_CONFIDENCE: Record<string, VisaDataConfidence> = {
  TR: "confirmed",
  US: "confirmed",
  GB: "best-effort",
  DE: "best-effort",
  FR: "best-effort",
  JP: "best-effort",
  AU: "best-effort",
  IN: "best-effort",
  SA: "best-effort",
  BR: "best-effort",
  EG: "best-effort",
  ZA: "best-effort",
};

/**
 * Confidence level for a passport's visa dataset.
 * Pair-level overrides can be added later; today it is per-passport.
 */
export function getVisaConfidence(passportCode: string): VisaDataConfidence {
  return VISA_DATA_CONFIDENCE[passportCode] ?? "best-effort";
}

// Simplified visa data for major destinations
const VISA_DATA: Record<string, { visaFree: string[]; visaOnArrival: string[]; eVisa: string[] }> = {
  US: {
    // Removed from prior list: BY (Belarus — visa required for US),
    // SA/OM/BH/KW (not visa-free; e-visa/visa on arrival/visa required).
    visaFree: ["CA","GB","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","TR","JP","KR","SG","CL","AR","BR","MX","IL","AE","QA"],
    visaOnArrival: [],
    eVisa: ["IN","EG","ET","MM","PK","LK","NP","BD","KH","LA","MV","TZ","KE","UG","RW","SA","OM","BH","KW","AU","NZ","VN"],
  },
  GB: { visaFree: ["US","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","CL","AR","BR","MX","IL","AE","QA","SA","OM","BH","KW","TR"], visaOnArrival: [], eVisa: ["IN","EG","ET","MM","PK","LK","NP","BD","KH","LA","MV","TZ","KE","UG","RW"] },
  DE: { visaFree: ["US","GB","CA","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","CL","AR","BR","MX","IL","AE","QA","SA","OM","BH","KW","TR"], visaOnArrival: [], eVisa: ["IN","EG","ET","MM","PK","LK","NP","BD","KH","LA","MV","TZ","KE","UG","RW"] },
  FR: { visaFree: ["US","GB","CA","DE","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","CL","AR","BR","MX","IL","AE","QA","SA","OM","BH","KW","TR"], visaOnArrival: [], eVisa: ["IN","EG","ET","MM","PK","LK","NP","BD","KH","LA","MV","TZ","KE","UG","RW"] },
  // Turkey (audited 2026-09-24, confidence: confirmed for the pairs below).
  // FIX: Schengen/EU (incl. SE) and US/CA/AU/NZ/IL were wrongly listed as
  // visa-free/VOA — Turkish citizens need a visa (Schengen C, B1/B2, etc.).
  // GB removed from eVisa (standard UK Visitor visa required, not an e-visa).
  TR: {
    visaFree: [
      // Western Balkans / Eastern Europe
      "RS","BA","ME","AL","MK","XK","MD","UA","GE",
      // Caucasus / Central Asia / Eurasia
      "AZ","KZ","KG","TJ","UZ","RU",
      // Asia
      "MY","SG","TH","BN","HK",
      // Middle East
      "AE","QA","IR","LB",
      // Americas (common leisure corridors)
      "BR","AR","CL",
      // Africa
      "TN",
    ],
    visaOnArrival: ["ID","EG","JO","MV","TL","NP","LA","KH","RW","UG","TZ","KE","MG"],
    eVisa: ["IN","SA","OM","PK","BD","LK","MM","ET","KE","UG","TZ","AU","VN"],
  },
  JP: { visaFree: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","AU","NZ","SG","CL","AR","BR","MX","KR","AE","QA","SA","BH","KW"], visaOnArrival: [], eVisa: [] },
  AU: { visaFree: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","SG","CL","AR","BR","MX","IL","AE","QA","SA","BH","KW"], visaOnArrival: [], eVisa: ["IN","ET","MM","TZ","KE"] },
  IN: { visaFree: ["NP","BT","MU","SC","SR","ID","MY","TH","SG","HK","JP","KR"], visaOnArrival: ["LA","MV","KH","EG","ET","MM","RW","UG","TZ","KE","JO","MD"], eVisa: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","BR","MX","AR","CL","SG","AE","SA","QA","BH","KW","TR","JP","KR"] },
  SA: { visaFree: ["AE","BH","KW","QA","OM"], visaOnArrival: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","AU","NZ","JP","KR","SG","MY","BR","MX","AR","CL","CN","TR"], eVisa: ["IN"] },
  BR: { visaFree: ["AR","CL","UY","PY","BO","PE","CO","VE","EC","GY","SR","GF","PA","CR","NI","HN","GT","SV","BZ","DO","CU","HT","JM","TT","BB","AG","DM","GD","KN","LC","VC","BS","MX","CA","US","GB","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","JP","KR","AU","NZ","SG","IL"], visaOnArrival: [], eVisa: [] },
  EG: { visaFree: ["BH","KW","OM","QA","SA","AE","LY","JO","TN","MA","DZ","IQ"], visaOnArrival: ["US","GB","CA","DE","FR","IT","ES","AU","NZ","JP","KR"], eVisa: ["IN","TR","BR","RU","CN","PH","MY","TH","ID"] },
  ZA: { visaFree: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","SG","BR","AR","CL","IL"], visaOnArrival: [], eVisa: [] },
};

// All ISO-3166 countries with flag emojis
export const ALL_PASSPORTS: PassportCountry[] = [
  { code: "AD", name: "Andorra", emoji: "🇦🇩", region: "Europe", visaFreeTo: ["FR","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "AE", name: "United Arab Emirates", emoji: "🇦🇪", region: "Asia", ...getVisaData("AE") },
  { code: "AF", name: "Afghanistan", emoji: "🇦🇫", region: "Asia", visaFreeTo: [], visaOnArrival: ["TR"], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","NL","BE","AT","CH"] },
  { code: "AG", name: "Antigua & Barbuda", emoji: "🇦🇬", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "AL", name: "Albania", emoji: "🇦🇱", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","TR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "AM", name: "Armenia", emoji: "🇦🇲", region: "Asia", visaFreeTo: ["RU","GE","BY","KZ","KG","TJ","UZ","MD"], visaOnArrival: ["US","DE","FR","IT","ES","NL","BE","AT","CH"], eVisa: ["IN","TR"], visaRequired: [] },
  { code: "AO", name: "Angola", emoji: "🇦🇴", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: ["US","GB","DE","FR","IT","ES"], visaRequired: [] },
  { code: "AR", name: "Argentina", emoji: "🇦🇷", region: "Americas", ...getVisaData("AR") },
  { code: "AT", name: "Austria", emoji: "🇦🇹", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "AU", name: "Australia", emoji: "🇦🇺", region: "Oceania", ...getVisaData("AU") },
  { code: "AZ", name: "Azerbaijan", emoji: "🇦🇿", region: "Asia", visaFreeTo: ["TR","RU","GE","KZ","KG","TJ","UZ","BY","MD"], visaOnArrival: ["US","GB","DE","FR","IT","ES"], eVisa: ["IN"], visaRequired: [] },
  { code: "BA", name: "Bosnia & Herzegovina", emoji: "🇧🇦", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR","HR","RS","ME","AL","MK","XK"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BB", name: "Barbados", emoji: "🇧🇧", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BD", name: "Bangladesh", emoji: "🇧🇩", region: "Asia", visaFreeTo: [], visaOnArrival: ["IN"], eVisa: ["US","GB","DE","FR","IT","ES","TR"], visaRequired: [] },
  { code: "BE", name: "Belgium", emoji: "🇧🇪", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BF", name: "Burkina Faso", emoji: "🇧🇫", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "BG", name: "Bulgaria", emoji: "🇧🇬", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BH", name: "Bahrain", emoji: "🇧🇭", region: "Asia", visaFreeTo: ["AE","KW","QA","OM","SA"], visaOnArrival: ["US","GB","DE","FR","IT","ES","TR"], eVisa: ["IN"], visaRequired: [] },
  { code: "BI", name: "Burundi", emoji: "🇧🇮", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "BJ", name: "Benin", emoji: "🇧🇯", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "BN", name: "Brunei", emoji: "🇧🇳", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","JP","KR","SG","AU","NZ"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BO", name: "Bolivia", emoji: "🇧🇴", region: "Americas", visaFreeTo: ["AR","CL","UY","PY","PE","CO","BR","EC"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR"], eVisa: [], visaRequired: [] },
  { code: "BR", name: "Brazil", emoji: "🇧🇷", region: "Americas", ...getVisaData("BR") },
  { code: "BS", name: "Bahamas", emoji: "🇧🇸", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BT", name: "Bhutan", emoji: "🇧🇹", region: "Asia", visaFreeTo: ["IN"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR"] },
  { code: "BW", name: "Botswana", emoji: "🇧🇼", region: "Africa", visaFreeTo: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","ZA"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "BY", name: "Belarus", emoji: "🇧🇾", region: "Europe", visaFreeTo: ["RU","TR","AM","AZ","GE","KZ","KG","TJ","UZ","MD","CU","VE"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","PL","LT","LV","EE"] },
  { code: "BZ", name: "Belize", emoji: "🇧🇿", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "CA", name: "Canada", emoji: "🇨🇦", region: "Americas", ...getVisaData("CA") },
  { code: "CD", name: "DR Congo", emoji: "🇨🇩", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "CF", name: "Central African Republic", emoji: "🇨🇫", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "CG", name: "Congo", emoji: "🇨🇬", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "CH", name: "Switzerland", emoji: "🇨🇭", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "CI", name: "Côte d'Ivoire", emoji: "🇨🇮", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "CL", name: "Chile", emoji: "🇨🇱", region: "Americas", ...getVisaData("CL") },
  { code: "CM", name: "Cameroon", emoji: "🇨🇲", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "CN", name: "China", emoji: "🇨🇳", region: "Asia", visaFreeTo: ["SG","MY","TH","JP","KR","RU","BY","KZ","KG","TJ","UZ","MN","RS","BA","ME","AL","MK","AE","QA","BH","MU","SC","BR","AR","CL","EC","PA","PE","CO","UY","PY","BO","SR","GF"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","TR","IN","SA","IL"] },
  { code: "CO", name: "Colombia", emoji: "🇨🇴", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","BR","MX","AR","CL","PE","EC","VE","PA"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "CR", name: "Costa Rica", emoji: "🇨🇷", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","BR","MX","AR","CL"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "CU", name: "Cuba", emoji: "🇨🇺", region: "Americas", visaFreeTo: ["RU","BY","AR","BR","MX","TR","VE","CN"], visaOnArrival: ["CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","GB","AU","NZ","JP","KR"], eVisa: [], visaRequired: ["US"] },
  { code: "CV", name: "Cape Verde", emoji: "🇨🇻", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR","IT","ES","PT","NL","BE"], eVisa: [], visaRequired: [] },
  { code: "CY", name: "Cyprus", emoji: "🇨🇾", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "CZ", name: "Czech Republic", emoji: "🇨🇿", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "DE", name: "Germany", emoji: "🇩🇪", region: "Europe", ...getVisaData("DE") },
  { code: "DJ", name: "Djibouti", emoji: "🇩🇯", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "DK", name: "Denmark", emoji: "🇩🇰", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "DM", name: "Dominica", emoji: "🇩🇲", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "DO", name: "Dominican Republic", emoji: "🇩🇴", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","BR","MX","AR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "DZ", name: "Algeria", emoji: "🇩🇿", region: "Africa", visaFreeTo: ["LY","TN","MA","MR","ML","NE","TD","NG","SN","GN","CI","BF","BJ","TG","RW"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","TR"] },
  { code: "EC", name: "Ecuador", emoji: "🇪🇨", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","BR","MX","AR","CL","CO","PE","VE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "EE", name: "Estonia", emoji: "🇪🇪", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "EG", name: "Egypt", emoji: "🇪🇬", region: "Africa", ...getVisaData("EG") },
  { code: "ER", name: "Eritrea", emoji: "🇪🇷", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "ES", name: "Spain", emoji: "🇪🇸", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "ET", name: "Ethiopia", emoji: "🇪🇹", region: "Africa", visaFreeTo: ["DJ","SO"], visaOnArrival: ["US","GB","DE","FR","IT","ES","IN","TR","JP","KR","AU","NZ"], eVisa: [], visaRequired: [] },
  { code: "FI", name: "Finland", emoji: "🇫🇮", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "FJ", name: "Fiji", emoji: "🇫🇯", region: "Oceania", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","AU","NZ","JP","KR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "FM", name: "Micronesia", emoji: "🇫🇲", region: "Oceania", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","AU","NZ"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "FR", name: "France", emoji: "🇫🇷", region: "Europe", ...getVisaData("FR") },
  { code: "GA", name: "Gabon", emoji: "🇬🇦", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "GB", name: "United Kingdom", emoji: "🇬🇧", region: "Europe", ...getVisaData("GB") },
  { code: "GD", name: "Grenada", emoji: "🇬🇩", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "GE", name: "Georgia", emoji: "🇬🇪", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","TR","IL","AE","SA","RU","BY","AM","AZ","KZ","KG","TJ","UZ","MD","CN"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "GH", name: "Ghana", emoji: "🇬🇭", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "GM", name: "Gambia", emoji: "🇬🇲", region: "Africa", visaFreeTo: ["GB"], visaOnArrival: [], eVisa: [], visaRequired: ["US","DE","FR","IT","ES"] },
  { code: "GN", name: "Guinea", emoji: "🇬🇳", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "GQ", name: "Equatorial Guinea", emoji: "🇬🇶", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "GR", name: "Greece", emoji: "🇬🇷", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "GT", name: "Guatemala", emoji: "🇬🇹", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","AU","NZ","JP","KR","BR","MX","AR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "GW", name: "Guinea-Bissau", emoji: "🇬🇼", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "GY", name: "Guyana", emoji: "🇬🇾", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "HN", name: "Honduras", emoji: "🇭🇳", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","BR","MX"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "HR", name: "Croatia", emoji: "🇭🇷", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","TR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "HT", name: "Haiti", emoji: "🇭🇹", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "HU", name: "Hungary", emoji: "🇭🇺", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "ID", name: "Indonesia", emoji: "🇮🇩", region: "Asia", visaFreeTo: ["SG","MY","TH","PH","VN","BN","KH","LA","MM"], visaOnArrival: ["US","GB","DE","FR","IT","ES","NL","BE","AT","CH","AU","NZ","JP","KR","IN","TR","SA","AE"], eVisa: [], visaRequired: [] },
  { code: "IE", name: "Ireland", emoji: "🇮🇪", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "IL", name: "Israel", emoji: "🇮🇱", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","SG","BR","MX","AR","CL","TR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "IN", name: "India", emoji: "🇮🇳", region: "Asia", ...getVisaData("IN") },
  { code: "IQ", name: "Iraq", emoji: "🇮🇶", region: "Asia", visaFreeTo: ["AE","QA","BH","KW","SA","OM","TR"], visaOnArrival: [], eVisa: ["US","GB","DE","FR","IT","ES"], visaRequired: [] },
  { code: "IR", name: "Iran", emoji: "🇮🇷", region: "Asia", visaFreeTo: ["TR","AM","AZ","GE","BY","SY"], visaOnArrival: ["CN","RU","MY","ID","TH","SG","VE","BO","NI","SR"], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","CA","AU","NZ"] },
  { code: "IS", name: "Iceland", emoji: "🇮🇸", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "IT", name: "Italy", emoji: "🇮🇹", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "JM", name: "Jamaica", emoji: "🇯🇲", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "JO", name: "Jordan", emoji: "🇯🇴", region: "Asia", visaFreeTo: ["AE","BH","KW","OM","SA","QA"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","TR","CN","IN"], eVisa: [], visaRequired: [] },
  { code: "JP", name: "Japan", emoji: "🇯🇵", region: "Asia", ...getVisaData("JP") },
  { code: "KE", name: "Kenya", emoji: "🇰🇪", region: "Africa", visaFreeTo: ["RW","UG","TZ","BW","NA","ZA","SS"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","IN","TR","CN","JP","KR"], eVisa: [], visaRequired: [] },
  { code: "KG", name: "Kyrgyzstan", emoji: "🇰🇬", region: "Asia", visaFreeTo: ["RU","KZ","TJ","UZ","BY","MD","AM","AZ","GE","MN","TR"], visaOnArrival: ["US","DE","FR","GB","JP","KR"], eVisa: [], visaRequired: [] },
  { code: "KH", name: "Cambodia", emoji: "🇰🇭", region: "Asia", visaFreeTo: ["TH","VN","LA","SG","MY","ID","PH"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN","CN"], eVisa: [], visaRequired: [] },
  { code: "KI", name: "Kiribati", emoji: "🇰🇮", region: "Oceania", visaFreeTo: ["US","GB","AU","NZ"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "KM", name: "Comoros", emoji: "🇰🇲", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "KN", name: "St. Kitts & Nevis", emoji: "🇰🇳", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "KP", name: "North Korea", emoji: "🇰🇵", region: "Asia", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "KR", name: "South Korea", emoji: "🇰🇷", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","SG","BR","MX","AR","CL","TR","AE"], visaOnArrival: [], eVisa: ["IN","CN"], visaRequired: [] },
  { code: "KW", name: "Kuwait", emoji: "🇰🇼", region: "Asia", visaFreeTo: ["AE","BH","OM","QA","SA"], visaOnArrival: ["US","GB","DE","FR","IT","ES","TR"], eVisa: [], visaRequired: [] },
  { code: "KZ", name: "Kazakhstan", emoji: "🇰🇿", region: "Asia", visaFreeTo: ["RU","BY","AM","AZ","GE","KG","TJ","UZ","MD","TR","MN","KR"], visaOnArrival: ["US","DE","FR","GB","JP","CN","IN","AE"], eVisa: [], visaRequired: [] },
  { code: "LA", name: "Laos", emoji: "🇱🇦", region: "Asia", visaFreeTo: ["TH","VN","KH","MM"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN","CN","TH"], eVisa: [], visaRequired: [] },
  { code: "LB", name: "Lebanon", emoji: "🇱🇧", region: "Asia", visaFreeTo: ["AE","BH","KW","OM","QA","SA","JO","SY"], visaOnArrival: ["US","GB","DE","FR","IT","ES","TR"], eVisa: [], visaRequired: [] },
  { code: "LC", name: "St. Lucia", emoji: "🇱🇨", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "LI", name: "Liechtenstein", emoji: "🇱🇮", region: "Europe", visaFreeTo: ["CH","DE","AT"], visaOnArrival: ["US","GB","CA","FR","IT","ES"], eVisa: [], visaRequired: [] },
  { code: "LK", name: "Sri Lanka", emoji: "🇱🇰", region: "Asia", visaFreeTo: ["SG","MY","ID"], visaOnArrival: ["IN"], eVisa: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","CN","TR"], visaRequired: [] },
  { code: "LR", name: "Liberia", emoji: "🇱🇷", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "LS", name: "Lesotho", emoji: "🇱🇸", region: "Africa", visaFreeTo: ["ZA","BW","NA","SZ"], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "LT", name: "Lithuania", emoji: "🇱🇹", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "LU", name: "Luxembourg", emoji: "🇱🇺", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "LV", name: "Latvia", emoji: "🇱🇻", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "LY", name: "Libya", emoji: "🇱🇾", region: "Africa", visaFreeTo: ["TN","DZ","EG","TD","NE"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","TR"] },
  { code: "MA", name: "Morocco", emoji: "🇲🇦", region: "Africa", visaFreeTo: ["US","GB","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","TR","AE","SA","BH","QA","OM","KW","TN","DZ","LY"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MC", name: "Monaco", emoji: "🇲🇨", region: "Europe", visaFreeTo: ["FR"], visaOnArrival: ["US","GB","DE","IT","ES"], eVisa: [], visaRequired: [] },
  { code: "MD", name: "Moldova", emoji: "🇲🇩", region: "Europe", visaFreeTo: ["RO","UA","TR","BY","AM","GE","KZ","KG","TJ","UZ","MK","RS","BA","ME","AL","XK"], visaOnArrival: ["US","DE","FR","IT","ES","GB"], eVisa: [], visaRequired: [] },
  { code: "ME", name: "Montenegro", emoji: "🇲🇪", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR","RS","BA","AL","MK","XK"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MG", name: "Madagascar", emoji: "🇲🇬", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP"], eVisa: [], visaRequired: [] },
  { code: "MH", name: "Marshall Islands", emoji: "🇲🇭", region: "Oceania", visaFreeTo: ["US"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MK", name: "North Macedonia", emoji: "🇲🇰", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR","RS","BA","ME","AL","XK"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "ML", name: "Mali", emoji: "🇲🇱", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "MM", name: "Myanmar", emoji: "🇲🇲", region: "Asia", visaFreeTo: ["TH","SG"], visaOnArrival: [], eVisa: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","CN","IN","TR"], visaRequired: [] },
  { code: "MN", name: "Mongolia", emoji: "🇲🇳", region: "Asia", visaFreeTo: ["RU","KZ","KG","TJ","UZ","BY","KR","JP","SG"], visaOnArrival: ["US","DE","FR","GB","AU","NZ","CA","IT","ES"], eVisa: [], visaRequired: [] },
  { code: "MR", name: "Mauritania", emoji: "🇲🇷", region: "Africa", visaFreeTo: ["ML","SN","GM","GN","BF"], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "MT", name: "Malta", emoji: "🇲🇹", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MU", name: "Mauritius", emoji: "🇲🇺", region: "Africa", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","IN","ZA"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MV", name: "Maldives", emoji: "🇲🇻", region: "Asia", visaFreeTo: [], visaOnArrival: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","IN","CN","TR"], eVisa: [], visaRequired: [] },
  { code: "MW", name: "Malawi", emoji: "🇲🇼", region: "Africa", visaFreeTo: ["ZA","BW","NA","TZ","MZ"], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "MX", name: "Mexico", emoji: "🇲🇽", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","BR","AR","CL","CO","PE","EC","UY","PY","BO"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MY", name: "Malaysia", emoji: "🇲🇾", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","SG","IN","TH","ID","PH","VN","BN","CN","TR","AE","SA","BH","QA","OM","KW"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "MZ", name: "Mozambique", emoji: "🇲🇿", region: "Africa", visaFreeTo: ["ZA","BW","NA","SZ","MW","TZ"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","BR"], eVisa: [], visaRequired: [] },
  { code: "NA", name: "Namibia", emoji: "🇳🇦", region: "Africa", visaFreeTo: ["ZA","BW","SZ","LS","AO","ZM","ZW"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR"], eVisa: [], visaRequired: [] },
  { code: "NE", name: "Niger", emoji: "🇳🇪", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "NG", name: "Nigeria", emoji: "🇳🇬", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","TR"] },
  { code: "NI", name: "Nicaragua", emoji: "🇳🇮", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","BR","MX"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "NL", name: "Netherlands", emoji: "🇳🇱", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "NO", name: "Norway", emoji: "🇳🇴", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "NP", name: "Nepal", emoji: "🇳🇵", region: "Asia", visaFreeTo: ["IN","CN"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","TH","SG"], eVisa: [], visaRequired: [] },
  { code: "NR", name: "Nauru", emoji: "🇳🇷", region: "Oceania", visaFreeTo: ["AU","NZ"], visaOnArrival: ["US","GB"], eVisa: [], visaRequired: [] },
  { code: "NZ", name: "New Zealand", emoji: "🇳🇿", region: "Oceania", ...getVisaData("NZ") },
  { code: "OM", name: "Oman", emoji: "🇴🇲", region: "Asia", visaFreeTo: ["AE","BH","KW","QA","SA"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","TR","IN","CN"], eVisa: [], visaRequired: [] },
  { code: "PA", name: "Panama", emoji: "🇵🇦", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","BR","MX","AR","CL","CO","PE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "PE", name: "Peru", emoji: "🇵🇪", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","BR","MX","AR","CL","CO"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "PG", name: "Papua New Guinea", emoji: "🇵🇬", region: "Oceania", visaFreeTo: ["AU","NZ"], visaOnArrival: ["US","GB","DE","FR","JP"], eVisa: [], visaRequired: [] },
  { code: "PH", name: "Philippines", emoji: "🇵🇭", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","SG","TH","ID","MY","VN"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "PK", name: "Pakistan", emoji: "🇵🇰", region: "Asia", visaFreeTo: ["TR","AE","BH","KW","OM","SA","QA"], visaOnArrival: ["CN"], eVisa: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN"], visaRequired: [] },
  { code: "PL", name: "Poland", emoji: "🇵🇱", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "PT", name: "Portugal", emoji: "🇵🇹", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "QA", name: "Qatar", emoji: "🇶🇦", region: "Asia", visaFreeTo: ["AE","BH","KW","OM","SA"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","TR","IN","CN"], eVisa: [], visaRequired: [] },
  { code: "RO", name: "Romania", emoji: "🇷🇴", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "RS", name: "Serbia", emoji: "🇷🇸", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR","BA","ME","AL","MK","XK","RO","BG","HR","HU","CZ","SK","PL","RU","BY","UA","CN","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "RU", name: "Russia", emoji: "🇷🇺", region: "Europe", visaFreeTo: ["TR","AR","BR","CL","CO","EC","PE","UY","VE","IL","AE","SA","BH","QA","OM","KW","MY","TH","SG","HK","MN","KZ","KG","TJ","UZ","BY","AM","AZ","GE","RS","BA","ME","AL","MK","MD","CN"], visaOnArrival: [], eVisa: ["IN"], visaRequired: ["US","GB","DE","FR","IT","ES","CA","AU","NZ","JP","KR"] },
  { code: "RW", name: "Rwanda", emoji: "🇷🇼", region: "Africa", visaFreeTo: ["UG","KE","TZ","BW","SS"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN","CN"], eVisa: [], visaRequired: [] },
  { code: "SA", name: "Saudi Arabia", emoji: "🇸🇦", region: "Asia", visaFreeTo: ["AE","BH","KW","OM","QA"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","TR","CN","MY","SG","BN"], eVisa: ["IN"], visaRequired: [] },
  { code: "SB", name: "Solomon Islands", emoji: "🇸🇧", region: "Oceania", visaFreeTo: ["AU","NZ"], visaOnArrival: ["US","GB"], eVisa: [], visaRequired: [] },
  { code: "SC", name: "Seychelles", emoji: "🇸🇨", region: "Africa", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","IN","ZA"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "SD", name: "Sudan", emoji: "🇸🇩", region: "Africa", visaFreeTo: ["EG","TD","LY","ET"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "SE", name: "Sweden", emoji: "🇸🇪", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "SG", name: "Singapore", emoji: "🇸🇬", region: "Asia", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","AU","NZ","JP","KR","BR","MX","AR","CL","TH","MY","ID","PH","VN","BN","CN","IN","AE","SA","BH","QA","OM","KW","TR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "SI", name: "Slovenia", emoji: "🇸🇮", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SK","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "SK", name: "Slovakia", emoji: "🇸🇰", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","IS","LU","MT","CY","GR","PL","CZ","HU","RO","BG","SI","EE","LV","LT","HR","BA","ME","AL","RS","MK","XK","MD","UA","JP","KR","AU","NZ","SG","BR","MX","AR","CL","IL","TR","AE"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "SL", name: "Sierra Leone", emoji: "🇸🇱", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "SM", name: "San Marino", emoji: "🇸🇲", region: "Europe", visaFreeTo: ["IT"], visaOnArrival: ["US","GB","DE","FR","ES"], eVisa: [], visaRequired: [] },
  { code: "SN", name: "Senegal", emoji: "🇸🇳", region: "Africa", visaFreeTo: ["GN","GM","ML","MR","BF","BJ","TG","NE","CI"], visaOnArrival: ["US","GB","DE","FR","IT","ES","CA"], eVisa: [], visaRequired: [] },
  { code: "SO", name: "Somalia", emoji: "🇸🇴", region: "Africa", visaFreeTo: ["DJ"], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "SS", name: "South Sudan", emoji: "🇸🇸", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "SV", name: "El Salvador", emoji: "🇸🇻", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AU","NZ","JP","KR","BR","MX"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "SY", name: "Syria", emoji: "🇸🇾", region: "Asia", visaFreeTo: ["IR","LB","MA"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","TR"] },
  { code: "SZ", name: "Eswatini", emoji: "🇸🇿", region: "Africa", visaFreeTo: ["ZA","BW","NA","LS","MZ","MW"], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "TD", name: "Chad", emoji: "🇹🇩", region: "Africa", visaFreeTo: [], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "TG", name: "Togo", emoji: "🇹🇬", region: "Africa", visaFreeTo: [], visaOnArrival: ["US","GB","DE","FR"], eVisa: [], visaRequired: [] },
  { code: "TH", name: "Thailand", emoji: "🇹🇭", region: "Asia", visaFreeTo: ["SG","MY","ID","PH","VN","KH","LA","MM","BN","HK"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN","CN","TR"], eVisa: [], visaRequired: [] },
  { code: "TJ", name: "Tajikistan", emoji: "🇹🇯", region: "Asia", visaFreeTo: ["RU","KZ","KG","UZ","BY","AM","AZ","GE"], visaOnArrival: ["US","DE","FR","GB","JP","KR","CN","IN"], eVisa: [], visaRequired: [] },
  { code: "TL", name: "Timor-Leste", emoji: "🇹🇱", region: "Asia", visaFreeTo: ["ID"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","CN","IN","TH","SG","MY"], eVisa: [], visaRequired: [] },
  { code: "TM", name: "Turkmenistan", emoji: "🇹🇲", region: "Asia", visaFreeTo: ["UZ","KG","TJ","KZ","RU","BY","AM","AZ","GE"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES","TR"] },
  { code: "TN", name: "Tunisia", emoji: "🇹🇳", region: "Africa", visaFreeTo: ["LY","DZ","MA","EG","FR","DE","IT","ES","GB","US","CA","AU","NZ","JP","KR","TR","AE","SA","QA","BH","OM","KW"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "TO", name: "Tonga", emoji: "🇹🇴", region: "Oceania", visaFreeTo: ["US","GB","AU","NZ"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "TR", name: "Turkey", emoji: "🇹🇷", region: "Europe", ...getVisaData("TR") },
  { code: "TT", name: "Trinidad & Tobago", emoji: "🇹🇹", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "TV", name: "Tuvalu", emoji: "🇹🇻", region: "Oceania", visaFreeTo: ["AU","NZ"], visaOnArrival: ["US","GB"], eVisa: [], visaRequired: [] },
  { code: "TZ", name: "Tanzania", emoji: "🇹🇿", region: "Africa", visaFreeTo: ["KE","RW","UG","BW","MZ","ZA","SS"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN","CN","TR"], eVisa: [], visaRequired: [] },
  { code: "UA", name: "Ukraine", emoji: "🇺🇦", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR","IL","AE","SA","BH","QA","OM","KW","RS","BA","ME","AL","MK","XK","MD","BY","GE","AM","AZ"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "UG", name: "Uganda", emoji: "🇺🇬", region: "Africa", visaFreeTo: ["KE","RW","TZ","SS"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","JP","KR","IN","CN"], eVisa: [], visaRequired: [] },
  { code: "US", name: "United States", emoji: "🇺🇸", region: "Americas", ...getVisaData("US") },
  { code: "UY", name: "Uruguay", emoji: "🇺🇾", region: "Americas", visaFreeTo: ["AR","BR","CL","PY","BO","PE","CO","VE","EC","PA","MX","US","GB","DE","FR","IT","ES","AU","NZ","JP","KR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "UZ", name: "Uzbekistan", emoji: "🇺🇿", region: "Asia", visaFreeTo: ["RU","KZ","KG","TJ","BY","MD","AM","AZ","GE","MN","KR","JP","SG","MY","TH","ID","TR","AE"], visaOnArrival: ["US","DE","FR","GB","AU","NZ","CN","IN"], eVisa: [], visaRequired: [] },
  { code: "VA", name: "Vatican City", emoji: "🇻🇦", region: "Europe", visaFreeTo: ["IT"], visaOnArrival: ["US","GB","DE","FR","ES"], eVisa: [], visaRequired: [] },
  { code: "VC", name: "St. Vincent & Grenadines", emoji: "🇻🇨", region: "Americas", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "VE", name: "Venezuela", emoji: "🇻🇪", region: "Americas", visaFreeTo: ["CO","PE","BR","AR","CL","EC","BO","PY","UY","GY"], visaOnArrival: ["TR","CN"], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "VN", name: "Vietnam", emoji: "🇻🇳", region: "Asia", visaFreeTo: ["TH","SG","MY","ID","PH","KH","LA","MM","BN","KR","JP"], visaOnArrival: ["US","GB","DE","FR","IT","ES","AU","NZ","IN","CN","TR"], eVisa: [], visaRequired: [] },
  { code: "VU", name: "Vanuatu", emoji: "🇻🇺", region: "Oceania", visaFreeTo: ["AU","NZ","US","GB","DE","FR"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "WS", name: "Samoa", emoji: "🇼🇸", region: "Oceania", visaFreeTo: ["AU","NZ","US","GB"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "XK", name: "Kosovo", emoji: "🇽🇰", region: "Europe", visaFreeTo: ["US","GB","CA","DE","FR","IT","ES","NL","BE","AT","CH","PT","SE","NO","DK","FI","IE","TR","AL","MK","ME","RS","BA"], visaOnArrival: [], eVisa: [], visaRequired: [] },
  { code: "YE", name: "Yemen", emoji: "🇾🇪", region: "Asia", visaFreeTo: ["AE","BH","KW","OM","SA","QA"], visaOnArrival: [], eVisa: [], visaRequired: ["US","GB","DE","FR","IT","ES"] },
  { code: "ZA", name: "South Africa", emoji: "🇿🇦", region: "Africa", ...getVisaData("ZA") },
  { code: "ZM", name: "Zambia", emoji: "🇿🇲", region: "Africa", visaFreeTo: ["ZA","BW","NA","TZ","MW","ZW","MZ","KE"], visaOnArrival: ["US","GB","DE","FR","AU","NZ","JP","KR","CN","IN"], eVisa: [], visaRequired: [] },
  { code: "ZW", name: "Zimbabwe", emoji: "🇿🇼", region: "Africa", visaFreeTo: ["ZA","BW","NA","ZM","MZ"], visaOnArrival: ["US","GB","DE","FR","AU","NZ","JP","KR","CN","IN"], eVisa: [], visaRequired: [] },
].sort((a, b) => a.name.localeCompare(b.name));

// ---------- Helper Functions ----------

function getVisaData(code: string) {
  const data = VISA_DATA[code];
  return {
    visaFreeTo: data?.visaFree || [],
    visaOnArrival: data?.visaOnArrival || [],
    eVisa: data?.eVisa || [],
    visaRequired: [],
  };
}

export function getVisaStatus(
  passportCode: string,
  destinationCode: string
): "visa-free" | "visa-on-arrival" | "e-visa" | "visa-required" {
  const passport = ALL_PASSPORTS.find((p) => p.code === passportCode);
  if (!passport) return "visa-required";

  if (passport.visaFreeTo.includes(destinationCode)) return "visa-free";
  if (passport.visaOnArrival.includes(destinationCode)) return "visa-on-arrival";
  if (passport.eVisa.includes(destinationCode)) return "e-visa";
  return "visa-required";
}

export function searchPassports(query: string): PassportCountry[] {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ALL_PASSPORTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
  );
}
