import { Link } from "react-router-dom";
import "../../styles/mic.css";

// MIC — Media, Information and Culture. First of the three Ooo divisions.
// This page is a thin frame around its first featured piece, the Twelve Signs
// decode board, which ships as a self-contained experience from
// public/mic/twelve-signs/. The page carries no editorial copy yet: it is a
// mount point we build out later. The board is the content; the page is a
// heading, a back-link, and a full-bleed embed, mirroring the JellyBean
// Journeys hero on the homepage.
export function MIC() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="mic-scope">
      <section className="mic-banner" aria-label="Media, Information and Culture (MIC)">
        <div className="container">
          <p className="mic-banner__eyebrow">Media, Information and Culture (MIC)</p>
          <h1 className="mic-banner__title">Twelve Signs</h1>
          <Link to="/" className="mic-banner__back">Back to Ooo Divisions</Link>
        </div>
      </section>

      <section className="mic-feature" aria-label="Twelve Signs decode board">
        <iframe
          className="mic-feature__frame"
          src={`${base}mic/twelve-signs/index.html?v=1`}
          title="Twelve Signs decode board"
          loading="lazy"
          allowFullScreen
        />
      </section>
    </div>
  );
}

export default MIC;
