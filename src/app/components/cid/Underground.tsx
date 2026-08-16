import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { SC } from "./statcan-links";

/**
 * The cave — the "underground" layer of the public record.
 *
 * Transplanted off /cid with the rest of the watchlist block: on /cid the cave
 * section is left in place as an empty shell (its padding and cave art collapse
 * to a slim band), and the full structure lives here as the page floor of
 * /cid/iwatchlist, sitting flush above the site footer.
 *
 * Styles come from cid-continuum.css (section, header, link rail) and
 * cid-coins.css (the ESG coin grid and modal); IWatchlist imports both.
 */
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

export function Underground() {
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
