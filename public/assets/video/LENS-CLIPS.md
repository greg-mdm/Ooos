# Lens clips — "Two Ways of Seeing" (CID Vivarium)

The two contrasting previews each play a **list of clips**. The active lens
auto-advances to its next clip when one ends (cycling); the other lens holds on
its still frame. Panels are 3:2 so the field still fills with no crop.

## Add a clip

1. **Upload the raw clip** to the repo (MOV / HEVC is fine — it gets
   re-encoded). A good home is `public/assets/lens-src/`.
2. **Process it** to a web-ready clip (trims to 4s, drops audio, H.264,
   faststart):
   ```bash
   bash scripts/add-lens-clip.sh <source> <ethel|icarus> <name>
   # e.g. bash scripts/add-lens-clip.sh public/assets/lens-src/fire2.mov icarus fire2
   #      -> public/assets/video/greg-icarus-fire2.mp4
   ```
   (Needs `ffmpeg`. No ffmpeg locally? Upload the raw clip and ask Claude to run
   this step.)
3. **Register it**: add the new filename to that lens's `clips` array in
   `src/app/components/CID.tsx` → `GregLensSlider` → `LENSES`.
4. `npm run build`, commit, and deploy to `main`.

## Current clips

| Lens | Clips (in play order) | Still |
|------|-----------------------|-------|
| **ethel** (ⓔMage) | `greg-ethel-lens.mp4` (calm, at the portal), `greg-ethel-emage1.mp4`, `greg-ethel-emage783.mp4` (eMAGE channel idents) | `assets/greg-ethel-field.webp` (the field shot) |
| **icarus** (Ⅲ Vision) | `greg-icarus-lens.mp4` (close-up), `greg-icarus-wide.mp4` (wide) | `greg-icarus-still.webp` |

`greg-ethel-lens.mp4` is `Ethel Preview.mp4` trimmed to 0–7.1s: the source clip
cuts hard from a calm portal scene into a lightning/transformation climax at
~7.15s, and Ethel's side is meant to stay calm, so only the calm portion is
used. If a replacement calm clip is ever needed, re-trim from the original
`Ethel Preview.mp4` before that cut point, not after it.

Spares kept in this folder as raw sources: `iVision-Wide.mp4`,
`I-vision-CloseUp.MOV`, `Ethel Preview.mp4`, `Wide-Field-GL.png`,
`E-Mage 1.mp4`, `eMAGE-7.83.mp4`.
