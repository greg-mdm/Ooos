#!/usr/bin/env node
/**
 * rebase-pop-clock.mjs — refresh the Ooo! Pop Clock Mini calibration anchor.
 *
 * Writes public/pop-clock/calibration.json — a snapshot of Statistics Canada's
 * official population clock. The widget re-bases its projection to that reading,
 * so it only ever extrapolates the short time since capture and stays within a
 * minimal margin of the official clock. See src/app/components/population/README.md.
 *
 * Runtime: Node 20+ (built-in global fetch). No dependencies.
 *
 * Usage:
 *   node scripts/rebase-pop-clock.mjs 41554157 817
 *       Manual "button": pin the base population (41554157) and, optionally, the
 *       official "change since midnight" (817) — used to derive StatCan's own
 *       per-second rate so our clock ticks in lockstep with theirs. Read both off
 *       https://www150.statcan.gc.ca/ ... population clock.
 *
 *   node scripts/rebase-pop-clock.mjs --auto
 *       Best-effort: fetch the official figure server-side (used by the scheduled
 *       workflow). If it can't obtain a trustworthy value it SKIPS without writing
 *       — never clobbers a good manual snapshot with a bad scrape.
 *
 * Sanity alarm: if the new reading implies more than MAX_DAILY_CHANGE persons/day
 * versus the previous snapshot, something is wrong (bad scrape, fat-fingered
 * number). The script refuses to write and exits non-zero so the run is visibly
 * flagged. Tune with --max=<n> or the MAX_DAILY_CHANGE env var.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../public/pop-clock/calibration.json');

const SEC_PER_YEAR = 365.25 * 24 * 60 * 60;
const SOURCE = "Statistics Canada, Canada's population clock (real-time model)";

// Canada's real current rate is ~1,237/day (~452k/yr). This ceiling sits well
// above it; anything larger between two readings signals a malfunction.
const MAX_DAILY_CHANGE = Number(process.env.MAX_DAILY_CHANGE) || 2500;
// Plausible band for a national total — a scrape outside this is rejected.
const MIN_POP = 40_000_000;
const MAX_POP = 46_000_000;
// Candidate sources for --auto. Override with STATCAN_CLOCK_URL. The population
// clock renders client-side, so the parse target may need confirming on first
// run; until then --auto safely skips rather than writing a wrong number.
const AUTO_URLS = (process.env.STATCAN_CLOCK_URL || '').split(',').map((s) => s.trim()).filter(Boolean);

/** Seconds since Eastern-time (America/Toronto) midnight — StatCan's clock day. */
function secondsSinceEasternMidnight(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto', hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = fmt.formatToParts(now);
  const val = (t) => Number(parts.find((p) => p.type === t)?.value ?? '0');
  let h = val('hour'); if (h === 24) h = 0;
  return h * 3600 + val('minute') * 60 + val('second');
}

async function readPrevious() {
  try {
    const raw = await readFile(OUT_PATH, 'utf8');
    const j = JSON.parse(raw);
    if (j && j.enabled && typeof j.population === 'number' && j.capturedAt) {
      const t = Date.parse(j.capturedAt);
      if (!Number.isNaN(t)) return { population: j.population, capturedAtMs: t };
    }
  } catch { /* no previous snapshot — fine */ }
  return null;
}

/** Best-effort scrape for --auto. Returns a population integer or null. */
async function fetchOfficialPopulation() {
  for (const url of AUTO_URLS) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ooos-pop-clock-rebase' } });
      if (!res.ok) continue;
      const text = await res.text();
      // Accept a JSON {population|value} or the first plausible number in the page.
      let candidate = null;
      try {
        const j = JSON.parse(text);
        candidate = Number(j.population ?? j.value ?? j.count);
      } catch {
        const nums = text.replace(/[, ]/g, '').match(/\b4[0-5]\d{6}\b/g) || [];
        candidate = nums.map(Number).find((n) => n >= MIN_POP && n <= MAX_POP) ?? null;
      }
      if (candidate && candidate >= MIN_POP && candidate <= MAX_POP) return Math.round(candidate);
    } catch { /* try next source */ }
  }
  return null;
}

function alarm(prev, population, capturedAtMs) {
  if (!prev) return null;
  const days = Math.max((capturedAtMs - prev.capturedAtMs) / 86_400_000, 1 / 24); // >= 1 hour
  const perDay = Math.abs(population - prev.population) / days;
  if (perDay > MAX_DAILY_CHANGE) {
    return `ALARM: implied ${Math.round(perDay)}/day change (${prev.population.toLocaleString()} → ` +
      `${population.toLocaleString()} over ${days.toFixed(2)}d) exceeds ${MAX_DAILY_CHANGE}/day. Refusing to rebase.`;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  for (const a of args) { const m = a.match(/^--max=(\d+)$/); if (m) process.env.MAX_DAILY_CHANGE = m[1]; }
  const positional = args.filter((a) => !a.startsWith('--'));
  const auto = args.includes('--auto');

  const now = new Date();
  const capturedAt = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
  let population;
  let ratePerSecond = null;

  if (auto && positional.length === 0) {
    population = await fetchOfficialPopulation();
    if (population == null) {
      console.warn('[rebase] --auto could not obtain a trustworthy official figure; skipping (snapshot unchanged).');
      console.warn('[rebase] Set STATCAN_CLOCK_URL to a confirmed source, or run manually: node scripts/rebase-pop-clock.mjs <population> [changeSinceMidnight]');
      process.exit(0); // skip, don't fail the scheduled run
    }
  } else {
    population = Math.round(Number(positional[0]));
    if (!Number.isFinite(population) || population < MIN_POP || population > MAX_POP) {
      console.error(`[rebase] population "${positional[0]}" is missing or outside ${MIN_POP.toLocaleString()}–${MAX_POP.toLocaleString()}.`);
      process.exit(1);
    }
    if (positional[1] != null) {
      const sinceMidnight = Number(positional[1]);
      const elapsed = secondsSinceEasternMidnight(now);
      if (Number.isFinite(sinceMidnight) && elapsed > 0) {
        ratePerSecond = sinceMidnight / elapsed; // StatCan's own current rate
      }
    }
  }

  const prev = await readPrevious();
  const alarmMsg = alarm(prev, population, Date.parse(capturedAt));
  if (alarmMsg) { console.error(`[rebase] ${alarmMsg}`); process.exit(2); }

  const snapshot = {
    enabled: true,
    population,
    capturedAt,
    ratePerSecond: ratePerSecond != null ? Number(ratePerSecond.toFixed(7)) : null,
    source: SOURCE,
    _README:
      'Calibration snapshot for the Ooo! Pop Clock Mini (see scripts/rebase-pop-clock.mjs and ' +
      'src/app/components/population/README.md). enabled+population+capturedAt re-base the widget ' +
      'to this official reading; ratePerSecond (optional) pins the speed to StatCan’s own rate. ' +
      'Snapshots older than 21 days, malformed, or future-dated are ignored automatically.',
  };

  await writeFile(OUT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  const annual = ratePerSecond != null ? Math.round(ratePerSecond * SEC_PER_YEAR) : null;
  console.log(`[rebase] wrote ${OUT_PATH}`);
  console.log(`[rebase] population ${population.toLocaleString()} @ ${capturedAt}` +
    (annual != null ? ` · rate ${annual.toLocaleString()}/yr (${Math.round(ratePerSecond * 86400)}/day)` : ' · rate: year-over-year (widget)'));
}

main().catch((err) => { console.error('[rebase] failed:', err); process.exit(1); });
