# Veo 3.1 prompt set for Tesora site

Used for the scroll-driven cinematic bands modeled after vulcan.ai/government.
All clips: 8 seconds, silent, 1280x720, slow drift, no on-frame text, defensive
blur applied in CSS as a safety net against artifacted glyphs.

Drop the generated MP4s in `public/video/` under the filenames listed at the
top of each prompt. The site is already wired for blur on every clip that is
NOT prefixed `demo-` (those are the real product captures and stay sharp).

---

## hero-loop.mp4 (current, keep)

Slow camera drift across an open notebook, a fountain pen, and a chipped
ceramic mug, late afternoon light, depth of field, no text visible.

## actuarial-loop.mp4 (new, for /agents or / mid-band)

Slow cinematic dolly across a wide oak desk: a worn slide rule beside a
leather-bound book of loss tables, a brass desk lamp with warm filament
glow, a single sheet of triangular development factors filled in by hand,
ink slightly bleeding, mug of black coffee on the corner. Late afternoon
window light through venetian blinds. Shallow depth of field, dust motes
visible. No legible text on the page, just the shape of handwritten
columns. Filmic, color-graded teal and amber.

## nyc-loop.mp4 (new, for /media or /security)

High floor corner office at golden hour. Manhattan skyline through floor to
ceiling windows. Slow rotation of the camera reveals a partner desk with a
clean leather blotter, a Rolodex, a single Montblanc pen, and a stack of
manila folders with no readable labels. Warm sun catches the dust. The city
below is alive but the room is still. Cinematic, anamorphic feel. No text.

## sf-loop.mp4 (new, optional, for /careers or /security)

Quiet open-plan engineering loft in San Francisco around blue hour. A bay
window with a glimpse of the Bay Bridge. A whiteboard partially erased with
a generic systems diagram of arrows and boxes (do not write words, only
shapes). A mechanical keyboard, a thermos, a single houseplant. Slow push
in. No people. No text. Cinematic.

## reports-loop.mp4 (new, for the analyze workflow)

Top-down camera over a wide desk. A stack of bound actuarial reports, each
with a clean unlabeled tan cover. A single report open in the foreground
showing charts and tables (do not render letters or numbers, just bar and
line silhouettes). Slow rotation. Coffee mug in the corner, slide rule
beside the stack. Soft natural light. Filmic.

## completion-loop.mp4 (new, for the audit workflow)

Hands placing a brass embosser onto a thick document. The embosser comes
down, leaves a circular impression with a generic seal shape (no readable
text). Then a gloved hand stamps a small completion mark. Slow motion,
shallow depth of field, warm tungsten light. No words on the document, only
ruled columns visible in the bokeh.

## writing-loop.mp4 (new, for /media writing section)

Close shot of a fountain pen writing in a notebook. The strokes are
deliberate but the camera focus is shallow so the writing reads as ink
texture, not letters. The pen lifts, dips into an inkwell, returns. Brass
desk lamp behind, warm light. Filmic, slow.

## numbers-loop.mp4 (new, for / proof row backdrop)

Macro slow pan across an old printed actuarial table or rate manual page.
The numerals are present but slightly out of focus so they read as columns
and rhythm rather than legible figures. A finger occasionally enters frame,
moving down a row. Warm desk light, paper grain visible. No legible labels.

## research-loop.mp4 (current, keep)

Subtle drift over a relational schema diagram drawn on paper, lit from one
side, no text.

## customers-loop.mp4 (current, keep)

Slow push in over a clean modern workstation with multiple monitors visible
out of focus, no readable text on any screen.

## security-loop.mp4 (current, keep)

Slow drift across a vault door style brass mechanism and the corner of an
ASOP-style binder, no visible writing on the cover.

---

## Prompt hygiene

- Always end the prompt with: "No legible text anywhere in frame. No
  letters, no numbers, no logos. Subject matter only."
- If the clip has any document or screen, ask Veo to render it shallow,
  with focus pulled forward to the foreground object so text reads as
  texture.
- Defensive CSS blur of 2.5px is applied to every non-demo clip via
  `src/components/CinematicHero.astro` and `src/components/VideoBand.astro`
  so any artifacted glyphs still read as atmosphere, not copy.
