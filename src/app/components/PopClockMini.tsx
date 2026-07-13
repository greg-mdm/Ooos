import "../../styles/pop-clock-mini.css";
import { PopClockCard, usePopulationModel } from "./population/PopulationClockCard";

/**
 * /pop-clock-mini — the Ooo! Pop Clock Mini product page.
 * Layout language (per the WEBSITE_ARCHITECTURE deck): text sits directly on
 * the robin's-egg canvas with wide margins and hairline dividers; the only
 * boxed elements are the product itself (the dark clock card), the code
 * snippet, and the square shareable quote tiles. No cards-inside-cards.
 */

/** The "Ooo! Pop Clock Mini" lockup: wordmark image + Lovelo text. */
function Lockup() {
  return (
    <>
      <img
        className="pcm-wordmark"
        src={`${import.meta.env.BASE_URL}assets/brand/ooo-wordmark-portal-transparent.png`}
        alt="Ooo!"
      />
      <span className="pcm-lockup-text">Pop Clock Mini</span>
    </>
  );
}

const RING_SPECS = [
  {
    key: "births",
    chip: "pcm-chip--births",
    name: "Births.",
    desc: "A solid forest-green ring fills toward the next birth, pulses, and resets. Green is natural growth.",
  },
  {
    key: "deaths",
    chip: "pcm-chip--deaths",
    name: "Deaths.",
    desc: "The ring darkens as it fills: indigo, dark indigo, then midnight black at the moment of the event.",
  },
  {
    key: "immigrants",
    chip: "pcm-chip--immigrants",
    name: "Immigrants.",
    desc: "A solid ruby-red ring. New permanent residents, people granted the right to live in Canada for good.",
  },
  {
    key: "emigrants",
    chip: "pcm-chip--drift",
    name: "Emigrants.",
    desc: "A dashed ring that drifts with the day's net count of residents leaving Canada to live abroad.",
  },
  {
    key: "npr",
    chip: "pcm-chip--drift",
    name: "Non-permanent.",
    desc: "A dashed ring for the net change in temporary status: work permits, study permits, and asylum claimants.",
  },
];

const SPECS: [string, string][] = [
  ["Data source", "Statistics Canada Web Data Service (live REST API)"],
  ["Tables", "17-10-0009, 17-10-0059, 17-10-0040"],
  ["Refresh", "Quarterly StatCan estimates, checked daily (24-hour local cache)"],
  ["Model", "The latest quarterly components, paced evenly from Eastern midnight"],
  [
    "Failsafes",
    "Components basis, then year-over-year basis, then a visible error state. Never a made-up number.",
  ],
  [
    "Formats",
    "CID living wall (React) and a standalone embed: one div plus one script tag, no dependencies",
  ],
  ["Status", "Experimental. Not endorsed by Statistics Canada."],
];

export function PopClockMini() {
  const base = import.meta.env.BASE_URL;
  const model = usePopulationModel();
  return (
    <div className="pcm-scope">
      {/* ---- Hero: the product, front and centre --------------------------- */}
      <section className="pcm-hero" aria-label="Ooo! Pop Clock Mini — live product">
        <div className="pcm-hero-copy">
          <p className="pcm-kicker">Humans of Canada · Live data product</p>
          <h1 className="pcm-h1">
            <Lockup />
          </h1>
          <p className="pcm-tag">
            A live estimate of Canada&rsquo;s population, ticking person by person. Built on
            Statistics Canada open data.
          </p>
          <div className="pcm-actions">
            <a className="pcm-btn pcm-btn--primary" href={`${base}cid`}>
              See it on the living wall →
            </a>
            <a className="pcm-btn pcm-btn--ghost" href="#pcm-embed">
              Get the embed
            </a>
          </div>
          <p className="pcm-facts">Free · Open data · Embeds anywhere</p>
        </div>
        <div className="pcm-hero-clock">
          <PopClockCard state={model} wide detailed learnLink={false} />
        </div>
      </section>

      <div className="pcm-inner">
        {/* ---- The story: a big centred statement on the canvas ------------- */}
        <section className="pcm-sect pcm-story" aria-label="Memento vivere">
          <h2 className="pcm-epigraph">
            <em>Memento vivere.</em>
            <span className="pcm-epigraph-en">Remember to live.</span>
          </h2>
          <p className="pcm-verse">
            Some are born. Some are dying.
            <br />
            The rhythm sustains, always the same.
            <br />
            Many melodies rise in harmony.
          </p>
        </section>

        {/* ---- Why it matters: three columns, text on canvas ----------------- */}
        <section className="pcm-sect" aria-label="Why it matters">
          <div className="pcm-cols3 pcm-cols3--story">
            <div className="pcm-col3">
              <p className="pcm-collead">
                <strong>Every 1 is someone.</strong> Each number on this clock represents a real
                person with a lifetime of experience.
              </p>
            </div>
            <div className="pcm-col3">
              <p className="pcm-collead">
                <strong>Watch and learn.</strong> Understanding demographic data is key to
                spotting trends, finding correlations and identifying insights needed to inform
                decisions and guide strategic plans.
              </p>
            </div>
            <div className="pcm-col3">
              <p className="pcm-collead">
                <strong>Observe the rhythm.</strong> Discover the patterns. Question your
                understanding.
              </p>
              <a className="pcm-arrow" href={`${base}jellybean-journeys/index.html`} target="_blank" rel="noopener noreferrer">
                Explore JellyBean Journeys →
              </a>
            </div>
          </div>
        </section>

        {/* ---- Capabilities: fine print → H1 lockup → H2, per the mock ------ */}
        <section className="pcm-sect" aria-label="What it can do">
          <p className="pcm-fineprint">More than a timepiece for tech enthusiasts&hellip;</p>
          <p className="pcm-caps-lockup">
            <span className="pcm-caps-h1">
              <Lockup />
            </span>{" "}
            <span className="pcm-caps-h2">can do all this and more:</span>
          </p>
          <ul className="pcm-caps">
            <li>Forecast challenges &amp; opportunities</li>
            <li>Navigate intersecting issues</li>
            <li>Pinpoint systematic issues</li>
            <li>Navigate shifting geopolitics</li>
            <li>Reveal potential futures</li>
            <li>Manage market needs</li>
          </ul>
          <p className="pcm-warning">
            <strong>Warning:</strong> Big numbers tell powerful stories. Learning to read them
            may alter your perspective.
          </p>
        </section>

        {/* ---- How to read it: chip columns with hairline dividers ----------- */}
        <section className="pcm-sect" aria-label="Visual language">
          <p className="pcm-eyebrow">Visual language</p>
          <h2 className="pcm-sect-h">How to read it</h2>
          <p className="pcm-lead">
            Three solid rings tick with events. Two dashed rings drift with net flows. Hover any
            ring on the live clock to see what it counts.
          </p>
          <ul className="pcm-rings">
            {RING_SPECS.map((r) => (
              <li key={r.key} className="pcm-ringspec">
                <span className={`pcm-chip ${r.chip}`} aria-hidden="true" />
                <p className="pcm-collead">
                  <strong>{r.name}</strong> {r.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Loon states --------------------------------------------------- */}
        <section className="pcm-sect" aria-label="Loon states">
          <p className="pcm-eyebrow">Signal</p>
          <h2 className="pcm-sect-h">
            Loon states <span className="pcm-badge">in development</span>
          </h2>
          <div className="pcm-loon-row">
            <video
              className="pcm-loon-video"
              src={`${base}pop-clock/loon/LoonState-Corner-Sustained.mp4`}
              poster={`${base}pop-clock/loon/loon-poster.jpg`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Watercolour loon dipping below the waterline"
            />
            <div className="pcm-loon-copy">
              <p className="pcm-collead">
                <strong>Surface.</strong> The day&rsquo;s net change is up. The loon rides the
                water.
              </p>
              <p className="pcm-collead">
                <strong>Dive.</strong> A net dip. The loon slips below the waterline.
              </p>
              <p className="pcm-collead pcm-collead--mut">
                A Canadian signal for direction: watch it the way you watch a trend line rise
                and fall.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Specifications: two-level table, hairline rows ----------------- */}
        <section className="pcm-sect" aria-label="Specifications">
          <p className="pcm-eyebrow">Technical details</p>
          <h2 className="pcm-sect-h">Specifications</h2>
          <dl className="pcm-specs">
            {SPECS.map(([dt, dd]) => (
              <div key={dt} className="pcm-spec-row">
                <dt>{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
          </dl>
          <p className="pcm-foot">
            Source: Statistics Canada, Canada&rsquo;s population clock (real-time model), and
            related public data tables. Adapted using the Statistics Canada Web Data Service.
            This does not imply endorsement by Statistics Canada.{" "}
            <a
              href="https://www.statcan.gc.ca/en/dai/btd/pop-clock"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check Canada&rsquo;s official real-time population clock →
            </a>
          </p>
        </section>

        {/* ---- Get the embed ------------------------------------------------- */}
        <section className="pcm-sect" id="pcm-embed" aria-label="Get the embed">
          <p className="pcm-eyebrow">Ship it</p>
          <h2 className="pcm-sect-h">Get the embed</h2>
          <p className="pcm-lead">
            The standalone clock is one file with no dependencies. Drop these two lines into any
            page:
          </p>
          <pre className="pcm-code">
            <code>{`<div id="ooo-pop-clock"></div>\n<script src="https://ooos.ca/pop-clock/ooo-pop-clock.js"></script>`}</code>
          </pre>
          <p className="pcm-foot">
            The card is self-styled, responsive, and inherits nothing from the host page.{" "}
            <a href={`${base}pop-clock/`} target="_blank" rel="noopener noreferrer">
              Demo and options →
            </a>{" "}
            Regional clocks (Kingston first) will ship in the same format.
          </p>
        </section>

        {/* ---- Two ways of knowing: square, shareable quote tiles ------------- */}
        <section className="pcm-sect" aria-label="Two ways of knowing">
          <p className="pcm-eyebrow">Two ways of knowing</p>
          <div className="pcm-tiles">
            <figure className="pcm-tile pcm-tile--hcd">
              <figcaption className="pcm-tile-kicker">Human-Centred Design</figcaption>
              <blockquote className="pcm-tile-quote">
                &ldquo;Drive innovation by deeply understanding customer needs.&rdquo;
              </blockquote>
              <p className="pcm-tile-cite">IDEO U</p>
            </figure>
            <figure className="pcm-tile pcm-tile--rel">
              <figcaption className="pcm-tile-kicker">Relationality</figcaption>
              <blockquote className="pcm-tile-quote">
                &ldquo;Relationships are vital to creating awareness, building trust, and
                garnering support in order to mobilize action.&rdquo;
              </blockquote>
              <p className="pcm-tile-cite">Cote-Meek (2020, p. xviii)</p>
            </figure>
          </div>
          <p className="pcm-foot">
            Cited in Patricia Barkaskas and Derek Gladwin, &ldquo;Pedagogical Talking Circles:
            Decolonizing Education through Relational Indigenous Frameworks,&rdquo; University of
            British Columbia.
          </p>
        </section>

        {/* ---- Learning outcomes + closing actions ---------------------------- */}
        <section className="pcm-sect" aria-label="Learning outcomes">
          <p className="pcm-eyebrow">Learning outcomes</p>
          <ol className="pcm-outcomes">
            <li>Observe the rhythm, discover patterns, and question your understanding.</li>
            <li>Use reliable data to test assumptions and address challenges.</li>
            <li>Understand different perspectives and competing priorities.</li>
          </ol>
          <p className="pcm-bridge">
            Awareness is a bridge, not a destination.{" "}
            <a
              href={`${base}jellybean-journeys/index.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore JellyBean Journeys →
            </a>
          </p>
          <div className="pcm-actions pcm-actions--end">
            <a className="pcm-btn pcm-btn--primary" href={`${base}cid`}>
              See it on the living wall →
            </a>
            <a
              className="pcm-btn pcm-btn--ghost"
              href={`${base}jellybean-journeys/index.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              JellyBean Journeys
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
