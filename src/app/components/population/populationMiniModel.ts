// populationMiniModel.ts — pure math for the population mini model.
// No fetching, no DOM: given the normalized StatCan inputs and a clock time,
// produce the displayed values. Kept separate so it stays trivially testable
// and so the data layer can be swapped without touching the model.

import type { PopulationModelData } from "./statcanClient";

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;

/** add = green (grows the population), subtract = coral (shrinks it). */
export type RingKind = "add" | "subtract";
/** event = a discrete stream that ticks toward the next event and resets;
 *  drift = a net quantity that has no single "events" (shown as daily drift). */
export type RingMode = "event" | "drift";

export interface RingReading {
  key: string;
  label: string;
  kind: RingKind;
  mode: RingMode;
  /** event streams: seconds between modelled events (drives the fill + reset). */
  intervalSeconds: number | null;
  /** event: events since midnight; drift: |net| since midnight. */
  count: number;
  /** signed contribution since midnight — the rings sum to changeSinceMidnight. */
  signedNet: number;
}

export interface MiniModelReading {
  /** Modelled population at `now`, rounded to whole persons. */
  currentPopulation: number;
  /** Net change since local midnight — the day's move since the open. Equals
   *  the sum of the rings' signed contributions, so they always reconcile. */
  changeSinceMidnight: number;
  /** Seconds elapsed since the viewer's local midnight. */
  secondsSinceMidnight: number;
  /** The five differentiated streams, in display order. */
  rings: RingReading[];
}

/**
 * Quarterly estimate reference dates ("2026-04-01") describe a population on
 * that calendar date; anchor the model at UTC midnight of that date.
 */
export function baseReferenceTime(data: PopulationModelData): number {
  const t = Date.parse(`${data.baseReferenceDate}T00:00:00Z`);
  return isNaN(t) ? Date.parse(data.fetchedAt) : t;
}

/** Local midnight (the ticker's "open") for a given clock time. */
export function localMidnight(now: number): number {
  const m = new Date(now);
  m.setHours(0, 0, 0, 0);
  return m.getTime();
}

function eventRing(
  key: string,
  label: string,
  kind: RingKind,
  ratePerYear: number,
  secondsSinceMidnight: number,
): RingReading {
  const intervalSeconds = SECONDS_PER_YEAR / ratePerYear;
  const count = Math.floor(secondsSinceMidnight / intervalSeconds);
  return {
    key,
    label,
    kind,
    mode: "event",
    intervalSeconds,
    count,
    signedNet: kind === "subtract" ? -count : count,
  };
}

function driftRing(
  key: string,
  label: string,
  ratePerYear: number,
  secondsSinceMidnight: number,
): RingReading {
  // ratePerYear may be negative (a net outflow, e.g. NPR drawdown).
  const signedNet = Math.round((secondsSinceMidnight * ratePerYear) / SECONDS_PER_YEAR);
  return {
    key,
    label,
    kind: signedNet <= 0 ? "subtract" : "add",
    mode: "drift",
    intervalSeconds: null,
    count: Math.abs(signedNet),
    signedNet,
  };
}

export function readModel(data: PopulationModelData, now: number = Date.now()): MiniModelReading {
  const elapsedSeconds = Math.max(0, (now - baseReferenceTime(data)) / 1000);
  const secondsSinceMidnight = Math.max(0, (now - localMidnight(now)) / 1000);
  const c = data.components;

  const rings: RingReading[] = [
    eventRing("births", "Births", "add", c.births, secondsSinceMidnight),
    eventRing("deaths", "Deaths", "subtract", c.deaths, secondsSinceMidnight),
    eventRing("immigrants", "Immigrants", "add", c.immigrants, secondsSinceMidnight),
    // emigrants are modelled as a net outflow, not single events → drift
    driftRing("emigrants", "Emigrants", -Math.abs(c.emigrants), secondsSinceMidnight),
    driftRing("npr", "NPR", c.netNonPermanentResidents, secondsSinceMidnight),
  ];

  // The headline reconciles exactly with the rings.
  const changeSinceMidnight = rings.reduce((acc, r) => acc + r.signedNet, 0);

  return {
    currentPopulation: Math.round(data.basePopulation + elapsedSeconds * data.netChangePerSecond),
    changeSinceMidnight,
    secondsSinceMidnight,
    rings,
  };
}

/** 41449728 -> "41 449 728" (thin spaces between groups, clock-style). */
export function formatSpaced(n: number): string {
  return formatPersons(n).replace(/,/g, " ");
}

/** 41417056 -> "41,417,056" (en-CA grouping). */
export function formatPersons(n: number): string {
  return new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(n);
}

/** Absolute magnitude with grouping, no sign (paired with an ▲/▼ arrow). */
export function formatMagnitude(n: number): string {
  return formatPersons(Math.abs(n));
}

/** "2026-04-01" -> "April 1, 2026" (falls back to the raw string). */
export function formatReferenceDate(isoDate: string): string {
  const t = Date.parse(`${isoDate}T00:00:00Z`);
  if (isNaN(t)) return isoDate;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(t);
}
