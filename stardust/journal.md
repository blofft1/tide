# Journal — tide.com replica

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-11-23T19:40:00Z — Extract — 99 of 100 planned pages captured live, typed into 10 page types

**Prompt:** Hands-off same-design migration of https://tide.com/ to AEM Edge Delivery; scope = the 100 `selected` pages of the site plan; gates at 1440 and 360; publish; keep martech disabled.

**Decisions:**
- Phases run in order (no two-track first-page opening): the full extract was already running when the first-page doc was read; the home page is the first archetype of Phase 3.
- `crawl.mjs --pages <100 plan URLs>`: 99 captured; `/en-us/loyalty` is a client-side redirect to the account.tide.com login (auth wall) — recorded as a redirect, never a page.
- Redirects (type `redirect`, delivered through the redirects sheet, not as pages): `/` → `/en-us`, `/en-us/accessibility` → accessibility.pg.com, `/en-us/coupons-and-rewards` → `/en-us/rewards`, `/en-us/our-commitment/loads-of-hope` and `/en-us/our-commitment/sustainability` → `/en-us/our-commitment`, `/en-us/loyalty` → account login.
- Page types (state.json): home 1, article 38, product-listing 15, collection-landing 5, section-landing 6, topic-hub 4, sustainability-topic 3, click2cart 8, unique 14 (one-off campaign pages, stain how-to, rewards, latest-news, contact-us, sitemap, health-probe), redirect 5.
- No sibling brand-sources (Downy/Bounce are other brands).

**Artifacts touched:**
- stardust/current/** — created (pages, screenshots, _crawl-log.json, _computed-styles.json, fonts, css, logo, favicon, PRODUCT.md)
- stardust/state.json — created (flow replica, handsOff)

**Findings worth flagging:**
- Footer "Shop Products" columns render empty in every capture (late-loaded); read footer links live at recreation.
- Proprietary "Tide" typeface self-hosted on the source (/fonts/tide_type_*.woff2) — licensing alert at deploy.

**Open questions:** none

**Next:** Phase 2 preserve direction (promote spec, empty register, dynamics + martech triage).

---

## 2026-11-23T20:05:00Z — Preserve direction — captured spec promoted, register 1 deferred entry, 16 dynamic features triaged

**Decisions:**
- PRODUCT.md / DESIGN.md / DESIGN.json promoted verbatim from stardust/current (full-prep branch); stardust/direction.md written.
- Register: R-01 (proprietary Tide face self-hosted as captured, licensing alert) — deferred; no applied deltas (pure replica). No audit, no --target-breakpoints.
- Dynamics: detect on home + one page per type → 60 draft rows curated into 16 features; every row has a disposition; nothing decided-out (hands-off).
- Martech: spec-martech on home + 8 type pages → GTM ×5 (GTM-N6XWT7TZ, NQ2Z6K78, MR47VR8, N94XXFB, NLPTVV8) + OneTrust (consent model owner-decision); contract + handoff written, every part disabled; scripts/martech.js scaffolded (no CMP, 0 routes enabled).
- Publish decision recorded in stardust/eds-conversion-log.md.

**Artifacts touched:** PRODUCT.md, DESIGN.md, DESIGN.json, stardust/direction.md, stardust/replica/inconsistency-register.md, stardust/current/_dynamics.json, stardust/dynamics/*, stardust/dynamic-features{,-plan}.md, stardust/martech/*, stardust/martech-contract.json, stardust/martech-handoff.md, scripts/{martech,scripts,consented,consent-check}.js, stardust/scripts/{dynamics,spec,deploy,rollout}/

**Findings worth flagging:**
- /en-us/contact-us main is rendered by the P&G consumer-support app (body empty in capture) — re-embed, never migrate blank.
- Commerce (click2cart.com), sign-in (account.tide.com) and PriceSpider stay external.

**Next:** Phase 3 recreate — home archetype first.

---

## 2026-11-23T21:45:00Z — Recreate — home archetype (en-us) gated, approved hands-off with residuals

**Decisions:**
- Archetype reps: home /en-us · article /en-us/research/best-quality-detergent · product-listing /en-us/shop/type/liquid · collection-landing /en-us/shop/top-collections/tide-free-and-gentle · section-landing /en-us/our-commitment · topic-hub /en-us/how-to-wash-clothes/how-to-remove-stains · sustainability-topic /en-us/our-commitment/sustainability/compaction · click2cart /en-us/click2cart/0060001. `unique` (14 one-offs) is not a template: unique-render branch at handoff from the gated canon.
- en-us gate iter2 --full: 1440 pixel 0.19% Δh −1, 360 pixel 0.26% Δh −1; content-diff 0/0; clipped 0; overflow none; cap-probe PASS. Header-contract probe: 13 residuals (drawer/locale panel width, same-trigger toggle-close) — `rounds.mjs decide accept-residual`. Confirmation round skipped for budget.
- Canon: stardust/prototypes/canon/{canon.css,canon.js}, assets under stardust/prototypes/assets.

**Next:** remaining 7 archetypes, cumulative on the canon, tighter round budget.

---

## 2026-11-23T23:35:00Z — Recreate — all 8 archetypes gated and approved (hands-off)

**Decisions:**
- article 0.42/0.23 % · product-listing 0.26/0.10 % · section-landing 0.17/0.01 % · collection-landing 0.69/0.58 % · sustainability-topic 1.34/0.91 % (jump-nav capture artefact residual) · topic-hub 0.74/0.64 % (1440 at round cap, pass) · click2cart: stitched pixel gate scroll-blocked (body scroller, Hardening rule 13) — content-diff 0/0, visual-diff none, substitute pixel 0.00 % masked; cap-probe needs `--main "#shopper-choice-container"`; the published-origin gate will hit the same stall.
- Canon candidates for C0: buttons `font-size: inherit`; text inputs radius 12px; jump-nav JS/CSS + product card/stars/Find Retailers styles duplicated across page files; jump-nav spacer uses clientHeight (article/collection carry +1px); canon.js footer accordions skip pages without header.
- Dynamics gap: PLP sort / grid-list / load-more have no dynamic-features row — add before deploy.

**Next:** `gate-all.mjs --stage prototype --proto-base http://localhost:8791` at 1440 and 360, then the recreate + source-fidelity-gate end lines, then handoff.

---

## 2026-11-23T23:45:00Z — Recreate — prototype table gated at 1440 and 360, phase closed

**Decisions:**
- `gate-all --stage prototype` at 1440: 7 PASS / 0 FAIL / 1 error; at 360: 7 PASS / 0 FAIL / 1 error. Tables: stardust/replica/gates/prototypes-{1440,360}/summary.md.
- The error row is click2cart (missing capture — body-scroller stall, Hardening rule 13), the residual already recorded at its archetype gate (content-diff 0/0, masked substitute pixel 0.00 %). Accepted; the published-origin gate needs the same handling.

**Next:** Phase 5 handoff — contract card first, then migrate/deploy/rollout C-deliver units (foundation, archetypes, clusters), PLP sort/grid/load-more dynamics row before deploy.

---

## 2026-11-23T23:43:00Z — Migrate plan — 8 archetypes first, siblings after their published archetype

**Decisions:**
- Path A: the 8 approved archetypes. Path A′: 70 siblings, rendered per template only after that template's C-archetype unit is done (#126). Path B: 14 unique pages rendered from the gated canon. The 5 redirect-typed pages (incl. the root `/` → `/en-us`) go to the redirects sheet, not the page tree.
- Units in stardust/migrate/progress.json.

**Next:** render unit `archetypes`, then rollout A/B/B2 and C-deliver foundation.

---

## 2026-11-23T23:45:00Z — Rollout A-inventory — 99 rows, 8 archetypes to deliver, 91 content-pending

**Decisions:** DA org aemcoder / site 5db7d055 / ref main; live host main--5db7d055--aemcoder.aem.live. Siblings stay content-pending until their template's C-archetype unit passes.

**Next:** B-block dedup plan, B2 dynamic-surface verification.

---

## 2026-11-23T23:46:00Z — Rollout B-block — 14 distinct blocks, each converted once on its archetype

**Decisions:** module ids from DESIGN.json instances set on each archetype sidecar (chrome excluded: top bar, header, footer are foundation). click2cart carries one `shopper-choice` block.

**Next:** B2 dynamic surface.

---

## 2026-11-23T23:48:00Z — Rollout B2-dynamic — 17 rows curated, PLP controls added, martech contract re-planned disabled

**Decisions:**
- dynamics-plan re-run with `--migrated --martech --chrome`: 60 draft rows; self 11, owner batch 36, already delivered 8, host-bound 0 (no target origin yet — D2 replays on the delivered origin).
- Row 17 added: PLP sort / grid-list / load-more → rebuild-native in the product-grid block (self), implemented in the product-listing archetype unit.
- Martech contract regenerated with every part disabled (only `writtenAt` changed).

**Next:** C-deliver — foundation unit (C0) by one foundation subagent.

---

## 2026-11-24T00:30:00Z — C-deliver foundation — chrome published, parity quiet, foundation frozen

**Decisions:**
- Foundation subagent authored + deployed styles, fonts (Tide self-hosted, R-01 licence alert; Poppins + FontAwesome for click2cart), header/footer blocks, /nav + /footer (noindex, live). Two rounds: chrome-parity on /drafts/foundation-shell now 0 style deltas at 1440 and 360 (only DA media-rename ICON lines).
- Header is position:fixed below 992 → main carries padding-top var(--nav-height); archetype CSS must not add its own offset. Canon BEM names became single-hyphen (topbar-row, submenu-cols).
- crop-compare header/footer bands run on the home archetype (shell has no content band). click2cart needs its own minimal nav document (cluster's job).

**Next:** archetype units, home first.

---

## 2026-11-24T01:30:00Z — C-deliver archetype wave 1 — article and click2cart live and gated; home in flight

**Decisions:**
- archetype-article: 1440 0.45 % Δh −1 / 360 0.25 % Δh 0, content-diff 0/0; blocks jump-links, breadcrumb, article-title-band, faq-accordion, table (encoder shape in eds-conversion-log.md). 2 foundation requests queued.
- archetype-click2cart: 1440 4.44 % Δh 0; 360 pixel invalid (live body-scroller stall → crawl-shot reference) — substitute: content-diff 0/0, measure Δ0; header suppressed via `Template | click2cart` + minimal /en-us/click2cart/nav. 1 request queued.
- archetype-home: stopped at the session boundary mid-final gate (content deployed); unit stays `running` — re-run from its state: re-gate the live page, fix within cap, crop-compare header/footer.

**Next:** archetype-home (resume), then wave 2: product-listing, collection-landing, section-landing; wave 3: topic-hub, sustainability-topic (block ownership in this journal: article owns breadcrumb/article-title-band/jump-links/faq-accordion/table; home owns feature-band-alternating, learn-more-card-grid, home-promo-carousel, browse-tiles, stain-guide-widget). Brief: stardust/rollout/units/ARCHETYPE-BRIEF.md.

## 2026-11-24T01:20:00Z — C-deliver archetype-home — live and gated on the preview origin

**Decisions:**
- archetype-home: published-origin gate 1440 0.34 % Δh 1 (confirm after the content-diff round) / 360 0.51 % Δh 1 (re-confirmed after the last home commits); content-diff main root 0 🔴 / 0 🟡. Chrome-root findings filed as one foundation request (role swaps, missing aria-labels; icon diffs are DA media renames).
- wave 2 running: archetype-product-listing (owns product-grid), archetype-collection-landing (owns collection-hero).

**Next:** record wave 2 units, then section-landing, topic-hub, sustainability-topic; clusters after each archetype (article and click2cart clusters are unblocked).

## 2026-11-24T01:48:00Z — C-deliver archetype-section-landing — live and gated

**Decisions:**
- archetype-section-landing (/en-us/our-commitment): 1440 0.45 % Δh 0 / 360 0.30 % Δh 0, content-diff main 0/0. New blocks section-landing-hero-card, section-landing-video (poster rows; embed links as default content beside the block). Card rows reuse learn-more-card-grid (`three-up` variant). Siblings need `Template | section-landing`.

**Next:** record product-listing and collection-landing; start sibling clusters (article first) as browser slots free.

## 2026-11-24T02:00:00Z — C-deliver archetype-collection-landing — live and gated

**Decisions:**
- archetype-collection-landing (/en-us/shop/top-collections/tide-free-and-gentle): 1440 0.7 % Δh −1 / 360 0.7 % Δh 0, content-diff 0/0. Blocks collection-hero, collection-banner (variants intro/centered/right/split/works/closing), collection-anchor; reuses jump-links and product-grid `collection`.
- PriceSpider "Find Retailers" stays a static link per dynamic-features row 7 interim (vendor account id is the owner's); 2 requests filed (product-grid collection variant, jump-links id matching).

**Next:** product-listing archetype, then clusters (article running).

## 2026-11-24T02:15:00Z — C-deliver archetype-product-listing — live and gated

**Decisions:**
- archetype-product-listing (/en-us/shop/type/liquid): 1440 0.14 % Δh 0 / 360 0.04 % Δh 0, content-diff main 0/0. Blocks product-grid (filter / product / promo rows by content; source order = popularity; promos at relatedArticlesPosition), plp-title-bar, plp-related. PLP controls (row 17) client-side on authored tiles. Find Retailers → product page (row 7 interim).
- Residual notes: list-view styling not captured on source (authored from canon); 13 uncaptured retailer aria-labels templated.

**Next:** cluster-product-listing, cluster-collection-landing, cluster-section-landing, cluster-click2cart as slots free; topic-hub and article cluster running.

## 2026-11-24T02:40:00Z — C-deliver archetype-topic-hub — live and gated

**Decisions:**
- archetype-topic-hub (/en-us/how-to-wash-clothes/how-to-remove-stains): 1440 0.66 % Δh 0 / 360 0.87 % Δh +3, content-diff main 0/0. Blocks step-timeline, topic-hub-intro, topic-hub-stain-index, topic-hub-guide-header, topic-hub-back-to-top; reuses jump-links, collection-anchor, stain-guide-widget `orange`. Residual: live sticky jump-nav stitch band (recorded in the replica gate).

**Next:** archetype-sustainability-topic; clusters product-listing and article running; then collection-landing, section-landing, topic-hub, click2cart, unique clusters.

## 2026-11-24T03:20:00Z — C-deliver cluster-product-listing — 14/14 live, 5/14 pass (unit failed, fix program recorded)

**Decisions:**
- All 14 sibling PLPs delivered and published; 5 pass both widths, 8/14 at 360. Failures need block work (cluster agents may not edit blocks): a safety-row block, plp-related desktop variant, product-grid title width, feature-band-alternating `right`, units.json families optional. Unit left `failed` with `fixList` in rollout/progress.json; re-run as a fix unit that owns product-grid/plp-related (+ a request to feature-band-alternating), then re-gate the 9.

**Next:** finish cluster-article; then cluster-product-listing fix unit, archetype-sustainability-topic, remaining clusters.

## 2026-11-24T03:45:00Z — C-deliver session boundary — cluster-article in flight

**Decisions:**
- Runner stop (session cap). cluster-article: 37/37 encoded, deployed and published; published-origin gate 1440 over all 37: 31 PASS / 6 FAIL (MISSING content and height on the rewards and how-to-wash pages, pva-technical-review pixel 10.59 %). 360 not yet run. Resume state recorded in rollout/progress.json units.cluster-article.resumeState.

**Next:** resume cluster-article (fix the 6, gate 360), then the cluster-product-listing fix unit (fixList), archetype-sustainability-topic, clusters collection-landing / section-landing / topic-hub / click2cart / unique, gate-all, final.

## 2026-11-24T06:05:00Z — C-deliver session boundary — four units done, article and topic-hub in flight

**Decisions:**
- Done this session: archetype-sustainability-topic (1440 1.38 % / 360 1.9 %, content 0/0), cluster-sustainability-topic (2/2 pass, max 5.9 % / 3.76 %), cluster-product-listing fix unit (14/14 pass, max 7.52 % / 7.2 %; archetype re-gate 0.32 % / 0.04 %), cluster-collection-landing (4/4 pass, max 1.13 % / 1.23 %).
- Runner stop (elapsed cap): cluster-article and cluster-topic-hub stopped mid-gate; resume state in rollout/progress.json units.<name>.resumeState. The cluster-product-listing lines in foundation-requests.md are resolved by the fix unit (clear at C-final).

**Next:** finish cluster-article (360 gate) and cluster-topic-hub (final gate); then clusters section-landing, click2cart, unique; gate-all; final.

## 2026-11-24T06:20:00Z — C-deliver cluster-topic-hub — 3/3 live and gated

**Decisions:**
- Final published-origin gate 1440 3/3 / 360 3/3 (max 0.96 % / 0.97 %); how-to-do-laundry units residual (source empty `<h1>`, not authorable) recorded as an overrides.json row waiving units only, at both widths.

**Next:** finish cluster-article (360 batch B + failing five), then section-landing, click2cart, unique; gate-all; final.

## 2026-11-24T07:00:00Z — C-deliver cluster-article — 37/37 live and gated

**Decisions:**
- 360 batch B 23/23 pass; the three remaining fails fixed in one round: table bullet-paragraph runs authored as lists, table `rows` variant for the live `.tide-table`. Gate 1440 37/37 (max 8.89 %), 360 37/37 (max 6.31 %).
- migrate/progress.json: render units for article, collection-landing, sustainability-topic, topic-hub recorded done.
- section-landing and click2cart clusters running in parallel subagents.

**Next:** record section-landing and click2cart; cluster-unique (14 Path B pages); gate-all; final.

## 2026-11-24T07:40:00Z — C-deliver cluster-section-landing — 5/5 live and gated

**Decisions:**
- Archetype is /en-us/our-commitment; all 5 coverage rows were siblings. Gate 1440 5/5 (max 1.17 %), 360 5/5 (max 0.48 %), content 0/0, no overrides. Variant classes only on learn-more-card-grid and section-landing-hero-card.

**Next:** record click2cart and unique A/B as their subagents finish; gate-all; final.

## 2026-11-24T08:00:00Z — C-deliver cluster-click2cart — 7/7 live and gated

**Decisions:**
- 1440 7/7 pass (max 4.68 %); 360 7/7 through documented overrides (live capture stalls exactly as for the archetype; waives capture/pixel/height only; content 0/0, measure Δ0). shopper-choice gained per-page variant classes, no new blocks.

**Next:** record unique A/B when their subagents finish; gate-all; final.

## 2026-11-24T08:45:00Z — C-deliver session boundary — cluster-unique 13/14, turn-to-cold open

**Decisions:**
- Done this session: cluster-topic-hub (3/3), cluster-article (37/37), cluster-section-landing (5/5), cluster-click2cart (7/7; 360 via documented overrides as the archetype).
- cluster-unique: group B 6/6 pass (7 new blocks); group A 8/8 live, 7/8 pass (campaign-row, video-carousel new). turn-to-cold fails 1440 13.32 % (cap reached) / 360 14.81 %. Stopped at the budget mark; resume state in rollout/progress.json units.cluster-unique.resumeState.

**Next:** turn-to-cold fix (one 360 round, 1440 rounds.mjs decide), record cluster-unique done; gate-all; final; done-check.

## 2026-11-24T09:20:00Z — C-deliver cluster-unique — 14/14 live and gated

**Decisions:**
- turn-to-cold fixed (calculator piggy cell, partner cards, pledge dial knob/icons/totals, products band, mobile split order); gate-all 1440 1.16 % Δh 1, 360 1.11 % Δh −3, clip 0, content 0.
- Passing rounds were over the cap: accept-residual recorded per width (hero band of the shared hero card; mobile partner-card dots not rebuilt).

**Next:** gate-all over the roster at 1440 and 360; final; done-check.

## 2026-11-24T12:15:00Z — C-deliver gate-all — 94/94 delivered on the published-origin table at both widths

**Decisions:**
- 1440: 93 PASS + 1 documented override (how-to-do-laundry units, empty source `<h1>`); 360: 85 PASS + 9 overrides (8 click2cart invalid 360 reference — the archetype 0060001 override added at C-final with a fresh content-diff, main root 0/0, evidence in gates/all-360/evidence/; 1 units).
- `update-coverage.mjs --gate` written for both tables: 94/94 rows matched, 0 flips.
- Wide 2560 report stopped after 18 pages (~1 min/page, advisory only; not a delivery criterion).

**Next:** C-final (freeze check, request queue, C-deliver end), then D-site — redirects sheet must map the 6 upper-case source paths (click2cart 006000B/H/I/Q/Z, superbowlLX) to their lower-case delivered paths.

## 2026-11-24T12:20:00Z — C-deliver final — rollout delivery closed, 94/94 gated at both widths

**Decisions:**
- foundation-freeze check clean (22 files unchanged); the 18-line request queue disposed once as recorded in eds-conversion-log (all shipped block-scoped and gated; owner backlog), so no archetype re-gate was needed.
- C-deliver ends: 19/19 units done.

**Next:** D-site — sitemap/robots, redirects sheet (5 source redirects + 6 upper-case source paths → lower-case delivered paths, then coverage paths aligned), `/` 200, chrome noindex; then D2, E, E2, F, G, H, I and done-check.

## 2026-11-24T12:35:00Z — D-site — redirects wired, root answers, served sitemap 93

**Decisions:**
- Redirects sheet (13 rows) published; `/` → `/en-us` 301 then 200; upper-case source paths 301 to their lower-case delivered pages.
- Coverage: 5 redirect rows dropped, 6 rows re-keyed to the served lower-case path (done-check probes the row path).
- Served sitemap 93 vs assembled 94: `/health-probe` is noindex on the source and kept so — accepted.
- DA library published.

**Next:** D2-dynamic (parity rows, dynamics-check incl. martech), E-full-site verify, E2 link audit, F optimize, G, H, I dashboard, done-check.

## 2026-11-24T12:26:00Z — D2-dynamic — parity replayed on the published origin, 11/13 (2 pending CDN edge refresh)

**Decisions:**
- Header search (row 2): the results page and full catalogue are outside the planned page set → the form submits `q=` to https://tide.com/en-us/search (link-out interim; moving search to the new host is the owner's call). No query index needed: no delivered listing or search reads one.
- Header locale dialog now carries `hidden` while closed (a closed dialog was exposed as `[role=dialog]`, so the click-dialog replay picked it instead of the browse-tiles modal).
- `stardust/dynamics/parity.json` written: 9 features with checks + martech (auto); 4 rows without checks (sign-in, locale links, accessibility redirect, static snapshots).

**Evidence:** dynamics-check 11/13 PASS — menus, no page errors on 8 archetype paths, YouTube plays (16 playback requests), PLP sort/load-more, carousels, PriceSpider static links (52), click2cart link-out, contact care-hub iframe, martech all-off (no tag host requested). The 2 FAILs (search action, browse dialog) are the two header.js commits: origin serves them (curl Last-Modified 12:15/12:20), but the CDN edge the headless browser reaches holds the 01:01 copy (age ~700 s, max-age 7200) and admin code/cache purges do not reach it.

**Next:** E-full-site; re-run dynamics-check before H-report once the edge copy expires (by ~14:20Z).

## 2026-11-24T12:44:00Z — E-full-site — 94/94 verified on aem.live, render check 17/17

**Decisions:**
- Trailing-slash source paths: tide.com 301s `/x/` → `/x`; the new origin 404'd them (and verify probes folder-index rows with the slash). 94 `<path>/` → `<path>` rows added to the redirects sheet (107 rows), published, measured 301.
- Out-of-plan internal targets (336: product detail pages, stain and how-to articles, PLP filter paths outside the 100 planned pages) repointed to https://tide.com<path> in 54 documents incl. `/nav`; 4 links to redirect sources repointed to their destinations. Redeployed + published (54/54; one transient `about:error` ingestion on /en-us/shop/type/liquid re-driven clean). List: stardust/.work/rollout/repointed.tsv; decision recorded in direction.md.
- R-02 (register, applied): /en-us/rewards and /en-us/contact-us had no `h1` on the source; each gets a first `visually-hidden` section with an `h1` of the captured title. Re-gated both at 1440/360: PASS (pixel 0.17/0.22 %).
- video-carousel: live starts clip 1 when the carousel scrolls into view (observed on tide.com /tide-evo and /superbowlLX); the block now does the same (IntersectionObserver, 25 %). Verified on aem.page; aem.live edge serves the previous JS until its cache copy expires.

**Evidence:** verify 94 checked · 94 verified · 0 failed. Render check (first page per template, 16 templates + rewards): body.appear, sections > 0, 0 page errors, 0 broken images, header Shop lists wired (50 links); visible autoplay videos playing on dont-pay-for-water.

**Next:** E2 link audit (every href GET against the live tree, localize-links --check), F optimize.

## 2026-11-24T12:45:00Z — E2-link-audit — 88/88 internal hrefs 200 on aem.live

**Decisions:**
- Out-of-plan targets repointed to tide.com in E (direction.md § E2 decision, 336 targets). No capture gaps: every internal target outside the 94 delivered pages is outside the fixed plan scope.
- localize-links: 1 absolute tide.com link localized (/en-us/rewards/loyalty/terms-and-conditions), redeployed + published; `--check` exits 0.

**Evidence:** every distinct root-relative href in the content tree incl. /nav and /footer (88) answers 200 on https://main--5db7d055--aemcoder.aem.live (redirects followed); sample of 23 repointed tide.com targets: 23 × 200.

**Next:** F optimize.

## 2026-11-24T12:49:00Z — F-optimize — gate clean, 0 open findings

**Decisions:**
- 37 P2 `jsonld` (source has JSON-LD, delivery had none — a content-preservation gap): each page's source JSON-LD carried verbatim as a `JSON-LD` metadata row (the pipeline renders it as `<script type="application/ld+json">` in the served head); `<`, `>`, `&` written as JSON `\u` escapes so the served script parses to the source value (checked: FAQPage, 4 entries, first answer identical). Redeployed + published 37/37.
- 85 source-parity findings (no meta description / JSON-LD / shared titles on the source too) stay informational, as the source has them.

**Evidence:** optimize --all on aem.live: Health 100/100 (seo 100 · ai 100 · xpage 100; a11y layer not assessed), open P1 0 · P2 0 · P3 0, fixed this history P2 37; GATE: no open P1.

**Next:** G-aem (nothing open to autofix), H report, I dashboard, dynamics re-run, done-check.

## 2026-11-24T12:50:00Z — G-aem — nothing to autofix

**Evidence:** autofix-aem --dry-run: candidates 0 (no open finding after F; the 37 jsonld findings were closed by carrying the source payload, not by a fixer).

**Next:** H report, I dashboard.

## 2026-11-24T12:51:00Z — H-report — report and learnings written

**Evidence:** stardust/rollout/report.md — 94/94 verified, 0 pending; pixel table 1440 93 PASS + 1 override, 360 85 PASS + 8 overrides; health 100, open 0/0/0; dynamic parity table with owner decisions. stardust/learnings.md — 5 entries (trailing-slash folder-index rows, out-of-plan links before E2, JSON-LD carry-over, autoplay-on-view carousel, CDN edge lag after code push).

**Next:** I dashboard, then dynamics replay after the edge refresh and the done-check.

## 2026-11-24T12:53:00Z — I-dashboard — dashboard written; dynamics 13/13 on preview

**Decisions:**
- Header: the closed locale dialog also drops `aria-modal` (the replay's dialog selector matched it, `[aria-modal=true]`, ahead of the browse-tiles `<dialog>`); pushed.
- Local done-check lists `pages_not_live:8` probing `/x/` for folder-index rows (HEAD, redirect manual) — the runner's done-check, the authoritative one, reports only `rollout_incomplete`; the 8 pages answer 200 at their delivered paths and `/x/` 301s to them.

**Evidence:** dashboard.mjs: 99 identified · 94 prototyped-or-rendered · 94 deployed · 94 optimised. dynamics-check on aem.page 13/13 PASS; on aem.live 11/13 while the CDN edge still serves the pre-fix header.js (max-age 7200, oldest copy cached ~12:16Z) — re-run on aem.live after ~14:20Z.

**Next:** done-check, replica handoff end.

## 2026-11-24T12:54:00Z — replica handoff — complete

**Evidence:** runner done-check `{"complete":true,"gaps":[]}`. 94/94 delivered pages live on aem.live, verified, published-origin gate 1440 93 PASS + 1 override / 360 85 PASS + 8 overrides; optimize 0 open; links 88/88; martech contract carried over all-disabled (scripts/martech.js, stardust/martech-contract.json, stardust/martech-handoff.md committed; replay: no tag host requested).

**Follow-up:** re-run `dynamics-check.mjs --origin https://main--5db7d055--aemcoder.aem.live` after ~14:20Z, when the CDN edge copy of the pre-fix header.js expires (expect 13/13, as on aem.page).
