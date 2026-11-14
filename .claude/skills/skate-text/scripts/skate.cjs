#!/usr/bin/env node
/*
  Skate text: a Canva-style "Skate" entrance, rendered into an animated WebP.

  One line of text is set on top of a transparent image (a logo, a wave, a
  badge). Each letter starts a little to one side, fades up and slides into
  place, easing to a stop; the letters start one after another, so the line
  fills in like a wave. The animation plays once and holds on the finished
  frame. A still of that frame is written too, for reduced motion.

  You give it the words; the script splits them into letters and drives the
  timing, the way Canva's preset does. Every letter keeps its exact place,
  kerning and italic overhang, because each letter layer is the whole line
  rendered with only that letter showing.

  Usage:
    node skate.cjs --image waves.png --text "Enter the present moment" --out out/enter.webp
    node skate.cjs --config skate.json

  Run `node skate.cjs --help` for every option. Defaults are the Slow Stream
  "Enter the present moment" logo (Greg, 2026-11-14).
*/
const fs = require('fs');
const path = require('path');

const HELP = `
Skate text: per-letter slide-in animation onto an image, as an animated WebP.

Required
  --image <file>        transparent PNG/WebP the text sits on
  --text "<words>"      one line of text
  --out <file.webp>     animated WebP to write (a "-still.webp" is written beside it)

Placement (fractions of the output image)
  --x 0.091             left edge of the text
  --y 0.13              top of the text
  --text-width 0.71     width the line should fill (sets the font size)
  --size <pt>           font size instead of --text-width

Image
  --width <px>          output width (default: the image's own width); render at 2x the display size
  --crop l,t,w,h        crop the image (source pixels) before scaling

Type
  --family Raleway      a Google font family (installed with npm as @expo-google-fonts/<family>)
  --weight 400          100-900
  --italic true         true / false
  --font-file <ttf>     use this font file instead of family/weight/italic
  --color #06021C       text colour

Motion
  --direction backwards backwards: letters slide right-to-left into place (Slow Stream)
                        forwards: left-to-right
  --travel 0.0535       how far each letter travels, as a fraction of the output width
  --each 520            ms one letter takes to land
  --stagger 40          ms between one letter starting and the next
  --fade 0.6            share of each letter's slide spent fading up (0-1)
  --lead 400            ms of the bare image before the first letter
  --hold 1000           ms on the finished frame (the animation then stops)
  --frame 40            ms per frame (40 = 25 fps)
  --loop 1              1 = play once; 0 = loop forever

Output
  --quality 90          WebP quality
  --preview <dir>       also write a few PNG frames to look at
  --config <file.json>  read any of these options from JSON (camelCase keys, e.g. "textWidth")
`;

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { o.help = true; continue; }
    if (!a.startsWith('--')) continue;
    const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { o[key] = true; } else { o[key] = next; i++; }
  }
  return o;
}

const DEFAULTS = {
  x: 0.091, y: 0.13, textWidth: 0.71,
  family: 'Raleway', weight: 400, italic: true, color: '#06021C',
  direction: 'backwards', travel: 0.0535, each: 520, stagger: 40, fade: 0.6,
  lead: 400, hold: 1000, frame: 40, loop: 1, quality: 90,
};

const WEIGHT_NAMES = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };

function fontFile(o) {
  if (o.fontFile) return path.resolve(o.fontFile);
  const fam = String(o.family);
  const pkg = '@expo-google-fonts/' + fam.toLowerCase().replace(/\s+/g, '-');
  const w = Number(o.weight);
  const style = `${w}${WEIGHT_NAMES[w]}${o.italic ? '_Italic' : ''}`;
  const file = `${fam.replace(/\s+/g, '')}_${style}.ttf`;
  let base;
  try { base = path.dirname(require.resolve(pkg + '/package.json', { paths: [__dirname, process.cwd()] })); }
  catch (e) { throw new Error(`Font package ${pkg} is not installed. In ${path.dirname(__dirname)} run: npm install ${pkg}`); }
  const f = path.join(base, style, file);
  if (!fs.existsSync(f)) throw new Error(`No ${file} in ${pkg} (looked in ${f})`);
  return f;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bool = (v) => v === true || v === 'true' || v === '1' || v === 1;

(async () => {
  let o = parseArgs(process.argv.slice(2));
  if (o.help) { console.log(HELP); return; }
  if (o.config) {
    // a preset file; its image path is read relative to the preset
    const cfg = JSON.parse(fs.readFileSync(o.config, 'utf8'));
    if (cfg.image && !path.isAbsolute(cfg.image)) cfg.image = path.resolve(path.dirname(o.config), cfg.image);
    delete cfg.notes;
    o = { ...cfg, ...o };
  }
  o = { ...DEFAULTS, ...o };
  for (const k of ['x', 'y', 'textWidth', 'size', 'weight', 'travel', 'each', 'stagger', 'fade', 'lead', 'hold', 'frame', 'loop', 'quality', 'width']) if (o[k] !== undefined) o[k] = Number(o[k]);
  o.italic = bool(o.italic);
  if (!o.image || !o.text || !o.out) { console.error('Need --image, --text and --out.\n' + HELP); process.exit(1); }

  let sharp;
  try { sharp = require('sharp'); } catch (e) { throw new Error(`sharp is not installed. In ${path.dirname(__dirname)} run: npm install`); }
  const sv = require('sharp/package.json').version;                 // join: { animated } needs 0.34+
  if (!/^(0\.(3[4-9]|[4-9]\d)|[1-9])/.test(sv)) throw new Error(`sharp ${sv} is too old; need 0.34 or later (npm install sharp@0.34)`);
  const FONT = fontFile(o);

  // the base image, cropped and scaled
  let img = sharp(o.image);
  if (o.crop) { const [left, top, width, height] = String(o.crop).split(',').map(Number); img = img.extract({ left, top, width, height }); }
  if (o.width) img = img.resize({ width: o.width });
  const base = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = base.info.width, H = base.info.height;

  // the font size: fit the line to --text-width, or use --size
  const render = (markup, pt) => sharp({ text: { text: markup, font: `${o.family}${o.italic ? ' Italic' : ''} ${pt}`, fontfile: FONT, rgba: true, dpi: 72 } }).raw().toBuffer({ resolveWithObject: true });
  const whole = `<span foreground="${o.color}">${esc(o.text)}</span>`;
  let pt = o.size || 50;
  let txt = await render(whole, pt);
  if (!o.size) {
    const target = W * o.textWidth;
    for (let i = 0; i < 8 && Math.abs(txt.info.width - target) > 1; i++) { pt = pt * target / txt.info.width; txt = await render(whole, pt); }
  }
  const tw = txt.info.width, th = txt.info.height;
  const X0 = Math.round(W * o.x), Y0 = Math.round(H * o.y);

  // one layer per letter (spaces skipped): the whole line with only that letter showing
  const chars = [...o.text];
  const letters = [];
  for (let i = 0; i < chars.length; i++) {
    if (/\s/.test(chars[i])) continue;
    const markup = chars.map((c, j) => `<span foreground="${o.color}" alpha="${j === i ? '100%' : '1'}">${esc(c)}</span>`).join('');
    letters.push({ i, data: (await render(markup, pt)).data });
  }

  const travel = Math.round(W * o.travel) * (o.direction === 'forwards' ? -1 : 1);
  const total = (chars.length - 1) * o.stagger + o.each;
  const n = Math.ceil(total / o.frame);
  const letterAt = (data, a) => sharp(data, { raw: { width: tw, height: th, channels: 4 } }).linear([1, 1, 1, a], [0, 0, 0, 0]).png().toBuffer();
  const frameAt = async (ms) => {
    const layers = [];
    for (const L of letters) {
      const t = Math.max(0, Math.min(1, (ms - L.i * o.stagger) / o.each));
      if (t <= 0) continue;
      const e = 1 - Math.pow(1 - t, 3);                       // ease out: glides, then settles
      layers.push({ input: await letterAt(L.data, Math.min(1, t / o.fade)), left: X0 + Math.round(travel * (1 - e)), top: Y0 });
    }
    return sharp(base.data, { raw: { width: W, height: H, channels: 4 } }).composite(layers).png().toBuffer();
  };

  const frames = [await frameAt(0)];
  const delays = [o.lead];
  for (let k = 1; k <= n; k++) { frames.push(await frameAt(k * o.frame)); delays.push(k === n ? o.hold : o.frame); }

  fs.mkdirSync(path.dirname(path.resolve(o.out)), { recursive: true });
  const anim = await sharp(frames, { join: { animated: true } })
    .webp({ quality: o.quality, alphaQuality: 100, effort: 6, loop: o.loop, delay: delays, smartSubsample: true })
    .toFile(o.out);
  const stillPath = o.out.replace(/\.webp$/i, '') + '-still.webp';
  const still = await sharp(frames[frames.length - 1]).webp({ quality: Math.min(100, o.quality + 2), alphaQuality: 100 }).toFile(stillPath);

  if (o.preview) {
    fs.mkdirSync(o.preview, { recursive: true });
    const picks = [Math.round(n * 0.2), Math.round(n * 0.45), Math.round(n * 0.7), frames.length - 1];
    for (const i of picks) await sharp(frames[i]).flatten({ background: '#F9FAFB' }).png().toFile(path.join(o.preview, `skate-${String(i).padStart(2, '0')}.png`));
  }

  console.log(JSON.stringify({
    out: path.resolve(o.out), still: path.resolve(stillPath), width: W, height: H,
    bytes: anim.size, frames: frames.length, ms: delays.reduce((a, b) => a + b, 0),
    font: `${path.basename(FONT)} ${pt.toFixed(2)}pt`, text: { left: X0, top: Y0, width: tw, height: th },
  }, null, 2));
})().catch((e) => { console.error(e.message || e); process.exit(1); });
