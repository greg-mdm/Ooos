import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { RadioAd } from "./RadioAd";

export function Exhibition({ onSupport }: { onSupport: () => void }) {
  return (
    <div className="exhibit-scope">
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
          </div>
        </div>
      </section>

      <div className="exhibit-intro-row">
        <div className="exhibit-intro-text">
          <h2>
            A Shared Public Space for Canada&rsquo;s Nonprofits
            <span className="exhibit-intro-pill">National Pilot</span>
          </h2>
          <p>
            The Canadian Interactive Exhibition promises public access to an
            innovative virtual environment. Nonprofit organizations and
            avant-garde artists are teaming up to turn real-world challenges
            into interactive experiences that can change minds and open hearts.
          </p>
          <p>
            Your mission deserves to be experienced! Nonprofits, artists, and
            community leaders are invited to help shape the exhibition&rsquo;s
            design and development.
          </p>
          <div className="exhibit-match-image-wrap">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/matchmaking.png`}
              alt="Artist and nonprofit matchmaking — people connected through a central hub"
              className="exhibit-match-image"
              loading="lazy"
            />
            <p className="exhibit-match-caption">
              Match with an artist to transform your cause into an interactive experience.
            </p>
          </div>
        </div>

        <div className="exhibit-intro-anim exhibit-programs">
          <p className="exhibit-programs-eyebrow">Interactive Programming</p>

          <ProgramItem title="National Gallery" tag="Digital Art Influencers" tone="indigo">
            <ul className="exhibit-program-list">
              <li>Explore experimental digital artwork from Canadian creators.</li>
            </ul>
          </ProgramItem>

          <ProgramItem title="Idea Accelerator" tag="Shoot a beam" tone="ruby">
            <p>
              Energize a beam of light by sharing an observation or idea.
              Spinning at the speed of light, similar ideas attract, and rare
              collisions create brilliant new connections.
            </p>
          </ProgramItem>

          <ProgramItem title="Thought Garden" tag="Plant a thought" tone="portal">
            <p>
              See what connects; discover deep roots through quiet
              contemplation.
            </p>
          </ProgramItem>

          <ProgramItem title="Serious Games Showcase" tag="Play with purpose" tone="indigo">
            <p>
              Bias Busting POVs invite visitors into interactive stories that
              confront hard realities, challenge assumptions, shift perspectives,
              and strengthen public education.
            </p>
          </ProgramItem>

          <ProgramItem title="Sassy Games Spotlight" tag="Play proud" tone="ruby">
            <p>
              Celebrate queer joy, experience Canadian camp, and witness radical
              resistance.
            </p>
          </ProgramItem>

          <ProgramItem title="The Most Radical Jester" tag="Speak truth" tone="ruby">
            <p>
              Speak truth to power, make light of a painful reality, or flip
              the script in your own twisted way.
            </p>
          </ProgramItem>

          <ProgramItem title="Radiant Queen of the Night" tag="Reign for a night" tone="portal">
            <p>
              Experience emotional liberation for one night only. Elusive,
              elegant, and intense. Do not excuse your beauty. Flaunt
              forbidden feelings you&rsquo;ve kept inside all year.
            </p>
          </ProgramItem>

          <ProgramItem title="Gateway Portals" tag="Enter here" tone="indigo">
            <p>Enter artist-created worlds</p>
          </ProgramItem>
        </div>
      </div>

      <section className="exhibit-support">
        <div className="container">
          <div className="exhibit-support-inner">
            <div className="exhibit-support-content">
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
                Join our mission! Support the exhibition <span className="exhibit-cta-arrow">➠</span>
              </button>
            </div>

            <div className="exhibit-support-image">
              <img
                src={`${import.meta.env.BASE_URL}assets/images/donor-wall-square.png`}
                alt="Exhibition contributor wall — your name displayed here"
                className="exhibit-donor-wall"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="case-body exhibit-includes-section">
        <p className="exhibit-includes-eyebrow">What the Exhibition Includes</p>
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
    </div>
  );
}

function ProgramItem({
  title,
  tag,
  tone = "indigo",
  children,
}: {
  title: string;
  tag?: string;
  tone?: "ruby" | "indigo" | "portal";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const detailId = `exhibit-program-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={`exhibit-program exhibit-program--${tone} ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="exhibit-program-toggle"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="exhibit-program-name">
          {title}
          {tag && (
            <span className="exhibit-program-tag">
              <span aria-hidden="true" className="exhibit-program-tag-bracket">[</span>
              {tag}
              <span aria-hidden="true" className="exhibit-program-tag-bracket">]</span>
            </span>
          )}
        </span>
        <span aria-hidden="true" className="exhibit-program-arrow">
          {open ? "\u2212" : "+"}
        </span>
      </button>
      <div id={detailId} className="exhibit-program-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
