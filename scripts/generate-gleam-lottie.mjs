#!/usr/bin/env node
/**
 * Generates public/Animation/Gleam.light.json and Gleam.dark.json
 * matching ReferralEntryPage `sparkle` gift variant (accent stars + IconGift),
 * exported under the product name "Gleam".
 *
 * Usage: node scripts/generate-gleam-lottie.mjs
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

/** Same star path as `Sparkle` (viewBox 0 0 10 10) */
const STAR_PATH_D = "M5 0 L5.9 3.8 L10 5 L5.9 6.2 L5 10 L4.1 6.2 L0 5 L4.1 3.8 Z";

/** Same as `ACCENT` in ReferralEntryPage.tsx */
const ACCENT_RGB = [236 / 255, 101 / 255, 43 / 255];

const FR = 30;
const SIZE = 24;
const BOX = SIZE + 14;
const GIFT_OFFSET = (BOX - SIZE) / 2;
const CYCLE_FR = Math.round(1.6 * FR);
/** Two sparkle cycles for a clean loop */
const OP = CYCLE_FR * 2;
/** `Sparkle` uses width/height 8 with viewBox 10 — motion scale is on top of that */
const STAR_VIEWBOX_SCALE = 8 / 10;

/** Same layout as `sparkle` variant (size 24) */
const SPARKLES = [
  { dx: -SIZE * 0.52, dy: -SIZE * 0.44, delay: 0.0, s: 0.9 },
  { dx: SIZE * 0.52, dy: -SIZE * 0.3, delay: 0.45, s: 0.7 },
  { dx: -SIZE * 0.35, dy: SIZE * 0.48, delay: 0.85, s: 0.6 },
  { dx: SIZE * 0.44, dy: SIZE * 0.42, delay: 1.25, s: 0.85 },
];

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

function anim1D(frames) {
  return {
    a: 1,
    k: frames.map(({ t, v }) => ({ ...bi(), s: [v], t })),
  };
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Matches Framer Motion `easeInOut` + 3-point scale/opacity + linear rotate over full 1.6s */
function sparkleSample(frame, delaySec, sMax) {
  const delayF = Math.round(delaySec * FR);
  const t = frame - delayF;
  if (t < 0) {
    return { sc: 0, op: 0, rot: 0 };
  }
  const tc = ((t % CYCLE_FR) + CYCLE_FR) % CYCLE_FR;
  const ph = tc / CYCLE_FR;
  const rot = easeInOutCubic(ph) * 90;
  let sc;
  let op;
  if (ph < 0.5) {
    const u = easeInOutCubic(ph / 0.5);
    sc = sMax * u;
    op = u;
  } else {
    const u = easeInOutCubic((ph - 0.5) / 0.5);
    sc = sMax * (1 - u);
    op = 1 - u;
  }
  return { sc: sc * 100 * STAR_VIEWBOX_SCALE, op: op * 100, rot };
}

function buildSparkleKeyframes(delaySec, sMax) {
  const scale = [];
  const opacity = [];
  const rotation = [];
  const step = 2;
  for (let f = 0; f < OP; f += step) {
    const v = sparkleSample(f, delaySec, sMax);
    scale.push({ t: f, x: v.sc, y: v.sc });
    opacity.push({ t: f, v: v.op });
    rotation.push({ t: f, v: v.rot });
  }
  const last = OP - 1;
  if (scale[scale.length - 1].t !== last) {
    const v = sparkleSample(last, delaySec, sMax);
    scale.push({ t: last, x: v.sc, y: v.sc });
    opacity.push({ t: last, v: v.op });
    rotation.push({ t: last, v: v.rot });
  }
  return {
    s: anim2D(scale.map(({ t, x, y }) => ({ t, x, y }))),
    o: anim1D(opacity.map(({ t, v }) => ({ t, v }))),
    r: anim1D(rotation.map(({ t, v }) => ({ t, v }))),
  };
}

function giftBbox(subpaths) {
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
  return { minX, maxX, minY, maxY, ax: (minX + maxX) / 2, ay: maxY };
}

function buildGiftLayer(subpaths, strokeRgb, bbox, ind) {
  const { ax, ay } = bbox;
  const cx = BOX / 2;
  const cy = ay + GIFT_OFFSET;

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
    a: static2D(ax + GIFT_OFFSET, ay + GIFT_OFFSET),
    s: static2D(100, 100),
    sk: staticNum(0),
    p: static2D(cx, cy),
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
        ks: {
          a: 0,
          k: polylineToLottiePath(
            pts.map((p) => ({ x: p.x + GIFT_OFFSET, y: p.y + GIFT_OFFSET })),
          ),
        },
      },
      { ...stroke, c: { a: 0, k: [...strokeRgb] } },
      { ...tr },
    ],
  }));

  return {
    ty: 4,
    nm: "Gift",
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
      a: static2D(BOX / 2, BOX / 2),
      s: static2D(100, 100),
      sk: staticNum(0),
      p: static2D(BOX / 2, BOX / 2),
      r: staticNum(0),
      sa: staticNum(0),
      o: staticNum(100),
    },
    shapes,
    ind,
  };
}

function buildSparkleLayer(sp, index, starPts, ind) {
  const px = BOX / 2 + sp.dx;
  const py = BOX / 2 + sp.dy;
  const { s, o, r } = buildSparkleKeyframes(sp.delay, sp.s);

  const shapes = [
    {
      ty: "gr",
      bm: 0,
      hd: false,
      nm: `Sparkle ${index + 1}`,
      np: 3,
      it: [
        {
          ty: "sh",
          bm: 0,
          hd: false,
          nm: "Star",
          d: 1,
          ks: { a: 0, k: polylineToLottiePath(starPts, { closed: true }) },
        },
        {
          ty: "fl",
          bm: 0,
          hd: false,
          nm: "Fill",
          c: { a: 0, k: ACCENT_RGB },
          r: 2,
          o: { a: 0, k: 100 },
        },
        {
          ty: "tr",
          a: static2D(5, 5),
          s,
          sk: staticNum(0),
          p: static2D(px, py),
          r,
          sa: staticNum(0),
          o,
        },
      ],
    },
  ];

  return {
    ty: 4,
    nm: `Gleam sparkle ${index + 1}`,
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
      a: static2D(BOX / 2, BOX / 2),
      s: static2D(100, 100),
      sk: staticNum(0),
      p: static2D(BOX / 2, BOX / 2),
      r: staticNum(0),
      sa: staticNum(0),
      o: staticNum(100),
    },
    shapes,
    ind,
  };
}

function buildLottie(strokeRgb, name) {
  const giftSubpaths = samplePath(GIFT_PATH_D, 4);
  const bbox = giftBbox(giftSubpaths);
  const starSub = samplePath(STAR_PATH_D, 8);
  const starPts = starSub[0] ?? [];

  const sparkleLayers = SPARKLES.map((sp, i) => buildSparkleLayer(sp, i, starPts, i + 1));
  const giftLayer = buildGiftLayer(giftSubpaths, strokeRgb, bbox, SPARKLES.length + 1);

  return {
    nm: name,
    ddd: 0,
    h: BOX,
    w: BOX,
    meta: {
      g: "generate-gleam-lottie.mjs",
      theme: strokeRgb[0] < 0.5 ? "light" : "dark",
      source: "ReferralEntryPage AnimatedGiftIcon sparkle variant (exported as Gleam)",
    },
    layers: [...sparkleLayers, giftLayer],
    v: "5.6.6",
    fr: FR,
    op: OP,
    ip: 0,
    assets: [],
  };
}

mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "Gleam.light.json"), JSON.stringify(buildLottie([0, 0, 0], "Gift gleam (light)")));
writeFileSync(join(outDir, "Gleam.dark.json"), JSON.stringify(buildLottie([1, 1, 1], "Gift gleam (dark)")));

console.log(`Wrote Gleam.light.json and Gleam.dark.json → ${outDir} (${OP} frames @ ${FR} fps, comp ${BOX}×${BOX})`);
