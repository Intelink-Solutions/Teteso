import currencyByCountryCode from "./currencyByCountryCode.json";
import countryNameToCode from "./countryNameToCode.json";

export { currencyByCountryCode, countryNameToCode };

/**
 * Resolve country name or ISO code -> currency info.
 * Returns null if not found.
 */
export const getCurrencyForCountry = (countryNameOrCode) => {
  if (!countryNameOrCode) return null;

  const upper = countryNameOrCode.trim().toUpperCase();

  // Direct ISO-2 lookup (e.g. "NG", "US")
  if (currencyByCountryCode[upper]) {
    return { countryCode: upper, ...currencyByCountryCode[upper] };
  }

  // Name lookup (case-insensitive)
  const lower = countryNameOrCode.trim().toLowerCase();
  const code = countryNameToCode[lower];
  if (code && currencyByCountryCode[code]) {
    return { countryCode: code, ...currencyByCountryCode[code] };
  }

  return null;
};