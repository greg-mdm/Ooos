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

      <div className="case-body">
        <h2>The Canadian Innovation Watchlist</h2>
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
          <button onClick={onSupport} className="btn btn-ghost" type="button">
            Support a watch theme
          </button>
        </p>

        <h2>Inline preview</h2>
        <div
          style={{
            border: "1px solid var(--border-soft)",
            borderRadius: 10,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <iframe
            src={`${base}cid/watchlist/`}
            title="Canadian Innovation Watchlist preview"
            loading="lazy"
            style={{
              width: "100%",
              height: "70vh",
              border: 0,
              display: "block",
            }}
          />
        </div>

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
