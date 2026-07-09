// Ooo! Pop Clock Mini — Automated Predictive Model.
// A branded population-clock widget: latest StatCan base estimate + a
// net-change-per-second rate derived from public aggregate tables (see
// statcanClient.ts). NOT the official StatCan clock, and says so. The pop
// clock is a custom-widget example of the innovative media Ooo builds with
// Canada's open data sources.
//
// Pieces (all share one data load via usePopulationModel in the parent):
//   <PopClockCard>        — slide 1: electric-wordmark lockup + eyebrow
//                            (+ the live figure on mobile/standalone, where
//                            the medallion has no art to sit on)
//   <PopClockDetailsCard> — slide 2: same branded header + the model
//                            description, small source text and the link to
//                            the official clock
//   <PopulationMedallion> — the live estimate, floated over the pale misty
//                            circle in the cliff art (desktop stages only)
//   <PopulationSourcesStrip> — meta rows + full attribution, small text
//                            below the section

import { useEffect, useState } from "react";
import "../../../styles/population-widget.css";
import { loadPopulationModelData, type PopulationModelData } from "./statcanClient";
import {
  formatPersons,
  formatReferenceDate,
  formatSignedPersons,
  readModel,
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

/** One fetch shared by the cards, the medallion and the sources strip. */
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

/** Once-per-second re-render while data is live. Values are recomputed from
 *  the wall clock each tick, so nothing drifts or accumulates error. */
function useSecondTick(active: boolean) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
}

/** Electric-wordmark lockup: the Ooo! script is the brand part of the H2. */
function PopClockHeader() {
  return (
    <>
      <h2 className="pmm-h2">
        <img
          className="pmm-wordmark"
          src={`${import.meta.env.BASE_URL}assets/brand/ooo-wordmark-portal-transparent.png`}
          alt="Ooo!"
        />
        <span className="pmm-h2-text">Pop Clock Mini</span>
      </h2>
      <h3 className="pmm-h3">Automated Predictive Model</h3>
    </>
  );
}

function LiveFigure({ data }: { data: PopulationModelData }) {
  const reading = readModel(data);
  return (
    <div className="pmm-figure">
      <div className="pmm-label">Estimated modelled population</div>
      {/* Recomputed every second — intentionally NOT an aria-live region, so
          screen readers aren't spammed; the value reads out on focus/pass. */}
      <div className="pmm-value">{formatPersons(reading.currentPopulation)}</div>
      <div className="pmm-delta">
        (a change of{" "}
        <span className={`pmm-delta-num${reading.changeSinceMidnight < 0 ? " is-down" : ""}`}>
          {formatSignedPersons(reading.changeSinceMidnight)}
        </span>{" "}
        since midnight)
      </div>
    </div>
  );
}

/** Slide 1 — the branded clock card. On desktop living-wall stages the live
 *  figure floats in the medallion instead; the card's figure shows on mobile
 *  (and always on standalone embeds). `onMore` jumps to the details slide. */
export function PopClockCard({
  state,
  wide = false,
  onMore,
}: {
  state: PopulationModelState;
  wide?: boolean;
  onMore?: () => void;
}) {
  useSecondTick(state.kind === "ready");
  return (
    <aside
      className={`pmm-card${wide ? " pmm-card--wide" : ""}`}
      aria-label="Ooo! Pop Clock Mini — automated predictive model"
    >
      <PopClockHeader />
      <p className="pmm-eyebrow">Live estimate · Statistics Canada open data</p>

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
      {state.kind === "ready" && <LiveFigure data={state.data} />}

      {onMore && (
        <button type="button" className="pmm-more" onClick={onMore}>
          Find out more ›
        </button>
      )}
    </aside>
  );
}

/** Slide 2 — the model, in more detail, under the same branded name. */
export function PopClockDetailsCard({ wide = false }: { wide?: boolean }) {
  return (
    <aside
      className={`pmm-card${wide ? " pmm-card--wide" : ""}`}
      aria-label="Ooo! Pop Clock Mini — about the model"
    >
      <PopClockHeader />
      <p className="pmm-about">
        This widget tracks quarterly population estimates using publicly available data
        tables, which are updated every three months to reflect natural growth and
        migration patterns. Disclaimer: This is an experimental tool and is not endorsed
        by Statistics Canada.
      </p>
      <p className="pmm-about pmm-about--example">
        A custom widget example — the kind of innovative media you can create with
        Canada&rsquo;s open data sources.
      </p>
      <p className="pmm-srcline">{SOURCE_LINE}</p>
      <a className="pmm-link" href={OFFICIAL_CLOCK_URL} target="_blank" rel="noopener noreferrer">
        View Canada&rsquo;s official population clock
      </a>
    </aside>
  );
}

/** The live estimate, floated over the pale misty circle in the cliff art.
 *  Renders nothing until data is ready (the card carries loading/error).
 *  Positioned by the host section's stylesheet; hidden on stacked mobile.
 *  `hidden` fades it out (e.g. while a taller slide covers its spot). */
export function PopulationMedallion({
  state,
  hidden = false,
}: {
  state: PopulationModelState;
  hidden?: boolean;
}) {
  useSecondTick(state.kind === "ready");
  if (state.kind !== "ready") return null;
  const reading = readModel(state.data);
  return (
    <div className={`pmm-medallion${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <div className="pmm-med-label">Estimated modelled population</div>
      <div className="pmm-med-value">{formatPersons(reading.currentPopulation)}</div>
      <div className="pmm-med-delta">
        (a change of{" "}
        <span className={`pmm-delta-num${reading.changeSinceMidnight < 0 ? " is-down" : ""}`}>
          {formatSignedPersons(reading.changeSinceMidnight)}
        </span>{" "}
        since midnight)
      </div>
    </div>
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
              {state.data.rateBasis === "components"
                ? "births, deaths and international migration, latest four quarters"
                : "year-over-year change in the quarterly estimate"}
              {" · "}
              {state.data.sourceTables.join(", ")}
            </dd>
          </div>
        </dl>
      )}
      <p className="pmm-sources-line">{SOURCE_LINE}</p>
    </div>
  );
}
