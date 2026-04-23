#!/usr/bin/env node
/**
 * Generates public/Animation/Reveal-light.json and Reveal-dark.json from the
 * same layout / timing as ReferralEntryPage `AnimatedGiftIcon` (reveal variant).
 *
 * Timeline model (lottie-web: totalFrames = floor(op - ip), loop uses % totalFrames):
 * - Motion lives on frames 0 .. cycleFrames-1 (inclusive). Normalized T maps with
 *   `round(t * cycleFrames)` then clamped so t=1 never lands on frame `cycleFrames`.
 * - Pause is a flat hold from end-of-motion through the last *played* frame op-1.
 * - No keyframe at t === op (avoids off-by-one vs playable 0..op-1).
 *
 * Usage: node scripts/generate-reveal-lottie.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { polylineToLottiePath, samplePath } from "./lottie-svg-path-sample.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "Animation");

/** Same `d` as Reveal box paths (native 17×13), two contours. */
const BOX_D1 =
  "M17 4.95996C17 4.29417 17.0003 3.7342 16.9629 3.27637C16.9238 2.79771 16.8382 2.34294 16.6182 1.91113C16.2826 1.25262 15.7474 0.717383 15.0889 0.381836C14.6571 0.16182 14.2023 0.07623 13.7236 0.0371094C13.2658 -0.000297546 12.7059 -1.52588e-05 12.04 0H4.95996C4.29408 -1.52588e-05 3.73424 -0.000297546 3.27637 0.0371094C2.79771 0.0762301 2.34294 0.161821 1.91113 0.381836C1.25262 0.717383 0.717384 1.25262 0.381837 1.91113C0.161823 2.34294 0.0762302 2.79771 0.0371104 3.27637C-0.000298789 3.73423 -1.33032e-05 4.2941 1.00646e-06 4.95996V8.5H2V5C2 4.28347 2.00032 3.80616 2.03027 3.43945C2.05924 3.08489 2.11072 2.92228 2.16309 2.81934C2.3069 2.53709 2.53709 2.3069 2.81934 2.16309C2.92228 2.11072 3.0849 2.05924 3.43945 2.03027C3.80616 2.00032 4.28347 2 5 2H7.5V8.5H17V4.95996ZM9.5 2H12C12.7165 2 13.1938 2.00032 13.5605 2.03027C13.9151 2.05924 14.0777 2.11072 14.1807 2.16309C14.4629 2.3069 14.6931 2.53709 14.8369 2.81934C14.8893 2.92228 14.9408 3.08489 14.9697 3.43945C14.9997 3.80616 15 4.28347 15 5V8.5H9.5V2Z";
const BOX_D2 =
  "M17 7.54004C17 8.20583 17.0003 8.7658 16.9629 9.22363C16.9238 9.70229 16.8382 10.1571 16.6182 10.5889C16.2826 11.2474 15.7474 11.7826 15.0889 12.1182C14.6571 12.3382 14.2023 12.4238 13.7236 12.4629C13.2658 12.5003 12.7059 12.5 12.04 12.5H4.95996C4.29408 12.5 3.73424 12.5003 3.27637 12.4629C2.79771 12.4238 2.34294 12.3382 1.91113 12.1182C1.25262 11.7826 0.717384 11.2474 0.381837 10.5889C0.161823 10.1571 0.0762302 9.70229 0.0371104 9.22363C-0.000298789 8.76577 -1.33032e-05 8.2059 1.00646e-06 7.54004V4H2V7.5C2 8.21653 2.00032 8.69384 2.03027 9.06055C2.05924 9.41511 2.11072 9.57772 2.16309 9.68066C2.3069 9.96291 2.53709 10.1931 2.81934 10.3369C2.92228 10.3893 3.0849 10.4408 3.43945 10.4697C3.80616 10.4997 4.28347 10.5 5 10.5H7.5V4H17V7.54004ZM9.5 10.5H12C12.7165 10.5 13.1938 10.4997 13.5605 10.4697C13.9151 10.4408 14.0777 10.3893 14.1807 10.3369C14.4629 10.1931 14.6931 9.96291 14.8369 9.68066C14.8893 9.57772 14.9408 9.41511 14.9697 9.06055C14.9997 8.69384 15 8.21653 15 7.5V4H9.5V10.5Z";

const LID_D =
  "M15.167 0C17.01 0.000186034 18.4004 1.58222 18.4004 3.40039C18.4003 3.93165 18.2814 4.44309 18.0674 4.90039H19C20.1046 4.90039 21 5.79582 21 6.90039V9.90039C20.9998 11.0048 20.1044 11.9004 19 11.9004L2 11.9004C0.89556 11.9004 0.000211286 11.0048 0 9.90039L0 6.90039C0 5.79582 0.895431 4.90039 2 4.90039L2.93262 4.90039C2.71859 4.44309 2.59967 3.93165 2.59961 3.40039C2.59961 1.58222 3.98997 0.000186034 5.83301 0C7.57469 0 8.79506 0.864835 9.64355 1.99219C9.9762 2.43417 10.2576 2.92319 10.5 3.42578C10.7424 2.92319 11.0238 2.43417 11.3564 1.99219C12.2049 0.864835 13.4253 0 15.167 0ZM2 6.89941V9.89941L9.5 9.89941V6.89941L2 6.89941ZM11.5 6.89941L11.5 9.89941L19 9.89941V6.89941L11.5 6.89941ZM5.83301 1.7998C5.0991 1.8 4.40058 2.45661 4.40039 3.39941C4.40039 4.12531 4.81433 4.68164 5.33984 4.89941L9.18262 4.89941C8.90894 4.2207 8.59414 3.59115 8.20508 3.07422C7.60685 2.27948 6.87478 1.7998 5.83301 1.7998ZM15.167 1.7998C14.1252 1.7998 13.3931 2.27948 12.7949 3.07422C12.4059 3.59115 12.0911 4.2207 11.8174 4.89941H15.6602C16.1857 4.68164 16.5996 4.12531 16.5996 3.39941C16.5994 2.45661 15.9009 1.8 15.167 1.7998Z";

const DOLLAR_D =
  "M6 0.5C9.03757 0.5 11.5 2.96243 11.5 6C11.5 9.03757 9.03757 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6C0.5 2.96243 2.96243 0.5 6 0.5ZM5.60254 2.5V3.2915C4.72189 3.44459 4.14651 4.0121 4.14648 4.81445C4.14648 5.54944 4.60853 6.03242 5.34351 6.24243L6.32007 6.52588C6.83453 6.67288 7.02343 6.9145 7.02344 7.30298C7.02344 7.79645 6.68754 8.04855 6.09961 8.04858C5.46962 8.04858 5.07059 7.744 4.91309 7.03003L3.85254 7.28198C4.05239 8.24491 4.69243 8.75161 5.60254 8.87085V9.5H6.60254V8.85547C7.54185 8.70028 8.14697 8.13453 8.14697 7.23999C8.14697 6.30551 7.60096 5.89604 6.77148 5.65454L5.84766 5.39209C5.44866 5.26609 5.25952 5.06647 5.25952 4.71997C5.25954 4.36299 5.54313 4.11108 6.06812 4.11108C6.59302 4.11112 6.91843 4.34204 7.09692 4.84595L8.14697 4.573C7.96338 3.81243 7.39404 3.40127 6.60254 3.28491V2.5H5.60254Z";

const D = 3.4;
const REPEAT_DELAY_S = 2;
const T = [0, 0.14, 0.24, 0.31, 0.4, 0.65, 0.75, 1];
const fr = 60;
const COIN = 20;
const CX = 12;
const CY = 12;

const LID_W = 19.8;
const LID_H = (LID_W * 12) / 21;
const BOX_W = (LID_W * 17) / 21;
const BOX_H = (BOX_W * 13) / 17;
const BOX_X = (24 - BOX_W) / 2;
const OVERLAP = 0.3;
const BOX_Y = 24 - BOX_H - 1.15;
const LID_Y = BOX_Y - LID_H * (10.32 / 12) + OVERLAP;
const LID_LIFT = -(LID_Y + LID_H + 0.2);
const BOX_DROP_EXTRA = 0.8;
const BOX_DROP = -LID_LIFT + BOX_DROP_EXTRA;

const boxYAnim = [0, 0, BOX_DROP, BOX_DROP, BOX_DROP, BOX_DROP, 0, 0];
const lidYAnim = [0, 0, LID_LIFT, LID_LIFT, LID_LIFT, LID_LIFT, 0, 0];
const coinScale = [0, 0, 0, 1.3, 1.0, 1.0, 0, 0];
const coinOpacity = [0, 0, 0, 100, 100, 100, 0, 0];

/** Frame count for one motion cycle (matches Framer duration D at fr). */
const cycleFrames = Math.round(D * fr);
/** Last frame index of motion segment (playable 0..op-1 has op = cycle+pause). */
const motionLast = cycleFrames - 1;
const pauseFrames = Math.round(REPEAT_DELAY_S * fr);
/** Composition out-point (lottie-web totalFrames = op - ip). */
const OP = cycleFrames + pauseFrames;
/** Last playable frame index = op - 1; pause hold ends here, same values as motion end. */
const lastPlayable = OP - 1;

function bi() {
  return { o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 } };
}

function static2D(x, y) {
  return { a: 0, k: [x, y] };
}

function staticNum(v) {
  return { a: 0, k: v };
}

/** Map Framer `times` T to integer frames; clamp so motion never uses frame `cycleFrames`. */
function framesFromT() {
  return T.map((t) => Math.min(Math.round(t * cycleFrames), motionLast));
}

function q2(x, y) {
  return [Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4];
}

/** 2D position keyframes + hold through last playable frame for pause. */
function buildPosTrack(frames, xyAtIndex) {
  const k = [];
  for (let i = 0; i < frames.length - 1; i++) {
    const [x1, y1] = q2(...xyAtIndex(i));
    const [x2, y2] = q2(...xyAtIndex(i + 1));
    k.push({
      t: frames[i],
      s: [x1, y1],
      e: [x2, y2],
      ...bi(),
    });
  }
  const lastI = frames.length - 1;
  const [lx, ly] = q2(...xyAtIndex(lastI));
  k.push({ t: frames[lastI], s: [lx, ly] });
  if (frames[lastI] < lastPlayable) {
    k.push({ t: lastPlayable, s: [lx, ly] });
  }
  return { a: 1, k };
}

function buildLayerScale3DTrack(frames, scales) {
  const pct = (s) => Math.max(s, 0.001) * 100;
  const k = [];
  for (let i = 0; i < frames.length - 1; i++) {
    const s1 = pct(scales[i]);
    const s2 = pct(scales[i + 1]);
    k.push({
      t: frames[i],
      s: [s1, s1, 100],
      e: [s2, s2, 100],
      ...bi(),
    });
  }
  const last = pct(scales[scales.length - 1]);
  k.push({ t: frames[frames.length - 1], s: [last, last, 100] });
  if (frames[frames.length - 1] < lastPlayable) {
    k.push({ t: lastPlayable, s: [last, last, 100] });
  }
  return { a: 1, k };
}

function buildOpacityTrack(frames, opacities) {
  const k = [];
  for (let i = 0; i < frames.length - 1; i++) {
    k.push({
      t: frames[i],
      s: [opacities[i]],
      e: [opacities[i + 1]],
      ...bi(),
    });
  }
  const last = opacities[opacities.length - 1];
  k.push({ t: frames[frames.length - 1], s: [last] });
  if (frames[frames.length - 1] < lastPlayable) {
    k.push({ t: lastPlayable, s: [last] });
  }
  return { a: 1, k };
}

function fillProps(rgb, r = 1) {
  return {
    ty: "fl",
    bm: 0,
    hd: false,
    nm: "Fill",
    c: { a: 0, k: [...rgb] },
    o: { a: 0, k: 100 },
    r,
  };
}

function shapeTr(p, s) {
  return {
    ty: "tr",
    nm: "Transform",
    p,
    a: static2D(0, 0),
    s,
    r: staticNum(0),
    o: staticNum(100),
    sk: staticNum(0),
    sa: staticNum(0),
  };
}

function identityShapeTr() {
  return shapeTr(static2D(0, 0), static2D(100, 100));
}

function makePathElementGroup(subpaths, fillRgb, fillRule, nm) {
  const it = [];
  for (let idx = 0; idx < subpaths.length; idx++) {
    it.push({
      ty: "sh",
      bm: 0,
      hd: false,
      nm: `${nm} ${idx + 1}`,
      d: 1,
      ks: { a: 0, k: polylineToLottiePath(subpaths[idx], { closed: true }) },
    });
  }
  it.push(fillProps(fillRgb, fillRule));
  it.push(identityShapeTr());
  return { ty: "gr", bm: 0, hd: false, nm, it };
}

function shiftPts(pts, dx, dy) {
  return pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
}

function makeBoxLayer(fillRgb, ind, fts) {
  const sBox = (BOX_W / 17) * 100;
  const sp1 = samplePath(BOX_D1, 4);
  const sp2 = samplePath(BOX_D2, 4);
  const pTrack = buildPosTrack(fts, (i) => [BOX_X, BOX_Y + boxYAnim[i]]);
  const it = [
    makePathElementGroup(sp1, fillRgb, 1, "Box upper"),
    makePathElementGroup(sp2, fillRgb, 1, "Box lower"),
    shapeTr(pTrack, static2D(sBox, sBox)),
  ];

  return {
    ty: 4,
    nm: "Box",
    ind,
    sr: 1,
    st: 0,
    ip: 0,
    op: OP,
    hd: false,
    ddd: 0,
    bm: 0,
    hasMask: false,
    ao: 0,
    ks: {
      o: staticNum(100),
      r: staticNum(0),
      p: static2D(0, 0),
      a: static2D(0, 0),
      s: static2D(100, 100),
      sk: staticNum(0),
      sa: staticNum(0),
    },
    shapes: [{ ty: "gr", bm: 0, hd: false, nm: "BoxRoot", it }],
  };
}

function makeLidLayer(fillRgb, ind, fts) {
  const sLid = (LID_W / 21) * 100;
  const lx = CX - LID_W / 2;
  const pTrack = buildPosTrack(fts, (i) => [lx, LID_Y + lidYAnim[i]]);
  const subs = samplePath(LID_D, 4);
  const it = [];
  for (let idx = 0; idx < subs.length; idx++) {
    it.push({
      ty: "sh",
      bm: 0,
      hd: false,
      nm: `Lid ${idx + 1}`,
      d: 1,
      ks: { a: 0, k: polylineToLottiePath(subs[idx], { closed: true }) },
    });
  }
  it.push(fillProps(fillRgb, 2));
  it.push(shapeTr(pTrack, static2D(sLid, sLid)));

  return {
    ty: 4,
    nm: "Lid",
    ind,
    sr: 1,
    st: 0,
    ip: 0,
    op: OP,
    hd: false,
    ddd: 0,
    bm: 0,
    hasMask: false,
    ao: 0,
    ks: {
      o: staticNum(100),
      r: staticNum(0),
      p: static2D(0, 0),
      a: static2D(0, 0),
      s: static2D(100, 100),
      sk: staticNum(0),
      sa: staticNum(0),
    },
    shapes: [{ ty: "gr", bm: 0, hd: false, nm: "LidRoot", it }],
  };
}

function makeCoinLayer(dollarRgb, ind, fts) {
  const subs = samplePath(DOLLAR_D, 4);
  const coinScalePct = (COIN / 12) * 100;
  const scaleTrack = buildLayerScale3DTrack(fts, coinScale);
  const opacityTrack = buildOpacityTrack(fts, coinOpacity);

  const it = [];
  for (let idx = 0; idx < subs.length; idx++) {
    const pts = shiftPts(subs[idx], -6, -6);
    it.push({
      ty: "sh",
      bm: 0,
      hd: false,
      nm: `Dollar ${idx + 1}`,
      d: 1,
      ks: { a: 0, k: polylineToLottiePath(pts, { closed: true }) },
    });
  }
  it.push(fillProps(dollarRgb, 2));
  it.push(shapeTr(static2D(0, 0), static2D(coinScalePct, coinScalePct)));

  return {
    ty: 4,
    nm: "Dollar",
    ind,
    sr: 1,
    st: 0,
    ip: 0,
    op: OP,
    hd: false,
    ddd: 0,
    bm: 0,
    hasMask: false,
    ao: 0,
    ks: {
      o: opacityTrack,
      r: staticNum(0),
      p: static2D(CX, CY),
      a: static2D(0, 0),
      s: scaleTrack,
      sk: staticNum(0),
      sa: staticNum(0),
    },
    shapes: [{ ty: "gr", bm: 0, hd: false, nm: "CoinRoot", it }],
  };
}

function buildLottie(nm, giftFillRgb) {
  const fts = framesFromT();
  const dollarRgb = [1, 0.3764705882352941, 0.18823529411764706];

  return {
    v: "5.6.6",
    fr,
    ip: 0,
    op: OP,
    w: 24,
    h: 24,
    nm,
    ddd: 0,
    assets: [],
    meta: {
      g: "generate-reveal-lottie.mjs",
      source: "ReferralEntryPage AnimatedGiftIcon reveal",
      cycleFrames,
      motionLastFrame: motionLast,
      pauseFrames,
      lastPlayableFrame: lastPlayable,
      timelineNote:
        "Motion keys clamped to 0..cycleFrames-1; pause hold ends at op-1 so loop (0..op-1) matches frame 0.",
    },
    layers: [makeLidLayer(giftFillRgb, 3, fts), makeBoxLayer(giftFillRgb, 2, fts), makeCoinLayer(dollarRgb, 1, fts)],
  };
}

const giftLight = [0, 0, 0];
const giftDark = [1, 1, 1];

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "Reveal-light.json"), JSON.stringify(buildLottie("Reveal-light", giftLight), null, 2));
writeFileSync(join(outDir, "Reveal-dark.json"), JSON.stringify(buildLottie("Reveal-dark", giftDark), null, 2));
console.log(
  `Wrote Reveal-light.json, Reveal-dark.json → ${outDir} (op=${OP}, motion 0..${motionLast}, hold tail t=${lastPlayable}, ${fr}fps)`,
);
