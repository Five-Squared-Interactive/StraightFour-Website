import{o as e,t}from"./math.vector.pure-fvrN3Uzg.js";import{t as n}from"./shaderStore-D-XQlhUT.js";import{t as r}from"./math.frustum-W9T6XWut.js";import{n as i}from"./baseTexture.pure-D6W7skrN.js";import{t as a}from"./postProcess.pure-BL5YG0qf.js";import{Gt as o,j as s}from"./index-CPmGphPB.js";import"./materialPluginBase-ZibIdS7N.js";import{t as c}from"./shaderLanguage-CsgORKnQ.js";import{t as l}from"./materialArrivals-BgDToscV.js";import{r as u,t as d}from"./awayMaterials-BFHT3hIB.js";import{n as f,t as p}from"./depthRenderer.pure-kX8FLa3p.js";import{t as ee}from"./cutoutDepth-DdGkemvg.js";import"./postProcess-B4iOlIzR.js";import{d as m,f as h,l as g,m as te,p as _,u as v}from"./planetSystem-BgretWny.js";f(p);var y=`waterEye.waterCentre.waterSun.waterZenith.waterTowardSun.waterAwaySun.waterGlint.waterStrength.waterRipple.waterTime.waterWaveOrigin.waterWaveEast.waterWaveNorth.waterWaves.waterWaveLength.waterWaveReach.waterWaveBearing.waterTide.waterTideRange.waterShallowFall.waterClarity.waterScreen.waterForward.waterFoam.waterFoamWidth.waterCaustics.waterUnder.waterEyeUnder.waterFocal.waterFogDensity.mirrorNow.mirrorBefore.mirrorStrength.mirrorSteps.mirrorGrowth.mirrorFirst`.split(`.`),b=e=>Number.isInteger(e)?e.toFixed(1):String(e),x=`#ifdef WATERREFLECT
uniform vec3 waterEye;
uniform vec3 waterCentre;
uniform vec3 waterSun;
uniform vec3 waterZenith;
uniform vec3 waterTowardSun;
uniform vec3 waterAwaySun;
uniform vec3 waterGlint;
uniform float waterStrength;
uniform float waterRipple;
uniform float waterTime;
uniform vec3 waterWaveOrigin;
uniform vec3 waterWaveEast;
uniform vec3 waterWaveNorth;
uniform float waterWaves;
uniform float waterWaveLength;
uniform float waterWaveReach;
uniform float waterWaveBearing;
uniform float waterTide;
uniform float waterTideRange;
uniform float waterShallowFall;
uniform float waterClarity;
uniform vec2 waterScreen;
uniform vec3 waterForward;
uniform float waterFoam;
uniform float waterFoamWidth;
uniform float waterCaustics;
uniform vec3 waterUnder;
uniform float waterEyeUnder;
uniform float waterFocal;
uniform float waterFogDensity;
uniform mat4 mirrorNow;
uniform mat4 mirrorBefore;
uniform float mirrorStrength;
uniform float mirrorSteps;
uniform float mirrorGrowth;
uniform float mirrorFirst;
#endif
`,S=`#ifdef WATERREFLECT
uniform waterEye: vec3f;
uniform waterCentre: vec3f;
uniform waterSun: vec3f;
uniform waterZenith: vec3f;
uniform waterTowardSun: vec3f;
uniform waterAwaySun: vec3f;
uniform waterGlint: vec3f;
uniform waterStrength: f32;
uniform waterRipple: f32;
uniform waterTime: f32;
uniform waterWaveOrigin: vec3f;
uniform waterWaveEast: vec3f;
uniform waterWaveNorth: vec3f;
uniform waterWaves: f32;
uniform waterWaveLength: f32;
uniform waterWaveReach: f32;
uniform waterWaveBearing: f32;
uniform waterTide: f32;
uniform waterTideRange: f32;
uniform waterShallowFall: f32;
uniform waterClarity: f32;
uniform waterScreen: vec2f;
uniform waterForward: vec3f;
uniform waterFoam: f32;
uniform waterFoamWidth: f32;
uniform waterCaustics: f32;
uniform waterUnder: vec3f;
uniform waterEyeUnder: f32;
uniform waterFocal: f32;
uniform waterFogDensity: f32;
uniform mirrorNow: mat4x4f;
uniform mirrorBefore: mat4x4f;
uniform mirrorStrength: f32;
uniform mirrorSteps: f32;
uniform mirrorGrowth: f32;
uniform mirrorFirst: f32;
#endif
`,C=`#ifdef WATERDEPTH
uniform sampler2D waterDepthMap;
#endif
#ifdef WATERMIRROR
uniform sampler2D waterMirrorFrame;
#endif
`,w=`#ifdef WATERDEPTH
var waterDepthMapSampler: sampler;
var waterDepthMap: texture_2d<f32>;
#endif
#ifdef WATERMIRROR
var waterMirrorFrameSampler: sampler;
var waterMirrorFrame: texture_2d<f32>;
#endif
`;function T(){let e=m.map(([e,t,n,r])=>`  { float len = waterWaveLength * ${b(e)}; float k = 6.2831853 / len; h += ${b(n)} * len * sin(k * dot(rel, waterDir(${b(t)})) - sqrt(9.81 * k) * waterTime + ${b(r)}); }`).join(`
`),t=m.map(([e,t,n,r])=>`  { float len = waterWaveLength * ${b(e)}; float k = 6.2831853 / len; vec3 d = waterDir(${b(t)}); s += d * (${b(n)} * len * k * cos(k * dot(rel, d) - sqrt(9.81 * k) * waterTime + ${b(r)}) * waterSeen(len, distance)); }`).join(`
`),n=g.map(([e,t,n,r])=>`  { float k = 6.2831853 / ${b(e)}; vec3 d = waterDir(${b(t)}); s += d * (${b(n)} * cos(k * dot(rel, d) - sqrt(9.81 * k) * waterTime + ${b(r)}) * waterSeen(${b(e)}, distance)); }`).join(`
`);return`
// A bearing, degrees clockwise from north off the swell's own, as a direction along the water.
vec3 waterDir(float offsetDeg) {
  float b = waterWaveBearing + radians(offsetDeg);
  return waterWaveNorth * cos(b) + waterWaveEast * sin(b);
}
// How much of a wave this long is left seen from this far: all close to, less as a pixel grows to span it.
float waterSeen(float len, float distance) {
  float r = distance * 0.0025 / len;
  return 1.0 / (1.0 + r * r);
}
float waterSwellHeight(vec3 p) {
  if (waterWaves <= 0.0) return 0.0;
  vec3 rel = p - waterWaveOrigin;
  float h = 0.0;
${e}
  return h * waterWaves;
}
float waterSwellCrest() {
  return waterWaves <= 0.0 ? 0.0 : ${b(h)} * waterWaveLength * waterWaves;
}
// The swell's share left as the tide falls, so the two together sink the water no further than the deeper of them alone.
float waterSwellShare(float tide) {
  float trough = 2.0 * waterSwellCrest();
  if (trough <= 0.0) return 1.0;
  return clamp((max(waterTideRange, trough) + tide) / trough, 0.0, 1.0);
}
// How far the surface stands under its drawn level: the tide, and the swell with its crests at that level, close to the eye; far water lies at its drawn level.
// Where its depth to its bed is known (bed, metres; under 0 where not), it falls at most a share of it.
float waterRaiseAt(vec3 p, float distance, float bed) {
  float tide = waterTide * (1.0 - smoothstep(300.0, 1000.0, distance));
  float raise = tide + (waterSwellHeight(p) - waterSwellCrest()) * waterSwellShare(tide) * (1.0 - smoothstep(0.4 * waterWaveReach, waterWaveReach, distance));
  float most = max(waterTideRange, 2.0 * waterSwellCrest());
  return bed < 0.0 || most <= 0.0 ? raise : raise * clamp(waterShallowFall * bed / most, 0.0, 1.0);
}
vec3 waterSwellSlope(vec3 p, float distance) {
  vec3 s = vec3(0.0);
  if (waterWaves <= 0.0) return s;
  vec3 rel = p - waterWaveOrigin;
${t}
  return s * waterWaves;
}
vec3 waterRippleSlope(vec3 p, float distance) {
  vec3 s = vec3(0.0);
  if (waterRipple <= 0.0) return s;
  vec3 rel = p - waterWaveOrigin;
${n}
  return s * waterRipple;
}`}function E(){let e=m.map(([e,t,n,r])=>`  { let len = uniforms.waterWaveLength * ${b(e)}; let k = 6.2831853 / len; h += ${b(n)} * len * sin(k * dot(rel, waterDir(${b(t)})) - sqrt(9.81 * k) * uniforms.waterTime + ${b(r)}); }`).join(`
`),t=m.map(([e,t,n,r])=>`  { let len = uniforms.waterWaveLength * ${b(e)}; let k = 6.2831853 / len; let d = waterDir(${b(t)}); s += d * (${b(n)} * len * k * cos(k * dot(rel, d) - sqrt(9.81 * k) * uniforms.waterTime + ${b(r)}) * waterSeen(len, distance)); }`).join(`
`),n=g.map(([e,t,n,r])=>`  { let k = 6.2831853 / ${b(e)}; let d = waterDir(${b(t)}); s += d * (${b(n)} * cos(k * dot(rel, d) - sqrt(9.81 * k) * uniforms.waterTime + ${b(r)}) * waterSeen(${b(e)}, distance)); }`).join(`
`);return`
fn waterDir(offsetDeg: f32) -> vec3f {
  let b = uniforms.waterWaveBearing + radians(offsetDeg);
  return uniforms.waterWaveNorth * cos(b) + uniforms.waterWaveEast * sin(b);
}
fn waterSeen(len: f32, distance: f32) -> f32 {
  let r = distance * 0.0025 / len;
  return 1.0 / (1.0 + r * r);
}
fn waterSwellHeight(p: vec3f) -> f32 {
  if (uniforms.waterWaves <= 0.0) { return 0.0; }
  let rel = p - uniforms.waterWaveOrigin;
  var h: f32 = 0.0;
${e}
  return h * uniforms.waterWaves;
}
fn waterSwellCrest() -> f32 {
  if (uniforms.waterWaves <= 0.0) { return 0.0; }
  return ${b(h)} * uniforms.waterWaveLength * uniforms.waterWaves;
}
fn waterSwellShare(tide: f32) -> f32 {
  let trough = 2.0 * waterSwellCrest();
  if (trough <= 0.0) { return 1.0; }
  return clamp((max(uniforms.waterTideRange, trough) + tide) / trough, 0.0, 1.0);
}
fn waterRaiseAt(p: vec3f, distance: f32, bed: f32) -> f32 {
  let tide = uniforms.waterTide * (1.0 - smoothstep(300.0, 1000.0, distance));
  let raise = tide + (waterSwellHeight(p) - waterSwellCrest()) * waterSwellShare(tide) * (1.0 - smoothstep(0.4 * uniforms.waterWaveReach, uniforms.waterWaveReach, distance));
  let most = max(uniforms.waterTideRange, 2.0 * waterSwellCrest());
  if (bed < 0.0 || most <= 0.0) { return raise; }
  return raise * clamp(uniforms.waterShallowFall * bed / most, 0.0, 1.0);
}
fn waterSwellSlope(p: vec3f, distance: f32) -> vec3f {
  var s = vec3f(0.0);
  if (uniforms.waterWaves <= 0.0) { return s; }
  let rel = p - uniforms.waterWaveOrigin;
${t}
  return s * uniforms.waterWaves;
}
fn waterRippleSlope(p: vec3f, distance: f32) -> vec3f {
  var s = vec3f(0.0);
  if (uniforms.waterRipple <= 0.0) { return s; }
  let rel = p - uniforms.waterWaveOrigin;
${n}
  return s * uniforms.waterRipple;
}`}var D=v,O=`
// A cell's random number, 0 to 1, and a second one.
float waterHash(vec2 c) {
  return fract(sin(c.x * 127.1 + c.y * 311.7) * 43758.5453);
}
vec2 waterHash2(vec2 c) {
  return vec2(waterHash(c), fract(sin(c.x * 269.5 + c.y * 183.3) * 43758.5453));
}
float waterValueNoise(vec2 q) {
  vec2 i = floor(q);
  vec2 f = q - i;
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(waterHash(i), waterHash(i + vec2(1.0, 0.0)), u.x), mix(waterHash(i + vec2(0.0, 1.0)), waterHash(i + vec2(1.0, 1.0)), u.x), u.y);
}
// The foam's breakup, drifting with the waves' clock.
float waterFoamNoise(vec2 q, float t) {
  return 0.65 * waterValueNoise(q * 2.3 + vec2(t * 0.15, 0.0)) + 0.35 * waterValueNoise(q * 5.9 + vec2(-t * 0.23, t * 0.11));
}
// How much foam lies on water this deep: whole at the waterline, breaking into patches toward the band's edge.
float waterFoamAt(float depth, float foam, float width, float swell, float noise, float distance) {
  if (foam <= 0.0 || depth < 0.0) return 0.0;
  float w = max(1e-3, width * (1.0 + ${b(D.foamSwellBreath)} * swell));
  float t = min(1.0, depth / w);
  return min(1.0, foam * smoothstep(t, t + ${b(D.foamSoft)}, noise)) * (1.0 - smoothstep(${b(D.foamFromM)}, ${b(D.foamToM)}, distance));
}
// One web of the caustics: the edges between moving cells, warped so they do not lie straight.
float waterCausticWeb(vec2 q, float t) {
  vec2 p = q + 0.25 * vec2(sin(q.y * 1.7 + t * 0.8), sin(q.x * 1.9 - t * 0.6));
  vec2 c = floor(p);
  vec2 fr = p - c;
  float d1 = 8.0;
  float d2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 h = waterHash2(c + o);
      vec2 pt = o + 0.5 + 0.4 * sin(t * (0.6 + 0.5 * h) + 6.2831 * h);
      float d = length(pt - fr);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
  }
  return exp(-(d2 - d1) * ${b(D.causticSharpness)});
}
// The sun's caustics on a bed: two webs of different sizes, moving at different speeds, laid over each other.
float waterCausticPattern(vec2 xy, float t) {
  vec2 q = xy / ${b(D.causticCellM)};
  return min(1.0, 0.7 * (waterCausticWeb(q, t) + waterCausticWeb(q * 1.6 + vec2(3.1, 7.7), t * 1.3)));
}
// How much of the caustics shows on a bed this deep, seen from this far.
float waterCausticFade(float under, float far) {
  if (under <= 0.0) return 0.0;
  return smoothstep(0.0, ${b(D.causticShallowM)}, under) * exp(under * (-1.0 / ${b(D.causticDepthM)})) * (1.0 - smoothstep(${b(D.causticFromM)}, ${b(D.causticToM)}, far));
}`,k=`
fn waterHash(c: vec2f) -> f32 {
  return fract(sin(c.x * 127.1 + c.y * 311.7) * 43758.5453);
}
fn waterHash2(c: vec2f) -> vec2f {
  return vec2f(waterHash(c), fract(sin(c.x * 269.5 + c.y * 183.3) * 43758.5453));
}
fn waterValueNoise(q: vec2f) -> f32 {
  let i = floor(q);
  let f = q - i;
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(waterHash(i), waterHash(i + vec2f(1.0, 0.0)), u.x), mix(waterHash(i + vec2f(0.0, 1.0)), waterHash(i + vec2f(1.0, 1.0)), u.x), u.y);
}
fn waterFoamNoise(q: vec2f, t: f32) -> f32 {
  return 0.65 * waterValueNoise(q * 2.3 + vec2f(t * 0.15, 0.0)) + 0.35 * waterValueNoise(q * 5.9 + vec2f(-t * 0.23, t * 0.11));
}
fn waterFoamAt(depth: f32, foam: f32, width: f32, swell: f32, noise: f32, distance: f32) -> f32 {
  if (foam <= 0.0 || depth < 0.0) { return 0.0; }
  let w = max(1e-3, width * (1.0 + ${b(D.foamSwellBreath)} * swell));
  let t = min(1.0, depth / w);
  return min(1.0, foam * smoothstep(t, t + ${b(D.foamSoft)}, noise)) * (1.0 - smoothstep(${b(D.foamFromM)}, ${b(D.foamToM)}, distance));
}
fn waterCausticWeb(q: vec2f, t: f32) -> f32 {
  let p = q + 0.25 * vec2f(sin(q.y * 1.7 + t * 0.8), sin(q.x * 1.9 - t * 0.6));
  let c = floor(p);
  let fr = p - c;
  var d1: f32 = 8.0;
  var d2: f32 = 8.0;
  for (var j: i32 = -1; j <= 1; j++) {
    for (var i: i32 = -1; i <= 1; i++) {
      let o = vec2f(f32(i), f32(j));
      let h = waterHash2(c + o);
      let pt = o + 0.5 + 0.4 * sin(t * (0.6 + 0.5 * h) + 6.2831 * h);
      let d = length(pt - fr);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
  }
  return exp(-(d2 - d1) * ${b(D.causticSharpness)});
}
fn waterCausticPattern(xy: vec2f, t: f32) -> f32 {
  let q = xy / ${b(D.causticCellM)};
  return min(1.0, 0.7 * (waterCausticWeb(q, t) + waterCausticWeb(q * 1.6 + vec2f(3.1, 7.7), t * 1.3)));
}
fn waterCausticFade(under: f32, far: f32) -> f32 {
  if (under <= 0.0) { return 0.0; }
  return smoothstep(0.0, ${b(D.causticShallowM)}, under) * exp(under * (-1.0 / ${b(D.causticDepthM)})) * (1.0 - smoothstep(${b(D.causticFromM)}, ${b(D.causticToM)}, far));
}`,A=1.2,j=96,M=1,N=.6,ne=2.5,P=`#ifdef WATERREFLECT
${C}${T()}${O}
// Up from the planet's centre, leaned by the swell's and the ripple's slope here.
vec3 waterNormalFrom(vec3 p, vec3 s) {
  vec3 n = normalize(p - waterCentre);
  s -= n * dot(s, n);
  return normalize(n - s);
}
// The surface seen from under it: the sky through a window over the eye, which Snell's law makes, the sun in it, and outside
// the window the water under the surface mirrored whole. Opaque: the world over the water is not seen straight through it.
vec4 waterFromBelow(vec3 n, vec3 v, float linearSpace) {
  float c = clamp(-dot(v, n), 0.0, 1.0);
  float inWindow = smoothstep(${b(D.windowCos)} - 0.04, ${b(D.windowCos)} + 0.04, c);
  vec3 sky = mix(mix(waterAwaySun, waterTowardSun, 0.5), waterZenith, c);
  vec3 under = waterUnder;
  vec3 sun = waterGlint;
  if (linearSpace > 0.5) {
    sky = pow(sky, vec3(2.2));
    under = pow(under, vec3(2.2));
    sun = pow(sun, vec3(2.2));
  }
  // Toward the window's edge, more of the light is mirrored back down, all of it past the edge.
  float through = inWindow * (1.0 - pow(1.0 - (c - ${b(D.windowCos)}) / (1.0 - ${b(D.windowCos)}), 3.0) * 0.6);
  float glint = pow(max(dot(-v, normalize(waterSun)), 0.0), 300.0) * 3.0 * inWindow;
  return vec4(mix(under, sky, clamp(through, 0.0, 1.0)) + sun * glint, 1.0);
}
// How much water the eye looks through here before what lies behind it.
#ifdef WATERDEPTH
// The water's thickness to what lies behind the pixel at frag, no more than cap: a neighbour off the water's edge counts as cap.
float waterDepthAt(vec2 frag, float here, float distance, float cap) {
  float behind = texture2D(waterDepthMap, frag / waterScreen).r;
  if (behind <= 0.0) return cap;
  return min(max(behind - here, 0.0) * distance / here, cap);
}
#endif
#ifdef WATERMIRROR
// How much of the mirror a place on the screen keeps: none at the screen's edges, all of it a little way in.
float waterMirrorEdge(vec2 uv) {
  return smoothstep(0.0, ${b(_.edge)}, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
}
bool waterMirrorOff(vec2 uv) {
  return uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0;
}
// What the view reflected at the water point p, along r, meets on the screen (waterMirror.ts mirrorTrace): its colour drawn
// the frame before, and how much of it is kept; nothing where the ray leaves the screen, turns into the water or meets nothing.
// Points are taken relative to the eye, where the scene's numbers are fine.
vec4 waterMirrorAt(vec3 p, vec3 v, vec3 n, vec3 up, float distance, vec2 frag) {
  // The view reflected in the surface leaned by a share of the waves' lean (waterMirror.ts mirrorRay).
  vec3 nt = normalize(mix(up, n, ${b(_.lean)}));
  vec3 r = 2.0 * dot(v, nt) * nt - v;
  if (dot(r, up) <= 0.0) return vec4(0.0);
  vec3 q0 = p - waterEye;
  vec4 c0 = mirrorNow * vec4(q0, 1.0);
  if (c0.w <= 1e-4) return vec4(0.0);
  // A line stays a line through the projection: the ray's point t along it is c0 + cr t, before the divide.
  vec4 cr = mirrorNow * vec4(r, 0.0);
  vec2 n0 = c0.xy / c0.w;
  vec2 uv0 = frag / waterScreen;
  float stepM = max(${b(_.firstStepM)}, ${b(_.firstShare)} * distance) * mirrorFirst;
  float before = 0.0;
  float t = 0.0;
  for (int i = 0; i < ${_.steps}; i++) {
    if (float(i) >= mirrorSteps) break;
    t += stepM;
    vec4 c = c0 + cr * t;
    if (c.w <= 1e-4 || c.w > ${b(_.reachM)}) return vec4(0.0);
    vec2 uv = uv0 + (c.xy / c.w - n0) * 0.5;
    if (waterMirrorOff(uv)) return vec4(0.0);
    float drawn = texture2D(waterDepthMap, uv).r;
    if (drawn > 0.0 && c.w > drawn && c.w - drawn < max(${b(_.thickM)}, ${b(_.thickShare)} * stepM)) {
      // Met: halve the last step toward the meeting.
      float lo = before;
      float hi = t;
      for (int j = 0; j < ${_.refine}; j++) {
        float mid = (lo + hi) * 0.5;
        vec4 m = c0 + cr * mid;
        vec2 mu = uv0 + (m.xy / max(m.w, 1e-4) - n0) * 0.5;
        float md = waterMirrorOff(mu) ? 0.0 : texture2D(waterDepthMap, mu).r;
        if (m.w > 1e-4 && md > 0.0 && m.w > md) hi = mid; else lo = mid;
      }
      vec3 hit = q0 + r * hi;
      vec4 h = c0 + cr * hi;
      vec2 huv = uv0 + (h.xy / max(h.w, 1e-4) - n0) * 0.5;
      // Where it was drawn the frame before, on that frame's picture.
      vec4 b = mirrorBefore * vec4(hit, 1.0);
      if (b.w <= 1e-4) return vec4(0.0);
      vec2 buv = b.xy / b.w * 0.5 + 0.5;
      if (waterMirrorOff(buv)) return vec4(0.0);
      return vec4(texture2D(waterMirrorFrame, buv).rgb, waterMirrorEdge(huv) * waterMirrorEdge(buv));
    }
    before = t;
    stepM *= mirrorGrowth;
  }
  return vec4(0.0);
}
#endif
float waterThickness(vec3 p, float vn, float distance) {
  float assumed = 2.5 / max(vn, 0.1);
#ifdef WATERDEPTH
  float behind = texture2D(waterDepthMap, gl_FragCoord.xy / waterScreen).r;
  if (behind <= 0.0) return 1000.0;
  float here = max(dot(p - waterEye, waterForward), 1e-3);
  // Read over a footprint about ${b(A)} m across, so a bed in block steps reads as a slope, not as squares.
  float r = clamp(${b(A)} * 0.5 * waterFocal / here, 0.0, ${b(j)});
  float cap = waterDepthAt(gl_FragCoord.xy, here, distance, 1000.0) + ${b(M)};
  vec2 c = gl_FragCoord.xy;
  // The pixel, and two rings of six about it, the inner turned between the outer's.
  float measured = (waterDepthAt(c, here, distance, cap) + waterDepthAt(c + vec2(1, 0.0) * r, here, distance, cap) + waterDepthAt(c + vec2(0.433, 0.25) * r, here, distance, cap) + waterDepthAt(c + vec2(0.5, 0.866) * r, here, distance, cap) + waterDepthAt(c + vec2(0.0, 0.5) * r, here, distance, cap) + waterDepthAt(c + vec2(-0.5, 0.866) * r, here, distance, cap) + waterDepthAt(c + vec2(-0.433, 0.25) * r, here, distance, cap) + waterDepthAt(c + vec2(-1, 0.0) * r, here, distance, cap) + waterDepthAt(c + vec2(-0.433, -0.25) * r, here, distance, cap) + waterDepthAt(c + vec2(-0.5, -0.866) * r, here, distance, cap) + waterDepthAt(c + vec2(0.0, -0.5) * r, here, distance, cap) + waterDepthAt(c + vec2(0.5, -0.866) * r, here, distance, cap) + waterDepthAt(c + vec2(0.433, -0.25) * r, here, distance, cap)) / 13.0;
  return mix(measured, assumed, smoothstep(250.0, 400.0, distance));
#else
  return assumed;
#endif
}
// The water's colour with the sky in it, and how opaque it is, before the shore.
vec4 waterMirrored(vec3 base, vec3 p, float alpha, float linearSpace, vec3 up, vec3 v, vec3 n, float vn, float distance, float deep, vec2 frag) {
  if (waterStrength <= 0.0) return vec4(base, max(alpha, deep));
  vec3 r = 2.0 * vn * n - v;
  float e = clamp(dot(r, up), 0.0, 1.0);
  vec3 s = normalize(waterSun);
  vec3 rh = r - up * dot(r, up);
  vec3 sh = s - up * dot(s, up);
  float toward = (length(rh) > 1e-4 && length(sh) > 1e-4) ? dot(normalize(rh), normalize(sh)) * 0.5 + 0.5 : 0.5;
  float c = clamp(vn, 0.0, 1.0);
  // Fresnel's share, and at the least a sheen of sky far off.
  float sheen = 0.15 * smoothstep(300.0, 3000.0, distance);
  float fr = waterStrength * max(0.02 + 0.98 * pow(1.0 - c, 5.0), sheen);
  // The glint: sharp close to, spread and dimmer far off, where many ripples catch the sun at once.
  float sharp = 900.0 / (1.0 + distance / 250.0);
  float glint = pow(max(dot(r, s), 0.0), sharp) * 6.0 * sqrt(sharp / 900.0) * waterStrength;
  vec3 horizon = mix(waterAwaySun, waterTowardSun, toward);
  vec3 sky = mix(horizon, waterZenith, sqrt(e));
  vec3 sun = waterGlint;
  if (linearSpace > 0.5) {
    sky = pow(sky, vec3(2.2));
    sun = pow(sun, vec3(2.2));
  }
#ifdef WATERMIRROR
  // What stands over the water, where the trace meets it, in place of the sky; it hides the sun's glint behind it.
  if (fr > ${b(_.minShare)} && distance < ${b(_.fadeToM)}) {
    vec4 m = waterMirrorAt(p, v, n, up, distance, frag);
    float keep = m.a * mirrorStrength * (1.0 - smoothstep(${b(_.fadeFromM)}, ${b(_.fadeToM)}, distance));
    vec3 seen = linearSpace > 0.5 ? pow(max(m.rgb, vec3(0.0)), vec3(2.2)) : m.rgb;
    sky = mix(sky, seen, keep);
    glint *= 1.0 - keep;
  }
#endif
  vec3 color = mix(base, sky, fr) + sun * glint;
  float g = max(waterGlint.r, max(waterGlint.g, waterGlint.b));
  return vec4(color, max(max(alpha + (1.0 - alpha) * fr, deep), min(1.0, glint * g)));
}
// The fog about an eye under the water, over the water itself: as thick as the world asks, toward the colour under it.
vec4 waterUnderFog(vec4 col, float distance, float linearSpace) {
  if (waterFogDensity <= 0.0) return col;
  vec3 fog = linearSpace > 0.5 ? pow(waterUnder, vec3(2.2)) : waterUnder;
  float seen = exp(-waterFogDensity * distance);
  return vec4(mix(fog, col.rgb, seen), mix(1.0, col.a, seen));
}
// The water's colour with the sky in it, and how opaque it is; linearSpace > 0.5 for a material whose colour is linear.
vec4 waterReflected(vec3 base, vec3 p, float alpha, float linearSpace) {
  vec3 up = normalize(p - waterCentre);
  vec3 toEye = waterEye - p;
  float distance = length(toEye);
  vec3 v = toEye / max(distance, 1e-6);
  vec3 slope = waterSwellSlope(p, distance) + waterRippleSlope(p, distance);
  vec3 n = waterNormalFrom(p, slope);
  // From below as the eye is under the water: judged once, at the eye, against the surface drawn there, and blended over a few
  // centimetres. Not each fragment against its own surface, which shows the swell near the eye from above and the far water,
  // lying at its drawn level, from below.
  vec4 below = waterEyeUnder > 0.0 ? waterFromBelow(n, v, linearSpace) : vec4(0.0);
  if (waterEyeUnder >= 1.0) return waterUnderFog(below, distance, linearSpace);
  float vn = dot(v, n);
  float vu = clamp(dot(v, up), 0.0, 1.0);
  float thick = waterThickness(p, vu, distance);
  float deep = 1.0 - exp(-thick / max(waterClarity, 0.001));
  vec4 col = waterMirrored(base, p, alpha, linearSpace, up, v, n, vn, distance, deep, gl_FragCoord.xy);
#ifdef WATERDEPTH
  // The shore, where the water's depth is measured: foam where it is shallow, and the sun's caustics on the bed seen through it.
  vec3 sunUp = waterGlint * clamp(dot(up, normalize(waterSun)), 0.0, 1.0);
  // Only on water the eye looks down on: level with it, its depth along the eye's line says nothing of the bed.
  float down = smoothstep(0.0, 0.01, dot(v, up));
  vec3 zenith = waterZenith;
  if (linearSpace > 0.5) {
    sunUp = pow(sunUp, vec3(2.2));
    zenith = pow(zenith, vec3(2.2));
  }
  if (waterFoam > 0.0 && distance < ${b(D.foamToM)}) {
    vec3 rel = p - waterWaveOrigin;
    vec2 xy = vec2(dot(rel, waterWaveEast), dot(rel, waterWaveNorth)) + vec2(dot(slope, waterWaveEast), dot(slope, waterWaveNorth)) * 1.5;
    float swell = clamp(waterSwellHeight(p) / max(waterSwellCrest(), 1e-4), -1.0, 1.0);
    float foam = waterFoamAt(thick * vu, waterFoam, waterFoamWidth, swell, waterFoamNoise(xy, waterTime), distance) * down;
    col = vec4(mix(col.rgb, min(zenith * 0.6 + sunUp * 0.9, vec3(1.0)), foam), max(col.a, foam));
  }
  if (waterCaustics > 0.0 && distance < ${b(D.causticToM)}) {
    vec3 bed = p - v * thick;
    float fade = waterCausticFade(thick * vu, distance) * waterCaustics * down;
    if (fade > 0.0) {
      vec3 rb = bed - waterWaveOrigin;
      float c = waterCausticPattern(vec2(dot(rb, waterWaveEast), dot(rb, waterWaveNorth)), waterTime);
      // Light added to the bed, which shows through as much as the water lets it.
      col.rgb += sunUp * (c * fade * ${b(N)}) * (1.0 - col.a) / max(col.a, 0.05);
    }
  }
#endif
  if (waterEyeUnder > 0.0) col = mix(col, below, waterEyeUnder);
  return waterUnderFog(col, distance, linearSpace);
}
#endif
`,re=`#ifdef WATERREFLECT
${w}${E()}${k}
fn waterNormalFrom(p: vec3f, slope: vec3f) -> vec3f {
  let n = normalize(p - uniforms.waterCentre);
  var s = slope;
  s -= n * dot(s, n);
  return normalize(n - s);
}
fn waterFromBelow(n: vec3f, v: vec3f, linearSpace: f32) -> vec4f {
  let c = clamp(-dot(v, n), 0.0, 1.0);
  let inWindow = smoothstep(${b(D.windowCos)} - 0.04, ${b(D.windowCos)} + 0.04, c);
  var sky = mix(mix(uniforms.waterAwaySun, uniforms.waterTowardSun, 0.5), uniforms.waterZenith, c);
  var under = uniforms.waterUnder;
  var sun = uniforms.waterGlint;
  if (linearSpace > 0.5) {
    sky = pow(sky, vec3f(2.2));
    under = pow(under, vec3f(2.2));
    sun = pow(sun, vec3f(2.2));
  }
  let through = inWindow * (1.0 - pow(1.0 - (c - ${b(D.windowCos)}) / (1.0 - ${b(D.windowCos)}), 3.0) * 0.6);
  let glint = pow(max(dot(-v, normalize(uniforms.waterSun)), 0.0), 300.0) * 3.0 * inWindow;
  return vec4f(mix(under, sky, clamp(through, 0.0, 1.0)) + sun * glint, 1.0);
}
#ifdef WATERDEPTH
fn waterDepthAt(frag: vec2f, here: f32, distance: f32, cap: f32) -> f32 {
  let behind = textureSampleLevel(waterDepthMap, waterDepthMapSampler, frag / uniforms.waterScreen, 0.0).r;
  if (behind <= 0.0) { return cap; }
  return min(max(behind - here, 0.0) * distance / here, cap);
}
#endif
#ifdef WATERMIRROR
fn waterMirrorEdge(uv: vec2f) -> f32 {
  return smoothstep(0.0, ${b(_.edge)}, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
}
fn waterMirrorOff(uv: vec2f) -> bool {
  return uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0;
}
fn waterMirrorAt(p: vec3f, v: vec3f, n: vec3f, up: vec3f, distance: f32, frag: vec2f) -> vec4f {
  let nt = normalize(mix(up, n, ${b(_.lean)}));
  let r = 2.0 * dot(v, nt) * nt - v;
  if (dot(r, up) <= 0.0) { return vec4f(0.0); }
  let q0 = p - uniforms.waterEye;
  let c0 = uniforms.mirrorNow * vec4f(q0, 1.0);
  if (c0.w <= 1e-4) { return vec4f(0.0); }
  let cr = uniforms.mirrorNow * vec4f(r, 0.0);
  let n0 = c0.xy / c0.w;
  let uv0 = frag / uniforms.waterScreen;
  var stepM = max(${b(_.firstStepM)}, ${b(_.firstShare)} * distance) * uniforms.mirrorFirst;
  var before: f32 = 0.0;
  var t: f32 = 0.0;
  for (var i: i32 = 0; i < ${_.steps}; i++) {
    if (f32(i) >= uniforms.mirrorSteps) { break; }
    t += stepM;
    let c = c0 + cr * t;
    if (c.w <= 1e-4 || c.w > ${b(_.reachM)}) { return vec4f(0.0); }
    let uv = uv0 + (c.xy / c.w - n0) * 0.5;
    if (waterMirrorOff(uv)) { return vec4f(0.0); }
    let drawn = textureSampleLevel(waterDepthMap, waterDepthMapSampler, uv, 0.0).r;
    if (drawn > 0.0 && c.w > drawn && c.w - drawn < max(${b(_.thickM)}, ${b(_.thickShare)} * stepM)) {
      var lo = before;
      var hi = t;
      for (var j: i32 = 0; j < ${_.refine}; j++) {
        let mid = (lo + hi) * 0.5;
        let m = c0 + cr * mid;
        let mu = uv0 + (m.xy / max(m.w, 1e-4) - n0) * 0.5;
        var md: f32 = 0.0;
        if (!waterMirrorOff(mu)) { md = textureSampleLevel(waterDepthMap, waterDepthMapSampler, mu, 0.0).r; }
        if (m.w > 1e-4 && md > 0.0 && m.w > md) { hi = mid; } else { lo = mid; }
      }
      let hit = q0 + r * hi;
      let h = c0 + cr * hi;
      let huv = uv0 + (h.xy / max(h.w, 1e-4) - n0) * 0.5;
      let b = uniforms.mirrorBefore * vec4f(hit, 1.0);
      if (b.w <= 1e-4) { return vec4f(0.0); }
      let buv = b.xy / b.w * 0.5 + 0.5;
      if (waterMirrorOff(buv)) { return vec4f(0.0); }
      return vec4f(textureSampleLevel(waterMirrorFrame, waterMirrorFrameSampler, buv, 0.0).rgb, waterMirrorEdge(huv) * waterMirrorEdge(buv));
    }
    before = t;
    stepM *= uniforms.mirrorGrowth;
  }
  return vec4f(0.0);
}
#endif
fn waterThickness(p: vec3f, vn: f32, distance: f32, frag: vec2f) -> f32 {
  let assumed = 2.5 / max(vn, 0.1);
#ifdef WATERDEPTH
  let behind = textureSampleLevel(waterDepthMap, waterDepthMapSampler, frag / uniforms.waterScreen, 0.0).r;
  if (behind <= 0.0) { return 1000.0; }
  let here = max(dot(p - uniforms.waterEye, uniforms.waterForward), 1e-3);
  let r = clamp(${b(A)} * 0.5 * uniforms.waterFocal / here, 0.0, ${b(j)});
  let cap = waterDepthAt(frag, here, distance, 1000.0) + ${b(M)};
  let measured = (waterDepthAt(frag, here, distance, cap) + waterDepthAt(frag + vec2f(1, 0.0) * r, here, distance, cap) + waterDepthAt(frag + vec2f(0.433, 0.25) * r, here, distance, cap) + waterDepthAt(frag + vec2f(0.5, 0.866) * r, here, distance, cap) + waterDepthAt(frag + vec2f(0.0, 0.5) * r, here, distance, cap) + waterDepthAt(frag + vec2f(-0.5, 0.866) * r, here, distance, cap) + waterDepthAt(frag + vec2f(-0.433, 0.25) * r, here, distance, cap) + waterDepthAt(frag + vec2f(-1, 0.0) * r, here, distance, cap) + waterDepthAt(frag + vec2f(-0.433, -0.25) * r, here, distance, cap) + waterDepthAt(frag + vec2f(-0.5, -0.866) * r, here, distance, cap) + waterDepthAt(frag + vec2f(0.0, -0.5) * r, here, distance, cap) + waterDepthAt(frag + vec2f(0.5, -0.866) * r, here, distance, cap) + waterDepthAt(frag + vec2f(0.433, -0.25) * r, here, distance, cap)) / 13.0;
  return mix(measured, assumed, smoothstep(250.0, 400.0, distance));
#else
  return assumed;
#endif
}
fn waterMirrored(base: vec3f, p: vec3f, alpha: f32, linearSpace: f32, up: vec3f, v: vec3f, n: vec3f, vn: f32, distance: f32, deep: f32, frag: vec2f) -> vec4f {
  if (uniforms.waterStrength <= 0.0) { return vec4f(base, max(alpha, deep)); }
  let r = 2.0 * vn * n - v;
  let e = clamp(dot(r, up), 0.0, 1.0);
  let s = normalize(uniforms.waterSun);
  let rh = r - up * dot(r, up);
  let sh = s - up * dot(s, up);
  var toward: f32 = 0.5;
  if (length(rh) > 1e-4 && length(sh) > 1e-4) { toward = dot(normalize(rh), normalize(sh)) * 0.5 + 0.5; }
  let c = clamp(vn, 0.0, 1.0);
  let sheen = 0.15 * smoothstep(300.0, 3000.0, distance);
  let fr = uniforms.waterStrength * max(0.02 + 0.98 * pow(1.0 - c, 5.0), sheen);
  let sharp = 900.0 / (1.0 + distance / 250.0);
  var glint = pow(max(dot(r, s), 0.0), sharp) * 6.0 * sqrt(sharp / 900.0) * uniforms.waterStrength;
  let horizon = mix(uniforms.waterAwaySun, uniforms.waterTowardSun, toward);
  var sky = mix(horizon, uniforms.waterZenith, sqrt(e));
  var sun = uniforms.waterGlint;
  if (linearSpace > 0.5) {
    sky = pow(sky, vec3f(2.2));
    sun = pow(sun, vec3f(2.2));
  }
#ifdef WATERMIRROR
  if (fr > ${b(_.minShare)} && distance < ${b(_.fadeToM)}) {
    let m = waterMirrorAt(p, v, n, up, distance, frag);
    let keep = m.a * uniforms.mirrorStrength * (1.0 - smoothstep(${b(_.fadeFromM)}, ${b(_.fadeToM)}, distance));
    var seen = m.rgb;
    if (linearSpace > 0.5) { seen = pow(max(m.rgb, vec3f(0.0)), vec3f(2.2)); }
    sky = mix(sky, seen, keep);
    glint *= 1.0 - keep;
  }
#endif
  let color = mix(base, sky, fr) + sun * glint;
  let g = max(uniforms.waterGlint.r, max(uniforms.waterGlint.g, uniforms.waterGlint.b));
  return vec4f(color, max(max(alpha + (1.0 - alpha) * fr, deep), min(1.0, glint * g)));
}
fn waterUnderFog(col: vec4f, distance: f32, linearSpace: f32) -> vec4f {
  if (uniforms.waterFogDensity <= 0.0) { return col; }
  var fog = uniforms.waterUnder;
  if (linearSpace > 0.5) { fog = pow(fog, vec3f(2.2)); }
  let seen = exp(-uniforms.waterFogDensity * distance);
  return vec4f(mix(fog, col.rgb, seen), mix(1.0, col.a, seen));
}
fn waterReflected(base: vec3f, p: vec3f, alpha: f32, linearSpace: f32, frag: vec2f) -> vec4f {
  let up = normalize(p - uniforms.waterCentre);
  let toEye = uniforms.waterEye - p;
  let distance = length(toEye);
  let v = toEye / max(distance, 1e-6);
  let slope = waterSwellSlope(p, distance) + waterRippleSlope(p, distance);
  let n = waterNormalFrom(p, slope);
  var below = vec4f(0.0);
  if (uniforms.waterEyeUnder > 0.0) { below = waterFromBelow(n, v, linearSpace); }
  if (uniforms.waterEyeUnder >= 1.0) { return waterUnderFog(below, distance, linearSpace); }
  let vn = dot(v, n);
  let vu = clamp(dot(v, up), 0.0, 1.0);
  let thick = waterThickness(p, vu, distance, frag);
  let deep = 1.0 - exp(-thick / max(uniforms.waterClarity, 0.001));
  var col = waterMirrored(base, p, alpha, linearSpace, up, v, n, vn, distance, deep, frag);
#ifdef WATERDEPTH
  var sunUp = uniforms.waterGlint * clamp(dot(up, normalize(uniforms.waterSun)), 0.0, 1.0);
  let down = smoothstep(0.0, 0.01, dot(v, up));
  var zenith = uniforms.waterZenith;
  if (linearSpace > 0.5) {
    sunUp = pow(sunUp, vec3f(2.2));
    zenith = pow(zenith, vec3f(2.2));
  }
  if (uniforms.waterFoam > 0.0 && distance < ${b(D.foamToM)}) {
    let rel = p - uniforms.waterWaveOrigin;
    let xy = vec2f(dot(rel, uniforms.waterWaveEast), dot(rel, uniforms.waterWaveNorth)) + vec2f(dot(slope, uniforms.waterWaveEast), dot(slope, uniforms.waterWaveNorth)) * 1.5;
    let swell = clamp(waterSwellHeight(p) / max(waterSwellCrest(), 1e-4), -1.0, 1.0);
    let foam = waterFoamAt(thick * vu, uniforms.waterFoam, uniforms.waterFoamWidth, swell, waterFoamNoise(xy, uniforms.waterTime), distance) * down;
    col = vec4f(mix(col.rgb, min(zenith * 0.6 + sunUp * 0.9, vec3f(1.0)), foam), max(col.a, foam));
  }
  if (uniforms.waterCaustics > 0.0 && distance < ${b(D.causticToM)}) {
    let bed = p - v * thick;
    let fade = waterCausticFade(thick * vu, distance) * uniforms.waterCaustics * down;
    if (fade > 0.0) {
      let rb = bed - uniforms.waterWaveOrigin;
      let c = waterCausticPattern(vec2f(dot(rb, uniforms.waterWaveEast), dot(rb, uniforms.waterWaveNorth)), uniforms.waterTime);
      col = vec4f(col.rgb + sunUp * (c * fade * ${b(N)}) * (1.0 - col.a) / max(col.a, 0.05), col.a);
    }
  }
#endif
  if (uniforms.waterEyeUnder > 0.0) { col = mix(col, below, uniforms.waterEyeUnder); }
  return waterUnderFog(col, distance, linearSpace);
}
#endif
`,ie=`#ifdef WATERREFLECT
${T()}
#if defined(WATERBED) && !defined(UV4)
attribute vec2 uv4;
#endif
#endif
`,ae=`#ifdef WATERREFLECT
${E()}
#if defined(WATERBED) && !defined(UV4)
attribute uv4: vec2f;
#endif
#endif
`;function F(e){return e===`webgpu`?{uniforms:S,definitions:re,pbr:`#ifdef WATERREFLECT
finalColor = waterReflected(finalColor.rgb, fragmentInputs.vPositionW, finalColor.a, 1.0, fragmentInputs.position.xy);
#endif
`,standard:`#ifdef WATERREFLECT
color = waterReflected(color.rgb, fragmentInputs.vPositionW, color.a, 0.0, fragmentInputs.position.xy);
#endif
`,vertexDefinitions:ae,vertex:`#ifdef WATERREFLECT
var waterBed: f32 = -1.0;
#ifdef WATERBED
waterBed = vertexInputs.uv4.x;
#endif
worldPos = vec4f(worldPos.xyz + normalize(worldPos.xyz - uniforms.waterCentre) * waterRaiseAt(worldPos.xyz, length(worldPos.xyz - uniforms.waterEye), waterBed), worldPos.w);
#endif
`}:{uniforms:x,definitions:P,pbr:`#ifdef WATERREFLECT
finalColor = waterReflected(finalColor.rgb, vPositionW, finalColor.a, 1.0);
#endif
`,standard:`#ifdef WATERREFLECT
color = waterReflected(color.rgb, vPositionW, color.a, 0.0);
#endif
`,vertexDefinitions:ie,vertex:`#ifdef WATERREFLECT
float waterBed = -1.0;
#ifdef WATERBED
waterBed = uv4.x;
#endif
worldPos.xyz += normalize(worldPos.xyz - waterCentre) * waterRaiseAt(worldPos.xyz, length(worldPos.xyz - waterEye), waterBed);
#endif
`}}var I=`WaterReflect`,L=class extends o{state;_isEnabled=!0;constructor(e,t){super(e,I,310,{WATERREFLECT:!1,WATERBED:!1,WATERDEPTH:!1,WATERMIRROR:!1},!0,!0),this.state=t}rebind(e){this.state=e}get pbr(){return this._material.getClassName()===`PBRMaterial`}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}_mirrorHeld=!1;get mirrorHeld(){return this._mirrorHeld}set mirrorHeld(e){this._mirrorHeld!==e&&(this._mirrorHeld=e,this.markAllDefinesAsDirty())}depthChanged(){this.markAllDefinesAsDirty()}getClassName(){return`WaterReflectPlugin`}isCompatible(e){return e===c.GLSL||e===c.WGSL}bedded(e){return e!==void 0&&e.isVerticesDataPresent(`uv4`)}prepareDefines(e,t,n){let r=e;r.WATERREFLECT=this._isEnabled,r.WATERBED=this._isEnabled&&this.bedded(n),r.WATERDEPTH=this._isEnabled&&this.state.depthMap!==null,r.WATERMIRROR=r.WATERDEPTH&&this.state.mirror.on&&!this._mirrorHeld}getAttributes(e,t,n){this._isEnabled&&this.bedded(n)&&!e.includes(`uv4`)&&e.push(`uv4`)}getSamplers(e){e.push(`waterDepthMap`,`waterMirrorFrame`)}getUniforms(e=c.GLSL){let t=F(e===c.WGSL?`webgpu`:`webgl2`);return{ubo:[{name:`waterEye`,size:3,type:`vec3`},{name:`waterCentre`,size:3,type:`vec3`},{name:`waterSun`,size:3,type:`vec3`},{name:`waterZenith`,size:3,type:`vec3`},{name:`waterTowardSun`,size:3,type:`vec3`},{name:`waterAwaySun`,size:3,type:`vec3`},{name:`waterGlint`,size:3,type:`vec3`},{name:`waterStrength`,size:1,type:`float`},{name:`waterRipple`,size:1,type:`float`},{name:`waterTime`,size:1,type:`float`},{name:`waterWaveOrigin`,size:3,type:`vec3`},{name:`waterWaveEast`,size:3,type:`vec3`},{name:`waterWaveNorth`,size:3,type:`vec3`},{name:`waterWaves`,size:1,type:`float`},{name:`waterWaveLength`,size:1,type:`float`},{name:`waterWaveReach`,size:1,type:`float`},{name:`waterWaveBearing`,size:1,type:`float`},{name:`waterTide`,size:1,type:`float`},{name:`waterTideRange`,size:1,type:`float`},{name:`waterShallowFall`,size:1,type:`float`},{name:`waterClarity`,size:1,type:`float`},{name:`waterScreen`,size:2,type:`vec2`},{name:`waterForward`,size:3,type:`vec3`},{name:`waterFoam`,size:1,type:`float`},{name:`waterFoamWidth`,size:1,type:`float`},{name:`waterCaustics`,size:1,type:`float`},{name:`waterUnder`,size:3,type:`vec3`},{name:`waterEyeUnder`,size:1,type:`float`},{name:`waterFocal`,size:1,type:`float`},{name:`waterFogDensity`,size:1,type:`float`},{name:`mirrorNow`,size:16,type:`mat4`},{name:`mirrorBefore`,size:16,type:`mat4`},{name:`mirrorStrength`,size:1,type:`float`},{name:`mirrorSteps`,size:1,type:`float`},{name:`mirrorGrowth`,size:1,type:`float`},{name:`mirrorFirst`,size:1,type:`float`}],vertex:e===c.WGSL?S:x,fragment:t.uniforms}}bindForSubMesh(e){if(!this._isEnabled)return;let t=this.state.now,n=(t,n)=>e.updateFloat3(t,n[0],n[1],n[2]);if(!t){e.updateFloat(`waterStrength`,0),e.updateFloat(`waterWaves`,0),e.updateFloat(`waterRipple`,0),e.updateFloat(`waterTide`,0),e.updateFloat(`waterTideRange`,0),e.updateFloat(`waterShallowFall`,1),e.updateFloat(`waterClarity`,1e3),e.updateFloat(`waterFoam`,0),e.updateFloat(`waterCaustics`,0),e.updateFloat(`waterEyeUnder`,0),e.updateFloat(`waterFogDensity`,0);return}n(`waterEye`,t.eye),n(`waterCentre`,t.centre),n(`waterSun`,t.sun),n(`waterZenith`,t.sky.zenith),n(`waterTowardSun`,t.sky.towardSun),n(`waterAwaySun`,t.sky.awaySun),n(`waterGlint`,t.sky.glint),e.updateFloat(`waterStrength`,t.strength),e.updateFloat(`waterRipple`,t.ripple),e.updateFloat(`waterTime`,t.timeS),n(`waterWaveOrigin`,t.waveOrigin),n(`waterWaveEast`,t.waveEast),n(`waterWaveNorth`,t.waveNorth),e.updateFloat(`waterWaves`,t.motion.waves),e.updateFloat(`waterWaveLength`,Math.max(.1,t.motion.waveLength)),e.updateFloat(`waterWaveReach`,Math.max(.001,t.motion.waveReach)),e.updateFloat(`waterWaveBearing`,t.motion.waveBearing*Math.PI/180),e.updateFloat(`waterTide`,t.tideNow),e.updateFloat(`waterTideRange`,Math.max(0,t.motion.tide)),e.updateFloat(`waterShallowFall`,Math.min(1,Math.max(0,t.motion.shallowFall))),e.updateFloat(`waterClarity`,t.motion.clarity);let r=this._material.getScene().getEngine(),i=[r.getRenderWidth()||1,r.getRenderHeight()||1];e.updateFloat2(`waterScreen`,i[0],i[1]),e.updateFloat3(`waterForward`,this.state.forward.x,this.state.forward.y,this.state.forward.z),e.updateFloat(`waterFoam`,t.foam),e.updateFloat(`waterFoamWidth`,Math.max(.01,t.foamWidth)),e.updateFloat(`waterCaustics`,t.caustics),n(`waterUnder`,t.under),e.updateFloat(`waterEyeUnder`,Math.min(1,Math.max(0,t.eyeUnder))),e.updateFloat(`waterFocal`,i[1]===this.state.screen[1]?this.state.focal:this.state.focal*i[1]/this.state.screen[1]),e.updateFloat(`waterFogDensity`,Math.max(0,t.fogDensity)),this.state.depthMap&&e.setTexture(`waterDepthMap`,this.state.depthMap);let a=this.state.mirror;a.on&&a.frame&&!this._mirrorHeld&&(e.updateMatrix(`mirrorNow`,a.now),e.updateMatrix(`mirrorBefore`,a.before),e.updateFloat(`mirrorStrength`,a.strength),e.updateFloat(`mirrorSteps`,a.steps),e.updateFloat(`mirrorGrowth`,a.growth),e.updateFloat(`mirrorFirst`,a.first),e.setTexture(`waterMirrorFrame`,a.frame))}getCustomCode(e,t=c.GLSL){let n=F(t===c.WGSL?`webgpu`:`webgl2`);return e===`vertex`?{CUSTOM_VERTEX_DEFINITIONS:n.vertexDefinitions,CUSTOM_VERTEX_UPDATE_WORLDPOS:n.vertex}:e===`fragment`?{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FOG:this.pbr?n.pbr:n.standard}:null}},R=e=>{if(e.name!==`water`)return!1;let t=e.getClassName();return t===`StandardMaterial`||t===`PBRMaterial`},oe=[`causticSurface`,`causticUp`,`causticEye`,`causticSun`,`causticOrigin`,`causticEast`,`causticNorth`],z=`#ifdef GROUNDCAUSTICS
uniform vec4 causticSurface;
uniform vec4 causticUp;
uniform vec4 causticEye;
uniform vec4 causticSun;
uniform vec4 causticOrigin;
uniform vec4 causticEast;
uniform vec4 causticNorth;
#endif
`,B=`#ifdef GROUNDCAUSTICS
uniform causticSurface: vec4f;
uniform causticUp: vec4f;
uniform causticEye: vec4f;
uniform causticSun: vec4f;
uniform causticOrigin: vec4f;
uniform causticEast: vec4f;
uniform causticNorth: vec4f;
#endif
`,se=`#ifdef GROUNDCAUSTICS
${O}
// The caustics on the ground at posW: under the surface over the eye, by its depth there, near the eye, by day. None while the
// eye is out of the water (no strength).
float groundCausticAt(vec3 posW) {
  if (causticSurface.w <= 0.0) return 0.0;
  float below = dot(causticSurface.xyz - posW, causticUp.xyz);
  float fade = waterCausticFade(below, length(posW - causticEye.xyz)) * causticSurface.w;
  if (fade <= 0.0) return 0.0;
  vec3 rel = posW - causticOrigin.xyz;
  return fade * clamp(dot(causticUp.xyz, normalize(causticSun.xyz)), 0.0, 1.0) * waterCausticPattern(vec2(dot(rel, causticEast.xyz), dot(rel, causticNorth.xyz)), causticUp.w);
}
#endif
`,ce=`#ifdef GROUNDCAUSTICS
${k}
fn groundCausticAt(posW: vec3f) -> f32 {
  if (uniforms.causticSurface.w <= 0.0) { return 0.0; }
  let below = dot(uniforms.causticSurface.xyz - posW, uniforms.causticUp.xyz);
  let fade = waterCausticFade(below, length(posW - uniforms.causticEye.xyz)) * uniforms.causticSurface.w;
  if (fade <= 0.0) { return 0.0; }
  let rel = posW - uniforms.causticOrigin.xyz;
  return fade * clamp(dot(uniforms.causticUp.xyz, normalize(uniforms.causticSun.xyz)), 0.0, 1.0) * waterCausticPattern(vec2f(dot(rel, uniforms.causticEast.xyz), dot(rel, uniforms.causticNorth.xyz)), uniforms.causticUp.w);
}
#endif
`;function V(e){let t=b(ne);return e===`webgpu`?{uniforms:B,definitions:ce,pbr:`#ifdef GROUNDCAUSTICS
finalDiffuse *= 1.0 + ${t} * groundCausticAt(fragmentInputs.vPositionW);
#endif
`,standard:`#ifdef GROUNDCAUSTICS
color = vec4f(color.rgb * (1.0 + ${t} * groundCausticAt(fragmentInputs.vPositionW)), color.a);
#endif
`}:{uniforms:z,definitions:se,pbr:`#ifdef GROUNDCAUSTICS
finalDiffuse *= 1.0 + ${t} * groundCausticAt(vPositionW);
#endif
`,standard:`#ifdef GROUNDCAUSTICS
color.rgb *= 1.0 + ${t} * groundCausticAt(vPositionW);
#endif
`}}var H=`WaterCaustics`,U=class extends o{state;_isEnabled=!0;constructor(e,t){super(e,H,305,{GROUNDCAUSTICS:!1},!0,!0),this.state=t}rebind(e){this.state=e}get pbr(){return this._material.getClassName()===`PBRMaterial`}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}getClassName(){return`GroundCausticPlugin`}isCompatible(e){return e===c.GLSL||e===c.WGSL}prepareDefines(e){e.GROUNDCAUSTICS=this._isEnabled}getUniforms(e=c.GLSL){return{ubo:[{name:`causticSurface`,size:4,type:`vec4`},{name:`causticUp`,size:4,type:`vec4`},{name:`causticEye`,size:4,type:`vec4`},{name:`causticSun`,size:4,type:`vec4`},{name:`causticOrigin`,size:4,type:`vec4`},{name:`causticEast`,size:4,type:`vec4`},{name:`causticNorth`,size:4,type:`vec4`}],fragment:e===c.WGSL?B:z}}bindForSubMesh(e){if(!this._isEnabled)return;let t=this.state,n=(t,n,r=0)=>e.updateFloat4(t,n.x,n.y,n.z,r);n(`causticSurface`,t.surface,t.strength),!(t.strength<=0)&&(n(`causticUp`,t.up,t.timeS),n(`causticEye`,t.eye),n(`causticSun`,t.sun),n(`causticOrigin`,t.origin),n(`causticEast`,t.east),n(`causticNorth`,t.north))}getCustomCode(e,t=c.GLSL){if(e!==`fragment`)return null;let n=V(t===c.WGSL?`webgpu`:`webgl2`);return this.pbr?{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:n.pbr}:{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FOG:n.standard}}},W=[`underFogEye`,`underFogColour`],G=`#ifdef UNDERWATERFOG
uniform vec4 underFogEye;
uniform vec4 underFogColour;
#endif
`,K=`#ifdef UNDERWATERFOG
uniform underFogEye: vec4f;
uniform underFogColour: vec4f;
#endif
`;function q(e){return e===`webgpu`?{uniforms:K,definitions:`#ifdef UNDERWATERFOG
fn underFogOver(c: vec3f, posW: vec3f, linearSpace: f32) -> vec3f {
  if (uniforms.underFogEye.w <= 0.0) { return c; }
  var fog = uniforms.underFogColour.rgb;
  if (linearSpace > 0.5) { fog = pow(fog, vec3f(2.2)); }
  return mix(fog, c, exp(-uniforms.underFogEye.w * length(posW - uniforms.underFogEye.xyz)));
}
#endif
`,pbr:`#ifdef UNDERWATERFOG
finalColor = vec4f(underFogOver(finalColor.rgb, fragmentInputs.vPositionW, 1.0), finalColor.a);
#endif
`,standard:`#ifdef UNDERWATERFOG
color = vec4f(underFogOver(color.rgb, fragmentInputs.vPositionW, 0.0), color.a);
#endif
`}:{uniforms:G,definitions:`#ifdef UNDERWATERFOG
vec3 underFogOver(vec3 c, vec3 posW, float linearSpace) {
  if (underFogEye.w <= 0.0) return c;
  vec3 fog = linearSpace > 0.5 ? pow(underFogColour.rgb, vec3(2.2)) : underFogColour.rgb;
  return mix(fog, c, exp(-underFogEye.w * length(posW - underFogEye.xyz)));
}
#endif
`,pbr:`#ifdef UNDERWATERFOG
finalColor.rgb = underFogOver(finalColor.rgb, vPositionW, 1.0);
#endif
`,standard:`#ifdef UNDERWATERFOG
color.rgb = underFogOver(color.rgb, vPositionW, 0.0);
#endif
`}}var J=`UnderwaterFog`,le=class extends o{state;_isEnabled=!0;constructor(e,t){super(e,J,320,{UNDERWATERFOG:!1},!0,!0),this.state=t}rebind(e){this.state=e}get pbr(){return this._material.getClassName()===`PBRMaterial`}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}getClassName(){return`UnderwaterFogPlugin`}isCompatible(e){return e===c.GLSL||e===c.WGSL}prepareDefines(e){e.UNDERWATERFOG=this._isEnabled}getUniforms(e=c.GLSL){return{ubo:[{name:`underFogEye`,size:4,type:`vec4`},{name:`underFogColour`,size:4,type:`vec4`}],fragment:e===c.WGSL?K:G}}bindForSubMesh(e){if(!this._isEnabled)return;let t=this.state;e.updateFloat4(`underFogEye`,t.eye.x,t.eye.y,t.eye.z,t.density),t.density>0&&e.updateFloat4(`underFogColour`,t.colour[0],t.colour[1],t.colour[2],1)}getCustomCode(e,t=c.GLSL){if(e!==`fragment`)return null;let n=q(t===c.WGSL?`webgpu`:`webgl2`);return{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FOG:this.pbr?n.pbr:n.standard}}},Y=e=>{if(e.name===`water`)return!1;let t=e.getClassName();return t===`StandardMaterial`||t===`PBRMaterial`},X=e=>{if(e.name!==`ground`)return!1;let t=e.getClassName();return t===`StandardMaterial`||t===`PBRMaterial`},ue=400;function de(n,a){let o={on:!1,frame:null,now:t.Identity(),before:t.Identity(),strength:0,steps:0,growth:1,first:1},s={now:null,depthMap:null,screen:[1,1],forward:new e(0,0,1),focal:600,mirror:o},c={eye:new e,surface:new e,up:new e(0,1,0),sun:new e(0,1,0),strength:0,timeS:0,origin:new e,east:new e(1,0,0),north:new e(0,0,1)},f={eye:new e,density:0,colour:[0,0,0]},p=[],m=l(n),h=()=>m.take(e=>{if(d(e)&&(R(e)||X(e)||Y(e)))return!1;let t=[R(e)?u(e,I,s,()=>new L(e,s)):void 0,!R(e)&&a.groundCaustics&&X(e)?u(e,H,c,()=>new U(e,c)):void 0,Y(e)?u(e,J,f,()=>new le(e,f)):void 0];for(let e of t)e&&p.push(e)});h();let g=null,v=t=>{let i=n.activeCamera;if(t&&!g&&i){let t=n.enableDepthRenderer(i,!1,!1,1,!0);ee(t);let a=t.getDepthMap(),o=[],c=-1;a.getCustomRenderList=()=>{let t=n.getFrameId();if(t===c)return o;c=t,o.length=0;let a=r.GetPlanes(i.getTransformationMatrix()),s=!1;for(let t of n.meshes){if(!t.isEnabled())continue;let n=t.getBoundingInfo().boundingSphere;e.Distance(n.centerWorld,i.globalPosition)-n.radiusWorld>=400||!t.isInFrustum(a)||(t.material?.name===`water`?s=!0:o.push(t))}return s||(o.length=0),o},g={renderer:t,camera:i},s.depthMap=a;for(let e of p)e instanceof L&&e.depthChanged()}else if(!t&&g){n.disableDepthRenderer(g.camera),g=null,s.depthMap=null;for(let e of p)e instanceof L&&e.depthChanged()}},y=me(n,a.engineKind),b=new Map,x=e=>{if(!e)return null;let t=b.get(e);return t||(t=new i(e),b.set(e,t)),t},S={before:null,eye:[0,0,0],asked:0},C=n.onAfterCameraRenderObservable.add(e=>{e===n.activeCamera&&(S.before=Z(e))}),w=n.onBeforeCameraRenderObservable.add(t=>{if(!o.on||t!==n.activeCamera||!S.before)return;let r=Z(t);Q(r,S.eye,o.now),Q(S.before,S.eye,o.before),o.strength=e.Distance(r.position,S.before.position)>_.jumpM?0:S.asked}),T=e=>{let t=n.activeCamera,r=!!t&&e.depth&&(e.mirror??0)>0&&(e.mirrorDetail??0)>0;a.previousFrame||y.want(r?t:null);let i=r?a.previousFrame?a.previousFrame():y.previous():null,s=r&&i!==null&&S.before!==null;if(o.frame=s?x(i):null,s!==o.on){o.on=s;for(let e of p)e instanceof L&&e.depthChanged()}if(!s)return;let c=te(e.mirrorDetail??0);S.eye=e.eye,S.asked=Math.min(1,Math.max(0,e.mirror??0)),o.steps=c.steps,o.growth=c.growth,o.first=c.firstScale},E=!1;return{update(t){if(E)return;h(),s.now=t;let r=n.getEngine();s.screen=[r.getRenderWidth()||1,r.getRenderHeight()||1];let i=n.activeCamera;if(i&&(s.forward=i.getDirection(e.Forward()),s.focal=s.screen[1]/(2*Math.tan(i.fov/2))),v(t.depth),T(t),f.eye.set(t.eye[0],t.eye[1],t.eye[2]),f.density=Math.max(0,t.fogDensity),f.colour=[t.under[0],t.under[1],t.under[2]],c.strength=t.overEye>0?t.caustics:0,c.strength>0){let n=e.FromArray(t.centre);c.eye.set(t.eye[0],t.eye[1],t.eye[2]),c.up.copyFrom(c.eye.subtract(n).normalize()),c.surface.copyFrom(c.eye.add(c.up.scale(t.overEye))),c.sun.set(t.sun[0],t.sun[1],t.sun[2]),c.timeS=t.timeS,c.origin.set(t.waveOrigin[0],t.waveOrigin[1],t.waveOrigin[2]),c.east.set(t.waveEast[0],t.waveEast[1],t.waveEast[2]),c.north.set(t.waveNorth[0],t.waveNorth[1],t.waveNorth[2])}},dispose(){E=!0,m.dispose(),n.onAfterCameraRenderObservable.remove(C),n.onBeforeCameraRenderObservable.remove(w),y.dispose(),b.clear(),v(!1);for(let e of p)e.isEnabled=!1;p.length=0}}}function Z(e){let t=e.getViewMatrix().clone();t.setTranslationFromFloats(0,0,0);let n=e.getProjectionMatrix().clone(),r=n.asArray();return e.mode===0&&n.setRowFromFloats(2,0,0,r[10],r[11]),{position:e.globalPosition.clone(),turn:t,projection:n}}function Q(e,n,r){t.TranslationToRef(n[0]-e.position.x,n[1]-e.position.y,n[2]-e.position.z,r),r.multiplyToRef(e.turn,r),r.multiplyToRef(e.projection,r)}var $=`planetMirrorKeep`,fe=`
varying vec2 vUV;
uniform sampler2D textureSampler;
void main(void) {
  gl_FragColor = texture2D(textureSampler, vUV);
}`,pe=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  fragmentOutputs.color = textureSampleLevel(textureSampler, textureSamplerSampler, input.vUV, 0.0);
}`;function me(e,t){let r=e.getEngine(),i=t===`webgpu`,o=null,l=(e,t)=>{if(t._postProcesses.filter(e=>e!==null)[0]===e)return;let n=t._postProcesses.indexOf(e);n>=0&&t._postProcesses.splice(n,1),t._postProcesses.unshift(e)},u=()=>{o&&=(e.onBeforeCameraRenderObservable.remove(o.turning),o.pass.dispose(o.camera),o.textures.forEach(e=>e.dispose()),null)};return{want(t){if(o&&o.camera!==t&&u(),!t||o)return;let d=i?n.ShadersStoreWGSL:n.ShadersStore;d[`${$}PixelShader`]??=i?pe:fe;let f=new a($,$,{engine:r,size:1,samplingMode:s.TEXTURE_BILINEAR_SAMPLINGMODE,textureType:s.TEXTURETYPE_HALF_FLOAT,shaderLanguage:i?c.WGSL:c.GLSL});t.attachPostProcess(f,0),l(f,t);let p={pass:f,camera:t,textures:[],write:0,drawn:!1,turning:null};p.turning=e.onBeforeCameraRenderObservable.add(e=>{if(e!==t)return;l(f,t);let n=r.getRenderWidth(!0),i=r.getRenderHeight(!0);if(!p.textures[0]||p.textures[0].width!==n||p.textures[0].height!==i){p.textures.forEach(e=>e.dispose());let e=()=>r.createRenderTargetTexture({width:n,height:i},{generateMipMaps:!1,generateDepthBuffer:!0,generateStencilBuffer:r.isStencilEnable,type:s.TEXTURETYPE_HALF_FLOAT,samplingMode:s.TEXTURE_BILINEAR_SAMPLINGMODE,label:`planetMirrorKeep`});p.textures=[e(),e()],p.drawn=!1}else p.write=1-p.write,p.drawn=!0;f.inputTexture=p.textures[p.write]}),o=p},previous(){return!o||!o.drawn?null:o.textures[o.write]?.texture??null},dispose:u}}export{ue as DEPTH_REACH_M,oe as GROUND_CAUSTIC_UNIFORMS,W as UNDERWATER_FOG_UNIFORMS,y as WATER_REFLECT_UNIFORMS,de as createWaterReflectionsOn,V as selectGroundCausticCode,q as selectUnderwaterFogCode,F as selectWaterReflectCode};
//# sourceMappingURL=waterReflectChunk-BlE5M9oy.js.map