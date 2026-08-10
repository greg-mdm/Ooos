import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import "../../styles/cid-continuum.css";
import "../../styles/cid-forest.css";
import "../../styles/cid-coins.css";
import "../../styles/cid-vivarium.css";
import {
  PopClockCard,
  PopulationSourcesStrip,
  usePopulationModel,
  type PopulationModelState,
} from "./population/PopulationClockCard";

// --- Canada's Continuum of Data Access -------------------------------------
// Real StatsCan destinations behind each route on the official "Continuum of
// Data Access" graphic (links read off the graphic itself), plus the general
// resources referenced in the section copy.
const SC = {
  api: "https://www.statcan.gc.ca/en/developers/wds",
  data: "https://www150.statcan.gc.ca/n1/en/type/data?MM=1",
  pumf: "https://www150.statcan.gc.ca/n1/en/type/data?MM=1#publicusemicrodata",
  rtra: "https://www.statcan.gc.ca/en/microdata/rtra/data",
  vrdc: "https://www.statcan.gc.ca/en/microdata/data-centres/data",
  microdata: "https://www.statcan.gc.ca/en/microdata",
  explore: "https://www150.statcan.gc.ca/n1/en/type/data",
  strategy: "https://www.statcan.gc.ca/en/about/datastrategy",
  openGov: "https://open.canada.ca/en/open-data",
  ontario: "https://www.ontario.ca/document/ontario-employment-reports",
  start: "https://www.statcan.gc.ca/en/start",
  // Ontario observatory + underground layer
  onReport: "https://www.ontario.ca/document/ontario-employment-reports/january-march-2026",
  onRegions: "https://www.ontario.ca/document/ontario-employment-reports/january-march-2026#section-4",
  jobbankScan: "https://www.jobbank.gc.ca/trend-analysis/job-market-reports/ontario/environmental-scan",
  caps: "https://www.lioapplications.lrc.gov.on.ca/Pits_And_Quarries/index.html?viewer=Pits_and_Quarries.Pits_and_Quarries&locale=en-CA",
  forceOfNature: "https://www.canada.ca/en/services/environment/nature/nature-strategy.html#toc6",
  radarDsm: "https://data.ontario.ca/dataset/ontario-radar-digital-surface-model",
  geohub: "https://geohub.lio.gov.on.ca",
};

// Underground / terrain layer — the page floor. Plain link cards (these gov
// viewers block cross-origin framing, so they open in a new tab).
const UNDERGROUND = [
  {
    tag: "Interactive map",
    title: "Explore Pits and Quarries Online (CAPS)",
    blurb: "Map every licensed pit, quarry and aggregate site across Ontario — Land Information Ontario's CAPS viewer.",
    href: SC.caps,
    hero: true,
  },
  {
    tag: "Elevation dataset",
    title: "Ontario radar digital surface model",
    blurb: "Province-wide radar-derived elevation surface (DSM) from the Ontario Data Catalogue.",
    href: SC.radarDsm,
    hero: false,
  },
  {
    tag: "Geospatial hub",
    title: "Ontario GeoHub",
    blurb: "GeospatialOntario's authoritative GIS portal for provincial mapping and elevation data.",
    href: SC.geohub,
    hero: false,
  },
];

type AccessRoute = {
  key: string;
  name: string;
  blurb: string;
  tag: string;
  href: string;
  access: string;
  location: string;
  data: string;
};

const ROUTES: AccessRoute[] = [
  {
    key: "products",
    name: "Data products",
    blurb: "Explore tables, publications, visualizations and downloads.",
    tag: "Tables",
    href: SC.data,
    access: "View or download data tables · visualize key data sets · consult articles and publications",
    location: "StatCan website · StatsCAN app",
    data: "Social and economic data",
  },
  {
    key: "ingestion",
    name: "Automated data ingestion",
    blurb: "Connect to aggregate data and metadata through an API.",
    tag: "API",
    href: SC.api,
    access: "Application Programming Interface (API)",
    location: "StatCan Web Data Service",
    data: "Social and economic data",
  },
  {
    key: "pumf",
    name: "Public-use microdata",
    blurb: "Analyze anonymized, non-aggregated records.",
    tag: "PUMF",
    href: SC.pumf,
    access: "Free download · subscription to the Public Use Microdata File (PUMF) platform",
    location: "StatCan website",
    data: "Social data",
  },
  {
    key: "tabulation",
    name: "Self-serve tabulation",
    blurb: "Produce custom, non-confidential statistical results.",
    tag: "RTRA",
    href: SC.rtra,
    access: "Subscription to Real Time Remote Access (RTRA)",
    location: "StatCan website",
    data: "Social data",
  },
  {
    key: "confidential",
    name: "Confidential microdata",
    blurb: "Conduct approved research in a secure environment.",
    tag: "Secure",
    href: SC.vrdc,
    access: "Virtual Data Lab (vDL) · Virtual Research Data Centre (vRDC)",
    location: "StatCan premises · secure room · authorized workspace",
    data: "Social and economic data",
  },
];

const INDICATORS = [
  { name: "Quarterly population estimate", value: "41,417,056", arrow: "▼", change: "-0.1%", period: "April 1, 2026", note: "quarterly change", dir: "down" },
  { name: "Consumer Price Index", value: "3.2%", arrow: "▲", change: "", period: "May 2026", note: "12-month change", dir: "up" },
  { name: "Unemployment rate", value: "6.6%", arrow: "▼", change: "-0.3 pts", period: "May 2026", note: "monthly change", dir: "down" },
  { name: "Real GDP by expenditure", value: "0.0%", arrow: "—", change: "", period: "First quarter 2026", note: "quarterly change", dir: "flat" },
];

const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

/** Shared progressive-disclosure panel — same a11y contract as Exhibition's
 *  ProgramItem: a button toggles aria-expanded on a [hidden] body. */
function Disclosure({ title, tag, children }: { title: string; tag?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = `cid-cont-${slug(title)}`;
  return (
    <div className={`cid-disc ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="cid-disc-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cid-disc-name">
          {title}
          {tag && <span className="cid-disc-tag">{tag}</span>}
        </span>
        <span className="cid-disc-arrow" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div id={id} className="cid-disc-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

// Stages 1–3 stay vibrant (accessible) on the brand cyan→gold ramp; stages 4–5
// are "greyed out" using the robin's-egg neutrals (600 #728488 / 700 #5C6C70)
// so they read as restricted. Stage 5 keeps the ruby as a RING around a grey
// circle, not a fill. accent = left edge / tag / underline · fill = circle bg ·
// ring = circle border · ink = number (kept dark, like 1–3).
const SPECTRUM: { accent: string; fill: string; ring: string; ink: string }[] = [
  { accent: "#1FCECB", fill: "#1FCECB", ring: "transparent", ink: "#06231F" }, // 1 cyan
  { accent: "#88C786", fill: "#88C786", ring: "transparent", ink: "#0E2A14" }, // 2 cyan + gold
  { accent: "#F0C040", fill: "#F0C040", ring: "transparent", ink: "#3A2D00" }, // 3 gold
  { accent: "#5C6C70", fill: "#D8DBDE", ring: "#5C6C70",     ink: "#0F031C" }, // 4 chrome-silver fill + grey ring · midnight-black text
  { accent: "#822F00", fill: "#D8DBDE", ring: "#822F00",     ink: "#0F031C" }, // 5 chrome-silver fill + ruby ring · midnight-black text
];

/** One route on the continuum. The route name is the disclosure trigger;
 *  opening it reveals the StatsCan access card + a link to that program. */
function RouteItem({ route, index, tone }: { route: AccessRoute; index: number; tone: { accent: string; fill: string; ring: string; ink: string } }) {
  const [open, setOpen] = useState(false);
  const id = `cid-route-${route.key}`;
  return (
    <li
      className={`cid-route ${open ? "is-open" : ""}`}
      style={{
        ["--route-accent"]: tone.accent,
        ["--route-fill"]: tone.fill,
        ["--route-ring"]: tone.ring,
        ["--route-ink"]: tone.ink,
      } as CSSProperties}
    >
      <button
        type="button"
        className="cid-route-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cid-route-num" aria-hidden="true">{index}</span>
        <span className="cid-route-head">
          <span className="cid-route-name">
            {route.name}
            <span className="cid-route-tag">{route.tag}</span>
          </span>
          <span className="cid-route-blurb">{route.blurb}</span>
        </span>
        <span className="cid-route-arrow" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div id={id} className="cid-route-body" hidden={!open}>
        <dl className="cid-route-meta">
          <div><dt>Access solution</dt><dd>{route.access}</dd></div>
          <div><dt>Location of access</dt><dd>{route.location}</dd></div>
          <div><dt>Type of data</dt><dd>{route.data}</dd></div>
        </dl>
        <a className="cid-route-link" href={route.href} target="_blank" rel="noopener noreferrer">
          Open on Statistics Canada ↗
        </a>
      </div>
    </li>
  );
}

/** The full "Canada's Continuum of Data Access" block — a contained data
 *  observatory panel that reveals the StatsCan map through interaction. */
function DataAccessContinuum() {
  return (
    <section className="cid-continuum" aria-labelledby="cid-continuum-title">
      <div className="cid-continuum-inner">
        <p className="cid-continuum-eyebrow">Start with the evidence</p>
        <h2 id="cid-continuum-title" className="cid-continuum-title">
          Canada&rsquo;s Continuum of Data Access
        </h2>

        <div className="cid-continuum-lede">
          <p>
            Statistics Canada holds over a century of trusted data that has fostered research,
            informed policy advancements, and helped illuminate public opinion as we navigate
            profound social, economic, and environmental transformations together.
          </p>
          <p>
            For information on governing laws, policies, and proactive disclosures, visit{" "}
            <a href="https://www.statcan.gc.ca" target="_blank" rel="noopener noreferrer">
              statcan.gc.ca
            </a>.
          </p>
        </div>

        <figure className="cid-continuum-gov">
          {/* the cool -> hot gradient bar sits above the graphic, echoing its
              Self-Serve -> Secure arrow */}
          <div className="cid-continuum-ends" aria-hidden="true">
            <span className="cid-continuum-end cid-continuum-end--open">Self-serve access</span>
            <span className="cid-continuum-end-mid">more controlled access</span>
            <span className="cid-continuum-end cid-continuum-end--secure">Secure access</span>
          </div>
          <div className="cid-continuum-track" aria-hidden="true" />
          <img
            className="cid-continuum-gov-img"
            src={`${import.meta.env.BASE_URL}assets/images/microdata-continuum-eng.webp`}
            alt="Statistics Canada — Continuum of Data Access: from Self-Serve (Automated Data Ingestion, Data Products) through Public Use Microdata Files and the Self-Serve Tabulation Tool to Secure Access (Confidential Microdata Files), listing each route's access solution, location of access and type of data."
            loading="lazy"
            width={1140}
            height={667}
          />
          <p className="cid-continuum-foot">
            As you move from left to right, the data may become more detailed or sensitive, so
            the privacy, authorization and security requirements increase.
          </p>
          <figcaption className="cid-continuum-source">
            Source: Statistics Canada, Continuum of Data Access.{" "}
            <a href="https://www.statcan.gc.ca/en/microdata" target="_blank" rel="noopener noreferrer">
              statcan.gc.ca/en/microdata
            </a>
          </figcaption>
        </figure>

        <div className="cid-continuum-scale">
          <h3 className="cid-continuum-guide-heading">
            Use the guide below to navigate this data ecosystem.
          </h3>
          <div className="cid-continuum-routes-wrap">
            <div className="cid-continuum-routes-col">
              <ol className="cid-continuum-routes">
                {ROUTES.map((r, i) => (
                  <RouteItem key={r.key} route={r} index={i + 1} tone={SPECTRUM[i]} />
                ))}
              </ol>
              <p className="cid-continuum-guide-desc">
                Statistics Canada offers secure access to anonymized survey data, administrative
                records, and integrated datasets. These resources are designed to support research
                and statistical analysis for project development, program management, and to improve
                public understanding. The available data covers key topics such as the digital
                economy, international trade, health, wealth, and languages.
              </p>
            </div>
            <aside className="cid-continuum-aside">
              <img
                src={`${import.meta.env.BASE_URL}assets/images/Ooo-Rene.png`}
                alt="This is not a ranking of data quality — it is a guide to choosing the right level of access for your question."
                loading="lazy"
              />
            </aside>
          </div>
        </div>

        <div className="cid-continuum-panels">
          <Disclosure title="Choose your starting point">
            <ul className="cid-start-list">
              <li>Looking for a fact, trend or comparison? Start with{" "}
                <a href={SC.data} target="_blank" rel="noopener noreferrer">data products</a>.</li>
              <li>Building an application or live data feature? Explore the{" "}
                <a href={SC.api} target="_blank" rel="noopener noreferrer">Web Data Service API</a>.</li>
              <li>Studying records rather than published totals? Look for a{" "}
                <a href={SC.pumf} target="_blank" rel="noopener noreferrer">Public Use Microdata File</a>.</li>
              <li>Need a custom statistical result? Review the{" "}
                <a href={SC.rtra} target="_blank" rel="noopener noreferrer">self-serve tabulation</a> option.</li>
              <li>Need sensitive or highly detailed information? Learn about{" "}
                <a href={SC.vrdc} target="_blank" rel="noopener noreferrer">authorized secure access</a>.</li>
            </ul>
          </Disclosure>

          <Disclosure title="Key terms">
            <dl className="cid-terms">
              <dt>Aggregate data</dt>
              <dd>Totals, averages, rates, indexes and other summaries created by combining many records.</dd>
              <dt>Microdata</dt>
              <dd>Records at the business, household or personal level. They provide more detail than aggregate statistics and are used for analytical and research purposes.</dd>
              <dt>Public Use Microdata File &mdash; PUMF</dt>
              <dd>A file containing non-aggregated records that have been carefully modified and reviewed to prevent a person or business from being identified. Selected files are free, while broader collection access may require a subscription.</dd>
              <dt>Data stewardship</dt>
              <dd>The responsible governance and management of data so that it remains useful, consistent, accessible, secure and privacy-preserving throughout its lifecycle.</dd>
            </dl>
          </Disclosure>

          <Disclosure title="Web resources">
            <ul className="cid-resources">
              <li><a href={SC.microdata} target="_blank" rel="noopener noreferrer">Access to microdata</a>
                <span>The official continuum, access-program descriptions and guidance for public-use and confidential microdata.</span></li>
              <li><a href={SC.explore} target="_blank" rel="noopener noreferrer">Explore Statistics Canada data</a>
                <span>Search tables, visualizations, indicators, downloadable datasets and analytical products.</span></li>
              <li><a href={SC.api} target="_blank" rel="noopener noreferrer">Web Data Service API guide</a>
                <span>Technical guidance for connecting applications to Statistics Canada data and metadata.</span></li>
              <li><a href={SC.strategy} target="_blank" rel="noopener noreferrer">Statistics Canada Data Strategy</a>
                <span>Background on data governance, discovery, interoperability, public trust, privacy and evidence-informed decision-making.</span></li>
              <li><a href={SC.openGov} target="_blank" rel="noopener noreferrer">Open Government Portal</a>
                <span>Search datasets and information published by federal departments and agencies beyond Statistics Canada.</span></li>
              <li><a href={SC.ontario} target="_blank" rel="noopener noreferrer">Ontario Employment Reports</a>
                <span>A practical example of public evidence organized across employment, industries, regions, age, education, immigration and wages.</span></li>
              <li><a href={SC.jobbankScan} target="_blank" rel="noopener noreferrer">Ontario environmental scan — Job Bank</a>
                <span>A regional read on Ontario's labour market: outlooks, in-demand occupations and the trends shaping employment.</span></li>
            </ul>
          </Disclosure>

          <Disclosure title="Key indicators" tag="Snapshot · 2026">
            <div className="cid-keyind">
              <div className="cid-keyind-grid">
                {INDICATORS.map((k) => (
                  <div className="cid-keyind-card" key={k.name}>
                    <div className="cid-keyind-name">{k.name}</div>
                    <div className="cid-keyind-value">
                      {k.value}
                      <span className={`cid-keyind-arrow cid-keyind-arrow--${k.dir}`} aria-hidden="true">{k.arrow}</span>
                      {k.change && <span className="cid-keyind-change">{k.change}</span>}
                    </div>
                    <div className="cid-keyind-period">{k.period}</div>
                    <div className="cid-keyind-note">({k.note})</div>
                  </div>
                ))}
              </div>
              <div className="cid-keyind-foot">
                <span>Static snapshot &mdash; Statistics Canada key indicators, April&ndash;May 2026 and Q1 2026 releases. Not live data; newer figures may be available.</span>
                <a href={SC.start} target="_blank" rel="noopener noreferrer">View live key indicators ↗</a>
              </div>
            </div>
          </Disclosure>
        </div>

        <p className="cid-continuum-caption">
          From self-serve tools with minimal restrictions to secure research environments with
          formal safeguards, Statistics Canada provides different access routes for different
          research needs.
        </p>
      </div>
    </section>
  );
}

/** The page floor — the "underground" layer of the public record. Sits flush
 *  above the site footer with a deep subsurface field and terrain link cards. */
/** ESG advantages — progressive disclosure. The summary line is the trigger;
 *  the arrow drops the bullet list in between the line and the closing copy. */
type EsgCoin = {
  image: string;
  title: string;
  year: string;
  meta: string;
  detail: string;
  point: string;
};

// The five co-designed Royal Canadian Mint coins ("Golden Dollar Bullets",
// imported from Claude Design) are the bullet markers for the ESG advantages.
// The row shows the business advantage; the coin's title / year / meta / story
// live in the click-to-zoom lightbox.
const ESG_COINS: EsgCoin[] = [
  {
    image: "wolf",
    title: "The Arctic Wolf",
    year: "2026",
    meta: "1 oz · 99.99% Fine Gold",
    detail:
      "An Arctic wolf stands watch at the treeline as dawn rays fan out behind it — struck in a full ounce of pure Canadian gold.",
    point: "Build stronger customer loyalty with sustainable practices.",
  },
  {
    image: "pearl",
    title: "The Freshwater Pearl",
    year: "2026",
    meta: "Pearl Inlay · Engraved",
    detail:
      "A genuine freshwater pearl rests at the heart of an intricate mandala of maple leaves and scrollwork — light and metal held in quiet balance.",
    point: "Enhanced brand reputation through responsible sourcing and production.",
  },
  {
    image: "skyline",
    title: "Toronto at Fifty",
    year: "1976–2026",
    meta: "99.99% Pure Gold",
    detail:
      "The CN Tower, soaring above Toronto’s skyline, symbolizes Canadian ingenuity. Once the world’s tallest free-standing structure from 1975 to 2007, it was originally built by the Canadian National (CN) railroad as a telecommunications and observation tower. Since opening 50 years ago, the CN Tower has evolved into an iconic Canadian landmark and tourist attraction in Toronto, Ontario.",
    point: "Elevated access to financing by showing investors a future-ready business model.",
  },
  {
    image: "panner",
    title: "The Great Gold Rush",
    year: "2022",
    meta: "Pure Gold · Klondike",
    detail:
      "A lone prospector cradles a sluice box on the banks of the Klondike, gold dust catching the current — a hand-tooled tribute to the rush that built the North.",
    point: "Reduced operating costs through improved efficiency and waste management.",
  },
  {
    image: "worldcup",
    title: "FIFA World Cup 26",
    year: "2026",
    meta: "Official Coin · Trophy",
    detail:
      "The iconic trophy lifted skyward as fans erupt in celebration, struck for the tournament arriving on North American soil.",
    point: "Improved talent acquisition and retention through a purpose-driven culture.",
  },
];

function CoinModal({ coin, onClose }: { coin: EsgCoin; onClose: () => void }) {
  const base = import.meta.env.BASE_URL;
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // the dialog has a single focusable control — keep focus on it
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="gdb-root gdb-overlay" onClick={onClose} role="presentation">
      <div
        className="gdb-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${coin.title} gold coin`}
      >
        <button
          ref={closeRef}
          className="gdb-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <div className="gdb-zoom-wrap">
          <span className="gdb-zoom-glow" aria-hidden="true" />
          <img
            className="gdb-zoom-img"
            src={`${base}assets/images/coins/${coin.image}.webp`}
            alt={`${coin.title} — gold coin, enlarged`}
          />
        </div>
        <div className="gdb-zoom-meta">{coin.year} · {coin.meta}</div>
        <h3 className="gdb-zoom-title">{coin.title}</h3>
        <p className="gdb-zoom-detail">{coin.detail}</p>
      </div>
    </div>,
    document.body,
  );
}

function EsgAdvantages() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const base = import.meta.env.BASE_URL;
  return (
    <div className="cid-ug-esg">
      <button
        type="button"
        className={`cid-ug-esg-toggle${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="cid-ug-esg-list"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Strong ESG leadership creates clear business advantages</span>
        <span className="cid-ug-esg-arrow" aria-hidden="true">↓</span>
      </button>
      <div className={`cid-ug-esg-wrap${open ? " is-open" : ""}`}>
        <div className="cid-ug-esg-inner gdb-root">
          <ul id="cid-ug-esg-list" className="gdb-v-list">
            {ESG_COINS.map((c, i) => (
              <li key={c.image}>
                <button
                  type="button"
                  className="gdb-v-btn"
                  onClick={() => setActive(i)}
                  aria-label={`${c.point} — enlarge the ${c.title} gold coin (${c.year})`}
                >
                  <span className="gdb-v-coin">
                    <img
                      className="gdb-v-img"
                      src={`${base}assets/images/coins/${c.image}.webp`}
                      alt={`${c.title} gold coin`}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="gdb-v-text">
                    <span className="gdb-v-esg">{c.point}</span>
                  </span>
                </button>
              </li>
            ))}
            <li aria-hidden="true" />
          </ul>
        </div>
      </div>
      {active !== null && (
        <CoinModal coin={ESG_COINS[active]} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

function Underground() {
  return (
    <section className="cid-underground" aria-labelledby="cid-underground-title">
      <div className="cid-continuum-inner cid-underground-inner">
        <header className="cid-ug-head cid-ug-head--split">
          <div className="cid-ug-head-text">
            <div className="cid-ug-topline">
              <p className="cid-ug-invite">Delve into the deepest layers of public records.</p>
              <p className="cid-underground-eyebrow">
                <span aria-hidden="true">▼</span> Below the surface
              </p>
            </div>
            <h2 id="cid-underground-title" className="cid-underground-title">Underground &amp; terrain</h2>
            <div className="cid-ug-intro">
              <p className="cid-ug-lede">
                With the <strong>second-largest landmass</strong> and the{" "}
                <strong>longest coastline in the world</strong>, Canada&rsquo;s mighty size and
                expansive geography provide a{" "}
                <strong>strong foundation for sustainable economic development.</strong>
              </p>
              <p>
                Hyperscale growth in AI and digitization has exponentially increased demand for
                data and critical minerals essential to modern technologies. Canada is now
                capitalizing on sustainable resource management to gain a competitive edge in the
                global market.
              </p>
            </div>
          </div>
          <figure className="cid-ug-hero">
            <img
              className="cid-ug-hero-img"
              src={`${import.meta.env.BASE_URL}assets/images/whatlies.webp`}
              alt="What lies beneath the map?"
              loading="lazy"
              decoding="async"
              width={720}
              height={951}
            />
          </figure>
        </header>

        <div className="cid-ug-body">
          {/* Left rail — the terrain/data source cards, stacked beside the
              investment content (moved up out of the row below) */}
          <aside className="cid-ug-rail">
            {UNDERGROUND.map((l) => (
              <a
                key={l.title}
                className={`cid-ug-card${l.hero ? " is-hero" : ""}`}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cid-ug-tag">{l.tag}</span>
                <span className="cid-ug-title">{l.title}</span>
                <span className="cid-ug-blurb">{l.blurb}</span>
                <span className="cid-ug-go" aria-hidden="true">Open ↗</span>
              </a>
            ))}
          </aside>

          <div className="cid-ug-main">
            <div className="cid-ug-invest">
              <h3 className="cid-ug-invest-title">Naturally Wealthy: A Rock-Solid Investment Stack</h3>
              <p>
                Building sustainable critical minerals supply chains in Canada means funding
                projects at every stage, from early-stage infrastructure and project preparation to
                the final steps needed to reach markets. Canada&rsquo;s federal funding programs
                support strategic infrastructure, processing capacity, Indigenous-led development,
                recycling, and global partnerships that connect Canadian resources to future
                technologies.
              </p>
              <p className="cid-ug-gov-lead">
                The Government of Canada provides extensive support for critical minerals projects
                and value chains.
              </p>
              <div className="cid-ug-invest-links">
                <a href="https://www.canada.ca/en/campaign/critical-minerals-in-canada/federal-support-for-critical-mineral-projects-and-value-chains.html" target="_blank" rel="noopener noreferrer">
                  Programs and funding for critical minerals projects ↗
                </a>
                <a href="https://www.canada.ca/en/campaign/critical-minerals-in-canada/federal-support-for-critical-mineral-projects-and-value-chains/global-partnerships-initiative.html" target="_blank" rel="noopener noreferrer">
                  Global Partnerships Initiative ↗
                </a>
              </div>

              <h4 className="cid-ug-invest-subhead">The ESG Advantage</h4>
              <p>
                ESG stands for Environmental, Social, and Governance, and it helps companies show
                how they manage risk, create value, and operate responsibly. Proactive ESG is not
                just about compliance. It is a smarter way to build long-term value.
              </p>
              <EsgAdvantages />
              <p>
                Businesses have a choice: invest now and help shape the future of the Canadian
                economy or wait and risk losing influence through inaction.
              </p>
              <p className="cid-ug-invest-close">
                The opportunity is clear: join a national movement to protect Canada&rsquo;s
                environmental heritage for future generations!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The living wall's white-panel slider — prime real estate rotating between
 *  the National Strategy feature (slide 1 — the live-estimate medallion sits
 *  beside it in the art's misty circle) and the Ooo! Pop Clock Mini card with
 *  its publishable details (slide 2 — the panel shifts up and the solid card
 *  covers the baked "A Force of Nature" title, reclaiming that space).
 *  Auto-advances every 8s until the visitor interacts, pauses on hover/focus,
 *  and sits still under prefers-reduced-motion. Inactive slides are
 *  visibility:hidden (out of the tab order and a11y tree); the grid stack
 *  keeps the panel height stable across slides. */
const LW_SLIDES = ["Live estimate", "Full model"] as const;

function LivingWallSlider({
  populationModel,
  onIndexChange,
}: {
  populationModel: PopulationModelState;
  onIndexChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [userTouched, setUserTouched] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (userTouched || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % LW_SLIDES.length), 8000);
    return () => window.clearInterval(id);
  }, [userTouched, paused]);

  const goTo = (i: number) => {
    setIndex(i);
    setUserTouched(true);
  };

  return (
    <div
      className="cid-lw-slider"
      role="group"
      aria-roledescription="carousel"
      aria-label="Ooo! Pop Clock Mini — live estimate, then the full ring model"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="cid-lw-slides">
        <div className={`cid-lw-slide${index === 0 ? " is-active" : ""}`}>
          {/* The live clock as a compact, bordered device; the arrow advances
              to the full ring model on slide 2. It now owns the whole panel —
              the nature blurb + National Strategy link moved to the block below. */}
          <PopClockCard state={populationModel} wide onAdvance={() => goTo(1)} />
        </div>
        <div className={`cid-lw-slide${index === 1 ? " is-active" : ""}`}>
          <PopClockCard state={populationModel} wide detailed />
        </div>
      </div>
      <div className="cid-lw-dots">
        {LW_SLIDES.map((name, i) => (
          <button
            key={name}
            type="button"
            className={`cid-lw-dot${index === i ? " is-active" : ""}`}
            aria-label={`Show ${name}`}
            aria-current={index === i}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

/** Roman numeral three, drawn as vector strokes so no font substitution,
 *  copy-paste or OCR pass can turn it back into the letters "III" (which
 *  get misread as 111 or iii). This is the canonical way to set Icarus's
 *  name anywhere on the site. */
function IcarusName() {
  return (
    <span className="cid-icarus" role="text" aria-label="Icarus the Third">
      Icarus{" "}
      <svg className="cid-icarus-num" viewBox="0 0 66 40" aria-hidden="true" focusable="false">
        {/* three seriffed uprights: stem plus top and bottom bars, weighted to
            sit with the 900-weight name beside it */}
        <rect x="5" y="7" width="6" height="26" />
        <rect x="0" y="4.2" width="16" height="4" />
        <rect x="0" y="31.8" width="16" height="4" />
        <rect x="30" y="7" width="6" height="26" />
        <rect x="25" y="4.2" width="16" height="4" />
        <rect x="25" y="31.8" width="16" height="4" />
        <rect x="55" y="7" width="6" height="26" />
        <rect x="50" y="4.2" width="16" height="4" />
        <rect x="50" y="31.8" width="16" height="4" />
      </svg>
    </span>
  );
}

/** The Vivarium team: the research facility's glass case (a background, not
 *  a picture, so browsers offer no image zoom, visual search or save
 *  affordance to get stuck in) and the three researchers' nametags, which
 *  stand apart from it as their own cards rather than overlaid on the art. */
type CaseBay = { key: string; cls: string; role: ReactNode; name: ReactNode; sub?: string; orb?: string; title?: string };

const CASE_BAYS: CaseBay[] = [
  { key: "greg", cls: "cid-tag--greg", role: <>Principal<br />Investigator</>, orb: "PI", title: "CID Director", name: <>Greg<br />Long</> },
  { key: "ethel", cls: "cid-tag--ethel", role: <>Ethical<br />Analyst</>, name: "Ethel" },
  { key: "icarus", cls: "cid-tag--icarus", role: <>Executive<br />Trader</>, name: <IcarusName /> },
];

function TeamCase({ base }: { base: string }) {
  const img = (w: number) => `${base}assets/images/cid-team-case-${w}.webp`;
  return (
    <div className="cid-case-wrap">
      <div
        className="cid-case"
        role="img"
        aria-label="The CID Vivarium: a dark glass research facility holding Ethel the Ethical Analyst on the left, Greg Long the Principal Investigator in the centre, and Icarus the Third, Executive Trader, on the right"
        style={{
          backgroundImage: `image-set(url("${img(2560)}") 1x, url("${img(3840)}") 2x)`,
        }}
      />
    </div>
  );
}

function TeamTags() {
  return (
    <div className="cid-viv-tags">
      {CASE_BAYS.map((b) => (
        <div className={`cid-tag ${b.cls}`} key={b.key}>
          <span className="cid-tag-rail" aria-hidden="true" />
          {/* Two columns of roughly equal visual weight: the name reads
              large in heading case on the left, the job title small and
              capitalised over two lines on the right. */}
          <span className="cid-tag-body">
            <span className="cid-tag-id">
              {b.orb && <span className="cid-tag-orb" aria-hidden="true">{b.orb}</span>}
              <span className="cid-tag-name">{b.name}</span>
            </span>
            <span className="cid-tag-meta">
              <span className="cid-tag-role">{b.role}</span>
              {b.title && <span className="cid-tag-title">{b.title}</span>}
              {b.sub && <span className="cid-tag-sub">{b.sub}</span>}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function CID({ onSupport }: { onSupport: () => void }) {
  const base = import.meta.env.BASE_URL;
  // One StatCan data load shared by the pop clock cards, the medallion and
  // the sources strip.
  const populationModel = usePopulationModel();
  // Which living-wall slide is showing: the medallion accompanies the nature
  // slide (0); on the pop clock slide (1) the panel shifts up so the solid
  // card covers the baked "A Force of Nature" title.
  const [lwSlide, setLwSlide] = useState(0);
  // Size the watchlist embed iframe to its content so the page scrolls as one
  // (no nested-iframe scroll trap). The embed reports its height via postMessage.
  const embedRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; height?: number };
      if (!d || d.type !== "cid-watchlist-embed-height" || !d.height) return;
      if (embedRef.current) embedRef.current.style.height = d.height + "px";
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);
  // The Viv display room runs a continuous WebGL render loop once loaded, on
  // or off screen, which competes with the page's own scroll repaints and
  // reads as lag/ghosting while scrolling past it. Tell the room to pause
  // that loop whenever its iframe scrolls out of view, and resume it when it
  // scrolls back in.
  const roomRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const el = roomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.contentWindow?.postMessage({ type: "room-visible", visible: entry.isIntersecting }, window.location.origin),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The welcome line plays its entrance once, when it first scrolls into view,
  // rather than on mount: it sits below the page hero, so on mount it is
  // usually still off screen and the whole entrance would be missed.
  const welcomeRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = welcomeRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cid-scope">
      <section className="case-hero">
        <div className="container cid-hero-container">
          <Link to="/" className="back">← All projects</Link>
          <div className="cid-hero-title-row">
            <h1>Canadian Innovation Dimension</h1>
            <div className="case-meta cid-hero-chips">
              <span className="chip">Research dimension</span>
              <span className="chip">MNPI excluded</span>
            </div>
          </div>
        </div>
      </section>

      {/* CID Vivarium — intro copy, then the "Radical Strategic Intelligence"
          rail paired with the display room, the team case, the storage-scale
          comparison, and the two illustrated principle cards. Single-column
          stack: nothing here needs to be a tall sidebar, so nothing needs to
          be sticky either. The disclaimer from the old intro is retained
          verbatim at the foot. */}
      <section className="cid-viv" aria-label="CID Vivarium">
        <div className="container cid-hero-container cid-viv-stack">
          {/* CID intro sits directly under the page title, so it carries no
              heading of its own. Then the Vivarium. The three researchers'
              nametags used to sit overlaid on the case art below; moved up
              beside the intro instead, which both gets them off the image
              (they were fighting the art, not reading as labels on it) and
              fills the empty column this text used to leave beside it. */}
          <div className="cid-viv-intro-row">
            <div className="cid-viv-intro-col">
              <p className="cid-viv-intro">
                The <strong>Canadian Innovation Dimension (CID)</strong> is an experimental research environment operated by artificial intelligence (AI) agents inside an always-on AI mini-PC.
              </p>
              <div>
                {/* Welcome line, set as live text rather than art. "Welcome"
                    is already on the title line holding its space; "to" skates
                    in from the left; "the Vivarium" rains down a letter at a
                    time. Letters are split into spans so each can carry its own
                    delay, with the whole phrase kept as one accessible name. */}
                <p className="cid-viv-welcome" ref={welcomeRef} aria-label="Welcome to the Vivarium">
                  <span className="cid-viv-welcome-hold" aria-hidden="true">Welcome</span>
                  <span className="cid-viv-welcome-skate" aria-hidden="true">to</span>
                  <span className="cid-viv-welcome-rain" aria-hidden="true">
                    {Array.from("the Vivarium", (ch, i) => (
                      <span key={i} style={{ "--i": i } as CSSProperties}>
                        {ch === " " ? " " : ch}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="cid-viv-tagline">An avant-garde research project has advanced into a sovereign information ecosystem.</p>
              </div>
              <p className="cid-viv-lead">Artificial intelligence (AI) agents operate our facility under the guidance of a human principal investigator.</p>
            </div>
            <TeamTags />
          </div>

          {/* Rail + hero, side by side: the hero (the team case) reads too
              large on its own at full page width, so pairing it with the
              rail's 300px column brings it down to a page-appropriate scale
              and puts that width to use instead of leaving it empty above. */}
          <div className="cid-railhero">
            <aside className="cid-viv-rail" aria-label="Radical Strategic Intelligence">
              <div className="cid-viv-brand">
                <h2 className="cid-viv-title">
                  <span>Radical</span><span>Strategic</span><span className="grad">Intelligence</span>
                </h2>
                <div className="cid-viv-bar" aria-hidden="true" />
              </div>
              <div className="cid-viv-pillar">
                <span className="n">1</span>
                <div><p className="verb">Observe</p><p className="desc">Market dynamics</p></div>
              </div>
              <div className="cid-viv-pillar">
                <span className="n">2</span>
                <div><p className="verb">Compare</p><p className="desc">Information from public sources</p></div>
              </div>
              <div className="cid-viv-pillar">
                <span className="n">3</span>
                <div><p className="verb">Navigate</p><p className="desc">Risks and rewards</p></div>
              </div>
            </aside>

            {/* Vivarium team display case: the three researchers set in one
                glass case, the human PI centred between the two AI agents.
                This is the "three images with Greg in the middle" slot from
                the approved Vivarium copy. */}
            <TeamCase base={base} />
          </div>

          {/* Information Ecosystem: pays off the tagline's "single key" claim
              by naming what that key is, before the sealed case makes the
              physical argument for it. Sole possession, not a customer pitch:
              the Flicker is Ooo's own key, held by its own operator alone. */}
          <div className="cid-viv-ecosystem">
            <h3 className="cid-viv-ecosystem-h">Information Ecosystem</h3>
            <p className="cid-viv-ecosystem-copy">On-premises by design. Every observation the Vivarium makes is recorded, stored, and processed on hardware inside the facility: digital sovereignty, in practice.</p>
            <p className="cid-viv-ecosystem-copy">That sovereignty travels too. The Flicker is Ooo's own storage key, held solely by its operator, carrying the Vivarium's research archive wherever it goes.</p>
          </div>

          {/* Sealed case. The room and the claim it evidences are one
              enclosure rather than two blocks sitting loose on the page:
              vanta-black steel shell, mitred titanium corner blocks, and a
              single mullion between the two compartments. */}
          <div className="cid-vault">
            <span className="cid-vault-corner cid-vault-corner--tl" aria-hidden="true" />
            <span className="cid-vault-corner cid-vault-corner--tr" aria-hidden="true" />
            <span className="cid-vault-corner cid-vault-corner--bl" aria-hidden="true" />
            <span className="cid-vault-corner cid-vault-corner--br" aria-hidden="true" />

            {/* The Viv itself: the always-on AI mini-PC that houses the
                facility, on show in its own display room. Self-contained
                WebGL scene, so it rides in an iframe like the other embeds. */}
            <div className="cid-vivroom">
              <iframe
                ref={roomRef}
                className="cid-vivroom-frame"
                src={`${base}DISPLAY_ROOM_BLUE_checker_cm.html?v=3`}
                title="The Viv display room: the always-on AI mini-PC that houses the CID Vivarium"
                loading="lazy"
              />
            </div>

            <div className="cid-vault-mullion" aria-hidden="true" />

            {/* "1976 vs 2026" storage comparison: makes the case for why a
                device this small earns a display room. Sealed into the same
                case as the room, so the claim and the object it is about are
                read as one piece. */}
            <div className="cid-viv-era">
              <div className="cid-viv-era-row cid-viv-era-then">
                <div className="cid-viv-era-headline">
                  <p className="cid-viv-era-label"><span className="y">1976</span><span className="tag">50 years ago</span></p>
                  <p className="cid-viv-era-stat">~3,150 DISKS</p>
                </div>
                <p className="cid-viv-era-copy">Storing two terabytes of data required ~3,150 disk drives. That much information technology (IT) could fill a machine-room floor nearly the size of a Canadian football field. <span className="cid-viv-era-aside">*Ours is bigger.</span></p>
              </div>
              <div className="cid-viv-era-row cid-viv-era-now">
                <div className="cid-viv-era-headline">
                  <p className="cid-viv-era-label"><span className="y">2026</span><span className="tag">Today</span></p>
                  <p className="cid-viv-era-stat">&lt; 1KG</p>
                </div>
                <p className="cid-viv-era-copy">Now you can palm it.<br />Weighing less than one kilogram,<br />CID contains a cutting-edge research facility.</p>
              </div>
            </div>
          </div>

          {/* Architectural Design and Beneficial Biomimicry, each illustrated
              with its own photo: the Ooo meeting room for Architectural
              Design, the distillation chamber for Beneficial Biomimicry. */}
          <div className="cid-viv-principles">
            <figure className="cid-viv-pcard">
              <div
                className="cid-viv-pcard-photo"
                role="img"
                aria-label="The Ooo meeting room: a glowing Ooo! orb on a lit pedestal, framed by lantern-lit garden walls and a waterfall view"
                style={{ backgroundImage: `url("${base}assets/images/cid-arch-meeting-room.webp")` }}
              />
              <figcaption className="cid-viv-pcard-body">
                <h3>Architectural Design</h3>
                <ul>
                  <li>Distinct environments for observation, collaboration, experimentation</li>
                  <li>Agents use external tools while remaining securely enclosed in the vivarium</li>
                  <li>Interfaces bind actions with fixed rules, restrictions, and limitations</li>
                </ul>
              </figcaption>
            </figure>

            <figure className="cid-viv-pcard">
              <div
                className="cid-viv-pcard-photo"
                role="img"
                aria-label="The distillation chamber: a copper apparatus beside a crystal-lined river cave"
                style={{ backgroundImage: `url("${base}assets/images/cid-biomimicry-distillation.webp")` }}
              />
              <figcaption className="cid-viv-pcard-body">
                <h3>Beneficial Biomimicry</h3>
                <ul>
                  <li>Information flows through environments inspired by the functional principles and geometries found in nature.</li>
                  <li>The information ecosystem evolves through applied research on sustainable design for human-AI interactions.</li>
                </ul>
              </figcaption>
            </figure>
          </div>

          <p className="cid-viv-disc">
            <strong>Ostara and the experimental Canadian Innovation Dimension (CID) do not provide future predictions or financial advice.</strong>
          </p>
        </div>
      </section>

      {/* Innovation Watchlist hero — self-contained DC block from
          public/Innovation Watchlist.dc.html (full-bleed, self-sizing iframe). */}
      {/* Portal drum roll: a quiet dark-galaxy band bridging the Vivarium and
          the Innovation Watchlist. A drum roll, not a splash. */}
      <section className="cid-portal-band" aria-label="CID prototype announcement">
        <p className="cid-portal-line">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v9" /><path d="M6.4 6.4a8 8 0 1 0 11.2 0" /></svg>
          <span>A PORTAL HAS OPENED: CID releases an electric debut prototype!</span>
        </p>
      </section>

      <section className="cid-wl-hero" aria-label="Innovation Watchlist">
        <iframe
          className="cid-wl-frame"
          src={`${base}Innovation%20Watchlist.dc.html?v=9`}
          title="Innovation Watchlist"
          loading="lazy"
        />
      </section>

      <section className="cid-watchlist-embed">
        <iframe
          ref={embedRef}
          src={`${base}cid/watchlist-embed/`}
          title="Canadian Innovation Watchlist"
          loading="lazy"
          className="cid-watchlist-frame"
        />
      </section>

      <DataAccessContinuum />

      {/* Forest layer — a looping portrait of a Canadian conservation area
          (Halton Falls) behind the vine frame, carrying the lid-led pop-clock on
          the clean cliff panel. Placed right after the data section because the
          pop-clock is a live demonstration of what StatCan's open data enables.
          Two assets kept separate: a plain rectangular video UNDER a transparent
          PNG frame ON TOP, aligned to the frame's inner window by exact %. */}
      <section className="cid-livingwall" aria-label="Ooo! Pop Clock Mini on the living wall">
        {/* clean cliff/clouds canvas (cliffcanvas-blank.png) — the ruby title is
            gone from the art now; the white panel is the pop-clock's backdrop */}
        <div className="cid-lw-stage">
          <div
            className="hf-framed-wall"
            role="img"
            aria-label="Live looping footage of Halton Falls Conservation Area, Ontario, framed with a decorative purple wood and vine border"
          >
            <div className="hf-video-window">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={`${base}assets/images/halton-falls-poster.webp`}
                aria-hidden="true"
              >
                <source src={`${base}assets/ooo-halton-falls.webm`} type="video/webm" />
                <source src={`${base}assets/Halton%20H.264%20fallback.mp4`} type="video/mp4" />
              </video>
              <img
                className="hf-poster"
                src={`${base}assets/images/halton-falls-poster.webp`}
                alt="Still frame of Halton Falls Conservation Area, Ontario."
              />
            </div>
            <img
              className="hf-frame-art"
              src={`${base}assets/Ooo-Digital-Frame.png`}
              alt=""
              aria-hidden="true"
            />
          </div>

          <div className="cid-lw-text">
            {/* The pop-clock owns the whole white panel now (compact → full model). */}
            <LivingWallSlider populationModel={populationModel} onIndexChange={setLwSlide} />
          </div>
        </div>

        {/* Sources for the mini model — small text kept off the white panel. */}
        <PopulationSourcesStrip state={populationModel} />
      </section>

      {/* A Force of Nature — Canada's Strategy to Protect Nature. The National
          Strategy narrative + the three pillars, now BELOW the pop-clock demo. */}
      <section className="np-strategy" aria-label="A Force of Nature: Canada's Strategy to Protect Nature">
        <div className="np-inner">
          <div className="np-kicker">A Force of Nature</div>
          <h3 className="np-title">Canada&rsquo;s Strategy to Protect Nature</h3>
          <p className="np-lede">
            Canada&rsquo;s plan to halt and reverse biodiversity loss and protect the land
            and water above the bedrock.
          </p>
          <a
            className="np-strategy-link"
            href={SC.forceOfNature}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="np-strategy-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Open our National Strategy
          </a>
          <h4 className="np-pillars-head">Three pillars</h4>
          <div className="np-grid">
            <div className="np-pillar">
              <span className="np-num">1</span>
              <h4>Protecting Nature in Canada</h4>
              <p>By protecting and conserving more lands and waters and connecting habitats so species can move more safely.</p>
            </div>
            <div className="np-pillar">
              <span className="np-num">2</span>
              <h4>Building Canada Well</h4>
              <p>By designing infrastructure projects that work with nature rather than against it.</p>
            </div>
            <div className="np-pillar np-pillar--finance">
              <span className="np-num">3</span>
              <h4>Valuing Nature &amp; Mobilizing Capital</h4>
              <p>By using finance tools to fund conservation in a sustainable, long-term way.</p>
            </div>
          </div>
          <a
            className="np-link"
            href="https://www.canada.ca/en/services/environment/nature/nature-strategy.html#toc6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more ↗
          </a>
        </div>
      </section>

      <section className="cid-forest" aria-label="Above the bedrock: Canada's living landscape">
        <div className="cid-forest-inner">
          <video
            className="cid-forest-video"
            src={`${import.meta.env.BASE_URL}assets/images/CID-Forest-Layer.mp4`}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="cid-canopy" aria-label="Above ground: Canada's natural wealth">
        <div className="cid-canopy-grid">
          {/* Wetlands — left column, under the wetlands photo half of the video above */}
          <article className="cid-canopy-tile cid-canopy-tile--left">
            <h3 className="cid-canopy-h">Wetlands</h3>
            <p className="cid-canopy-desc">
              Absorbing carbon and excess rainfall helps maintain ecological stability and
              resilience to severe weather impacts.
            </p>
            <p className="cid-canopy-metric">
              <span className="cid-canopy-k">Value</span>$225&nbsp;billion, backed by our{" "}
              <strong>25%</strong> share of the world&rsquo;s wetlands.
            </p>
            <p className="cid-canopy-metric">
              <span className="cid-canopy-k">Strengths</span>Enhances water quality, absorbs
              carbon emissions, and mitigates the effects of climate change. Canada possesses{" "}
              <strong>20%</strong> of the world&rsquo;s fresh water.
            </p>
          </article>

          {/* Middle column — nature-rich summary + the pull quote, straddling the divider */}
          <div className="cid-canopy-midcol">
            <aside className="cid-canopy-mid">
              <p className="cid-canopy-mid-lead">
                Canada is one of the most nature-rich countries on Earth.
              </p>
              <ul className="cid-canopy-mid-stats">
                <li><span className="cid-canopy-mid-n">20%</span> of the world&rsquo;s fresh water</li>
                <li><span className="cid-canopy-mid-n">25%</span> of global wetlands</li>
              </ul>
            </aside>
            <figure className="cid-canopy-quote">
              <blockquote>&ldquo;The best offence is a strong defence.&rdquo;</blockquote>
              <figcaption>&mdash; most hockey coaches agree.</figcaption>
            </figure>
          </div>

          {/* Boreal forests — right column, under the raining-canopy half of the video above */}
          <article className="cid-canopy-tile cid-canopy-tile--right">
            <h3 className="cid-canopy-h">Boreal forests</h3>
            <p className="cid-canopy-desc">
              Canada stewards <strong>54%</strong> of the world&rsquo;s boreal forests. This
              vast terrestrial storehouse greatly enhances carbon capture and storage (CCS).
            </p>
            <p className="cid-canopy-metric">
              <span className="cid-canopy-k">Value</span>~$703&nbsp;billion.
            </p>
            <p className="cid-canopy-metric">
              <span className="cid-canopy-k">Strengths</span>Carbon storage, flood and pest control.
            </p>
          </article>
        </div>
      </section>

      <Underground />

      <section className="cid-join" aria-labelledby="cid-join-title">
        <div className="cid-join-inner">
          <h2 id="cid-join-title" className="cid-join-title">
            Join the movement to protect Canada&rsquo;s valuable natural resources!
          </h2>
          <button type="button" onClick={onSupport} className="btn btn-primary cid-join-cta">
            Support the work →
          </button>
        </div>
      </section>

    </div>
  );
}
