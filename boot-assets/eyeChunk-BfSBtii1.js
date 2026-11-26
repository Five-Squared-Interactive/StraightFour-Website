import{t as e}from"./shaderStore-D-XQlhUT.js";import{n as t,t as n}from"./effectRenderer.pure-Scmwkt4-.js";import{t as r}from"./postProcess.pure--kyp9pvd.js";import{n as i}from"./renderTargetTexture.pure-J5Ouvih2.js";import{x as a}from"../webverse-boot.js";import"./renderTargetTexture-BVT3bVWS.js";import{t as o}from"./shaderLanguage-CsgORKnQ.js";import"./postProcess-DwqzJnSG.js";import"./postprocess.vertex-CA-r41Dy.js";import"./postprocess.vertex-CcesVvTV.js";import{i as s,r as c,t as l}from"./eye-IVUQX2zr.js";var u=.25,d=32,f=8,p=.965,m=.62,h=8,g=1.1,_=[.25,.85],v=32,y=18,b=2.5,x=e=>Number.isInteger(e)?`${e}.0`:String(e),S=`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 sunUv;
uniform float strength;
uniform float aspect;
vec3 bright(vec2 uv) {
  vec3 c = texture2D(textureSampler, uv).rgb;
  float y = dot(c, vec3(0.2126, 0.7152, 0.0722));
  vec2 d = (uv - sunUv) * vec2(aspect, 1.0);
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return c * smoothstep(${x(m)}, ${x(.87)}, y) * exp(-dot(d, d) * ${x(h)}) * inside;
}
void main(void) {
  if (strength <= 0.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  vec2 stepUv = (sunUv - vUV) / ${x(d)};
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec2 uv = vUV + stepUv * jitter;
  vec3 sum = vec3(0.0);
  float w = 1.0;
  float total = 0.0;
  for (int i = 0; i < ${d}; i++) {
    sum += bright(uv) * w;
    total += w;
    w *= ${x(p)};
    uv += stepUv;
  }
  gl_FragColor = vec4(sum / total * strength, 1.0);
}`,C=`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 sunUv;
void main(void) {
  vec2 stepUv = (sunUv - vUV) / ${x(256)};
  vec3 sum = vec3(0.0);
  for (int i = 0; i < ${f}; i++) sum += texture2D(textureSampler, vUV + stepUv * (float(i) - ${x(f/2-.5)})).rgb;
  gl_FragColor = vec4(sum / ${x(f)}, 1.0);
}`,w=`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D eyeSampler;
#ifdef SUNBEAMS
uniform sampler2D sceneSampler;
#endif
uniform float exposure;
uniform float adapt;
void main(void) {
#ifdef SUNBEAMS
  vec3 c = texture2D(sceneSampler, vUV).rgb;
  float behind = 1.0 - smoothstep(${x(_[0])}, ${x(_[1])}, dot(c, vec3(0.2126, 0.7152, 0.0722)));
  c += texture2D(textureSampler, vUV).rgb * ${x(g)} * behind;
#else
  vec3 c = texture2D(textureSampler, vUV).rgb;
#endif
  float e = mix(exposure, texture2D(eyeSampler, vec2(0.5)).g, adapt);
  gl_FragColor = vec4(vec3(1.0) - pow(vec3(1.0) - clamp(c, 0.0, 1.0), vec3(e)), 1.0);
}`,T=`
varying vec2 vUV;
uniform sampler2D textureSampler;
void main(void) {
  vec2 cell = vec2(${x(1/v)}, ${x(1/y)});
  vec2 corner = floor(vUV / cell) * cell;
  float s = 0.0;
  for (int j = 0; j < 4; j++) for (int i = 0; i < 4; i++) {
    vec3 c = texture2D(textureSampler, corner + cell * (vec2(float(i), float(j)) + 0.5) / 4.0).rgb;
    s += log(max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 0.0001));
  }
  gl_FragColor = vec4(s / 16.0, 0.0, 0.0, 1.0);
}`,E=`
varying vec2 vUV;
uniform sampler2D meterSampler;
uniform sampler2D previousSampler;
uniform float dt;
uniform float speed;
uniform float lo;
uniform float hi;
uniform float reset;
void main(void) {
  float s = 0.0;
  float total = 0.0;
  for (int j = 0; j < ${y}; j++) for (int i = 0; i < ${v}; i++) {
    vec2 uv = (vec2(float(i), float(j)) + 0.5) / vec2(${x(v)}, ${x(y)});
    vec2 d = uv - 0.5;
    float w = exp(-dot(d, d) * ${x(b)});
    s += texture2D(meterSampler, uv).r * w;
    total += w;
  }
  float measured = s / total;
  float before = texture2D(previousSampler, vec2(0.5)).r;
  float tau = measured > before ? ${x(l.tauBrighten)} : ${x(l.tauDarken)};
  float level = reset > 0.5 ? measured : measured + (before - measured) * exp(-dt * speed / tau);
  float e = clamp(pow(${x(l.key)} / exp(level), ${x(l.response)}), lo, hi);
  gl_FragColor = vec4(level, e, 0.0, 1.0);
}`,D=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
uniform sunUv: vec2f;
uniform strength: f32;
uniform aspect: f32;
fn bright(uv: vec2f) -> vec3f {
  let c = textureSampleLevel(textureSampler, textureSamplerSampler, uv, 0.0).rgb;
  let y = dot(c, vec3f(0.2126, 0.7152, 0.0722));
  let d = (uv - uniforms.sunUv) * vec2f(uniforms.aspect, 1.0);
  let inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return c * smoothstep(${x(m)}, ${x(.87)}, y) * exp(-dot(d, d) * ${x(h)}) * inside;
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  if (uniforms.strength <= 0.0) {
    fragmentOutputs.color = vec4f(0.0, 0.0, 0.0, 1.0);
    return fragmentOutputs;
  }
  let stepUv = (uniforms.sunUv - input.vUV) / ${x(d)};
  let jitter = fract(52.9829189 * fract(dot(fragmentInputs.position.xy, vec2f(0.06711056, 0.00583715))));
  var uv = input.vUV + stepUv * jitter;
  var sum = vec3f(0.0);
  var w = 1.0;
  var total = 0.0;
  for (var i = 0; i < ${d}; i++) {
    sum += bright(uv) * w;
    total += w;
    w *= ${x(p)};
    uv += stepUv;
  }
  fragmentOutputs.color = vec4f(sum / total * uniforms.strength, 1.0);
}`,O=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
uniform sunUv: vec2f;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let stepUv = (uniforms.sunUv - input.vUV) / ${x(256)};
  var sum = vec3f(0.0);
  for (var i = 0; i < ${f}; i++) {
    sum += textureSampleLevel(textureSampler, textureSamplerSampler, input.vUV + stepUv * (f32(i) - ${x(f/2-.5)}), 0.0).rgb;
  }
  fragmentOutputs.color = vec4f(sum / ${x(f)}, 1.0);
}`,k=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
var eyeSamplerSampler: sampler;
var eyeSampler: texture_2d<f32>;
#ifdef SUNBEAMS
var sceneSamplerSampler: sampler;
var sceneSampler: texture_2d<f32>;
#endif
uniform exposure: f32;
uniform adapt: f32;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
#ifdef SUNBEAMS
  let seen = textureSample(sceneSampler, sceneSamplerSampler, input.vUV).rgb;
  let behind = 1.0 - smoothstep(${x(_[0])}, ${x(_[1])}, dot(seen, vec3f(0.2126, 0.7152, 0.0722)));
  let c = seen + textureSample(textureSampler, textureSamplerSampler, input.vUV).rgb * ${x(g)} * behind;
#else
  let c = textureSample(textureSampler, textureSamplerSampler, input.vUV).rgb;
#endif
  let e = mix(uniforms.exposure, textureSample(eyeSampler, eyeSamplerSampler, vec2f(0.5)).g, uniforms.adapt);
  fragmentOutputs.color = vec4f(vec3f(1.0) - pow(vec3f(1.0) - clamp(c, vec3f(0.0), vec3f(1.0)), vec3f(e)), 1.0);
}`,A=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let cell = vec2f(${x(1/v)}, ${x(1/y)});
  let corner = floor(input.vUV / cell) * cell;
  var s = 0.0;
  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < 4; i++) {
      let c = textureSampleLevel(textureSampler, textureSamplerSampler, corner + cell * (vec2f(f32(i), f32(j)) + 0.5) / 4.0, 0.0).rgb;
      s += log(max(dot(c, vec3f(0.2126, 0.7152, 0.0722)), 0.0001));
    }
  }
  fragmentOutputs.color = vec4f(s / 16.0, 0.0, 0.0, 1.0);
}`,j=`
varying vUV: vec2f;
var meterSamplerSampler: sampler;
var meterSampler: texture_2d<f32>;
var previousSamplerSampler: sampler;
var previousSampler: texture_2d<f32>;
uniform dt: f32;
uniform speed: f32;
uniform lo: f32;
uniform hi: f32;
uniform reset: f32;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  var s = 0.0;
  var total = 0.0;
  for (var j = 0; j < ${y}; j++) {
    for (var i = 0; i < ${v}; i++) {
      let uv = (vec2f(f32(i), f32(j)) + 0.5) / vec2f(${x(v)}, ${x(y)});
      let d = uv - 0.5;
      let w = exp(-dot(d, d) * ${x(b)});
      s += textureSampleLevel(meterSampler, meterSamplerSampler, uv, 0.0).r * w;
      total += w;
    }
  }
  let measured = s / total;
  let before = textureSampleLevel(previousSampler, previousSamplerSampler, vec2f(0.5), 0.0).r;
  var tau = ${x(l.tauDarken)};
  if (measured > before) { tau = ${x(l.tauBrighten)}; }
  var level = measured + (before - measured) * exp(-uniforms.dt * uniforms.speed / tau);
  if (uniforms.reset > 0.5) { level = measured; }
  let e = clamp(pow(${x(l.key)} / exp(level), ${x(l.response)}), uniforms.lo, uniforms.hi);
  fragmentOutputs.color = vec4f(level, e, 0.0, 1.0);
}`,M={planetSunbeams:[S,D],planetSunbeamsBlur:[C,O],planetEye:[w,k],planetEyeMeter:[T,A],planetEyeAdapt:[E,j]};function N(e){return e===`webgpu`?o.WGSL:o.GLSL}function P(l,d,f){let p=l.getEngine(),m=N(f.engineKind),h=m===o.WGSL;for(let[t,[n,r]]of Object.entries(M)){let i=h?e.ShadersStoreWGSL:e.ShadersStore;i[`${t}PixelShader`]??=h?r:n}let g=(e,t,n)=>new i(e,{width:t,height:n},l,!1,!0,a.TEXTURETYPE_HALF_FLOAT,!1,a.TEXTURE_NEAREST_SAMPLINGMODE,!1,!1,!1,a.TEXTUREFORMAT_RGBA),_=g(`planetEyeMeter`,v,y),b=[g(`planetEyeLevelA`,1,1),g(`planetEyeLevelB`,1,1)],x=0,S=new n(p),C=new t({engine:p,name:`planetEyeMeter`,fragmentShader:`planetEyeMeter`,useShaderStore:!0,samplerNames:[`textureSampler`],shaderLanguage:m}),w=new t({engine:p,name:`planetEyeAdapt`,fragmentShader:`planetEyeAdapt`,useShaderStore:!0,uniformNames:[`dt`,`speed`,`lo`,`hi`,`reset`],samplerNames:[`meterSampler`,`previousSampler`],shaderLanguage:m}),T=null,E={beams:!1,view:!1},D=null,O=[.5,.5],k=0,A=!0,j=()=>{T&&=(T.beams?.dispose(d),T.blur?.dispose(d),T.view.dispose(d),null)},P=e=>{let t={camera:d,engine:p,samplingMode:a.TEXTURE_BILINEAR_SAMPLINGMODE,shaderLanguage:m},n={};e&&(n.beams=new r(`planetSunbeams`,`planetSunbeams`,{...t,uniforms:[`sunUv`,`strength`,`aspect`],size:1}),n.beams.onApply=e=>{e.setFloat2(`sunUv`,O[0],O[1]),e.setFloat(`strength`,k),e.setFloat(`aspect`,p.getRenderWidth()/Math.max(1,p.getRenderHeight()))},n.blur=new r(`planetSunbeamsBlur`,`planetSunbeamsBlur`,{...t,uniforms:[`sunUv`],size:u,textureType:a.TEXTURETYPE_HALF_FLOAT}),n.blur.onApply=e=>e.setFloat2(`sunUv`,O[0],O[1])),n.view=new r(`planetEye`,`planetEye`,{...t,uniforms:[`exposure`,`adapt`],samplers:e?[`eyeSampler`,`sceneSampler`]:[`eyeSampler`],size:e?u:1,...e?{textureType:a.TEXTURETYPE_HALF_FLOAT,defines:`#define SUNBEAMS`}:{}}),n.view.onApply=e=>{let t=D?.exposure;e.setFloat(`exposure`,t?.mode===`fixed`?t.value:1),e.setFloat(`adapt`,+(t?.mode===`auto`&&!A)),e.setTexture(`eyeSampler`,b[x]),n.beams&&e.setTextureFromPostProcess(`sceneSampler`,n.beams)},T=n};C.onApplyObservable.add(()=>{let e=T?.beams??T?.view;e&&C.effect.setTextureFromPostProcess(`textureSampler`,e)}),w.onApplyObservable.add(()=>{let e=D?.exposure,t=e?.mode===`auto`?e:{speed:1,min:1,max:1};w.effect.setTexture(`meterSampler`,_),w.effect.setTexture(`previousSampler`,b[x]),w.effect.setFloat(`dt`,D?.dtS??0),w.effect.setFloat(`speed`,t.speed),w.effect.setFloat(`lo`,t.min),w.effect.setFloat(`hi`,t.max),w.effect.setFloat(`reset`,+!!A)});let F=l.onAfterRenderObservable.add(()=>{if(!T||D?.exposure?.mode!==`auto`||!C.effect?.isReady()||!w.effect?.isReady())return;S.render(C,_);let e=1-x;S.render(w,b[e]),x=e,A=!1});return{update(e){let t=D?.exposure?.mode===`auto`;D=e;let n=e.exposure;n?.mode===`auto`&&!t&&(A=!0);let r=f.sunbeams&&e.sunbeams>0,i=r||n?.mode===`auto`||n?.mode===`fixed`&&n.value!==1;if((r!==E.beams||i!==E.view)&&(j(),i&&P(r),E={beams:r,view:i}),!r)return;let a=d.getTransformationMatrix().m,o=e.sun,l=o.x*a[0]+o.y*a[4]+o.z*a[8],u=o.x*a[1]+o.y*a[5]+o.z*a[9],p=o.x*a[3]+o.y*a[7]+o.z*a[11],m=p>1e-6,h=m?l/p:0,g=m?u/p:0;O=[h*.5+.5,g*.5+.5],k=e.sunbeams*s(e.sunHeight)*c(h,g,m)},dispose(){l.onAfterRenderObservable.remove(F),j(),C.dispose(),w.dispose(),S.dispose(),_.dispose();for(let e of b)e.dispose()}}}export{P as createEye,N as eyeShaderLanguage};
//# sourceMappingURL=eyeChunk-BfSBtii1.js.map