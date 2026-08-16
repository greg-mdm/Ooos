import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import "../../styles/cid-continuum.css";
import "../../styles/cid-forest.css";
import "../../styles/cid-coins.css";
import "../../styles/cid-vivarium.css";
import { SC } from "./cid/statcan-links";

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

// "Two ways of seeing Greg": one vertical screen, two settings. Pressing a lens
// button slides the stage to that view (Ethel's or Icarus's), animated. The
// clips are supplied separately and drop into each panel's <video>; until then
// each panel shows a labelled placeholder slot.
function GregLensSlider({ base }: { base: string }) {
  // Each lens plays through its own list of clips (the active lens auto-advances
  // to the next when one ends, cycling). The other lens holds on its still.
  // TO ADD OR RE-TRIM A CLIP: optimize it to a web H.264 mp4
  // (scripts/add-lens-clip.sh), drop it in public/assets/video/, add its
  // filename to that lens's `clips` array below, AND BUMP LENS_V. Filenames
  // are reused across edits (e.g. re-trimming greg-ethel-lens.mp4), and
  // browsers cache video by URL, so without a version bump a visitor who
  // already loaded the page can keep playing the old cached clip indefinitely.
  // See SPRINT 4 - REFERENCES/LENS-CLIPS.md.
  const LENS_V = 2;
  const V = `${base}assets/video/`;
  const cv = (name: string) => `${V}${name}?v=${LENS_V}`;
  const LENSES = [
    { key: "ethel",  device: "ⓔMage",   station: "ΩStation 7.83", glyph: "꩜", label: "Greg, as Ethel sees him",  still: `${base}assets/greg-ethel-field.webp?v=${LENS_V}`, clips: [cv("greg-ethel-lens.mp4"), cv("greg-ethel-emage1.mp4"), cv("greg-ethel-emage783.mp4")] },
    { key: "icarus", device: "Ⅲ Vision", station: "αLiveShow",     glyph: "🔺", label: "Greg, as Icarus sees him", still: `${V}greg-icarus-still.webp?v=${LENS_V}`,           clips: [cv("greg-icarus-lens.mp4"), cv("greg-icarus-wide.mp4")] },
  ];
  // Start with Icarus playing and Ethel (the field shot) held as a still.
  const [active, setActive] = useState(1);
  const [clipIdx, setClipIdx] = useState(0);
  const pick = (i: number) => { setActive(i); setClipIdx(0); };
  return (
    <div className="cid-lens">
      <div className="cid-lens-duo">
        {LENSES.map((l, i) => {
          const on = active === i;
          const at = clipIdx % l.clips.length;
          const clip = l.clips[at];
          return (
            <div className={`cid-lens-cell cid-lens-cell--${l.key} ${on ? "is-active" : ""}`} key={l.key}>
              <button
                type="button"
                className="cid-lens-panel"
                aria-pressed={on}
                aria-label={on ? l.label : `Play ${l.label}`}
                onClick={() => pick(i)}
              >
                {on ? (
                  <video
                    key={clip}
                    className="cid-lens-video"
                    src={clip}
                    poster={l.still}
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => setClipIdx((x) => (x + 1) % l.clips.length)}
                  />
                ) : (
                  <div className="cid-lens-still" role="img" aria-label={l.label} style={{ backgroundImage: `url("${l.still}")` }} />
                )}
              </button>
              <div className="cid-lens-cap">
                <span className="cid-lens-btn-glyph" aria-hidden="true">{l.glyph}</span>
                <span className="cid-lens-btn-device">{l.device}</span>
                <span className="cid-lens-btn-station">{l.station}</span>
                {on && l.clips.length > 1 && (
                  <span className="cid-lens-dots" aria-hidden="true">
                    {l.clips.map((_, k) => <span key={k} className={`cid-lens-dot ${k === at ? "on" : ""}`} />)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
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

// Left to right, matching the case art below: Ethel, Greg in the middle,
// Icarus. Stacked on narrow screens Greg comes first again, via CSS order.
const CASE_BAYS: CaseBay[] = [
  { key: "ethel", cls: "cid-tag--ethel", role: <>Ethical<br />Analyst</>, name: "Ethel" },
  { key: "greg", cls: "cid-tag--greg", role: <>Principal<br />Investigator</>, orb: "PI", title: "CID Director", name: <>Greg<br />Long</> },
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
  // The population model, the living-wall slide index and the watchlist embed's
  // height listener all moved to IWatchlist with the sections that used them.
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
              <div className="cid-viv-lede">
                {/* Welcome line, set as live text with the 2 ball standing in
                    for the word "to". "Welcome" is already on the title line
                    holding its space; the ball rolls in from the left; "the
                    Vivarium" rains down a letter at a time. Letters are split
                    into spans so each can carry its own delay, and the whole
                    phrase keeps one accessible name, so the ball reads as the
                    word it replaces rather than as an image. */}
                <p className="cid-viv-welcome" ref={welcomeRef} aria-label="Welcome to the Vivarium">
                  <span className="cid-viv-welcome-hold" aria-hidden="true">Welcome</span>
                  <img
                    className="cid-viv-welcome-ball"
                    src={`${base}assets/images/viv-2ball.webp`}
                    alt=""
                    aria-hidden="true"
                    width={256}
                    height={257}
                    decoding="async"
                  />
                  <span className="cid-viv-welcome-rain" aria-hidden="true">
                    {Array.from("the Vivarium", (ch, i) => (
                      <span key={i} style={{ "--i": i } as CSSProperties}>
                        {ch === " " ? " " : ch}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="cid-viv-lead">The Vivarium makes global research collaboration into a gamified information ecosystem. Our 24/7 team is designed to facilitate group creativity and knowledge exchange within synthetic research environments built to protect people while nurturing artificial intelligences evolving within them.</p>
              </div>

              {/* Leadership: who runs the Vivarium, and the division's mandate. */}
              <div className="cid-viv-leadership">
                <h3 className="cid-viv-ecosystem-h">Leadership</h3>
                <p className="cid-viv-lead">The CID Director serves as Principal Investigator and Systems Architect, directing all research operations and guiding engagement activities in our purpose-built habitat.</p>
                <p className="cid-viv-lead">As a division of <span className="cid-ooo">Ooo!</span> Digital Media Studio, CID is designed to:</p>
                <ul className="cid-viv-lead-list">
                  <li>Expand public access to collective intelligence</li>
                  <li>Pursue research imperatives set by <span className="cid-ooo">Ooo!</span> Digital Media Studio</li>
                </ul>

                {/* Greg's supplied wording, set verbatim and marked DRAFT per
                    the Habitat display plan's guardrail: draft copy lives in
                    named slots behind a flag that is easy to remove. Two
                    things flagged back to him rather than silently corrected:
                    "Our research are driven by", and whether "B20" is meant
                    to be "B2O" for business to organization. The four
                    cooperation modes are set as a definition list so every
                    acronym sits with its meaning, per the house rule. */}
                <div className="cid-viv-drivers">
                  <p className="cid-viv-draft-flag">Draft copy, not approved</p>
                  <p className="cid-viv-lead">Our research are driven by</p>
                  <ul className="cid-viv-lead-list">
                    <li><strong>Radical Strategic Intelligence</strong></li>
                    <li><strong>Collective problem solving</strong></li>
                    <li><strong>Creative Cooperation</strong></li>
                  </ul>
                  <dl className="cid-viv-coop">
                    <div><dt>B2B</dt><dd>Business to Business</dd></div>
                    <div><dt>B2G</dt><dd>Business to Government</dd></div>
                    <div><dt>P2P</dt><dd>Peer to Peer</dd></div>
                    <div><dt>B20</dt><dd>Business to Organization</dd></div>
                  </dl>
                </div>

                {/* Digital products and studio services offered by CID. */}
                <div className="cid-viv-offer">
                  <div className="cid-viv-offer-row">
                    <p className="cid-viv-offer-label">Digital Products</p>
                    <div className="cid-viv-offer-pills">
                      <span className="cid-viv-pill">Experimental Research Design</span>
                      <span className="cid-viv-pill">AI4XD</span>
                      <span className="cid-viv-pill">Data Viz</span>
                    </div>
                    <p className="cid-viv-offer-note">AI4XD: Artificial Intelligence for Experience Design</p>
                    <p className="cid-viv-offer-note">Data Viz: Immersive Data Visualizations</p>
                  </div>
                  <div className="cid-viv-offer-row">
                    <p className="cid-viv-offer-label">Studio Services</p>
                    <div className="cid-viv-offer-pills">
                      <span className="cid-viv-pill">Market Research</span>
                      <span className="cid-viv-pill">Sector Support</span>
                      <span className="cid-viv-pill">Internationalization</span>
                    </div>
                  </div>
                </div>
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
                    src={`${base}DISPLAY_ROOM_BLUE_checker_cm.html?v=4`}
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

              {/* The three researchers side by side under the copy, in the
                  same order as the case art below: Ethel, Greg in the middle,
                  Icarus. */}
              <TeamTags />

              {/* Vivarium team display case: the three researchers set in one
                  glass case, the human principal investigator centred between
                  the two AI agents. */}
              <TeamCase base={base} />

              {/* Information Ecosystem + the Flicker card sit in the left
                  column beneath the team case, filling the space beside the
                  taller reference card in the right column. */}
              <div className="cid-viv-ecosystem">
                <h3 className="cid-viv-ecosystem-h">Information Ecosystem</h3>
                <p className="cid-viv-ecosystem-copy">Miniaturized local AI infrastructure systematically integrates, aggregates, synthesizes, and stores all proprietary CID data. Our models, prototypes, workflows, and reusable skills are secured on-premises.</p>

                {/* The Flicker card and the inputs/tags glossary sit side by
                    side, filling the band beside the reference card. The Flicker
                    image drops into cid-viv-flicker-img; its copy stays to the
                    label plus the one-line function, no physical description. */}
                <div className="cid-viv-eco-row">
                  <figure className="cid-viv-flicker">
                    <div className="cid-viv-flicker-img" role="img" aria-label="The Flicker" />
                    <figcaption className="cid-viv-flicker-cap">
                      <p className="cid-viv-flicker-name">CID Flicker</p>
                      <p className="cid-viv-flicker-desc">Controls access to the Vivarium at all times. Possessed by our sole proprietor at all times.</p>
                    </figcaption>
                  </figure>

                  <aside className="cid-etym cid-viv-glossary" aria-label="Vivarium inputs and tags">
                    <div className="cid-etym-row">
                      <p className="cid-etym-key">User inputs</p>
                      <ul className="cid-etym-list">
                        <li><span className="cid-etym-abbr">FO</span> · Field Observation directly recorded by a verified contributor</li>
                        <li><span className="cid-etym-abbr">RT</span> · Research Theory that tips off an investigation</li>
                        <li><span className="cid-etym-abbr">TS</span> · Trading Strategy proposed for analysis or controlled testing</li>
                      </ul>
                    </div>
                    <div className="cid-etym-row">
                      <p className="cid-etym-key">System tags</p>
                      <ul className="cid-etym-list">
                        <li><span className="cid-etym-abbr">RWS</span> · Real-World Signals</li>
                      </ul>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
            {/* Right column, one panel: the Radical Strategic Intelligence
                rail, then the etymology card beneath it. */}
            <div className="cid-viv-side">
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

              <aside className="cid-etym" aria-label="Etymology of vivarium">
                <p className="cid-etym-label">Etymology</p>
                <p className="cid-etym-sub">History of the living word</p>
                <p className="cid-etym-word">vi·var·i·um</p>
                <p className="cid-etym-ipa">/vaɪˈvɛəriəm/</p>
                <p className="cid-etym-def">A place for living things.</p>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">Language</p>
                  <p className="cid-etym-val">English · Français</p>
                </div>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">Latin word family</p>
                  <p className="cid-etym-val">
                    <em>vivus</em>, “alive”<br />
                    <em>vivere</em>, “to live”
                  </p>
                </div>
              </aside>

              <aside className="cid-etym" aria-label="Vivarium reference">
                <p className="cid-etym-label">Reference</p>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">Field name</p>
                  <div className="cid-etym-inline">
                    <p className="cid-etym-val"><code className="cid-etym-code">the_viv</code></p>
                    <p className="cid-etym-note">Database identifier</p>
                  </div>
                </div>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">Call sign</p>
                  <div className="cid-etym-inline">
                    <p className="cid-etym-val">CID Viv</p>
                    <p className="cid-etym-note">Operational name</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Access tiers: how the Vivarium opens to the public and partners,
              from open access down to the restricted Floor 0 lairs. */}
          <div className="cid-viv-access">
            <h3 className="cid-viv-access-h">Research Access</h3>
            <div className="cid-viv-access-grid">
              <div className="cid-viv-tier" style={{ "--tier": "#17A398" } as CSSProperties}>
                <p className="cid-viv-tier-label">Public</p>
                <p className="cid-viv-tier-name">Open Access</p>
                <p className="cid-viv-tier-desc">Open research, tools, and resources for curious minds.</p>
              </div>
              <div className="cid-viv-tier" style={{ "--tier": "#B67A00" } as CSSProperties}>
                <p className="cid-viv-tier-label">Gated</p>
                <p className="cid-viv-tier-name">Community Partners</p>
                <p className="cid-viv-tier-desc">Protected spaces for creative partners and approved participants. Access controls support consent, age verification and privacy requirements.</p>
              </div>
              <div className="cid-viv-tier" style={{ "--tier": "#6C01F4" } as CSSProperties}>
                <p className="cid-viv-tier-label">Collaborative</p>
                <p className="cid-viv-tier-name">CAULDRONS</p>
                <p className="cid-viv-tier-desc">Shared spaces where authorized participants exchange perspectives, experiment and build knowledge together.</p>
              </div>
            </div>

            {/* The two restricted tiers set apart from the three open/friendly
                ones above: a divider and a darker tier idiom, so "authorized
                access only" reads as a distinct tier of the page, not just
                another card in the row. */}
            <div className="cid-viv-access-restricted">
              <div className="cid-viv-tier cid-viv-tier--dark" style={{ "--tier": "#822F00" } as CSSProperties}>
                <p className="cid-viv-tier-label">Restricted</p>
                <p className="cid-viv-tier-name">LAIRS</p>
                <p className="cid-viv-tier-desc">Private Floor 0 environments for authorized researchers and funding partners. Access reflects research purpose, qualifications, experience and authorization.</p>
              </div>
              <div className="cid-viv-tier cid-viv-tier--dark" style={{ "--tier": "#B98CFF" } as CSSProperties}>
                <p className="cid-viv-tier-label">Portal 60</p>
                <p className="cid-viv-tier-name">DARK MATTERS</p>
                <p className="cid-viv-tier-desc">Portal 60 opens into Dark Matters, a restricted environment dedicated to dismantling systematic injustice.</p>
              </div>
            </div>

            {/* Research code reference: the input/analysis codes used across the
                Vivarium's environments. */}
            <div className="cid-viv-codes">
              <table className="cid-viv-codes-table">
                <thead>
                  <tr><th>Code</th><th>Meaning</th><th>Role</th></tr>
                </thead>
                <tbody>
                  <tr><td><span className="cid-viv-code">FE</span></td><td>Formal Evidence</td><td>Verified documentary basis</td></tr>
                  <tr><td><span className="cid-viv-code">PHI</span></td><td>Philosophical Inquiry</td><td>Examines ethics, power and meaning</td></tr>
                  <tr><td><span className="cid-viv-code">FO</span></td><td>Field Observation</td><td>Verified firsthand observation</td></tr>
                  <tr><td><span className="cid-viv-code">FUM</span></td><td>Future Uncertainty Matrix</td><td>Maps intersecting issues</td></tr>
                </tbody>
              </table>
            </div>
          </div>


          {/* Two ways of seeing: the same subject (Greg) through each agent's
              lens, one vertical screen with two settings. */}
          <div className="cid-viv-lens-wrap">
            <h3 className="cid-viv-ecosystem-h">Two Ways of Seeing</h3>
            <GregLensSlider base={base} />
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

      <Underground />

      {/* The join copy and its CTA moved off this page. The band itself stays:
          it carries the indigo-to-portal gradient that closes the cave and
          hands off into the footer, so removing it would leave a hard edge. */}
      <section className="cid-join" aria-hidden="true" />

    </div>
  );
}
