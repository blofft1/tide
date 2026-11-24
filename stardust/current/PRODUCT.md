<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-23T19:05:00Z
mode: prep
readArtifacts:
  - stardust/current/pages/*.json (99 live Playwright captures)
  - stardust/current/_crawl-log.json
  - stardust/current/_computed-styles.json
-->

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — from the captured navigation (Shop Products, How to Wash Clothes, Our Commitment, Rewards) and page copy._

US households who do laundry: shoppers choosing a Tide detergent by type (pods, liquid, powder, tiles, boosters) or by need (stain removal, sensitive skin, whiteness, odor, freshness, deep clean); people looking up how to wash a fabric or remove a specific stain; readers evaluating detergent safety, value and environmental claims; Tide Rewards members.

## Product Purpose

tide.com is the US brand site for Tide laundry detergent (part of the P&G family). It presents the product range, routes buyers to retailers ("Find Retailers", click2cart retailer pickers), publishes laundry how-to and stain-removal guides, publishes long-form research articles on safety, value and sustainability, and hosts the Tide Rewards loyalty program.

## Positioning

Captured claims: "America's #1 Detergent", the Tide evo launch ("new Tide evo", "6x concentrated layers"), "Less Work, Better Clean*", POWER PODS® ("Bigger PODS® means a better clean in every load"), and science-backed safety content under /en-us/research.

## Capabilities and Constraints

- Retail is off-site: product tiles link to retailer pickers (click2cart widget pages); there is no on-site checkout.
- Site search (header search form), language selector (US - English), sign-in to Tide Rewards on account.tide.com.
- Rewards/loyalty routes (/en-us/loyalty) redirect to the account.tide.com login.
- Accessibility statement links off-site to accessibility.pg.com.
- Analytics, tag management and consent (OneTrust) run on the source; carried over per the owner's decision, every part disabled until the owner turns it on.

## Brand Commitments

- Register: `brand` (marketing and product site).
- Name and marks: Tide, Tide PODS®, POWER PODS®, Tide evo, Tide Simply, Tide Free & Gentle, Tide Plus Febreze, Tide Ultra OXI; "Part of the P&G Family" band with P&G, Downy and Bounce links.
- Proprietary "Tide" typeface (light/regular/bold/ultra) with Montserrat and Anton as secondary faces.
- Signature palette: Tide orange, Tide blue and the bullseye yellow from the logo.
- Voice: upbeat, direct, exclamatory CTAs ("try it now!", "Check it out!"), practical how-to tone in guides, measured scientific tone in research articles.

## Evidence on Hand

- `stardust/current/pages/<slug>.json` + `.html` — 99 captured pages (verbatim copy, CTAs, media inventory).
- `stardust/current/assets/screenshots/` — full-page 1440 captures.
- `stardust/current/assets/fonts/` — the eleven self-hosted woff2 faces; `assets/css/` — the four source stylesheets.
- `stardust/current/assets/logo.svg`, `favicon.ico`, `apple-touch-icon.png`.
- No testimonials or reviews captured as page content.

## Product Principles

_provenance: inferred — from the site's structure._

1. Help people pick the right Tide for their load and their need.
2. Teach laundry: stains, fabrics, machines, step by step.
3. Back claims with science and transparency on ingredients and safety.
4. Send buyers to their retailer of choice quickly.

## Accessibility & Inclusion

The source publishes a P&G accessibility statement (off-site). Skip-to-content link present in the header.
