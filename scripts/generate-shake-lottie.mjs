#!/usr/bin/env node
/**
 * Generates public/Animation/Shake.light.json and Shake.dark.json — same timing as
 * ReferralEntryPage shake (Framer): rotate [0,-7,7,-5,5,-3,0], y nudge ~[0,-2,0],
 * duration 1.05s, repeat delay 2.6s @ 30fps. IconGift stroke colors per theme.
 *
 * Usage: node scripts/generate-shake-lottie.mjs
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
const SHAKE_S = 1.05;
const REPEAT_DELAY_S = 2.6;
const SHAKE_FRAMES = Math.max(2, Math.round(SHAKE_S * FR));
const DELAY_FRAMES = Math.round(REPEAT_DELAY_S * FR);
const OP = SHAKE_FRAMES + DELAY_FRAMES;
const SIZE = 24;

/** Rotation (deg) — matches Framer `rotate` array length. */
const ROT = [0, -7, 7, -5, 5, -3, 0];
/** Y nudge (px): 0 → -2 → 0 linearly across 7 keys (Framer y [0,-2,0] vs 7 rotate keys). */
const YOFF = [0, -2 / 3, -4 / 3, -2, -4 / 3, -2 / 3, 0];

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

/** Rotation keyframes — `s` is degrees (Lottie transform `r`). */
function animRotDeg(frames) {
  return {
    a: 1,
    k: frames.map(({ t, deg }) => ({ ...bi(), s: [deg], t })),
  };
}

function keyTimesShake() {
  const n = ROT.length;
  const out = [];
  for (let j = 0; j < n; j++) {
    const t = j === n - 1 ? SHAKE_FRAMES - 1 : Math.round((j / (n - 1)) * (SHAKE_FRAMES - 1));
    out.push(Math.min(SHAKE_FRAMES - 1, Math.max(0, t)));
  }
  return out;
}

function buildShakeTransform(ay) {
  const times = keyTimesShake();
  const pFrames = times.map((t, j) => ({
    t,
    x: SIZE / 2,
    y: ay + YOFF[j],
  }));
  const rFrames = times.map((t, j) => ({ t, deg: ROT[j] }));

  pFrames.push({ t: SHAKE_FRAMES, x: SIZE / 2, y: ay });
  rFrames.push({ t: SHAKE_FRAMES, deg: 0 });

  if (SHAKE_FRAMES < OP) {
    pFrames.push({ t: OP, x: SIZE / 2, y: ay });
    rFrames.push({ t: OP, deg: 0 });
  }

  return {
    p: anim2D(pFrames),
    r: animRotDeg(rFrames),
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
  const { p, r } = buildShakeTransform(ay);

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
    s: static2D(100, 100),
    sk: staticNum(0),
    p,
    r,
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
      {
        ...tr,
        p: JSON.parse(JSON.stringify(p)),
        r: JSON.parse(JSON.stringify(r)),
      },
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
      g: "generate-shake-lottie.mjs",
      theme: strokeRgb[0] < 0.5 ? "light" : "dark",
      source: "ReferralEntryPage AnimatedGiftIcon shake variant (Framer parity)",
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

writeFileSync(join(outDir, "Shake.light.json"), JSON.stringify(buildLottie(subpaths, [0, 0, 0], "Gift shake (light)")));
writeFileSync(join(outDir, "Shake.dark.json"), JSON.stringify(buildLottie(subpaths, [1, 1, 1], "Gift shake (dark)")));

const pts = subpaths.reduce((n, sp) => n + sp.length, 0);
console.log(`Wrote Shake.light.json and Shake.dark.json → ${outDir} (${OP} frames @ ${FR} fps, shake ${SHAKE_FRAMES}f + delay ${DELAY_FRAMES}f, ${subpaths.length} contours, ${pts} points)`);
