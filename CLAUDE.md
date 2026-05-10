# Almanac Design — agent notes

This is the cross-medium design system lifted from SleeperChat. **Read `DESIGN.md` first.** It is the canonical spec and is written to be skim-able in one read.

## Source of truth

- Numerical tokens: `tokens/tokens.json`. Edit this file, then run `node scripts/generate.mjs` to refresh CSS / SCSS / Tailwind. Verify with `node scripts/generate.mjs --check`.
- Prose rules: `DESIGN.md`.
- SwiftUI implementation: lives in SleeperChat (`~/chat/frontend/SleeperChat/SleeperChat/Design/`); not generated here. See `components/swift/README.md` for the manual sync mapping.
- Visual ground truth: SleeperChat itself. See `references/README.md`.

## When applying the system

1. Pick the matching files for the target stack:
   - Vanilla CSS / HTML → `tokens/tokens.css` + `components/web/almanac.css`
   - Tailwind → `tokens/tailwind.preset.cjs`
   - SCSS → `tokens/tokens.scss`
   - Slides → copy `examples/slides/deck.html`
   - SwiftUI → port from SleeperChat by hand
2. Stay inside the v1 component set: OrbitalGlyph, Starfield, MonoLabel, SerifHeadline, SerifBody, SectionDivider, HeaderDivider, ChatColumn, StreamingCursor.
3. **Do not invent buttons, cards, modals, forms, or new accent colors.** If you need a button, use a `MonoLabel` with a hairline border. If you need a card, use a section with a hairline divider.
4. The five rules govern every choice: hairline-not-box, accent-only-at-attention, serif-body-always, stars-dark-only, no-chrome.

## When changing the system

If a real project requires a primitive that doesn't exist yet:

1. Add a "do / don't" pair to `examples/web/gallery.html` first.
2. Add the primitive to `components/web/almanac.css` and (if applicable) the SwiftUI design files in SleeperChat.
3. Update `DESIGN.md` § 6 (Components) and the do/don't table in § 8.
4. Run `node scripts/generate.mjs` if you touched `tokens/tokens.json`.
5. Commit and push.

## When changing tokens

1. Edit `tokens/tokens.json` (bump `version` if palette or type values change).
2. `node scripts/generate.mjs`
3. Mirror the change by hand in `~/chat/frontend/SleeperChat/SleeperChat/Design/AlmanacTheme.swift` if it's a value listed in the mapping table in `components/swift/README.md`.
4. Verify visually: open `examples/web/index.html`, `examples/web/gallery.html`, `examples/slides/deck.html`.

## What this repo intentionally does NOT contain

- npm package — not published; consumers vendor the files
- Figma library — file-based system only
- Storybook — `examples/web/gallery.html` plays that role
- A Slidev theme — deferred to v1.1; static HTML deck instead
- A Swift Package — deferred to v2

These were considered and dropped at v1 as over-engineering for a one-person workshop. Don't add them without a real second project demanding it.
