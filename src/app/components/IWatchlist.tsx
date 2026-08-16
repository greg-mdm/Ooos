import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "../../styles/cid-iwatchlist.css";

/**
 * CID Innovation Watchlist — prototype page.
 *
 * Split out of /cid so the detailed watchlist content has a page of its own
 * (internal linking / SEO). The observatory title card that opens this page is
 * the same lockup that still sits on /cid, where it now acts as the doorway in:
 * the entrance and the header match, so the transition reads as one move.
 *
 * Reachable at both /cid/iwatchlist and /iwatchlist.
 */
export function IWatchlist() {
  const base = import.meta.env.BASE_URL;

  // Size the watchlist embed to its content so the page scrolls as one, rather
  // than trapping the scroll inside a nested iframe. Same postMessage contract
  // the CID page uses.
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
    </div>
  );
}

export default IWatchlist;
