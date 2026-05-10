#!/usr/bin/env node
// generate.mjs — derive CSS, SCSS, and a Tailwind preset from tokens/tokens.json.
// Pure Node, no dependencies.
//
// Usage:
//   node scripts/generate.mjs            # write generated files
//   node scripts/generate.mjs --check    # verify generated files match (exit 1 if drifted)
//
// Source of truth: tokens/tokens.json. Do NOT hand-edit the generated files.
// The Swift file (components/swift/) is hand-maintained — see components/swift/README.md.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensPath = join(root, "tokens", "tokens.json");
const outputs = {
  css:     join(root, "tokens", "tokens.css"),
  scss:    join(root, "tokens", "tokens.scss"),
  tailwind: join(root, "tokens", "tailwind.preset.cjs"),
};

const HEADER = (kind) =>
  `/* GENERATED FROM tokens/tokens.json — DO NOT HAND-EDIT.\n   Run \`node scripts/generate.mjs\` to refresh. (${kind}) */\n`;

function buildCSS(t) {
  const L = t.palette.light;
  const D = t.palette.dark;
  const fontFaceBlock = [
    "@font-face {",
    "  font-family: 'Source Serif 4';",
    "  src: url('../assets/fonts/source-serif-4-variable.woff2') format('woff2-variations');",
    "  font-weight: 200 900;",
    "  font-style: normal;",
    "  font-display: swap;",
    "}",
    "@font-face {",
    "  font-family: 'Source Serif 4';",
    "  src: url('../assets/fonts/source-serif-4-italic-variable.woff2') format('woff2-variations');",
    "  font-weight: 200 900;",
    "  font-style: italic;",
    "  font-display: swap;",
    "}",
  ].join("\n");
  const root = [
    `:root {`,
    `  /* light palette */`,
    `  --almanac-paper:        ${L.paper};`,
    `  --almanac-ink:          ${L.ink};`,
    `  --almanac-mute:         ${L.mute};`,
    `  --almanac-rust:         ${L.rust};`,
    `  --almanac-rule:         ${L.rule};`,
    ``,
    `  --almanac-bg:           var(--almanac-paper);`,
    `  --almanac-fg:           var(--almanac-ink);`,
    `  --almanac-fg-mute:      var(--almanac-mute);`,
    `  --almanac-accent:       var(--almanac-rust);`,
    `  --almanac-rule-line:    var(--almanac-rule);`,
    `  --almanac-header-rule:  var(--almanac-ink);`,
    `  --almanac-glow:         transparent;`,
    `  --almanac-night-top:    ${D.nightTop};`,
    `  --almanac-night-bottom: ${D.nightBottom};`,
    ``,
    `  /* type */`,
    `  --almanac-serif:        ${t.type.serif};`,
    `  --almanac-mono:         ${t.type.mono};`,
    `  --almanac-size-headline: ${t.type.sizes.headline}px;`,
    `  --almanac-size-body:     ${t.type.sizes.body}px;`,
    `  --almanac-size-italic:   ${t.type.sizes.italic}px;`,
    `  --almanac-size-monolabel: ${t.type.sizes.monoLabel}px;`,
    `  --almanac-line-headline: ${t.type.lineHeight.headline};`,
    `  --almanac-line-body:     ${t.type.lineHeight.body};`,
    `  --almanac-track-monolabel: ${t.type.tracking.monoLabel};`,
    `  --almanac-track-headline:  ${t.type.tracking.headline};`,
    `  --almanac-measure:        ${t.type.measureCh}ch;`,
    ``,
    `  /* space */`,
    `  --almanac-gutter:      ${t.space.gutter}px;`,
    `  --almanac-section-gap: ${t.space.sectionGap}px;`,
    `  --almanac-hairline:    ${t.space.hairline}px;`,
    ``,
    `  /* motion */`,
    `  --almanac-cursor-blink: ${1 / t.motion.cursorBlinkHz}s;`,
    `}`,
  ].join("\n");

  const darkVars = [
    `  --almanac-bg:           var(--almanac-night-bottom);`,
    `  --almanac-fg:           ${D.nightInk};`,
    `  --almanac-fg-mute:      ${D.nightMute};`,
    `  --almanac-accent:       ${D.amber};`,
    `  --almanac-rule-line:    ${D.nightRule};`,
    `  --almanac-header-rule:  ${D.nightHeaderRule};`,
    `  --almanac-glow:         ${t.glow.amber.color};`,
  ].join("\n");
  const dark = [
    `/* Explicit dark via class or [data-theme="dark"] (preferred for SSR / manual toggles). */`,
    `:root.dark, :root[data-theme="dark"] {`,
    darkVars,
    `}`,
    ``,
    `/* OS-level preference, when no explicit toggle is set. */`,
    `@media (prefers-color-scheme: dark) {`,
    `  :root:not(.light):not([data-theme="light"]) {`,
    darkVars.split("\n").map(l => `  ${l}`).join("\n"),
    `  }`,
    `}`,
  ].join("\n");

  return [HEADER("CSS custom properties"), fontFaceBlock, "", root, "", dark, ""].join("\n");
}

function buildSCSS(t) {
  const L = t.palette.light;
  const D = t.palette.dark;
  const lines = [
    HEADER("SCSS variables"),
    `// Light palette`,
    `$almanac-paper:  ${L.paper};`,
    `$almanac-ink:    ${L.ink};`,
    `$almanac-mute:   ${L.mute};`,
    `$almanac-rust:   ${L.rust};`,
    `$almanac-rule:   ${L.rule};`,
    ``,
    `// Dark palette`,
    `$almanac-night-top:    ${D.nightTop};`,
    `$almanac-night-bottom: ${D.nightBottom};`,
    `$almanac-night-ink:    ${D.nightInk};`,
    `$almanac-night-mute:   ${D.nightMute};`,
    `$almanac-amber:        ${D.amber};`,
    `$almanac-night-rule:   ${D.nightRule};`,
    `$almanac-night-header-rule: ${D.nightHeaderRule};`,
    ``,
    `// Type`,
    `$almanac-serif: ${t.type.serif};`,
    `$almanac-mono:  ${t.type.mono};`,
    `$almanac-size-headline: ${t.type.sizes.headline}px;`,
    `$almanac-size-body:     ${t.type.sizes.body}px;`,
    `$almanac-size-italic:   ${t.type.sizes.italic}px;`,
    `$almanac-size-monolabel: ${t.type.sizes.monoLabel}px;`,
    `$almanac-line-headline: ${t.type.lineHeight.headline};`,
    `$almanac-line-body:     ${t.type.lineHeight.body};`,
    `$almanac-track-monolabel: ${t.type.tracking.monoLabel};`,
    `$almanac-track-headline:  ${t.type.tracking.headline};`,
    `$almanac-measure-ch:      ${t.type.measureCh};`,
    ``,
    `// Space`,
    `$almanac-gutter:      ${t.space.gutter}px;`,
    `$almanac-section-gap: ${t.space.sectionGap}px;`,
    `$almanac-hairline:    ${t.space.hairline}px;`,
    ``,
    `// Glow (dark mode amber)`,
    `$almanac-glow-color:  ${t.glow.amber.color};`,
    `$almanac-glow-radius: ${t.glow.amber.radius}px;`,
    ``,
  ];
  return lines.join("\n");
}

function buildTailwind(t) {
  const L = t.palette.light;
  const D = t.palette.dark;
  return [
    HEADER("Tailwind preset (CommonJS)"),
    `module.exports = {`,
    `  theme: {`,
    `    extend: {`,
    `      colors: {`,
    `        almanac: {`,
    `          paper:  '${L.paper}',`,
    `          ink:    '${L.ink}',`,
    `          mute:   '${L.mute}',`,
    `          rust:   '${L.rust}',`,
    `          rule:   '${L.rule}',`,
    `          'night-top':    '${D.nightTop}',`,
    `          'night-bottom': '${D.nightBottom}',`,
    `          'night-ink':    '${D.nightInk}',`,
    `          'night-mute':   '${D.nightMute}',`,
    `          amber:          '${D.amber}',`,
    `        },`,
    `      },`,
    `      fontFamily: {`,
    `        'almanac-serif': [${t.type.serif.split(",").map(s => JSON.stringify(s.trim().replace(/^"|"$/g, ""))).join(", ")}],`,
    `        'almanac-mono':  [${t.type.mono.split(",").map(s => JSON.stringify(s.trim().replace(/^"|"$/g, ""))).join(", ")}],`,
    `      },`,
    `      fontSize: {`,
    `        'almanac-headline':  ['${t.type.sizes.headline}px',  { lineHeight: '${t.type.lineHeight.headline}', letterSpacing: '${t.type.tracking.headline}' }],`,
    `        'almanac-body':      ['${t.type.sizes.body}px',      { lineHeight: '${t.type.lineHeight.body}' }],`,
    `        'almanac-italic':    ['${t.type.sizes.italic}px',    { lineHeight: '${t.type.lineHeight.body}', fontStyle: 'italic' }],`,
    `        'almanac-monolabel': ['${t.type.sizes.monoLabel}px', { letterSpacing: '${t.type.tracking.monoLabel}' }],`,
    `      },`,
    `      spacing: {`,
    `        'almanac-gutter':      '${t.space.gutter}px',`,
    `        'almanac-section-gap': '${t.space.sectionGap}px',`,
    `      },`,
    `      maxWidth: {`,
    `        'almanac-measure': '${t.type.measureCh}ch',`,
    `      },`,
    `      borderWidth: {`,
    `        'almanac-hairline': '${t.space.hairline}px',`,
    `      },`,
    `    },`,
    `  },`,
    `  darkMode: ['class', '[data-theme="dark"]'],`,
    `};`,
    ``,
  ].join("\n");
}

async function main() {
  const tokensRaw = await readFile(tokensPath, "utf8");
  const tokens = JSON.parse(tokensRaw);

  // Schema sanity
  if (!tokens.version || !tokens.palette?.light || !tokens.palette?.dark) {
    console.error("tokens.json missing required fields (version, palette.light, palette.dark).");
    process.exit(2);
  }

  const built = {
    css:      buildCSS(tokens),
    scss:     buildSCSS(tokens),
    tailwind: buildTailwind(tokens),
  };

  const checkMode = process.argv.includes("--check");
  let drift = 0;
  for (const [key, content] of Object.entries(built)) {
    const path = outputs[key];
    let current = "";
    try { current = await readFile(path, "utf8"); } catch {}
    if (current !== content) {
      if (checkMode) {
        console.error(`drift: ${path}`);
        drift++;
      } else {
        await writeFile(path, content);
        console.log(`wrote ${path} (${content.length} bytes)`);
      }
    } else if (!checkMode) {
      console.log(`unchanged ${path}`);
    }
  }
  if (checkMode) {
    if (drift > 0) {
      console.error(`\n${drift} file(s) drifted. Run \`node scripts/generate.mjs\` to refresh.`);
      process.exit(1);
    }
    console.log("tokens in sync.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
