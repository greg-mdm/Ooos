# Workflow review: the cast stage sprint

**Written:** 2026-09-11, from the Claude Code desktop session that built the
CID character cards, 2026-09-04 to 2026-09-11 (commits `6501cb9` to `3e3b759`).
**Repo:** `greg-mdm/Ooos` · **Local clone:** `C:\Users\ooodi\Projects\Ooos-publish`
**Reads with:** `WORKING-GUIDE.md` (the standing guide) and
`.claude/skills/direct-to-main/SKILL.md` (the publish skill). This file records
what those two do not yet say. Section 3 lists the lines in them that are now
stale or incomplete.

What shipped in the sprint, in one breath: the Sturgeon film became a
three-character rail, then a page-width film roll, then a featured stage with
a side rail of tiles; Ethel and the General got full cards (spec rows, folds,
featured boxes, a reading scorebox, a squadron formation); the safeguards,
Strategic Priorities and Methods became progressive disclosure; Global
Interoperability became two red-shader orbs; the Information Ecosystem went
to two columns with the SWOT marks; and a run of copy edits went in verbatim.

---

## 1. Common issues and snags, with the fix that held

### Publishing and verification

**The live site's `/cid/` route answers 404.** `curl https://ooos.ca/cid`
redirects to `/cid/`, which GitHub Pages serves as the SPA fallback with a 404
status and, to curl, no bundle names. Fetch the root instead and read the
hashed asset names from it:

```bash
html=$(curl -sL "https://ooos.ca/?cb=$RANDOM")
js=$(echo "$html" | grep -oE '[^"]*assets/index-[^"]+\.js' | head -1)
css=$(echo "$html" | grep -oE '[^"]*assets/index-[^"]+\.css' | head -1)
```

**"Is it live yet" is answered by a string, not by time.** Poll the live
bundle for a string unique to the change (a new class name in the CSS, a new
phrase in the JS) every ten seconds, up to six minutes. GitHub Actions
reported success in every case this sprint; the poll is what proves the edge
is serving it. `api.github.com/repos/greg-mdm/Ooos/actions/runs` is reachable
and is the second opinion when the poll runs long.

**A second session pushes to `main`.** Greg edits the phone layout from a
mobile Claude Code chat, and uploads assets through the GitHub web UI ("Add
files via upload" commits). Every publish starts with
`git pull --ff-only origin main`. It refused nothing all sprint because
`--ff-only` fails loudly instead of merging, which is the point.

**A parked edit rides into the next commit.** A draft line (the Pearling
note) was applied to the working tree, then held on Greg's "stop". The next
unrelated task touched the same two files. Staging by path would have shipped
the parked line. The fix: before starting unrelated work, `git checkout --`
the parked files and keep the edit script in the scratchpad to re-apply later.
Always read `git diff --cached` for removed lines before committing; twice
this sprint that review caught something.

**Working directory drift.** The desktop harness resets the working directory
between tool calls. Every Bash call that touches the repo begins with
`cd /c/Users/ooodi/Projects/Ooos-publish &&`.

**`pkill` does not exist on this machine.** Stop the dev server from
PowerShell:

```powershell
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'vite' -and $_.Name -match 'node' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -Confirm:$false }
```

### Editing the source

**The working copies are CRLF and git normalises them.** `CID.tsx` and
`cid-vivarium.css` are CRLF on disk. A find-and-replace written with `\n`
anchors matches nothing. Every edit script detects the file's line ending and
converts the anchors before matching (template in section 2). A `sed -i` on
one line leaves the file with mixed endings and git warns "LF will be replaced
by CRLF"; the warning is harmless, the commit is normalised, but the next
script must still detect rather than assume.

**Edit scripts live in files, not in shell one-liners.** Inline `node -e` and
heredocs both failed on quoting at least once each (the heredoc failure was
"unexpected EOF while looking for matching quote" on a script containing
template literals). Write the script with the Write tool to the scratchpad,
run it with `node`. The script throws if an anchor matches zero or more than
one time, which is the safety net.

**`npx tsc --noEmit` reports 37 errors on `main` that are not ours.** Six are
`import.meta.env` typing in the CID components, the rest are in
`src/imports/`. Filter to the touched file and drop the `'env'` lines:

```bash
npx tsc --noEmit -p . 2>&1 | grep "CID.tsx" | grep -v "'env'"
```

An empty result is a clean typecheck for the change. `vite build` still does
not type-check, as the working guide says.

**Non-breaking spaces still bite.** Unchanged from the guide. Match on a
short substring.

### The in-app browser

**A hidden browser pane freezes the page.** When the Browser pane is not
displayed, CSS transitions do not advance, `requestAnimationFrame` does not
fire, lazy images do not load, and screenshots come back blank. Two false
"root causes" were invented and reverted before this was understood. The
rules that came out of it:

- Never read a width or height mid-transition. Inject
  `.cid-cast-frame, .cid-cast-frame * { transition: none !important }` before
  clicking, then measure.
- Prove visibility with `el.checkVisibility()` and geometry, not screenshots.
- Expect lazy `<img>` boxes to be 0px tall. That is not a layout bug; but it
  is the reason tiles now reserve their box with `aspect-ratio` (below).
- Load the page after `resize_window`, not before. The phone pager decides
  its layout at load.
- The first action of a `browser_batch` errors when the pane was closed, even
  when it succeeds in opening it. Retry the batch.

**`about:blank` is not a valid navigate target.** Open the pane with the dev
server root instead.

### Layout traps found by measuring

**"Not clipped" was hiding shrunken art.** With the roll frame at a fixed
height and the shot at `flex: 1 1 auto; min-height: 0`, adding detail under
the nameplate silently squeezed the art rather than overflowing. Every check
had said "nothing clipped" and was right; the film was 22px shorter. Measure
the media rect against its natural size, not just the frame's overflow.

**A grid item that spans the rail is at least the rail's height.** In the
stage grid the lit card spans three rows and the tiles fill two of them, so
a short card stretches to the tiles' combined height. Harmless here (the
blurred fill covers it) but worth knowing when a fourth character arrives.

**Reserve thumbnail boxes.** Tiles reserve their aspect box from
`--thumb-ratio`, which comes from a per-character `thumbRatio` (Icarus's
still is 4:5 while his lit art is 16:9). Without it the rail reflowed as each
thumbnail loaded.

**Image dimensions without `sharp`.** The repo has no image library. A
20-line WebP header parser (VP8X, VP8, VP8L chunks) read the three
thumbnails' sizes; it lives in the session scratchpad and is worth keeping in
`scripts/` if the need recurs.

### Copy

**A trend word can carry a meaning the site cannot.** "Pearling" was proposed
from a TikTok sense (flexing). The first dictionary results for the word are
a genital body modification and a sexual act. Search a slang term before
adopting it; the safe meaning here was the pearl-diving trade, which fit the
General better anyway. Greg's later draft made the word unnecessary.

**Names are canon, everything else is verbatim.** "Sturgen" was shipped
verbatim from a fast chat draft and put two spellings on one card. Standing
rule since 2026-09-10: character names take the nameplate's spelling
(Ethel, The Sturgeon General, Icarus the Third) whatever the draft says, and
the correction is mentioned in the recap. Every other supplied word ships as
written, with new wording flagged. A factual correction to a citation (the
Irwin Law series is "Essentials of Canadian Law") is the one other exception,
and it was flagged.

**Copy that describes a mechanism can contradict itself across drafts.** The
Pearling line said signals stream "to CID Headquarters for pattern
recognition" in the same message that said the General does the pattern
recognition. Read supplied copy against the copy already on the card before
placing it, and say so when they disagree; Greg rewrote rather than shipped.

**Chicago notes, not bibliography entries.** The page's one existing
citation is in note form. New references match it:
`David J. Mullan, <cite>Administrative Law</cite>, Essentials of Canadian Law (Toronto: Irwin Law, 2001).`

---

## 2. Reusable workflows

### The publish loop, as actually run (every commit this sprint)

1. `cd` into the clone, `git pull --ff-only origin main`.
2. Write the edit as a script in the scratchpad (template below), run it.
3. `npx tsc --noEmit` filtered to the touched file; `npx vite build`.
4. Start Vite in the background and wait for it:
   ```bash
   (npx vite --port 5173 > scratchpad/vite.log 2>&1 &)
   for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/cid | grep -q 200 && break; sleep 1; done
   ```
5. Probe in the in-app browser at 1440 and at 390, loading after each
   resize, measuring geometry (section 1 rules). Reset to `desktop` after.
6. `git add` by path. Read `git diff --cached | grep '^-'`. Commit with the
   trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
7. `git push origin HEAD:main`.
8. Poll the live bundle for a unique string. Stop Vite from PowerShell.
9. Report the commit hash and what a reader will see. "Live as `abc1234`"
   only after the poll returns.

Greg's directive in chat is the approval for content he supplied. New wording
of mine waits. "Stop" mid-turn means: nothing committed, report the state.

### The edit-script template

```js
const fs = require("fs");
const ROOT = "C:/Users/ooodi/Projects/Ooos-publish/";
const ed = (file, fn) => {
  let s = fs.readFileSync(ROOT + file, "utf8");
  const eol = s.includes("\r\n") ? "\r\n" : "\n";
  const n = (t) => t.replace(/\n/g, eol);
  const rep = (a, b, label) => {
    const A = n(a); const c = s.split(A).length - 1;
    if (c !== 1) throw new Error(file + " anchor (" + label + ") count=" + c);
    s = s.replace(A, n(b));
  };
  fn(rep); fs.writeFileSync(ROOT + file, s);
};
ed("src/app/components/CID.tsx", (rep) => { rep(`old`, `new`, "label"); });
```

Anchors are exact multi-line strings copied from the file. Print the block
with `sed -n` first when unsure.

### The browser probe

One `javascript_tool` call per viewport, returning an object. The pattern:
inject the no-transition style, click the character's `.cid-cast-hit`, wait
500ms, then return rects (`getBoundingClientRect`), computed styles, text
content, `checkVisibility()`, `scrollHeight - clientHeight` on the frame, and
`document.documentElement.scrollWidth - clientWidth` (the page carries a
known 8px horizontal overflow at desktop; 0 on the phone).

### The card model (data, not markup)

A character is one `CidCharacter` entry in `CAST` in `CID.tsx`. Everything on
a card is a field; the render is shared. Fields in play:

| Field | Renders as |
|---|---|
| `role`, `tagline` | Nameplate: role beside the name, tagline under them |
| `specs` | Label / value rows |
| `functions` | A heading and a list of folds, each name opening to its line |
| `reading` | Currently Reading: title, meta, count, bar, note, Chicago note in a fold |
| `nodes`, `partners`, `partnersHeading` | Pills and indigo keys, heading beside them |
| `features[]` | Featured boxes at the foot: `heading`, `tag {text, shape}`, `tone`, `rowsHeading`, `rows`, `text`, `notes`, `itemsHeading`, `items`, `foot` |
| `thumbRatio` | Reserves the rail tile's box when the still is not the lit art's shape |

Shape and tone are category: a rounded pill is an agent, a square label is a
machine-learning tool, and `tone: "accent"` sets the box in Blue Light
`#4DAEFF` against the agents' mauve. Adding a fourth character is a data
entry plus its assets; no CSS.

### The stage layout

- **Above 900px** the roll is a grid: the lit card in column 1 spanning three
  rows, the other cards in a 200 to 250px rail at the right as still plus
  name. Arrows are phone-only. `.cid-cast-roll`, `.cid-cast-frame.is-on`.
- **Wide art** (Ethel, Icarus, ratio at or above 3:2): art across the top,
  capped at `min(72vh, 760px)`, the sheet below in two columns and two boxes.
- **Narrow art** (the General, ratio under 3:2, class `is-side`): a 52/48
  split, film at the top of the left column, the nameplate and closing line
  over a scrim at the foot of that column, the sheet at the right. The rule
  is by ratio, so a new square or portrait character lands here on its own.
- **The blurred fill** is the shot's `::before`, reading `--shot-bg` (the
  character's still) with `blur(28px) brightness(.42)`. It is what makes a
  letterboxed 4:3 film sit in colour instead of black.
- **Folds** use native `<details>`: `.cid-cast-fn-fold` for the functions and
  the reference, `.cid-viv-priority--fold` and `.cid-raci-safe-fold` for the
  page's other sections. Chevron is a rotated border on `summary::after`.
- **The formation** (`.cid-cast-fns--formation`): first item spans the row,
  the rest hang in three columns; the stems and bar are `::before`/`::after`
  on the items so the bar sits at the second row's top whatever the lead's
  height. Copy this for any lead-plus-team structure.
- **The phone** (900px and under) is the mobile session's pager and was not
  touched: one card per screen, swipe or arrows, `--roll-h` measured.

### Memory

Four memories now steer these sessions: the canon palette, the launch date,
Blue Light `#4DAEFF`, and the canon character names. They live outside the
repo in Claude's memory directory. Anything a new session must know that is
not in this repo goes there, one fact per file, and the working guide stays
the source for anything about the code.

---

## 3. The earlier docs, reviewed

### `WORKING-GUIDE.md` (Sprint 5)

Still the right entry point. These lines are now stale or incomplete:

- **§2 "Verify before claiming it shipped."** Add the live-bundle poll and the
  `/cid/` 404 trap (section 1). The Actions tab is not reachable without `gh`;
  `api.github.com` is.
- **§2 "Standard publish sequence."** Add `git pull --ff-only origin main` as
  step one. The guide's `fetch` plus `rebase` is right for a divergent local
  branch; this sprint never had one because the pull came first.
- **§4 "does NOT type-check."** Add the filtered `tsc` line and the count of
  pre-existing errors, so a session does not mistake the 37 for its own.
- **§5 "Getting images in: use Google Drive."** Drive stays preferred. Note
  that GitHub uploads no longer cause rebase churn when every publish pulls
  fast-forward first; the three upload commits this sprint cost nothing.
- **§7 "The preview server is unreliable in the sandbox."** True for the
  web sandbox, not for the desktop app. On this machine Vite on `:5173` with
  the in-app browser is the standard check. Replace the line with the hidden
  pane rules from section 1.
- **§3 Brand colours.** Add Blue Light `#4DAEFF` (accent for machine-learning
  category labels, and the Greek tags) and Bright Silver `#E8ECF4`, Gold
  `#F0C040`, mauve `#AE99C9`, which the cast CSS uses throughout.
- **§1 CID naming inconsistency.** Still unresolved; still ask Greg.

### `.claude/skills/direct-to-main/SKILL.md`

The loop is correct. Two refinements from practice:

- **The approval gate, as it actually runs.** "Show Greg, wait for go-ahead"
  describes new features. For copy and layout Greg specifies in chat, his
  message is the approval and the work ships in the same turn; only wording
  of mine, and factual corrections, wait for a word. Say this in the skill so
  a new session does not stall on content he has already dictated.
- **Step 5 "Confirm the deploy."** Replace with the live-bundle poll.
- **Committer identity.** Commits this sprint carry Greg's git identity with a
  `Co-Authored-By: Claude Fable 5.1` trailer, which is the harness's own
  convention now. The skill's `git config user.name Claude` line is out of
  date.

### `SPRINT 4 - REFERENCES/Ooo Refinement Workflow.md`

Archived and mostly superseded. Still valid and worth carrying forward: the
design priorities (clarity over decoration, guided exploration over overload,
which is exactly the reasoning behind the featured stage and the folds), the
contrast table, the en dash rule, and "reuse existing classes before
inventing new ones". Stale: the local path (`C:\Users\grego\...`), the `site/`
prefix on every file path, and the `type(area): action` commit convention,
which this repo does not use. Commits here are one plain sentence, page first
(`CID: ...`), and that has been consistent for two sprints.

### `SPRINT 5 - CURRENT/HANDOFF-live-site-not-updating.md`

Resolved. Its "fetch the live page and read one string out of it" is the
method that became the standard deploy poll. Keep the file for the reasoning;
its specific commit hashes are history.

### `CLAUDE.md` (root)

Three rules. A fourth belongs there now: character names are canon and take
the nameplate's spelling whatever a chat draft says.

---

## 4. Handoff: the next chat

**Task Greg has named:** Global Interoperability. "Bring up Global
Interoperability, make the circles visible once the user clicks."

Where it lives:

- `src/app/components/CID.tsx`, the Strategic Priorities list:
  `<div className="cid-viv-priority-list cid-viv-priority-list--fold cid-viv-priority-list--ruby">`
  with three `<details className="cid-viv-priority cid-viv-priority--fold">`.
  The third, "Global Interoperability", is `open` at rest and holds
  `<div className="cid-viv-orbs">` with two `<RedShaderOrb title=...>`.
- `src/app/components/cid/RedShaderOrb.tsx`: the WebGL orb. Title at rest,
  sentence on hover, focus or tap (`data-open`). The frame loop is gated by an
  IntersectionObserver and `fit()` runs on a ResizeObserver, so a canvas that
  starts at 0px inside a closed `<details>` sizes itself when the fold opens.
  That was the display room's 1x1 bug and it is already handled.
- `src/styles/cid-vivarium.css`: `.cid-viv-orbs`, `.cid-viv-orb*`, and the
  ruby `[open]` border on `.cid-viv-priority-list--ruby`. The mobile session
  has tweaked the orbs' dark well; pull before editing.

The brief, confirmed by Greg's screenshot of 2026-09-11: the third priority
sits closed at rest, level with "Merit and Research Integrity" and "Trust and
Transparency", and the click is what brings the circles up. On `main` the
`<details>` at `CID.tsx:1158` still carries `open`. The work is:

1. Drop `open` from that element. The ruby border already follows `[open]`,
   so the closed card reads like its two neighbours.
2. Confirm the canvases wake when the fold opens: the orb's `fit()` runs on a
   ResizeObserver, so a canvas that started at 0px inside the closed fold
   should size itself on open. Check `drawingBufferWidth` after a click and
   read one pixel back; if it stays 1x1 the observer did not fire and a
   `toggle` listener on the details can call `fit()` directly.
3. Consider a short entrance for the orbs on open (scale from .96, opacity
   from 0, 300ms, off under `prefers-reduced-motion`), so the click feels
   like a reveal and not a layout jump. New behaviour, so show it first.
4. The mobile session has its own orb tweaks; pull before editing.

Open items still parked from this sprint, none blocking:

- `SPRINT 5 - CURRENT/CLAUDE-DESIGN-PROMPT-cast-case.md` has an uncommitted
  rewrite that contains em dashes; strip them before committing.
- `scripts/figma-export-svgs.mjs` is uncommitted; it exports SVGs from a
  Figma file with view access only, reading `FIGMA_TOKEN` from the shell.
- Four `cid-team-case-*.webp` files and `stop-sign-silver.svg` are in the repo
  and unreferenced.
- The Icarus face detail is limited by the 1376x768 source; a 2x render would
  fix it.
- BARBEL's expansion is a hover title only, since Greg's third draft dropped
  it from the printed copy.
