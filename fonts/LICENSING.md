# Font licensing — confirm before relying on aem.live

| File | Family | Foundry / source | Status |
|---|---|---|---|
| tide_type_light-webfont.woff2 | Tide 300 | P&G proprietary (captured from tide.com/fonts) | owner confirmation pending (register R-01) |
| tide_type_regular-webfont.woff2 | Tide 400 | P&G proprietary | owner confirmation pending (R-01) |
| tide_type_bold-webfont.woff2 | Tide 700 | P&G proprietary | owner confirmation pending (R-01) |
| tide_type_ultra-webfont.woff2 | Tide 800 | P&G proprietary | owner confirmation pending (R-01) |
| Poppins-Regular.woff2, poppins-v24-latin-ext-300/600.woff2 | Poppins | Indian Type Foundry, SIL OFL 1.1 | redistributable |
| fontawesome-webfont.woff2 | FontAwesome 4 | Fonticons, SIL OFL 1.1 | redistributable |

Remove path: delete the Tide `.woff2` files and their `@font-face` rules in
`styles/fonts.css`; every stack falls back to `tide-fallback` (Liberation Sans /
Arimo / Arial with Tide's metrics, declared in `styles/styles.css`).
