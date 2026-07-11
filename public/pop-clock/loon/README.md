# Loon states — Ooo! Pop Clock visual metaphor

Transparent PNGs used by the pop-clock preview to show the day's net direction.
When the population's change-since-midnight is **up**, the loon rides the surface;
when it's a **net dip**, the loon dives below the waterline.

Upload here (transparent background, same canvas size + same loon position/scale
so they swap cleanly):

- `loon-surface.png`  — net positive: loon floating on the water (default/up)
- `loon-dive.png`     — net negative: loon dipping below the surface (down)
- `loon-neutral.png`  — optional: flat / ~zero net (idle)

Notes
- Keep the horizon/waterline at the same Y in every frame.
- Same facing direction across frames.
- Export at 2× the display size for crispness (the widget scales down).
