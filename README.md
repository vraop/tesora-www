# tesora-www

Marketing + content site for Tesora AI. Specialty P&C actuarial pricing.

Built for static generation (Astro 6) so search crawlers and LLM ingest agents see real HTML, not an empty `<div id="root">`. Voice flows from `~/tesora-harness/shared/prompts/voice.ts` — the harness is the source of truth for tone.

## Stack

- Astro 6 + TypeScript (strict) + Bun
- Tailwind v4 (`@tailwindcss/vite`)
- MDX for content collections
- `@astrojs/sitemap` for auto sitemap.xml

## Commands

```sh
bun install
bun dev           # localhost:4321
bun build         # static output to ./dist/
bun preview       # serve ./dist/ locally
bun astro check   # typecheck
```

## Layout

```
public/                 robots.txt, llms.txt, favicons, OG images
src/
  components/SEO.astro  per-page metadata: title, og:*, twitter:*, JSON-LD
  layouts/Layout.astro  base HTML shell
  styles/global.css     Tailwind import + design tokens
  pages/                static + dynamic routes
  content/              typed content collections (planned)
  data/                 manifests for programmatic page generation (planned)
  scripts/              one-shot generators (planned)
```

## SEO + GEO posture

- Zero-JS-by-default static HTML. Crawlers and LLM agents see content directly.
- Every page has full metadata + JSON-LD (Organization + page-specific schema).
- `/llms.txt` for LLM discovery, `/robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, etc. explicitly.
- Programmatic sub-page generation drives the long-tail. Pages target queries like:
  - "specialty P&C actuarial pricing for [line of business]"
  - "exposure base [type] [audience]"
  - "[insurance niche] pricing tools"
- Internal linking: every long-tail page links to 3-5 siblings and back to hub pages.

## Status

Foundation only. DESIGN.md and the long-tail content manifest are next. See `CLAUDE.md` for detailed project context.
