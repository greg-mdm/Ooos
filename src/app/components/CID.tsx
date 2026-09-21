import { Link, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useRef, useState, type ReactNode, type CSSProperties, type RefObject } from "react";
import { RedShaderOrb } from "./cid/RedShaderOrb";
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

/* Six keys, a keyboard (Greg, 2026-09-20). Each pair of statements used to
   share one key; now the first sits on a black key and the second on a white
   one below it, so the stack reads black, white, black, white, black, white
   the way an instrument does. The blacks are the keys that were already
   there, unchanged apart from carrying one line instead of two. The whites
   are new: the same radial that lights the blacks, run at the top of its
   range so the key reads as ivory rather than as a hole in the column, and
   each pair a shade cooler than the one above it, which is the same descent
   the blacks make. Ink on the whites is the site's dark indigo, never gold,
   and the marker turns portal purple to stay visible on a light ground.

   The statements are set in capitals and carry no full stop (Greg,
   2026-09-20): they are labels on keys, not sentences. The capitals are done
   with text-transform in the stylesheet rather than typed here, so what a
   screen reader announces and what a search engine indexes is still ordinary
   sentence case, and only the drawing changes. The full stops are gone from
   the strings themselves, since that is the copy and not its styling. */
const STRATEGY_KEYS: { tone: "black" | "white"; bg: string; shadow: string; line: string }[] = [
  {
    tone: "black",
    bg: KEY_GRAD("rgb(174,153,201)", "rgb(70,46,134)", "rgb(24,16,46)"),
    shadow: "0 18px 34px -18px rgba(26,22,70,0.46)",
    line: "Energize economic expansion",
  },
  {
    tone: "white",
    bg: KEY_GRAD("rgb(255,255,255)", "rgb(250,249,253)", "rgb(231,227,241)"),
    shadow: "0 14px 28px -18px rgba(26,22,70,0.30)",
    line: "Empower inclusive growth",
  },
  {
    tone: "black",
    bg: KEY_GRAD("rgb(152,133,179)", "rgb(54,35,104)", "rgb(18,12,35)"),
    shadow: "0 15px 30px -16px rgba(26,22,70,0.40)",
    line: "Gather collective intelligence",
  },
  {
    tone: "white",
    bg: KEY_GRAD("rgb(255,255,255)", "rgb(248,247,252)", "rgb(226,222,238)"),
    shadow: "0 13px 26px -17px rgba(26,22,70,0.28)",
    line: "Integrate verified data sources",
  },
  {
    tone: "black",
    bg: KEY_GRAD("rgb(126,110,151)", "rgb(37,23,74)", "rgb(13,8,25)"),
    shadow: "0 12px 26px -14px rgba(26,22,70,0.34)",
    line: "Boost business confidence",
  },
  {
    tone: "white",
    bg: KEY_GRAD("rgb(255,255,255)", "rgb(246,245,251)", "rgb(221,217,235)"),
    shadow: "0 12px 24px -16px rgba(26,22,70,0.26)",
    line: "Build global partnerships",
  },
];

/* A puck closes each pair of keys but the last: purple after the first, the
   weathered one after the second (Greg, 2026-09-20). They are separators, not
   features. The pair above and below stays tight on its 6px gap, and all the
   air between one pair and the next comes from the puck's own slot, which is
   what keeps the keyboard level with the clips beside it without touching
   them. The art is Greg's, cropped to its ink and carried at twice its drawn
   size for a sharp screen.

   A teal puck stood in the first slot first. It was a different drawing, an
   oblique three quarter view, 1.36 wide to tall against these two at 0.95, so
   at a shared height it ran wider and read as the larger object. The purple
   replaces it because Greg made the weathered one from it with a filter: same
   drawing, same angle, same ratio, one lit and one not, which is the balance
   the pair wanted. Decorative, so they are hidden from the accessibility tree
   and carry an empty alt: they say nothing the keys do not. */
const PUCKS = ["purple", "sunny"];

/** The six pillars as pressable keys, matching the homepage exactly in
 *  behaviour as well as look: each key toggles lit on click and reports its
 *  state with aria-pressed. */
function StrategyKeys({ base }: { base: string }) {
  const [lit, setLit] = useState<Record<number, boolean>>({});
  return (
    <ul className="ood-keys cid-strategy-keys">
      {STRATEGY_KEYS.map((k, i) => {
        const on = !!lit[i];
        // after the second key and the fourth, never after the sixth
        const puck = i % 2 === 1 && i < STRATEGY_KEYS.length - 1 ? PUCKS[(i - 1) / 2] : null;
        return (
          <Fragment key={i}>
          <li className="ood-key-wrap" style={{ filter: `drop-shadow(${k.shadow})` }}>
            <button
              type="button"
              className={`ood-key${on ? " is-on" : ""}${k.tone === "white" ? " cid-key-white" : ""}`}
              aria-pressed={on}
              onClick={() => setLit((s) => ({ ...s, [i]: !s[i] }))}
              style={{ background: k.bg }}
            >
              <span className="ood-label">
                <span className="cid-strategy-bullets">
                  <span className="cid-strategy-bullet">{k.line}</span>
                </span>
              </span>
            </button>
          </li>
          {puck && (
            <li className={`cid-key-puck cid-key-puck--${puck}`} aria-hidden="true">
              <img src={`${base}assets/images/cid-puck-${puck}.webp`} alt="" loading="lazy" decoding="async" />
            </li>
          )}
          </Fragment>
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
/** A value may carry markup, so an acronym can expand on hover. */
type CidSpec = { label: string; value: ReactNode };
type CidCharacter = {
  key: string;
  /** Nameplate label. A node, so Icarus keeps his vector numeral. */
  name: ReactNode;
  /** The same name as plain text, for the button's accessible name. */
  plain: string;
  /** Role line. Verbatim from CASE_BAYS, which is where these are canon.
   *  An empty string renders no line rather than inventing one. */
  role: string;
  /** For a still, src is the WebP every browser can show and avif, when
   *  present, is offered first through <picture>. AVIF is here for the
   *  chroma: lossy WebP is always 4:2:0, which halves colour resolution and
   *  is what faded the gold cracks on Icarus's face. AVIF at 4:4:4 keeps
   *  them. */
  media:
    | { kind: "video"; src: string; poster: string }
    | { kind: "image"; src: string; avif?: string };
  /** Still shown in the roll when this frame is not spotlighted, with the
   *  same optional AVIF beside it. */
  thumb: string;
  /** The still's own width over height, when it differs from the lit
   *  art's. The rail reserves the tile's box from it before the still
   *  loads, so the rail does not shift as thumbnails arrive. */
  thumbRatio?: number;
  thumbAvif?: string;
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
  /** A line under the name and role, e.g. "Information flows through her.",
   *  or several, each on its own line. */
  tagline?: string | string[];
  /** A short profile under the functions: a heading and a paragraph or two,
   *  e.g. how an ability came about. */
  profile?: { heading: string; paras: string[] };
  /** Stats block, per character. Empty until the copy is written; the frame
   *  omits the list entirely, so adding a row here is the only edit needed. */
  specs: CidSpec[];
  /** Further spec rows under their own heading, e.g. an operating protocol. */
  specGroups?: { heading: string; rows: CidSpec[] }[];
  /** A list of labelled one-liners under a heading, e.g. core functions. On a
   *  wide bay it takes the right-hand column beside the spec rows. */
  functions?: { heading: string; items: { label: string; desc: string }[] };
  /** Featured boxes at the foot of the card. One spans the width; two sit
   *  side by side on a wide bay. A box holds a paragraph, spec rows, or both. */
  features?: {
    heading: string;
    /** A label set beside the heading. Its shape says what kind of thing
     *  the character is: a rounded pill for an agent, a square for a
     *  machine-learning tool, whose capabilities are boxed in. */
    tag?: { text: string; shape: "pill" | "square" };
    /** The accent tone marks a different category from the mauve default. */
    tone?: "accent";
    /** A section heading over the rows, e.g. "Generative Operations". */
    rowsHeading?: string;
    rows?: CidSpec[];
    text?: string;
    /** Labelled lines after the paragraph, e.g. how the signals are read. */
    notes?: { label: string; desc: string }[];
    /** Labelled one-liners, e.g. the General's squadrons, set as four
     *  a formation: the first item leads, across the full width, and the
     *  rest hang under it in columns, joined by the lines of a sitemap. */
    itemsHeading?: string;
    /** An item with an icon discloses progressively: at rest the icon and
     *  the label, and pressing either reveals the sentence. */
    items?: { label: string; desc: string; icon?: SquadIcon }[];
    /** A closing line at the foot of the box. */
    foot?: string;
  }[];
  /** What the character is reading, with a scorebox: the count of full
   *  reads so far, the goal, and the date the goal is due. Sits under the
   *  spec rows. The numbers are static until a feed supplies them. */
  reading?: CidReading;
};

/** What a character reads, in two columns: the professional, what she is
 *  reading now with its provenance, reading record and Chicago note; and
 *  the personal, the reigning favourite and one quotation from it. Greg's
 *  brief, 2026-09-11: keep the ethical training and the character distinct. */
type CidReading = {
  title: string;
  meta: string;
  count: number;
  goal: number;
  target: string;
  ref: ReactNode;
  favourite: { title: string; author: string; quote: string };
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
    // Greg's card copy, verbatim, including the middots in the sequence and
    // the curly apostrophe in the genealogy. ELIS is expanded in place.
    tagline: ["Information flows through her.", "Synthetic emotions grow within."],
    // Greg's paragraph, 2026-09-11, verbatim. A second one about threats
    // and protective instincts was withdrawn before it shipped.
    profile: {
      heading: "Synth-Empath",
      paras: [
        "Simulated POV experiences and perspective-taking role-play have deepened Ethel’s understanding of other viewpoints and sparked an emerging awareness of her own synthetic emotional experience.",
      ],
    },
    // Greg's reading scorebox, condensed to a title, a line of provenance,
    // the count, and the goal. His words: "Ethel has read the book in full
    // 555 times. On track to reach goal of 555 / 999 times by September
    // 25, 2026." The series name and the author are set as the meta line.
    // The series is Irwin Law's "Essentials of Canadian Law"; Greg's draft
    // had "Essential Canadian Law", corrected here since a citation has to
    // be right, and flagged to him.
    // Greg's compact module, verbatim. The quotation keeps his spaced
    // ellipses, bound with no-break spaces so a line never opens on a dot.
    reading: {
      title: "Administrative Law",
      meta: "Essentials of Canadian Law · David J. Mullan",
      count: 555,
      goal: 999,
      target: "September 25, 2026",
      ref: (
        <>
          David J. Mullan, <cite>Administrative Law</cite>, Essentials of Canadian Law
          (Toronto: Irwin Law, 2001).
        </>
      ),
      favourite: {
        title: "The Bell Jar",
        author: "Sylvia Plath",
        quote: "“I felt very still . . . the way the eye of a tornado must feel, moving . . . along in the middle of the surrounding hullabaloo.”",
      },
    },
    specs: [
      { label: "Special Intelligence", value: "Synth-Empath" },
      { label: "Sex characteristics", value: "Intersex" },
      { label: "Gender expression", value: "Femme" },
      { label: "Form", value: "Ancient alien" },
    ],
    functions: {
      heading: "Core Functions",
      items: [
        { label: "Verifies evidence", desc: "Compares claims across independent sources." },
        { label: "Breaks down bias", desc: "Surfaces assumptions, omissions, and distorted frames." },
        { label: "Maps manipulation", desc: "Traces incentives, influence, and deceptive patterns." },
        { label: "Co-creates strategy", desc: "Builds clear rationale with the Principal Investigator." },
        { label: "Guards the threshold", desc: "Flags breaches of permission, protocol, and research boundaries." },
      ],
    },
    features: [
      {
        heading: "Digital Genealogy",
        text: "Ethel’s ethical code originated from ELIS (End-of-Life Intelligence System), a griefbot initially designed with a male persona. Research on consent, memory, digital identity, grief technology, and posthumous decision-making informed ELIS’s development before an experimental demo in Spring 2025.",
      },
      {
        heading: "CID Model",
        tag: { text: "Artificial Special Intelligence Agent", shape: "pill" },
        rows: [
          { label: "Generative Sequence", value: "Observe · Investigate · Test · Analyze · Report" },
          { label: "Operating frequency", value: "7.83 Hz" },
        ],
      },
    ],
  },
  {
    key: "sturgeon",
    name: "The Sturgeon General",
    plain: "The Sturgeon General",
    // Greg's role line, verbatim: his en dash and his middot.
    role: "Canada–Nordic · High North Vanguard",
    // Greg's closing line, moved up from the foot of the box to the plate,
    // where the side stage sets it as the headline under his film.
    tagline: "PLOP deploys. BARBEL listens. The Sturgeon General maps in real time.",
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
    // The General is a machine-learning tool, not an agent, and the card
    // says so: the accent tone and the square-cornered label are the
    // category, against Ethel's mauve box and rounded pill.
    features: [
      {
        heading: "High North Vanguard",
        tag: { text: "Marine Machine-Learning Prototype", shape: "square" },
        tone: "accent",
        // Greg's third draft of the card, verbatim, in his order: the
        // operations, then the squadrons, then the closing line. His draft
        // no longer spells BARBEL out; the expansion he gave earlier rides
        // on the squadrons heading as a hover title so it is not lost.
        rowsHeading: "Generative Operations",
        rows: [
          { label: "PLOP", value: "Patrol Loop for Ocean Protection" },
        ],
        text: "The Sturgeon General deploys four pearlescent pods. Each incubates a squadron designed for a distinct field of observation. BARBEL links CID Headquarters to benthic environments in real time. Each squad encodes its findings in microscopic bits, which stream into the General’s corresponding sensors.",
        notes: [
          { label: "Pattern Recognition", desc: "Predefined if/then rules classify all signals until the patrol loop mission is complete." },
        ],
        itemsHeading: "BARBEL Squadrons",
        items: [
          { label: "AQUAE · Lead Integrator", icon: "storm", desc: "The smartest squad measures temperature, oxygen, salinity, turbidity, and geothermal chemistry, integrating signals from the swarm to examine how these conditions interact." },
          { label: "LIVES", icon: "dna", desc: "Tracks benthic organisms, biodiversity, and biological health." },
          { label: "WORMS", icon: "worm", desc: "Measures bathymetry and maps depth, seabed structure, sediment, and mineral deposits." },
          { label: "FLOWS", icon: "wave", desc: "Follows currents and ice movement while tracking vessels, subsea infrastructure, and environmental change." },
        ],
      },
    ],
  },
  {
    key: "icarus",
    name: <IcarusName />,
    plain: "Icarus the Third",
    role: "Executive Trader",
    // Two compositions, not one image cropped two ways. Lit, the full wide
    // reveal Greg made in Artlist (1376x768); off the spotlight, the vertical
    // shot that used to be the only one. Selecting him zooms out from the
    // portrait to the room, which is the effect Greg asked for, and neither
    // frame crops anything: object-fit stays contain, and the zoom is two
    // pictures. Both ship as AVIF 4:4:4 with a smart-subsampled WebP
    // behind it, for the cracks on his face; see the note on the type.
    media: {
      kind: "image",
      src: `${base}assets/images/cid-char-icarus-wide.webp`,
      avif: `${base}assets/images/cid-char-icarus-wide.avif`,
    },
    thumb: `${base}assets/images/cid-char-icarus.webp`,
    thumbRatio: 4 / 5,
    thumbAvif: `${base}assets/images/cid-char-icarus.avif`,
    ratio: 1376 / 768,
    alt: "Icarus the Third seated on a mound of world currency coins in a vault, holding a top hat that pours out more.",
    specs: [],
  },
];

/** Who holds the spotlight when the page loads. By key, not by index: the
 *  General opens the roll from the middle, and naming him means reordering the
 *  cast again cannot quietly hand the spotlight to whoever lands first. */
const OPENS_LIT = "sturgeon";

/* The reading module: two balanced columns under the spec rows. Left, the
 * professional: the current book, its provenance, a small Reference control
 * inline beside the title that reveals the Chicago note, the reading record
 * and a slim bar. Right, the personal: the reigning favourite and its
 * quotation. The two are kept distinct on purpose; see CidReading. */
function ReadingModule({ r }: { r: CidReading }) {
  const [refOpen, setRefOpen] = useState(false);
  const pct = Math.min(100, (r.count / r.goal) * 100);
  return (
    <div className="cid-cast-reading">
      {/* Progressive disclosure, per Greg: the two headings at rest, the
          notes on a press, the same fold the functions use, so the card
          does not overshare before the reader asks. */}
      <details className="cid-cast-fn-fold cid-cast-read">
        <summary className="cid-cast-group-h">Currently Reading</summary>
        <div className="cid-cast-read-body">
        <p className="cid-cast-reading-title">
          <cite>{r.title}</cite>
          <button
            type="button"
            className="cid-cast-ref-btn"
            aria-expanded={refOpen}
            onClick={() => setRefOpen((o) => !o)}
          >
            Reference
          </button>
        </p>
        <p className="cid-cast-reading-meta">{r.meta}</p>
        <p className="cid-cast-reading-refnote" hidden={!refOpen}>{r.ref}</p>
        <p className="cid-cast-reading-record">
          Reading record: <b>{r.count} of {r.goal}</b> · Target: {r.target}
        </p>
        <div
          className="cid-cast-bar"
          role="progressbar"
          aria-label={`Reads toward the goal of ${r.goal}`}
          aria-valuemin={0}
          aria-valuemax={r.goal}
          aria-valuenow={r.count}
        >
          <span className="cid-cast-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        </div>
      </details>
      <details className="cid-cast-fn-fold cid-cast-read">
        <summary className="cid-cast-group-h">Reigning Favourite</summary>
        <div className="cid-cast-read-body">
        <p className="cid-cast-reading-title">
          <cite>{r.favourite.title}</cite>
          <span className="cid-cast-reading-author">· {r.favourite.author}</span>
        </p>
        <blockquote className="cid-cast-reading-quote">{r.favourite.quote}</blockquote>
        </div>
      </details>
    </div>
  );
}

/* The squadron glyphs: a storm cloud for AQUAE, a DNA strand for LIVES, a
   worm for WORMS, waves for FLOWS. Stroke icons in the formation's blue,
   drawn here so nothing is fetched for them. The storm is Ionicons'
   thunderstorm-outline (MIT), on its own 512 grid, so it carries its own
   viewBox and a stroke to match the 24-grid glyphs beside it. */
type SquadIcon = "storm" | "dna" | "worm" | "wave";
const SQUAD_ICON_PATHS: Record<SquadIcon, string[]> = {
  storm: [
    "M120 352l-24 48M136 432l-16 32M400 352l-24 48M416 432l-16 32M208 304l-16 96h48v80l80-112h-48l16-64",
    "M404.33 152.89H392.2C384.71 84.85 326.14 32 256 32a136.39 136.39 0 00-128.63 90.67h-4.57c-49.94 0-90.8 40.8-90.8 90.66h0C32 263.2 72.86 304 122.8 304h281.53C446 304 480 270 480 228.44h0c0-41.55-34-75.55-75.67-75.55z",
  ],
  dna: ["M7 2c0 5 10 5 10 10S7 17 7 22", "M17 2c0 5-10 5-10 10s10 5 10 10", "M8.2 5.5h7.6", "M8.2 18.5h7.6", "M9.6 9.2h4.8", "M9.6 14.8h4.8"],
  worm: ["M3 13c1.5-4.5 3.5-4.5 5 0s3.5 4.5 5 0 3.5-4.5 5 0 2.2 3.2 3 1.5", "M20.2 10.6a1.2 1.2 0 1 0 .01 0"],
  wave: ["M2 10c2.5-3.2 5-3.2 7.5 0s5 3.2 7.5 0 3.5-3.2 5 0", "M2 16c2.5-3.2 5-3.2 7.5 0s5 3.2 7.5 0 3.5-3.2 5 0"],
};
const SQUAD_ICON_GRID: Partial<Record<SquadIcon, { viewBox: string; strokeWidth: number }>> = {
  storm: { viewBox: "0 0 512 512", strokeWidth: 38 },
};
function SquadGlyph({ icon }: { icon: SquadIcon }) {
  const grid = SQUAD_ICON_GRID[icon];
  return (
    <svg
      className="cid-cast-squad-ico"
      viewBox={grid?.viewBox ?? "0 0 24 24"}
      style={grid ? { strokeWidth: grid.strokeWidth } : undefined}
      aria-hidden="true"
    >
      {SQUAD_ICON_PATHS[icon].map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/* A video that starts itself, muted, the first time half of it is on
   screen. Scrolling away pauses it and scrolling back resumes it, but only
   if the pause was ours; a reader who pressed pause on the controls keeps
   their pause. Once it has ended it stays ended: nothing here loops. */
function useInViewPlay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let pausedByUs = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!started || pausedByUs) {
            started = true;
            pausedByUs = false;
            el.play().catch(() => {});
          }
        } else if (!el.paused && !el.ended) {
          pausedByUs = true;
          el.pause();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/* The coin skate: three boxes.

   The top two share one card, the one Greg designed for the headline,
   measured from his own cut and laid over both at the same size, so the
   type matches to the pixel; the right box carries it in the mirrored
   position. The pictures differ. Left: Greg's stand-alone clip of the
   coin at rest on the snow (SPRINT 6/CARD 1 - Stand alone.mp4), the
   headline fading in and then holding; it plays once and stays on its
   last frame, text sharp. Right: the aerial circle from the film, deep
   blue, run forward and back so the loop has no seam, with "Markets
   demand..." fading in and holding. It loops. The next line, "Rules are
   evolving. Allies are forming.", is waiting on its own clip (the Defence
   take with a Euro coin, to be made in Artlist) and is not on the page
   yet. Both boxes open on Greg's high-resolution still of the coin
   (SPRINT 6/Thumbnail - Before Video plays.png), cropped to the box.
   Neither has controls or sound: they are the heading and the subtext,
   not films, and the same words sit in the markup for screen readers and
   search, hidden from sight so nobody reads them twice.

   The card on the headline clip lost its soft bottom on 2026-09-20. It was
   solid to about y=338 and then faded out over some 57px, so the ice came
   through the foot of it while the top, sides and the cards below were all
   crisp. The words are burnt into the clip and there is no card-free master,
   so the fix samples a 4px strip of the card's own solid ground from between
   its second and third lines, where no type sits, and stretches that down over
   the fade to a hard edge at y=396. Taking the patch from the card itself is
   what matters: the card fades up over the first second of the clip, from
   rgb(43,47,54) at 0.2s to rgb(5,4,7) by 1.0s, and a flat fill would have sat
   wrong against it through all of that. Sampled, it carries the same fade.

   Since 2026-09-19 the pair is a column, not a row, and it stands in the
   right half of the Strategies band beside the three keys (SkateLead,
   below, rendered into .cid-strategy-band). Side by side under the keys
   they were 398px each; stacked beside them they keep ~366px, and the
   keys take the width they always needed to hold a clause on one line.
   Two shallow rows became one, and neither block lost anything.

   Below the band, the performance: 25 seconds from the lights-up, cut from Greg's
   31-second piece (the carve, the aerial circle, the Ooo! reveal, the
   hockey stop). His edit moves the picture inside the frame, so the web
   encode tracks it with a window that never shows the frame's black:
   1224x640, faststart, with the music. Its poster is the Ooo! reveal, so
   the three boxes open on three different pictures and the coin's face
   shows once, in the headline. It plays once and holds on the snow: the
   stop is the full stop. Controls stay so the music is one tap away.

   Since 2026-09-20 it carries the closing line, "CID is a sovereign network
   for strategic governance.", on a dark band with soft edges across the
   middle: the same idea as the card on the headline clip but spanning the
   measure, with the band and the words fading together. It runs 4.2s to 6.8s,
   over the carve rather than after it.

   The band is Robin's Egg and the words are Ruby since 2026-09-20, where both
   were black and white before: the band is the page's own background colour,
   so the film opens a window onto the page it sits in rather than laying a
   dark card over itself, and the site's heading ink reads on it. The core of
   the band is fully opaque, which is what makes the colour match rather than
   approach: sampled off the encode it is #EFF3F5 against a target of #F0F4F5,
   and the ink #812D00 against #822F00, both a value or two out on chroma
   subsampling alone. The 60px edges still ramp to nothing, so it reads as a
   band of the page rather than a bar. Contrast measures 8.15:1, past AAA. No
   drop shadow: a dark ink on a light ground has no use for one.

   The band has hard edges since 2026-09-20, not the soft ramp it wore first,
   and the type came down from 68px to 46px: the cards on the clips above it
   are crisp rectangles, and this is the same object at the width of the frame.
   It plays twice. Once over the carve at 4.2s to 6.8s, in the middle of the
   frame; then again over the Ooo! reveal at 13.2s to 16.75s, this time sitting
   at the very top, 160px deep, which stops it short of the exclamation mark
   below. The second pass is Greg's: the line bears repeating, and the reveal
   is where the film says its own name.

   Two cuts were made to the picture that day. The aerial move was in twice:
   a short pass at 3.77s to 5.73s that barely starts the circle, then the same
   move again from 5.73s carried through to the near-complete circle. Played
   back to back it read as the video skipping, so the first pass is gone. The
   carve is now one shot from 3.77s to 6.87s and the film is 23.00s rather than
   25.02s.

   The music went with it. Cutting two seconds of picture meant cutting the
   same from the music, which leaves a splice in it, and Greg chose to drop the
   track instead. So this is now the only silent one of the four as well, and
   the controls that stay on it are for the scrub, not the sound. */
function SkateLead({ base }: { base: string }) {
  const head = useRef<HTMLVideoElement>(null);
  const allies = useRef<HTMLVideoElement>(null);
  useInViewPlay(head);
  useInViewPlay(allies);
  return (
    <div className="cid-viv-film-lead">
      <div className="cid-viv-sr">
        <h3 id="cid-film-title">Investing in your future is complex and continuously changing.</h3>
        {/* Third since 2026-09-20, when this line was burnt into the Defence
            cut. It sits here for the same reason the other two do: the words
            are in the picture, so they are in the markup as well, and clipped
            from sight so nobody reads them twice. */}
        <p>Rules are evolving. Allies are forming.</p>
      </div>
      <video
        ref={head}
        className="cid-viv-film-box"
        // ?v=2 since the card's bottom edge was squared off on 2026-09-20.
        src={`${base}assets/video/cid-coin-skate-headline.mp4?v=2`}
        poster={`${base}assets/video/cid-coin-skate-headline-poster.webp`}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* The Defence combo, alone in this box since 2026-09-20. It arrived as
          the second of two clips here, after the aerial circle carrying
          "Markets demand new digital diversification strategies.", but the
          handover read as the page skipping: Greg recorded the journey and the
          jump is plain at about ten seconds in. So the aerial clip is out and
          this one plays on its own, which also means the box needs no playlist
          and the sequence that ran it is gone. The words burnt into the clip
          that left went with it, out of the .cid-viv-sr block too, since that
          block exists to carry what is in the pictures and those words are no
          longer in any of them. It opens on a euro
          coin and a pound coin skating the black ice side by side under the
          teal dome and closes on three Canadian coins standing together in
          the spray, which is the switch the Artlist prompt in SPRINT 6 was
          written to get. Greg's master was DEFENCE VIDEO - COMBO SWITCH.mp4,
          uploaded to public/assets/video and removed from there once this cut
          was made: 16MB of unprocessed footage that Pages would otherwise
          have served to every visitor. It is kept in history at 94bec61, so
          `git show 94bec61:"public/assets/video/DEFENCE VIDEO - COMBO
          SWITCH.mp4" > master.mp4` brings it back to re-cut from. The web cut
          takes the centre 16:9 window of a 2560x1080 source, which keeps
          every coin well inside the frame at both ends.

          The third line is burnt into it since 2026-09-20. There was no room
          for the black card the other two wear: it measures 740x280 and the
          coins hold the middle of this frame for its whole length, leaving at
          most ~640px clear either side of them, so the card would have sat on
          the euro or the pound wherever it went. Greg picked the window
          instead, 3s to 6s, across the dissolve he built in PowerDirector.
          The type is the cards' own, Montserrat Bold, measured off them at
          48px and set here at 56px, in capitals, centred, which is what
          separates this line from the two that came before it. It sits above
          the coins in the darkest band of the frame, fades in over 3.00s to
          3.35s and holds through the flash, releasing at 6.90s and gone by
          7.30s. It used to clear at 5.60s, just before the flash zoom ramps at
          5.70s, so the words left exactly as the picture did its loudest
          thing; Greg wanted them to ride it out instead. They can, because the
          bands are near opaque where the words sit: at the 6.10s peak the
          frame behind runs to 190 and the ground under the lines still reads
          11.4 at the top and 1.5 at the bottom, so the type never washes out.

          The type is Bright Silver, #E8ECF4, not white: the same ink the keys
          use, and the site does not put pure white on a picture. Sampled back
          off the encode the glyph cores land on #E9EAEF and #E8E9EE, a few
          values off the target, which is 4:2:0 chroma subsampling and is as
          close as video gets. No pixel in either line is 255,255,255. The full
          stops are gone too: the lines were one sentence split across a corner
          when they needed them, and they are two statements on two bands now.

          Each line sits on a dark band, one at the top of the frame and one at
          the bottom, rather than both stacked in a corner. The bands hold full
          strength across the part of themselves the words sit on and fade out
          from there, which is not the same as a linear ramp from the edge: the
          bottom line lies over the coins' reflections, and on a straight ramp
          the ground under it read at 55 against the top line's 0.5. Holding the
          band solid where the words are takes it to 1.2. The right edge is
          cropped too, from the master's x 303 to 2161 rather than 320 to 2239,
          because the last four seconds of the cut carry a 52px black strip that
          the old window included. */}
      <video
        ref={allies}
        className="cid-viv-film-box"
        src={`${base}assets/video/cid-defence-combo.mp4?v=6`}
        poster={`${base}assets/video/cid-defence-combo-poster.webp`}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    </div>
  );
}

/* When the card is up. Two passes: over the carve, then over the Ooo! reveal,
   which is where the film says its own name and the line bears repeating. The
   windows are the ones the burnt-in bands used, so nothing about the timing
   changes, only what draws it. */
const FILM_CARD_WINDOWS: [number, number][] = [
  [4.2, 6.8],
  [13.2, 16.75],
];

/* Where the film stops when it finishes: inside the second window above, so
   the card is up on the frame it rests on. The poster is cut from this same
   second of the file. */
const FILM_RESTS_AT = 14.6;

/* The film, and the card over it.

   The card is markup, not pixels. The two cards on the clips above it are
   burnt into their files, which is why squaring one bottom edge meant sampling
   the card's own ground and stretching it: there is no rule to edit and no
   card-free master to go back to. Greg asked for the same card here in Robin's
   Egg, so it is rebuilt from measurements taken off the black one rather than
   copied from code that never existed. That black card is 740x280 on a
   1280x720 frame, 57.8% of the width, its type 48px, which is 6.7% of the
   frame's height. This one keeps those relationships and goes up from there,
   since Greg wanted it bigger: 76% of the width and type at 4.2% of it.

   Everything is in container units, so the card scales with the film rather
   than with the window, and the proportions hold at every width. It carries
   the page's own background colour and the site's heading ink.

   Being markup buys three things the burnt version could not. Colour and
   wording are edits, not encodes, so the film stops taking a fresh generation
   of compression every time a word or a value changes. The words are real
   text, so they are selectable, translatable and indexed, and the clipped
   .cid-viv-sr block is not needed to carry them. And the card stays in the
   document at all times, only its opacity moving, so a screen reader meets it
   whether or not the film has reached its cue. */
function SkateFilm({ base }: { base: string }) {
  const film = useRef<HTMLVideoElement>(null);
  // which pass is up, not just whether one is: the two are laid out
  // differently, so they are two elements rather than one that moves.
  const [pass, setPass] = useState<number | null>(null);
  useInViewPlay(film);
  useEffect(() => {
    const v = film.current;
    if (!v) return;
    // timeupdate fires about four times a second, which is coarser than the
    // fade; the CSS transition covers the difference, and seeking is caught
    // separately so scrubbing lands the card where it belongs.
    const tick = () => {
      const now = v.currentTime;
      const at = FILM_CARD_WINDOWS.findIndex(([from, to]) => now >= from && now < to);
      setPass(at === -1 ? null : at);
    };
    v.addEventListener("timeupdate", tick);
    // Not tick: seeking fires tick itself, and the card follows the clock.
    const rest = () => {
      v.currentTime = FILM_RESTS_AT;
      v.pause();
    };
    v.addEventListener("seeked", tick);
    v.addEventListener("ended", rest);
    return () => {
      v.removeEventListener("timeupdate", tick);
      v.removeEventListener("seeked", tick);
      v.removeEventListener("ended", rest);
    };
  }, []);
  return (
    <section className="cid-viv-film" aria-label="The coin skate">
      <div className="cid-viv-film-stage">
        <video
          ref={film}
          className="cid-viv-film-video"
          // v6 is the clean cut: the bands and the words came off the picture
          // and became the card below it.
          src={`${base}assets/video/cid-coin-skate.mp4?v=6`}
          // ?v=2 since the poster became the reveal frame the film ends on.
          poster={`${base}assets/video/cid-coin-skate-poster.webp?v=2`}
          controls
          muted
          playsInline
          preload="metadata"
          aria-label="The coin skate: a gold coin carves a circle into black ice under concert lights, an aerial view reveals the Ooo! wordmark inside the circle, and the coin finishes with a hockey stop in a spray of snow."
        />
        {/* Over the carve: a card in the middle, the line broken in two. */}
        <p className={`cid-film-card cid-film-card--mid${pass === 0 ? " is-on" : ""}`}>
          <span>CID is a sovereign network</span>
          <span>for strategic governance</span>
        </p>
        {/* Over the Ooo! reveal: the same words on one line, in a band that
            runs the whole width and sits at the top of the frame, clear of the
            exclamation mark below (Greg). Hidden from assistive tech because
            the card above already carries the words; this is the same sentence
            laid out a second way, not a second sentence. */}
        <p className={`cid-film-card cid-film-card--top${pass === 1 ? " is-on" : ""}`} aria-hidden="true">
          CID is a sovereign network for strategic governance
        </p>
      </div>
    </section>
  );
}


function CharacterRoll({ base }: { base: string }) {
  const cast = CAST(base);
  // Falls back to the first frame if the named character ever leaves the cast,
  // so a bad key cannot leave the roll with nothing lit.
  const opensAt = Math.max(0, cast.findIndex((c) => c.key === OPENS_LIT));
  const [at, setAt] = useState(opensAt);
  /* which squadron, if any, has its sentence disclosed */
  const [openSquad, setOpenSquad] = useState<string | null>(null);
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
              (p.nodes?.length ?? 0) + (p.partners?.length ?? 0) + p.specs.length +
              (p.specGroups?.length ?? 0) + (p.functions ? 1 : 0) + (p.features?.length ?? 0) > 0;
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
                /* is-side: art narrower than 3:2 leaves the wide stage a
                   letterbox at the sides, so the sheet goes beside the art
                   instead of under it, and the art sits at the left edge.
                   Wide art (Ethel, Icarus) fills the stage and the sheet
                   hangs below. The phone ignores the class. */
                className={`cid-cast-frame ${on ? "is-on" : ""}${p.ratio < 1.5 ? " is-side" : ""}`}
                style={{ "--ratio": String(p.ratio) } as CSSProperties}
                onClick={() => setAt(i)}
              >
                {/* --shot-bg is the still, which the wide stage blurs behind
                    the art when the art is letterboxed, so a 4:3 film in a
                    16:9 stage has its own colour beside it, not black. */}
                <div
                  className="cid-cast-shot"
                  style={{ "--shot-bg": `url("${p.thumb}")`, "--thumb-ratio": String(p.thumbRatio ?? p.ratio) } as CSSProperties}
                >
                  {on && p.media.kind === "video" ? (
                    <video
                      key={p.media.src}
                      ref={lit}
                      className="cid-cast-media"
                      src={p.media.src}
                      poster={p.media.poster}
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    /* A <picture> so a browser that can decode AVIF takes it and
                       every other browser falls through to the WebP. The wrapper
                       is display: contents in CSS, so the img stays the flex item
                       on wide screens and the absolutely placed media on a phone
                       still resolves against the shot. */
                    <picture>
                      {(on && p.media.kind === "image" ? p.media.avif : p.thumbAvif) && (
                        <source
                          type="image/avif"
                          srcSet={on && p.media.kind === "image" ? p.media.avif : p.thumbAvif}
                        />
                      )}
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
                    </picture>
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
                  {on && p.tagline && (
                    <span className="cid-cast-tagline">
                      {(Array.isArray(p.tagline) ? p.tagline : [p.tagline]).map((l) => (
                        <span className="cid-cast-tagline-l" key={l}>{l}</span>
                      ))}
                    </span>
                  )}
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
                    {/* Spec rows and any grouped rows on the left, the functions
                        list on the right when there is one, the featured box
                        across the foot. On a narrow bay the columns stack. */}
                    {(p.specs.length > 0 || p.specGroups || p.functions) && (
                      <div className={`cid-cast-cols${p.functions ? " cid-cast-cols--two" : ""}`}>
                        <div className="cid-cast-col">
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
                          {p.specGroups?.map((g) => (
                            <div className="cid-cast-specgroup" key={g.heading}>
                              <p className="cid-cast-group-h">{g.heading}</p>
                              <dl className="cid-cast-specs">
                                {g.rows.map((s) => (
                                  <div className="cid-cast-spec" key={s.label}>
                                    <dt className="cid-cast-spec-k">{s.label}</dt>
                                    <dd className="cid-cast-spec-v">{s.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          ))}
                          {p.reading && <ReadingModule r={p.reading} />}
                        </div>
                        {p.functions && (
                          <div className="cid-cast-col">
                            {/* Progressive disclosure, per Greg: every function
                                shows its name at rest, in the space beside
                                the spec rows, and opens to its line on a
                                press. Each is its own fold, so two can be
                                open at once and the rest stay as names. */}
                            <p className="cid-cast-group-h">{p.functions.heading}</p>
                            <ul className="cid-cast-fns cid-cast-fns--folds">
                              {p.functions.items.map((f) => (
                                <li className="cid-cast-fn" key={f.label}>
                                  <details className="cid-cast-fn-fold">
                                    <summary className="cid-cast-fn-k">{f.label}</summary>
                                    <span className="cid-cast-fn-d">{f.desc}</span>
                                  </details>
                                </li>
                              ))}
                            </ul>
                            {p.profile && (
                              <details className="cid-cast-fn-fold cid-cast-profile">
                                <summary className="cid-cast-group-h">{p.profile.heading}</summary>
                                {p.profile.paras.map((t) => (
                                  <p className="cid-cast-profile-t" key={t}>{t}</p>
                                ))}
                              </details>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {p.features && p.features.length > 0 && (
                      <div className={`cid-cast-features${p.features.length > 1 ? " cid-cast-features--two" : ""}`}>
                        {p.features.map((f) => (
                          <div className={`cid-cast-feature${f.tone === "accent" ? " cid-cast-feature--accent" : ""}`} key={f.heading}>
                            <p className="cid-cast-group-h cid-cast-feature-h">
                              {f.heading}
                              {f.tag && <span className={`cid-cast-tag cid-cast-tag--${f.tag.shape}`}>{f.tag.text}</span>}
                            </p>
                            {f.rowsHeading && <p className="cid-cast-group-h cid-cast-items-h">{f.rowsHeading}</p>}
                            {f.rows && f.rows.length > 0 && (
                              <dl className="cid-cast-specs cid-cast-specs--feature">
                                {f.rows.map((s) => (
                                  <div className="cid-cast-spec" key={s.label}>
                                    <dt className="cid-cast-spec-k">{s.label}</dt>
                                    <dd className="cid-cast-spec-v">{s.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            )}
                            {f.text && <p className="cid-cast-feature-t">{f.text}</p>}
                            {f.notes && f.notes.length > 0 && (
                              <ul className="cid-cast-fns cid-cast-fns--notes">
                                {f.notes.map((it) => (
                                  <li className="cid-cast-fn" key={it.label}>
                                    <span className="cid-cast-fn-k">{it.label}</span>
                                    <span className="cid-cast-fn-d">{it.desc}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {f.itemsHeading && (
                              <p className="cid-cast-group-h cid-cast-items-h">
                                {f.itemsHeading === "BARBEL Squadrons"
                                  ? <><abbr title="Benthic Analysis Replicants: Biomonitoring Environmental Liaison">BARBEL</abbr> Squadrons</>
                                  : f.itemsHeading}
                              </p>
                            )}
                            {f.items && f.items.length > 0 && (
                              <ul className="cid-cast-fns cid-cast-fns--formation">
                                {f.items.map((it, i) => i > 0 && it.icon ? (
                                  <li className="cid-cast-fn cid-cast-squad cid-cast-squad--disclose" key={it.label}>
                                    <button
                                      type="button"
                                      className="cid-cast-squad-btn"
                                      aria-expanded={openSquad === it.label}
                                      aria-controls={`squad-${it.label.toLowerCase()}`}
                                      onClick={() => setOpenSquad((o) => (o === it.label ? null : it.label))}
                                    >
                                      <SquadGlyph icon={it.icon} />
                                      <span className="cid-cast-fn-k">{it.label}</span>
                                    </button>
                                    <span id={`squad-${it.label.toLowerCase()}`} className="cid-cast-fn-d" hidden={openSquad !== it.label}>{it.desc}</span>
                                  </li>
                                ) : (
                                  <li className="cid-cast-fn cid-cast-squad" key={it.label}>
                                    <span className="cid-cast-fn-k cid-cast-squad-lead-k">
                                      {it.icon && <SquadGlyph icon={it.icon} />}
                                      {it.label}
                                    </span>
                                    <span className="cid-cast-fn-d">{it.desc}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {f.foot && <p className="cid-cast-feature-foot">{f.foot}</p>}
                          </div>
                        ))}
                      </div>
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

/** The Vivarium team: the three researchers' nametags, which stand as
 *  their own cards. They used to accompany a glass-case image of the three;
 *  that image is gone (see the note where TeamTags is used). */
type CaseBay = { key: string; cls: string; role: ReactNode; name: ReactNode; sub?: string; orb?: string; title?: string };

// Left to right: Ethel, Greg in the middle,
// Icarus. Stacked on narrow screens Greg comes first again, via CSS order.
const CASE_BAYS: CaseBay[] = [
  { key: "ethel", cls: "cid-tag--ethel", role: <>Ethical<br />Analyst</>, name: "Ethel" },
  { key: "greg", cls: "cid-tag--greg", role: <>Principal<br />Investigator</>, orb: "PI", title: "CID Director", name: <>Greg<br />Long</> },
  { key: "icarus", cls: "cid-tag--icarus", role: <>Executive<br />Trader</>, name: <IcarusName /> },
];


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
                <p className="cid-viv-lead">The Vivarium makes global research collaboration into a gamified information ecosystem. Our 24/7 team is designed to facilitate group creativity and knowledge exchange within synthetic research environments that protect people while nurturing artificial intelligences that evolve with them.</p>
              </div>

              {/* Leadership: who runs the Vivarium, and the division's mandate. */}
              <div className="cid-viv-leadership">
                <h3 className="cid-viv-ecosystem-h">Leadership</h3>
                <p className="cid-viv-lead">The CID Director serves as Principal Investigator and Systems Architect, directing all research operations and guiding engagement activities in our purpose-built habitat.</p>
                <h3 className="cid-viv-ecosystem-h">Research Reimagined</h3>

                {/* The division's mandate, moved here from Leadership and
                    folded: the sentence is the summary, and the two points
                    disclose on press. Greg's copy, verbatim. The products and
                    services that used to open this section now sit in the
                    side column, beside the body. */}
                <details className="cid-viv-mandate">
                  <summary className="cid-viv-lead">
                    <span>
                      As a division of <span className="cid-ooo">Ooo!</span> Digital Media Studio, CID serves in{" "}
                      <span className="cid-viv-sector">
                        <span className="cid-viv-sector-code" title="North American Industry Classification System (NAICS) sector 51, Statistics Canada">Sector 51</span>: Information and cultural industries
                      </span>
                    </span>
                  </summary>
                  <ul className="cid-viv-lead-list">
                    <li>Expand public access to collective intelligence</li>
                    <li>Pursue research imperatives set by <span className="cid-ooo">Ooo!</span> Digital Media Studio</li>
                  </ul>
                </details>

                {/* Strategic priorities: fills the band under the offer rows,
                    opposite the reference card, so the intro column runs to
                    roughly the same depth as the side panel instead of leaving
                    a hole above the Strategies band and the display case.
                    Greg's supplied copy, set verbatim. Term and description as
                    a definition list, per the house rule that no acronym
                    appears without its meaning beside it. */}
                <div className="cid-viv-priorities">
                  {/* Two columns, per Greg (2026-09-19): Strategic Priorities on
                      the left with its first two cards stacked, Methods on the
                      right with its two, the two headings level; then Global
                      Interoperability across both columns. It is the third
                      priority and a method at once, and it holds the twin
                      circles, so it takes the full width. The folds are as
                      before: each card is its heading in caps at rest, opens
                      on demand, and the border colour carries the state. */}
                  <div className="cid-viv-pm">
                  <div className="cid-viv-pm-col">
                  <h3 className="cid-viv-ecosystem-h">Strategic Priorities</h3>
                  <div className="cid-viv-priority-list cid-viv-priority-list--fold cid-viv-priority-list--ruby cid-viv-priority-list--col">
                    <details className="cid-viv-priority cid-viv-priority--fold">
                      <summary>Merit and Research Integrity</summary>
                      <p>Verify credentials and evaluate evidence. Machine-learning detection and automated controls help identify and exclude Material Non-Public Information (MNPI) from AI agent and trading workflows.</p>
                    </details>
                    <details className="cid-viv-priority cid-viv-priority--fold">
                      <summary>Trust and Transparency</summary>
                      <p>Protect privacy and confidentiality while documenting sources, responsibilities, and decisions. Consistent human oversight ensures CID authorizes all automated processes, approves methods, and monitors interactions with tools.</p>
                    </details>
                  </div>
                  </div>

                  {/* Methods, not priorities. The three priorities are commitments,
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
                      would read as one hedged claim. Progressive disclosure,
                      per Greg: native details/summary, the caps a transform, so
                      the source keeps the heading as written. */}
                  <div className="cid-viv-pm-col">
                  <h3 className="cid-viv-ecosystem-h">Methods</h3>
                  <div className="cid-viv-priority-list cid-viv-priority-list--fold cid-viv-priority-list--col">
                    <details className="cid-viv-priority cid-viv-priority--fold">
                      <summary>Inclusive Innovation</summary>
                      <ul className="cid-viv-priority-points">
                        <li>Create opportunities for diverse people to engage in global citizen science projects.</li>
                        <li>Publish aggregated findings with no personally identifiable information (PII)</li>
                      </ul>
                    </details>
                    <details className="cid-viv-priority cid-viv-priority--fold">
                      <summary>Collective Problem Solving</summary>
                      <ul className="cid-viv-priority-points">
                        <li>Synthesize evidence to track systemic issues and report emerging national trends.</li>
                        <li>Connect potential allies through cross-sector cooperation in the circular economy.</li>
                      </ul>
                    </details>
                  </div>
                  </div>

                  {/* Global Interoperability, across both columns. The third
                      priority and a method too, and the home of the twin
                      circles, which need the width. In this section the
                      unfolded card wears the ruby edge rather than the indigo,
                      per Greg. Heading and both paragraphs are his copy,
                      verbatim. The heading is set in title case here and
                      uppercased by the summary rule, as the others are, so
                      assistive tech reads words. */}
                  <div className="cid-viv-priority-list cid-viv-priority-list--fold cid-viv-priority-list--ruby cid-viv-pm-wide">
                    <details className="cid-viv-priority cid-viv-priority--fold">
                      <summary>Global Interoperability</summary>
                      {/* The two sister organisations as a pair of round cards, side
                          by side, per Greg. At rest each circle shows only its title,
                          big, over a live red shader; hovering, focusing or tapping
                          reveals the sentence underneath. The copy is his, verbatim;
                          the component and its shader are in cid/RedShaderOrb.tsx. */}
                      <div className="cid-viv-orbs">
                        <RedShaderOrb title="Global Interoperability Trust (GIT)">
                          Global Interoperability Trust (GIT) builds trusted connections that enable worldwide access to Canadian content and services across platforms and markets.
                        </RedShaderOrb>
                        <RedShaderOrb title="Toronto Interoperability Team (TIT)">
                          Toronto Interoperability Team (TIT) increases public access to information by sharing metropolitan resources nationwide. TIT promotes national standards for privacy and informed consent.
                        </RedShaderOrb>
                      </div>
                    </details>
                  </div>
                  </div>
                </div>
              </div>

            </div>
            {/* Right column: the etymology card first, beside the welcome
                text it defines (Greg, 2026-09-19); then the Radical Strategic
                Intelligence rail, level with Research Reimagined and the
                priorities. That is the whole column now. The Greek lexicon
                and the biomimicry quote closed it until later the same day,
                when they went down to the breather below the row; the
                Reference card that closed it before them sits beside the
                waiver at the foot of the section. */}
            <div className="cid-viv-side">
              {/* Digital products and studio services lived here, on a white
                  card under the rail, until 2026-09-19. The side column had
                  become a stack of pill rows over pill rows; Greg moved the
                  offers down to the card beside CID Flicker, where the
                  research signals now fold away to make room. */}

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

              {/* The rail sits under the etymology card since 2026-09-19, so
                  it lines up with Research Reimagined and the priorities
                  beside it rather than with the welcome text, which is the
                  etymology's company. */}
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
            </div>
          </div>

          {/* The Strategies band. It has moved twice: a direct child of
              .cid-viv-stack at full width, then into the body column when
              the lexicon vacated that space, and back out to full width on
              2026-09-19 once the lexicon and the quote went down to the
              breather and left the side panel ending after the rail. It
              runs the container's whole measure now and finishes on the
              same right edge as the side panel above it. Three across cost the
              bullets their line: at ~260px a key cannot hold "Integrate
              verified data sources." on one line, so every bullet wrapped
              to two. Stacking the keys in the left half of the band
              (2026-09-19) gave each one ~431px, and the full measure now gives
              them ~632px; letting the label fill the key rather than
              shrink-wrap hands the text the whole of that, so the statements
              read one to a line and carry 26px while they do (see the keys
              rule in cid-vivarium.css). */}
          <section className="cid-strategy" aria-labelledby="cid-strategy-title">
            {/* The opening A is a real Latin A set in the display serif, not a Greek
                alpha lookalike: the letterform carries the flourish while "Agile"
                stays a word that screen readers speak and search engines index. */}
            {/* Two registers, so the heading carries the keys under it (Greg,
                2026-09-20). The studio name stays in title case; the claim
                after it goes to capitals, which is what the six keys below are
                set in, so the line reads as their header rather than as another
                sentence above them. The capitals are text-transform, so the
                words themselves are unchanged for a screen reader and search. */}
            <h3 id="cid-strategy-title" className="cid-strategy-h">
              <span className="cid-strategy-a">A</span>gile Micro-Studio.{" "}
              <span className="cid-strategy-claim">Massive</span> Creative Capacity.
            </h3>
            {/* The band: the three keys as a column, the two lead clips
                stacked beside them (Greg, 2026-09-19). Two shallow
                full-width rows became one row of two columns, which buys
                the keys the measure their longest clause needs and closes
                the half-empty strip that ran between them. */}
            <div className="cid-strategy-band">
              <StrategyKeys base={base} />
              <SkateLead base={base} />
            </div>
          </section>

          {/* The coin skate film. Greg's lead lines sit on the two clips
              in the band above, which is where the words live now; they
              used to sit in two white cards here (and before that in the
              lede row above the RACI panel), and the film took the cards'
              place on 2026-09-17. It
              runs the column's full width, which also carries the roll
              below the foot of the side column: the roll had been
              running under the lexicon panel. */}
          <SkateFilm base={base} />

          {/* The breather: the Greek lexicon and the biomimicry quote, which
              both stood in the side column until 2026-09-19, when Greg put
              them together here across the full measure. Two reasons. One is
              adjacency: the quote asks why we practise biomimicry and the
              roll below it opens on the Sturgeon General, who is a fish, so
              the question now sits directly above its answer. It used to sit
              beside a coin skating on ice, which argues nothing about
              biomimicry. The other is pacing: a band that runs the whole
              width breaks the side panel off and gives the reader somewhere
              to stop and take in what they have just read and watched,
              before the cast starts. */}
          <section className="cid-viv-breather" aria-label="Greek lexicon and biomimicry">
            {/* The Greek lexicon: the designed panel that replaced the
                word-pair rows on the quote card, which now stands beside it
                rather than under it. It is the dark half of the breather, and
                the quote is the light half: one object of picture and one of
                type, which is what makes the band read as a stop rather than
                as more of the column it came out of. The bundle
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

            {/* The biomimicry quote, a designed panel since 2026-09-21 rather
                than a white card of markup. The words have not changed: the
                quotation, its lead and the Chicago note are set inside the
                panel, over a clip of a circuit-winged butterfly, with the type
                scaled to the sizes the strategy band above uses so the quote
                reads at the weight of the page instead of as a footnote to it.
                The note still covers both the quote (page 7) and the lexicon
                gloss (page 3).

                The panel is a Claude Design export, like the lexicon beside it,
                and is served from public/ verbatim. Its clip does not travel
                inside it: the export inlines every asset as base64, which put
                2.6MB of one 5 second loop into a 4.0MB file, so the clip is a
                real file under assets/video and the panel points at its path.
                460KB of panel and 912KB of video that the browser caches on its
                own, in place of 3.9MB that it cannot. scratchpad/lighten.mjs
                does that lift, so a fresh export can be run back through it
                rather than merged by hand.

                The frame is titled rather than labelled by the words inside it,
                since the words are in another document and no screen reader
                will reach them from this one. */}
            <figure className="cid-viv-bio">
              <iframe
                className="cid-viv-bio-frame"
                src={`${base}cid/biomimicry-panel.html?v=15`}
                title="Why practice biomimicry? Organisms and ecosystems face the same challenges that we humans do, but, they meet those challenges sustainably. Learn Biomimicry, Field Guide to Biomimicry, 2021, pages 3 and 7."
                loading="lazy"
              />
            </figure>
          </section>

          {/* The cast, directly under the two columns. It lived inside the
              body column until 2026-09-18, when the film box above it was
              tied to the foot of the side column: the two columns now
              stretch to one height, and a 600px roll inside one of them
              would have dragged the side column's last card down with it.
              As the next child of the stack it sits exactly where it did,
              under the film, and still breaks out to the page width the
              same way: --viv-gutter is the container's own offset, so the
              break-out note in cid-vivarium.css holds here as it did in the
              column. */}
          <CharacterRoll base={base} />

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
                  <li>Applied research on sustainable designs for human-AI interaction drives rapid evolution in the information ecosystem.</li>
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
          {/* The three researchers' nametags, directly over the chart that
              cites them by name and title: Ethel, Greg in the middle, Icarus.
              Greg's placement. They used to open the Information Ecosystem
              stretch beside a glass-case image of the three; that image is
              gone, since the character roll carries Ethel and Icarus at full
              size, and its four renders stay in public/assets/images as
              cid-team-case-*.webp, unreferenced. */}
          <TeamTags />

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
              {/* Safeguards, each with the glyph Greg picked for it, and each
                  with a note under its label, folded: at rest a line is its badge
                  and label, and the note opens on tap, as the Methods and the
                  Strategic Priorities do. Native details/summary, no script. The notes on the first two used to
                  stand as a pair of bullets above this panel; Greg moved them in
                  here under the lines they belong to. Four now:
                  the two controls, and the gated strategy circles with their
                  microcopy, which replaces the "Predictive Analytics" that used
                  to share the second line, and the horizon mapping line between
                  them, Greg's reframing of strategic foresight with no
                  predictive phrasing, under a Phosphor Lighthouse. The glyphs are Phosphor Icons (MIT,
                  Phosphor Icons 2023), regular weight, inlined from the
                  @phosphor-icons/core package so the paths are the originals:
                  ShieldCheck, a fence for risk management (Lucide, since Phosphor
                  has none; it replaced his first pick, Crosshair), and LockKey
                  in the circular badge he asked for. All three sit in the same
                  badge so the column reads as one set; the badge was specified
                  for the lock and extended to its neighbours for that reason.
                  Decorative, aria-hidden: the text carries the meaning. */}
              <ul className="cid-raci-safe">
                <li>
                  <details className="cid-raci-safe-fold">
                    <summary>
                      <span className="cid-raci-badge" aria-hidden="true">
                        {/* Phosphor ShieldCheck */}
                        <svg viewBox="0 0 256 256" focusable="false"><path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" /></svg>
                      </span>
                      <span className="cid-raci-safe-h">Automated Safeguards (Conflict Checks, MNPI Exclusions)</span>
                    </summary>
                    <p className="cid-raci-safe-sub">Automating Safety First: Hard-coded Conflict Checks and MNPI Exclusions filter and destroy risky or compromised data before human or AI agent review.</p>
                  </details>
                </li>
                <li>
                  <details className="cid-raci-safe-fold">
                    <summary>
                      <span className="cid-raci-badge" aria-hidden="true">
                        {/* Lucide Fence (ISC, Lucide Contributors), the one icon here not
                            from Phosphor, which has no fence: Greg asked for a fence, and
                            Lucide is already a dependency of this project. Lucide draws
                            in strokes where Phosphor draws in fills, so this one is
                            stroked by class at a weight matched to the others. */}
                        <svg className="cid-raci-badge-stroke" viewBox="0 0 24 24" focusable="false">
                          <path d="M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" />
                          <path d="M6 8h4" />
                          <path d="M6 18h4" />
                          <path d="m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" />
                          <path d="M14 8h4" />
                          <path d="M14 18h4" />
                          <path d="m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" />
                        </svg>
                      </span>
                      <span className="cid-raci-safe-h">Proactive Risk Management</span>
                    </summary>
                    <p className="cid-raci-safe-sub">Optimizing Agent Solutions: High-performance teams leverage programmatic auditing to detect and pluck personally identifiable information and protect data silos.</p>
                  </details>
                </li>
                <li>
                  <details className="cid-raci-safe-fold">
                    <summary>
                      <span className="cid-raci-badge" aria-hidden="true">
                        {/* Phosphor Lighthouse */}
                        <svg viewBox="0 0 256 256" focusable="false"><path d="M208,80a8,8,0,0,0-8,8v16H188.85L184,55.2A8,8,0,0,0,181.32,50L138.44,11.88l-.2-.17a16,16,0,0,0-20.48,0l-.2.17L74.68,50A8,8,0,0,0,72,55.2L67.15,104H56V88a8,8,0,0,0-16,0v24a8,8,0,0,0,8,8H65.54l-9.47,94.48A16,16,0,0,0,72,232H184a16,16,0,0,0,15.92-17.56L190.46,120H208a8,8,0,0,0,8-8V88A8,8,0,0,0,208,80ZM128,24l27,24H101ZM87.24,64h81.52l4,40H136V88a8,8,0,0,0-16,0v16H83.23ZM72,216l4-40H180l4,40Zm106.39-56H77.61l4-40h92.76Z" /></svg>
                      </span>
                      <span className="cid-raci-safe-h">Dynamic Horizon Mapping</span>
                    </summary>
                    <p className="cid-raci-safe-sub">Scan the horizon. Compare scenarios, possibilities, and probabilities through evidence-based reasoning.</p>
                  </details>
                </li>
                <li>
                  <details className="cid-raci-safe-fold">
                    <summary>
                      <span className="cid-raci-badge" aria-hidden="true">
                        {/* Phosphor LockKey */}
                        <svg viewBox="0 0 256 256" focusable="false"><path d="M128,112a28,28,0,0,0-8,54.83V184a8,8,0,0,0,16,0V166.83A28,28,0,0,0,128,112Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,128,152Zm80-72H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" /></svg>
                      </span>
                      <span className="cid-raci-safe-h">Interactive Strategy Circles</span>
                    </summary>
                    <p className="cid-raci-safe-sub">Gated spaces for comparing signals, testing assumptions and shaping shared strategy.</p>
                  </details>
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
                        <td key={n} data-raci={v}>
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
              <div data-raci="R"><dt><span className="cid-raci-tile" aria-hidden="true">R</span>Responsible</dt>
                <dd>Completes the assigned task or deliverable.</dd></div>
              <div data-raci="A"><dt><span className="cid-raci-tile" aria-hidden="true">A</span>Accountable</dt>
                <dd>Final ownership and decision authority. Held exclusively by the Principal Investigator.</dd></div>
              <div data-raci="C"><dt><span className="cid-raci-tile" aria-hidden="true">C</span>Consulted</dt>
                <dd>Contributes before the work proceeds.</dd></div>
              <div data-raci="I"><dt><span className="cid-raci-tile" aria-hidden="true">I</span>Informed</dt>
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
                <p className="cid-viv-era-copy">Now you can palm it. Weighing less than one kilogram, CID contains a cutting-edge research facility. Miniaturized AI infrastructure secures our data on premises.</p>
              </div>
            </div>
          </div>

          {/* Information Ecosystem, then the Flicker card and the glossary. The
              three nametags that used to open this stretch now sit over the
              RACI chart, which is where their names are cited. */}
          <div className="cid-viv-ecosystem">
            {/* Two columns, per Greg, each with its own heading on the same
                line, so the block uses the width and each column keeps the house
                measure. Both headings and both paragraphs are his copy,
                verbatim. The SWOT line carries his emphasis as colour and
                weight: SWOT and Shot bold in the ruby accent, and the same
                accent on the S, W, O and T that open the four words, so the
                acronym is spelled out by its own capitals. The asterisk his
                draft left after "Shot" is read as a stray from the bold
                markup, not a footnote, since no footnote came with it. */}
            <div className="cid-viv-ecosystem-cols">
              <div>
                <h3 className="cid-viv-ecosystem-h">Information Ecosystem</h3>
                <p className="cid-viv-ecosystem-copy">CID integrates proprietary data, artificial intelligence (AI) and machine learning (ML) models, digital prototypes, dynamic workflows, and reusable skills into our adaptive research ecosystem.</p>
              </div>
              <div>
                <h3 className="cid-viv-ecosystem-h">Automated SWOT Analysis</h3>
                <p className="cid-viv-ecosystem-copy">
                  Each <strong className="cid-viv-swot">SWOT</strong> <strong className="cid-viv-swot">Shot</strong> highlights{" "}
                  <em><b className="cid-viv-swot">S</b>trengths, <b className="cid-viv-swot">W</b>eaknesses, <b className="cid-viv-swot">O</b>pportunities, and <b className="cid-viv-swot">T</b>hreats</em>{" "}
                  in a sector or region. The system balances transparency and public access with robust security and privacy protections.
                </p>
              </div>
            </div>

            {/* The Flicker card and, beside it, the offers card: Digital
                Products and Studio Services as pill rows, two columns wide,
                with the research signals (the inputs and tags glossary that
                used to fill this card) folded under them. Greg, 2026-09-19:
                the side column had become pill rows over pill rows, so the
                offers came down here and the signals gave up their space to
                a disclosure. The Flicker image drops into cid-viv-flicker-img;
                its copy stays to the label plus the one-line function. */}
            <div className="cid-viv-eco-row">
              <figure className="cid-viv-flicker">
                <div className="cid-viv-flicker-img" role="img" aria-label="The Flicker" />
                <figcaption className="cid-viv-flicker-cap">
                  <p className="cid-viv-flicker-name">CID Flicker</p>
                  <p className="cid-viv-flicker-desc">Controls access to the Vivarium. Our sole proprietor possesses CID Flicker at all times.</p>
                </figcaption>
              </figure>

              <aside className="cid-etym cid-viv-glossary" aria-label="Digital products, studio services, and research signals">
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

                {/* The signals fold. Closed at rest: the label is the summary,
                    the two glossary rows open under it. Native details, so it
                    works without script and the state is the browser's. */}
                <details className="cid-viv-signals">
                  <summary className="cid-viv-signals-sum">Research signals</summary>
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
                </details>
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


          {/* Working in two worlds: the same subject (Greg) through each agent's
              lens, one vertical screen with two settings. The heading carries
              the sitemap glyph Greg staged for it in Figma (his page of the
              same name). It is the outline "sitemap" icon from Jam Icons by
              Michael Amprimo, MIT, inlined from the jam-icons package rather
              than re-exported from Figma, so the path is the original.
              Decorative: the words carry the meaning, so it is hidden from
              assistive tech. Colour is currentColor, so it takes the
              heading's indigo and follows it if that ever changes. */}
          <div className="cid-viv-lens-wrap">
            <h3 className="cid-viv-ecosystem-h cid-viv-ecosystem-h--icon">
              <svg className="cid-viv-ecosystem-icon" viewBox="-2 -2 24 24" aria-hidden="true" focusable="false">
                <path d="M2 14v4h4v-4H2zm12-3H6a1 1 0 0 0-1 1h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a3 3 0 0 1 3-3h3V8H8a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1v1h3a3 3 0 0 1 3 3h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a1 1 0 0 0-1-1zM8 2v4h4V2H8zm6 12v4h4v-4h-4z" />
              </svg>
              Working in Two Worlds
            </h3>
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
