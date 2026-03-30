#!/usr/bin/env node
/**
 * Regenerates docs/lottie/opening-light-ios.json from a known Bodymovin export
 * (LottieFiles template). Requires network on first run to download template.
 *
 * Usage: node scripts/generate-opening-light-ios.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "docs", "lottie");
const outFile = join(outDir, "opening-light-ios.json");
const cache = join(root, "scripts", ".lottie-template-cache.json");
const TEMPLATE_URL = "https://assets2.lottiefiles.com/packages/lf20_aEFaHc.json";

async function loadTemplate() {
  if (existsSync(cache)) {
    return JSON.parse(readFileSync(cache, "utf8"));
  }
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error(`Failed to fetch template: ${res.status}`);
  const json = await res.json();
  mkdirSync(dirname(cache), { recursive: true });
  writeFileSync(cache, JSON.stringify(json), "utf8");
  return json;
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function makeDotGroup(templateGroup, cx, cy, name, ix) {
  const g = clone(templateGroup);
  g.nm = name;
  g.ix = ix;
  g.it[0].s = {
    a: 1,
    k: [
      { t: 0, s: [8, 8] },
      { t: 30, s: [8, 8] },
      { t: 60, s: [36, 36] },
    ],
    ix: 2,
  };
  g.it[1].c = {
    a: 0,
    k: [1, 0.3764705882352941, 0.18823529411764706, 1],
    ix: 4,
  };
  g.it[2].p = { a: 0, k: [cx, cy], ix: 2 };
  return g;
}

const src = await loadTemplate();
const baseLayer = src.layers.find((L) => L.nm === "Circle-01");
if (!baseLayer) throw new Error("Template missing Circle-01 layer");
const templateGroup = clone(baseLayer.shapes[0]);

const dots = {
  ddd: 0,
  ind: 2,
  ty: 4,
  nm: "Orange dots",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [100] },
        { t: 81, s: [100] },
        { t: 114, s: [0] },
      ],
      ix: 11,
    },
    r: { a: 0, k: 0, ix: 10 },
    p: { a: 0, k: [0, 0, 0], ix: 2 },
    a: { a: 0, k: [0, 0, 0], ix: 1 },
    s: { a: 0, k: [100, 100, 100], ix: 6 },
  },
  ao: 0,
  shapes: [
    makeDotGroup(templateGroup, 183.645, 402.89, "Dot A", 1),
    makeDotGroup(templateGroup, 304.115, 470.06, "Dot B", 2),
  ],
  ip: 0,
  op: 114,
  st: 0,
  bm: 0,
};

const bg = {
  ddd: 0,
  ind: 1,
  ty: 1,
  nm: "Background",
  sr: 1,
  ks: {
    o: { a: 0, k: 100, ix: 11 },
    r: { a: 0, k: 0, ix: 10 },
    p: { a: 0, k: [201, 437, 0], ix: 2 },
    a: { a: 0, k: [201, 437, 0], ix: 1 },
    s: { a: 0, k: [100, 100, 100], ix: 6 },
  },
  ao: 0,
  sw: 402,
  sh: 874,
  sc: "#f0ebe7",
  ip: 0,
  op: 114,
  st: 0,
  bm: 0,
};

const out = {
  v: "5.5.4",
  fr: 30,
  ip: 0,
  op: 114,
  w: 402,
  h: 874,
  nm: "OpeningLight",
  ddd: 0,
  assets: [],
  layers: [bg, dots],
  markers: [],
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log("Wrote", outFile);
