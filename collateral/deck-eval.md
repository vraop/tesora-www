# Tesora Deck Eval

How we grade a piece of Tesora collateral before it goes to a chief actuary, a
carrier exec, or an advisor. The reader we are grading for is not a friendly one.
Assume a credentialed actuary who signs rate filings, whose name goes to the
department of insurance and the board, and who has watched a dozen AI vendors
overpromise. That reader is looking for a reason to stop trusting the document.
The eval exists to find that reason before they do.

There are two halves. The mechanical half (`deck-lint.mjs`) catches the tells a
regex can catch. The judgment half (this rubric) catches the ones it cannot. A
deck ships only when it clears both.

## The mechanical half

`deck-lint.mjs` reads the visible text of a deck (it strips styles, scripts,
comments, and base64 images) and reports two tiers.

Hard failures, which must be zero:

- Em dashes and en dashes. The house style bans both, and they are the single
  most common punctuation tell of generated text.
- Banned and hype vocabulary: ecosystem, seamless, world-class, cutting-edge,
  robust, supercharge, and the rest of the list carried over from
  `scripts/check-voice.ts`.
- Out-of-scope actuarial terms the product does not cover: capital modeling,
  cat testing, XOL, cession, PML.

Soft signals, which a human reviews rather than auto-fixes:

- Hollow antithesis. The "X, not Y" construction. One or two per document reads
  as a point of view. A dozen reads as a language model that has learned the
  cadence and cannot stop. The linter surfaces every instance so a person can
  thin them to the two or three that actually carry an argument.

Run it: `node deck-lint.mjs deck1.html deck2.html`.

## The judgment half

Six categories, each scored 1 to 5, weighted. A deck is graded out of the
weighted maximum and converted to a letter. The weights are not decoration. They
say plainly that with this reader, being believed matters more than being
polished, and not sounding like a machine matters as much as the argument itself.

| # | Category | What a 5 looks like | Weight |
|---|----------|---------------------|--------|
| A | Claim defensibility | Every number is sourced, or labeled illustrative in plain sight. Nothing would collapse under "prove it." Hedged the way the proposal hedges: "up to," "avg," "modeled from." | ×3 |
| B | Actuarial fluency | On-leveling, loss development, SERFF, ASOP, combined ratio, RBC used exactly right. The workflow described is the one the reader actually lives. No tell that a non-actuary wrote it. | ×2 |
| C | Does not read as AI | Antithesis thinned. No rule-of-three pile-ups, no generic superlatives, no gimmick pages, no punchy fragments standing in for a point. Reads like one person who knows the subject wrote it. | ×3 |
| D | Narrative progression | Each page advances an argument the previous page set up. The deck builds to a conclusion instead of listing features. A reader can restate the throughline after one pass. | ×2 |
| E | Structural discipline | Every page earns its place. No divider that only announces the next page, no slide that repeats another. Honest data-viz: zero baselines, no truncated axes. | ×2 |
| F | Brand fidelity | Fonts, color, spacing, and layout match DESIGN.md. No SaaS-hero clichés, no purple-orb filler. | ×1 |

Weighted maximum is 65. Grades: A is 58 and up, B is 49 to 57, C is 39 to 48,
below that the deck goes back to the drawing board rather than out the door.

## Red flags that cap the grade

Some faults are not point deductions, they are ceilings. Any one of these caps
the whole deck at C until it is fixed, regardless of how the categories score:

- A number stated as fact that is neither sourced nor visibly labeled
  illustrative. This is the fastest way to lose a skeptical actuary, and it loses
  them for the whole document, not just the slide.
- Any em dash or en dash. Zero tolerance, no exceptions.
- A claim the reader would call out loud in the room. If a line cannot survive a
  chief actuary saying "that is not how this works," it is a liability.
- A gimmick that trades the reader's trust for a moment of cleverness. A fake
  competitor error screen is the canonical example.
- A "case study" that is actually a model. If the customer is anonymous and the
  results are illustrative, the document must say so on its own face. The moment
  the reader discovers a gap the framing hid, every other number on the page
  becomes suspect too.

That last one is the point the whole eval turns on. The reader does not need the
deck to be modest. They need it to be honest about which parts are proven and
which parts are projected, because the deck's real product is not the numbers. It
is whether the person who signs the filing believes the people who built it.
