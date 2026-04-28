# CLAUDE.md

Project-level guidance for Claude Code sessions in this repo.

## What this is

Marketing + content site for Tesora AI. Specialty P&C actuarial pricing. Audience: chief actuaries, carrier executives, MGAs, reinsurance brokers. The strategic goal is winning "best actuarial tools" / "specialty P&C pricing" type queries on Google AND on LLM lookup (ChatGPT, Claude, Perplexity, Gemini) through a combination of programmatic SEO (hundreds of long-tail sub-pages) and GEO (llms.txt, structured data, citation-worthy content).

## Stack

- **Astro 6** — zero-JS-by-default static generation. SSG output is what crawlers and LLM ingest agents see.
- **Tailwind v4** via `@tailwindcss/vite` — design tokens in `src/styles/global.css`.
- **TypeScript** strict.
- **Bun** runtime + package manager.
- **MDX** for content pages (typed via Astro content collections, schema-validated).
- **@astrojs/sitemap** — auto sitemap.xml from pages directory.

## Layout

- `src/layouts/Layout.astro` — base HTML shell, imports SEO component, global styles.
- `src/components/SEO.astro` — typed per-page metadata (title, description, canonical, og:*, twitter:*, JSON-LD).
- `src/components/` — UI components.
- `src/content/` — content collections (articles, glossary, line-of-business pages — defined per Astro schema).
- `src/data/` — JSON/YAML manifests driving programmatic page generation.
- `src/pages/` — static + dynamic routes. `[slug].astro` patterns drive sub-page generation.
- `public/` — static assets, `robots.txt`, `llms.txt`, favicons.
- `scripts/` — one-shot generators (content, sitemap helpers, deploy).

## Voice

All Vivek-as-author text comes from `tesora-harness/shared/prompts/voice.ts` (concise, warm, to the point; no em dashes; banned vocabulary list). When generating content for this site, **import or vendor that file** — never re-derive the voice. The harness is at `~/tesora-harness/`.

## SEO + GEO posture

- Static HTML, not SPA. Crawlers and LLM agents must see content without executing JS.
- Every page has: title, description, canonical, og:* + twitter:*, JSON-LD (Organization + page-specific @type).
- `/llms.txt` and `/llms-full.txt` (planned) for LLM discovery — keep up to date when sub-pages land.
- `/robots.txt` allows GPTBot, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, PerplexityBot, Applebot-Extended explicitly.
- Internal linking is the move: every long-tail page links to 3-5 sibling pages and back to relevant audience/line hub pages.

## Skill routing

When the user's request matches an available gstack skill, ALWAYS invoke it as your FIRST action.

- Design system, brand, DESIGN.md → `/design-consultation`
- Visual variants for a UI moment → `/design-shotgun`
- Implement a finalized design → `/design-html`
- Visual audit / design polish → `/design-review`
- Plan review (architecture, scope) → `/plan-eng-review` or `/plan-ceo-review`
- Ship, deploy, push, create PR → `/ship`
- QA, find bugs → `/qa`
- Code review → `/review`
- Update docs after shipping → `/document-release`

## Health Stack

- typecheck: `bun astro check`
- lint: (not configured)
- test: (not configured)
- deadcode: (not configured)

## Related repos

- `~/tesora-harness/` — local automation harness. Voice prompt lives there. Don't duplicate logic; import or vendor with attribution.
