# Veo 3.1 prompt set for Tesora site

Used for the scroll-driven cinematic bands modeled after vulcan.ai.

**Aesthetic anchor (2026 refresh):** warm dusk palette, amber and electric
indigo (`#4338CA`), modern AI substrate hovering over the actuarial domain.
"Cutting edge on top of something." Not librarian, not leather-bound, not
oak desk. Think: glowing typed-graph above a loss triangle, dusk skyline
through floor-to-ceiling glass, holographic pricing flow over a city map.

All clips: 8 seconds, silent, 1280x720, slow drift, no on-frame text.
Defensive CSS blur (2.5px) is applied on every non-demo clip via
`CinematicHero.astro` and `VideoBand.astro` as a safety net against
artifacted glyphs.

Filenames map 1:1 to existing `public/video/*.mp4` references so no
component rewiring is needed. The `demo-*.mp4` clips are real product
captures and stay sharp (no prompt entry here).

---

## hero-loop.mp4

Slow cinematic dolly across a warm, low-lit modern workspace at dusk.
Amber tungsten light from a single overhead source. A translucent 3D
loss-development triangle floats mid-air above a matte cream surface,
rendered in glowing thin lines of electric indigo. Faint amber data
threads drift up into the triangle from below. Floor-to-ceiling glass in
the background reveals a dusk skyline in soft focus. Shallow depth of
field, dust motes visible in the light beam. Cinematic, anamorphic feel,
color-graded amber and indigo. No legible text, no numbers, no logos.

## agents-loop.mp4

Slow camera orbit around a translucent holographic flow chart suspended
above a warm cream tabletop. Four glowing nodes connected by thin electric
indigo lines pulse in sequence, left to right, then loop. Amber tungsten
light wraps the scene from a low angle. A faint dusk skyline glows behind
through soft-focus glass. Shallow depth of field, particles drift through
the beam. Filmic, modern, cinematic. No legible text, no numbers, no
logos.

## customers-loop.mp4

Slow camera push into a warm-lit operations room at dusk. A wall-sized
translucent holographic display shows a stylized city grid with glowing
financial flow lines threading between neighborhoods (no street labels,
no place names, only abstract geometric blocks). Electric indigo data
streams pulse along the lines. Warm amber accent lighting along the floor
and ceiling edges. A single silhouette stands in the foreground out of
focus. Cinematic, anamorphic feel, dusk palette. No legible text, no
numbers, no logos.

## research-loop.mp4

Top-down camera slowly orbiting a transparent typed-graph schematic
rendered in mid-air as a 3D wireframe of nodes and edges. Nodes glow
electric indigo; edges flicker amber as data pulses travel along them.
Warm dusk light catches the wireframe from one side. The surface below is
matte cream, slightly textured. Shallow depth of field. Cinematic,
filmic. No legible text, no numbers, no logos.

## security-loop.mp4

Slow tracking shot down a warmly lit data corridor at dusk. Amber under
lighting along the floor edge. Rows of dark matte cabinets line both
sides, each with a single electric indigo status LED blinking in slow
sequence. The end of the corridor opens onto a panoramic dusk skyline
through floor-to-ceiling glass. Anamorphic flares. Cinematic, modern, no
people in frame. No legible text, no numbers, no logos.

## careers-loop.mp4

Slow rise from a low angle over a warm dusk skyline. A glowing thin-line
architecture diagram hangs translucent in mid-air between camera and
skyline. Nodes pulse electric indigo; connecting lines drift amber. The
sky is graded sunset orange into deep dusk indigo. Filmic, anamorphic
feel, soft particles. No people in frame. No legible text, no numbers, no
logos.

## about-loop.mp4

Slow drift across a warm modern table. A single translucent holographic
panel floats above the surface displaying abstract pulsing geometry (no
chart legends, no axis numbers, no words, only shape and rhythm). Amber
tungsten light from a low source casts a long warm shadow. Dusk skyline
glows soft behind floor-to-ceiling glass. Cinematic, shallow depth of
field. No legible text, no numbers, no logos.

## workbench-loop.mp4

Slow camera push across a warmly lit modern desk surface in matte cream.
Three translucent holographic panels float above the desk in a staggered
row, each rendered as glowing electric indigo wireframes of pricing flow
geometry. Amber tungsten light wraps the panels from below. Soft dusk
skyline through floor-to-ceiling glass beyond. Cinematic, filmic,
anamorphic flares. No legible text, no numbers, no logos.

## writing-loop.mp4

Macro shot of a glowing electric indigo neural-network glyph drawing
itself across a warm cream surface, line by line. Slow, deliberate.
Amber tungsten light from above catches dust motes in the beam. Shallow
depth of field, filmic, cinematic. No letters, no numbers, no logos.

## numbers-loop.mp4

Slow macro pan across a translucent floating column of pulsing electric
indigo dots and dashes — abstract numerical rhythm, no rendered digits.
Amber backlighting from a low source. Warm cream surface beneath, dusk
skyline soft-focus beyond. Cinematic, filmic. No legible text, no
numbers, no logos.

---

## Vertical walkthrough variants (9:16, 1080x1920)

Same aesthetic anchor: warm dusk, amber and electric indigo, modern AI
substrate over the actuarial domain. Reframed for portrait. Used in
mobile-only bands and product-landing tiles where a tall format reads
better. Generate at 1080x1920, 8 seconds, silent.

## walkthrough-ingest-vertical.mp4

Vertical reframe. Slow tilt-down through a stack of translucent floating
panels: top panel shows a glowing electric indigo abstract grid (loss-run
silhouette), middle panel shows a soft-focus geometric block (SOV
silhouette), bottom panel shows ruled column rhythm in pulsing amber.
Warm tungsten light wraps the stack from one side. Dusk skyline soft
behind. Shallow depth of field. No legible text, no numbers, no logos.

## walkthrough-rater-vertical.mp4

Vertical reframe. Slow camera dolly upward past three stacked holographic
panels suspended in warm dusk air. Each panel is a translucent electric
indigo wireframe of pricing geometry. Amber tungsten light from a low
source casts a long warm shadow upward. Filmic, anamorphic feel. No
legible text, no numbers, no logos.

## walkthrough-analyze-vertical.mp4

Vertical reframe. Top-to-bottom tilt across a tall translucent column of
holographic chart silhouettes (bar shapes, line shapes, no rendered
letters or numbers). Each silhouette pulses faint amber as data flows
through. Electric indigo accents along the column edges. Warm dusk
backlight. Shallow depth of field, cinematic. No legible text, no
numbers, no logos.

## walkthrough-audit-vertical.mp4

Vertical reframe. Close vertical shot of a glowing electric indigo seal
forming mid-air above a matte cream surface, drawn line by line, then
sealing closed with a soft pulse. Warm amber backlight from below.
Shallow depth of field, cinematic, filmic. No readable text inside the
seal, only abstract geometry. No legible text, no numbers, no logos.

## walkthrough-writing-vertical.mp4

Vertical reframe. Close shot framed top-to-bottom of a glowing electric
indigo neural-network glyph drawing itself across a warm cream surface
from top to bottom. Amber tungsten light from one side, dust motes in
the beam. Filmic, slow, cinematic. No letters, no numbers, no logos.

---

## Prompt hygiene

- Always end the prompt with: "No legible text, no numbers, no logos.
  Subject matter only."
- Color grade: dusk amber (#E89A4A vibe) + electric indigo (#4338CA) +
  warm cream surface (#FAF7F0). Avoid cold cyan, avoid pure white, avoid
  brown/leather/oak.
- Subject grammar: warm AI substrate floating *above* the actuarial
  domain. Holographic panels, translucent wireframes, pulsing data flows.
  Never slide rules, leather binders, brass embossers, fountain pens,
  Rolodexes.
- Skyline cue: when the prompt includes a skyline, frame it as soft-focus
  dusk through floor-to-ceiling glass. Never named cities, never
  recognizable landmarks.
- Defensive CSS blur of 2.5px is applied to every non-demo clip via
  `src/components/CinematicHero.astro` and `src/components/VideoBand.astro`
  so any artifacted glyphs still read as atmosphere, not copy.
