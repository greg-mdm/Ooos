import { useEffect, useRef } from "react";

/* ============================================================
   AuroraCard — the carved "trading-card" display of the Aurora
   engine (de-blued violet / teal / ember). Ported 1:1 from the
   co-created `Aurora Field Card v3.html`:

   - WebGL fragment shader: 3 layers / 6 fbm octaves, teal + ember
     drifting blooms, cursor bloom, click ripple-bloom, vignette.
   - Pointer drives the shader cursor AND a subtle 3D card tilt;
     pointerdown fires a click ripple; touchmove supported.
   - DPR capped at 1.6, IntersectionObserver pause when offscreen,
     prefers-reduced-motion renders a single static frame.

   The carved frame is a PNG with a transparent center
   (public/assets/Ooo-card-frame-AF.png); the live aurora window
   sits behind it and the shelf label is locked into the frame's
   bottom-right shelf. Styles live in `src/styles/aurora-card.css`.
   ============================================================ */

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_mvel;
uniform float u_mdown;
uniform vec3  u_clicks[8];

const vec3 DARKEST  = vec3(0.024,0.008,0.110);
const vec3 PORTAL   = vec3(0.294,0.000,0.714);
const vec3 ELECTRIC = vec3(0.357,0.016,0.871);
const vec3 TEAL     = vec3(0.000,0.502,0.502);
const vec3 ROBIN    = vec3(0.941,0.957,0.961);
const vec3 EMBER    = vec3(0.62,0.18,0.42);

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float hash21(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  float a=hash21(i),b=hash21(i+vec2(1,0)),c=hash21(i+vec2(0,1)),d=hash21(i+vec2(1,1));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=rot(0.5)*p*2.0+11.3; a*=0.5; } return v; }
float ripples(vec2 uv,float speed,float width,float decay){
  float sum=0.0;
  for(int i=0;i<8;i++){ vec3 c=u_clicks[i]; if(c.z<0.0) continue;
    float age=u_time-c.z; if(age<0.0||age>6.0) continue;
    float d=distance(uv,c.xy); float ring=sin((d-age*speed)*40.0*width);
    float band=smoothstep(width,0.0,abs(d-age*speed));
    sum+=ring*band*exp(-age*decay);
  } return sum;
}

void main(){
  vec2 uv = gl_FragCoord.xy/u_res;
  float asp = u_res.x/u_res.y;
  vec2 p = uv; p.x*=asp;
  vec2 m = u_mouse; m.x*=asp;
  float t = u_time*0.08;

  vec3 col = DARKEST;
  vec2 toM = p-m; float md=length(toM);
  float push = exp(-md*md*2.6);

  float acc=0.0;
  for(int i=0;i<3;i++){
    float fi=float(i);
    float depth=1.0+fi*0.6;
    vec2 q=(p-vec2(0.5*asp,0.5))/depth+vec2(0.5*asp,0.5);
    q+=(m-vec2(0.5*asp,0.5))*(0.05*fi);
    q*=1.7; q.y-=t*(0.6+fi*0.25);
    q+=normalize(toM+1e-4)*push*0.30*(1.0+length(u_mvel)*3.0);
    vec2 w=vec2(fbm(q+vec2(0.0,t)),fbm(q+vec2(3.1,-t)));
    float dens=fbm(q+3.0*w);
    dens=smoothstep(0.32,0.96,dens);
    float layerA=dens*(0.6/depth);
    vec3 lc=mix(PORTAL, ELECTRIC, smoothstep(0.35,1.0,dens));
    lc=mix(lc, EMBER, smoothstep(0.2,0.75,w.x)*0.45);
    col=mix(col, lc, layerA);
    acc+=layerA;
  }

  float g1=exp(-distance(p, vec2(0.70*asp,0.34)+0.10*vec2(sin(t*2.0),cos(t*1.7)))*3.0);
  col += EMBER*g1*0.60*acc;
  float g2=exp(-distance(p, vec2(0.28*asp,0.72)+0.10*vec2(cos(t*1.3),sin(t*1.9)))*3.4);
  col += TEAL*g2*0.42*acc;

  col += (ELECTRIC*0.5+ROBIN*0.32)*push*0.55;
  float r=ripples(p,0.5,0.16,1.0);
  col += (ROBIN*0.55+ELECTRIC*0.45)*max(r,0.0)*0.9;

  col += (hash21(gl_FragCoord.xy+u_time)-0.5)*0.014;
  float vig=smoothstep(1.45,0.2, length(uv-0.5));
  col *= 0.5+0.5*vig;
  gl_FragColor=vec4(col,1.0);
}`;

const VERT = `attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0.0,1.0); }`;

type AuroraCardProps = {
  /** Label engraved on the frame's bottom-right shelf (split by spaces onto stacked lines). */
  title?: string;
  /** Placard line under the card. */
  caption?: string;
};

export function AuroraCard({
  title = "Aurora Field",
  caption = "move to part the smoke · click to bloom",
}: AuroraCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) || "shader compile error");
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const la = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u_res = U("u_res");
    const u_time = U("u_time");
    const u_mouse = U("u_mouse");
    const u_mvel = U("u_mvel");
    const u_mdown = U("u_mdown");
    const u_clicks = U("u_clicks");

    const start = performance.now();
    const mouse = [0.5, 0.55];
    let target = [0.5, 0.55];
    const mvel = [0, 0];
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
      const ox = mouse[0];
      const oy = mouse[1];
      mouse[0] += (target[0] - mouse[0]) * 0.12;
      mouse[1] += (target[1] - mouse[1]) * 0.12;
      mvel[0] = mvel[0] * 0.85 + (mouse[0] - ox) * 0.15;
      mvel[1] = mvel[1] * 0.85 + (mouse[1] - oy) * 0.15;
      mdown += (mdownT - mdown) * 0.1;
      const t = (performance.now() - start) / 1000;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(u_res, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(u_time, t);
      gl.uniform2f(u_mouse, mouse[0], mouse[1]);
      gl.uniform2f(u_mvel, mvel[0], mvel[1]);
      gl.uniform1f(u_mdown, mdown);
      gl.uniform3fv(u_clicks, clicks);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const pointer = (e: { clientX: number; clientY: number }) => {
      const cr = canvas.getBoundingClientRect();
      target = [(e.clientX - cr.left) / cr.width, 1.0 - (e.clientY - cr.top) / cr.height];
      const dr = card.getBoundingClientRect();
      const rx = (e.clientX - dr.left) / dr.width - 0.5;
      const ry = (e.clientY - dr.top) / dr.height - 0.5;
      card.style.transform = `rotateX(${(-ry * 9).toFixed(2)}deg) rotateY(${(rx * 11).toFixed(2)}deg)`;
      render();
    };

    const onPointerMove = (e: PointerEvent) => pointer(e);
    const onPointerLeave = () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    };
    const onPointerDown = (e: PointerEvent) => {
      const cr = canvas.getBoundingClientRect();
      const i = head * 3;
      clicks[i] = (e.clientX - cr.left) / cr.width;
      clicks[i + 1] = 1.0 - (e.clientY - cr.top) / cr.height;
      clicks[i + 2] = (performance.now() - start) / 1000;
      head = (head + 1) % 8;
      mdownT = 1;
      render();
    };
    const onPointerUp = () => {
      mdownT = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) pointer(e.touches[0]);
    };

    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerleave", onPointerLeave);
    card.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    card.addEventListener("touchmove", onTouchMove, { passive: true });

    let raf: number | null = null;
    let visible = true;
    let io: IntersectionObserver | null = null;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) render();
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
          visible = es[0].isIntersecting;
        },
        { threshold: 0.05 },
      );
      io.observe(canvas);
      loop();
    }
    window.addEventListener("resize", onResize);
    render();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
      card.removeEventListener("pointerdown", onPointerDown);
      card.removeEventListener("touchmove", onTouchMove);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    };
  }, []);

  return (
    <div className="ac-stage">
      <div className="ac-spotlight" aria-hidden="true" />
      <div className="ac-card" ref={cardRef}>
        <div className="ac-window">
          <canvas className="ac-gl" ref={canvasRef} />
          <div className="ac-glass" aria-hidden="true" />
        </div>
        <img
          className="ac-frame"
          src={`${import.meta.env.BASE_URL}assets/Ooo-card-frame-AF.png`}
          alt="Aurora Field display card frame"
        />
        <div className="ac-shelf-label" aria-hidden="true">
          {title.split(" ").map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
      </div>
      <div className="ac-placard">
        <b>{caption}</b>
      </div>
    </div>
  );
}

export default AuroraCard;
