/* The forest behind the Vivarium tower: Greg's phthalo forest clip (SPRINT
   6/PHTALO FOREST VIDEO.mp4), prepared as a slow, seamless loop and shown
   only as background. It sits at the foot of the canopy block, so the clip
   ends where the forest meets the ground, just below the tower, and the
   fallen leaves along its bottom edge lie behind the three nametags. Above
   its top edge it fades into the ground colour, so the upper floors stand
   against the dark of the woods rather than a hard picture edge.

   The loop (public/assets/video/cid-phthalo-forest-loop.mp4) is the clip run
   forward and then back, so it rejoins itself with no jump, slowed three
   times with motion-interpolated frames so the mist drifts rather than
   steps. Muted, looping, no controls: atmosphere, not content. It plays only
   while on screen, and visitors who ask for reduced motion get the poster.

   The idea of a forest that lives behind the content, with the ground at
   the bottom, came from Andrej Sharapov's "Forest Parallax" (CodePen, May
   23, 2019, MIT; source and licence in SPRINT 6/references). Its drawn
   placeholder layers were retired for the clip on 2026-10-06. */
import { useEffect, useRef } from "react";

/* Playback rate for the loop. The encode is already three times slower
   than the clip; at 0.5 the forest moves six times slower than life
   (Greg, 2026-10-07: at full rate it moved too fast). Change this one
   number to retune it. */
const FOREST_RATE = 0.5;

/* Two encodes of the same loop: the 1440x810 one for screens 760px and
   wider, where the clip is scaled to the full height of the tower, and
   the 960x540 one (4.5MB against 7.8MB) for phones. The browser picks by
   the media query on the first source. */
export function ForestBackdrop({ videoSrc, videoSrcWide, poster }: { videoSrc: string; videoSrcWide?: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.defaultPlaybackRate = FOREST_RATE;
    v.playbackRate = FOREST_RATE;
    const keepRate = () => {
      v.playbackRate = FOREST_RATE;
    };
    v.addEventListener("loadedmetadata", keepRate);
    v.addEventListener("play", keepRate);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    // play only while any of the clip is on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.01 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("loadedmetadata", keepRate);
      v.removeEventListener("play", keepRate);
    };
  }, []);

  return (
    <div className="cid-viv-forest" aria-hidden="true">
      <video
        ref={ref}
        className="cid-viv-forest__video"
        poster={poster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        tabIndex={-1}
      >
        {videoSrcWide && <source src={videoSrcWide} media="(min-width: 760px)" type="video/mp4" />}
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
