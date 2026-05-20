#!/usr/bin/env bun
// Generate Veo 3.1 videos from docs/veo-prompts.md.
//
// Usage:
//   GEMINI_API_KEY=... bun scripts/veo-generate.ts hero-loop.mp4
//   GEMINI_API_KEY=... bun scripts/veo-generate.ts --all
//   GEMINI_API_KEY=... bun scripts/veo-generate.ts --quality=standard hero-loop.mp4
//
// Reads ./docs/veo-prompts.md, finds `## <filename>.mp4` blocks, sends each to
// the Veo predictLongRunning endpoint, polls, downloads the mp4 into
// public/video/<filename>.

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

const args = process.argv.slice(2);
const quality = args.find((a) => a.startsWith("--quality="))?.split("=")[1] ?? "fast";
const runAll = args.includes("--all");
const targets = args.filter((a) => !a.startsWith("--"));

const MODEL = quality === "standard"
  ? "veo-3.1-generate-preview"
  : "veo-3.1-fast-generate-preview";

const PROMPTS_PATH = resolve(import.meta.dir, "../docs/veo-prompts.md");
const VIDEO_DIR = resolve(import.meta.dir, "../public/video");

type Clip = { filename: string; prompt: string; aspectRatio: "16:9" | "9:16" };

const parsePrompts = async (): Promise<Clip[]> => {
  const md = await readFile(PROMPTS_PATH, "utf8");
  const clips: Clip[] = [];
  const blocks = md.split(/^## (?=[\w-]+\.mp4$)/m).slice(1);
  for (const block of blocks) {
    const firstNewline = block.indexOf("\n");
    const filename = block.slice(0, firstNewline).trim();
    const rest = block.slice(firstNewline + 1);
    // Stop at next ## or --- separator
    const stopIdx = rest.search(/^(##\s|---\s*$)/m);
    const prompt = (stopIdx >= 0 ? rest.slice(0, stopIdx) : rest).trim();
    if (!prompt) continue;
    const aspectRatio: "16:9" | "9:16" = filename.includes("-vertical") ? "9:16" : "16:9";
    clips.push({ filename, prompt, aspectRatio });
  }
  return clips;
};

const generateOne = async (clip: Clip): Promise<void> => {
  console.log(`\n→ ${clip.filename}  [${clip.aspectRatio}, ${MODEL}]`);
  const body = {
    instances: [{ prompt: clip.prompt }],
    parameters: {
      aspectRatio: clip.aspectRatio,
      personGeneration: "allow_all",
      durationSeconds: 8,
    },
  };

  const startRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning?key=${API_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!startRes.ok) {
    const text = await startRes.text();
    throw new Error(`predictLongRunning failed (${startRes.status}): ${text}`);
  }
  const op = await startRes.json() as { name: string };
  console.log(`  operation: ${op.name}`);

  const t0 = Date.now();
  let done = false;
  let finalUri: string | undefined;
  let attempt = 0;
  while (!done) {
    attempt++;
    await new Promise((r) => setTimeout(r, attempt < 3 ? 8_000 : 15_000));
    const pollRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${op.name}?key=${API_KEY}`,
    );
    if (!pollRes.ok) {
      const text = await pollRes.text();
      throw new Error(`poll failed (${pollRes.status}): ${text}`);
    }
    const status = await pollRes.json() as {
      done?: boolean;
      error?: { message?: string };
      response?: {
        generateVideoResponse?: {
          generatedSamples?: { video?: { uri?: string } }[];
        };
      };
    };
    const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
    process.stdout.write(`  poll ${attempt} (${elapsed}s) ... `);
    if (status.error) throw new Error(`op error: ${status.error.message}`);
    if (status.done) {
      done = true;
      const samples = status.response?.generateVideoResponse?.generatedSamples ?? [];
      finalUri = samples[0]?.video?.uri;
      process.stdout.write("done\n");
    } else {
      process.stdout.write("pending\n");
    }
  }

  if (!finalUri) throw new Error("operation done but no video uri returned");
  console.log(`  download: ${finalUri.slice(0, 80)}...`);

  const videoUri = finalUri.includes("?") ? `${finalUri}&key=${API_KEY}` : `${finalUri}?key=${API_KEY}`;
  const dl = await fetch(videoUri);
  if (!dl.ok) throw new Error(`download failed (${dl.status})`);
  const buf = Buffer.from(await dl.arrayBuffer());
  const outPath = `${VIDEO_DIR}/${clip.filename}`;
  await writeFile(outPath, buf);
  console.log(`  wrote ${outPath}  (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
};

const main = async () => {
  const clips = await parsePrompts();
  const pick = runAll ? clips : clips.filter((c) => targets.includes(c.filename));
  if (pick.length === 0) {
    console.error(`No matching clips. Available:`);
    for (const c of clips) console.error(`  ${c.filename}`);
    process.exit(1);
  }
  console.log(`Generating ${pick.length} clip(s) on ${MODEL}`);
  for (const clip of pick) {
    try {
      await generateOne(clip);
    } catch (err) {
      console.error(`  FAILED: ${clip.filename} — ${(err as Error).message}`);
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
