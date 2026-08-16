import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "../../styles/cid-iwatchlist.css";
import "../../styles/cid-continuum.css";
import "../../styles/cid-forest.css";
import "../../styles/cid-coins.css";
import { SC } from "./cid/statcan-links";
import { DataAccessContinuum } from "./cid/DataAccessContinuum";
import { LivingWallSlider } from "./cid/LivingWallSlider";
import {
  PopulationSourcesStrip,
  usePopulationModel,
} from "./population/PopulationClockCard";

/**
 * CID Innovation Watchlist — prototype page.
 *
 * Split out of /cid so the detailed watchlist content has a page of its own
 * (internal linking / SEO). The observatory title card that opens this page is
 * the same lockup that still sits on /cid, where it now acts as the doorway in:
 * the entrance and the header match, so the transition reads as one move.
 *
 * Everything from the watchlist embed down to the canopy lives here now. /cid
 * keeps the CID introduction, the Vivarium, the team, the research areas and
 * the cave. The portal band and the Innovation Watchlist flag block are
 * signposts: they appear on both pages, re-placed to read correctly in each.
 *
 * Reachable at both /cid/iwatchlist and /iwatchlist.
 */
export function IWatchlist() {
  const base = import.meta.env.BASE_URL;
  // One StatCan data load shared by the pop clock cards, the medallion and the
  // sources strip. Read-only, with its own 24h cache, so calling it here rather
  // than on /cid costs nothing.
  const populationModel = usePopulationModel();

  // Size the watchlist embed to its content so the page scrolls as one, rather
  // than trapping the scroll inside a nested iframe. Same postMessage contract
  // the CID page used.
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
    <div className="cid-scope iw-page">
      <section className="iw-hero" aria-label="Canadian Innovation Dimension: Live Data Observatory">
        <div className="iw-hero-inner">
          <p className="iw-back">
            <Link to="/cid">← Canadian Innovation Dimension</Link>
          </p>

          {/* The same two-block lockup that opens this page from /cid. */}
          <div className="iw-banner">
            <div className="iw-card">
              <div className="iw-block">
                <h1 className="iw-bigtitle">Canadian Innovation Dimension</h1>
                <div className="iw-subrow">
                  <img
                    className="iw-block-icon"
                    src={`${base}assets/images/brand/LEAF-transp.png`}
                    alt=""
                    aria-hidden="true"
                  />
                  <div className="iw-sub">Zoom in · Ontario Data</div>
                </div>
              </div>
              <div className="iw-block">
                <h2 className="iw-bigtitle">Live Data Observatory</h2>
                <div className="iw-subrow">
                  <img
                    className="iw-block-icon"
                    src={`${base}assets/telescope.png`}
                    alt=""
                    aria-hidden="true"
                  />
                  <div className="iw-sub">Viewing: Ontario<br />[East-central Canada]</div>
                </div>
              </div>
            </div>
            <div className="iw-compass" aria-hidden="true">
              <img
                src={`${base}assets/INNOVATION-IEP.webp`}
                alt="Innovation · Entrepreneurship · Partnership"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Signpost, shared with /cid: the portal band announcing the prototype.
          On /cid it leads into the doorway; here it confirms the arrival. */}
      <section className="cid-portal-band" aria-label="CID prototype announcement">
        <p className="cid-portal-line">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v9" /><path d="M6.4 6.4a8 8 0 1 0 11.2 0" /></svg>
          <span>A PORTAL HAS OPENED: CID releases an electric debut prototype!</span>
        </p>
      </section>

      {/* Signpost, shared with /cid: the Innovation Watchlist title block and
          the red-white-red Canada flag panel, from
          public/Innovation Watchlist.dc.html (full-bleed, self-sizing iframe). */}
      <section className="cid-wl-hero" aria-label="Innovation Watchlist">
        <iframe
          className="cid-wl-frame"
          src={`${base}Innovation%20Watchlist.dc.html?v=9`}
          title="Innovation Watchlist"
          loading="lazy"
        />
      </section>

      {/* The watchlist prototype itself. */}
      <section className="iw-embed" aria-label="Canadian Innovation Watchlist">
        <iframe
          ref={embedRef}
          src={`${base}cid/watchlist-embed/`}
          title="Canadian Innovation Watchlist"
          loading="lazy"
          className="iw-embed-frame"
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
            <LivingWallSlider populationModel={populationModel} />
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
    </div>
  );
}

export default IWatchlist;
