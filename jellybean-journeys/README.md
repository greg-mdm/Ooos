# JellyBean Journeys — Immersive Data Visualization

A standalone, interactive 3D data visualization of TMU's top-5 international
student countries (2023–2024). 2,914 jelly beans, one per student.

## Files (upload ALL of them, keep them together)

```
index.html            ← the experience (open / link to this)
JellyBeanScene.html   ← the live 3D scene (loaded by index.html)
bean.json             ← the jelly-bean mesh data
image-slot.js         ← drag-and-drop slots for the report slides
support.js            ← runtime
hero-journeys.jpg     ← resting hero image
```

## Hosting

Serve the folder over **http(s)** — e.g. GitHub Pages, Netlify, or any static
host. (Opening `index.html` straight from disk with `file://` will not work,
because browsers block the data the scene needs to load locally.)

Once hosted, link people to `index.html`.

## Embedding it as a full-bleed hero (above "Featured Experiences")

Drop this where the hero should go. It fills the width edge-to-edge with no
border or box:

```html
<iframe
  src="https://YOUR-USERNAME.github.io/jellybean-journeys/index.html"
  title="JellyBean Journeys — Immersive Data Visualization"
  style="display:block; width:100%; height:100vh; border:0; margin:0;"
  loading="lazy"
  allowfullscreen></iframe>
```

- `width:100%` + `border:0` → breaks through page margins, no visible box.
- `height:100vh` → maximizes the screen. Lower it (e.g. `82vh`) if you want the
  "Featured Experiences" heading to peek in below the fold.
- `allowfullscreen` → lets the **OFF / ON** black-hole portal expand the scene
  to true fullscreen.

## Internet

The 3D engine (Three.js + GSAP) loads from a public CDN, so a connection is
required the first time it runs.
