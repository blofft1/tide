---
name: Tide
description: Tide (P&G) US laundry-detergent brand site — orange-and-navy color blocks, one proprietary type family, pill CTAs.
colors:
  tide-orange: "#fb4c06"
  tide-orange-hover: "#e24405"
  tide-navy: "#1b3392"
  tide-navy-hover: "#182e83"
  deep-navy: "#13259c"
  white: "#ffffff"
  chip-border: "#7481b4"
  border-subtle: "#c4c8e6"
  divider: "#e3e3e3"
  peach: "#ffb89c"
  link-default: "#0000ee"
typography:
  display:
    fontFamily: "Tide, sans-serif"
    fontSize: "68px"
    fontWeight: 400
    lineHeight: "64px"
    letterSpacing: "normal"
  headline:
    fontFamily: "Tide, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "52px"
    letterSpacing: "normal"
  title:
    fontFamily: "Tide, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "44px"
    letterSpacing: "normal"
  subtitle:
    fontFamily: "Tide, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: "38px"
    letterSpacing: "normal"
  heading-small:
    fontFamily: "Tide, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: "30px"
    letterSpacing: "normal"
  lead:
    fontFamily: "Tide, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "normal"
  body:
    fontFamily: "Tide, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "normal"
  small:
    fontFamily: "Tide, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "19.6px"
    letterSpacing: "normal"
  button:
    fontFamily: "Tide, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "22px"
    letterSpacing: "normal"
rounded:
  input: "12px"
  card: "8px"
  pill: "25px"
  circle: "50%"
spacing:
  xs: "5px"
  sm: "10px"
  md: "20px"
  lg: "30px"
  xl: "40px"
  2xl: "60px"
  3xl: "100px"
  gutter: "30px"
  container: "1170px"
components:
  button-primary:
    backgroundColor: "{colors.tide-orange}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "10px 30px"
  button-primary-hover:
    backgroundColor: "{colors.tide-orange-hover}"
  button-secondary:
    backgroundColor: "{colors.tide-navy}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "10px 30px"
  button-secondary-hover:
    backgroundColor: "{colors.tide-navy-hover}"
  chip-filter:
    backgroundColor: "{colors.white}"
    textColor: "{colors.tide-navy}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  chip-filter-hover:
    backgroundColor: "{colors.tide-navy}"
    textColor: "{colors.white}"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
  input-search:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.input}"
  header-search-bar:
    backgroundColor: "{colors.tide-orange}"
  header-main-nav:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.white}"
  article-title-band:
    backgroundColor: "{colors.tide-orange}"
    textColor: "{colors.white}"
    typography: "{typography.headline}"
  footer-social-band:
    backgroundColor: "{colors.tide-orange}"
    textColor: "{colors.white}"
    padding: "20px 0"
---

<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-23T19:45:00Z
mode: prep
role: current-state (descriptive)
readArtifacts:
  - stardust/current/_brand-extraction.json
  - stardust/current/_computed-styles.json (aggregate; 95 urls × 1440/360)
  - stardust/current/pages/*.json, *.html (99 captures, 93 canonical)
  - stardust/current/assets/css/0x8blnfnms9hr.css
synthesizedInputs: []
notes:
  - Token values are observed computed styles; hover values from census aggregate.hover.
  - Montserrat/Anton/IntroScriptDemo are declared @font-face families with no rendered use on captured tide.com pages; not tokenized.
  - extensions.breakpoints (cap-probe) not yet written.
-->

# Design System: Tide

## Overview

**Creative North Star: "The Detergent Box on the Shelf"**

The current tide.com reads like its packaging: saturated Tide orange (#fb4c06) and Tide navy (#1b3392 / #13259c) in large flat color blocks, white type knocked out of them, and one heavy proprietary typeface ("Tide", ultra 800) doing almost all the shouting. Pages are built from full-bleed bands stacked vertically — an orange search bar over a navy nav, an orange title band on articles, orange or navy feature bands on product listings, and an orange social band opening the footer.

Density is moderate and marketing-led on the home, collection and campaign pages (image carousels, big product shots, short exclamatory CTAs), and long-form and text-heavy on the 40+ research/how-to articles (orange title band, sticky jump links, FAQ accordion, citations). Surfaces are flat; depth is conveyed by color contrast between bands, not by shadow.

**Key Characteristics:**
- Two-color brand: orange for action and emphasis, navy for text and structure, white ground.
- Single proprietary family (Tide 300/400/700/800); headings almost always 800, mixed case.
- Pill buttons (25px radius, 20px bold) — orange primary, navy secondary.
- Full-bleed color bands; flat, shadowless surfaces; 8px card corners.
- Bootstrap grid: 1170px container (1140px content), 30px gutters, breakpoints 576/768/992/1200.

## Colors

A high-saturation orange/navy pair on white, with a few cool greys and lavenders for borders.

### Primary
- **Tide Orange** (#fb4c06): the largest painted area on the site — header search bar, article title bands, PLP feature bands, footer social band, primary pill buttons, and the most common heading color on white. Declared as `--color_orange`. Hover on orange buttons darkens to #e24405.

### Secondary
- **Tide Navy** (#1b3392): the most frequent text color (body copy, breadcrumbs, nav lists, chip text), secondary pill-button fill (hover #182e83) and blue full-bleed section grounds.
- **Deep Navy** (#13259c): header main-nav bar background, P&G top-bar text and hero h1 text; the computed match for the declared `--color_blue` (#00269a, ΔE 2.1).

### Tertiary
- **Peach** (#ffb89c): step-timeline progress marks and tinted backgrounds on how-to guides.

### Neutral
- **White** (#ffffff): page ground, header top bar, cards, text on orange/navy.
- **Chip Border** (#7481b4): 2px border on PLP filter chips.
- **Border Subtle** (#c4c8e6): dividers inside product listing cards.
- **Divider** (#e3e3e3): sticky jump-nav border, related-article dividers.
- **Link Default** (#0000ee): browser-default link blue that appears on unstyled rich-text links (latest-news, our-commitment pages); not a declared brand color.

**The Two-Ink Rule.** Brand surfaces are painted in orange or navy only; every other hue on the site is a border tint or belongs to an embedded third-party widget.

## Typography

**Display Font:** Tide (with sans-serif)
**Body Font:** Tide (with sans-serif)

**Character:** A single proprietary geometric sans carries the whole site; contrast comes from weight (ultra 800 headings against regular 400 body), not from a second family.

### Hierarchy
- **Display** (400, 68px, 64px): campaign and section-landing hero h1/h2 (e.g. washing-machine-101, collection heroes); light 300 at the same size appears on collection pages. 40px/48px at 360.
- **Headline** (800, 48px, 52px): the dominant h1/h2 — article title band h1, section h2s (235 h2s). 40px/44px at 360.
- **Title** (800, 40px, 44px): h3 in articles and landings. 32px/36px at 360.
- **Subtitle** (800, 32px, 38px): h4 and large lead paragraphs. 26px/30px at 360.
- **Heading small** (800, 26px, 30px): h5, guide step numbers, card titles. 22px/26px at 360.
- **Lead** (400 or 700, 20px, 26px): product/promo copy and button text size.
- **Body** (400, 16px, 24px): article and card body copy; 16px/20px at 360.
- **Small** (400, 14px, 19.6px): nav lists, top bar, chips; site root `body { font-size:14px; line-height:1.4 }`.

The scale is ad-hoc (48 → 40 → 32 → 26 → 20; ratios 1.2, 1.25, 1.23, 1.3). Headings are mixed case; no letter-spacing except small h5/h6 (0.6–0.75px).

## Layout

Bootstrap-style 12-column grid: `.container` max-width 1170px at ≥1200px (1140px content after 15px gutters), 100% below. Media queries cluster at 576, 768, 992 (by far the most rules), 1200, 1400 and 1920px. Spacing values are multiples of 5px (10, 20, 30, 15, 40, 25, 60, 50 are the most common paddings/margins). The header is 175px tall at 1440 (: white top bar + orange search bar + navy nav); pages stack full-bleed color bands with contained content inside. The footer adds 120px bottom padding at ≥768px.

## Elevation & Depth

Flat by default. Brand surfaces carry no box-shadow; separation comes from full-bleed color changes (white → orange → navy). The only first-party shadow is the sticky jump-link nav.

### Shadow Vocabulary
- **Sticky nav** (`box-shadow: rgba(0,0,0,0.2) 0px 2px 17px 0px`): `#sticky-nav` jump links on long articles once stuck.
- **Widget panel** (`box-shadow: rgba(0,0,0,0.4) 0px 6px 12px 0px`): click2cart retailer widget only (third party).

## Shapes

Two shape signatures: the 25px pill (buttons and filter chips — the most frequent non-zero radius, 622 elements) and the 8px card corner (largest radius by painted area — white boxes and preview cards). Inputs use 12px; carousel dots and arrows are circles (50%). The skip link is a tab with 0 0 5px 5px corners. Orange and navy bands are square-edged and full-bleed. The logo is a circular bullseye (71×71 viewBox).

## Components

### Buttons
- **Shape:** pill (25px).
- **Primary:** Tide Orange fill, white 20px/700 text, padding 10px 30px, no shadow ("try it now!", "Learn More", "Find Retailers").
- **Hover / Focus:** orange darkens to #e24405; a few home CTAs hover to navy #182e83.
- **Secondary:** Tide Navy fill, same metrics ("Check it out!"); hover #182e83.
- **Back to Top:** navy, 30px radius, 20px padding.

### Chips
- **Style:** white, 2px #7481b4 border, navy 14px/700 text, 25px radius, padding 2px 10px (PLP By Type/By Need filters).
- **State:** hover/selected fills navy with white text and navy border.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** white boxes over photography (section-landing hero card) or white preview cards with image on top.
- **Shadow Strategy:** none (see Elevation).
- **Border:** none; 1px #e3e3e3 dividers between related articles on mobile.
- **Internal Padding:** follows the 5px-multiple spacing.

### Inputs / Fields
- **Style:** white field, 12px radius (header search, contact form).

### Navigation
- **Header:** three stacked bars — white P&G family top bar (Contact Us · US - English · Sign in, #13259c 12–14px), orange search bar with burger + logo + search, deep-navy main bar with white items (Shop Products, Our Commitment, How to Wash Clothes, What’s New, Coupons and Deals) and a Shop Products mega menu (By Type / By Need / Top Collection).
- **Breadcrumb:** navy 19px/24px, ">" separators, bold current item.
- **Sticky jump links:** numbered section anchors under the article title band, white bar with #e3e3e3 border and soft shadow when stuck.

### Article Title Band (signature)
Full-width orange band with breadcrumb, white 48px/800 h1, intro paragraph and share icons (Facebook, Twitter, Pinterest, Email, Print); optional photo. Appears on 43 article-type pages.

### Footer (signature)
Orange social band ("Ways to connect with us:" + four icons), then a white mega footer with orange 800-weight column titles (accordions on mobile), a related-brands row, legal links and copyright.

## Do's and Don'ts

### Do:
- **Do** paint brand surfaces in Tide Orange (#fb4c06) or Navy (#1b3392 / #13259c) with white type.
- **Do** use the Tide family for everything; headings at weight 800, body at 400.
- **Do** keep CTAs as 25px pills, 20px bold, padding 10px 30px.
- **Do** keep surfaces flat and let full-bleed color bands create separation.

### Don't:
- **Don't** add drop shadows to cards or bands; the incumbent system has none outside the sticky nav.
- **Don't** introduce a second display family; the declared Montserrat, Anton and IntroScriptDemo faces are not rendered on any captured page.
