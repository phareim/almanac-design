# Almanac Design

A small, opinionated design system. Warm paper / midnight paper, scholarly serif body, hairline rules, sparse stars, one accent at the moment of attention.

Lifted from the [SleeperChat iOS app](https://github.com/phareim/sleeper-chat) and ported so the same voice carries to web, slides, and any new native UI.

```
almanac-design/
├── DESIGN.md            ← read this first
├── tokens/              ← tokens.json (canonical) + generated CSS / SCSS / Tailwind
├── components/web/      ← almanac.css + OrbitalGlyph.svg + Starfield.svg + demo
├── components/slidev/   ← (placeholder, v1.1)
├── components/swift/    ← port guide (live SwiftUI files in SleeperChat)
├── examples/web/        ← index.html (landing) + gallery.html (do / don't)
├── examples/slides/     ← deck.html (16:9 static deck)
├── assets/fonts/        ← Source Serif 4 (SIL OFL)
├── scripts/generate.mjs ← tokens.json → CSS / SCSS / Tailwind
└── references/          ← audit checklist + screenshot capture todo
```

Quick start (web):

```html
<link rel="stylesheet" href="/almanac-design/tokens/tokens.css">
<link rel="stylesheet" href="/almanac-design/components/web/almanac.css">
<body class="almanac-page">
  <main class="almanac-prose">
    <span class="almanac-monolabel">— Section</span>
    <h1 class="almanac-headline">Title</h1>
    <hr class="almanac-header-divider">
    <p class="almanac-body">Prose.</p>
  </main>
</body>
```

Toggle dark with `data-theme="dark"` on `<html>`.

Read [`DESIGN.md`](./DESIGN.md) for the full spec. Open [`examples/web/index.html`](./examples/web/index.html) and [`examples/web/gallery.html`](./examples/web/gallery.html) for the visual reference. The `almanac-design` Claude skill (in this server's `~/.claude/skills/`) lets the agent apply the system without reading the spec every time.
