import{o as e,t}from"./math.vector.pure-C0qb8_DJ.js";import{t as n}from"./math.color.pure-CkEBM6c0.js";import{n as r}from"./texture.pure-DEIEHbsx.js";import{t as i}from"./mesh.pure-lUF0_hFV.js";import{Ct as a,q as o,x as s}from"../webverse-boot.js";import{n as c,t as l}from"./proceduralTexture.pure-BlY2z0Sb.js";import{n as u}from"./shaderMaterial.pure-BzOiL2wN.js";import"./materialPluginBase-B05skLyX.js";import{t as d}from"./shaderLanguage-CsgORKnQ.js";import"./shaderMaterial-C4cWUz9H.js";import{i as f,r as p}from"./cloudNoiseSource-DB_WZF1K.js";import{t as m}from"./materialArrivals-BgDToscV.js";import{r as h,t as g}from"./awayMaterials-BFHT3hIB.js";c();var _=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],v=e=>{let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]},y=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]];function ee(e,t,n){let r=Math.hypot(t[0],t[1],t[2]),i=v(t),a=[n[0]-i[0]*_(n,i),n[1]-i[1]*_(n,i),n[2]-i[2]*_(n,i)];Math.hypot(...a)<1e-6&&(a=Math.abs(i[0])<.9?y(i,[1,0,0]):y(i,[0,0,1]));let o=v(a),s=y(i,o),c=Math.acos(Math.min(1,Math.sqrt(Math.max(0,r*r-e.radius*e.radius))/r));return{up:i,forward:o,side:s,horizon:Math.PI-c,below:c}}var b=[`radius`,`top`,`rayleighHeight`,`mieHeight`,`rayleigh`,`mie`,`steps`,`lightSteps`],x=[`viewUp`,`viewForward`,`viewSide`,`viewHorizon`,`viewBelow`],S=[`world`,`worldViewProjection`,`eye`,`centre`,`sunDirection`,...b,...x,`toStars`,`starDensity`,`starSeed`,`time`,`airStrength`],te=[`eye`,`centre`,`sunDirection`,...b,...x],C=32,w=8,T=e=>Number.isInteger(e)?`${e}.0`:String(e),E=`
uniform vec3 eye;
uniform vec3 centre;
uniform vec3 sunDirection;
uniform float radius;
uniform float top;
uniform float rayleighHeight;
uniform float mieHeight;
uniform vec3 rayleigh;
uniform float mie;
uniform float steps;
uniform float lightSteps;
uniform vec3 viewUp;
uniform vec3 viewForward;
uniform vec3 viewSide;
uniform float viewHorizon;
uniform float viewBelow;
`,D=`
vec2 sphereHit(vec3 o, vec3 d, float r) {
  float b = dot(o, d);
  float c = dot(o, o) - r * r;
  float disc = b * b - c;
  if (disc < 0.0) return vec2(1e20, -1e20);
  float s = sqrt(disc);
  return vec2(-b - s, -b + s);
}
// The light the air scatters toward the eye at o (from the planet's centre) along d, untone-mapped; in through, the share of space's light it lets through.
vec3 airLight(vec3 o, vec3 d, vec3 sun, out vec3 through) {
  float outer = radius + top;
  vec3 sumR = vec3(0.0);
  vec3 sumM = vec3(0.0);
  float odR = 0.0;
  float odM = 0.0;
  vec2 hit = sphereHit(o, d, outer);
  if (hit.y > 0.0 && hit.x < hit.y) {
    float start = max(hit.x, 0.0);
    float end = hit.y;
    vec2 ground = sphereHit(o, d, radius);
    if (ground.x > 0.0 && ground.x < end) end = ground.x;
    float ds = (end - start) / steps;
    for (int i = 0; i < ${C}; i++) {
      if (float(i) >= steps) break;
      vec3 p = o + d * (start + (float(i) + 0.5) * ds);
      float h = length(p) - radius;
      float dR = exp(-h / rayleighHeight) * ds;
      float dM = exp(-h / mieHeight) * ds;
      odR += dR;
      odM += dM;
      vec2 shadow = sphereHit(p, sun, radius);
      if (shadow.x > 0.0 && shadow.x < shadow.y) continue;
      float dl = sphereHit(p, sun, outer).y / lightSteps;
      float lR = 0.0;
      float lM = 0.0;
      for (int j = 0; j < ${w}; j++) {
        if (float(j) >= lightSteps) break;
        float hq = length(p + sun * (float(j) + 0.5) * dl) - radius;
        lR += exp(-hq / rayleighHeight) * dl;
        lM += exp(-hq / mieHeight) * dl;
      }
      vec3 att = exp(-(rayleigh * (odR + lR) + mie * 1.1 * (odM + lM)));
      sumR += att * dR;
      sumM += att * dM;
    }
  }
  float mu = dot(d, sun);
  float phaseR = 3.0 / (16.0 * 3.14159265) * (1.0 + mu * mu);
  float g = 0.76;
  float phaseM = 3.0 / (8.0 * 3.14159265) * ((1.0 - g * g) * (1.0 + mu * mu)) / ((2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * mu, 1.5));
  through = exp(-(rayleigh * odR + mie * 1.1 * odM));
  return 20.0 * (sumR * rayleigh * phaseR + sumM * mie * phaseM);
}
`,O=`
vec2 skyViewUnit(vec3 d) {
  float cz = clamp(dot(d, viewUp), -1.0, 1.0);
  float z = acos(cz);
  vec3 level = d - viewUp * cz;
  float fl = length(level);
  float ca = fl > 1e-6 ? clamp(dot(level, viewForward) / fl, -1.0, 1.0) : 1.0;
  float u = sqrt(max(0.0, 0.5 - 0.5 * ca));
  float v = z < viewHorizon ? 0.5 * (1.0 - sqrt(max(0.0, 1.0 - z / viewHorizon))) : 0.5 + 0.5 * sqrt(min(1.0, (z - viewHorizon) / viewBelow));
  return vec2(u, v);
}
vec3 skyViewDirection(float u, float v) {
  float ca = 1.0 - 2.0 * u * u;
  float sa = sqrt(max(0.0, 1.0 - ca * ca));
  float w = v < 0.5 ? 1.0 - 2.0 * v : 2.0 * v - 1.0;
  float z = v < 0.5 ? viewHorizon * (1.0 - w * w) : viewHorizon + viewBelow * w * w;
  return viewUp * cos(z) + sin(z) * (viewForward * ca + viewSide * sa);
}
`,k=`
uniform mat4 toStars;
uniform float starDensity;
uniform float starSeed;
uniform float time;
// How many of the stars are drawn, 0 to 1: they fade in as the eye comes into the planet's hold, where the air seen from outside drew none.
uniform float airStrength;

vec3 starHash(vec3 p) {
  vec3 q = fract(p * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yxz + 33.33);
  return fract((q.xxy + q.yxx) * q.zyx);
}
// The stars toward d (in the stars' own sky), as the reference makes them (stars.ts).
vec3 starLight(vec3 d) {
  vec3 col = vec3(0.0);
  for (int l = 0; l < 2; l++) {
    float scale = l == 0 ? 220.0 : 700.0;
    float share = l == 0 ? 0.35 : 0.5;
    float bright = l == 0 ? 1.0 : 0.35;
    vec3 p = d * scale;
    vec3 c = floor(p);
    vec3 h = starHash(c + vec3(starSeed * 17.0, -starSeed * 31.0, starSeed * 7.0));
    if (h.x >= share * starDensity) continue;
    vec3 at = starHash(c + vec3(-5.0, 11.0 + starSeed, 3.0));
    vec3 s = c + 0.3 + 0.4 * at;
    vec3 off = (p - s) / 0.22;
    float fall = exp(-dot(off, off));
    // A slow twinkle, star by star.
    float glow = bright * (0.15 + 3.0 * pow(h.y, 8.0)) * fall * (0.85 + 0.15 * sin(time * 2.7 + h.z * 40.0));
    float t = h.z;
    vec3 tint = t < 0.5 ? vec3(0.8 + 0.4 * t, 0.88 + 0.24 * t, 1.12 - 0.12 * t) : vec3(1.0 + 0.25 * (t - 0.5), 1.0 - 0.2 * (t - 0.5), 1.0 - 0.5 * (t - 0.5));
    col += glow * tint;
  }
  return col;
}
// The sun toward cosine mu from it: a soft disc darker at its rim, in the glow the air scatters about it (atmosphere.ts sunGlow).
float sunGlow(float mu) {
  float angle = acos(clamp(mu, -1.0, 1.0));
  float r = angle / 0.008;
  float rim = 1.0 - 0.6 * (1.0 - sqrt(max(0.0, 1.0 - min(r, 1.0) * min(r, 1.0))));
  float disc = 40.0 * rim * (1.0 - smoothstep(0.85, 1.15, r));
  return disc + 0.6 * exp(-angle / 0.035) + 0.08 * exp(-angle / 0.15);
}
// The sky toward d: the air's light c, the sun in its glow through the air, tone-mapped, and the stars where it is dark.
vec3 skyFrom(vec3 c, vec3 through, vec3 d, vec3 sun) {
  c += sunGlow(dot(d, sun)) * through;
  vec3 sky = vec3(1.0) - exp(-c);
  float dark = clamp(1.0 - 8.0 * dot(sky, vec3(0.3, 0.59, 0.11)), 0.0, 1.0);
  // Where the sky is too bright for any star the stars are not looked for: in daylight, everywhere.
  if (dark > 0.0 && starDensity > 0.0) sky += starLight(normalize((toStars * vec4(d, 0.0)).xyz)) * dark * through * airStrength;
  return sky;
}
`,A=`
precision highp float;
attribute vec3 position;
uniform mat4 world;
uniform mat4 worldViewProjection;
varying vec3 vWorld;
void main(void) {
  vWorld = (world * vec4(position, 1.0)).xyz;
  gl_Position = worldViewProjection * vec4(position, 1.0);
}`,j=`
precision highp float;
varying vec3 vWorld;
${E}${D}${k}
void main(void) {
  vec3 d = normalize(vWorld - eye);
  vec3 sun = normalize(sunDirection);
  vec3 through;
  vec3 c = airLight(eye - centre, d, sun, through);
  gl_FragColor = vec4(skyFrom(c, through, d, sun), 1.0);
}`,M=`
precision highp float;
varying vec3 vWorld;
uniform sampler2D skyView;
${E}${O}${k}
void main(void) {
  vec3 d = normalize(vWorld - eye);
  vec3 sun = normalize(sunDirection);
  vec2 at = skyViewUnit(d);
  float y = (0.5 + at.y * ${T(127)}) / ${T(128)};
  vec3 c = texture2D(skyView, vec2((0.5 + at.x * ${T(95)}) / ${T(98)}, y)).rgb;
  vec3 through = texture2D(skyView, vec2(${T(97.5)} / ${T(98)}, y)).rgb;
  gl_FragColor = vec4(skyFrom(c, through, d, sun), 1.0);
}`,ne=`
precision highp float;
${E}${D}${O}
void main(void) {
  vec2 px = floor(gl_FragCoord.xy);
  bool through = px.x >= ${T(96)};
  vec3 d = skyViewDirection(through ? 0.0 : px.x / ${T(95)}, px.y / ${T(127)});
  vec3 t;
  vec3 c = airLight(eye - centre, d, normalize(sunDirection), t);
  gl_FragColor = vec4(through ? t : c, 1.0);
}`,N=`
uniform eye: vec3f;
uniform centre: vec3f;
uniform sunDirection: vec3f;
uniform radius: f32;
uniform top: f32;
uniform rayleighHeight: f32;
uniform mieHeight: f32;
uniform rayleigh: vec3f;
uniform mie: f32;
uniform steps: f32;
uniform lightSteps: f32;
uniform viewUp: vec3f;
uniform viewForward: vec3f;
uniform viewSide: vec3f;
uniform viewHorizon: f32;
uniform viewBelow: f32;
`,P=`
fn sphereHit(o: vec3f, d: vec3f, r: f32) -> vec2f {
  let b = dot(o, d);
  let c = dot(o, o) - r * r;
  let disc = b * b - c;
  if (disc < 0.0) { return vec2f(1e20, -1e20); }
  let s = sqrt(disc);
  return vec2f(-b - s, -b + s);
}
struct AirLight {
  scatter: vec3f,
  through: vec3f,
}
fn airLight(o: vec3f, d: vec3f, sun: vec3f) -> AirLight {
  let radius = uniforms.radius;
  let outer = radius + uniforms.top;
  var sumR = vec3f(0.0);
  var sumM = vec3f(0.0);
  var odR: f32 = 0.0;
  var odM: f32 = 0.0;
  let hit = sphereHit(o, d, outer);
  if (hit.y > 0.0 && hit.x < hit.y) {
    let start = max(hit.x, 0.0);
    var end = hit.y;
    let ground = sphereHit(o, d, radius);
    if (ground.x > 0.0 && ground.x < end) { end = ground.x; }
    let ds = (end - start) / uniforms.steps;
    for (var i: i32 = 0; i < ${C}; i++) {
      if (f32(i) >= uniforms.steps) { break; }
      let p = o + d * (start + (f32(i) + 0.5) * ds);
      let h = length(p) - radius;
      let dR = exp(-h / uniforms.rayleighHeight) * ds;
      let dM = exp(-h / uniforms.mieHeight) * ds;
      odR += dR;
      odM += dM;
      let shadow = sphereHit(p, sun, radius);
      if (shadow.x > 0.0 && shadow.x < shadow.y) { continue; }
      let dl = sphereHit(p, sun, outer).y / uniforms.lightSteps;
      var lR: f32 = 0.0;
      var lM: f32 = 0.0;
      for (var j: i32 = 0; j < ${w}; j++) {
        if (f32(j) >= uniforms.lightSteps) { break; }
        let hq = length(p + sun * (f32(j) + 0.5) * dl) - radius;
        lR += exp(-hq / uniforms.rayleighHeight) * dl;
        lM += exp(-hq / uniforms.mieHeight) * dl;
      }
      let att = exp(-(uniforms.rayleigh * (odR + lR) + vec3f(uniforms.mie * 1.1 * (odM + lM))));
      sumR += att * dR;
      sumM += att * dM;
    }
  }
  let mu = dot(d, sun);
  let phaseR = 3.0 / (16.0 * 3.14159265) * (1.0 + mu * mu);
  let g: f32 = 0.76;
  let phaseM = 3.0 / (8.0 * 3.14159265) * ((1.0 - g * g) * (1.0 + mu * mu)) / ((2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * mu, 1.5));
  let through = exp(-(uniforms.rayleigh * odR + vec3f(uniforms.mie * 1.1 * odM)));
  return AirLight(20.0 * (sumR * uniforms.rayleigh * phaseR + sumM * uniforms.mie * phaseM), through);
}
`,F=`
fn skyViewUnit(d: vec3f) -> vec2f {
  let cz = clamp(dot(d, uniforms.viewUp), -1.0, 1.0);
  let z = acos(cz);
  let level = d - uniforms.viewUp * cz;
  let fl = length(level);
  var ca: f32 = 1.0;
  if (fl > 1e-6) { ca = clamp(dot(level, uniforms.viewForward) / fl, -1.0, 1.0); }
  let u = sqrt(max(0.0, 0.5 - 0.5 * ca));
  var v = 0.5 + 0.5 * sqrt(min(1.0, (z - uniforms.viewHorizon) / uniforms.viewBelow));
  if (z < uniforms.viewHorizon) { v = 0.5 * (1.0 - sqrt(max(0.0, 1.0 - z / uniforms.viewHorizon))); }
  return vec2f(u, v);
}
fn skyViewDirection(u: f32, v: f32) -> vec3f {
  let ca = 1.0 - 2.0 * u * u;
  let sa = sqrt(max(0.0, 1.0 - ca * ca));
  var z: f32;
  if (v < 0.5) { let w = 1.0 - 2.0 * v; z = uniforms.viewHorizon * (1.0 - w * w); } else { let w = 2.0 * v - 1.0; z = uniforms.viewHorizon + uniforms.viewBelow * w * w; }
  return uniforms.viewUp * cos(z) + sin(z) * (uniforms.viewForward * ca + uniforms.viewSide * sa);
}
`,I=`
uniform toStars: mat4x4f;
uniform starDensity: f32;
uniform starSeed: f32;
uniform time: f32;
uniform airStrength: f32;

fn starHash(p: vec3f) -> vec3f {
  var q = fract(p * vec3f(0.1031, 0.103, 0.0973));
  q += dot(q, q.yxz + 33.33);
  return fract((q.xxy + q.yxx) * q.zyx);
}
fn starLight(d: vec3f) -> vec3f {
  var col = vec3f(0.0);
  for (var l: i32 = 0; l < 2; l++) {
    var scale: f32 = 220.0;
    var share: f32 = 0.35;
    var bright: f32 = 1.0;
    if (l == 1) { scale = 700.0; share = 0.5; bright = 0.35; }
    let p = d * scale;
    let c = floor(p);
    let seed = uniforms.starSeed;
    let h = starHash(c + vec3f(seed * 17.0, -seed * 31.0, seed * 7.0));
    if (h.x >= share * uniforms.starDensity) { continue; }
    let at = starHash(c + vec3f(-5.0, 11.0 + seed, 3.0));
    let s = c + 0.3 + 0.4 * at;
    let off = (p - s) / 0.22;
    let fall = exp(-dot(off, off));
    let glow = bright * (0.15 + 3.0 * pow(h.y, 8.0)) * fall * (0.85 + 0.15 * sin(uniforms.time * 2.7 + h.z * 40.0));
    let t = h.z;
    var tint = vec3f(1.0 + 0.25 * (t - 0.5), 1.0 - 0.2 * (t - 0.5), 1.0 - 0.5 * (t - 0.5));
    if (t < 0.5) { tint = vec3f(0.8 + 0.4 * t, 0.88 + 0.24 * t, 1.12 - 0.12 * t); }
    col += glow * tint;
  }
  return col;
}
fn sunGlow(mu: f32) -> f32 {
  let angle = acos(clamp(mu, -1.0, 1.0));
  let r = angle / 0.008;
  let rr = min(r, 1.0);
  let rim = 1.0 - 0.6 * (1.0 - sqrt(max(0.0, 1.0 - rr * rr)));
  let disc = 40.0 * rim * (1.0 - smoothstep(0.85, 1.15, r));
  return disc + 0.6 * exp(-angle / 0.035) + 0.08 * exp(-angle / 0.15);
}
fn skyFrom(light: vec3f, through: vec3f, d: vec3f, sun: vec3f) -> vec3f {
  let c = light + sunGlow(dot(d, sun)) * through;
  var sky = vec3f(1.0) - exp(-c);
  let dark = clamp(1.0 - 8.0 * dot(sky, vec3f(0.3, 0.59, 0.11)), 0.0, 1.0);
  // Where the sky is too bright for any star the stars are not looked for: in daylight, everywhere.
  if (dark > 0.0 && uniforms.starDensity > 0.0) { sky += starLight(normalize((uniforms.toStars * vec4f(d, 0.0)).xyz)) * dark * through * uniforms.airStrength; }
  return sky;
}
`,L=`
attribute position: vec3f;
uniform world: mat4x4f;
uniform worldViewProjection: mat4x4f;
varying vWorld: vec3f;
@vertex
fn main(input: VertexInputs) -> FragmentInputs {
  vertexOutputs.vWorld = (uniforms.world * vec4f(vertexInputs.position, 1.0)).xyz;
  vertexOutputs.position = uniforms.worldViewProjection * vec4f(vertexInputs.position, 1.0);
}`,re=`
varying vWorld: vec3f;
${N}${P}${I}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let d = normalize(input.vWorld - uniforms.eye);
  let sun = normalize(uniforms.sunDirection);
  let l = airLight(uniforms.eye - uniforms.centre, d, sun);
  fragmentOutputs.color = vec4f(skyFrom(l.scatter, l.through, d, sun), 1.0);
}`,ie=`
varying vWorld: vec3f;
var skyViewSampler: sampler;
var skyView: texture_2d<f32>;
${N}${F}${I}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let d = normalize(input.vWorld - uniforms.eye);
  let sun = normalize(uniforms.sunDirection);
  let at = skyViewUnit(d);
  let y = (0.5 + at.y * ${T(127)}) / ${T(128)};
  let c = textureSample(skyView, skyViewSampler, vec2f((0.5 + at.x * ${T(95)}) / ${T(98)}, y)).rgb;
  let through = textureSample(skyView, skyViewSampler, vec2f(${T(97.5)} / ${T(98)}, y)).rgb;
  fragmentOutputs.color = vec4f(skyFrom(c, through, d, sun), 1.0);
}`,R=`
varying vUV: vec2f;
${N}${P}${F}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let px = floor(fragmentInputs.position.xy);
  let through = px.x >= ${T(96)};
  var u: f32 = 0.0;
  if (!through) { u = px.x / ${T(95)}; }
  let d = skyViewDirection(u, px.y / ${T(127)});
  let l = airLight(uniforms.eye - uniforms.centre, d, normalize(uniforms.sunDirection));
  var c = l.scatter;
  if (through) { c = l.through; }
  fragmentOutputs.color = vec4f(c, 1.0);
}`,z=.35,B=`
precision highp float;
varying vec3 vWorld;
uniform float airStrength;
uniform float groundHaze;
${E}${D}
void main(void) {
  vec3 d = normalize(vWorld - eye);
  vec3 sun = normalize(sunDirection);
  vec3 through;
  vec3 c = airLight(eye - centre, d, sun, through);
  vec3 light = vec3(1.0) - exp(-c);
  float alpha = clamp(1.0 - dot(through, vec3(1.0 / 3.0)), 0.0, 1.0);
  vec2 ground = sphereHit(eye - centre, d, radius);
  if (ground.x > 0.0 && ground.x < ground.y) {
    light *= ${T(z)} * groundHaze;
    alpha *= ${T(z)} * groundHaze;
  }
  gl_FragColor = vec4(light, alpha) * airStrength;
}`,V=`
varying vWorld: vec3f;
uniform airStrength: f32;
uniform groundHaze: f32;
${N}${P}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let d = normalize(input.vWorld - uniforms.eye);
  let sun = normalize(uniforms.sunDirection);
  let l = airLight(uniforms.eye - uniforms.centre, d, sun);
  var light = vec3f(1.0) - exp(-l.scatter);
  var alpha = clamp(1.0 - dot(l.through, vec3f(1.0 / 3.0)), 0.0, 1.0);
  let ground = sphereHit(uniforms.eye - uniforms.centre, d, uniforms.radius);
  if (ground.x > 0.0 && ground.x < ground.y) {
    light = light * ${T(z)} * uniforms.groundHaze;
    alpha = alpha * ${T(z)} * uniforms.groundHaze;
  }
  fragmentOutputs.color = vec4f(light, alpha) * uniforms.airStrength;
}`,H=[`world`,`worldViewProjection`,`eye`,`centre`,`sunDirection`,...b,...x,`airStrength`,`groundHaze`],ae=`
precision highp float;
attribute vec3 position;
uniform mat4 view;
uniform mat4 projection;
varying vec3 vDir;
void main(void) {
  vDir = position;
  vec4 p = projection * vec4((view * vec4(position, 0.0)).xyz, 1.0);
  gl_Position = p.xyww;
}`,oe=`
precision highp float;
varying vec3 vDir;
uniform vec3 sunDirection;
${k}
void main(void) {
  vec3 d = normalize(vDir);
  vec3 sky = vec3(1.0) - exp(-sunGlow(dot(d, normalize(sunDirection))) * vec3(1.0, 0.98, 0.94));
  if (starDensity > 0.0) sky += starLight(normalize((toStars * vec4(d, 0.0)).xyz)) * airStrength;
  gl_FragColor = vec4(sky, 1.0);
}`,se=`
attribute position: vec3f;
uniform view: mat4x4f;
uniform projection: mat4x4f;
varying vDir: vec3f;
@vertex
fn main(input: VertexInputs) -> FragmentInputs {
  vertexOutputs.vDir = vertexInputs.position;
  let p = uniforms.projection * vec4f((uniforms.view * vec4f(vertexInputs.position, 0.0)).xyz, 1.0);
  vertexOutputs.position = vec4f(p.x, p.y, p.w, p.w);
}`,ce=`
varying vDir: vec3f;
uniform sunDirection: vec3f;
${I}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let d = normalize(fragmentInputs.vDir);
  var sky = vec3f(1.0) - exp(-sunGlow(dot(d, normalize(uniforms.sunDirection))) * vec3f(1.0, 0.98, 0.94));
  if (uniforms.starDensity > 0.0) { sky += starLight(normalize((uniforms.toStars * vec4f(d, 0.0)).xyz)) * uniforms.airStrength; }
  fragmentOutputs.color = vec4f(sky, 1.0);
}`;function U(e){return e===`webgpu`?{vertexSource:se,fragmentSource:ce,shaderLanguage:d.WGSL}:{vertexSource:ae,fragmentSource:oe,shaderLanguage:d.GLSL}}function W(n,r){let a=U(r.engineKind),s=o(`starField`,{diameter:2,segments:32,sideOrientation:i.BACKSIDE},n);s.isPickable=!1,s.applyFog=!1,s.infiniteDistance=!0,s.alwaysSelectAsActiveMesh=!0;let c=new u(`starField`,n,{vertexSource:a.vertexSource,fragmentSource:a.fragmentSource},{attributes:[`position`],uniforms:[`view`,`projection`,`sunDirection`,`toStars`,`starDensity`,`starSeed`,`time`,`airStrength`],shaderLanguage:a.shaderLanguage});return c.disableDepthWrite=!0,c.setVector3(`sunDirection`,new e(0,1,0)),c.setMatrix(`toStars`,t.Identity()),c.setFloat(`starDensity`,0),c.setFloat(`starSeed`,1),c.setFloat(`time`,0),c.setFloat(`airStrength`,1),s.material=c,{update(e,t,n){c.setVector3(`sunDirection`,t),c.setMatrix(`toStars`,n.toStars),c.setFloat(`starDensity`,n.starDensity),c.setFloat(`starSeed`,n.starSeed),c.setFloat(`time`,n.timeS)},setEnabled(e){s.setEnabled(e)},isReady:()=>c.isReady(s),dispose(){s.dispose(!1,!1),c.dispose()}}}function G(e){return e===`webgpu`?{shaderLanguage:d.WGSL,vertexSource:L,fragmentSource:re,lookupFragmentSource:ie,pictureSource:R}:{shaderLanguage:d.GLSL,vertexSource:A,fragmentSource:j,lookupFragmentSource:M,pictureSource:ne}}var K=1.05;function q(e,t,r){e.setFloat(`radius`,t.radius),e.setFloat(`top`,t.top),e.setFloat(`rayleighHeight`,t.rayleighHeight),e.setFloat(`mieHeight`,t.mieHeight),e.setColor3(`rayleigh`,new n(...t.rayleigh)),e.setFloat(`mie`,t.mie),e.setFloat(`steps`,Math.min(r.steps,C)),e.setFloat(`lightSteps`,Math.min(r.lightSteps,w))}function J(t,n,r,i,a){t.setVector3(`eye`,n),t.setVector3(`centre`,r),t.setVector3(`sunDirection`,i);let o=n.subtract(r),s=ee(a,[o.x,o.y,o.z],[i.x,i.y,i.z]);t.setVector3(`viewUp`,new e(...s.up)),t.setVector3(`viewForward`,new e(...s.forward)),t.setVector3(`viewSide`,new e(...s.side)),t.setFloat(`viewHorizon`,s.horizon),t.setFloat(`viewBelow`,s.below)}function le(n,a,c){let d=G(c.engineKind),f=n.getEngine(),p=c.lookup!==!1&&f.getCaps().textureHalfFloatRender===!0,m=o(`atmosphere`,{diameter:2*(a.radius+a.top),segments:64,sideOrientation:i.BACKSIDE},n);m.isPickable=!1,m.applyFog=!1;let h;p&&(h=new l(`skyView`,{width:98,height:128},{fragmentSource:d.pictureSource},n,{shaderLanguage:d.shaderLanguage},!1,!1,s.TEXTURETYPE_HALF_FLOAT),h.wrapU=r.CLAMP_ADDRESSMODE,h.wrapV=r.CLAMP_ADDRESSMODE,h.updateSamplingMode(r.BILINEAR_SAMPLINGMODE),q(h,a,c));let g=new u(`atmosphere`,n,{vertexSource:d.vertexSource,fragmentSource:h?d.lookupFragmentSource:d.fragmentSource},{attributes:[`position`],uniforms:[...S],samplers:h?[`skyView`]:[],shaderLanguage:d.shaderLanguage,needAlphaTesting:!0});return g.disableDepthWrite=!0,q(g,a,c),h&&g.setTexture(`skyView`,h),g.setMatrix(`toStars`,t.Identity()),g.setFloat(`starDensity`,0),g.setFloat(`starSeed`,1),g.setFloat(`time`,0),g.setFloat(`airStrength`,1),m.material=g,{update(t,n,r,i){i&&(g.setMatrix(`toStars`,i.toStars),g.setFloat(`starDensity`,i.starDensity),g.setFloat(`starSeed`,i.starSeed),g.setFloat(`time`,i.timeS),g.setFloat(`airStrength`,i.strength??1)),m.position.copyFrom(n),m.scaling.setAll(Math.max(1,e.Distance(t,n)*K/(a.radius+a.top)));let o=r.normalizeToNew();J(g,t,n,o,a),h&&J(h,t,n,o,a)},isReady:()=>g.isReady(m)&&(!h||h.isReady()),dispose(){m.dispose(!1,!1),g.dispose(),h?.dispose()}}}function ue(e,t,n){let r=n.engineKind===`webgpu`,i=o(`airShell`,{diameter:2*(t.radius+t.top),segments:64},e);i.isPickable=!1,i.applyFog=!1,n.renderingGroupId!==void 0&&(i.renderingGroupId=n.renderingGroupId);let a=new u(`airShell`,e,{vertexSource:r?L:A,fragmentSource:r?V:B},{attributes:[`position`],uniforms:[...H],shaderLanguage:r?d.WGSL:d.GLSL,needAlphaBlending:!0});return a.alphaMode=s.ALPHA_PREMULTIPLIED,a.disableDepthWrite=!0,q(a,t,n),a.setFloat(`airStrength`,1),a.setFloat(`groundHaze`,1),i.material=a,{update(e,n,r,o,s=1,c=1){i.position.copyFrom(n),i.scaling.setAll(r);let l=r>0?r:1,u=e.subtract(e.subtract(n).scale(1/l));J(a,e,u,o.normalizeToNew(),t),a.setFloat(`airStrength`,s),a.setFloat(`groundHaze`,c)},setEnabled(e){i.setEnabled(e)},isReady:()=>a.isReady(i),dispose(){i.dispose(!1,!1),a.dispose()}}}var de=[`airVeilEye`,`airVeilCentre`,`airVeilToPlanet`,`airVeilSun`,`airVeilRadius`,`airVeilFogDensity`,`airVeilFogHeight`,`airVeilFogColor`,`airVeilPatchiness`,`airVeilPatchSize`,`airVeilHazeBeta`,`airVeilHazeHeight`,`airVeilHazeToward`,`airVeilHazeAway`,`airVeilHazeZenith`,`airVeilFogFloor`,`airVeilEyeAltitude`,`airVeilEyeUp`,`airVeilSunLevel`],fe=p.replace(/cloud(Hash|ValueNoise|DensityOf)/g,`veil$1`),pe=f.replace(/cloud(Hash|ValueNoise|DensityOf)/g,`veil$1`),Y=`#ifdef AIRVEIL
uniform vec3 airVeilEye;
uniform vec3 airVeilCentre;
uniform mat4 airVeilToPlanet;
uniform vec3 airVeilSun;
uniform float airVeilRadius;
uniform float airVeilFogDensity;
uniform float airVeilFogHeight;
uniform vec3 airVeilFogColor;
uniform float airVeilPatchiness;
uniform float airVeilPatchSize;
uniform float airVeilHazeBeta;
uniform float airVeilHazeHeight;
uniform vec3 airVeilHazeToward;
uniform vec3 airVeilHazeAway;
uniform vec3 airVeilHazeZenith;
uniform float airVeilFogFloor;
uniform float airVeilEyeAltitude;
uniform vec3 airVeilEyeUp;
uniform vec3 airVeilSunLevel;
#endif
`,X=`#ifdef AIRVEIL
uniform airVeilEye: vec3f;
uniform airVeilCentre: vec3f;
uniform airVeilToPlanet: mat4x4f;
uniform airVeilSun: vec3f;
uniform airVeilRadius: f32;
uniform airVeilFogDensity: f32;
uniform airVeilFogHeight: f32;
uniform airVeilFogColor: vec3f;
uniform airVeilPatchiness: f32;
uniform airVeilPatchSize: f32;
uniform airVeilHazeBeta: f32;
uniform airVeilHazeHeight: f32;
uniform airVeilHazeToward: vec3f;
uniform airVeilHazeAway: vec3f;
uniform airVeilHazeZenith: vec3f;
uniform airVeilFogFloor: f32;
uniform airVeilEyeAltitude: f32;
uniform airVeilEyeUp: vec3f;
uniform airVeilSunLevel: vec3f;
#endif
`,me=`#ifdef AIRVEIL
${fe}
varying float vAirVeilWet;
// How damp the place under the world point posW is, 0 to 1 (fog.ts humidity): 1 without fog or patches.
float airVeilWet(vec3 posW) {
  if (airVeilFogDensity <= 0.0 || airVeilPatchiness <= 0.0) return 1.0;
  vec3 d = (airVeilToPlanet * vec4(normalize(posW - airVeilCentre), 0.0)).xyz;
  float k = airVeilRadius / airVeilPatchSize;
  vec3 q = vec3(d.x * k + 17.3, d.y * k, d.z * k - 5.1);
  float n = (veilValueNoise(q) + 0.5 * veilValueNoise(q * 2.0) + 0.25 * veilValueNoise(q * 4.0)) / 1.75;
  return 1.0 - airVeilPatchiness * (1.0 - smoothstep(0.35, 0.65, n));
}
#endif
`,he=`#ifdef AIRVEIL
varying float vAirVeilWet;
// The thickness along a line, the altitude changing evenly from a0 to a1, of a medium falling by e every height metres.
float airVeilDepth(float density, float height, float a0, float a1, float len) {
  if (density <= 0.0 || len <= 0.0) return 0.0;
  float u0 = max(a0, 0.0) / height;
  float u1 = max(a1, 0.0) / height;
  float du = u1 - u0;
  if (abs(du) < 1e-4) return density * len * exp(-u0);
  return density * len * (exp(-u0) - exp(-u1)) / du;
}
// What the eye sees of colour c at the world point posW, as damp as wet, through the haze and fog between; linearSpace > 0.5 where c is linear light.
// What is the same for every point (the eye's altitude and up, the sun's bearing level with the eye's ground) comes made, once a frame.
vec3 airVeil(vec3 c, vec3 posW, float wet, float linearSpace) {
  vec3 fromCentre = posW - airVeilCentre;
  float rp = length(fromCentre);
  float ap = rp - airVeilRadius;
  vec3 toPoint = posW - airVeilEye;
  float len = length(toPoint);
  float tf = 0.0;
  // No fog, nothing of it to work out.
  if (airVeilFogDensity > 0.0) {
    float sunUp = dot(fromCentre / rp, airVeilSun);
    float dawn = sunUp < 0.1 ? 0.6 + 0.4 * smoothstep(-0.3, 0.0, sunUp) : 1.0 - 0.85 * smoothstep(0.1, 0.55, sunUp);
    tf = airVeilDepth(airVeilFogDensity, airVeilFogHeight, airVeilEyeAltitude - airVeilFogFloor, ap - airVeilFogFloor, len) * dawn * wet;
  }
  float th = airVeilDepth(airVeilHazeBeta, airVeilHazeHeight, airVeilEyeAltitude, ap, len);
  if (tf + th <= 0.0) return c;
  // Fog hides as thickness does; haze as aerial haze is seen, little near and most far off.
  float seenFog = exp(-tf);
  float seenHaze = exp(-th * th * 1.4427);
  float wf = 1.0 - seenFog;
  float wh = 1.0 - seenHaze;
  // The haze is the sky's colour the way the eye looks: level toward the sun or away from it, or overhead.
  vec3 look = toPoint / len;
  float rise = dot(look, airVeilEyeUp);
  vec3 lookLevel = look - airVeilEyeUp * rise;
  float ll = dot(lookLevel, lookLevel);
  float facing = ll > 1e-8 ? dot(lookLevel, airVeilSunLevel) * inversesqrt(ll) : 0.0;
  vec3 hazeColor = mix(mix(airVeilHazeAway, airVeilHazeToward, 0.5 + 0.5 * facing), airVeilHazeZenith, clamp(rise, 0.0, 1.0));
  vec3 veil = (wf * airVeilFogColor + wh * hazeColor) / max(wf + wh, 1e-6);
  // The veil's colours are given as shown; a linear colour takes them in linear light.
  if (linearSpace > 0.5) veil = pow(veil, vec3(2.2));
  return mix(veil, c, seenFog * seenHaze);
}
#endif
`,ge=`#ifdef AIRVEIL
${pe}
varying vAirVeilWet: f32;
fn airVeilWet(posW: vec3f) -> f32 {
  if (uniforms.airVeilFogDensity <= 0.0 || uniforms.airVeilPatchiness <= 0.0) { return 1.0; }
  let d = (uniforms.airVeilToPlanet * vec4f(normalize(posW - uniforms.airVeilCentre), 0.0)).xyz;
  let k = uniforms.airVeilRadius / uniforms.airVeilPatchSize;
  let q = vec3f(d.x * k + 17.3, d.y * k, d.z * k - 5.1);
  let n = (veilValueNoise(q) + 0.5 * veilValueNoise(q * 2.0) + 0.25 * veilValueNoise(q * 4.0)) / 1.75;
  return 1.0 - uniforms.airVeilPatchiness * (1.0 - smoothstep(0.35, 0.65, n));
}
#endif
`,_e=`#ifdef AIRVEIL
varying vAirVeilWet: f32;
fn airVeilDepth(density: f32, height: f32, a0: f32, a1: f32, len: f32) -> f32 {
  if (density <= 0.0 || len <= 0.0) { return 0.0; }
  let u0 = max(a0, 0.0) / height;
  let u1 = max(a1, 0.0) / height;
  let du = u1 - u0;
  if (abs(du) < 1e-4) { return density * len * exp(-u0); }
  return density * len * (exp(-u0) - exp(-u1)) / du;
}
fn airVeil(c: vec3f, posW: vec3f, wet: f32, linearSpace: f32) -> vec3f {
  let fromCentre = posW - uniforms.airVeilCentre;
  let rp = length(fromCentre);
  let ap = rp - uniforms.airVeilRadius;
  let toPoint = posW - uniforms.airVeilEye;
  let len = length(toPoint);
  var tf: f32 = 0.0;
  if (uniforms.airVeilFogDensity > 0.0) {
    let sunUp = dot(fromCentre / rp, uniforms.airVeilSun);
    var dawn: f32 = 1.0 - 0.85 * smoothstep(0.1, 0.55, sunUp);
    if (sunUp < 0.1) { dawn = 0.6 + 0.4 * smoothstep(-0.3, 0.0, sunUp); }
    tf = airVeilDepth(uniforms.airVeilFogDensity, uniforms.airVeilFogHeight, uniforms.airVeilEyeAltitude - uniforms.airVeilFogFloor, ap - uniforms.airVeilFogFloor, len) * dawn * wet;
  }
  let th = airVeilDepth(uniforms.airVeilHazeBeta, uniforms.airVeilHazeHeight, uniforms.airVeilEyeAltitude, ap, len);
  if (tf + th <= 0.0) { return c; }
  let seenFog = exp(-tf);
  let seenHaze = exp(-th * th * 1.4427);
  let wf = 1.0 - seenFog;
  let wh = 1.0 - seenHaze;
  let look = toPoint / len;
  let rise = dot(look, uniforms.airVeilEyeUp);
  let lookLevel = look - uniforms.airVeilEyeUp * rise;
  let ll = dot(lookLevel, lookLevel);
  var facing: f32 = 0.0;
  if (ll > 1e-8) { facing = dot(lookLevel, uniforms.airVeilSunLevel) * inverseSqrt(ll); }
  let hazeColor = mix(mix(uniforms.airVeilHazeAway, uniforms.airVeilHazeToward, 0.5 + 0.5 * facing), uniforms.airVeilHazeZenith, clamp(rise, 0.0, 1.0));
  var veil = (wf * uniforms.airVeilFogColor + wh * hazeColor) / max(wf + wh, 1e-6);
  if (linearSpace > 0.5) { veil = pow(veil, vec3f(2.2)); }
  return mix(veil, c, seenFog * seenHaze);
}
#endif
`;function Z(e){return e===`webgpu`?{vertexDefinitions:ge,vertexEnd:`#ifdef AIRVEIL
vertexOutputs.vAirVeilWet = airVeilWet(worldPos.xyz);
#endif
`,definitions:_e,pbr:`#ifdef AIRVEIL
finalColor = vec4f(airVeil(finalColor.rgb, fragmentInputs.vPositionW, fragmentInputs.vAirVeilWet, 1.0), finalColor.a);
#endif
`,standard:`#ifdef AIRVEIL
color = vec4f(airVeil(color.rgb, fragmentInputs.vPositionW, fragmentInputs.vAirVeilWet, 0.0), color.a);
#endif
`}:{vertexDefinitions:me,vertexEnd:`#ifdef AIRVEIL
vAirVeilWet = airVeilWet(worldPos.xyz);
#endif
`,definitions:he,pbr:`#ifdef AIRVEIL
finalColor.rgb = airVeil(finalColor.rgb, vPositionW, vAirVeilWet, 1.0);
#endif
`,standard:`#ifdef AIRVEIL
color.rgb = airVeil(color.rgb, vPositionW, vAirVeilWet, 0.0);
#endif
`}}var Q=`AirVeil`;function $(e,t,n,r){let i=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],a=Math.hypot(...i),o=[i[0]/a,i[1]/a,i[2]/a],s=Math.hypot(...r),c=[r[0]/s,r[1]/s,r[2]/s],l=c[0]*o[0]+c[1]*o[1]+c[2]*o[2],u=[c[0]-o[0]*l,c[1]-o[1]*l,c[2]-o[2]*l],d=u[0]*u[0]+u[1]*u[1]+u[2]*u[2],f=d>1e-8?[u[0]/Math.sqrt(d),u[1]/Math.sqrt(d),u[2]/Math.sqrt(d)]:[0,0,0];return{eyeAltitude:a-n,eyeUp:o,sun:c,sunLevel:f}}var ve=class extends a{frame;_isEnabled=!0;constructor(e,t){super(e,Q,310,{AIRVEIL:!1},!0,!0),this.frame=t}rebind(e){this.frame=e}get pbr(){return this._material.getClassName()===`PBRMaterial`}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}getClassName(){return`AirVeilPlugin`}isCompatible(e){return e===d.GLSL||e===d.WGSL}prepareDefines(e){e.AIRVEIL=this._isEnabled}getUniforms(e=d.GLSL){return{ubo:[{name:`airVeilEye`,size:3,type:`vec3`},{name:`airVeilCentre`,size:3,type:`vec3`},{name:`airVeilToPlanet`,size:16,type:`mat4`},{name:`airVeilSun`,size:3,type:`vec3`},{name:`airVeilRadius`,size:1,type:`float`},{name:`airVeilFogDensity`,size:1,type:`float`},{name:`airVeilFogHeight`,size:1,type:`float`},{name:`airVeilFogColor`,size:3,type:`vec3`},{name:`airVeilPatchiness`,size:1,type:`float`},{name:`airVeilPatchSize`,size:1,type:`float`},{name:`airVeilHazeBeta`,size:1,type:`float`},{name:`airVeilHazeHeight`,size:1,type:`float`},{name:`airVeilHazeToward`,size:3,type:`vec3`},{name:`airVeilHazeAway`,size:3,type:`vec3`},{name:`airVeilHazeZenith`,size:3,type:`vec3`},{name:`airVeilFogFloor`,size:1,type:`float`},{name:`airVeilEyeAltitude`,size:1,type:`float`},{name:`airVeilEyeUp`,size:3,type:`vec3`},{name:`airVeilSunLevel`,size:3,type:`vec3`}],vertex:e===d.WGSL?X:Y,fragment:e===d.WGSL?X:Y}}bindForSubMesh(e){let t=this.frame.current,n=this.frame.terms;!this._isEnabled||!t||!n||(e.updateFloat3(`airVeilEye`,t.eye.x,t.eye.y,t.eye.z),e.updateFloat3(`airVeilCentre`,t.centre.x,t.centre.y,t.centre.z),e.updateMatrix(`airVeilToPlanet`,t.toPlanet),e.updateFloat3(`airVeilSun`,n.sun[0],n.sun[1],n.sun[2]),e.updateFloat(`airVeilRadius`,t.fog.radius),e.updateFloat(`airVeilFogDensity`,t.fog.density),e.updateFloat(`airVeilFogHeight`,t.fog.height),e.updateFloat3(`airVeilFogColor`,t.fogLight[0],t.fogLight[1],t.fogLight[2]),e.updateFloat(`airVeilPatchiness`,t.fog.patchiness),e.updateFloat(`airVeilPatchSize`,t.fog.patchSize),e.updateFloat(`airVeilHazeBeta`,t.hazeBeta),e.updateFloat(`airVeilHazeHeight`,t.hazeHeight),e.updateFloat3(`airVeilHazeToward`,t.hazeToward[0],t.hazeToward[1],t.hazeToward[2]),e.updateFloat3(`airVeilHazeAway`,t.hazeAway[0],t.hazeAway[1],t.hazeAway[2]),e.updateFloat3(`airVeilHazeZenith`,t.hazeZenith[0],t.hazeZenith[1],t.hazeZenith[2]),e.updateFloat(`airVeilFogFloor`,t.fog.floor),e.updateFloat(`airVeilEyeAltitude`,n.eyeAltitude),e.updateFloat3(`airVeilEyeUp`,n.eyeUp[0],n.eyeUp[1],n.eyeUp[2]),e.updateFloat3(`airVeilSunLevel`,n.sunLevel[0],n.sunLevel[1],n.sunLevel[2]))}getCustomCode(e,t=d.GLSL){let n=Z(t===d.WGSL?`webgpu`:`webgl2`);return e===`vertex`?{CUSTOM_VERTEX_DEFINITIONS:n.vertexDefinitions,CUSTOM_VERTEX_MAIN_END:n.vertexEnd}:e===`fragment`?{CUSTOM_FRAGMENT_DEFINITIONS:n.definitions,CUSTOM_FRAGMENT_BEFORE_FOG:this.pbr?n.pbr:n.standard}:null}};function ye(e,t,n){let r={current:null,terms:null},i=[],a=m(e),o=()=>a.take(e=>{let t=e.getClassName();if(t!==`StandardMaterial`&&t!==`PBRMaterial`)return;if(g(e))return!1;let n=h(e,Q,r,()=>new ve(e,r));n&&i.push(n)});o();let s=!1;return{update(e){s||(o(),r.current=e,r.terms=$([e.eye.x,e.eye.y,e.eye.z],[e.centre.x,e.centre.y,e.centre.z],e.fog.radius,[e.sun.x,e.sun.y,e.sun.z]))},dispose(){s=!0,a.dispose();for(let e of i)e.isEnabled=!1;i.length=0}}}export{H as AIR_SHELL_UNIFORMS,de as AIR_VEIL_UNIFORMS,S as ATMOSPHERE_UNIFORMS,B as SHELL_FRAGMENT_GLSL,V as SHELL_FRAGMENT_WGSL,K as SKY_ENCLOSES,te as SKY_VIEW_UNIFORMS,$ as airVeilTerms,ue as createAirShell,ye as createAirVeil,le as createAtmosphere,W as createStarField,Z as selectAirVeilCode,G as selectAtmosphereShaderSources,U as selectStarFieldSources};
//# sourceMappingURL=atmosphereChunk-Cl42_oC2.js.map