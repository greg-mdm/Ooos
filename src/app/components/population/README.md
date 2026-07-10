# Ooo! Pop Clock Mini — Automated Predictive Model

A branded, **bordered embeddable clock device** (electric Ooo! wordmark
lockup, "Humans of Canada" kicker). Its point of difference from StatCan's
clock — six identical bars — is a **differentiated ring row**: births,
deaths and immigrants are solid rings that fill toward the next modelled
event and reset (green = adds, coral = subtracts); emigrants and net
non-permanent residents are dashed rings showing net "drift" (no single
events). Green adds, coral subtracts, so the whole sign structure reads at a
glance without a legend. The rings are driven by the same four-quarter rates
as the headline, so they always sum to the day's change.

On the CID page it shares the living-wall slider with the National Strategy
feature: **slide 1** is the nature content plus a compact device (branding +
live estimate + a highly-visible "See the live model ›" arrow that advances
the carousel); **slide 2** shifts the panel up so the solid device covers the
baked "A Force of Nature" title and carries the full ring embed + model copy
+ the "Check Canada's official real-time population clock" link. The meta rows
and attribution render as a small-text strip below the section
(`PopulationSourcesStrip`).

> This widget is a simplified mini model adapted from Statistics Canada's
> Canada population clock concept. It uses public aggregate Statistics Canada
> tables through the Web Data Service. It is not the official Statistics
> Canada population clock and does not imply endorsement by Statistics Canada.

## Files

| File | Role |
|---|---|
| `PopulationClockCard.tsx` | `usePopulationModel()` (one shared data load) + `PopClockCard` (device; compact with `onAdvance`, or `detailed` with the ring embed, footnote, official-clock link) + `PopulationSourcesStrip`. Internally: `EventRing` (rAF-driven solid rings, pulse on each event, paused off-screen via IntersectionObserver), `DriftRing` (dashed net), `Headline` (tally-counter digits). |
| `statcanClient.ts` | Data service. Fetches Statistics Canada Web Data Service (WDS) tables, normalizes them to `{ basePopulation, baseReferenceDate, annualNetChange, netChangePerSecond, rateBasis, components{births,deaths,immigrants,emigrants,netNonPermanentResidents}, componentsLive, sourceTables, fetchedAt }`, caches in `localStorage`. Components are live per field when they resolve, else `REFERENCE_COMPONENTS`. |
| `populationMiniModel.ts` | Pure model math: current population, change since midnight (= sum of ring contributions), per-stream ring readings (event interval / count, drift net), formatting. No I/O. |
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
# headline rate — the change in the population SERIES itself (self-consistent
# with the base, so the projection tracks the official clock instead of drifting):
annual_net_change   = base_population − population_one_year_earlier   (table 17-10-0009-01)
net_change_per_sec  = annual_net_change / seconds_in_year
population(now)     = base_population + seconds_since_base_reference × net_change_per_sec

# each ring is its own stream. births/deaths/immigrants/emigrants use the live
# component rates; the NPR / net-migration drift ring carries the residual so
# the five streams still sum exactly to annual_net_change:
npr_rate                = annual_net_change − (births − deaths + immigrants − emigrants)
event_interval(stream)  = seconds_in_year / stream_rate         # births/deaths/immigrants
events_since_midnight   = floor(seconds_since_midnight / event_interval)
drift_since_midnight    = round(seconds_since_midnight × stream_rate / seconds_in_year)  # emigrants/NPR
change_since_midnight   = Σ signed ring contributions           # the rings reconcile to the headline
```

Statistics Canada's official clock is also a model, but a richer one: granular
event timing, seasonality, randomized event placement, quarterly recalibration
against demographic estimates. This widget is a linear simplification and says
so — the sources strip notes it "may differ from StatCan's population clock,
which projects from its own model baseline."

**Rate basis:** the headline rate is the year-over-year change in the same
quarterly Canada estimate the base comes from (`CONFIG.rateWindow: "year"`, or
`"quarter"` for the latest quarter annualised). This is authoritative because it
captures every component exactly as StatCan published the totals — a raw
component sum can drift from the official clock when a component vintage lags or
the dropped terms (returning emigrants, net temporary emigration, residual
deviation) matter. The raw component sum is used only as a fallback when the
population series is too short for a year-over-year figure.

**Failsafes keeping it aligned with the official clock:**

1. **Rate-consensus guardrail (always on).** The rate is estimated three
   independent ways — year-over-year, latest-quarter-annualised, and the
   component sum. If the primary estimate is an outlier versus the median of the
   others (tolerance `max(150k, 60%)`), the median wins. A single bad source
   (e.g. a lagging component vintage — the cause of the original ~24.7k drift)
   can no longer poison the projection. Normally a no-op.

2. **Calibration anchor (opt-in, tightest alignment).** `public/pop-clock/calibration.json`
   is a same-origin snapshot of StatCan's population clock — `{ enabled,
   population, capturedAt, ratePerSecond }`. When enabled and fresh (≤ 21 days,
   not future-dated), the widget re-bases to it and extrapolates only the short
   hop since `capturedAt`, so error stays within a minimal margin regardless of
   rate wobble (a 12-hour hop cuts a given rate error ~200× versus the ~100-day
   hop from the quarterly base). `ratePerSecond` optionally pins the *speed* too:
   set it to StatCan's own rate (derived from their "change since midnight" over
   the seconds since Eastern midnight) and our clock ticks in lockstep with
   theirs. Malformed/disabled/stale → it silently falls back to the
   year-over-year calculation. Same-origin, so no CORS and no direct call to
   statcan.gc.ca.

3. **Daily-change alarm (always on).** `CONFIG.maxAbsDailyChange` (1,750/day) is a
   ceiling on the combined net change for one day — all five streams summed into a
   single figure. Canada's real current combined total is ~1,237/day (~452k/yr),
   so this sits above it but tighter than a permissive ceiling would (a literal
   1,000/day would false-alarm) — splitting the difference. If the derived rate
   ever implies more than the ceiling, the widget `console.warn`s and falls back
   to the guarded year-over-year rate (else the StatCan reference) instead of
   ticking a runaway number. Raise it if national growth re-accelerates (Canada
   added ~3,500/day at the 2023 immigration peak).

**Refreshing the anchor (the "rebase button"):**

- One command: `npm run pop-clock:rebase -- <population> [changeSinceMidnight]`
  (read both off StatCan's clock; the second arg pins the rate). Writes
  `calibration.json`; refuses to write if the reading implies > 1,750/day versus
  the previous snapshot (`scripts/rebase-pop-clock.mjs`, `--max=<n>` to tune).
- On GitHub: **Actions → "Rebase pop clock calibration" → Run workflow** (enter
  the figure), or the daily schedule. The schedule uses `--auto`, which safely
  skips until a confirmed source is set in the repo variable `STATCAN_CLOCK_URL`.
  See `.github/workflows/pop-clock-rebase.yml`.

**Component (ring) resolution:** births, deaths, immigrants and emigrants are
taken live from the component tables when their members resolve from cube
metadata, otherwise from `REFERENCE_COMPONENTS` (StatCan-grounded 2025–2026
annual rates). The NPR / net-migration drift ring carries the reconciling
residual, so the five rings always sum to the headline. Interprovincial
migration is omitted (it nets to ~0 nationally). If the base population estimate
itself can't be fetched and no cache < 7 days old exists, the card shows
*"Latest Statistics Canada data could not be loaded."*

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
import {
  PopClockCard,
  PopulationMedallion,
  PopulationSourcesStrip,
  usePopulationModel,
} from "./population/PopulationClockCard";

const state = usePopulationModel();        // one fetch, shared
<PopClockCard state={state} />             // standalone clock card, ≤420px
<PopClockCard state={state} detailed />    // + the publishable details
<PopClockCard state={state} wide detailed />  // fluid living-wall form
<PopulationMedallion state={state} />      // live estimate over stage art
                                           // (host CSS positions it)
<PopulationSourcesStrip state={state} />   // sources/meta, below the section
```

On an external site: copy the three source files plus
`population-widget.css` into any React project (no other dependencies), or
mount it in a tiny Vite build and drop the bundle in with a `<div id=…>` +
`createRoot`. Do **not** iframe or frame Statistics Canada's pages.

## Attribution requirement (non-negotiable)

Wherever the card is embedded, this line must stay visible nearby (it renders
in `PopulationSourcesStrip`, directly below the section):

> Source: Statistics Canada, Canada's population clock (real-time model), and
> related public data tables. Adapted using Statistics Canada Web Data
> Service. This does not imply endorsement by Statistics Canada.

The card itself carries the disclaimer *"This is an experimental tool and is
not endorsed by Statistics Canada."* and the link **"View Canada's official
population clock"** → https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2018005-eng.htm
(opens in a new tab with `rel="noopener noreferrer"`). Do not add Government
of Canada branding, wordmarks or flag lockups to the card.

This widget is a simplified mini model adapted from Statistics Canada's Canada
population clock concept. It uses public aggregate Statistics Canada tables
through the Web Data Service. It is not the official Statistics Canada
population clock and does not imply endorsement by Statistics Canada.
