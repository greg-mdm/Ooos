# Shader backups

Byte-for-byte copies of the WebGL pages in `public/`, taken 2026-09-06 at
Greg's request after the display room appeared not to load for him.

| File | Lives at | Last commit to it |
|---|---|---|
| DISPLAY_ROOM_BLUE_checker_cm.html | public/DISPLAY_ROOM_BLUE_checker_cm.html | 304b7c0 |
| DISPLAY ROOM - GEEKOM.html | public/DISPLAY ROOM - GEEKOM.html | c58c3b9 |
| Aurora-Ooo-Card.html | public/Aurora-Ooo-Card.html | 2a25db7 |

The display room is the "floating viv": the vitrine on /cid, loaded in an
iframe as `DISPLAY_ROOM_BLUE_checker_cm.html?v=5`. Its known failure mode
is a canvas stuck at 1x1 when the iframe is laid out after the first render;
the fix (a ResizeObserver that redraws when the canvas gets a size) is in
the file as of 304b7c0.

## Restore

From the repo root:

    cp "SPRINT 5 - CURRENT/backups/shaders/DISPLAY_ROOM_BLUE_checker_cm.html" public/

then bump the `?v=` on the iframe src in src/app/components/CID.tsx so browsers
drop their cached copy, build, and push to main.

Git history is the deeper backup: `git show 304b7c0:public/DISPLAY_ROOM_BLUE_checker_cm.html`.
