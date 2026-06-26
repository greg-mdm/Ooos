import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "../../styles/cid-continuum.css";

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
    tag: "National strategy",
    title: "A Force of Nature: Canada's Strategy to Protect Nature",
    blurb: "Canada's plan to halt and reverse biodiversity loss and protect the land and water above the bedrock.",
    href: SC.forceOfNature,
    hero: false,
  },
  {
    tag: "Elevation dataset",
    title: "Ontario radar digital surface model",
    blurb: "Province-wide radar-derived elevation surface (DSM) from the Ontario Data Catalogue.",
    href: SC.radarDsm,
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

/** One route on the continuum. The route name is the disclosure trigger;
 *  opening it reveals the StatsCan access card + a link to that program. */
function RouteItem({ route, index }: { route: AccessRoute; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `cid-route-${route.key}`;
  return (
    <li className={`cid-route ${open ? "is-open" : ""}`}>
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
            Canada&rsquo;s public record reaches far beyond innovation. It helps you explore
            social, cultural, economic, technological and environmental change&mdash;and
            understand how people, communities, institutions and industries evolve over time.
          </p>
          <p>
            For more than a century, Statistics Canada has transformed protected information
            into trusted public evidence. That long and consistent record gives data detectives
            more opportunities to compare periods, identify patterns, test assumptions and
            support better research, services, policy and social development.
          </p>
          <p>
            Use the map below as your way into this data ecosystem. Begin on the left with open,
            self-serve tools. Move to the right when your question requires more detailed data or
            a controlled research environment. Every route protects respondent confidentiality,
            while stronger authorization and security procedures apply toward the secure end of
            the continuum.
          </p>
          <p className="cid-continuum-pull">
            This is not a ranking of data quality. It is a guide to choosing the right level of
            access for the question you are asking.
          </p>
        </div>

        <div className="cid-continuum-scale">
          <div className="cid-continuum-ends" aria-hidden="true">
            <span className="cid-continuum-end cid-continuum-end--open">Self-serve access</span>
            <span className="cid-continuum-end-mid">more controlled access</span>
            <span className="cid-continuum-end cid-continuum-end--secure">Secure access</span>
          </div>
          <div className="cid-continuum-track" aria-hidden="true" />
          <p className="cid-continuum-howto">
            <strong>How to read the continuum.</strong> Select a route to see how it works,
            where you reach it, and what data it covers.
          </p>
          <ol className="cid-continuum-routes">
            {ROUTES.map((r, i) => (
              <RouteItem key={r.key} route={r} index={i + 1} />
            ))}
          </ol>
          <p className="cid-continuum-foot">
            As you move from left to right, the data may become more detailed or sensitive, so
            the privacy, authorization and security requirements increase.
          </p>
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
          <span className="cid-continuum-source">Source: Statistics Canada, Continuum of Data Access.</span>
        </p>
      </div>
    </section>
  );
}

/** The page floor — the "underground" layer of the public record. Sits flush
 *  above the site footer with a deep subsurface field and terrain link cards. */
function Underground() {
  return (
    <section className="cid-underground" aria-labelledby="cid-underground-title">
      <div className="cid-continuum-inner">
        <p className="cid-underground-eyebrow">
          <span aria-hidden="true">▼</span> Below the surface
        </p>
        <h2 id="cid-underground-title" className="cid-underground-title">Underground &amp; terrain</h2>
        <p className="cid-underground-lede">
          The deepest layer of the public record&mdash;what lies beneath the map. Aggregate
          sites, elevation surfaces and the national strategy to protect the nature above them.
        </p>
        <div className="cid-underground-grid">
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
        </div>
      </div>
    </section>
  );
}

export function CID({ onSupport }: { onSupport: () => void }) {
  const base = import.meta.env.BASE_URL;
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
          <div className="cid-hero-summary">
            <p className="summary">
              A research dimension tracking sovereign innovation across Canada
              and allied jurisdictions through triangulation of public sources,
              verified public data sets, and strict exclusion of Material Non
              Public Information (MNPI). The system tracks organizations,
              strategic sectors, policy developments, bilateral partnerships,
              and capital market activity across emerging technologies. The Innovation Watchlist is the first tool
              offering access to this dimension.
            </p>
            <div className="cid-hero-summary-right">
              <p className="summary">
                Ostara empowers innovators, researchers, entrepreneurs, and curious minds to collaboratively explore diverse sectors, policy trends, and market dynamics. It analyzes real-world signals, enables experimentation, and offers a platform for comparing verified information and assessing competing interpretations. <strong>Ostara and the experimental Canadian Innovation Dimension (CID) do not provide future predictions or financial advice.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="case-body cid-body-wide">
        <div className="cid-split">
          <div className="cid-watchlist-card">
            <h2 className="cid-watchlist-title"><strong>INNOVATION WATCHLIST</strong></h2>
            <p>
              A curated watchlist monitoring Space, AI, Defence, Energy,
              Maritime, and Quantum across Canada, the EU, the Nordic countries,
              and the Indo-Pacific. Each signal card presents an analysis of
              policy triggers across procurement, regulation, sovereignty,
              investment, and strategic priorities.
            </p>
            <p>
              Signals can be filtered by region, sector, status, organization
              type, and signal strength. Inspired by gamestorming concepts, the
              watchlist empowers participants worldwide to explore signals,
              compare perspectives, and make decisions under uncertainty.
            </p>

            <p style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
              <a
                href={`${base}cid/watchlist/`}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the watchlist (full screen) ↗
              </a>
              <a
                href="https://kahoot.it/challenge/01297559"
                className="btn btn-kahoot"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vote on Kahoot →
              </a>
            </p>
          </div>

          <div className="cid-right-col">
          <aside className="cid-vote-panel" aria-label="Live polymarket vote">
            <div className="vote-source-label">
              POLYMARKET · <span className="vote-volume">$29.05M LIVE VOLUME</span>
            </div>
            <div className="vote-question-text">
              Will the US and Iran reach<br />a permanent peace deal by June 30?
            </div>
            <div className="vote-cards-row">
              <div className="big-vote-card yes-card">
                <div className="bvc-label">YES</div>
                <div className="bvc-price">18¢</div>
              </div>
              <div className="big-vote-card no-card">
                <div className="bvc-label">NO</div>
                <div className="bvc-price">82¢</div>
              </div>
              <div className="big-vote-card abstain-card">
                <div className="bvc-label">ABSTAIN</div>
              </div>
            </div>
            <a
              className="vote-cta-btn"
              href="https://kahoot.it/challenge/01297559"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vote on Kahoot →
            </a>
            <div className="vote-meta">
              Game Pin: 01297559 · EXPIRES 2026-06-01
            </div>
          </aside>
          <div className="cid-note-card">
            <p>
              Examine interconnected signals across <strong>public, private,
              nonprofit, government, financial, and research</strong> sectors to
              identify emerging opportunities for strategic alignment.
            </p>
          </div>
          </div>
        </div>
      </div>

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
      <Underground />

    </div>
  );
}
