import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import '../../styles/OooHeroCircle.css';

/**
 * Ooo! Hero Circle — three neumorphic floaters balanced on a glowing ring.
 *  ART (phone)        tap → screen reveals "Shadow" the ghost, bobbing
 *  EDUCATION (tri)    tap → volcano: crater bursts, gooey crimson lava pours
 *  CULTURE (tablet)   tap → screen plays the culture video (Greg, 2026-10-26)
 * Mobile-first: portrait stage < 600px, square stage ≥ 600px (see CSS).
 */

export interface OooHeroCircleProps {
  /** Folder holding the image and video assets. Default: `${BASE_URL}hero-circle/` */
  assetBase?: string;
  /** Float amplitude of triangle + tablet, px. Default 12 */
  floatAmount?: number;
  /** Float speed multiplier. Default 1 (4s period) */
  floatSpeed?: number;
  /** Pulse the purple halo behind the ring. Default true */
  glowPulse?: boolean;
  className?: string;
}

type Side = -1 | 1;
interface Blob { phase: 'fly' | 'flow' | 'pool'; side: Side; x: number; y: number; vx: number; vy: number; v: number; vmax: number; r: number; inset: number; age: number; heat: number; el: SVGCircleElement; }
interface Chunk { el: SVGPolygonElement; x: number; y: number; vx: number; vy: number; rot: number; vr: number; life: number; }

const SVGNS = 'http://www.w3.org/2000/svg';
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const lineX = (y: number, side: Side) => 56 + side * (y - 9) * 0.585;
const lineY = (x: number) => 9 + Math.abs(x - 56) / 0.585;
const craterD = (k: number) => {
  const y = (v: number) => (-20 + (v + 20) * k).toFixed(2);
  return `M-30,-30 H44 L46,${y(17)} L49,${y(25)} L53,${y(20)} L56,${y(28)} L60,${y(21)} L63,${y(26)} L66,${y(16)} L68,-30 H142 V130 H-30 Z`;
};
const heatColor = (h: number) => {
  const c1 = [255, 52, 58], c2 = [220, 20, 60], c3 = [70, 6, 18];
  const [a, b, t] = h > 0.5 ? [c2, c1, (h - 0.5) * 2] : [c3, c2, h * 2];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * (t as number))).join(',')})`;
};
const onActivate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
};

export default function OooHeroCircle({
  assetBase = `${import.meta.env.BASE_URL}hero-circle/`,
  floatAmount = 12, floatSpeed = 1, glowPulse = true, className = '',
}: OooHeroCircleProps) {
  const [ghost, setGhost] = useState(false);
  const [stone, setStone] = useState(false);

  const glowRef = useRef<HTMLDivElement>(null);
  const triRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLImageElement>(null);
  const cultureRef = useRef<HTMLVideoElement>(null);
  const ghostShadowRef = useRef<HTMLSpanElement>(null);
  const lavaRef = useRef<SVGGElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const craterRef = useRef<SVGEllipseElement>(null);
  const rimRef = useRef<SVGPathElement>(null);
  const chunksRef = useRef<SVGGElement>(null);
  const opts = useRef({ floatAmount, floatSpeed, glowPulse });
  opts.current = { floatAmount, floatSpeed, glowPulse };

  /* ---------- ambient loop: floaters, ghost bob, halo pulse ---------- */
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0; const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const { floatAmount: amp, floatSpeed: spd, glowPulse: pulse } = opts.current;
      const period = 4 / spd;
      [triRef, tabRef].forEach((r, j) => {
        if (!r.current) return;
        const p = (t / period + (j + 1) / 3) * Math.PI * 2;
        const y = -amp * (0.5 - 0.5 * Math.cos(p));
        const x = Math.sin(p * 0.5) * amp * 0.15;
        r.current.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      });
      const g = 0.5 - 0.5 * Math.cos((t / 3.8) * Math.PI * 2);
      if (ghostRef.current) ghostRef.current.style.transform = `translateY(${(-g * 10).toFixed(2)}%)`;
      if (ghostShadowRef.current) {
        ghostShadowRef.current.style.transform = `scaleX(${(1 - 0.2 * g).toFixed(3)})`;
        ghostShadowRef.current.style.opacity = (0.62 - 0.24 * g).toFixed(3);
      }
      if (glowRef.current) {
        const s = pulse ? 0.5 - 0.5 * Math.cos((t / 3) * Math.PI * 2) : 0.5;
        glowRef.current.style.transform = `translate(-50%,-50%) scale(${1 + 0.08 * s})`;
        glowRef.current.style.opacity = (0.55 + 0.4 * s).toFixed(3);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- volcano simulation (imperative, SVG units 112×100) ---------- */
  const sim = useRef({ blobs: [] as Blob[], chunks: [] as Chunk[], k: 0, active: false, emitUntil: 0, last: 0, raf: 0, acc: { left: 0, right: 0, plop: 0 } });
  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  const spawn = (kind: 'plop' | 'left' | 'right') => {
    const g = lavaRef.current; if (!g) return;
    const side: Side = (kind === 'plop' ? Math.random() < 0.8 : kind === 'left') ? -1 : 1;
    let b: Omit<Blob, 'el' | 'age' | 'heat'>;
    if (kind === 'right') b = { phase: 'flow', side, x: 0, y: 22, vx: 0, vy: 0, inset: rnd(0.8, 3), v: rnd(18, 26), vmax: rnd(42, 58), r: rnd(1.1, 2) };
    else if (kind === 'left') b = { phase: 'flow', side, x: 0, y: 21, vx: 0, vy: 0, inset: rnd(1, 6), v: rnd(4, 8), vmax: rnd(14, 26), r: rnd(2.6, 4.6) };
    else b = { phase: 'fly', side, x: 56 + rnd(-3, 3), y: 22, vx: side * rnd(8, 30), vy: -rnd(38, 72), v: 0, r: rnd(2.4, 5), inset: rnd(1.5, 6), vmax: rnd(16, 28) };
    if (b.phase === 'flow') b.x = lineX(b.y, side) - side * b.inset;
    const el = document.createElementNS(SVGNS, 'circle');
    el.setAttribute('r', String(b.r)); el.setAttribute('cx', String(b.x)); el.setAttribute('cy', String(b.y)); el.setAttribute('fill', '#FF2D3C');
    g.appendChild(el);
    sim.current.blobs.push({ ...b, el, age: 0, heat: 1 });
  };

  const burstChunks = () => {
    const g = chunksRef.current; if (!g) return;
    const shapes = ['0,0 5,-1 4,4', '0,0 4,1 1,4', '0,0 6,2 2,5 -1,3', '0,0 3,-2 5,2'];
    for (let i = 0; i < 6; i++) {
      const el = document.createElementNS(SVGNS, 'polygon');
      el.setAttribute('points', shapes[i % 4]); el.setAttribute('fill', i % 2 ? '#2B0C62' : '#1A0640');
      el.setAttribute('stroke', '#FF4A3A'); el.setAttribute('stroke-width', '0.3'); el.setAttribute('stroke-opacity', '0.6');
      g.appendChild(el);
      sim.current.chunks.push({ el, x: 56 + rnd(-6, 6), y: 18, vx: rnd(-34, 34), vy: -rnd(50, 90), rot: 0, vr: rnd(-500, 500), life: 1 });
    }
  };

  const step = useCallback((now: number) => {
    const s = sim.current;
    const dt = Math.min(0.05, (now - s.last) / 1000); s.last = now;
    const emitting = now < s.emitUntil;
    if (emitting) {
      const a = s.acc; a.left += dt * 16; a.right += dt * 11; a.plop += dt * 3.5;
      while (a.left >= 1) { spawn('left'); a.left--; }
      while (a.right >= 1) { spawn('right'); a.right--; }
      while (a.plop >= 1) { spawn('plop'); a.plop--; }
    }
    const target = emitting || s.blobs.length > 0 ? 1 : 0;
    s.k += (target - s.k) * Math.min(1, dt * (target ? 14 : 2.5));
    clipRef.current?.setAttribute('d', craterD(s.k));
    craterRef.current?.setAttribute('opacity', (emitting ? 0.85 + Math.sin(now / 90) * 0.15 : s.k * 0.5).toFixed(3));
    rimRef.current?.setAttribute('opacity', (s.k * (emitting ? 1 : 0.4)).toFixed(3));

    const G = 120;
    s.blobs = s.blobs.filter((b) => {
      b.age += dt;
      if (b.phase === 'fly') {
        b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt;
        const ly = lineY(b.x);
        if (b.vy > 0 && b.y >= ly - 1) { b.phase = 'flow'; b.side = b.x < 56 ? -1 : 1; b.y = Math.max(ly, 20); b.v = b.vy * 0.15; }
      } else if (b.phase === 'flow') {
        b.v = Math.min(b.vmax, b.v + 26 * dt); b.y += b.v * dt;
        b.x = lineX(b.y, b.side) - b.side * b.inset;
        if (b.y >= 88) { b.phase = 'pool'; b.vx = b.side * rnd(3, 12); }
      } else {
        b.x += b.vx * dt; b.vx *= 0.97; b.y += (93 - b.y) * dt * 3;
        b.r -= dt * (b.side < 0 ? 0.9 : 1.6);
      }
      b.heat = Math.max(0, 1 - b.age / 6.5);
      if (b.phase !== 'pool' && b.age > 4.5) b.r -= dt * 0.8;
      if (b.r <= 0.3) { b.el.remove(); return false; }
      b.el.setAttribute('cx', b.x.toFixed(2)); b.el.setAttribute('cy', b.y.toFixed(2));
      b.el.setAttribute('r', b.r.toFixed(2)); b.el.setAttribute('fill', heatColor(b.heat));
      return true;
    });
    s.chunks = s.chunks.filter((c) => {
      c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt; c.life -= dt * 1.1;
      if (c.life <= 0) { c.el.remove(); return false; }
      c.el.setAttribute('transform', `translate(${c.x.toFixed(2)},${c.y.toFixed(2)}) rotate(${c.rot.toFixed(1)})`);
      c.el.setAttribute('opacity', c.life.toFixed(2));
      return true;
    });
    if (!emitting && !s.blobs.length && !s.chunks.length && s.k < 0.01) {
      s.k = 0; s.active = false; s.raf = 0; clipRef.current?.setAttribute('d', craterD(0));
      return;
    }
    s.raf = requestAnimationFrame(step);
  }, []);

  const erupt = useCallback(() => {
    const s = sim.current; const now = performance.now();
    const fresh = !s.active; s.active = true; s.emitUntil = now + 4200;
    if (fresh || s.k < 0.5) { burstChunks(); for (let i = 0; i < 12; i++) spawn('plop'); }
    s.acc = { left: 0, right: 0, plop: 0 };
    if (!s.raf) { s.last = now; s.raf = requestAnimationFrame(step); }
  }, [step]);

  const toggleGhost = () => setGhost((v) => !v);
  const toggleStone = () => setStone((v) => !v);

  // the culture video plays once from the start when the screen comes on and
  // holds its last frame; the next tap returns to the cover card (Greg,
  // 2026-10-26); muted, since a touch press can't unlock sound
  useEffect(() => {
    const v = cultureRef.current;
    if (!v) return;
    if (stone) { v.currentTime = 0; v.play().catch(() => {}); }
    else v.pause();
  }, [stone]);

  return (
    <section className={`ohc ${className}`} aria-label="Art, Education, Culture">
      <div className="ohc-inner">
      <div className="ohc-stage">
        <div ref={glowRef} className="ohc-glow" />
        <div className="ohc-circle" />

        {/* ART — phone (steady) */}
        <div className="ohc-phone">
          <div className="ohc-phone__body ohc-btn" role="button" tabIndex={0} aria-pressed={ghost}
            aria-label="Art — tap to reveal Shadow" onPointerDown={toggleGhost} onKeyDown={onActivate(toggleGhost)}>
            <div className="ohc-phone__speaker" />
            <div className="ohc-phone__screen">
              <div className={`ohc-layer ohc-content ohc-fade ${ghost ? 'is-hidden' : ''}`}>
                <div className="ohc-well">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5B04DE" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="2.5" width="17" height="19" rx="2.5" />
                    <image href={`${assetBase}ooo-exclaim-purple.png`} x="9.5" y="6" width="5" height="12" preserveAspectRatio="xMidYMid meet" />
                  </svg>
                </div>
                <p className="ohc-title">ART</p>
                <p className="ohc-sub">Storytelling media</p>
              </div>
              <div className="ohc-layer ohc-ghost-layer" style={{ opacity: ghost ? 1 : 0 }} aria-hidden={!ghost}>
                <span ref={ghostShadowRef} className="ohc-ghost-shadow" />
                <img ref={ghostRef} className="ohc-ghost" src={`${assetBase}shadow-ghost.webp`} alt="Shadow the ghost" loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="ohc-phone__home" />
          </div>
        </div>

        {/* EDUCATION — velvet triangle / volcano */}
        <div ref={triRef} className="ohc-tri">
          <div className="ohc-tri__wrap">
            <div className="ohc-tri__body ohc-btn" role="button" tabIndex={0}
              aria-label="Education — press to erupt" onPointerDown={erupt} onKeyDown={onActivate(erupt)}>
              <svg className="ohc-tri__svg" viewBox="0 0 112 100" aria-hidden="true">
                <defs>
                  <linearGradient id="ohc-triBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2B0C62" /><stop offset="0.5" stopColor="#1A0640" /><stop offset="1" stopColor="#0D0220" /></linearGradient>
                  <linearGradient id="ohc-triRim" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stopColor="#3A157A" /><stop offset="0.55" stopColor="#1A0640" /><stop offset="1" stopColor="#06010E" /></linearGradient>
                  <linearGradient id="ohc-triSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9A6BFF" stopOpacity="0.55" /><stop offset="0.45" stopColor="#6A35D8" stopOpacity="0.18" /><stop offset="1" stopColor="#2A0A5E" stopOpacity="0" /></linearGradient>
                  <filter id="ohc-velvet" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="3.4" numOctaves={1} seed={3} result="n0" />
                    <feGaussianBlur in="n0" stdDeviation="0.12" result="n" />
                    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.66  0 0 0 0 1  0.3 0 0 0 -0.1" result="pile" />
                    <feComposite in="pile" in2="SourceAlpha" operator="in" result="pileIn" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={3} seed={11} result="c" />
                    <feDiffuseLighting in="c" surfaceScale={5} diffuseConstant={1.1} lightingColor="#8A52FF" result="lit"><feDistantLight azimuth={225} elevation={38} /></feDiffuseLighting>
                    <feColorMatrix in="lit" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.28 0 0 0 -0.06" result="litA" />
                    <feComposite in="litA" in2="SourceAlpha" operator="in" result="litIn" />
                    <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="litIn" /><feMergeNode in="pileIn" /></feMerge>
                  </filter>
                  <filter id="ohc-softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.4" /></filter>
                  <filter id="ohc-triInset" x="-20%" y="-20%" width="140%" height="140%">
                    <feOffset in="SourceAlpha" dx="1.6" dy="2" result="o1" /><feGaussianBlur in="o1" stdDeviation="2.2" result="b1" />
                    <feComposite in="SourceAlpha" in2="b1" operator="arithmetic" k2={1} k3={-1} result="r1" />
                    <feFlood floodColor="#020005" floodOpacity="0.95" /><feComposite in2="r1" operator="in" result="sh" />
                    <feOffset in="SourceAlpha" dx="-1.2" dy="-1.2" result="o2" /><feGaussianBlur in="o2" stdDeviation="1.6" result="b2" />
                    <feComposite in="SourceAlpha" in2="b2" operator="arithmetic" k2={1} k3={-1} result="r2" />
                    <feFlood floodColor="#A57CFF" floodOpacity="0.16" /><feComposite in2="r2" operator="in" result="hl" />
                    <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="sh" /><feMergeNode in="hl" /></feMerge>
                  </filter>
                  <filter id="ohc-lavaGoo" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.9" result="bl" />
                    <feColorMatrix in="bl" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
                    <feGaussianBlur in="goo" stdDeviation="1.2" result="gb" />
                    <feSpecularLighting in="gb" surfaceScale={3} specularConstant={1.1} specularExponent={22} lightingColor="#FFC9A8" result="spec"><fePointLight x={20} y={-30} z={60} /></feSpecularLighting>
                    <feComposite in="spec" in2="goo" operator="in" result="specIn" />
                    <feGaussianBlur in="goo" stdDeviation="2.6" result="glow" />
                    <feColorMatrix in="glow" type="matrix" values="0 0 0 0 1  0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0.75 0" result="glowC" />
                    <feMerge><feMergeNode in="glowC" /><feMergeNode in="goo" /><feMergeNode in="specIn" /></feMerge>
                  </filter>
                  <clipPath id="ohc-craterClip"><path ref={clipRef} d={craterD(0)} /></clipPath>
                </defs>
                <g clipPath="url(#ohc-craterClip)">
                  <polygon points="56,9 104,91 8,91" fill="url(#ohc-triBody)" stroke="url(#ohc-triBody)" strokeWidth="14" strokeLinejoin="round" filter="url(#ohc-velvet)" />
                  <polygon points="56,9 104,91 8,91" fill="none" stroke="url(#ohc-triSheen)" strokeWidth="7" strokeLinejoin="round" filter="url(#ohc-softBlur)" />
                  <polygon points="56,19 96,87 16,87" fill="none" stroke="url(#ohc-triRim)" strokeWidth="7" strokeLinejoin="round" />
                  <g filter="url(#ohc-velvet)"><polygon points="56,23 92.5,85 19.5,85" fill="#0C011C" stroke="#0C011C" strokeWidth="3" strokeLinejoin="round" filter="url(#ohc-triInset)" /></g>
                </g>
                <ellipse ref={craterRef} cx="56" cy="24" rx="10" ry="3.6" fill="#FF2D3C" opacity="0" filter="url(#ohc-softBlur)" />
                <path ref={rimRef} d="M44,16 L46,17 L49,25 L53,20 L56,28 L60,21 L63,26 L66,16 L68,16" fill="none" stroke="#FF5A3C" strokeWidth="1.1" strokeLinejoin="round" opacity="0" filter="url(#ohc-softBlur)" />
                <g ref={chunksRef} />
              </svg>
              <div className="ohc-layer ohc-content">
                <svg className="ohc-tri__icon" viewBox="0 0 24 24" fill="none" stroke="#5B04DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 20h5.5v-5.5H14V9h5.5V4" /><path d="M3 20h18" />
                </svg>
                <p className="ohc-title">EDUCATION</p>
                <p className="ohc-sub">Lifelong learning</p>
              </div>
              <svg className="ohc-tri__svg ohc-tri__lava" viewBox="0 0 112 100" aria-hidden="true"><g ref={lavaRef} filter="url(#ohc-lavaGoo)" /></svg>
            </div>
          </div>
        </div>

        {/* CULTURE — tablet */}
        <div ref={tabRef} className="ohc-tab">
          <div className="ohc-tab__body ohc-btn" role="button" tabIndex={0} aria-pressed={stone}
            aria-label="Culture — tap to play the culture video" onPointerDown={toggleStone} onKeyDown={onActivate(toggleStone)}>
            <div className="ohc-tab__cam" />
            <div className="ohc-tab__screen">
              <div className={`ohc-layer ohc-content ohc-fade ${stone ? 'is-hidden' : ''}`}>
                <div className="ohc-well">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5B04DE" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h3.5l2-5 3 10 3-14 3 17 2-8H22" /></svg>
                </div>
                <p className="ohc-title">CULTURE</p>
                <p className="ohc-sub">Music • Technology • Style</p>
              </div>
              <div className={`ohc-layer ohc-stone ${stone ? '' : 'is-off'}`} aria-hidden={!stone}>
                <video ref={cultureRef} src={`${assetBase}culture.mp4`} muted playsInline preload="none" disablePictureInPicture />
                <div className="ohc-stone__vignette" />
              </div>
            </div>
            <div className="ohc-tab__spacer" />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
