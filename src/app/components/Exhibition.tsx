import { Link } from "react-router-dom";
import { RadioAd } from "./RadioAd";

export function Exhibition({ onSupport }: { onSupport: () => void }) {
  return (
    <>
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← All projects</Link>
          <h1>Nonprofit portals are now open across Canada.</h1>
          <p className="summary">
            Share your mission. Join the exhibition. Engage the public.
          </p>
          <div className="case-meta">
            <span className="chip">Interactive programming</span>
            <span className="chip">Cross-sector collaboration</span>
            <span className="chip teal">In collaboration with Charity Village</span>
          </div>
        </div>
      </section>

      <div className="case-body">
        <h2>A shared public space for Canada's nonprofits</h2>
        <p>
          The Canadian Interactive Exhibition is a national pilot that
          invites nonprofits across Canada to bring forward real challenges
          and work with digital artists to shape them into interactive
          public experiences. The exhibition is free, browser-based, and
          designed to help organizations strengthen visibility, public
          engagement, and cross-sector connection.
        </p>
      </div>

      <section className="exhibit-support">
        <div className="container">
          <p className="tiers-label">Support the exhibition</p>
          <p className="tier-note">
            Crowdfunding supports the build and launch of the exhibition,
            artist collaboration, and a virtual tip jar that allows
            participating nonprofits to receive donations while keeping the
            experience free for the public.
          </p>

          <div className="support-tiers">
            <button type="button" onClick={onSupport} className="tier t1">
              <div className="tier-name">Supporter</div>
              <div className="tier-amt">$25+</div>
              <div className="tier-desc">Name on the contributor wall</div>
            </button>
            <button type="button" onClick={onSupport} className="tier t2">
              <div className="tier-name">Builder</div>
              <div className="tier-amt">$100+</div>
              <div className="tier-desc">Featured on the exhibition landing</div>
            </button>
            <button type="button" onClick={onSupport} className="tier t3">
              <div className="tier-name">Patron</div>
              <div className="tier-amt">$250+</div>
              <div className="tier-desc">Name embedded in the exhibition</div>
            </button>
            <button type="button" onClick={onSupport} className="tier t4">
              <div className="tier-name">Founding Partner</div>
              <div className="tier-amt">$500+</div>
              <div className="tier-desc">Custom portal in the virtual gallery</div>
            </button>
          </div>

          <button onClick={onSupport} className="btn btn-primary exhibit-cta">
            Share your mission, join the exhibition →
          </button>
        </div>
      </section>

      <div className="case-body">
        <h2>What the exhibition includes</h2>
        <div className="outcome-grid">
          <div className="outcome-item">
            <strong>Nonprofit and artist collaborations</strong> from across Canada
          </div>
          <div className="outcome-item">
            <strong>Public canvas</strong> for interactive experiences
          </div>
          <div className="outcome-item">
            <strong>One-month online space</strong> open to everyone
          </div>
          <div className="outcome-item">
            <strong>Participatory engagement</strong> with nonprofit missions
          </div>
        </div>
      </div>

      <RadioAd />
    </>
  );
}
