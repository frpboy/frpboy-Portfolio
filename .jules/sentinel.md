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

## 2026-11-03 - Double-escaped regex in Authorization Bearer parser
**Vulnerability:** Knowledge ingestion endpoint failed authentication for valid `Bearer <token>` headers due to double-escaped whitespace matching (`/^Bearer\\s+/i`).
**Learning:** In RegExp literals (`/.../`), backslashes should not be escaped like string literals (`"\\s"`), otherwise the engine matches literal characters (`\s`) rather than whitespace.
**Prevention:** Use standard `\s` in RegExp literals and verify authorization parsing with real HTTP header format fixtures.
