# Claude Design prompt: Phthalo Steel display case for the CID character roll

Every number below was measured off the live page at ooos.ca/cid, not estimated.
Paste everything under the line into Claude Design.

---

Design a **Phthalo Steel display case** to frame a three-bay character roll on
the ooos.ca CID page. The bays already exist and work. What is missing is the
case around them: today the three pieces of art butt straight into each other
and run off both page edges, separated by nothing but a one-pixel hairline. I
want glass and steel structure that holds each piece off every edge.

## Reference renders

Two renders of this case are in the repo. Match their **material and lighting**,
not their proportions:

- `SPRINT 5 - CURRENT/DISPLAY CASE ONLY.png` (1376x768) — the stronger one: a
  lit plinth beneath the bays, teal pooling on a reflective floor
- `docs/Claude-Design-MCP/CID_display_case_empty_minimal.png` (1907x819)

Both show one object: a low wide vitrine, three bays split by vertical glass
mullions, mitred corner posts, near-black interior, teal and cyan light
gathering along the bottom rail.

## Palette (canon, do not invent)

Already in the stylesheet as the `.cid-vault` tokens, which is this site's
existing steel case, plus the phthalo sampled from the tour renders:

| Role | Value |
|---|---|
| Deep phthalo, light end | `#0E6E73` (`--vault-teal: 14, 110, 115`) |
| Petrol, interior depth | `#0E3A56` (`--vault-petrol: 14, 58, 86`) |
| Nacre, the single specular | `#6FC3F9` (`--vault-nacre: 111, 195, 249`) |
| Tech-wall panel mean | `#124D4F` |
| Deep shadow | `#051612` |
| Vanta body | `#06070A` → `#030305` → `#04060A` |
| Bay interior, current | `#04030e` |
| Nameplate type | Bright Silver `#E8ECF4`, role line `#AE99C9` |

## The cast, left to right

Fixed order. Ethel at the left, Icarus at the right, the Sturgeon General
swimming between them. **The General holds the spotlight when the page loads.**

| Bay | Character | Asset | Native | Aspect |
|---|---|---|---|---|
| 1, left | Ethel | video `1280x720` + still `1240x698` | 16:9 | 1.778 |
| 2, centre | The Sturgeon General | video + webp poster | `1112x834` | 4:3 |
| 3, right | Icarus the Third | webp still | `1000x1250` | 4:5 portrait |

## Exact geometry, measured live

The band is full-bleed: `width: 100vw`, breaking out of its text column, running
the entire page width.

**Constants**

| | Value |
|---|---|
| Band | `100vw` |
| Frame height | `clamp(360px, 44vw, 660px)` |
| Nameplate strip | 47 tall (38 on mobile), inside the frame, under the art |
| Shot area | frame height minus the nameplate |
| Gap between bays | **0**. One 1px inset hairline, `rgba(174,153,201,.16)` |
| Padding | **none, anywhere**. This is the problem being solved |
| Frame min-width | 112px (40px at ≤700) |
| Unlit dimming | `brightness(.62) saturate(.82)` |
| Spotlight transition | width, 420ms, `cubic-bezier(.4,0,.2,1)` |
| Arrows | 46px circles, 38px at ≤700, overlaid on the band's left and right edges |

**Measured at three viewports** (widths in bay order, spotlight on the centre):

| Viewport | Band | Bay 1 | Bay 2 lit | Bay 3 | Frame h | Shot |
|---|---|---|---|---|---|---|
| 1920 | 1920 | 499 | **922** | 499 | 660 | 922 x 613 |
| 1440 | 1440 | 374 | **691** | 374 | 634 | 691 x 587 |
| 390 | 390 | 51 | **289** | 51 | 320 | 289 x 282 |

**The bays move.** The lit bay takes 48%, the other two 26% each (74% / 13% at
≤700). 26 + 26 + 48 = 100%, so the three exactly fill the band. Pressing a bay
animates the widths.

## Art rendered inside the lit bay

`object-fit: contain`, and **it must stay that way**. The three do not share an
aspect, and cropping them to a common one is a documented past mistake here.

| Character | At 1920 (shot 922x613) | At 1440 (shot 691x587) | Surround left over |
|---|---|---|---|
| Ethel | 922 x 519 | 691 x 389 | 99 top and bottom @1440 |
| The General | 817 x 613 | 691 x 518 | 57 top and bottom @1440 |
| Icarus | 490 x 613 | 470 x 587 | 110 each side @1440 |

**That near-black surround is deliberate.** Treat it as the mount inside the
case, not as a gap to close. Unlit bays use `object-fit: cover` with a
per-character `object-position`.

## What to design

1. **Outer case frame** around the whole band. Bevelled glass edge, mitred
   corner posts. It has to resolve at the page edges, where the band currently
   runs straight off.
2. **Mullions** between bays, replacing the 1px hairline.
3. **An inset mount** so no art touches any edge of its bay. Give me real
   numbers or a `clamp()`.
4. **Bottom rail / plinth** carrying the teal pool. The nameplate strip lives
   here, so design them as one piece, not two stacked bands.
5. **Top rail** with the single bright inner line both renders have.
6. **A lit state.** Today the spotlight is carried entirely by the art being
   undimmed. The case should help, without drawing a border ring.

## The hard constraint

**Unlike both reference renders, the mullions are not fixed.** They slide as the
spotlight moves, and no two bays are ever equal: one is always roughly twice its
neighbours. At 390 the unlit bays are 51px slivers. The case has to read
correctly in all three arrangements, at every viewport, and while animating
between them. A design that only resolves on the empty static case will not
survive contact.

## Other constraints

- Bays are `<button>` elements wrapping their media. **Nothing added inside a
  bay may be interactive.**
- The case is chrome around existing bays. Do not redesign the roll, the
  spotlight behaviour, the arrows, or the nameplates.
- The band overhangs the viewport by 7px each side, because `100vw` counts the
  scrollbar. If the case has a visible outer edge, say whether it should sit at
  the true page edge instead.
- The page ground above and below the band is robin's egg `#F0F4F5`. The case is
  a dark object on a pale page.
- No em dashes in any copy.

## Deliverable

Artboards at 1440 and 390 wide, showing all three spotlight states, plus a spec
of the frame, mullion, and mount dimensions with exact gradients and shadows. I
will implement it in CSS from your spec.
