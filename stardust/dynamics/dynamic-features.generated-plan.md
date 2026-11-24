<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-23T23:44:04.081Z · input stardust/current/_dynamics.json (10 pages, 60 findings) · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 10/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 10/10 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-next-data | A | CMS / app settings object __NEXT_DATA__ | 9/10 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-unknown-third-party-host-api-rudderstack-com | A | unknown third-party host api.rudderstack.com | 9/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-c-lytics-io | A | unknown third-party host c.lytics.io | 9/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-rudderstacdaco-dataplane-rudderst | A | unknown third-party host rudderstacdaco.dataplane.rudderstack.com | 9/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-script-crazyegg-com | A | unknown third-party host script.crazyegg.com | 6/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-tracking-crazyegg-com | A | unknown third-party host tracking.crazyegg.com | 6/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-click2cart-com | A | unknown third-party host click2cart.com | 1/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-sc-api-click2cart-com | A | unknown third-party host sc-api.click2cart.com | 1/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-unknown-third-party-host-consumersupport-pg-com | A | unknown third-party host consumersupport.pg.com | 1/10 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 12 | cr-client-framework-next | CR | client framework next | 10/10 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | cr-main-empty-at-load-filled-after-client-rendered-page | CR | main empty at load, filled after (client-rendered page) | 1/10 | static-snapshot | content | needs-human-capture | pending | client-rendered-page | human-browser capture; never migrate blank |  |
| 14 | f-form-backend-salesforce-pardot | F | form backend: Salesforce / Pardot | 1/10 | rebuild-native | block | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 15 | i18n-locale-variants-en-us-en-us | I18N | locale variants en-US,en-US | 2/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://termsandconditions.pg.com/en-us/" |
| 16 | i18n-locale-variants-en-us-en-us | I18N | locale variants en-us,en-us | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://termsandconditions.pg.com/en-us/" |
| 17 | i18n-locale-variants-en-us | I18N | locale variants en-US | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 18 | i18n-locale-variants-en-us-es-us-en-ca-fr-ca-en-gb-en-in-de- | I18N | locale variants en-us,es-us,en-ca,fr-ca,en-gb,en-in,de-de,ar-sa | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 19 | i18n-locale-variants-en-us-es-us-en-ca-fr-ca-en-gb-en-in-ar- | I18N | locale variants en-us,es-us,en-ca,fr-ca,en-gb,en-in,ar-sa,en-sa | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 20 | i18n-locale-variants-en-us-es-us-en-ca-fr-ca-en-gb-ar-sa-en- | I18N | locale variants en-us,es-us,en-ca,fr-ca,en-gb,ar-sa,en-sa | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 21 | i18n-locale-variants-en-us-es-us-en-ca-fr-ca | I18N | locale variants en-us,es-us,en-ca,fr-ca | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 22 | i18n-locale-variants-en-us | I18N | locale variants en-us | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 23 | i18n-locale-variants-en-us-es-us-en-ca-fr-ca-en-gb-en-in-de- | I18N | locale variants en-us,es-us,en-ca,fr-ca,en-gb,en-in,de-de,ar-sa,en-sa,pt-br | 1/10 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://accessibility.pg.com/en-US" |
| 24 | l-listing-candidate-row-justify-content-start-66-cards | L | listing candidate row justify-content-start (66 cards) | 1/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 25 | l-listing-candidate-row-6-cards | L | listing candidate row (6 cards) | 1/10 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 26 | m-modal-trigger-aria-haspopup-chrome-only-target-outside-dom | M | modal trigger aria-haspopup (chrome only) → target outside DOM at capture | 1/10 (reach 1/99) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 27 | m-modal-trigger-youtube-video-preview-overlay-target-outside | M | modal trigger youtube-video-preview-overlay → target outside DOM at capture | 1/10 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 28 | m-modal-trigger-modal-card-target-outside-dom-at-capture | M | modal trigger modal-card → target outside DOM at capture | 1/10 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 29 | s-site-search-form-en-us-search | S | site search form → /en-us/search | 8/10 (reach 89/99) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 30 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-consent-onetrust | T | consent: OneTrust | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 32 | t-unknown-third-party-host-pghub-io | T | unknown third-party host pghub.io | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 34 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 35 | t-unknown-third-party-host-pixel-tapad-com | T | unknown third-party host pixel.tapad.com | 10/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-unknown-third-party-host-simage2-pubmatic-com | T | unknown third-party host simage2.pubmatic.com | 9/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-unknown-third-party-host-dsum-sec-casalemedia-com | T | unknown third-party host dsum-sec.casalemedia.com | 9/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-unknown-third-party-host-cdn-pricespider-com | T | unknown third-party host cdn.pricespider.com | 9/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 39 | t-unknown-third-party-host-x-bidswitch-net | T | unknown third-party host x.bidswitch.net | 9/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | t-unknown-third-party-host-cdn-rudderlabs-com | T | unknown third-party host cdn.rudderlabs.com | 9/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 41 | t-unknown-third-party-host-cdn-scaleflex-it | T | unknown third-party host cdn.scaleflex.it | 8/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 42 | t-unknown-third-party-host-wtbevents-pricespider-com | T | unknown third-party host wtbevents.pricespider.com | 8/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 43 | t-unknown-third-party-host-images-ctfassets-net | T | unknown third-party host images.ctfassets.net | 7/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 44 | t-unknown-third-party-host-adservice-google-com | T | unknown third-party host adservice.google.com | 3/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-unknown-third-party-host-locate-pricespider-com | T | unknown third-party host locate.pricespider.com | 2/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-unknown-third-party-host-omni-pricespider-com | T | unknown third-party host omni.pricespider.com | 2/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-third-party-mount-div-data-action-detail-tag-manager-injec | T | third-party mount <div data-action-detail> (tag-manager-injected widget) | 2/10 | embed-passthrough | embed | needs-credential | delivered-by-capture | embed-passthrough | vendor account ids stay the owner's | output already carries "data-action-detail" |
| 48 | t-unknown-third-party-host-accessibility-pg-com | T | unknown third-party host accessibility.pg.com | 1/10 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "accessibility.pg.com" |
| 49 | t-unknown-third-party-host-feed-pghub-io | T | unknown third-party host feed.pghub.io | 1/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 50 | t-unknown-third-party-host-pandg-tapad-com | T | unknown third-party host pandg.tapad.com | 1/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-unknown-third-party-host-s3-us-west-2-amazonaws-com | T | unknown third-party host s3.us-west-2.amazonaws.com | 1/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-s3-us-west-2-amazonaws-com | T | unknown third-party host s3-us-west-2.amazonaws.com | 1/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-b-videoamp-com | T | unknown third-party host b.videoamp.com | 1/10 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 54 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 9/10 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 55 | v-video-youtube | V | video: YouTube | 1/10 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) |  |
| 56 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 1/10 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 57 | x-sign-in-account-links | X | sign-in / account links | 1/10 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 58 | chrome-drawer | M | header drawer: navigation menu (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 59 | chrome-menu | M | header menu: US - English, Shop Products (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 60 | chrome-search | S | header search: Search (chrome only) | 1/1 | index-backed | widget | self | pending | search-index-backed | none (results from the query index; overlay and typeahead per the contract) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 11 row(s) — read-settings, settled-dom-snapshot, chrome-interaction, modal-loader, search-index-backed, media-as-url.
- **One owner decision batch:** 36 row(s) — inspect the XHR, add a vendor row · human-browser capture; never migrate blank · production backend (vendor form id + field mapping) · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host.
- **Already delivered by the capture pipeline:** 11 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** OneTrust · 0/5 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 23
- **detect** — 11
- **locale wave** — 9
- **interactive** — 6
- **capture** — 2
- **listings** — 2
- **embeds** — 2
- **register** — 2
- **forms** — 1
- **search** — 1
- **media** — 1
