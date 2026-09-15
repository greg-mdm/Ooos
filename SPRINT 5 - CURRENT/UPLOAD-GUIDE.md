# MIC install — remaining 4 files (upload guide)

`MIC.tsx` is already live on `main` at `src/app/components/MIC.tsx`. These four complete the install.
Until all four are committed, the site build is incomplete (MIC.tsx imports mic.css and routes to /mic,
neither of which exists yet), so commit all four before checking the live site.

Each file below is renamed with its destination path encoded using `__` for `/`.
Rename it back (or just note the path) when you upload.

| Upload this file | To repo path | New/Edit |
|---|---|---|
| `1__public__mic__twelve-signs__index.html` | `public/mic/twelve-signs/index.html` | NEW |
| `2__src__styles__mic.css` | `src/styles/mic.css` | NEW |
| `3__src__app__App.tsx` | `src/app/App.tsx` | EDIT (overwrites) |
| `4__src__app__components__Home.tsx` | `src/app/components/Home.tsx` | EDIT (overwrites) |

## Fastest route: GitHub drag-and-drop upload (handles all 4 at once)

1. Go to: https://github.com/greg-mdm/Ooos/upload/main
2. Drag all four files in. GitHub places each at repo ROOT by default, so for the two that live in
   subfolders you must set the path: after dropping, GitHub shows each filename in a small field —
   OR, simpler, upload them one folder at a time using these URLs (drop the matching file into each):
   - `public/mic/twelve-signs/` → https://github.com/greg-mdm/Ooos/upload/main/public/mic/twelve-signs
     (drop `index.html`)
   - `src/styles/` → https://github.com/greg-mdm/Ooos/upload/main/src/styles  (drop `mic.css`)
   - `src/app/` → https://github.com/greg-mdm/Ooos/upload/main/src/app  (drop `App.tsx` — overwrites)
   - `src/app/components/` → https://github.com/greg-mdm/Ooos/upload/main/src/app/components  (drop `Home.tsx` — overwrites)
3. Remember to RENAME each file back to its real name before committing
   (e.g. `1__public__mic__twelve-signs__index.html` → `index.html`).
4. Commit message suggestion (one commit if you upload together, or per-file):
   `feat(mic): install Twelve Signs board + MIC page (css, routes, homepage link)`
5. Commit directly to `main`.

## What each edit changes (so a diff review is quick)
- **App.tsx** — adds `import { MIC }` and two routes: `/mic` and `/mic/twelve-signs`.
- **Home.tsx** — adds one line to the "Other project links" list: a `<Link to="/mic">` above the CID link.
- **mic.css** — new; scoped `.mic-scope` frame styling only.
- **index.html** — the board itself (eyebrow reads "Media, Information and Culture").

## After committing — verify (GitHub Pages rebuilds in ~1–2 min)
- https://ooos.ca/mic  → MIC page framing the board
- https://ooos.ca/mic/twelve-signs  → same (deep link)
- Homepage "Other project links" → new MIC link
- Watch the build: https://github.com/greg-mdm/Ooos/actions
