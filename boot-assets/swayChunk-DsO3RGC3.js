import{Ct as e}from"../webverse-boot.js";import{t}from"./shadowDepthWrapper-Dy_7T1fz.js";import"./materialPluginBase-B05skLyX.js";import{t as n}from"./shaderLanguage-CsgORKnQ.js";import{t as r}from"./materialArrivals-BgDToscV.js";import{r as i,t as a}from"./awayMaterials-BFHT3hIB.js";import{a as o,c as s,i as c,n as l,o as u,r as d,s as f}from"./planetSystem-DzEkBzAa.js";var p=[`swayOrigin`,`swayWind`,`swaySide`,`swayStrength`,`swayPhase`,`swayGust`],m=`#ifdef SWAY
uniform vec3 swayOrigin;
uniform vec3 swayWind;
uniform vec3 swaySide;
uniform float swayStrength;
uniform vec4 swayPhase;
uniform vec2 swayGust;
#endif
`,h=`#ifdef SWAY
uniform swayOrigin: vec3f;
uniform swayWind: vec3f;
uniform swaySide: vec3f;
uniform swayStrength: f32;
uniform swayPhase: vec4f;
uniform swayGust: vec2f;
#endif
`;function g(e,t){let n=d.map(([t,n,r],i)=>`${s(r)} * sin(6.2831853 / ${s(t)} * a + 6.2831853 / ${s(n)} * b - ${e(`swayGust`)}.${`xy`[i]})`).join(` + `),r=(n,r)=>`  ${t} down = (${s(n.lean)} + ${s(n.gust)} * g + ${s(n.flutter)} * swing * sin(${e(`swayPhase`)}.${r[0]} + spread)) * scale;
  ${t} across = ${s(n.side)} * swing * sin(${e(`swayPhase`)}.${r[1]} + ${s(u)} * spread) * scale;`;return{gust:n,plant:r(o,`xy`),leaves:r(c,`zw`)}}function _(){let e=g(e=>e,`float`);return`#ifdef SWAY
#if defined(SWAYWEIGHT) && !defined(UV2)
attribute vec2 uv2;
#endif
// How far the wind moves the world point p, weighed 0 (held) to 1: along the ground, with the wind and across it.
vec3 swayOffset(vec3 p, float weight) {
  float scale = weight * swayStrength;
  if (scale == 0.0) return vec3(0.0);
  vec3 r = p - swayOrigin;
  float a = dot(r, swayWind);
  float b = dot(r, swaySide);
  float g = 0.5 + ${e.gust};
  g = g * g;
  float spread = ${s(f[0])} * a + ${s(f[1])} * b;
  float swing = ${s(l)} + g;
#ifdef SWAYPLANT
${e.plant}
#else
${e.leaves}
#endif
  return swayWind * down + swaySide * across;
}
#endif
`}function v(){let e=g(e=>`uniforms.${e}`,`let`);return`#ifdef SWAY
#if defined(SWAYWEIGHT) && !defined(UV2)
attribute uv2: vec2f;
#endif
fn swayOffset(p: vec3f, weight: f32) -> vec3f {
  let scale = weight * uniforms.swayStrength;
  if (scale == 0.0) { return vec3f(0.0); }
  let r = p - uniforms.swayOrigin;
  let a = dot(r, uniforms.swayWind);
  let b = dot(r, uniforms.swaySide);
  var g: f32 = 0.5 + ${e.gust};
  g = g * g;
  let spread = ${s(f[0])} * a + ${s(f[1])} * b;
  let swing = ${s(l)} + g;
#ifdef SWAYPLANT
${e.plant}
#else
${e.leaves}
#endif
  return uniforms.swayWind * down + uniforms.swaySide * across;
}
#endif
`}function y(e){return e===`webgpu`?{uniforms:h,definitions:v(),vertex:`#ifdef SWAY
#ifdef SWAYPLANT
#ifdef SWAYWEIGHT
worldPos = vec4f(worldPos.xyz + swayOffset(worldPos.xyz, vertexInputs.uv2.x), worldPos.w);
#endif
#else
worldPos = vec4f(worldPos.xyz + swayOffset(worldPos.xyz, 1.0), worldPos.w);
#endif
#endif
`}:{uniforms:m,definitions:_(),vertex:`#ifdef SWAY
#ifdef SWAYPLANT
#ifdef SWAYWEIGHT
worldPos.xyz += swayOffset(worldPos.xyz, uv2.x);
#endif
#else
worldPos.xyz += swayOffset(worldPos.xyz, 1.0);
#endif
#endif
`}}var b=`Sway`,x=class extends e{state;_isEnabled=!0;constructor(e,t){super(e,b,320,{SWAY:!1,SWAYPLANT:!1,SWAYWEIGHT:!1},!0,!0),this.state=t}rebind(e){this.state=e}get plant(){return this._material.name===`plants`}get isEnabled(){return this._isEnabled}set isEnabled(e){this._isEnabled!==e&&(this._isEnabled=e,this.markAllDefinesAsDirty(),this._enable(e))}getClassName(){return`SwayPlugin`}isCompatible(e){return e===n.GLSL||e===n.WGSL}weighed(e){return this.plant&&e!==void 0&&e.isVerticesDataPresent(`uv2`)}prepareDefines(e,t,n){let r=e;r.SWAY=this._isEnabled,r.SWAYPLANT=this._isEnabled&&this.plant,r.SWAYWEIGHT=this._isEnabled&&this.weighed(n)}getAttributes(e,t,n){this._isEnabled&&this.weighed(n)&&!e.includes(`uv2`)&&e.push(`uv2`)}getUniforms(e=n.GLSL){return{ubo:[{name:`swayOrigin`,size:3,type:`vec3`},{name:`swayWind`,size:3,type:`vec3`},{name:`swaySide`,size:3,type:`vec3`},{name:`swayStrength`,size:1,type:`float`},{name:`swayPhase`,size:4,type:`vec4`},{name:`swayGust`,size:2,type:`vec2`}],vertex:e===n.WGSL?h:m}}bindForSubMesh(e){if(!this._isEnabled)return;let t=this.state.now;if(!t){e.updateFloat(`swayStrength`,0);return}e.updateFloat3(`swayOrigin`,t.origin[0],t.origin[1],t.origin[2]),e.updateFloat3(`swayWind`,t.wind[0],t.wind[1],t.wind[2]),e.updateFloat3(`swaySide`,t.side[0],t.side[1],t.side[2]),e.updateFloat(`swayStrength`,t.strength),e.updateFloat4(`swayPhase`,t.phase[0],t.phase[1],t.phase[2],t.phase[3]),e.updateFloat2(`swayGust`,t.gust[0],t.gust[1])}getCustomCode(e,t=n.GLSL){if(e!==`vertex`)return null;let r=y(t===n.WGSL?`webgpu`:`webgl2`);return{CUSTOM_VERTEX_DEFINITIONS:r.definitions,CUSTOM_VERTEX_UPDATE_WORLDPOS:r.vertex}}},S=e=>{if(e.name!==`leaves`&&e.name!==`plants`)return!1;let t=e.getClassName();return t===`StandardMaterial`||t===`PBRMaterial`};function C(e){return e===`webgpu`?{remappedVariables:[`worldPos`,`worldPos`,`vNormalW`,`vertexOutputs.vNormalW`]}:void 0}var w=new WeakMap,T=0,E=class extends t{constructor(...e){super(...e);let t=this,n=t._subMeshToDepthWrapper,r=n.set.bind(n);n.set=(e,n,i)=>{let a=t._subMeshToEffect.get(e)?.[0];if(a){let e=w.get(a);e===void 0&&w.set(a,e=`swayShadow${T++}`),i.token=e}r(e,n,i)}}isReadyForSubMesh(...e){let t=e[0],n=this._subMeshToEffect.get(t);return n&&!t._getDrawWrapper(n[1])?.defines?!1:super.isReadyForSubMesh(...e)}};function D(e,t){let n=C(t.engineKind),o={now:null},s=[],c=[],l=r(e),u=()=>l.take(t=>{if(S(t)&&a(t))return!1;let r=S(t)?i(t,b,o,()=>new x(t,o)):void 0;if(r&&(s.push(r),!t.shadowDepthWrapper)){let r=new E(t,e,n);t.shadowDepthWrapper=r,c.push({material:t,wrapper:r})}});u();let d=!1;return{update(e){d||(u(),o.now=e)},dispose(){d=!0,l.dispose();for(let e of s)e.isEnabled=!1;s.length=0;for(let{material:e,wrapper:t}of c)e.shadowDepthWrapper===t&&(e.shadowDepthWrapper=null),t.dispose();c.length=0}}}export{p as SWAY_UNIFORMS,D as createSwayOn,y as selectSwayCode};
//# sourceMappingURL=swayChunk-DsO3RGC3.js.map