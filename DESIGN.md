# Design System — Tesora AI

Working-paper editorial. Restrained, technically dense, type-driven. Says "institutional credibility" without saying "institutional." If a chief actuary lands on a sub-page and thinks *"these people read the working papers,"* the design did its job.

This file is the source of truth for every visual decision on `tesora-www` and any other Tesora-AI marketing or content surface. Do not deviate without explicit user approval.

## Product Context

- **What this is:** AI-native actuarial pricing for specialty property and casualty insurance.
- **Who it's for:** Chief actuaries, carrier executives, MGAs, reinsurance brokers. The chief actuary is the primary buyer; everything optimizes for their trust.
- **Space / industry:** Specialty P&C insurance. Peers (and visual reference points): Akur8, Earnix, Verisk, Moody's RMS, Milliman, Guidewire, Duck Creek.
- **Project type:** Marketing + content site with hundreds of programmatic sub-pages targeting long-tail SEO and LLM lookup ("best actuarial tools," "specialty P&C pricing for X," etc.).
- **Brand stance (from /design-consultation D2):** *The team that understands specialty P&C the deepest.* Founder credibility, technical depth, opinion-forward.

## Aesthetic Direction

- **Direction:** Editorial / Magazine. Strong typographic hierarchy, asymmetric grids, footnotes as a design language, marginalia gutter, drop caps on long-form, section markers (§1, §2) like a journal.
- **Decoration level:** Intentional. Hairline rules between sections, paper-feel background, scholarly conventions. No hero illustrations, no abstract orbs, no purple gradients, no centered-everything, no stock photography.
- **Mood:** A serious technical journal that happens to be selling software. Closer to The Economist or a Federal Reserve working paper than to any current B2B SaaS landing page.
- **Reference points:** academic journals (working-paper format), The Economist (editorial density), Christian Bök / Kris Sowersby type specimens (typographic confidence). Anti-references: Duck Creek's cosmic orb hero, Earnix's centered-CTA template, every "intelligent platform" landing page.

## Typography

All fonts are free and self-hostable. Load via Google Fonts initially, migrate to self-hosted woff2 before launch.

- **Display / Hero:** **Source Serif 4** — weights 600/700, optical size 32–60. Rationale: institutional weight without coldness, designed for paragraph-scale display use.
- **Body:** **Source Serif 4** — weight 400/500, optical size 8–18. line-height 1.65. Prose at 65ch max. Drop caps on the first paragraph of long-form articles. Rationale: serif body is the deliberate departure from category. Says "this is something to read," not "this is something to scroll."
- **UI / Sans:** **Inter Tight** — weights 400/500/600/700. For navigation, labels, captions, data, buttons. Tabular-nums on. Rationale: restrained sans, less overused than Inter, reads as "engineered" not "trendy."
- **Data / Tables:** **Inter Tight** with `font-feature-settings: "tnum"` for body-density data. **JetBrains Mono** for equations, code, technical examples (loss-ratio formulas, GLM snippets, schedule-rating math).
- **Code / Mono:** **JetBrains Mono** — weights 400/500.
- **Loading:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300..700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  ```

### Type Scale

| Level | Size | Line height | Tracking | Use |
|-------|------|-------------|----------|-----|
| display-xl | 64px | 1.05 | -0.02em | rare, big-statement pages |
| display | 52px / 3.25rem | 1.08 | -0.018em | hero headlines |
| h2 | 36px / 2.25rem | 1.15 | -0.01em | article section titles |
| h3 | 26px / 1.625rem | 1.2 | -0.005em | sub-section titles |
| deck | 22px / 1.375rem | 1.5 | 0 | hero subdeck (italic) |
| body | 18px / 1.125rem | 1.65 | 0 | prose |
| body-sm | 16px / 1rem | 1.55 | 0 | secondary prose, captions |
| ui | 14px / 0.875rem | 1.55 | 0.02em | buttons, navigation, labels |
| micro | 11px / 0.6875rem | 1.4 | 0.16em | section markers, eyebrow tags (uppercase) |

## Color

Restrained. One accent (oxblood). Neutrals do most of the work.

| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#0E0E0C` | text, headers, primary surface in dark mode |
| `--bone` | `#FAF7F0` | background — paper feel, not pure white |
| `--stone` | `#E8E3D7` | panel surfaces, callout backgrounds |
| `--smoke` | `#6B6760` | muted text, captions, marginalia |
| `--char` | `#2A2823` | dark-mode background |
| `--oxblood` | `#7D2B2B` | **accent** — links, emphasis, footnote refs, active states. Used rarely. |
| `--rule` | `rgba(14,14,12,0.12)` | hairline borders between sections |

### Semantic

| Token | Hex | Use |
|-------|-----|-----|
| `--forest` | `#2D5A3D` | success states, positive deltas |
| `--mustard` | `#8B6914` | warnings, caution |
| `--oxblood` | `#7D2B2B` | errors (reuses accent — error and emphasis share visual treatment) |
| `--slate` | `#2C5469` | informational |

### Dark Mode

- Background: `--char` (`#2A2823`)
- Surface: `#1A1815`
- Foreground: `--bone`
- Muted: `#9A958B`
- Rule: `rgba(250,247,240,0.14)`
- Saturation reduced ~10% on accent: oxblood remains `#7D2B2B` since it already reads warm.

## Spacing

- **Base unit:** 8px.
- **Density:** Comfortable. Vertical rhythm via 1.5x type scale. Generous paragraph and section spacing.

| Token | px | Use |
|-------|----|-----|
| `space-2xs` | 2 | hairline adjustments |
| `space-xs` | 4 | inline gaps |
| `space-sm` | 8 | tight stack |
| `space-md` | 16 | standard stack |
| `space-lg` | 24 | section internal spacing |
| `space-xl` | 32 | section breaks, button padding |
| `space-2xl` | 48 | between major sections |
| `space-3xl` | 64 | hero padding |
| `space-4xl` | 96 | landmark separation |

## Layout

- **Approach:** Hybrid. Editorial (asymmetric, marginalia gutter) for marketing pages and long-form content. Grid-disciplined for product / dashboard sections.
- **Grid:** 12-column at `≥1024px`, 8-column at `≥768px`, single-column below.
- **Max content width:** 680px for prose, 1100px for the editorial container, 1200px for product/tooling.
- **Marginalia gutter:** Right-side gutter (200px) on long-form articles for footnote refs, citation links, and related-page navigation. Sticky-positioned to follow scroll.
- **Border radius:** Hierarchical, used minimally:
  - `radius-none` (0): default
  - `radius-sm` (2px): inputs, small tags
  - `radius-md` (4px): callouts, panels (rare)
  - `radius-full` (9999px): never used. The system is rectangular.
- **Navigation:** No sticky nav with shadow. Hairline border instead. Logo left, nav items right, all in Inter Tight 14px.

## Motion

- **Approach:** Minimal-functional. Animation is for comprehension, not decoration.
- **Easing:** `enter: cubic-bezier(0.16, 1, 0.3, 1)` (ease-out), `exit: cubic-bezier(0.4, 0, 1, 1)` (ease-in), `move: cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out).
- **Duration:** `micro` 80ms, `short` 200ms, `medium` 320ms, `long` 500ms.
- **Allowed:** Subtle fade-in on scroll-into-view for long-form sections (max 200ms, no transform). Hover state on links (instant border-bottom). Page transitions are instant.
- **Forbidden:** Hover wobbles, parallax, decorative scroll-driven animation, hero animations, abstract motion.

## Components

### Buttons

- **Primary:** ink background, bone text, 1px ink border, no radius, 10px × 20px padding, Inter Tight 13px 600 uppercase 0.06em tracking.
- **Secondary:** transparent background, ink text, 1px ink border, otherwise identical.
- **Ghost:** transparent, oxblood text, no border, 1px oxblood border-bottom only, 10px × 0 padding.

### Links

- Body links: oxblood text, 1px oxblood border-bottom at 40% opacity. On hover, border-bottom goes to full opacity. No underline-skip-ink hacks.

### Footnote markers

- Superscripted oxblood numbers in Inter Tight 11px 600. Click target jumps to the marginalia entry.

### Data tables

- Hairline top + bottom borders. No outer side borders. Header row in Inter Tight 11px 600 uppercase 0.1em tracking, smoke color. Data rows in Inter Tight 14px tabular-nums. Hairline between rows.

### Callouts

- Stone background (`#E8E3D7`), 2px oxblood left border, 24px × 28px padding. Inter Tight or JetBrains Mono content. Used sparingly — once or twice per long-form article max.

### Section markers

- Eyebrow tag in Inter Tight 11px 600 uppercase 0.18em tracking, smoke color. Format: `§ {Section name}` or `§ 1 · Insights`.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-28 | Initial design system created | /design-consultation D1-D4. Research on 8 category competitors confirmed convergence; differentiation play is editorial typography over corporate-AI-SaaS. Approved by user. |
| 2026-04-28 | Source Serif 4 chosen as both display AND body | Adobe-licensed but free, optical-sizing built-in, designed for paragraph display. Rejected: Söhne (paid), Crimson Pro (less weight options), Spectral (slightly weaker hierarchy). |
| 2026-04-28 | Inter Tight chosen for sans, NOT Inter | Inter is on the gstack overused list. Inter Tight is restrained, less identifiable as "the AI startup font," and pairs well with serif body. |
| 2026-04-28 | Oxblood accent #7D2B2B, not corporate blue | Differentiation. Reads academic/Eastern, not insurance-corporate. Distinguishes Tesora in screenshots and search-result thumbnails. |
| 2026-04-28 | Footnotes / marginalia gutter as design language | GEO bonus: scholarly conventions signal authority that LLMs reward when ranking authoritative sources. SEO bonus: real footnotes link to real cited sources. |
| 2026-04-28 | No hero illustration, no abstract orb, no centered hero | Three of the four competitor sites use one of these. Tesora avoids all three on purpose. |

## Anti-Patterns (do not ship)

- Purple or violet gradients of any kind.
- 3-column "feature grid" with icons in colored circles.
- Centered hero with rounded button below.
- Abstract orb / cosmic / particle hero illustration.
- Stock photography of business people in conference rooms.
- "Built for X" / "Designed for Y" / "Intelligent platform" copy patterns.
- Bubble-radius (full pill) on every element.
- Inter or system-ui as the primary body font.
- Animation longer than 320ms.
- Em dashes (use periods, parentheses, or commas instead).
- "AI" used as marketing buzz. The product *is* AI; we don't need to say it in every headline.
