# Sparkle gift icon — Lottie export (light / dark)

These files mirror the **Sparkle** variant in `src/pages/ReferralEntryPage.tsx` (`AnimatedGiftIcon`, `variant === "sparkle"`): **center `IconGift` stroke** plus four accent stars, staggered in time.

## Files

| File | Use |
|------|-----|
| `Sparkle-light.json` | Stars **#EC652B**; gift stroke **black** `[0,0,0]` (same as `Bounce.light.json`). |
| `Sparkle-dark.json` | Stars **RGB(255, 140, 97)**; gift stroke **white** `[1,1,1]` (same as `Bounce.dark.json`). |

**Layer order** (top → bottom in Lottie): `Gift icon` first, then `Sparkle 4` … `Sparkle 1`, so the outline draws above the bursts.

Public URLs (Vite / GitHub Pages base):

- `${import.meta.env.BASE_URL}Animation/Sparkle-light.json`
- `${import.meta.env.BASE_URL}Animation/Sparkle-dark.json`

## What matches the in-app animation

| Parameter | App (`ReferralEntryPage.tsx`) | Lottie export |
|-----------|-------------------------------|---------------|
| Artboard | `box = size + 14` → **38×38** when `size === 24` | `w` / `h` = **38** |
| Frame rate | Framer uses seconds | **`fr`: 60** |
| Loop segment | `duration: 1.6`, `repeat: Infinity` | One cycle = **96 frames** (`1.6 × 60`) |
| Easing | `ease: "easeInOut"` | Approx. **0.42 / 0.58** bezier on key segments |
| Star shape | `<path>` in viewBox `0 0 10 10` | Same vertices in a **shape** path |
| Star size (base) | `Sparkle size={8}` | Path in 10×10 space; **anchor [5,5]** |
| Delays (s) | `0`, `0.45`, `0.85`, `1.25` | Same → **0**, **27**, **51**, **75** frames @ 60fps |
| Peak scales | `0.9`, `0.7`, `0.6`, `0.85` | **90%**, **70%**, **60%**, **85%** layer scale |
| Positions | `left: 50%`, `top: 50%`, `marginLeft: dx - 4`, `marginTop: dy - 4` | Pixel **p** per star (see generator) |
| Rotation | `rotate: [0, 90]` on wrapper | Layer **`r`**: 0° → 90° over each burst |
| Center gift | `IconGift` path `d`, `strokeWidth` **1.75**, `color` from theme | Same path as `generate-bounce-lottie.mjs` (sampled polylines + **stroke** layer), centered at **(19, 19)** with anchor **(12, 12)** in the 38×38 comp |

## Notes

- **Reduced motion**: the app falls back to a static `IconGift`; Lottie players should respect `prefers-reduced-motion` separately if you use these files in UI.

## Regenerating

From repo root:

```bash
node scripts/generate-sparkle-lottie.mjs
```

Edit `scripts/generate-sparkle-lottie.mjs` to change delays, scales, colors, or artboard size, then re-run. You can also open the JSON in **LottieFiles** or **After Effects** (Bodymovin) and re-export.

## Example: `lottie-react`

```tsx
import Lottie from "lottie-react";
import sparkleLight from "../../public/Animation/Sparkle-light.json";

<Lottie animationData={sparkleLight} loop style={{ width: 38, height: 38 }} />
```

Pick `Sparkle-dark.json` when `theme === "dark"` if you are not recoloring via Lottie dotLottie theming.

## Format

- **Bodymovin / Lottie** schema **`v`: "5.7.4"**, compatible with `lottie-web` / `lottie-react` used elsewhere in this project (e.g. Shake / Coupon Lottie JSON).
