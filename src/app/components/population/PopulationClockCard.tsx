// Ooo! Pop Clock Mini — Automated Predictive Model.
// A branded population clock shown as a bordered, embeddable DEVICE. Its point
// of difference from StatCan's clock (six identical bars) is a DIFFERENTIATED
// ring row: births/deaths/immigrants are solid rings that fill toward the next
// modelled event and reset (green = adds, coral = subtracts); emigrants and
// net non-permanent residents are dashed rings showing net "drift" (no single
// events). Green adds, coral subtracts — so the whole sign structure reads at a
// glance, no legend. The rings are driven by the same four-quarter rates as the
// headline, so they always sum to the day's change. Data from public StatCan
// tables (see statcanClient.ts); NOT the official StatCan clock, and says so.
//
// Pieces (all share one data load via usePopulationModel in the parent):
//   <PopClockCard>        — the device. Compact on slide 1 (branding + live
//                            estimate + a highly-visible advance arrow);
//                            `detailed` on slide 2 (the full ring embed).
//   <PopulationSourcesStrip> — meta + attribution, small text below the section

import { useEffect, useRef, useState } from "react";
import "../../../styles/population-widget.css";
import { loadPopulationModelData, type PopulationModelData } from "./statcanClient";
import {
  formatMagnitude,
  formatPersons,
  formatReferenceDate,
  readModel,
  secondsSinceEasternMidnight,
  type MiniModelReading,
  type RingReading,
} from "./populationMiniModel";

const OFFICIAL_CLOCK_URL = "https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2018005-eng.htm";

const SOURCE_LINE =
  "Source: Statistics Canada, Canada’s population clock (real-time model), and related " +
  "public data tables. Adapted using Statistics Canada Web Data Service. This does not " +
  "imply endorsement by Statistics Canada.";

export type PopulationModelState =
  | { kind: "loading" }
  | { kind: "ready"; data: PopulationModelData }
  | { kind: "error" };

/** One fetch shared by the cards and the sources strip. */
export function usePopulationModel(): PopulationModelState {
  const [state, setState] = useState<PopulationModelState>({ kind: "loading" });
  useEffect(() => {
    let cancelled = false;
    loadPopulationModelData()
      .then((data) => !cancelled && setState({ kind: "ready", data }))
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

/** Once-per-second re-render while data is live (drives the headline + drift
 *  rings). Values are recomputed from the wall clock each tick, so nothing
 *  drifts or accumulates error. Event rings animate themselves via rAF. */
function useSecondTick(active: boolean) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
}

// The clock's LID — the branded top bar. Drop a single clean branded image
// here (e.g. exported from Canva) and it replaces the text lockup below,
// full-bleed across the top of the device, without shifting anything under it.
// Keep the image's aspect stable so the body never moves. Path is relative to
// the site base (import.meta.env.BASE_URL), e.g.:
//   const LID_IMAGE = "assets/brand/pop-clock-lid.png";
const LID_IMAGE: string | null = "pop-clock/ooo-popclock-lid.png";

// Slide 2 (detailed) uses the full window template as the device face — a
// branded gradient with the wordmark + bricks baked into the bottom and an
// open "screen" area up top for the live readout (headline + rings). Set to
// null to fall back to the lid-bar + plain body layout.
const WINDOW_IMAGE: string | null = "pop-clock/popclock_window.png";

// Ruby-red round play/next icon for the slide-1 "Look at our live model" CTA.
const PLAY_ICON = "pop-clock/ruby-red-play.png";

/** The lid: a branded image when supplied, otherwise the text lockup
 *  (Humans of Canada · electric Ooo! wordmark + Pop Clock Mini · subtitle). */
function PopClockLid() {
  const base = import.meta.env.BASE_URL;
  if (LID_IMAGE) {
    return (
      <div className="pmm-lid pmm-lid--img">
        <img
          className="pmm-lid-img"
          src={`${base}${LID_IMAGE}`}
          alt="Ooo! Pop Clock Mini — Automated Predictive Model, by Humans of Canada"
        />
      </div>
    );
  }
  return (
    <div className="pmm-lid">
      <p className="pmm-kicker">Humans of Canada</p>
      <h2 className="pmm-h2">
        <img
          className="pmm-wordmark"
          src={`${base}assets/brand/ooo-wordmark-portal-transparent.png`}
          alt="Ooo!"
        />
        <span className="pmm-h2-text">Pop Clock Mini</span>
      </h2>
      <h3 className="pmm-h3">Automated Predictive Model</h3>
    </div>
  );
}

// ---- rings ----------------------------------------------------------------
const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

// Per-stream ring colour. Births are green; immigration is ruby red; deaths
// darken as the ring fills — indigo → dark indigo → midnight black — before
// resetting on the next event.
function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}
const DEATH_STOPS: [number, number, number][] = [
  [90, 30, 170], // indigo
  [43, 5, 97], //  dark indigo (brand)
  [10, 10, 20], // midnight black
];
function deathColor(phase: number): string {
  const seg = phase < 0.5 ? 0 : 1;
  const t = phase < 0.5 ? phase / 0.5 : (phase - 0.5) / 0.5;
  const a = DEATH_STOPS[seg];
  const b = DEATH_STOPS[seg + 1];
  return `rgb(${lerp(a[0], b[0], t)}, ${lerp(a[1], b[1], t)}, ${lerp(a[2], b[2], t)})`;
}
const RING_STROKE: Record<string, string | ((phase: number) => string)> = {
  births: "#12925c", // green
  immigrants: "#c41230", // ruby red
  deaths: deathColor, // indigo → midnight black as it fills
};

/** A solid ring that fills toward the next modelled event and resets, driven by
 *  requestAnimationFrame for a smooth sweep. Pulses on each completed event.
 *  Paused (via `active`) when the section is off-screen. */
function EventRing({ ring, active }: { ring: RingReading; active: boolean }) {
  const progRef = useRef<SVGCircleElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = ring.intervalSeconds;
    const prog = progRef.current;
    const countEl = countRef.current;
    if (!interval || !prog || !countEl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stroke = RING_STROKE[ring.key];
    let raf = 0;
    let timer = 0;
    let lastCount = -1;

    const paint = () => {
      const sec = secondsSinceEasternMidnight(Date.now()); // EDT day open
      const phase = (sec % interval) / interval;
      prog.style.strokeDashoffset = String(RING_C * (1 - phase));
      // deaths darken toward black as they fill; the others hold their hue
      if (typeof stroke === "function") prog.style.stroke = stroke(phase);
      else if (stroke) prog.style.stroke = stroke;
      const count = Math.floor(sec / interval);
      if (count !== lastCount) {
        countEl.textContent = String(count);
        if (lastCount >= 0 && !reduced && dialRef.current) {
          dialRef.current.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.13)" }, { transform: "scale(1)" }],
            { duration: 220, easing: "ease-out" },
          );
        }
        lastCount = count;
      }
    };

    paint();
    if (!active) return;
    if (reduced) {
      timer = window.setInterval(paint, 1000);
      return () => window.clearInterval(timer);
    }
    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ring.intervalSeconds, active]);

  const every = ring.intervalSeconds ? Math.round(ring.intervalSeconds) : 0;
  return (
    <div className="pmm-ring" role="img" aria-label={`${ring.label}: about one every ${every} seconds`}>
      <div className={`pmm-ring-dial pmm-ring-${ring.kind}`} ref={dialRef}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle className="pmm-ring-track" cx="32" cy="32" r={RING_R} />
          <circle
            ref={progRef}
            className="pmm-ring-prog"
            cx="32"
            cy="32"
            r={RING_R}
            transform="rotate(-90 32 32)"
            style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
          />
        </svg>
        <span className="pmm-ring-count" ref={countRef}>{ring.count}</span>
      </div>
      <span className="pmm-ring-label">{ring.label}</span>
      <span className="pmm-ring-sub">1 / ~{every} s</span>
    </div>
  );
}

/** A dashed ring showing a net quantity (drift) — no single events. Updated by
 *  the parent's per-second tick. */
function DriftRing({ ring }: { ring: RingReading }) {
  const sign = ring.signedNet < 0 ? "−" : ring.signedNet > 0 ? "+" : "";
  return (
    <div
      className="pmm-ring pmm-ring--secondary"
      role="img"
      aria-label={`${ring.label}: net ${sign}${formatMagnitude(ring.signedNet)} since midnight`}
    >
      <div className={`pmm-ring-dial pmm-ring-drift pmm-ring-${ring.kind}`}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle className="pmm-ring-track pmm-ring-track--dashed" cx="32" cy="32" r={RING_R} />
        </svg>
        <span className="pmm-ring-count pmm-ring-count--net">
          {sign}
          {formatMagnitude(ring.signedNet)}
          <span className="pmm-ring-net">net</span>
        </span>
      </div>
      <span className="pmm-ring-label">{ring.label}</span>
      <span className="pmm-ring-sub">drift</span>
    </div>
  );
}

/** The five differentiated rings; pauses animation when off-screen. */
function RingRow({ rings }: { rings: RingReading[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="pmm-rings" ref={rowRef}>
      {rings.map((r) =>
        r.mode === "event" ? (
          <EventRing key={r.key} ring={r} active={active} />
        ) : (
          <DriftRing key={r.key} ring={r} />
        ),
      )}
    </div>
  );
}

/** The headline — a tally-counter readout: every digit the same size, the
 *  fast-moving last group highlighted so it reads as active. Plus the day's
 *  move since the open (▲ green / ▼ coral), matching the rings' colours. */
function Headline({ r }: { r: MiniModelReading }) {
  const down = r.changeSinceMidnight < 0;
  const groups = formatPersons(r.currentPopulation).split(",");
  return (
    <div className="pmm-headline">
      <span className="pmm-big" aria-label={`Estimated population ${formatPersons(r.currentPopulation)}`}>
        {groups.map((g, i) => (
          <span key={i} className="pmm-big-grp">
            {i > 0 && <span className="pmm-big-sep">,</span>}
            <span className={`pmm-big-g${i === groups.length - 1 ? " pmm-big-g--live" : ""}`}>{g}</span>
          </span>
        ))}
      </span>
      <span className={`pmm-since ${down ? "is-down" : "is-up"}`}>
        <span className="pmm-since-arrow" aria-hidden="true">{down ? "▼" : "▲"}</span>
        {formatMagnitude(r.changeSinceMidnight)}
        <span className="pmm-since-lbl">since midnight</span>
      </span>
    </div>
  );
}

/** The clock device. Compact (slide 1) or the full ring embed (slide 2). */
export function PopClockCard({
  state,
  wide = false,
  detailed = false,
  onAdvance,
}: {
  state: PopulationModelState;
  wide?: boolean;
  detailed?: boolean;
  onAdvance?: () => void;
}) {
  useSecondTick(state.kind === "ready");
  const r = state.kind === "ready" ? readModel(state.data) : null;

  return (
    <aside
      className={`pmm-card${wide ? " pmm-card--wide" : ""}${detailed ? " pmm-card--full" : " pmm-card--mini"}${
        detailed && WINDOW_IMAGE ? " pmm-card--window" : ""
      }`}
      aria-label="Ooo! Pop Clock Mini — automated predictive model"
    >
      {/* Slide 1 wears the lid bar; slide 2's branding is baked into the
          window face, so it skips the lid. */}
      {!(detailed && WINDOW_IMAGE) && <PopClockLid />}

      {state.kind === "loading" && (
        <p className="pmm-status" role="status">
          Loading the latest Statistics Canada estimates…
        </p>
      )}
      {state.kind === "error" && (
        <p className="pmm-status pmm-status--error" role="status">
          Latest Statistics Canada data could not be loaded.
        </p>
      )}

      {/* Slide 1 — compact: relevant info first (the estimate), then the CTA. */}
      {!detailed && r && (
        <div className="pmm-mini">
          <div className="pmm-mini-row">
            <span className="pmm-hoc">Humans of Canada</span>
            {onAdvance && (
              <button type="button" className="pmm-cta" onClick={onAdvance}>
                <span className="pmm-cta-text">Look at our live model</span>
                <img
                  className="pmm-cta-play"
                  src={`${import.meta.env.BASE_URL}${PLAY_ICON}`}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
          <div className="pmm-mini-row pmm-mini-row--est">
            <span className="pmm-estnum">{formatPersons(r.currentPopulation)}</span>
            <span className="pmm-estcap">(Population estimate)</span>
          </div>
        </div>
      )}

      {/* Slide 2 — the full differentiated ring embed. On the window face the
          live readout sits in the branded template's open screen area; the
          supporting text follows below. */}
      {detailed && r && (
        <>
          {WINDOW_IMAGE ? (
            <div className="pmm-face">
              <img
                className="pmm-face-img"
                src={`${import.meta.env.BASE_URL}${WINDOW_IMAGE}`}
                alt="Ooo! Pop Clock Mini — Automated Predictive Model, by Humans of Canada"
              />
              <div className="pmm-face-screen">
                <Headline r={r} />
                <RingRow rings={r.rings} />
              </div>
            </div>
          ) : (
            <>
              <Headline r={r} />
              <RingRow rings={r.rings} />
            </>
          )}
          <p className="pmm-ringfoot">
            Each solid ring is a live counter: it fills as the next birth, death or arrival
            approaches, then ticks the count up and resets. The dashed rings are net totals —
            emigration and non-permanent residents are modelled as net flows, not single events,
            so they drift with the running net since midnight.
          </p>
          <p className="pmm-about">
            Tracks Canada&rsquo;s population between StatCan&rsquo;s quarterly estimates, modelled
            from the latest four quarters of demographic components. Experimental — not the
            official StatCan clock, and not endorsed by Statistics Canada.
          </p>
          <a className="pmm-link" href={OFFICIAL_CLOCK_URL} target="_blank" rel="noopener noreferrer">
            Check Canada&rsquo;s official real-time population clock @ statcan.gc.ca
          </a>
          <p className="pmm-srcline">{SOURCE_LINE}</p>
          {/* The methodology adjustment belongs at the end, not leading. */}
          <p className="pmm-adjust">Interprovincial migration omitted (net zero nationally).</p>
        </>
      )}
    </aside>
  );
}

/** Small sources text below the section — kept OFF the white panel on purpose. */
export function PopulationSourcesStrip({ state }: { state: PopulationModelState }) {
  return (
    <div className="pmm-sources">
      {state.kind === "ready" && (
        <dl className="pmm-sources-meta">
          <div>
            <dt>Base estimate reference period</dt>
            <dd>{formatReferenceDate(state.data.baseReferenceDate)}</dd>
          </div>
          <div>
            <dt>Last StatCan data refresh</dt>
            <dd>
              {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(
                new Date(state.data.fetchedAt),
              )}
            </dd>
          </div>
          <div>
            <dt>Rate basis</dt>
            <dd>
              births − deaths + immigrants − emigrants + NPR,{" "}
              {state.data.componentsLive
                ? "latest four quarters"
                : "StatCan reference rates (2025–2026)"}
              {" · "}
              {state.data.sourceTables.join(", ")}. May differ from StatCan&rsquo;s population
              clock, which projects from its own model baseline.
            </dd>
          </div>
        </dl>
      )}
      <p className="pmm-sources-line">{SOURCE_LINE}</p>
    </div>
  );
}
