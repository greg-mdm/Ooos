import { useEffect, useRef } from "react";

/* ============================================================
   AuroraHeader — calm, lightweight Aurora for the site nav band.

   Deliberately separate from the homepage section's <AuroraField> so it can
   never regress the hero. Slow left->right drift (infinity-pool, non-repeating),
   ~30fps, capped DPR, honours prefers-reduced-motion. The canvas is
   pointer-events:none, so the nav stays fully clickable. If WebGL is
   unavailable it renders nothing and the CSS nav gradient shows through.
   ============================================================ */

const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_dim;
const vec3 DARKEST=vec3(0.035,0.012,0.145);
const vec3 PORTAL=vec3(0.294,0.0,0.714);
const vec3 ELECTRIC=vec3(0.357,0.016,0.871);
const vec3 EMBER=vec3(0.62,0.18,0.42);
const vec3 ROBIN=vec3(0.941,0.957,0.961);
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  float a=hash21(i),b=hash21(i+vec2(1,0)),c=hash21(i+vec2(0,1)),d=hash21(i+vec2(1,1));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p=rot(0.5)*p*2.0+11.3;a*=0.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res; float asp=u_res.x/u_res.y;
  vec2 p=uv; p.x*=asp; vec2 m=u_mouse; m.x*=asp;
  float mt=u_time*0.016;                      // slow in-place morph (keeps it alive)
  float drift=u_time*0.18;                    // continuous left->right travel
  vec3 col=DARKEST;
  vec2 toM=p-m; float push=exp(-dot(toM,toM)*1.1);
  float acc=0.0;
  for(int i=0;i<2;i++){ float fi=float(i); float depth=1.0+fi*0.7;
    vec2 q=p/depth; q*=vec2(0.62,2.0);        // stretch: reads as horizontal flow in a thin band
    q+=(m-vec2(0.5*asp,0.5))*0.025*fi;        // tiny parallax toward cursor
    q.x-=drift*(1.0+fi*0.30);                  // travel; nearer layer a touch faster
    vec2 w=vec2(fbm(q+vec2(0.0,mt)),fbm(q+vec2(3.1,-mt)));
    float dens=fbm(q+1.7*w); dens=smoothstep(0.36,0.95,dens);
    float layerA=dens*(0.62/depth);
    vec3 lc=mix(PORTAL,ELECTRIC,smoothstep(0.30,1.0,dens));
    lc=mix(lc,EMBER,smoothstep(0.35,0.85,w.x)*0.22);
    col=mix(col,lc,layerA); acc+=layerA;
  }
  col+=(ELECTRIC*0.40+ROBIN*0.14)*push*0.32;  // subtle cursor glow
  col+=(hash21(gl_FragCoord.xy+u_time)-0.5)*0.01;
  col*=u_dim;
  gl_FragColor=vec4(col,1.0);
}`;

const VERT = "attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0.0,1.0); }";

export function AuroraHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // no WebGL -> CSS nav gradient remains visible

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const comp = (s: string, t: number) => {
      const o = gl.createShader(t)!;
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
    const u_res = U("u_res"), u_time = U("u_time"), u_mouse = U("u_mouse"), u_dim = U("u_dim");

    const start = performance.now();
    let mouse = [0.5, 0.6];
    let target = [0.5, 0.6];

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
      mouse[0] += (target[0] - mouse[0]) * 0.08;
      mouse[1] += (target[1] - mouse[1]) * 0.08;
      const t = (performance.now() - start) / 1000;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(u_res, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(u_time, t);
      gl.uniform2f(u_mouse, mouse[0], mouse[1]);
      gl.uniform1f(u_dim, 0.92);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // pointer only nudges the glow while the cursor is over the nav band
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) {
        target = [(e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height];
      } else {
        target = [0.5, 0.6];
      }
      if (reduce) render();
    };
    window.addEventListener("pointermove", onMove);

    // ~30fps throttle — a slow pattern doesn't need full rate (keeps cost down)
    const FRAME = 1000 / 30;
    let last = 0;
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last >= FRAME) {
        last = now;
        render();
      }
    };
    if (reduce) {
      resize();
      render();
    } else {
      raf = requestAnimationFrame(loop);
    }
    const onResize = () => {
      resize();
      render();
    };
    window.addEventListener("resize", onResize);
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="nav-bg" aria-hidden="true" />;
}

export default AuroraHeader;
