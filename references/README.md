# References

The ground truth for the Almanac aesthetic is the **SleeperChat iOS app**:

- App source: `~/chat/frontend/SleeperChat/SleeperChat/`
- Design files (the source the system was lifted from):
  - `Design/AlmanacTheme.swift` — palette, type, spacing
  - `Design/AlmanacText.swift` — MonoLabel, SerifBody, SerifHeadline
  - `Design/SectionDivider.swift` — divider rules
  - `Design/OrbitalGlyph.swift` — the mark
  - `Design/AlmanacStarfield.swift` — the six-star field
- Views in use:
  - `Views/Chat/` — the YOU/AGENT serif column
  - `Views/Read/` — long-form serif reader
  - `Views/Log/` — almanac header + section list

## Screenshot capture (todo)

When petter has a few seconds with the app open, drop screenshots here as PNG:
- `references/screens/log-light.png`
- `references/screens/log-dark.png`
- `references/screens/chat-light.png`
- `references/screens/chat-dark.png`
- `references/screens/read-light.png`
- `references/screens/read-dark.png`

These will become the visual reference for any future change to the design system: if the screenshots stop matching what `examples/web/index.html` produces (palette, weight, measure, accent placement), one of the two has drifted.

## Audit checklist

When validating a change to the design system:

1. Open `examples/web/index.html` in light mode — does it feel like SleeperChat's Log tab?
2. Toggle dark — does the gradient + sparse stars + amber accent feel like SleeperChat at night?
3. Open `examples/web/gallery.html` — does every "do" pass? Does every "don't" feel obviously wrong?
4. Open `examples/slides/deck.html` — does it carry the same voice as the web pages?
5. Run `node scripts/generate.mjs --check` — does it exit clean?
