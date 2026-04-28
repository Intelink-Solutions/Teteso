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
    // Backend currently returns image paths with double slashes in pathname (e.g. //storage/...)
    // which can cause Vercel image optimizer to reject requests. Keep images visible by
    // bypassing optimizer until backend URL normalization is fully fixed.
    unoptimized: true,
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
