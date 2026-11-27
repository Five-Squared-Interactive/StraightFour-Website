import{t as e}from"./math.vector.pure-fvrN3Uzg.js";import{t}from"./shaderStore-D-XQlhUT.js";import{t as n}from"./postProcess.pure-BL5YG0qf.js";import{Gt as r,j as i}from"./index-CPmGphPB.js";import"./materialPluginBase-ZibIdS7N.js";import{t as a}from"./shaderLanguage-CsgORKnQ.js";import{t as o}from"./materialArrivals-BgDToscV.js";import"./postProcess-B4iOlIzR.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./temporal-DxyPbv0x.js";var p=e=>Number.isInteger(e)?`${e}.0`:String(e),m=.5,h=0,g=`
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D historySampler;
uniform highp sampler2D depthSampler;
uniform mat4 reprojection;
uniform vec2 jitter;
uniform vec2 inputSize;
uniform vec2 depthNdc;
uniform float share;
uniform float reset;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
// Compressed by its brightness, then as luma and two chroma, where the colours about a pixel make a tight box.
vec3 toBox(vec3 c) {
  c = max(c, vec3(0.0));
  c /= 1.0 + luma(c);
  return vec3(dot(c, vec3(0.25, 0.5, 0.25)), dot(c, vec3(0.5, 0.0, -0.5)), dot(c, vec3(-0.25, 0.5, -0.25)));
}
vec3 fromBox(vec3 b) {
  vec3 c = max(vec3(b.x + b.y - b.z, b.x + b.z, b.x - b.y - b.z), vec3(0.0));
  return c / max(1.0 - luma(c), 0.001);
}
// The history at uv, sharp: Catmull-Rom from five bilinear samples.
vec3 historyAt(vec2 uv) {
  vec2 size = vec2(textureSize(historySampler, 0));
  vec2 p = uv * size;
  vec2 c1 = floor(p - 0.5) + 0.5;
  vec2 t = p - c1;
  vec2 w0 = t * (-0.5 + t * (1.0 - 0.5 * t));
  vec2 w1 = 1.0 + t * t * (-2.5 + 1.5 * t);
  vec2 w2 = t * (0.5 + t * (2.0 - 1.5 * t));
  vec2 w3 = t * t * (-0.5 + 0.5 * t);
  vec2 w12 = w1 + w2;
  vec2 m = (c1 + w2 / w12) / size;
  vec2 a = (c1 - 1.0) / size;
  vec2 b = (c1 + 2.0) / size;
  vec3 s = texture2D(historySampler, vec2(m.x, a.y)).rgb * w12.x * w0.y
    + texture2D(historySampler, vec2(a.x, m.y)).rgb * w0.x * w12.y
    + texture2D(historySampler, m).rgb * w12.x * w12.y
    + texture2D(historySampler, vec2(b.x, m.y)).rgb * w3.x * w12.y
    + texture2D(historySampler, vec2(m.x, b.y)).rgb * w12.x * w3.y;
  float w = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
  return max(s / w, vec3(0.0));
}
void main(void) {
  ivec2 last = ivec2(inputSize) - 1;
  vec2 p = vUV * inputSize + jitter;
  ivec2 t = clamp(ivec2(floor(p)), ivec2(0), last);
  vec2 d = p - (vec2(t) + 0.5);
  vec3 m1 = vec3(0.0);
  vec3 m2 = vec3(0.0);
  vec3 lo = vec3(1e9);
  vec3 hi = vec3(-1e9);
  vec3 centre = vec3(0.0);
  float mark = 0.0;
  float near = 2.0;
  ivec2 nearAt = t;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      ivec2 q = clamp(t + ivec2(x, y), ivec2(0), last);
      vec4 s = texelFetch(textureSampler, q, 0);
      vec3 c = toBox(s.rgb);
      if (x == 0 && y == 0) centre = c;
      m1 += c;
      m2 += c * c;
      lo = min(lo, c);
      hi = max(hi, c);
      mark = max(mark, s.a);
      float z = texelFetch(depthSampler, q, 0).r;
      if (z < near) { near = z; nearAt = q; }
    }
  }
  vec3 mean = m1 / 9.0;
  vec3 sigma = sqrt(max(m2 / 9.0 - mean * mean, vec3(0.0)));
  // Where the nearest surface about the pixel was drawn the frame before, and so how far the picture moved.
  vec2 at = (vec2(nearAt) + 0.5) / inputSize;
  vec4 before = reprojection * vec4(at * 2.0 - 1.0, near * depthNdc.x + depthNdc.y, 1.0);
  vec2 beforeUv = before.xy / before.w * 0.5 + 0.5;
  vec2 uv = vUV + beforeUv - (vec2(nearAt) + 0.5 - jitter) / inputSize;
  vec3 soft = toBox(texture2D(textureSampler, p / inputSize).rgb);
  bool marked = mark > ${p(f.markAbove)};
  bool valid = reset < 0.5 && before.w > 0.0 && uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0;
  vec3 result = soft;
  if (valid) {
    float g = marked ? ${p(f.gammaAnimated)} : ${p(f.gamma)};
    vec3 h = clamp(toBox(historyAt(uv)), max(lo, mean - g * sigma), min(hi, mean + g * sigma));
    float w = exp(-0.5 * dot(d, d) / (share * share) / ${p(f.sigma*f.sigma)});
    float a = ${p(f.feedback)} * w;
    vec3 now = centre;
    if (marked) { a = max(a, ${p(f.animatedShare)}); now = soft; }
    result = mix(h, now, a);
  }
  gl_FragColor = vec4(fromBox(result), 1.0);
}`,_=`
varying vec2 vUV;
uniform sampler2D textureSampler;
#ifdef SHARPEN
vec3 squash(vec3 c) { c = max(c, vec3(0.0)); return c / (1.0 + c); }
#endif
void main(void) {
  vec4 c = texture2D(textureSampler, vUV);
#ifdef SHARPEN
  ivec2 at = ivec2(vUV * vec2(textureSize(textureSampler, 0)));
  vec3 m = squash(c.rgb);
  vec3 n = squash(texelFetch(textureSampler, clamp(at + ivec2(0, 1), ivec2(0), textureSize(textureSampler, 0) - 1), 0).rgb);
  vec3 s = squash(texelFetch(textureSampler, clamp(at - ivec2(0, 1), ivec2(0), textureSize(textureSampler, 0) - 1), 0).rgb);
  vec3 e = squash(texelFetch(textureSampler, clamp(at + ivec2(1, 0), ivec2(0), textureSize(textureSampler, 0) - 1), 0).rgb);
  vec3 w = squash(texelFetch(textureSampler, clamp(at - ivec2(1, 0), ivec2(0), textureSize(textureSampler, 0) - 1), 0).rgb);
  vec3 lo = min(m, min(min(n, s), min(e, w)));
  vec3 hi = max(m, max(max(n, s), max(e, w)));
  vec3 amp = sqrt(clamp(min(lo, 1.0 - hi) / max(hi, vec3(0.0001)), 0.0, 1.0));
  vec3 k = -amp / ${p(8-3*f.sharpen)};
  vec3 r = clamp((m + k * (n + s + e + w)) / (1.0 + 4.0 * k), 0.0, 0.999);
  c.rgb = r / (1.0 - r);
#endif
  gl_FragColor = c;
}`,v=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
var historySamplerSampler: sampler;
var historySampler: texture_2d<f32>;
var depthSampler: texture_depth_2d;
uniform reprojection: mat4x4f;
uniform jitter: vec2f;
uniform inputSize: vec2f;
uniform depthNdc: vec2f;
uniform share: f32;
uniform reset: f32;
fn luma(c: vec3f) -> f32 { return dot(c, vec3f(0.2126, 0.7152, 0.0722)); }
fn toBox(c0: vec3f) -> vec3f {
  var c = max(c0, vec3f(0.0));
  c = c / (1.0 + luma(c));
  return vec3f(dot(c, vec3f(0.25, 0.5, 0.25)), dot(c, vec3f(0.5, 0.0, -0.5)), dot(c, vec3f(-0.25, 0.5, -0.25)));
}
fn fromBox(b: vec3f) -> vec3f {
  let c = max(vec3f(b.x + b.y - b.z, b.x + b.z, b.x - b.y - b.z), vec3f(0.0));
  return c / max(1.0 - luma(c), 0.001);
}
fn hist(uv: vec2f) -> vec3f {
  return textureSampleLevel(historySampler, historySamplerSampler, uv, 0.0).rgb;
}
fn historyAt(uv: vec2f) -> vec3f {
  let size = vec2f(textureDimensions(historySampler, 0));
  let p = uv * size;
  let c1 = floor(p - 0.5) + 0.5;
  let t = p - c1;
  let w0 = t * (-0.5 + t * (1.0 - 0.5 * t));
  let w1 = 1.0 + t * t * (-2.5 + 1.5 * t);
  let w2 = t * (0.5 + t * (2.0 - 1.5 * t));
  let w3 = t * t * (-0.5 + 0.5 * t);
  let w12 = w1 + w2;
  let m = (c1 + w2 / w12) / size;
  let a = (c1 - 1.0) / size;
  let b = (c1 + 2.0) / size;
  let s = hist(vec2f(m.x, a.y)) * w12.x * w0.y
    + hist(vec2f(a.x, m.y)) * w0.x * w12.y
    + hist(m) * w12.x * w12.y
    + hist(vec2f(b.x, m.y)) * w3.x * w12.y
    + hist(vec2f(m.x, b.y)) * w12.x * w3.y;
  let w = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
  return max(s / w, vec3f(0.0));
}
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  let last = vec2i(uniforms.inputSize) - 1;
  let p = input.vUV * uniforms.inputSize + uniforms.jitter;
  let t = clamp(vec2i(floor(p)), vec2i(0), last);
  let d = p - (vec2f(t) + 0.5);
  var m1 = vec3f(0.0);
  var m2 = vec3f(0.0);
  var lo = vec3f(1e9);
  var hi = vec3f(-1e9);
  var centre = vec3f(0.0);
  var mark = 0.0;
  var near = 2.0;
  var nearAt = t;
  for (var y = -1; y <= 1; y++) {
    for (var x = -1; x <= 1; x++) {
      let q = clamp(t + vec2i(x, y), vec2i(0), last);
      let s = textureLoad(textureSampler, q, 0);
      let c = toBox(s.rgb);
      if (x == 0 && y == 0) { centre = c; }
      m1 += c;
      m2 += c * c;
      lo = min(lo, c);
      hi = max(hi, c);
      mark = max(mark, s.a);
      let z = textureLoad(depthSampler, q, 0);
      if (z < near) { near = z; nearAt = q; }
    }
  }
  let mean = m1 / 9.0;
  let sigma = sqrt(max(m2 / 9.0 - mean * mean, vec3f(0.0)));
  let at = (vec2f(nearAt) + 0.5) / uniforms.inputSize;
  let before = uniforms.reprojection * vec4f(at * 2.0 - 1.0, near * uniforms.depthNdc.x + uniforms.depthNdc.y, 1.0);
  let beforeUv = before.xy / before.w * 0.5 + 0.5;
  let uv = input.vUV + beforeUv - (vec2f(nearAt) + 0.5 - uniforms.jitter) / uniforms.inputSize;
  let smoothed = toBox(textureSampleLevel(textureSampler, textureSamplerSampler, p / uniforms.inputSize, 0.0).rgb);
  let marked = mark > ${p(f.markAbove)};
  let valid = uniforms.reset < 0.5 && before.w > 0.0 && all(uv >= vec2f(0.0)) && all(uv <= vec2f(1.0));
  var result = smoothed;
  if (valid) {
    var g = ${p(f.gamma)};
    if (marked) { g = ${p(f.gammaAnimated)}; }
    let h = clamp(toBox(historyAt(uv)), max(lo, mean - g * sigma), min(hi, mean + g * sigma));
    let w = exp(-0.5 * dot(d, d) / (uniforms.share * uniforms.share) / ${p(f.sigma*f.sigma)});
    var a = ${p(f.feedback)} * w;
    var now = centre;
    if (marked) { a = max(a, ${p(f.animatedShare)}); now = smoothed; }
    result = mix(h, now, a);
  }
  fragmentOutputs.color = vec4f(fromBox(result), 1.0);
}`,y=`
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;
#ifdef SHARPEN
fn squash(c: vec3f) -> vec3f { let d = max(c, vec3f(0.0)); return d / (1.0 + d); }
fn at(p: vec2i) -> vec3f { return squash(textureLoad(textureSampler, clamp(p, vec2i(0), vec2i(textureDimensions(textureSampler, 0)) - 1), 0).rgb); }
#endif
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  var c = textureSampleLevel(textureSampler, textureSamplerSampler, input.vUV, 0.0);
#ifdef SHARPEN
  let p = vec2i(input.vUV * vec2f(textureDimensions(textureSampler, 0)));
  let m = squash(c.rgb);
  let n = at(p + vec2i(0, 1));
  let s = at(p - vec2i(0, 1));
  let e = at(p + vec2i(1, 0));
  let w = at(p - vec2i(1, 0));
  let lo = min(m, min(min(n, s), min(e, w)));
  let hi = max(m, max(max(n, s), max(e, w)));
  let amp = sqrt(clamp(min(lo, 1.0 - hi) / max(hi, vec3f(0.0001)), vec3f(0.0), vec3f(1.0)));
  let k = -amp / ${p(8-3*f.sharpen)};
  let r = clamp((m + k * (n + s + e + w)) / (1.0 + 4.0 * k), vec3f(0.0), vec3f(0.999));
  c = vec4f(r / (1.0 - r), c.a);
#endif
  fragmentOutputs.color = c;
}`,b={planetTemporal:[g,v],planetTemporalCopy:[_,y]},x=`TemporalMark`,S=e=>e.pluginManager?.getPlugin(`Sway`)?.isEnabled===!0,C=e=>(e.name===`leaves`||e.name===`plants`)&&(e.getClassName()===`PBRMaterial`||e.getClassName()===`StandardMaterial`),w=class extends r{_isEnabled=!0;constructor(e){super(e,x,330,{TEMPORALMARK:!1},!0,!0)}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}getClassName(){return`TemporalMarkPlugin`}isCompatible(e){return e===a.GLSL||e===a.WGSL}prepareDefines(e){e.TEMPORALMARK=this._isEnabled&&S(this._material)}getCustomCode(e){return e===`fragment`?{CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`#if defined(TEMPORALMARK) && !defined(ALPHABLEND)\n${this._material.getClassName()===`PBRMaterial`?`finalColor`:`color`}.a = ${p(f.mark)};\n#endif\n`}:null}};function T(e){return e===`webgpu`?a.WGSL:a.GLSL}function E(r,f,p){let g=r.getEngine(),_=T(p.engineKind),v=_===a.WGSL;for(let[e,[n,r]]of Object.entries(b)){let i=v?t.ShadersStoreWGSL:t.ShadersStore;i[`${e}PixelShader`]??=v?r:n}let y=Math.min(1,Math.max(m,Number.isFinite(p.upscale)?p.upscale:1)),S=s(y),E=new n(`planetTemporal`,`planetTemporal`,{engine:g,size:y,uniforms:[`reprojection`,`jitter`,`inputSize`,`depthNdc`,`share`,`reset`],samplers:[`historySampler`,`depthSampler`],samplingMode:i.TEXTURE_BILINEAR_SAMPLINGMODE,textureType:i.TEXTURETYPE_HALF_FLOAT,shaderLanguage:_}),D=new n(`planetTemporalCopy`,`planetTemporalCopy`,{engine:g,size:1,samplingMode:i.TEXTURE_BILINEAR_SAMPLINGMODE,shaderLanguage:_,...y<1?{defines:`#define SHARPEN`}:{}});D.autoClear=!1;let O=()=>{let e=f._postProcesses.filter(e=>e!==null);if(e[0]!==E||e[1]!==D){for(let e of[E,D]){let t=f._postProcesses.indexOf(e);t>=0&&f._postProcesses.splice(t,1)}f._postProcesses.unshift(E,D)}};f.attachPostProcess(E,0),f.attachPostProcess(D,1),O();let k=null,A=0,j=(e,t)=>{k?.forEach(e=>e.dispose());let n=()=>g.createRenderTargetTexture({width:e,height:t},{generateMipMaps:!1,generateDepthBuffer:!1,type:i.TEXTURETYPE_HALF_FLOAT,samplingMode:i.TEXTURE_BILINEAR_SAMPLINGMODE,label:`planetTemporalHistory`});k=[n(),n()]},M=0,N=[0,0],P=[0,0],F={width:1,height:1},I=null,L=null,R=!0,z=!1,B=new e,V=[],H=o(r),U=()=>H.take(e=>{if(!C(e))return;let t=e.pluginManager?.getPlugin(x);t?(V.includes(t)||V.push(t),t.isEnabled=!0):V.push(new w(e))});U();let W=r.onBeforeCameraRenderObservable.add(e=>{if(e!==f)return;O(),U(),F={width:Math.max(1,g.getRenderWidth(!0)*y|0),height:Math.max(1,g.getRenderHeight(!0)*y|0)},M++,N=d(M,S),P=c(N,F.width,F.height);let t=f.getProjectionMatrix();if(I=[...t.m],I[8]=0,I[9]=0,f.mode!==h){N=[0,0],P=[0,0];return}t.setRowFromFloats(2,P[0],P[1],t.m[10],t.m[11]),r.updateTransformMatrix()});return E.onActivateObservable.add(()=>{let e=g.getRenderWidth(!0),t=g.getRenderHeight(!0);(!k||k[0].width!==e||k[0].height!==t)&&(j(e,t),R=!0,z=!1),D.inputTexture=k[A];let n=E.inputTexture;if(!n.depthStencilTexture&&n.width>0)try{let e=g.isStencilEnable;n.createDepthStencilTexture(0,!1,e,1,e?i.TEXTUREFORMAT_DEPTH24_STENCIL8:i.TEXTUREFORMAT_DEPTH32_FLOAT)}catch{}}),E.onApplyObservable.add(t=>{let n=E.inputTexture.depthStencilTexture,r=f.getViewMatrix().m,i=f.globalPosition,a={position:[i.x,i.y,i.z],rotation:[r[0],r[1],r[2],r[4],r[5],r[6],r[8],r[9],r[10]],projection:I??[...f.getProjectionMatrix().m]},o=!R&&n!==null&&L!==null&&l(L.position,a.position);e.FromArrayToRef(u(a,P,L??a),0,B),k&&t._bindTexture(`historySampler`,k[1-A].texture),n&&t._bindTexture(`depthSampler`,n),t.setMatrix(`reprojection`,B),t.setFloat2(`jitter`,N[0],N[1]),t.setFloat2(`inputSize`,E.width,E.height),g.isNDCHalfZRange?t.setFloat2(`depthNdc`,1,0):t.setFloat2(`depthNdc`,2,-1),t.setFloat(`share`,y),t.setFloat(`reset`,+!o),L=a,R=!1,A=1-A,z=!0}),{latest:()=>z&&k?k[1-A].texture:null,dispose(){r.onBeforeCameraRenderObservable.remove(W),E.dispose(f),D.dispose(f),k?.forEach(e=>e.dispose()),k=null,H.dispose();for(let e of V)e.isEnabled=!1;V.length=0,f.getProjectionMatrix(!0),r.updateTransformMatrix()}}}export{E as createTemporal,T as temporalShaderLanguage};
//# sourceMappingURL=temporalChunk-q7wvVmGW.js.map