# CLAUDE.md

Working guide for the ooos.ca site. Read this first, then start.

This file covers **how to work and publish**. Deep feature docs live next to their
code (see [Deeper docs](#deeper-docs)) — don't duplicate them here, link to them.

---

## 1. What this is

Marketing website for **Ooo Digital Media Studio**, live at <https://ooos.ca>.
Single-page React app (Vite + TypeScript), hand-written CSS.

Repo: `greg-mdm/Ooos`. Package: `ooos-site`.

### Business structure

Ooo Digital Media Studio is the parent studio. It has **three divisions**, shown
as the three cards in `OooDivisions.tsx` on the homepage:

| Division | Full name | Card heading |
|---|---|---|
| **MIC** | Media, Information and Culture | OBJECTIVES |
| **CID** | Canadian Innovation Dimension | STRATEGIES |
| **Reclaiming Agency** | (no acronym) | TACTICS |

> **Naming inconsistency to resolve:** the site renders CID as "Canadian
> Innovation **Dimension**", but `SPRINT 4 - REFERENCES/README-cid-data.md` and the
> `ooos-cid-data-pipeline` skill call it "Canadian Innovation **& Partnership**".
> The site is the source of truth for user-facing copy. Ask Greg before changing
> either; don't silently "fix" one to match the other.

### Pages and nav

Nav labels do **not** match their URLs. This trips people up constantly:

| Nav label | Route | Component |
|---|---|---|
| Research | `/ostara` | `Ostara.tsx` |
| Innovation | `/cid` | `CID.tsx` |
| Exhibition | `/exhibition` | `Exhibition.tsx` |
| Design | `/about` | `About.tsx` |
| (brand logo) | `/` | `Home.tsx` |

Also routed: `/pop-clock-mini` (standalone widget page), `/legacy` (old dashboard).

---

## 2. Publishing: push straight to main

**Greg's standing preference: DIRECT TO MAIN.** No pull request, no merge screens.
Pushing to `main` auto-deploys to ooos.ca via `.github/workflows/deploy.yml`
(GitHub Pages, triggers on push to `main`). Live in roughly 1–3 minutes.

**Never push unapproved work to `main`.** The flow is: make the change →
`npm run build` clean → show Greg → **he approves** → push.

### The command that works

```bash
git push origin HEAD:main
```

That's it. Auth comes from the ambient `GITHUB_TOKEN`/`GH_TOKEN` already in the
environment.

**Why pushes fail in other chats** — the three real causes, in order of frequency:

1. **Pushing to the session branch instead of `main`.** Claude Code on the web
   auto-creates a throwaway `claude/<random>` branch per session. That branch can
   carry a *different session's divergent history*, so pushing to it fails with
   non-fast-forward or 403. Ignore the session branch. Always push `HEAD:main`.
   Working on a detached HEAD is fine and normal here.
2. **`main` moved.** Greg uploads files through the GitHub web UI mid-session, so
   `main` advances underneath you. Fix by rebasing onto it (below), not by forcing.
3. **Rebasing onto the wrong base.** `git rebase FETCH_HEAD` after a fetch can try
   to replay dozens of unrelated commits. Rebase onto `origin/main` explicitly.

### Standard publish sequence

```bash
npm run build                       # must be clean before anything else
git add <specific files>            # never `git add -A`; uploads may be in the tree
git commit -m "..."
git fetch origin main
git rebase origin/main              # only if main moved; explicit base
npm run build                       # re-verify after a rebase
git push origin HEAD:main
```

**Do not force-push `main`.** If a rebase turns messy, stop and ask.

### Ignore these (they are wrong for this environment)

- `gh auth login` / `gh auth status` / device-code flows — **`gh` is not installed
  here.** Any recipe built on it is cargo-cult; it silently does nothing.
- `git -c credential.helper='!gh auth git-credential' push ...` — the helper is a
  no-op. Harmless, but it is not what authenticates you. Plain push is equivalent.

### Verify before claiming it shipped

```bash
git fetch -q origin main && git log --oneline -1 origin/main
```

Confirm your commit is the tip. Then tell Greg it's deploying — not "done."

---

## 3. Writing rules

**Copy and typography are one system: the words and how they wrap affect each
other.** Change one, check the other. These are standing rules from Greg and
apply to all user-facing text.

### Copy

- **No em dashes. Ever.** Use a comma, a colon, or a new sentence.
- **Never an acronym without its meaning spelled out on first use.**
  House form is **term first, acronym in brackets**: `augmented reality (AR)`,
  not `AR (augmented reality)`.
  Spelled-out terms stay **lowercase** unless they're proper nouns:
  `In real life (IRL), augmented reality (AR), and virtual reality (VR)` — the
  fully capitalized version reads like an official glossary and Greg has rejected it.
- **Never invent facts.** Don't infer a claim the source doesn't make (e.g. don't
  call a video and an ad campaign "two films").
- **Greg's supplied copy is used verbatim.** Any NEW text — including button
  labels, headings, eyebrows — must be flagged for approval before it ships.
  If you coin a word to fill a gap, say so explicitly so he can accept or replace it.
- **Quotes are verbatim.** No paraphrasing inside quotation marks. Cite with a
  page number. If a source doesn't support a claim, say so rather than stretching
  a quote to fit.

### Typography

- **CRISP PARAGRAPH BLOCKS.** Body copy reads as one clean shape, not three ragged
  edges with a short trailing last line. Set a measure in the **55–65ch** range
  (not wider) and add **`text-wrap: balance`** so line lengths even out and the
  bottom line fills. Applied to `.cid-viv-lead` / `.cid-viv-ecosystem-copy`; use
  the same treatment on any new prose block.
- **No orphans.** If a last word or a bracketed acronym drops to a line alone,
  bind it with a non-breaking space (` `). Several already exist in
  `CID.tsx` — they make exact string matching fail, so edit those lines with a
  script (match on a short substring) rather than a literal find-and-replace.
- **Lovelo is 900 weight only.** Any other weight makes the browser synthesize
  and distort the glyphs (uneven letter heights). Self-hosted "Lovelo Black" in
  `src/styles/fonts.css`.

### Brand colours

| Token | Hex | Use |
|---|---|---|
| Portal purple | `#4B00B6` | the `Ooo!` wordmark, headings |
| Electric | `#5B04DE` | accents (**not** the wordmark) |
| Ruby | `#822F00` | headings, eyebrow labels |
| Robin's-egg | `#F0F4F5` | page background (`--bg`, `--ot-bg`) |

The `Ooo!` wordmark is **Portal `#4B00B6`**, verified by sampling the actual
asset (`public/assets/brand/ooo-wordmark-portal-transparent.png`). It is easy to
mistake for Electric — if in doubt, sample the PNG, don't guess.

---

## 4. Build and run

```bash
npm install --legacy-peer-deps   # the flag is required; peer-dep conflicts exist
npm run dev                      # local dev server
npm run build                    # production build -> dist/
npm run preview                  # serve the built dist/
```

**`npm run build` does NOT type-check.** It's `vite build`; esbuild strips types.
TypeScript errors ship silently. Be deliberate with types — a clean build is the
bar, not proof of correctness.

---

## 5. File map

- `src/main.tsx` — entry · `src/app/App.tsx` — routes
- `src/app/components/` — pages and sections
  - `Home.tsx` (hero + `<OooDivisions/>`), `CID.tsx` (largest page), `About.tsx`,
    `Ostara.tsx`, `Exhibition.tsx`, `Layout.tsx` (nav + footer)
  - `OooDivisions.tsx` — the three division cards, data-driven. Products/services
    entries can be a single pill or an array (rendered side by side). Keep both
    columns going through `PillList` or array rows render as empty pills.
- `src/styles/` — plain CSS, one file per area. `site.css` is the large global
  sheet; `cid-vivarium.css`, `hero-top.css`, `ooodivisions2.css` etc. are scoped.
  Class prefixes: `ot-` (hero), `ood-` (divisions), `cid-` (CID page).
- `public/` — served at the site root. Assets in `public/assets/`. Reference as
  `${import.meta.env.BASE_URL}assets/<file>` and URL-encode spaces (`%20`).

### Media rules

- **Optimize before use.** Large art must be downscaled and converted to WebP
  (the hero maple leaf went 2500px / 3.2 MB PNG → 480px / 22 KB WebP). Pillow works.
- **Video:** re-encode to H.264 `+faststart`, drop audio, ~1280px wide. HEVC/`.MOV`
  will not play in most browsers — always re-encode.
- **Cache-bust when a filename is reused.** Browsers cache media by URL, so
  re-trimming a clip in place does not reach anyone who already loaded the page.
  Bump the version constant (e.g. `LENS_V` in `CID.tsx`, `?v=N` on the iframe
  embeds). **This is the cause of "my fix didn't work" reports** — the file on
  disk is correct, the browser is serving the old copy.

---

## 6. Deeper docs

Each owns its area. Read the relevant one before touching that feature; keep
detail there rather than growing this file.

All reference docs were consolidated into **`SPRINT 4 - REFERENCES/`** (they used
to sit next to their code; filenames were prefixed with their old parent folder
to avoid collisions).

| Doc in `SPRINT 4 - REFERENCES/` | Owns |
|---|---|
| `LENS-CLIPS.md` | CID "Two Ways of Seeing" lens clips: adding, trimming, cache-busting |
| `population-README.md` | Pop Clock Mini internals, StatCan Web Data Service client |
| `pop-clock-README.md` | The standalone, dependency-free pop-clock export |
| `README-cid-data.md` | CID live-data pipeline, signals feed, OEA explorer |
| `ATTRIBUTIONS.md` | Asset and source credits |
| `CLAUDE-sprint4-superseded.md` | The previous version of this guide, kept for history |
| `jellybean-journeys-README.md`, `coins-README.md`, `loon-README.md` | Homepage widget, coin art, loon assets |
| `CID-Data-Integration-Brief.md`, `pop-clock-install-plan.md` | Completed briefs and plans |

Still in place (moving these breaks them):

| Path | Why it stays |
|---|---|
| `.claude/skills/direct-to-main/SKILL.md` | Skills only load from `.claude/skills/` |
| `CLAUDE.md` (repo root) | Claude Code only auto-loads a root `CLAUDE.md`; it points here |

---

## 7. Gotchas that actually bite

- **Non-breaking spaces break string matching.** Several lines in `CID.tsx` carry
  ` `. An exact-match edit will fail with no obvious reason. Match on a short
  substring, or edit by line index with a script.
- **The preview server is unreliable in the sandbox.** `vite preview` gets killed
  and screenshots often can't be captured. Don't burn turns fighting it — build
  clean, push, and verify on the live site.
- **Greg uploads files through GitHub mid-session.** Always `git fetch origin main`
  before assuming you're up to date, and rebase onto `origin/main` explicitly.
- **The iframe embeds carry their own `?v=N`.** Bump it when editing the embedded
  HTML (`public/Innovation Watchlist.dc.html`, the display room,
  `public/jellybean-journeys/index.html`) or clients keep the cached copy.
- **State is reconstructed from `main`, not from chat.** Session links and
  `claude/*` branch names are regenerated every session and go stale immediately.
  A commit's `Claude-Session:` footer is a trace, not an access path. To get
  current: read `main`, read this file, read the relevant deeper doc.
