import{t as e}from"./math.vector.pure-fvrN3Uzg.js";import{t}from"./shaderStore-D-XQlhUT.js";import{t as n}from"./postProcess.pure-BL5YG0qf.js";import{j as r}from"./index-DCQC-odC.js";import{t as i}from"./shaderLanguage-CsgORKnQ.js";import"./postProcess-B4iOlIzR.js";import{i as a,n as o,r as s,t as c}from"./screenPasses-ioPnmozG.js";import{n as l,o as u}from"./temporal-DxyPbv0x.js";var d={shutter:.5,startShare:.012,fullShare:.03,maxShare:.025,samples:8},f=e=>Number.isInteger(e)?`${e}.0`:String(e),p=`planetMotionBlur`,m=0,h=`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform highp sampler2D depthSampler;
uniform mat4 reprojection;
uniform vec2 depthNdc;
uniform vec2 screen;
uniform float dt;
uniform float live;
vec4 blurred(vec2 uv, vec4 colour) {
  if (live < 0.5) return colour;
  ivec2 size = textureSize(depthSampler, 0);
  float d = texelFetch(depthSampler, clamp(ivec2(uv * vec2(size)), ivec2(0), size - 1), 0).r;
  vec4 before = reprojection * vec4(uv * 2.0 - 1.0, d * depthNdc.x + depthNdc.y, 1.0);
  if (before.w <= 0.0) return colour;
  vec2 moved = (uv * 2.0 - 1.0 - before.xy / before.w) * 0.5 * screen;
  float px = length(moved);
  float w = smoothstep(${f(d.startShare)}, ${f(d.fullShare)}, px / screen.y * (${f(1/60)} / dt));
  if (w <= 0.0) return colour;
  float streak = min(px * ${f(d.shutter)}, ${f(d.maxShare)} * screen.y) * w;
  vec2 along = moved / max(px, 0.0001) * streak / screen;
  vec3 sum = vec3(0.0);
  for (int k = 0; k < ${d.samples}; k++) sum += texture2D(textureSampler, uv + along * ((float(k) + 0.5) / ${f(d.samples)} - 0.5)).rgb;
  return vec4(sum / ${f(d.samples)}, colour.a);
}
void main(void) {
  gl_FragColor = blurred(vUV, texture2D(textureSampler, vUV));
}`,g=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
var depthSampler: texture_depth_2d;
uniform reprojection: mat4x4f;
uniform depthNdc: vec2f;
uniform screen: vec2f;
uniform dt: f32;
uniform live: f32;
fn blurred(uv: vec2f, colour: vec4f) -> vec4f {
  if (uniforms.live < 0.5) { return colour; }
  let size = vec2i(textureDimensions(depthSampler, 0));
  let d = textureLoad(depthSampler, clamp(vec2i(uv * vec2f(size)), vec2i(0), size - 1), 0);
  let before = uniforms.reprojection * vec4f(uv * 2.0 - 1.0, d * uniforms.depthNdc.x + uniforms.depthNdc.y, 1.0);
  if (before.w <= 0.0) { return colour; }
  let moved = (uv * 2.0 - 1.0 - before.xy / before.w) * 0.5 * uniforms.screen;
  let px = length(moved);
  let w = smoothstep(${f(d.startShare)}, ${f(d.fullShare)}, px / uniforms.screen.y * (${f(1/60)} / uniforms.dt));
  if (w <= 0.0) { return colour; }
  let streak = min(px * ${f(d.shutter)}, ${f(d.maxShare)} * uniforms.screen.y) * w;
  let along = moved / max(px, 0.0001) * streak / uniforms.screen;
  var sum = vec3f(0.0);
  for (var k = 0; k < ${d.samples}; k++) {
    sum += textureSampleLevel(textureSampler, textureSamplerSampler, uv + along * ((f32(k) + 0.5) / ${f(d.samples)} - 0.5), 0.0).rgb;
  }
  return vec4f(sum / ${f(d.samples)}, colour.a);
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  fragmentOutputs.color = blurred(input.vUV, textureSampleLevel(textureSampler, textureSamplerSampler, input.vUV, 0.0));
}`;function _(d,f,_){let v=d.getEngine(),y=_.engineKind===`webgpu`,b=y?i.WGSL:i.GLSL,x=y?t.ShadersStoreWGSL:t.ShadersStore;x[`${p}PixelShader`]??=y?g:h;let S=new n(p,p,{engine:v,size:1,uniforms:[`reprojection`,`depthNdc`,`screen`,`dt`,`live`],samplers:[`depthSampler`],samplingMode:r.TEXTURE_BILINEAR_SAMPLINGMODE,textureType:r.TEXTURETYPE_HALF_FLOAT,shaderLanguage:b});f.attachPostProcess(S),s(f);let C=d.onBeforeCameraRenderObservable.add(e=>{e===f&&s(f)});S.onActivateObservable.add(()=>o(f,S));let w=0,T=null,E=new e;return S.onApplyObservable.add(t=>{let n=a(f);n&&t._bindTexture(`depthSampler`,n);let r=f.getViewMatrix().m,i=f.globalPosition,o=[...f.getProjectionMatrix().m],s=f.mode===m?[o[8],o[9]]:[0,0];o[8]=0,o[9]=0;let d={position:[i.x,i.y,i.z],rotation:[r[0],r[1],r[2],r[4],r[5],r[6],r[8],r[9],r[10]],projection:o},p=n!==null&&T!==null&&w>0&&l(T.position,d.position);e.FromArrayToRef(u(d,s,T??d),0,E),t.setMatrix(`reprojection`,E);let[h,g]=c(v.isNDCHalfZRange);t.setFloat2(`depthNdc`,h,g),t.setFloat2(`screen`,S.width,S.height),t.setFloat(`dt`,w>0?w:1/60),t.setFloat(`live`,+!!p),T=d}),{update(e){w=e.dtS},dispose(){d.onBeforeCameraRenderObservable.remove(C),f.detachPostProcess(S),S.dispose(f)}}}export{_ as createMotionBlur};
//# sourceMappingURL=motionBlurChunk-B7e3gS-C.js.map