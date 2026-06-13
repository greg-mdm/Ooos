import { Link } from "react-router-dom";

export function CID({ onSupport }: { onSupport: () => void }) {
  const base = import.meta.env.BASE_URL;
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

      <section className="cid-nonprofit">
        <p className="cid-np-eyebrow">Canadian Commerce. Global Engagement.</p>
        <h2 className="cid-np-heading">International Non-Profit Network</h2>
        <p className="cid-np-intro">
          Canadian Chambers of Commerce abroad &mdash; non-profit organizations
          advancing Canada&rsquo;s internationalization, using digital
          infrastructure to collaborate, innovate, and build a purpose-driven,
          inclusive economy.
        </p>
        <div className="cid-np-grid">
          {[
            ["Vietnam", "CanCham Vietnam"],
            ["Hong Kong", "CanCham Hong Kong"],
            ["Singapore", "CanCham Singapore"],
            ["Sweden", "Swedish Canadian Chamber of Commerce"],
            ["Slovenia", "Canadian Slovenian Chamber of Commerce"],
            ["Southern Africa", "Southern Africa\u2013Canada Chamber of Commerce"],
            ["Pan-Africa", "Canada\u2013Africa Chamber of Business"],
            ["Ghana", "Canada Ghana Chamber of Commerce"],
            ["Egypt", "CanCham Egypt"],
            ["Australia", "Canadian Australian Chamber of Commerce"],
            ["Mexico", "CanCham Mexico"],
            ["Shanghai", "CanCham Shanghai"],
            ["Beijing", "Canada China Business Council"],
          ].map(([country, chamber]) => (
            <div className="cid-np-item" key={country}>
              <span className="country">{country}</span>
              <span className="chamber">{chamber}</span>
            </div>
          ))}
        </div>
        <div className="cid-np-foot">
          <span className="cid-np-brand">Radical Strategic Intelligence</span>
          <span className="cid-np-tag">Embrace the struggle</span>
          <span className="cid-np-tag">Drive joy</span>
          <Link className="cid-np-link" to="/exhibition">Explore the full network &rarr;</Link>
        </div>
      </section>

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
