# Design System — Tesora AI

Minimal modern. Sans-only typography, center-aligned hero, generous whitespace, one accent color. The simplicity is the message: *the team that understands specialty P&C deepest doesn't need to overstate it.*

Reference points (in order): joinargos.com, numeral.com, linear.app. Anti-references: Duck Creek's cosmic orb, Earnix's centered-CTA template, every "intelligent platform" landing page.

This file is the source of truth for every visual decision on `tesora-www` and any other Tesora marketing or content surface. Do not deviate without explicit user approval.

## Product Context

- **What this is:** AI-native actuarial pricing for specialty property and casualty insurance. The repo (`tesora-www`) replaces the current SPA at tesora.ai when it ships.
- **Who it's for:** Chief actuaries, carrier executives, MGAs, reinsurance brokers. The chief actuary is the primary buyer; everything optimizes for their trust.
- **Project type:** Marketing + content site with hundreds of programmatic sub-pages targeting long-tail SEO and LLM lookup ("best actuarial tools," "specialty P&C pricing for X," etc.).
- **Brand stance (from /design-consultation D2):** *The team that understands specialty P&C the deepest.* Founder credibility, technical depth, opinion-forward, restrained.

## Aesthetic Direction

- **Direction:** Minimal modern. Restrained. Whitespace-driven.
- **Decoration level:** Minimal. Type, color, and spacing do the work. No hairline rules every section, no decorative texture, no drop caps, no scholarly conventions on marketing pages.
- **Mood:** A confident, technically-credible team that's done the work and isn't shouting about it. Closer to Argos or early Stripe than to Notion.
- **Reference points:** joinargos.com (clean centered hero, two-column feature blocks, black/white/photo restraint), numeral.com (one strong accent + product screenshots + clear feature sections), linear.app (whitespace + opinionated typographic minimalism).
- **Anti-references:** Duck Creek's cosmic orb hero, Earnix's "Compete. Differentiate. Grow." stat blocks, any site with abstract animated illustrations or purple gradients.

## Typography

One typeface family does most of the work. Discipline through weight, size, italic, and tracking — not through serif/sans pairing.

- **Display + Body + UI:** **Inter Tight** — weights 400/500/600/700, italic supported. Tabular-nums on for data. Rationale: argos and numeral both run sans-only; the simplicity of one family is the move. Inter Tight is restrained, less overused than Inter, less identifiable as "the AI startup font."
- **Code / Data / Equations:** **JetBrains Mono** — weights 400/500. Used sparingly for actual code samples, equations, and class-code data tables. Not for body text.
- **Optional pull quote serif:** **Source Serif 4** — available for occasional editorial moments on long-form content (pull quotes, working-paper-style article hero on `/insights/*` pages). NOT used on marketing pages. Loaded only on routes that explicitly opt in.
- **Loading:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  ```

### Type Scale

| Level | Size | Line height | Tracking | Weight | Use |
|-------|------|-------------|----------|--------|-----|
| display | 56px / 3.5rem | 1.05 | -0.022em | 600 | hero headlines (centered) |
| h2 | 36px / 2.25rem | 1.15 | -0.012em | 600 | section titles |
| h3 | 22px / 1.375rem | 1.3 | -0.005em | 600 | sub-section titles, feature headings |
| deck | 20px / 1.25rem | 1.5 | 0 | 400 | hero subdeck (regular weight, color: smoke) |
| body | 17px / 1.0625rem | 1.6 | 0 | 400 | prose |
| body-sm | 15px / 0.9375rem | 1.55 | 0 | 400 | secondary prose |
| ui | 14px / 0.875rem | 1.5 | 0 | 500 | navigation, buttons |
| micro | 12px / 0.75rem | 1.4 | 0.04em | 500 | captions, footnote markers |
| eyebrow | 12px / 0.75rem | 1.4 | 0.12em (uppercase) | 600 | section eyebrow tags (sparingly) |

## Color

One accent. Neutrals do most of the work.

| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#0E0E0C` | text, headers |
| `--bone` | `#FAF7F0` | background — paper feel, not pure white |
| `--stone` | `#E8E3D7` | panel surfaces, callout backgrounds |
| `--smoke` | `#6B6760` | muted text, captions, secondary metadata |
| `--char` | `#2A2823` | dark-mode background |
| `--oxblood` | `#7D2B2B` | **accent** — links, CTAs, emphasis. Used sparingly. |
| `--rule` | `rgba(14,14,12,0.10)` | hairline borders (rare; use whitespace first) |

### Semantic

| Token | Hex | Use |
|-------|-----|-----|
| `--forest` | `#2D5A3D` | success states, positive deltas |
| `--mustard` | `#8B6914` | warnings, caution |
| `--oxblood` | `#7D2B2B` | errors (reuses accent) |
| `--slate` | `#2C5469` | informational |

### Dark Mode

- Background: `--char` (`#2A2823`)
- Surface: `#1A1815`
- Foreground: `--bone`
- Muted: `#9A958B`
- Rule: `rgba(250,247,240,0.12)`

## Spacing

- **Base unit:** 8px.
- **Density:** Generous. Whitespace is the design tool.

| Token | px | Use |
|-------|----|-----|
| `space-2xs` | 2 | inline adjustments |
| `space-xs` | 4 | inline gaps |
| `space-sm` | 8 | tight stacks |
| `space-md` | 16 | standard stacks |
| `space-lg` | 24 | section internal spacing |
| `space-xl` | 32 | between subsections |
| `space-2xl` | 48 | between major sections (smaller spacing for short pages) |
| `space-3xl` | 80 | between major sections (default) |
| `space-4xl` | 128 | landmark separation, hero padding |

## Layout

- **Approach:** Center-aligned by default. Editorial asymmetry only on long-form content pages (e.g. `/insights/*`).
- **Container:** `max-width: 1100px`, padded 32px / 48px depending on viewport. Marketing sections use `max-width: 720px` for prose blocks.
- **Hero:** Centered, vertically generous (128px top, 96px bottom). Headline + deck + primary CTA. Optional secondary link below.
- **Feature sections:** Two-column or single-column. Image / product screenshot on one side, headline + body on the other. Argos-style. No icons in colored circles.
- **Customer logo strip:** Single horizontal band, centered, restrained typographic logos (or grayscale image marks once provided). Caption above ("Trusted by") in `eyebrow` style.
- **Border radius:** Hierarchical, used minimally:
  - `radius-none` (0): default for buttons, panels
  - `radius-sm` (3px): inputs
  - `radius-md` (6px): images, screenshots
  - `radius-full` (9999px): never on the marketing surface; reserved for product UI components only
- **Navigation:** No sticky shadow. Hairline border only when scrolled. Logo left, nav center, CTA right.

## Motion

- **Approach:** Minimal-functional. Animation aids comprehension, never decoration.
- **Easing:** `enter: cubic-bezier(0.16, 1, 0.3, 1)`, `exit: cubic-bezier(0.4, 0, 1, 1)`, `move: cubic-bezier(0.4, 0, 0.2, 1)`.
- **Duration:** `micro` 80ms, `short` 200ms, `medium` 320ms, `long` 500ms.
- **Allowed:** Subtle fade-in on scroll-into-view for feature sections (max 200ms, no transform). Hover state on links. Page transitions are instant.
- **Forbidden:** Hover wobbles, parallax, decorative scroll-driven animation, hero animations, abstract motion.

## Components

### Buttons

- **Primary:** ink background, bone text, no border, 4px radius optional, 12px × 24px padding, Inter Tight 14px 500. Hover: oxblood background.
- **Secondary:** transparent background, ink text, 1px ink border, otherwise identical.
- **Ghost / link CTA:** transparent, oxblood text, no border, no padding, underline on hover only.

### Links

- Body links: oxblood text, no underline, hover gets a 1px border-bottom in oxblood.
- Footer links: smoke text, hover ink. No underline.

### Customer logo strip

- Centered, single row at desktop, stacks at mobile. 16px gap between marks. Small `eyebrow`-style caption above ("Trusted by"). Logos are grayscale or single-tone; never full-color brand images.

### Feature section (two-column)

- Image / screenshot: 6 cols, rounded 6px corners, no shadow. Subtle `--rule` border at 60% opacity.
- Text column: 5 cols, 1-col gap. Eyebrow tag (optional), h2 headline, body paragraph, optional link CTA.
- Vertical alignment: top-aligned at desktop, stacks at mobile.

### Pull quote (long-form only)

- Optional Source Serif 4 italic at 28px, max-width 600px, indented 32px, color: ink. Used sparingly on `/insights/*` pages.

### Data tables

- Hairline top + bottom borders only. No outer side borders. Header row: Inter Tight 12px 600 uppercase 0.04em tracking, smoke. Data: Inter Tight 14px tabular-nums.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-28 | Initial design system created (working-paper editorial) | /design-consultation D1-D4. Research on 8 category competitors confirmed convergence; differentiation play was editorial typography. |
| 2026-04-28 | Pivot to minimal-modern simplicity (joinargos.com / numeral.com reference) | User reviewed initial direction and asked for argos/numeral simplicity. Brand stance unchanged ("team that understands specialty P&C deepest") but route changes from academic-gravitas to restrained-competence. Inter Tight now primary; Source Serif 4 demoted to optional long-form pull-quote use. Marginalia gutter, drop caps, § section markers removed. |
| 2026-04-28 | Inter Tight kept over Inter | Inter is on the gstack overused list. Inter Tight is restrained, less identifiable as "the AI startup font," and works as a single-family system at multiple weights. |
| 2026-04-28 | Oxblood accent retained (#7D2B2B) | Numeral has bold orange; argos has effectively no accent. Tesora keeps oxblood as the single restrained accent — distinguishes from corporate-blue category default and reads serious without shouting. |

## Anti-Patterns (do not ship)

- Purple or violet gradients of any kind.
- 3-column "feature grid" with icons in colored circles.
- Abstract orb / cosmic / particle hero illustration.
- Stock photography of generic business people in conference rooms (real team photos OK on About).
- "Built for X" / "Designed for Y" / "Intelligent platform" copy patterns.
- Bubble-radius (full pill) on marketing surfaces. (Product UI exception only.)
- Two typefaces fighting for attention. Inter Tight does most of the work.
- Animation longer than 320ms.
- Em dashes (use periods, parentheses, or commas instead).
- "AI" used as marketing buzz. The product *is* AI; we don't need to say it in every headline.
- Hairline rules between every section. Whitespace first; rule only when whitespace is ambiguous.
