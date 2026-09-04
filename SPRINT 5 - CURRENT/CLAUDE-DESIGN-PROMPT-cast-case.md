# Claude Design prompt: Phthalo Steel display case for the CID character roll

Paste everything below the line into Claude Design.

---

Design a **Phthalo Steel display case** that frames a three-bay character roll on
the ooos.ca CID page. The bays already exist and work; what is missing is the
case around them. Right now the three pieces of art butt straight into each
other and into the page edges, with nothing but a one-pixel hairline between
them. I want glass and steel structure that separates them and holds them off
every edge.

## Reference images

Two renders of the case already exist in the repo. Match their material, not
their proportions:

- `docs/Claude-Design-MCP/CID_display_case_empty_minimal.png` (1907x819)
- `SPRINT 5 - CURRENT/DISPLAY CASE ONLY.png` (1376x768)

Both show the same object: a low, wide vitrine, three bays divided by vertical
glass mullions, mitred corner posts, a near-black interior, teal and cyan light
gathering along the bottom rail and pooling on the floor beneath. The second
render is the stronger one, with a lit plinth under the bays and a reflective
floor.

## Canon palette (use these, do not invent)

Sampled from the tour renders and already in the stylesheet as the `.cid-vault`
tokens, which is the site's existing steel case:

| Role | Value |
|---|---|
| Deep phthalo, the light end | `#0E6E73` (`--vault-teal: 14, 110, 115`) |
| Petrol, interior depth | `#0E3A56` (`--vault-petrol: 14, 58, 86`) |
| Nacre, the one specular highlight | `#6FC3F9` (`--vault-nacre: 111, 195, 249`) |
| Tech-wall panel mean | `#124D4F` |
| Deep shadow | `#051612` |
| Vanta body | `#06070A` to `#030305` to `#04060A` |
| Bay interior, current | `#04030e` |

Bright Silver `#E8ECF4` is the nameplate type. Site indigo is `#4B00B6`.

## Exact current geometry

Measured live at a 1440px viewport. The band is full-bleed: it runs the entire
page width, `width: 100vw`, breaking out of its column with `--viv-gutter`.

**The band**

| | Value |
|---|---|
| Band width | `100vw` (1440 at a 1440 viewport) |
| Frame height | `clamp(360px, 44vw, 660px)` → 634 at 1440 |
| Shot area (art) | 691 x 587 lit, 374 x 587 unlit |
| Nameplate strip | 47 tall, under the art, inside the frame |
| Gap between frames | 0. One 1px inset hairline, `rgba(174,153,201,.16)` |
| Padding | none, anywhere |

**Bay widths — these move**

The spotlight is width. Whichever character is chosen takes 48%, the other two
take 26% each. 26 + 26 + 48 = 100%, so the three exactly fill the band, and the
widths animate over 420ms on `cubic-bezier(.4,0,.2,1)`.

| Viewport | Band | Lit bay | Unlit bay | Frame height | Shot height |
|---|---|---|---|---|---|
| 1920 | 1920 | 922 | 499 | 660 | 613 |
| 1440 | 1440 | 691 | 374 | 634 | 587 |
| 1280 | 1280 | 614 | 333 | 563 | 516 |
| ≤700 | 100vw | 74% | 13% | `clamp(320px, 78vw, 460px)` | frame − 47 |

**This is the hard part of the brief.** Unlike both reference renders, the
mullions are not fixed. They slide as the spotlight moves, and the bays are
never equal: one is always roughly twice its neighbours. The case has to look
correct in all three arrangements and while animating between them.

## The art in each bay

| Character | Asset | Native | Aspect | Lit bay render |
|---|---|---|---|---|
| The Sturgeon General | video + webp poster | 1112 x 834 | 4:3 | 691 x 518 |
| Ethel | video 1280x720, still 1240x698 | 16:9 | 16:9 | 691 x 389 |
| Icarus the Third | webp still | 1000 x 1250 | 4:5 portrait | 470 x 587 |

The lit bay uses `object-fit: contain` and **must keep doing so**. The three do
not share an aspect, and cropping them to a common one is a documented past
mistake on this page. So the lit bay already shows near-black around the art:
57px top and bottom for the Sturgeon, 99px for Ethel, 110px each side for
Icarus. Treat that as the mount inside the case, not as a gap to close.

Unlit bays use `object-fit: cover` with a per-character `object-position`, and
are dimmed `brightness(.62) saturate(.82)`.

## What to design

1. **An outer case frame** around the whole band. Bevelled glass edge with
   mitred corner posts, as in the renders. It must read at the page edges,
   where the band currently runs straight off.
2. **Mullions between bays.** Vertical glass dividers replacing the current 1px
   hairline. They must survive the bays changing width.
3. **An inset mount** so no art touches any edge of its bay.
4. **A bottom rail / plinth** carrying the teal pool, as in `DISPLAY CASE ONLY`.
   The nameplate strip lives here, so the two have to be one piece rather than
   two stacked bands.
5. **A top rail** with the single bright inner line the renders both have.
6. **A lit state.** The spotlighted bay should read as the one under the light.
   Today that is carried entirely by the art being undimmed; the case should
   help, without a border ring drawn around it.

## Constraints

- **Every dimension above is real and current.** Design to them.
- Give me the inset values in px or a `clamp()`, not "some padding".
- The case is chrome around existing bays. Do not redesign the roll, the
  spotlight behaviour, the arrows, or the nameplates.
- The bays are `<button>` elements wrapping their media. Nothing added inside a
  bay may be interactive.
- The band already overhangs the viewport by 7px each side, because `100vw`
  counts the scrollbar. If the case has a visible outer edge, say whether it
  should sit at the true page edge instead.
- Must hold up in both a wide bay and a narrow one, since every bay is both
  depending on which character is chosen.
- No em dashes in any copy.

## Deliverable

Artboards at 1440 and at 390 wide, showing the case in all three spotlight
states, plus a spec of the frame, mullion, and mount dimensions and the exact
gradients and shadows. I will implement it in CSS from your spec.
