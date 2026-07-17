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
Editorial rules (standing, from Greg — apply to ALL user-facing text):
NO em dashes, ever. Use a comma, a colon, or a new sentence.
NEVER an acronym without its meaning spelled out on first use.
NEVER invent facts (e.g., don't call a video and an ad campaign "two films").
Use Greg's supplied copy verbatim; any NEW text (even button labels) must be
flagged for approval before it ships.
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

Preferred workflow (Greg, 2026-07-16): DIRECT TO MAIN, not branch-and-PR.
Greg approves in chat, then Claude pushes straight to `main` (auto-deploys to
ooos.ca). No pull request, no merge screens. Flow: make the change, `npm run
build` clean, show Greg (screenshot/summary), on his go-ahead push to `main`.
If `main` moved, rebase onto it first (never force-push `main`). Only fall back
to a PR if a direct push is blocked. Never push unapproved work to `main`.

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

Current state — 2026-07-16 (live on ooos.ca)
JellyBean Journeys homepage widget (`public/jellybean-journeys/index.html`, an x-dc
data component; React/Babel load from unpkg at runtime; homepage embeds it via an
iframe in `Home.tsx` with a `?v=N` cache-buster — BUMP N on every edit to that HTML
or clients keep the cached copy). Below the carousel sits the "Remember to Live"
section, now a ROBIN'S-EGG LIGHT band (matches the hero): Pop Culture eyebrow →
Remember to Live (Audiowide H1) → lede → Pop Culture Parallels (Poppins-800 H1,
violet clock icon). Two media cards (2013 BuzzFeed/Ze Frank video; 2018 Ruavieja
campaign still that opens the D&AD case) each show the media with a DARK PIANO-KEY
title strip below it that taps open the description (accordion). Then a reflection
trio, two "advent door" charts (1 Two ways of knowing; 2 Comparative History:
Memento mori · Memento vivere — dark colour-block table + Chicago notes), and a CID
plug CTA "Access the innovation watchlist →". Editorial content approved by Greg;
descriptions/citations are verbatim.
Innovation Watchlist hero (`public/Innovation Watchlist.dc.html`, iframe in `CID.tsx`,
own `?v=N`): CID description + a TEAM PYRAMID — Greg Long (human Principal
Investigator) on top; the two AI agents below (Ethel, Ethical Analyst, with her
portrait `assets/video/ethel-power.webp`; Icarus III, Executive Trader, with a
vector roman-numeral III emblem — real portrait still pending from Greg).
Pop Clock Mini on CID: REBASED to StatCan's official reading via
`public/pop-clock/calibration.json` (run `npm run pop-clock:rebase -- <pop> <since
midnight>` with a human-read figure; snapshot auto-expires after 21 days, so re-pin
every week or two or it falls back to the WDS year-over-year rate). Earlier: Ooo
Divisions cards are dark glass with gold Poppins-800 "Products & Services" toggles;
OEA explorer defaults to Creative Cluster with working Add Finance; brand colours
are Ruby `#822F00` headings + dark-amethyst/violet links (no off-brand crimson/green).
The living-wall ("Force of Nature") section is a 2-slide
panel slider (`LivingWallSlider` in `CID.tsx`): slide 1 = nature blurb + National Strategy link
+ branded pop-clock teaser, with the LIVE population estimate floating in the art's misty
circle (`PopulationMedallion`, positioned in `cid-forest.css`, center ~86.5%/71% of the stage);
slide 2 = the full Ooo! Pop Clock Mini card (Humans of Canada kicker, electric-wordmark H2
lockup + Lovelo "Pop Clock Mini", live figure, model description, source, official-clock link)
— the panel shifts up and the solid card COVERS the baked "A Force of Nature" title (pinned
frame 25%→83% of the stage; verified in-frame at 901–1920px; mobile stacks ≤900px). Meta + the
full StatCan attribution sit in a small strip below the stage (`PopulationSourcesStrip`).
Widget internals live in `src/app/components/population/` — `statcanClient.ts` fetches the
StatCan Web Data Service with runtime coordinate discovery (tables 17-10-0009/0059/0040;
tiered rate: components → year-over-year → explicit error state; 24h localStorage cache),
`populationMiniModel.ts` is the pure math, `README.md` documents everything. Also shipped: a
standalone dependency-free export at `public/pop-clock/` (live at ooos.ca/pop-clock/ —
ooo-pop-clock.js + demo + README; embeds anywhere with a div + script tag).
Earlier (2026-06-24): About page rebuilt (credentials stack; brand violet `#2B0561` → Portal
`#4B00B6`); design-system Ooo logo + indigo glassmorphism panel; CID watchlist embed
full-bleed; Ostara hero radial gradient.
Open / next
Confirm the live WDS fetch on ooos.ca/cid (the dev sandbox couldn't reach statcan.gc.ca; if
StatCan's member names differ the card visibly falls back to the year-over-year basis or the
error state — check the "Rate basis" line in the sources strip under the living wall).
Optionally fill `vectorOverrides` (statcanClient.ts / ooo-pop-clock.js) with confirmed vector
IDs to skip the metadata round-trip.
Possible maple-leaf size/position tweak on the homepage hero (`clamp(140px, 16vw, 200px)`).
PR #3 (GitHub MCP write-access `.mcp.json`) is an optional draft.
