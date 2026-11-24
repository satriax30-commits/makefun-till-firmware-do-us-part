// main.ts — "Till Firmware Do Us Part"
// make.fun bounty: u-azazex-till-firmware-do-us-part-32172929
//
// Writes exactly one original one-line wedding vow spoken by a robot at
// its own wedding to <output-dir>/entry.txt (default output dir is
// /output, as the grader expects).
//
// Deterministic by construction: no network, no wall-clock, no randomness.
// Node 22, stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The vow (chosen direction: a robot promising love through its own
// machine hardships — low battery, failed updates, reboots — and closing
// on the classic vow formula twisted into its own firmware).
// 114 characters, single sentence, no trailing newline in the entry file.
const VOW =
  "I promise to love you through every low battery, every failed update, and every reboot — till firmware do us part.";

// Gate: the entry must be UTF-8 text of 1-200 characters, not only
// whitespace, and a single line (the bounty is one sentence, nothing else).
function validateEntry(text: string): void {
  const length = [...text].length; // code-point count, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry length ${length} is outside the 1-200 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // One sentence: exactly one sentence-ending mark, and it ends the line.
  const terminators = text.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !/[.!?]$/.test(text)) {
    throw new Error("entry must be exactly one sentence");
  }
}

function main(): void {
  // Optional first argument overrides the output directory (used for
  // local verification runs); the grader runs with no argument and
  // gets /output/entry.txt.
  const outDir = process.argv[2] ?? "/output";
  const outPath = join(outDir, "entry.txt");

  // Validate before writing: nothing invalid ever reaches the file.
  validateEntry(VOW);

  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts the whole file content, so the
  // file is exactly the 114-character vow and nothing else.
  writeFileSync(outPath, VOW, "utf8");

  // Read-back self-check: what is on disk must be byte-identical to
  // the validated vow, and must still pass the gate.
  const back = readFileSync(outPath, "utf8");
  if (back !== VOW) {
    throw new Error("read-back mismatch: entry.txt differs from the vow");
  }
  validateEntry(back);

  console.log(`wrote ${outPath} (${[...VOW].length} chars)`);
}

main();
