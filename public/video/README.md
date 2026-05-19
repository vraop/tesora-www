# Background video assets

This directory holds the Veo 3.1 background videos referenced by the site.

Expected files (each one is a silent, 8-second, 16:9 loop):

- `hero-loop.mp4` + `hero-poster.jpg` — homepage full-bleed hero
- `agents-loop.mp4` + `agents-poster.jpg` — agents section
- `customers-loop.mp4` + `customers-poster.jpg` — customers section
- `security-loop.mp4` + `security-poster.jpg` — security section
- `research-loop.mp4` + `research-poster.jpg` — research section
- `careers-loop.mp4` + `careers-poster.jpg` — careers section
- `about-loop.mp4` + `about-poster.jpg` — about section
- `rating-engine-demo.mp4` + `rating-engine-poster.jpg` — product demo (use the existing recording from ~/Downloads/Tesora Rating Engine Demo.mp4)

## How to regenerate prompts

```sh
cd ~/tesora-harness
bun run scripts/website-rebuild-loop.ts --out
```

Output lands in `manifest/veo-prompts.md`. Paste each block into Veo Studio.

The poster JPG is the first frame, exported at 1920x1080. Use it as the immediate visual while the video loads (and as the reduced-motion fallback).
