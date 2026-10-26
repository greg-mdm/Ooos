import { Link } from "react-router-dom";
import OooHeroCircle from "./OooHeroCircle";
import "../../styles/mic.css";

// MIC — Media, Information and Culture. First of the three Ooo divisions.
// The division's hero leads the page (Greg, 2026-10-25): the MIC lockup set
// large, the three words stacked beside it, and the Hero Circle (ART,
// EDUCATION, CULTURE; Greg's handoff in src/app/components/OooHeroCircle.tsx)
// centred beneath, mobile first and sized up for tablet and desktop. The
// Twelve Signs decode board follows under its own heading; it ships as a
// self-contained experience from public/mic/twelve-signs/.
export function MIC() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="mic-scope">
      <section className="mic-hero" aria-labelledby="mic-hero-title">
        <div className="mic-hero__head">
          <h1 id="mic-hero-title" className="mic-hero__lockup" aria-label="MIC: Media, Information, Culture">
            <span className="mic-hero__mark" aria-hidden="true">MIC</span>
            <span className="mic-hero__words" aria-hidden="true">
              <span>Media</span>
              <span>Information</span>
              <span>Culture</span>
            </span>
          </h1>
          <Link to="/" className="mic-banner__back">Back to Ooo Divisions</Link>
        </div>
        <div className="mic-hero__circle">
          <OooHeroCircle />
        </div>
      </section>

      <section className="mic-feature" aria-labelledby="mic-twelve-title">
        <div className="mic-feature__head">
          <h2 id="mic-twelve-title" className="mic-feature__title">Twelve Signs</h2>
        </div>
        <iframe
          className="mic-feature__frame"
          src={`${base}mic/twelve-signs/board.html?v=1`}
          title="Twelve Signs decode board"
          loading="lazy"
          allowFullScreen
        />
      </section>
    </div>
  );
}

export default MIC;
