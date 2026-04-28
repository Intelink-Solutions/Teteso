import { logoutSuccess } from "@/redux/reducer/authSlice";
import { setIsUnauthorized } from "@/redux/reducer/globalStateSlice";
import { store } from "@/redux/store";
import axios from "axios";

const normalizeAbsoluteUrlPath = (value) => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    const normalizedPath = url.pathname.replace(/\/{2,}/g, "/");

    if (normalizedPath !== url.pathname) {
      url.pathname = normalizedPath;
      return url.toString();
    }

    return value;
  } catch {
    return value;
  }
};

const normalizeUrlsInPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeUrlsInPayload);
  }

  if (payload && typeof payload === "object") {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        normalizeUrlsInPayload(value),
      ])
    );
  }

  return normalizeAbsoluteUrlPath(payload);
};

const Api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}`,
});

let isUnauthorizedToastShown = false;

Api.interceptors.request.use(function (config) {
  let token = undefined;
  let langCode = undefined;

  if (typeof window !== "undefined") {
    const state = store.getState();
    token = state?.UserSignup?.data?.token;
    langCode = state?.CurrentLanguage?.language?.code;
  }

  if (token) config.headers.authorization = `Bearer ${token}`;
  if (langCode) config.headers["Content-Language"] = langCode;

  return config;
});

// Add a response interceptor
Api.interceptors.response.use(
  function (response) {
    if (response?.data) {
      response.data = normalizeUrlsInPayload(response.data);
    }
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      // Call the logout function if the status code is 401
      logoutSuccess();
      if (!isUnauthorizedToastShown) {
        store.dispatch(setIsUnauthorized(true));
        isUnauthorizedToastShown = true;
        // Reset the flag after a certain period
        setTimeout(() => {
          isUnauthorizedToastShown = false;
        }, 3000); // 3 seconds delay before allowing another toast
      }
    }
    return Promise.reject(error);
  }
);

export default Api;
