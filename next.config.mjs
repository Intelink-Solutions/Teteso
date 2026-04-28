import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "antd",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-toast",
      "firebase",
    ],
  },
  images: {
    // Normalize backend image URLs globally via custom loader.
    loader: "custom",
    loaderFile: "./utils/nextImageLoader.js",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eclassify.thewrteam.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "set.teteso.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "teteso.veewiss.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "teteso.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
