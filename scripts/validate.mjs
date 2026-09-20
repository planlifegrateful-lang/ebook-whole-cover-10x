#!/usr/bin/env node
/**
 * Zero-dep CI validator for ebook-whole-cover-10x
 * Checks required files, basic syntax, and export surface.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "src/components/BookCoverView.jsx",
  "src/components/BookCardWithWholeCover.jsx",
  "patches/BookReader-integration.md",
  "INSTALL.md",
  "README.md",
  "package.json",
];

let failed = 0;

function ok(msg) {
  console.log(`  \u2713 ${msg}`);
}
function fail(msg) {
  console.error(`  \u2717 ${msg}`);
  failed += 1;
}

console.log("\n\u25b8 ebook-whole-cover-10x CI validate\n");

// 1. Required files
console.log("Required files");
for (const rel of required) {
  const p = resolve(root, rel);
  if (existsSync(p)) ok(rel);
  else fail(`missing: ${rel}`);
}

// 2. BookCoverView surface
console.log("\nBookCoverView surface");
const coverPath = resolve(root, "src/components/BookCoverView.jsx");
if (existsSync(coverPath)) {
  const src = readFileSync(coverPath, "utf8");
  const checks = [
    ["default export", /export\s+default\s+function\s+BookCoverView/],
    ["3D tilt state", /tilting/],
    ["flip state", /flipped/],
    ["export PNG", /exportSpread|html2canvas/],
    ["ISBN barcode", /isbn/i],
    ["print support", /printSpread|@media print/],
    ["size variants", /sizeMap|size\s*=\s*["']md["']/],
  ];
  for (const [label, re] of checks) {
    if (re.test(src)) ok(label);
    else fail(`BookCoverView missing: ${label}`);
  }
  if (src.length < 2000) fail("BookCoverView suspiciously small");
  else ok(`size ${src.length} bytes`);
}

// 3. BookCard surface
console.log("\nBookCardWithWholeCover surface");
const cardPath = resolve(root, "src/components/BookCardWithWholeCover.jsx");
if (existsSync(cardPath)) {
  const src = readFileSync(cardPath, "utf8");
  if (/BookCoverView/.test(src)) ok("imports BookCoverView");
  else fail("does not import BookCoverView");
  if (/onMouseEnter|showSpread/.test(src)) ok("hover preview");
  else fail("missing hover preview");
  if (/export\s+default/.test(src)) ok("default export");
  else fail("missing default export");
}

// 4. Integration patch has auto-open
console.log("\nIntegration patch");
const patchPath = resolve(root, "patches/BookReader-integration.md");
if (existsSync(patchPath)) {
  const src = readFileSync(patchPath, "utf8");
  if (/localStorage|wholeCoverSeen/.test(src)) ok("auto-open localStorage");
  else fail("missing auto-open instructions");
  if (/showWholeCover/.test(src)) ok("toggle state");
  else fail("missing toggle state");
  if (/AnimatePresence|BookCoverView/.test(src)) ok("hero integration");
  else fail("missing hero integration block");
}

// Summary
console.log("");
if (failed > 0) {
  console.error(`FAILED: ${failed} check(s)\n`);
  process.exit(1);
}
console.log("ALL CHECKS PASSED\n");
process.exit(0);
