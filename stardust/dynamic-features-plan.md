# Dynamic features plan — tide.com

Phases follow `stardust/dynamic-features.md`. Static first, then wire; each phase ends verified
on the published origin at 1440 and 360.

| phase | deliverables | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| D1 chrome | header menus, mobile drawer, locale links, search box (rows 1, 2, 15) | nav document; search box is a widget | chrome-compare / header contract | locale scope | foundation |
| D2 media + modals | YouTube preview overlay, modal card (rows 3, 4) | player URL as a link in the block | dynamics-check modal + video | none | small |
| D3 embeds + link-outs | PriceSpider buttons, click2cart links, contact-us support embed, sign-in links (rows 7–9, 11) | links/embeds authored in the document | link + embed presence | PriceSpider id, embed URL | small |
| D4 form | newsletter sign-up, local capture with "no backend connected" (row 10) | form widget | dynamics-check form | Pardot backend | small |
| D5 martech | scripts/martech.js scaffolded, every part disabled (rows 5, 6) | stardust/martech-contract.json | dynamics-check martech feature | tags + CMP on the new host | done (scaffold) |
