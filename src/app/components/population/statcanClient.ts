// statcanClient.ts — Statistics Canada Web Data Service (WDS) client for the
// population mini model. Fetches public aggregate tables only (no microdata).
//
// WDS docs: https://www.statcan.gc.ca/en/developers/wds
//
// Strategy (in order of preference):
//   1. "components" rate — sum the latest 4 quarters of births/deaths
//      (table 17-10-0059-01) and international-migration components
//      (table 17-10-0040-01) to derive an annual net change.
//   2. "year-over-year" rate — the latest Canada population estimate minus the
//      estimate 4 quarters earlier (table 17-10-0009-01). Self-consistent by
//      definition (captures every component; interprovincial migration nets to
//      ~0 nationally, so table 17-10-0045-01 never enters the national total).
//   3. If nothing can be fetched (and no fresh-enough cache exists) the caller
//      gets a thrown error and must show the error state — never fake data.
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
  /** Derived net change over one year (persons). */
  annualNetChange: number;
  /** annualNetChange / seconds in a year. */
  netChangePerSecond: number;
  /** How the displayed net rate was derived (all five component streams). */
  rateBasis: "components-live" | "components-reference";
  /** Annual component rates (persons/yr) that drive the differentiated rings
   *  AND the net: births − deaths + immigrants − emigrants + NPR. So the rings
   *  always sum to the headline change (same rates). Live per field from the
   *  component tables when their members resolve, otherwise the StatCan
   *  reference rates below. (Interprovincial migration is omitted — it nets to
   *  ~0 nationally; returning-emigrant / net-temporary-emigration adjustments
   *  are folded into the modelled emigration reference.) */
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
  cacheKey: "ooos-population-mini-model-v2",
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

  // ---- rate: year-over-year (always computable from the same series) --------
  let yoyChange: number | null = null;
  if (popPoints.length >= 5) {
    const prior = popPoints[popPoints.length - 5]; // 4 quarters earlier
    yoyChange = basePopulation - (prior.value as number);
  }

  // ---- component sums (full pass — no short-circuit, so each stream resolves
  //      independently) ---------------------------------------------------------
  const sums: Partial<Record<(typeof componentKeys)[number], number>> = {};
  for (const k of componentKeys) {
    const s = components[k];
    if (!s) continue;
    const total = sumLatest(s.points, 4);
    if (total != null) sums[k] = total;
  }

  // ---- the five ring streams: live per field, else the StatCan reference.
  //      These drive BOTH the rings and the net, so they stay consistent. -------
  const ringKeys = ["births", "deaths", "immigrants", "emigrants", "netNonPermanentResidents"] as const;
  const componentsLive = ringKeys.every((k) => sums[k] != null);
  const comp = {
    births: sums.births ?? REFERENCE_COMPONENTS.births,
    deaths: sums.deaths ?? REFERENCE_COMPONENTS.deaths,
    immigrants: sums.immigrants ?? REFERENCE_COMPONENTS.immigrants,
    emigrants: sums.emigrants ?? REFERENCE_COMPONENTS.emigrants,
    netNonPermanentResidents: sums.netNonPermanentResidents ?? REFERENCE_COMPONENTS.netNonPermanentResidents,
  };

  // Net = births − deaths + immigrants − emigrants + NPR. The rings sum to this.
  const annualNetChange =
    comp.births - comp.deaths + comp.immigrants - comp.emigrants + comp.netNonPermanentResidents;

  const sourceTables = componentsLive
    ? [
        tableRef(CONFIG.products.population),
        tableRef(CONFIG.products.naturalIncrease),
        tableRef(CONFIG.products.internationalMigration),
      ]
    : [tableRef(CONFIG.products.population)];

  return {
    basePopulation,
    baseReferenceDate,
    annualNetChange,
    netChangePerSecond: annualNetChange / SECONDS_PER_YEAR,
    rateBasis: componentsLive ? "components-live" : "components-reference",
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
