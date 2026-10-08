# Reality / Hyperreality slider (reference)

Claude Design's export of the slider, "Reality Slider - ooos.html", as Greg downloaded it on 2026-10-08 and approved as read. It is a self-contained bundle: the page template, a design-component runtime, React 18.3.1, the water engine, Inter, two 3:4 crops of the photographs and their blurred placeholders, all packed as base64 inside the file.

## What the site uses from it

- `src/app/components/RealitySlider.tsx`: the component, ported from the bundle's design-component class to a React function component. Mechanics, timings and inks unchanged.
- `src/app/components/reality-water.ts`: the bundle's water engine, typed, with the image sources passed in. Its ripple pass is the one behind the Vivarium tower (`WaterBackdrop.tsx`); its draw pass refracts the photographs, as Martin Laxenaire's original pen did. Credit chain and Chicago references: `../water-ripples-laxenaire/NOTES.md`.
- `src/styles/reality-slider.css`: the export's inline styles as classes.
- `public/assets/reality-slider/`: the photographs, whole rather than the export's 3:4 crops (Greg, 2026-10-08: no crop, no zoom). The frame takes the hyperreality photo's proportions (2339 x 3942); the convocation photo, 2316 x 3088, is padded above and below with Darkest Indigo, the water's ink. Originals: `public/assets/exhibition/greg tyler mdm june 2026.jpg` and `greg hyperreality - cid viv.jpg`.

Two values in the export are not in the canon palette on ooos.ca/about: the rail grey #353F42 and the resting caption grey #C2CDCF. They are kept as approved and noted in `reality-slider.css`.

Placement: the side column of the RACI panel on the CID page, under the RACI key, on a Midnight plate.
