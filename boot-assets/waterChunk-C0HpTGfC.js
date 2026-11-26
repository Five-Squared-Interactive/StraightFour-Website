import{s as e,t}from"./math.vector.pure-C0qb8_DJ.js";import{n}from"./math.color.pure-CkEBM6c0.js";import"../webverse-boot.js";import{n as r}from"./shaderMaterial.pure-BzOiL2wN.js";import{t as i}from"./shaderLanguage-CsgORKnQ.js";import"./shaderMaterial-C4cWUz9H.js";var a=8,o=`
precision highp float;
attribute vec3 position;
attribute float depth;
uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;
uniform float waves;
varying float vDepth;
varying vec3 vWorldPos;
void main(void) {
  vec4 wp = world * vec4(position, 1.0);
  float lift = waves * 0.15 * 0.5 * (sin(wp.x * 0.8 + time * 1.3) + sin(wp.z * 0.6 + time * 0.9));
  wp.y += lift;
  vWorldPos = wp.xyz;
  vDepth = depth;
  gl_Position = worldViewProjection * vec4(position.x, position.y + lift, position.z, 1.0);
}`,s=`
precision highp float;
varying float vDepth;
varying vec3 vWorldPos;
uniform vec4 shallowColor;
uniform vec4 deepColor;
uniform float clarity;
uniform float waves;
uniform float time;
uniform float blockerCount;
uniform mat4 blockerInverse[8];
uniform vec4 blockerHalf[8];
void main(void) {
  for (int i = 0; i < 8; i++) {
    if (float(i) < blockerCount) {
      vec3 l = (blockerInverse[i] * vec4(vWorldPos, 1.0)).xyz;
      if (all(lessThanEqual(abs(l), blockerHalf[i].xyz))) discard;
    }
  }
  float t = clarity > 0.0 ? clamp(vDepth / clarity, 0.0, 1.0) : 1.0;
  vec4 col = mix(shallowColor, deepColor, t);
  col.rgb += 0.04 * waves * sin(vWorldPos.x * 2.0 + vWorldPos.z * 1.7 + time * 2.0);
  gl_FragColor = col;
}`,c=`
attribute position: vec3f;
attribute depth: f32;
uniform worldViewProjection: mat4x4f;
uniform world: mat4x4f;
uniform time: f32;
uniform waves: f32;
varying vDepth: f32;
varying vWorldPos: vec3f;
@vertex
fn main(input: VertexInputs) -> FragmentInputs {
  var wp: vec4f = uniforms.world * vec4f(vertexInputs.position, 1.0);
  var lift: f32 = uniforms.waves * 0.15 * 0.5 * (sin(wp.x * 0.8 + uniforms.time * 1.3) + sin(wp.z * 0.6 + uniforms.time * 0.9));
  wp.y = wp.y + lift;
  vertexOutputs.vWorldPos = wp.xyz;
  vertexOutputs.vDepth = vertexInputs.depth;
  vertexOutputs.position = uniforms.worldViewProjection * vec4f(vertexInputs.position.x, vertexInputs.position.y + lift, vertexInputs.position.z, 1.0);
}`,l=`
varying vDepth: f32;
varying vWorldPos: vec3f;
uniform shallowColor: vec4f;
uniform deepColor: vec4f;
uniform clarity: f32;
uniform waves: f32;
uniform time: f32;
uniform blockerCount: f32;
uniform blockerInverse: array<mat4x4f, 8>;
uniform blockerHalf: array<vec4f, 8>;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  for (var i: i32 = 0; i < 8; i++) {
    if (f32(i) < uniforms.blockerCount) {
      let l: vec3f = (uniforms.blockerInverse[i] * vec4f(input.vWorldPos, 1.0)).xyz;
      if (all(abs(l) <= uniforms.blockerHalf[i].xyz)) { discard; }
    }
  }
  var t: f32 = 1.0;
  if (uniforms.clarity > 0.0) { t = clamp(input.vDepth / uniforms.clarity, 0.0, 1.0); }
  var col: vec4f = mix(uniforms.shallowColor, uniforms.deepColor, t);
  let shimmer: f32 = 0.04 * uniforms.waves * sin(input.vWorldPos.x * 2.0 + input.vWorldPos.z * 1.7 + uniforms.time * 2.0);
  col = vec4f(col.rgb + vec3f(shimmer), col.a);
  fragmentOutputs.color = col;
}`;function u(e){return e===`webgpu`?{shaderLanguage:i.WGSL,vertexSource:c,fragmentSource:l}:{shaderLanguage:i.GLSL,vertexSource:o,fragmentSource:s}}function d(i,a,o){let s=u(o),c=new r(`water:material`,a,{vertexSource:s.vertexSource,fragmentSource:s.fragmentSource},{attributes:[`position`,`depth`],uniforms:[`worldViewProjection`,`world`,`time`,`waves`,`shallowColor`,`deepColor`,`clarity`,`blockerCount`,`blockerInverse`,`blockerHalf`],needAlphaBlending:!0,shaderLanguage:s.shaderLanguage});c.backFaceCulling=!1;let l=e=>new n(e.r,e.g,e.b,e.a);c.setColor4(`shallowColor`,l(i.color)),c.setColor4(`deepColor`,l(i.deepColor)),c.setFloat(`clarity`,i.clarity),c.setFloat(`waves`,i.waves),c.setFloat(`time`,0);let d=i.blockers.slice(0,8),f=[],p=[];for(let n=0;n<8;n+=1){let r=d[n];f.push(r?r.inverse:t.Identity()),p.push(r?new e(r.half.x,r.half.y,r.half.z,0):new e(0,0,0,0))}return c.setFloat(`blockerCount`,d.length),c.setMatrices(`blockerInverse`,f),c.setArray4(`blockerHalf`,p.flatMap(e=>[e.x,e.y,e.z,e.w])),{material:c,setTime(e){c.setFloat(`time`,e)},isReady(){try{return c.isReady()}catch{return!1}},dispose(){c.dispose()}}}export{a as WATER_SHADER_BLOCKER_MAX,d as createWaterMaterial,u as selectWaterShaderSources};
//# sourceMappingURL=waterChunk-C0HpTGfC.js.map