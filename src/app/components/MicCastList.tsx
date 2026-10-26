import { MicroDeLuxeCard } from "./MicroDeLuxeCard";

/* The MIC cast list (Greg, 2026-10-26), above Twelve Signs: a theatre
   programme of the division's characters. Each credit runs name, dot
   leader, role, with the character's featured video beneath. Micro De
   Luxe's reel is the homepage player itself (the rise clip, then the β
   younger-stage clip), shown larger here, and Lil Mike's runs in the same
   player; here both play with sound when clicked (see MicroDeLuxeCard).
   The clapper and the two masks are drawn for this page; they stand under
   the column labels (Greg, 2026-10-26), the masks under Character and the
   clapper under Role, and the Ooo! wordmark leads the heading. */

function ClapperIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M3 13.5h18M7.5 10l-2 3.5M12 10l-2 3.5M16.5 10l-2 3.5" />
      <g transform="rotate(-16 3 10)">
        <rect x="3" y="6.2" width="18" height="3.8" rx="1" />
        <path d="M8 6.2l-2 3.8M12.5 6.2l-2 3.8M17 6.2l-2 3.8" />
      </g>
    </svg>
  );
}

// comedy laughing up top left, tragedy crying below right
function MasksIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 3.6c2.8-1 5.7-1 8.5 0v5.6c0 3.1-1.9 5.4-4.25 5.4S2.5 12.3 2.5 9.2z" />
      <path d="M4.3 7.4q.8-.9 1.6 0M7.6 7.4q.8-.9 1.6 0M4.6 10.2q2.15 2.3 4.3 0" />
      <path d="M13 9.2c2.8-1 5.7-1 8.5 0v5.6c0 3.1-1.9 5.4-4.25 5.4S13 17.9 13 14.8z" />
      <path d="M14.6 13.1l1.5-.6M19.9 13.1l-1.5-.6M15.1 17.8q2.15-2.1 4.3 0M15.3 14.6v1.4" />
    </svg>
  );
}

const BASE = import.meta.env.BASE_URL;
const LIL_MIKE_CLIP = `${BASE}assets/brand/lil-mike.mp4`;
const LIL_MIKE_POSTER = `${BASE}assets/brand/lil-mike-poster.webp`;

export function MicCastList() {
  return (
    <section className="mic-cast" aria-labelledby="mic-cast-title">
      <div className="mic-cast__card">
        <h2 id="mic-cast-title" className="mic-cast__title">
          <img className="mic-cast__wordmark" src={`${import.meta.env.BASE_URL}assets/brand/ooo-wordmark-white-transparent.png`} alt="Ooo!" width="1772" height="655" />
          <span>Cast List</span>
        </h2>

        <div className="mic-cast__cols" aria-hidden="true">
          <p className="mic-cast__col">
            <span>Character</span>
            <span className="mic-cast__well mic-cast__well--lg"><MasksIcon /></span>
          </p>
          <p className="mic-cast__col mic-cast__col--role">
            <span>Role</span>
            <span className="mic-cast__well mic-cast__well--lg"><ClapperIcon /></span>
          </p>
        </div>

        <ul className="mic-cast__list">
          <li className="mic-cast__entry">
            <p className="mic-cast__credit">
              <span className="mic-cast__name">Micro De Luxe</span>
              <span className="mic-cast__leader" aria-hidden="true" />
              <span className="mic-cast__role">MIC Mascot</span>
            </p>
            <p className="mic-cast__note"><span>Pedigree:</span> Media Darling</p>
            <figure className="mic-cast__reel">
              <div className="mic-cast__screen">
                <MicroDeLuxeCard withSound />
              </div>
              <figcaption className="mic-cast__plate">
                <strong>Micro De Luxe</strong>
                <span>Actor, Model, Pet Puplicist</span>
              </figcaption>
            </figure>
          </li>

          <li className="mic-cast__entry">
            <p className="mic-cast__credit">
              <span className="mic-cast__name">Lil Mike</span>
              <span className="mic-cast__leader" aria-hidden="true" />
              <span className="mic-cast__role">Understudy</span>
            </p>
            {/* a mouse has a strain where a dog has a pedigree (Greg, 2026-10-26) */}
            <p className="mic-cast__note"><span>Strain:</span> Classically trained cartoon mouse</p>
            {/* his audition, finished in Artlist (Greg, 2026-10-26): 4:5, so the
                hat and the dropped mic both stay in the frame */}
            <figure className="mic-cast__reel">
              <div className="mic-cast__screen mic-cast__screen--portrait">
                <MicroDeLuxeCard
                  withSound
                  poster={LIL_MIKE_POSTER}
                  clip={LIL_MIKE_CLIP}
                  betaClip={null}
                  clipLabel="Lil Mike sings, hears he did not get the part, drops the microphone and runs off"
                  width={720}
                  height={900}
                />
              </div>
              <figcaption className="mic-cast__plate">
                <strong>Lil Mike</strong>
                <span>Understudy</span>
              </figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default MicCastList;
