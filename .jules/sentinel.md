# Sentinel Security Journal

This journal tracks critical security learnings, vulnerability patterns, and architectural security insights discovered in this codebase.

## 2025-05-18 - Missing Baseline HTTP Security Headers
**Vulnerability:** The Next.js application was serving responses without essential HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security`), leaving users susceptible to clickjacking, MIME confusion, and excessive referrer leakage.
**Learning:** Default Next.js configurations do not automatically attach comprehensive security headers out-of-the-box unless explicitly declared in `headers()` inside `next.config.ts`.
**Prevention:** Always define centralized response security headers in `next.config.ts` covering all routes (`/:path*`), ensuring defense-in-depth across every static and dynamic route.
