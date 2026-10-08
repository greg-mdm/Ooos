// Kept with the sprint as the record of how brand/cid-emblem-800.webp was cut from
// "CID Seal - Emblem Display.png" (run from a folder with sharp installed; the
// one argument is how many rows of ceiling to add above, 56 as shipped).
// The CID emblem card tile: cut from "CID Seal - Emblem Display.png" with
// the ceiling light removed and the seal set a little below centre.
// The square is the picture's full height plus TOP_PAD rows of the hall's
// dark ceiling added above, so the seal sits lower in the frame and a
// little more of the hall shows at the sides; nothing of the floor is lost.
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");
const P = "C:/Users/ooodi/Projects/Ooos-publish/SPRINT 6/CID Seal - Emblem Display.png";
const O = "C:/Users/ooodi/Projects/Ooos-publish/public/assets/brand/";
const TOP_PAD = Number(process.argv[2] || 56);
const CX = 837, H = 937, SIDE = H + TOP_PAD, LEFT = Math.round(CX - SIDE / 2);
const BAND_END = 114, FULL_TO = 100, SLOT = 6, FEATHER = 7, STAR_X = 471 + (369 - LEFT), STAR_TOP = 24;
const CEIL = { r: 7, g: 10, b: 14 };
const over = Buffer.alloc(SIDE * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < SIDE; x++) {
  const o = (y * SIDE + x) * 4;
  let f = y <= FULL_TO ? 1 : y >= BAND_END ? 0 : 1 - (y - FULL_TO) / (BAND_END - FULL_TO);
  const dx = Math.abs(x - STAR_X);
  if (y >= STAR_TOP - 4 && dx < SLOT + FEATHER) { const keep = dx <= SLOT ? 1 : 1 - (dx - SLOT) / FEATHER; f *= 1 - keep; }
  over[o] = CEIL.r; over[o + 1] = CEIL.g; over[o + 2] = CEIL.b; over[o + 3] = Math.round(255 * f);
}
const strip = await sharp(P).extract({ left: LEFT, top: 0, width: SIDE, height: H }).png().toBuffer();
const dark = await sharp(strip).composite([{ input: over, raw: { width: SIDE, height: H, channels: 4 } }]).png().toBuffer();
const square = await sharp(dark).extend({ top: TOP_PAD, bottom: 0, left: 0, right: 0, background: CEIL }).png().toBuffer();
await sharp(square).resize(800, 800).webp({ quality: 84 }).toFile(O + "cid-emblem-800.webp");
await sharp(O + "cid-emblem-800.webp").resize(420).png().toFile("../emblem-card-lower.png");
console.log("side", SIDE, "left", LEFT, "seal centre at", Math.round(100 * (468 + TOP_PAD) / SIDE) + "% of the tile height");
