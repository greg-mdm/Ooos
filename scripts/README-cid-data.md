# CID live-data pipeline + interactive explorers

Wires the CID (Canadian Innovation & Partnership) watchlist to live government data,
with **no browser → government API calls** for the aggregated signals.

Flow (national signals): **GitHub Action → `fetch-cid-data.mjs` → `public/cid/data/signals.json` → page `fetch()`**

## Approach (decision)

- **National signals — Statistics Canada (StatCan) Web Data Service (WDS).** Public, no-key
  REST API. Pull by **Product ID (PID) + COORDINATE** via `getDataFromCubePidCoordAndLatestNPeriods`
  — coordinates are human-readable and survive table re-releases. One batched POST. The WDS
  **scalar factor** is applied (e.g. Labour Force Survey employment is stored in thousands → ×1000).
- **Provincial layer — Ontario Economic Accounts (OEA).** Annual/quarterly chained-dollar series
  from the uploaded workbook, extracted once into `public/cid/data/oea.json` and explored client-side.
- **No Public Use Microdata File (PUMF) ingest, no Real-Time Remote Access (RTRA).** Where a flagged
  survey is a PUMF, we pull the **aggregate table** StatCan derives from it via WDS instead.

## Files

| Path | Purpose |
|---|---|
| `scripts/fetch-cid-data.mjs` | Node 20. Batched WDS pull (PID+coordinate) → normalize → write `signals.json`. |
| `.github/workflows/cid-data.yml` | `workflow_dispatch` (manual). Runs the script, commits JSON if changed. |
| `public/cid/data/signals.json` | National aggregated signals, committed by the Action; served verbatim. |
| `public/cid/data/oea.json` | Ontario Economic Accounts tables 13 + 15, extracted from the workbook. |
| `public/cid/data-preview/index.html` | **Non-public** staged watchlist: live strip + LFS interactive app + OEA link. |
| `public/cid/data-preview/oea-explorer.html` | **Non-public** interactive chart for OEA tables 13 + 15. |

## Run it

```bash
node scripts/fetch-cid-data.mjs --mock   # offline, embedded fixture (validated values)
node scripts/fetch-cid-data.mjs          # live: needs network to www150.statcan.gc.ca
```

Open `public/cid/data-preview/index.html` (live strip + embedded StatCan Labour Force Survey
app + a link into the OEA explorer) and `oea-explorer.html` (toggle Table 13 / Table 15, pick series).

## What's wired now (all stable-PID, self-advancing; validated against the live source)

| Survey (acronym → full) | Table (PID) | Coordinate | Value | Ref | Cadence |
|---|---|---|---|---|---|
| **LFS** — Labour Force Survey | 14-10-0287-03 (`14100287`) | `1.3.1.1.1.1` | 21,051,400 employed | 2026-03 | **Monthly** |
| **CIS** — Canadian Income Survey | 11-10-0190-01 (`11100190`) | `1.12.1` | $75,500 | 2024 | Annual |
| **CIUS** — Canadian Internet Use Survey | 22-10-0135-01 (`22100135`) | `1.1.1` | 94.5% | 2022 | Occasional |

The snapshot Canadian Business Patterns (CBP) table was **swapped out** for the Labour Force
Survey: a stable PID that re-publishes monthly, so `latestN` self-advances on every release.
(The seed `signals.json` shows a placeholder vector for any signal whose Canada vector wasn't
read on build day; the coordinate is the source of truth and the first live run fills the vector.)

## Ontario Economic Accounts explorer

`oea-explorer.html` reads `oea.json` and renders an interactive line chart (Chart.js):

- **Table 13 — Ontario Trade** (annual, 1981–2025): 6 series — exports/imports, international + interprovincial.
- **Table 15 — Ontario Production by Industry** (quarterly, 1997Q1–2025Q4): 40 industry series.

Toggle tables, multi-select series, hover for values. Attribution: Open Government Licence – Ontario.
To refresh from a newer workbook, re-run the extraction (`openpyxl`, level rows only — skip the
"Per cent change" rows) and overwrite `oea.json`. Other sheets in the workbook (Tables 1–3, 5, 6,
12, 16) can be added the same way.

## Federal interactive app (embedded)

The staged page embeds StatCan's official Labour Force Survey "in brief" app
(`https://dv-vd.cloud.statcan.ca/142000012018001_en`) next to the live aggregator tile — the
aggregator streams the headline number, the app lets you drill in.

## Promote to production (when finalized)

1. Copy the `<style>` block, the `#cid-live-strip` markup, the `.cid-embeds` section, and the
   `<script>` fetch block from `data-preview/index.html` into **both**
   `public/cid/watchlist-embed/index.html` and `public/cid/watchlist/index.html` (keep them in sync).
2. Move `oea-explorer.html` to its public home (e.g. `public/cid/oea-explorer.html`) and update the link.
3. Uncomment the `schedule:` cron in `.github/workflows/cid-data.yml` (14:00 UTC, business days).
4. Delete `public/cid/data-preview/`.

## Required attribution (already rendered)

- National: *Contains information licensed under the Open Government Licence – Canada* + Statistics
  Canada — Web Data Service (WDS) · survey (acronym spelled out) · table number · reference period.
- Provincial: *Contains information licensed under the Open Government Licence – Ontario* + Ontario
  Economic Accounts (OEA), Ontario Ministry of Finance.
