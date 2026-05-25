import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Turbopack workspace root warning
  turbopack: {
    root: __dirname,
  },
  images: {
    // ── Cloudinary delivery domain ───────────────────────────────────────────
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Allow all paths under your cloud — covers every folder/subfolder
        pathname: "/**",
      },
    ],

    // ── Format preference: AVIF first (best compression), WebP fallback ──────
    // next-cloudinary's <CldImage> applies f_auto,q_auto on the Cloudinary side
    // which already delivers AVIF/WebP; these formats apply to /api/image proxy.
    formats: ["image/avif", "image/webp"],

    // ── Cache tuning ─────────────────────────────────────────────────────────
    // 60s keeps the Next.js image cache warm without being stale.
    // To force fresh images after a Cloudinary re-upload, do a hard refresh
    // (Ctrl+Shift+R) or run: rm -rf .next/cache/images
    minimumCacheTTL: 60,

    // ── Device sizes used by Next.js srcset generation ───────────────────────
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── React Strict Mode ───────────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Compiler optimisations ──────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production builds (keep console.error/warn)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── HTTP headers — aggressive caching for Cloudinary assets ─────────────────
  async headers() {
    return [
      {
        // Cache all Cloudinary-proxied images served by Next.js
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;