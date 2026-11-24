---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-23T19:54:16Z
  againstInput: https://tide.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://tide.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-23T19:54:16Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry, deferred — no design delta applied; pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## E2 decision — internal targets outside the planned page set (2026-11-24)

The page scope of this run is fixed by the site plan (100 selected of 464 discovered). Internal links whose targets are not delivered pages are SCOPE EXTENSION, not capture gaps: 336 distinct targets (product detail pages under /en-us/shop/type/*/…, PLP filter paths, how-to / stain articles not in the plan, /en-us/top-collections/tide-free-and-gentle/press-release) are repointed to the same path on https://tide.com. Links to source redirects point at their destinations. Header search submits to https://tide.com/en-us/search (dynamics row 2). Full list: stardust/.work/rollout/repointed.tsv (regenerable with the E2 probe).
