import{t as e}from"./shaderStore-D-XQlhUT.js";import{t}from"./postProcess.pure-BL5YG0qf.js";import{j as n}from"./index-DCQC-odC.js";import{t as r}from"./shaderLanguage-CsgORKnQ.js";import"./postProcess-B4iOlIzR.js";import{a as i,o as a,t as o}from"./gradeFocus-BERvQeJT.js";var s=10485760,c=4;async function l(e,t){if(Number(e.headers.get(`content-length`))>t)return e.body?.cancel().catch(()=>{}),null;if(!e.body)return``;let n=e.body.getReader(),r=new TextDecoder,i=``,a=0;for(;;){let{done:e,value:o}=await n.read();if(e)return i+r.decode();if(a+=o.byteLength,a>t)return n.cancel().catch(()=>{}),null;i+=r.decode(o,{stream:!0})}}var u=12,d=.25,f=2.39996323,p=e=>Number.isInteger(e)?`${e}.0`:String(e),m={planetGradeFocus:[`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D lutSampler;
uniform highp sampler2D depthSampler;
uniform float graded;
uniform float lutSize;
uniform vec3 domainMin;
uniform vec3 domainMax;
uniform float focusStrength;
uniform float focusM;
uniform float maxPx;
uniform vec2 depthAB;
uniform vec2 depthNdc;
uniform vec2 texel;
// Metres from the eye, along its line, of what was drawn at uv: the projection's depth undone. Nothing drawn is far off.
float depthAt(vec2 uv) {
  ivec2 size = textureSize(depthSampler, 0);
  ivec2 q = clamp(ivec2(uv * vec2(size)), ivec2(0), size - 1);
  float ndc = texelFetch(depthSampler, q, 0).r * depthNdc.x + depthNdc.y;
  float den = ndc - depthAB.x;
  float z = abs(den) > 1e-7 ? depthAB.y / den : 1e30;
  return z > 0.0 ? z : 1e30;
}
float blurPx(vec2 uv) {
  float z = depthAt(uv);
  return z > focusM ? (1.0 - focusM / z) * focusStrength * maxPx : 0.0;
}
vec3 grade(vec3 c) {
  vec3 p = clamp((c - domainMin) / (domainMax - domainMin), 0.0, 1.0) * (lutSize - 1.0);
  float b0 = min(floor(p.b), lutSize - 2.0);
  float w = lutSize * lutSize;
  vec2 uv = vec2((b0 * lutSize + p.r + 0.5) / w, (p.g + 0.5) / lutSize);
  vec3 lo = texture2D(lutSampler, uv).rgb;
  vec3 hi = texture2D(lutSampler, uv + vec2(lutSize / w, 0.0)).rgb;
  return mix(lo, hi, p.b - b0);
}
void main(void) {
  vec3 c = texture2D(textureSampler, vUV).rgb;
  if (focusStrength > 0.0) {
    float r = blurPx(vUV);
    if (r > ${p(d)}) {
      vec3 sum = c;
      float total = 1.0;
      for (int i = 0; i < ${u}; i++) {
        float a = float(i) * ${p(f)};
        float d = sqrt((float(i) + 0.5) / ${p(u)}) * r;
        vec2 uv = vUV + vec2(cos(a), sin(a)) * d * texel;
        float w = clamp(blurPx(uv) - d + 1.0, 0.0, 1.0);
        sum += texture2D(textureSampler, uv).rgb * w;
        total += w;
      }
      c = sum / total;
    }
  }
  if (graded > 0.5) c = grade(clamp(c, 0.0, 1.0));
  gl_FragColor = vec4(c, 1.0);
}`,`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
var lutSamplerSampler: sampler;
var lutSampler: texture_2d<f32>;
var depthSampler: texture_depth_2d;
uniform graded: f32;
uniform lutSize: f32;
uniform domainMin: vec3f;
uniform domainMax: vec3f;
uniform focusStrength: f32;
uniform focusM: f32;
uniform maxPx: f32;
uniform depthAB: vec2f;
uniform depthNdc: vec2f;
uniform texel: vec2f;
fn depthAt(uv: vec2f) -> f32 {
  let size = vec2i(textureDimensions(depthSampler, 0));
  let q = clamp(vec2i(uv * vec2f(size)), vec2i(0), size - 1);
  let ndc = textureLoad(depthSampler, q, 0) * uniforms.depthNdc.x + uniforms.depthNdc.y;
  let den = ndc - uniforms.depthAB.x;
  var z = 1e30;
  if (abs(den) > 1e-7) { z = uniforms.depthAB.y / den; }
  if (z <= 0.0) { z = 1e30; }
  return z;
}
fn blurPx(uv: vec2f) -> f32 {
  let z = depthAt(uv);
  if (z <= uniforms.focusM) { return 0.0; }
  return (1.0 - uniforms.focusM / z) * uniforms.focusStrength * uniforms.maxPx;
}
fn grade(c: vec3f) -> vec3f {
  let n = uniforms.lutSize;
  let p = clamp((c - uniforms.domainMin) / (uniforms.domainMax - uniforms.domainMin), vec3f(0.0), vec3f(1.0)) * (n - 1.0);
  let b0 = min(floor(p.b), n - 2.0);
  let w = n * n;
  let uv = vec2f((b0 * n + p.r + 0.5) / w, (p.g + 0.5) / n);
  let lo = textureSampleLevel(lutSampler, lutSamplerSampler, uv, 0.0).rgb;
  let hi = textureSampleLevel(lutSampler, lutSamplerSampler, uv + vec2f(n / w, 0.0), 0.0).rgb;
  return mix(lo, hi, p.b - b0);
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  var c = textureSampleLevel(textureSampler, textureSamplerSampler, input.vUV, 0.0).rgb;
  if (uniforms.focusStrength > 0.0) {
    let r = blurPx(input.vUV);
    if (r > ${p(d)}) {
      var sum = c;
      var total = 1.0;
      for (var i = 0; i < ${u}; i++) {
        let a = f32(i) * ${p(f)};
        let d = sqrt((f32(i) + 0.5) / ${p(u)}) * r;
        let uv = input.vUV + vec2f(cos(a), sin(a)) * d * uniforms.texel;
        let w = clamp(blurPx(uv) - d + 1.0, 0.0, 1.0);
        sum += textureSampleLevel(textureSampler, textureSamplerSampler, uv, 0.0).rgb * w;
        total += w;
      }
      c = sum / total;
    }
  }
  if (uniforms.graded > 0.5) { c = grade(clamp(c, vec3f(0.0), vec3f(1.0))); }
  fragmentOutputs.color = vec4f(c, 1.0);
}`]};function h(e){return e===`webgpu`?r.WGSL:r.GLSL}function g(u,d,f){let p=u.getEngine(),g=h(f.engineKind),_=g===r.WGSL;for(let[t,[n,r]]of Object.entries(m)){let i=_?e.ShadersStoreWGSL:e.ShadersStore;i[`${t}PixelShader`]??=_?r:n}let v=(e,t,r,i)=>p.createRawTexture(e,t,r,n.TEXTUREFORMAT_RGBA,!1,!1,i),y=new Map,b=()=>{for(let[e,t]of y){if(y.size<=c)return;t!==`loading`&&(t?.texture.dispose(),y.delete(e))}},x=!1,S=e=>{y.set(e,`loading`),(async()=>{let t;try{let r=await f.fetchImpl(e),i=r.ok?await l(r,s):void 0;if(i===null)t=`larger than ${s} bytes, the most a 64³ table takes`;else if(i!==void 0){let r=a(i);if(r.ok){if(x)return;let t=o(r.lut),i=v(t.pixels,t.width,t.height,n.TEXTURE_BILINEAR_SAMPLINGMODE);y.set(e,{lut:r.lut,texture:i}),b();return}t=r.reason}else t=`HTTP ${r.status}`}catch(e){t=String(e)}x||(y.set(e,null),b(),f.warn(`veml:planet:grade-unavailable`,`${e}: ${t}`))})()},C=v(new Uint8Array([255,255,255,255]),1,1,n.TEXTURE_NEAREST_SAMPLINGMODE),w=new t(`planetGradeFocus`,`planetGradeFocus`,{engine:p,size:1,uniforms:[`graded`,`lutSize`,`domainMin`,`domainMax`,`focusStrength`,`focusM`,`maxPx`,`depthAB`,`depthNdc`,`texel`],samplers:[`lutSampler`,`depthSampler`],samplingMode:n.TEXTURE_BILINEAR_SAMPLINGMODE,shaderLanguage:g});w.autoClear=!1;let T=!1,E=null,D=null,O=null,k=()=>d._postProcesses.find(e=>!!e)??null,A=e=>{let t=e.inputTexture;if(!(!t||t.depthStencilTexture||t.width<=0))try{let e=p.isStencilEnable;t.createDepthStencilTexture(0,!1,e,1,e?n.TEXTUREFORMAT_DEPTH24_STENCIL8:n.TEXTUREFORMAT_DEPTH32_FLOAT)}catch{}},j=()=>{O&&O.pp.onActivateObservable.remove(O.observer),O=null},M=()=>{let e=T?k():null;O?.pp!==e&&(j(),e&&(O={pp:e,observer:e.onActivateObservable.add(()=>A(e))}))},N=()=>{if(!T)return;let e=d._postProcesses.filter(e=>e!==null);if(e[e.length-1]!==w){let e=d._postProcesses.indexOf(w);e>=0&&d._postProcesses.splice(e,1),d._postProcesses.push(w)}M()},P=u.onBeforeCameraRenderObservable.add(e=>{e===d&&N()});return w.onApplyObservable.add(e=>{let t=k()?.inputTexture?.depthStencilTexture??null;t&&e._bindTexture(`depthSampler`,t);let n=E!==null;e._bindTexture(`lutSampler`,E?.texture??C),e.setFloat(`graded`,+!!n),e.setFloat(`lutSize`,E?.lut.size??2);let r=E?.lut.domainMin??[0,0,0],a=E?.lut.domainMax??[1,1,1];e.setFloat3(`domainMin`,r[0],r[1],r[2]),e.setFloat3(`domainMax`,a[0],a[1],a[2]),e.setFloat(`focusStrength`,D&&t?D.strength:0),e.setFloat(`focusM`,D?.distanceM??0),e.setFloat(`maxPx`,i(w.height));let o=d.getProjectionMatrix().m;e.setFloat2(`depthAB`,o[10],o[14]),p.isNDCHalfZRange?e.setFloat2(`depthNdc`,1,0):e.setFloat2(`depthNdc`,2,-1),e.setFloat2(`texel`,1/Math.max(1,w.width),1/Math.max(1,w.height))}),{update(e){let t=null;if(e.grade){let n=y.get(e.grade);n===void 0?S(e.grade):(y.delete(e.grade),y.set(e.grade,n),n!==`loading`&&n!==null&&(t=n))}E=t,D=e.focus&&e.focus.strength>0?e.focus:null;let n=E!==null||D!==null;n&&!T?(d.attachPostProcess(w),T=!0):!n&&T&&(d.detachPostProcess(w),T=!1),N(),T||j()},dispose(){x=!0,u.onBeforeCameraRenderObservable.remove(P),j(),w.dispose(d),T=!1,C.dispose();for(let e of y.values())e&&e!==`loading`&&e.texture.dispose();y.clear()}}}export{g as createGradeFocus,h as gradeFocusShaderLanguage};
//# sourceMappingURL=gradeFocusChunk-365J_6pm.js.map