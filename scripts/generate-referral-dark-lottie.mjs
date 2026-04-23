#!/usr/bin/env node
/**
 * Builds public/Animation/referral.dark.json from referral.json by re-rendering
 * gift + dollar rasters from public/Icon/gift/*.svg (Puppeteer → WebP). Ticket PNGs unchanged.
 *
 * Usage: npm run generate:referral-dark-lottie
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const animDir = join(root, "public", "Animation");
const iconDir = join(root, "public", "Icon", "gift");

function themeGiftSvg(svg) {
  return svg.replace(/#FAFAFA/g, "#262626").replace(/#1D1D1B/g, "#FFFFFF");
}

function injectSvgSize(svg, w, h) {
  return svg.replace(/<svg([^>]*)>/, (_, attrs) => {
    const a = attrs.replace(/\s+width="[^"]*"/gi, "").replace(/\s+height="[^"]*"/gi, "");
    return `<svg${a} width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" style="display:block">`;
  });
}

function specForAssetId(id) {
  if (typeof id !== "string") return null;
  if (id.startsWith("Giftbox cover")) {
    return { file: "Giftbox cover.svg", w: 210, h: 119, theme: true };
  }
  if (id.startsWith("Giftbox_")) {
    return { file: "Giftbox.svg", w: 170, h: 125, theme: true };
  }
  if (id.startsWith("Dollar_Sign_Fill")) {
    return { file: "Dollar_Sign_Fill.svg", w: 200, h: 200, theme: false };
  }
  return null;
}

async function svgToWebpDataUri(page, svgRaw, w, h, theme) {
  let svg = svgRaw;
  if (theme) svg = themeGiftSvg(svg);
  const body = injectSvgSize(svg, w, h);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}</style></head><body>${body}</body></html>`;
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  const buf = await page.screenshot({
    type: "webp",
    clip: { x: 0, y: 0, width: w, height: h },
    omitBackground: true,
  });
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  const srcPath = join(animDir, "referral.json");
  const lottie = JSON.parse(readFileSync(srcPath, "utf8"));
  if (!Array.isArray(lottie.assets)) {
    throw new Error("referral.json: missing assets[]");
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    let n = 0;
    for (const asset of lottie.assets) {
      if (asset.e !== 1 || !asset.id) continue;
      const spec = specForAssetId(asset.id);
      if (!spec) continue;
      const svg = readFileSync(join(iconDir, spec.file), "utf8");
      asset.p = await svgToWebpDataUri(page, svg, spec.w, spec.h, spec.theme);
      if (!asset.u) asset.u = "";
      n += 1;
    }
    if (n !== 3) {
      throw new Error(`Expected 3 SVG-backed assets; re-rendered ${n}`);
    }
  } finally {
    await browser.close();
  }

  lottie.meta = { ...(lottie.meta || {}), g: "generate-referral-dark-lottie.mjs", theme: "dark" };

  writeFileSync(join(animDir, "referral.dark.json"), JSON.stringify(lottie));
  console.log(`Wrote referral.dark.json (gift + dollar → WebP dark; ticket rasters unchanged)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
