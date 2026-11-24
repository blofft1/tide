# Dynamics parity check — https://main--5db7d055--aemcoder.aem.live — 2026-11-24T12:25:54.988Z

Replayed 13 checks over 10 features · pass 11 · fail 2. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header menus, mobile drawer, locale menu | M | done | dom-count | PASS | 57 × header a[href] (min 40) |  |
| header menus, mobile drawer, locale menu | M | done | no-page-errors | PASS | none on 8 page(s) |  |
| header search | S | interim | dom-count | FAIL | 0 × header form[action='https://tide.com/en-us/search'] input[name='q'] (min 1) |  |
| YouTube preview overlay + player | M/V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 16 (ok) | www.youtube.com:200×11 fonts.gstatic.com:200×3 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 rr2---sn-ojn4v5-5q.googlevideo.com:200×1 i.ytimg.com:200×4 yt3.ggpht.com:200×2 www.gstatic.com:200×1 www.youtube.com:204×5 rr4---sn-2on4v5-5a.googlevideo.com:200×2 |
| home Browse-by tiles open a modal list | M | done | click-dialog | FAIL | dialog 0px · heading "" · 0 fields · Escape closes: false |  |
| product-listing sort, grid/list toggle, load more | CR | done | dom-count | PASS | 1 × .product-grid select (min 1) |  |
| product-listing sort, grid/list toggle, load more | CR | done | dom-count | PASS | 1 × .product-grid-more (min 1) |  |
| home promo carousel and stain-guide rail | M | done | dom-count | PASS | 1 × .home-promo-carousel .hpc-arrow-next (min 1) |  |
| home promo carousel and stain-guide rail | M | done | dom-count | PASS | 1 × .stain-guide-widget .sg-arrow-down (min 1) |  |
| PriceSpider where-to-buy widget | T | interim | dom-count | PASS | 52 × .product-grid a[href] (min 5) |  |
| click2cart buy-now cart | X | interim | dom-count | PASS | 1 × main a[href*='smartcommerce.com'] (min 1) |  |
| P&G consumer-support care hub (contact us) | CR/F | interim | dom-count | PASS | 1 × .embed-frame iframe.embed-frame-iframe (min 1) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (2 gated · 0 cross-site host(s) blocked) |  |

## Features without checks
