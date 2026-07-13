# Collateral

Sales and marketing collateral for Tesora, built as self-contained HTML that
renders to 1280x720 slides (decks) or a letter document (the Harness writeup),
then exported to PDF. These are separate from the Astro site and are not part of
the site build.

## Versions

Each frozen version lives in its own folder. The current one is `v1/`.

| File | What it is |
|------|------------|
| `Tesora-Case-Study` | Engagement case study, 9 slides. A specialty admitted P&C carrier moving pricing, reserving, and rate filing onto the Workbench. Numbers are modeled from the carrier's own baseline; swap in measured results before external use. |
| `Tesora-Pitch-Deck` | Company pitch, 10 slides. Who / Why / How. |
| `Tesora-Harness-Models-and-Methods` | Technical writeup of the Harness, 3 pages. How the four agents work, how honesty is enforced, and how data is handled. |

Each ships as both `.html` (the source) and `.pdf` (the export).

## Tooling

- `deck-eval.md` is the rubric a piece of collateral is graded against before it
  goes to a chief actuary, a carrier exec, or an advisor.
- `deck-lint.mjs` is the mechanical half of that eval. It flags banned
  punctuation, hype vocabulary, out-of-scope terms, and the hollow-antithesis
  cadence that reads as machine-written. Run it with
  `node deck-lint.mjs v1/Tesora-Case-Study.html`.

Voice rules are inherited from `scripts/check-voice.ts` and `docs/review-rubric.md`.
