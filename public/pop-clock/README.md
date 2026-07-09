# Ooo! Pop Clock Mini — standalone widget

**Humans of Canada · Automated Predictive Model**

A self-contained, dependency-free population clock you can drop into any web
page. It shows a live, modelled estimate of Canada's population and the change
since the viewer's local midnight, computed from public Statistics Canada
aggregate tables fetched in the visitor's browser.

> This widget is a simplified mini model adapted from Statistics Canada's
> Canada population clock concept. It uses public aggregate Statistics Canada
> tables through the Web Data Service. It is not the official Statistics
> Canada population clock and does not imply endorsement by Statistics Canada.

Hosted demo: https://ooos.ca/pop-clock/

## What's in this folder

| File | Purpose |
|---|---|
| `ooo-pop-clock.js` | The whole widget: data fetching, model, markup, styles. Vanilla JS, no dependencies, ~10 KB. |
| `ooo-wordmark-portal-transparent.png` | The electric Ooo! wordmark used in the card header (brand asset — see Branding below). |
| `index.html` | Minimal demo page. |
| `README.md` | This document. |

## How to embed

Copy the folder (or just `ooo-pop-clock.js` + the wordmark PNG side by side)
onto your site, then:

```html
<div id="ooo-pop-clock"></div>
<script src="/path/to/ooo-pop-clock.js"></script>
```

That's it — the script auto-mounts into `#ooo-pop-clock`. For a custom mount
point or options:

```html
<script src="/path/to/ooo-pop-clock.js"></script>
<script>
  OooPopClock.mount(document.querySelector(".sidebar"), {
    detailed: false,               // hide the description/meta, keep the clock
    wordmarkUrl: "/img/ooo.png",   // override the wordmark location
  });
</script>
```

The card is ≤420 px wide, self-styled (`opc-` class prefix, injected once),
responsive, and inherits nothing from the host page except the viewport.

## How it works

### 1. Data — Statistics Canada Web Data Service (WDS)

On page load the widget calls the public WDS
(https://www.statcan.gc.ca/en/developers/wds) directly from the browser
(responses are CORS-enabled). Tables used:

| Table | Product ID | Used for |
|---|---|---|
| 17-10-0009-01 — Population estimates, quarterly | `17100009` | Latest Canada base population + fallback rate |
| 17-10-0059-01 — Components of natural increase, quarterly | `17100059` | Births, deaths |
| 17-10-0040-01 — Components of international migration, quarterly | `17100040` | Immigrants, emigrants, returning emigrants, net temporary emigration, net non-permanent residents |
| 17-10-0045-01 — Interprovincial migrants | `17100045` | **Intentionally unused** — interprovincial moves net to ~0 for the national total |

Endpoints: `POST getCubeMetadata` (discovers dimension members at runtime, so
no vector IDs are hard-coded), then
`POST getDataFromCubePidCoordAndLatestNPeriods` for the latest periods. If you
confirm exact vector IDs, fill `CONFIG.vectorOverrides` at the top of the
script and it switches to the `getDataFromVectorsAndLatestNPeriods` fast path.

### 2. The model

```
annual_net_change   = births − deaths + immigrants − emigrants
                      + returning_emigrants − net_temporary_emigration
                      + net_non_permanent_residents          (latest 4 quarters)
net_change_per_sec  = annual_net_change / seconds_in_year
population(now)     = base_population + seconds_since_base_reference × net_change_per_sec
change_since_midnight = seconds_since_local_midnight × net_change_per_sec
```

The display re-computes from the wall clock once per second (no drift). At
recent Canadian growth rates the number moves roughly every few minutes —
that's honest: the official clock distributes modelled *events* per second,
while this is a linear simplification.

**Rate derivation is tiered:**

1. `components` — the formula above, when every component resolves from cube
   metadata **and** passes a sanity check against tier 2 (within 50% or
   100k persons of the year-over-year change — a member-name mismatch can
   never ship a wildly wrong rate).
2. `year-over-year` — latest quarterly estimate minus the estimate four
   quarters earlier. Captures all components by definition.
3. If neither works and no cache under 7 days old exists, the card shows
   *"Latest Statistics Canada data could not be loaded."* — it never counts
   up from fabricated or silently stale data.

The active basis and tables are printed on the card's meta line.

### 3. Caching

Successful fetches are stored in `localStorage` (`ooo-pop-clock-v1`) for
24 hours — the tables are quarterly, so that's plenty fresh. If a fetch fails,
a cache up to 7 days old is used (its refresh date stays visible on the card);
older than that, the error state shows instead.

### 4. Differences from the official StatCan clock

Statistics Canada's clock is also a model, but a richer one: granular event
timing, seasonality, randomized event placement, quarterly recalibration
against demographic estimates. This widget is a deliberate simplification and
discloses that on its face. Both are educational tools, not second-by-second
official counts.

## Configuration reference (top of `ooo-pop-clock.js`)

- `wdsBase` — point at your own caching proxy if you add a backend; default
  calls StatCan directly from the browser.
- `products` — the product IDs above.
- `vectorOverrides` — fill all eight to skip metadata discovery.
- `cacheKey` / `cacheTtlMs` / `cacheMaxAgeMs` / `requestTimeoutMs`.
- `wordmarkUrl` — defaults to the PNG beside the script.
- `officialClockUrl` — the click-through target.

## Attribution (non-negotiable)

The card always displays:

> Source: Statistics Canada, Canada's population clock (real-time model), and
> related public data tables. Adapted using Statistics Canada Web Data
> Service. This does not imply endorsement by Statistics Canada.

plus the disclaimer *"This is an experimental tool and is not endorsed by
Statistics Canada."* and the link **"View Canada's official population clock"**
(opens in a new tab, `rel="noopener noreferrer"`). Keep all three when
embedding. Do not add Government of Canada symbols, flag lockups or wordmarks,
and do not frame StatCan's pages.

## Branding

The electric (Portal violet) **Ooo!** wordmark is a brand asset of Ooo Digital
Media Studio (ooos.ca) — keep it when republishing this widget as-is; don't
reuse it for other products. The product name renders in the system font here;
on ooos.ca it's set in Lovelo Black, which is licensed to Ooo and not
redistributed with this asset.
