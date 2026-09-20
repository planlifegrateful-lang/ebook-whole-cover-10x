#!/usr/bin/env node
/**
 * Zero-dep CI validator for ebook-whole-cover-10x
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
  console.log("  OK  " + msg);
}
function fail(msg) {
  console.error("  FAIL  " + msg);
  failed += 1;
}

console.log("\n> ebook-whole-cover-10x CI validate\n");

console.log("Required files");
for (const rel of required) {
  if (existsSync(resolve(root, rel))) ok(rel);
  else fail("missing: " + rel);
}

console.log("\nBookCoverView surface");
const coverPath = resolve(root, "src/components/BookCoverView.jsx");
if (existsSync(coverPath)) {
  const src = readFileSync(coverPath, "utf8");
  const checks = [
    ["default export", "export default function BookCoverView"],
    ["3D tilt state", "tilting"],
    ["flip state", "flipped"],
    ["export PNG", "exportSpread"],
    ["ISBN barcode", "isbn"],
    ["print support", "printSpread"],
    ["size variants", "sizeMap"],
  ];
  for (const [label, needle] of checks) {
    if (src.includes(needle) || src.toLowerCase().includes(needle.toLowerCase())) ok(label);
    else fail("BookCoverView missing: " + label);
  }
  if (src.length < 2000) fail("BookCoverView suspiciously small");
  else ok("size " + src.length + " bytes");
}

console.log("\nBookCardWithWholeCover surface");
const cardPath = resolve(root, "src/components/BookCardWithWholeCover.jsx");
if (existsSync(cardPath)) {
  const src = readFileSync(cardPath, "utf8");
  if (src.includes("BookCoverView")) ok("imports BookCoverView");
  else fail("does not import BookCoverView");
  if (src.includes("onMouseEnter") || src.includes("showSpread")) ok("hover preview");
  else fail("missing hover preview");
  if (src.includes("export default")) ok("default export");
  else fail("missing default export");
}

console.log("\nIntegration patch");
const patchPath = resolve(root, "patches/BookReader-integration.md");
if (existsSync(patchPath)) {
  const src = readFileSync(patchPath, "utf8");
  if (src.includes("localStorage") || src.includes("wholeCoverSeen")) ok("auto-open localStorage");
  else fail("missing auto-open instructions");
  if (src.includes("showWholeCover")) ok("toggle state");
  else fail("missing toggle state");
  if (src.includes("AnimatePresence") || src.includes("BookCoverView")) ok("hero integration");
  else fail("missing hero integration block");
}

console.log("");
if (failed > 0) {
  console.error("FAILED: " + failed + " check(s)\n");
  process.exit(1);
}
console.log("ALL CHECKS PASSED\n");
process.exit(0);
