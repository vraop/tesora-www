#!/usr/bin/env bun
/*
 * check-voice — enforce the voice/content rules from docs/review-rubric.md.
 *
 * Scans user-facing surface for banned punctuation, banned phrases, and
 * banned content. Reports violations with file:line and exits non-zero.
 *
 * Attribution tags in the rubric:
 *   [PB] Philo Bishay (CPO, former chief actuary) — non-negotiable
 *   [VR] Vivek Rao (CEO)
 */

import { readdir, readFile } from "node:fs/promises";
import { statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");

// Files to scan. Astro pages + components + the llms.txt + key markdown.
const SCAN_GLOBS = [
  "src/pages",
  "src/components",
  "src/layouts",
  "public/llms.txt",
];

const SCAN_EXT = new Set([".astro", ".md", ".mdx", ".html", ".txt"]);

// Banned punctuation. Em dash + en dash anywhere in user-facing copy.
// We allow them inside HTML comments (never rendered) and inside <style>/<script>.
type PunctRule = { name: string; re: RegExp; reason: string };
const BANNED_PUNCT: PunctRule[] = [
  { name: "em-dash", re: /\u2014/g, reason: "[PB] no em dashes; use period/comma/parens" },
  { name: "en-dash", re: /\u2013/g, reason: "[PB] no en dashes; use period/comma/parens" },
];

// Banned phrases (zero-tolerance). Case-insensitive, word-boundary where useful.
type PhraseRule = { phrase: string; reason: string; flags?: string };
const BANNED_PHRASES: PhraseRule[] = [
  { phrase: "\\balumnus\\b", reason: "[PB] say 'alum' instead" },
  { phrase: "\\balumna\\b", reason: "[PB] say 'alum' instead" },
  { phrase: "\\becosystem\\b", reason: "[PB] banned; restructure (allowed only when quoting outside source)" },
  { phrase: "small world", reason: "[PB] warm-thread fabrication" },
  { phrase: "secret sauce", reason: "[PB] call-feedback tell; no marketing cliche" },
  { phrase: "caught my eye", reason: "[PB] warm-thread fabrication" },
  { phrase: "real respect for that", reason: "[PB] over-familiar" },
  { phrase: "hell of a thing", reason: "[PB] over-familiar" },
  { phrase: "kind of trajectory is hard-earned", reason: "[PB] over-familiar" },
  { phrase: "grab coffee, CEO to CEO", reason: "[PB] over-familiar" },
  { phrase: "finance-world", reason: "[PB] hyphenated; rewrite" },
  { phrase: "actuarial-world", reason: "[PB] hyphenated; rewrite" },
  { phrase: "your name came up", reason: "[PB] fabricated warm thread" },
  { phrase: "I came across your profile", reason: "[PB] fabricated warm thread" },
];

// Banned content. Capital modeling vocabulary is OUT.
const BANNED_CONTENT: PhraseRule[] = [
  { phrase: "\\bcapital modeling\\b", reason: "[PB] out of scope — Workbench covers loss modeling/GLMs/reserving/market research/rating deployment/audit" },
  { phrase: "\\bcat testing\\b", reason: "[PB] out of scope" },
  { phrase: "\\bXOL\\b", reason: "[PB] out of scope", flags: "" },
  { phrase: "\\bcession\\b", reason: "[PB] out of scope" },
  { phrase: "\\bPML\\b", reason: "[PB] out of scope", flags: "" },
  { phrase: "\\bcoming soon\\b", reason: "[PB] no hedging — ship it or cut the line" },
  { phrase: "\\bin development\\b", reason: "[PB] no hedging — ship it or cut the line" },
  { phrase: "\\bnext release\\b", reason: "[PB] no hedging" },
];

// Greeting format check (anywhere outbound-shaped copy lives).
// We flag literal "Hi <First>" or "Dear <First>" since the rule is "<First>,".
const GREETING_RULES: PhraseRule[] = [
  { phrase: "^\\s*Hi [A-Z][a-z]+,", reason: "[PB] greeting must be '<First>,' not 'Hi <First>,'", flags: "m" },
  { phrase: "^\\s*Dear [A-Z][a-z]+,", reason: "[PB] greeting must be '<First>,' not 'Dear <First>,'", flags: "m" },
];

// AI vocabulary tells — the deterministic subset of the `ai-check` skill's
// Signal A (perplexity / canonical AI vocabulary). These are ADVISORY, not
// blocking: a single "robust" in a privacy policy is not worth failing a build
// over, but authors should see it and reach for a sharper word. For the
// judgment-level signals a regex can't catch (burstiness, rhetorical
// scaffolding, register collapse), run the /ai-check skill on the draft.
const AI_VOCAB: PhraseRule[] = [
  { phrase: "\\bdelve\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bleverage\\b", reason: "[ai-check] canonical AI vocabulary; try 'use'" },
  { phrase: "\\butilize\\b", reason: "[ai-check] canonical AI vocabulary; try 'use'" },
  { phrase: "\\brobust\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bcomprehensive\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bstreamline\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bfoster\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bfacilitate\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bpivotal\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bnuanced\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bmultifaceted\\b", reason: "[ai-check] canonical AI vocabulary" },
  { phrase: "\\bcutting-edge\\b", reason: "[ai-check] marketing cliche" },
  { phrase: "\\bseamless(ly)?\\b", reason: "[ai-check] marketing cliche" },
  { phrase: "\\bempower(s|ing|ed)?\\b", reason: "[ai-check] marketing cliche" },
  { phrase: "in the realm of", reason: "[ai-check] canonical AI phrase" },
  { phrase: "the landscape of", reason: "[ai-check] canonical AI phrase" },
  { phrase: "a myriad of", reason: "[ai-check] canonical AI phrase" },
  { phrase: "a plethora of", reason: "[ai-check] canonical AI phrase" },
  { phrase: "fast-paced world", reason: "[ai-check] canonical AI opener" },
  { phrase: "it is worth noting", reason: "[ai-check] institutional hedge" },
  { phrase: "it is important to note", reason: "[ai-check] institutional hedge" },
];

// Strip regions we should not lint, preserving offsets so line:col stays accurate:
//   - HTML comments <!-- ... -->
//   - <style>, <script> blocks
//   - JSX comments {/* ... */} (Astro/React, never rendered)
//   - Astro frontmatter (everything between the first pair of --- fences),
//     where // and /* */ comments are TypeScript and don't reach the page
function blank(m: string): string {
  return m.replace(/[^\n]/g, " ");
}

function stripIgnored(src: string): string {
  let out = src
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<style[\s\S]*?<\/style>/gi, blank)
    .replace(/<script[\s\S]*?<\/script>/gi, blank)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank);

  // Astro frontmatter: leading ---\n ... \n---
  const fm = out.match(/^---\n[\s\S]*?\n---/);
  if (fm) {
    out = blank(fm[0]) + out.slice(fm[0].length);
  }
  return out;
}

type Violation = {
  file: string;
  line: number;
  col: number;
  rule: string;
  snippet: string;
  severity: "error" | "advisory";
};

function findLineCol(src: string, index: number): { line: number; col: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < index; i++) {
    if (src[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, col };
}

function snippetAt(src: string, index: number, len: number): string {
  const start = Math.max(0, index - 20);
  const end = Math.min(src.length, index + len + 20);
  return src.slice(start, end).replace(/\s+/g, " ").trim();
}

function scan(file: string, src: string): Violation[] {
  const sanitized = stripIgnored(src);
  const out: Violation[] = [];

  const collect = (
    rules: { name?: string; phrase?: string; re?: RegExp; reason: string; flags?: string }[],
    severity: "error" | "advisory",
  ) => {
    for (const r of rules) {
      const re = r.re ?? new RegExp(r.phrase!, (r.flags ?? "gi"));
      const reGlobal = re.flags.includes("g") ? re : new RegExp(re.source, re.flags + "g");
      let m: RegExpExecArray | null;
      reGlobal.lastIndex = 0;
      while ((m = reGlobal.exec(sanitized)) !== null) {
        const { line, col } = findLineCol(sanitized, m.index);
        out.push({
          file,
          line,
          col,
          rule: r.reason,
          snippet: snippetAt(src, m.index, m[0].length),
          severity,
        });
        if (m.index === reGlobal.lastIndex) reGlobal.lastIndex++;
      }
    }
  };

  collect(BANNED_PUNCT, "error");
  collect(BANNED_PHRASES, "error");
  collect(BANNED_CONTENT, "error");
  collect(GREETING_RULES, "error");
  collect(AI_VOCAB, "advisory");

  return out;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (SCAN_EXT.has(path.extname(full))) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const files: string[] = [];
  for (const g of SCAN_GLOBS) {
    const full = path.join(ROOT, g);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) files.push(...(await walk(full)));
    else if (SCAN_EXT.has(path.extname(full))) files.push(full);
  }

  const allViolations: Violation[] = [];
  for (const f of files) {
    const src = await readFile(f, "utf8");
    allViolations.push(...scan(f, src));
  }

  const errors = allViolations.filter((v) => v.severity === "error");
  const advisories = allViolations.filter((v) => v.severity === "advisory");

  const report = (violations: Violation[], heading: string, stream: (s: string) => void) => {
    const grouped = new Map<string, Violation[]>();
    for (const v of violations) {
      const rel = path.relative(ROOT, v.file);
      if (!grouped.has(rel)) grouped.set(rel, []);
      grouped.get(rel)!.push(v);
    }
    stream(`${heading} — ${violations.length} in ${grouped.size} file(s):\n`);
    for (const [file, vs] of grouped) {
      stream(`  ${file}`);
      for (const v of vs) {
        stream(`    ${v.line}:${v.col}  ${v.rule}`);
        stream(`      › ${v.snippet}`);
      }
      stream("");
    }
  };

  // Advisories never fail the build. They surface the deterministic AI tells
  // (ai-check Signal A) so authors can sharpen copy without blocking a ship.
  if (advisories.length > 0) {
    report(advisories, "check:voice — AI-vocabulary advisories", (s) => console.warn(s));
    console.warn(`Run the /ai-check skill on new long-form copy for the signals a regex can't catch.\n`);
  }

  if (errors.length === 0) {
    console.log(
      `check:voice — clean. scanned ${files.length} files` +
        (advisories.length > 0 ? ` (${advisories.length} advisory item(s) above).` : "."),
    );
    process.exit(0);
  }

  report(errors, "check:voice", (s) => console.error(s));
  console.error(`See docs/review-rubric.md for the full rules.`);
  process.exit(1);
}

main().catch((err) => {
  console.error("check:voice failed:", err);
  process.exit(2);
});
