---
name: almanac-design
description: >
  Apply the Almanac design system (warm paper / midnight paper, scholarly
  serif body, hairline rules, sparse stars, one accent at the moment of
  attention). ONLY invoke when the user explicitly asks for "Almanac" design,
  the SleeperChat look, or this specific visual identity — e.g. "build a
  landing page in Almanac style", "use the Almanac design system", "match
  the SleeperChat aesthetic". Do NOT invoke for generic design requests
  or when another brand/style is named.
---

# Almanac design system

Cross-medium port of the SleeperChat iOS "Almanac" theme.

**Locating the repo.** This skill ships inside the `almanac-design` repo at `.claude/skills/almanac-design/SKILL.md`. The repo root is typically `~/github/almanac-design/` on petter's machines. If you need the path programmatically: `readlink -f ~/.claude/skills/almanac-design` and strip the trailing `.claude/skills/almanac-design`. All file references below are paths inside that repo unless noted.

Canonical spec: `DESIGN.md`.

## Cheat sheet (apply without reading DESIGN.md for trivial cases)

**Five rules:**
1. Hairline, not box (1px rule, never card-shadow, never border-radius)
2. Accent only at attention (one rust-or-amber moment per screen)
3. Serif body always (Source Serif 4 → Georgia → Iowan Old Style → Charter; never sans for prose)
4. Stars dark-mode only, sparse, static (six hand-placed dots, no animation)
5. No chrome (no gradients beyond night sky, no shadows, no rounded buttons, no multi-accent)

**Palette (light):** paper `#f4f0e8`, ink `#1a1a1a`, mute `#6a6a6a`, rust `#c14a2a`, rule `#d8d2c4`.

**Palette (dark):** gradient `#161b24` → `#0e1219`, ink `#ebe4d4`, mute `#7a8a9a`, amber `#d4a574` (with `text-shadow 0 0 4px rgba(212,165,116,0.25)` on labels and the glyph dot), rule `rgba(255,255,255,0.10)`.

**Type:** Source Serif 4 (or Georgia fallback). Headline 26px (line 1.20, tracking -0.012em). Body 14px (line 1.55, max-width 65ch). Italic 13px. MonoLabel: 9px SF Mono uppercase tracked 0.16em.

**Space:** gutter 22px, sectionGap 14px, hairline 1px.

**v1 components:** OrbitalGlyph, Starfield (dark only), MonoLabel, SerifHeadline, SerifBody, SectionDivider, HeaderDivider, ChatColumn (YOU/AGENT pattern), StreamingCursor (2px accent, 1Hz blink). **NO buttons / cards / inputs / modals / forms** — use a MonoLabel with a hairline border for action affordances; sections use hairline dividers, not cards.

## Picking the artifact for the target stack

| Target | Files to use (paths inside this repo) |
|---|---|
| Vanilla HTML/CSS | `tokens/tokens.css` + `components/web/almanac.css` + `components/web/{OrbitalGlyph,Starfield}.svg` |
| Tailwind | `tokens/tailwind.preset.cjs` + class names from `components/web/almanac.css` |
| SCSS | `tokens/tokens.scss` |
| Slides | Copy `examples/slides/deck.html`, edit slides in place |
| SwiftUI | Port the five files from `~/chat/frontend/SleeperChat/SleeperChat/Design/` by hand. See `components/swift/README.md` for the token mapping. |

## Web boilerplate

```html
<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/almanac-design/tokens/tokens.css">
  <link rel="stylesheet" href="/almanac-design/components/web/almanac.css">
</head>
<body class="almanac-page">
  <div class="almanac-starfield" aria-hidden="true">
    <object type="image/svg+xml" data="/almanac-design/components/web/Starfield.svg"></object>
  </div>
  <main class="almanac-prose">
    <span class="almanac-monolabel">— Section</span>
    <h1 class="almanac-headline">Title</h1>
    <hr class="almanac-header-divider">
    <p class="almanac-body">Prose.</p>
  </main>
</body>
</html>
```

Adjust the relative paths to where you've vendored the design system.

## Worked example: the YOU/AGENT chat column

```html
<div class="almanac-chat">
  <div class="almanac-chat-turn almanac-chat-turn--you">
    <span class="speaker almanac-monolabel">— YOU</span>
    <p class="body">A question.</p>
  </div>
  <div class="almanac-chat-turn almanac-chat-turn--agent">
    <span class="speaker almanac-monolabel">— AGENT</span>
    <p class="body">An answer.<span class="almanac-cursor"></span></p>
  </div>
</div>
```

## When in doubt

- Read `DESIGN.md` (in this repo).
- Check `examples/web/gallery.html` for do/don't pairs.
- The visual ground truth is the SleeperChat iOS app at `~/chat/frontend/SleeperChat/` (Sleeper-only — not present on other machines).
- Don't invent new accent colors. Don't add card shadows. Don't change the body typeface to sans.

## When applying via vendoring

If the consuming repo can't reach this repo at runtime (any deployed web app), copy the relevant files into the project. Run from the consuming repo, with `$ALMANAC` pointing at this repo's root:

```bash
ALMANAC=~/github/almanac-design   # or wherever you cloned almanac-design
mkdir -p <repo>/public/almanac
cp -r "$ALMANAC/tokens"         <repo>/public/almanac/
cp -r "$ALMANAC/components/web" <repo>/public/almanac/components-web
cp -r "$ALMANAC/assets"         <repo>/public/almanac/
```

Then point the `<link>` tags at `/almanac/tokens/tokens.css` and `/almanac/components-web/almanac.css`.
