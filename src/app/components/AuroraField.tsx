import { useEffect, useRef } from "react";

/* ============================================================
   AuroraField — de-blued, interactive Aurora shader on a <canvas>.
   Reusable background layer: section backgrounds, the display card,
   and the design-system display case all mount this.

   - pointer-events:none by default, so content above stays clickable.
   - tracks the pointer at the window level (works behind cards).
   - click-to-bloom fires on empty background only (never on .ood-* cards).
   - pauses when offscreen (IntersectionObserver) and honours
     prefers-reduced-motion (renders a single static frame).
   ============================================================ */

const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform vec2 u_mvel;
uniform vec3 u_clicks[8];
uniform float u_dim;
const vec3 DARKEST=vec3(0.024,0.008,0.110);
const vec3 PORTAL=vec3(0.294,0.000,0.714);
const vec3 ELECTRIC=vec3(0.357,0.016,0.871);
const vec3 TEAL=vec3(0.000,0.502,0.502);
const vec3 ROBIN=vec3(0.941,0.957,0.961);
const vec3 EMBER=vec3(0.62,0.18,0.42);
mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float hash21(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  float a=hash21(i),b=hash21(i+vec2(1,0)),c=hash21(i+vec2(0,1)),d=hash21(i+vec2(1,1));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=rot(0.5)*p*2.0+11.3; a*=0.5; } return v; }
float ripples(vec2 uv,float sp,float wd,float dc){ float s=0.0;
  for(int i=0;i<8;i++){ vec3 c=u_clicks[i]; if(c.z<0.0) continue; float age=u_time-c.z;
    if(age<0.0||age>6.0) continue; float d=distance(uv,c.xy);
    float ring=sin((d-age*sp)*40.0*wd); float band=smoothstep(wd,0.0,abs(d-age*sp));
    s+=ring*band*exp(-age*dc); } return s; }
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y;
  vec2 p=uv; p.x*=asp; vec2 m=u_mouse; m.x*=asp; float t=u_time*0.07;
  vec3 col=DARKEST; vec2 toM=p-m; float md=length(toM); float push=exp(-md*md*2.4);
  float acc=0.0;
  for(int i=0;i<3;i++){ float fi=float(i); float depth=1.0+fi*0.6;
    vec2 q=(p-vec2(0.5*asp,0.5))/depth+vec2(0.5*asp,0.5);
    q+=(m-vec2(0.5*asp,0.5))*(0.045*fi); q*=1.7; q.y-=t*(0.6+fi*0.25);
    q+=normalize(toM+1e-4)*push*0.26*(1.0+length(u_mvel)*3.0);
    vec2 w=vec2(fbm(q+vec2(0.0,t)),fbm(q+vec2(3.1,-t)));
    float dens=fbm(q+3.0*w); dens=smoothstep(0.32,0.96,dens);
    float layerA=dens*(0.55/depth);
    vec3 lc=mix(PORTAL,ELECTRIC,smoothstep(0.35,1.0,dens));
    lc=mix(lc,EMBER,smoothstep(0.2,0.75,w.x)*0.45);
    col=mix(col,lc,layerA); acc+=layerA; }
  float g1=exp(-distance(p,vec2(0.72*asp,0.30)+0.10*vec2(sin(t*2.0),cos(t*1.7)))*2.8);
  col+=EMBER*g1*0.55*acc;
  float g2=exp(-distance(p,vec2(0.26*asp,0.74)+0.10*vec2(cos(t*1.3),sin(t*1.9)))*3.2);
  col+=TEAL*g2*0.40*acc;
  col+=(ELECTRIC*0.45+ROBIN*0.28)*push*0.5;
  float r=ripples(p,0.5,0.16,1.0);
  col+=(ROBIN*0.5+ELECTRIC*0.45)*max(r,0.0)*0.8;
  col+=(hash21(gl_FragCoord.xy+u_time)-0.5)*0.012;
  col*=u_dim;
  gl_FragColor=vec4(col,1.0);
}`;

const VERT = "attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0.0,1.0); }";

type Props = {
  /** overall brightness multiplier (background use is dimmed) */
  dim?: number;
  /** CSS selector for elements that should NOT trigger a click-bloom */
  ignoreClicksOn?: string;
  className?: string;
};

export function AuroraField({ dim = 0.82, ignoreClicksOn = ".ood-col", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const comp = (s: string, type: number) => {
      const o = gl.createShader(type)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(o) || "shader compile failed");
      }
      return o;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, comp(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, comp(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const la = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u_res = U("u_res"),
      u_time = U("u_time"),
      u_mouse = U("u_mouse"),
      u_mvel = U("u_mvel"),
      u_clicks = U("u_clicks"),
      u_dim = U("u_dim");

    const start = performance.now();
    let mouse = [0.5, 0.5];
    let target = [0.5, 0.5];
    let mvel = [0, 0];
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
      const ox = mouse[0],
        oy = mouse[1];
      mouse[0] += (target[0] - mouse[0]) * 0.1;
      mouse[1] += (target[1] - mouse[1]) * 0.1;
      mvel[0] = mvel[0] * 0.85 + (mouse[0] - ox) * 0.15;
      mvel[1] = mvel[1] * 0.85 + (mouse[1] - oy) * 0.15;
      const t = (performance.now() - start) / 1000;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(u_res, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(u_time, t);
      gl.uniform2f(u_mouse, mouse[0], mouse[1]);
      gl.uniform2f(u_mvel, mvel[0], mvel[1]);
      gl.uniform3fv(u_clicks, clicks);
      gl.uniform1f(u_dim, dim);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target = [(e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height];
      if (reduce) render();
    };
    const onDown = (e: PointerEvent) => {
      if (ignoreClicksOn && (e.target as Element)?.closest?.(ignoreClicksOn)) return;
      const r = canvas.getBoundingClientRect();
      const i = head * 3;
      clicks[i] = (e.clientX - r.left) / r.width;
      clicks[i + 1] = 1.0 - (e.clientY - r.top) / r.height;
      clicks[i + 2] = (performance.now() - start) / 1000;
      head = (head + 1) % 8;
      if (reduce) render();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    let raf = 0;
    let vis = true;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (vis) render();
    };
    const io = new IntersectionObserver((es) => (vis = es[0].isIntersecting), { threshold: 0.02 });
    if (reduce) {
      resize();
      render();
    } else {
      io.observe(canvas);
      loop();
    }
    const onResize = () => {
      resize();
      render();
    };
    window.addEventListener("resize", onResize);
    render();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, [dim, ignoreClicksOn]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

export default AuroraField;
