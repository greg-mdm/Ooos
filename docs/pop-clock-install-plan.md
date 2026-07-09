# Ooo! Pop Clock Mini — installation plan (as built)

**Status:** installed — teaser (slide 1) + full embed (slide 2) live on the CID cliff section
**Widget source:** `public/pop-clock/` (script, wordmark, README, standalone demo)
**Hosted demo:** https://ooos.ca/pop-clock/

## What was installed

The self-contained Pop Clock Mini widget (see `public/pop-clock/README.md` for
the model, data sources and attribution rules), appearing in the two places the
materials describe — both on the CID "A Force of Nature" cliff section, whose
white transparent panel is now a **two-slide slider**:

| Slide | Content |
|---|---|
| 1 | The existing strategy content (baked ruby title, blurb, "Open our National Strategy") + the **Pop Clock teaser** tucked beneath, in the white space. The teaser is the widget's compact mount (`detailed: false`) with its card chrome stripped — kicker, Ooo! wordmark + POP CLOCK MINI (Lovelo), model line, and "Estimated population:" with the live figure right-aligned. Clicking it opens slide 2. |
| 2 | The **full embed** — the widget's native detailed card (figure, meta, disclaimer, custom-example line, source, official-clock link) centered on the panel, **without the Force of Nature title**: a 1.1 KB feathered "clean panel" patch (`public/assets/images/cliff-title-patch.webp`, cut from the art itself) fades in over the baked title. |

Ruby slide dots (⬤ ⬤) sit under the panel content on both slides.

## File layout

- `public/pop-clock/ooo-pop-clock.js` — the widget, verbatim from the drop.
- `public/pop-clock/ooo-wordmark-portal-transparent.png` — brand wordmark
  (auto-resolved by the script from its own directory).
- `public/pop-clock/index.html` — standalone demo page.
- `public/pop-clock/README.md` — model, data sources, config, attribution.
- `public/assets/images/cliff-title-patch.webp` — slide-2 title cover,
  feathered on all edges, generated from the clean panel band of the art.

> ⚠ History note: the bundle originally landed in `public/cid/`, where its
> `index.html` shadowed the SPA's `/cid` route on GitHub Pages (a real file
> wins over the `404.html` fallback), breaking ooos.ca/cid. Moved to
> `/pop-clock/` in `eb22bab`. Never put an `index.html` under
> `public/<spa-route>/`.

## Integration architecture (`src/app/components/CID.tsx` + `cid-forest.css`)

- The CID page injects `/pop-clock/ooo-pop-clock.js` once (marked with
  `data-ooo-pop-clock`) and calls `window.OooPopClock.mount()` explicitly for
  each of **three mounts**: teaser (compact), slide-2 full card, and a band
  card. The widget's auto-mount id is unused; nothing double-mounts (each
  mount is skipped if it already has children). All mounts share the same
  24h `localStorage` cache — one fetch serves all three.
- **Scaling:** the widget is px-designed; the stage is aspect-locked to the
  art. A `ResizeObserver` sets `--lw-scale = stageWidth / 1920` and the
  overlays apply `transform: scale(var(--lw-scale))` — the teaser and card
  occupy a constant fraction of the art at every width, exactly like the
  frame/panel geometry.
- **Breakpoints:** below **1440px** the scaled overlays would drop under
  ~0.75× (unreadable), so the in-art slider elements hide (strategy pane
  stays), and the full card renders at natural size in a centered band on the
  section's ink-blue ground below the stage — including the ≤760px mobile
  stack.
- **Slider state:** plain React state; panes crossfade (300ms opacity), the
  title patch fades with slide 2. Dots and the teaser are keyboard-operable
  (buttons / `role="button"` + Enter/Space), with ruby focus rings.

## Attribution

The teaser is an on-page preview — the full attribution block (source line +
"not endorsed" disclaimer + "View Canada's official population clock" link)
renders one dot away on the slide-2 card, and always on the <1440px band card
and the standalone demo. No Government of Canada symbols anywhere.

## Data & network

- StatCan WDS fetched directly from the visitor's browser (public, CORS);
  no backend, no keys. 24h cache, ≤7-day stale fallback, honest error card
  ("Latest Statistics Canada data could not be loaded." — mock-verified).

## Verification (all checked in headless Chromium, WDS mocked)

- [x] `dist/cid/` contains no `index.html` (route unshadowed).
- [x] `/pop-clock/` demo mounts standalone.
- [x] Slide 1: teaser mounts, live figure ticks, attribution lines hidden,
      layout matches the artifact mock (1920).
- [x] Slide 2: patch covers the baked title (opacity 1), full card centered,
      bottom at 75.8% of the stage (inside the panel), strategy pane hidden.
- [x] Band at 1200px and 390px: slider hidden, card centered, value live.
- [x] Scale var tracks the stage (1.0 @1920).
