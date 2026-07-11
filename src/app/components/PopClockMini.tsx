import "../../styles/pop-clock-mini.css";

/**
 * /pop-clock-mini — the Ooo! Pop Clock Mini learning page ("Memento vivere").
 * The full editorial lives here so the CID slider stays focused on the widget.
 * Sets up the pattern for future regional clocks (each can point here).
 */
export function PopClockMini() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="pcm-scope">
      <div className="pcm-inner">
        <h1 className="pce-epigraph">
          <em>Memento vivere.</em>
          <span className="pce-epigraph-en">Remember to live.</span>
        </h1>

        <p className="pce-verse">
          Some are born. Some are dying.
          <br />
          The rhythm sustains, always the same.
          <br />
          Many melodies rise in harmony.
        </p>

        <h2 className="pce-h">Every 1 is someone.</h2>
        <p className="pce-p">
          Each number on this clock is a real person, with a lifetime of experience.
        </p>

        <h2 className="pce-h">Watch and learn</h2>
        <p className="pce-p">
          Understanding demographic data is key to spotting trends, finding correlations, and
          identifying insights that inform wise decisions and guide strategic plans. With the
          right tools and reliable data, we can monitor the unseen forces that shape our
          communities, economy, and future.
        </p>

        <p className="pce-lead">
          More than a timepiece for tech enthusiasts. The Ooo! Pop Clock Mini can do all this
          and more:
        </p>
        <ul className="pce-caps">
          <li>Forecast challenges and opportunities</li>
          <li>Map intersecting issues</li>
          <li>Pinpoint systematic problems</li>
          <li>Navigate shifting geopolitics</li>
          <li>Reveal potential futures</li>
          <li>Measure market needs</li>
        </ul>

        <p className="pce-refrain">
          Observe the rhythm. Discover the patterns. Question your understanding.
        </p>

        <p className="pce-warning">
          <strong>Safety warning:</strong> Big numbers tell powerful stories. Learning to read
          them may alter your perspective.
        </p>

        <p className="pce-bridge">
          Awareness is a bridge, not a destination.{" "}
          <a
            href={`${base}jellybean-journeys/index.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore JellyBean Journeys →
          </a>
        </p>

        <div className="pcm-actions">
          <a className="pcm-btn pcm-btn--primary" href={`${base}cid`}>
            See the live clock →
          </a>
          <a
            className="pcm-btn pcm-btn--ghost"
            href={`${base}jellybean-journeys/index.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            JellyBean Journeys
          </a>
        </div>

        {/* Two ways of knowing: Human-Centred Design beside Relationality. */}
        <div className="pcm-compare">
          <p className="pcm-compare-h">Two ways of knowing</p>
          <div className="pcm-compare-grid">
            <div className="pcm-col pcm-col--a">
              <h3 className="pcm-col-h">Human-Centred Design</h3>
              <p className="pcm-col-quote">
                &ldquo;Drive innovation by deeply understanding customer needs.&rdquo;
              </p>
              <p className="pcm-col-cite">IDEO U</p>
            </div>
            <div className="pcm-col pcm-col--b">
              <h3 className="pcm-col-h">Relationality</h3>
              <p className="pcm-col-quote">
                &ldquo;Relationships are vital to creating awareness, building trust, and
                garnering support in order to mobilize action.&rdquo;
              </p>
              <p className="pcm-col-cite">Cote-Meek (2020, p. xviii)</p>
            </div>
          </div>
          <p className="pcm-footnote">
            Cited in Patricia Barkaskas and Derek Gladwin, &ldquo;Pedagogical Talking Circles:
            Decolonizing Education through Relational Indigenous Frameworks,&rdquo; University of
            British Columbia.
          </p>
        </div>

        <div className="pce-outcomes">
          <p className="pce-outcomes-h">Learning outcomes</p>
          <ol>
            <li>Observe the rhythm, discover patterns, and question your understanding.</li>
            <li>Use good data to test assumptions and tackle systematic challenges.</li>
            <li>Understand different perspectives and competing priorities.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
