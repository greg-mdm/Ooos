// statcanClient.ts — Statistics Canada Web Data Service (WDS) client for the
// population mini model. Fetches public aggregate tables only (no microdata).
//
// WDS docs: https://www.statcan.gc.ca/en/developers/wds
//
// Strategy:
//   * Headline rate — the change in the Canada population series itself
//     (table 17-10-0009-01): latest estimate minus the estimate a year earlier
//     (or the latest quarter annualised; see CONFIG.rateWindow). Self-consistent
//     by definition — it captures every component exactly as StatCan published
//     the totals (interprovincial migration nets to ~0 nationally, so table
//     17-10-0045-01 never enters the national figure), so the projection tracks
//     the official clock instead of drifting the way a raw component sum does.
//   * Ring visuals — the latest 4 quarters of births/deaths (table 17-10-0059-01)
//     and immigrants/emigrants (table 17-10-0040-01) give the differentiated
//     tick rates; the NPR / net-migration drift stream carries the residual so
//     the rings always reconcile to the headline.
//   * If the population series is too short to derive a rate, fall back to the
//     raw component sum; if nothing can be fetched (and no fresh-enough cache
//     exists) the caller gets a thrown error and must show the error state —
//     never fake data.
//
// Cube coordinates are DISCOVERED at runtime from getCubeMetadata by matching
// English member names, so nothing here hard-codes vector IDs. Once exact
// vector IDs are confirmed, set them in CONFIG.vectorOverrides and the client
// will use getDataFromVectorsAndLatestNPeriods instead of the metadata round trip.

export interface PopulationModelData {
  /** Latest Canada population estimate (persons). */
  basePopulation: number;
  /** Reference date of the base estimate, e.g. "2026-04-01". */
  baseReferenceDate: string;
  /** When the model is anchored to an official-clock snapshot, the precise
   *  instant (epoch ms) it was captured — the projection extrapolates from here
   *  instead of the quarterly reference date, so it only ever moves a short hop
   *  from a real official reading. Absent when running purely off WDS data. */
  baseReferenceTimeMs?: number;
  /** Derived net change over one year (persons) — drives the headline projection. */
  annualNetChange: number;
  /** annualNetChange / seconds in a year. */
  netChangePerSecond: number;
  /** How the headline net rate was derived. "official-snapshot" = re-based to a
   *  calibration snapshot of StatCan's population clock (tightest alignment).
   *  "population-yoy" = the change in the same quarterly population series the
   *  base comes from (self-consistent — captures every component, so the
   *  projection tracks the official clock rather than drifting). "components-*" =
   *  the raw component sum, used only when the series is too short for a rate. */
  rateBasis: "official-snapshot" | "population-yoy" | "components-live" | "components-reference";
  /** Annual component rates (persons/yr) that drive the differentiated rings.
   *  births − deaths + immigrants − emigrants + NPR always sums to
   *  `annualNetChange`, so the rings reconcile to the headline. births / deaths /
   *  immigrants / emigrants are live per field from the component tables when
   *  their members resolve (else the StatCan reference rates below); the NPR /
   *  net-migration drift stream carries the reconciling residual — the terms a
   *  raw component sum drops (returning emigrants, net temporary emigration,
   *  residual deviation) plus net non-permanent residents. (Interprovincial
   *  migration is omitted — it nets to ~0 nationally.) */
  components: {
    births: number;
    deaths: number;
    immigrants: number;
    emigrants: number;
    netNonPermanentResidents: number;
  };
  /** True when all five component rates came from this fetch (not reference). */
  componentsLive: boolean;
  /** StatCan tables actually used for this payload. */
  sourceTables: string[];
  /** ISO timestamp of when this data was fetched from StatCan. */
  fetchedAt: string;
}

// StatCan-grounded annual component rates (persons/yr), used per field only
// when the live members don't resolve. Sourced from Statistics Canada
// quarterly components (tables 17-10-0059 / 17-10-0040), 2025–2026:
//   births ≈ 351,000 · deaths ≈ 318,600 · immigrants ≈ 337,000 ·
//   emigrants ≈ 62,000 (subtracted) · net non-permanent residents ≈ −450,000
// (the 2025–26 temporary-resident drawdown). These sum to ≈ −142,600/yr, a
// slight decline — consistent with StatCan's own −0.1%/quarter model.
export const REFERENCE_COMPONENTS = {
  births: 351000,
  deaths: 318600,
  immigrants: 337000,
  emigrants: 62000,
  netNonPermanentResidents: -450000,
};

export const CONFIG = {
  wdsBase: "https://www150.statcan.gc.ca/t1/wds/rest",
  products: {
    /** 17-10-0009-01 — Population estimates, quarterly */
    population: 17100009,
    /** 17-10-0059-01 — Components of natural increase, quarterly */
    naturalIncrease: 17100059,
    /** 17-10-0040-01 — Components of international migration, quarterly */
    internationalMigration: 17100040,
    // 17-10-0045-01 (interprovincial migrants) is intentionally unused for the
    // national total — moves between provinces net to ~0 for Canada.
  },
  /**
   * Optional fast path: once exact vector IDs are confirmed against the WDS
   * (e.g. via getSeriesInfoFromCubePidCoord), fill these in and the client
   * skips metadata discovery. Leave null to keep runtime discovery.
   */
  vectorOverrides: {
    population: null as number | null,          // Canada, 17-10-0009-01
    births: null as number | null,              // Canada, 17-10-0059-01
    deaths: null as number | null,              // Canada, 17-10-0059-01
    immigrants: null as number | null,          // Canada, 17-10-0040-01
    emigrants: null as number | null,
    returningEmigrants: null as number | null,
    netTemporaryEmigration: null as number | null,
    netNonPermanentResidents: null as number | null,
  },
  /**
   * How the headline annual rate is derived from the quarterly population series:
   *   "year"    — trailing four-quarter change (seasonally complete, low noise).
   *   "quarter" — most recent quarter-over-quarter change × 4 (tracks current
   *               momentum more sharply, e.g. the 2025–26 temporary-resident
   *               drawdown, but is seasonally noisier).
   * "year" is the robust default. Flip to "quarter" if the widget still reads
   * high versus StatCan's clock (their clock leans on recent-period momentum).
   */
  rateWindow: "year" as "year" | "quarter",
  /**
   * Optional same-origin calibration snapshot (public/pop-clock/calibration.json).
   * When present, enabled and fresh, the widget re-bases its projection to that
   * official-clock reading so it only extrapolates the short time since the
   * snapshot — the failsafe that keeps the headline within a minimal margin of
   * StatCan's clock. Absent/disabled/stale → the WDS year-over-year rate is used.
   */
  calibrationUrl: "pop-clock/calibration.json",
  /** Snapshots older than this are ignored (the extrapolation hop grew too long). */
  calibrationMaxAgeMs: 21 * 24 * 60 * 60 * 1000,
  cacheKey: "ooos-population-mini-model-v3",
  /** Quarterly data — refetch at most daily. */
  cacheTtlMs: 24 * 60 * 60 * 1000,
  /** A stale cache older than this is not shown; error state instead. */
  cacheMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  requestTimeoutMs: 15000,
};

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;

// English member names to look up in each cube's metadata (case-insensitive).
const MEMBER_NAMES = {
  geography: "canada",
  naturalIncrease: { births: "births", deaths: "deaths" },
  migration: {
    immigrants: "immigrants",
    emigrants: "emigrants",
    returningEmigrants: "returning emigrants",
    netTemporaryEmigration: "net temporary emigration",
    netNonPermanentResidents: "net non-permanent residents",
  },
} as const;

// ---------------------------------------------------------------- WDS types
interface WdsDimension {
  dimensionNameEn: string;
  dimensionPositionId: number;
  member: { memberId: number; memberNameEn: string }[];
}
interface WdsMetadataObject {
  productId: number;
  dimension: WdsDimension[];
}
interface WdsDataPoint {
  refPer: string;
  value: number | null;
}
interface WdsSeriesObject {
  vectorDataPoint: WdsDataPoint[];
}
interface WdsEnvelope<T> {
  status: string;
  object: T;
}

// ---------------------------------------------------------------- fetch util
async function wdsPost<T>(method: string, body: unknown): Promise<WdsEnvelope<T>[]> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs);
  try {
    const res = await fetch(`${CONFIG.wdsBase}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`WDS ${method} responded ${res.status}`);
    const json = (await res.json()) as WdsEnvelope<T>[];
    if (!Array.isArray(json)) throw new Error(`WDS ${method} returned a non-array payload`);
    return json;
  } finally {
    window.clearTimeout(timer);
  }
}

function successObject<T>(env: WdsEnvelope<T> | undefined, what: string): T {
  if (!env || env.status !== "SUCCESS" || !env.object) {
    throw new Error(`WDS did not return ${what}`);
  }
  return env.object;
}

// --------------------------------------------------------- coordinate lookup
function findMemberId(dims: WdsDimension[], dimMatch: RegExp, memberName: string): number | null {
  const dim = dims.find((d) => dimMatch.test(d.dimensionNameEn));
  if (!dim) return null;
  const member = dim.member.find(
    (m) => m.memberNameEn.trim().toLowerCase() === memberName.toLowerCase(),
  );
  return member ? member.memberId : null;
}

/** WDS coordinates are 10 dot-separated member IDs, zero-padded. */
function coordinate(dims: WdsDimension[], memberByDimension: Map<number, number>): string {
  const slots = new Array<number>(10).fill(0);
  for (const [positionId, memberId] of memberByDimension) {
    slots[positionId - 1] = memberId;
  }
  return slots.join(".");
}

function buildCoordinate(
  meta: WdsMetadataObject,
  componentDimMatch: RegExp | null,
  componentName: string | null,
): string | null {
  const geoDim = meta.dimension.find((d) => /geograph/i.test(d.dimensionNameEn));
  if (!geoDim) return null;
  const geoId = findMemberId(meta.dimension, /geograph/i, MEMBER_NAMES.geography);
  if (geoId == null) return null;

  const picks = new Map<number, number>([[geoDim.dimensionPositionId, geoId]]);
  if (componentDimMatch && componentName) {
    const compDim = meta.dimension.find((d) => componentDimMatch.test(d.dimensionNameEn));
    if (!compDim) return null;
    const compId = findMemberId(meta.dimension, componentDimMatch, componentName);
    if (compId == null) return null;
    picks.set(compDim.dimensionPositionId, compId);
  }
  return coordinate(meta.dimension, picks);
}

// ----------------------------------------------------------------- data pull
interface Series {
  points: WdsDataPoint[];
}

function sumLatest(points: WdsDataPoint[], n: number): number | null {
  const usable = points.filter((p) => p.value != null).slice(-n);
  if (usable.length < n) return null;
  return usable.reduce((acc, p) => acc + (p.value as number), 0);
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Guardrail: keep the primary series rate unless it is an outlier versus the
 * other independent estimates (year-over-year, latest-quarter-annualised,
 * component sum), in which case use their median — robust to any single bad
 * source, e.g. a lagging component vintage. The tolerance is generous so this
 * only trips on a genuinely divergent source, not normal quarterly variation.
 */
function guardRate(primary: number, candidates: number[]): number {
  if (candidates.length < 2) return primary;
  const med = median(candidates);
  const tol = Math.max(150000, Math.abs(med) * 0.6);
  return Math.abs(primary - med) > tol ? med : primary;
}

// ---------------------------------------------------------- calibration anchor
interface CalibrationAnchor {
  enabled?: boolean;
  population?: number | null;
  capturedAt?: string | null;
  ratePerSecond?: number | null;
}

/**
 * Fetch the optional same-origin calibration snapshot. Returns a validated,
 * fresh anchor or null (absent, disabled, malformed, stale or future-dated) —
 * any of which safely falls back to the WDS-derived model. Same-origin, so no
 * CORS; never touches statcan.gc.ca directly.
 */
async function fetchCalibration(): Promise<{
  population: number;
  capturedAtMs: number;
  ratePerSecond: number | null;
} | null> {
  try {
    const base = import.meta.env.BASE_URL ?? "/";
    const res = await fetch(`${base}${CONFIG.calibrationUrl}`, { cache: "no-store" });
    if (!res.ok) return null;
    const j = (await res.json()) as CalibrationAnchor;
    if (!j || j.enabled === false) return null;
    if (typeof j.population !== "number" || !isFinite(j.population) || j.population <= 0) return null;
    const capturedAtMs = Date.parse(String(j.capturedAt));
    if (isNaN(capturedAtMs)) return null;
    const now = Date.now();
    if (now - capturedAtMs > CONFIG.calibrationMaxAgeMs) return null; // too stale to trust
    if (capturedAtMs > now + 60 * 60 * 1000) return null; // future-dated → ignore
    const ratePerSecond =
      typeof j.ratePerSecond === "number" && isFinite(j.ratePerSecond) ? j.ratePerSecond : null;
    return { population: j.population, capturedAtMs, ratePerSecond };
  } catch {
    return null;
  }
}

async function fetchByVectors(
  requests: { vectorId: number; latestN: number }[],
): Promise<Series[]> {
  const res = await wdsPost<WdsSeriesObject>("getDataFromVectorsAndLatestNPeriods", requests);
  return requests.map((_, i) => ({
    points: successObject(res[i], `vector data (#${i})`).vectorDataPoint ?? [],
  }));
}

async function fetchByCoordinates(
  requests: { productId: number; coordinate: string; latestN: number }[],
): Promise<Series[]> {
  const res = await wdsPost<WdsSeriesObject>("getDataFromCubePidCoordAndLatestNPeriods", requests);
  return requests.map((_, i) => ({
    points: successObject(res[i], `cube data (#${i})`).vectorDataPoint ?? [],
  }));
}

async function fetchCubeMetadata(productIds: number[]): Promise<Map<number, WdsMetadataObject>> {
  const res = await wdsPost<WdsMetadataObject>(
    "getCubeMetadata",
    productIds.map((productId) => ({ productId })),
  );
  const map = new Map<number, WdsMetadataObject>();
  for (const env of res) {
    if (env.status === "SUCCESS" && env.object) map.set(Number(env.object.productId), env.object);
  }
  return map;
}

// ------------------------------------------------------------------- assembly
function tableRef(productId: number): string {
  const s = String(productId); // 17100009 -> 17-10-0009-01
  return `${s.slice(0, 2)}-${s.slice(2, 4)}-${s.slice(4)}-01`;
}

async function fetchFromWds(): Promise<PopulationModelData> {
  // Kick off the calibration snapshot in parallel with the WDS round-trips.
  const calibrationPromise = fetchCalibration();
  const v = CONFIG.vectorOverrides;
  const componentKeys = [
    "births",
    "deaths",
    "immigrants",
    "emigrants",
    "returningEmigrants",
    "netTemporaryEmigration",
    "netNonPermanentResidents",
  ] as const;

  let population: Series;
  let components: Partial<Record<(typeof componentKeys)[number], Series>> = {};

  const allVectorsKnown = v.population != null && componentKeys.every((k) => v[k] != null);

  if (allVectorsKnown) {
    // Fast path — confirmed vector IDs.
    const series = await fetchByVectors([
      { vectorId: v.population as number, latestN: 6 },
      ...componentKeys.map((k) => ({ vectorId: v[k] as number, latestN: 4 })),
    ]);
    population = series[0];
    componentKeys.forEach((k, i) => (components[k] = series[i + 1]));
  } else {
    // Discovery path — resolve coordinates from cube metadata by member name.
    const meta = await fetchCubeMetadata([
      CONFIG.products.population,
      CONFIG.products.naturalIncrease,
      CONFIG.products.internationalMigration,
    ]);

    const popMeta = meta.get(CONFIG.products.population);
    if (!popMeta) throw new Error("Population cube metadata unavailable");
    const popCoord = buildCoordinate(popMeta, null, null);
    if (!popCoord) throw new Error("Could not resolve the Canada population coordinate");

    const requests: { productId: number; coordinate: string; latestN: number }[] = [
      { productId: CONFIG.products.population, coordinate: popCoord, latestN: 6 },
    ];
    const requestKeys: ((typeof componentKeys)[number] | "population")[] = ["population"];

    const natMeta = meta.get(CONFIG.products.naturalIncrease);
    const migMeta = meta.get(CONFIG.products.internationalMigration);
    const compDim = /component|estimate/i;

    if (natMeta) {
      for (const [key, name] of Object.entries(MEMBER_NAMES.naturalIncrease)) {
        const coord = buildCoordinate(natMeta, compDim, name);
        if (coord) {
          requests.push({ productId: CONFIG.products.naturalIncrease, coordinate: coord, latestN: 4 });
          requestKeys.push(key as (typeof componentKeys)[number]);
        }
      }
    }
    if (migMeta) {
      for (const [key, name] of Object.entries(MEMBER_NAMES.migration)) {
        const coord = buildCoordinate(migMeta, compDim, name);
        if (coord) {
          requests.push({ productId: CONFIG.products.internationalMigration, coordinate: coord, latestN: 4 });
          requestKeys.push(key as (typeof componentKeys)[number]);
        }
      }
    }

    const series = await fetchByCoordinates(requests);
    population = series[0];
    requestKeys.forEach((key, i) => {
      if (key !== "population") components[key] = series[i];
    });
  }

  // ---- base population -----------------------------------------------------
  const popPoints = population.points.filter((p) => p.value != null);
  if (popPoints.length === 0) throw new Error("No population estimate values returned");
  const latest = popPoints[popPoints.length - 1];
  const basePopulation = latest.value as number;
  const baseReferenceDate = latest.refPer;

  // ---- component sums (full pass — no short-circuit, so each stream resolves
  //      independently) — these drive the ring VISUALS. ------------------------
  const sums: Partial<Record<(typeof componentKeys)[number], number>> = {};
  for (const k of componentKeys) {
    const s = components[k];
    if (!s) continue;
    const total = sumLatest(s.points, 4);
    if (total != null) sums[k] = total;
  }

  // Live per field where the members resolve, else the StatCan reference rate.
  const eventKeys = ["births", "deaths", "immigrants", "emigrants"] as const;
  const componentsLive = eventKeys.every((k) => sums[k] != null);
  const comp = {
    births: sums.births ?? REFERENCE_COMPONENTS.births,
    deaths: sums.deaths ?? REFERENCE_COMPONENTS.deaths,
    immigrants: sums.immigrants ?? REFERENCE_COMPONENTS.immigrants,
    emigrants: sums.emigrants ?? REFERENCE_COMPONENTS.emigrants,
    netNonPermanentResidents:
      sums.netNonPermanentResidents ?? REFERENCE_COMPONENTS.netNonPermanentResidents,
  };

  // ---- headline rate: derived from the population SERIES (self-consistent with
  //      the base), then cross-checked against independent estimates. -----------
  //   year     → trailing four quarters (popPoints[-1] − popPoints[-5])
  //   quarter  → latest quarter annualised ((popPoints[-1] − popPoints[-2]) × 4)
  //   component→ raw component sum (least trustworthy; can lag a vintage)
  const rateYear =
    popPoints.length >= 5 ? basePopulation - (popPoints[popPoints.length - 5].value as number) : null;
  const rateQuarter =
    popPoints.length >= 2
      ? (basePopulation - (popPoints[popPoints.length - 2].value as number)) * 4
      : null;
  const rateComponents = componentsLive
    ? comp.births - comp.deaths + comp.immigrants - comp.emigrants + comp.netNonPermanentResidents
    : null;

  const primaryRate =
    CONFIG.rateWindow === "quarter" ? (rateQuarter ?? rateYear) : (rateYear ?? rateQuarter);

  // Pick the authoritative annual net + reconcile the rings to it.
  let annualNetChange: number;
  let rateBasis: PopulationModelData["rateBasis"];
  if (primaryRate != null) {
    // Guardrail: reject an outlier primary in favour of the median of the
    // independent estimates. Normally a no-op — the failsafe against one bad
    // source silently poisoning the projection (the 24.7k-drift bug's cause).
    const candidates = [rateYear, rateQuarter, rateComponents].filter(
      (x): x is number => x != null && isFinite(x),
    );
    annualNetChange = guardRate(primaryRate, candidates);
    rateBasis = "population-yoy";
    // Keep births/deaths/immigrants/emigrants as the live (or reference) tick
    // rates; the NPR / net-migration drift ring carries the residual so the five
    // streams sum exactly to the headline (folding in returning emigrants, net
    // temporary emigration and residual deviation — the terms a raw sum drops).
    comp.netNonPermanentResidents =
      annualNetChange - (comp.births - comp.deaths + comp.immigrants - comp.emigrants);
  } else {
    // Fallback: no usable population series — sum the components directly.
    annualNetChange =
      comp.births - comp.deaths + comp.immigrants - comp.emigrants + comp.netNonPermanentResidents;
    rateBasis = componentsLive ? "components-live" : "components-reference";
  }

  const sourceTables = componentsLive
    ? [
        tableRef(CONFIG.products.population),
        tableRef(CONFIG.products.naturalIncrease),
        tableRef(CONFIG.products.internationalMigration),
      ]
    : [tableRef(CONFIG.products.population)];

  // ---- calibration overlay: pin to an official-clock snapshot when present. --
  //      Re-bases the projection to a real official reading captured at a known
  //      instant, so the headline only ever extrapolates the short hop since —
  //      the failsafe that keeps it within a minimal margin of StatCan's clock.
  let effectiveBasePopulation = basePopulation;
  let baseReferenceTimeMs: number | undefined;
  let effectiveAnnualNetChange = annualNetChange;
  const calibration = await calibrationPromise;
  if (calibration) {
    effectiveBasePopulation = calibration.population;
    baseReferenceTimeMs = calibration.capturedAtMs;
    rateBasis = "official-snapshot";
    if (calibration.ratePerSecond != null) {
      // The snapshot also pins the rate — re-reconcile the rings to it.
      effectiveAnnualNetChange = calibration.ratePerSecond * SECONDS_PER_YEAR;
      comp.netNonPermanentResidents =
        effectiveAnnualNetChange - (comp.births - comp.deaths + comp.immigrants - comp.emigrants);
    }
  }

  return {
    basePopulation: effectiveBasePopulation,
    baseReferenceDate,
    baseReferenceTimeMs,
    annualNetChange: effectiveAnnualNetChange,
    netChangePerSecond: effectiveAnnualNetChange / SECONDS_PER_YEAR,
    rateBasis,
    components: comp,
    componentsLive,
    sourceTables,
    fetchedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------------- caching
interface CachedPayload {
  data: PopulationModelData;
  cachedAt: number;
}

function readCache(): CachedPayload | null {
  try {
    const raw = window.localStorage.getItem(CONFIG.cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (!parsed?.data || typeof parsed.cachedAt !== "number") return null;
    if (typeof parsed.data.basePopulation !== "number" || !isFinite(parsed.data.netChangePerSecond)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: PopulationModelData): void {
  try {
    window.localStorage.setItem(CONFIG.cacheKey, JSON.stringify({ data, cachedAt: Date.now() }));
  } catch {
    // localStorage unavailable (private mode/quota) — caching is best-effort.
  }
}

/**
 * Load the mini-model inputs: fresh cache if available, otherwise fetch from
 * the StatCan WDS (writing the cache), otherwise a not-too-stale cache.
 * Throws when no trustworthy data can be produced — callers must then render
 * the error state, never a fabricated number.
 */
export async function loadPopulationModelData(): Promise<PopulationModelData> {
  const cached = readCache();
  if (cached && Date.now() - cached.cachedAt < CONFIG.cacheTtlMs) {
    return cached.data;
  }
  try {
    const fresh = await fetchFromWds();
    writeCache(fresh);
    return fresh;
  } catch (err) {
    // Fetch failed — a recent cache (visible via its fetchedAt stamp) beats an
    // error card, but anything older than cacheMaxAgeMs is refused.
    if (cached && Date.now() - cached.cachedAt < CONFIG.cacheMaxAgeMs) {
      return cached.data;
    }
    throw err instanceof Error ? err : new Error("Statistics Canada data could not be loaded");
  }
}
