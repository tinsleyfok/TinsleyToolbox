#!/usr/bin/env node
/**
 * Generates public/Animation/Bounce.light.json and Bounce.dark.json
 * from the same bounce timing as ReferralEntryPage (Framer Motion) and
 * IconGift SVG path (stroke), with theme stroke colors.
 *
 * Usage: node scripts/generate-bounce-lottie.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { samplePath, polylineToLottiePath } from "./lottie-svg-path-sample.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "Animation");

/** Same `d` as `IconGift` in src/pages/ReferralEntryPage.tsx */
const GIFT_PATH_D =
  "M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z";

const FR = 30;
const BOUNCE_S = 1.1;
const REPEAT_DELAY_S = 1.6;
const BOUNCE_FRAMES = Math.round(BOUNCE_S * FR);
const OP = BOUNCE_FRAMES + Math.round(REPEAT_DELAY_S * FR);
const SIZE = 24;

const T = [0, 0.28, 0.5, 0.72, 0.9, 1];
const Y_OFF = [0, -SIZE * 0.25, 0, -SIZE * 0.1, 0, 0];
const SX = [1, 0.94, 1.22, 0.98, 1.04, 1];
const SY = [1, 1.1, 0.82, 1.04, 0.98, 1];

function bi() {
  return { o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 } };
}

function static2D(x, y) {
  return { a: 0, k: [x, y] };
}

function staticNum(v) {
  return { a: 0, k: v };
}

function anim2D(frames) {
  return {
    a: 1,
    k: frames.map(({ t, x, y }) => ({ ...bi(), s: [x, y], t })),
  };
}

function buildTransformKeyframes(ay) {
  const byT = new Map();
  for (let j = 0; j < T.length; j++) {
    const t = Math.round(T[j] * BOUNCE_FRAMES);
    byT.set(t, {
      t,
      x: SIZE / 2,
      y: ay + Y_OFF[j],
      sx: SX[j] * 100,
      sy: SY[j] * 100,
    });
  }
  const keys = [...byT.values()].sort((a, b) => a.t - b.t);
  const last = keys[keys.length - 1];
  if (last.t < OP) {
    keys.push({ t: OP, x: SIZE / 2, y: ay, sx: 100, sy: 100 });
  }
  return {
    p: anim2D(keys.map((f) => ({ t: f.t, x: f.x, y: f.y }))),
    s: anim2D(keys.map((f) => ({ t: f.t, x: f.sx, y: f.sy }))),
  };
}

function buildLottie(subpaths, strokeRgb, name) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const sp of subpaths) {
    for (const p of sp) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
  }
  const ax = (minX + maxX) / 2;
  const ay = maxY;
  const { p, s } = buildTransformKeyframes(ay);

  const stroke = {
    ty: "st",
    bm: 0,
    hd: false,
    nm: "Stroke",
    lc: 2,
    lj: 2,
    ml: 4,
    o: { a: 0, k: 100 },
    w: { a: 0, k: 1.75 },
    c: { a: 0, k: strokeRgb },
  };

  const tr = {
    ty: "tr",
    a: static2D(ax, ay),
    s,
    sk: staticNum(0),
    p,
    r: staticNum(0),
    sa: staticNum(0),
    o: staticNum(100),
  };

  const shapes = subpaths.map((pts, idx) => ({
    ty: "gr",
    bm: 0,
    hd: false,
    nm: `Gift ${idx + 1}`,
    np: 3,
    it: [
      {
        ty: "sh",
        bm: 0,
        hd: false,
        nm: `Path ${idx + 1}`,
        d: 1,
        ks: { a: 0, k: polylineToLottiePath(pts) },
      },
      { ...stroke, c: { a: 0, k: [...strokeRgb] } },
      { ...tr, s: JSON.parse(JSON.stringify(s)), p: JSON.parse(JSON.stringify(p)) },
    ],
  }));

  const layer = {
    ty: 4,
    nm: name,
    sr: 1,
    st: 0,
    op: OP,
    ip: 0,
    hd: false,
    ddd: 0,
    bm: 0,
    hasMask: false,
    ao: 0,
    ks: {
      a: static2D(SIZE / 2, SIZE / 2),
      s: static2D(100, 100),
      sk: staticNum(0),
      p: static2D(SIZE / 2, SIZE / 2),
      r: staticNum(0),
      sa: staticNum(0),
      o: staticNum(100),
    },
    shapes,
    ind: 1,
  };

  return {
    nm: name,
    ddd: 0,
    h: SIZE,
    w: SIZE,
    meta: {
      g: "generate-bounce-lottie.mjs",
      theme: strokeRgb[0] < 0.5 ? "light" : "dark",
      source: "ReferralEntryPage AnimatedGiftIcon bounce variant",
    },
    layers: [layer],
    v: "5.6.6",
    fr: FR,
    op: OP,
    ip: 0,
    assets: [],
  };
}

const subpaths = samplePath(GIFT_PATH_D, 4);
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "Bounce.light.json"), JSON.stringify(buildLottie(subpaths, [0, 0, 0], "Gift bounce (light)")));
writeFileSync(join(outDir, "Bounce.dark.json"), JSON.stringify(buildLottie(subpaths, [1, 1, 1], "Gift bounce (dark)")));

const pts = subpaths.reduce((n, sp) => n + sp.length, 0);
console.log(`Wrote Bounce.light.json and Bounce.dark.json → ${outDir} (${OP} frames @ ${FR} fps, ${subpaths.length} contours, ${pts} points)`);
