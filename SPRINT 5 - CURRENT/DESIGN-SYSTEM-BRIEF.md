# Ooo! Design System Brief — for Claude Design

**What this is for.** Claude Design does not read `CLAUDE.md` or `.claude/skills/`
— those are Claude Code mechanisms. Its equivalent is the **design system** you
set up once per account. This brief carries the parts a token scrape misses: the
*rules* about when to use what.

**Set it up once (pick one):**

- **Point at the repo** `greg-mdm/Ooos` — reads `src/styles/design-system-palette.css`
  and the component CSS. Closest match to the real product.
- **Point at the live site** `https://ooos.ca` — fastest.
- **Paste this file** as the text description, or attach it alongside either of
  the above. The rules below are the part that scraping cannot infer.

---

## Palette

Source of truth: `src/styles/design-system-palette.css`.

| Token | Hex | Use |
|---|---|---|
| Portal | `#4B00B6` | **The `Ooo!` wordmark.** Headings. |
| Electric | `#5B04DE` | Accents, links, glows. **Never the wordmark.** |
| Dark indigo | `#19007D` | Deep panels |
| Midnight black | `#0F031C` | Darkest ground |
| Darkest indigo | `#06021C` | Immersive/room backgrounds |
| Ruby | `#822F00` | Headings, eyebrow labels |
| Gold | `#F0C040` | Warm accent (Icarus side) |
| Teal | `#008080` | Cool accent |
| Cyan | `#1FCECB` | Bright cool accent |
| Robin's-egg | `#F0F4F5` | **Page background** |
| Sunshine | `#FFF3B0` | Soft warm tint |
| Suncloud white | `#FFFDF4` | Warm white |
| Bright silver | `#E8ECF4` | Light UI metal |
| Chrome silver | `#D8DBDE` | Mid UI metal |

Midnight-violet ramp `50`–`950` (`#F2E8FD` → `#110320`) for tints and shades.

> **The colour mistake to avoid:** Portal `#4B00B6` and Electric `#5B04DE` are
> close enough to swap by eye. The `Ooo!` wordmark is **Portal**. Verified by
> sampling `public/assets/brand/ooo-wordmark-portal-transparent.png`. When in
> doubt, sample the asset rather than guessing.

## Type

| Face | Where | Rule |
|---|---|---|
| **Montserrat** | Workhorse UI, labels, eyebrows | 800 for labels/eyebrows, uppercase, wide letter-spacing |
| **Lovelo** (Black) | Display titles, division subtitles | **900 weight only** |
| **Playfair Display** | The `Ooo!` wordmark | Italic 700 |
| Poppins, Jost, Inter, Cormorant Garamond | Secondary/section-specific | |

> **Lovelo is a single 900-weight face.** Any other weight makes the browser
> synthesize it and the glyphs distort (uneven letter heights). Never set Lovelo
> at 400/600/700.

## Layout and typography rules

- **Crisp paragraph blocks.** Prose reads as one clean shape, not three ragged
  edges with a short trailing last line. Measure **55–65ch**, plus
  `text-wrap: balance`.
- **No orphans.** A last word or bracketed acronym must not drop to its own line.
- Cards: white, ~14–16px radius, hairline border `rgba(75,0,182,.14–.2)`, soft
  low shadow. Coloured left edge (4px) to denote category.
- Eyebrow labels: Montserrat 800, ~10px, uppercase, `.16–.18em` letter-spacing,
  in Ruby or the tier colour.

## Copy rules (apply to any generated text)

- **No em dashes. Ever.** Comma, colon, or a new sentence.
- **Acronyms:** spell out on first use, **term first, acronym in brackets**, and
  the expansion stays lowercase unless it is a proper noun.
  `augmented reality (AR)` — not `AR (augmented reality)`, and not
  `Augmented Reality (AR)`.
- **Never invent facts.** Don't assert a claim the source doesn't support.
- **Greg's supplied copy is used verbatim.** Flag any new wording for approval,
  including button labels and headings.

## Brand structure

**Ooo Digital Media Studio** is the parent. Three divisions:

| Division | Full name | Heading |
|---|---|---|
| MIC | Media, Information and Culture | OBJECTIVES |
| CID | Canadian Innovation Dimension | STRATEGIES |
| Reclaiming Agency | (no acronym) | TACTICS |

---

## Handoff back to Claude Code

Claude Design owns exploration and prototyping. Claude Code owns anything that
touches the repo. Hand off when the work needs:

- **Optimization** — image downscale + WebP, video re-encode to H.264
  `+faststart` (Drive originals are far too heavy to ship raw)
- **Display architecture** — placing assets into the virtual-environment scenes
  (the WebGL display room, the lens previews, the vault)
- **Anything that ships** — building, committing, and pushing to `main`

Claude Design cannot push to `main`. It has no shell and no repo write access.
Bring the exported asset or HTML across, and Claude Code takes it from there —
see `WORKING-GUIDE.md` for the publish workflow and the Google Drive asset
pipeline (Drive is the preferred route for moving files in, because it doesn't
move `main` underneath an in-flight session).
