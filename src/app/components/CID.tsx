import { Link } from "react-router-dom";
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
  const LENS_V = 2;
  const V = `${base}assets/video/`;
  const cv = (name: string) => `${V}${name}?v=${LENS_V}`;
  const LENSES = [
    { key: "ethel",  device: "ⓔMage",   station: "ΩStation 7.83", glyph: "꩜", label: "Greg, as Ethel sees him",  still: `${base}assets/greg-ethel-field.webp?v=${LENS_V}`, clips: [cv("greg-ethel-lens.mp4"), cv("greg-ethel-emage1.mp4"), cv("greg-ethel-emage783.mp4")] },
    { key: "icarus", device: "Ⅲ Vision", station: "αLiveShow",     glyph: "🔺", label: "Greg, as Icarus sees him", still: `${V}greg-icarus-still.webp?v=${LENS_V}`,           clips: [cv("greg-icarus-lens.mp4"), cv("greg-icarus-wide.mp4")] },
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
          return (
            <div className={`cid-lens-cell cid-lens-cell--${l.key} ${on ? "is-active" : ""}`} key={l.key}>
              <button
                type="button"
                className="cid-lens-panel"
                aria-pressed={on}
                aria-label={on ? l.label : `Play ${l.label}`}
                onClick={() => pick(i)}
              >
                {on ? (
                  <video
                    key={clip}
                    className="cid-lens-video"
                    src={clip}
                    poster={l.still}
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => setClipIdx((x) => (x + 1) % l.clips.length)}
                  />
                ) : (
                  <div className="cid-lens-still" role="img" aria-label={l.label} style={{ backgroundImage: `url("${l.still}")` }} />
                )}
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
  const [pinned, setPinned] = useState<string | null>(null);
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
                      <dt>Trust and Transparency</dt>
                      <dd>Verify credentials and evaluate evidence. Machine-learning detection and automated controls help identify and exclude Material Non-Public Information (MNPI) from research and trading workflows.</dd>
                    </div>
                    <div className="cid-viv-priority">
                      <dt>Interoperability</dt>
                      <dd>Make Canadian content, services and materials discoverable across platforms and markets.</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Strategies: the three CID pillars, sitting below Leadership
                  and pushing the Viv display case down the page. The keys
                  reuse the homepage's .ood-key design (see StrategyKeys
                  above); the sheet is imported for those rules. */}
            </div>
            {/* Right column, one panel: the Radical Strategic Intelligence
                rail, then the etymology card beneath it. */}
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

          <section className="cid-strategy" aria-labelledby="cid-strategy-title">
            <h3 id="cid-strategy-title" className="cid-strategy-h">Micro-Studio. Massive Creative Capacity.</h3>
            <p className="cid-strategy-sub">Research reimagined</p>
            <StrategyKeys />
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
                src={`${base}DISPLAY_ROOM_BLUE_checker_cm.html?v=4`}
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
                <p className="cid-viv-era-copy">Now you can palm it.<br />Weighing less than one kilogram,<br />CID contains a cutting-edge research facility.</p>
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
                  <p className="cid-viv-flicker-desc">Controls access to the Vivarium at all times. Possessed by our sole proprietor at all times.</p>
                </figcaption>
              </figure>

              <aside className="cid-etym cid-viv-glossary" aria-label="Vivarium inputs and tags">
                <div className="cid-etym-row">
                  <p className="cid-etym-key">User inputs</p>
                  <ul className="cid-etym-list">
                    <li><span className="cid-etym-abbr">FO</span> · Field Observation directly recorded by a verified contributor</li>
                    <li><span className="cid-etym-abbr">RT</span> · Research Theory that tips off an investigation</li>
                    <li><span className="cid-etym-abbr">TS</span> · Trading Strategy proposed for analysis or controlled testing</li>
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
              <div className="cid-viv-tier" style={{ "--tier": "#17A398" } as CSSProperties}>
                <p className="cid-viv-tier-label">Public</p>
                <p className="cid-viv-tier-name">Open Access</p>
                <p className="cid-viv-tier-desc">Open research, tools, and resources for curious minds.</p>
              </div>
              <div className="cid-viv-tier" style={{ "--tier": "#B67A00" } as CSSProperties}>
                <p className="cid-viv-tier-label">Gated</p>
                <p className="cid-viv-tier-name">Community Partners</p>
                <p className="cid-viv-tier-desc">Protected spaces for creative partners and approved participants. Access controls support consent, age verification and privacy requirements.</p>
              </div>
              <div className="cid-viv-tier" style={{ "--tier": "#6C01F4" } as CSSProperties}>
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
              <div className="cid-viv-tier cid-viv-tier--dark" style={{ "--tier": "#822F00" } as CSSProperties}>
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

          <p className="cid-viv-disc">
            <strong>Ostara and the experimental Canadian Innovation Dimension (CID) do not provide future predictions or financial advice.</strong>
          </p>
        </div>
      </section>

      {/* Innovation Watchlist hero — self-contained DC block from
          public/Innovation Watchlist.dc.html (full-bleed, self-sizing iframe). */}
      {/* Portal drum roll: a quiet dark-galaxy band bridging the Vivarium and
          the Innovation Watchlist. A drum roll, not a splash. */}
      <section className="cid-portal-band" aria-label="CID prototype announcement">
        <p className="cid-portal-line">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v9" /><path d="M6.4 6.4a8 8 0 1 0 11.2 0" /></svg>
          <span>A PORTAL HAS OPENED: CID releases an electric debut prototype!</span>
        </p>
      </section>

      <section className="cid-wl-hero" aria-label="Innovation Watchlist">
        <iframe
          className="cid-wl-frame"
          src={`${base}Innovation%20Watchlist.dc.html?v=9`}
          title="Innovation Watchlist"
          loading="lazy"
        />
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
