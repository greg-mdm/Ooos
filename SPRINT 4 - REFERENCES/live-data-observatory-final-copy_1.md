# Live Data Observatory: Ontario's Economic Activity
### Final copy for the Canadian Innovation Dimension (CID). Em-dash-free, install-ready.

House style honoured: no em dashes (commas, colons, periods, parentheses); en dash only in
ranges (1997–2025) and the official licence name. Numbers sourced. Non-causal language throughout.
Section 11 holds the paste-ready COPY / METHOD / CLUSTER objects.

---

## 1. Heading + intro block (LOCKED)

**Eyebrow:** CANADIAN INNOVATION & PARTNERSHIP · PROVINCIAL LAYER
**Section label:** LIVE DATA OBSERVATORY
**Title:** Ontario's Economic Activity

**Intro copy:**

> Open access to live data provides valuable insights into Ontario's economy. The province's
> working population of over 8.3 million people drives measurable progress every day. Adjust the
> tool to chart new paths to sustainable development in a data-driven economy.
>
> Ooo is a Toronto studio and connector within Ontario's innovation ecosystem, championing new
> ideas and strategically executing initiatives that drive progress.
>
> Radical strategic intelligence · Interconnected work · Collective impact · Canadian innovation.

*Number source: 8.3 million employed (Ontario labour market, May 2026 snapshot, Statistics Canada
Labour Force Survey). Can later read live from the pipeline (table 14-10-0287, GEO = Ontario).*

**Standing disclaimer (footer, every view):**

> Verified public data only. Material Non-Public Information (MNPI) excluded. No predictions, not
> financial advice. Highlighted connection points are research prompts, not proof of causation.

---

## 2. Trust pills (static)

`Public data` · `MNPI excluded` · `OEA Table 16` · `1997–2025` · `No predictions`

---

## 3. Primary view pills (static labels)

`Goods-Producing` · `Services-Producing` · `Trends · Top Gainers` · `Creative Cluster` · `Small Pond`

---

## 4. Reading-level selector (static control labels)

- Label: "Explain for"
- Buttons: `Plain (15)` · `Business` · `Expert`
- Trailing note per level: "Plain-language, no jargon." / "For a business and industry audience." /
  "Assumes high financial literacy."

---

## 5. View captions (5 views × 3 levels)

### Goods-Producing
- **Plain (15):** The "making and building" side of the economy: factories, construction crews,
  power and water utilities, farms and mines. Each line is one industry, the higher the line, the
  more it produced that year. The five biggest are shown to start.
- **Business:** Goods-producing industries: manufacturing, construction, utilities, and resource
  extraction. Each line is one industry's real output over time. The five largest by latest output
  are shown; add or remove industries to compare.
- **Expert:** Goods-producing sector disaggregated by industry (Table 16, real output at basic
  prices, chained 2017 $). Defaults to the five largest by terminal-year output; toggle
  constituents to recompose the panel.

### Services-Producing
- **Plain (15):** The "doing things for people" side of the economy: banks, shops, hospitals,
  schools, law and design firms, hotels and restaurants. This is now the biggest part of Ontario's
  economy. The five biggest industries are shown to start.
- **Business:** Services-producing industries: finance, real estate, professional services, health
  care, retail and more. Now the majority of Ontario's output. The five largest by latest output
  are shown.
- **Expert:** Services-producing sector by industry (Table 16, chained 2017 $). Defaults to the
  five largest by terminal-year output. Note the sector's rising share of aggregate provincial
  output across the sample.

### Trends · Top Gainers
- **Plain (15):** Which industries grew the most since 1997? Every line starts from the same point
  so you can race them fairly. Very small industries are left out to keep it readable. Choose how
  to rank them and how many to show.
- **Business:** Cross-sector growth ranking since 1997. Industries under $5 billion in latest
  output are excluded to focus on material movers. Rank by percentage growth or dollars added, and
  choose how many to compare.
- **Expert:** Industry growth league table, 1997 to latest, filtered to terminal-year output ≥ $5B.
  Rank metric toggles between cumulative percent change and absolute chained-dollar change;
  comparison cardinality is adjustable.

### Creative Cluster
- **Plain (15):** Six parts of Ontario's economy that work closely together: culture and media,
  the arts, health and social services, government, professional and office work, and education.
  Each line shows how much each one produced in a year. Press ADD FINANCE to see how money and
  banking moves right alongside them.
- **Business:** A curated cluster of six interconnected sectors (Information & Culture, Arts,
  Entertainment & Recreation, Health Care & Social Services, Public Administration, Professional &
  Administrative Services, and Education) that together form a connected innovation base. Add
  Finance and Insurance to see how capital infrastructure moves alongside the cluster.
- **Expert:** A non-standard composite of six service industries (Table 16, real output, chained
  2017 $) selected to surface cross-sector interdependence across Ontario's knowledge, public, and
  creative economy. Finance and Insurance is introduced on demand to test co-movement and proximity
  against the cluster.

### Small Pond
- **Plain (15):** Big industries are so large they flatten the small ones on a normal chart. Small
  Pond View gives each smaller industry its own space, so you can actually see how it is moving and
  spot ones that are starting to climb.
- **Business:** Large industries dominate the main chart. Small Pond View gives smaller industries
  their own scale, so emerging or overlooked signals can be read clearly. Switch to economy scale
  to restore their true relative size.
- **Expert:** Small-multiple panel for sub-scale industries, each rendered on its own (or indexed)
  axis to expose intra-series dynamics otherwise masked by aggregate magnitude. Toggle to a shared
  economy scale to restore true relative size.

---

## 6. Method notes (2 modes × 3 levels)

### Dollar mode (Goods, Services, Creative Cluster, Top Gainers "Actual $")
- **Plain (15):** Numbers are in millions of dollars, with price increases already taken out, so a
  higher line really means more was produced, not just costlier. "$60,000M" means 60 billion dollars.
- **Business:** Values are in millions of chained (2017) dollars, inflation removed, so changes
  reflect real output, not price inflation. $60,000M = $60 billion.
- **Expert:** Real output in millions of chained (2017) dollars (volume measure at basic prices).
  Chain-linking removes price effects; level additivity carries the usual chained-index caveats.

### Indexed mode (Top Gainers / Small Pond, "Indexed" on)
- **Plain (15):** Every line starts at 100 in 1997. If a line reaches 200, that industry produces
  twice as much as it did in 1997; 150 means half-again as much. Starting everyone at 100 lets a
  giant industry and a small one be compared on the same chart. Price increases are already removed,
  so this is real growth, not just higher prices.
- **Business:** Each industry is rebased to 100 at its 1997 level, so all industries share one scale
  regardless of size. 200 = real output doubled since 1997; 150 = +50%. Figures are
  inflation-adjusted (chained 2017 dollars), so movement reflects real volume, not price changes.
- **Expert:** Series indexed to 1997 = 100, enabling cross-industry comparison independent of
  absolute scale (index 200 ≡ 100% cumulative real growth from base). Underlying data are chained
  (2017) dollars, isolating volume growth net of price effects.

---

## 7. Creative Cluster module (ADD FINANCE interaction)

- **Header title:** Creative Cluster
- **Kicker:** Interconnected work · Collective impact
- **Six cluster industries (exact Table 16 labels, used verbatim in the legend):**
  Information & Culture (including Telecommunications); Arts, Entertainment & Recreation; Health
  Care and Social Services; Public Administration; Professional and Administrative Services;
  Education. *(Finance and Insurance is added only on button press.)*
- **ADD FINANCE button:** round / pill-circle, ruby red (`--ruby` `#822F00`), white uppercase
  stacked text. Top-right of the chart card, above the plot, out of the plot area. Mobile: under
  the legend, above the chart.
  - Default: `ADD` / `FINANCE`  ·  After press: `REMOVE` / `FINANCE`  ·  Legend label always
    "Finance and Insurance".
- **Finance-added readout:** "Finance added. The highlighted rings mark the years where Finance and
  Insurance intersects or comes closest to another cluster industry. Read these as signals of
  interdependence: research prompts, not proof of causation."
- **Connection-point labels (template):** "Finance ↔ {industry}".
- **Cluster method note:** "Values are real output in millions of chained (2017) dollars.
  Highlighted points show where Finance and Insurance intersects or most closely approaches another
  selected industry. They are research prompts, not claims of causation. Finance moves alongside
  these industries; it does not cause their movement."
- **Connection-insight strip (dark, below the graph):**
  - Label: "Connection insight"
  - Body: "Innovation is not isolated. Finance, public systems, culture, education, health, and
    professional services move through the same provincial economy. CID reads these public signals
    to reduce duplication of effort and increase shared situational awareness."
  - Branded line: "Radical strategic intelligence · Interconnected work · Collective impact ·
    Canadian innovation."

---

## 8. Small Pond module

- Purpose: see the Small Pond caption (Section 5).
- Each pond tile: Industry name · Latest real output · Growth since 1997 · Mini trend line ·
  Signal stage.
- Signal-stage legend (mirrors the Innovation Watchlist tulip stages): `Early` · `Developing` ·
  `Accelerating` · `Established`. Frame as a stage of observed growth, not a forecast.
- Scale toggle: `Own pond scale` / `Economy scale`. Helper: "Own pond scale reveals small-industry
  patterns; economy scale reminds you of their actual size."

---

## 9. Controls (static)

- Buttons: Clear all · Reset to default
- Gainers "Rank by": % growth / $ added  ·  "View": Indexed / Actual  ·  "Compare top": 3 / 5 / 8
- Readout hint: "Hover the chart to read each industry's value for a year."

---

## 10. Sources, method & glossary (static)

- **Attribution:** Source: Ontario Economic Accounts (OEA), Office of Economic Policy, Ontario
  Ministry of Finance, and Statistics Canada. Contains information licensed under the Open
  Government Licence – Ontario.
- **Glossary, "Key terms (glossary)" (expandable):**
  - Real vs. nominal: real removes price change (volume); nominal is measured at each year's prices.
  - Chained (2017) dollars: an inflation-adjustment method using continuously updated price weights
    anchored to 2017, so years can be compared.
  - Index (1997 = 100): each series rebased so 1997 = 100; 200 = doubled.
  - Basic prices: output valued before taxes and subsidies on products.
  - GDP / production by industry: total value of goods and services produced, split by industry
    (what Table 16 holds).
  - OEA: Ontario Economic Accounts (Ontario Ministry of Finance, compiled with Statistics Canada).
    Table 16: Ontario Production by Industry, annual, chained (2017) dollars.
  - CID: Canadian Innovation Dimension (the host page).
  - MNPI: Material Non-Public Information; deliberately excluded from every CID view.
  - % growth vs. $ added: percent growth ranks fast risers of any size; dollars added ranks what
    moved the economy most in raw terms.

---

## 11. Paste-ready objects (drop into the script)

```js
const COPY = {
  goods: {
    plain:    `The "making and building" side of the economy: factories, construction crews, power and water utilities, farms and mines. Each line is one industry, the higher the line, the more it produced that year. The five biggest are shown to start.`,
    business: `Goods-producing industries: manufacturing, construction, utilities, and resource extraction. Each line is one industry's real output over time. The five largest by latest output are shown; add or remove industries to compare.`,
    expert:   `Goods-producing sector disaggregated by industry (Table 16, real output at basic prices, chained 2017 $). Defaults to the five largest by terminal-year output; toggle constituents to recompose the panel.`,
  },
  services: {
    plain:    `The "doing things for people" side of the economy: banks, shops, hospitals, schools, law and design firms, hotels and restaurants. This is now the biggest part of Ontario's economy. The five biggest industries are shown to start.`,
    business: `Services-producing industries: finance, real estate, professional services, health care, retail and more. Now the majority of Ontario's output. The five largest by latest output are shown.`,
    expert:   `Services-producing sector by industry (Table 16, chained 2017 $). Defaults to the five largest by terminal-year output. Note the sector's rising share of aggregate provincial output across the sample.`,
  },
  gainers: {
    plain:    `Which industries grew the most since 1997? Every line starts from the same point so you can race them fairly. Very small industries are left out to keep it readable. Choose how to rank them and how many to show.`,
    business: `Cross-sector growth ranking since 1997. Industries under $5 billion in latest output are excluded to focus on material movers. Rank by percentage growth or dollars added, and choose how many to compare.`,
    expert:   `Industry growth league table, 1997 to latest, filtered to terminal-year output >= $5B. Rank metric toggles between cumulative percent change and absolute chained-dollar change; comparison cardinality is adjustable.`,
  },
  creative: {
    plain:    `Six parts of Ontario's economy that work closely together: culture and media, the arts, health and social services, government, professional and office work, and education. Each line shows how much each one produced in a year. Press ADD FINANCE to see how money and banking moves right alongside them.`,
    business: `A curated cluster of six interconnected sectors (Information & Culture, Arts, Entertainment & Recreation, Health Care & Social Services, Public Administration, Professional & Administrative Services, and Education) that together form a connected innovation base. Add Finance and Insurance to see how capital infrastructure moves alongside the cluster.`,
    expert:   `A non-standard composite of six service industries (Table 16, real output, chained 2017 $) selected to surface cross-sector interdependence across Ontario's knowledge, public, and creative economy. Finance and Insurance is introduced on demand to test co-movement and proximity against the cluster.`,
  },
  smallpond: {
    plain:    `Big industries are so large they flatten the small ones on a normal chart. Small Pond View gives each smaller industry its own space, so you can actually see how it is moving and spot ones that are starting to climb.`,
    business: `Large industries dominate the main chart. Small Pond View gives smaller industries their own scale, so emerging or overlooked signals can be read clearly. Switch to economy scale to restore their true relative size.`,
    expert:   `Small-multiple panel for sub-scale industries, each rendered on its own (or indexed) axis to expose intra-series dynamics otherwise masked by aggregate magnitude. Toggle to a shared economy scale to restore true relative size.`,
  },
};

const METHOD = {
  dollar: {
    plain:    `Numbers are in millions of dollars, with price increases already taken out, so a higher line really means more was produced, not just costlier. "$60,000M" means 60 billion dollars.`,
    business: `Values are in millions of chained (2017) dollars, inflation removed, so changes reflect real output, not price inflation. $60,000M = $60 billion.`,
    expert:   `Real output in millions of chained (2017) dollars (volume measure at basic prices). Chain-linking removes price effects; level additivity carries the usual chained-index caveats.`,
  },
  indexed: {
    plain:    `Every line starts at 100 in 1997. If a line reaches 200, that industry produces twice as much as it did in 1997; 150 means half-again as much. Starting everyone at 100 lets a giant industry and a small one be compared on the same chart. Price increases are already removed, so this is real growth, not just higher prices.`,
    business: `Each industry is rebased to 100 at its 1997 level, so all industries share one scale regardless of size. 200 = real output doubled since 1997; 150 = +50%. Figures are inflation-adjusted (chained 2017 dollars), so movement reflects real volume, not price changes.`,
    expert:   `Series indexed to 1997 = 100, enabling cross-industry comparison independent of absolute scale (index 200 = 100% cumulative real growth from base). Underlying data are chained (2017) dollars, isolating volume growth net of price effects.`,
  },
};

const CLUSTER = {
  industries: [
    "Information & Culture (including Telecommunications)",
    "Arts, Entertainment & Recreation",
    "Health Care and Social Services",
    "Public Administration",
    "Professional and Administrative Services",
    "Education",
  ],
  financeLabel: "Finance and Insurance",
  buttonDefault: ["ADD", "FINANCE"],
  buttonAdded:   ["REMOVE", "FINANCE"],
  financeReadout: `Finance added. The highlighted rings mark the years where Finance and Insurance intersects or comes closest to another cluster industry. Read these as signals of interdependence: research prompts, not proof of causation.`,
  connectionLabel: (industry) => `Finance \u2194 ${industry}`,
  methodNote: `Values are real output in millions of chained (2017) dollars. Highlighted points show where Finance and Insurance intersects or most closely approaches another selected industry. They are research prompts, not claims of causation. Finance moves alongside these industries; it does not cause their movement.`,
  insightLabel: "Connection insight",
  insightBody: `Innovation is not isolated. Finance, public systems, culture, education, health, and professional services move through the same provincial economy. CID reads these public signals to reduce duplication of effort and increase shared situational awareness.`,
  brandedLine: "Radical strategic intelligence \u00b7 Interconnected work \u00b7 Collective impact \u00b7 Canadian innovation.",
};

const INTRO = `Open access to live data provides valuable insights into Ontario's economy. The province's working population of over 8.3 million people drives measurable progress every day. Adjust the tool to chart new paths to sustainable development in a data-driven economy.`;
const INTRO_OOO = `Ooo is a Toronto studio and connector within Ontario's innovation ecosystem, championing new ideas and strategically executing initiatives that drive progress.`;
```

---

## 12. Information architecture (for placement)

```
CID
└─ Innovation Watchlist
   └─ Live Data Observatory
      └─ Ontario's Economic Activity
         ├─ Goods-Producing
         ├─ Services-Producing
         ├─ Trends · Top Gainers
         ├─ Creative Cluster        (ADD FINANCE discovery interaction)
         ├─ Small Pond              (companion view)
         └─ Sources & Method        (attribution · glossary · licence)
```
