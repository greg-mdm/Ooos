# Skill — Human-scale 3D data viz from a single instanced asset

How to build an immersive "one instance = one person" 3D visualization (the
JellyBean Journeys pattern), and the mesh-wrangling techniques that make a
found 3D asset usable. Reach for this when a request is "show N people/items as
N objects in 3D," when you need to extract a usable mesh from a downloaded
model, or when building a poster→live "enter the environment" experience.

---

## 1. The 1:1 instancing pattern

- **One mesh, N instances.** Render the population with `THREE.InstancedMesh`
  (one draw call per group/color). Thousands of instances stay smooth; never
  create N separate `Mesh` objects.
- **Volumetric scaling, not radius.** When pile/cluster *size* should encode a
  count, scale the cluster radius by `Math.cbrt(count)` (+ a floor). Linear
  radius wildly over-reads big groups; cube-root keeps volume ∝ population.
- **Per-group color** = separate `InstancedMesh` per category sharing the same
  geometry. Lets you fade/isolate one group (`material.opacity`) cheaply.
- **Honor the data's truth.** Imperfections can be meaningful — e.g. a few
  instances that don't reach the merged cluster can stand in for real-world
  attrition. Don't force-correct them away; name them in the narrative.

## 2. Extracting ONE clean instance from a found model

Downloaded models (Sketchfab GLB/glTF, etc.) are often a **fused mass** of many
copies, not a single reusable unit. To lift one:

1. Parse the GLB binary in `run_script` (12-byte header → JSON chunk length →
   JSON chunk → BIN chunk at `20 + jsonLen + 8`). Read accessors via their
   bufferView + componentType + type.
2. **Connected components** over the index buffer (union-find on triangle
   verts) splits the mass into individual islands.
3. **Score & pick:** filter islands by vertex count band, then rank by
   elongation (longest bbox axis / shortest) toward your ideal shape.
4. **Normalize the pick:** recenter to centroid, reorient longest axis → X,
   second → Y, scale longest dim to 1. Keep the model's own NORMALs if present.
5. Save as a small `bean.json` ({positions, normals, indices}) and load that —
   far lighter than shipping the whole GLB.

### Watch for half-shells (the holes trap)
Many "solid-looking" assets are **open-backed shells** (only the visible surface
is modeled). They look solid in a dense pile because instances occlude each
other, but holes appear once anything moves or you fly inside.

- Diagnose: count **boundary edges** (edges used by only one triangle). A closed
  mesh has ~0; a shell has a big boundary loop. Measure the hole radius vs. the
  bean half-length — if the "hole" ≈ the whole back, it's a half-shell.
- **Capping a large opening with a flat lid → a visible scar** ("Frankenbean").
  Don't.
- **Mirroring the shell across its opening + Taubin smoothing** yields a
  watertight model, but watch for an equator **seam ridge** and loss of crisp
  detail. Acceptable for stills, often too soft for hero close-ups.
- **Best move when resolution matters:** don't repair. Keep the high-res open
  mesh for *motion* (holes read as honest texture and are usually invisible at
  cluster scale), and gate the *resting frame* behind a static poster image so
  open geometry never shows at rest. (See §4.)

## 3. Material & lighting for "premium" instances
- `MeshPhysicalMaterial` with `clearcoat`, modest `transmission`/`thickness`,
  low `roughness` reads as candy/gloss.
- `RoomEnvironment` via `PMREMGenerator` for free, believable reflections;
  ACESFilmic tone mapping; a gentle `UnrealBloomPass` (low strength ~0.4) for
  glow without washing out. Respect `prefers-reduced-motion` everywhere.

## 4. Poster → live "enter the environment" gate
- **Resting state = a static hero image** (full-bleed `background-size:cover`),
  not the live canvas. Hides any open-back geometry and gives a crisp,
  controllable first frame. Optimize the image (re-encode PNG→JPEG ~q0.86; a
  1920×1080 render drops from MBs to ~250 KB).
- **Arm interaction on first intent.** Keep `OrbitControls.enabled = false`
  until the user clicks the poster, presses a key, OR uses any control. Wrap the
  public scene API so every action calls `activate()` first — no way to "miss"
  the trigger. Fade the poster out on activate.
- **Two camera framings:** a pulled-back "diversity" vantage (all groups
  distinct, colourful) for the live entry, and a merged-globe framing for the
  "join" state. The zoomed-in single-instance shot is a great *poster* but a
  poor *live start*.
- **Expose `window.SceneAPI`** (`join/disperse/zoomIn/zoomOut/toggleRotate/
  reset/isolate/getState`) so a surrounding carousel/DC drives the scene in an
  iframe without reaching into its internals.

## 5. Packaging a standalone asset for GitHub Pages
- Ship a folder: `index.html` (the DC export), the scene HTML, `bean.json`,
  `support.js`, `image-slot.js`, the hero image, and a `README.md`.
- **Must be served over http(s)** — `file://` blocks the local `fetch` the scene
  needs. Say so in the README.
- **Full-bleed hero embed:** `<iframe style="width:100%; height:100vh;
  border:0; margin:0" allowfullscreen>` — breaks through page margins, no
  visible box, and `allowfullscreen` keeps an immersive portal working.

## Pitfalls
- Don't cap a large mesh opening with a flat face (scar).
- Don't start the live scene zoomed into one instance — disorienting.
- Don't drive the resting frame off the live canvas if the mesh has holes.
- Don't ship for `file://`; don't forget `allowfullscreen` on the embed.
- Don't linear-scale cluster radius by count; use cube-root.
