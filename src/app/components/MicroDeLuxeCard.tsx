import { useCallback, useEffect, useRef, useState } from "react";

/* The MIC division card: Micro De Luxe on his stage. The 1:1 tile stays as
   the still, and when the card scrolls into view the 10-second clip plays
   (he rises off the plinth). The clip runs once; the still returns when it
   ends. Two controls sit in the corner: sound on/off and replay.

   Sound: the clip tries to play with sound. Browsers only allow that once
   the visitor has interacted with the page, so if it is refused the clip
   plays muted and the speaker icon shows it, and a tap on the icon turns
   the sound on. Icons are Ionicons (MIT), inlined so no font or script
   loads for them. */

const BASE = import.meta.env.BASE_URL;
const POSTER = `${BASE}assets/brand/mic-micro-de-luxe-640.webp`;
const CLIP = `${BASE}assets/brand/micro-de-luxe-rise.mp4`;

function VolumeIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
      <path d="M126 192H56a8 8 0 00-8 8v112a8 8 0 008 8h69.65a15.93 15.93 0 0110.14 3.54l91.47 74.89A8 8 0 00240 392V120a8 8 0 00-12.74-6.43l-91.47 74.89A15 15 0 01126 192zM320 320c9.74-19.38 16-40.84 16-64 0-23.48-6-44.42-16-64M368 368c19.48-33.92 32-64.06 32-112s-12-77.74-32-112M416 416c30-46 48-91.43 48-160s-18-113-48-160" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="currentColor">
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" d="M416 432L64 80" />
      <path d="M224 136.92v33.8a4 4 0 001.17 2.82l24 24a4 4 0 006.83-2.82v-74.15a24.53 24.53 0 00-12.67-21.72 23.91 23.91 0 00-25.55 1.83 8.27 8.27 0 00-.66.51l-31.94 26.15a4 4 0 00-.29 5.92l17.05 17.06a4 4 0 005.37.26zM224 375.08l-78.07-63.92a32 32 0 00-20.28-7.16H64v-96h50.72a4 4 0 002.82-6.83l-24-24a4 4 0 00-2.82-1.17H56a24 24 0 00-24 24v112a24 24 0 0024 24h69.76l91.36 74.8a8.27 8.27 0 00.66.51 23.93 23.93 0 0025.85 1.69A24.49 24.49 0 00256 391.45v-50.17a4 4 0 00-1.17-2.82l-24-24a4 4 0 00-6.83 2.82zM352 256c0-24.56-5.81-47.88-17.75-71.27a16 16 0 00-28.5 14.54C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 002.32 6.25l19.66 19.67a4 4 0 006.75-2A146.89 146.89 0 00352 256zM416 256c0-51.19-13.08-83.89-34.18-120.06a16 16 0 00-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 001.9 8.26l16.77 16.76a4 4 0 006.52-1.27C410.09 315.88 416 289.91 416 256z" />
      <path d="M480 256c0-74.26-20.19-121.11-50.51-168.61a16 16 0 10-27 17.22C429.82 147.38 448 189.5 448 256c0 47.45-8.9 82.12-23.59 113a4 4 0 00.77 4.55L443 391.39a4 4 0 006.4-1C470.88 348.22 480 307 480 256z" />
    </svg>
  );
}
function ReplayIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
      <path d="M320 146s24.36-12-64-12a160 160 0 10160 160" strokeMiterlimit="10" />
      <path d="M256 58l80 80-80 80" />
    </svg>
  );
}

export function MicroDeLuxeCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [showStill, setShowStill] = useState(true);
  const [playedOnce, setPlayedOnce] = useState(false);

  // Start the clip: with sound first, muted if the browser refuses.
  const start = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    try {
      await v.play();
      setMuted(false);
    } catch {
      v.muted = true;
      setMuted(true);
      try {
        await v.play();
      } catch {
        return;
      }
    }
    setShowStill(false);
    setPlayedOnce(true);
  }, []);

  // Play when the card scrolls into view (once), pause if it scrolls away
  // mid-clip. Visitors who asked for reduced motion get the still and the
  // replay control instead.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let done = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!done && v.paused && !v.ended) void start();
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.6 },
    );
    const onEnded = () => {
      done = true;
    };
    v.addEventListener("ended", onEnded);
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("ended", onEnded);
    };
  }, [start]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void start();
  };

  return (
    <div className={`ot-div__art ot-micro${showStill ? " ot-micro--still" : ""}`}>
      <video
        ref={videoRef}
        className="ot-micro__clip"
        src={CLIP}
        poster={POSTER}
        playsInline
        preload="auto"
        width="720"
        height="720"
        onEnded={() => setShowStill(true)}
        aria-label="Micro De Luxe, the MIC mascot, rises from his stage"
      />
      <img className="ot-micro__still" src={POSTER} alt="" width="640" height="640" loading="lazy" />
      <div className="ot-micro__ctl">
        <button
          type="button"
          className="ot-micro__btn"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          title={muted ? "Sound on" : "Sound off"}
        >
          {muted ? <MuteIcon /> : <VolumeIcon />}
        </button>
        <button
          type="button"
          className="ot-micro__btn"
          onClick={replay}
          aria-label={playedOnce ? "Replay video" : "Play video"}
          title={playedOnce ? "Replay" : "Play"}
        >
          <ReplayIcon />
        </button>
      </div>
    </div>
  );
}
