import { useEffect, useState } from "react";

/* The CID division card: the seal at rest, and two corner buttons that
   swap in the other medallions under review. Bottom-left, a maple leaf
   brings in the Canadian Quadrant seal; bottom-right, the octopus brings
   in the Marine Squadron seal. Tapping the active button returns to the seal at
   rest. Icons are Font Awesome Free brand marks (canadian-maple-leaf and
   octopus-deploy, 6.x, CC BY 4.0, https://fontawesome.com/license/free),
   inlined so no font loads for them. All three tiles were cut with the
   outer ring on the same circle, so the swaps hold still. */

const BASE = import.meta.env.BASE_URL;
const SEALS = {
  rest: `${BASE}assets/brand/cid-seal-640.webp`,
  canada: `${BASE}assets/brand/cid-seal-canada-640.webp`,
  marine: `${BASE}assets/brand/cid-seal-marine-640.webp`,
} as const;
type Face = keyof typeof SEALS;

function LeafIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="currentColor">
      <path d="M383.8 351.7c2.5-2.5 105.2-92.4 105.2-92.4l-17.5-7.5c-10-4.9-7.4-11.5-5-17.4 2.4-7.6 20.1-67.3 20.1-67.3s-47.7 10-57.7 12.5c-7.5 2.4-10-2.5-12.5-7.5s-15-32.4-15-32.4-52.6 59.9-55.1 62.3c-10 7.5-20.1 0-17.6-10 0-10 27.6-129.6 27.6-129.6s-30.1 17.4-40.1 22.4c-7.5 5-12.6 5-17.6-5C293.5 72.3 255.9 0 255.9 0s-37.5 72.3-42.5 79.8c-5 10-10 10-17.6 5-10-5-40.1-22.4-40.1-22.4S183.3 182 183.3 192c2.5 10-7.5 17.5-17.6 10-2.5-2.5-55.1-62.3-55.1-62.3S98.1 167 95.6 172s-5 9.9-12.5 7.5C73 177 25.4 167 25.4 167s17.6 59.7 20.1 67.3c2.4 6 5 12.5-5 17.4L23 259.3s102.6 89.9 105.2 92.4c5.1 5 10 7.5 5.1 22.5-5.1 15-10.1 35.1-10.1 35.1s95.2-20.1 105.3-22.6c8.7-.9 18.3 2.5 18.3 12.5S241 512 241 512h30s-5.8-102.7-5.8-112.8 9.5-13.4 18.4-12.5c10 2.5 105.2 22.6 105.2 22.6s-5-20.1-10-35.1 0-17.5 5-22.5z" />
    </svg>
  );
}
function OctopusIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="currentColor">
      <path d="M455.6,349.2c-45.891-39.09-36.67-77.877-16.095-128.11C475.16,134.04,415.967,34.14,329.93,8.3,237.04-19.6,134.252,24.341,99.677,117.147a180.862,180.862,0,0,0-10.988,73.544c1.733,29.543,14.717,52.97,24.09,80.3,17.2,50.161-28.1,92.743-66.662,117.582-46.806,30.2-36.319,39.857-8.428,41.858,23.378,1.68,44.478-4.548,65.265-15.045,9.2-4.647,40.687-18.931,45.13-28.588C135.9,413.388,111.122,459.5,126.621,488.9c19.1,36.229,67.112-31.77,76.709-45.812,8.591-12.572,42.963-81.279,63.627-46.926,18.865,31.361,8.6,76.391,35.738,104.622,32.854,34.2,51.155-18.312,51.412-44.221.163-16.411-6.1-95.852,29.9-59.944C405.428,418,436.912,467.8,472.568,463.642c38.736-4.516-22.123-67.967-28.262-78.695,5.393,4.279,53.665,34.128,53.818,9.52C498.234,375.678,468.039,359.8,455.6,349.2Z" />
    </svg>
  );
}

export function CidSealCard({ resetSignal = 0 }: { resetSignal?: number }) {
  const [face, setFace] = useState<Face>("rest");
  // each press of the block under the card returns it to the seal at rest
  useEffect(() => {
    if (resetSignal > 0) setFace("rest");
  }, [resetSignal]);
  const toggle = (f: Face) => setFace((cur) => (cur === f ? "rest" : f));
  return (
    <div className="ot-div__art ot-seal">
      {(Object.keys(SEALS) as Face[]).map((f) => (
        <img
          key={f}
          className={`ot-seal__face${face === f ? " ot-seal__face--on" : ""}`}
          src={SEALS[f]}
          alt=""
          width="640"
          height="640"
          loading="lazy"
        />
      ))}
      <div className="ot-seal__ctl ot-seal__ctl--left">
        <button
          type="button"
          className="ot-seal__btn"
          onClick={() => toggle("canada")}
          aria-pressed={face === "canada"}
          aria-label={face === "canada" ? "Show the CID seal" : "Show the Canadian Quadrant seal"}
          title={face === "canada" ? "CID seal" : "Canadian Quadrant"}
        >
          <LeafIcon />
        </button>
      </div>
      <div className="ot-seal__ctl">
        <button
          type="button"
          className="ot-seal__btn"
          onClick={() => toggle("marine")}
          aria-pressed={face === "marine"}
          aria-label={face === "marine" ? "Show the CID seal" : "Show the Marine Squadron seal"}
          title={face === "marine" ? "CID seal" : "Marine Squadron"}
        >
          <OctopusIcon />
        </button>
      </div>
    </div>
  );
}
