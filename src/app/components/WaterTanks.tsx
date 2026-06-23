import { type ReactNode, useEffect, useRef, useState } from "react";

const VERT =
  "attribute vec2 p; varying vec2 v_uv; void main(){ v_uv=p*0.5+0.5; gl_Position=vec4(p,0.0,1.0); }";

const FRAG = `
precision highp float; varying vec2 v_uv;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_off; uniform vec2 u_dir;
#define TAU 6.28318530718
vec3 grad(float y){
  vec3 deep=vec3(0.067,0.012,0.125), mid=vec3(0.043,0.620,0.620), top=vec3(0.820,0.960,0.965);
  vec3 c=mix(deep,mid,smoothstep(0.0,0.55,y));
  return mix(c,top,smoothstep(0.55,1.0,y));
}
float caustics(vec2 uv, float time){
  vec2 p = mod(uv*TAU, TAU) - 250.0; vec2 i=p; float c=1.0, inten=0.005;
  for(int n=0;n<4;n++){ float t=time*0.5*(1.0-(3.5/float(n+1)));
    i=p+vec2(cos(t-i.x)+sin(t+i.y), sin(t-i.y)+cos(t+i.x));
    c+=1.0/length(vec2(p.x/(sin(i.x+t)/inten), p.y/(cos(i.y+t)/inten))); }
  c/=4.0; c=1.17-pow(c,1.4); return clamp(pow(abs(c),8.0),0.0,1.0);
}
void main(){
  vec2 uv=v_uv; float asp=u_res.x/u_res.y; vec2 auv=vec2(uv.x*asp, uv.y);
  vec2 fdir=normalize(u_dir+1e-5); vec2 perp=vec2(-fdir.y, fdir.x);
  float phase=dot(u_off,fdir);
  // flow-space coords; compress the along-axis so caustic veins ELONGATE into
  // soft flowing streaks that travel along the current (no hard bars)
  vec2 f = vec2(dot(auv,perp), dot(auv,fdir));
  vec2 fa = vec2(f.x, f.y*0.34);
  fa.y -= phase;                                     // streaks travel along the flow direction
  float ca = caustics(fa*2.4,       u_time*0.5);
  float cb = caustics(fa*3.6 + 7.0, u_time*0.7) * 0.7;
  float flow = max(ca, cb);
  flow *= 0.22 + 0.78*smoothstep(0.0, 1.0, uv.y);    // brighter near the sunlit surface (top)
  vec3 col = grad(uv.y) + vec3(0.86,0.97,0.99)*flow*0.85;
  gl_FragColor = vec4(col, 1.0);
}`;

/* shader-space dirs (uv.y up): down flows toward bottom, up toward top, etc. */
const DIRS: Record<string, [number, number]> = {
  down: [0, -1],
  up: [0, 1],
  right: [1, 0],
  left: [-1, 0],
};

type Flow = keyof typeof DIRS;

/** Mounts the WebGL water effect on a canvas. Boost is shared so a click
 *  anywhere on the tank (handled in the component) ramps the flow speed. */
function useWaterCanvas(flow: Flow) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boostRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dir = DIRS[flow] || DIRS.down;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
    });
    if (!gl) return; // CSS gradient fallback remains visible

    const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(o) || "shader error");
      return o;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const la = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u_res = U("u_res"), u_time = U("u_time"), u_off = U("u_off"), u_dir = U("u_dir");

    const start = performance.now();
    function resize() {
      let w = Math.floor(canvas!.clientWidth * DPR);
      let h = Math.floor(canvas!.clientHeight * DPR);
      const cap = Math.min(1, 480 / Math.max(w, h));
      w = Math.max(1, Math.floor(w * cap));
      h = Math.max(1, Math.floor(h * cap));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }

    // idle crawl + click boost (up to 3), eased + decaying
    const IDLE = 0.03;
    let speed = IDLE;
    const off: [number, number] = [0, 0];
    let last = performance.now();

    function render(now: number) {
      resize();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      boostRef.current *= Math.pow(0.5, dt / 2.6);
      speed += ((IDLE + boostRef.current) - speed) * Math.min(1, dt * 7);
      off[0] += dir[0] * speed * dt;
      off[1] += dir[1] * speed * dt;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(u_res, canvas!.width, canvas!.height);
      gl!.uniform1f(u_time, (now - start) / 1000);
      gl!.uniform2f(u_off, off[0], off[1]);
      gl!.uniform2f(u_dir, dir[0], dir[1]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    let raf = 0;
    let vis = true;
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
        last = performance.now();
      },
      { threshold: 0.02 }
    );

    if (reduce) {
      resize();
      render(performance.now());
    } else {
      io.observe(canvas);
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (vis) render(now);
      };
      raf = requestAnimationFrame(loop);
    }

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        resize();
        render(performance.now());
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [flow]);

  return { canvasRef, boostRef };
}

const MAXB = 3 * 0.3; // up to 3 clicks of boost
const STEP = 0.3;

function WaterTank({
  pill,
  variant,
  flow,
  title,
  summary,
  detail,
  cta,
}: {
  pill: string;
  variant: "portal" | "electric" | "indigo";
  flow: Flow;
  title: string;
  summary: ReactNode;
  detail: ReactNode;
  cta: string;
}) {
  const { canvasRef, boostRef } = useWaterCanvas(flow);
  const [open, setOpen] = useState(false);
  const detailId = `tank-detail-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="tank-wrap">
      <span className={`tank-pill tank-pill--${variant}`}>{pill}</span>
      <article
        className="tank"
        data-flow={flow}
        onPointerDown={(e) => {
          // don't ramp when the CTA itself is pressed
          if ((e.target as HTMLElement).closest(".tank-cta")) return;
          boostRef.current = Math.min(MAXB, boostRef.current + STEP);
        }}
      >
        <div className="tank-head">
          <h3>{title}</h3>
          <p>{summary}</p>
          <div id={detailId} className="tank-detail" hidden={!open}>
            {detail}
          </div>
          <button
            type="button"
            className="tank-cta"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Show less ↑" : cta}
          </button>
        </div>
        <div className="tank-water">
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
      </article>
    </div>
  );
}

export function WaterTanks() {
  return (
    <div className="water-tanks">
      <WaterTank
        pill="Public access"
        variant="portal"
        flow="down"
        title="Join our stream"
        summary={
          <>
            Explore open <b className="t-accent-semi">resources</b> and downloadable{" "}
            <b className="t-accent-semi">content</b>.
          </>
        }
        detail={
          <p>
            If you remix or republish Ooo media, keep an active link to Ooos.ca
            anywhere on your site while the media is up.
          </p>
        }
        cta="Learn more ↓"
      />
      <WaterTank
        pill="Community members"
        variant="electric"
        flow="right"
        title="Flow into the current"
        summary={
          <>
            Access premium creative assets, research reports, workshop and
            strategy kits, and early releases from{" "}
            <b className="t-accent">Ooos universe.</b>
          </>
        }
        detail={<p>The waitlist for the Ooo token is now open!</p>}
        cta="Get inside access →"
      />
      <WaterTank
        pill="Project partners"
        variant="indigo"
        flow="up"
        title="Donate to support a shared vision!"
        summary={
          <>
            <b>Choose</b> a project that{" "}
            <b className="t-accent">
              inspires you, benefits your community, or reflects your values.
            </b>{" "}
            Every contribution adds to a visible pool of public support!
          </>
        }
        detail={
          <p>
            Watch and share as the total grows and the project advances toward
            its next public milestone!
          </p>
        }
        cta="Create a wave! ↑"
      />
    </div>
  );
}
