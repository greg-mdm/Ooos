# Next up: transplant the "yellow block" to /cid/iwatchlist

Greg colour-coded the /cid page. This is the agreed split. The subpage, the
doorway, and the cave copy removal are **already done and live**. What remains
is the transplant itself.

## The split

| Colour | Content | Where it goes |
|---|---|---|
| **Blue** | Observatory lockup (Canadian Innovation Dimension · Zoom in Ontario Data \| Live Data Observatory · Viewing: Ontario, + the IEP art) | **Stays on `/cid`** *and* is the header of `/cid/iwatchlist`. **DONE** |
| **Yellow** | Everything from below the blue header down to **just above the cave** | **Moves** to `/cid/iwatchlist` |
| Cave | `Underground` + the `cid-join` gradient band | **Stays on `/cid`**, design and gradient intact, all text removed. **DONE** |

After the move, `/cid` is focused on introducing CID: the team, the
architecture, the research areas and focus. `/cid/iwatchlist` is the first
prototype released by the CID.

## Sections to move (in order, from `CID.tsx`)

1. `<section className="cid-portal-band">` — the "A PORTAL HAS OPENED" drum roll
2. `<section className="cid-wl-hero">` — Innovation Watchlist hero iframe
3. `<section className="cid-watchlist-embed">` — the watchlist embed
4. `<DataAccessContinuum />`
5. `<section className="cid-livingwall">` — Pop Clock / living wall
6. `<section className="np-strategy">` — A Force of Nature
7. `<section className="cid-forest">`
8. `<section className="cid-canopy">`

**Stop before `<Underground />`.** Underground and `cid-join` stay on `/cid`.

> Check the portal band (1) with Greg. It reads as the lead-in to the watchlist,
> so it probably travels, but it was not explicitly colour-coded.

## The coupling to untangle (this is the whole job)

The yellow sections are not self-contained. Before moving the JSX:

- **`usePopulationModel()`** — called in `CID`, feeds `LivingWallSlider` and
  `PopulationSourcesStrip`. The call moves to `IWatchlist`. If any *retained*
  `/cid` section still uses it, the hook has to run in both pages (it is a
  read-only data hook, so calling it in both is fine; it has its own 24h cache).
- **`lwSlide` / `setLwSlide`** — living-wall slide index. Moves to `IWatchlist`.
- **`embedRef` + its `useEffect`** — the watchlist height postMessage listener.
  Already duplicated in `IWatchlist.tsx`; delete it from `CID.tsx` once section
  3 is gone.
- **`roomRef` stays on `/cid`** (the Viv display room is retained).
- **`DataAccessContinuum` and `LivingWallSlider`** are module-scope functions in
  `CID.tsx` and are **not exported**. Either export them and import into
  `IWatchlist`, or (cleaner) move both into their own file that both pages
  import. `Underground` stays where it is.
- **`onSupport`** is currently an unused prop on `CID` (the Support CTA it fed
  was removed with the cave copy). `App.tsx` still passes it. Decide with Greg
  whether the "Support the work" CTA reappears on `/cid/iwatchlist`, moves to the
  CID/VID intro page, or is dropped, then clean up the prop.

## CSS

The styles for these sections live in `cid-continuum.css`, `cid-forest.css`,
`cid-coins.css` and `site.css`, scoped under `.cid-scope`. `IWatchlist` already
renders inside `.cid-scope`, so **import those sheets in `IWatchlist.tsx`** and
the rules apply unchanged. Do not copy rule bodies; that would fork them.

## Verify before pushing

- `npm run build` clean (remember: it does **not** typecheck).
- `/cid` still renders: intro, Leadership, Viv case, team, ecosystem, Research
  Access, lens previews, cave, gradient into the footer, and no orphaned gap
  where the yellow block was.
- `/cid/iwatchlist` renders the header plus all eight moved sections.
- The pop clock still shows a live figure on whichever page it now lives on.
- Both `/cid/iwatchlist` and `/iwatchlist` resolve.
