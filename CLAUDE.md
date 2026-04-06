# Claude Instructions

## Project
Static site hosted at https://tinsleyfok.github.io/play-with-claude/
Repo: https://github.com/tinsleyfok/play-with-claude

## Workflow
- **Local preview**: `npm run dev` → **http://localhost:5188/** (fixed port + `strictPort`; if it says “port in use”, stop the other process on 5188). After substantive UI/app changes, start or keep the dev server running so the user can refresh immediately. `.vscode/tasks.json` runs **Vite: dev (localhost)** on folder open (allow automatic tasks if Cursor prompts).
- `gh` CLI is installed at `~/bin/gh` — always `export PATH=$HOME/bin:$PATH` before using it
- To commit and deploy: stage specific files, commit, `git push` (GitHub Pages auto-deploys on push to main)
- Never commit `.DS_Store` or `.claude/` files

## Preferences
- Respond in whatever language the user writes in (English or Chinese)
- Keep changes minimal and focused — no over-engineering
- Always confirm before destructive git operations (force push, reset, etc.)
- **Mobile-first**: always design for mobile first; on desktop show the phone simulator in centre; shared UI elements (nav, buttons) must work on both