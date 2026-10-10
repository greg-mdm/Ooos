// Kept with the sprint as the record of how brand/cid-emblem-800.webp was cut from
// "CID Seal - Emblem Display.png" (run from a folder with sharp installed; the
// one argument is how many rows of ceiling to add above, 56 as shipped).
// The CID emblem card tile: cut from "CID Seal - Emblem Display.png" with
// the ceiling light removed and the seal set a little below centre.
// The square is the picture's full height plus TOP_PAD rows of the hall's
// dark ceiling added above, so the seal sits lower in the frame and a
// little more of the hall shows at the sides; nothing of the floor is lost.
//
// The ceiling light ran across the top of the picture, behind the seal's
// top star. The band over the top rows darkens it into the hall's ceiling,
// and within a narrow column around the star only the star's own blue
// light is kept (a narrow core slot, and around it each pixel by how much
// bluer than red it is), so the
// neutral grey of the light bar behind the star goes dark with the rest
// and the star's tip and its glow survive whole (Greg, 2026-10-10).
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");
const P = "C:/Users/ooodi/Projects/Ooos-publish/SPRINT 6/CID Seal - Emblem Display.png";
const O = "C:/Users/ooodi/Projects/Ooos-publish/public/assets/brand/";
const TOP_PAD = Number(process.argv[2] || 56);
const CX = 837, H = 937, SIDE = H + TOP_PAD, LEFT = Math.round(CX - SIDE / 2);
const BAND_END = 114, FULL_TO = 100, COL = 22, STAR_X = 471 + (369 - LEFT);
const CEIL = { r: 7, g: 10, b: 14 };
const { data, info } = await sharp(P).extract({ left: LEFT, top: 0, width: SIDE, height: H }).raw().toBuffer({ resolveWithObject: true });
const C = info.channels;
const over = Buffer.alloc(SIDE * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < SIDE; x++) {
  const o = (y * SIDE + x) * 4, i = (y * SIDE + x) * C;
  let f = y <= FULL_TO ? 1 : y >= BAND_END ? 0 : 1 - (y - FULL_TO) / (BAND_END - FULL_TO);
  const dx = Math.abs(x - STAR_X);
  if (dx < COL) {
    // the star's light is blue; the bar behind it is neutral: keep by blueness
    const blue = Math.max(0, Math.min(1, (data[i + 2] - data[i]) / 50));
    const near = 1 - dx / COL;
    // the star's white-hot core is neutral too, so a narrow core slot keeps
    // it whole; the blueness rule carries the glow around it
    const core = dx <= 5 ? 1 : Math.max(0, 1 - (dx - 5) / 4);
    f *= 1 - Math.max(core, blue * Math.min(1, near * 1.6));
  }
  over[o] = CEIL.r; over[o + 1] = CEIL.g; over[o + 2] = CEIL.b; over[o + 3] = Math.round(255 * f);
}
const strip = await sharp(P).extract({ left: LEFT, top: 0, width: SIDE, height: H }).png().toBuffer();
const dark = await sharp(strip).composite([{ input: over, raw: { width: SIDE, height: H, channels: 4 } }]).png().toBuffer();
const square = await sharp(dark).extend({ top: TOP_PAD, bottom: 0, left: 0, right: 0, background: CEIL }).png().toBuffer();
await sharp(square).resize(800, 800).webp({ quality: 84 }).toFile(O + "cid-emblem-800.webp");
await sharp(O + "cid-emblem-800.webp").resize(400).png().toFile("../emblem-card-tip.png");
await sharp(O + "cid-emblem-800.webp").extract({ left: 340, top: 0, width: 120, height: 200 }).resize(360, 600, { kernel: "nearest" }).png().toFile("../tip-zoom3.png");
console.log("side", SIDE, "left", LEFT, "seal centre at", Math.round(100 * (468 + TOP_PAD) / SIDE) + "% of the tile height");
