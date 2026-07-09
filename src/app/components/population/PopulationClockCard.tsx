// PopulationClockCard — "Canada population, real-time mini model".
// A compact, self-contained population-clock-style card: latest StatCan base
// estimate + a net-change-per-second rate derived from public aggregate
// tables (see statcanClient.ts). NOT the official StatCan clock, and says so.

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

type State =
  | { kind: "loading" }
  | { kind: "ready"; data: PopulationModelData }
  | { kind: "error" };

export function PopulationClockCard({ wide = false }: { wide?: boolean }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  // A tick counter drives the once-per-second re-render; values are always
  // recomputed from the wall clock, so ticks can't drift or accumulate error.
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadPopulationModelData()
      .then((data) => !cancelled && setState({ kind: "ready", data }))
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.kind !== "ready") return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [state.kind]);

  return (
    <aside className={`pmm-card${wide ? " pmm-card--wide" : ""}`} aria-label="Canada population, real-time mini model">
      <h3 className="pmm-title">Canada population, real-time mini model</h3>

      {state.kind === "loading" && (
        <div className="pmm-body">
          <p className="pmm-status" role="status">
            Loading the latest Statistics Canada estimates…
          </p>
        </div>
      )}

      {state.kind === "error" && (
        <div className="pmm-body">
          <p className="pmm-status pmm-status--error" role="status">
            Latest Statistics Canada data could not be loaded.
          </p>
        </div>
      )}

      {state.kind === "ready" && <Readout data={state.data} />}

      <p className="pmm-note">
        Mini model based on public Statistics Canada tables; not the official StatCan clock.
      </p>
      <p className="pmm-source">{SOURCE_LINE}</p>
      <a className="pmm-link" href={OFFICIAL_CLOCK_URL} target="_blank" rel="noopener noreferrer">
        View official Statistics Canada population clock
      </a>
    </aside>
  );
}

function Readout({ data }: { data: PopulationModelData }) {
  const reading = readModel(data);
  const refreshed = new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(
    new Date(data.fetchedAt),
  );
  return (
    <div className="pmm-body pmm-body--ready">
      <div className="pmm-figure">
        <div className="pmm-label">Estimated modelled population</div>
        {/* Recomputed every second — intentionally NOT an aria-live region, so
            screen readers aren't spammed; the value reads out on focus/pass. */}
        <div className="pmm-value">{formatPersons(reading.currentPopulation)}</div>
        <div className="pmm-delta">
          <span
            className={`pmm-delta-num${reading.changeSinceMidnight < 0 ? " is-down" : ""}`}
          >
            {formatSignedPersons(reading.changeSinceMidnight)}
          </span>{" "}
          change since midnight
        </div>
      </div>
      <dl className="pmm-meta">
        <div>
          <dt>Base estimate reference period</dt>
          <dd>{formatReferenceDate(data.baseReferenceDate)}</dd>
        </div>
        <div>
          <dt>Last StatCan data refresh</dt>
          <dd>{refreshed}</dd>
        </div>
        <div>
          <dt>Rate basis</dt>
          <dd>
            {data.rateBasis === "components"
              ? "births, deaths and international migration, latest four quarters"
              : "year-over-year change in the quarterly estimate"}
            {" · "}
            {data.sourceTables.join(", ")}
          </dd>
        </div>
      </dl>
    </div>
  );
}
