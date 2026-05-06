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

      <div className="case-body">
        <h2>Posture</h2>
        <p>
          Public sources only. Persistent disclosure on every artifact.
          ABSTAIN treated as a first-class outcome. Privacy by design enforced
          in code, not policy. AI assistance documented line-by-line in a
          Source Card on every project.
        </p>

        <h2>Credits and acknowledgements</h2>
        <p>
          The studio is grateful to the people who contributed time, voice,
          and code in-kind:
        </p>
        <ul>
          <li><strong>CJ Smith</strong>, Resonate Strategy Inc. Voice talent and creative direction on the English and German radio ads.</li>
          <li><strong>Melih Onat</strong>, full-stack developer and MDM alum. Engineering collaboration on the Ooos web platform.</li>
        </ul>

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
