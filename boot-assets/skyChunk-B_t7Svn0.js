import{o as e}from"./math.vector.pure-C0qb8_DJ.js";import{t}from"./math.color.pure-CkEBM6c0.js";import{t as n}from"./mesh.pure-lUF0_hFV.js";import{q as r}from"../webverse-boot.js";import{n as i}from"./shaderMaterial.pure-BzOiL2wN.js";import{t as a}from"./shaderLanguage-CsgORKnQ.js";import"./shaderMaterial-C4cWUz9H.js";var o=Math.PI/180,s=2e3,c=`
precision highp float;
attribute vec3 position;
uniform mat4 worldViewProjection;
varying vec3 vDir;
void main(void) {
  vDir = normalize(position);
  gl_Position = worldViewProjection * vec4(position, 1.0);
}`,l=`
precision highp float;
varying vec3 vDir;
uniform vec3 groundColor;
uniform vec3 horizonColor;
uniform vec3 skyColor;
uniform vec3 sunColor;
uniform vec3 sunDirection;
uniform float sunCosInner;
uniform float sunCosOuter;
uniform float groundEnabled;
uniform float sunEnabled;
uniform float horizonSkyBlend;
uniform float groundFadeAmount;
void main(void) {
  vec3 dir = normalize(vDir);
  float y = dir.y;
  vec3 col;
  if (y >= 0.0) {
    float t = pow(clamp(y, 0.0, 1.0), 1.0 / max(horizonSkyBlend, 0.001));
    col = mix(horizonColor, skyColor, t);
  } else {
    float g = clamp(-y / max(groundFadeAmount, 0.001), 0.0, 1.0);
    col = (groundEnabled > 0.5) ? mix(horizonColor, groundColor, g) : horizonColor;
  }
  if (sunEnabled > 0.5) {
    float d = dot(dir, normalize(sunDirection));
    float disc = smoothstep(sunCosOuter, sunCosInner, d);
    col = mix(col, sunColor, disc);
  }
  gl_FragColor = vec4(col, 1.0);
}`,u=`
attribute position: vec3f;
uniform worldViewProjection: mat4x4f;
varying vDir: vec3f;
@vertex
fn main(input: VertexInputs) -> FragmentInputs {
  vertexOutputs.vDir = normalize(vertexInputs.position);
  vertexOutputs.position = uniforms.worldViewProjection * vec4f(vertexInputs.position, 1.0);
}`,d=`
varying vDir: vec3f;
uniform groundColor: vec3f;
uniform horizonColor: vec3f;
uniform skyColor: vec3f;
uniform sunColor: vec3f;
uniform sunDirection: vec3f;
uniform sunCosInner: f32;
uniform sunCosOuter: f32;
uniform groundEnabled: f32;
uniform sunEnabled: f32;
uniform horizonSkyBlend: f32;
uniform groundFadeAmount: f32;
@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
  var dir: vec3f = normalize(input.vDir);
  var y: f32 = dir.y;
  var col: vec3f = uniforms.horizonColor;
  if (y >= 0.0) {
    var t: f32 = pow(clamp(y, 0.0, 1.0), 1.0 / max(uniforms.horizonSkyBlend, 0.001));
    col = mix(uniforms.horizonColor, uniforms.skyColor, t);
  } else {
    var g: f32 = clamp(-y / max(uniforms.groundFadeAmount, 0.001), 0.0, 1.0);
    if (uniforms.groundEnabled > 0.5) {
      col = mix(uniforms.horizonColor, uniforms.groundColor, g);
    } else {
      col = uniforms.horizonColor;
    }
  }
  if (uniforms.sunEnabled > 0.5) {
    var dd: f32 = dot(dir, normalize(uniforms.sunDirection));
    var disc: f32 = smoothstep(uniforms.sunCosOuter, uniforms.sunCosInner, dd);
    col = mix(col, uniforms.sunColor, disc);
  }
  fragmentOutputs.color = vec4f(col, 1.0);
}`;function f(e){return e===`webgpu`?{shaderLanguage:a.WGSL,vertexSource:u,fragmentSource:d}:{shaderLanguage:a.GLSL,vertexSource:c,fragmentSource:l}}function p(a,c,l){let u=f(l),d=r(`proceduralSkyDome`,{diameter:s,segments:24,sideOrientation:n.BACKSIDE},c);d.infiniteDistance=!0,d.applyFog=!1,d.isPickable=!1,d.renderingGroupId=0;let p=new i(`proceduralSkyMaterial`,c,{vertexSource:u.vertexSource,fragmentSource:u.fragmentSource},{attributes:[`position`],uniforms:[`worldViewProjection`,`groundColor`,`horizonColor`,`skyColor`,`sunColor`,`sunDirection`,`sunCosInner`,`sunCosOuter`,`groundEnabled`,`sunEnabled`,`horizonSkyBlend`,`groundFadeAmount`],shaderLanguage:u.shaderLanguage});p.backFaceCulling=!1,p.disableDepthWrite=!0;let m=e=>new t(e.r,e.g,e.b);p.setColor3(`groundColor`,m(a.groundColor)),p.setColor3(`horizonColor`,m(a.horizonColor)),p.setColor3(`skyColor`,m(a.skyColor)),p.setColor3(`sunColor`,m(a.sunColor)),p.setFloat(`groundEnabled`,+!!a.groundEnabled),p.setFloat(`sunEnabled`,+!!a.sunEnabled),p.setFloat(`horizonSkyBlend`,a.horizonSkyBlend),p.setFloat(`groundFadeAmount`,a.groundFadeAmount);let h=Math.max(a.sunDiameter,.1)*o;p.setFloat(`sunCosInner`,Math.cos(h*.5)),p.setFloat(`sunCosOuter`,Math.cos(h)),d.material=p;let g=new e(.3,.6,.3).normalize();return p.setVector3(`sunDirection`,g),{setPickableFalse(){d.isPickable=!1},setSunDirection(e){let t=e.clone().normalize();p.setVector3(`sunDirection`,t)},isReady(){return p.isReady(d)},dispose(){d.dispose(!1,!1),p.dispose()}}}export{p as createProceduralSky};
//# sourceMappingURL=skyChunk-B_t7Svn0.js.map