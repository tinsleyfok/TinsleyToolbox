# Theme Inspiration

## When to Use

Use this skill when the user asks for colour palette or theme inspiration, e.g.:
- "add colour palette for Spotify"
- "get theme inspiration for dark mode apps"
- "I want to see Reddit's colour scheme"
- "add YouTube to the palette board"

## Scope

Focus on **real production mobile apps** (iOS or Android). Extract the actual colours used in the shipped app — not concept designs or dribbble shots. Both **light and dark modes** are required for every entry.

## Target Apps

Good candidates (not exhaustive):
YouTube, Instagram, TikTok, DeepStash, Medium, Substack, Reddit, Notion, Spotify, X (Twitter), Discord, Linear, WhatsApp, Telegram, Pinterest, Arc, Bear, Threads, Slack, Apple Music, Duolingo, Figma, GitHub Mobile, Airbnb, Uber

## Steps

### 1. Research

Use `WebSearch` to find the app's colour palette and screenshots in both modes. Good search queries:

- `"<app> dark mode light mode colour palette"`
- `"<app> UI design system colours"`
- `"<app> mobile app screenshot dark light" site:mobbin.com`
- `"<app> brand colours hex"`

**Best sources:**
- **Mobbin** (mobbin.com) — searchable mobile app screenshot library, filtered by light/dark
- **screenlane.com** — curated mobile UI screenshots
- **scrnshts.club** — App Store screenshots collection
- **Official design systems** — e.g. Material Design (YouTube), Primer (GitHub), Polaris (Shopify)
- **Brand guideline pages** — many apps publish hex values publicly

### 2. Capture Screenshots

Use the **browser-use subagent** to get representative screenshots of the app in both light and dark modes. Ideally a main feed or home screen that shows the full palette in use.

Save screenshots to:
```
public/inspirations/<app>-light.png
public/inspirations/<app>-dark.png
```

**Tips:**
- Mobbin is the fastest source — search for the app, filter by light/dark, and screenshot the result
- If using the actual app website or App Store previews, crop to the phone screen area
- Screenshots should be roughly phone-sized (portrait, ~390×844 or similar)

### 3. Extract Colours

From the screenshots or official documentation, extract **5–6 key colour roles**:

| Role | What to look for |
|------|-----------------|
| Background | Main page/feed background |
| Surface | Card, sheet, or elevated container background |
| Text | Primary body text |
| Text Secondary | Muted/secondary text, timestamps, captions |
| Accent | Brand colour, primary action buttons, links |
| Border | Dividers, separators, card outlines (optional) |

Record these as hex values (e.g. `#1a1a2e`). Extract separately for light and dark modes.

### 4. Register in the Registry

Add an entry to `src/inspirations/registry.ts`:

```typescript
{
  id: "app-name-palette",
  title: "App Name",
  description: "Brief note on the app's visual character or what makes its palette distinctive.",
  source: "https://mobbin.com/apps/app-name or official URL",
  group: "Colour Palette",
  palette: {
    light: {
      screenshot: "/play-with-claude/inspirations/app-name-light.png",
      colors: [
        { label: "Background", value: "#FFFFFF" },
        { label: "Surface", value: "#F5F5F5" },
        { label: "Text", value: "#1A1A1A" },
        { label: "Text Secondary", value: "#8E8E8E" },
        { label: "Accent", value: "#FF0000" },
        { label: "Border", value: "#E5E5E5" },
      ],
    },
    dark: {
      screenshot: "/play-with-claude/inspirations/app-name-dark.png",
      colors: [
        { label: "Background", value: "#0F0F0F" },
        { label: "Surface", value: "#1A1A1A" },
        { label: "Text", value: "#F1F1F1" },
        { label: "Text Secondary", value: "#717171" },
        { label: "Accent", value: "#FF0000" },
        { label: "Border", value: "#2A2A2A" },
      ],
    },
  },
},
```

**Rules:**
- `group` must always be `"Colour Palette"`
- Both `light` and `dark` are required — skip the app if it doesn't support both modes
- Keep colour labels consistent across apps so they're comparable
- `id` format: `<app-name>-palette` (kebab-case)

### 5. Verify

Check for lint errors on the registry file and types.

### 6. Self-Improve This Skill

After every run, review what happened and update **this skill file** (`SKILL.md`) to make future runs better. Append or edit entries in the "Lessons Learned" section below.

Things to capture:
- **Sources that worked well** for finding app palettes or screenshots
- **Sources that failed** (paywalled, no dark mode shots, etc.)
- **Colour extraction tricks** (browser dev tools, colour picker extensions, etc.)
- **Apps that lack dark/light mode** (skip list)
- **Screenshot resolution tips**
- **Anything else** that would save time next run

This section is append-only — never delete previous lessons, only add new ones or refine existing ones.

## Lessons Learned

_(Auto-updated after each run. Do not delete entries.)_

- **Spotify has no official light mode** — only dark. The "light mode" some sources mention is via iOS Smart Invert, not a real theme. Skip Spotify for this skill (both modes required).
- **Mobbin is the best source for app screenshots** — has real iOS captures with both light and dark modes. Notion and Linear screenshots came from Mobbin.
- **Apple App Store screenshots via iTunes API** work well for WhatsApp and Telegram: `https://itunes.apple.com/lookup?bundleId=<bundle_id>&country=us` returns screenshot URLs. However, these often include marketing frames/phone bezels.
- **Discord official blog** has clean light/dark mobile screenshots in their redesign posts.
- **X (Twitter) almost never shows light mode** — all official App Store and Play Store screenshots use dark/Lights Out mode exclusively. Light mode screenshots are hard to find publicly.
- **Linear is dark-first in branding** — all official marketing uses dark mode. Light mode screenshots only found via Mobbin.
- **Colour research strategy**: Searching `"<app> brand colors hex"` and `"<app> dark mode light mode colour palette"` consistently returned usable hex values. Official design system docs (Material Design for YouTube, Reddit developer docs for Reddit) give the most accurate values.
- **Run 4 generalPurpose agents in parallel** for screenshot downloads — each handling 2 apps is the fastest approach. Browser-use agents are single-instance and slower.
- **Common colour roles that work across all apps**: Background, Surface, Text, Text Secondary, Accent, Border — this set of 6 is sufficient and consistent.

## File Reference

- Types: `src/inspirations/types.ts`
- Registry: `src/inspirations/registry.ts`
- Screenshots directory: `public/inspirations/`
- Note: The Themes inspiration UI was removed from the app; palette entries were deleted from the registry. Re-add a page/route if you restore the feature.
