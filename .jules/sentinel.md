# Sentinel Security Journal

This journal tracks security learnings and practical mitigations for Portfolio OS.

## Baseline response security headers

All application routes receive:
- `X-Frame-Options: DENY` to prevent framing.
- `X-Content-Type-Options: nosniff` to prevent MIME sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin` to reduce cross-origin referrer disclosure.
- `Permissions-Policy` disabling camera, microphone and geolocation, which this portfolio does not require.
- `Strict-Transport-Security: max-age=31536000` to enforce HTTPS for the current host.

HSTS deliberately does not include `includeSubDomains` or `preload` until every subdomain on the parent domain has been audited for HTTPS compatibility.

## 2026-11-03 - Double-escaped RegExp literals in Bearer token authorization
**Vulnerability:** Double-escaped whitespace in regular expression literals (`/^Bearer\\s+/i`) inside route authorization checks matches literal backslash-s (`Bearer\s+...`) rather than actual whitespace (`\s+`), causing legitimate API authorization requests to fail and potentially exposing auth parsing edge cases.
**Learning:** In JavaScript/TypeScript RegExp literals, backslashes should not be double-escaped unless explicitly targeting a literal backslash. Using `replace()` with an incorrect pattern left the raw prefix intact in the extracted token, causing token comparison failures.
**Prevention:** Use explicit matching with single-escaped character classes (`/^Bearer\s+(.+)$/i.exec(authHeader)`) and verify auth parsing with targeted unit checks.
