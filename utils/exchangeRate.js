/**
 * Fetch and cache USD exchange rates.
 *
 * Uses the free open.er-api.com endpoint (no API key needed).
 * Results are cached in localStorage for CACHE_TTL_MS to avoid
 * hammering the rate service on every page load.
 *
 * Returned object:  { [ISO4217_CODE]: rate_vs_1_USD }
 *   e.g. { USD: 1, EUR: 0.92, GHS: 14.12, NGN: 1610.5, … }
 */

const CACHE_KEY = "eclassify_exchange_rates";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const RATE_API_URL = "https://open.er-api.com/v6/latest/USD";
const FALLBACK_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

/**
 * Read cached rates from localStorage.
 * Returns null if cache is absent or expired.
 */
const readCache = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, rates } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) return rates;
  } catch {
    // corrupted cache — ignore
  }
  return null;
};

/**
 * Persist rates to localStorage with the current timestamp.
 */
const writeCache = (rates) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), rates })
    );
  } catch {
    // quota exceeded or private mode — ignore
  }
};

let _inFlightPromise = null;

/**
 * Fetch live USD exchange rates.
 * Returns a plain object mapping currency codes to rates per 1 USD.
 * Falls back to { USD: 1 } if both endpoints fail.
 *
 * @returns {Promise<Record<string, number>>}
 */
export const fetchExchangeRates = async () => {
  // 1. Try cache first
  const cached = readCache();
  if (cached) return cached;

  // 2. Deduplicate simultaneous calls
  if (_inFlightPromise) return _inFlightPromise;

  _inFlightPromise = (async () => {
    let rates = null;

    // 3. Primary API
    try {
      const res = await fetch(RATE_API_URL);
      if (res.ok) {
        const json = await res.json();
        if (json?.rates) rates = json.rates;
      }
    } catch {
      // network error — try fallback
    }

    // 4. Fallback API
    if (!rates) {
      try {
        const res = await fetch(FALLBACK_API_URL);
        if (res.ok) {
          const json = await res.json();
          if (json?.rates) rates = json.rates;
        }
      } catch {
        // both failed
      }
    }

    if (rates) {
      writeCache(rates);
      return rates;
    }

    // 5. Ultimate fallback — return USD only so the app doesn't crash
    return { USD: 1 };
  })();

  try {
    return await _inFlightPromise;
  } finally {
    _inFlightPromise = null;
  }
};

/**
 * Convert an amount from USD to the target currency.
 *
 * @param {number|string} amountInUSD
 * @param {string} targetCurrencyCode  e.g. "GHS"
 * @param {Record<string, number>} rates  result of fetchExchangeRates()
 * @returns {number}
 */
export const convertFromUSD = (amountInUSD, targetCurrencyCode, rates) => {
  const rate = rates?.[targetCurrencyCode] ?? 1;
  return Number(amountInUSD) * rate;
};
