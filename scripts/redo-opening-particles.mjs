#!/usr/bin/env node
/**
 * Rebuilds p0–p199 in opening.json with simple 3-keyframe motion.
 * Keeps anchor_a, anchor_b, gist_logo, background unchanged.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "opening.json");

const W = 402;
const H = 874;
const OP = 228;
const N = 200;
const ANCHOR_A = [183.645, 402.89, 0];
const ANCHOR_B = [304.115, 470.06, 0];
const FILL_C = [0.1137, 0.1137, 0.1059, 1];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function r1(n) {
  return Math.round(n * 10) / 10;
}

const EASE_DRIFT = {
  o: { x: [0.333], y: [0] },
  i: { x: [0.667], y: [1] },
};

const EASE_GATHER = {
  o: { x: [0.167], y: [0.167] },
  i: { x: [0.833], y: [0.833] },
};

const OPACITY_K = [
  { t: 0, s: [0], h: 1 },
  {
    t: 7,
    s: [38],
    h: 0,
    o: { x: [0.333], y: [0] },
    i: { x: [0.667], y: [1] },
  },
  {
    t: 60,
    s: [38],
    h: 0,
    o: { x: [0.675], y: [0.19] },
    i: { x: [0.55], y: [0.055] },
  },
  { t: 120, s: [0] },
];

function particleLayer(i, rand) {
  const margin = 4;
  const target = i % 2 === 0 ? ANCHOR_A : ANCHOR_B;
  const x0 = rand() * (W - 2 * margin) + margin;
  const y0 = rand() * (H - 2 * margin) + margin;
  const x1 = clamp(x0 + (rand() - 0.5) * 140, margin, W - margin);
  const y1 = clamp(y0 + (rand() - 0.5) * 140, margin, H - margin);

  return {
    ty: 4,
    nm: `p${i}`,
    ind: i + 1,
    st: 0,
    ip: 0,
    op: OP,
    sr: 1,
    ks: {
      o: { a: 1, k: OPACITY_K, ix: 11 },
      r: { a: 0, k: 0, ix: 10 },
      p: {
        a: 1,
        ix: 2,
        k: [
          {
            t: 0,
            s: [r1(x0), r1(y0), 0],
            h: 0,
            o: EASE_DRIFT.o,
            i: EASE_DRIFT.i,
          },
          {
            t: 60,
            s: [r1(x1), r1(y1), 0],
            h: 0,
            o: EASE_GATHER.o,
            i: EASE_GATHER.i,
          },
          { t: 120, s: [r1(target[0]), r1(target[1]), 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0], ix: 1 },
      s: { a: 0, k: [100, 100, 100], ix: 6 },
    },
    shapes: [
      {
        ty: "el",
        nm: "dot",
        d: 1,
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [1.7, 1.7] },
      },
      {
        ty: "fl",
        nm: "fill",
        c: { a: 0, k: [...FILL_C] },
        o: { a: 0, k: 100 },
        r: 1,
      },
    ],
  };
}

const j = JSON.parse(readFileSync(file, "utf8"));
const tail = j.layers.slice(N);
if (tail.length !== 4 || tail[0].nm !== "anchor_a") {
  throw new Error("Unexpected layers after p199");
}

const rand = mulberry32(0x505050);
const particles = [];
for (let i = 0; i < N; i++) particles.push(particleLayer(i, rand));

j.layers = [...particles, ...tail];
writeFileSync(file, `${JSON.stringify(j, null, 2)}\n`, "utf8");
console.log("Updated", file);
