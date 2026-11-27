import{o as e,t}from"./math.vector.pure-fvrN3Uzg.js";import{t as n}from"./shaderStore-D-XQlhUT.js";import{t as r}from"./postProcess.pure-BL5YG0qf.js";import{j as i}from"./index-CPmGphPB.js";import{t as a}from"./shaderLanguage-CsgORKnQ.js";import"./postProcess-B4iOlIzR.js";import{i as o,n as s,r as c,t as l}from"./screenPasses-CaNN_OnX.js";var u={lengthM:.4,steps:12,thicknessM:.2,biasM:.015,biasPerM:.002,fadeStartM:20,fadeEndM:40,strength:.7,upwardFrom:.5,upwardFull:.85},d=e=>Number.isInteger(e)?`${e}.0`:String(e),f=4,p=`planetContactShadows`,m=`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform highp sampler2D depthSampler;
uniform highp sampler2DArrayShadow shadowMap;
uniform vec4 lens;
uniform mat4 projection;
uniform mat4 cascades[${f}];
uniform vec4 splits;
uniform vec3 toSun;
uniform vec3 up;
uniform vec3 light;
uniform vec2 depthNdc;
uniform vec2 zFrom;
uniform vec2 screen;
uniform float halfZ;
uniform float seed;
float depthAt(ivec2 p) { return texelFetch(depthSampler, clamp(p, ivec2(0), textureSize(depthSampler, 0) - 1), 0).r; }
// A point in the eye's space from its place on the screen and its depth, as the perspective projection gives them.
vec3 viewAt(vec2 at, float d) {
  float z = zFrom.y / (d * depthNdc.x + depthNdc.y - zFrom.x);
  return vec3((at * 2.0 - 1.0 - lens.zw) * z / lens.xy, z);
}
vec3 viewAtTexel(ivec2 t, vec2 size) { return viewAt((vec2(t) + 0.5) / size, depthAt(t)); }
void main(void) {
  vec4 colour = texture2D(textureSampler, vUV);
  gl_FragColor = colour;
  vec2 size = vec2(textureSize(depthSampler, 0));
  ivec2 t = ivec2(vUV * size);
  vec3 c = viewAtTexel(t, size);
  if (!(c.z > 0.0 && c.z < ${d(u.fadeEndM)})) return;
  // The face, from the points about it: on each axis the side nearer in depth, so an edge keeps its own face.
  vec3 r = viewAtTexel(t + ivec2(1, 0), size);
  vec3 l = viewAtTexel(t - ivec2(1, 0), size);
  vec3 u = viewAtTexel(t + ivec2(0, 1), size);
  vec3 b = viewAtTexel(t - ivec2(0, 1), size);
  vec3 dx = abs(r.z - c.z) < abs(c.z - l.z) ? r - c : c - l;
  vec3 dy = abs(u.z - c.z) < abs(c.z - b.z) ? u - c : c - b;
  vec3 n = normalize(cross(dx, dy));
  if (dot(n, c) > 0.0) n = -n;
  float cosSun = dot(n, toSun);
  // Only what faces up takes a contact shadow: the ground and the tops of blocks, never a leaf or a wall.
  float upward = smoothstep(${d(u.upwardFrom)}, ${d(u.upwardFull)}, dot(n, up));
  if (cosSun <= 0.0 || upward <= 0.0) return;
  // How far the depth steps from this pixel to the next: a sample must lie further behind than that to count.
  float stepZ = max(abs(dx.z), abs(dy.z));
  // How much of the sun the shadow map lets through: its cascade by depth, none past the last.
  float visible = 1.0;
  int i = -1;
  for (int k = 3; k >= 0; k--) { if (splits[k] >= c.z) i = k; }
  if (i >= 0) {
    vec4 lc = cascades[i] * vec4(c, 1.0);
    vec3 cl = lc.xyz / lc.w;
    vec2 suv = cl.xy * 0.5 + 0.5;
    float sz = halfZ > 0.5 ? cl.z : cl.z * 0.5 + 0.5;
    if (suv.x >= 0.0 && suv.y >= 0.0 && suv.x <= 1.0 && suv.y <= 1.0) visible = texture(shadowMap, vec4(suv, float(i), clamp(sz, 0.0, 0.9999999)));
  }
  float direct = light.x * cosSun * visible;
  float total = direct + mix(light.z, light.y, 0.5 + 0.5 * dot(n, up));
  float share = total > 0.0 ? direct / total : 0.0;
  if (share <= 0.0) return;
  float offset = seed < 0.0 ? 0.5 : fract(52.9829189 * fract(dot(floor(vUV * screen), vec2(0.06711056, 0.00583715))) + seed);
  float occluded = 0.0;
  // The march's ends projected once: a straight line stays straight in clip space, and a sample's depth is its w.
  vec4 q0 = projection * vec4(c, 1.0);
  vec4 q1 = projection * vec4(c + toSun * ${d(u.lengthM)}, 1.0);
  for (int k = 0; k < ${u.steps}; k++) {
    vec4 q = mix(q0, q1, (float(k) + offset) / ${d(u.steps)});
    if (q.w <= 0.0) break;
    vec2 at = q.xy / q.w * 0.5 + 0.5;
    if (at.x < 0.0 || at.y < 0.0 || at.x > 1.0 || at.y > 1.0) break;
    float z = zFrom.y / (depthAt(ivec2(at * size)) * depthNdc.x + depthNdc.y - zFrom.x);
    float behind = q.w - z;
    if (behind > ${d(u.biasM)} + ${d(u.biasPerM)} * q.w + stepZ && behind < ${d(u.thicknessM)}) {
      float near = 1.0 - (float(k) + offset) / ${d(u.steps)};
      occluded = near * near;
      break;
    }
  }
  float fade = 1.0 - smoothstep(${d(u.fadeStartM)}, ${d(u.fadeEndM)}, c.z);
  gl_FragColor = vec4(colour.rgb * (1.0 - ${d(u.strength)} * occluded * share * fade * upward), colour.a);
}`,h=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
var depthSampler: texture_depth_2d;
var shadowMapSampler: sampler_comparison;
var shadowMap: texture_depth_2d_array;
uniform lens: vec4f;
uniform projection: mat4x4f;
uniform cascades: array<mat4x4f, ${f}>;
uniform splits: vec4f;
uniform toSun: vec3f;
uniform up: vec3f;
uniform light: vec3f;
uniform depthNdc: vec2f;
uniform zFrom: vec2f;
uniform screen: vec2f;
uniform halfZ: f32;
uniform seed: f32;
fn depthAt(p: vec2i) -> f32 { return textureLoad(depthSampler, clamp(p, vec2i(0), vec2i(textureDimensions(depthSampler, 0)) - 1), 0); }
fn viewAt(at: vec2f, d: f32) -> vec3f {
  let z = uniforms.zFrom.y / (d * uniforms.depthNdc.x + uniforms.depthNdc.y - uniforms.zFrom.x);
  return vec3f((at * 2.0 - 1.0 - uniforms.lens.zw) * z / uniforms.lens.xy, z);
}
fn viewAtTexel(t: vec2i, size: vec2f) -> vec3f { return viewAt((vec2f(t) + 0.5) / size, depthAt(t)); }
fn shade(uv: vec2f) -> f32 {
  let size = vec2f(textureDimensions(depthSampler, 0));
  let t = vec2i(uv * size);
  let c = viewAtTexel(t, size);
  if (!(c.z > 0.0 && c.z < ${d(u.fadeEndM)})) { return 1.0; }
  let r = viewAtTexel(t + vec2i(1, 0), size);
  let l = viewAtTexel(t - vec2i(1, 0), size);
  let u = viewAtTexel(t + vec2i(0, 1), size);
  let b = viewAtTexel(t - vec2i(0, 1), size);
  var dx = c - l;
  if (abs(r.z - c.z) < abs(c.z - l.z)) { dx = r - c; }
  var dy = c - b;
  if (abs(u.z - c.z) < abs(c.z - b.z)) { dy = u - c; }
  var n = normalize(cross(dx, dy));
  if (dot(n, c) > 0.0) { n = -n; }
  let cosSun = dot(n, uniforms.toSun);
  let upward = smoothstep(${d(u.upwardFrom)}, ${d(u.upwardFull)}, dot(n, uniforms.up));
  if (cosSun <= 0.0 || upward <= 0.0) { return 1.0; }
  let stepZ = max(abs(dx.z), abs(dy.z));
  var visible = 1.0;
  var i = -1;
  for (var k = 3; k >= 0; k--) { if (uniforms.splits[k] >= c.z) { i = k; } }
  if (i >= 0) {
    let lc = uniforms.cascades[i] * vec4f(c, 1.0);
    let cl = lc.xyz / lc.w;
    let suv = cl.xy * 0.5 + 0.5;
    var sz = cl.z * 0.5 + 0.5;
    if (uniforms.halfZ > 0.5) { sz = cl.z; }
    if (all(suv >= vec2f(0.0)) && all(suv <= vec2f(1.0))) { visible = textureSampleCompareLevel(shadowMap, shadowMapSampler, suv, i, clamp(sz, 0.0, 0.9999999)); }
  }
  let direct = uniforms.light.x * cosSun * visible;
  let total = direct + mix(uniforms.light.z, uniforms.light.y, 0.5 + 0.5 * dot(n, uniforms.up));
  var share = 0.0;
  if (total > 0.0) { share = direct / total; }
  if (share <= 0.0) { return 1.0; }
  var offset = 0.5;
  if (uniforms.seed >= 0.0) { offset = fract(52.9829189 * fract(dot(floor(uv * uniforms.screen), vec2f(0.06711056, 0.00583715))) + uniforms.seed); }
  var occluded = 0.0;
  let q0 = uniforms.projection * vec4f(c, 1.0);
  let q1 = uniforms.projection * vec4f(c + uniforms.toSun * ${d(u.lengthM)}, 1.0);
  for (var k = 0; k < ${u.steps}; k++) {
    let q = mix(q0, q1, (f32(k) + offset) / ${d(u.steps)});
    if (q.w <= 0.0) { break; }
    let at = q.xy / q.w * 0.5 + 0.5;
    if (any(at < vec2f(0.0)) || any(at > vec2f(1.0))) { break; }
    let z = uniforms.zFrom.y / (depthAt(vec2i(at * size)) * uniforms.depthNdc.x + uniforms.depthNdc.y - uniforms.zFrom.x);
    let behind = q.w - z;
    if (behind > ${d(u.biasM)} + ${d(u.biasPerM)} * q.w + stepZ && behind < ${d(u.thicknessM)}) {
      let near = 1.0 - (f32(k) + offset) / ${d(u.steps)};
      occluded = near * near;
      break;
    }
  }
  let fade = 1.0 - smoothstep(${d(u.fadeStartM)}, ${d(u.fadeEndM)}, c.z);
  return 1.0 - ${d(u.strength)} * occluded * share * fade * upward;
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let colour = textureSampleLevel(textureSampler, textureSamplerSampler, input.vUV, 0.0);
  fragmentOutputs.color = vec4f(colour.rgb * shade(input.vUV), colour.a);
}`,g=e=>.2126*e.r+.7152*e.g+.0722*e.b,_=e=>{if(!e||e.getClassName()!==`CascadedShadowGenerator`||!e.getShadowMap())return!1;let t=e.getLight();return t.isEnabled()&&t.intensity>0};function v(u,d,v){let y=u.getEngine(),b=v.engineKind===`webgpu`,x=b?a.WGSL:a.GLSL,S=b?n.ShadersStoreWGSL:n.ShadersStore;S[`${p}PixelShader`]??=b?h:m;let C=new r(p,p,{engine:y,size:1,uniforms:[`lens`,`projection`,`cascades`,`splits`,`toSun`,`up`,`light`,`depthNdc`,`zFrom`,`screen`,`halfZ`,`seed`],samplers:[`depthSampler`,`shadowMap`],samplingMode:i.TEXTURE_BILINEAR_SAMPLINGMODE,textureType:i.TEXTURETYPE_HALF_FLOAT,shaderLanguage:x}),w=null,T=!1,E=0,D=u.onBeforeCameraRenderObservable.add(e=>{e===d&&T&&c(d)});C.onActivateObservable.add(()=>s(d,C));let O=new t,k=new Float32Array(64),A=new e,j=new e(0,1,0),M=new e(0,1,0);return C.onApplyObservable.add(t=>{let n=w,r=o(d);r&&t._bindTexture(`depthSampler`,r);let i=d.getProjectionMatrix(),a=d.getViewMatrix();a.invertToRef(O),t.setFloat4(`lens`,i.m[0],i.m[5],i.m[8],i.m[9]),t.setMatrix(`projection`,i);let s=[-1,-1,-1,-1];if(n){let r=Math.min(f,n.numCascades);for(let e=0;e<r;e++){let t=n.getCascadeTransformMatrix(e);t&&O.multiply(t).copyToArray(k,e*16),s[e]=n._viewSpaceFrustumsZ?.[e]??-1}let i=n.getShadowMap();i&&t.setDepthStencilTexture(`shadowMap`,i);let o=n.getLight();e.TransformNormalToRef(o.direction.negate(),a,A),A.normalize();let c=u.lights.find(e=>e.getClassName()===`HemisphericLight`&&e.isEnabled());e.TransformNormalToRef(c?c.direction:M,a,j).normalize(),t.setFloat3(`light`,g(o.diffuse)*o.intensity,c?g(c.diffuse)*c.intensity:0,c?g(c.groundColor)*c.intensity:0)}t.setMatrices(`cascades`,k),t.setFloat4(`splits`,s[0],s[1],s[2],s[3]),t.setFloat3(`toSun`,A.x,A.y,A.z),t.setFloat3(`up`,j.x,j.y,j.z);let[c,p]=l(y.isNDCHalfZRange);t.setFloat2(`depthNdc`,c,p),t.setFloat2(`zFrom`,i.m[10],i.m[14]),t.setFloat2(`screen`,C.width,C.height),t.setFloat(`halfZ`,+!!y.isNDCHalfZRange);let m=d._postProcesses.some(e=>e?.name===`planetTemporal`);E++,t.setFloat(`seed`,m?E*.618034%1:-1)}),{update({shadows:e}){w=_(e)?e:null;let t=w!==null;t!==T&&(T=t,t?(d.attachPostProcess(C),c(d)):d.detachPostProcess(C))},dispose(){u.onBeforeCameraRenderObservable.remove(D),T&&d.detachPostProcess(C),T=!1,C.dispose(d)}}}export{v as createContactShadows};
//# sourceMappingURL=contactShadowsChunk-CtvLTvJt.js.map