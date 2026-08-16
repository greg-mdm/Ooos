# CID Data‑Integration — Project Brief / Context Handoff

> Drop this file into your new project as the first document. It re-orients a fresh
> Claude session on the goal, the research, the codebase, and where we left off, so you
> don't have to re-explain. Upload your research files alongside it (see §5).

---

## 1. Goal of this project
Develop the **Canadian Innovation Dimension (CID)** page at **ooos.ca/cid** into an
interactive *discovery environment*, and wire it to **live Canadian government data
sources**. This is a multi-document effort (research datasets + gov data), which is why
it lives in its own project.

## 2. Site & repo context (how publishing works)
- Live site: **https://ooos.ca** (custom domain via GoDaddy). The CID page is **/cid**.
- Source: GitHub repo **`greg-mdm/Ooos`** — a **Vite + React + TypeScript** app, styled by
  one big stylesheet **`src/styles/site.css`**. Deployed by **GitHub Pages** (Actions build
  on every push to `main`; the public/ folder is served verbatim).
- **There is no local clone.** Edits are published by editing the source on GitHub and
  committing to `main` (GitHub web "Add file → Upload files" overwrites a file at the same
  path; Pages then rebuilds). A connected browser (signed into GitHub) drives this.
- CID files:
  - Page markup: **`src/app/components/CID.tsx`** (scope wrapper `.cid-scope`).
  - Styles: the `.cid-scope …` rules in `src/styles/site.css`.
  - The interactive watchlist is a standalone HTML embed: **`public/cid/watchlist-embed/index.html`**
    (shown in an `<iframe>` on the page) with a full-screen twin **`public/cid/watchlist/index.html`**.

## 3. The vision (creative direction, from the user)
A **strategic-intelligence layer** where each signal is read through **PESTLE**
(Political, Economic, Social, Technological, Legal, Environmental). Discovery happens by
**comparing cards** across six systems — **public, private, nonprofit, government,
financial, research** — until overlaps surface as **partnership opportunities**
("unexpected connections"). UX = *learning by exploration, never a dashboard*, with depth
**revealed progressively** so it's foundational, not overwhelming.

Connective metaphor (deep reveal): **"radical begins as radicle"** — the radicle is the
first embryonic root from a germinating seed; seminal roots form the initial support
system. The deeper a user digs, the closer to the *root* of innovation/change. Urgency
cue: *"the innovation stage may be the only window to execute certain strategies, due to
shifting dynamics and regulations."*

## 4. Proposed architecture — four depths (progressive reveal)
1. **Surface** — signal cards (orgs) + sector/type badges. *(Exists in the watchlist embed.)*
2. **PESTLE lens** — examine each signal through the six external forces (the intelligence layer).
3. **Comparison** — select cards → the environment lights up overlaps → partnership opportunities.
4. **Root** — deepest reveal: the activist framing + the radicle/seminal-root narrative;
   terms define themselves contextually.

## 5. Research assets (upload these to the project)
- **`NP Status Review - Canada Chambers - Non-Profit Canada.xlsx`** — 13 Canadian Chambers
  of Commerce abroad with non-profit status. Columns: Country | Chamber | Non-Profit Status | Notes.
  Almost all ✅ non-profit; **Beijing / Canada China Business Council (CCBC)** flagged
  *hybrid (non-profit/corporate)*. (Vietnam, Hong Kong, Singapore, Sweden, Slovenia,
  Southern Africa, Pan-Africa, Ghana, Egypt, Australia, Mexico, Shanghai, Beijing.)
- **`Presentation Version - In Class - Canadian Ex.pdf`** — 1-page slide grouping the
  same chambers by region (Africa / Europe / Mexico / Asia: Vietnam, Shanghai·Beijing·Hong Kong, Singapore).
- These are the **non-profit / international** pole. The **government** pole already lives
  in the watchlist (gov-funded orgs: **CSA, NRC, ISED Canada, DND Canada, NRCan**). The
  overlap between these two poles is where the "partnership" story lives.

## 6. Canadian government data sources — RESEARCHED (2026)

### 6a. StatCan "Continuum of Data Access" — use the SELF-SERVE (public) tiers only
Access runs **Self-Serve** (minimal restrictions) → **Secure Access** (security procedures):

| Tier | Access solution | For this project? |
|---|---|---|
| Automated Data Ingestion | **Web Data Service (WDS) API** | ✅ live API (primary) |
| Data Products | View/download tables, StatsCAN app | ✅ tables / CSV |
| Public Use Microdata Files (PUMF) | Free download / PUMF platform | ⚠️ files, **not live** |
| Self-Serve Tabulation | Real Time Remote Access (RTRA) | ❌ subscription |
| Confidential Microdata | Virtual Data Lab (vDL) / vRDC | ❌ secure premises only |

**Rule:** a public website can only use the first three (public) tiers. RTRA and vDL/vRDC
require StatCan authorization and cannot be surfaced publicly.

### 6b. Statistics Canada — Web Data Service (WDS) API ✅ primary live source
- **What:** aggregate socioeconomic data + metadata, refreshed every business day **08:30 ET**. Open, **no API key**.
- **Base URL:** `https://www150.statcan.gc.ca/t1/wds/rest/<method>` — **Format:** JSON (SDMX XML via the SDMX service).
- **Limits:** ~50 req/s server, **25 req/s per IP** → cache server-side.
- **15 methods**, incl: `getAllCubesListLite`, `getChangedCubeList`, `getCubeMetadata`,
  `getSeriesInfoFromVector`, `getDataFromVectorsAndLatestNPeriods`,
  `getDataFromCubePidCoordAndLatestNPeriods`, `getBulkVectorDataByRange`,
  `getFullTableDownloadCSV/{PID}/{lang}` (GET), `getFullTableDownloadSDMX`.
- **Model:** data = a **Product ID (PID)** (a table/cube) containing **Vectors** (single time series).
  Flow: find PID → `getCubeMetadata` (POST `[{"productId":PID}]`) → pick vectors →
  `getDataFromVectorsAndLatestNPeriods` (POST `[{"vectorId":V,"latestN":N}]`).

### 6c. Open Government Portal (open.canada.ca) — CKAN Action API ✅ live, tested working
- **What:** thousands of federal datasets (StatCan, ISED, NRCan, Global Affairs…), each with
  downloadable resources + metadata. **No key**, **GET only** (pass params in the URL).
- **Base:** `https://open.canada.ca/data/en/api/3/action/<action>`
- **Verified live** (`package_search?q=…&rows=N`) → `{success, result:{count, results:[{title,
  organization, license_id, resources:[{format,url}], …}]}}`. Also `package_show?id=…`,
  `recently_changed_packages_activity_list`.
- **Licence:** Open Government Licence – Canada (attribution required).
- Good for *discovering/harvesting* datasets; values live in CSV/JSON resource files (or in WDS for StatCan tables).

### 6d. The four flagged surveys — what's actually retrievable
| Survey | Program ID | Live aggregate (WDS)? | PUMF microdata? |
|---|---|---|---|
| Canadian Business Patterns (CBP) | 1105 | ✅ business-count tables (industry/geo/size) | — (business register) |
| Canadian Financial Capability Survey (CFCS) | 5159 | some summary tables | ⚠️ PUMF = file download |
| Canadian Income Survey (CIS) | 5200 | ✅ many income tables | ⚠️ PUMF = file download |
| Canadian Internet Use Survey (CIUS) | 4432 | ✅ some ICT-use tables | ⚠️ PUMF = file download |

**Important:** 1105/5159/5200/4432 are *program* IDs, **not** WDS PIDs. To wire one up: find the
survey's data **tables** in the StatCan catalogue (or `getAllCubesListLite`) → get the **PID** →
pull vectors via WDS. **PUMF microdata is file-based** (download / PUMF platform), not a live API —
use it for offline modeling, never the live page.

### 6e. Other sources
- **Payments Canada APIs** (Lynx, Real-Time Rail) — developer portal exists but is
  **sandbox / registration-gated** (financial-rail test data), not open public data. Low priority for a public site.
- **Corporations Canada** (federal corp search) + **Lobbying Registry** — useful for the org/partnership
  layer; confirm machine-readable access (some are search UIs / bulk files, not open APIs).

### 6f. Recommended integration pattern (fits current static GitHub Pages hosting)
- **Server-side fetch + cache — never call gov APIs from the browser** (CORS + the 25 req/s WDS cap).
  Use a scheduled job (GitHub Action / serverless fn) that pulls WDS vectors + CKAN resources,
  normalizes them into the card schema, and writes **static JSON into the repo**
  (`public/cid/data/*.json`) that the page reads.
- **Cadence:** WDS updates 08:30 ET business days → daily refresh; CKAN datasets → weekly.
- **Map sources → PESTLE forces:** CBP → industry/sector activity; CIS/CFCS → Economic/Social;
  CIUS → Technological; Open-Gov policy datasets → Political/Legal. This directly powers the PESTLE lens.
- **Attribution:** show "Contains information licensed under the Open Government Licence – Canada" + StatCan source.

**Source docs:** StatCan WDS User Guide (`statcan.gc.ca/en/developers/wds/user-guide`),
StatCan API / microdata (`statcan.gc.ca/en/microdata/api`), Open Gov CKAN API
(`open.canada.ca/en/access-our-application-programming-interface-api`).

## 7. Current CID page state (already built/styled)
- **Full-bleed "Clay-style" body**: mint background (`#E6F7F2`) bleeds edge-to-edge; content
  centered at **1440px** (killed the old centered-column side seam).
- **Typography (accessibility pass):** headings = **Montserrat** (`--font-elevated`), body =
  **Inter** (`--font-body`); **no Poppins** on CID. Body copy ~**18px**, measure kept to
  **~45–75 chars/line**, line-heights **120–145%**.
- **Hero:** white Montserrat "Canadian Innovation Dimension" heading on the ruby-brown band;
  2-column summary; comfortable bottom padding.
- **Watchlist card** (white): hugs its content (`fit-content` + `align-self:start` + even
  36px padding) → thinner box + intentional negative space (room for a photo/section).
  Intro merged to one paragraph (bullets removed — they're represented in the live tool:
  HOLD/SHIFT = status filter, tulip score = "How to read the Tulip Score" stages, org types
  = Sector Nodes).
- **Vote panel** (Polymarket-style terminal) + **note card** (sector list bolded).
- **Watchlist embed**: bumped the "first phase" lede to 1.1rem; **removed a stray dev link**
  (`PARTS_OstaraViz_MP2.html`) from the "Spring Equinox Trading System →" button in both the
  embed and the full-screen twin (now a de-linked label — decide if it should point somewhere
  or be removed).

## 8. Design tokens / rules to keep consistent
- Fonts: `--font-elevated` = Montserrat (headings), `--font-body` = Inter (body), avoid Poppins on CID.
- Readability: **45–75 chars/line**, **line-height 120–145%**, column ≈ **20–40× type size**.
- Colors: portal purple `#4b00b6`; CID ruby/brown `#822F00` → `#5a2000`; mint body `#E6F7F2`; ink `#1A0033`.
- Icon direction (not yet built): **simple**, research/trading-system aesthetic drawing on
  Wealthsimple / Robinhood / currency-conversion / crypto cues — *used selectively*, so it
  reads like "exploring a digital environment, not a dashboard."

## 9. Parked / open threads (whole-site)
- **Ostara hero**: now uses `public/assets/ostara-hero2.jpg` (cropped wide banner). Old
  `ostara-hero.jpg` and the 8MB `SVG LOGO - OSTARA HOMEPAGE.svg` are unused dead weight in
  the repo (candidates for deletion).
- **CID hero-widen to 1440 + mobile verification** — previewed, not committed (was waiting on
  a Canva hero that's now unneeded). Mobile test still owed: confirm no horizontal overflow
  and clean stacking at ~390px.
- **Discovery environment + live gov data** = this project.

## 10. Suggested first slices (pick one to start)
- **Draft the layered copy** (transliterate theory → website copy across the 4 depths, with the radicle thread).
- **Map the PESTLE layer** (schema: each signal → the 6 forces, worked from CanCham + gov data).
- **Prototype the discovery UX** (clickable card-comparison / overlap mechanic).
- **Scope the live gov data** (pick sources/APIs + refresh model).
