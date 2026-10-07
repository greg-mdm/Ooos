# WebGL water ripples (reference)

Greg's download of the CodePen "WebGL water ripples" by Martin Laxenaire, saved months before and placed here on 2026-10-07 as the reference for the black water behind the Vivarium tower on the CID page.

- Pen: https://codepen.io/martinlaxenaire/pen/OJVKVYa
- Licence: MIT (see `LICENSE.txt`, as CodePen exported it)
- Files: `README.md`, `LICENSE.txt`, `index.html`, `style.css`, `script.js`, as exported from the pen. The pen loads curtains.js and dat.gui from CDNs, and a photograph from Unsplash.

## Credit chain

Laxenaire's pen is a port to curtains.js of Liam Egan's (@shubniggurath) pen https://codepen.io/shubniggurath/pen/OEeMOd, from three.js, and borrows most of its fragment shaders from there, lightly tweaked (the pen's own README). The line-distance-field way of drawing the pointer's path comes from Edan Kwan, https://codepen.io/edankwan/pen/YzXgxxr, credited in the shader.

## What the site uses from it

The two-pass ping-pong ripple simulation and the lighting pass, rewritten on plain WebGL in `src/app/components/WaterBackdrop.tsx` (no curtains.js, no dat.gui, no photograph). Adaptations: matte black surface; the simulation runs only while the water has energy, a few seconds after the last pointer move, and otherwise draws nothing; it pauses off screen; reduced motion gets the still surface; without WebGL the ground is plain black.

## Chicago style (notes and bibliography)

Bibliography:

Laxenaire, Martin. "WebGL Water Ripples." CodePen. Accessed October 7, 2026. https://codepen.io/martinlaxenaire/pen/OJVKVYa.

Egan, Liam. Untitled pen (OEeMOd). CodePen. Accessed October 7, 2026. https://codepen.io/shubniggurath/pen/OEeMOd.

Notes:

1. Martin Laxenaire, "WebGL Water Ripples," CodePen, accessed October 7, 2026, https://codepen.io/martinlaxenaire/pen/OJVKVYa.

2. Liam Egan, untitled pen (OEeMOd), CodePen, accessed October 7, 2026, https://codepen.io/shubniggurath/pen/OEeMOd.

The pen's own creation date is not in the export; if it is wanted in the citation, it is on the pen's details page.
