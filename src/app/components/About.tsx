import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function About() {
  const [orbitActive, setOrbitActive] = useState(false);
  const stopTimer = useRef<number | null>(null);

  const wake = () => {
    if (stopTimer.current !== null) {
      window.clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    setOrbitActive(true);
  };
  const rest = () => {
    if (stopTimer.current !== null) window.clearTimeout(stopTimer.current);
    stopTimer.current = window.setTimeout(() => {
      setOrbitActive(false);
      stopTimer.current = null;
    }, 3000);
  };
  useEffect(() => () => {
    if (stopTimer.current !== null) window.clearTimeout(stopTimer.current);
  }, []);

  return (
    <>
      <section className="case-hero">
        <div className="container">
          <Link to="/" className="back">← Home</Link>
          <h1>About Ooos.</h1>
          <p className="summary">
            Ooo Digital Media Studio is the practice of Greg Long, MDM
            candidate at TMU. The work spans decision-support systems,
            participatory design, and the documentation of human authorship
            alongside AI assistance.
          </p>
        </div>
      </section>

      <section className="ds" aria-labelledby="ds-heading">
        <div className="container">
          <div className="ds-intro-grid">
            <div className="ds-intro-text">
              <p className="ds-eyebrow">Design system</p>
              <h2 id="ds-heading">Creative Environments</h2>
              <p className="ds-lede">
                Each project creates space for meaningful engagement within a
                unique creative environment, centrally guided by the studio's
                founder and creative director. Shared systems of spacing,
                contrast, typography, and disclosure are applied consistently
                across all creative environments.
              </p>
              <p className="ds-lede">
                Ooos universe promotes participatory design and inclusive
                access, hosting a range of experiences from observation to
                exploration and engagement.
              </p>

              <div className="commit-text" aria-labelledby="commit-heading">
                <h3 id="commit-heading" className="ds-eyebrow">Principles in motion</h3>
                <dl className="commit-list">
                  <div className="commit-list-row">
                    <dt>Clarity</dt>
                    <dd>where it matters</dd>
                  </div>
                  <div className="commit-list-row">
                    <dt>Curiosity</dt>
                    <dd>that leads to knowledge exchange</dd>
                  </div>
                  <div className="commit-list-row">
                    <dt>Freedom</dt>
                    <dd>to choose your level of participation</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div
              className={`commit-graphic${orbitActive ? " is-active" : ""}`}
              tabIndex={0}
              role="button"
              aria-label="Activate Commitments animation. Hover, tap or focus to start."
              aria-pressed={orbitActive}
              onMouseMove={wake}
              onMouseLeave={rest}
              onPointerDown={(e) => { if (e.pointerType !== "mouse") wake(); }}
              onPointerUp={(e) => { if (e.pointerType !== "mouse") rest(); }}
              onPointerCancel={rest}
              onFocus={wake}
              onBlur={rest}
            >
              <span className="commit-hint" aria-hidden="true">Hover to activate</span>
              <svg
                viewBox="0 0 480 480"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                focusable="false"
              >
                {/* Orbit ring (decorative) */}
                <circle className="commit-ring" cx="240" cy="240" r="180" />

                {/* Orbiting group — paused unless .is-active on parent */}
                <g className="commit-orbit">
                  {/* Top: Parallelogram — Clarity */}
                  <g transform="translate(240,60)">
                    <g className="commit-counter">
                      <polygon
                        className="commit-shape-data"
                        points="-72,-34 72,-34 56,34 -88,34"
                      />
                      <text y="8" textAnchor="middle" className="commit-word">Clarity</text>
                    </g>
                  </g>

                  {/* Bottom-right: Circle — Curiosity */}
                  <g transform="translate(396,318)">
                    <g className="commit-counter">
                      <circle className="commit-shape-connector" r="58" />
                      <text y="8" textAnchor="middle" className="commit-word">Curiosity</text>
                    </g>
                  </g>

                  {/* Bottom-left: Diamond — Freedom */}
                  <g transform="translate(84,318)">
                    <g className="commit-counter">
                      <polygon
                        className="commit-shape-decision"
                        points="0,-66 66,0 0,66 -66,0"
                      />
                      <text y="8" textAnchor="middle" className="commit-word">Freedom</text>
                    </g>
                  </g>
                </g>

                {/* Center: gold Commitments circle (drawn last, sits on top) */}
                <g className="commit-center">
                  <circle cx="240" cy="240" r="92" />
                  <text x="240" y="240" textAnchor="middle" className="commit-center-word">Commitments</text>
                </g>
              </svg>
            </div>
          </div>

          <h3 className="ds-section-title">Guiding Principles</h3>
          <ul className="ds-pillars" aria-label="Guiding principles">
            <li>
              <h4>Design responsibly.</h4>
              <p>Make risk, system limits, and user choice and freedom visible.</p>
            </li>
            <li>
              <h4>Design for diverse mental models.</h4>
              <p>Build for the range of ways people think, perceive, and decide.</p>
            </li>
            <li>
              <h4>Design to earn trust.</h4>
              <p>Transparent disclosures on every artifact, including AI assistance.</p>
            </li>
          </ul>

          <h3 className="ds-section-title">Strategic Priorities</h3>
          <ul className="ds-pillars ds-pillars--quiet" aria-label="Strategic priorities">
            <li>
              <h4>Co-creation.</h4>
              <p>Participation over presentation.</p>
            </li>
            <li>
              <h4>Interactivity.</h4>
              <p>Engagement over spectacle.</p>
            </li>
            <li>
              <h4>Emotion.</h4>
              <p>Empathy over polish.</p>
            </li>
            <li>
              <h4>Behaviour.</h4>
              <p>Engagement that earns its time.</p>
            </li>
          </ul>

          <h3 className="ds-section-title">Projects</h3>
          <div className="ds-quadrant" role="list" aria-label="Projects">
            <article className="ds-surface ds-surface--ooo" role="listitem">
              <p className="ds-surface-eyebrow">Studio</p>
              <h4>Ooo Digital Media Studio</h4>
              <p className="ds-surface-note">Teal and indigo spectrum. The studio environment for participatory design, digital development, and interactive systems.</p>
              <ul className="ds-swatches" aria-label="Ooo palette">
                <li><span className="ds-sw" style={{ background: "#19007D" }} aria-hidden="true" /><code>#19007D</code><span>Dark Indigo</span></li>
                <li><span className="ds-sw" style={{ background: "#312583" }} aria-hidden="true" /><code>#312583</code><span>Resolution</span></li>
                <li><span className="ds-sw" style={{ background: "#5B04DE" }} aria-hidden="true" /><code>#5B04DE</code><span>Electric</span></li>
                <li><span className="ds-sw" style={{ background: "#008080" }} aria-hidden="true" /><code>#008080</code><span>Teal</span></li>
                <li><span className="ds-sw ds-sw--bordered" style={{ background: "#F0F4F5" }} aria-hidden="true" /><code>#F0F4F5</code><span>Robin's egg</span></li>
              </ul>
            </article>

            <article className="ds-surface ds-surface--ostara" role="listitem">
              <p className="ds-surface-eyebrow">System</p>
              <h4>Ostara: Collective Intelligence System</h4>
              <p className="ds-surface-note">Indigo with gold. Designed for collective reasoning, uncertainty, and signal exploration.</p>
              <ul className="ds-swatches" aria-label="Ostara palette">
                <li><span className="ds-sw" style={{ background: "#19007D" }} aria-hidden="true" /><code>#19007D</code><span>Dark Indigo</span></li>
                <li><span className="ds-sw" style={{ background: "#4B00B6" }} aria-hidden="true" /><code>#4B00B6</code><span>Portal</span></li>
                <li><span className="ds-sw" style={{ background: "#F0C040" }} aria-hidden="true" /><code>#F0C040</code><span>Gold</span></li>
              </ul>
            </article>

            <article className="ds-surface ds-surface--cid" role="listitem">
              <p className="ds-surface-eyebrow">Research</p>
              <h4>Canadian Innovation Dimension (CID)</h4>
              <p className="ds-surface-note">Muted ruby red and teal on robin's egg. Research-forward.</p>
              <ul className="ds-swatches" aria-label="CID palette">
                <li><span className="ds-sw" style={{ background: "#822F00" }} aria-hidden="true" /><code>#822F00</code><span>Ruby</span></li>
                <li><span className="ds-sw" style={{ background: "#008080" }} aria-hidden="true" /><code>#008080</code><span>Teal</span></li>
                <li><span className="ds-sw ds-sw--bordered" style={{ background: "#F0F4F5" }} aria-hidden="true" /><code>#F0F4F5</code><span>Robin's egg</span></li>
              </ul>
            </article>

            <article className="ds-surface ds-surface--exhibition" role="listitem">
              <p className="ds-surface-eyebrow">Exhibition</p>
              <h4>Canadian Interactive Exhibition</h4>
              <p className="ds-surface-note">Ruby red and white flowing through the Ooo indigo spectrum. Designed for public interaction, artist-created digital worlds, and nonprofit participation.</p>
              <ul className="ds-swatches" aria-label="Exhibition palette">
                <li><span className="ds-sw" style={{ background: "#822F00" }} aria-hidden="true" /><code>#822F00</code><span>Ruby</span></li>
                <li><span className="ds-sw ds-sw--bordered" style={{ background: "#FFFFFF" }} aria-hidden="true" /><code>#FFFFFF</code><span>White</span></li>
                <li><span className="ds-sw" style={{ background: "#19007D" }} aria-hidden="true" /><code>#19007D</code><span>Dark Indigo</span></li>
                <li><span className="ds-sw" style={{ background: "#4B00B6" }} aria-hidden="true" /><code>#4B00B6</code><span>Portal</span></li>
              </ul>
            </article>
          </div>

          <h3 className="ds-section-title ds-section-title--quiet">Component primitives</h3>
          <div className="ds-quadrant ds-quadrant--quiet">
            <article className="ds-primitive">
              <h4>Button variants</h4>
              <p>Indigo primary, outline secondary, ghost tertiary. Hover and focus share the same teal-to-indigo logic across surfaces.</p>
              <div className="ds-row">
                <button type="button" className="btn btn-primary">Primary</button>
                <button type="button" className="btn btn-secondary">Secondary</button>
                <button type="button" className="btn btn-ghost">Ghost</button>
              </div>
            </article>

            <article className="ds-primitive">
              <h4>Chips and badges</h4>
              <p>Status, taxonomy, and meta. Background uses tinted brand tokens at low alpha so chips read against any surface.</p>
              <div className="ds-row">
                <span className="chip">Default</span>
                <span className="chip chip--teal">Teal</span>
                <span className="chip chip--gold">Gold</span>
                <span className="chip chip--ruby">Ruby</span>
              </div>
            </article>

            <article className="ds-primitive">
              <h4>Cards</h4>
              <p>Same container, swapped accents. Hover lifts 2px and reveals the surface-specific accent border.</p>
              <div className="ds-card-sample">
                <p className="ds-card-title">Card title</p>
                <p className="ds-card-body">Body copy sits below the title with measured contrast and a steady baseline grid.</p>
              </div>
            </article>

            <article className="ds-primitive">
              <h4>Interaction states</h4>
              <p>Every interactive element ships with rest, hover, focus-visible, and disabled. Focus is always a 2px ring at 3:1 contrast minimum.</p>
              <ul className="ds-states">
                <li><span className="ds-state-dot ds-state-dot--rest" /> Rest</li>
                <li><span className="ds-state-dot ds-state-dot--hover" /> Hover</li>
                <li><span className="ds-state-dot ds-state-dot--focus" /> Focus-visible</li>
                <li><span className="ds-state-dot ds-state-dot--disabled" /> Disabled</li>
              </ul>
            </article>
          </div>

          <h3 className="ds-section-title">Practice</h3>
          <p className="ds-section-lede">
            The system holds together through how the work is made. Three
            repeated patterns run in sequence on every project.
          </p>
          <ol className="ds-sequence" aria-label="Practice sequence">
            <li className="ds-step">
              <p className="ds-step-num">01</p>
              <h4>Skills architecture</h4>
              <p>
                Reusable modular workflows live as named skills with clear
                inputs and outputs. Specialist review patterns plug into any
                project the same way every time.
              </p>
            </li>
            <li className="ds-step">
              <p className="ds-step-num">02</p>
              <h4>Multi-pass review</h4>
              <p>
                Each artifact runs through accessibility check, design polish,
                consistency sweep, and hierarchy cleanup. Each pass is scoped
                and recorded so the next reviewer picks up clean state.
              </p>
            </li>
            <li className="ds-step">
              <p className="ds-step-num">03</p>
              <h4>Prompt structuring</h4>
              <p>
                Constrained prompts with explicit scope, iterative refinement
                in small steps, and consistency enforcement against the
                system. Human authorship stays visible at every step.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <div className="case-body">
        <h2>Posture</h2>
        <p>
          Public sources only. Persistent disclosure on every artifact.
          ABSTAIN treated as a first-class outcome. Privacy by design enforced
          in code, not policy. AI assistance documented line-by-line in a
          Source Card on every project.
        </p>

        <h2>References</h2>
        <ul>
          <li>Cavoukian, A. (2009). Privacy by design: The 7 foundational principles.</li>
          <li>Gray, D., Brown, S., &amp; Macanufo, J. (2010). Gamestorming.</li>
          <li>Kahneman, D. (2011). Thinking, fast and slow.</li>
          <li>Paulus, P. B., &amp; Nijstad, B. A. (2003). Group creativity.</li>
          <li>Sanders, E. B.-N., &amp; Stappers, P. J. (2008). Co-creation and the new landscapes of design.</li>
          <li>Shneiderman, B. (2020). Human-centered artificial intelligence.</li>
          <li>Weisz, J. D., et al. (2024). Design principles for generative AI applications. CHI '24.</li>
        </ul>

        <h2>Contact</h2>
        <p>
          <a href="mailto:greg@ooos.ca">greg@ooos.ca</a>
        </p>
      </div>
    </>
  );
}
