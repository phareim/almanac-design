# Slidev theme — placeholder (v1.1)

A markdown-driven Slidev theme is planned for v1.1. The reason it isn't shipped here in v1: a Slidev theme that hasn't been validated with `npx slidev` against a real deck is a foot-gun — the package layout is opinionated (`slidev-theme-*` naming, `theme.config.ts`, Vite-resolvable layout paths), and shipping one untested means it would break on first use.

Until then, **use the static HTML deck**: `examples/slides/deck.html`. It uses the same `tokens/tokens.css` + `components/web/almanac.css` and is a stable visual target for the eventual Slidev theme.

## v1.1 scope

A `slidev-theme-almanac` package (kept private — not published to npm unless petter wants that) shipping:

- `package.json` with `"slidev": { "themeColors": {...} }` config
- `styles/index.ts` importing `tokens/tokens.css` and `components/web/almanac.css`
- Layouts: `cover.vue`, `section.vue`, `default.vue` (mirroring the static deck slides 1, 2, 3)
- A `slides.md` example deck under `examples/slides/`

Acceptance: `npx slidev examples/slides/slides.md` renders the same visual as the static deck side by side.

## In the meantime

- Compose decks as HTML files copied from `examples/slides/deck.html`.
- Or use a plain Reveal.js deck and inject `tokens/tokens.css` + `components/web/almanac.css` — the class names will work as-is.
