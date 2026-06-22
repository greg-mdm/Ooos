# CLAUDE.md

Guidance for AI agents (and humans) working in this repo. Read this first.

## What this is

Marketing website for **Ooo Digital Media Studio** — live at **https://ooos.ca**.
Single-page React app (Vite + TypeScript), mostly hand-written CSS.

## Stack

- React + TypeScript, bundled with **Vite**
- Styling: plain CSS in `src/styles/` (plus some Tailwind via `tailwind.css` / `theme.css`)
- Package name: `ooos-site`

## Run / build / deploy

```bash
npm install --legacy-peer-deps   # peer-dep conflicts exist; the flag is required
npm run dev                      # local dev server (vite)
npm run build                    # production build -> dist/ (vite build)
npm run preview                  # serve the built dist/ locally
```

- **Deploy is automatic on push to `main`**: `.github/workflows/deploy.yml` builds and
  publishes `dist/` to GitHub Pages (ooos.ca). Merging a branch into `main` = going live.
- **`npm run build` does NOT type-check** (it's `vite build`; esbuild strips types). TS type
  errors will not fail the build and can ship silently — be deliberate with types.
- Always run `npm run build` before committing; a clean build is the bar.

## Branching / workflow

- Active development branch: **`claude/friendly-franklin-jmxzmv`**.
- Develop on the feature branch, push, then open a PR into `main` and merge to deploy.
- Repo: `greg-mdm/Ooos` (GitHub).

## Layout & key files

- `src/main.tsx` — entry. `src/app/App.tsx` — app shell. `src/app/components/` — pages/sections:
  - `Home.tsx` — homepage (hero "top panel" + `<OooDivisions/>`).
  - `OooDivisions.tsx` — the 3-column MIC / CID / Reclaiming Agency cards (data-driven).
  - Others: `About`, `CID`, `Exhibition`, `Ostara`, `Layout`, modals, `RadioAd`.
- `src/styles/`:
  - `hero-top.css` — homepage hero ("top panel"). Classes prefixed **`ot-`** under `.ooos-top`.
  - `ooo-divisions.css` — the divisions section. Classes prefixed **`ood-`**.
  - `site.css` — large global stylesheet (most of the site).
  - `fonts.css` — `@font-face` + Google Fonts import.
  - `nav-gradient.css`, `theme.css` (Tailwind layer), `globals.css`, `index.css`, `tailwind.css`.
- `public/` is served at the site root; assets live in `public/assets/`. Reference them as
  `${import.meta.env.BASE_URL}assets/<file>` and URL-encode spaces (`%20`).

## Conventions & gotchas (learned the hard way)

- **Robin's-egg background** `#F0F4F5` is the homepage/page background (`--bg`, `--ot-bg`).
- **Lovelo is a single 900-weight face** (self-hosted "Lovelo Black", `src/styles/fonts.css`).
  Always use `font-weight: 900` for Lovelo — any other weight makes the browser distort the
  glyphs (uneven letter heights). Used for the division subtitles (`.ood-kind`) and several
  titles in `site.css`.
- **Optimize images.** Large source art must be downscaled + converted to WebP before use
  (e.g., the hero maple leaf went 2500px / 3.2 MB PNG → 480px / 22 KB WebP). Pillow works for this.
- The hero blurb sits in a **white tinted card** (`.ot-bigbox`, `rgba(255,255,255,0.75)` + soft
  shadow); the transparent maple-leaf image is a flex child that locks into the card's right square.
- `OooDivisions.tsx`: product/service entries can be a single `Pill` **or an array of pills**
  (rendered side-by-side on one row via the shared `PillList` / `.ood-pillrow`). Keep both columns
  going through `PillList` so array rows render instead of becoming empty pills.

## Continuity (Claude Code on the web)

- This work is driven from a Claude Code web session; resume at **https://claude.ai/code**
  (left sidebar) or `claude --teleport`. Every commit carries a `Claude-Session:` footer link.
- The branch is the source of truth — even a fresh session/agent can check out
  `claude/friendly-franklin-jmxzmv` and continue from this doc.

## Current state — 2026-06-22 (live on ooos.ca)

Homepage refinements merged to `main` (PRs #4, #5) and deployed:

- Hero "top panel": larger logo orb, edge-aligned welcome / Toronto pills, tighter spacing,
  3-line blurb in the white tinted card with the WebP maple leaf in the right square.
- Ooo Divisions: CID "Workshops" / "Experiments" product pills now render (side-by-side row);
  Lovelo subtitles fixed to weight 900.
- Hero leaf optimized to WebP (~22 KB).

### Open / next

- Possible maple-leaf size/position tweak (currently `clamp(140px, 16vw, 200px)`, vertically centered).
- Original "remove grey background" request — needs the exact element identified (likely in the
  Ooo Divisions section); the white hero card was the *wrong* target and has been restored.
- PR #3 (GitHub MCP write-access `.mcp.json`) is an optional draft.
