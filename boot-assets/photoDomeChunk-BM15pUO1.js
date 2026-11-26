const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./background.vertex-CX5h_gQT.js","./shaderStore-D-XQlhUT.js","./bonesVertex-D9u7574l.js","./bakedVertexAnimation-C-a6t_tB.js","./clipPlaneVertex-DKhVm1NW.js","./instancesDeclaration-DsiFqYXH.js","./helperFunctions-BH8P-eyq.js","./sceneUboDeclaration-B96Tfx7b.js","./backgroundUboDeclaration-ClJLip40.js","./logDepthDeclaration-DYYUVTrx.js","./logDepthVertex-DaIBRo0c.js","./shadowsVertex-BWHRiOQY.js","./background.fragment-DHyskF3V.js","./clipPlaneFragment-Ct2VqHzk.js","./reflectionFunction-BvFXGAfy.js","./imageProcessingFunctions-DS1LMf3p.js","./shadowsFragmentFunctions-ytDjjpUn.js","./lightsFragmentFunctions-BM7MW5PY.js","./fogFragment-Dqlv8okl.js","./lightFragment-CHI52C6q.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-HclGiUj8.js";import{i as t,o as n,s as r}from"./math.vector.pure-C0qb8_DJ.js";import{t as i}from"./observable.pure-BmPG9gPP.js";import{t as a}from"./shaderStore-D-XQlhUT.js";import{t as o}from"./sceneUboDeclaration-B5VhSG0v.js";import{t as s}from"./logger-CuBYPcDK.js";import{n as c}from"./domManagement-BqltO0ki.js";import{t as l}from"./timingTools-DJ40Zbjg.js";import{b as u,h as d,i as f,n as p,o as ee,p as te,v as m,x as h,y as g}from"./decorators-C_ra_8EP.js";import{t as ne}from"./smartArray-BRfcgNbX.js";import{s as _}from"./fileTools.pure-C6eimILT.js";import{t as re}from"./decorators.serialization-CUCV1J9o.js";import{t as v}from"./math.color.pure-CkEBM6c0.js";import{t as ie}from"./imageProcessingConfiguration.pure-BtlLTNWx.js";import{r as y}from"./buffer.pure-B9PujaVE.js";import{C as ae,D as oe,M as se,N as ce,O as le,S as ue,a as de,b as fe,c as pe,d as me,f as he,h as ge,i as _e,j as b,k as ve,m as ye,n as be,o as xe,r as Se,s as Ce,v as we,w as Te,x as Ee,y as De}from"./material.pure-Cl2hqDTB.js";import{t as x}from"./baseTexture.pure-Bvy1p5-v.js";import{n as S}from"./texture.pure-DEIEHbsx.js";import{o as C,t as w}from"./mesh.pure-lUF0_hFV.js";import{t as T}from"./math.axis-CggXj7tf.js";import{An as E,Cn as D,Dt as O,Et as k,Gt as A,Jt as j,Lt as M,Mt as N,Nt as Oe,On as ke,Ot as Ae,Pn as P,Qt as je,Rt as Me,Sn as Ne,Tt as Pe,Ut as Fe,Wt as Ie,Xt as Le,Yt as Re,Zt as ze,_n as F,an as Be,bn as Ve,f as He,fn as Ue,gt as We,jn as I,jt as Ge,kn as Ke,m as L,mn as qe,nn as Je,on as Ye,p as Xe,pn as Ze,q as R,qt as Qe,sn as $e,xn as et,zt as tt}from"../webverse-boot.js";import{t as z}from"./backgroundUboDeclaration-i4MsxPq1.js";import{t as nt}from"./baseTexture.polynomial.pure-T__YV4xa.js";var B=`backgroundVertexDeclaration`,V=`uniform mat4 view;uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
uniform float shadowLevel;
#ifdef DIFFUSE
uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;uniform float fFovMultiplier;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
`;a.IncludesShadersStore[B]||(a.IncludesShadersStore[B]=V);var rt={name:B,shader:V},H=`backgroundVertexShader`,U=`precision highp float;
#include<__decl__backgroundVertex>
#include<helperFunctions>
attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef MAINUV1
varying vec2 vMainUV1;
#endif
#ifdef MAINUV2
varying vec2 vMainUV2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
varying vec2 vDiffuseUV;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=position;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*finalWorld*vec4(position,1.0);} else {gl_Position=viewProjectionR*finalWorld*vec4(position,1.0);}
#else
gl_Position=viewProjection*finalWorld*vec4(position,1.0);
#endif
vec4 worldPos=finalWorld*vec4(position,1.0);vPositionW=vec3(worldPos);
#ifdef NORMAL
mat3 normalWorld=mat3(finalWorld);
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vNormalW=normalize(normalWorld*normal);
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(position,0.0)));
#ifdef EQUIRECTANGULAR_RELFECTION_FOV
mat3 screenToWorld=inverseMat3(mat3(finalWorld*viewProjection));vec3 segment=mix(vDirectionW,screenToWorld*vec3(0.0,0.0,1.0),abs(fFovMultiplier-1.0));if (fFovMultiplier<=1.0) {vDirectionW=normalize(segment);} else {vDirectionW=normalize(vDirectionW+(vDirectionW-segment));}
#endif
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef MAINUV1
vMainUV1=uv;
#endif
#ifdef MAINUV2
vMainUV2=uv2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV==0
if (vDiffuseInfos.x==0.)
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}
else
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#ifdef VERTEXCOLOR
vColor=colorUpdated;
#endif
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;a.ShadersStore[H]||(a.ShadersStore[H]=U);var it=[rt,o,z,I,E,Ke,ke,D,Ne,et,Ve,F,qe,Ze,Ue,$e,Ye,Be,Je];for(let e of it)a.IncludesShadersStore[e.name]||(a.IncludesShadersStore[e.name]=e.shader);var at={name:H,shader:U},W=`backgroundFragmentDeclaration`,G=`uniform vec4 vEyePosition;uniform vec4 vPrimaryColor;
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
uniform vec4 vPrimaryColorShadow;
#endif
uniform float shadowLevel;uniform float alpha;
#ifdef DIFFUSE
uniform vec2 vDiffuseInfos;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;
#endif
#if defined(REFLECTIONFRESNEL) || defined(OPACITYFRESNEL)
uniform vec3 vBackgroundCenter;
#endif
#ifdef REFLECTIONFRESNEL
uniform vec4 vReflectionControl;
#endif
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION)
uniform mat4 view;
#endif
#ifdef PROJECTED_GROUND
uniform vec2 projectedGroundInfos;
#endif
`;a.IncludesShadersStore[W]||(a.IncludesShadersStore[W]=G);var ot={name:W,shader:G},K=`intersectionFunctions`,q=`float diskIntersectWithBackFaceCulling(vec3 ro,vec3 rd,vec3 c,float r) {float d=rd.y;if(d>0.0) { return 1e6; }
vec3 o=ro-c;float t=-o.y/d;vec3 q=o+rd*t;return (dot(q,q)<r*r) ? t : 1e6;}
vec2 sphereIntersect(vec3 ro,vec3 rd,vec3 ce,float ra) {vec3 oc=ro-ce;float b=dot(oc,rd);float c=dot(oc,oc)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}
vec2 sphereIntersectFromOrigin(vec3 ro,vec3 rd,float ra) {float b=dot(ro,rd);float c=dot(ro,ro)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}`;a.IncludesShadersStore[K]||(a.IncludesShadersStore[K]=q);var st={name:K,shader:q},J=`backgroundPixelShader`,Y=`#ifdef TEXTURELODSUPPORT
#extension GL_EXT_shader_texture_lod : enable
#endif
precision highp float;
#include<__decl__backgroundFragment>
#include<helperFunctions>
varying vec3 vPositionW;
#ifdef MAINUV1
varying vec2 vMainUV1;
#endif 
#ifdef MAINUV2 
varying vec2 vMainUV2; 
#endif 
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef DIFFUSE
#if DIFFUSEDIRECTUV==1
#define vDiffuseUV vMainUV1
#elif DIFFUSEDIRECTUV==2
#define vDiffuseUV vMainUV2
#else
varying vec2 vDiffuseUV;
#endif
uniform sampler2D diffuseSampler;
#endif
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
#define sampleReflection(s,c) textureCube(s,c)
uniform samplerCube reflectionSampler;
#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) textureCubeLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;
#endif
#else
#define sampleReflection(s,c) texture2D(s,c)
uniform sampler2D reflectionSampler;
#ifdef TEXTURELODSUPPORT
#define sampleReflectionLod(s,c,l) texture2DLodEXT(s,c,l)
#else
uniform samplerCube reflectionSamplerLow;uniform samplerCube reflectionSamplerHigh;
#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#endif
#include<reflectionFunction>
#endif
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE;
#endif
#ifndef SHADOWONLY
#define SHADOWONLY;
#endif
#include<imageProcessingDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<imageProcessingFunctions>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#ifdef REFLECTIONFRESNEL
#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
vec3 fresnelSchlickEnvironmentGGX(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)
{float weight=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}
#endif
#ifdef PROJECTED_GROUND
#include<intersectionFunctions>
vec3 project(vec3 viewDirectionW,vec3 eyePosition) {float radius=projectedGroundInfos.x;float height=projectedGroundInfos.y;vec3 camDir=-viewDirectionW;float skySphereDistance=sphereIntersectFromOrigin(eyePosition,camDir,radius).x;vec3 skySpherePositionW=eyePosition+camDir*skySphereDistance;vec3 p=normalize(skySpherePositionW);eyePosition.y-=height;float sIntersection=sphereIntersectFromOrigin(eyePosition,p,radius).x;vec3 h=vec3(0.0,-height,0.0);float dIntersection=diskIntersectWithBackFaceCulling(eyePosition,p,h,radius);p=(eyePosition+min(sIntersection,dIntersection)*p);return p;}
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(0.0,1.0,0.0);
#endif
float shadow=1.;float globalShadow=0.;float shadowLightCount=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0..maxSimultaneousLights]
#ifdef SHADOWINUSE
globalShadow/=shadowLightCount;
#else
globalShadow=1.0;
#endif
#ifndef BACKMAT_SHADOWONLY
vec4 reflectionColor=vec4(1.,1.,1.,1.);
#ifdef REFLECTION
#ifdef PROJECTED_GROUND
vec3 reflectionVector=project(viewDirectionW,vEyePosition.xyz);reflectionVector=vec3(reflectionMatrix*vec4(reflectionVector,1.));
#else
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=reflectionVector;
#else
vec2 reflectionCoords=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0-reflectionCoords.y;
#endif
#ifdef REFLECTIONBLUR
float reflectionLOD=vReflectionInfos.y;
#ifdef TEXTURELODSUPPORT
reflectionLOD=reflectionLOD*log2(vReflectionMicrosurfaceInfos.x)*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;reflectionColor=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);
#else
float lodReflectionNormalized=saturate(reflectionLOD);float lodReflectionNormalizedDoubled=lodReflectionNormalized*2.0;vec4 reflectionSpecularMid=sampleReflection(reflectionSampler,reflectionCoords);if(lodReflectionNormalizedDoubled<1.0){reflectionColor=mix(
sampleReflection(reflectionSamplerHigh,reflectionCoords),
reflectionSpecularMid,
lodReflectionNormalizedDoubled
);} else {reflectionColor=mix(
reflectionSpecularMid,
sampleReflection(reflectionSamplerLow,reflectionCoords),
lodReflectionNormalizedDoubled-1.0
);}
#endif
#else
vec4 reflectionSample=sampleReflection(reflectionSampler,reflectionCoords);reflectionColor=reflectionSample;
#endif
#ifdef RGBDREFLECTION
reflectionColor.rgb=fromRGBD(reflectionColor);
#endif
#ifdef GAMMAREFLECTION
reflectionColor.rgb=toLinearSpace(reflectionColor.rgb);
#endif
#ifdef REFLECTIONBGR
reflectionColor.rgb=reflectionColor.bgr;
#endif
reflectionColor.rgb*=vReflectionInfos.x;
#endif
vec3 diffuseColor=vec3(1.,1.,1.);float finalAlpha=alpha;
#ifdef DIFFUSE
vec4 diffuseMap=texture2D(diffuseSampler,vDiffuseUV);
#ifdef GAMMADIFFUSE
diffuseMap.rgb=toLinearSpace(diffuseMap.rgb);
#endif
diffuseMap.rgb*=vDiffuseInfos.y;
#ifdef DIFFUSEHASALPHA
finalAlpha*=diffuseMap.a;
#endif
diffuseColor=diffuseMap.rgb;
#endif
#ifdef REFLECTIONFRESNEL
vec3 colorBase=diffuseColor;
#else
vec3 colorBase=reflectionColor.rgb*diffuseColor;
#endif
colorBase=max(colorBase,0.0);
#ifdef USERGBCOLOR
vec3 finalColor=colorBase;
#else
#ifdef USEHIGHLIGHTANDSHADOWCOLORS
vec3 mainColor=mix(vPrimaryColorShadow.rgb,vPrimaryColor.rgb,colorBase);
#else
vec3 mainColor=vPrimaryColor.rgb;
#endif
vec3 finalColor=colorBase*mainColor;
#endif
#ifdef REFLECTIONFRESNEL
vec3 reflectionAmount=vReflectionControl.xxx;vec3 reflectionReflectance0=vReflectionControl.yyy;vec3 reflectionReflectance90=vReflectionControl.zzz;float VdotN=dot(normalize(vEyePosition.xyz),normalW);vec3 planarReflectionFresnel=fresnelSchlickEnvironmentGGX(saturate(VdotN),reflectionReflectance0,reflectionReflectance90,1.0);reflectionAmount*=planarReflectionFresnel;
#ifdef REFLECTIONFALLOFF
float reflectionDistanceFalloff=1.0-saturate(length(vPositionW.xyz-vBackgroundCenter)*vReflectionControl.w);reflectionDistanceFalloff*=reflectionDistanceFalloff;reflectionAmount*=reflectionDistanceFalloff;
#endif
finalColor=mix(finalColor,reflectionColor.rgb,saturate(reflectionAmount));
#endif
#ifdef OPACITYFRESNEL
float viewAngleToFloor=dot(normalW,normalize(vEyePosition.xyz-vBackgroundCenter));const float startAngle=0.1;float fadeFactor=saturate(viewAngleToFloor/startAngle);finalAlpha*=fadeFactor*fadeFactor;
#endif
#ifdef SHADOWINUSE
finalColor=mix(finalColor*shadowLevel,finalColor,globalShadow);
#endif
vec4 color=vec4(finalColor,finalAlpha);
#else
vec4 color=vec4(vPrimaryColor.rgb,(1.0-clamp(globalShadow,0.,1.))*alpha);
#endif
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
#if !defined(SKIPFINALCOLORCLAMP)
color.rgb=clamp(color.rgb,0.,30.0);
#endif
#else
color=applyImageProcessing(color);
#endif
#ifdef PREMULTIPLYALPHA
color.rgb*=color.a;
#endif
#ifdef NOISE
color.rgb+=dither(vPositionW.xy,0.5);color=max(color,0.0);
#endif
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;a.ShadersStore[J]||(a.ShadersStore[J]=Y);var ct=[ot,o,z,I,A,Ie,je,ze,Le,Re,j,Qe,Fe,F,tt,Me,st,M,Oe,N,Ge];for(let e of ct)a.IncludesShadersStore[e.name]||(a.IncludesShadersStore[e.name]=e.shader);var lt={name:J,shader:Y},ut=class extends Ae{},dt=class extends O(ut){constructor(){super(),this.DIFFUSE=!1,this.DIFFUSEDIRECTUV=0,this.GAMMADIFFUSE=!1,this.DIFFUSEHASALPHA=!1,this.OPACITYFRESNEL=!1,this.REFLECTIONBLUR=!1,this.REFLECTIONFRESNEL=!1,this.REFLECTIONFALLOFF=!1,this.TEXTURELODSUPPORT=!1,this.PREMULTIPLYALPHA=!1,this.USERGBCOLOR=!1,this.USEHIGHLIGHTANDSHADOWCOLORS=!1,this.BACKMAT_SHADOWONLY=!1,this.NOISE=!1,this.REFLECTIONBGR=!1,this.PROJECTED_GROUND=!1,this.REFLECTION=!1,this.REFLECTIONMAP_3D=!1,this.REFLECTIONMAP_SPHERICAL=!1,this.REFLECTIONMAP_PLANAR=!1,this.REFLECTIONMAP_CUBIC=!1,this.REFLECTIONMAP_PROJECTION=!1,this.REFLECTIONMAP_SKYBOX=!1,this.REFLECTIONMAP_EXPLICIT=!1,this.REFLECTIONMAP_EQUIRECTANGULAR=!1,this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED=!1,this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED=!1,this.INVERTCUBICMAP=!1,this.REFLECTIONMAP_OPPOSITEZ=!1,this.LODINREFLECTIONALPHA=!1,this.GAMMAREFLECTION=!1,this.RGBDREFLECTION=!1,this.EQUIRECTANGULAR_RELFECTION_FOV=!1,this.MAINUV1=!1,this.MAINUV2=!1,this.UV1=!1,this.UV2=!1,this.CLIPPLANE=!1,this.CLIPPLANE2=!1,this.CLIPPLANE3=!1,this.CLIPPLANE4=!1,this.CLIPPLANE5=!1,this.CLIPPLANE6=!1,this.POINTSIZE=!1,this.FOG=!1,this.NORMAL=!1,this.NUM_BONE_INFLUENCERS=0,this.BonesPerMesh=0,this.INSTANCES=!1,this.SHADOWFLOAT=!1,this.LOGARITHMICDEPTH=!1,this.NONUNIFORMSCALING=!1,this.ALPHATEST=!1,this.rebuild()}},ft=class extends We(k){},pt=(()=>{var i,a,o,c,l,_,x,S,C,w,T,E,D,O,k,A,j,M,N;let Oe=ft,ke,Ae=[],P=[],je,Me=[],Ne=[],Fe,Ie=[],Le=[],Re,ze=[],F=[],Be,Ve=[],He=[],Ue,We=[],I=[],Ge,Ke=[],L=[],qe,Je=[],Ye=[],Xe,Ze=[],R=[],Qe,$e=[],et=[],tt,z=[],nt=[],B,V=[],rt=[],H,U=[],it=[],at,W=[],G=[],ot,K=[],q=[],st,J=[],Y=[],ct,lt=[],ut=[],pt,X=[],Z=[],Q,$=[],mt=[],ht,gt=[],_t=[],vt,yt=[],bt=[],xt,St=[],Ct=[],wt,Tt=[],Et=[],Dt,Ot=[],kt=[],At,jt=[],Mt=[],Nt,Pt=[],Ft=[],It,Lt=[],Rt=[],zt,Bt=[],Vt=[],Ht,Ut=[],Wt=[],Gt,Kt=[],qt=[],Jt,Yt=[],Xt=[],Zt,Qt=[],$t=[],en,tn=[],nn=[],rn,an=[],on=[],sn,cn=[],ln=[],un,dn=[],fn=[],pn,mn=[],hn=[],gn,_n=[],vn=[],yn,bn=[],xn=[];return i=class extends Oe{get primaryColor(){return m(this,a,`f`)}set primaryColor(e){g(this,a,e,`f`)}get _perceptualColor(){return this.__perceptualColor}set _perceptualColor(e){this.__perceptualColor=e,this._computePrimaryColorFromPerceptualColor(),this._markAllSubMeshesAsLightsDirty()}get primaryColorShadowLevel(){return this._primaryColorShadowLevel}set primaryColorShadowLevel(e){this._primaryColorShadowLevel=e,this._computePrimaryColors(),this._markAllSubMeshesAsLightsDirty()}get primaryColorHighlightLevel(){return this._primaryColorHighlightLevel}set primaryColorHighlightLevel(e){this._primaryColorHighlightLevel=e,this._computePrimaryColors(),this._markAllSubMeshesAsLightsDirty()}get reflectionTexture(){return m(this,o,`f`)}set reflectionTexture(e){g(this,o,e,`f`)}get reflectionBlur(){return m(this,c,`f`)}set reflectionBlur(e){g(this,c,e,`f`)}get diffuseTexture(){return m(this,l,`f`)}set diffuseTexture(e){g(this,l,e,`f`)}get shadowLights(){return m(this,_,`f`)}set shadowLights(e){g(this,_,e,`f`)}get shadowLevel(){return m(this,x,`f`)}set shadowLevel(e){g(this,x,e,`f`)}get sceneCenter(){return m(this,S,`f`)}set sceneCenter(e){g(this,S,e,`f`)}get opacityFresnel(){return m(this,C,`f`)}set opacityFresnel(e){g(this,C,e,`f`)}get reflectionFresnel(){return m(this,w,`f`)}set reflectionFresnel(e){g(this,w,e,`f`)}get reflectionFalloffDistance(){return m(this,T,`f`)}set reflectionFalloffDistance(e){g(this,T,e,`f`)}get reflectionAmount(){return m(this,E,`f`)}set reflectionAmount(e){g(this,E,e,`f`)}get reflectionReflectance0(){return m(this,D,`f`)}set reflectionReflectance0(e){g(this,D,e,`f`)}get reflectionReflectance90(){return m(this,O,`f`)}set reflectionReflectance90(e){g(this,O,e,`f`)}set reflectionStandardFresnelWeight(e){let t=e;t<.5?(t*=2,this.reflectionReflectance0=i.StandardReflectance0*t,this.reflectionReflectance90=i.StandardReflectance90*t):(t=t*2-1,this.reflectionReflectance0=i.StandardReflectance0+(1-i.StandardReflectance0)*t,this.reflectionReflectance90=i.StandardReflectance90+(1-i.StandardReflectance90)*t)}get useRGBColor(){return m(this,k,`f`)}set useRGBColor(e){g(this,k,e,`f`)}get enableNoise(){return m(this,A,`f`)}set enableNoise(e){g(this,A,e,`f`)}get fovMultiplier(){return this._fovMultiplier}set fovMultiplier(e){isNaN(e)&&(e=1),this._fovMultiplier=Math.max(0,Math.min(2,e))}get maxSimultaneousLights(){return m(this,j,`f`)}set maxSimultaneousLights(e){g(this,j,e,`f`)}get shadowOnly(){return m(this,M,`f`)}set shadowOnly(e){g(this,M,e,`f`)}get enableGroundProjection(){return m(this,N,`f`)}set enableGroundProjection(e){g(this,N,e,`f`)}constructor(e,t,i=!1){super(e,t,void 0,i),this._primaryColor=h(this,Ae,void 0),a.set(this,(h(this,P),h(this,Me,v.White()))),this.__perceptualColor=(h(this,Ne),h(this,Ie,void 0)),this._primaryColorShadowLevel=(h(this,Le),h(this,ze,0)),this._primaryColorHighlightLevel=(h(this,F),h(this,Ve,0)),this._reflectionTexture=(h(this,He),h(this,We,void 0)),o.set(this,(h(this,I),h(this,Ke,null))),this._reflectionBlur=(h(this,L),h(this,Je,void 0)),c.set(this,(h(this,Ye),h(this,Ze,0))),this._diffuseTexture=(h(this,R),h(this,$e,void 0)),l.set(this,(h(this,et),h(this,z,null))),this._shadowLights=(h(this,nt),null),_.set(this,h(this,V,null)),this._shadowLevel=(h(this,rt),h(this,U,void 0)),x.set(this,(h(this,it),h(this,W,0))),this._sceneCenter=(h(this,G),h(this,K,void 0)),S.set(this,(h(this,q),h(this,J,n.Zero()))),this._opacityFresnel=(h(this,Y),h(this,lt,void 0)),C.set(this,(h(this,ut),h(this,X,!0))),this._reflectionFresnel=(h(this,Z),h(this,$,void 0)),w.set(this,(h(this,mt),h(this,gt,!1))),this._reflectionFalloffDistance=(h(this,_t),h(this,yt,void 0)),T.set(this,(h(this,bt),h(this,St,0))),this._reflectionAmount=(h(this,Ct),h(this,Tt,void 0)),E.set(this,(h(this,Et),h(this,Ot,1))),this._reflectionReflectance0=(h(this,kt),h(this,jt,void 0)),D.set(this,(h(this,Mt),h(this,Pt,.05))),this._reflectionReflectance90=(h(this,Ft),h(this,Lt,void 0)),O.set(this,(h(this,Rt),h(this,Bt,.5))),this._useRGBColor=(h(this,Vt),h(this,Ut,void 0)),k.set(this,(h(this,Wt),h(this,Kt,!0))),this._enableNoise=(h(this,qt),h(this,Yt,void 0)),A.set(this,(h(this,Xt),h(this,Qt,!1))),this._fovMultiplier=(h(this,$t),1),this.useEquirectangularFOV=!1,this._maxSimultaneousLights=h(this,tn,4),j.set(this,(h(this,nn),h(this,an,4))),this._shadowOnly=(h(this,on),h(this,cn,!1)),M.set(this,(h(this,ln),h(this,dn,!1))),this.switchToBGR=(h(this,fn),!1),this._enableGroundProjection=!1,N.set(this,h(this,mn,!1)),this.projectedGroundRadius=(h(this,hn),h(this,_n,1e3)),this.projectedGroundHeight=(h(this,vn),h(this,bn,10)),this._renderTargets=(h(this,xn),new ne(16)),this._reflectionControls=r.Zero(),this._white=v.White(),this._primaryShadowColor=v.Black(),this._primaryHighlightColor=v.Black(),this._shadersLoaded=!1,this._attachImageProcessingConfiguration(null),this.getRenderTargetTextures=()=>(this._renderTargets.reset(),this._diffuseTexture&&this._diffuseTexture.isRenderTarget&&this._renderTargets.push(this._diffuseTexture),this._reflectionTexture&&this._reflectionTexture.isRenderTarget&&this._renderTargets.push(this._reflectionTexture),this._renderTargets)}get hasRenderTargetTextures(){return!!(this._diffuseTexture&&this._diffuseTexture.isRenderTarget||this._reflectionTexture&&this._reflectionTexture.isRenderTarget)}needAlphaTesting(){return!0}needAlphaBlending(){return this.alpha<1||this._diffuseTexture!=null&&this._diffuseTexture.hasAlpha||this._shadowOnly}isReadyForSubMesh(t,n,r=!1){let i=n._drawWrapper;if(i.effect&&this.isFrozen&&i._wasPreviouslyReady&&i._wasPreviouslyUsingInstances===r)return!0;n.materialDefines||=new dt;let a=this.getScene(),o=n.materialDefines;if(this._isReadyForSubMesh(n))return!0;let c=a.getEngine();if(Ee(a,t,o,!1,this._maxSimultaneousLights),o._needNormals=!0,!be(a,t,this._maxSimultaneousLights))return!1;if(Te(a,o),o._areTexturesDirty){if(o._needUVs=!1,a.texturesEnabled){if(a.getEngine().getCaps().textureLOD&&(o.TEXTURELODSUPPORT=!0),this._diffuseTexture&&b.DiffuseTextureEnabled){if(!this._diffuseTexture.isReadyOrNotBlocking())return!1;ue(this._diffuseTexture,o,`DIFFUSE`),o.DIFFUSEHASALPHA=this._diffuseTexture.hasAlpha,o.GAMMADIFFUSE=this._diffuseTexture.gammaSpace,o.OPACITYFRESNEL=this._opacityFresnel}else o.DIFFUSE=!1,o.DIFFUSEDIRECTUV=0,o.DIFFUSEHASALPHA=!1,o.GAMMADIFFUSE=!1,o.OPACITYFRESNEL=!1;let e=this._reflectionTexture;if(fe(a,e,o),e&&b.ReflectionTextureEnabled){if(!e.isReadyOrNotBlocking())return!1;o.EQUIRECTANGULAR_RELFECTION_FOV=this.useEquirectangularFOV,o.REFLECTIONBGR=this.switchToBGR,o.REFLECTIONBLUR=this._reflectionBlur>0,this.reflectionFresnel?(o.REFLECTIONFRESNEL=!0,o.REFLECTIONFALLOFF=this.reflectionFalloffDistance>0,this._reflectionControls.x=this.reflectionAmount,this._reflectionControls.y=this.reflectionReflectance0,this._reflectionControls.z=this.reflectionReflectance90,this._reflectionControls.w=1/this.reflectionFalloffDistance):(o.REFLECTIONFRESNEL=!1,o.REFLECTIONFALLOFF=!1)}else o.REFLECTIONFRESNEL=!1,o.REFLECTIONFALLOFF=!1,o.REFLECTIONBLUR=!1}o.PREMULTIPLYALPHA=this.alphaMode===7||this.alphaMode===8,o.USERGBCOLOR=this._useRGBColor,o.NOISE=this._enableNoise}if(o._areLightsDirty&&(o.USEHIGHLIGHTANDSHADOWCOLORS=!this._useRGBColor&&(this._primaryColorShadowLevel!==0||this._primaryColorHighlightLevel!==0),o.BACKMAT_SHADOWONLY=this._shadowOnly),o._areImageProcessingDirty&&this._imageProcessingConfiguration){if(!this._imageProcessingConfiguration.isReady())return!1;this._imageProcessingConfiguration.prepareDefines(o)}if(o._areMiscDirty&&(o.REFLECTIONMAP_3D&&this._enableGroundProjection?(o.PROJECTED_GROUND=!0,o.REFLECTIONMAP_SKYBOX=!0):o.PROJECTED_GROUND=!1),ae(t,a,this._useLogarithmicDepth,this.pointsCloud,this.fogEnabled,this.needAlphaTestingForMesh(t),o,void 0,void 0,void 0,this._isVertexOutputInvariant),De(a,c,this,o,r,null,n.getRenderingMesh().hasThinInstances),we(t,o,!1,!0,!1)&&t&&!a.getEngine().getCaps().standardDerivatives&&!t.isVerticesDataPresent(y.NormalKind)&&(t.createNormals(!0),s.Warn(`BackgroundMaterial: Normals have been created for the mesh: `+t.name)),o.isDirty){o.markAsProcessed(),a.resetCachedMaterial();let r=new Pe;o.FOG&&r.addFallback(0,`FOG`),o.POINTSIZE&&r.addFallback(1,`POINTSIZE`),o.MULTIVIEW&&r.addFallback(0,`MULTIVIEW`),he(o,r,this._maxSimultaneousLights);let i=[y.PositionKind];o.NORMAL&&i.push(y.NormalKind),o.UV1&&i.push(y.UVKind),o.UV2&&i.push(y.UV2Kind),ye(i,t,o,r),ge(i,o);let s=[`world`,`view`,`viewProjection`,`vEyePosition`,`vLightsType`,`vFogInfos`,`vFogColor`,`pointSize`,`mBones`,`vPrimaryColor`,`vPrimaryColorShadow`,`fFovMultiplier`,`shadowLevel`,`alpha`,`vBackgroundCenter`,`vReflectionControl`,`vDiffuseInfos`,`diffuseMatrix`,`projectedGroundInfos`,`logarithmicDepthConstant`];se(s);let l=[`diffuseSampler`];le(s,l,!1);let u=[`Material`,`Scene`];ie&&(ie.PrepareUniforms(s,o),ie.PrepareSamplers(l,o)),ve({uniformsNames:s,uniformBuffersNames:u,samplers:l,defines:o,maxSimultaneousLights:this._maxSimultaneousLights,shaderLanguage:this._shaderLanguage});let d=o.toString(),f=a.getEngine().createEffect(`background`,{attributes:i,uniformsNames:s,uniformBuffersNames:u,samplers:l,defines:d,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:this._maxSimultaneousLights},shaderLanguage:this._shaderLanguage,extraInitializationsAsync:this._shadersLoaded?void 0:async()=>{this.shaderLanguage===1?await Promise.all([e(()=>import(`./background.vertex-CX5h_gQT.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),e(()=>import(`./background.fragment-DHyskF3V.js`),__vite__mapDeps([12,1,13,6,7,8,14,15,16,17,9,18,19]),import.meta.url)]):await Promise.all([e(()=>import(`./background.vertex-B4qKWlS9.js`),[],import.meta.url),e(()=>import(`./background.fragment-BgoLIYs3.js`),[],import.meta.url)]),this._shadersLoaded=!0}},c);n.setEffect(f,o,this._materialContext),this.buildUniformLayout()}return!n.effect||!n.effect.isReady()?!1:(o._renderId=a.getRenderId(),i._wasPreviouslyReady=!0,i._wasPreviouslyUsingInstances=r,this._checkScenePerformancePriority(),!0)}_computePrimaryColorFromPerceptualColor(){this.__perceptualColor&&(this._primaryColor.copyFrom(this.__perceptualColor),this._primaryColor.toLinearSpaceToRef(this._primaryColor,this.getScene().getEngine().useExactSrgbConversions),this._imageProcessingConfiguration&&this._primaryColor.scaleToRef(1/this._imageProcessingConfiguration.exposure,this._primaryColor),this._computePrimaryColors())}_computePrimaryColors(){(this._primaryColorShadowLevel!==0||this._primaryColorHighlightLevel!==0)&&(this._primaryColor.scaleToRef(this._primaryColorShadowLevel,this._primaryShadowColor),this._primaryColor.subtractToRef(this._primaryShadowColor,this._primaryShadowColor),this._white.subtractToRef(this._primaryColor,this._primaryHighlightColor),this._primaryHighlightColor.scaleToRef(this._primaryColorHighlightLevel,this._primaryHighlightColor),this._primaryColor.addToRef(this._primaryHighlightColor,this._primaryHighlightColor))}buildUniformLayout(){this._uniformBuffer.addUniform(`vPrimaryColor`,4),this._uniformBuffer.addUniform(`vPrimaryColorShadow`,4),this._uniformBuffer.addUniform(`vDiffuseInfos`,2),this._uniformBuffer.addUniform(`diffuseMatrix`,16),this._uniformBuffer.addUniform(`fFovMultiplier`,1),this._uniformBuffer.addUniform(`pointSize`,1),this._uniformBuffer.addUniform(`shadowLevel`,1),this._uniformBuffer.addUniform(`alpha`,1),this._uniformBuffer.addUniform(`vBackgroundCenter`,3),this._uniformBuffer.addUniform(`vReflectionControl`,4),this._uniformBuffer.addUniform(`projectedGroundInfos`,2),oe(this._uniformBuffer,!0,!1,!1),this._uniformBuffer.create()}unbind(){this._diffuseTexture&&this._diffuseTexture.isRenderTarget&&this._uniformBuffer.setTexture(`diffuseSampler`,null),this._reflectionTexture&&this._reflectionTexture.isRenderTarget&&this._uniformBuffer.setTexture(`reflectionSampler`,null),super.unbind()}bindOnlyWorldMatrix(e){this._activeEffect.setMatrix(`world`,e)}bindForSubMesh(e,n,r){let i=this.getScene(),a=r.materialDefines;if(!a)return;let o=r.effect;if(!o)return;this._activeEffect=o,this.bindOnlyWorldMatrix(e),Se(n,this._activeEffect);let s=this._mustRebind(i,o,r,n.visibility),c=i.getEngine()._features.needToAlwaysBindUniformBuffers;if(s){this._uniformBuffer.bindToEffect(o,`Material`),this.bindViewProjection(o);let e=this._reflectionTexture;if((!this._uniformBuffer.useUbo||!this.isFrozen||!this._uniformBuffer.isSync||r._drawWrapper._forceRebindOnNextCall)&&(i.texturesEnabled&&(this._diffuseTexture&&b.DiffuseTextureEnabled&&(this._uniformBuffer.updateFloat2(`vDiffuseInfos`,this._diffuseTexture.coordinatesIndex,this._diffuseTexture.level),me(this._diffuseTexture,this._uniformBuffer,`diffuse`)),de(i,a,this._uniformBuffer,v.White(),e,!1,!0,!1,!1,!1,!1,this._reflectionBlur)),this.shadowLevel>0&&this._uniformBuffer.updateFloat(`shadowLevel`,this.shadowLevel),this._uniformBuffer.updateFloat(`alpha`,this.alpha),this.pointsCloud&&this._uniformBuffer.updateFloat(`pointSize`,this.pointSize),a.USEHIGHLIGHTANDSHADOWCOLORS?(this._uniformBuffer.updateColor4(`vPrimaryColor`,this._primaryHighlightColor,1),this._uniformBuffer.updateColor4(`vPrimaryColorShadow`,this._primaryShadowColor,1)):this._uniformBuffer.updateColor4(`vPrimaryColor`,this._primaryColor,1)),this._uniformBuffer.updateFloat(`fFovMultiplier`,this._fovMultiplier),a.REFLECTIONFRESNEL&&this._uniformBuffer.updateFloat4(`vReflectionControl`,this._reflectionControls.x,this._reflectionControls.y,this._reflectionControls.z,this._reflectionControls.w),a.REFLECTIONFRESNEL&&a.REFLECTIONFALLOFF||a.OPACITYFRESNEL){let e=t.Vector3[0].copyFrom(this.sceneCenter).subtractInPlace(i.floatingOriginOffset);this._uniformBuffer.updateFloat3(`vBackgroundCenter`,e.x,e.y,e.z)}i.texturesEnabled&&(this._diffuseTexture&&b.DiffuseTextureEnabled&&this._uniformBuffer.setTexture(`diffuseSampler`,this._diffuseTexture),e&&b.ReflectionTextureEnabled&&xe(i,a,this._uniformBuffer,e),a.PROJECTED_GROUND&&this._uniformBuffer.updateFloat2(`projectedGroundInfos`,this.projectedGroundRadius,this.projectedGroundHeight)),ce(this._activeEffect,this,i),i.bindEyePosition(o)}else c&&(this._uniformBuffer.bindToEffect(o,`Material`),this._needToBindSceneUbo=!0);(s||!this.isFrozen||c)&&i.lightsEnabled&&Ce(i,n,this._activeEffect,a,this._maxSimultaneousLights),(s||!this.isFrozen)&&(this.bindView(o),_e(i,n,this._activeEffect,!0),this._useLogarithmicDepth&&pe(a,o,i),this._imageProcessingConfiguration&&this._imageProcessingConfiguration.bind(this._activeEffect)),this._afterBind(n,this._activeEffect,r),this._uniformBuffer.update()}hasTexture(e){return!!(super.hasTexture(e)||this._reflectionTexture===e||this._diffuseTexture===e)}dispose(e=!1,t=!1){t&&(this.diffuseTexture&&this.diffuseTexture.dispose(),this.reflectionTexture&&this.reflectionTexture.dispose()),this._renderTargets.dispose(),this._imageProcessingConfiguration&&this._imageProcessingObserver&&this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver),super.dispose(e)}clone(e){return re.Clone(()=>new i(e,this.getScene()),this)}serialize(){let e=super.serialize();return e.customType=`BABYLON.BackgroundMaterial`,e}getClassName(){return`BackgroundMaterial`}static Parse(e,t,n){return re.Parse(()=>new i(e.name,t),e,t,n)}},a=new WeakMap,o=new WeakMap,c=new WeakMap,l=new WeakMap,_=new WeakMap,x=new WeakMap,S=new WeakMap,C=new WeakMap,w=new WeakMap,T=new WeakMap,E=new WeakMap,D=new WeakMap,O=new WeakMap,k=new WeakMap,A=new WeakMap,j=new WeakMap,M=new WeakMap,N=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(Oe[Symbol.metadata]??null):void 0;ke=[ee()],je=[p(`_markAllSubMeshesAsLightsDirty`)],Fe=[ee()],Re=[f()],Be=[f()],Ue=[te()],Ge=[p(`_markAllSubMeshesAsTexturesDirty`)],qe=[f()],Xe=[p(`_markAllSubMeshesAsTexturesDirty`)],Qe=[te()],tt=[p(`_markAllSubMeshesAsTexturesDirty`)],B=[p(`_markAllSubMeshesAsTexturesDirty`)],H=[f()],at=[p(`_markAllSubMeshesAsTexturesDirty`)],ot=[d()],st=[p(`_markAllSubMeshesAsTexturesDirty`)],ct=[f()],pt=[p(`_markAllSubMeshesAsTexturesDirty`)],Q=[f()],ht=[p(`_markAllSubMeshesAsTexturesDirty`)],vt=[f()],xt=[p(`_markAllSubMeshesAsTexturesDirty`)],wt=[f()],Dt=[p(`_markAllSubMeshesAsTexturesDirty`)],At=[f()],Nt=[p(`_markAllSubMeshesAsTexturesDirty`)],It=[f()],zt=[p(`_markAllSubMeshesAsTexturesDirty`)],Ht=[f()],Gt=[p(`_markAllSubMeshesAsTexturesDirty`)],Jt=[f()],Zt=[p(`_markAllSubMeshesAsTexturesDirty`)],en=[f()],rn=[p(`_markAllSubMeshesAsTexturesDirty`)],sn=[f()],un=[p(`_markAllSubMeshesAsLightsDirty`)],pn=[f(),p(`_markAllSubMeshesAsMiscDirty`)],gn=[f()],yn=[f()],u(i,null,je,{kind:`accessor`,name:`primaryColor`,static:!1,private:!1,access:{has:e=>`primaryColor`in e,get:e=>e.primaryColor,set:(e,t)=>{e.primaryColor=t}},metadata:e},Me,Ne),u(i,null,Ge,{kind:`accessor`,name:`reflectionTexture`,static:!1,private:!1,access:{has:e=>`reflectionTexture`in e,get:e=>e.reflectionTexture,set:(e,t)=>{e.reflectionTexture=t}},metadata:e},Ke,L),u(i,null,Xe,{kind:`accessor`,name:`reflectionBlur`,static:!1,private:!1,access:{has:e=>`reflectionBlur`in e,get:e=>e.reflectionBlur,set:(e,t)=>{e.reflectionBlur=t}},metadata:e},Ze,R),u(i,null,tt,{kind:`accessor`,name:`diffuseTexture`,static:!1,private:!1,access:{has:e=>`diffuseTexture`in e,get:e=>e.diffuseTexture,set:(e,t)=>{e.diffuseTexture=t}},metadata:e},z,nt),u(i,null,B,{kind:`accessor`,name:`shadowLights`,static:!1,private:!1,access:{has:e=>`shadowLights`in e,get:e=>e.shadowLights,set:(e,t)=>{e.shadowLights=t}},metadata:e},V,rt),u(i,null,at,{kind:`accessor`,name:`shadowLevel`,static:!1,private:!1,access:{has:e=>`shadowLevel`in e,get:e=>e.shadowLevel,set:(e,t)=>{e.shadowLevel=t}},metadata:e},W,G),u(i,null,st,{kind:`accessor`,name:`sceneCenter`,static:!1,private:!1,access:{has:e=>`sceneCenter`in e,get:e=>e.sceneCenter,set:(e,t)=>{e.sceneCenter=t}},metadata:e},J,Y),u(i,null,pt,{kind:`accessor`,name:`opacityFresnel`,static:!1,private:!1,access:{has:e=>`opacityFresnel`in e,get:e=>e.opacityFresnel,set:(e,t)=>{e.opacityFresnel=t}},metadata:e},X,Z),u(i,null,ht,{kind:`accessor`,name:`reflectionFresnel`,static:!1,private:!1,access:{has:e=>`reflectionFresnel`in e,get:e=>e.reflectionFresnel,set:(e,t)=>{e.reflectionFresnel=t}},metadata:e},gt,_t),u(i,null,xt,{kind:`accessor`,name:`reflectionFalloffDistance`,static:!1,private:!1,access:{has:e=>`reflectionFalloffDistance`in e,get:e=>e.reflectionFalloffDistance,set:(e,t)=>{e.reflectionFalloffDistance=t}},metadata:e},St,Ct),u(i,null,Dt,{kind:`accessor`,name:`reflectionAmount`,static:!1,private:!1,access:{has:e=>`reflectionAmount`in e,get:e=>e.reflectionAmount,set:(e,t)=>{e.reflectionAmount=t}},metadata:e},Ot,kt),u(i,null,Nt,{kind:`accessor`,name:`reflectionReflectance0`,static:!1,private:!1,access:{has:e=>`reflectionReflectance0`in e,get:e=>e.reflectionReflectance0,set:(e,t)=>{e.reflectionReflectance0=t}},metadata:e},Pt,Ft),u(i,null,zt,{kind:`accessor`,name:`reflectionReflectance90`,static:!1,private:!1,access:{has:e=>`reflectionReflectance90`in e,get:e=>e.reflectionReflectance90,set:(e,t)=>{e.reflectionReflectance90=t}},metadata:e},Bt,Vt),u(i,null,Gt,{kind:`accessor`,name:`useRGBColor`,static:!1,private:!1,access:{has:e=>`useRGBColor`in e,get:e=>e.useRGBColor,set:(e,t)=>{e.useRGBColor=t}},metadata:e},Kt,qt),u(i,null,Zt,{kind:`accessor`,name:`enableNoise`,static:!1,private:!1,access:{has:e=>`enableNoise`in e,get:e=>e.enableNoise,set:(e,t)=>{e.enableNoise=t}},metadata:e},Qt,$t),u(i,null,rn,{kind:`accessor`,name:`maxSimultaneousLights`,static:!1,private:!1,access:{has:e=>`maxSimultaneousLights`in e,get:e=>e.maxSimultaneousLights,set:(e,t)=>{e.maxSimultaneousLights=t}},metadata:e},an,on),u(i,null,un,{kind:`accessor`,name:`shadowOnly`,static:!1,private:!1,access:{has:e=>`shadowOnly`in e,get:e=>e.shadowOnly,set:(e,t)=>{e.shadowOnly=t}},metadata:e},dn,fn),u(i,null,pn,{kind:`accessor`,name:`enableGroundProjection`,static:!1,private:!1,access:{has:e=>`enableGroundProjection`in e,get:e=>e.enableGroundProjection,set:(e,t)=>{e.enableGroundProjection=t}},metadata:e},mn,hn),u(null,null,ke,{kind:`field`,name:`_primaryColor`,static:!1,private:!1,access:{has:e=>`_primaryColor`in e,get:e=>e._primaryColor,set:(e,t)=>{e._primaryColor=t}},metadata:e},Ae,P),u(null,null,Fe,{kind:`field`,name:`__perceptualColor`,static:!1,private:!1,access:{has:e=>`__perceptualColor`in e,get:e=>e.__perceptualColor,set:(e,t)=>{e.__perceptualColor=t}},metadata:e},Ie,Le),u(null,null,Re,{kind:`field`,name:`_primaryColorShadowLevel`,static:!1,private:!1,access:{has:e=>`_primaryColorShadowLevel`in e,get:e=>e._primaryColorShadowLevel,set:(e,t)=>{e._primaryColorShadowLevel=t}},metadata:e},ze,F),u(null,null,Be,{kind:`field`,name:`_primaryColorHighlightLevel`,static:!1,private:!1,access:{has:e=>`_primaryColorHighlightLevel`in e,get:e=>e._primaryColorHighlightLevel,set:(e,t)=>{e._primaryColorHighlightLevel=t}},metadata:e},Ve,He),u(null,null,Ue,{kind:`field`,name:`_reflectionTexture`,static:!1,private:!1,access:{has:e=>`_reflectionTexture`in e,get:e=>e._reflectionTexture,set:(e,t)=>{e._reflectionTexture=t}},metadata:e},We,I),u(null,null,qe,{kind:`field`,name:`_reflectionBlur`,static:!1,private:!1,access:{has:e=>`_reflectionBlur`in e,get:e=>e._reflectionBlur,set:(e,t)=>{e._reflectionBlur=t}},metadata:e},Je,Ye),u(null,null,Qe,{kind:`field`,name:`_diffuseTexture`,static:!1,private:!1,access:{has:e=>`_diffuseTexture`in e,get:e=>e._diffuseTexture,set:(e,t)=>{e._diffuseTexture=t}},metadata:e},$e,et),u(null,null,H,{kind:`field`,name:`_shadowLevel`,static:!1,private:!1,access:{has:e=>`_shadowLevel`in e,get:e=>e._shadowLevel,set:(e,t)=>{e._shadowLevel=t}},metadata:e},U,it),u(null,null,ot,{kind:`field`,name:`_sceneCenter`,static:!1,private:!1,access:{has:e=>`_sceneCenter`in e,get:e=>e._sceneCenter,set:(e,t)=>{e._sceneCenter=t}},metadata:e},K,q),u(null,null,ct,{kind:`field`,name:`_opacityFresnel`,static:!1,private:!1,access:{has:e=>`_opacityFresnel`in e,get:e=>e._opacityFresnel,set:(e,t)=>{e._opacityFresnel=t}},metadata:e},lt,ut),u(null,null,Q,{kind:`field`,name:`_reflectionFresnel`,static:!1,private:!1,access:{has:e=>`_reflectionFresnel`in e,get:e=>e._reflectionFresnel,set:(e,t)=>{e._reflectionFresnel=t}},metadata:e},$,mt),u(null,null,vt,{kind:`field`,name:`_reflectionFalloffDistance`,static:!1,private:!1,access:{has:e=>`_reflectionFalloffDistance`in e,get:e=>e._reflectionFalloffDistance,set:(e,t)=>{e._reflectionFalloffDistance=t}},metadata:e},yt,bt),u(null,null,wt,{kind:`field`,name:`_reflectionAmount`,static:!1,private:!1,access:{has:e=>`_reflectionAmount`in e,get:e=>e._reflectionAmount,set:(e,t)=>{e._reflectionAmount=t}},metadata:e},Tt,Et),u(null,null,At,{kind:`field`,name:`_reflectionReflectance0`,static:!1,private:!1,access:{has:e=>`_reflectionReflectance0`in e,get:e=>e._reflectionReflectance0,set:(e,t)=>{e._reflectionReflectance0=t}},metadata:e},jt,Mt),u(null,null,It,{kind:`field`,name:`_reflectionReflectance90`,static:!1,private:!1,access:{has:e=>`_reflectionReflectance90`in e,get:e=>e._reflectionReflectance90,set:(e,t)=>{e._reflectionReflectance90=t}},metadata:e},Lt,Rt),u(null,null,Ht,{kind:`field`,name:`_useRGBColor`,static:!1,private:!1,access:{has:e=>`_useRGBColor`in e,get:e=>e._useRGBColor,set:(e,t)=>{e._useRGBColor=t}},metadata:e},Ut,Wt),u(null,null,Jt,{kind:`field`,name:`_enableNoise`,static:!1,private:!1,access:{has:e=>`_enableNoise`in e,get:e=>e._enableNoise,set:(e,t)=>{e._enableNoise=t}},metadata:e},Yt,Xt),u(null,null,en,{kind:`field`,name:`_maxSimultaneousLights`,static:!1,private:!1,access:{has:e=>`_maxSimultaneousLights`in e,get:e=>e._maxSimultaneousLights,set:(e,t)=>{e._maxSimultaneousLights=t}},metadata:e},tn,nn),u(null,null,sn,{kind:`field`,name:`_shadowOnly`,static:!1,private:!1,access:{has:e=>`_shadowOnly`in e,get:e=>e._shadowOnly,set:(e,t)=>{e._shadowOnly=t}},metadata:e},cn,ln),u(null,null,gn,{kind:`field`,name:`projectedGroundRadius`,static:!1,private:!1,access:{has:e=>`projectedGroundRadius`in e,get:e=>e.projectedGroundRadius,set:(e,t)=>{e.projectedGroundRadius=t}},metadata:e},_n,vn),u(null,null,yn,{kind:`field`,name:`projectedGroundHeight`,static:!1,private:!1,access:{has:e=>`projectedGroundHeight`in e,get:e=>e.projectedGroundHeight,set:(e,t)=>{e.projectedGroundHeight=t}},metadata:e},bn,xn),e&&Object.defineProperty(i,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),i.StandardReflectance0=.05,i.StandardReflectance90=.5,i})(),X=class e extends C{get texture(){return this._texture}set texture(e){this._texture!==e&&(this._texture=e,this._useDirectMapping?(this._texture.wrapU=S.CLAMP_ADDRESSMODE,this._texture.wrapV=S.CLAMP_ADDRESSMODE,this._material.diffuseTexture=this._texture):(this._texture.coordinatesMode=S.FIXED_EQUIRECTANGULAR_MIRRORED_MODE,this._texture.wrapV=S.CLAMP_ADDRESSMODE,this._material.reflectionTexture=this._texture),this._changeTextureMode(this._textureMode))}get mesh(){return this._mesh}get fovMultiplier(){return this._material.fovMultiplier}set fovMultiplier(e){this._material.fovMultiplier=e}get textureMode(){return this._textureMode}set textureMode(e){this._textureMode!==e&&this._changeTextureMode(e)}get halfDome(){return this._halfDome}set halfDome(e){this._halfDome=e,this._halfDomeMask.setEnabled(e),this._changeTextureMode(this._textureMode)}set crossEye(e){this._crossEye=e,this._changeTextureMode(this._textureMode)}get crossEye(){return this._crossEye}get material(){return this._material}constructor(t,r,a,o,s=null){super(t,o),this.onError=s,this._halfDome=!1,this._crossEye=!1,this._useDirectMapping=!1,this._textureMode=e.MODE_MONOSCOPIC,this._onBeforeCameraRenderObserver=null,this.onLoadErrorObservable=new i,this.onLoadObservable=new i,o=this.getScene(),t||=`textureDome`,a.resolution=Math.abs(a.resolution)|0||32,a.clickToPlay=!!a.clickToPlay,a.autoPlay=a.autoPlay===void 0||!!a.autoPlay,a.loop=a.loop===void 0||!!a.loop,a.size=Math.abs(a.size)||(o.activeCamera?o.activeCamera.maxZ*.48:1e3),this._useDirectMapping=a.useDirectMapping===void 0||a.useDirectMapping,a.faceForward===void 0&&(a.faceForward=!0),this._setReady(!1),this._mesh=a.mesh?a.mesh:R(t+`_mesh`,{segments:a.resolution,diameter:a.size,updatable:!1,sideOrientation:w.BACKSIDE},o);let c=this._material=new pt(t+`_material`,o);c.useEquirectangularFOV=!0,c.fovMultiplier=1,c.opacityFresnel=!1;let l=this._initTexture(r,o,a);if(this.texture=l,this._mesh.material=c,this._mesh.parent=this,this._halfDomeMask=R(``,{slice:.5,diameter:a.size*.98,segments:a.resolution*2,sideOrientation:w.BACKSIDE},o),this._halfDomeMask.rotate(T.X,-Math.PI/2),this._halfDomeMask.parent=this._mesh,this._halfDome=!!a.halfDomeMode,this._halfDomeMask.setEnabled(this._halfDome),this._crossEye=!!a.crossEyeMode,this._texture.anisotropicFilteringLevel=1,this._texture.onLoadObservable.addOnce(()=>{this._setReady(!0)}),a.faceForward&&o.activeCamera){let e=o.activeCamera,t=n.Forward(),r=n.TransformNormal(t,e.getViewMatrix());r.normalize(),this.rotation.y=Math.acos(n.Dot(t,r))}this._changeTextureMode(this._textureMode)}_changeTextureMode(t){switch(this._scene.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver),this._textureMode=t,this._texture.uScale=1,this._texture.vScale=1,this._texture.uOffset=0,this._texture.vOffset=0,this._texture.vAng=0,t){case e.MODE_MONOSCOPIC:this._halfDome&&(this._texture.uScale=2,this._texture.uOffset=-1);break;case e.MODE_SIDEBYSIDE:{this._texture.uScale=this._halfDome?.99999:.5;let e=this._halfDome?0:.5,t=this._halfDome?-.5:0;this._onBeforeCameraRenderObserver=this._scene.onBeforeCameraRenderObservable.add(n=>{let r=n.isRightCamera;this._crossEye&&(r=!r),r?this._texture.uOffset=e:this._texture.uOffset=t});break}case e.MODE_TOPBOTTOM:this._texture.vScale=this._halfDome?.99999:.5,this._onBeforeCameraRenderObserver=this._scene.onBeforeCameraRenderObservable.add(e=>{let t=e.isRightCamera;this._crossEye&&(t=!t),this._texture.vOffset=t?.5:0})}}dispose(e,t=!1){this._texture.dispose(),this._mesh.dispose(),this._material.dispose(),this._scene.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver),this.onLoadErrorObservable.clear(),this.onLoadObservable.clear(),super.dispose(e,t)}};X.MODE_MONOSCOPIC=0,X.MODE_TOPBOTTOM=1,X.MODE_SIDEBYSIDE=2;var Z=class extends X{get photoTexture(){return this.texture}set photoTexture(e){this.texture=e}get imageMode(){return this.textureMode}set imageMode(e){this.textureMode=e}_initTexture(e,t,n){return new S(e,t,!n.generateMipMaps,!this._useDirectMapping,void 0,()=>{this.onLoadObservable.notifyObservers()},(e,t)=>{this.onLoadErrorObservable.notifyObservers(e||`Unknown error occured`),this.onError&&this.onError(e,t)})}};Z.MODE_MONOSCOPIC=X.MODE_MONOSCOPIC,Z.MODE_TOPBOTTOM=X.MODE_TOPBOTTOM,Z.MODE_SIDEBYSIDE=X.MODE_SIDEBYSIDE;var Q=class{static ConvertPanoramaToCubemap(e,t,n,r,i=!1,a=!0){if(!e)throw`ConvertPanoramaToCubemap: input cannot be null`;let o;if(e.length!=t*n*3){if(e.length!=t*n*4)throw`ConvertPanoramaToCubemap: input size is wrong`;o=4}else o=3;return{front:this.CreateCubemapTexture(r,this.FACE_FRONT,e,t,n,i,a,o),back:this.CreateCubemapTexture(r,this.FACE_BACK,e,t,n,i,a,o),left:this.CreateCubemapTexture(r,this.FACE_LEFT,e,t,n,i,a,o),right:this.CreateCubemapTexture(r,this.FACE_RIGHT,e,t,n,i,a,o),up:this.CreateCubemapTexture(r,this.FACE_UP,e,t,n,i,a,o),down:this.CreateCubemapTexture(r,this.FACE_DOWN,e,t,n,i,a,o),size:r,type:1,format:4,gammaSpace:!1}}static CreateCubemapTexture(e,t,n,r,i,a,o,s){let c=new ArrayBuffer(e*e*4*3),l=new Float32Array(c),u=a?Math.max(1,Math.round(r/4/e)):1,d=1/u,f=d*d,p=t[1].subtract(t[0]).scale(d/e),ee=t[3].subtract(t[2]).scale(d/e),te=1/e,m=0;for(let a=0;a<e;a++)for(let c=0;c<u;c++){let c=t[0],h=t[2];for(let t=0;t<e;t++)for(let d=0;d<u;d++){let u=h.subtract(c).scale(m).add(c);u.normalize();let d=this.CalcProjectionSpherical(u,n,r,i,s,o);l[a*e*3+t*3+0]+=d.r*f,l[a*e*3+t*3+1]+=d.g*f,l[a*e*3+t*3+2]+=d.b*f,c=c.add(p),h=h.add(ee)}m+=te*d}return l}static CalcProjectionSpherical(e,t,n,r,i,a){let o=Math.atan2(e.z,e.x),s=Math.acos(e.y);for(;o<-Math.PI;)o+=2*Math.PI;for(;o>Math.PI;)o-=2*Math.PI;let c=o/Math.PI,l=s/Math.PI;c=c*.5+.5;let u=Math.round(c*n);u<0?u=0:u>=n&&(u=n-1);let d=Math.round(l*r);d<0?d=0:d>=r&&(d=r-1);let f=a?r-d-1:d;return{r:t[f*n*i+u*i+0],g:t[f*n*i+u*i+1],b:t[f*n*i+u*i+2]}}};Q.FACE_LEFT=[new n(-1,-1,-1),new n(1,-1,-1),new n(-1,1,-1),new n(1,1,-1)],Q.FACE_RIGHT=[new n(1,-1,1),new n(-1,-1,1),new n(1,1,1),new n(-1,1,1)],Q.FACE_FRONT=[new n(1,-1,-1),new n(1,-1,1),new n(1,1,-1),new n(1,1,1)],Q.FACE_BACK=[new n(-1,-1,1),new n(-1,-1,-1),new n(-1,1,1),new n(-1,1,-1)],Q.FACE_DOWN=[new n(1,1,-1),new n(1,1,1),new n(-1,1,-1),new n(-1,1,1)],Q.FACE_UP=[new n(-1,-1,-1),new n(-1,-1,1),new n(1,-1,-1),new n(1,-1,1)];var $=class e extends x{constructor(e,t,n,r=!1,i=!0,a=null,o=null,s=!1,c=0){if(super(t),this._onLoad=null,this._onError=null,!e)throw Error(`Image url is not set`);this._coordinatesMode=S.CUBIC_MODE,this.name=e,this.url=e,this._size=n,this._supersample=s,this._noMipmap=r,this.gammaSpace=i,this._onLoad=a,this._onError=o,this._sphericalPolynomialTargetSize=c,this.hasAlpha=!1,this.isCube=!0,this._texture=this._getFromCache(e,this._noMipmap,void 0,void 0,void 0,this.isCube),this._texture?a&&(this._texture.isReady?l.SetImmediate(()=>a()):this._texture.onLoadedObservable.add(a)):t.useDelayedTextureLoading?this.delayLoadState=4:this._loadImage(()=>this._loadTexture(),this._onError)}_loadImage(e,t){let n=this.getScene();if(!n)return;let r=n.getEngine().createRawCubeTexture(null,this._size,4,n.getEngine().getCaps().textureFloat?1:7,!this._noMipmap,!1,3);r.generateMipMaps=!this._noMipmap,n.addPendingData(r),r.url=this.url,r.isReady=!1,n.getEngine()._internalTexturesCache.push(r),this._texture=r,_(this.url,t=>{this._width=t.width,this._height=t.height;let n;c()?(n=document.createElement(`canvas`),n.width=this._width,n.height=this._height):n=new OffscreenCanvas(this._width,this._height);let r=n.getContext(`2d`);r.drawImage(t,0,0);let i=r.getImageData(0,0,t.width,t.height);this._buffer=i.data.buffer,n.remove&&n.remove(),e()},(e,i)=>{n.removePendingData(r),t&&t(`${this.getClassName()} could not be loaded`,i)},n?n.offlineProvider:null)}_loadTexture(){let t=this.getScene(),n=()=>{let t=this._getFloat32ArrayFromArrayBuffer(this._buffer),n=Q.ConvertPanoramaToCubemap(t,this._width,this._height,this._size,this._supersample),r=[];for(let t=0;t<6;t++){let i=n[e._FacesMapping[t]];r.push(i)}return r};if(!t)return;let r=n(),i=this._texture;t.getEngine().updateRawCubeTexture(i,r,i.format,i.type,i.invertY),i.isReady=!0,t.removePendingData(i),i.onLoadedObservable.notifyObservers(i),i.onLoadedObservable.clear(),this._onLoad&&this._onLoad()}_getFloat32ArrayFromArrayBuffer(e){let t=new DataView(e),n=new Float32Array(e.byteLength*3/4),r=0;for(let i=0;i<e.byteLength;i++)(i+1)%4!=0&&(n[r++]=t.getUint8(i)/255);return n}getClassName(){return`EquiRectangularCubeTexture`}clone(){let t=this.getScene();if(!t)return this;let n=new e(this.url,t,this._size,this._noMipmap,this.gammaSpace);return n.level=this.level,n.wrapU=this.wrapU,n.wrapV=this.wrapV,n.coordinatesIndex=this.coordinatesIndex,n.coordinatesMode=this.coordinatesMode,n}delayLoad(){this.delayLoadState===4&&(this._texture=this._getFromCache(this.url,this._noMipmap,void 0,void 0,void 0,this.isCube),this.delayLoadState=1,this._texture||this._loadImage(()=>{this._loadTexture()},this._onError))}};$._FacesMapping=[`right`,`left`,`up`,`down`,`front`,`back`],nt();function mt(e){try{return new URL(e).pathname}catch{return e.split(/[?#]/)[0]??e}}function ht(e){return/\.(hdr|exr)$/i.test(mt(e))}function gt(e){return/\.exr$/i.test(mt(e))}async function _t(){await Promise.all([e(()=>import(`./background.vertex-CX5h_gQT.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),e(()=>import(`./background.fragment-DHyskF3V.js`),__vite__mapDeps([12,1,13,6,7,8,14,15,16,17,9,18,19]),import.meta.url)])}var vt=1,yt=1,bt=128,xt=.9,St=9e3;async function Ct(e,t,n){n===`webgpu`&&await _t();let r=new Z(`panoramaDome`,L(e)?e:``,{size:t.activeCamera?t.activeCamera.maxZ*xt:St,useDirectMapping:!0},t);r.mesh.infiniteDistance=!0,gt(e)?(r.texture.wrapV=vt,r.texture.vScale=-1):ht(e)&&!t.getEngine().getCaps().textureFloatLinearFiltering&&(r.texture.updateSamplingMode(yt),P.warn(`[webverse] panorama: this device cannot smooth a float image, so the high-dynamic-range sky is drawn unsmoothed.`));let i=ht(e),a=t.getEngine().getCaps().textureFloatLinearFiltering,o=!i&&a,s=null,c=e=>{s=new $(e,t,bt),s.metadata={[He]:!0},t.environmentTexture=s};!i&&!a&&P.warn(`[webverse] panorama IBL skipped: this device cannot linearly filter float textures, and the equirect env cube would render black. The sky dome is unaffected; PBR reflections fall back to the neutral environment.`);let l;return L(e)?o&&c(e):Xe(t,e).then(t=>{if(l===``)return URL.revokeObjectURL(t);l=t,r.texture.updateURL(t,void 0,void 0,gt(e)?`.exr`:i?`.hdr`:void 0),o&&c(t)},t=>{r.texture.isBlocking=!1,P.warn(`[webverse] panorama failed to load ${e}: ${t instanceof Error?t.message:String(t)}`)}),{iblApplied:o,setPickableFalse(){let e=[r.mesh,...r.mesh.getChildMeshes(!1)];for(let t of e)t.isPickable=!1},dispose(){l&&URL.revokeObjectURL(l),l=``,s!==null&&t.environmentTexture===s&&(t.environmentTexture=null),s?.dispose(),r.dispose(!1,!0)}}}export{Ct as createPanoramaDome,at as n,lt as t};
//# sourceMappingURL=photoDomeChunk-BM15pUO1.js.map