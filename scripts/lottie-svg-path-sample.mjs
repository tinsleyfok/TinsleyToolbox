/** Tokenize SVG path `d` into numbers and single-letter commands */
export function tokenizePath(d) {
  return d.match(/[MmLlHhVvCcZzAaSsQqTt]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || [];
}

/**
 * @param {{ x: number; y: number }[]} pts
 * @param {{ closed?: boolean }} [opts]
 */
export function polylineToLottiePath(pts, opts = {}) {
  const closed = !!opts.closed;
  const v = pts.map((p) => [p.x, p.y]);
  const n = v.length;
  const i = Array.from({ length: n }, () => [0, 0]);
  const o = Array.from({ length: n }, () => [0, 0]);
  return { c: closed, v, i, o };
}

/** Returns separate polylines per SVG subpath (each `M` starts a new contour). */
export function samplePath(d, stepsPerUnit = 4) {
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
    const cyp = coef * (-(ry2 * x) / rx2);
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
