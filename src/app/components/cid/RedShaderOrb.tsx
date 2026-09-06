import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/* A round card with a live red shader behind a big title. At rest the circle
 * shows only the title; hovering, focusing or tapping it reveals the sentence
 * underneath on a dark scrim, and the shader warms while it is open.
 *
 * THE SHADER IS THE ROOM'S FAMILY. Its noise (hash21, noise, fbm) and its
 * palette constants are lifted from public/DISPLAY_ROOM_BLUE_checker_cm.html,
 * the display room, whose side walls burn for Icarus in exactly these
 * colours: DARKEST, RUBY (#822F00), EMBER, GOLD (#F0C040). The room's walls
 * are raycast; this is the flat wallpaper form of the same fire, the kind
 * the "shader wallpapers" prompt asks for: a field that drifts on its own
 * and answers the pointer with a warm well under it.
 *
 * THE SCAFFOLDING IS THE ROOM'S TOO, deliberately, so there is one way of
 * running WebGL on this site rather than two: device pixel ratio capped at
 * 1.5; one fullscreen triangle; fit() on a ResizeObserver, because a canvas
 * rendered before it has a size clamps its buffer to 1x1 and stays there
 * (the failure the room had); a frame loop that only schedules while the
 * element is on screen, via IntersectionObserver; single frames rather than
 * a loop under prefers-reduced-motion; and a CSS fallback when there is no
 * WebGL at all, so the circle is still a red circle with its title on it.
 */

const VERT = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }";

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_hot;

const vec3 DARKEST = vec3(0.024, 0.008, 0.110);
const vec3 RUBY    = vec3(0.510, 0.184, 0.000);
const vec3 EMBER   = vec3(0.620, 0.180, 0.420);
const vec3 GOLD    = vec3(0.941, 0.753, 0.251);
const vec3 ROBIN   = vec3(0.941, 0.957, 0.961);

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i),              b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1)), d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = rot(0.5) * p * 2.0 + 11.3; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 q  = uv * 2.0 - 1.0;
  float t = u_time;

  // Ember field: two layers of noise, the second finer and faster, drifting
  // upward the way the room's fire climbs its walls.
  vec2 p = q * 1.6;
  p.y -= t * 0.22;
  float n = fbm(p * 1.8 + vec2(0.0, t * 0.08)) + 0.55 * fbm(p * 3.6 + vec2(1.0, -t * 0.14));
  n /= 1.55;

  vec3 col = mix(DARKEST, RUBY,  smoothstep(0.12, 0.55, n));
  col      = mix(col,     EMBER, smoothstep(0.42, 0.80, n));
  col      = mix(col,     GOLD,  smoothstep(0.74, 1.05, n) * 0.55);

  // The pointer's well: a warm glow that follows the cursor, and the whole
  // field lifts a little while the card is open.
  vec2 m = (u_mouse - 0.5) * 2.0;
  float fan = exp(-distance(q, m) * 1.9) * (0.35 + 0.65 * u_hot);
  col += GOLD * fan * 0.55;
  col += ROBIN * fan * fan * 0.10;
  col *= 1.0 + 0.18 * u_hot;

  // Darken toward the rim so the circle's edge reads as an edge.
  float vig = smoothstep(1.06, 0.40, length(q));
  col *= 0.55 + 0.45 * vig;

  col += (hash21(gl_FragCoord.xy + t) - 0.5) * 0.012;   // dither, kills banding
  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  /** The organisation's full name, the only thing shown at rest. */
  title: string;
  /** The sentence revealed on hover, focus or tap. */
  children: ReactNode;
};

export function RedShaderOrb({ title, children }: Props) {
  const descId = useId();
  const orbRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [noGl, setNoGl] = useState(false);
  // The shader reads these; they live in refs so pointer moves and hover
  // changes never re-render React.
  const mouse = useRef<[number, number]>([0.5, 0.5]);
  const target = useRef<[number, number]>([0.5, 0.5]);
  const hot = useRef(0);
  const hotTarget = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const orb = orbRef.current;
    if (!canvas || !orb) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const gl =
      canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false }) ||
      (canvas.getContext("experimental-webgl", { antialias: false }) as WebGLRenderingContext | null);
    if (!gl) { setNoGl(true); return; }

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(VERT, gl.VERTEX_SHADER));
      gl.attachShader(prog, compile(FRAG, gl.FRAGMENT_SHADER));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    } catch {
      setNoGl(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      hot: gl.getUniformLocation(prog, "u_hot"),
    };
    const start = performance.now();

    const fit = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    const render = () => {
      mouse.current[0] += (target.current[0] - mouse.current[0]) * 0.08;
      mouse.current[1] += (target.current[1] - mouse.current[1]) * 0.08;
      hot.current += (hotTarget.current - hot.current) * 0.10;
      fit();
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(u.res, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(u.time, (performance.now() - start) / 1000);
      gl.uniform2f(u.mouse, mouse.current[0], mouse.current[1]);
      gl.uniform1f(u.hot, hot.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let visible = true, running = false, raf = 0;
    const tick = () => { if (!visible) { running = false; return; } render(); raf = requestAnimationFrame(tick); };
    const startLoop = () => { if (!running && !reduce) { running = true; raf = requestAnimationFrame(tick); } };

    const onMove = (e: PointerEvent) => {
      const r = orb.getBoundingClientRect();
      target.current = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
      if (reduce) render();
    };
    const onEnter = () => { hotTarget.current = 1; if (reduce) render(); };
    const onLeave = () => { hotTarget.current = 0; target.current = [0.5, 0.5]; if (reduce) render(); };
    orb.addEventListener("pointermove", onMove);
    orb.addEventListener("pointerenter", onEnter);
    orb.addEventListener("pointerleave", onLeave);

    render();
    const ro = "ResizeObserver" in window ? new ResizeObserver(() => render()) : null;
    ro?.observe(canvas);
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) startLoop(); }, { rootMargin: "200px 0px" })
      : null;
    io?.observe(orb);
    startLoop();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect(); io?.disconnect();
      orb.removeEventListener("pointermove", onMove);
      orb.removeEventListener("pointerenter", onEnter);
      orb.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  // Open state also warms the shader, so a tapped card reads the same as a
  // hovered one on a touch screen, where there is no hover.
  useEffect(() => { hotTarget.current = open ? 1 : 0; }, [open]);

  return (
    <div ref={orbRef} className={`cid-viv-orb${noGl ? " is-nogl" : ""}`} data-open={open ? "true" : "false"}>
      <canvas ref={canvasRef} className="cid-viv-orb-gl" aria-hidden="true" />
      <button
        type="button"
        className="cid-viv-orb-hit"
        aria-expanded={open}
        aria-describedby={descId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="cid-viv-orb-title">{title}</span>
      </button>
      {/* Always in the DOM, so aria-describedby has something to point at and
          a screen reader hears the sentence with the button; visually it is
          the layer that fades in over the title. */}
      <p id={descId} className="cid-viv-orb-desc">{children}</p>
    </div>
  );
}
