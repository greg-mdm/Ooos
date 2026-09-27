import { useState } from "react";

/* The CID division card: the seal at rest, and a corner button that swaps
   in the Marine Squad seal. Tapping again returns to the seal at rest.
   The button's icon is Font Awesome's octopus-deploy brand mark (Free
   6.7.2, CC BY 4.0, https://fontawesome.com/license/free), inlined so no
   font loads for it. Both tiles were cut with the same ring fit, so the
   swap holds still. */

const BASE = import.meta.env.BASE_URL;
const SEAL = `${BASE}assets/brand/cid-seal-640.webp`;
const MARINE = `${BASE}assets/brand/cid-seal-marine-640.webp`;

function OctopusIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="currentColor">
      <path d="M455.6,349.2c-45.891-39.09-36.67-77.877-16.095-128.11C475.16,134.04,415.967,34.14,329.93,8.3,237.04-19.6,134.252,24.341,99.677,117.147a180.862,180.862,0,0,0-10.988,73.544c1.733,29.543,14.717,52.97,24.09,80.3,17.2,50.161-28.1,92.743-66.662,117.582-46.806,30.2-36.319,39.857-8.428,41.858,23.378,1.68,44.478-4.548,65.265-15.045,9.2-4.647,40.687-18.931,45.13-28.588C135.9,413.388,111.122,459.5,126.621,488.9c19.1,36.229,67.112-31.77,76.709-45.812,8.591-12.572,42.963-81.279,63.627-46.926,18.865,31.361,8.6,76.391,35.738,104.622,32.854,34.2,51.155-18.312,51.412-44.221.163-16.411-6.1-95.852,29.9-59.944C405.428,418,436.912,467.8,472.568,463.642c38.736-4.516-22.123-67.967-28.262-78.695,5.393,4.279,53.665,34.128,53.818,9.52C498.234,375.678,468.039,359.8,455.6,349.2Z" />
    </svg>
  );
}

export function CidSealCard() {
  const [marine, setMarine] = useState(false);
  return (
    <div className="ot-div__art ot-seal">
      <img className={`ot-seal__face${marine ? "" : " ot-seal__face--on"}`} src={SEAL} alt="" width="640" height="640" loading="lazy" />
      <img className={`ot-seal__face${marine ? " ot-seal__face--on" : ""}`} src={MARINE} alt="" width="640" height="640" loading="lazy" />
      <div className="ot-seal__ctl">
        <button
          type="button"
          className="ot-seal__btn"
          onClick={() => setMarine((m) => !m)}
          aria-pressed={marine}
          aria-label={marine ? "Show the CID seal" : "Show the Marine Squad seal"}
          title={marine ? "CID seal" : "Marine Squad"}
        >
          <OctopusIcon />
        </button>
      </div>
    </div>
  );
}
