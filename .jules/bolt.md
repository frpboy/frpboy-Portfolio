# Bolt's Journal - Critical Performance Learnings

## 2025-05-14 - Precomputed Search Indices for Static Registries in Client Components
**Learning:** In Next.js client-side interactive search/filter components (like `Dashboard.tsx`), re-allocating haystack arrays, string concatenations (`.join(" ").toLowerCase()`), and performing `indexOf()` scans on every search keystroke causes avoidable GC pressure and layout thread contention, even when the underlying data is a static registry array.
**Action:** When filtering static collections on user input, precalculate lowercased search strings and priority rank maps outside the component render function into `Map` lookups to keep keystroke filtering strictly O(N) with zero allocations.
