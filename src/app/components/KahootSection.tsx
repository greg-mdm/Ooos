import { useEffect, useRef, useState } from "react";
import "../../styles/kahoot-section.css";

/* ============================================================
   KahootSection — the "Gravity Grid" participatory layer for the
   Ostara page. Ported from `Kahoot Gravity Grid Section.html`:

   - WebGL "gravity grid": a teal/electric lattice warped by a
     pointer gravity well + click pulses (shader moved into the
     useEffect below).
   - The centre launch panel mirrors the live page; its launch
     button is wired to the REAL Kahoot embed (KAHOOT_EMBED) — it
     loads the iframe only on activation (no autoplay on mount).
   - DPR capped at 1.5, IntersectionObserver pause when offscreen,
     prefers-reduced-motion renders a single static frame.

   Scoped under `.kgrid` (mirrors the `.ood` convention in
   OooDivisions). Styles live in `src/styles/kahoot-section.css`.
   ============================================================ */

// Live Kahoot challenge embed. Admin: greg@ooos.ca.
// Generated from Kahoot share dialog ("Embed" option), assignment-style URL.
const KAHOOT_EMBED =
  "https://kahoot.it/challenge/09524505?challenge-id=403b6d09-7c09-4def-94ce-5fb7aa8db66b_1778197641699&embed=true";
const KAHOOT_PLAY = "https://kahoot.it/challenge/09524505";

const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
uniform float u_mdown; uniform vec3 u_clicks[8];
const vec3 DARKEST=vec3(0.024,0.008,0.110);
const vec3 PORTAL=vec3(0.294,0.000,0.714);
const vec3 ELECTRIC=vec3(0.357,0.016,0.871);
const vec3 TEAL=vec3(0.000,0.502,0.502);
const vec3 ROBIN=vec3(0.941,0.957,0.961);
vec2 warp(vec2 p, vec2 m){
  vec2 disp=vec2(0.0); vec2 d=m-p; float r=length(d);
  disp+=normalize(d+1e-4)*(0.10*(1.0+u_mdown*1.6))/(r+0.12);
  for(int i=0;i<8;i++){ vec3 c=u_clicks[i]; if(c.z<0.0) continue;
    float age=u_time-c.z; if(age<0.0||age>4.0) continue;
    vec2 cd=c.xy-p; float cr=length(cd);
    float pulse=sin(age*5.0)*exp(-age*1.2);
    disp+=normalize(cd+1e-4)*0.08*pulse/(cr+0.1); }
  return disp;
}
float gridLines(vec2 g){ vec2 f=abs(fract(g)-0.5); float line=min(f.x,f.y);
  return smoothstep(0.06,0.0,line); }
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y;
  vec2 p=uv; p.x*=asp; vec2 m=u_mouse; m.x*=asp;
  float t=u_time*0.05;
  vec2 wp=p+warp(p,m); float scale=16.0;
  vec2 g=wp*scale+vec2(t,t*0.5);
  float line=gridLines(g);
  float well=length(warp(p,m))*4.0; float wellGlow=smoothstep(0.0,1.5,well);
  vec3 col=DARKEST;
  vec3 lineCol=mix(TEAL,ELECTRIC,smoothstep(0.0,1.0,wellGlow));
  col+=lineCol*line*(0.35+wellGlow*1.4);
  vec2 nf=abs(fract(g)-0.5); float node=smoothstep(0.10,0.0,length(nf));
  col+=mix(PORTAL,ROBIN,wellGlow)*node*(0.5+wellGlow);
  col+=ELECTRIC*exp(-distance(p,m)*4.0)*(0.3+u_mdown*0.6);
  col+=ROBIN*exp(-distance(p,m)*12.0)*0.5;
  float vig=smoothstep(1.6,0.35,length(uv-0.5));
  col*=0.7+0.3*vig;
  gl_FragColor=vec4(col,1.0);
}`;

const VERT = "attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0.0,1.0); }";

export function KahootSection() {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const banner = bannerRef.current;
    if (!canvas || !banner) return;

    const gl =
      (canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: true }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl", { antialias: false, preserveDrawingBuffer: true }) as WebGLRenderingContext | null);
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const comp = (s: string, type: number) => {
      const o = gl.createShader(type)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(o) || "shader compile error");
      }
      return o;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, comp(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, comp(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const la = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u_res = U("u_res");
    const u_time = U("u_time");
    const u_mouse = U("u_mouse");
    const u_mdown = U("u_mdown");
    const u_clicks = U("u_clicks");

    const start = performance.now();
    const mouse = [0.5, 0.5];
    let target = [0.5, 0.5];
    let mdown = 0;
    let mdownT = 0;
    const clicks = new Float32Array(24).fill(-1);
    let head = 0;

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const render = () => {
      resize();
      mouse[0] += (target[0] - mouse[0]) * 0.12;
      mouse[1] += (target[1] - mouse[1]) * 0.12;
      mdown += (mdownT - mdown) * 0.12;
      const t = (performance.now() - start) / 1000;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(u_res, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(u_time, t);
      gl.uniform2f(u_mouse, mouse[0], mouse[1]);
      gl.uniform1f(u_mdown, mdown);
      gl.uniform3fv(u_clicks, clicks);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // track cursor anywhere over the banner (canvas is pointer-events:none)
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target = [(e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height];
      if (reduce) render();
    };
    const onDown = (e: PointerEvent) => {
      mdownT = 1;
      const r = canvas.getBoundingClientRect();
      const i = head * 3;
      clicks[i] = (e.clientX - r.left) / r.width;
      clicks[i + 1] = 1.0 - (e.clientY - r.top) / r.height;
      clicks[i + 2] = (performance.now() - start) / 1000;
      head = (head + 1) % 8;
      if (reduce) render();
    };
    const onUp = () => {
      mdownT = 0;
    };

    banner.addEventListener("pointermove", onMove);
    banner.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let raf: number | null = null;
    let vis = true;
    let io: IntersectionObserver | null = null;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (vis) render();
    };

    const onResize = () => {
      resize();
      render();
    };

    if (reduce) {
      resize();
      render();
    } else {
      io = new IntersectionObserver(
        (es) => {
          vis = es[0].isIntersecting;
        },
        { threshold: 0.01 },
      );
      io.observe(banner);
      loop();
    }
    window.addEventListener("resize", onResize);
    render();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onUp);
      banner.removeEventListener("pointermove", onMove);
      banner.removeEventListener("pointerdown", onDown);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    };
  }, []);

  return (
    <section className="kgrid" aria-label="Choosing our digital destiny — Kahoot workshop">
      <div className="kgrid-inner">
        <div className="kgrid-intro">
          <div className="kgrid-copy">
            <h2 className="kgrid-title">Choosing Our Digital Destiny</h2>
            <p className="kgrid-kicker">Kahoot Workshop hosted by Ooo.Play</p>
            <div className="kgrid-lede">
              <p>
                Ostara is a complex system designed using probabilistic signals
                and triangulation of verification research sources. It includes
                safeguards such as multi-agent moderation, strict role
                separation, and consistent human oversight and analysis. Try the
                live game below, featuring structured inquiry guided by a Master
                of{"\u00A0"}Digital{"\u00A0"}Media.
              </p>
              <p>
                Kahoot increases participation by allowing everyone to share
                their observations while encouraging collaborative dialogue
                without any one voice dominating the discussion. Join us to
                discover how digital engagement creates a unique collective
                intelligence experience.
              </p>
            </div>
          </div>

          <div className="kgrid-arc" aria-hidden="true">
            <div className="kgrid-arc-group">
              <div className="kgrid-steps">
                <span>Launch</span>
                <span>Learn</span>
              </div>
            </div>
            <div className="kgrid-arc-arrow" />
            <div className="kgrid-arc-group">
              <div className="kgrid-steps">
                <span>Explore</span>
                <span>Examine</span>
                <span>Experiment</span>
              </div>
            </div>
            <div className="kgrid-arc-arrow" />
            <div className="kgrid-arc-group">
              <div className="kgrid-steps">
                <span>Decision</span>
                <span>Action</span>
              </div>
            </div>
          </div>
        </div>

        <div className="kgrid-banner" ref={bannerRef}>
          <canvas className="kgrid-canvas" ref={canvasRef} />
          <div className="kgrid-scrim" aria-hidden="true" />
          {launched ? (
            <div className="kgrid-frame-wrap">
              <iframe
                src={KAHOOT_EMBED}
                title="Ostara workshop Kahoot"
                name="kahoot-embed"
                scrolling="no"
                frameBorder={0}
                allowFullScreen
                allow="fullscreen"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="kgrid-card">
              <div className="kgrid-word">Kahoot!</div>
              <div className="kgrid-sub">Ostara workshop · Assignment by Ooo.Play</div>
              <button
                type="button"
                className="kgrid-btn"
                onClick={() => setLaunched(true)}
                aria-label="Launch the Ostara workshop Kahoot"
              >
                ▶ Click to launch
              </button>
              <div className="kgrid-note">
                You can participate in this activity by clicking the launch
                button. It will not auto-play when the page loads.
              </div>
            </div>
          )}
        </div>

        <div className="kgrid-actions">
          <a className="btn btn-secondary" href={KAHOOT_PLAY} target="_blank" rel="noopener noreferrer">
            Play in a new tab →
          </a>
          <span className="kgrid-meta">
            Admin: greg@ooos.ca · Tier: Kahoot 365 Gold (workshop edition)
          </span>
        </div>

        <div className="kgrid-credit">
          Inspired by Gamestorming principles
          <br />
          Find out more:{" "}
          <a href="https://gamestorming.com" target="_blank" rel="noopener noreferrer">
            gamestorming.com
          </a>
        </div>
      </div>
    </section>
  );
}

export default KahootSection;
