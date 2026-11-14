---
name: skate-text
description: Render a Canva-style "Skate" text entrance into an animated WebP. Each letter fades up and slides into place one after another, and the words become part of the image. Use when the user wants animated text on a logo or image (a "skate", letter-by-letter slide-in, text that glides onto a logo, an animated wordmark), wants the Slow Stream "Enter the present moment" style again, or wants a GIF or Canva text animation rebuilt cleanly. Plays once and holds; also writes a still for reduced motion.
---

# Skate text

A repeatable version of Canva's **Skate** text animation. You give it **the
words and an image**; the script splits the line into letters and drives the
timing, the way Canva's preset does. You never animate letters by hand.

- Each letter starts a little to one side, fades up and slides into place,
  easing to a stop. The letters start one after another (40 ms apart by
  default), so the line fills in like a wave.
- The text is **rendered into the image** in a real font (no screenshot of a
  GIF, no drop shadow), so it stays crisp. Each letter keeps its exact place,
  kerning and italic overhang, because each letter layer is the whole line
  rendered with only that letter showing.
- Output: an **animated WebP that plays once and holds on the finished frame**,
  plus `<name>-still.webp` (the finished frame) for reduced motion.

Why not convert the Canva GIF: GIFs have 1-bit transparency and 256 colours,
so thin italic type turns jagged, and any shadow smears. Rendering the text
here is sharper and far smaller (about 150 KB vs 6.9 MB for the same logo).

## Where the skill lives

`<skill>` below means the folder this SKILL.md is in: `~/.claude/skills/skate-text`
(personal) or `.claude/skills/skate-text` in the Ooos-publish repo (shared with
anyone working in that project). `node_modules` is not committed; install it
once per machine.

## Setup (once)

```bash
cd <skill> && npm install
```

That installs `sharp` 0.34+ (it assembles the animation) and Raleway. For
another Google font, add its package, e.g. `npm install @expo-google-fonts/poppins`,
then pass `--family Poppins`. Any `.ttf` works with `--font-file`.

## Use

**The Slow Stream style** (Raleway Italic 400, #06021C, stitched waves,
letters sliding backwards):

```bash
node <skill>/scripts/skate.cjs --config <skill>/presets/slow-stream.json --text "Enter the present moment" --out <folder>/enter-the-present-waves.webp --preview <scratch>/frames
```

**Any text on any image:**

```bash
node <skill>/scripts/skate.cjs --image logo.png --text "Your line" --out out/line.webp --width 860 --x 0.09 --y 0.13 --text-width 0.7 --color "#06021C"
```

`node scripts/skate.cjs --help` lists every option. The ones that matter most:

| Option | Default | What it does |
|---|---|---|
| `--image` | | transparent PNG/WebP the text sits on |
| `--width` | image width | output width; render at **2x the display width** |
| `--x`, `--y` | 0.091, 0.13 | top-left of the text, as fractions of the image |
| `--text-width` / `--size` | 0.71 / none | fit the line to a share of the width, or fix the point size (fix it so several lines match) |
| `--family`, `--weight`, `--italic`, `--font-file` | Raleway 400 italic | the type |
| `--color` | #06021C | text colour |
| `--direction` | backwards | backwards = letters slide right-to-left into place; forwards = left-to-right |
| `--travel` | 0.0535 | how far each letter slides, as a share of the width |
| `--each`, `--stagger` | 520, 40 ms | one letter's slide; the gap before the next letter starts |
| `--lead`, `--hold` | 400, 1000 ms | bare image first; finished frame last |
| `--loop` | 1 | 1 plays once; 0 loops |

Options can also live in a JSON preset (`--config`, camelCase keys such as
`textWidth`); command-line flags override it. Save a new preset in `presets/`
when a style is approved, with a `notes` line saying whose style it is and when.

## Check before handing it over

1. Open the `--preview` frames: the line should fill in letter by letter, and
   the last frame should be the finished logo.
2. Read the JSON the script prints: `ms` is the total running time (about
   2.5 to 3 s for one line), `bytes` the file size.
3. Look at it on the real background colour. The words should not touch the
   artwork; move `--x`/`--y` or lower `--size` if they do.

## Put it on a page

Play once, and show the still to anyone who has asked for reduced motion:

```html
<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="enter-the-present-waves-still.webp">
  <img src="enter-the-present-waves.webp" width="860" height="403" alt="Enter the present moment">
</picture>
```

Give the `<img>` the words as its `alt`, since they are now part of the image.
Display it at half its pixel width or less (for example `width: 430px`) so it
stays sharp on high-density screens.

## Where it is used

- slowstream.ca welcome section: `https://ooos.ca/assets/slowstream/enter-the-present-waves.webp`
  (and `-still.webp`), made with `presets/slow-stream.json`. The welcome
  section aligns the waves' centre of mass (67.2% down this image) with the
  top of the key panel.
