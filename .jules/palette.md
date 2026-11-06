# Palette UX Journal

## 2025-05-18 - Accessible Skip Link for Sticky OS Navigation
**Learning:** In applications utilizing a fixed top status bar (like Portfolio OS's `SystemStatusBar` fixed at `top: 0`, `z-50`), keyboard users tabbing into the interface are trapped traversing all status/navigation links before accessing page content. Adding a visually hidden yet focus-visible bypass anchor (`href="#main-content"`) directly at the top of `<body>` with high z-index (`z-[100]`) and pairing it with a programmatically focusable `<main id="main-content" tabIndex={-1} className="outline-none">` ensures smooth bypass of repetitive navigation without interfering with mouse clicks or visual styling.
**Action:** When working on layouts with fixed headers/toolbars, always verify that a keyboard bypass link exists at the very beginning of the document order, styling `focus:not-sr-only` with high contrast and explicit focus rings matching the design system (`system-green`).
