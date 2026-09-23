import { Link } from "react-router-dom";
import { type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { PathwayModal } from "./PathwayModal";
import { OooDivisions } from "./OooDivisions";
import { WaterTanks } from "./WaterTanks";
import { ONTARIO_REGION_PATHS, ONTARIO_ZONES } from "./ontarioRegions";
import { CANADA_US_BORDER, CONTEXT_PATHS, GTA_CITIES, GTA_LABELS, GTA_VIEWBOX, ONTARIO_CONTEXT_VIEWBOX, ONTARIO_LABELS, SIMCOE_CENTRE, SIMCOE_PATH, USA_PATH } from "./ontarioContext";
import "../../styles/hero-top.css";

/* The workshop and Polymarket vote block ran to 2026-06-30 and 2026-07-31.
 * Off since 2026-09-14, per Greg, kept intact for the next run: flip this
 * to bring it back. */
const SHOW_VOTE_FEATURE = false;

const GATEWAY_LINE = "You have arrived at a gateway to digital engagement!";
const WELCOME_LINE = "Welcome to our vibrant innovation ecosystem!";
const PLACE_LINE = ["Ontario", "Provincial Map", "Economic Regions"];
const BELL_LABELS = ["Ring the bell", "Ring the bell again", "Ring the bell again", "Ring the bell to clear the messages"];
const BELL_SWING_MS = 620;
/* the momentary press on the globe, and how long the wordmark takes to pop
   out of the circle and fade */
const PRESS_MS = 420;
const POP_MS = 1700;
const LEAF_MS = 1400;

/* Soft two-partial "ding" synthesised in WebAudio (no external audio assets).
   `pitch` scales both partials: 1 is the bell's ding, 1.5 (a fifth up) is the
   higher ping that answers the press-in on the second ring. */
function ding(pitch = 1) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.07, t + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    master.connect(ctx.destination);
    [[1568, 1], [2349, 0.35]].forEach(([freq, level]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * pitch;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 1.5);
    });
    window.setTimeout(() => { void ctx.close(); }, 1700);
  } catch {
    /* audio is a garnish; stay silent if the browser refuses */
  }
}

const PALETTE = ['#f0c040','#00d4aa','#ff4444','#00e676','#6C01F4','#4488ff'];

function OstaraParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let W = 0, H = 0;
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let particles: Particle[] = [];

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      W = canvas!.width  = rect.width;
      H = canvas!.height = rect.height;
    }
    function init() {
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.5,
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
    }
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(108,1,244,${(1 - d / 120) * 0.14})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx!.fillStyle = a.c + '99';
        ctx!.fill();
      }
    }
    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas.parentElement!);
    resize(); init(); draw();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="ostara-particle-canvas" aria-hidden="true" />;
}

export function Home({ onSupport }: { onSupport: () => void }) {
  const [pathwayOpen, setPathwayOpen] = useState(false);
  const [rings, setRings] = useState(0);
  const [ringing, setRinging] = useState(false);
  /* ring two: the globe dips for a beat and the wordmark pops out */
  const [pressing, setPressing] = useState(false);
  const [popping, setPopping] = useState(false);
  /* ring three: the maple leaf pops out as the pin is pressed */
  const [leafing, setLeafing] = useState(false);
  /* where the wordmark flies: from the bell's centre, through the Ooo!
     wordmark in the top bar, and off the top of the screen. Measured when
     ring two fires so it holds at any viewport size. */
  const [popVec, setPopVec] = useState<{ dx: number; dy: number }>({ dx: 0, dy: -600 });
  const bellRef = useRef<HTMLButtonElement>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [hotZone, setHotZone] = useState<string | null>(null);
  /* the map at two scales: the whole province on its water, or the western
     end of Lake Ontario with the GTA facing Niagara Falls and the American
     shore */
  const [mapView, setMapView] = useState<"ontario" | "gta">("ontario");
  /* where the viewbook sits once the visitor has dragged it; null means the
     default spot (centred near the top of the viewport) */
  const [bookPos, setBookPos] = useState<{ x: number; y: number } | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const placeRef = useRef<HTMLButtonElement>(null);
  const grip = useRef<{ dx: number; dy: number } | null>(null);
  const swingTimer = useRef<number | undefined>(undefined);
  const pressTimer = useRef<number | undefined>(undefined);
  const popTimer = useRef<number | undefined>(undefined);
  const leafTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => {
    window.clearTimeout(swingTimer.current);
    window.clearTimeout(pressTimer.current);
    window.clearTimeout(popTimer.current);
    window.clearTimeout(leafTimer.current);
  }, []);
  /* Escape closes the viewbook; focus lands on it when it opens and returns
     to the location stack when it closes */
  useEffect(() => {
    if (!mapOpen) return;
    bookRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMapOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      placeRef.current?.focus({ preventScroll: true });
    };
  }, [mapOpen]);
  /* drag by the title bar: pointer events so mouse, pen and touch all work;
     the panel is kept at least partly on screen */
  const onGrab = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const el = bookRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    grip.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    setBookPos({ x: r.left, y: r.top });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = grip.current, el = bookRef.current;
    if (!g || !el) return;
    const w = el.offsetWidth;
    const x = Math.min(Math.max(e.clientX - g.dx, 140 - w), window.innerWidth - 140);
    const y = Math.min(Math.max(e.clientY - g.dy, 8), window.innerHeight - 60);
    setBookPos({ x, y });
  };
  const onRelease = (e: ReactPointerEvent<HTMLDivElement>) => {
    grip.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const hot = ONTARIO_ZONES.find((z) => z.id === hotZone) ?? null;
  const zoneClass = (id: string) => (hotZone === id ? " is-hot" : hotZone ? " is-dim" : "");
  const ring = () => {
    if (ringing || popping || leafing) return;
    if (rings === 0) {
      /* first ring: the bell dingles for a beat, then the face flips to the
         globe and the gateway line pops */
      ding();
      setRinging(true);
      swingTimer.current = window.setTimeout(() => {
        setRinging(false);
        setRings(1);
      }, BELL_SWING_MS);
    } else if (rings === 1) {
      /* second ring: the globe presses in with a higher ping, the wordmark
         pops out of the circle and fades while the welcome line appears
         beside the orb, and the face finishes as the location pin */
      ding(1.5);
      const bell = bellRef.current?.getBoundingClientRect();
      const mark = document.querySelector(".nav-brand-mark")?.getBoundingClientRect();
      if (bell) {
        const cx = bell.left + bell.width / 2, cy = bell.top + bell.height / 2;
        const tx = mark ? mark.left + mark.width / 2 : cx;
        const ty = mark ? mark.top + mark.height / 2 : 0;
        /* aim through the wordmark and keep going until well above the top edge */
        const endY = -160;
        const k = ty < cy ? (endY - cy) / (ty - cy) : 1;
        setPopVec({ dx: (tx - cx) * k, dy: endY - cy });
      }
      setPressing(true);
      setPopping(true);
      setRings(2);
      pressTimer.current = window.setTimeout(() => setPressing(false), PRESS_MS);
      popTimer.current = window.setTimeout(() => setPopping(false), POP_MS);
    } else if (rings === 2) {
      /* third ring: the pin presses in and stays in, a red maple leaf pops
         out of the circle and fades, and the location details light up
         under the sign */
      ding(1.8);
      setLeafing(true);
      setRings(3);
      leafTimer.current = window.setTimeout(() => setLeafing(false), LEAF_MS);
    } else {
      ding();
      setRings(0);
      setMapOpen(false);
      setHotZone(null);
    }
  };
  /* the face: bell at rest, the globe after ring one, the pin from the end
     of ring two on (the globe stays while the wordmark is still popping) */
  const face = rings === 0 ? "bell" : rings === 1 || popping ? "globe" : "pin";
  return (
    <>
      <section className="ooos-top" aria-label="Welcome">
        <div className="ot-content">
          <div className="ot-trio">
            {/* Ding bell: neumorphic control wearing the welcome pill's purple
                border + glow. Ring 1 wiggles the bell, then pops the gateway
                bubble out of the orb's left side and flips the face to the
                globe. Ring 2 presses the globe in: the Ooo! wordmark pops out
                of the circle and fades, the welcome bubble pops out of the
                orb's right side, and the face finishes as the location pin.
                Ring 3 presses the pin in and stays in, lighting the location
                details under the Toronto sign. Ring 4 clears all. */}
            <div className="ot-trio__side ot-trio__left">
              <button
                ref={bellRef}
                type="button"
                className={`ot-bell${rings > 0 ? " active" : ""}${rings === 3 || pressing ? " pressed" : ""}${ringing ? " ringing" : ""}`}
                aria-label={BELL_LABELS[rings]}
                aria-controls="ot-bubbles"
                onClick={ring}
              >
                {/* the face flips with each ring: bell, then the Electric
                    global-network globe from the testimonials, then the
                    location pin (a hint that the last message is a place) */}
                {face === "bell" && (
                  <svg key="bell" className="ot-bell__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.6 2H4.9z" />
                    <path d="M10 20.5a2 2 0 0 0 4 0" />
                    <path d="M12 3v2.5" />
                  </svg>
                )}
                {face === "globe" && (
                  <img
                    key="globe"
                    className="ot-bell__icon ot-bell__icon--globe"
                    src="/assets/Ooo-Global-Network-Electric.png?v=2"
                    alt=""
                    aria-hidden="true"
                  />
                )}
                {face === "pin" && (
                  <svg key="pin" className="ot-bell__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                )}
                {/* the wordmark, popping out of the circle on ring two */}
                {popping && (
                  <img
                    className="ot-bell__pop"
                    src="/assets/brand/ooo-wordmark-portal-transparent.png"
                    alt=""
                    aria-hidden="true"
                    style={{ "--pop-dx": `${popVec.dx}px`, "--pop-dy": `${popVec.dy}px` } as CSSProperties}
                  />
                )}
                {/* the maple leaf, popping out of the circle on ring three.
                    Font Awesome Free 6 brands "canadian-maple-leaf", inlined
                    (icons CC BY 4.0, fontawesome.com) so the site does not
                    load the whole icon library for one glyph. */}
                {leafing && (
                  <svg className="ot-bell__pop ot-bell__pop--leaf" viewBox="0 0 512 512" aria-hidden="true">
                    <path d="M383.8 351.7c2.5-2.5 105.2-92.4 105.2-92.4l-17.5-7.5c-10-4.9-7.4-11.5-5-17.4 2.4-7.6 20.1-67.3 20.1-67.3s-47.7 10-57.7 12.5c-7.5 2.4-10-2.5-12.5-7.5s-15-32.4-15-32.4-52.6 59.9-55.1 62.3c-10 7.5-20.1 0-17.6-10 0-10 27.6-129.6 27.6-129.6s-30.1 17.4-40.1 22.4c-7.5 5-12.6 5-17.6-5C293.5 72.3 255.9 0 255.9 0s-37.5 72.3-42.5 79.8c-5 10-10 10-17.6 5-10-5-40.1-22.4-40.1-22.4S183.3 182 183.3 192c2.5 10-7.5 17.5-17.6 10-2.5-2.5-55.1-62.3-55.1-62.3S98.1 167 95.6 172s-5 9.9-12.5 7.5C73 177 25.4 167 25.4 167s17.6 59.7 20.1 67.3c2.4 6 5 12.5-5 17.4L23 259.3s102.6 89.9 105.2 92.4c5.1 5 10 7.5 5.1 22.5-5.1 15-10.1 35.1-10.1 35.1s95.2-20.1 105.3-22.6c8.7-.9 18.3 2.5 18.3 12.5S241 512 241 512h30s-5.8-102.7-5.8-112.8 9.5-13.4 18.4-12.5c10 2.5 105.2 22.6 105.2 22.6s-5-20.1-10-35.1 0-17.5 5-22.5z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="ot-trio__orb">
              <img
                className="ot-logo"
                src={`${import.meta.env.BASE_URL}assets/Final%20Logo%20-%20Ooo%20-%20Light%20Blue%20Background.png`}
                alt="Ooo Digital Media Studio"
                width="300"
                height="300"
              />
              <div id="ot-bubbles" className="ot-bubbles" aria-live="polite">
                {rings >= 1 && (
                  <div className="ot-bubble-group ot-bubble-group--left">
                    <p className="ot-bubble">{GATEWAY_LINE}</p>
                  </div>
                )}
                {rings >= 2 && (
                  <div className="ot-bubble-group ot-bubble-group--right">
                    <p className="ot-bubble">{WELCOME_LINE}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="ot-trio__side ot-trio__right">
              <div className="ot-sign" role="img" aria-label="Toronto, Canada" />
              {/* location stack under the sign: the pinned province on top,
                  the two sub-points (circle, map; caret, regions) smaller
                  beneath, all centred on the sign. Lights on the third ring
                  and opens the map viewbook; the caret turns to point down
                  while the viewbook is open. */}
              {rings >= 3 && (
                <button
                  ref={placeRef}
                  type="button"
                  className="ot-place"
                  aria-expanded={mapOpen}
                  aria-controls="ot-viewbook"
                  onClick={() => setMapOpen((o) => !o)}
                >
                  <span className="ot-place__row">
                    <svg className="ot-place__pin" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{PLACE_LINE[0]}</span>
                  </span>
                  <span className="ot-place__row ot-place__row--sub">
                    <svg className="ot-place__glyph" viewBox="0 0 12 12" aria-hidden="true">
                      <circle cx="6" cy="6" r="4.25" />
                    </svg>
                    <span>{PLACE_LINE[1]}</span>
                    <svg className="ot-place__glyph ot-place__caret" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M6 1.5 11 10.5H1z" />
                    </svg>
                    <span>{PLACE_LINE[2]}</span>
                  </span>
                </button>
              )}
            </div>
          </div>
          {/* Division emblems: one card per division under the orb, in place
              of the studio blurb that used to sit here. The CID seal and the
              RA sigil are the uploaded brand art and the MIC emcee is the studio's
              own, all as web-sized copies of the PNGs in public/assets/brand. Names
              are the divisions' names as OooDivisions sets them. */}
          <ul className="ot-divs" aria-label="Divisions">
            <li className="ot-div">
              <img
                className="ot-div__art"
                src={`${import.meta.env.BASE_URL}assets/brand/mic-emcee-640.webp`}
                alt=""
                width="640"
                height="640"
                loading="lazy"
              />
              <p className="ot-div__name">Media, Information and Culture (MIC)</p>
            </li>
            <li className="ot-div">
              <img
                className="ot-div__art"
                src={`${import.meta.env.BASE_URL}assets/brand/cid-seal-640.webp`}
                alt=""
                width="640"
                height="640"
                loading="lazy"
              />
              <p className="ot-div__name">Canadian Innovation Dimension (CID)</p>
            </li>
            <li className="ot-div">
              <img
                className="ot-div__art"
                src={`${import.meta.env.BASE_URL}assets/brand/ra-sigil-640.webp`}
                alt=""
                width="640"
                height="640"
                loading="lazy"
              />
              <p className="ot-div__name">The Reclaiming Agency</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Viewbook: the provincial map (five zones, eleven economic regions,
          no statistics) floats over the page in a medium panel the visitor
          can drag by its title bar and close with the X. Nothing on the page
          moves underneath it. Hovering a zone on the map or in the list
          lights it in both places. */}
      {mapOpen && (
        <div
          ref={bookRef}
          id="ot-viewbook"
          className={`ot-viewbook${bookPos ? " placed" : ""}`}
          role="dialog"
          aria-labelledby="ot-viewbook-title"
          tabIndex={-1}
          style={bookPos ? { left: bookPos.x, top: bookPos.y } : undefined}
        >
          <div
            className="ot-viewbook__bar"
            onPointerDown={onGrab}
            onPointerMove={onDrag}
            onPointerUp={onRelease}
            onPointerCancel={onRelease}
          >
            <p id="ot-viewbook-title" className="ot-viewbook__title">
              <svg className="ot-place__pin" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{PLACE_LINE[0]}</span>
              <svg className="ot-place__glyph" viewBox="0 0 12 12" aria-hidden="true">
                <circle cx="6" cy="6" r="4.25" />
              </svg>
              <span>{PLACE_LINE[1]}</span>
            </p>
            <span className="ot-viewbook__chip">11 Sub-Regions</span>
            <button type="button" className="ot-viewbook__close" aria-label="Close" onClick={() => setMapOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="ot-viewbook__body" onMouseLeave={() => setHotZone(null)}>
            <div className="ot-viewbook__map">
              <svg
                className={`ot-map ot-map--${mapView}`}
                viewBox={mapView === "gta" ? GTA_VIEWBOX : ONTARIO_CONTEXT_VIEWBOX}
                role="img"
                aria-label={mapView === "gta"
                  ? "The Greater Toronto Area on the western shore of Lake Ontario, across the water from Niagara Falls and the United States"
                  : "Ontario provincial map on its water: five geographic zones and eleven economic regions, with the Great Lakes, Hudson Bay and the neighbouring shores"}
              >
                {/* water underneath everything, then the neighbouring land,
                    the United States on its own tint, the lakes, and the
                    international boundary through them, so the province
                    sits on its water with its neighbour held inside the
                    legal border */}
                <defs>
                  {/* the basemap carries its lakes as holes in the land, so
                      the United States (whose source polygon counts lakes
                      as land) is clipped to that land shape and never paints
                      over water */}
                  <clipPath id="ot-map-land-clip">
                    <path d={CONTEXT_PATHS[mapView].land} />
                  </clipPath>
                  <marker id="ot-map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M0 0L10 5L0 10z" className="ot-map__peek-head" />
                  </marker>
                </defs>
                <rect className="ot-map__water" x="-1000" y="-1000" width="4000" height="4000" />
                <path className="ot-map__land" d={CONTEXT_PATHS[mapView].land} />
                <path className="ot-map__usa" d={USA_PATH} clipPath="url(#ot-map-land-clip)" />
                <path className="ot-map__lake" d={CONTEXT_PATHS[mapView].lakes} />
                <path className="ot-map__border" d={CANADA_US_BORDER} />
                {ONTARIO_ZONES.map((z) => (
                  <g
                    key={z.id}
                    className={`ot-map__zone${zoneClass(z.id)}`}
                    style={{ "--zone": z.colour } as CSSProperties}
                    onMouseEnter={() => setHotZone(z.id)}
                  >
                    <title>{z.name}</title>
                    {z.regions.map((r) => (
                      <path key={r.id} d={ONTARIO_REGION_PATHS[r.id]} />
                    ))}
                  </g>
                ))}
                {(mapView === "gta" ? GTA_LABELS : ONTARIO_LABELS).map((t) => (
                  <text
                    key={t.name}
                    className={`ot-map__label ot-map__label--${t.kind ?? "land"}`}
                    x={t.x}
                    y={t.y}
                    style={t.size ? { fontSize: t.size } : undefined}
                    transform={t.rotate ? `rotate(${t.rotate} ${t.x} ${t.y})` : undefined}
                  >
                    {t.name}
                  </text>
                ))}
                {mapView === "gta" && GTA_CITIES.map((c) => (
                  <g key={c.name} className="ot-map__city">
                    <circle cx={c.x} cy={c.y} r="1.6" />
                    <text x={c.x + 2.8} y={c.y + 1.2}>{c.name}</text>
                  </g>
                ))}
                {/* Lake Simcoe: hover or focus the lake and its name appears
                    up and to the left, with a leader arrow to the centre */}
                {mapView === "gta" && (
                  <g className="ot-map__peek">
                    <path className="ot-map__peek-hit" d={SIMCOE_PATH} tabIndex={0} role="img" aria-label="Lake Simcoe" />
                    <g className="ot-map__peek-tag" aria-hidden="true">
                      <line
                        className="ot-map__peek-line"
                        x1={SIMCOE_CENTRE.x - 11}
                        y1={SIMCOE_CENTRE.y - 17}
                        x2={SIMCOE_CENTRE.x}
                        y2={SIMCOE_CENTRE.y}
                        markerEnd="url(#ot-map-arrow)"
                      />
                      <text className="ot-map__label ot-map__label--water" x={SIMCOE_CENTRE.x - 10} y={SIMCOE_CENTRE.y - 19} textAnchor="end">Lake Simcoe</text>
                    </g>
                  </g>
                )}
              </svg>
              <p className="ot-map__caption" aria-live="polite">{hot ? hot.name : PLACE_LINE[0]}</p>
              <div className="ot-map__views" role="group" aria-label="Map scale">
                {([["ontario", "Ontario"], ["gta", "Greater Toronto Area"]] as const).map(([v, label]) => (
                  <button key={v} type="button" className="ot-map__view" aria-pressed={mapView === v} onClick={() => setMapView(v)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="ot-viewbook__list">
              <p className="ot-viewbook__eyebrow">{PLACE_LINE[2]}</p>
              <ul className="ot-zones">
                {ONTARIO_ZONES.map((z) => (
                  <li
                    key={z.id}
                    className={`ot-zone${z.municipalities ? " ot-zone--wide" : ""}${zoneClass(z.id)}`}
                    style={{ "--zone": z.colour } as CSSProperties}
                    onMouseEnter={() => setHotZone(z.id)}
                  >
                    <h3 className="ot-zone__name">
                      {z.short}
                      <small>{z.name}</small>
                    </h3>
                    <ul className="ot-zone__regions">
                      {z.regions.map((r) => <li key={r.id}>{r.name}</li>)}
                    </ul>
                    {z.municipalities && (
                      /* Every town and city by name, grouped by its region, so
                         the zone reads as the whole area rather than one city
                         and each place is plain, searchable text. */
                      <ul className="ot-zone__places" aria-label={`${z.name} municipalities`}>
                        {z.municipalities.map((g) => (
                          <li key={g.group}>
                            <span className="ot-zone__group">{g.group}</span>
                            <span className="ot-zone__names">{g.places.join(", ")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <p className="ot-viewbook__source">Source: Statistics Canada</p>
            </div>
          </div>
        </div>
      )}

      <OooDivisions />

      {/* JellyBean Journeys — full-bleed immersive data-viz hero, served as a
          self-contained experience from public/jellybean-journeys/ */}
      <section className="jbj-hero" aria-label="JellyBean Journeys — Immersive Data Visualization">
        <iframe
          className="jbj-frame"
          src={`${import.meta.env.BASE_URL}jellybean-journeys/index.html?v=22`}
          title="JellyBean Journeys — Immersive Data Visualization"
          loading="lazy"
          allowFullScreen
        />
      </section>

      <section className="section section-tinted section--featured">
        <div className="section-header">
          <div className="section-eyebrow">★ Featured Experiences</div>
        </div>

        <div className="hero-cta">
          <Link to="/ostara" className="btn-ostara">Ostara: Collective Intelligence System</Link>
          <Link to="/exhibition" className="btn-exhibition">Canadian Interactive Exhibition</Link>
        </div>

        <div className="featured">
          <Link to="/ostara" className="feature-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-thumb ostara ostara-brand ostara-brand--image">
              <OstaraParticleCanvas />
              <img
                className="ostara-brand-image"
                src={`${import.meta.env.BASE_URL}assets/images/ostara-login.png`}
                alt="Ostara: Collective Intelligence System login screen with solar sphere"
                loading="lazy"
              />
            </div>
            <div className="ostara-pill-bar">
              <span className="ostara-descriptor">Aggregates signals</span>
              <span className="ostara-descriptor">Routes intent</span>
              <span className="ostara-descriptor">Orchestrates agents</span>
              <span className="ostara-descriptor">Channels strategic foresight</span>
            </div>
            <div className="feature-body">
              <p>
                A locally hosted, AI-assisted decision-support environment for
                reasoning under uncertainty. Workshop interface, Python signal
                pipeline, agent-role-separated architecture.
              </p>
              <div className="feature-meta">
                <span className="chip">DG8010</span>
                <span className="chip teal">Research</span>
                <span className="chip">Privacy by design</span>
              </div>
              <span className="feature-link">Open case study →</span>
            </div>
          </Link>

          <Link to="/exhibition" className="feature-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-thumb exh-thumb exh-thumb--image">
              <img
                className="feature-thumb-image"
                src={`${import.meta.env.BASE_URL}assets/images/portals-open-live.png`}
                alt="Non-profit portals are now open"
                loading="lazy"
              />
            </div>
            <div className="exh-pill-bar">
              <span className="exh-descriptor exh-descriptor--cie exh-descriptor--cie-full">
                <span className="cie-prefix">
                  <span className="cie-prefix-hyphen">State-of-the-Art</span>{' '}
                  <span className="cie-prefix-show">Show:</span>
                </span>{' '}
                <span className="cie-name">Canadian Interactive Exhibition</span>
              </span>
              <span className="exh-label"><span className="exh-label-main">Immersive</span><span className="exh-label-sub">experiences</span></span>
              <span className="exh-descriptor exh-descriptor--ruby exh-descriptor--poppins">WANTED: 20 Digital Art Influencers</span>
            </div>
            <div className="feature-body">
              <p>
                A public canvas for interactive artwork, non-profit campaigns,
                and fan-supported experiences. Gateway portals connect visitors
                to independent artist-created worlds.
              </p>
              <div className="feature-meta">
                <span className="chip">Exhibition</span>
                <span className="chip teal">Public canvas</span>
                <span className="chip">Artist portals</span>
              </div>
              <span className="feature-link">Open case study →</span>
            </div>
          </Link>
        </div>
      </section>

      {SHOW_VOTE_FEATURE && (
      <section className="section vote-feature">
        <div className="vote-top-row">
          <div className="vote-guide-box">
            <div className="vote-guide-eyebrow">
              <span className="vote-guide-star">&#9733;</span>
              <span className="vote-guide-title"> Choosing Our Digital Destiny</span>
              <span className="vote-guide-access"> &bull; Workshop</span>
            </div>
            <p className="vote-guide-access-line">&bull; Exclusive access for 200 innovators and visionary thinkers</p>
            <p className="vote-guide-body">
              Explore the digital economy, exchange perspectives on AI, and examine opportunities for funding innovation.
            </p>
          </div>

          <a
            className="vote-qr-card"
            href="https://kahoot.it/challenge/03428365"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="vote-qr-card__text">
              <p className="vote-qr-card__headline">Join our Kahoot workshop to exchange insights and have fun!</p>
              <ul className="vote-qr-card__bullets">
                <li>Asynchronous interaction anytime until our session closes on July 31, 2026</li>
                <li>A collective exploration lasting 31 days</li>
              </ul>
            </div>
            <img
              className="vote-qr-card__qr"
              src={`${import.meta.env.BASE_URL}assets/Ooo%20Kahoot%20QR.png`}
              alt="Scan QR code to join Kahoot"
            />
          </a>
        </div>
        <div className="vote-stage">
          <div className="vote-source-label">
            POLYMARKET · <span className="vote-volume">$29.05M LIVE VOLUME</span> · EXPIRES 2026-06-30
          </div>
          <div className="vote-question-text">
            Will the US and Iran reach<br />a permanent peace deal by June 30?
          </div>
          <div className="vote-cards-row">
            <div className="big-vote-card yes-card">
              <div className="bvc-label">YES</div>
              <div className="bvc-price">18¢</div>
            </div>
            <div className="big-vote-card no-card">
              <div className="bvc-label">NO</div>
              <div className="bvc-price">82¢</div>
            </div>
            <div className="big-vote-card abstain-card">
              <div className="bvc-label">ABSTAIN</div>
            </div>
          </div>
          <a
            className="vote-cta-btn"
            href="https://kahoot.it/challenge/03428365"
            target="_blank"
            rel="noopener noreferrer"
          >
            VOTE ON KAHOOT →
          </a>
        </div>
      </section>
      )}

      <section className="section section-light">
        <div className="section-header">
          <div className="section-eyebrow">Creative Offerings</div>
        </div>
        <div className="dual">
          <div className="pane">
            <div className="pane-wordmark">
              <h3>Digital Products</h3>
              <span className="pane-wordmark__ooo" tabIndex={0} aria-label="Ooo!"><span className="xk" data-i="0">O</span><span className="xk" data-i="1">o</span><span className="xk" data-i="2">o</span><span className="xk pane-wordmark__bang" data-i="3">!</span></span>
            </div>
            <p className="pane-lead">Our downloadable creative resources fuse research insights with guided market strategies. You can launch today and learn from every campaign.</p>
            <div className="service-chips service-chips--stack">
              <div className="service-chip">
                <strong>Interactive Digital Media</strong>
                <ul className="service-chip__list">
                  <li>Brand templates and sales-cycle systems</li>
                  <li>Workshop kits for live engagement</li>
                </ul>
              </div>
              <div className="service-chip">
                <strong>Intelligent Communication</strong>
                <ul className="service-chip__list service-chip__list--grid">
                  <li>Chatbot subscriptions</li>
                  <li>Marketing automation campaigns</li>
                  <li>Culturally aware localization</li>
                  <li>AI-executed audience targeting</li>
                </ul>
              </div>
              <div className="service-chip">
                <strong>Trustworthy-AI Governance</strong>
                <ul className="service-chip__list">
                  <li>Guiding new roles for AI adoption</li>
                  <li>Safety plans for human-AI cooperation</li>
                </ul>
              </div>
            </div>
            <div className="studio-testimonial">
              <p className="studio-testimonial__quote">&ldquo;Your report was very helpful. I have already applied some of the strategies to expand our community network and add practical value to our marketplace.&rdquo;</p>
              <div className="studio-testimonial__meta">
                <img src="/assets/NORWAY-flag-ooo.png" alt="Norway" height="14" style={{borderRadius:'2px',flexShrink:0,display:'block'}} />
                <span className="studio-testimonial__role">Founder &amp; CEO <img src="/assets/Ooo-Global-Network-Electric.png?v=2" alt="" className="studio-testimonial__globe" /> Norway</span>
              </div>
            </div>
            <div className="shop-ad" role="complementary" aria-label="Ooo Media Shop">
              <img src="/assets/Ooo.Media-Shop-Trans.png" alt="" className="shop-ad__art" />
              <div className="shop-ad__body">
                <div className="shop-ad__eyebrow">Ooo Media Shop <span className="shop-ad__status">&middot; Open Soon!</span></div>
                <p className="shop-ad__text">Shop digital assets on demand.</p>
              </div>
            </div>
          </div>
          <div className="pane">
            <div className="pane-wordmark">
              <h3>Studio Services</h3>
              <span className="pane-wordmark__ahh" tabIndex={0} aria-label="Ahhhh"><span className="xk" data-i="0">A</span><span className="xk" data-i="1">h</span><span className="xk" data-i="2">h</span><span className="xk" data-i="3">h</span><span className="xk" data-i="4">h</span></span>
            </div>
            <p className="pane-lead">When research, strategy, and execution work in harmony, you can see the whole picture clearly: <strong><em>Ahhh. Deeper understanding drives success.</em></strong></p>
            <div className="service-chips">
              <div className="service-chip">
                <strong>Digital Strategy</strong>
                <span>Direction + Execution</span>
              </div>
              <div className="service-chip">
                <strong>Advertising</strong>
                <span>SEO + PPC + Adwords</span>
              </div>
              <div className="service-chip">
                <strong>Data Visualization</strong>
                <span>3D &middot; Immersive &middot; Interactive</span>
              </div>
              <div className="service-chip">
                <strong>Internationalization</strong>
                <span>Global Digital Engagement</span>
              </div>
            </div>
            <div className="studio-testimonial">
              <p className="studio-testimonial__eyebrow">One creative contact. No reset cycle.</p>
              <p className="studio-testimonial__quote">&ldquo;The problem with external SEO agencies is the turnover. Every six months, there&rsquo;s a new key contact to bring up to speed.&rdquo;</p>
              <div className="studio-testimonial__meta">
                <img src="/assets/CANADA-Flag-Drop.png" alt="Canada" height="14" style={{borderRadius:'2px',flexShrink:0,display:'block'}} />
                <span className="studio-testimonial__role">CEO <img src="/assets/Ooo-Global-Network-Electric.png?v=2" alt="" className="studio-testimonial__globe" /> Canada</span>
              </div>
              <p className="studio-testimonial__pitch">
                <span className="studio-pitch-dot studio-pitch-dot--problem" aria-hidden="true"></span>
                <span>Outsourcing SEO and PPC is prone to high turnover, which leads to repeated onboarding and slows progress.</span>
              </p>
              <p className="studio-testimonial__pitch">
                <span className="studio-pitch-dot studio-pitch-dot--solution" aria-hidden="true"></span>
                <span><strong>Ooo Digital Media Studio</strong> provides a consistent creative lead, so your team can build on every success, strengthen internal digital capacity, and drive measurable business growth.</span>
              </p>
            </div>
            <div className="studio-ad" role="complementary" aria-label="Limited studio spaces">
              <div className="studio-ad__body">
                <div className="studio-ad__eyebrow">Studio Services · 2026–2027</div>
                <p className="studio-ad__text">
                  Collaboration spaces are opening for teams seeking research-led creative and digital strategy.
                </p>
                <button
                  type="button"
                  className="studio-ad__cta"
                  onClick={() => setPathwayOpen(true)}
                >
                  Open the pathway with a conversation →
                </button>
              </div>
              <img src="/assets/Ooo-Target.png" alt="" className="studio-ad__art" />
            </div>
          </div>
        </div>
      </section>

      <section className="section support" id="find-your-path">
        <div className="section-header">
          <div className="section-eyebrow support-eyebrow">Find Your Path</div>
          <h2>Ooo offers various ways to engage!</h2>
          <p className="lead">
            Explore free resources, access premium assets, receive project
            support, or work together on collaborative studio ventures.
          </p>
        </div>

        <div className="path-tank">
          <WaterTanks />
        </div>

        <div className="path-feature">
          <div className="path-feature__title-band">
            <span className="path-feature__title-band-eyebrow">Featured project: CIX</span>
            <span className="path-feature__title-band-name">CANADIAN INTERACTIVE EXHIBITION</span>
          </div>
          <div className="path-feature__grid">
            <div className="path-feature__narrative">
              <p className="path-feature__body path-feature__body--wide">
                Canadian nonprofits share real-world challenges and community insights, matching with digital artists to design virtual experiences that bring these diverse narratives to life. Collaborating from ideation to execution, our teams develop interactive experiences that engage the public, build understanding and foster dialogue about solutions.
              </p>
            </div>
            <div className="pool-board" role="group" aria-label="Project funding pools">
              <PoolWidget
                label="Pool 1 · Launch"
                goal={10000}
                raised={7}
                unlocks="Help us hit this funding goal to launch an experimental event with seven nonprofit partners! Ten digital art influencers will test our vision for meaningful virtual engagement by creating interactive experiences that the public can explore for free."
                cta="Join our mission"
                onSupport={onSupport}
              />
              <PoolWidget
                label="Pool 2 · National"
                goal={25000}
                raised={7}
                unlocks="Let’s elevate our exhibition! Rally behind our national grant proposal today. Your donation will help bring diverse stories and serious issues into a shared public space. Plus, you can enjoy perks like personalizing your signature on the donor wall in the virtual exhibition."
                revealLabel="Peek behind the national stage"
                reveal={<>
                  <p>With a transparent pool of public support, Ooo Digital Media Studio will apply to the Canada Council for the Arts as the project's Creative Director in pursuit of Sector Support, Innovation and Development funding to help expand the exhibition nationally.</p>
                  <p>Supporters can add their names to a digital donor wall in the national exhibition gallery, recognizing the innovators and visionaries who saw the potential for cross-sector collaboration before the experience opened to the public for free.</p>
                </>}
                cta="Support the exhibition!"
                onSupport={onSupport}
              />
            </div>
          </div>
        </div>

        <div className="path-links">
          <span className="path-links__label">Other project links</span>
          <Link to="/ostara" className="path-links__link">Ostara: Collective Intelligence System</Link>
          <Link to="/mic" className="path-links__link">Media, Information and Culture (MIC): Twelve Signs</Link>
          <Link to="/cid" className="path-links__link">Canadian Innovation Dimension (CID)</Link>
        </div>

        <p className="support-disclosure">
          No payments are processed yet. Stripe (CAD) and Bitcoin integrations
          are coming. The Ooo token is in concept stage only. No token has
          been issued. Nothing here is a solicitation or financial advice.
        </p>
      </section>
      {pathwayOpen && <PathwayModal onClose={() => setPathwayOpen(false)} />}
    </>
  );
}

function PoolWidget({
  label,
  goal,
  raised,
  unlocks,
  cta,
  onSupport,
  reveal,
  revealLabel,
}: {
  label: string;
  goal: number;
  raised: number;
  unlocks: string;
  cta: string;
  onSupport: () => void;
  reveal?: ReactNode;
  revealLabel?: string;
}) {
  const targetPct = Math.max(0, Math.min(100, (raised / goal) * 100));
  const [pct, setPct] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPct(targetPct);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPct(targetPct);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [targetPct]);

  const fmt = (n: number) =>
    n.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  const pctLabel = Math.round(pct);

  return (
    <div ref={ref} className="pool-widget">
      <div className="pool-widget__head">
        <span className="pool-widget__label">{label}</span>
        <span className="pool-widget__chip" aria-label="Pool currently open">
          Open
        </span>
      </div>
      <div className="pool-widget__amounts">
        <span className="pool-widget__goal">{fmt(goal)} <span className="pool-widget__currency">CAD</span></span>
        <span className="pool-widget__raised">{fmt(raised)} raised so far</span>
      </div>
      <div
        className="pool-widget__bar"
        role="progressbar"
        aria-label={`${label} progress`}
        aria-valuenow={Math.round(targetPct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="pool-widget__fill"
          style={{ width: `${pct}%` }}
        />
        <span className="pool-widget__pct">{pctLabel}%</span>
      </div>
      <PoolUnlocks unlocks={unlocks} reveal={reveal} revealLabel={revealLabel} />
      <button
        type="button"
        className="pool-widget__cta"
        onClick={onSupport}
      >
        {cta} →
      </button>
    </div>
  );
}

function PoolUnlocks({
  unlocks,
  reveal,
  revealLabel,
}: {
  unlocks: ReactNode;
  reveal?: ReactNode;
  revealLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = revealLabel ?? "Read more";
  return (
    <>
      <p className="pool-widget__unlocks">
        {unlocks}
        {reveal && (
          <>
            {" "}
            <button
              type="button"
              className="pool-widget__reveal-toggle pool-widget__reveal-toggle-inline"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Hide details" : label}
              <span aria-hidden="true">{open ? " ↑" : " ↓"}</span>
            </button>
          </>
        )}
      </p>
      {reveal && (
        <div className="pool-widget__reveal-body" hidden={!open}>
          {reveal}
        </div>
      )}
    </>
  );
}
