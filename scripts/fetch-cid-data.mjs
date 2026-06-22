#!/usr/bin/env node
/**
 * fetch-cid-data.mjs — CID live-data pipeline (v1)
 *
 * Source of all data:
 *   Statistics Canada (StatCan) — Web Data Service (WDS), the public, no-key REST API.
 *   Base: https://www150.statcan.gc.ca/t1/wds/rest
 *   Licence: Open Government Licence (OGL) – Canada.
 *
 * Method: getDataFromCubePidCoordAndLatestNPeriods (one batched POST).
 *   We pull by Product ID (PID) + COORDINATE rather than by opaque vector, because
 *   coordinates are human-readable ("1.12.1" = Canada / after-tax income / all families)
 *   and stay valid when StatCan re-releases a table. The response still returns the
 *   vector + value, which we record for traceability.
 *
 * Runtime: Node 20+ (built-in global fetch). No dependencies.
 *
 * Usage:
 *   node scripts/fetch-cid-data.mjs           # live: calls StatCan WDS
 *   node scripts/fetch-cid-data.mjs --mock    # offline: embedded fixture (validated values)
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../public/cid/data/signals.json');

const WDS_BASE = 'https://www150.statcan.gc.ca/t1/wds/rest';
// Exact official attribution string required by the Open Government Licence (OGL) – Canada.
const ATTRIBUTION = 'Contains information licensed under the Open Government Licence – Canada';
const SOURCE = 'Statistics Canada — Web Data Service (WDS)';

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

/**
 * Signal definitions. Every value below was confirmed against the live StatCan
 * source on build day. `coordinate` is the StatCan dimension address (auto-padded
 * to 10 members). `program` surveys are spelled out in `programFull`.
 */
const SIGNALS = [
  {
    id: 'employment-ca',
    label: 'Employment, 15 years and over, seasonally adjusted — Canada',
    program: 'LFS',
    programFull: 'Labour Force Survey',
    table: '14-10-0287-03',
    pid: 14100287,
    coordinate: '1.3.1.1.1.1',    // Canada · Employment · total gender · 15+ · estimate · seasonally adjusted
    unit: 'count',
    uom: 'persons',
    frequency: 'Monthly',
    pestle: 'Economic',
    note: 'Stable PID, monthly — latestN self-advances every release (value is in thousands; scalar applied).',
  },
  {
    id: 'median-after-tax-income-ca',
    label: 'Median after-tax income, families and unattached individuals — Canada',
    program: 'CIS',
    programFull: 'Canadian Income Survey',
    table: '11-10-0190-01',
    pid: 11100190,
    coordinate: '1.12.1',         // Canada · median after-tax income · economic families + persons
    unit: 'dollars',
    uom: 'constant dollars',
    frequency: 'Annual',
    pestle: 'Economic',
    note: 'Stable PID — latestN self-advances each annual release.',
  },
  {
    id: 'internet-use-ca',
    label: 'Internet use, 15 years and over — Canada',
    program: 'CIUS',
    programFull: 'Canadian Internet Use Survey',
    table: '22-10-0135-01',
    pid: 22100135,
    coordinate: '1.1.1',          // Canada · internet use · total 15 years and over
    unit: 'percent',
    uom: 'percent',
    frequency: 'Occasional',
    pestle: 'Technological',
    note: 'Stable PID; survey runs roughly every two years.',
  },
];

/** Embedded fixture mirrors the WDS response shape; values verified on build day.
 *  scalarFactorCode is the power of 10 of the stored value (3 = thousands). */
const MOCK_RESPONSE = [
  { status: 'SUCCESS', object: { productId: 14100287, coordinate: padCoord('1.3.1.1.1.1'), vectorId: 2062811,   vectorDataPoint: [{ refPer: '2026-03-01', value: '21051.4', scalarFactorCode: 3 }] } },
  { status: 'SUCCESS', object: { productId: 11100190, coordinate: padCoord('1.12.1'),       vectorId: 96415849,  vectorDataPoint: [{ refPer: '2024-01-01', value: '75500',   scalarFactorCode: 0 }] } },
  { status: 'SUCCESS', object: { productId: 22100135, coordinate: padCoord('1.1.1'),         vectorId: 1277760990, vectorDataPoint: [{ refPer: '2022-01-01', value: '94.5',    scalarFactorCode: 0 }] } },
];

/** StatCan coordinates are 10 dimensions, right-padded with ".0". */
function padCoord(c) {
  const parts = String(c).split('.');
  while (parts.length < 10) parts.push('0');
  return parts.join('.');
}

/** Annual/Occasional tables report a year; sub-annual keep YYYY-MM. */
function formatRefPeriod(refPer, frequency) {
  const [y, m] = String(refPer).split('-');
  return (frequency === 'Annual' || frequency === 'Occasional') ? y : `${y}-${m}`;
}

async function fetchWithRetry(url, options, attempt = 0) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      const backoff = 500 * 2 ** attempt;
      console.warn(`  retry ${attempt + 1}/${MAX_RETRIES} after ${backoff}ms (${err.message})`);
      await new Promise((r) => setTimeout(r, backoff));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** One batched POST → getDataFromCubePidCoordAndLatestNPeriods. */
async function pull(useMock) {
  if (useMock) {
    console.log('• --mock: using embedded fixture (no network)');
    return MOCK_RESPONSE;
  }
  const body = SIGNALS.map((s) => ({ productId: s.pid, coordinate: padCoord(s.coordinate), latestN: 1 }));
  console.log(`• POST getDataFromCubePidCoordAndLatestNPeriods (${body.length} coordinates)`);
  return fetchWithRetry(`${WDS_BASE}/getDataFromCubePidCoordAndLatestNPeriods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Map WDS response onto signal defs by (productId, coordinate). */
function normalize(response) {
  const byKey = new Map();
  for (const entry of response) {
    if (entry?.status !== 'SUCCESS' || !entry.object) continue;
    const dp = entry.object.vectorDataPoint?.[0];
    if (!dp) continue;
    // WDS stores values scaled; scalarFactorCode is the power of 10 (3 = thousands).
    const scalar = 10 ** (Number(dp.scalarFactorCode) || 0);
    byKey.set(`${entry.object.productId}|${entry.object.coordinate}`, {
      value: Number(dp.value) * scalar,
      vector: `v${entry.object.vectorId}`,
      refPer: dp.refPer,
    });
  }

  const signals = [];
  for (const def of SIGNALS) {
    const point = byKey.get(`${def.pid}|${padCoord(def.coordinate)}`);
    if (!point || Number.isNaN(point.value)) {
      console.warn(`  ! no data for ${def.id} (PID ${def.pid} @ ${def.coordinate}) — skipping`);
      continue;
    }
    signals.push({
      id: def.id,
      label: def.label,
      source: SOURCE,
      program: def.program,
      programFull: def.programFull,
      table: def.table,
      pid: def.pid,
      coordinate: def.coordinate,
      vector: point.vector,
      unit: def.unit,
      uom: def.uom,
      value: point.value,
      refPeriod: formatRefPeriod(point.refPer, def.frequency),
      frequency: def.frequency,
      pestle: def.pestle,
    });
  }
  return signals;
}

async function main() {
  const useMock = process.argv.includes('--mock');
  const signals = normalize(await pull(useMock));

  if (signals.length === 0) {
    console.error('✗ No signals produced — refusing to overwrite signals.json');
    process.exit(1);
  }

  const out = {
    updated: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    source: SOURCE,
    attribution: ATTRIBUTION,
    signals,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`✓ wrote ${signals.length} signal(s) → ${OUT_PATH}`);
  for (const s of signals)
    console.log(`    ${s.programFull} (${s.program}): ${s.value.toLocaleString()} ${s.uom} (${s.refPeriod})`);
}

main().catch((err) => {
  console.error('✗ fetch-cid-data failed:', err.message);
  process.exit(1);
});
