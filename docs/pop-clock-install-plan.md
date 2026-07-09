# Ooo! Pop Clock Mini — install plan & as-built record

**Status:** shipped (2026-07-09) · live on ooos.ca/cid and ooos.ca/pop-clock/
**Deep docs:** `src/app/components/population/README.md` (model, rings, data
contract) · `public/pop-clock/README.md` (standalone embed)

## The two installs the materials describe

The white transparent panel on the CID "A Force of Nature" cliff section is a
**two-slide slider** (`LivingWallSlider` in `src/app/components/CID.tsx`):

| Surface | What renders |
|---|---|
| **Slide 1 — teaser** | The nature blurb + "Open our National Strategy" link, with the branded pop-clock teaser tucked beneath in the white space (compact device: Humans of Canada kicker, electric Ooo! wordmark + Lovelo "Pop Clock Mini", live estimate, and a "See the live model ›" arrow that advances the slider). The **live population estimate also floats in the art's misty circle** (`PopulationMedallion`, centred ~86.5% / 71% of the stage). |
| **Slide 2 — full embed** | The panel shifts up and the solid Ooo! Pop Clock Mini card **covers the baked "A Force of Nature" title** (pinned 25%→83% of the stage) — the full ring embed, model copy, and the official-clock link, without the Force of Nature title. Meta + full StatCan attribution render in `PopulationSourcesStrip`, a small-text strip below the stage. |

Verified in-frame at 901–1920px; the layout stacks below ≤900px.

## Architecture (native React, on the CID page)

- `src/app/components/population/PopulationClockCard.tsx` —
  `usePopulationModel()` (one shared data load for every surface),
  `PopClockCard` (compact with `onAdvance`, or `detailed` with the
  differentiated ring row), `PopulationMedallion`, `PopulationSourcesStrip`.
- `src/app/components/population/statcanClient.ts` — StatCan Web Data Service
  fetches with runtime coordinate discovery (tables 17-10-0009-01,
  17-10-0059-01, 17-10-0040-01), tiered rate derivation
  (components → year-over-year → explicit error state), 24 h `localStorage`
  cache, ≤7-day stale fallback. No backend, no keys — public CORS API.
- `src/app/components/population/populationMiniModel.ts` — pure model math
  (headline, change since midnight, per-stream ring readings); the rings
  always reconcile to the headline because both derive from the same rates.
- `src/styles/population-widget.css` (`pmm-` prefix) + slider/medallion
  positioning in `src/styles/cid-forest.css`.

## The standalone export

`public/pop-clock/` — a dependency-free drop-in for any site
(`ooo-pop-clock.js` + wordmark + demo `index.html` + README), live at
https://ooos.ca/pop-clock/. Embeds with a div + one script tag; same tables,
model and attribution rules as the on-page widget.

## Attribution (non-negotiable, kept on every full surface)

Source line ("Source: Statistics Canada, Canada's population clock (real-time
model), and related public data tables… does not imply endorsement…"), the
"experimental tool" disclaimer, and the official-clock link render on the
slide-2 card / sources strip, the standalone demo, and the export's README.
The slide-1 teaser is an on-page preview one tap from the full attribution.
No Government of Canada symbols anywhere.

## History notes (how this landed)

- The widget bundle first landed as `public/cid/index.html` (+ script,
  wordmark), where the real file **shadowed the SPA's `/cid` route** on
  GitHub Pages (a real file beats the `404.html` fallback) — ooos.ca/cid
  briefly served the demo. Fixed in `eb22bab` by moving the bundle to
  `public/pop-clock/`. **Never put an `index.html` under
  `public/<spa-route>/`.**
- Two parallel sessions built the living-wall integration the same day; the
  native React implementation (`ffa62f0`…`b75fa75`) is canonical. The
  standalone-script slider variant (`c0e46a6`) was superseded unmerged
  (recorded in the `88ae2ee` merge) — its useful remainder was this document
  and the `/cid` fix above. The standalone script remains the **export**
  path, not the on-page implementation.

## Verification & open items

- [x] `/cid` route unshadowed (`dist/cid/` has no `index.html`).
- [x] Slider, teaser, medallion, title-covering slide 2 verified 901–1920px
      (see CLAUDE.md ship state, 2026-07-09).
- [ ] Confirm the live WDS fetch on ooos.ca/cid — the dev sandbox can't reach
      statcan.gc.ca. If StatCan's member names differ, the card visibly falls
      back to the year-over-year basis or the error state; check the
      "Rate basis" line in the sources strip under the living wall.
- [ ] Optional: fill `vectorOverrides` (statcanClient.ts / ooo-pop-clock.js)
      with confirmed vector IDs to skip the metadata round-trip.
