import{Gt as e}from"./index-CPmGphPB.js";import"./materialPluginBase-ZibIdS7N.js";import{t}from"./shaderLanguage-CsgORKnQ.js";import{t as n}from"./materialArrivals-BgDToscV.js";import{r,t as i}from"./awayMaterials-BFHT3hIB.js";import{_ as a,b as o,g as s,v as c,x as l,y as u}from"./planetSystem-BgretWny.js";var d=[`blockShading`,`blockGlow`,`blockGlowColor`,`blockDay`,`skyFillUp`,`skyFillSky`,`skyFillGround`,`blockRelief`],f=`#ifdef BLOCKLIGHT
uniform float blockShading;
uniform float blockGlow;
uniform vec3 blockGlowColor;
uniform float blockDay;
#endif
#ifdef SKYFILL
uniform vec3 skyFillUp;
uniform vec3 skyFillSky;
uniform vec3 skyFillGround;
#endif
#ifdef RELIEF
uniform float blockRelief;
#endif
`,p=`#ifdef BLOCKLIGHT
uniform blockShading: f32;
uniform blockGlow: f32;
uniform blockGlowColor: vec3f;
uniform blockDay: f32;
#endif
#ifdef SKYFILL
uniform skyFillUp: vec3f;
uniform skyFillSky: vec3f;
uniform skyFillGround: vec3f;
#endif
#ifdef RELIEF
uniform blockRelief: f32;
#endif
`,m=`#ifdef SKYFILL
vec3 skyFillOn(vec3 c, vec3 n, float sky) {
  vec3 light = mix(skyFillGround, skyFillSky, 0.5 + 0.5 * dot(n, skyFillUp));
  return c * light * smoothstep(${l.toFixed(2)}, ${o.toFixed(1)}, sky);
}
#endif
`,h=`#ifdef SKYFILL
fn skyFillOn(c: vec3f, n: vec3f, sky: f32) -> vec3f {
  let light = mix(uniforms.skyFillGround, uniforms.skyFillSky, 0.5 + 0.5 * dot(n, uniforms.skyFillUp));
  return c * light * smoothstep(${l.toFixed(2)}, ${o.toFixed(1)}, sky);
}
#endif
`,g=(e,t)=>`#ifdef SKYFILL
#ifdef BLOCKLIGHT
${e(`${t}.y`)}
#else
${e(`1.0`)}
#endif
#endif
`,_={uniforms:f,vertexDefinitions:`#ifdef BLOCKLIGHT
#if !defined(UV2) && !defined(SWAYWEIGHT)
attribute vec2 uv2;
#endif
#ifndef UV3
attribute vec2 uv3;
#endif
varying vec3 vBlockLight;
#endif
`,vertex:`#ifdef BLOCKLIGHT
vBlockLight = vec3(uv2.y, uv3.x, uv3.y);
#endif
`,fragmentDefinitions:`#ifdef BLOCKLIGHT
varying vec3 vBlockLight;
// The corner shade at the world's strength.
float blockShade() { return mix(1.0, vBlockLight.z, blockShading); }
// What the light sources give a face whose colour in the sky's light is c: its own colour, lit by how much
// brighter their light is than the sky's at this hour.
vec3 blockGlowOf(vec3 c) {
  return c / max(vBlockLight.y, 0.01) * blockGlowColor * (blockGlow * max(vBlockLight.x - vBlockLight.y * blockDay, 0.0));
}
#endif
${m}${c}`,pbrAlbedo:`${s}#ifdef BLOCKLIGHT
surfaceAlbedo *= blockShade();
vec3 blockGlowLight = blockGlowOf(surfaceAlbedo);
#endif
`,pbrEmissive:`#ifdef BLOCKLIGHT
finalEmissive += blockGlowLight;
#endif
${g(e=>`finalEmissive += skyFillOn(surfaceAlbedo, normalW, ${e});`,`vBlockLight`)}`,standardDiffuse:`#ifdef BLOCKLIGHT
baseColor.rgb *= blockShade();
vec3 blockGlowLight = blockGlowOf(baseColor.rgb);
#endif
`,standardEmissive:`#ifdef BLOCKLIGHT
color.rgb += blockGlowLight;
#endif
${g(e=>`color.rgb += skyFillOn(baseColor.rgb, normalW, ${e});`,`vBlockLight`)}`},v={uniforms:p,vertexDefinitions:`#ifdef BLOCKLIGHT
#if !defined(UV2) && !defined(SWAYWEIGHT)
attribute uv2: vec2f;
#endif
#ifndef UV3
attribute uv3: vec2f;
#endif
varying vBlockLight: vec3f;
#endif
`,vertex:`#ifdef BLOCKLIGHT
vertexOutputs.vBlockLight = vec3f(vertexInputs.uv2.y, vertexInputs.uv3.x, vertexInputs.uv3.y);
#endif
`,fragmentDefinitions:`#ifdef BLOCKLIGHT
varying vBlockLight: vec3f;
fn blockShade(light: vec3f) -> f32 { return mix(1.0, light.z, uniforms.blockShading); }
fn blockGlowOf(c: vec3f, light: vec3f) -> vec3f {
  return c / max(light.y, 0.01) * uniforms.blockGlowColor * (uniforms.blockGlow * max(light.x - light.y * uniforms.blockDay, 0.0));
}
#endif
${h}${u}`,pbrAlbedo:`${a}#ifdef BLOCKLIGHT
surfaceAlbedo = surfaceAlbedo * blockShade(fragmentInputs.vBlockLight);
let blockGlowLight = blockGlowOf(surfaceAlbedo, fragmentInputs.vBlockLight);
#endif
`,pbrEmissive:`#ifdef BLOCKLIGHT
finalEmissive += blockGlowLight;
#endif
${g(e=>`finalEmissive += skyFillOn(surfaceAlbedo, normalW, ${e});`,`fragmentInputs.vBlockLight`)}`,standardDiffuse:`#ifdef BLOCKLIGHT
baseColor = vec4f(baseColor.rgb * blockShade(fragmentInputs.vBlockLight), baseColor.a);
let blockGlowLight = blockGlowOf(baseColor.rgb, fragmentInputs.vBlockLight);
#endif
`,standardEmissive:`#ifdef BLOCKLIGHT
color = vec4f(color.rgb + blockGlowLight, color.a);
#endif
${g(e=>`color = vec4f(color.rgb + skyFillOn(baseColor.rgb, normalW, ${e}), color.a);`,`fragmentInputs.vBlockLight`)}`};function y(e){return e===`webgpu`?v:_}var b=`BlockLight`,x=new Set([`ground`,`leaves`,`plants`,`water`,`standins`]),S=new Set([`ground`,`leaves`]),C=class extends e{state;_isEnabled=!0;normals=null;shine=null;constructor(e,t){super(e,b,330,{BLOCKLIGHT:!1,SKYFILL:!1,RELIEF:!1,BLOCKMAPS:!1},!0,!0),this.state=t,this.takeMaps()}takeMaps(){if(!this._isEnabled||!this.pbr||!S.has(this._material.name))return;let e=this._material;e.bumpTexture&&=(this.normals=e.bumpTexture,null),e.metallicTexture&&!this.shine&&(this.shine=e.metallicTexture),this.showShine((this.state.now?.relief??0)>0)}showShine(e){if(!this.shine)return;let t=this._material,n=e&&this._isEnabled?this.shine:null;t.metallicTexture!==n&&(t.metallicTexture=n)}rebind(e){this.state=e}get pbr(){return this._material.getClassName()===`PBRMaterial`}get isEnabled(){return this._isEnabled}set isEnabled(e){if(this._isEnabled!==e){if(this._isEnabled=e,e)this.takeMaps();else{let e=this._material;this.normals&&(e.bumpTexture=this.normals),this.shine&&(e.metallicTexture=this.shine),this.normals=null,this.shine=null}this.markAllDefinesAsDirty(),this._enable(e)}}getClassName(){return`BlockLightPlugin`}isCompatible(e){return e===t.GLSL||e===t.WGSL}lit(e){return e!==void 0&&e.isVerticesDataPresent(`uv2`)&&e.isVerticesDataPresent(`uv3`)}prepareDefines(e,t,n){let r=e;r.BLOCKLIGHT=this._isEnabled&&this.lit(n),r.SKYFILL=this._isEnabled&&!this.skyFillHeld&&!!this.state.now?.fill&&this._material.name!==`water`,r.RELIEF=r.BLOCKLIGHT&&this.pbr&&S.has(this._material.name)&&!!this._material.albedoTexture&&(this.state.now?.relief??0)>0,this.takeMaps(),r.BLOCKMAPS=r.RELIEF&&this.normals!==null}getSamplers(e){e.push(`blockNormalSampler`)}getActiveTextures(e){this.normals&&e.push(this.normals)}hasTexture(e){return e===this.normals}isReadyForSubMesh(){return!this.normals||this.normals.isReady()}fillChanged(){this.markAllDefinesAsDirty()}get skyFillHeld(){return this._skyFillHeld}set skyFillHeld(e){this._skyFillHeld!==e&&(this._skyFillHeld=e,this.markAllDefinesAsDirty())}_skyFillHeld=!1;getAttributes(e,t,n){if(!(!this._isEnabled||!this.lit(n)))for(let t of[`uv2`,`uv3`])e.includes(t)||e.push(t)}getUniforms(e=t.GLSL){let n=e===t.WGSL?p:f;return{ubo:[{name:`blockShading`,size:1,type:`float`},{name:`blockGlow`,size:1,type:`float`},{name:`blockGlowColor`,size:3,type:`vec3`},{name:`blockDay`,size:1,type:`float`},{name:`skyFillUp`,size:3,type:`vec3`},{name:`skyFillSky`,size:3,type:`vec3`},{name:`skyFillGround`,size:3,type:`vec3`},{name:`blockRelief`,size:1,type:`float`}],vertex:n,fragment:n}}bindForSubMesh(e){if(!this._isEnabled)return;let t=this.state.now;e.updateFloat(`blockShading`,t?t.shading:1),e.updateFloat(`blockGlow`,t?t.glow:0);let n=t?.color??[1,1,1];e.updateFloat3(`blockGlowColor`,n[0],n[1],n[2]),e.updateFloat(`blockDay`,t?t.day:1),e.updateFloat(`blockRelief`,t?.relief??0),this.normals&&(t?.relief??0)>0&&e.setTexture(`blockNormalSampler`,this.normals);let r=t?.fill;r&&(e.updateFloat3(`skyFillUp`,r.up[0],r.up[1],r.up[2]),e.updateFloat3(`skyFillSky`,r.sky[0],r.sky[1],r.sky[2]),e.updateFloat3(`skyFillGround`,r.ground[0],r.ground[1],r.ground[2]))}getCustomCode(e,n=t.GLSL){let r=y(n===t.WGSL?`webgpu`:`webgl2`);return e===`vertex`?{CUSTOM_VERTEX_DEFINITIONS:r.vertexDefinitions,CUSTOM_VERTEX_MAIN_END:r.vertex}:this.pbr?{CUSTOM_FRAGMENT_DEFINITIONS:r.fragmentDefinitions,CUSTOM_FRAGMENT_UPDATE_ALPHA:r.pbrAlbedo,CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:r.pbrEmissive}:{CUSTOM_FRAGMENT_DEFINITIONS:r.fragmentDefinitions,CUSTOM_FRAGMENT_UPDATE_DIFFUSE:r.standardDiffuse,CUSTOM_FRAGMENT_BEFORE_FOG:r.standardEmissive}}},w=e=>{if(!x.has(e.name))return!1;let t=e.getClassName();return t===`StandardMaterial`||t===`PBRMaterial`};function T(e,t){let a={now:null},o=[],s=n(e),c=()=>s.take(e=>{if(w(e)&&i(e))return!1;let t=w(e)?r(e,b,a,()=>new C(e,a)):void 0;t&&o.push(t)});c();let l=!1;return{update(e){if(l)return;c();let t=!!a.now?.fill,n=(a.now?.relief??0)>0;if(a.now=e,!!e.fill!==t||(e.relief??0)>0!==n)for(let e of o)e.fillChanged();if((e.relief??0)>0!==n)for(let t of o)t.showShine((e.relief??0)>0)},dispose(){l=!0,s.dispose();for(let e of o)e.isEnabled=!1;o.length=0}}}export{d as BLOCK_LIGHT_UNIFORMS,T as createBlockLightOn,y as selectBlockLightCode};
//# sourceMappingURL=blockLightChunk-DfB2qmUE.js.map