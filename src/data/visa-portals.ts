/**
 * Official government visa / entry-authorization portals by destination
 * country (ISO 3166-1 alpha-2). Used for the "Apply on Official Portal"
 * CTA in the Visa panel — always a real government endpoint, never a
 * generic aggregator, when a known official portal exists.
 */

export const VISA_PORTALS: Record<string, string> = {
  // Türkiye — e-Visa (required by Item 7)
  TR: "https://www.evisa.gov.tr",
  // Americas
  US: "https://esta.cbp.dhs.gov/",
  CA: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
  MX: "https://www.gob.mx/sre",
  BR: "https://www.gov.br/mre/pt-br/assuntos/visas",
  AR: "https://www.cancilleria.gob.ar/",
  CL: "https://chile.travel/en/good-to-know/entry-and-visa-requirements/",
  CO: "https://www.cancilleria.gov.co/",
  PE: "https://www.gob.pe/migraciones",
  // Europe
  GB: "https://www.gov.uk/check-uk-visa",
  IE: "https://www.irishimmigration.ie/coming-to-visit-ireland/",
  UA: "https://visa.mfa.gov.ua/",
  GE: "https://www.evisa.gov.ge/GeoVisa/",
  AM: "https://www.mfa.am/en/",
  AZ: "https://www.evisa.gov.az/",
  RS: "https://www.mfa.gov.rs/",
  ME: "https://www.gov.me/en/article/visa-information",
  // Phase 3 expansion — every other European destination country. All URLs
  // load-verified by scripts/verify-visa-portals.ts (0 dead).
  AD: "https://www.govern.ad/",
  AT: "https://www.bmaa.gv.at/",
  BE: "https://diplomatie.belgium.be/",
  BG: "https://www.mfa.bg/",
  BY: "https://mfa.gov.by/",
  CH: "https://www.eda.admin.ch/",
  CY: "https://www.gov.cy/mfa/",
  CZ: "https://www.mzv.cz/",
  DE: "https://www.auswaertiges-amt.de/",
  DK: "https://www.nyidanmark.dk/",
  EE: "https://www.vm.ee/",
  ES: "https://www.exteriores.gob.es/",
  FI: "https://migri.fi/", // bot-walls plain fetch (Cloudflare), loads in a browser
  FR: "https://france-visas.gouv.fr/", // bot-walls plain fetch, loads in a browser
  GR: "https://www.mfa.gr/",
  HR: "https://mvep.gov.hr/",
  HU: "https://kormany.hu/",
  IS: "https://www.utn.is/",
  IT: "https://vistoperitalia.esteri.it/",
  LI: "https://www.llv.li/", // bot-walls plain fetch, loads in a browser
  LT: "https://www.mfa.lt/", // bot-walls plain fetch, loads in a browser
  LU: "https://guichet.public.lu/",
  LV: "https://www.mfa.gov.lv/",
  MC: "https://www.gouv.mc/",
  MD: "https://www.mfa.gov.md/",
  MK: "https://www.mfa.gov.mk/",
  MT: "https://mfa.gov.mt/", // bot-walls plain fetch (Cloudflare), loads in a browser
  NL: "https://www.netherlandsworldwide.nl/",
  NO: "https://www.udi.no/", // bot-walls plain fetch (Azure WAF), loads in a browser
  PL: "https://www.gov.pl/",
  PT: "https://vistos.mne.gov.pt/",
  RO: "https://www.mae.ro/en/", // serves a browser-verification challenge to plain fetch
  RU: "https://evisa.kdmid.ru/",
  SE: "https://www.migrationsverket.se/",
  SI: "https://www.gov.si/",
  SK: "https://www.mzv.sk/", // bot-walls plain fetch (Cloudflare), loads in a browser
  SM: "https://www.esteri.sm/",
  VA: "https://www.vaticanstate.va/",
  XK: "https://www.mfa-ks.net/",
  // Middle East & Africa
  AE: "https://u.ae/en/information-and-services/visa-and-emirates-id",
  SA: "https://visa.visitsaudi.com/",
  QA: "https://mofa.gov.qa/en/consular-services/visas/visas",
  EG: "https://www.visa2egypt.gov.eg/",
  KE: "https://www.ecitizen.go.ke/",
  MA: "https://www.acces-maroc.ma/",
  TZ: "https://www.immigration.go.tz/",
  ZA: "https://www.dha.gov.za/",
  // Asia & Oceania
  IN: "https://indianvisaonline.gov.in/evisa/tvoa.html",
  JP: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
  KR: "https://www.visa.go.kr/",
  CN: "https://www.nia.gov.cn/",
  TW: "https://www.boca.gov.tw/",
  TH: "https://www.thaievisa.go.th/",
  ID: "https://evisa.imigrasi.go.id/",
  MY: "https://www.windowmalaysia.my/",
  PH: "https://evisa.gov.ph/",
  VN: "https://evisa.xuatnhapcanh.gov.vn/",
  SG: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
  AU: "https://immi.homeaffairs.gov.au/visas/getting-a-visa",
  NZ: "https://www.immigration.govt.nz/new-zealand-visas",
};

/** Generic fallback (aggregator) when no official portal is known. */
export const GENERIC_VISA_GUIDE_URL = "https://visaguide.world/";

/** Entry-information fallback used when no visa is needed (EU Commission, canonical URL). */
export const ENTRY_INFO_URL =
  "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en";

/**
 * Resolve the best "official portal" link for a destination.
 * Priority: known government portal → generic guide (visa statuses that
 * need action) → entry-information page (visa-free).
 */
export function getVisaPortalUrl(
  destCc: string,
  status: "visa-free" | "visa-on-arrival" | "e-visa" | "visa-required" | "unknown"
): string {
  const official = VISA_PORTALS[destCc.toUpperCase()];
  if (official) return official;
  if (status === "visa-free") return ENTRY_INFO_URL;
  if (status === "unknown") return GENERIC_VISA_GUIDE_URL;
  return GENERIC_VISA_GUIDE_URL;
}
