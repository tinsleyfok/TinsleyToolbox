# Generate Mobile App Animation Inspiration

## When to Use

Use this skill when the user asks you to generate an animation inspiration, e.g.:
- "generate an animation inspiration for save"
- "I want a loading animation inspiration"
- "add a like button animation to inspiration"

## Scope

All inspirations must come from **mobile apps** (iOS or Android). Do not use web-only or desktop examples. Look for animations from real shipped mobile apps — not generic web UI experiments.

## Steps

### 1. Research

Use `WebSearch` to find real mobile app animation references. Search queries like:
- "save button animation mobile app dribbble"
- "iOS onboarding animation"
- "Android like heart animation mobile UI"

Look at 60fps.design, Dribbble, Mobbin, or well-known mobile app patterns (Instagram, Airbnb, Spotify, Telegram, etc.).

### 2. Fetch the Media

Use the **browser-use subagent** to:
1. Visit the source page (Dribbble shot, CodePen pen, etc.)
2. Find the direct gif/video URL from the page
3. Download it to `public/inspirations/<id>.gif` (or `.mp4`)

```bash
mkdir -p public/inspirations
curl -L -o public/inspirations/<id>.gif "<media-url>"
```

The media path in the registry must include the base path: `/play-with-claude/inspirations/<id>.gif`

### 3. Register in the Registry

Add an entry to `src/inspirations/registry.ts`:

```typescript
{
  id: "kebab-case-name",
  title: "Human Readable Title",
  description: "Short, straightforward description of the effect. No fluff.",
  source: "Source URL",
  group: "GroupName",
  media: "/play-with-claude/inspirations/kebab-case-name.gif",
},
```

**Group names** — use an existing group when it fits. Current groups can be found by reading the registry file. Common groups:
- Onboarding
- Save
- Loading
- Like
- Navigation
- Feedback

Only create a new group name if the animation doesn't fit any existing one.

### 4. (Optional) Coded Version

If the user wants a coded implementation alongside the media reference, create a demo component at `src/inspirations/demos/<id>.tsx` and add `component` to the registry entry. Both `media` and `component` can coexist — media takes priority in the card display.

**Available animation tools:**

| Tool | Best for | Import |
|------|----------|--------|
| CSS transitions/keyframes | Simple fades, slides, color changes | Inline styles |
| Framer Motion | Declarative React animations, mount/unmount, gestures | `import { motion } from "framer-motion"` |
| GSAP | Complex timelines, morphing, stagger sequences | `import gsap from "gsap"` |
| matter-js | Physics simulations, gravity, collisions | `import Matter from "matter-js"` |

**Component conventions:**
- Export a **default** React component
- Renders inside a card preview area: `h-52` (208px tall), full width
- Plays once on mount (replay button remounts via key change)
- Self-contained, no external assets or additional npm packages

### 5. Verify

Check for lint errors on the registry file.

### 6. Self-Improve This Skill

After every run, review what happened and update **this skill file** (`SKILL.md`) to make future runs better. Append or edit entries in the "Lessons Learned" section below.

Things to capture:
- **Sources that worked well** (e.g. a site that consistently had downloadable mobile app videos)
- **Sources that failed** (e.g. a site that blocked downloads, required auth, or only had web examples)
- **Search queries that produced good results** vs ones that were too noisy
- **Media download tricks** (e.g. specific curl flags, URL patterns for a site)
- **Edge cases** (e.g. duplicate entries, naming collisions, format issues)
- **Anything else** that would save time or avoid mistakes next run

This section is append-only — never delete previous lessons, only add new ones or refine existing ones.

## Lessons Learned

_(Auto-updated after each run. Do not delete entries.)_

- **60fps.design video URL pattern**: Videos are hosted on Gumlet CDN at `https://video.gumlet.io/66b49d08225b7b88f78b7b44/{video_id}/main.mp4`. The account ID `66b49d08225b7b88f78b7b44` is constant. Video URLs are extractable from HTML via `curl -s "https://60fps.design/shots/{slug}" | grep -oE 'https://video\.gumlet\.io/[^"'\''<> ]+\.mp4' | head -1` — no browser agent needed for extraction.
- **60fps.design is the best source** for mobile app animation references. Has 1880+ shots with filterable tags (3D, Card, Flip, Spin, etc.). Always check here first.
- **Batch curl works well**: Video URLs are present in the initial HTML response, so `curl` + `grep` is faster than browser agents for extracting media URLs. Use browser agent only for the initial pattern discovery if needed.
- **Search strategy for flip cards**: Query `site:60fps.design card flip 3D` and `site:60fps.design card spin morph transition flip` yield good results across finance (Revolut, CRED), travel (Airbnb), gaming (Pokémon), and utility (Flipboard, Wolt) apps.

## File Reference

- Types: `src/inspirations/types.ts`
- Registry: `src/inspirations/registry.ts`
- Media directory: `public/inspirations/`
- Demos directory: `src/inspirations/demos/`
- Page (no changes needed): `src/pages/InspirationPage.tsx`
