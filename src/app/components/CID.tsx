import { Link } from "react-router-dom";

export function CID({ onSupport }: { onSupport: () => void }) {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="cid-scope">
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← All projects</Link>
          <h1>Canadian Innovation Dimension</h1>
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
            <p className="summary">
              Ostara empowers innovators, researchers, entrepreneurs, and curious minds to collaboratively explore diverse sectors, policy trends, and market dynamics. It analyzes real-world signals, enables experimentation, and offers a platform for comparing verified information and assessing competing interpretations. <strong>Ostara and the experimental Canadian Innovation Dimension (CID) do not provide future predictions or financial advice.</strong>
            </p>
          </div>
          <div className="case-meta">
            <span className="chip">Research dimension</span>
            <span className="chip">MNPI excluded</span>
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
              and the Indo-Pacific.
            </p>
            <p>Each signal card includes:</p>
            <ul className="cid-watchlist-list">
              <li>HOLD, SHIFT, or BREAK classifications</li>
              <li>a 1–5 tulip score showing signal strength, alignment, and momentum</li>
              <li>linked organizations categorized as Public Stock, Public Org, Non-Profit, or Private</li>
              <li>policy triggers connected to procurement, regulation, sovereignty, investment, and published strategic priorities</li>
            </ul>
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
              By bringing these often-disconnected systems into one interactive
              environment, participants can explore patterns, compare
              relationships, and discover emerging opportunities for
              collaboration, B2B cooperation, and strategic alignment across
              industries, markets, policy, research, and institutional systems.
            </p>
          </div>
          </div>
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

    </div>
  );
}
