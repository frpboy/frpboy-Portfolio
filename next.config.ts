import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Apply HSTS only to this host; do not opt all subdomains into HSTS
  // until every hostname on the parent domain has been audited for HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "seali.frpboy.in" },
      { protocol: "https", hostname: "scrobblix.frpboy.in" },
      { protocol: "https", hostname: "metly.frpboy.in" },
      { protocol: "https", hostname: "dailyfoodlog.frpboy.in" },
      { protocol: "https", hostname: "duedot.frpboy.in" },
      { protocol: "https", hostname: "linksemble.frpboy.in" },
      { protocol: "https", hostname: "pulseguard.frpboy.in" },
      { protocol: "https", hostname: "specly.frpboy.in" },
      { protocol: "https", hostname: "truebite.frpboy.in" },
    ],
  },
  async redirects() {
    return [
      { source: "/writing", destination: "/blog", permanent: true },
      { source: "/writing/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
