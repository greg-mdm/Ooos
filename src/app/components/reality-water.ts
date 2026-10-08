/* The water under the Reality / Hyperreality slider (RealitySlider.tsx).

   The ripple pass is the one behind the Vivarium tower (WaterBackdrop.tsx):
   the two-pass ping-pong simulation from Martin Laxenaire's "WebGL water
   ripples" (CodePen, MIT), after Liam Egan and Edan Kwan; the credit chain
   and Chicago references are in SPRINT 6/references/water-ripples-laxenaire/
   NOTES.md. The draw pass here does what Laxenaire's original did and the
   tower's port does not: it refracts a photograph through the ripples. Two
   photographs, in fact: one shows at rest, and the crests of a touch let the
   other show through. On a change of state the photograph sinks into black
   water, troughs first, and the other surfaces.

   This file is the engine from Claude Design's export of 2026-10-08 ("Reality
   Slider - ooos.html", kept in SPRINT 6/references/reality-slider-claude-
   design/), typed, with the two image sources passed in rather than read
   from window. The water runs only while it has energy, a few seconds after
   the last pointer move, pauses off screen, and is skipped altogether for
   reduced motion or without WebGL (the caller keeps the images). */

const SETTLE_MS = 4500;  // how long the water keeps moving after the last touch
const CALM_MS = 900;     // the last stretch of the settle, where the reveal eases out
const MAX_SIM_HEIGHT = 1024;
const VISCOSITY = 7.5, SPEED = 5, SIZE = 1.25; // the pen's settings
const LIGHT = 5, SHADOW = 2.5, REFRACT = 1.5;
const SINK_MS = 650, HOLD_MS = 300, SURFACE_MS = 1000; // the change of state

const QUAD_VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

// the ripple pass, unchanged from WaterBackdrop
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

// the draw pass: the pen's bump map and lights, refracting the photographs
const DRAW_FS = `
precision highp float;
uniform sampler2D uRipple;
uniform sampler2D uReal;
uniform sampler2D uHyper;
uniform vec2 uResolution;
uniform float uLight;
uniform float uShadow;
uniform float uShow;
uniform float uVeil;
uniform float uRefract;
uniform float uEnergy;
uniform vec3 uInk;
varying vec2 vUv;
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
// the surface height, smoothed over a few texels so 8-bit steps never show
float height(vec2 uv) {
  vec2 o = 2.0 / uResolution;
  float s = texture2D(uRipple, uv).r * 4.0;
  s += texture2D(uRipple, uv + vec2(o.x, 0.0)).r + texture2D(uRipple, uv - vec2(o.x, 0.0)).r;
  s += texture2D(uRipple, uv + vec2(0.0, o.y)).r + texture2D(uRipple, uv - vec2(0.0, o.y)).r;
  s += texture2D(uRipple, uv + o).r + texture2D(uRipple, uv - o).r;
  s += texture2D(uRipple, uv + vec2(o.x, -o.y)).r + texture2D(uRipple, uv - vec2(o.x, -o.y)).r;
  return s / 12.0 - 0.5;
}
void main() {
  float distortion;
  vec4 reflections = renderPass(vUv, distortion);
  vec4 ripples = vec4(0.16);
  ripples += distortion * 0.1 - 0.1;
  ripples += reflections * 0.7;

  // refraction: bend the photographs along the slope of the surface
  vec2 px = 4.0 / uResolution;
  vec2 slope = vec2(height(vUv + vec2(px.x, 0.0)) - height(vUv - vec2(px.x, 0.0)),
                    height(vUv + vec2(0.0, px.y)) - height(vUv - vec2(0.0, px.y)));
  vec2 uv = clamp(vUv + slope * uRefract * 0.035 * uEnergy, 0.0, 1.0);

  // where the water moves: a soft mask from the local wave height
  vec2 r = 7.0 / uResolution;
  float amp = abs(height(vUv)) + abs(height(vUv + vec2(r.x, 0.0))) + abs(height(vUv - vec2(r.x, 0.0)))
            + abs(height(vUv + vec2(0.0, r.y))) + abs(height(vUv - vec2(0.0, r.y)));
  float water = smoothstep(0.02, 0.2, amp) * uEnergy;
  float hv = height(vUv);
  float crest = smoothstep(0.004, 0.05, abs(hv)) * uEnergy;
  float trough = smoothstep(0.0, 0.06, -hv) * uEnergy;

  // one photograph at a time; the crests of a touch show the other one
  float m = mix(uShow, 1.0 - uShow, crest * (1.0 - uVeil));
  vec3 photo = mix(texture2D(uReal, uv).rgb, texture2D(uHyper, uv).rgb, m);
  // on a change of state the photograph sinks into black water, troughs first
  float veil = smoothstep(0.0, 1.0, clamp(uVeil * 1.2 - hv * 3.0 * uVeil, 0.0, 1.0));
  vec3 color = mix(photo, uInk, veil);
  color = mix(color, uInk, clamp(water * 0.3 + trough * 0.45, 0.0, 0.8));

  // the pen's fake lights and shadows wherever the surface is water
  float wet = max(water, uVeil * uEnergy);
  float lights = max(0.0, ripples.r - 0.5);
  color += lights * (uLight / 10.0) * wet * 0.6;
  float shadow = max(0.0, 1.0 - (ripples.r + 0.5));
  color -= shadow * (uShadow / 10.0) * wet;
  gl_FragColor = vec4(color, 1.0);
}`;




function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
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
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}
function texParams(gl: WebGLRenderingContext) {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
function flat(w: number, h: number) {
  // 0.5 is the encoding for "no displacement"
  const a = new Uint8Array(w * h * 4);
  for (let i = 0; i < a.length; i += 4) { a[i] = 128; a[i + 1] = 128; a[i + 3] = 255; }
  return a;
}
function target(gl: WebGLRenderingContext, w: number, h: number, data: Uint8Array) {
  const tex = gl.createTexture(), fb = gl.createFramebuffer();
  if (!tex || !fb) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  texParams(gl);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, tex };
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}



/* The water: a still surface showing the mix until the pointer moves over
   it. Returns null when WebGL is missing, so the caller keeps the images. */
export function createWater(canvas: HTMLCanvasElement, host: HTMLElement, realSrc: string, hyperSrc: string, onReady: () => void): Water | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const simProg = program(gl, SIM_FS), drawProg = program(gl, DRAW_FS);
  if (!simProg || !drawProg) return null;

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const u = (p, n) => gl.getUniformLocation(p, n);
  const sim = {
    res: u(simProg, "uResolution"), mouse: u(simProg, "uMouse"), last: u(simProg, "uLastMouse"), vel: u(simProg, "uVelocity"),
    time: u(simProg, "uTime"), target: u(simProg, "uTarget"), visc: u(simProg, "uViscosity"), speed: u(simProg, "uSpeed"), size: u(simProg, "uSize"),
  };
  const draw = {
    ripple: u(drawProg, "uRipple"), real: u(drawProg, "uReal"), hyper: u(drawProg, "uHyper"), res: u(drawProg, "uResolution"),
    light: u(drawProg, "uLight"), shadow: u(drawProg, "uShadow"), show: u(drawProg, "uShow"), veil: u(drawProg, "uVeil"), refract: u(drawProg, "uRefract"),
    energy: u(drawProg, "uEnergy"), ink: u(drawProg, "uInk"),
  };

  let w = 0, h = 0, read = null, write = null, still = null;
  let photos = null;
  let frame = 0, time = 0, lastMove = -Infinity, running = false, onScreen = true, dead = false, showValue = 0, veilValue = 0, havePointer = false, stirFrame = 0;
  const mouse = { x: 0.5, y: 0.5 }, last = { x: 0.5, y: 0.5 }, vel = { x: 0, y: 0 };

  const photoTexture = (img) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    texParams(gl);
    return tex;
  };

  const energy = () => Math.max(0, Math.min(1, (SETTLE_MS - (performance.now() - lastMove)) / CALM_MS));

  const present = () => {
    if (!read || !photos) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(drawProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, read.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, photos[0]);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, photos[1]);
    gl.uniform1i(draw.ripple, 0); gl.uniform1i(draw.real, 1); gl.uniform1i(draw.hyper, 2);
    gl.uniform2f(draw.res, w, h);
    gl.uniform1f(draw.light, LIGHT);
    gl.uniform1f(draw.shadow, SHADOW);
    gl.uniform1f(draw.show, showValue);
    gl.uniform1f(draw.veil, veilValue);
    gl.uniform1f(draw.refract, REFRACT);
    gl.uniform1f(draw.energy, running ? energy() : 0);
    gl.uniform3f(draw.ink, 6 / 255, 2 / 255, 28 / 255); // abalone black, Darkest Indigo #06021C
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // settle back to a perfectly still surface
  const flatten = () => {
    if (!read || !write || !still) return;
    for (const t of [read, write]) {
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, still);
    }
    time = 0;
  };

  let announced = false;
  const size = () => {
    const r = host.getBoundingClientRect();
    // not laid out yet: keep the canvas hidden until it has a real size
    if (r.width < 2 || r.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.max(1, Math.round(r.width * dpr)), ch = Math.max(1, Math.round(r.height * dpr));
    if (cw !== canvas.width || ch !== canvas.height) { canvas.width = cw; canvas.height = ch; }
    // the simulation runs at CSS pixels, like the site's water
    let sw = Math.max(1, Math.round(r.width)), sh = Math.max(1, Math.round(r.height));
    if (sh > MAX_SIM_HEIGHT) { sw = Math.round(sw * MAX_SIM_HEIGHT / sh); sh = MAX_SIM_HEIGHT; }
    if (sw !== w || sh !== h) {
      w = sw; h = sh;
      still = flat(w, h);
      read = target(gl, w, h, still); write = target(gl, w, h, still);
      time = 0;
    }
    present();
    if (!announced && photos) { announced = true; onReady(); }
  };

  const step = () => {
    frame = 0;
    if (dead || !read || !write) return;
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
    vel.x *= 0.9; vel.y *= 0.9;
    last.x = mouse.x; last.y = mouse.y;
    if (onScreen && performance.now() - lastMove < SETTLE_MS) {
      present();
      frame = requestAnimationFrame(step);
    } else {
      running = false;
      if (performance.now() - lastMove >= SETTLE_MS) flatten();
      present();
    }
  };

  const wake = () => {
    lastMove = performance.now();
    if (!running && onScreen && photos) { running = true; frame = requestAnimationFrame(step); }
  };

  const onMove = (e) => {
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
  const ro = new ResizeObserver(() => size());

  Promise.all([loadImage(realSrc), loadImage(hyperSrc)]).then(([a, b]) => {
    if (dead) return;
    photos = [photoTexture(a), photoTexture(b)];
    io.observe(host);
    ro.observe(host);
    size();
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    requestAnimationFrame(() => { if (!dead) size(); });
  }).catch(() => { /* the images stay; no water */ });

  // a change of state stirs the water: a wake drawn across the frame
  const stir = (dir, ms) => {
    if (!photos) return;
    cancelAnimationFrame(stirFrame);
    const t0 = performance.now();
    havePointer = false;
    const tick = (now) => {
      if (dead) return;
      const t = Math.min(1, (now - t0) / ms);
      const x = dir > 0 ? 0.1 + 0.8 * t : 0.9 - 0.8 * t;
      const y = 0.5 + 0.18 * Math.sin(t * Math.PI * 2.5);
      if (havePointer) {
        last.x = mouse.x; last.y = mouse.y;
        vel.x = (x - mouse.x) * w / 16; vel.y = (y - mouse.y) * h / 16;
      } else { last.x = x; last.y = y; havePointer = true; }
      mouse.x = x; mouse.y = y;
      wake();
      stirFrame = t < 1 ? requestAnimationFrame(tick) : 0;
      if (!stirFrame) havePointer = false;
    };
    stirFrame = requestAnimationFrame(tick);
  };

  return {
    setView(show, veil) { showValue = show; veilValue = veil; if (!running) present(); },
    stir,
    destroy() {
      dead = true;
      cancelAnimationFrame(stirFrame);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    },
  };
}



export type Water = {
  /* which photograph shows (0 reality, 1 hyperreality) and how far it has
     sunk into the water (0 surfaced, 1 under) */
  setView(show: number, veil: number): void;
  /* a change of state draws a wake across the frame, left to right for
     dir > 0, over ms milliseconds */
  stir(dir: number, ms: number): void;
  destroy(): void;
};
