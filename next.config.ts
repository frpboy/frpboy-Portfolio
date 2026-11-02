import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking by blocking iframe embedding
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information sent on navigation
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict sensitive browser features and APIs
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Enforce HTTPS communication
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Control browser DNS prefetching
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
