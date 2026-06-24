CLAUDE.md
Guidance for AI agents (and humans) working in this repo. Read this first.
What this is
Marketing website for Ooo Digital Media Studio — live at https://ooos.ca.
Single-page React app (Vite + TypeScript), mostly hand-written CSS.
Stack
React + TypeScript, bundled with Vite
Styling: plain CSS in `src/styles/` (plus some Tailwind via `tailwind.css` / `theme.css`)
Package name: `ooos-site`
Run / build / deploy
```bash
npm install --legacy-peer-deps   # peer-dep conflicts exist; the flag is required
npm run dev                      # local dev server (vite)
npm run build                    # production build -> dist/ (vite build)
npm run preview                  # serve the built dist/ locally
```
Deploy is automatic on push to `main`: `.github/workflows/deploy.yml` builds and
publishes `dist/` to GitHub Pages (ooos.ca). Merging a branch into `main` = going live.
`npm run build` does NOT type-check (it's `vite build`; esbuild strips types). TS type
errors will not fail the build and can ship silently — be deliberate with types.
Always run `npm run build` before committing; a clean build is the bar.
Branching / workflow
`main` is the single source of truth. It is what's live on ooos.ca (auto-deploys on
push) and is always the most complete state. Start every session by reading this file on `main`.
Claude Code on the web auto-creates a throwaway branch each session (e.g. `claude/<random>`).
That branch is scratch, not a home. Work isn't "saved" until it lands on `main` — either by
uploading the changed files to `main` (the no-clone web flow) or by opening a PR from the
session branch into `main` and merging.
Never leave work stranded on a `claude/*` branch, and never point a bookmark at one. The
next session gets a different random name, so any reference to a specific session branch is dead
on arrival. If you spin one up, merge it (or delete it) before you stop.
Repo: `greg-mdm/Ooos` (GitHub).
Layout & key files
`src/main.tsx` — entry. `src/app/App.tsx` — app shell. `src/app/components/` — pages/sections:
`Home.tsx` — homepage (hero "top panel" + `<OooDivisions/>`).
`OooDivisions.tsx` — the 3-column MIC / CID / Reclaiming Agency cards (data-driven).
Others: `About`, `CID`, `Exhibition`, `Ostara`, `Layout`, modals, `RadioAd`.
`src/styles/`:
`hero-top.css` — homepage hero ("top panel"). Classes prefixed `ot-` under `.ooos-top`.
`ooo-divisions.css` — the divisions section. Classes prefixed `ood-`.
`site.css` — large global stylesheet (most of the site).
`fonts.css` — `@font-face` + Google Fonts import.
`nav-gradient.css`, `theme.css` (Tailwind layer), `globals.css`, `index.css`, `tailwind.css`.
`public/` is served at the site root; assets live in `public/assets/`. Reference them as
`${import.meta.env.BASE_URL}assets/<file>` and URL-encode spaces (`%20`).
Conventions & gotchas (learned the hard way)
Robin's-egg background `#F0F4F5` is the homepage/page background (`--bg`, `--ot-bg`).
Lovelo is a single 900-weight face (self-hosted "Lovelo Black", `src/styles/fonts.css`).
Always use `font-weight: 900` for Lovelo — any other weight makes the browser distort the
glyphs (uneven letter heights). Used for the division subtitles (`.ood-kind`) and several
titles in `site.css`.
Optimize images. Large source art must be downscaled + converted to WebP before use
(e.g., the hero maple leaf went 2500px / 3.2 MB PNG → 480px / 22 KB WebP). Pillow works for this.
The hero blurb sits in a white tinted card (`.ot-bigbox`, `rgba(255,255,255,0.75)` + soft
shadow); the transparent maple-leaf image is a flex child that locks into the card's right square.
`OooDivisions.tsx`: product/service entries can be a single `Pill` or an array of pills
(rendered side-by-side on one row via the shared `PillList` / `.ood-pillrow`). Keep both columns
going through `PillList` so array rows render instead of becoming empty pills.
Continuity — how to resume (the permanent access path)
There is nothing to "resume" in the session sense. Context is reconstructed from `main`, not
from a chat session. Any session — web, CLI, or a plain Claude chat — gets fully caught up by:
Reading `greg-mdm/Ooos` at `main`.
Reading this `CLAUDE.md` (overview, conventions, current state — below).
Skimming bookmark issue #6 for the latest one-line state + open items.
Do not depend on `claude.ai/code/session_…` links or `claude --teleport` as the access path:
web sessions aren't in chat history, and those links/branch names are regenerated every session,
so they go stale immediately — this is what kept breaking. They're a convenience if a session
happens to still be open, never the source of truth. A commit's `Claude-Session:` footer is a
trace, not a dependency.

Establishing edit access (push to main) — the proven pathway
This is the part that historically broke (expired tokens, device-code loops). Follow in order:
1. Verify identity + push reach (no auth prompts if already good):
   `gh auth status` (should say "Logged in to github.com account greg-mdm")
   `git ls-remote --heads origin main` (prints a SHA = you can reach the remote)
2. If `gh` is NOT logged in, authenticate once via the web device flow:
   `gh auth login --hostname github.com --git-protocol https --web`
   (it prints an 8-char code like `XXXX-XXXX`; enter it at https://github.com/login/device — that
   code is shown by the CLI, it is NOT emailed; never type a code someone else gives you), then:
   `gh auth setup-git`
3. Make edits, then ALWAYS `npm run build` (must be clean), then commit.
4. Push straight to `main` (fast-forward) using gh as the credential helper — this is the command
   that works even when the ambient codespace token has expired:
   `git -c credential.helper='!gh auth git-credential' push origin HEAD:main`
   Pushing to `main` auto-deploys to ooos.ca via `.github/workflows/deploy.yml`.
   Alternative: open a PR from the session branch into `main` and merge.
Gotchas:
- The repo is often opened as a git WORKTREE on a `copilot/*` or `claude/*` branch; that's fine —
  commit there and push with `HEAD:main`. Confirm with `git worktree list`.
- VS Code's "Apply changes" button needs the open workspace folder to be a CLEAN git tree; if it
  errors, run `git status` in EACH worktree (`git worktree list`) and commit/reset the dirty one.
  Work that is already committed + pushed to `main` is safe regardless of that button.
- `gh issue`/`gh pr` may fail with "missing required scopes [read:project]" — that does NOT affect
  code pushes. For issues, use the GitHub API/MCP tools instead, or `gh auth refresh -s read:project`.

Current state — 2026-06-24 (live on ooos.ca)
About page rebuilt: studio intro, founder + credentials, business-information block. Credentials
now STACK vertically (most recent first); royal-blue `#19007D` swapped for brand violet
(`#2B0561` → Portal `#4B00B6`) so it no longer reads like TMU/Applyboard. Business info: business
name on its own line (no "Studio" label), inline "Label: value" colons, NAICS definition beside
the acronym. Design-system section: Ooo logo featured near the hero (optimized to a 10 KB WebP at
`public/assets/brand/ooo-logo-ds.webp`); "Principles in motion" column is now an indigo
glassmorphism + animated-gradient + noise panel (respects `prefers-reduced-motion`).
Earlier in this run: CID watchlist embed made full-bleed with an indigo two-cell observatory bar
(silver right cell, enlarged telescope); CID intro long lines capped (~58ch); Ostara hero given a
smooth radial gradient so the banner blends into the background.
Open / next
Possible maple-leaf size/position tweak on the homepage hero (`clamp(140px, 16vw, 200px)`).
Confirm which "sidebar" the glassmorphism treatment belongs on (applied to the design-system
"Principles in motion" column for now — there is no slide-out nav drawer in the site).
PR #3 (GitHub MCP write-access `.mcp.json`) is an optional draft.
