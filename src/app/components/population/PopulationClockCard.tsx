// PopulationClockCard — "Humans of Canada • Real-Time Population [Ooo! Mini-Model]".
// A compact, self-contained population-clock-style card: latest StatCan base
// estimate + a net-change-per-second rate derived from public aggregate
// tables (see statcanClient.ts). NOT the official StatCan clock, and says so.
//
// Two pieces share one data load so the white panel stays uncluttered:
//   <PopulationClockCard>   — the card itself (title, live number, blurb, link)
//   <PopulationSourcesStrip> — meta rows + full attribution, rendered as small
//                              text BELOW the section, outside the panel.
// Wire them with usePopulationModel() in the parent.

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

/** One fetch shared by the card and the sources strip. */
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

export function PopulationClockCard({
  state,
  wide = false,
}: {
  state: PopulationModelState;
  wide?: boolean;
}) {
  // A tick counter drives the once-per-second re-render; values are always
  // recomputed from the wall clock, so ticks can't drift or accumulate error.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (state.kind !== "ready") return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [state.kind]);

  return (
    <aside
      className={`pmm-card${wide ? " pmm-card--wide" : ""}`}
      aria-label="Humans of Canada — real-time population mini model"
    >
      <h3 className="pmm-title">
        <span className="pmm-kicker">Humans of Canada</span>
        <span aria-hidden="true"> • </span>
        Real-Time Population <span className="pmm-tag">[Ooo!&nbsp;Mini-Model]</span>
      </h3>

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

      {state.kind === "ready" && <Readout data={state.data} />}

      <p className="pmm-blurb">
        <strong>Ooo! Pop Clock</strong> – This widget tracks quarterly population estimates
        using publicly available data tables, which are updated every three months to
        reflect natural growth and migration patterns. Disclaimer: This is an experimental
        tool and is not endorsed by Statistics Canada.
      </p>
      <a className="pmm-link" href={OFFICIAL_CLOCK_URL} target="_blank" rel="noopener noreferrer">
        View Canada&rsquo;s official population clock
      </a>
    </aside>
  );
}

function Readout({ data }: { data: PopulationModelData }) {
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
