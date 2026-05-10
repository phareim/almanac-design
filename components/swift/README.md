# Swift port — `AlmanacTheme.swift`

The canonical SwiftUI implementation lives in the **SleeperChat** repo, not here:

- `~/chat/frontend/SleeperChat/SleeperChat/Design/AlmanacTheme.swift`
- `~/chat/frontend/SleeperChat/SleeperChat/Design/AlmanacText.swift`
- `~/chat/frontend/SleeperChat/SleeperChat/Design/SectionDivider.swift`
- `~/chat/frontend/SleeperChat/SleeperChat/Design/OrbitalGlyph.swift`
- `~/chat/frontend/SleeperChat/SleeperChat/Design/AlmanacStarfield.swift`

## Why this isn't generated from `tokens/tokens.json`

The Swift implementation carries shape that doesn't fit a flat token JSON:

- `AlmanacResolver` — the per-scheme palette resolver
- `EnvironmentValues.almanac` — SwiftUI environment value extension
- `serifBody(_:)` / `serifHeadline(_:)` / `serifItalic(_:)` — functions taking a size with `relativeTo:` Dynamic Type bridges
- `nightRule = white.opacity(0.10)` — derived from a non-color literal

A naive token→Swift generator strips all of it. Until we have a second SwiftUI app that actually consumes the tokens (at which point a partial generator becomes worth it), the Swift side stays **hand-maintained**.

## When the tokens change

If you edit `tokens/tokens.json`, mirror the change in `AlmanacTheme.swift` by hand. The tokens that map directly:

| `tokens.json` path | `AlmanacTheme.swift` symbol |
|---|---|
| `palette.light.paper` | `paper` |
| `palette.light.ink` | `ink` |
| `palette.light.mute` | `mute` |
| `palette.light.rust` | `rust` |
| `palette.light.rule` | `rule` |
| `palette.dark.nightTop` | `nightTop` |
| `palette.dark.nightBottom` | `nightBottom` |
| `palette.dark.nightInk` | `nightInk` |
| `palette.dark.nightMute` | `nightMute` |
| `palette.dark.amber` | `amber` |
| `palette.dark.nightRule` | `nightRule` (Color.white.opacity(0.10)) |
| `space.gutter` | `gutter` |
| `space.sectionGap` | `sectionGap` |

Type families and numeric sizes are passed as function parameters (`serifBody(14)`) rather than constants. The `AlmanacText` views (`MonoLabel`, `SerifBody`, `SerifHeadline`) carry the tracking and line-spacing logic — keep them aligned with the tracking and line-height values in `tokens.json`.

## v2 plan

If a second SwiftUI app wants to consume the design system without copying the files: extract the four Design files into a small Swift Package living in this repo (`components/swift/Package.swift`), and have SleeperChat depend on it. At that point token regen-into-Swift becomes worth it.
