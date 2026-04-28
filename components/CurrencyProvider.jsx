"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCityData } from "@/redux/reducer/locationSlice";
import { getActiveCurrencyCode, setCurrency } from "@/redux/reducer/currencySlice";
import { getCurrencySymbol, getCurrencyPosition } from "@/redux/reducer/settingSlice";
import { getCurrencyForCountry } from "@/utils/countryToCurrency";
import { fetchExchangeRates } from "@/utils/exchangeRate";

/**
 * CurrencyProvider
 *
 * Sits inside the Redux <Providers> wrapper and watches the user's selected
 * country.  Whenever the country changes it:
 *   1. Maps country → ISO currency info
 *   2. Fetches live USD exchange rates (cached 1 h)
 *   3. Dispatches setCurrency so formatPriceAbbreviated picks up the new
 *      symbol, locale, and rate automatically everywhere in the app.
 *
 * If the user hasn't selected a country yet, defaults to the app's settings
 * API values (currency_symbol + currency_symbol_position).
 */
export default function CurrencyProvider({ children }) {
  const dispatch = useDispatch();
  const cityData = useSelector(getCityData);
  const currencyCode = useSelector(getActiveCurrencyCode);
  const defaultSymbol = useSelector(getCurrencySymbol);
  const defaultPosition = useSelector(getCurrencyPosition);

  // Track previous country to avoid redundant fetches
  const prevCountryRef = useRef(null);

  useEffect(() => {
    const country = cityData?.country;

    // No country selected yet — ensure defaults from settings are applied
    if (!country) {
      if (currencyCode !== "USD") {
        dispatch(
          setCurrency({
            code: "USD",
            symbol: defaultSymbol || "$",
            locale: "en-US",
            rate: 1,
            position: defaultPosition || "left",
          })
        );
        prevCountryRef.current = null;
      }
      return;
    }

    // Skip if same country as before
    if (country === prevCountryRef.current) return;
    prevCountryRef.current = country;

    const currencyInfo = getCurrencyForCountry(country);

    if (!currencyInfo) {
      // Unknown country — fall back to USD with app defaults
      dispatch(
        setCurrency({
          code: "USD",
          symbol: defaultSymbol || "$",
          locale: "en-US",
          rate: 1,
          position: defaultPosition || "left",
        })
      );
      return;
    }

    // Fetch exchange rates and dispatch currency update
    fetchExchangeRates().then((rates) => {
      const rate = rates?.[currencyInfo.code] ?? 1;
      dispatch(
        setCurrency({
          code: currencyInfo.code,
          symbol: currencyInfo.symbol,
          locale: currencyInfo.locale,
          rate,
          // Keep the symbol position from settings
          position: defaultPosition || "left",
        })
      );
    });
  }, [cityData?.country, defaultSymbol, defaultPosition, dispatch]);

  return children;
}
