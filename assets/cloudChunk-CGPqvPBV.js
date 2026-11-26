import{a as e,o as t,t as n}from"./math.vector.pure-fvrN3Uzg.js";import{n as r,t as i}from"./math.color.pure-HuMj10qI.js";import{n as a}from"./renderTargetTexture.pure-q0vgXxZq.js";import{Gt as o,dt as s,j as c}from"./index-DCQC-odC.js";import{n as l}from"./shaderMaterial.pure-BISyz_w3.js";import"./renderTargetTexture-B_y4yMiG.js";import"./materialPluginBase-Bp6sbHqu.js";import{t as u}from"./shaderLanguage-CsgORKnQ.js";import"./shaderMaterial-C5RNBznr.js";import{i as d,n as f,r as p,t as m}from"./cloudNoiseSource-DB_WZF1K.js";import{t as h}from"./materialArrivals-BgDToscV.js";import{r as g,t as _}from"./awayMaterials-BFHT3hIB.js";import{t as v}from"./depthRenderer.pure-Ca4p61hN.js";import"./depth.fragment-BC1dvu6J.js";import"./depth.vertex-B0qCmJbt.js";import"./depth.fragment-BjBf-rYG.js";import"./depth.vertex-C18bfSl3.js";import{c as y,i as b,t as ee}from"./meshReadiness-DInEZkyR.js";import{t as x}from"./cutoutDepth-BzTqVC9U.js";var S=[`world`,`worldViewProjection`,`eye`,`centre`,`toPlanet`,`sunDirection`,`radius`,`cover`,`size`,`wind`,`time`,`cloudColor`,`opacity`,`octaves`,`hazeBeta`,`hazeHeight`,`planetRadius`,`baseVariety`],C=[`cloudShadowCentre`,`cloudShadowToPlanet`,`cloudShadowSun`,`cloudShadowTime`,`cloudShadowOctaves`,`cloudShadowRadius`,`cloudShadowCover`,`cloudShadowSize`,`cloudShadowWind`,`cloudShadowStrength`],w=4,T=3,E=10,D=`
precision highp float;
attribute vec3 position;
uniform mat4 world;
uniform mat4 worldViewProjection;
varying vec3 vWorld;
void main(void) {
  vWorld = (world * vec4(position, 1.0)).xyz;
  gl_Position = worldViewProjection * vec4(position, 1.0);
}`,O=`
precision highp float;
varying vec3 vWorld;
uniform vec3 eye;
uniform vec3 centre;
uniform mat4 toPlanet;
uniform vec3 sunDirection;
uniform float radius;
uniform float cover;
uniform float size;
uniform float wind;
uniform float time;
uniform vec3 cloudColor;
uniform float opacity;
uniform float octaves;
uniform float hazeBeta;
uniform float hazeHeight;
uniform float planetRadius;
uniform float baseVariety;
${p}
${m}
// The haze along a line, the altitude changing evenly from a0 to a1, as the air's veil sums it on the ground.
float cloudHazeDepth(float a0, float a1, float len) {
  if (hazeBeta <= 0.0 || len <= 0.0) return 0.0;
  float u0 = max(a0, 0.0) / hazeHeight;
  float u1 = max(a1, 0.0) / hazeHeight;
  float du = u1 - u0;
  if (abs(du) < 1e-4) return hazeBeta * len * exp(-u0);
  return hazeBeta * len * (exp(-u0) - exp(-u1)) / du;
}
void main(void) {
  if (cover <= 0.0) discard;
  vec3 up = normalize(vWorld - centre);
  vec3 d = normalize((toPlanet * vec4(up, 0.0)).xyz);
  float density = cloudDensityOf(d, radius, cover, size, wind, time, octaves);
  if (density <= 0.001) discard;
  float sunUp = dot(up, normalize(sunDirection));
  float day = smoothstep(-0.1, 0.2, sunUp);
  float warm = 1.0 - smoothstep(0.0, 0.3, sunUp);
  vec3 night = vec3(0.12, 0.13, 0.17);
  vec3 light = (night + (cloudColor - night) * day) * (vec3(1.0) - warm * (vec3(1.0) - vec3(1.0, 0.62, 0.42)));
  float alpha = density * opacity * (0.35 + 0.65 * day);
  // From under the layer, a cloud's thick middle is darker, and a cloud whose base lies lower darker than one whose base is high.
  if (length(eye - centre) < radius) {
    float lift = baseVariety > 0.0 ? cloudBaseOf(d, radius, size, wind, time, baseVariety, density) / (baseVariety * 0.45) : 0.5;
    light *= cloudUndersideOf(density, lift, baseVariety);
  }
  // Far cloud is lost in the haze between, summed along the eye's line as the ground's is.
  float hd = cloudHazeDepth(length(eye - centre) - planetRadius, length(vWorld - centre) - planetRadius, length(vWorld - eye));
  alpha *= exp(-hd * hd * 1.4427);
  gl_FragColor = vec4(light, alpha);
}`,k=`
attribute position: vec3f;
uniform world: mat4x4f;
uniform worldViewProjection: mat4x4f;
varying vWorld: vec3f;
@vertex
fn main(input: VertexInputs) -> FragmentInputs {
  vertexOutputs.vWorld = (uniforms.world * vec4f(vertexInputs.position, 1.0)).xyz;
  vertexOutputs.position = uniforms.worldViewProjection * vec4f(vertexInputs.position, 1.0);
}`,A=`
varying vWorld: vec3f;
uniform eye: vec3f;
uniform centre: vec3f;
uniform toPlanet: mat4x4f;
uniform sunDirection: vec3f;
uniform radius: f32;
uniform cover: f32;
uniform size: f32;
uniform wind: f32;
uniform time: f32;
uniform cloudColor: vec3f;
uniform opacity: f32;
uniform octaves: f32;
uniform hazeBeta: f32;
uniform hazeHeight: f32;
uniform planetRadius: f32;
uniform baseVariety: f32;
${d}
${f}
fn cloudHazeDepth(a0: f32, a1: f32, len: f32) -> f32 {
  if (uniforms.hazeBeta <= 0.0 || len <= 0.0) { return 0.0; }
  let u0 = max(a0, 0.0) / uniforms.hazeHeight;
  let u1 = max(a1, 0.0) / uniforms.hazeHeight;
  let du = u1 - u0;
  if (abs(du) < 1e-4) { return uniforms.hazeBeta * len * exp(-u0); }
  return uniforms.hazeBeta * len * (exp(-u0) - exp(-u1)) / du;
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  if (uniforms.cover <= 0.0) { discard; }
  let up = normalize(input.vWorld - uniforms.centre);
  let d = normalize((uniforms.toPlanet * vec4f(up, 0.0)).xyz);
  let density = cloudDensityOf(d, uniforms.radius, uniforms.cover, uniforms.size, uniforms.wind, uniforms.time, uniforms.octaves);
  if (density <= 0.001) { discard; }
  let sunUp = dot(up, normalize(uniforms.sunDirection));
  let day = smoothstep(-0.1, 0.2, sunUp);
  let warm = 1.0 - smoothstep(0.0, 0.3, sunUp);
  let night = vec3f(0.12, 0.13, 0.17);
  var light = (night + (uniforms.cloudColor - night) * day) * (vec3f(1.0) - warm * (vec3f(1.0) - vec3f(1.0, 0.62, 0.42)));
  var alpha = density * uniforms.opacity * (0.35 + 0.65 * day);
  if (length(uniforms.eye - uniforms.centre) < uniforms.radius) {
    var lift: f32 = 0.5;
    if (uniforms.baseVariety > 0.0) { lift = cloudBaseOf(d, uniforms.radius, uniforms.size, uniforms.wind, uniforms.time, uniforms.baseVariety, density) / (uniforms.baseVariety * 0.45); }
    light *= cloudUndersideOf(density, lift, uniforms.baseVariety);
  }
  let hd = cloudHazeDepth(length(uniforms.eye - uniforms.centre) - uniforms.planetRadius, length(input.vWorld - uniforms.centre) - uniforms.planetRadius, length(input.vWorld - uniforms.eye));
  alpha *= exp(-hd * hd * 1.4427);
  fragmentOutputs.color = vec4f(light, alpha);
}`,j=[...S,`thickness`,`steps`,`lightSteps`],M=168,N=8,P=`
precision highp float;
varying vec3 vWorld;
uniform vec3 eye;
uniform vec3 centre;
uniform mat4 toPlanet;
uniform vec3 sunDirection;
uniform float radius;
uniform float thickness;
uniform float cover;
uniform float size;
uniform float wind;
uniform float time;
uniform vec3 cloudColor;
uniform float opacity;
uniform float octaves;
uniform float hazeBeta;
uniform float hazeHeight;
uniform float planetRadius;
uniform float baseVariety;
uniform float steps;
uniform float lightSteps;
${p}
${m}
float cloudHazeDepth(float a0, float a1, float len) {
  if (hazeBeta <= 0.0 || len <= 0.0) return 0.0;
  float u0 = max(a0, 0.0) / hazeHeight;
  float u1 = max(a1, 0.0) / hazeHeight;
  float du = u1 - u0;
  if (abs(du) < 1e-4) return hazeBeta * len * exp(-u0);
  return hazeBeta * len * (exp(-u0) - exp(-u1)) / du;
}
vec2 cloudSphereHit(vec3 o, vec3 d, float r) {
  float b = dot(o, d);
  float c = dot(o, o) - r * r;
  float disc = b * b - c;
  if (disc < 0.0) return vec2(1e20, -1e20);
  float s = sqrt(disc);
  return vec2(-b - s, -b + s);
}
// How dense the cloud is at p (from the planet's centre, in the scene's axes), as the reference's cloudVolumeDensity.
float cloudVolume(vec3 p) {
  float r = length(p);
  float h = (r - radius) / thickness;
  if (h < 0.0 || h > 1.0) return 0.0;
  vec3 d = normalize((toPlanet * vec4(p / r, 0.0)).xyz);
  float c = cloudDensityOf(d, radius, cover, size, wind, time, 4.0);
  if (c <= 0.0) return 0.0;
  // The column stands from its own base to the shell's top, its shape squeezed to fit.
  float b = cloudBaseOf(d, radius, size, wind, time, baseVariety, c);
  float hc = (h - b) / (1.0 - b);
  if (hc < 0.0) return 0.0;
  float turn = time * wind / radius;
  float cs = cos(turn);
  float sn = sin(turn);
  vec3 pp = (toPlanet * vec4(p, 0.0)).xyz;
  vec3 q = vec3(pp.x * cs + pp.z * sn, pp.y, pp.z * cs - pp.x * sn) * (8.3 / size);
  float n = (cloudValueNoise(q) + 0.5 * cloudValueNoise(q * 2.0) + 0.25 * cloudValueNoise(q * 4.0)) / 1.75;
  // The detail heaps the tops unevenly and tears the edges.
  float top = 0.25 + 0.75 * c - 0.25 * n;
  float base = c * smoothstep(0.0, 0.07, hc) * (1.0 - smoothstep(top - 0.25, top, hc));
  if (base <= 0.0) return 0.0;
  return clamp((base - n * 0.45) / (1.0 - 0.45), 0.0, 1.0);
}
// Light scattered at an angle whose cosine is mu: Henyey-Greenstein, times four pi so that light scattered evenly is 1.
#ifdef CLOUD_DEPTH_CULL
uniform sampler2D cloudDepth;
uniform vec2 cloudDepthSize;
uniform vec3 cameraForward;
// Whether the ground stands in front of the shell (shellZ ahead of the camera) at this pixel and at every one around it.
// The lay-over reads a pixel of the target only for the screen's pixels around it, so where all nine are ground, no pixel of sky reads it.
bool cloudGroundInFront(float shellZ) {
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      float z = texture2D(cloudDepth, (gl_FragCoord.xy + vec2(float(x), float(y))) / cloudDepthSize).r;
      if (z <= 0.0 || z >= shellZ || z >= ${b.toFixed(1)}) return false;
    }
  }
  return true;
}
#endif
float cloudPhase(float mu, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * mu, 1.5);
}
void main(void) {
  if (cover <= 0.0) discard;
  vec3 o = eye - centre;
  vec3 dir = normalize(vWorld - eye);
  vec2 outer = cloudSphereHit(o, dir, radius + thickness);
  if (outer.y <= 0.0) discard;
  vec2 inner = cloudSphereHit(o, dir, radius);
  vec2 ground = cloudSphereHit(o, dir, planetRadius);
  // One stretch of the shell along the line: from the eye, where it leaves the inner sphere below the layer, or where it enters the outer from above;
  // to where it leaves the outer, meets the inner from above, or meets the planet.
  float t0 = max(outer.x, 0.0);
  if (length(o) < radius) t0 = inner.y;
  float t1 = outer.y;
  if (inner.x > t0 && inner.x < t1) t1 = inner.x;
  if (ground.x > 0.0 && ground.x < t1) t1 = ground.x;
  t1 = min(t1, t0 + 20000.0);
  if (t1 <= t0) discard;
#ifdef CLOUD_DEPTH_CULL
  if (cloudGroundInFront(t0 * dot(dir, cameraForward))) discard;
#endif
  vec3 sun = normalize(sunDirection);
  float mu = dot(dir, sun);
  float phase = mix(cloudPhase(mu, -0.24), cloudPhase(mu, 0.62), 0.7);
  // Two speeds: long strides through clear air, and once in cloud, back a stride and short steps through it.
  float coarse = clamp((t1 - t0) / steps, 50.0, 800.0);
  float fine = clamp(thickness * 1.2 / steps, 15.0, 200.0);
  // Each pixel starts a little further along than its neighbours, at random, so the strides' bands become an even grain.
  float jitter = cloudHash(vec3(gl_FragCoord.xy, 17.0));
  float t = t0 + coarse * jitter;
  bool inCloud = false;
  float clearRun = 0.0;
  float found = t0;
  // Seen from well outside the shell, where fine steps show little, half the steps.
  float budget = steps * (length(o) > radius + thickness * 5.0 ? 1.5 : 3.0);
  float T = 1.0;
  vec3 S = vec3(0.0);
  float firstHit = -1.0;
  vec3 night = vec3(0.12, 0.13, 0.17);
  float lightStep = thickness * 0.6 / lightSteps;
  for (int i = 0; i < ${M}; i++) {
    if (float(i) >= budget || t > t1) break;
    vec3 p = o + dir * t;
    float dens = cloudVolume(p);
    // Four short steps at the eye, longer by a twentieth of the way gone: a longer stride near the eye steps over a
    // grazed thin cloud top for some pixels' starts and not others, dotting its outline with the shaded cloud behind.
    float stride = min(coarse, fine * 4.0 + (t - t0) * 0.05);
    if (!inCloud) {
      if (dens <= 0.003) { t += stride; continue; }
      inCloud = true;
      clearRun = 0.0;
      found = t;
      t = max(t - stride, t0);
      continue;
    }
    float dt = fine;
    if (dens <= 0.003) {
      // Clear air short of where the stride found cloud does not count toward leaving it: given up there,
      // the march would land back in that cloud's edge, back up again, and spend every step it has.
      if (t > found) clearRun += 1.0;
      if (clearRun > 4.0) inCloud = false;
    } else {
      clearRun = 0.0;
      if (firstHit < 0.0) firstHit = t;
      float sigma = dens * 0.015 * opacity;
      // How much of the sun reaches this point through the cloud toward it.
      float toward = 0.0;
      for (int j = 0; j < ${N}; j++) {
        if (float(j) >= lightSteps) break;
        toward += cloudVolume(p + sun * lightStep * (float(j) + 0.5)) * lightStep;
      }
      float beer = exp(-toward * 0.015 * opacity);
      // The powder darkening: the inside of a cloud facing the sun is less bright than its sunlit edge.
      float powder = 1.0 - exp(-dens * 6.0);
      vec3 up = normalize(p);
      float sunUp = dot(up, sun);
      float day = smoothstep(-0.1, 0.2, sunUp);
      float warm = 1.0 - smoothstep(0.0, 0.3, sunUp);
      vec3 sunLight = (cloudColor * day) * (vec3(1.0) - warm * (vec3(1.0) - vec3(1.0, 0.62, 0.42)));
      float h = clamp((length(p) - radius) / thickness, 0.0, 1.0);
      vec3 ambient = mix(night, cloudColor * vec3(0.62, 0.7, 0.82), day) * (0.55 + 0.45 * h);
      vec3 lum = sunLight * beer * (0.55 + 0.45 * powder) * phase * 1.6 + ambient * 0.5;
      float a = exp(-sigma * dt);
      S += T * lum * (1.0 - a);
      T *= a;
      if (T < 0.02) break;
    }
    t += dt;
  }
  float alpha = 1.0 - T;
  if (alpha < 0.003) discard;
  // Far cloud is lost in the haze between, summed along the eye's line as the ground's is.
  vec3 hit = o + dir * max(firstHit, t0);
  float vhd = cloudHazeDepth(length(o) - planetRadius, length(hit) - planetRadius, length(hit - o));
  alpha *= exp(-vhd * vhd * 1.4427);
  // The light the cloud gives, brought into what a screen shows as the sky's is; multiplied by its alpha, so layers
  // marched into a target of their own sum there as they would over the scene.
  gl_FragColor = vec4((1.0 - exp(-1.4 * S / max(1.0 - T, 1e-4))) * alpha, alpha);
}`,F=`
varying vWorld: vec3f;
uniform eye: vec3f;
uniform centre: vec3f;
uniform toPlanet: mat4x4f;
uniform sunDirection: vec3f;
uniform radius: f32;
uniform thickness: f32;
uniform cover: f32;
uniform size: f32;
uniform wind: f32;
uniform time: f32;
uniform cloudColor: vec3f;
uniform opacity: f32;
uniform octaves: f32;
uniform hazeBeta: f32;
uniform hazeHeight: f32;
uniform planetRadius: f32;
uniform baseVariety: f32;
uniform steps: f32;
uniform lightSteps: f32;
${d}
${f}
fn cloudHazeDepth(a0: f32, a1: f32, len: f32) -> f32 {
  if (uniforms.hazeBeta <= 0.0 || len <= 0.0) { return 0.0; }
  let u0 = max(a0, 0.0) / uniforms.hazeHeight;
  let u1 = max(a1, 0.0) / uniforms.hazeHeight;
  let du = u1 - u0;
  if (abs(du) < 1e-4) { return uniforms.hazeBeta * len * exp(-u0); }
  return uniforms.hazeBeta * len * (exp(-u0) - exp(-u1)) / du;
}
fn cloudSphereHit(o: vec3f, d: vec3f, r: f32) -> vec2f {
  let b = dot(o, d);
  let c = dot(o, o) - r * r;
  let disc = b * b - c;
  if (disc < 0.0) { return vec2f(1e20, -1e20); }
  let s = sqrt(disc);
  return vec2f(-b - s, -b + s);
}
fn cloudVolume(p: vec3f) -> f32 {
  let r = length(p);
  let h = (r - uniforms.radius) / uniforms.thickness;
  if (h < 0.0 || h > 1.0) { return 0.0; }
  let d = normalize((uniforms.toPlanet * vec4f(p / r, 0.0)).xyz);
  let c = cloudDensityOf(d, uniforms.radius, uniforms.cover, uniforms.size, uniforms.wind, uniforms.time, 4.0);
  if (c <= 0.0) { return 0.0; }
  let b = cloudBaseOf(d, uniforms.radius, uniforms.size, uniforms.wind, uniforms.time, uniforms.baseVariety, c);
  let hc = (h - b) / (1.0 - b);
  if (hc < 0.0) { return 0.0; }
  let turn = uniforms.time * uniforms.wind / uniforms.radius;
  let cs = cos(turn);
  let sn = sin(turn);
  let pp = (uniforms.toPlanet * vec4f(p, 0.0)).xyz;
  let q = vec3f(pp.x * cs + pp.z * sn, pp.y, pp.z * cs - pp.x * sn) * (8.3 / uniforms.size);
  let n = (cloudValueNoise(q) + 0.5 * cloudValueNoise(q * 2.0) + 0.25 * cloudValueNoise(q * 4.0)) / 1.75;
  let top = 0.25 + 0.75 * c - 0.25 * n;
  let base = c * smoothstep(0.0, 0.07, hc) * (1.0 - smoothstep(top - 0.25, top, hc));
  if (base <= 0.0) { return 0.0; }
  return clamp((base - n * 0.45) / (1.0 - 0.45), 0.0, 1.0);
}
#ifdef CLOUD_DEPTH_CULL
var cloudDepthSampler: sampler;
var cloudDepth: texture_2d<f32>;
uniform cloudDepthSize: vec2f;
uniform cameraForward: vec3f;
fn cloudGroundInFront(px: vec2f, shellZ: f32) -> bool {
  for (var y: i32 = -1; y <= 1; y++) {
    for (var x: i32 = -1; x <= 1; x++) {
      let z = textureSampleLevel(cloudDepth, cloudDepthSampler, (px + vec2f(f32(x), f32(y))) / uniforms.cloudDepthSize, 0.0).r;
      if (z <= 0.0 || z >= shellZ || z >= ${b.toFixed(1)}) { return false; }
    }
  }
  return true;
}
#endif
fn cloudPhase(mu: f32, g: f32) -> f32 {
  let g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * mu, 1.5);
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  if (uniforms.cover <= 0.0) { discard; }
  let o = uniforms.eye - uniforms.centre;
  let dir = normalize(input.vWorld - uniforms.eye);
  let outer = cloudSphereHit(o, dir, uniforms.radius + uniforms.thickness);
  if (outer.y <= 0.0) { discard; }
  let inner = cloudSphereHit(o, dir, uniforms.radius);
  let ground = cloudSphereHit(o, dir, uniforms.planetRadius);
  var t0 = max(outer.x, 0.0);
  if (length(o) < uniforms.radius) { t0 = inner.y; }
  var t1 = outer.y;
  if (inner.x > t0 && inner.x < t1) { t1 = inner.x; }
  if (ground.x > 0.0 && ground.x < t1) { t1 = ground.x; }
  t1 = min(t1, t0 + 20000.0);
  if (t1 <= t0) { discard; }
#ifdef CLOUD_DEPTH_CULL
  if (cloudGroundInFront(fragmentInputs.position.xy, t0 * dot(dir, uniforms.cameraForward))) { discard; }
#endif
  let sun = normalize(uniforms.sunDirection);
  let mu = dot(dir, sun);
  let phase = mix(cloudPhase(mu, -0.24), cloudPhase(mu, 0.62), 0.7);
  let coarse = clamp((t1 - t0) / uniforms.steps, 50.0, 800.0);
  let fine = clamp(uniforms.thickness * 1.2 / uniforms.steps, 15.0, 200.0);
  let jitter = cloudHash(vec3f(fragmentInputs.position.xy, 17.0));
  var t = t0 + coarse * jitter;
  var inCloud = false;
  var clearRun: f32 = 0.0;
  var found: f32 = t0;
  var budget = uniforms.steps * 3.0;
  if (length(o) > uniforms.radius + uniforms.thickness * 5.0) { budget = uniforms.steps * 1.5; }
  var T: f32 = 1.0;
  var S = vec3f(0.0);
  var firstHit: f32 = -1.0;
  let night = vec3f(0.12, 0.13, 0.17);
  let lightStep = uniforms.thickness * 0.6 / uniforms.lightSteps;
  for (var i: i32 = 0; i < ${M}; i++) {
    if (f32(i) >= budget || t > t1) { break; }
    let p = o + dir * t;
    let dens = cloudVolume(p);
    let stride = min(coarse, fine * 4.0 + (t - t0) * 0.05);
    if (!inCloud) {
      if (dens <= 0.003) { t += stride; continue; }
      inCloud = true;
      clearRun = 0.0;
      found = t;
      t = max(t - stride, t0);
      continue;
    }
    let dt = fine;
    if (dens <= 0.003) {
      if (t > found) { clearRun += 1.0; }
      if (clearRun > 4.0) { inCloud = false; }
    } else {
      clearRun = 0.0;
      if (firstHit < 0.0) { firstHit = t; }
      let sigma = dens * 0.015 * uniforms.opacity;
      var toward: f32 = 0.0;
      for (var j: i32 = 0; j < ${N}; j++) {
        if (f32(j) >= uniforms.lightSteps) { break; }
        toward += cloudVolume(p + sun * lightStep * (f32(j) + 0.5)) * lightStep;
      }
      let beer = exp(-toward * 0.015 * uniforms.opacity);
      let powder = 1.0 - exp(-dens * 6.0);
      let up = normalize(p);
      let sunUp = dot(up, sun);
      let day = smoothstep(-0.1, 0.2, sunUp);
      let warm = 1.0 - smoothstep(0.0, 0.3, sunUp);
      let sunLight = (uniforms.cloudColor * day) * (vec3f(1.0) - warm * (vec3f(1.0) - vec3f(1.0, 0.62, 0.42)));
      let h = clamp((length(p) - uniforms.radius) / uniforms.thickness, 0.0, 1.0);
      let ambient = mix(night, uniforms.cloudColor * vec3f(0.62, 0.7, 0.82), day) * (0.55 + 0.45 * h);
      let lum = sunLight * beer * (0.55 + 0.45 * powder) * phase * 1.6 + ambient * 0.5;
      let a = exp(-sigma * dt);
      S += T * lum * (1.0 - a);
      T *= a;
      if (T < 0.02) { break; }
    }
    t += dt;
  }
  var alpha = 1.0 - T;
  if (alpha < 0.003) { discard; }
  let hit = o + dir * max(firstHit, t0);
  let vhd = cloudHazeDepth(length(o) - uniforms.planetRadius, length(hit) - uniforms.planetRadius, length(hit - o));
  alpha *= exp(-vhd * vhd * 1.4427);
  fragmentOutputs.color = vec4f((1.0 - exp(-1.4 * S / max(1.0 - T, 1e-4))) * alpha, alpha);
}`,I=`
precision highp float;
attribute vec3 position;
uniform mat4 worldViewProjection;
void main(void) {
  gl_Position = worldViewProjection * vec4(position, 1.0);
}`,L=`
precision highp float;
uniform sampler2D cloudTarget;
uniform vec2 screenSize;
void main(void) {
  gl_FragColor = texture2D(cloudTarget, gl_FragCoord.xy / screenSize);
}`,R=`
attribute position: vec3f;
uniform worldViewProjection: mat4x4f;
@vertex
fn main(input: VertexInputs) -> FragmentInputs {
  vertexOutputs.position = uniforms.worldViewProjection * vec4f(vertexInputs.position, 1.0);
}`,z=`
var cloudTargetSampler: sampler;
var cloudTarget: texture_2d<f32>;
uniform screenSize: vec2f;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  fragmentOutputs.color = textureSampleLevel(cloudTarget, cloudTargetSampler, fragmentInputs.position.xy / uniforms.screenSize, 0.0);
}`;function B(e){return e===`webgpu`?{shaderLanguage:u.WGSL,vertexSource:R,fragmentSource:z}:{shaderLanguage:u.GLSL,vertexSource:I,fragmentSource:L}}function V(e,t=!1){return e===`webgpu`?{shaderLanguage:u.WGSL,vertexSource:k,fragmentSource:t?F:A}:{shaderLanguage:u.GLSL,vertexSource:D,fragmentSource:t?P:O}}function H(e,n,r){let a=r.volume,o=V(r.engineKind,!!a),u=s(`clouds`,{diameter:2,segments:192},e);u.isPickable=!1,u.applyFog=!1,u.alphaIndex=E;let d=a?Math.min(1,Math.max(.1,a.scale??1)):1,f=d<1,p=new l(`clouds`,e,{vertexSource:o.vertexSource,fragmentSource:o.fragmentSource},{attributes:[`position`],uniforms:[...a?j:S,...f?[`cloudDepthSize`,`cameraForward`]:[]],samplers:f?[`cloudDepth`]:[],defines:f?[`#define CLOUD_DEPTH_CULL`]:[],needAlphaBlending:!0,shaderLanguage:o.shaderLanguage});p.backFaceCulling=!!a,a&&(p.setFloat(`steps`,Math.max(1,Math.min(a.steps,M))),p.setFloat(`lightSteps`,Math.max(1,Math.min(a.lightSteps,N))),p.alphaMode=c.ALPHA_PREMULTIPLIED_PORTERDUFF),p.disableDepthWrite=!0,p.setFloat(`octaves`,Math.max(1,Math.min(r.octaves,8)));let m=f?U(e,u,p,d,r.engineKind):void 0;u.material=m?.lay??p;let h=n.radius,g=1,_=1,v=e=>{h=a?e.radius+e.thickness:e.radius,u.scaling.setAll(h),p.setFloat(`radius`,e.radius),p.setFloat(`thickness`,Math.max(1,e.thickness)),p.setFloat(`cover`,e.cover),p.setFloat(`size`,e.size),p.setFloat(`wind`,e.wind),g=e.opacity,p.setFloat(`opacity`,g*_),p.setFloat(`baseVariety`,e.baseVariety),p.setColor3(`cloudColor`,new i(...e.color))};return v(n),{setLayer:v,update(e,n,r,i,o,s,c=1,l){c!==_&&(_=c,p.setFloat(`opacity`,g*_)),u.position.copyFrom(l?.centre??n),u.scaling.setAll(h*(l?.scale??1)),a&&(p.cullBackFaces=t.Distance(e,n)>h),m?.update(p.cullBackFaces),p.setVector3(`eye`,e),p.setVector3(`centre`,n),p.setMatrix(`toPlanet`,r),p.setVector3(`sunDirection`,i),p.setFloat(`time`,o),p.setFloat(`hazeBeta`,s.beta),p.setFloat(`hazeHeight`,s.height),p.setFloat(`planetRadius`,s.planetRadius)},isReady:()=>p.isReady(u)&&(m?.lay.isReady(u)??!0),setGroup(e){u.renderingGroupId=e},setOutside(e){p.backFaceCulling=e||!!a,p.zOffsetUnits=e?-64:0},setEnabled(e){u.setEnabled(e)},dispose(){m?.dispose(),u.dispose(!1,!1),p.dispose()}}}function U(n,i,o,s,u){let d=n.getEngine(),f=()=>{let e=n.activeCamera?._postProcesses.find(e=>e!==null);return e&&e.width>0&&e.height>0?{width:e.width,height:e.height}:{width:d.getRenderWidth(!0)||1,height:d.getRenderHeight(!0)||1}},p=f(),m=G(n,y(p.width,p.height,s));o.setTexture(`cloudDepth`,m.map);let h=d.getCaps().textureHalfFloatRender?c.TEXTURETYPE_HALF_FLOAT:c.TEXTURETYPE_UNSIGNED_BYTE,g=new a(`clouds-target`,y(p.width,p.height,s),n,{generateMipMaps:!1,doNotChangeAspectRatio:!0,type:h,samplingMode:c.TEXTURE_BILINEAR_SAMPLINGMODE,generateDepthBuffer:!1});g.wrapU=c.TEXTURE_CLAMP_ADDRESSMODE,g.wrapV=c.TEXTURE_CLAMP_ADDRESSMODE,g.clearColor=new r(0,0,0,0),g.renderList=[i],g.setMaterialForRendering(i,o),n.customRenderTargets.push(g);let _=B(u),v=new l(`clouds-lay`,n,{vertexSource:_.vertexSource,fragmentSource:_.fragmentSource},{attributes:[`position`],uniforms:[`worldViewProjection`,`screenSize`],samplers:[`cloudTarget`],needAlphaBlending:!0,shaderLanguage:_.shaderLanguage});return v.setTexture(`cloudTarget`,g),v.alphaMode=c.ALPHA_PREMULTIPLIED_PORTERDUFF,v.backFaceCulling=!0,v.disableDepthWrite=!0,v.setVector2(`screenSize`,new e(p.width,p.height)),v.onBindObservable.add(()=>v.getEffect()?.setFloat2(`screenSize`,d.getRenderWidth()||1,d.getRenderHeight()||1)),{lay:v,update(r){v.cullBackFaces=r;let i=f(),a=y(i.width,i.height,s);(i.width!==p.width||i.height!==p.height)&&(p=i,g.resize(a),v.setVector2(`screenSize`,new e(i.width,i.height))),m.fit(a),o.setVector2(`cloudDepthSize`,new e(a.width,a.height));let c=n.activeCamera;c&&o.setVector3(`cameraForward`,c.getDirection(t.Forward()))},dispose(){let e=n.customRenderTargets.indexOf(g);e>=0&&n.customRenderTargets.splice(e,1),g.dispose(),v.dispose(),m.release()}}}var W=new WeakMap;function G(e,t){let n=W.get(e);if(n)return n.users++,n.depth;let r=e.getEngine().getCaps().textureHalfFloatRender?c.TEXTURETYPE_HALF_FLOAT:c.TEXTURETYPE_FLOAT,i=new a(`clouds-depth`,t,e,{generateMipMaps:!1,doNotChangeAspectRatio:!0,type:r,samplingMode:c.TEXTURE_NEAREST_SAMPLINGMODE,generateDepthBuffer:!0}),o=new v(e,r,null,!1,c.TEXTURE_NEAREST_SAMPLINGMODE,!0,`clouds-depth`,i);x(o);let s=[],l=-1;i.getCustomRenderList=(t,n,r)=>{let i=e.getFrameId();if(i===l)return s;l=i,s.length=0;for(let e=0;e<r;e++){let t=n?.[e];t&&t.material&&!t.material.needAlphaBlending()&&s.push(t)}return s},e.customRenderTargets.unshift(i);let u=ee(e,e=>(e.subMeshes??[]).every(e=>{let t=e.getMaterial();return!t||t.disableDepthWrite||t.needAlphaBlending()||o.isReady(e,!1)})),d={...t},f={map:i,fit(e){(e.width!==d.width||e.height!==d.height)&&(d={...e},i.resize(e))},release(){let t=W.get(e);if(!t||--t.users>0)return;W.delete(e),u();let n=e.customRenderTargets.indexOf(i);n>=0&&e.customRenderTargets.splice(n,1),o.dispose(),i.dispose()}};return W.set(e,{depth:f,users:1}),f}var K=`#ifdef CLOUDSHADOW
uniform vec3 cloudShadowCentre;
uniform mat4 cloudShadowToPlanet;
uniform vec3 cloudShadowSun;
uniform float cloudShadowTime;
uniform float cloudShadowOctaves;
uniform vec4 cloudShadowRadius;
uniform vec4 cloudShadowCover;
uniform vec4 cloudShadowSize;
uniform vec4 cloudShadowWind;
uniform vec4 cloudShadowStrength;
#endif
`,q=`#ifdef CLOUDSHADOW
uniform cloudShadowCentre: vec3f;
uniform cloudShadowToPlanet: mat4x4f;
uniform cloudShadowSun: vec3f;
uniform cloudShadowTime: f32;
uniform cloudShadowOctaves: f32;
uniform cloudShadowRadius: vec4f;
uniform cloudShadowCover: vec4f;
uniform cloudShadowSize: vec4f;
uniform cloudShadowWind: vec4f;
uniform cloudShadowStrength: vec4f;
#endif
`,J=`#ifdef CLOUDSHADOW
${p}
// How much of the sun's direct light reaches the world point posW through the layers over it.
float cloudShadowAt(vec3 posW) {
  vec3 p = posW - cloudShadowCentre;
  vec3 s = normalize(cloudShadowSun);
  float pp = dot(p, p);
  float b = dot(p, s);
  float light = 1.0;
  for (int i = 0; i < ${w}; i++) {
    float r = cloudShadowRadius[i];
    float k = cloudShadowStrength[i];
    if (k <= 0.0 || pp >= r * r) continue;
    float t = -b + sqrt(b * b - (pp - r * r));
    vec3 d = normalize((cloudShadowToPlanet * vec4(normalize(p + s * t), 0.0)).xyz);
    light *= 1.0 - k * cloudDensityOf(d, r, cloudShadowCover[i], cloudShadowSize[i], cloudShadowWind[i], cloudShadowTime, cloudShadowOctaves);
  }
  return light;
}
#endif
`,Y=`#ifdef CLOUDSHADOW
${d}
fn cloudShadowAt(posW: vec3f) -> f32 {
  let p = posW - uniforms.cloudShadowCentre;
  let s = normalize(uniforms.cloudShadowSun);
  let pp = dot(p, p);
  let b = dot(p, s);
  var light: f32 = 1.0;
  for (var i: i32 = 0; i < ${w}; i++) {
    let r = uniforms.cloudShadowRadius[i];
    let k = uniforms.cloudShadowStrength[i];
    if (k <= 0.0 || pp >= r * r) { continue; }
    let t = -b + sqrt(b * b - (pp - r * r));
    let d = normalize((uniforms.cloudShadowToPlanet * vec4f(normalize(p + s * t), 0.0)).xyz);
    light *= 1.0 - k * cloudDensityOf(d, r, uniforms.cloudShadowCover[i], uniforms.cloudShadowSize[i], uniforms.cloudShadowWind[i], uniforms.cloudShadowTime, uniforms.cloudShadowOctaves);
  }
  return light;
}
#endif
`;function X(e){return e===`webgpu`?{definitions:Y,pbr:`#ifdef CLOUDSHADOW
let cloudShade = cloudShadowAt(fragmentInputs.vPositionW);
finalDiffuse *= cloudShade;
#ifdef SPECULARTERM
finalSpecularScaled *= cloudShade;
#endif
#endif
`,standard:`#ifdef CLOUDSHADOW
color = vec4f(color.rgb * cloudShadowAt(fragmentInputs.vPositionW), color.a);
#endif
`}:{definitions:J,pbr:`#ifdef CLOUDSHADOW
float cloudShade = cloudShadowAt(vPositionW);
finalDiffuse *= cloudShade;
#ifdef SPECULARTERM
finalSpecularScaled *= cloudShade;
#endif
#endif
`,standard:`#ifdef CLOUDSHADOW
color.rgb *= cloudShadowAt(vPositionW);
#endif
`}}var Z=`CloudShadow`,Q=class extends o{state;_isEnabled=!0;constructor(e,t){super(e,Z,300,{CLOUDSHADOW:!1},!0,!0),this.state=t}rebind(e){this.state=e}get pbr(){return this._material.getClassName()===`PBRMaterial`}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}getClassName(){return`CloudShadowPlugin`}isCompatible(e){return e===u.GLSL||e===u.WGSL}prepareDefines(e){e.CLOUDSHADOW=this._isEnabled}getUniforms(e=u.GLSL){return{ubo:[{name:`cloudShadowCentre`,size:3,type:`vec3`},{name:`cloudShadowToPlanet`,size:16,type:`mat4`},{name:`cloudShadowSun`,size:3,type:`vec3`},{name:`cloudShadowTime`,size:1,type:`float`},{name:`cloudShadowOctaves`,size:1,type:`float`},{name:`cloudShadowRadius`,size:4,type:`vec4`},{name:`cloudShadowCover`,size:4,type:`vec4`},{name:`cloudShadowSize`,size:4,type:`vec4`},{name:`cloudShadowWind`,size:4,type:`vec4`},{name:`cloudShadowStrength`,size:4,type:`vec4`}],fragment:e===u.WGSL?q:K}}bindForSubMesh(e){if(!this._isEnabled)return;let t=this.state,n=e=>[e[0]??0,e[1]??0,e[2]??0,e[3]??0];e.updateFloat3(`cloudShadowCentre`,t.centre.x,t.centre.y,t.centre.z),e.updateMatrix(`cloudShadowToPlanet`,t.toPlanet),e.updateFloat3(`cloudShadowSun`,t.sun.x,t.sun.y,t.sun.z),e.updateFloat(`cloudShadowTime`,t.timeS),e.updateFloat(`cloudShadowOctaves`,T),e.updateFloat4(`cloudShadowRadius`,...n(t.radius)),e.updateFloat4(`cloudShadowCover`,...n(t.cover)),e.updateFloat4(`cloudShadowSize`,...n(t.size)),e.updateFloat4(`cloudShadowWind`,...n(t.wind)),e.updateFloat4(`cloudShadowStrength`,...n(t.strength))}getCustomCode(e,t=u.GLSL){if(e!==`fragment`)return null;let n=X(t===u.WGSL?`webgpu`:`webgl2`);return this.pbr?{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:n.pbr}:{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FOG:n.standard}}},$=e=>{let t=e.getClassName();return t===`StandardMaterial`||t===`PBRMaterial`};function te(e,r){let i={centre:new t(0,0,0),toPlanet:n.Identity(),sun:new t(0,1,0),timeS:0,radius:[],cover:[],size:[],wind:[],strength:[]},a=[],o=h(e),s=()=>o.take(e=>{if($(e)&&_(e))return!1;let t=$(e)?g(e,Z,i,()=>new Q(e,i)):void 0;t&&a.push(t)});s();let c=!1,l=[],u=1;return{setLayers(e){let t=e.slice(0,w);i.radius=t.map(e=>e.radius),i.cover=t.map(e=>e.cover),i.size=t.map(e=>e.size),i.wind=t.map(e=>e.wind),l=t.map(e=>e.shadow),i.strength=l.map(e=>e*u)},update(e,t,n,r,a=1){c||(a!==u&&(u=a,i.strength=l.map(e=>e*u)),s(),i.centre.copyFrom(e),i.toPlanet.copyFrom(t),i.sun.copyFrom(n),i.timeS=r)},dispose(){c=!0,o.dispose();for(let e of a)e.isEnabled=!1;a.length=0}}}export{C as CLOUD_SHADOW_UNIFORMS,S as CLOUD_UNIFORMS,j as CLOUD_VOLUME_UNIFORMS,te as createCloudShadows,H as createClouds,B as selectCloudCompositeSources,V as selectCloudShaderSources,X as selectCloudShadowCode};
//# sourceMappingURL=cloudChunk-CGPqvPBV.js.map