/* Spirit: one rectangular button under each division card, the mark and
   the division's name together inside it (school spirit; exchanging human
   culture and exploring the natural world). Tapping it shakes the mark and
   gives the card a quick cheer pulse (see .ot-spirit in hero-top.css); the
   button is the hook for whatever Spirit grows into on each card. MIC's pom-poms are drawn here,
   two sixteen-point bursts on crossed handles; CID uses Ant Design's
   "fund-projection-screen" (outlined, MIT, ant.design), materials and
   value on the board; the RA uses a house with a person in it (Font
   Awesome Free 6 solid "house-user", CC BY 4.0), body and property in
   one mark. Nothing loads for the icons. */
import { useEffect, useRef, useState } from "react";

const CHEER_MS = 720;

function PomPomsIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="currentColor" stroke="currentColor" strokeLinecap="round">
      <path d="M168 94L184 130L213 103L215 142L251 129L238 165L277 167L250 196L286 212L250 228L277 257L238 259L251 295L215 282L213 321L184 294L168 330L152 294L123 321L121 282L85 295L98 259L59 257L86 228L50 212L86 196L59 167L98 165L85 129L121 142L123 103L152 130Z" stroke="none" />
      <path d="M344 94L360 130L389 103L391 142L427 129L414 165L453 167L426 196L462 212L426 228L453 257L414 259L427 295L391 282L389 321L360 294L344 330L328 294L299 321L297 282L261 295L274 259L235 257L262 228L226 212L262 196L235 167L274 165L261 129L297 142L299 103L328 130Z" stroke="none" />
      <path d="M200 318 L252 470 M312 318 L260 470" fill="none" strokeWidth="34" />
    </svg>
  );
}

function FundScreenIcon() {
  return (
    <svg viewBox="64 64 896 896" aria-hidden="true" fill="currentColor">
      <path d="M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8a8.03 8.03 0 00-11.3 0L517 485.3l-86.1-86.2a8.03 8.03 0 00-11.3 0L275.3 543.4a8.03 8.03 0 000 11.3l36.8 36.8z" />
      <path d="M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1a7.92 7.92 0 00-2.3 11l30.3 47.2v.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-.1l30.3-47.2a8 8 0 00-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 512H160V232h704v440z" />
    </svg>
  );
}

function HouseUserIcon() {
  return (
    <svg viewBox="0 0 576 512" aria-hidden="true" fill="currentColor">
      <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c.2 35.5-28.5 64.3-64 64.3l-320.4 0c-35.3 0-64-28.7-64-64l0-160.4-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80l-64 0z" />
    </svg>
  );
}

type SpiritIcon = "pompoms" | "fund" | "house";
const ICONS: Record<SpiritIcon, () => JSX.Element> = { pompoms: PomPomsIcon, fund: FundScreenIcon, house: HouseUserIcon };

export function SpiritButton({
  division,
  label,
  icon = "pompoms",
  onPress,
}: {
  division: string;
  label: string;
  icon?: SpiritIcon;
  /* the card above resets to its first state on each press */
  onPress?: () => void;
}) {
  const [cheering, setCheering] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const cheer = () => {
    onPress?.();
    window.clearTimeout(timer.current);
    setCheering(false);
    // restart the animation even on a quick second tap (a zero-delay
    // timeout, not an animation frame, so it never waits on rendering)
    window.setTimeout(() => {
      setCheering(true);
      timer.current = window.setTimeout(() => setCheering(false), CHEER_MS);
    }, 0);
  };
  return (
    <div className="ot-spirit">
      <button
        type="button"
        className={`ot-spirit__btn${cheering ? " is-cheering" : ""}`}
        onClick={cheer}
        aria-label={`${label}: Spirit, cheer for ${division}`}
        title="Spirit"
      >
        {ICONS[icon]()}
        <span className="ot-spirit__label">{label}</span>
      </button>
    </div>
  );
}
