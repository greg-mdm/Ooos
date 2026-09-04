import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import "../../styles/cid-continuum.css";
import "../../styles/cid-forest.css";
import "../../styles/cid-vivarium.css";
// The strategy keys reuse the homepage division-key design (.ood-key et al).
import "../../styles/ooodivisions2.css";

// The three CID strategy pillars, set as the same pressable black keys the
// homepage uses on the division cards. The KEY FACES are lifted verbatim
// from the CID column in OooDivisions.tsx: same radial gradients, same
// brightest-to-darkest ramp, same Bright Silver legend. That is the part
// Greg means by "the same design", and it is what carries between pages.
//
// The SURROUND is not shared, because the ground is not the same. On the
// homepage these keys glow out of a dark aurora field, so their shadows are
// near-black at high opacity and the lit state blooms purple. Dropped
// unchanged onto CID's robin's-egg they read as soot: a heavy black smear
// under each key on a pale ground. So the shadows here are the site indigo
// at lower opacity with a negative spread, which reads as lift rather than
// dirt, and the hover and pressed states swap the bloom for a ring (see
// cid-vivarium.css). The keys themselves are untouched.
const KEY_GRAD = (a: string, b: string, c: string) =>
  `radial-gradient(135% 165% at 50% -34%,${a} 0%,${b} 42%,${c} 100%)`;

const STRATEGY_KEYS: { bg: string; shadow: string; lines: [string, string] }[] = [
  {
    bg: KEY_GRAD("rgb(174,153,201)", "rgb(70,46,134)", "rgb(24,16,46)"),
    shadow: "0 18px 34px -18px rgba(26,22,70,0.46)",
    lines: ["Energize economic expansion.", "Empower inclusive growth."],
  },
  {
    bg: KEY_GRAD("rgb(152,133,179)", "rgb(54,35,104)", "rgb(18,12,35)"),
    shadow: "0 15px 30px -16px rgba(26,22,70,0.40)",
    lines: ["Gather collective intelligence.", "Integrate verified data sources."],
  },
  {
    bg: KEY_GRAD("rgb(126,110,151)", "rgb(37,23,74)", "rgb(13,8,25)"),
    shadow: "0 12px 26px -14px rgba(26,22,70,0.34)",
    lines: ["Boost business confidence.", "Build global partnerships."],
  },
];

/** The three pillars as pressable keys, matching the homepage exactly in
 *  behaviour as well as look: each key toggles lit on click and reports its
 *  state with aria-pressed. */
function StrategyKeys() {
  const [lit, setLit] = useState<Record<number, boolean>>({});
  return (
    <ul className="ood-keys cid-strategy-keys">
      {STRATEGY_KEYS.map((k, i) => {
        const on = !!lit[i];
        return (
          <li className="ood-key-wrap" key={i} style={{ filter: `drop-shadow(${k.shadow})` }}>
            <button
              type="button"
              className={`ood-key${on ? " is-on" : ""}`}
              aria-pressed={on}
              onClick={() => setLit((s) => ({ ...s, [i]: !s[i] }))}
              style={{ background: k.bg }}
            >
              <span className="ood-label">
                <span className="cid-strategy-bullets">
                  {k.lines.map((line) => (
                    <span className="cid-strategy-bullet" key={line}>{line}</span>
                  ))}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}


// "Two ways of seeing Greg": one vertical screen, two settings. Pressing a lens
// button slides the stage to that view (Ethel's or Icarus's), animated. The
// clips are supplied separately and drop into each panel's <video>; until then
// each panel shows a labelled placeholder slot.
function GregLensSlider({ base }: { base: string }) {
  // Each lens plays through its own list of clips (the active lens auto-advances
  // to the next when one ends, cycling). The other lens holds on its still.
  // TO ADD OR RE-TRIM A CLIP: optimize it to a web H.264 mp4
  // (scripts/add-lens-clip.sh), drop it in public/assets/video/, add its
  // filename to that lens's `clips` array below, AND BUMP LENS_V. Filenames
  // are reused across edits (e.g. re-trimming greg-ethel-lens.mp4), and
  // browsers cache video by URL, so without a version bump a visitor who
  // already loaded the page can keep playing the old cached clip indefinitely.
  // See SPRINT 4 - REFERENCES/LENS-CLIPS.md.
  const LENS_V = 6;
  const V = `${base}assets/video/`;
  // Each clip carries its own aspect so the lids can be sized to the exact
  // letterbox band it leaves. Without the ratio a lid is guesswork, and a lid
  // that guesses high covers picture.
  const cv = (name: string, ar: number) => ({ src: `${V}${name}?v=${LENS_V}`, ar });
  // The stage is 3:2. A clip wider than that leaves a band above and below
  // under object-fit: contain; one at or under 3:2 fills and leaves none. Lenses
  // set to cover never band at all, because cover trims the sides instead.
  const STAGE_AR = 1.5;
  const bandOf = (ar: number, fit: string) =>
    fit === "cover" ? 0 : Math.max(0, (1 - STAGE_AR / ar) / 2);
  const LENSES = [
    { key: "ethel",  fit: "contain", device: "ⓔMage",   station: "ΩStation 7.83", glyph: "꩜", label: "Greg, as Ethel sees him",  still: `${base}assets/greg-ethel-field-v2.webp?v=${LENS_V}`, clips: [cv("greg-ethel-wave.mp4", 1280/854), cv("greg-ethel-emage1.mp4", 16/9), cv("greg-ethel-emage783.mp4", 16/9)] },
    { key: "icarus", fit: "cover",   device: "Ⅲ Vision", station: "αLiveShow",     glyph: "🔺", label: "Greg, as Icarus sees him", still: `${V}greg-icarus-still.webp?v=${LENS_V}`,           clips: [cv("greg-icarus-lens.mp4", 888/528), cv("greg-icarus-wide.mp4", 16/9)] },
  ];
  // Start with Icarus playing and Ethel (the field shot) held as a still.
  const [active, setActive] = useState(1);
  const [clipIdx, setClipIdx] = useState(0);
  const pick = (i: number) => { setActive(i); setClipIdx(0); };
  return (
    <div className="cid-lens">
      <div className="cid-lens-duo">
        {LENSES.map((l, i) => {
          const on = active === i;
          const at = clipIdx % l.clips.length;
          const clip = l.clips[at];
          const band = bandOf(clip.ar, l.fit);
          return (
            <div className={`cid-lens-cell cid-lens-cell--${l.key} ${on ? "is-active" : ""}`} key={l.key}>
              <button
                type="button"
                className="cid-lens-panel"
                aria-pressed={on}
                aria-label={on ? l.label : `Play ${l.label}`}
                onClick={() => pick(i)}
                style={{ "--lid": `${(band * 100).toFixed(3)}%` } as CSSProperties}
              >
                {on ? (
                  <video
                    key={clip.src}
                    className="cid-lens-video"
                    src={clip.src}
                    poster={l.still}
                    /* The still beside it carries role="img" and this same label,
                       so without it the lens announces itself when paused and goes
                       silent the moment it plays. */
                    aria-label={l.label}
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => setClipIdx((x) => (x + 1) % l.clips.length)}
                  />
                ) : (
                  <div className="cid-lens-still" role="img" aria-label={l.label} style={{ backgroundImage: `url("${l.still}")` }} />
                )}
                {/* Eyelids. They occupy exactly the letterbox band the current
                    clip leaves, so they never reach into the picture: at --lid 0
                    they have no height and nothing renders. Decorative only. */}
                <span className="cid-lens-lid cid-lens-lid--top" aria-hidden="true" />
                <span className="cid-lens-lid cid-lens-lid--bot" aria-hidden="true" />
              </button>
              <div className="cid-lens-cap">
                <span className="cid-lens-btn-glyph" aria-hidden="true">{l.glyph}</span>
                <span className="cid-lens-btn-device">{l.device}</span>
                <span className="cid-lens-btn-station">{l.station}</span>
                {on && l.clips.length > 1 && (
                  <span className="cid-lens-dots" aria-hidden="true">
                    {l.clips.map((_, k) => <span key={k} className={`cid-lens-dot ${k === at ? "on" : ""}`} />)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/** Roman numeral three, drawn as vector strokes so no font substitution,
 *  copy-paste or OCR pass can turn it back into the letters "III" (which
 *  get misread as 111 or iii). This is the canonical way to set Icarus's
 *  name anywhere on the site. */
function IcarusName() {
  return (
    <span className="cid-icarus" role="text" aria-label="Icarus the Third">
      Icarus{" "}
      <svg className="cid-icarus-num" viewBox="0 0 66 40" aria-hidden="true" focusable="false">
        {/* three seriffed uprights: stem plus top and bottom bars, weighted to
            sit with the 900-weight name beside it */}
        <rect x="5" y="7" width="6" height="26" />
        <rect x="0" y="4.2" width="16" height="4" />
        <rect x="0" y="31.8" width="16" height="4" />
        <rect x="30" y="7" width="6" height="26" />
        <rect x="25" y="4.2" width="16" height="4" />
        <rect x="25" y="31.8" width="16" height="4" />
        <rect x="55" y="7" width="6" height="26" />
        <rect x="50" y="4.2" width="16" height="4" />
        <rect x="50" y="31.8" width="16" height="4" />
      </svg>
    </span>
  );
}

/* ---- Character film roll ----------------------------------------------
   A roll of character frames running the full width of the page, one of
   them spotlighted. Pressing a frame widens it and drops the others back;
   the arrows move the spotlight along the roll and scroll it into view.
   Greg's sketch: the art itself is the control, not a nametag under it, and
   the roll runs to the page edges rather than sitting inside the text
   column.

   IT LIVES OUTSIDE .cid-viv-stack, as a direct child of the section. The
   band has to be page-width, and every break-out trick for escaping the
   container costs something: calc(50% - 50vw) centres on whatever column it
   sits in (which is why .cid-vault carries a --viv-gutter instead), and
   --viv-gutter itself leans on 100vw, which counts the scrollbar and
   overshoots by exactly the 8px this page has been carrying. Outside the
   container none of that applies: width is 100% of a full-width section,
   which is the real viewport width, scrollbar excluded. It renders in the
   same place it did inside the column, because the side panel has already
   run out by then.

   THE MEDIA IS NOT INSIDE THE BUTTON. It used to be, in the GregLensSlider
   idiom, and that ruled out native video controls: controls are interactive,
   and interactive content cannot nest inside a button. Now the shot is a
   plain box holding the media, a transparent hit button laid over it (the
   art is still the control, and the keyboard still lands on it), and, on a
   lit video, a full-screen button in the corner. The film autoplays muted on
   a loop while it holds the spotlight and shows its poster otherwise; full
   screen hands it to the browser's own player, controls and all.

   ON A PHONE THE ROLL IS A PAGER. One frame fills the band edge to edge and
   the others wait offscreen, so no neighbour is ever visible beside the lit
   card; a swipe or an arrow brings the next one across and the spotlight
   follows whichever frame settles. Each shot keeps its own aspect ratio
   there (16:9, 4:3, 4:5), which is what stops the film being letterboxed
   into a fixed-height box, the squish the September mobile shots showed. */
type CidSpec = { label: string; value: string };
type CidCharacter = {
  key: string;
  /** Nameplate label. A node, so Icarus keeps his vector numeral. */
  name: ReactNode;
  /** The same name as plain text, for the button's accessible name. */
  plain: string;
  /** Role line. Verbatim from CASE_BAYS, which is where these are canon.
   *  An empty string renders no line rather than inventing one. */
  role: string;
  media:
    | { kind: "video"; src: string; poster: string }
    | { kind: "image"; src: string };
  /** Still shown in the roll when this frame is not spotlighted. */
  thumb: string;
  /** Width over height of the lit media. On a phone the shot takes exactly
   *  this shape, so nothing is letterboxed or cropped; on wider screens the
   *  frame is a fixed height and the media is contained inside it. */
  ratio: number;
  alt: string;
  /** Sector nodes, set as pills under a "Sector Nodes" heading. */
  nodes?: string[];
  /** Partnership tags, set as small keys in the strategy-key idiom. A node
   *  rather than a string so an acronym can carry its expansion in <abbr>. */
  partners?: { key: string; label: ReactNode }[];
  /** Heading over the partner keys. Greg's copy, verbatim. */
  partnersHeading?: string;
  /** Stats block, per character. Empty until the copy is written; the frame
   *  omits the list entirely, so adding a row here is the only edit needed. */
  specs: CidSpec[];
};

/* Reading order is the staging: Ethel at the left, Icarus at the right, and
   the Sturgeon General swimming between them. */
const CAST = (base: string): CidCharacter[] => [
  {
    key: "ethel",
    name: "Ethel",
    plain: "Ethel",
    role: "Ethical Analyst",
    // Video only once she holds the spotlight; off it, the frame is the still.
    // The two are the same shape, 1280x720 against a 1240x698 still, so the
    // frame does not change size when the video takes over from the poster.
    media: {
      kind: "video",
      src: `${base}assets/video/ethel-preview-web.mp4`,
      poster: `${base}assets/images/cid-char-ethel.webp`,
    },
    thumb: `${base}assets/images/cid-char-ethel.webp`,
    ratio: 16 / 9,
    alt: "Ethel at her station in a cavern of violet light, masked, her hands over a glowing circular console.",
    specs: [],
  },
  {
    key: "sturgeon",
    name: "The Sturgeon General",
    plain: "The Sturgeon General",
    role: "High North Vanguard",
    // Greg's copy, verbatim, including the plus signs and the en dashes. The
    // en dash is his own character in CANADA–EU and not the em dash the
    // house rule bans; the plus is how he set the sector pairs.
    nodes: ["Maritime + Subsea Systems", "Defence + Simulation", "Geospatial Intelligence"],
    // "Partners in PEARL" is Greg's heading for this group, verbatim. PEARL
    // is set as he supplied it; no expansion has been given for it yet, so
    // none is invented here.
    partnersHeading: "Partners in PEARL",
    partners: [
      { key: "indigenous", label: "CANADA–INDIGENOUS" },
      { key: "eu", label: <>CANADA–<abbr title="European Union">EU</abbr></> },
      { key: "nordic", label: "CANADA–NORDIC" },
    ],
    media: {
      kind: "video",
      src: `${base}assets/video/STURGEN GEN CID Creature Reveal.mp4`,
      poster: `${base}assets/images/sturgeon-general-reveal-poster.webp`,
    },
    thumb: `${base}assets/images/sturgeon-general-reveal-poster.webp`,
    ratio: 4 / 3,
    alt: "The Sturgeon General in profile above an Arctic ice field, then a close view of the eye housing as it powers up.",
    specs: [],
  },
  {
    key: "icarus",
    name: <IcarusName />,
    plain: "Icarus the Third",
    role: "Executive Trader",
    media: { kind: "image", src: `${base}assets/images/cid-char-icarus.webp` },
    thumb: `${base}assets/images/cid-char-icarus.webp`,
    ratio: 4 / 5,
    alt: "Icarus the Third seated on a mound of world currency coins in a vault, holding a top hat that pours out more.",
    specs: [],
  },
];

/** Who holds the spotlight when the page loads. By key, not by index: the
 *  General opens the roll from the middle, and naming him means reordering the
 *  cast again cannot quietly hand the spotlight to whoever lands first. */
const OPENS_LIT = "sturgeon";

function CharacterRoll({ base }: { base: string }) {
  const cast = CAST(base);
  // Falls back to the first frame if the named character ever leaves the cast,
  // so a bad key cannot leave the roll with nothing lit.
  const opensAt = Math.max(0, cast.findIndex((c) => c.key === OPENS_LIT));
  const [at, setAt] = useState(opensAt);
  const roll = useRef<HTMLDivElement | null>(null);
  const frames = useRef<(HTMLButtonElement | null)[]>([]);
  const lit = useRef<HTMLVideoElement | null>(null);

  // Scrolls the roll so frame i sits centred, horizontally only. Not
  // scrollIntoView: that also scrolls the page vertically to the frame, and
  // on load the band is below the fold, so the opening scroll would yank the
  // reader down the page to it.
  const centre = (i: number, behavior: ScrollBehavior) => {
    const r = roll.current;
    const el = frames.current[i]?.closest<HTMLElement>(".cid-cast-frame");
    if (!r || !el) return;
    const left = el.offsetLeft + el.offsetWidth / 2 - r.clientWidth / 2;
    r.scrollTo({ left, behavior });
  };
  // Moving the spotlight also brings the frame into view, which is the whole
  // point of the arrows once the roll is longer than the page is wide, and on
  // a phone is the only way the next card arrives at all.
  const go = (n: number, focus: boolean) => {
    const i = (n + cast.length) % cast.length;
    setAt(i);
    if (focus) frames.current[i]?.focus({ preventScroll: true });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    centre(i, still ? "auto" : "smooth");
  };

  // The phone pager opens on the lit frame rather than on Ethel at the left
  // edge. Instant, so nothing animates before the page has settled.
  useEffect(() => { centre(opensAt, "auto"); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // THE ROLL IS AS TALL AS THE LIT FRAME, on a phone. A flex row is as tall
  // as its tallest child, and the General's pills make his frame the tallest,
  // so Ethel's card would otherwise carry his height as a slab of black under
  // her nameplate. Measured, because the height is the content's. The CSS
  // only reads --roll-h inside the phone block; wider layouts keep their
  // fixed frame height and ignore it.
  const [rollH, setRollH] = useState<number | null>(null);
  useEffect(() => {
    const el = frames.current[at]?.closest<HTMLElement>(".cid-cast-frame");
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setRollH(Math.round(e.contentRect.height)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [at]);

  // A SWIPE IS ALSO A CHOICE. When the roll is a pager (one frame per
  // screen) the spotlight follows whichever frame the scroll settles on, so
  // swiping to Ethel lights Ethel instead of leaving a dimmed still beside
  // the arrows. Nearest-centre after the scroll goes quiet; the arrows set
  // the same index they scroll to, so this never fights them. Off the phone
  // the three frames fill the band and nothing scrolls, so it never runs.
  useEffect(() => {
    const r = roll.current;
    if (!r) return;
    let t = 0;
    const settle = () => {
      if (r.scrollWidth <= r.clientWidth + 1) return;
      const mid = r.scrollLeft + r.clientWidth / 2;
      let best = 0, gap = Infinity;
      frames.current.forEach((b, i) => {
        const el = b?.closest<HTMLElement>(".cid-cast-frame");
        if (!el) return;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < gap) { gap = d; best = i; }
      });
      setAt(best);
    };
    const onScroll = () => { window.clearTimeout(t); t = window.setTimeout(settle, 140); };
    r.addEventListener("scroll", onScroll, { passive: true });
    return () => { r.removeEventListener("scroll", onScroll); window.clearTimeout(t); };
  }, []);

  // FULL SCREEN HANDS THE FILM TO THE BROWSER'S PLAYER. The roll's video is
  // a muted loop with no controls, because it sits under a hit button and
  // controls cannot be reached there. In full screen it is the top layer on
  // its own, so it gets the native controls for as long as it is there, and
  // loses them again on the way out. iPhone Safari has no element full
  // screen at all, only the video's own webkitEnterFullscreen, which opens
  // the system player with its controls built in; that is the fallback.
  useEffect(() => {
    const sync = () => {
      const v = lit.current;
      if (v) v.controls = document.fullscreenElement === v;
    };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const fullScreen = () => {
    const v = lit.current;
    if (!v) return;
    type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (document.fullscreenEnabled && v.requestFullscreen) {
      v.requestFullscreen().catch(() => (v as IOSVideo).webkitEnterFullscreen?.());
    } else {
      (v as IOSVideo).webkitEnterFullscreen?.();
    }
  };

  return (
    <div
      className="cid-cast"
      style={{
        "--lit-ratio": String(cast[at].ratio),
        "--roll-h": rollH ? `${rollH}px` : undefined,
      } as CSSProperties}
    >
      <div className="cid-cast-rollwrap">
        <button
          type="button"
          className="cid-cast-arrow cid-cast-arrow--prev"
          aria-label="Spotlight the previous character"
          onClick={() => go(at - 1, false)}
        >
          <span aria-hidden="true">&#8249;</span>
        </button>
        <div className="cid-cast-roll" ref={roll}>
          {cast.map((p, i) => {
            const on = i === at;
            const hasDetail =
              (p.nodes?.length ?? 0) + (p.partners?.length ?? 0) + p.specs.length > 0;
            return (
              /* THE HIT BUTTON LIES OVER THE ART, NOT AROUND IT. The frame
                 used to be the button, wrapping everything, and then the shot
                 was. Both broke in the same way: a button carrying aria-label
                 hides its own children from assistive tech, and interactive
                 content cannot nest inside a button, which ruled out native
                 video controls and any pressable tag. So the media is a
                 sibling of a transparent button that covers it. The art is
                 still what you press, which is what Greg asked for, the
                 button is still the keyboard and screen-reader path, and the
                 plate, the detail and the full-screen control all sit beside
                 it rather than inside it. The frame keeps a click handler as
                 a mouse convenience, so pressing the nameplate spotlights. */
              <div
                key={p.key}
                className={`cid-cast-frame ${on ? "is-on" : ""}`}
                style={{ "--ratio": String(p.ratio) } as CSSProperties}
                onClick={() => setAt(i)}
              >
                <div className="cid-cast-shot">
                  {on && p.media.kind === "video" ? (
                    <video
                      key={p.media.src}
                      ref={lit}
                      className="cid-cast-media"
                      src={p.media.src}
                      poster={p.media.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="cid-cast-media"
                      src={on && p.media.kind === "image" ? p.media.src : p.thumb}
                      alt=""
                      /* Eager only for the frame that opens lit, which is no
                         longer the first one now that the General sits in the
                         middle. Everything else waits until the band is near. */
                      loading={i === opensAt ? undefined : "lazy"}
                      decoding="async"
                    />
                  )}
                  <button
                    type="button"
                    ref={(el) => { frames.current[i] = el; }}
                    className="cid-cast-hit"
                    aria-pressed={on}
                    aria-label={on ? p.plain : `Spotlight ${p.plain}`}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1, true); }
                      if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1, true); }
                      if (e.key === "Home") { e.preventDefault(); go(0, true); }
                      if (e.key === "End") { e.preventDefault(); go(cast.length - 1, true); }
                    }}
                  />
                  {on && p.media.kind === "video" && (
                    <button
                      type="button"
                      className="cid-cast-full"
                      aria-label={`Play ${p.plain} full screen`}
                      onClick={(e) => { e.stopPropagation(); fullScreen(); }}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                        <path d="M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="cid-cast-plate">
                  <span className="cid-cast-name">{p.name}</span>
                  {on && p.role && <span className="cid-cast-role">{p.role}</span>}
                </div>
                {on && hasDetail && (
                  <div className="cid-cast-detail">
                    {p.nodes && p.nodes.length > 0 && (
                      <div className="cid-cast-group">
                        <p className="cid-cast-group-h">Sector Nodes</p>
                        <ul className="cid-cast-pills">
                          {p.nodes.map((n) => (
                            <li className="cid-cast-pill" key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {p.partners && p.partners.length > 0 && (
                      /* Same group idiom as the sector nodes: a rule, then
                         the heading, then the keys. */
                      <div className="cid-cast-group cid-cast-group--keys">
                        {p.partnersHeading && <p className="cid-cast-group-h">{p.partnersHeading}</p>}
                        <ul className="cid-cast-keys">
                          {p.partners.map((t) => (
                            <li className="cid-cast-key" key={t.key}>{t.label}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {p.specs.length > 0 && (
                      <dl className="cid-cast-specs">
                        {p.specs.map((s) => (
                          <div className="cid-cast-spec" key={s.label}>
                            <dt className="cid-cast-spec-k">{s.label}</dt>
                            <dd className="cid-cast-spec-v">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="cid-cast-arrow cid-cast-arrow--next"
          aria-label="Spotlight the next character"
          onClick={() => go(at + 1, false)}
        >
          <span aria-hidden="true">&#8250;</span>
        </button>
      </div>
    </div>
  );
}

/** The Vivarium team: the research facility's glass case (a background, not
 *  a picture, so browsers offer no image zoom, visual search or save
 *  affordance to get stuck in) and the three researchers' nametags, which
 *  stand apart from it as their own cards rather than overlaid on the art. */
type CaseBay = { key: string; cls: string; role: ReactNode; name: ReactNode; sub?: string; orb?: string; title?: string };

// Left to right, matching the case art below: Ethel, Greg in the middle,
// Icarus. Stacked on narrow screens Greg comes first again, via CSS order.
const CASE_BAYS: CaseBay[] = [
  { key: "ethel", cls: "cid-tag--ethel", role: <>Ethical<br />Analyst</>, name: "Ethel" },
  { key: "greg", cls: "cid-tag--greg", role: <>Principal<br />Investigator</>, orb: "PI", title: "CID Director", name: <>Greg<br />Long</> },
  { key: "icarus", cls: "cid-tag--icarus", role: <>Executive<br />Trader</>, name: <IcarusName /> },
];

function TeamCase({ base }: { base: string }) {
  const img = (w: number) => `${base}assets/images/cid-team-case-${w}.webp`;
  return (
    <div className="cid-case-wrap">
      <div
        className="cid-case"
        role="img"
        aria-label="The CID Vivarium: a dark glass research facility holding Ethel the Ethical Analyst on the left, Greg Long the Principal Investigator in the centre, and Icarus the Third, Executive Trader, on the right"
        style={{
          backgroundImage: `image-set(url("${img(2560)}") 1x, url("${img(3840)}") 2x)`,
        }}
      />
    </div>
  );
}

function TeamTags() {
  return (
    <div className="cid-viv-tags">
      {CASE_BAYS.map((b) => (
        <div className={`cid-tag ${b.cls}`} key={b.key}>
          <span className="cid-tag-rail" aria-hidden="true" />
          {/* Two columns of roughly equal visual weight: the name reads
              large in heading case on the left, the job title small and
              capitalised over two lines on the right. */}
          <span className="cid-tag-body">
            <span className="cid-tag-id">
              {b.orb && <span className="cid-tag-orb" aria-hidden="true">{b.orb}</span>}
              <span className="cid-tag-name">{b.name}</span>
            </span>
            <span className="cid-tag-meta">
              <span className="cid-tag-role">{b.role}</span>
              {b.title && <span className="cid-tag-title">{b.title}</span>}
              {b.sub && <span className="cid-tag-sub">{b.sub}</span>}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* The two abbreviated products carry their expansion behind the pill rather
   than as standing lines under the row: hovering or tabbing to a pill previews
   its definition, clicking pins it open (click again to close). One reserved
   slot under the row holds whichever is active, so revealing a definition
   never shifts the pills or the copy below them. "Experimental Research
   Design" needs no expansion, so it stays a plain pill and is not focusable. */
const PRODUCT_DEFS: [string, string][] = [
  ["AI4XD", "Artificial Intelligence for Experience Design"],
  ["Data Viz", "Immersive Data Visualizations"],
];

function DigitalProducts() {
  // Pinned survives the pointer leaving; peeked is the transient hover/focus.
  // Peek wins while it lasts so the pill under the cursor is always the one
  // being described.
  // AI4XD opens by default: the slot under the row is reserved either way, so
  // leaving it blank reads as a formatting gap rather than a held space. A
  // definition already printed also shows what the dotted rule under the other
  // pill does, which a dotted rule alone does not.
  const [pinned, setPinned] = useState<string | null>("AI4XD");
  const [peeked, setPeeked] = useState<string | null>(null);
  const active = peeked ?? pinned;
  const def = PRODUCT_DEFS.find(([term]) => term === active);
  return (
    <div className="cid-viv-offer-row">
      <p className="cid-viv-offer-label">Digital Products</p>
      <div className="cid-viv-offer-pills">
        <span className="cid-viv-pill">Experimental Research Design</span>
        {PRODUCT_DEFS.map(([term]) => (
          <button
            key={term}
            type="button"
            className={`cid-viv-pill cid-viv-pill--def${active === term ? " is-open" : ""}`}
            aria-expanded={active === term}
            aria-controls="cid-viv-product-def"
            onClick={() => setPinned((p) => (p === term ? null : term))}
            onPointerEnter={() => setPeeked(term)}
            onPointerLeave={() => setPeeked(null)}
            onFocus={() => setPeeked(term)}
            onBlur={() => setPeeked(null)}
          >
            {term}
          </button>
        ))}
      </div>
      <p className="cid-viv-offer-note cid-viv-offer-def" id="cid-viv-product-def">
        {def ? `${def[0]}: ${def[1]}` : "\u00a0"}
      </p>
    </div>
  );
}

export function CID({ onSupport }: { onSupport: () => void }) {
  // The flag embed runs the portal: a click anywhere on the promo wakes its
  // middle panel, a second click on that window plays the opening and then
  // asks us to travel. Same-origin, and we check the origin before moving.
  const navigate = useNavigate();
  useEffect(() => {
    function onPortal(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if ((e.data as { type?: string })?.type !== "ooos:watchlist-portal") return;
      navigate("/cid/iwatchlist");
    }
    window.addEventListener("message", onPortal);
    return () => window.removeEventListener("message", onPortal);
  }, [navigate]);

  const base = import.meta.env.BASE_URL;
  // The population model, the living-wall slide index and the watchlist embed's
  // height listener all moved to IWatchlist with the sections that used them.
  // The Viv display room runs a continuous WebGL render loop once loaded, on
  // or off screen, which competes with the page's own scroll repaints and
  // reads as lag/ghosting while scrolling past it. Tell the room to pause
  // that loop whenever its iframe scrolls out of view, and resume it when it
  // scrolls back in.
  const roomRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const el = roomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.contentWindow?.postMessage({ type: "room-visible", visible: entry.isIntersecting }, window.location.origin),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The welcome line plays its entrance once, when it first scrolls into view,
  // rather than on mount: it sits below the page hero, so on mount it is
  // usually still off screen and the whole entrance would be missed.
  const welcomeRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = welcomeRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cid-scope">
      <section className="case-hero">
        <div className="container cid-hero-container">
          <Link to="/" className="back">← All projects</Link>
          <div className="cid-hero-title-row">
            <h1>Canadian Innovation Dimension</h1>
            <div className="case-meta cid-hero-chips">
              <span className="chip">Research dimension</span>
              <span className="chip">MNPI excluded</span>
            </div>
          </div>
        </div>
      </section>

      {/* CID Vivarium — intro copy, then the "Radical Strategic Intelligence"
          rail paired with the display room, the team case, the storage-scale
          comparison, and the two illustrated principle cards. Single-column
          stack: nothing here needs to be a tall sidebar, so nothing needs to
          be sticky either. The disclaimer from the old intro is retained
          verbatim at the foot. */}
      <section className="cid-viv" aria-label="CID Vivarium">
        <div className="container cid-hero-container cid-viv-stack">

          {/* CID intro sits directly under the page title, so it carries no
              heading of its own. Then the Vivarium. The three researchers'
              nametags used to sit overlaid on the case art below; moved up
              beside the intro instead, which both gets them off the image
              (they were fighting the art, not reading as labels on it) and
              fills the empty column this text used to leave beside it. */}
          <div className="cid-viv-intro-row">
            <div className="cid-viv-intro-col">
              <p className="cid-viv-intro">
                The <strong>Canadian Innovation Dimension (CID)</strong> is an experimental research environment operated by artificial intelligence (AI) agents inside an always-on AI mini-PC.
              </p>
              <div className="cid-viv-lede">
                {/* Welcome line, set as live text with the 2 ball standing in
                    for the word "to". "Welcome" is already on the title line
                    holding its space; the ball rolls in from the left; "the
                    Vivarium" rains down a letter at a time. Letters are split
                    into spans so each can carry its own delay, and the whole
                    phrase keeps one accessible name, so the ball reads as the
                    word it replaces rather than as an image. */}
                <p className="cid-viv-welcome" ref={welcomeRef} aria-label="Welcome to the Vivarium">
                  <span className="cid-viv-welcome-hold" aria-hidden="true">Welcome</span>
                  <img
                    className="cid-viv-welcome-ball"
                    src={`${base}assets/images/viv-2ball.webp`}
                    alt=""
                    aria-hidden="true"
                    width={256}
                    height={257}
                    decoding="async"
                  />
                  <span className="cid-viv-welcome-rain" aria-hidden="true">
                    {Array.from("the Vivarium", (ch, i) => (
                      <span key={i} style={{ "--i": i } as CSSProperties}>
                        {ch === " " ? " " : ch}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="cid-viv-lead">The Vivarium makes global research collaboration into a gamified information ecosystem. Our 24/7 team is designed to facilitate group creativity and knowledge exchange within synthetic research environments built to protect people while nurturing artificial intelligences evolving within them.</p>
              </div>

              {/* Leadership: who runs the Vivarium, and the division's mandate. */}
              <div className="cid-viv-leadership">
                <h3 className="cid-viv-ecosystem-h">Leadership</h3>
                <p className="cid-viv-lead">The CID Director serves as Principal Investigator and Systems Architect, directing all research operations and guiding engagement activities in our purpose-built habitat.</p>
                <p className="cid-viv-lead">As a division of <span className="cid-ooo">Ooo!</span> Digital Media Studio, CID is designed to:</p>
                <ul className="cid-viv-lead-list">
                  <li>Expand public access to collective intelligence</li>
                  <li>Pursue research imperatives set by <span className="cid-ooo">Ooo!</span> Digital Media Studio</li>
                </ul>

                <h3 className="cid-viv-ecosystem-h">Research Reimagined</h3>

                {/* Digital products and studio services offered by CID. */}
                <div className="cid-viv-offer">
                  <DigitalProducts />
                  <div className="cid-viv-offer-row">
                    <p className="cid-viv-offer-label">Studio Services</p>
                    <div className="cid-viv-offer-pills">
                      <span className="cid-viv-pill">Market Research</span>
                      <span className="cid-viv-pill">Sector Support</span>
                      <span className="cid-viv-pill">Internationalization</span>
                    </div>
                  </div>
                </div>

                {/* Strategic priorities: fills the band under the offer rows,
                    opposite the reference card, so the intro column runs to
                    roughly the same depth as the side panel instead of leaving
                    a hole above the Strategies band and the display case.
                    Greg's supplied copy, set verbatim. Term and description as
                    a definition list, per the house rule that no acronym
                    appears without its meaning beside it. */}
                <div className="cid-viv-priorities">
                  <h3 className="cid-viv-ecosystem-h">Strategic Priorities</h3>
                  <dl className="cid-viv-priority-list">
                    <div className="cid-viv-priority">
                      <dt>Merit and Research Integrity</dt>
                      <dd>Verify credentials and evaluate evidence. Machine-learning detection and automated controls help identify and exclude Material Non-Public Information (MNPI) from AI agent and trading workflows.</dd>
                    </div>
                    <div className="cid-viv-priority">
                      <dt>Trust and Transparency</dt>
                      <dd>Protect privacy and confidentiality while documenting sources, responsibilities, and decisions. Consistent human oversight ensures CID authorizes all automated processes, approves methods, and monitors interactions with tools.</dd>
                    </div>
                    {/* Five priorities in a three-up row: two on the first line
                        beside the reference card, three on the second where the
                        panel above has ended and the full width is free. */}
                    <div className="cid-viv-priority">
                      <dt>Interoperability</dt>
                      <dd>Connect Canadian content, services and materials with audiences across platforms and markets.</dd>
                    </div>
                  </dl>
                  {/* Methods, not priorities. The three above are commitments,
                      what CID holds itself to; these two are how the work is
                      actually carried out, which is why they arrived as bullets
                      where the others arrived as prose. Splitting them under
                      their own heading stops the reader taking a method for a
                      principle.

                      Not "Tactics": that word is already spoken for as the
                      Reclaiming Agency division's card heading, where CID's is
                      Strategies (WORKING-GUIDE.md, divisions table). Borrowing
                      it here would blur the division taxonomy.

                      Kept as lists rather than flattened into sentences: each
                      is two separate commitments, and running them together
                      would read as one hedged claim. */}
                  <h3 className="cid-viv-ecosystem-h cid-viv-methods-h">Methods</h3>
                  <dl className="cid-viv-priority-list">
                    <div className="cid-viv-priority">
                      <dt>Inclusive Innovation</dt>
                      <dd>
                        <ul className="cid-viv-priority-points">
                          <li>Create opportunities for diverse people to engage in global citizen science projects.</li>
                          <li>Publish aggregated findings with no personally identifiable information (PII)</li>
                        </ul>
                      </dd>
                    </div>
                    <div className="cid-viv-priority">
                      <dt>Collective Problem Solving</dt>
                      <dd>
                        <ul className="cid-viv-priority-points">
                          <li>Synthesize evidence to track systemic issues and report emerging national trends.</li>
                          <li>Connect potential allies through cross-sector cooperation in the circular economy.</li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* The Strategies band, closing the body column in the space the
                  lexicon vacated when it moved into the side panel. It sat as
                  a direct child of .cid-viv-stack while that space was taken,
                  running the full container width under the side panel; back
                  in the column it takes the column's own measure and stops
                  where the priorities above it stop. The cost is the bullets:
                  at ~260px a key cannot hold "Integrate verified data
                  sources." on one line, so they wrap to two (see the keys
                  rule in cid-vivarium.css). */}
              <section className="cid-strategy" aria-labelledby="cid-strategy-title">
                {/* The opening A is a real Latin A set in the display serif, not a Greek
                    alpha lookalike: the letterform carries the flourish while "Agile"
                    stays a word that screen readers speak and search engines index. */}
                <h3 id="cid-strategy-title" className="cid-strategy-h">
                  <span className="cid-strategy-a">A</span>gile Micro-Studio. Massive Creative Capacity.
                </h3>
                <StrategyKeys />
              </section>

              {/* The cast, directly under the keys. Page-width from inside a
                  narrow column, which is what --viv-gutter is for: see the
                  break-out note in cid-vivarium.css. It sat outside the
                  container for one commit to get that width the easy way, but
                  the section runs on for hundreds of lines past the stack, so
                  it landed far below the keys instead of under them. Position
                  is the requirement; the break-out is the cost of meeting it. */}
              <CharacterRoll base={base} />

            </div>
            {/* Right column, one panel: the Radical Strategic Intelligence
                rail, the etymology card beneath it, then the Greek lexicon,
                then the biomimicry quote closing the column. The lexicon sits
                between the two white cards rather than under them, so the dark
                panel separates the two blocks of type. The Reference card that
                used to close this column now sits beside the waiver at the
                foot of the section. */}
            <div className="cid-viv-side">
              <aside className="cid-viv-rail" aria-label="Radical Strategic Intelligence">
                <div className="cid-viv-brand">
                  <h2 className="cid-viv-title">
                    <span>Radical</span><span>Strategic</span><span className="grad">Intelligence</span>
                  </h2>
                  <div className="cid-viv-bar" aria-hidden="true" />
                </div>
                <div className="cid-viv-pillar">
                  <span className="n">1</span>
                  <div><p className="verb">Observe</p><p className="desc">Market dynamics</p></div>
                </div>
                <div className="cid-viv-pillar">
                  <span className="n">2</span>
                  <div><p className="verb">Compare</p><p className="desc">Information from public sources</p></div>
                </div>
                <div className="cid-viv-pillar">
                  <span className="n">3</span>
                  <div><p className="verb">Navigate</p><p className="desc">Risks and rewards</p></div>
                </div>
              </aside>

              <aside className="cid-etym" aria-label="Etymology of vivarium">
                <p className="cid-etym-label">Etymology</p>
                <p className="cid-etym-sub">History of the living word</p>
                <p className="cid-etym-word">vi·var·i·um</p>
                <p className="cid-etym-ipa">/vaɪˈvɛəriəm/</p>
                <p className="cid-etym-def">A place for living things.</p>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">Language</p>
                  <p className="cid-etym-val">English · Français</p>
                </div>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">Latin word family</p>
                  <p className="cid-etym-val">
                    <em>vivus</em>, “alive”<br />
                    <em>vivere</em>, “to live”
                  </p>
                </div>
              </aside>

              {/* The Greek lexicon: the designed panel that replaced the
                  word-pair rows on the quote card, sitting directly above it.
                  It is the one dark object in a column of white cards, so it
                  goes between them rather than at the foot: the column reads
                  light, dark, light, and the panel's picture breaks up the two
                  runs of type instead of trailing off under them. The bundle
                  renders a fixed 1920x1080 stage whose right side is empty
                  ground, so the frame is set wider than its box and the
                  overflow clipped: what shows is the type and the ribbon, not
                  the dead black beside them. */}
              <figure className="cid-viv-lex">
                <iframe
                  className="cid-viv-lex-frame"
                  src={`${base}Greek%20Lexicon.dc.html?v=6`}
                  title="Greek lexicon. Life, from the Greek bios. Imitation, from the Greek mimesis. Ancient Greek."
                  loading="lazy"
                />
              </figure>

              {/* The word-pair rows moved into the Greek Lexicon panel above;
                  this card carries only the quotation now. Quoted material,
                  marked up as a quotation rather than styled to look like one;
                  the Chicago note at the foot covers both the quote (page 7)
                  and the lexicon gloss (page 3). */}
              <aside className="cid-etym cid-viv-gloss" aria-label="Why practice biomimicry">
                <figure className="cid-viv-gloss-quote">
                  <p className="cid-viv-gloss-q-lead">Why practice biomimicry?</p>
                  <blockquote>
                    Organisms and ecosystems face the same challenges that we humans do,
                    but, they meet those challenges sustainably.
                  </blockquote>
                </figure>
                <p className="cid-viv-gloss-src">
                  Learn Biomimicry, <cite>A Field Guide to Biomimicry: A Brief Overview
                  of the Core Elements and Practice of Biomimicry</cite>, version 01
                  (Learn Biomimicry, 2021), 3, 7,{" "}
                  <a href="https://www.learnbiomimicry.com" target="_blank" rel="noreferrer noopener">learnbiomimicry.com</a>.
                </p>
              </aside>

            </div>
          </div>

          {/* Two lab shots paired as one figure row above the strategy band.
              Real <img> here rather than a background: unlike the case art
              above, nothing in these two is a person, so there is no one to be
              trapped inside the picture. */}
          <figure className="cid-viv-lab">
            <div className="cid-viv-lab-row cid-viv-lab-row--single">
              {/* Mirrored. The source has the bench on the right of the glass
                  and the planting on the left, which puts the stations the
                  wrong way round for the story: Ethel sits on the right and
                  Icarus III on the left. Flipped in CSS rather than re-exported,
                  so the asset stays the one Greg supplied and the change is one
                  line to undo. Nothing in the frame is lettered, so there is no
                  reversed text to give the mirror away.

                  The card is a caption, not decoration, so it is a real
                  <figcaption> on its own <figure> rather than text floated over
                  a div. Written in sentence case and set to uppercase in CSS:
                  it renders exactly as Greg typed it, while screen readers get
                  a word instead of six letters spelled out. */}
              <figure className="cid-viv-lab-shot">
                {/* preload="metadata" is the whole reason this can sit in the
                    body of the page: it fetches a few KB of header, not the
                    8MB file, so a reader who never presses play never pays
                    for it. The poster carries the visual weight until then. */}
                <video
                  className="cid-viv-lab-video"
                  src={`${base}assets/video/vivarium-floor-tour.mp4`}
                  poster={`${base}assets/images/vivarium-floor-tour-poster.webp`}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  aria-label="A walking tour of one floor of the Vivarium: Ethel's planted shelves, the shared lab, Icarus III's bust and apiary foundry, and Ethel's tank."
                />
                <figcaption className="cid-viv-lab-cap cid-viv-lab-cap--below">
                  Cooperation Stations: Icarus III and Ethel
                </figcaption>
              </figure>
            </div>
          </figure>

          {/* Architectural Design and Beneficial Biomimicry, each illustrated
              with its own photo: the Ooo meeting room for Architectural
              Design, the distillation chamber for Beneficial Biomimicry. */}
          <div className="cid-viv-principles">
            <figure className="cid-viv-pcard">
              <div
                className="cid-viv-pcard-photo"
                role="img"
                aria-label="The Ooo meeting room: a glowing Ooo! orb on a lit pedestal, framed by lantern-lit garden walls and a waterfall view"
                style={{ backgroundImage: `url("${base}assets/images/cid-arch-meeting-room.webp")` }}
              />
              <figcaption className="cid-viv-pcard-body">
                <h3>Architectural Design</h3>
                <ul>
                  <li>Distinct environments for observation, collaboration, experimentation</li>
                  <li>Agents use external tools while remaining securely enclosed in the vivarium</li>
                  <li>Interfaces bind actions with fixed rules, restrictions, and limitations</li>
                </ul>
              </figcaption>
            </figure>

            <figure className="cid-viv-pcard">
              <div
                className="cid-viv-pcard-photo"
                role="img"
                aria-label="The distillation chamber: a copper apparatus beside a crystal-lined river cave"
                style={{ backgroundImage: `url("${base}assets/images/cid-biomimicry-distillation.webp")` }}
              />
              <figcaption className="cid-viv-pcard-body">
                <h3>Beneficial Biomimicry</h3>
                <ul>
                  <li>Information flows through environments inspired by the functional principles and geometries found in nature.</li>
                  <li>The information ecosystem evolves through applied research on sustainable design for human-AI interactions.</li>
                </ul>
              </figcaption>
            </figure>
          </div>

          {/* The creature the facility exists around, given its own panel
              rather than folded into the floor tour. The tour is teal and
              violet throughout; this is cold grey Arctic. Cutting it into
              that sequence made the reveal look dull and the tour look
              inconsistent, so it stands alone where its own palette reads.

              Kept at its native 4:3 and deliberately not cropped to the
              tour's 16:9: the wide profile is the whole point, and trimming
              it to match a shape it was never framed for is exactly the
              compromise that flattened it. */}
          {/* Two columns, because the lead lines are short and left a wide
              gutter beside them. The safeguards used to sit under the whole
              row; they read better here, opposite the claims they qualify. */}
          <div className="cid-viv-reveal-lede">
            <div className="cid-viv-reveal-lede-col">
              <p>Investing in your future is complex and continuously changing.</p>
              <p>Markets demand new digital diversification strategies.</p>
              <p>Rules are evolving. Allies are forming. Our governance remains sovereign.</p>
            </div>
            <ul className="cid-viv-reveal-notes">
              <li>Automating Safety First: Hard-coded Conflict Checks and MNPI Exclusions filter and destroy risky or compromised data before human or AI agent review.</li>
              <li>Optimizing Agent Solutions: High-performance teams leverage programmatic auditing to detect and pluck personally identifiable information and protect data silos.</li>
            </ul>
          </div>

          {/* The chart and the key that defines it, in one block under one
              title. They were split across the page, chart down here and key up
              in the side column, which left a grid of twenty-eight loose letters
              several screens from the thing that explains them. */}
          <section className="cid-raci-panel" aria-labelledby="cid-raci-title">
            {/* One heading line across the whole panel. The claim sits over the
                chart and the matrix name sits over the key column, so the bar
                labels both halves of what is under it rather than leaving its
                right end empty. */}
            <div
              className="cid-raci-panel-head"
              style={{ background: KEY_GRAD("rgb(174,153,201)", "rgb(70,46,134)", "rgb(24,16,46)") }}
            >
              <h3 id="cid-raci-title" className="cid-raci-panel-title">
                Accountable Leadership. Advanced AI. High-Performance Team.
              </h3>
              <p className="cid-raci-panel-kicker">CID RACI Matrix</p>
            </div>
          <div className="cid-viv-reveal">

            {/* A real table, not a grid of divs: this is tabular data with two
                axes, and a screen reader needs the row and column headers to
                announce "Evidence verification, Ethel, Responsible" rather
                than reading twenty-eight loose letters. */}
            <div className="cid-viv-raci">
              {/* Safeguards as a checked list, not two loose sentences: these are
                  controls that either hold or do not, and a tick says that faster
                  than a full stop does. Marks are aria-hidden - the list already
                  reads as a list, and "check" spoken four times adds nothing. */}
              <ul className="cid-raci-safe">
                <li>
                  <svg className="cid-raci-check" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="M4 10.6 8.2 14.8 16 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Automated Safeguards (Conflict Checks, MNPI Exclusions).
                </li>
                <li>
                  <svg className="cid-raci-check" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="M4 10.6 8.2 14.8 16 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Proactive Risk Management. Predictive Analytics.
                </li>
              </ul>

              <table className="cid-viv-raci-table">
                <caption className="cid-viv-raci-cap">
                  Who is accountable, responsible, consulted and informed for each research operation
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Research operation</th>
                    <th scope="col">Greg Long <span>Principal Investigator</span></th>
                    <th scope="col">Ethel <span>Ethical Analyst</span></th>
                    <th scope="col">Icarus III <span>Executive Trader</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Raw-data interpretation", "A", "R", "I"],
                    ["Evidence verification", "A", "R", "I"],
                    ["Privacy and research integrity", "A", "R", "I"],
                    ["Strategy synthesis", "A", "R", "C"],
                    ["Risk review and scenario modelling", "A", "C", "R"],
                    ["Bounded trading execution", "A", "I", "R"],
                    ["Execution records", "A", "I", "R"],
                  ].map(([op, g, e, i]) => (
                    <tr key={op}>
                      <th scope="row">{op}</th>
                      {[g, e, i].map((v, n) => (
                        <td key={n} data-w={v === "A" || v === "R" ? "1" : "0"}>
                          <abbr title={{ A: "Accountable", R: "Responsible", C: "Consulted", I: "Informed" }[v]}>{v}</abbr>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
            {/* Read down, the tiles spell RACI, which is why the order here is
                R A C I and not the A R C I the table itself uses. Tiles take the
                carved-slab treatment from the twelve-signs board. */}
            <dl className="cid-viv-raci-key">
              <div><dt><span className="cid-raci-tile" aria-hidden="true">R</span>Responsible</dt>
                <dd>Completes the assigned task or deliverable.</dd></div>
              <div><dt><span className="cid-raci-tile" aria-hidden="true">A</span>Accountable</dt>
                <dd>Final ownership and decision authority. Held exclusively by the Principal Investigator.</dd></div>
              <div><dt><span className="cid-raci-tile" aria-hidden="true">C</span>Consulted</dt>
                <dd>Contributes before the work proceeds.</dd></div>
              <div><dt><span className="cid-raci-tile" aria-hidden="true">I</span>Informed</dt>
                <dd>Role-separated architecture gives agents access to information needed for designated roles.</dd></div>
            </dl>
          </div>
          </section>


          {/* Sealed case. The room and the claim it evidences are one
              enclosure rather than two blocks sitting loose on the page:
              vanta-black steel shell, mitred titanium corner blocks, and a
              single mullion between the two compartments. */}
          <div className="cid-vault">
            <span className="cid-vault-corner cid-vault-corner--tl" aria-hidden="true" />
            <span className="cid-vault-corner cid-vault-corner--tr" aria-hidden="true" />
            <span className="cid-vault-corner cid-vault-corner--bl" aria-hidden="true" />
            <span className="cid-vault-corner cid-vault-corner--br" aria-hidden="true" />

            {/* The Viv itself: the always-on AI mini-PC that houses the
                facility, on show in its own display room. Self-contained
                WebGL scene, so it rides in an iframe like the other embeds. */}
            <div className="cid-vivroom">
              <iframe
                ref={roomRef}
                className="cid-vivroom-frame"
                src={`${base}DISPLAY_ROOM_BLUE_checker_cm.html?v=5`}
                title="The Viv display room: the always-on AI mini-PC that houses the CID Vivarium"
                loading="lazy"
              />
            </div>

            <div className="cid-vault-mullion" aria-hidden="true" />

            {/* "1976 vs 2026" storage comparison: makes the case for why a
                device this small earns a display room. Sealed into the same
                case as the room, so the claim and the object it is about are
                read as one piece. */}
            <div className="cid-viv-era">
              <div className="cid-viv-era-row cid-viv-era-then">
                <div className="cid-viv-era-headline">
                  <p className="cid-viv-era-label"><span className="y">1976</span><span className="tag">50 years ago</span></p>
                  <p className="cid-viv-era-stat">~3,150 DISKS</p>
                </div>
                <p className="cid-viv-era-copy">Storing two terabytes of data required ~3,150 disk drives. That much information technology (IT) could fill a machine-room floor nearly the size of a Canadian football field. <span className="cid-viv-era-aside">*Ours is bigger.</span></p>
              </div>
              <div className="cid-viv-era-row cid-viv-era-now">
                <div className="cid-viv-era-headline">
                  <p className="cid-viv-era-label"><span className="y">2026</span><span className="tag">Today</span></p>
                  <p className="cid-viv-era-stat">&lt; 1KG</p>
                </div>
                {/* Flowing prose, not three forced lines. The hard breaks put a
                    line end after "kilogram," which is mid-sentence, so the
                    block read as a list of fragments and its spacing came from
                    where the <br /> happened to fall rather than from the
                    column. Same two sentences, wrapping to the measure like the
                    1976 copy beside it. */}
                <p className="cid-viv-era-copy">Now you can palm it. Weighing less than one kilogram, CID contains a cutting-edge research facility.</p>
              </div>
            </div>
          </div>

          {/* The three researchers side by side under the copy, in the
              same order as the case art below: Ethel, Greg in the middle,
              Icarus. */}
          <TeamTags />

          {/* Vivarium team display case: the three researchers set in one
              glass case, the human principal investigator centred between
              the two AI agents. */}
          <TeamCase base={base} />


          {/* Information Ecosystem + the Flicker card sit in the left
              column beneath the team case, filling the space beside the
              taller reference card in the right column. */}
          <div className="cid-viv-ecosystem">
            <h3 className="cid-viv-ecosystem-h">Information Ecosystem</h3>
            <p className="cid-viv-ecosystem-copy">Miniaturized local AI infrastructure systematically integrates, aggregates, synthesizes, and stores all proprietary CID data. Our models, prototypes, workflows, and reusable skills are secured on-premises.</p>

            {/* The Flicker card and the inputs/tags glossary sit side by
                side, filling the band beside the reference card. The Flicker
                image drops into cid-viv-flicker-img; its copy stays to the
                label plus the one-line function, no physical description. */}
            <div className="cid-viv-eco-row">
              <figure className="cid-viv-flicker">
                <div className="cid-viv-flicker-img" role="img" aria-label="The Flicker" />
                <figcaption className="cid-viv-flicker-cap">
                  <p className="cid-viv-flicker-name">CID Flicker</p>
                  <p className="cid-viv-flicker-desc">Controls access to the Vivarium. Our sole proprietor possesses CID Flicker at all times.</p>
                </figcaption>
              </figure>

              <aside className="cid-etym cid-viv-glossary" aria-label="Vivarium inputs and tags">
                <div className="cid-etym-row">
                  <p className="cid-etym-key">User inputs</p>
                  <ul className="cid-etym-list">
                    <li><span className="cid-etym-abbr">UC</span> · User Contribution recorded by a CID community member. Includes personal observations. Therefore, the individual experiences are generally unverifiable.</li>
                    <li><span className="cid-etym-abbr">PCD</span> · Proof Confirmed Digitally (substantial &amp; convincing proof)</li>
                    <li><span className="cid-etym-abbr">TS</span> · Trading Strategy proposed for analysis, risk review, or scenario modelling.</li>
                  </ul>
                </div>
                <div className="cid-etym-row">
                  <p className="cid-etym-key">System tags</p>
                  <ul className="cid-etym-list">
                    <li><span className="cid-etym-abbr">RWS</span> · Real-World Signals</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>

          {/* Access tiers: how the Vivarium opens to the public and partners,
              from open access down to the restricted Floor 0 lairs. */}
          <div className="cid-viv-access">
            <h3 className="cid-viv-access-h">Research Access</h3>
            <div className="cid-viv-access-grid">
              {/* The Vivarium's own teal, --vault-teal 14,110,115. The card carried
                  a lighter #17A398 that measured 3.12:1 on white, under the 4.5 the
                  label needs; the signature colour clears it at 6.01:1. */}
              <div className="cid-viv-tier" style={{ "--tier": "#0E6E73" } as CSSProperties}>
                <p className="cid-viv-tier-label">Public</p>
                <p className="cid-viv-tier-name">Open Access</p>
                <p className="cid-viv-tier-desc">Open source development and data analytics tools.<br />Free resources for innovators and entrepreneurs</p>
              </div>
              {/* Gold for caution. Deep gold rather than the page's bright #F0C040:
                  gold is a light hue, so on a white card the bright value reads at
                  1.7:1 and even the old #B67A00 only reached 3.64:1. #9A6600 is the
                  same amber family at 4.91:1. Bright gold is available on the dark
                  cards, which is why Restricted can carry it. */}
              <div className="cid-viv-tier" style={{ "--tier": "#9A6600" } as CSSProperties}>
                <p className="cid-viv-tier-label">Gated</p>
                <p className="cid-viv-tier-name">Community Information</p>
                <p className="cid-viv-tier-desc">Protected spaces for creative partners and approved participants. Access controls support consent, age verification and privacy requirements.</p>
              </div>
              <div className="cid-viv-tier cid-viv-tier--cauldron" style={{ "--tier": "#6C01F4" } as CSSProperties}>
                <p className="cid-viv-tier-label">Collaborative</p>
                <p className="cid-viv-tier-name">CAULDRONS</p>
                <p className="cid-viv-tier-desc">Shared spaces where authorized participants exchange perspectives, experiment and build knowledge together.</p>
              </div>
            </div>

            {/* The two restricted tiers set apart from the three open/friendly
                ones above: a divider and a darker tier idiom, so "authorized
                access only" reads as a distinct tier of the page, not just
                another card in the row. */}
            <div className="cid-viv-access-restricted">
              {/* Gold, not the burnt sienna this carried before: against this card's
                  #150A2E the old #822F00 measured 2.11:1, well under the 4.5 the
                  label needs. #F0C040 is the page's existing gold and clears it at
                  11.05:1. On the dark variant --tier reaches the label only, since
                  .cid-viv-tier--dark overrides border-color for both restricted
                  cards, so this changes the word and nothing else. */}
              <div className="cid-viv-tier cid-viv-tier--dark" style={{ "--tier": "#F0C040" } as CSSProperties}>
                <p className="cid-viv-tier-label">Restricted</p>
                <p className="cid-viv-tier-name">LAIRS</p>
                <p className="cid-viv-tier-desc">Private Floor 0 environments for authorized researchers and funding partners. Access reflects research purpose, qualifications, experience and authorization.</p>
              </div>
              <div className="cid-viv-tier cid-viv-tier--dark" style={{ "--tier": "#B98CFF" } as CSSProperties}>
                <p className="cid-viv-tier-label">Portal 60</p>
                <p className="cid-viv-tier-name">DARK MATTERS</p>
                <p className="cid-viv-tier-desc">Portal 60 opens into Dark Matters, a restricted environment dedicated to dismantling systematic injustice.</p>
              </div>
            </div>

            {/* Research code reference: the input/analysis codes used across the
                Vivarium's environments. */}
            <div className="cid-viv-codes">
              <table className="cid-viv-codes-table">
                <thead>
                  <tr><th>Code</th><th>Meaning</th><th>Role</th></tr>
                </thead>
                <tbody>
                  <tr><td><span className="cid-viv-code">FE</span></td><td>Formal Evidence</td><td>Verified documentary basis</td></tr>
                  <tr><td><span className="cid-viv-code">PHI</span></td><td>Philosophical Inquiry</td><td>Examines ethics, power and meaning</td></tr>
                  <tr><td><span className="cid-viv-code">FO</span></td><td>Field Observation</td><td>Verified firsthand observation</td></tr>
                  <tr><td><span className="cid-viv-code">FUM</span></td><td>Future Uncertainty Matrix</td><td>Maps intersecting issues</td></tr>
                </tbody>
              </table>
            </div>
          </div>


          {/* Two ways of seeing: the same subject (Greg) through each agent's
              lens, one vertical screen with two settings. */}
          <div className="cid-viv-lens-wrap">
            <h3 className="cid-viv-ecosystem-h">Two Ways of Seeing</h3>
            <GregLensSlider base={base} />
          </div>


        </div>

      </section>

      {/* Innovation Watchlist hero — self-contained DC block from
          public/Innovation Watchlist.dc.html (full-bleed, self-sizing iframe). */}
      {/* Portal drum roll: a quiet dark-galaxy band bridging the Vivarium and
          the Innovation Watchlist. A drum roll, not a splash. On this page the
          line and the flag panel below it are the entrance to the prototype,
          so both are links to /cid/iwatchlist. */}
      <section className="cid-portal-band" aria-label="CID prototype announcement">
        <Link to="/cid/iwatchlist" className="cid-portal-line cid-portal-door">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v9" /><path d="M6.4 6.4a8 8 0 1 0 11.2 0" /></svg>
          <span>A PORTAL HAS OPENED: CID releases an electric debut prototype!</span>
        </Link>
      </section>

      <section className="cid-wl-hero" aria-label="Innovation Watchlist">
        <iframe
          className="cid-wl-frame"
          src={`${base}Innovation%20Watchlist.dc.html?v=10&entry=1`}
          title="Innovation Watchlist"
          loading="lazy"
        />
        {/* No click overlay here: it would swallow every click before the
            embed could see it. The flag is still the doorway, but the embed
            runs it now, and the portal line above stays a real link so the
            destination is reachable by keyboard. */}
      </section>

      {/* The waiver closes the invitation rather than opening it, so it sits
          below the flag with the Viv reference card beside it. Same silver as
          the panel above, so the two read as one band handing off to the cave. */}
      <section className="cid-viv-footer" aria-label="Notice and reference">
        <div className="container cid-hero-container">
          <div className="cid-viv-footer-cards">
            <aside className="cid-etym cid-viv-disc-card">
              <p className="cid-viv-disc">
                <strong>Ostara and the experimental Canadian Innovation Dimension (CID) do not provide future predictions or financial advice.</strong>
              </p>
            </aside>
            <aside className="cid-etym" aria-label="Vivarium reference">
              <p className="cid-etym-label">Reference</p>
              <div className="cid-etym-row">
                <p className="cid-etym-key">Field name</p>
                <div className="cid-etym-inline">
                  <p className="cid-etym-val"><code className="cid-etym-code">the_viv</code></p>
                  <p className="cid-etym-note">Database identifier</p>
                </div>
              </div>
              <div className="cid-etym-row">
                <p className="cid-etym-key">Call sign</p>
                <div className="cid-etym-inline">
                  <p className="cid-etym-val">CID Viv</p>
                  <p className="cid-etym-note">Operational name</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* The cave's content is transplanted to /cid/iwatchlist, where the full
          structure is preserved as that page's floor. The section itself stays
          here: with no content it collapses to a slim band of its own padding
          and cave art, which still closes the page and hands off into the
          cid-join gradient below. */}
      <section className="cid-underground" aria-hidden="true" />

      {/* The join copy and its CTA moved off this page. The band itself stays:
          it carries the indigo-to-portal gradient that closes the cave and
          hands off into the footer, so removing it would leave a hard edge. */}
      <section className="cid-join" aria-hidden="true" />

    </div>
  );
}
