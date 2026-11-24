# Rollout report — https://tide.com/ → aem-eds (main--5db7d055--aemcoder)

```
rollout — tide.com → aem-eds
Pages       94 total · 94 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale
Templates   17 template groups (8 page types + 8 archetype singletons + redirect) — every group delivered n/n
Blocks      45 block directories live (14 distinct planned blocks + chrome, fragment and per-template blocks)
Quality     health 100/100 (seo 100 · ai 100 · xpage 100; a11y layer not assessed) · open P1 0 / P2 0 / P3 0
Pixel table prototypes 7/8 PASS at 1440 and 360 (click2cart: scroll-blocked capture, recorded residual, content 0/0)
            deployed 1440 93/94 PASS + 1 override (pixel-only 94/94) · 360 85/94 PASS + 8 overrides (pixel-only 86/94)
            — stardust/replica/gates/{prototypes,all}-<w>/summary.md
To deliver  none
Content     0 pages awaiting content track
```

Scope: the 100 selected pages of the site plan → 99 captured (one auth redirect), 5 delivered as
redirects, 94 delivered pages. Out-of-plan internal targets (336) link to the same path on tide.com
(direction.md § E2 decision). Site search hands off to https://tide.com/en-us/search.

Overrides (documented in the gate summaries): 360 — the 7 click2cart sibling pages and
/en-us/how-to-wash-clothes/how-to-do-laundry; 1440 — /en-us/how-to-wash-clothes/how-to-do-laundry.

Redirects sheet: 107 rows (root → /en-us, 4 source redirects, 6 upper-case paths, 94 trailing-slash
paths, /index.html). Served sitemap 93 (= 94 minus /health-probe, noindex on the source).

## Dynamic parity (aem.live: stardust/qa/dynamics-report.md 11/13; aem.page: stardust/qa/preview/dynamics-report.md 13/13)

| feature | status | result |
|---|---|---|
| header menus, drawer, locale menu | done | PASS (57 header links; no page errors on 8 archetype paths) |
| header search | interim — link-out to tide.com search (owner: move search to the new host) | PASS on aem.page; aem.live edge copy refresh pending at replay time |
| YouTube preview overlay + player | done | PASS (playback requests 16) |
| home Browse-by tiles modal | done | PASS on aem.page (dialog 560px, Escape closes); aem.live edge refresh pending at replay time |
| PLP sort / view / load more | done | PASS |
| home carousels | done | PASS |
| PriceSpider where-to-buy | interim — static buy links (owner: vendor account on the new host) | PASS |
| click2cart buy-now | interim — link-out to the retailer hand-off | PASS |
| P&G care hub (contact us) | interim — re-embedded as-is | PASS |
| martech (5 GTM containers + OneTrust) | scaffolded, every part disabled (owner turns parts on) | PASS — no tag host requested |

## Open owner decisions

- R-01: licence of the proprietary "Tide" web font on the new origin (register, deferred).
- Martech contract parts (tags, consent) — all carried over disabled: stardust/martech-handoff.md.
- Site search on the new host; PriceSpider account; click2cart stays external.
