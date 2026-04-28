import { createSelector, createSlice } from "@reduxjs/toolkit";

/**
 * currencySlice — stores the active currency for the current user session.
 *
 * Populated by CurrencyProvider when the user selects a country.
 * Falls back to the app's default USD settings from the settings API.
 *
 * State shape:
 *   code      – ISO-4217 code  (e.g. "GHS")
 *   symbol    – Unicode symbol (e.g. "₵")
 *   locale    – BCP-47 tag     (e.g. "en-GH")
 *   rate      – units of this currency per 1 USD (1 for USD itself)
 *   position  – "left" | "right" (from settings)
 */
const initialState = {
  code: "USD",
  symbol: "$",
  locale: "en-US",
  rate: 1,
  position: "left",
};

export const currencySlice = createSlice({
  name: "Currency",
  initialState,
  reducers: {
    /**
     * Update active currency.
     * @param {object} action.payload  - Partial or full state shape above.
     */
    setCurrency: (state, action) => {
      const { code, symbol, locale, rate, position } = action.payload;
      if (code !== undefined) state.code = code;
      if (symbol !== undefined) state.symbol = symbol;
      if (locale !== undefined) state.locale = locale;
      if (rate !== undefined) state.rate = rate;
      if (position !== undefined) state.position = position;
    },
    /** Reset to USD defaults. */
    resetCurrency: () => initialState,
  },
});

export default currencySlice.reducer;
export const { setCurrency, resetCurrency } = currencySlice.actions;

// ─── Selectors ──────────────────────────────────────────────────────────────

export const getCurrencyState = (state) => state.Currency;

export const getActiveCurrencySymbol = createSelector(
  (state) => state.Currency,
  (currency) => currency.symbol
);

export const getActiveCurrencyCode = createSelector(
  (state) => state.Currency,
  (currency) => currency.code
);

export const getActiveCurrencyRate = createSelector(
  (state) => state.Currency,
  (currency) => currency.rate
);

export const getActiveCurrencyLocale = createSelector(
  (state) => state.Currency,
  (currency) => currency.locale
);

export const getActiveCurrencyPosition = createSelector(
  (state) => state.Currency,
  (currency) => currency.position
);
