#!/usr/bin/env bun
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

type Entry = {
  slug: string;
  label: string;
  url?: string;
  inlineFrom?: string;
  inlineSvg?: string;
};

const sycamoreSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="320" height="64"><text x="0" y="44" font-family="Inter Tight, sans-serif" font-weight="500" font-size="32" fill="#0E0E0C" letter-spacing="-0.5">SYCAMORE</text></svg>`;

const logos: Entry[] = [
  {
    slug: "genre",
    label: "Gen Re",
    url: "https://www.genre.com/content/dam/generalreinsuranceprogram/images/logos/genre-logo.svg",
  },
  {
    slug: "wrberkley",
    label: "W.R. Berkley",
    url: "https://www.wrberkley.com/sites/g/files/xkzibx366/files/2022-03/Berkley_logo_Header.svg",
  },
  {
    slug: "hereford",
    label: "Hereford",
    url: "https://www.herefordinsurance.com/images/logo.png",
  },
  {
    slug: "mckinsey",
    label: "McKinsey",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Mckinsey-logo.svg",
  },
  {
    slug: "sycamore",
    label: "Sycamore Partners",
    inlineSvg: sycamoreSvg,
  },
  {
    slug: "kumo",
    label: "Kumo",
    inlineFrom: "/tmp/kumo-svg.txt",
  },
  {
    slug: "google",
    label: "Google",
    url: "https://cdn.simpleicons.org/google/0E0E0C",
  },
  {
    slug: "foundation-capital",
    label: "Foundation Capital",
    url: "https://framerusercontent.com/images/fQHZuMrkJZLmCgqCfxKkzaRDHPQ.svg",
  },
  {
    slug: "y-combinator",
    label: "Y Combinator",
    url: "https://cdn.simpleicons.org/ycombinator/FF6600",
  },
];

const outDir = path.resolve(import.meta.dir, "..", "public", "logos");
await mkdir(outDir, { recursive: true });

const results: { slug: string; ext: string; status: number; bytes: number }[] = [];

for (const entry of logos) {
  if (entry.inlineSvg) {
    const dest = path.join(outDir, `${entry.slug}.svg`);
    await writeFile(dest, entry.inlineSvg);
    results.push({ slug: entry.slug, ext: "svg", status: 0, bytes: entry.inlineSvg.length });
    continue;
  }
  if (entry.inlineFrom) {
    const buf = await readFile(entry.inlineFrom, "utf-8");
    const dest = path.join(outDir, `${entry.slug}.svg`);
    await writeFile(dest, buf);
    results.push({ slug: entry.slug, ext: "svg", status: 0, bytes: buf.length });
    continue;
  }
  if (!entry.url) continue;
  const force = process.argv.includes("--force");
  const ext = entry.url.toLowerCase().includes(".png") ? "png" : "svg";
  const dest = path.join(outDir, `${entry.slug}.${ext}`);
  if (existsSync(dest) && !force) {
    results.push({ slug: entry.slug, ext, status: 0, bytes: 0 });
    continue;
  }
  const res = await fetch(entry.url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TesoraAssetFetch/1.0)" },
  });
  if (!res.ok) {
    results.push({ slug: entry.slug, ext, status: res.status, bytes: 0 });
    continue;
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  await writeFile(dest, buf);
  results.push({ slug: entry.slug, ext, status: res.status, bytes: buf.byteLength });
}

console.table(results);
