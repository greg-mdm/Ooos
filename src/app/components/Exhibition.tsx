import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { RadioAd } from "./RadioAd";

export function Exhibition({ onSupport }: { onSupport: () => void }) {
  return (
    <div className="exhibit-scope">
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← All projects</Link>
          <div className="case-hero-meta-row case-hero-meta-row--inline">
            <p className="case-hero-slogan">Share your mission. Join the exhibition!</p>
            <div className="case-meta case-meta--inline">
              <span className="chip">Active Public Participation</span>
              <span className="chip">Cross-sector collaboration</span>
            </div>
          </div>
        </div>
      </section>
      <section className="exhibit-event-banner" aria-label="Canadian Interactive Exhibition">
        <div className="container">
          <h1 className="exhibit-event-banner__title">Canadian Interactive Exhibition</h1>
        </div>
      </section>

      <section className="exhibit-intro-section">
      <div className="exhibit-intro-row">
        <div className="exhibit-intro-text">
          <h2 className="exhibit-intro-h2 exhibit-intro-h2--centered">
            A Shared Public Space for Canada&rsquo;s Nonprofits
            <span className="exhibit-intro-pill">National Pilot</span>
          </h2>
          <p>
            The Canadian Interactive Exhibition promises public access to an
            innovative virtual environment. Nonprofit organizations and
            avant-garde artists are teaming up to turn real-world challenges
            into interactive experiences that can change minds and open hearts.
          </p>
          <h3 className="exhibit-match-heading">
            Your mission deserves to be experienced!
          </h3>
          <p>
            Ooo Digital Media Studio connects nonprofits with interactive
            artists who share common values and goals, guiding each team to
            harmonize complementary creative and technical skills.
          </p>
          <h3 className="exhibit-match-lead">
            Transform your cause into an interactive experience
          </h3>
          <ul className="exhibit-match-bullets">
            <li>User-friendly platform architecture</li>
            <li>Donation station for every cause</li>
            <li>Tip trays tagged to artists</li>
            <li>Plug-ins, embed tools, and gateway nodes</li>
          </ul>
          <div className="exhibit-match-image-wrap">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/matchmaking.png`}
              alt="Artist and nonprofit matchmaking — people connected through a central hub"
              className="exhibit-match-image"
              loading="lazy"
            />
          </div>
          <div className="exhibit-match-table">
            <div className="exhibit-match-box">
              <h4 className="exhibit-match-box__title">Advantages for YOU</h4>
              <ul className="exhibit-match-bullets exhibit-match-bullets--after">
                <li>Personalized guidance</li>
                <li>Customized solutions</li>
                <li>Co-create reusable assets</li>
              </ul>
            </div>
            <div className="exhibit-match-box">
              <h4 className="exhibit-match-box__title">Benefits for EVERYONE</h4>
              <ul className="exhibit-match-bullets exhibit-match-bullets--after">
                <li>Strategic alignment</li>
                <li>Powerful partnerships</li>
                <li>Lead Canadian innovation together</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="exhibit-intro-anim exhibit-programs">
          <h2 className="exhibit-programs-heading exhibit-intro-h2--centered">
            Interactive Programming
            <span className="exhibit-maple" aria-hidden="true">🍁</span>
          </h2>

          <ProgramItem title="National Gallery" tag="Digital Art Influencers" tone="ruby">
            <ul className="exhibit-program-list">
              <li>Explore experimental digital artwork from Canadian creators.</li>
            </ul>
          </ProgramItem>

          <ProgramItem title="Idea Accelerator" tag="Shoot a beam" tone="indigo" pillTone="gold">
            <p>
              Energize your thought beam by sharing an observation. Spinning at
              the speed of light, different perspectives pull together as
              opposing ideas attract. When a conflicting insight collides with a
              cluster, the impact ignites a constellation of vibrant new
              connections.
            </p>
          </ProgramItem>

          <ProgramItem title="Thought Garden" tag="Plant a seed" tone="indigo" pillTone="teal">
            <div className="exhibit-haiku">
              <p className="exhibit-haiku__line">Underground roots meet,</p>
              <p className="exhibit-haiku__line">Trees trade gifts beneath the soil,</p>
              <p className="exhibit-haiku__line">We grow together.</p>
              <p className="exhibit-haiku__author">GTL 6/2026</p>
            </div>
          </ProgramItem>

          <ProgramItem title="Serious Games Showcase" tag="Play with purpose" tone="ruby">
            <p>
              Bias Busting POVs invite visitors into interactive stories that
              confront hard realities, challenge assumptions, shift perspectives,
              and strengthen public education.
            </p>
          </ProgramItem>

          <ProgramItem title="Sassy Games Spotlight" tag="Play proud" tone="ruby" pillTone="portal">
            <p>
              Join us as we welcome community leaders, proud players, allies,
              anonymous avatars, and anyone seeking a safe space for supportive
              conversations about gender and sexuality.
            </p>
          </ProgramItem>

          <ProgramItem title="The Most Radical Jester" tag="Truth to power" tone="ruby">
            <p>
              Speak truth to power, make light of a painful reality, or flip
              the script in your own twisted way.
            </p>
          </ProgramItem>

          <ProgramItem title="Queen of the Night" tag="Your radiant reign" tone="ruby">
            <p>
              Experience emotional liberation for one night only. Elusive,
              elegant, and intense. Do not excuse your beauty. Flaunt
              forbidden feelings.
            </p>
          </ProgramItem>

          <ProgramItem title="Gateway Portals" tag="Enter here" tone="indigo">
            <p>Enter artist-created worlds</p>
          </ProgramItem>
        </div>
      </div>
      </section>

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
  tone = "ruby",
  pillTone,
  children,
}: {
  title: string;
  tag?: string;
  tone?: "ruby" | "indigo";
  pillTone?: "ruby" | "indigo" | "gold" | "teal" | "portal";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const detailId = `exhibit-program-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const pillClass = pillTone ? ` exhibit-program-tag--${pillTone}` : "";
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
          {tag && <span className={`exhibit-program-tag${pillClass}`}>{tag}</span>}
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
