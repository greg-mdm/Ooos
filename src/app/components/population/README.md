# Population Widget: Real-Time Mini Model

A small embeddable card — visible title **"Canada population, real-time mini
model"** — that shows a live, modelled Canada population figure and the change
since the viewer's local midnight. It lives on the CID page (living-wall white
panel, below the "Open our National Strategy" link) but is self-contained and
can be embedded anywhere in the site.

> This widget is a simplified mini model adapted from Statistics Canada's
> Canada population clock concept. It uses public aggregate Statistics Canada
> tables through the Web Data Service. It is not the official Statistics
> Canada population clock and does not imply endorsement by Statistics Canada.

## Files

| File | Role |
|---|---|
| `PopulationClockCard.tsx` | The card component: title, animated hero number, change since midnight, reference/refresh metadata, loading/error states, disclosure note, source line, link to the official clock. |
| `statcanClient.ts` | Data service. Fetches Statistics Canada Web Data Service (WDS) tables, normalizes them to `{ basePopulation, baseReferenceDate, annualNetChange, netChangePerSecond, rateBasis, sourceTables, fetchedAt }`, caches in `localStorage`. |
| `populationMiniModel.ts` | Pure model math: current modelled population, change since midnight, formatting. No I/O. |
| `../../../styles/population-widget.css` | Styles (`pmm-` prefix). Base card is 320–420 px; `pmm-card--wide` is the fluid living-wall form. |

## Data sources (public aggregate tables only)

| Table | Product ID | Used for |
|---|---|---|
| 17-10-0009-01 — Population estimates, quarterly | `17100009` | Latest Canada base population + year-over-year fallback rate |
| 17-10-0059-01 — Components of natural increase, quarterly | `17100059` | Births, deaths |
| 17-10-0040-01 — Components of international migration, quarterly | `17100040` | Immigrants, emigrants, returning emigrants, net temporary emigration, net non-permanent residents |
| 17-10-0045-01 — Interprovincial migrants, quarterly | `17100045` | **Intentionally unused** for the national figure — interprovincial moves net to ~0 for Canada. Wire it in only for provincial/territorial secondary detail. |

WDS endpoints used (see https://www.statcan.gc.ca/en/developers/wds):

- `POST /t1/wds/rest/getCubeMetadata` — discover dimension members at runtime
- `POST /t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods` — latest periods by coordinate
- `POST /t1/wds/rest/getDataFromVectorsAndLatestNPeriods` — fast path once vector IDs are confirmed

## The model (and how it differs from the official clock)

```
annual_net_change   = births − deaths + immigrants − emigrants
                      + returning_emigrants − net_temporary_emigration
                      + net_non_permanent_residents          (latest 4 quarters)
net_change_per_sec  = annual_net_change / seconds_in_year
population(now)     = base_population + seconds_since_base_reference × net_change_per_sec
change_since_midnight = seconds_since_local_midnight × net_change_per_sec
```

Statistics Canada's official clock is also a model, but a richer one: it uses
more granular event timing, seasonality, randomized event placement, and is
recalibrated quarterly against demographic estimates. This widget is a linear
simplification and discloses that on its face.

**Rate derivation is tiered:**

1. `rateBasis: "components"` — the formula above, when every component member
   resolves from cube metadata and passes a sanity check against tier 2.
2. `rateBasis: "year-over-year"` — latest quarterly estimate minus the estimate
   4 quarters earlier (captures all components by definition).
3. If neither works and no cache < 7 days old exists, the card shows
   *"Latest Statistics Canada data could not be loaded."* — it never counts up
   from fabricated or silently stale data.

Data reloads on page load; successful fetches are cached in `localStorage`
for 24 h (`CONFIG.cacheTtlMs`) since the tables are quarterly.

## Configuring endpoints / vectors / tables

Everything lives in `CONFIG` at the top of `statcanClient.ts`:

- `wdsBase` — point at a caching proxy here if you add a backend (e.g.
  `GET /api/statcan/population-mini-model`); the site is static today, so the
  browser calls WDS directly (WDS responses are CORS-enabled).
- `products` — the product IDs above.
- `vectorOverrides` — once exact vector IDs are confirmed (e.g. via
  `getSeriesInfoFromCubePidCoord`), fill in all eight and the client skips the
  metadata round-trip and uses `getDataFromVectorsAndLatestNPeriods`.
- Cache key/TTLs and request timeout.

Member-name matching (`MEMBER_NAMES`) is case-insensitive English; if StatCan
renames a member the client degrades to the year-over-year basis rather than
guessing.

## Embedding

Within this site:

```tsx
import { PopulationClockCard } from "./population/PopulationClockCard";

<PopulationClockCard />        // standalone card, max-width 420px
<PopulationClockCard wide />   // fluid form (used on the CID living wall)
```

On an external site: copy the three source files plus
`population-widget.css` into any React project (no other dependencies), or
mount it in a tiny Vite build and drop the bundle in with a `<div id=…>` +
`createRoot`. Do **not** iframe or frame Statistics Canada's pages.

## Attribution requirement (non-negotiable)

The card must always visibly display:

> Source: Statistics Canada, Canada's population clock (real-time model), and
> related public data tables. Adapted using Statistics Canada Web Data
> Service. This does not imply endorsement by Statistics Canada.

plus the note *"Mini model based on public Statistics Canada tables; not the
official StatCan clock."* and the link **"View official Statistics Canada
population clock"** → https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2018005-eng.htm
(opens in a new tab with `rel="noopener noreferrer"`). Do not add Government
of Canada branding, wordmarks or flag lockups to the card.

This widget is a simplified mini model adapted from Statistics Canada's Canada
population clock concept. It uses public aggregate Statistics Canada tables
through the Web Data Service. It is not the official Statistics Canada
population clock and does not imply endorsement by Statistics Canada.
