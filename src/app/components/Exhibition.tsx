import { Link } from "react-router-dom";
import { RadioAd } from "./RadioAd";

export function Exhibition({ onSupport }: { onSupport: () => void }) {
  return (
    <>
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← All projects</Link>
          <h1>Canadian Interactive Exhibition.</h1>
          <p className="summary">
            Nonprofit portals are now open across Canada. A public canvas for
            interactive engagement that lets organizations share their
            mission, collaborate across sectors, and meet audiences where
            attention already lives.
          </p>
          <div className="case-meta">
            <span className="chip">Exhibition</span>
            <span className="chip teal">In partnership with Charity Village</span>
            <span className="chip">Public canvas</span>
          </div>
        </div>
      </section>

      <div className="case-body">
        <h2>The premise</h2>
        <p>
          Most nonprofit visibility is locked inside annual galas and
          newsletter lists. The Canadian Interactive Exhibition reframes
          public engagement as an open portal: a curated, always-on canvas
          where organizations contribute interactive programming and
          audiences participate in real time.
        </p>

        <div className="pull">
          Share your mission. Join the exhibition. Engage the public.
        </div>

        <h2>Three pillars</h2>
        <h3>Interactive programming</h3>
        <p>
          Each portal carries a live program. Kahoot inputs, signal cards,
          and audience-vote artifacts replace static slide decks. The
          programming is the deliverable.
        </p>
        <h3>Cross-sector collaboration</h3>
        <p>
          Nonprofits, civic groups, and creative studios build shared
          portals. Mission alignment surfaces as overlap in the public
          canvas, not as a press-release deal.
        </p>
        <h3>Public canvas for interactive engagement</h3>
        <p>
          The exhibition itself runs as a single, navigable surface, open to
          drop-in audiences, leave-behind for facilitators, archived for
          research and accountability.
        </p>

        <h2>How a portal opens</h2>
        <ul>
          <li>An organization shares its mission and a short interactive prompt.</li>
          <li>The portal goes live on the exhibition canvas. Audience inputs are anonymous.</li>
          <li>Engagement is reported in aggregate. ABSTAIN is recorded as a legitimate outcome.</li>
          <li>The artifact is preserved as a public, citable record.</li>
        </ul>

        <h2>Support a portal</h2>
        <p>
          Portals open on a rolling basis. Indicative tiers below. No
          payments are processed yet, this gauges willingness-to-engage.
        </p>
        <button onClick={onSupport} className="btn btn-primary" style={{ marginTop: 8 }}>
          Open a portal →
        </button>
      </div>

      <RadioAd />
    </>
  );
}
