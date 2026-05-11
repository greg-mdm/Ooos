import { Link } from "react-router-dom";

export function About() {
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
          <header className="ds-header ds-header--split">
            <div className="ds-header-left">
              <p className="ds-eyebrow">Design system</p>
              <h2 id="ds-heading">Creative Environments</h2>
              <p className="ds-lede">
                Each project creates space for meaningful engagement within a
                unique creative environment, centrally guided by the studio's
                founder and creative director.
              </p>
            </div>
            <div className="ds-header-right">
              <p className="ds-lede">
                Shared systems of spacing, contrast, typography, and disclosure
                are applied consistently across all creative environments.
                Participatory design creates coherence across Ooos universe through:
              </p>
              <ul className="ds-lede-list">
                <li>Clarity where it matters</li>
                <li>Curiosity that leads to knowledge exchange</li>
                <li>Freedom to choose your own level of participation and engagement</li>
              </ul>
            </div>
          </header>

          <div className="ds-quadrant" role="list" aria-label="Creative environments">
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
          <p className="ds-section-lede">Strategies follow principles.</p>
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
                <p className="ds-card-eyebrow">Signal</p>
                <p className="ds-card-title">One signal. Three positions.</p>
                <p className="ds-card-body">Audience-as-evidence with persistent disclosure on every artifact.</p>
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
