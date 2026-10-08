/* Reality / Hyperreality: one frame holding two photographs of Gregory
   Tyler Long. Reality is the Master of Digital Media convocation, June 2026.
   Hyperreality is the Vivarium, the Canadian Innovation Dimension's
   interactive virtual environment. A rail under the frame moves between
   them; the frame itself can be dragged too. Moving over the frame stirs
   black water, and the crests of the ripples let the other photograph show
   through. Committing a change sinks the photograph into the water and
   surfaces the other (Greg's brief, 2026-10-07).

   Built by Claude Design on 2026-10-08 and ported here from its export
   ("Reality Slider - ooos.html", kept in SPRINT 6/references/reality-slider-
   claude-design/). The mechanics, timings and inks are the export's; the
   photographs are the originals, whole: the frame takes the hyperreality
   photo's proportions and the convocation photo, which is 3:4, is padded
   above and below with the water's ink (Greg, 2026-10-08: no crop, no zoom).
   The water lives in reality-water.ts. Styles: reality-slider.css. */
import { useCallback, useEffect, useRef, useState } from "react";
import { createWater, type Water } from "./reality-water";
import "../../styles/reality-slider.css";

/* the change of state: sink into the water, hold under, surface as the
   other photograph; a drag released on the same side eases back */
const SINK_MS = 650, HOLD_MS = 300, RISE_MS = 1000, BACK_MS = 250;

/* the frame's proportions: those of the prepared photographs */
const FRAME_W = 960, FRAME_H = 1618;

type Props = {
  realSrc: string; hyperSrc: string;
  realBlur: string; hyperBlur: string;
  realAlt: string; hyperAlt: string;
  /* 0 opens on Reality, 1 on Hyperreality */
  initial?: 0 | 1;
};

type View = { show: number; veil: number; handle: number; target: number };

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function RealitySlider({ realSrc, hyperSrc, realBlur, hyperBlur, realAlt, hyperAlt, initial = 0 }: Props) {
  const [view, setView] = useState<View>({ show: initial, veil: 0, handle: initial * 100, target: initial });
  const [ready, setReady] = useState(false);
  const [focus, setFocus] = useState(false);
  const [railHeld, setRailHeld] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const water = useRef<Water | null>(null);
  const anim = useRef(0);
  const viewRef = useRef(view);
  viewRef.current = view;
  const drag = useRef<{ id: number; x: number; y: number; v: number; on: boolean } | null>(null);
  const railDrag = useRef<number | null>(null);

  // the water boots once the canvas is in the document; none for reduced motion
  useEffect(() => {
    if (reduce()) return;
    const canvas = canvasRef.current, host = frameRef.current;
    if (!canvas || !host) return;
    const w = createWater(canvas, host, realSrc, hyperSrc, () => setReady(true));
    if (!w) return;
    w.setView(viewRef.current.show, 0);
    water.current = w;
    return () => { w.destroy(); water.current = null; };
  }, [realSrc, hyperSrc]);

  useEffect(() => { water.current?.setView(view.show, view.veil); }, [view.show, view.veil]);
  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const stop = () => { cancelAnimationFrame(anim.current); anim.current = 0; };

  // sink into black water, hold, surface as the other photograph
  const goTo = useCallback((to: number) => {
    stop();
    const from = viewRef.current.handle;
    if (to === viewRef.current.show) {
      setView((v) => ({ ...v, target: to }));
      const t0 = performance.now();
      const back = (now: number) => {
        const t = Math.min(1, (now - t0) / BACK_MS);
        setView((v) => ({ ...v, handle: from + (to * 100 - from) * t, veil: 0 }));
        anim.current = t < 1 ? requestAnimationFrame(back) : 0;
      };
      anim.current = requestAnimationFrame(back);
      return;
    }
    const k = reduce() ? 0.5 : 1;
    const sink = SINK_MS * k, hold = HOLD_MS * k, rise = RISE_MS * k, total = sink + hold + rise;
    water.current?.stir(to ? 1 : -1, sink + hold);
    const t0 = performance.now();
    const tick = (now: number) => {
      const e = now - t0;
      const handle = from + (to * 100 - from) * Math.min(1, e / (sink + hold));
      let veil: number, show = viewRef.current.show;
      if (e < sink) veil = e / sink;
      else { show = to; veil = e < sink + hold ? 1 : Math.max(0, 1 - (e - sink - hold) / rise); }
      if (e >= total) veil = 0;
      setView({ handle, veil, show, target: to });
      anim.current = e < total ? requestAnimationFrame(tick) : 0;
    };
    anim.current = requestAnimationFrame(tick);
  }, []);

  const commit = () => goTo(viewRef.current.handle < 50 ? 0 : 1);
  const setHandle = (v: number) => setView((s) => ({ ...s, handle: Math.max(0, Math.min(100, v)) }));
  const fromRail = (x: number) => {
    const r = railRef.current?.getBoundingClientRect();
    if (r) setHandle(((x - r.left) / r.width) * 100);
  };

  const { show, veil, handle, target } = view;
  const showReal = (1 - show) * (1 - veil), showHyper = show * (1 - veil);
  const pct = handle + "%";
  const active = focus || railHeld;

  return (
    <figure className="reality-slider">
      <div
        ref={frameRef}
        className="reality-slider__frame"
        style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, v: viewRef.current.handle, on: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          const dx = e.clientX - d.x, dy = e.clientY - d.y;
          if (!d.on) {
            // a vertical gesture is the page scrolling, not the slider
            if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
            d.on = true;
            stop();
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          const width = e.currentTarget.getBoundingClientRect().width || 1;
          setHandle(d.v + (dx / width) * 100);
        }}
        onPointerUp={() => { const was = drag.current?.on; drag.current = null; if (was) commit(); }}
        onPointerCancel={() => { const was = drag.current?.on; drag.current = null; if (was) commit(); }}
      >
        <div className="reality-slider__blur" aria-hidden="true">
          <img src={realBlur} alt="" style={{ opacity: showReal }} />
          <img src={hyperBlur} alt="" style={{ opacity: showHyper }} />
        </div>
        <img className="reality-slider__photo" src={realSrc} width={FRAME_W} height={FRAME_H} alt={realAlt} draggable={false} style={{ opacity: showReal }} />
        <img className="reality-slider__photo" src={hyperSrc} width={FRAME_W} height={FRAME_H} alt={hyperAlt} draggable={false} style={{ opacity: showHyper }} />
        <canvas ref={canvasRef} className="reality-slider__water" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }} />
      </div>
      <div
        ref={railRef}
        className="reality-slider__rail"
        role="slider"
        tabIndex={0}
        aria-label="Reality or Hyperreality"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={target}
        aria-valuetext={target ? "Hyperreality" : "Reality"}
        onKeyDown={(e) => {
          const to = { ArrowLeft: 0, ArrowDown: 0, Home: 0, PageDown: 0, ArrowRight: 1, ArrowUp: 1, End: 1, PageUp: 1 }[e.key];
          if (to === undefined) return;
          e.preventDefault();
          if (to !== viewRef.current.target) goTo(to);
        }}
        onPointerDown={(e) => {
          railDrag.current = e.pointerId;
          setRailHeld(true);
          stop();
          e.currentTarget.setPointerCapture(e.pointerId);
          fromRail(e.clientX);
        }}
        onPointerMove={(e) => { if (railDrag.current === e.pointerId) fromRail(e.clientX); }}
        onPointerUp={() => { if (railDrag.current === null) return; railDrag.current = null; setRailHeld(false); commit(); }}
        onPointerCancel={() => { if (railDrag.current === null) return; railDrag.current = null; setRailHeld(false); commit(); }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        <span className="reality-slider__track" aria-hidden="true"><span className="reality-slider__fill" style={{ width: pct }} /></span>
        <span className="reality-slider__tick reality-slider__tick--start" aria-hidden="true" />
        <span className="reality-slider__tick reality-slider__tick--end" aria-hidden="true" />
        <span className={`reality-slider__handle${active ? " is-active" : ""}${focus ? " is-focus" : ""}`} style={{ left: pct }} aria-hidden="true" />
      </div>
      <figcaption className="reality-slider__caption">
        <button type="button" className={`reality-slider__end${target === 0 ? " is-current" : ""}`} onClick={() => target !== 0 && goTo(0)}>Reality</button>
        <button type="button" className={`reality-slider__end${target === 1 ? " is-current" : ""}`} onClick={() => target !== 1 && goTo(1)}>Hyperreality</button>
      </figcaption>
    </figure>
  );
}
