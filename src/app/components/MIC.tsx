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
            {/* MIC pressed into the page (Greg, 2026-10-25): midnight-black velvet
                letters, the Hero Circle triangle's imprinted pile and crushed
                sheen, sunk by an inner shadow, each letter ringed in Bright Silver
                so it reads */}
            <svg className="mic-hero__mark" viewBox="0 0 520 190" aria-hidden="true" focusable="false">
              <defs>
                <filter id="mic-velvet" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={1} seed={3} result="n0" />
                  <feGaussianBlur in="n0" stdDeviation="0.35" result="n" />
                  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.66  0 0 0 0 1  0.3 0 0 0 -0.1" result="pile" />
                  <feComposite in="pile" in2="SourceAlpha" operator="in" result="pileIn" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={3} seed={11} result="c" />
                  <feDiffuseLighting in="c" surfaceScale={5} diffuseConstant={1.1} lightingColor="#8A52FF" result="lit">
                    <feDistantLight azimuth={225} elevation={38} />
                  </feDiffuseLighting>
                  <feColorMatrix in="lit" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.2 0 0 0 -0.05" result="litA" />
                  <feComposite in="litA" in2="SourceAlpha" operator="in" result="litIn" />
                  <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="litIn" /><feMergeNode in="pileIn" /></feMerge>
                </filter>
                <filter id="mic-inset" x="-10%" y="-10%" width="120%" height="120%">
                  <feOffset in="SourceAlpha" dx="5" dy="6" result="o1" />
                  <feGaussianBlur in="o1" stdDeviation="5" result="b1" />
                  <feComposite in="SourceAlpha" in2="b1" operator="arithmetic" k2={1} k3={-1} result="r1" />
                  <feFlood floodColor="#020005" floodOpacity="0.95" />
                  <feComposite in2="r1" operator="in" result="sh" />
                  <feOffset in="SourceAlpha" dx="-3" dy="-3" result="o2" />
                  <feGaussianBlur in="o2" stdDeviation="3.5" result="b2" />
                  <feComposite in="SourceAlpha" in2="b2" operator="arithmetic" k2={1} k3={-1} result="r2" />
                  <feFlood floodColor="#A57CFF" floodOpacity="0.16" />
                  <feComposite in2="r2" operator="in" result="hl" />
                  <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="sh" /><feMergeNode in="hl" /></feMerge>
                </filter>
              </defs>
              <g filter="url(#mic-inset)">
                <text className="mic-hero__mark-fill" x="260" y="160" textAnchor="middle" filter="url(#mic-velvet)">MIC</text>
              </g>
              <text className="mic-hero__mark-edge" x="260" y="160" textAnchor="middle">MIC</text>
            </svg>
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
