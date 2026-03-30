#!/usr/bin/env node
/**
 * Builds lottie/opening.json with a Particles layer that approximates
 * OpeningAnimationCanvas.tsx (402×874, light theme), using a fixed RNG seed.
 *
 * Usage: node scripts/generate-opening-lottie.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outFile = join(root, "lottie", "opening.json");

/** Lower (e.g. 90) for a smaller JSON upload; 160 matches OpeningAnimationCanvas at 402×874 */
const PARTICLE_CAP = 160;

const W = 402;
const H = 874;
const FR = 30;
const OP = 114;
const NOISE_MS = 1000;
const GATHER_MS = 1000;
const HOLD_END_MS = NOISE_MS + GATHER_MS + 700;
const HOLD_END_FRAME = Math.round((HOLD_END_MS / 1000) * FR);

const DOT_A = { x: 183.645, y: 402.89 };
const DOT_B = { x: 304.115, y: 470.06 };

const PARTICLE_RGB = [29 / 255, 29 / 255, 27 / 255];
const PARTICLE_DIAM = 0.85 * 2;

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function particleCount() {
  return Math.min(PARTICLE_CAP, Math.min(720, Math.max(160, Math.floor((W * H) / 3800))));
}

function simulate(seed) {
  const rand = mulberry32(seed);
  const n = particleCount();
  const parts = [];
  for (let i = 0; i < n; i++) {
    parts.push({
      x: rand() * W,
      y: rand() * H,
      vx: (rand() - 0.5) * 2.4,
      vy: (rand() - 0.5) * 2.4,
      targetIdx: i % 2,
      captured: false,
      sx: 0,
      sy: 0,
    });
  }

  const targets = [DOT_A, DOT_B];
  const dtMs = 1000 / FR;
  const tScale = dtMs / 16;

  const noiseSteps = Math.round((NOISE_MS / 1000) * FR);
  const trailFrames = [0, 5, 10, 15, 20, 25, 30];

  /** @type {{ t: number; pos: { x: number; y: number }[] }[]} */
  const snapshots = [];

  for (let step = 0; step <= noiseSteps; step++) {
    const elapsed = step * dtMs;

    if (trailFrames.includes(step)) {
      snapshots.push({
        t: step,
        pos: parts.map((p) => ({ x: p.x, y: p.y })),
      });
    }

    if (step === noiseSteps) break;

    for (const p of parts) {
      p.x += p.vx * tScale;
      p.y += p.vy * tScale;
      p.vx += (rand() - 0.5) * 0.12;
      p.vy += (rand() - 0.5) * 0.12;
      p.vx *= 0.992;
      p.vy *= 0.992;
      const margin = 2;
      if (p.x < margin) {
        p.x = margin;
        p.vx *= -0.82;
      }
      if (p.x > W - margin) {
        p.x = W - margin;
        p.vx *= -0.82;
      }
      if (p.y < margin) {
        p.y = margin;
        p.vy *= -0.82;
      }
      if (p.y > H - margin) {
        p.y = H - margin;
        p.vy *= -0.82;
      }
    }
  }

  for (const p of parts) {
    p.sx = p.x;
    p.sy = p.y;
    p.captured = true;
  }

  const gatherEnd = noiseSteps + Math.round((GATHER_MS / 1000) * FR);
  for (let step = noiseSteps + 1; step <= gatherEnd; step++) {
    const elapsed = step * dtMs;
    const afterNoise = elapsed - NOISE_MS;
    const gatherT = Math.min(1, afterNoise / GATHER_MS);
    const e = easeOutCubic(gatherT);
    for (const p of parts) {
      const tx = targets[p.targetIdx].x;
      const ty = targets[p.targetIdx].y;
      p.x = p.sx + (tx - p.sx) * e;
      p.y = p.sy + (ty - p.sy) * e;
    }
    if (step === gatherEnd) {
      snapshots.push({
        t: 60,
        pos: parts.map((p) => ({ x: p.x, y: p.y })),
      });
    }
  }

  return { parts, snapshots };
}

function round2(n) {
  return Math.round(n * 1000) / 1000;
}

const EASE_OUT = {
  o: { x: [0.167], y: [0.167] },
  i: { x: [0.833], y: [0.833] },
};

function buildPositionKeyframes(snapshots, particleIndex) {
  const k = [];
  const trail = snapshots.filter((s) => s.t <= 30);
  for (let i = 0; i < trail.length; i++) {
    const s = trail[i];
    const { x, y } = s.pos[particleIndex];
    const kf = { t: s.t, s: [round2(x), round2(y)] };
    if (i < trail.length - 1) {
      kf.h = 0;
      kf.o = { x: [0.333], y: [0] };
      kf.i = { x: [0.667], y: [1] };
    } else {
      kf.h = 0;
      kf.o = EASE_OUT.o;
      kf.i = EASE_OUT.i;
    }
    k.push(kf);
  }
  const end = snapshots.find((s) => s.t === 60);
  if (end) {
    const { x, y } = end.pos[particleIndex];
    k.push({ t: 60, s: [round2(x), round2(y)] });
  }
  return k;
}

function makeParticleGroup(ix, particleIndex, snapshots) {
  return {
    ty: "gr",
    nm: `p_${particleIndex}`,
    it: [
      {
        ty: "el",
        nm: "Ellipse Path 1",
        d: 1,
        p: { a: 0, k: [0, 0], ix: 3 },
        s: { a: 0, k: [PARTICLE_DIAM, PARTICLE_DIAM], ix: 2 },
      },
      {
        ty: "fl",
        nm: "Fill 1",
        c: { a: 0, k: [...PARTICLE_RGB], ix: 4 },
        o: { a: 0, k: 38, ix: 5 },
        r: 1,
        bm: 0,
      },
      {
        ty: "tr",
        nm: "Transform",
        p: { a: 1, k: buildPositionKeyframes(snapshots, particleIndex), ix: 2 },
        a: { a: 0, k: [0, 0], ix: 1 },
        s: { a: 0, k: [100, 100], ix: 3 },
        r: { a: 0, k: 0, ix: 6 },
        o: { a: 0, k: 100, ix: 7 },
        sk: { a: 0, k: 0 },
        sa: { a: 0, k: 0 },
      },
    ],
    np: 3,
    cix: 2,
    bm: 0,
    ix,
    mn: "ADBE Vector Group",
    hd: false,
  };
}

function fadeOpacityKs() {
  return {
    a: 1,
    k: [
      { t: 0, s: [100], h: 1 },
      {
        t: 81,
        s: [100],
        h: 0,
        o: { x: [0.333], y: [0] },
        i: { x: [0.667], y: [1] },
      },
      { t: 114, s: [0] },
    ],
    ix: 11,
  };
}

function main() {
  const seed = 0x4f50454e;
  const { parts, snapshots } = simulate(seed);
  const n = parts.length;

  const particleShapes = [];
  for (let i = 0; i < n; i++) {
    particleShapes.push(makeParticleGroup(i + 1, i, snapshots));
  }

  const bg = {
    ddd: 0,
    ind: 1,
    ty: 1,
    nm: "Background",
    sr: 1,
    ks: {
      o: fadeOpacityKs(),
      r: { a: 0, k: 0, ix: 10 },
      p: { a: 0, k: [201, 437, 0], ix: 2 },
      a: { a: 0, k: [201, 437, 0], ix: 1 },
      s: { a: 0, k: [100, 100, 100], ix: 6 },
    },
    ao: 0,
    sw: W,
    sh: H,
    sc: "#f0ebe7",
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
  };

  /** Layer opacity × fill 38% ≈ app alpha; ramp = noiseFade; 30–60 = gather dim (×0.6). */
  const particleLayerOpacity = {
    a: 1,
    ix: 11,
    k: [
      { t: 0, s: [0], h: 1 },
      {
        t: 4,
        s: [100],
        h: 0,
        o: { x: [0.333], y: [0] },
        i: { x: [0.667], y: [1] },
      },
      {
        t: 30,
        s: [100],
        h: 0,
        o: EASE_OUT.o,
        i: EASE_OUT.i,
      },
      { t: 60, s: [60] },
    ],
  };

  const particlesLayer = {
    ddd: 0,
    ind: 2,
    ty: 4,
    nm: "Particles",
    sr: 1,
    ks: {
      o: particleLayerOpacity,
      r: { a: 0, k: 0, ix: 10 },
      p: { a: 0, k: [0, 0, 0], ix: 2 },
      a: { a: 0, k: [0, 0, 0], ix: 1 },
      s: { a: 0, k: [100, 100, 100], ix: 6 },
    },
    ao: 0,
    shapes: particleShapes,
    ip: 0,
    op: HOLD_END_FRAME,
    st: 0,
    bm: 0,
  };

  const orangeDots = {
    ddd: 0,
    ind: 3,
    ty: 4,
    nm: "Orange dots",
    sr: 1,
    ks: {
      o: fadeOpacityKs(),
      r: { a: 0, k: 0, ix: 10 },
      p: { a: 0, k: [0, 0, 0], ix: 2 },
      a: { a: 0, k: [0, 0, 0], ix: 1 },
      s: { a: 0, k: [100, 100, 100], ix: 6 },
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        nm: "Dot A",
        it: [
          {
            ty: "el",
            nm: "Ellipse Path 1",
            d: 1,
            p: { a: 0, k: [0, 0], ix: 3 },
            s: {
              a: 1,
              k: [
                { t: 0, s: [8, 8], h: 1 },
                {
                  t: 30,
                  s: [8, 8],
                  h: 0,
                  o: EASE_OUT.o,
                  i: EASE_OUT.i,
                },
                { t: 60, s: [36, 36] },
              ],
              ix: 2,
            },
          },
          {
            ty: "fl",
            nm: "Fill 1",
            c: {
              a: 0,
              k: [1, 0.3764705882352941, 0.18823529411764706],
              ix: 4,
            },
            o: { a: 0, k: 100, ix: 5 },
            r: 1,
            bm: 0,
          },
          {
            ty: "tr",
            nm: "Transform",
            p: { a: 0, k: [DOT_A.x, DOT_A.y], ix: 2 },
            a: { a: 0, k: [0, 0], ix: 1 },
            s: { a: 0, k: [100, 100], ix: 3 },
            r: { a: 0, k: 0, ix: 6 },
            o: { a: 0, k: 100, ix: 7 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
          },
        ],
        np: 3,
        cix: 2,
        bm: 0,
        ix: 1,
        mn: "ADBE Vector Group",
        hd: false,
      },
      {
        ty: "gr",
        nm: "Dot B",
        it: [
          {
            ty: "el",
            nm: "Ellipse Path 1",
            d: 1,
            p: { a: 0, k: [0, 0], ix: 3 },
            s: {
              a: 1,
              k: [
                { t: 0, s: [8, 8], h: 1 },
                {
                  t: 30,
                  s: [8, 8],
                  h: 0,
                  o: EASE_OUT.o,
                  i: EASE_OUT.i,
                },
                { t: 60, s: [36, 36] },
              ],
              ix: 2,
            },
          },
          {
            ty: "fl",
            nm: "Fill 1",
            c: {
              a: 0,
              k: [1, 0.3764705882352941, 0.18823529411764706],
              ix: 4,
            },
            o: { a: 0, k: 100, ix: 5 },
            r: 1,
            bm: 0,
          },
          {
            ty: "tr",
            nm: "Transform",
            p: { a: 0, k: [DOT_B.x, DOT_B.y], ix: 2 },
            a: { a: 0, k: [0, 0], ix: 1 },
            s: { a: 0, k: [100, 100], ix: 3 },
            r: { a: 0, k: 0, ix: 6 },
            o: { a: 0, k: 100, ix: 7 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
          },
        ],
        np: 3,
        cix: 2,
        bm: 0,
        ix: 2,
        mn: "ADBE Vector Group",
        hd: false,
      },
    ],
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
  };

  const out = {
    v: "5.7.4",
    fr: FR,
    ip: 0,
    op: OP,
    w: W,
    h: H,
    nm: "Opening Gist light",
    ddd: 0,
    assets: [],
    markers: [
      { cm: "noise 0-30f", tm: 0, dr: 0 },
      { cm: "gather 30-60f", tm: 30, dr: 0 },
      { cm: "particles end 81f", tm: HOLD_END_FRAME, dr: 0 },
      { cm: "fade 81-114f", tm: 81, dr: 0 },
    ],
    layers: [bg, particlesLayer, orangeDots],
  };

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(out)}\n`, "utf8");
  console.log("Wrote", outFile, `(${n} particles)`);
}

main();
