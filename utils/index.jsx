"use client";
import { toast } from "sonner";
import { store } from "../redux/store";
import enTranslation from "./locale/en.json";
import countryLocaleMap from "./locale/countryLocaleMap.json";

export const t = (label) => {
  if (typeof store.getState !== "function") {
    return enTranslation[label] || label;
  }

  const langData =
    store.getState().CurrentLanguage?.language?.file_name &&
    store.getState().CurrentLanguage?.language?.file_name[label];
  if (langData) {
    return langData;
  } else {
    return enTranslation[label] || label;
  }
};

export const placeholderImage = (e) => {
  let settings = store.getState()?.Settings?.data?.data;
  const placeholderLogo = settings?.placeholder_image;
  const fallback = "/assets/Transperant_Placeholder.png";

  // If the current src is already the fallback, do nothing to avoid infinite loop
  if (e.target.src.includes(fallback)) return;

  if (placeholderLogo && !e.target.src.includes(placeholderLogo)) {
    e.target.src = placeholderLogo;

    // Attach a one-time error handler to set fallback if settings placeholder fails
    e.target.onerror = () => {
      e.target.src = fallback;
      // Remove the error handler to prevent infinite loop
      e.target.onerror = null;
    };
  } else {
    e.target.src = fallback;
  }
};

export const normalizeImageUrl = (value) => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    parsed.pathname = parsed.pathname.replace(/\/{2,}/g, "/");
    return parsed.toString();
  } catch {
    return value;
  }
};
// check user login
// is login user check
export const isLogin = () => {
  // Use the selector to access user data
  const userData = store.getState()?.UserSignup?.data;
  // Check if the token exists
  if (userData?.token) {
    return true;
  }

  return false;
};

export const IsLandingPageOn = () => {
  let settings = store.getState()?.Settings?.data?.data;
  return Number(settings?.show_landing_page);
};

export const getDefaultLatLong = () => {
  let settings = store.getState()?.Settings?.data?.data;
  const default_latitude = Number(settings?.default_latitude);
  const default_longitude = Number(settings?.default_longitude);

  const defaultLetLong = {
    latitude: default_latitude,
    longitude: default_longitude,
  };
  return defaultLetLong;
};

export const getPlaceApiKey = () => {
  let settings = store.getState()?.Settings?.data?.data;
  return settings?.place_api_key;
};

export const getSlug = (pathname) => {
  const segments = pathname.split("/");
  return segments[segments.length - 1];
};

export const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days === 0) {
    return t("today");
  } else if (days === 1) {
    return t("yesterday");
  } else if (days < 30) {
    return `${days} ${t("daysAgo")}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months > 1 ? t("months") : t("month")} ${t("ago")}`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} ${years > 1 ? t("years") : t("year")} ${t("ago")}`;
  }
};

// countryLocaleMap is imported from ./locale/countryLocaleMap.json above
// (moved to JSON to avoid V8 zone allocation OOM during compilation)

export { countryLocaleMap };



// Function to format prices with the user's active currency and exchange rate.
// Falls back to the settings API currency when the currency slice is at default.
export const formatPriceAbbreviated = (price) => {
  if (
    price === null ||
    price === undefined ||
    (typeof price === "string" && price.trim() === "")
  ) {
    return "";
  }

  if (Number(price) === 0) {
    return t("Free");
  }

  const settingsData = store.getState()?.Settings?.data?.data;
  const currencyState = store.getState()?.Currency;

  // Use currency slice values if the user has selected a country
  // (rate !== 1 means a non-USD currency is active), otherwise fall back to
  // the raw settings API values so the default experience is unchanged.
  const hasActiveCurrency =
    currencyState?.code && currencyState.code !== "USD";

  const currencySymbol = hasActiveCurrency
    ? currencyState.symbol
    : (settingsData?.currency_symbol ?? "$");

  const currencyPosition = hasActiveCurrency
    ? currencyState.position
    : (settingsData?.currency_symbol_position ?? "left");

  const locale = hasActiveCurrency
    ? (currencyState.locale ?? "en-US")
    : (() => {
        const countryCode =
          process.env.NEXT_PUBLIC_DEFAULT_COUNTRY?.toUpperCase() || "US";
        return countryLocaleMap[countryCode] || "en-US";
      })();

  // Convert the price from USD to the active currency
  const rate = hasActiveCurrency ? (currencyState.rate ?? 1) : 1;
  const convertedPrice = Number(price) * rate;

  const formattedNumber = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(convertedPrice);

  return currencyPosition === "right"
    ? `${formattedNumber} ${currencySymbol}`
    : `${currencySymbol} ${formattedNumber}`;
};

export const formatSalaryRange = (minSalary, maxSalary) => {
  const hasMin =
    minSalary !== undefined && minSalary !== null && minSalary !== "";
  const hasMax =
    maxSalary !== undefined && maxSalary !== null && maxSalary !== "";

  if (hasMin && hasMax) {
    return `${formatPriceAbbreviated(minSalary)} – ${formatPriceAbbreviated(
      maxSalary
    )}`;
  }

  if (hasMin) {
    return `${t("from")} ${formatPriceAbbreviated(minSalary)}`;
  }

  if (hasMax) {
    return `${t("upTo")} ${formatPriceAbbreviated(maxSalary)}`;
  }

  return "";
};

// utils/stickyNote.js
export const createStickyNote = () => {
  const stickyNote = document.createElement("div");
  stickyNote.style.position = "fixed";
  stickyNote.style.bottom = "0";
  stickyNote.style.width = "100%";
  stickyNote.style.backgroundColor = "#ffffff";
  stickyNote.style.color = "#000000";
  stickyNote.style.padding = "10px";
  stickyNote.style.textAlign = "center";
  stickyNote.style.fontSize = "14px";
  stickyNote.style.zIndex = "99999";

  const closeButton = document.createElement("span");
  closeButton.style.cursor = "pointer";
  closeButton.style.float = "right";
  closeButton.innerHTML = "&times;";
  closeButton.fontSize = "20px";

  closeButton.onclick = function () {
    document.body.removeChild(stickyNote);
  };

  const playStoreLink = store.getState()?.Settings?.data?.data?.play_store_link;
  const appStoreLink = store.getState()?.Settings?.data?.data?.app_store_link;

  const message = document.createElement("span");
  message.innerText = t("chatAndNotificationNotSupported");

  const linkContainer = document.createElement("div"); // Changed to 'div' for better spacing
  linkContainer.style.display = "inline-block"; // Keeps links inline while allowing space

  const linkStyle = "text-decoration: underline !important; color: #3498db";

  if (playStoreLink) {
    const playStoreAnchor = document.createElement("a");
    playStoreAnchor.style.cssText = linkStyle;
    playStoreAnchor.innerText = t("playStore");
    playStoreAnchor.href = playStoreLink;
    playStoreAnchor.target = "_blank";
    linkContainer.appendChild(playStoreAnchor);
  }

  if (appStoreLink) {
    const appStoreAnchor = document.createElement("a");
    appStoreAnchor.style.cssText = linkStyle;
    appStoreAnchor.style.marginLeft = "5px"; // Space before this link
    appStoreAnchor.innerText = t("appStore");
    appStoreAnchor.href = appStoreLink;
    appStoreAnchor.target = "_blank";
    linkContainer.appendChild(appStoreAnchor);
  }

  stickyNote.appendChild(closeButton);
  stickyNote.appendChild(message);
  stickyNote.appendChild(linkContainer);

  document.body.appendChild(stickyNote);
};

// Translation keys for Firebase auth errors — t() is called at access time, not at parse time
const ERROR_CODE_KEYS = {
  "auth/user-not-found": "userNotFound",
  "auth/wrong-password": "invalidPassword",
  "auth/email-already-in-use": "emailInUse",
  "auth/invalid-email": "invalidEmail",
  "auth/user-disabled": "userAccountDisabled",
  "auth/too-many-requests": "tooManyRequests",
  "auth/operation-not-allowed": "operationNotAllowed",
  "auth/internal-error": "internalError",
  "auth/invalid-login-credentials": "incorrectDetails",
  "auth/invalid-credential": "incorrectDetails",
  "auth/admin-restricted-operation": "adminOnlyOperation",
  "auth/already-initialized": "alreadyInitialized",
  "auth/app-not-authorized": "appNotAuthorized",
  "auth/app-not-installed": "appNotInstalled",
  "auth/argument-error": "argumentError",
  "auth/captcha-check-failed": "captchaCheckFailed",
  "auth/code-expired": "codeExpired",
  "auth/cordova-not-ready": "cordovaNotReady",
  "auth/cors-unsupported": "corsUnsupported",
  "auth/credential-already-in-use": "credentialAlreadyInUse",
  "auth/custom-token-mismatch": "customTokenMismatch",
  "auth/requires-recent-login": "requiresRecentLogin",
  "auth/dependent-sdk-initialized-before-auth": "dependentSdkInitializedBeforeAuth",
  "auth/dynamic-link-not-activated": "dynamicLinkNotActivated",
  "auth/email-change-needs-verification": "emailChangeNeedsVerification",
  "auth/emulator-config-failed": "emulatorConfigFailed",
  "auth/expired-action-code": "expiredActionCode",
  "auth/cancelled-popup-request": "cancelledPopupRequest",
  "auth/invalid-api-key": "invalidApiKey",
  "auth/invalid-app-credential": "invalidAppCredential",
  "auth/invalid-app-id": "invalidAppId",
  "auth/invalid-user-token": "invalidUserToken",
  "auth/invalid-auth-event": "invalidAuthEvent",
  "auth/invalid-cert-hash": "invalidCertHash",
  "auth/invalid-verification-code": "invalidVerificationCode",
  "auth/invalid-continue-uri": "invalidContinueUri",
  "auth/invalid-cordova-configuration": "invalidCordovaConfiguration",
  "auth/invalid-custom-token": "invalidCustomToken",
  "auth/invalid-dynamic-link-domain": "invalidDynamicLinkDomain",
  "auth/invalid-emulator-scheme": "invalidEmulatorScheme",
  "auth/invalid-message-payload": "invalidMessagePayload",
  "auth/invalid-multi-factor-session": "invalidMultiFactorSession",
  "auth/invalid-oauth-client-id": "invalidOauthClientId",
  "auth/invalid-oauth-provider": "invalidOauthProvider",
  "auth/invalid-action-code": "invalidActionCode",
  "auth/unauthorized-domain": "unauthorizedDomain",
  "auth/invalid-persistence-type": "invalidPersistenceType",
  "auth/invalid-phone-number": "invalidPhoneNumber",
  "auth/invalid-provider-id": "invalidProviderId",
  "auth/invalid-recaptcha-action": "invalidRecaptchaAction",
  "auth/invalid-recaptcha-token": "invalidRecaptchaToken",
  "auth/invalid-recaptcha-version": "invalidRecaptchaVersion",
  "auth/invalid-recipient-email": "invalidRecipientEmail",
  "auth/invalid-req-type": "invalidReqType",
  "auth/invalid-sender": "invalidSender",
  "auth/invalid-verification-id": "invalidVerificationId",
  "auth/invalid-tenant-id": "invalidTenantId",
  "auth/multi-factor-info-not-found": "multiFactorInfoNotFound",
  "auth/multi-factor-auth-required": "multiFactorAuthRequired",
  "auth/missing-android-pkg-name": "missingAndroidPkgName",
  "auth/missing-app-credential": "missingAppCredential",
  "auth/auth-domain-config-required": "authDomainConfigRequired",
  "auth/missing-client-type": "missingClientType",
  "auth/missing-verification-code": "missingVerificationCode",
  "auth/missing-continue-uri": "missingContinueUri",
  "auth/missing-iframe-start": "missingIframeStart",
  "auth/missing-ios-bundle-id": "missingIosBundleId",
  "auth/missing-multi-factor-info": "missingMultiFactorInfo",
  "auth/missing-multi-factor-session": "missingMultiFactorSession",
  "auth/missing-or-invalid-nonce": "missingOrInvalidNonce",
  "auth/missing-phone-number": "missingPhoneNumber",
  "auth/missing-recaptcha-token": "missingRecaptchaToken",
  "auth/missing-recaptcha-version": "missingRecaptchaVersion",
  "auth/missing-verification-id": "missingVerificationId",
  "auth/app-deleted": "appDeleted",
  "auth/account-exists-with-different-credential": "accountExistsWithDifferentCredential",
  "auth/network-request-failed": "networkRequestFailed",
  "auth/no-auth-event": "noAuthEvent",
  "auth/no-such-provider": "noSuchProvider",
  "auth/null-user": "nullUser",
  "auth/operation-not-supported-in-this-environment": "operationNotSupportedInThisEnvironment",
  "auth/popup-blocked": "popupBlocked",
  "auth/popup-closed-by-user": "popupClosedByUser",
  "auth/provider-already-linked": "providerAlreadyLinked",
  "auth/quota-exceeded": "quotaExceeded",
  "auth/recaptcha-not-enabled": "recaptchaNotEnabled",
  "auth/redirect-cancelled-by-user": "redirectCancelledByUser",
  "auth/redirect-operation-pending": "redirectOperationPending",
  "auth/rejected-credential": "rejectedCredential",
  "auth/second-factor-already-in-use": "secondFactorAlreadyInUse",
  "auth/maximum-second-factor-count-exceeded": "maximumSecondFactorCountExceeded",
  "auth/tenant-id-mismatch": "tenantIdMismatch",
  "auth/timeout": "timeout",
  "auth/user-token-expired": "userTokenExpired",
  "auth/unauthorized-continue-uri": "unauthorizedContinueUri",
  "auth/unsupported-first-factor": "unsupportedFirstFactor",
  "auth/unsupported-persistence-type": "unsupportedPersistenceType",
  "auth/unsupported-tenant-operation": "unsupportedTenantOperation",
  "auth/unverified-email": "unverifiedEmail",
  "auth/user-cancelled": "userCancelled",
  "auth/user-mismatch": "userMismatch",
  "auth/user-signed-out": "userSignedOut",
  "auth/weak-password": "weakPassword",
  "auth/web-storage-unsupported": "webStorageUnsupported",
  "auth/missing-email": "addEmail",
};

export const handleFirebaseAuthError = (errorCode) => {
  const key = ERROR_CODE_KEYS[errorCode];
  if (key) {
    toast.error(t(key));
  } else {
    toast.error(`${t("errorOccurred")}:${errorCode}`);
  }
};

export const truncate = (text, maxLength) => {
  // Check if text is undefined or null
  if (!text) {
    return ""; // or handle the case as per your requirement
  }

  const stringText = String(text);

  // If the text length is less than or equal to maxLength, return the original text
  if (stringText.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return stringText?.slice(0, maxLength) + "...";
  }
};



export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.Settings;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key;
  if (StripeKey) {
    ``;
    return StripeKey;
  }
  return false;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all characters that are not lowercase letters, digits, spaces, or hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

// Create a temporary element to measure the width of category names

export const measureCategoryWidth = (categoryName) => {
  const tempElement = document.createElement("span");
  tempElement.style.display = "inline-block";
  tempElement.style.visibility = "hidden";
  tempElement.style.position = "absolute";
  tempElement.innerText = categoryName;
  document.body.appendChild(tempElement);
  const width = tempElement.offsetWidth + 15; //icon width(12) + gap(3) between category and icon
  document.body.removeChild(tempElement);
  return width;
};

export const calculateRatingPercentages = (ratings) => {
  // Initialize counters for each star rating
  const ratingCount = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  // Count the number of each star rating
  ratings?.forEach((rating) => {
    const roundedRating = Math.round(rating?.ratings); // Round down to the nearest whole number
    if (roundedRating >= 1 && roundedRating <= 5) {
      ratingCount[roundedRating] += 1;
    }
  });

  // Get the total number of ratings
  const totalRatings = ratings.length;

  // Calculate the percentage for each rating
  const ratingPercentages = {
    5: (ratingCount[5] / totalRatings) * 100,
    4: (ratingCount[4] / totalRatings) * 100,
    3: (ratingCount[3] / totalRatings) * 100,
    2: (ratingCount[2] / totalRatings) * 100,
    1: (ratingCount[1] / totalRatings) * 100,
  };

  return { ratingCount, ratingPercentages };
};

export const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");



export const extractYear = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear();
};

export const isValidURL = (url) => {
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return pattern.test(url);
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return t("now");
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays === 1) {
    return t("yesterday");
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mo`;
  } else {
    return `${diffInYears}y`;
  }
};

export const formatChatMessageTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateMonthYear = (dateString) => {
  if (!dateString) return "";

  const langCode = store
    .getState()
    ?.CurrentLanguage?.language?.code?.toUpperCase();
  const locale = countryLocaleMap?.[langCode] || "en-US";
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatMessageDate = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return t("today");
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return t("yesterday");
  } else {
    return formatDateMonthYear(dateString);
  }
};

export const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  if (match) {
    return match && match[2].length === 11 ? match[2] : null;
  } else {
    return false;
  }
};

export const validateExtraDetails = ({
  languages,
  defaultLangId,
  extraDetails,
  customFields,
  filePreviews,
}) => {
  for (const lang of languages) {
    const current = extraDetails?.[lang.id] || {};
    const previews = filePreviews?.[lang.id] || {};
    const isDefaultLang = lang.id === defaultLangId;
    const langLabel = isDefaultLang ? "" : `${lang.name}: `;

    for (const field of customFields) {
      const { id, name, type, required, is_required, min_length } = field;

      const requiredValue = required ?? is_required ?? 0;

      // Skip non-textbox fields in non-default languages
      if (!isDefaultLang && type !== "textbox") continue;

      const value = current[id];

      const isValueEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      const isRequired = isDefaultLang && requiredValue === 1;
      const shouldValidate = isRequired || (!isValueEmpty && !isDefaultLang);

      if (!shouldValidate) continue;

      const showError = (msg) => {
        toast.error(`${langLabel}${msg}`);
      };

      // === Required Validation
      const isMissing =
        (["textbox", "number", "radio", "dropdown"].includes(type) &&
          isValueEmpty) ||
        (type === "checkbox" &&
          (!Array.isArray(value) || value.length === 0)) ||
        (type === "fileinput" && !value && !previews[id]);

      if (isRequired && isMissing) {
        const key = ["checkbox", "radio"].includes(type)
          ? t("selectAtleastOne")
          : t("fillDetails");
        showError(`${key} ${name}.`);
        return false;
      }

      // === Min Length Validation
      if (value && min_length && ["textbox", "number"].includes(type)) {
        const valStr = String(type === "textbox" ? value.trim() : value);
        if (valStr.length < min_length) {
          const lengthError =
            type === "number"
              ? `${t("mustBeAtleast")} ${min_length} ${t("digitLong")}`
              : `${t("mustBeAtleast")} ${min_length} ${t("charactersLong")}`;
          showError(`${name} ${lengthError}`);
          return false;
        }
      }
    }
  }

  return true;
};

const urlToFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export const prefillExtraDetails = ({
  data,
  languages,
  defaultLangId,
  extraFieldValue,
  setFilePreviews,
}) => {
  const tempExtraDetails = {};

  languages.forEach((lang) => {
    const isDefault = lang.id === defaultLangId;
    const perLang = {};
    data.forEach(async (field) => {
      const fieldId = field.id;

      if (!isDefault && field.type !== "textbox") return;

      const extraField = extraFieldValue.find(
        (item) => item.language_id === lang.id && item.id === fieldId
      );
      const fieldValue = extraField?.value || null;

      switch (field.type) {
        case "checkbox":
          perLang[fieldId] = fieldValue || [];
          break;

        case "radio":
          perLang[fieldId] = fieldValue ? fieldValue[0] : "";
          break;

        case "fileinput":
          if (isDefault && fieldValue?.length) {
            const fileUrl = fieldValue[0];

            // update preview immediately
            setFilePreviews?.((prev) => ({
              ...prev,
              [fieldId]: {
                url: fileUrl,
                isPdf: isPdf(fileUrl),
              },
            }));

            // convert URL → File (binary) for payload
            const file = await urlToFile(fileUrl, `prefilled-${fieldId}`);
            perLang[fieldId] = file;
          } else {
            perLang[fieldId] = "";
          }
          break;

        default:
          perLang[fieldId] = fieldValue ? fieldValue[0] : "";
      }
    });

    tempExtraDetails[lang.id] = perLang;
  });

  return tempExtraDetails;
};

export const prefillVerificationDetails = ({
  data,
  languages,
  defaultLangId,
  extraFieldValue,
  setFilePreviews,
}) => {
  const tempExtraDetails = {};

  languages.forEach((lang) => {
    const isDefault = lang.id === defaultLangId;
    const perLang = {};
    data.forEach((field) => {
      const fieldId = field.id;

      if (!isDefault && field.type !== "textbox") return;

      const extraField = extraFieldValue.find(
        (item) => item.language_id === lang.id && item.id === fieldId
      );
      const fieldValue = extraField?.value || null;
      switch (field.type) {
        case "checkbox":
          perLang[fieldId] = fieldValue || [];
          break;

        case "radio":
          perLang[fieldId] = fieldValue ? fieldValue[0] : "";
          break;

        case "fileinput":
          if (isDefault && fieldValue?.length) {
            setFilePreviews?.((prev) => ({
              ...prev,
              [fieldId]: {
                url: fieldValue[0],
                isPdf: isPdf(fieldValue[0]),
              },
            }));
          }
          perLang[fieldId] = "";
          break;

        default:
          perLang[fieldId] = fieldValue ? fieldValue[0] : "";
      }
    });

    tempExtraDetails[lang.id] = perLang;
  });

  return tempExtraDetails;
};

export const getMainDetailsTranslations = (
  listingData,
  languages,
  defaultLangId
) => {
  const translations = {};

  // Fill translations for all languages
  languages.forEach((lang) => {
    const isDefault = lang.id === defaultLangId;

    if (isDefault) {
      // Default language gets full data
      translations[lang.id] = {
        name: listingData?.name || "",
        description: listingData?.description || "",
        price: listingData?.price || "",
        contact: listingData?.contact || "",
        video_link: listingData?.video_link || "",
        slug: listingData?.slug || "",
        min_salary: listingData?.min_salary || "",
        max_salary: listingData?.max_salary || "",
      };
    } else {
      // Other languages: get translation if available
      const translated = listingData?.translations?.find(
        (tr) => tr.language_id === lang.id
      );

      translations[lang.id] = {
        name: translated?.name || "",
        description: translated?.description || "",
      };
    }
  });

  return translations;
};

export const filterNonDefaultTranslations = (translations, defaultLangId) => {
  const result = {};

  for (const langId in translations) {
    if (Number(langId) === Number(defaultLangId)) continue;

    const fields = translations[langId];
    const filteredFields = {};

    for (const key in fields) {
      const value = fields[key];
      if (
        value !== undefined &&
        value !== null &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        filteredFields[key] = value.trim();
      }
    }

    if (Object.keys(filteredFields).length > 0) {
      result[langId] = filteredFields;
    }
  }

  return JSON.stringify(result);
};

export const prepareCustomFieldTranslations = (extraDetails = {}) => {
  const result = {};

  for (const langId in extraDetails) {
    const fields = extraDetails[langId];
    const cleanedFields = {};

    for (const fieldId in fields) {
      const value = fields[fieldId];

      if (
        Array.isArray(value) &&
        value.length > 0 &&
        !(value[0] instanceof File)
      ) {
        cleanedFields[fieldId] = value;
      } else if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(value instanceof File)
      ) {
        cleanedFields[fieldId] = [String(value)];
      }
    }

    if (Object.keys(cleanedFields).length > 0) {
      result[langId] = cleanedFields;
    }
  }

  return JSON.stringify(result);
};

export const prepareCustomFieldFiles = (extraDetails, defaultLangId) => {
  const customFieldFiles = [];
  const defaultLangFields = extraDetails?.[defaultLangId] || {};

  Object.entries(defaultLangFields).forEach(([fieldId, value]) => {
    if (value instanceof File) {
      customFieldFiles.push({ key: fieldId, files: [value] });
    } else if (Array.isArray(value) && value[0] instanceof File) {
      customFieldFiles.push({ key: fieldId, files: value });
    }
  });

  return customFieldFiles;
};

export const handleKeyDown = (e, maxLength) => {
  if (maxLength === null || maxLength === undefined) {
    return;
  }
  const value = e.target.value;
  // Allow control keys (Backspace, Delete, Arrow keys, etc.)
  const controlKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
    "Tab",
  ];

  if (value.length >= maxLength && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

export const inpNum = (e) => {
  e = e || window.event;
  var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
  var charStr = String.fromCharCode(charCode);
  if (!charStr.match(/^[0-9]+$/)) {
    e.preventDefault();
  }
};

export const getFilteredCustomFields = (
  allTranslatedFields,
  currentLanguageId
) => {
  const fields = Array.isArray(allTranslatedFields) ? allTranslatedFields : [];
  const fieldMap = new Map();

  for (const field of fields) {
    const id = field.id;
    const val =
      field.type === "fileinput"
        ? field.value
        : field.translated_selected_values;

    const isEmpty =
      val === null ||
      val === "" ||
      (Array.isArray(val) &&
        (val.length === 0 ||
          (val.length === 1 && (val[0] === "" || val[0] === null))));

    if (isEmpty) continue;

    // Prefer current language or store the first available
    if (!fieldMap.has(id) || field.language_id === currentLanguageId) {
      fieldMap.set(id, field);
    }
  }

  return Array.from(fieldMap.values());
};
