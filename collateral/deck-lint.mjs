#!/usr/bin/env node
/*
 * deck-lint — mechanical half of the deck eval.
 *
 * Reads the visible text of a self-contained deck HTML (strips <style>,
 * <script>, comments, and base64 data URIs) and flags the things a
 * chief-actuary reader treats as AI tells or credibility risks:
 *
 *   HARD (must be zero):   em/en dash, banned phrases, out-of-scope terms
 *   SOFT (review each):    hollow antithesis ("X, not Y"), rule-of-three,
 *                          hype adjectives, unsupported number-as-fact
 *
 * Usage: node deck-lint.mjs file1.html [file2.html ...]
 * Rules mirror scripts/check-voice.ts in the repo, extended for decks.
 */
import { readFileSync } from "node:fs";

const HARD_PUNCT = [
  { name: "em-dash", re: /—/g },
  { name: "en-dash", re: /–/g },
];

const BANNED_PHRASES = [
  "\\becosystem\\b", "secret sauce", "\\balumnus\\b", "\\balumna\\b",
  "small world", "world-class", "best-in-class", "cutting-edge",
  "game-?changer", "revolutioniz", "\\bseamless\\b", "\\bsynergy\\b",
  "\\bparadigm\\b", "supercharge", "\\bempower\\b",
];

// Out-of-scope actuarial vocabulary (per check-voice.ts).
const OUT_OF_SCOPE = [
  "\\bcapital modeling\\b", "\\bcat testing\\b", "\\bXOL\\b",
  "\\bcession\\b", "\\bPML\\b", "\\bcoming soon\\b", "\\bin development\\b",
];

// SOFT: hollow-antithesis constructions. One or two per doc reads as voice;
// a dozen reads as a language model. We surface every one so a human decides.
const ANTITHESIS = [
  /,\s+not\s+[a-z]/gi,
  /\bnot\s+[a-z][a-z' ]{0,30}?,?\s+(but|it'?s|the)\b/gi,
  /\binstead of\b/gi,
  /\brather than\b/gi,
  /\bisn'?t\b[^.]{0,40}\bit'?s\b/gi,
];

const HYPE = [
  "\\beffortless", "\\bmagic(al)?\\b", "\\bblazing", "\\blightning[- ]fast",
  "\\bunparalleled", "\\bunprecedented", "\\bstate[- ]of[- ]the[- ]art",
  "\\bnext[- ]generation", "\\bturnkey", "\\brobust\\b",
];

function visibleText(html) {
  return html
    .replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+/=\s]+/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&[a-z]+;/gi, " ")
    .replace(/[ \t]+/g, " ");
}

function findAll(text, patterns, label) {
  const hits = [];
  for (const p of patterns) {
    const re = typeof p === "string" ? new RegExp(p, "gi") : new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g");
    let m;
    while ((m = re.exec(text)) !== null) {
      const ctx = text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).replace(/\s+/g, " ").trim();
      hits.push({ label, match: m[0].trim(), ctx });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }
  return hits;
}

for (const file of process.argv.slice(2)) {
  const raw = readFileSync(file, "utf8");
  const text = visibleText(raw);
  const hard = [
    ...findAll(text, HARD_PUNCT.map((r) => r.re), "DASH"),
    ...findAll(text, BANNED_PHRASES, "BANNED"),
    ...findAll(text, OUT_OF_SCOPE, "OUT-OF-SCOPE"),
    ...findAll(text, HYPE, "HYPE"),
  ];
  const antithesis = findAll(text, ANTITHESIS, "ANTITHESIS");

  const name = file.split("/").pop();
  console.log(`\n=== ${name} ===`);
  console.log(`words: ${text.split(/\s+/).filter(Boolean).length}`);
  console.log(`HARD violations: ${hard.length}   |   antithesis constructions: ${antithesis.length}`);
  if (hard.length) {
    console.log("--- HARD (fix all) ---");
    for (const h of hard) console.log(`  [${h.label}] "${h.match}"  ...${h.ctx}...`);
  }
  if (antithesis.length) {
    console.log("--- ANTITHESIS (thin to 1-2 strongest) ---");
    for (const a of antithesis) console.log(`  · ${a.ctx}`);
  }
}
