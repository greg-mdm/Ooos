import { Link } from "react-router-dom";

export function CID({ onSupport }: { onSupport: () => void }) {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="cid-scope">
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← All projects</Link>
          <h1>Canadian Innovation Dimension.</h1>
          <p className="summary">
            A research dimension tracking sovereign innovation across Canada
            and allied jurisdictions. Public sources only. The Canadian
            Innovation Watchlist is the first tool inside this dimension.
          </p>
          <div className="case-meta">
            <span className="chip">Research dimension</span>
            <span className="chip">Public sources only</span>
            <span className="chip">CSS scope: cid-scope</span>
          </div>
        </div>
      </section>

      <div className="case-body cid-body-wide">
        <div className="cid-split">
          <div className="cid-watchlist-card">
            <h2 className="cid-watchlist-title"><strong>INNOVATION WATCHLIST</strong></h2>
            <p>
              A curated, signal-scored watchlist covering Space, AI, Defence,
              Energy, Maritime, and Quantum across Canada, the EU, the Nordic
              countries, and the Indo-Pacific. Each card carries a HOLD, SHIFT,
              or BREAK classification and a 1-to-5 signal strength represented
              by tulips (a nod to Ostara, the spring equinox).
            </p>
            <p>
              The watchlist is filterable by region, segment, status, and sector
              type. Organisations are tagged as Public Stock, Public Org,
              Non-Profit, or Private. Policy triggers are listed under each
              watch theme.
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
                href="https://kahoot.it/challenge/09193020"
                className="btn btn-kahoot"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vote on Kahoot →
              </a>
            </p>
          </div>

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
              href="https://kahoot.it/challenge/09193020"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vote on Kahoot →
            </a>
            <div className="vote-meta">
              EXPIRES 2026-06-30
            </div>
          </aside>
        </div>
      </div>

      <section className="cid-watchlist-embed">
        <iframe
          src={`${base}cid/watchlist-embed/`}
          title="Canadian Innovation Watchlist"
          loading="lazy"
          className="cid-watchlist-frame"
        />
      </section>

      <div className="case-body">
        <h2>What lives inside the dimension</h2>
        <ul>
          <li><strong>Watchlist</strong> live now. Filterable, signal-scored, public-source-only.</li>
          <li><strong>City spotlights</strong> Ottawa, Halifax, Toronto, Montreal, and others. Anchored to specific watch themes.</li>
          <li><strong>Policy triggers</strong> Each card maps to named procurement, sovereignty, or alliance triggers.</li>
          <li><strong>Source cards</strong> Authorship and AI-disclosure documentation per artifact.</li>
        </ul>

        <h2>Posture</h2>
        <p>
          ABSTAIN is recorded as a legitimate response. Nothing on this page
          is financial advice. All assertions are anchored to a named source.
        </p>
      </div>
    </div>
  );
}
