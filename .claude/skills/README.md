# Vendored skills

Project-scoped Claude Code skills. Anything in this directory loads automatically
for anyone working in this repo, including web sessions. No install step, no clone,
no external code runs at session start.

## What's here

- `humanize/` — rewrites flat or AI-sounding copy into prose that reads human.
- `ai-check/` — scores a draft for AI tells (vocabulary, sentence uniformity,
  rhetorical scaffolding, register collapse) and reports what gave it away.

Both back the site's voice rules (no em dashes, banned vocabulary, human register).
Use `ai-check` on new long-form copy before it ships; the deterministic subset of
its vocabulary signals is also enforced as advisories by `bun run check:voice`.

## Provenance and updates

Vendored from [harshaneel/humanize](https://github.com/harshaneel/humanize),
MIT licensed (see `LICENSE.humanize`). To refresh to a newer upstream version:

```
bash scripts/setup-humanize.sh          # clones/updates ~/humanize
cp -R ~/humanize/humanize  .claude/skills/humanize
cp -R ~/humanize/ai-check  .claude/skills/ai-check
cp    ~/humanize/LICENSE    .claude/skills/LICENSE.humanize
```

Review the diff before committing so an upstream change is a deliberate update,
not a silent one.
