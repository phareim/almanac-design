# Almanac · DESIGN.md

A small, opinionated design system. Lifted from the SleeperChat iOS app's "Almanac" theme; ported so the same voice carries to web, slides, and any new native UI.

This file is the canonical spec — read it once and you can apply the system anywhere. Numerical tokens live in `tokens/tokens.json` (canonical) and are mirrored to `tokens/tokens.css`, `tokens/tokens.scss`, and `tokens/tailwind.preset.cjs` by `scripts/generate.mjs`. The Swift implementation lives in the SleeperChat repo and is hand-maintained — see `components/swift/README.md`.

## 1 · Identity

The Almanac is a quiet object: warm paper in daylight, midnight paper after dark, scholarly serif body, sparse celestial marks, hairline rules between sections. No chrome. The accent appears once per moment of attention, and not at all otherwise.

If your page feels like a SaaS dashboard, you're not in the system. If it feels like the inside cover of a slim, well-set book, you are.

## 2 · The five rules

These are the rules that make the taste survive translation. Break them and the system stops being a system.

1. **Hairline, not box.** Sections separate by a 1-px rule, not a card with a border or a shadow. There are no boxed cards in this system.
2. **Accent only at attention.** One rust (light) or amber (dark) moment per screen — a MonoLabel, a glyph dot, a streaming cursor. Never decorative, never repeated.
3. **Serif body always.** Body text is Source Serif 4 (with Georgia / Iowan Old Style / Charter as fallbacks). Never sans-serif for prose. Mono is reserved for tracked uppercase MonoLabels.
4. **Stars dark-mode only, sparse, static.** Six hand-placed dots on the night-paper gradient, no animation. Never in light mode, never as a particle field.
5. **No chrome.** No gradients beyond the night sky background. No drop shadows except the dark-mode amber glow. No rounded buttons. No multi-accent palettes. No animation beyond the streaming cursor.

The negative version of each rule lives in `examples/web/gallery.html` as a side-by-side. If you want to argue against a rule, render the alternative there first.

## 3 · Palette

| Role | Light | Dark |
|---|---|---|
| Background | `#f4f0e8` (paper) | `#161b24` → `#0e1219` (linear gradient, top→bottom; "nightTop" → "nightBottom") |
| Foreground | `#1a1a1a` (ink) | `#ebe4d4` (nightInk) |
| Muted foreground | `#6a6a6a` (mute) | `#7a8a9a` (nightMute) |
| Accent | `#c14a2a` (rust) | `#d4a574` (amber) |
| Hairline rule | `#d8d2c4` (rule) | `rgba(255,255,255,0.10)` (nightRule) |
| Header rule | `#1a1a1a` (ink) | `rgba(235,228,212,0.18)` (nightHeaderRule) |

Dark-mode amber labels and the orbital glyph dot carry a soft glow: `text-shadow: 0 0 4px rgba(212,165,116,0.25)` (or its `filter: drop-shadow` equivalent on SVG).

## 4 · Type

- Serif: **Source Serif 4** (variable, SIL OFL — shipped at `assets/fonts/`). Fallback chain: `"Source Serif 4", Georgia, "Iowan Old Style", Charter, serif`.
- Mono: **system stack only** — `"SF Mono", ui-monospace, Menlo, Consolas, monospace`. Mono is tiny (9px tracked uppercase) so the OS fallback is reliable.

| Style | Size | Line-height | Tracking | Use |
|---|---|---|---|---|
| Headline | 26 px | 1.20 | -0.012em | Page titles, section headers |
| Body | 14 px | 1.55 | normal | All prose |
| Italic | 13 px | 1.55 | normal | Asides, quiet notes, "you" turns in chat |
| MonoLabel | 9 px | normal | 0.16em uppercase | Section labels, speaker tags ("— YOU"), buttons |

**Measure: 65ch** for serif body. When prose runs wider than ~70 characters per line, constrain it: wrap a parent with `.almanac-prose`, or set `max-width: var(--almanac-measure)` directly.

## 5 · Space

- `gutter: 22px` — page margins.
- `sectionGap: 14px` — vertical rhythm between sibling sections (× 1.5 between conversation turns).
- `hairline: 1px` — every divider, every rule, every border (when one is unavoidable).

## 6 · Components (v1)

The v1 component set is intentionally small. If you find yourself wanting a button, a card, a modal — first try the closest existing primitive:

| Component | Web class | Swift symbol | Use |
|---|---|---|---|
| **OrbitalGlyph** | `.almanac-glyph` (use `OrbitalGlyph.svg` inside) | `OrbitalGlyph` | The mark. One per page. Reserve 38 units of layout (visual bleeds past) or 56×40 (no bleed). |
| **Starfield** | `.almanac-starfield` (use `Starfield.svg` inside) | `AlmanacStarfield` | Six dots, dark mode only. Position absolute, `z-index: 0`. |
| **MonoLabel** | `.almanac-monolabel` | `MonoLabel` | Tracked uppercase; speaker tags, section headers, buttons. The accent moment. |
| **SerifHeadline** | `.almanac-headline` | `SerifHeadline` | 26 px serif page title. |
| **SerifBody** | `.almanac-body` | `SerifBody` | 14 px serif prose. Use inside `.almanac-prose` for measure. |
| **SectionDivider** | `.almanac-divider` | `SectionDivider` | Hairline between sections. |
| **HeaderDivider** | `.almanac-header-divider` | `HeaderDivider` | Heavier rule under page titles. |
| **ChatColumn** | `.almanac-chat` + `.almanac-chat-turn--{you,agent}` | `ChatView`-style usage | Serif column dialogue. No bubbles. |
| **StreamingCursor** | `.almanac-cursor` | (inline `Rectangle`) | 2px accent rect, 1Hz blink. Honors `prefers-reduced-motion`. |

**Out of scope, v1:** buttons (use `.almanac-monolabel` with a hairline border or plain text), inputs, cards, modals, forms, navigation bars, tab bars. These dilute the aesthetic and aren't needed yet. Add them only when a real project demands them, and add the gallery entry first.

## 7 · Per-medium guidance

### Web

```html
<link rel="stylesheet" href="/almanac-design/tokens/tokens.css">
<link rel="stylesheet" href="/almanac-design/components/web/almanac.css">
<body class="almanac-page">
  <div class="almanac-starfield" aria-hidden="true">
    <object type="image/svg+xml" data="/almanac-design/components/web/Starfield.svg"></object>
  </div>
  <main class="almanac-prose">
    <span class="almanac-monolabel">— Section</span>
    <h1 class="almanac-headline">Title</h1>
    <hr class="almanac-header-divider">
    <p class="almanac-body">Prose…</p>
  </main>
</body>
```

Toggle dark mode by setting `data-theme="dark"` (or class `dark`) on `<html>`. Without an explicit toggle the page follows `prefers-color-scheme`.

For Tailwind, import `tokens/tailwind.preset.cjs` and use the `almanac-*` color/font/spacing utilities.

### Slides

v1: copy `examples/slides/deck.html` and edit slides in place. Same tokens + `almanac.css`. Aspect 16:9, navigate with ←/→/Space.

v1.1 will add a Slidev theme that emits the same visual output from a Markdown deck — see `components/slidev/README.md` for the deferred plan.

### Native (SwiftUI)

The Almanac is already implemented in SleeperChat. To use it in another app:

1. Copy the Design folder from `~/chat/frontend/SleeperChat/SleeperChat/Design/` into the new app.
2. Inject the resolver: `RootView { … }.environment(\.almanac, AlmanacResolver(scheme: colorScheme))`.
3. Use `MonoLabel`, `SerifBody`, `SerifHeadline`, `SectionDivider`, `OrbitalGlyph`, `AlmanacStarfield`.

If you change a token in `tokens/tokens.json`, mirror it by hand in `AlmanacTheme.swift` (see `components/swift/README.md` for the mapping table). v2 will package the Swift side as a SwiftPM module.

## 8 · Do / Don't

The rendered gallery at `examples/web/gallery.html` is the source of truth for this section. Quick form:

| Do | Don't |
|---|---|
| Hairline rule between sections | Card with border-radius + shadow |
| One MonoLabel accent per moment | Multiple accent colors on a page |
| Source Serif 4 / Georgia for body | `-apple-system` / system-ui sans for body |
| 6 static stars, dark mode only | 300-particle drifting field in light mode |
| `max-width: 65ch` on prose | Edge-to-edge body lines |
| Plain-text or mono-label "buttons" | Glossy filled buttons with shadow |
| Streaming cursor 2px rect, 1Hz blink | Spinning dots, progress bars, toast pop-ups |
| Accent dot on the orbital glyph | Accent on every heading |

## 9 · Working with Claude

A Claude skill is installed at `~/.claude/skills/almanac-design/` (symlinked from `~/github/sleeper/claude/skills/almanac-design/`). It tells the agent:

1. Read `~/github/almanac-design/DESIGN.md` once when applying the system.
2. Pick the matching token file by target stack:
   - Vanilla CSS / HTML → `tokens/tokens.css` + `components/web/almanac.css`
   - Tailwind → `tokens/tailwind.preset.cjs`
   - SCSS → `tokens/tokens.scss`
   - SwiftUI → port from SleeperChat (see `components/swift/README.md`)
3. Drop in the matching SVGs from `components/web/`.
4. Stay inside the v1 component set. If a button or card seems necessary, prefer a `MonoLabel` with a hairline border — and add a gallery entry for the new pattern.

The skill triggers on **almanac**, **scholarly**, **warm paper**, **petter's design system / phareim style**, and on generic prompts like "make a landing page" or "build a slide deck" when no other style is specified.

## 10 · Maintenance

- Source of truth for tokens: `tokens/tokens.json`. Bump `version` when palette or type values change.
- Regenerate after any edit: `node scripts/generate.mjs`. Verify with `node scripts/generate.mjs --check` (exits non-zero if drifted).
- The Swift file is hand-maintained. The mapping table is in `components/swift/README.md`.
- The SleeperChat repo (`~/chat/frontend/SleeperChat/`) is the visual ground truth — changes to the design system should match what the iOS app actually does. See `references/README.md` for the audit checklist.

## 11 · Versioning

This is **v1.0**. v1.1 plans a Slidev theme. v2 plans a SwiftPM module + a generated Swift token mirror. Anything beyond that needs a new use case to justify it.
