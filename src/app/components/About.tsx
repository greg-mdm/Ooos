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
          <header className="ds-header">
            <p className="ds-eyebrow">Design system</p>
            <h2 id="ds-heading">How the studio works.</h2>
            <p className="ds-lede">
              Every product in the studio sits on shared primitives: type,
              spacing, focus, and contrast. Each brand surface pulls from a
              defined color spectrum so it stays distinct without breaking
              the family. The system is governed by stated principles and
              priorities so decisions stay transparent.
            </p>
          </header>

          <h3 className="ds-section-title">Design principles</h3>
          <ul className="ds-principles">
            <li>
              <strong>Design responsibly.</strong> Make risk, system limits,
              and user choice and freedom visible.
            </li>
            <li>
              <strong>Design for diverse mental models.</strong> Build for the
              range of ways people think, perceive, and decide.
            </li>
            <li>
              <strong>Design to earn trust.</strong> Transparent disclosures
              on every artifact, including AI assistance.
            </li>
          </ul>

          <h3 className="ds-section-title">Design priorities</h3>
          <ul className="ds-priorities">
            <li><strong>Co-creation.</strong> Participation over presentation.</li>
            <li><strong>Interactivity.</strong> Engagement over spectacle.</li>
            <li><strong>Emotion.</strong> Empathy over polish.</li>
            <li><strong>Behaviour.</strong> Engagement that earns its time.</li>
          </ul>

          <h3 className="ds-section-title">Brand surfaces</h3>
          <div className="ds-grid ds-grid--surfaces" role="list">
            <article className="ds-surface ds-surface--ooo" role="listitem">
              <h4>Ooo Digital Media Studio</h4>
              <p className="ds-surface-note">Teal and indigo spectrum. The parent brand.</p>
              <ul className="ds-swatches" aria-label="Ooo palette">
                <li><span className="ds-sw" style={{ background: "#19007D" }} aria-hidden="true" /><code>#19007D</code><span>Dark Indigo</span></li>
                <li><span className="ds-sw" style={{ background: "#312583" }} aria-hidden="true" /><code>#312583</code><span>Resolution</span></li>
                <li><span className="ds-sw" style={{ background: "#5B04DE" }} aria-hidden="true" /><code>#5B04DE</code><span>Electric</span></li>
                <li><span className="ds-sw" style={{ background: "#008080" }} aria-hidden="true" /><code>#008080</code><span>Teal</span></li>
                <li><span className="ds-sw ds-sw--bordered" style={{ background: "#F0F4F5" }} aria-hidden="true" /><code>#F0F4F5</code><span>Robin's egg</span></li>
              </ul>
            </article>

            <article className="ds-surface ds-surface--ostara" role="listitem">
              <h4>Ostara</h4>
              <p className="ds-surface-note">Indigo with gold. Collective intelligence and signal work.</p>
              <ul className="ds-swatches" aria-label="Ostara palette">
                <li><span className="ds-sw" style={{ background: "#19007D" }} aria-hidden="true" /><code>#19007D</code><span>Dark Indigo</span></li>
                <li><span className="ds-sw" style={{ background: "#4B00B6" }} aria-hidden="true" /><code>#4B00B6</code><span>Portal</span></li>
                <li><span className="ds-sw" style={{ background: "#F0C040" }} aria-hidden="true" /><code>#F0C040</code><span>Gold</span></li>
              </ul>
            </article>

            <article className="ds-surface ds-surface--cid" role="listitem">
              <h4>Canadian Innovation Dimension (CID)</h4>
              <p className="ds-surface-note">Muted ruby red and teal on robin's egg. Research-forward.</p>
              <ul className="ds-swatches" aria-label="CID palette">
                <li><span className="ds-sw" style={{ background: "#822F00" }} aria-hidden="true" /><code>#822F00</code><span>Ruby</span></li>
                <li><span className="ds-sw" style={{ background: "#008080" }} aria-hidden="true" /><code>#008080</code><span>Teal</span></li>
                <li><span className="ds-sw ds-sw--bordered" style={{ background: "#F0F4F5" }} aria-hidden="true" /><code>#F0F4F5</code><span>Robin's egg</span></li>
              </ul>
            </article>

            <article className="ds-surface ds-surface--exhibition" role="listitem">
              <h4>Exhibition</h4>
              <p className="ds-surface-note">Ruby red and white, anchored to the Ooo indigo spectrum.</p>
              <ul className="ds-swatches" aria-label="Exhibition palette">
                <li><span className="ds-sw" style={{ background: "#822F00" }} aria-hidden="true" /><code>#822F00</code><span>Ruby</span></li>
                <li><span className="ds-sw ds-sw--bordered" style={{ background: "#FFFFFF" }} aria-hidden="true" /><code>#FFFFFF</code><span>White</span></li>
                <li><span className="ds-sw" style={{ background: "#19007D" }} aria-hidden="true" /><code>#19007D</code><span>Dark Indigo</span></li>
                <li><span className="ds-sw" style={{ background: "#4B00B6" }} aria-hidden="true" /><code>#4B00B6</code><span>Portal</span></li>
              </ul>
            </article>
          </div>

          <h3 className="ds-section-title">Component primitives</h3>
          <div className="ds-grid ds-grid--primitives">
            <article className="ds-primitive">
              <h4>Button variants</h4>
              <p>Indigo primary, outline secondary, ghost tertiary. Hover and focus states share the same teal-to-indigo logic across surfaces.</p>
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
            The system is enforced by how the work is made, not just what
            ships. Three repeated patterns hold the studio together.
          </p>
          <div className="ds-grid ds-grid--practice">
            <article className="ds-practice">
              <p className="ds-practice-num">01</p>
              <h4>Skills architecture</h4>
              <p>
                Reusable modular workflows live as named skills with clear
                inputs and outputs. Specialist review patterns (accessibility,
                copy, hierarchy) plug into any project the same way every
                time.
              </p>
            </article>
            <article className="ds-practice">
              <p className="ds-practice-num">02</p>
              <h4>Multi-pass review pipelines</h4>
              <p>
                Each artifact runs through accessibility check, design polish,
                consistency sweep, and hierarchy cleanup. Each pass is scoped
                and recorded so the next reviewer picks up clean state.
              </p>
            </article>
            <article className="ds-practice">
              <p className="ds-practice-num">03</p>
              <h4>Prompt structuring</h4>
              <p>
                Constrained prompts with explicit scope, iterative refinement
                in small steps, and consistency enforcement against the
                system. Human authorship stays visible at every step.
              </p>
            </article>
          </div>
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
