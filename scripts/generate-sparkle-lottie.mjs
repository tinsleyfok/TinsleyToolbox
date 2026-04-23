#!/usr/bin/env node
/**
 * Regenerates public/Animation/Sparkle-light.json and Sparkle-dark.json:
 * four accent stars (same timing as ReferralEntryPage sparkle) + centered
 * IconGift stroke (same path / stroke as generate-bounce-lottie.mjs).
 *
 * Usage: node scripts/generate-sparkle-lottie.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "Animation");

/** Same `d` as `IconGift` in src/pages/ReferralEntryPage.tsx */
const GIFT_PATH_D =
  "M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z";

const fr = 60;
const dur = 1.6;
const F = Math.round(dur * fr);
const compW = 38;
const compH = 38;
const cx = compW / 2;
const cy = compH / 2;
const size = 24;
const sparkles = [
  { dx: -size * 0.52, dy: -size * 0.44, delay: 0.0, s: 0.9 },
  { dx: size * 0.52, dy: -size * 0.3, delay: 0.45, s: 0.7 },
  { dx: -size * 0.35, dy: size * 0.48, delay: 0.85, s: 0.6 },
  { dx: size * 0.44, dy: size * 0.42, delay: 1.25, s: 0.85 },
];

const starPath = {
  c: true,
  v: [
    [5, 0],
    [5.9, 3.8],
    [10, 5],
    [5.9, 6.2],
    [5, 10],
    [4.1, 6.2],
    [0, 5],
    [4.1, 3.8],
  ],
  i: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  o: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

const bez = {
  o: { x: [0.42], y: [0] },
  i: { x: [0.58], y: [1] },
};

function polylineToLottiePath(pts) {
  const v = pts.map((p) => [p.x, p.y]);
  const n = v.length;
  const i = Array.from({ length: n }, () => [0, 0]);
  const o = Array.from({ length: n }, () => [0, 0]);
  return { c: false, v, i, o };
}

function tokenizePath(d) {
  return d.match(/[MmLlHhVvCcZzAaSsQqTt]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || [];
}

/** Returns separate polylines per SVG subpath (each `M` starts a new contour). */
function samplePath(d, stepsPerUnit = 4) {
  const tokens = tokenizePath(d);
  let ti = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  const subpaths = [];
  let current = [];

  const readNum = () => parseFloat(tokens[ti++]);
  const flush = () => {
    if (current.length) {
      subpaths.push(current);
      current = [];
    }
  };
  const push = (x, y) => {
    cx = x;
    cy = y;
    current.push({ x, y });
  };
  const lineSteps = (x0, y0, x1, y1) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const n = Math.max(2, Math.ceil(len * stepsPerUnit));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      push(x0 + dx * t, y0 + dy * t);
    }
  };

  const arcSteps = (x0, y0, rx, ry, phi, fa, fs, x1, y1) => {
    if (rx === 0 || ry === 0) {
      lineSteps(x0, y0, x1, y1);
      return;
    }
    const phiR = (phi * Math.PI) / 180;
    const cos = Math.cos(phiR);
    const sin = Math.sin(phiR);
    const dx = (x0 - x1) / 2;
    const dy = (y0 - y1) / 2;
    const x = cos * dx + sin * dy;
    const y = -sin * dx + cos * dy;
    let rx2 = Math.abs(rx);
    let ry2 = Math.abs(ry);
    const lambda = (x * x) / (rx2 * rx2) + (y * y) / (ry2 * ry2);
    if (lambda > 1) {
      rx2 *= Math.sqrt(lambda);
      ry2 *= Math.sqrt(lambda);
    }
    const sign = fa === fs ? -1 : 1;
    let coef = sign * Math.sqrt(Math.max(0, (rx2 * rx2 * ry2 * ry2 - rx2 * rx2 * y * y - ry2 * ry2 * x * x) / (rx2 * rx2 * y * y + ry2 * ry2 * x * x)));
    if (Number.isNaN(coef)) coef = 0;
    const cxp = coef * ((rx2 * y) / ry2);
    const cyp = coef * (-(rx2 * x) / ry2);
    const cx0 = cos * cxp - sin * cyp + (x0 + x1) / 2;
    const cy0 = sin * cxp + cos * cyp + (y0 + y1) / 2;
    const ang0 = Math.atan2((y - cyp) / ry2, (x - cxp) / rx2);
    const ang1 = Math.atan2((-y - cyp) / ry2, (-x - cxp) / rx2) - ang0;
    let delta = ang1;
    if (!fs && delta > 0) delta -= 2 * Math.PI;
    if (fs && delta < 0) delta += 2 * Math.PI;
    const segments = Math.max(4, Math.ceil((Math.abs(delta) * Math.max(rx2, ry2) * stepsPerUnit) / 2));
    for (let k = 1; k <= segments; k++) {
      const t = ang0 + (delta * k) / segments;
      const xt = rx2 * Math.cos(t);
      const yt = ry2 * Math.sin(t);
      push(cos * xt - sin * yt + cx0, sin * xt + cos * yt + cy0);
    }
  };

  const cubicSteps = (x0, y0, x1, y1, x2, y2, x3, y3) => {
    const est = Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2);
    const n = Math.max(6, Math.ceil(est * stepsPerUnit));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const u = 1 - t;
      const x = u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3;
      const y = u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3;
      push(x, y);
    }
  };

  while (ti < tokens.length) {
    const cmd = tokens[ti++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? cx : 0;
    const oy = rel ? cy : 0;
    switch (cmd) {
      case "M":
      case "m": {
        flush();
        cx = readNum() + ox;
        cy = readNum() + oy;
        current.push({ x: cx, y: cy });
        sx = cx;
        sy = cy;
        while (ti < tokens.length && !/[MmLlHhVvCcZzAaSsQqTt]/.test(tokens[ti])) {
          const nx = readNum() + ox;
          const ny = readNum() + oy;
          lineSteps(cx, cy, nx, ny);
        }
        break;
      }
      case "L":
      case "l": {
        const x = readNum() + ox;
        const y = readNum() + oy;
        lineSteps(cx, cy, x, y);
        break;
      }
      case "H":
      case "h": {
        const x = readNum() + ox;
        lineSteps(cx, cy, x, cy);
        break;
      }
      case "V":
      case "v": {
        const y = readNum() + oy;
        lineSteps(cx, cy, cx, y);
        break;
      }
      case "C":
      case "c": {
        const x1 = readNum() + ox;
        const y1 = readNum() + oy;
        const x2 = readNum() + ox;
        const y2 = readNum() + oy;
        const x3 = readNum() + ox;
        const y3 = readNum() + oy;
        cubicSteps(cx, cy, x1, y1, x2, y2, x3, y3);
        break;
      }
      case "A":
      case "a": {
        const rx = readNum();
        const ry = readNum();
        const rot = readNum();
        const fa = readNum();
        const fs = readNum();
        const x = readNum() + ox;
        const y = readNum() + oy;
        arcSteps(cx, cy, rx, ry, rot, fa, fs, x, y);
        break;
      }
      case "Z":
      case "z": {
        if (cx !== sx || cy !== sy) lineSteps(cx, cy, sx, sy);
        cx = sx;
        cy = sy;
        break;
      }
      default:
        throw new Error(`Unsupported path command: ${cmd}`);
    }
  }
  flush();
  return subpaths;
}

function makeStarLayer(ind, nm, px, py, delaySec, peakScale, fillRgb, compOp) {
  const delayF = Math.round(delaySec * fr);
  const t0 = delayF;
  const t1 = delayF + Math.round(F * 0.45);
  const t2 = delayF + F;
  const peak = peakScale * 100;
  const pos = [px, py, 0];
  const anchor = [5, 5, 0];

  return {
    ty: 4,
    nm,
    ind,
    sr: 1,
    st: 0,
    ip: 0,
    op: compOp,
    hd: false,
    ddd: 0,
    bm: 0,
    hasMask: false,
    ao: 0,
    ks: {
      a: { a: 0, k: anchor },
      p: { a: 0, k: pos },
      s: {
        a: 1,
        k: [
          { t: t0, s: [0, 0, 100], e: [peak, peak, 100], ...bez },
          { t: t1, s: [peak, peak, 100], e: [0, 0, 100], ...bez },
          { t: t2, s: [0, 0, 100] },
        ],
      },
      r: {
        a: 1,
        k: [
          { t: t0, s: [0], e: [90], ...bez },
          { t: t2, s: [90] },
        ],
      },
      o: {
        a: 1,
        k: [
          { t: t0, s: [0], e: [100], ...bez },
          { t: t1, s: [100], e: [0], ...bez },
          { t: t2, s: [0] },
        ],
      },
    },
    shapes: [
      {
        ty: "gr",
        nm: "Star",
        it: [
          { ty: "sh", nm: "Path", ks: { a: 0, k: starPath }, ind: 0 },
          { ty: "fl", nm: "Fill", c: { a: 0, k: fillRgb }, o: { a: 0, k: 100 }, r: 1 },
          {
            ty: "tr",
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
          },
        ],
      },
    ],
  };
}

/** Centered IconGift (stroke 1.75), same colors as Bounce.light / Bounce.dark JSON. */
function makeGiftLayer(subpaths, strokeRgb, compOp, ind) {
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
    c: { a: 0, k: [...strokeRgb] },
  };
  const staticTr = {
    ty: "tr",
    p: { a: 0, k: [0, 0] },
    a: { a: 0, k: [0, 0] },
    s: { a: 0, k: [100, 100] },
    r: { a: 0, k: 0 },
    o: { a: 0, k: 100 },
    sk: { a: 0, k: 0 },
    sa: { a: 0, k: 0 },
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
      { ...staticTr },
    ],
  }));

  return {
    ty: 4,
    nm: "Gift icon",
    ind,
    sr: 1,
    st: 0,
    ip: 0,
    op: compOp,
    hd: false,
    ddd: 0,
    bm: 0,
    hasMask: false,
    ao: 0,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [cx, cy, 0] },
      a: { a: 0, k: [12, 12, 0] },
      s: { a: 0, k: [100, 100, 100] },
      sk: { a: 0, k: 0 },
      sa: { a: 0, k: 0 },
    },
    shapes,
  };
}

function buildLottie(nm, starFillRgb, giftStrokeRgb) {
  const maxEnd = Math.max(...sparkles.map((sp) => Math.round(sp.delay * fr) + F));
  const compOp = maxEnd + 8;
  const starLayers = [];
  let ind = 1;
  for (let i = 0; i < sparkles.length; i++) {
    const sp = sparkles[i];
    const ml = sp.dx - 4;
    const mt = sp.dy - 4;
    const px = cx + ml + 4;
    const py = cy + mt + 4;
    starLayers.push(makeStarLayer(ind++, `Sparkle ${i + 1}`, px, py, sp.delay, sp.s, starFillRgb, compOp));
  }
  starLayers.reverse();

  const subpaths = samplePath(GIFT_PATH_D, 4);
  const giftLayer = makeGiftLayer(subpaths, giftStrokeRgb, compOp, ind);

  return {
    v: "5.7.4",
    fr,
    ip: 0,
    op: compOp,
    w: compW,
    h: compH,
    nm,
    ddd: 0,
    assets: [],
    meta: {
      g: "generate-sparkle-lottie.mjs",
      centerIcon: "IconGift stroke (ReferralEntryPage)",
    },
    layers: [giftLayer, ...starLayers],
  };
}

const giftStrokeLight = [0, 0, 0];
const giftStrokeDark = [1, 1, 1];
const starFillLight = [236 / 255, 101 / 255, 43 / 255];
const starFillDark = [1, 0.55, 0.38];

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "Sparkle-light.json"),
  JSON.stringify(buildLottie("Sparkle-light", starFillLight, giftStrokeLight), null, 2),
);
fs.writeFileSync(
  path.join(outDir, "Sparkle-dark.json"),
  JSON.stringify(buildLottie("Sparkle-dark", starFillDark, giftStrokeDark), null, 2),
);
console.log("Wrote Sparkle-light.json, Sparkle-dark.json (gift + stars) →", outDir);
