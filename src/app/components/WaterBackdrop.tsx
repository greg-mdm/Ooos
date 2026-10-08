/* Black water behind the Vivarium tower. A still, dark surface that ripples
   only where and when the visitor moves over it, and settles back to
   stillness within a few seconds. An easter egg, not a feature: it never
   moves on its own, so it never competes with the cards for attention or
   distracts someone who is reading.

   The ripple simulation is Martin Laxenaire's "WebGL water ripples"
   (CodePen, https://codepen.io/martinlaxenaire/pen/OJVKVYa, MIT; Greg's
   download, licence and notes in SPRINT 6/references/water-ripples-
   laxenaire). Laxenaire's pen is itself a port of Liam Egan's
   (@shubniggurath) pen https://codepen.io/shubniggurath/pen/OEeMOd, whose
   fragment shaders it borrows, with a line-distance-field trick from Edan
   Kwan (https://codepen.io/edankwan/pen/YzXgxxr). The pen renders through
   curtains.js; this is the same two-pass ping-pong simulation rewritten
   on plain WebGL so the site adds no library.

   Adaptations for the site: the photograph and the title are gone, the
   surface is matte black with the pen's own lights and shadows on the
   ripples; the simulation runs only while there is energy in the water
   (a few seconds after the last pointer move) and otherwise draws
   nothing, so an idle page costs nothing; it also pauses while off
   screen; reduced motion gets the still surface; and without WebGL the
   ground is simply black. The pointer is read on the whole canopy, so
   moving over a card still ripples the water in the gaps beside it. */
import { useEffect, useRef } from "react";

const SETTLE_MS = 4500;      // how long the water keeps moving after the last touch
const MAX_SIM_HEIGHT = 1536; // cap on the simulation's height in device pixels
const VISCOSITY = 7.5, SPEED = 5, SIZE = 1.25;         // the pen's settings
const LIGHT = 5, SHADOW = 2.5;

const QUAD_VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

// the ripple pass: reads the previous state, draws the pointer's path as a
// line distance field, propagates (after Egan, Laxenaire and Kwan)
const SIM_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uLastMouse;
uniform vec2 uVelocity;
uniform float uTime;
uniform sampler2D uTarget;
uniform float uViscosity;
uniform float uSpeed;
uniform float uSize;
varying vec2 vUv;
float sdLine(vec2 p, vec2 a, vec2 b) {
  float velocity = clamp(length(uVelocity), 0.5, 1.5);
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h) / velocity;
}
void main() {
  float velocity = clamp(length(uVelocity), 0.1, 1.0);
  vec3 speed = vec3(vec2(uSpeed) / uResolution.xy, 0.0);
  vec4 texel = texture2D(uTarget, vUv);
  float shade = smoothstep(0.02 * uSize * velocity, 0.0, sdLine(vUv, uLastMouse, uMouse));
  float d = shade * uViscosity;
  float top = texture2D(uTarget, vUv - speed.zy).x;
  float right = texture2D(uTarget, vUv - speed.xz).x;
  float bottom = texture2D(uTarget, vUv + speed.xz).x;
  float left = texture2D(uTarget, vUv + speed.zy).x;
  d += -(texel.y - 0.5) * 2.0 + (top + right + bottom + left - 2.0);
  d *= 0.99;
  d *= step(5.0, uTime);
  d = d * 0.5 + 0.5;
  gl_FragColor = vec4(d, texel.x, 0.0, 1.0);
}`;

// the draw pass: the pen's bump map, fresnel and light on a matte black
// surface instead of a photograph
const DRAW_FS = `
precision highp float;
uniform sampler2D uRipple;
uniform vec2 uResolution;
uniform float uLight;
uniform float uShadow;
varying vec2 vUv;
const float bias = 0.2;
const float scale = 10.0;
const float power = 10.1;
vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color;
}
float bumpMap(vec2 uv, float height, inout vec3 colormap) {
  vec3 shade = blur5(uRipple, vUv + uv, uResolution, vec2(1.0, 1.0)).rgb;
  colormap = shade;
  return 1.0 - shade.r * height;
}
float bumpMap(vec2 uv, float height) { vec3 c; return bumpMap(uv, height, c); }
vec4 renderPass(vec2 uv, inout float distortion) {
  vec3 surfacePos = vec3(uv, 0.0);
  vec3 ray = normalize(vec3(uv, 1.0));
  vec3 lightPos = vec3(2.0, 3.0, -3.0);
  vec3 normal = vec3(0.0, 0.0, -1.0);
  vec2 sampleDistance = vec2(0.005, 0.0);
  vec3 colormap;
  float fx = bumpMap(sampleDistance.xy, 0.2);
  float fy = bumpMap(sampleDistance.yx, 0.2);
  float f = bumpMap(vec2(0.0), 0.2, colormap);
  distortion = f;
  fx = (fx - f) / sampleDistance.x;
  fy = (fy - f) / sampleDistance.x;
  normal = normalize(normal + vec3(fx, fy, 0.0) * 0.2);
  vec3 lightV = lightPos - surfacePos;
  float lightDist = max(length(lightV), 0.001);
  lightV /= lightDist;
  vec3 lightColor = vec3(1.0 - uLight / 20.0);
  float shininess = 0.1;
  float brightness = 1.0 - uLight / 40.0;
  float falloff = 0.1;
  float attenuation = (0.75 + uLight / 40.0) / (1.0 + lightDist * lightDist * falloff);
  float diffuse = max(dot(normal, lightV), 0.0);
  float specular = pow(max(dot(reflect(-lightV, normal), -ray), 0.0), 15.0) * shininess;
  vec3 texCol = vec3(0.5) * brightness;
  float metalness = (1.0 - colormap.x);
  metalness *= metalness;
  vec3 color = (texCol * (diffuse * vec3(0.9) * 2.0 + 0.5) + lightColor * specular * f * 2.0 * metalness) * attenuation * 2.0;
  return vec4(color, 1.0);
}
void main() {
  float distortion;
  vec4 reflections = renderPass(vUv, distortion);
  vec4 ripples = vec4(0.16);
  ripples += distortion * 0.1 - 0.1;
  ripples += reflections * 0.7;
  // matte black water, a shade off the tower's own black
  vec3 color = vec3(0.043, 0.043, 0.051);
  float lights = max(0.0, ripples.r - 0.5);
  color += lights * (uLight / 10.0);
  float shadow = max(0.0, 1.0 - (ripples.r + 0.5));
  color -= shadow * (uShadow / 10.0);
  gl_FragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}
function program(gl: WebGLRenderingContext, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, QUAD_VS), f = compile(gl, gl.FRAGMENT_SHADER, fs);
  const p = gl.createProgram();
  if (!v || !f || !p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  return p;
}
type Target = { fb: WebGLFramebuffer; tex: WebGLTexture };
function target(gl: WebGLRenderingContext, w: number, h: number): Target | null {
  const tex = gl.createTexture(), fb = gl.createFramebuffer();
  if (!tex || !fb) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // start the water flat: 0.5 is the encoding for "no displacement"
  const flat = new Uint8Array(w * h * 4);
  for (let i = 0; i < flat.length; i += 4) { flat[i] = 128; flat[i + 1] = 128; flat[i + 2] = 0; flat[i + 3] = 255; }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, flat);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, tex };
}

/* scale: the simulation's resolution as a fraction of CSS pixels. Below 1
   the ripples are drawn larger and smoothed on the way up, which softens
   the surface. blur: a further softening of the finished picture, in CSS
   pixels. Both default to the grove's sharp water; the CID hero runs at
   half resolution with a 2px blur (Greg, 2026-10-08: the water looked
   meshy; blur the focus). */
export function WaterBackdrop({ scale = 1, blur = 0 }: { scale?: number; blur?: number } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement?.parentElement; // the canopy
    if (!canvas || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
    if (!gl) return;
    const simProg = program(gl, SIM_FS), drawProg = program(gl, DRAW_FS);
    if (!simProg || !drawProg) return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const sim = {
      res: u(simProg, "uResolution"), mouse: u(simProg, "uMouse"), last: u(simProg, "uLastMouse"), vel: u(simProg, "uVelocity"),
      time: u(simProg, "uTime"), target: u(simProg, "uTarget"), visc: u(simProg, "uViscosity"), speed: u(simProg, "uSpeed"), size: u(simProg, "uSize"),
    };
    const draw = { ripple: u(drawProg, "uRipple"), res: u(drawProg, "uResolution"), light: u(drawProg, "uLight"), shadow: u(drawProg, "uShadow") };

    let w = 0, h = 0, read: Target | null = null, write: Target | null = null;
    let frame = 0, time = 0, lastMove = 0, running = false, onScreen = true;
    const mouse = { x: 0.5, y: 0.5 }, last = { x: 0.5, y: 0.5 }, vel = { x: 0, y: 0 };
    let havePointer = false;

    const size = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1) * scale;
      let cw = Math.max(1, Math.round(r.width * dpr)), ch = Math.max(1, Math.round(r.height * dpr));
      if (ch > MAX_SIM_HEIGHT) { cw = Math.round(cw * MAX_SIM_HEIGHT / ch); ch = MAX_SIM_HEIGHT; }
      if (cw === w && ch === h) return;
      w = cw; h = ch;
      canvas.width = w; canvas.height = h;
      read = target(gl, w, h); write = target(gl, w, h);
      time = 0;
      // paint the still surface once
      present();
    };

    const present = () => {
      if (!read) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, w, h);
      gl.useProgram(drawProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(draw.ripple, 0);
      gl.uniform2f(draw.res, w, h);
      gl.uniform1f(draw.light, LIGHT);
      gl.uniform1f(draw.shadow, SHADOW);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const step = () => {
      frame = 0;
      if (!read || !write) return;
      // simulate into the write target
      gl.bindFramebuffer(gl.FRAMEBUFFER, write.fb);
      gl.viewport(0, 0, w, h);
      gl.useProgram(simProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(sim.target, 0);
      gl.uniform2f(sim.res, w, h);
      gl.uniform2f(sim.mouse, mouse.x, mouse.y);
      gl.uniform2f(sim.last, last.x, last.y);
      gl.uniform2f(sim.vel, vel.x, vel.y);
      gl.uniform1f(sim.time, time);
      gl.uniform1f(sim.visc, VISCOSITY);
      gl.uniform1f(sim.speed, SPEED);
      gl.uniform1f(sim.size, SIZE);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const t = read; read = write; write = t;
      time += 1;
      // the pointer's path has been drawn; let the velocity ease off and
      // make the next path start where this one ended
      vel.x *= 0.9; vel.y *= 0.9;
      last.x = mouse.x; last.y = mouse.y;
      present();
      if (onScreen && performance.now() - lastMove < SETTLE_MS) frame = requestAnimationFrame(step);
      else running = false;
    };

    const wake = () => {
      lastMove = performance.now();
      if (!running && onScreen) { running = true; frame = requestAnimationFrame(step); }
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      if (havePointer) {
        last.x = mouse.x; last.y = mouse.y;
        vel.x = (x - mouse.x) * w / 16; vel.y = (y - mouse.y) * h / 16;
      } else {
        last.x = x; last.y = y; vel.x = 0; vel.y = 0; havePointer = true;
      }
      mouse.x = x; mouse.y = y;
      wake();
    };
    const onLeave = () => { havePointer = false; };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && performance.now() - lastMove < SETTLE_MS) wake();
    }, { threshold: 0 });
    io.observe(host);
    const ro = new ResizeObserver(() => size());
    ro.observe(host);
    size();
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scale]);

  return (
    <div className="cid-viv-water" aria-hidden="true">
      <canvas ref={ref} className="cid-viv-water__canvas" style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined} />
    </div>
  );
}
