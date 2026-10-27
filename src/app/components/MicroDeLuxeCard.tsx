import { useCallback, useEffect, useRef, useState } from "react";

/* The MIC division card: Micro De Luxe on his stage. The 1:1 tile stays as
   the still, and when the card scrolls into view the 10-second clip plays
   (he rises off the plinth). The clip runs once; the still returns when it
   ends. Replay sits in the bottom-left corner (joined by sound on/off
   while the beta clip is current). A beta (β) button in the bottom-right
   plays a second clip, Micro at a younger stage of his life cycle, played
   to the end.

   Sound: silent by default. The rise clip that plays on scroll is always
   muted and shows no sound control, so nothing on the page makes a sound
   the visitor did not ask for. The beta clip plays with sound, since the
   tap on the beta button is the visitor's own choice, and while it is the
   current clip the speaker control appears so the sound can be turned off
   (the choice sticks for later beta plays). Icons are Ionicons (MIT),
   inlined so no font or script loads for them.

   The MIC page's cast list (Greg, 2026-10-26) reuses this player with
   `withSound`: a visitor who has travelled into MIC and clicks a video
   expects to hear it, so there nothing plays on scroll, every clip plays
   with sound when clicked, and the sound-off control shows for every clip.
   The clips are props, so the same player carries Lil Mike (one clip, no
   beta); the defaults are Micro De Luxe's, as on the homepage. A reel can
   instead have a β still (`betaImage`): Lil Mike's headshot (Greg,
   2026-10-26), its β under the replay control; a press shows the picture
   over the clip and pauses it, and a second press, replay or a click on
   the picture returns to the clip. */

const BASE = import.meta.env.BASE_URL;
const POSTER = `${BASE}assets/brand/mic-micro-de-luxe-640.webp`;
const CLIP = `${BASE}assets/brand/micro-de-luxe-rise.mp4`;
// the younger-stage clip, played by the β button
const BETA_CLIP = `${BASE}assets/brand/micro-de-luxe-beta.mp4`;

type ReelProps = {
  resetSignal?: number;
  /** play with sound on click, nothing on scroll, sound-off shown (MIC page) */
  withSound?: boolean;
  poster?: string;
  clip?: string;
  /** the β clip; null for a reel without one */
  betaClip?: string | null;
  clipLabel?: string;
  betaLabel?: string;
  /** a still the β button shows instead of a β clip */
  betaImage?: string;
  betaImageLabel?: string;
  width?: number;
  height?: number;
};

type Clip = "rise" | "beta";

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

export function MicroDeLuxeCard({
  resetSignal = 0,
  withSound = false,
  poster = POSTER,
  clip: clipSrc = CLIP,
  betaClip = BETA_CLIP,
  clipLabel = "Micro De Luxe, the MIC mascot, rises from his stage",
  betaLabel = "Micro De Luxe at a younger stage",
  betaImage,
  betaImageLabel = "",
  width = 720,
  height = 720,
}: ReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showStill, setShowStill] = useState(true);
  const [playedOnce, setPlayedOnce] = useState(false);
  const [clip, setClip] = useState<Clip>("rise");
  const [showBetaImage, setShowBetaImage] = useState(false);
  // the visitor's sound choice: on the homepage it covers the beta clip only
  // (rise is always muted there); with `withSound` it covers every clip
  const [betaSoundOff, setBetaSoundOff] = useState(false);
  const clipRef = useRef<Clip>("rise");
  const betaSoundOffRef = useRef(false);
  const playAfterSwap = useRef(false);
  clipRef.current = clip;
  betaSoundOffRef.current = betaSoundOff;

  // Start the current clip under the sound rule: on the homepage rise is
  // always muted and beta plays with sound unless the visitor turned it off;
  // with `withSound` every clip does. Falls back to muted if the browser
  // refuses sound.
  const start = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    const wantSound = (withSound || clipRef.current === "beta") && !betaSoundOffRef.current;
    v.muted = !wantSound;
    try {
      await v.play();
    } catch {
      if (!wantSound) return;
      v.muted = true;
      setBetaSoundOff(true);
      try {
        await v.play();
      } catch {
        return;
      }
    }
    setShowStill(false);
    setPlayedOnce(true);
  }, [withSound]);

  // Play when the card scrolls into view (once), pause if it scrolls away
  // mid-clip. Visitors who asked for reduced motion get the still and the
  // replay control instead. With `withSound` nothing starts on scroll; the
  // visitor clicks to play, and a clip scrolled away mid-play pauses.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (withSound) {
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && !v.paused) v.pause();
      });
      io.observe(v);
      return () => io.disconnect();
    }
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
  }, [start, withSound]);

  // the speaker control, shown while the beta clip is current, or always with
  // `withSound`
  const toggleBetaSound = () => {
    const v = videoRef.current;
    const next = !betaSoundOff;
    setBetaSoundOff(next);
    if (v && (withSound || clip === "beta")) v.muted = next;
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setShowBetaImage(false);
    v.currentTime = 0;
    void start();
  };

  // β still: show the picture over the clip (pausing it), or put it away
  const toggleBetaImage = () => {
    const v = videoRef.current;
    if (!showBetaImage && v && !v.paused) v.pause();
    setShowBetaImage((on) => !on);
  };

  // β: swap to the younger-stage clip and play it from the top, with sound.
  // Replay then replays whichever clip played last.
  const playBeta = () => {
    if (clip === "beta") {
      replay();
      return;
    }
    playAfterSwap.current = true;
    setClip("beta");
  };
  useEffect(() => {
    if (!playAfterSwap.current) return;
    playAfterSwap.current = false;
    const v = videoRef.current;
    if (!v) return;
    v.load();
    void start();
  }, [clip, start]);

  // Reset: each press of the block under the card (resetSignal ticks up)
  // returns the card to its first state, the rise clip, and plays it from
  // the top, muted, so both clips can be seen as often as the visitor likes.
  useEffect(() => {
    if (resetSignal === 0) return;
    const v = videoRef.current;
    if (!v) return;
    if (clipRef.current === "beta") {
      v.pause();
      playAfterSwap.current = true;
      setClip("rise");
    } else {
      v.currentTime = 0;
      void start();
    }
  }, [resetSignal, start]);

  const soundOn = (withSound || clip === "beta") && !betaSoundOff;
  // with `withSound` a click on the picture itself plays the clip
  const playFromPicture = () => {
    const v = videoRef.current;
    if (withSound && v && v.paused) replay();
  };
  return (
    <div className={`ot-div__art ot-micro${showStill ? " ot-micro--still" : ""}${withSound ? " ot-micro--click" : ""}${showBetaImage ? " ot-micro--beta-img" : ""}`} onClick={playFromPicture}>
      <video
        ref={videoRef}
        className="ot-micro__clip"
        src={clip === "beta" && betaClip ? betaClip : clipSrc}
        poster={poster}
        muted={!soundOn}
        playsInline
        preload={withSound ? "metadata" : "auto"}
        width={width}
        height={height}
        onEnded={() => setShowStill(true)}
        aria-label={clip === "beta" ? betaLabel : clipLabel}
      />
      <img className="ot-micro__still" src={poster} alt="" width={width} height={height} loading="lazy" />
      {betaImage && (
        <img
          className={`ot-micro__beta-img${showBetaImage ? " is-on" : ""}`}
          src={betaImage}
          alt={showBetaImage ? betaImageLabel : ""}
          aria-hidden={!showBetaImage}
          width={width}
          height={height}
          loading="lazy"
        />
      )}
      <div className="ot-micro__ctl" onClick={(e) => e.stopPropagation()}>
        {(withSound || clip === "beta") && (
          <button
            type="button"
            className="ot-micro__btn"
            onClick={toggleBetaSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            title={soundOn ? "Sound off" : "Sound on"}
          >
            {soundOn ? <VolumeIcon /> : <MuteIcon />}
          </button>
        )}
        <button
          type="button"
          className="ot-micro__btn"
          onClick={replay}
          aria-label={`${playedOnce ? "Replay" : "Play"} video${soundOn ? ", with sound" : ""}`}
          title={playedOnce ? "Replay" : "Play"}
        >
          <ReplayIcon />
        </button>
        {betaImage && (
          <button
            type="button"
            className="ot-micro__btn ot-micro__btn--beta"
            onClick={toggleBetaImage}
            aria-pressed={showBetaImage}
            aria-label={showBetaImage ? "Back to the video" : `Show ${betaImageLabel || "the beta picture"} (beta)`}
            title={showBetaImage ? "Back to the video" : "Beta"}
          >
            <span aria-hidden="true">β</span>
          </button>
        )}
      </div>
      {betaClip && (
        <div className="ot-micro__ctl ot-micro__ctl--beta" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="ot-micro__btn ot-micro__btn--beta"
            onClick={playBeta}
            aria-pressed={clip === "beta"}
            aria-label="Play Micro De Luxe at a younger stage (beta), with sound"
            title="Beta: younger Micro"
          >
            <span aria-hidden="true">β</span>
          </button>
        </div>
      )}
    </div>
  );
}
