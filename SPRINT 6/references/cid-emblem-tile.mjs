// Kept with the sprint as the record of how brand/cid-emblem-800.webp was cut from
// "CID Seal - Emblem Display.png" (run from a folder with sharp installed).
// The CID emblem card tile without the ceiling light: the top band of the
// square is faded into the hall's own dark ceiling, with a soft slot left
// for the seal's top star so it still rises into the dark.
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");
const P = "C:/Users/ooodi/Projects/Ooos-publish/SPRINT 6/CID Seal - Emblem Display.png";
const O = "C:/Users/ooodi/Projects/Ooos-publish/public/assets/brand/";
const LEFT = 369, SIDE = 937;
const { data, info } = await sharp(P).extract({ left: LEFT, top: 0, width: SIDE, height: SIDE }).raw().toBuffer({ resolveWithObject: true });
const C = info.channels;
// the star: brightest column near the centre over the top rows
let bestX = 0, bestSum = -1;
for (let x = 400; x < 540; x++) { let sum = 0; for (let y = 0; y < 140; y++) { const i = (y * SIDE + x) * C; sum += data[i] + data[i + 1] + data[i + 2]; } if (sum > bestSum) { bestSum = sum; bestX = x; } }
let starTop = 140; for (let y = 0; y < 140; y++) { const i = (y * SIDE + bestX) * C; if (data[i] + data[i + 1] + data[i + 2] > 420) { starTop = y; break; } }
console.log("star column", bestX, "star top row", starTop);
const CEIL = { r: 7, g: 10, b: 14 };
const BAND_END = Number(process.argv[2] || 150), FULL_TO = Number(process.argv[3] || 105), SLOT = Number(process.argv[4] || 20), FEATHER = Number(process.argv[5] || 22);
const over = Buffer.alloc(SIDE * SIDE * 4);
for (let y = 0; y < SIDE; y++) for (let x = 0; x < SIDE; x++) {
  const o = (y * SIDE + x) * 4;
  let f = y <= FULL_TO ? 1 : y >= BAND_END ? 0 : 1 - (y - FULL_TO) / (BAND_END - FULL_TO);
  // the star's slot: no darkening within SLOT px of its column below its tip, feathered
  const dx = Math.abs(x - bestX);
  if (y >= starTop - 4 && dx < SLOT + FEATHER) { const keep = dx <= SLOT ? 1 : 1 - (dx - SLOT) / FEATHER; f *= 1 - keep; }
  over[o] = CEIL.r; over[o + 1] = CEIL.g; over[o + 2] = CEIL.b; over[o + 3] = Math.round(255 * f);
}
const square = await sharp(P).extract({ left: LEFT, top: 0, width: SIDE, height: SIDE }).png().toBuffer();
const tile = sharp(square).composite([{ input: over, raw: { width: SIDE, height: SIDE, channels: 4 } }]);
const composed = await tile.png().toBuffer();
await sharp(composed).resize(800, 800).webp({ quality: 84 }).toFile(O + "cid-emblem-800.webp");
await sharp(O + "cid-emblem-800.webp").resize(420).png().toFile("../emblem-card-nolight.png");
await sharp(O + "cid-emblem-800.webp").extract({ left: 200, top: 0, width: 400, height: 170 }).resize(800).png().toFile("../emblem-card-nolight-top.png");
console.log("written", BAND_END, FULL_TO, SLOT, FEATHER);
