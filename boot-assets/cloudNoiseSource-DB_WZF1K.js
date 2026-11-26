var e=`
float cloudHash(vec3 p) {
  vec3 q = fract(p * 0.1031);
  q += dot(q, q.zyx + 31.32);
  return fract((q.x + q.y) * q.z);
}
float cloudValueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = p - i;
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(cloudHash(i), cloudHash(i + vec3(1.0, 0.0, 0.0)), u.x), mix(cloudHash(i + vec3(0.0, 1.0, 0.0)), cloudHash(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(mix(cloudHash(i + vec3(0.0, 0.0, 1.0)), cloudHash(i + vec3(1.0, 0.0, 1.0)), u.x), mix(cloudHash(i + vec3(0.0, 1.0, 1.0)), cloudHash(i + vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}
// How much cloud lies over the unit direction d (planet frame) of a layer.
float cloudDensityOf(vec3 d, float radius, float cover, float size, float wind, float time, float octaves) {
  if (cover <= 0.0) return 0.0;
  if (cover >= 1.0) return 1.0;
  float turn = time * wind / radius;
  float c = cos(turn);
  float s = sin(turn);
  vec3 p = vec3(d.x * c + d.z * s, d.y, d.z * c - d.x * s) * (radius / size);
  float threshold = 0.5 + (0.5 - cover) * 0.34;
  float lo = threshold - 0.06;
  float hi = threshold + 0.06;
  // The weight of every octave asked for. Each noise lies in 0 to 1, so once even the octaves left at their
  // most could not lift the sum over the cloud's soft edge, or at their least bring it under, the cover is settled.
  float total = 2.0 - 2.0 * exp2(-ceil(octaves));
  float sum = 0.0;
  float weight = 0.0;
  float amp = 1.0;
  float f = 1.0;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= octaves) break;
    sum += amp * cloudValueNoise(p * f);
    weight += amp;
    amp *= 0.5;
    f *= 2.0;
    float rest = total - weight;
    if (sum + rest < lo * total) return 0.0;
    if (sum > hi * total) return 1.0;
  }
  return smoothstep(lo, hi, sum / total);
}`,t=`
fn cloudHash(p: vec3f) -> f32 {
  var q = fract(p * 0.1031);
  q += dot(q, q.zyx + 31.32);
  return fract((q.x + q.y) * q.z);
}
fn cloudValueNoise(p: vec3f) -> f32 {
  let i = floor(p);
  let f = p - i;
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(cloudHash(i), cloudHash(i + vec3f(1.0, 0.0, 0.0)), u.x), mix(cloudHash(i + vec3f(0.0, 1.0, 0.0)), cloudHash(i + vec3f(1.0, 1.0, 0.0)), u.x), u.y),
    mix(mix(cloudHash(i + vec3f(0.0, 0.0, 1.0)), cloudHash(i + vec3f(1.0, 0.0, 1.0)), u.x), mix(cloudHash(i + vec3f(0.0, 1.0, 1.0)), cloudHash(i + vec3f(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}
fn cloudDensityOf(d: vec3f, radius: f32, cover: f32, size: f32, wind: f32, time: f32, octaves: f32) -> f32 {
  if (cover <= 0.0) { return 0.0; }
  if (cover >= 1.0) { return 1.0; }
  let turn = time * wind / radius;
  let c = cos(turn);
  let s = sin(turn);
  let p = vec3f(d.x * c + d.z * s, d.y, d.z * c - d.x * s) * (radius / size);
  let threshold = 0.5 + (0.5 - cover) * 0.34;
  let lo = threshold - 0.06;
  let hi = threshold + 0.06;
  let total = 2.0 - 2.0 * exp2(-ceil(octaves));
  var sum: f32 = 0.0;
  var weight: f32 = 0.0;
  var amp: f32 = 1.0;
  var f: f32 = 1.0;
  for (var i: i32 = 0; i < 8; i++) {
    if (f32(i) >= octaves) { break; }
    sum += amp * cloudValueNoise(p * f);
    weight += amp;
    amp *= 0.5;
    f *= 2.0;
    let rest = total - weight;
    if (sum + rest < lo * total) { return 0.0; }
    if (sum > hi * total) { return 1.0; }
  }
  return smoothstep(lo, hi, sum / total);
}`,n=`
// Where the cloud over the unit direction d begins, as a share of its layer's shell, for cloud c thick there.
float cloudBaseOf(vec3 d, float radius, float size, float wind, float time, float variety, float c) {
  if (variety <= 0.0) return 0.0;
  float turn = time * wind / radius;
  float cs = cos(turn);
  float sn = sin(turn);
  vec3 p = vec3(d.x * cs + d.z * sn, d.y, d.z * cs - d.x * sn) * (radius / size * 0.7) + 41.7;
  return variety * 0.45 * smoothstep(0.25, 0.75, cloudValueNoise(p)) * (1.0 - 0.4 * c);
}
// How much of its light a flat cloud c thick shows from under it, its base lifted by lift (0 to 1 of the most it rises).
float cloudUndersideOf(float c, float lift, float variety) {
  return 1.0 - c * c * (0.3 + 0.4 * variety * (0.5 - lift));
}`,r=`
fn cloudBaseOf(d: vec3f, radius: f32, size: f32, wind: f32, time: f32, variety: f32, c: f32) -> f32 {
  if (variety <= 0.0) { return 0.0; }
  let turn = time * wind / radius;
  let cs = cos(turn);
  let sn = sin(turn);
  let p = vec3f(d.x * cs + d.z * sn, d.y, d.z * cs - d.x * sn) * (radius / size * 0.7) + 41.7;
  return variety * 0.45 * smoothstep(0.25, 0.75, cloudValueNoise(p)) * (1.0 - 0.4 * c);
}
fn cloudUndersideOf(c: f32, lift: f32, variety: f32) -> f32 {
  return 1.0 - c * c * (0.3 + 0.4 * variety * (0.5 - lift));
}`;export{t as i,r as n,e as r,n as t};
//# sourceMappingURL=cloudNoiseSource-DB_WZF1K.js.map