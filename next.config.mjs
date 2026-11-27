import { cspHeader } from "./lib/security/csp.mjs"

// CSP: false = Report-Only (tylko raporty w /api/csp-report), true = wymuszanie. Decyzja Dayli 26.11: najpierw raporty.
const CSP_ENFORCE = false

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Font do PDF poradnika czytany z dysku w funkcji serwerowej
  outputFileTracingIncludes: { "/api/mf/poradnik-pdf": ["./lib/mf/fonts/**"] },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
    ],
  },
  // Przekierowania (/proba, stare /pl/*, usunięte podstrony): proxy.ts + lib/routes.ts, 301 z zachowaniem query.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          cspHeader({ enforce: CSP_ENFORCE }),
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig