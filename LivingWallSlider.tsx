import { useEffect, useState } from "react";
import { PopClockCard, type PopulationModelState } from "../population/PopulationClockCard";

/** The living wall's white-panel slider — prime real estate rotating between
 *  the National Strategy feature (slide 1 — the live-estimate medallion sits
 *  beside it in the art's misty circle) and the Ooo! Pop Clock Mini card with
 *  its publishable details (slide 2 — the panel shifts up and the solid card
 *  covers the baked "A Force of Nature" title, reclaiming that space).
 *  Auto-advances every 8s until the visitor interacts, pauses on hover/focus,
 *  and sits still under prefers-reduced-motion. Inactive slides are
 *  visibility:hidden (out of the tab order and a11y tree); the grid stack
 *  keeps the panel height stable across slides. */
const LW_SLIDES = ["Live estimate", "Full model"] as const;

export function LivingWallSlider({
  populationModel,
  onIndexChange,
}: {
  populationModel: PopulationModelState;
  onIndexChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [userTouched, setUserTouched] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (userTouched || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % LW_SLIDES.length), 8000);
    return () => window.clearInterval(id);
  }, [userTouched, paused]);

  const goTo = (i: number) => {
    setIndex(i);
    setUserTouched(true);
  };

  return (
    <div
      className="cid-lw-slider"
      role="group"
      aria-roledescription="carousel"
      aria-label="Ooo! Pop Clock Mini — live estimate, then the full ring model"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="cid-lw-slides">
        <div className={`cid-lw-slide${index === 0 ? " is-active" : ""}`}>
          {/* The live clock as a compact, bordered device; the arrow advances
              to the full ring model on slide 2. It now owns the whole panel —
              the nature blurb + National Strategy link moved to the block below. */}
          <PopClockCard state={populationModel} wide onAdvance={() => goTo(1)} />
        </div>
        <div className={`cid-lw-slide${index === 1 ? " is-active" : ""}`}>
          <PopClockCard state={populationModel} wide detailed />
        </div>
      </div>
      <div className="cid-lw-dots">
        {LW_SLIDES.map((name, i) => (
          <button
            key={name}
            type="button"
            className={`cid-lw-dot${index === i ? " is-active" : ""}`}
            aria-label={`Show ${name}`}
            aria-current={index === i}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default LivingWallSlider;
