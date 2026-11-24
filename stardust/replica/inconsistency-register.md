# Inconsistency register — tide.com replica

Everything not listed here is frozen; any design delta found by the gate is a
defect, not an improvement. No `applied` entries — pure replica.

## R-01 — Proprietary "Tide" typeface self-hosted as captured

- **Evidence:** DESIGN.json `extensions.fonts[0..3]` — family `Tide` 300/400/700/800, captured from https://tide.com/fonts/tide_type_*.woff2 (stardust/current/assets/fonts/tide_type_*-webfont.woff2); rendered on every captured page.
- **Finding:** the brand face is a proprietary P&G typeface; the replica self-hosts the captured files unchanged, which needs the owner's confirmation that the web-font licence covers the new origin.
- **Minimal change:** none in this run — the files are served as captured; deploy raises its licensing alert. Should the licence not extend, the owner supplies a licensed build of the same face (no substitute).
- **Status:** deferred
- **Where:** all page types (all text set in `Tide`)

## R-02 — Pages without a top-level heading get a visually hidden one

- **Evidence:** the captured `/en-us/rewards` (headings: two `h2`) and `/en-us/contact-us` (main client-rendered by the P&G care hub, no headings) render no `<h1>`; rollout verify requires exactly one per page.
- **Finding:** a page without an `h1` has no document heading for assistive technology and search.
- **Minimal change:** one first section styled `visually-hidden` holding an `h1` with the page's captured title, verbatim. Nothing visible changes; the pixel gate is unaffected.
- **Status:** applied
- **Where:** `/en-us/rewards`, `/en-us/contact-us`
