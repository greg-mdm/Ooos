// populationMiniModel.ts — pure math for the population mini model.
// No fetching, no DOM: given the normalized StatCan inputs and a clock time,
// produce the displayed values. Kept separate so it stays trivially testable
// and so the data layer can be swapped without touching the model.

import type { PopulationModelData } from "./statcanClient";

export interface MiniModelReading {
  /** Modelled population at `now`, rounded to whole persons. */
  currentPopulation: number;
  /** Modelled change since the viewer's local midnight, whole persons. */
  changeSinceMidnight: number;
}

/**
 * Quarterly estimate reference dates ("2026-04-01") describe a population on
 * that calendar date; anchor the model at UTC midnight of that date.
 */
export function baseReferenceTime(data: PopulationModelData): number {
  const t = Date.parse(`${data.baseReferenceDate}T00:00:00Z`);
  return isNaN(t) ? Date.parse(data.fetchedAt) : t;
}

export function readModel(data: PopulationModelData, now: number = Date.now()): MiniModelReading {
  const elapsedSeconds = Math.max(0, (now - baseReferenceTime(data)) / 1000);

  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0); // viewer's local midnight
  const secondsSinceMidnight = Math.max(0, (now - midnight.getTime()) / 1000);

  return {
    currentPopulation: Math.round(data.basePopulation + elapsedSeconds * data.netChangePerSecond),
    changeSinceMidnight: Math.round(secondsSinceMidnight * data.netChangePerSecond),
  };
}

/** 41417056 -> "41,417,056" (en-CA grouping). */
export function formatPersons(n: number): string {
  return new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(n);
}

/** Signed variant for the change-since-midnight figure: "+1,234" / "−87". */
export function formatSignedPersons(n: number): string {
  const abs = formatPersons(Math.abs(n));
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`; // true minus sign
  return abs;
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
