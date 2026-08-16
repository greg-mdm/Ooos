import { useState, type ReactNode, type CSSProperties } from "react";
import { SC } from "./statcan-links";

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
export function DataAccessContinuum() {
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

export default DataAccessContinuum;
