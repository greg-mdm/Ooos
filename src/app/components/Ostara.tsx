import { Link } from "react-router-dom";

// Public/unlisted Kahoot identifier. Swap when the final game is published
// from greg@ooos.ca (admin). Embed URL pattern: https://embed.kahoot.it/<ID>.
const KAHOOT_ID = "REPLACE_WITH_KAHOOT_ID";
const KAHOOT_EMBED = `https://embed.kahoot.it/${KAHOOT_ID}`;
const KAHOOT_PLAY = `https://kahoot.it/challenge/${KAHOOT_ID}`;

export function Ostara({ onSupport }: { onSupport: () => void }) {
  const kahootReady = KAHOOT_ID !== "REPLACE_WITH_KAHOOT_ID";
  return (
    <div className="ostara-scope">
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← All projects</Link>
          <h1>Ostara. A decision-support environment for reasoning under uncertainty.</h1>
          <p className="summary">
            A locally hosted, AI-assisted, integrated system that uses a
            workshop interface, a signal pipeline, and a role-separated agent
            architecture to make probabilistic reasoning visible,
            participatory, and interpretable.
          </p>
          <div className="case-meta">
            <span className="chip">DG8010 · TMU MDM</span>
            <span className="chip teal">Spring 2026</span>
            <span className="chip">Public data only</span>
          </div>
        </div>
      </section>

      <div className="case-body">
        <h2>What it is</h2>
        <p>
          Ostara is the culmination of an applied-research course on AI for
          experiential design. It integrates four layers: a workshop interface,
          a Python signal stack, a Polymarket integration, and an agent role
          separation that enforces privacy and ethics in code rather than in
          policy.
        </p>

        <div className="pull">
          The role with raw data has no execution authority. The role with
          execution authority has no raw data.
        </div>

        <h2>Evidence from the field</h2>
        <p>
          Live delivery, April 6, 2026, two graduate sessions at TMU.
        </p>
        <div className="evidence-bar">
          <div className="row">
            <span className="label">Session 1</span>
            <span className="bar" style={{ width: "100%" }} />
            <span className="num">84</span>
          </div>
          <div className="row">
            <span className="label">Session 2</span>
            <span className="bar" style={{ width: "50%" }} />
            <span className="num">42</span>
          </div>
          <div className="evidence-summary">
            <strong>32 participants · 126 structured inputs · 3.9× class
            average.</strong> The Kahoot input layer mitigated production
            blocking and shared-information bias. ABSTAIN was used as a
            recognised outcome rather than absorbed into silence.
          </div>
        </div>

        <h2>Kahoot as the participatory layer</h2>
        <p>
          Ostara's complexity, probabilistic signals, abstention as a valid
          position, role-separated agents, only works if the room can input in
          parallel without one voice dominating. Kahoot is the instrument that
          makes that possible. It collapses the gap between facilitator and
          participant, and turns a workshop into a collective-intelligence
          system where every disposition is captured, timestamped, and visible.
        </p>
        <p>
          Try the live game below. Same questions used in the TMU sessions,
          same five-step inquiry arc. Word-cloud and open-input rounds are
          being added on the Kahoot 365 Gold tier so future workshops collect
          qualitative insight alongside the multiple-choice signal reads.
        </p>
        <div className="kahoot-embed">
          {kahootReady ? (
            <iframe
              src={KAHOOT_EMBED}
              title="Ostara workshop Kahoot"
              width="100%"
              height="480"
              loading="lazy"
              allow="fullscreen"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="kahoot-placeholder">
              <strong>Kahoot embed pending.</strong>
              <span>
                Game is being finalised under the greg@ooos.ca admin account.
                Public link drops in here once the Gold upgrade and word-cloud
                rounds are live.
              </span>
            </div>
          )}
          <div className="kahoot-actions">
            <a
              className="btn btn-secondary"
              href={kahootReady ? KAHOOT_PLAY : "https://kahoot.it"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Play in a new tab →
            </a>
            <span className="kahoot-meta">
              Admin: greg@ooos.ca · Tier: Kahoot 365 Gold (workshop edition)
            </span>
          </div>
        </div>

        <h2>The four layers</h2>
        <h3>Workshop layer</h3>
        <p>
          Single HTML file, hosted locally, runs offline. Macro snapshot,
          signal stack with confidence-scored dispositions, Kahoot handoff,
          ABSTAIN-as-first-class-position model. Self-contained, deployable
          as a leave-behind for schools, facilitators, and clients.
        </p>
        <h3>Signal layer</h3>
        <p>
          Python pipeline. Public-source-only signal collection with
          triangulation across independent sources. Confidence scores 1 to 5.
          Each signal carries source, rationale, and a HOLD / SHIFT / BREAK /
          SANDBOX / AVOID disposition. No recommendations.
        </p>
        <h3>Market layer</h3>
        <p>
          Polymarket API integration (Gamma + CLOB). Live prediction-market
          data feeds the SANDBOX signal class. Used to demonstrate
          probabilistic reasoning under real-world uncertainty.
        </p>
        <h3>Agent layer (privacy-by-design backbone)</h3>
        <p>
          Two roles, separated in code. <em>Ethical Analyst</em> receives user
          intent, evaluates against ethical and research constraints, routes
          structured tasks downstream. <em>Executive Trader</em> executes
          structured tasks with no access to raw user data, no direct
          user-facing surface.
        </p>

        <h2>Source card</h2>
        <p>
          Authored by Greg Long. Workshop concept, five-step inquiry arc,
          signal selection, academic framing, facilitation script, the
          ABSTAIN-as-UN-model decision, the agent role separation, and all
          final submission text. AI assistance under author direction for
          first-pass interface code, signal-card visual treatments, and copy
          refinement passes. Public data only. No private, embargoed, or
          non-public information.
        </p>
        <p>
          Frameworks cited: Weisz et al. (2024), Gray, Brown, and Macanufo
          (2010), Kahneman (2011), Paulus and Nijstad (2003), Sanders and
          Stappers (2008), Shneiderman (2020), Cavoukian (2009).
        </p>

        <h2>Support the next iteration</h2>
        <p>
          The next milestone is packaging Ostara as a true leave-behind: a
          single folder with the HTML file, a facilitator one-pager, a Kahoot
          template, and a 90-second walkthrough video.
        </p>
        <button onClick={onSupport} className="btn btn-primary" style={{ marginTop: 8 }}>
          Express interest →
        </button>
      </div>
    </div>
  );
}
