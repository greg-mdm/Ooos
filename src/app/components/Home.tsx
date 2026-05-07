import { Link } from "react-router-dom";

export function Home({ onSupport }: { onSupport: () => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-eyebrow">Ooo Digital Media Studio</div>
        <h1>
          Decision-support and participatory design,<br />
          <em>made visible.</em>
        </h1>
        <p className="lead">
          A portfolio of locally hosted, AI-assisted systems for reasoning
          under uncertainty. Public sources only. Disclosure on every artifact.
          ABSTAIN treated as a first-class outcome.
        </p>
        <div className="hero-cta">
          <Link to="/ostara" className="btn btn-ostara">Ostara: Collective Intelligence System</Link>
          <Link to="/exhibition" className="btn btn-exhibition">Canadian Interactive Exhibition</Link>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-header">
          <div className="section-eyebrow">★ Featured Assets</div>
          <h2>Two systems, one design language.</h2>
          <p className="lead">
            Both projects use the same backbone: structured signals, agent role
            separation, persistent disclosure, and audience input as evidence.
          </p>
        </div>

        <div className="featured">
          <Link to="/ostara" className="feature-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-thumb ostara ostara-brand">
              <span className="feature-thumb-label">Project 01</span>
              <div className="ostara-brand-stack">
                <div className="ostara-brand-name">OSTARA</div>
                <div className="ostara-brand-divider" aria-hidden="true" />
                <div className="ostara-brand-tagline">Collective Intelligence System</div>
                <div className="ostara-brand-descriptors">
                  <span className="ostara-descriptor">Aggregates signals</span>
                  <span className="ostara-descriptor">Routes intent</span>
                  <span className="ostara-descriptor">Orchestrates agents</span>
                  <span className="ostara-descriptor">Channels strategic foresight</span>
                </div>
              </div>
            </div>
            <div className="feature-body">
              <p>
                A locally hosted, AI-assisted decision-support environment for
                reasoning under uncertainty. Workshop interface, Python signal
                pipeline, agent-role-separated architecture.
              </p>
              <div className="feature-meta">
                <span className="chip">DG8010</span>
                <span className="chip teal">Research</span>
                <span className="chip">Privacy by design</span>
              </div>
              <span className="feature-link">Open case study →</span>
            </div>
          </Link>

          <Link to="/exhibition" className="feature-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-thumb exhibition">
              <span className="feature-thumb-label">Project 02</span>
              <div className="feature-thumb-title">Canadian Interactive Exhibition</div>
            </div>
            <div className="feature-body">
              <p>
                A nationwide nonprofit-portal exhibition. Public canvas for
                interactive engagement, in partnership with Charity Village.
                Cross-sector collaboration over interactive programming.
              </p>
              <div className="feature-meta">
                <span className="chip">Exhibition</span>
                <span className="chip teal">Nonprofit</span>
                <span className="chip">Public canvas</span>
              </div>
              <span className="feature-link">Open case study →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section vote-feature">
        <div className="section-header">
          <div className="section-eyebrow">★ Invited innovators · live vote</div>
          <h2>One signal. Three positions. Audience as evidence.</h2>
          <p className="lead">
            A preview of the participatory layer used in workshops and shared
            with the 200 invited innovators. ABSTAIN sits beside YES and NO as
            a recognised outcome, not a fallback.
          </p>
        </div>
        <div className="vote-stage">
          <div className="vote-source-label">
            POLYMARKET · <span className="vote-volume">$8.4M LIVE VOLUME</span> · EXPIRES 2026-06-30
          </div>
          <div className="vote-question-text">
            Will the US and Iran reach<br />a nuclear deal by June 30?
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
            Ground forces deploying · SOF + Marines confirmed · OSTARA signal: HOLD · Environment is Risk-Off
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="section-header">
          <div className="section-eyebrow">What we build</div>
          <h2>Products and services.</h2>
        </div>
        <div className="dual">
          <div className="pane">
            <h3>Products</h3>
            <p>Self-contained artifacts. Open them cold, run without us in the room.</p>
            <ul>
              <li>Workshop kit: HTML interface + facilitator notes + Kahoot template</li>
              <li>Signal stack: Python pipeline, public-source-only triangulation</li>
              <li>Disclosure templates: persistent banners and ABSTAIN-as-position copy</li>
              <li>Agent role separation reference architecture</li>
            </ul>
          </div>
          <div className="pane">
            <h3>Services</h3>
            <p>Studio engagements where the deliverable is a working artifact, not a deck.</p>
            <ul>
              <li>Workshop facilitation for graduate seminars and executive education</li>
              <li>Custom signal pipelines for civic deliberation and research teams</li>
              <li>Privacy-by-design audits of existing AI systems</li>
              <li>Source Card authorship and AI-disclosure documentation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section support">
        <div className="section-header">
          <div className="section-eyebrow" style={{ color: "var(--teal)" }}>Express interest</div>
          <h2>Support the next portal.</h2>
          <p className="lead">
            We are testing willingness-to-engage, not running a fundraising
            campaign. Pick an indicative amount or join the token waitlist.
          </p>
        </div>
        <div className="support-tiers">
          <Tier name="Spark" amt="$10" desc="Keeps the lights on for one workshop kit download." cls="t1" onSupport={onSupport} />
          <Tier name="Signal" amt="$25" desc="Funds one signal-card research cycle." cls="t2" onSupport={onSupport} />
          <Tier name="Studio" amt="$50" desc="Sponsors a facilitator one-pager and walkthrough video." cls="t3" onSupport={onSupport} />
          <Tier name="Patron" amt="$100+" desc="Supports a full session of a workshop with a non-academic audience." cls="t4" onSupport={onSupport} />
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={onSupport} className="btn btn-primary">Open support form</button>
        </div>
        <p className="support-disclosure">
          No payments are processed yet. Stripe (CAD) and Bitcoin integrations
          are coming. The Ooo token is in concept stage only. No token has
          been issued. Nothing here is a solicitation or financial advice.
        </p>
      </section>
    </>
  );
}

function Tier({
  name, amt, desc, cls, onSupport,
}: { name: string; amt: string; desc: string; cls: string; onSupport: () => void }) {
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSupport();
    }
  };
  return (
    <div
      className={`tier ${cls}`}
      onClick={onSupport}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-label={`Support tier ${name}, ${amt}. ${desc}`}
    >
      <div className="tier-name">{name}</div>
      <div className="tier-amt">{amt}</div>
      <div className="tier-desc">{desc}</div>
    </div>
  );
}
