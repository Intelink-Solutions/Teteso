const normalizeImageUrl = (src) => {
  if (typeof src !== "string" || !/^https?:\/\//i.test(src)) {
    return src;
  }

  try {
    const parsed = new URL(src);
    parsed.pathname = parsed.pathname.replace(/\/{2,}/g, "/");
    return parsed.toString();
  } catch {
    return src;
  }
};

export default function nextImageLoader({ src }) {
  return normalizeImageUrl(src);
}
