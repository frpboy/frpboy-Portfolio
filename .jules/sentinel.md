# Sentinel Security Journal

This journal tracks security learnings and practical mitigations for Portfolio OS.

## Baseline response security headers

All application routes receive:
- `Content-Security-Policy`: restricts resource loading to trusted origins (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`), mitigating XSS, code injection, and data exfiltration.
- `X-Frame-Options: DENY` to prevent framing.
- `X-Content-Type-Options: nosniff` to prevent MIME sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin` to reduce cross-origin referrer disclosure.
- `Permissions-Policy` disabling camera, microphone and geolocation, which this portfolio does not require.
- `Strict-Transport-Security: max-age=31536000` to enforce HTTPS for the current host.

HSTS deliberately does not include `includeSubDomains` or `preload` until every subdomain on the parent domain has been audited for HTTPS compatibility.

## 2026-11-03 - Bearer Token Regex Escaping in Route Handlers
**Vulnerability:** Double-escaped regex literal `/^Bearer\\s+/i` failed to match standard whitespace in `Authorization: Bearer <token>`, preventing proper token extraction and breaking `timingSafeEqual` authentication.
**Learning:** In TypeScript/JavaScript regular expression literals (unlike strings passed to `new RegExp`), backslashes should not be double-escaped (`\s` matches whitespace, while `\\s` matches a literal `\s` sequence).
**Prevention:** Always use single escape sequences in RegExp literals and write targeted unit tests validating token stripping with standard Authorization headers.
