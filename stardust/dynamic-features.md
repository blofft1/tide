# Dynamic features — tide.com

Curated from `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (60 draft rows,
`dynamics-detect` on the home page + one page per type, reach from `extract --dynamics`).
Duplicates merged, unknown hosts classified from their role. Hands-off: every non-`self` row
ships its interim tier and names its decision; nothing is `decided-out` by assumption.

## Listings contract

none — the two listing candidates (home "6 cards" row, one product-listing row) are editorially
curated card sets in the capture, authored as rows in the document (static-snapshot, document-first).
Article and product listings are not index-driven on the source.

## Features

| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | chrome-menu / chrome-drawer / m-modal-trigger-aria-haspopup | header menus, mobile drawer, locale menu | M | all | rebuild-native | runtime | self | done | chrome | none (header contract is the spec) | stardust/chrome/header-contract.json |
| 2 | chrome-search / s-site-search-form-en-us-search | header search → /en-us/search | S | all | link-out | content | needs-business-decision | interim | link-out | interim (D2, 2026-11-24): the results page and the full catalogue are outside the planned page set, so the header search submits q= to https://tide.com/en-us/search; moving search to the new host (query index + results page) is the owner's decision | form action /en-us/search on 8 of 10 probed |
| 3 | m-modal-trigger-youtube-video-preview / v-video-youtube | YouTube preview overlay + player | M/V | 1 (home) | embed-passthrough | content | self | done | modal-loader | none (player ids public) | home video card |
| 4 | m-modal-trigger-modal-card | modal card (target outside main) | M | 1 | rebuild-native | runtime | self | done | modal-loader | none | home |
| 5 | t-tag-manager-google-tag-manager (+ GA/Ads, rudderstack, lytics, crazyegg, tapad, pubmatic, casale, bidswitch, adsrvr, videoamp, pghub, pricespider events) | tag stack: 5 GTM containers + their vendors | T | all | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | martech | which tags run on the new host — martech contract, every route disabled | stardust/martech-contract.json |
| 6 | t-consent-onetrust | consent: OneTrust | T | all | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | martech | CMP domain script reuse on the new host (consent.cmp disabled) | stardust/martech-handoff.md |
| 7 | t-third-party-mount data-action-detail / cdn.pricespider / locate.pricespider / omni.pricespider | PriceSpider "where to buy" widget | T | product pages | embed-passthrough | embed | needs-credential | interim | embed | vendor account id stays the owner's; static buy buttons ship as links | product-listing, collection-landing |
| 8 | x-commerce-signals / click2cart.com / sc-api.click2cart.com | click2cart buy-now cart | X | click2cart (8) | embed-passthrough | embed | needs-backend | interim | link-out | commerce stays on click2cart.com; pages link out | /en-us/click2cart/* |
| 9 | x-sign-in-account-links | sign-in / rewards account | X | chrome | static-snapshot | content | needs-backend | interim | link-out | auth stays on account.tide.com; links kept | header |
| 10 | f-form-backend-salesforce-pardot | newsletter / sign-up form | F | 1 | rebuild-native | widget | needs-backend | interim | form-local-capture | production backend (vendor form id + field map); interim shows "no backend connected" | home sign-up |
| 11 | cr-main-empty-at-load / consumersupport.pg.com | contact-us support widget (client-rendered) | CR | 1 | embed-passthrough | embed | needs-human-capture | interim | embed | contact page main is rendered by the P&G consumer-support app; re-embed, never migrate blank | /en-us/contact-us |
| 12 | v-iframe-without-src | runtime-injected iframes (tag pixels) | V | 9 | static-snapshot | content | self | done | — | reason: tag-manager pixels, no visible surface; unfreeze if the owner enables tags | 9 pages |
| 13 | a-cms-app-settings dataLayer / __NEXT_DATA__ / client framework next | Next.js data + dataLayer | A/CR | all | static-snapshot | content | self | done | — | reason: pages are fully rendered in the capture; dataLayer is carried by the martech contract | all |
| 14 | images.ctfassets.net / cdn.scaleflex / s3 hosts / www.google.com | media + asset CDNs | A | 7–10 | static-snapshot | content | self | done | — | reason: assets are imported into the new media bus | all |
| 15 | i18n-locale-variants (8 rows merged) | locale switcher en-us, es-us, en-ca, fr-ca, … | I18N | chrome | rebuild-native | runtime | needs-business-decision | interim | locale-links | scope of the locale trees: only en-us is in plan scope; other locales stay links to tide.com | header locale menu |
| 16 | accessibility.* host | accessibility page redirect target | T | 1 | static-snapshot | content | self | done | redirect | delivered as a redirect (accessibility.pg.com) | /en-us/accessibility |
| 17 | plp-controls (sort / grid-list toggle / load more) | product-listing sort select, grid/list view toggle, load-more paging | CR | product-listing (15) | rebuild-native | block | self | done | client-compute | none — client-side over the authored product cards in the product-grid block (sort by the captured order/name, view class toggle, reveal-in-pages); implemented in the product-listing archetype unit | /en-us/shop/type/liquid |

## Decision batch

One message to the owner (recorded, hands-off assumptions shipped):

- **Tags and consent** (rows 5–6): turn on OneTrust and each GTM container in `stardust/martech-contract.json` (all disabled), then re-run the scaffold.
- **Backends** (rows 8–10): newsletter form backend (Salesforce / Pardot form id); commerce stays on click2cart.com; sign-in stays on account.tide.com.
- **Credentials** (row 7): PriceSpider account id for the where-to-buy widget.
- **Capture** (row 11): the contact-us support app is re-embedded; confirm the consumer-support embed URL for the new host.
- **Business** (row 15): locale scope — only en-us migrates in this run.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement; every row ships an interim tier | — |
