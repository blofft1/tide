# Learnings — tide.com replica run

### Folder-index rows probed with a trailing slash the delivery 404s
- failure class: path-safety
- evidence: rollout verify (E, 2026-11-24) reported HTTP 404 for the 8 archetype rows (`/en-us`, `/en-us/shop/type/liquid`, …): `publicUrl()` serves a row whose migrated file is `x/index.html` as `/x/`, while deploy delivered the document at `/x`; tide.com 301s `/x/` → `/x`, the new origin 404'd it. Fixed with 94 `<path>/` → `<path>` redirect rows.
- proposed change: `skills/rollout/SKILL.md` § Phase D — D-site checklist: when the source 301s trailing-slash paths, seed `<path>/` rows into the redirects sheet for every delivered page; `skills/rollout/scripts/lib.mjs` `publicUrl()` — prefer the coverage row's delivered path over the folder-index guess.
- status: pending

### Out-of-plan internal links fail verify until E2 runs
- failure class: capture-gap
- evidence: verify flipped 45 pages to `failed` on "broken internal links" — 336 root-relative targets outside the fixed 100-page plan (product detail pages, stain articles, PLP filter paths); E2 (after E) is where they get repointed, so E cannot pass first.
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row E2 — run the scope-extension repoint (root-relative targets not in coverage → source origin) before Phase E verify, or as part of migrate's sibling render.
- status: pending

### Source JSON-LD dropped at delivery
- failure class: silent-render (content preservation)
- evidence: optimize (F) 37 P2 `jsonld` on articles/FAQ pages whose capture carries `<script type="application/ld+json">`; the delivered heads had none. Carried verbatim as a `JSON-LD` metadata row (the pipeline renders the script tag), with `<`, `>`, `&` as JSON `\u` escapes — HTML entities are emitted literally inside the script.
- proposed change: `skills/migrate/reference/content-preservation.md` — metadata section: JSON-LD is preserved as a `JSON-LD` metadata row, JSON-escaped; `skills/deploy` metadata step emits it.
- status: pending

### Autoplay-on-view carousel missed by the motion observation
- failure class: dynamic-gap
- evidence: tide.com /en-us/our-commitment/tide-evo and /superbowlLX start clip 1 when the video carousel scrolls into view; motion-observe at the archetype stage did not scroll it into view, so the block shipped paused. Found by the E render check (≥ ¼ visible video playing).
- proposed change: `skills/replica/reference/recreation-procedure.md` § Interaction parity — motion-observe scrolls each media block to the viewport centre and records play state.
- status: pending

### Code fixes after publish lag at one CDN edge
- failure class: api-dependency
- evidence: after pushing header.js (12:15Z), curl received the new file while the headless browser's edge kept the 01:01Z copy (age > 2000 s, `max-age=7200`); admin `code` and `cache` POSTs (200) did not refresh that edge. dynamics-check replays against that edge failed on two header fixes.
- proposed change: `skills/dynamics/SKILL.md` § Phase 5 — when a replay follows a code push, verify on the preview origin first and re-run the live replay after the edge TTL; record the pending refresh in parity.json.
- status: pending
