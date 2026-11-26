const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./background.vertex-CX5h_gQT.js","./shaderStore-D-XQlhUT.js","./bonesVertex-D9u7574l.js","./bakedVertexAnimation-C-a6t_tB.js","./clipPlaneVertex-DKhVm1NW.js","./instancesDeclaration-DsiFqYXH.js","./helperFunctions-BH8P-eyq.js","./sceneUboDeclaration-B96Tfx7b.js","./backgroundUboDeclaration-ClJLip40.js","./logDepthDeclaration-DYYUVTrx.js","./logDepthVertex-DaIBRo0c.js","./shadowsVertex-BWHRiOQY.js","./background.fragment-DHyskF3V.js","./clipPlaneFragment-Ct2VqHzk.js","./reflectionFunction-BvFXGAfy.js","./imageProcessingFunctions-DS1LMf3p.js","./shadowsFragmentFunctions-ytDjjpUn.js","./lightsFragmentFunctions-BM7MW5PY.js","./fogFragment-Dqlv8okl.js","./lightFragment-CHI52C6q.js"])))=>i.map(i=>d[i]);
import{i as e,o as t,s as n}from"./math.vector.pure-fvrN3Uzg.js";import{t as r}from"./observable.pure-BmPG9gPP.js";import{t as i}from"./shaderStore-D-XQlhUT.js";import{t as a}from"./sceneUboDeclaration-B5VhSG0v.js";import{t as o}from"./helperFunctions-BXbvU0Ia.js";import{t as s}from"./logDepthDeclaration-3gXGtHbI.js";import{i as c,n as l,r as u,t as d}from"./shadowsFragmentFunctions-CXgXm7dh.js";import{n as f,t as p}from"./lightFragment-CCmNhay_.js";import{t as ee}from"./logger-CuBYPcDK.js";import{n as m}from"./domManagement-BqltO0ki.js";import{t as h}from"./timingTools-DJ40Zbjg.js";import{b as g,h as te,i as _,n as v,o as ne,p as re,v as y,x as b,y as x}from"./decorators-C_ra_8EP.js";import{t as ie}from"./smartArray-BRfcgNbX.js";import{s as S}from"./fileTools.pure-C6eimILT.js";import{t as ae}from"./decorators.serialization-DKfdsw1x.js";import{t as C}from"./math.color.pure-HuMj10qI.js";import{t as oe}from"./imageProcessingConfiguration.pure-Bsg8B6jZ.js";import{r as w}from"./buffer.pure-B9PujaVE.js";import{C as se,D as ce,M as le,N as ue,O as de,S as fe,a as pe,b as me,c as he,d as ge,f as _e,h as ve,i as ye,j as T,k as be,m as xe,n as Se,o as Ce,r as we,s as Te,v as Ee,w as De,x as Oe,y as ke}from"./material.pure-C04uRV7H.js";import{t as E}from"./preload-helper-HclGiUj8.js";import{t as D}from"./baseTexture.pure-D6W7skrN.js";import{n as O}from"./texture.pure-1CFFpn12.js";import{o as k,t as A}from"./mesh.pure-Cqm_3rXj.js";import{t as j}from"./math.axis-CZ4XGrud.js";import{$t as Ae,An as je,Dn as Me,En as Ne,Jt as Pe,Qt as Fe,Rt as Ie,Tn as Le,Xt as Re,Yt as ze,_n as Be,cn as Ve,dn as He,dt as M,g as N,h as Ue,hn as We,in as Ge,jn as Ke,kn as qe,ln as Je,mn as Ye,nn as Xe,p as Ze,pn as Qe,qt as $e,rn as et,sn as tt,un as nt,vn as rt,vt as P,wn as it,yn as at}from"./index-DCQC-odC.js";import{t as F}from"./backgroundUboDeclaration-i4MsxPq1.js";import{t as I}from"./baseTexture.polynomial.pure-V3UTvfkf.js";var L=`backgroundVertexDeclaration`,R=`uniform mat4 view;uniform mat4 viewProjection;
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
`;i.IncludesShadersStore[L]||(i.IncludesShadersStore[L]=R);var ot={name:L,shader:R},z=`backgroundVertexShader`,B=`precision highp float;
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
`;i.ShadersStore[z]||(i.ShadersStore[z]=B);var st=[ot,a,F,o,Ke,je,qe,Me,Ne,Le,it,s,at,rt,Be,We,Ye,Qe,He];for(let e of st)i.IncludesShadersStore[e.name]||(i.IncludesShadersStore[e.name]=e.shader);var ct={name:z,shader:B},V=`backgroundFragmentDeclaration`,H=`uniform vec4 vEyePosition;uniform vec4 vPrimaryColor;
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
`;i.IncludesShadersStore[V]||(i.IncludesShadersStore[V]=H);var lt={name:V,shader:H},U=`intersectionFunctions`,W=`float diskIntersectWithBackFaceCulling(vec3 ro,vec3 rd,vec3 c,float r) {float d=rd.y;if(d>0.0) { return 1e6; }
vec3 o=ro-c;float t=-o.y/d;vec3 q=o+rd*t;return (dot(q,q)<r*r) ? t : 1e6;}
vec2 sphereIntersect(vec3 ro,vec3 rd,vec3 ce,float ra) {vec3 oc=ro-ce;float b=dot(oc,rd);float c=dot(oc,oc)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}
vec2 sphereIntersectFromOrigin(vec3 ro,vec3 rd,float ra) {float b=dot(ro,rd);float c=dot(ro,ro)-ra*ra;float h=b*b-c;if(h<0.0) { return vec2(-1.0,-1.0); }
h=sqrt(h);return vec2(-b+h,-b-h);}`;i.IncludesShadersStore[U]||(i.IncludesShadersStore[U]=W);var ut={name:U,shader:W},G=`backgroundPixelShader`,K=`#ifdef TEXTURELODSUPPORT
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
`;i.ShadersStore[G]||(i.ShadersStore[G]=K);var dt=[lt,a,F,o,Je,Ve,c,u,l,f,nt,d,tt,s,Ge,et,ut,Xe,p,Ae,Fe];for(let e of dt)i.IncludesShadersStore[e.name]||(i.IncludesShadersStore[e.name]=e.shader);var ft={name:G,shader:K},pt=class extends Re{},mt=class extends ze(pt){constructor(){super(),this.DIFFUSE=!1,this.DIFFUSEDIRECTUV=0,this.GAMMADIFFUSE=!1,this.DIFFUSEHASALPHA=!1,this.OPACITYFRESNEL=!1,this.REFLECTIONBLUR=!1,this.REFLECTIONFRESNEL=!1,this.REFLECTIONFALLOFF=!1,this.TEXTURELODSUPPORT=!1,this.PREMULTIPLYALPHA=!1,this.USERGBCOLOR=!1,this.USEHIGHLIGHTANDSHADOWCOLORS=!1,this.BACKMAT_SHADOWONLY=!1,this.NOISE=!1,this.REFLECTIONBGR=!1,this.PROJECTED_GROUND=!1,this.REFLECTION=!1,this.REFLECTIONMAP_3D=!1,this.REFLECTIONMAP_SPHERICAL=!1,this.REFLECTIONMAP_PLANAR=!1,this.REFLECTIONMAP_CUBIC=!1,this.REFLECTIONMAP_PROJECTION=!1,this.REFLECTIONMAP_SKYBOX=!1,this.REFLECTIONMAP_EXPLICIT=!1,this.REFLECTIONMAP_EQUIRECTANGULAR=!1,this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED=!1,this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED=!1,this.INVERTCUBICMAP=!1,this.REFLECTIONMAP_OPPOSITEZ=!1,this.LODINREFLECTIONALPHA=!1,this.GAMMAREFLECTION=!1,this.RGBDREFLECTION=!1,this.EQUIRECTANGULAR_RELFECTION_FOV=!1,this.MAINUV1=!1,this.MAINUV2=!1,this.UV1=!1,this.UV2=!1,this.CLIPPLANE=!1,this.CLIPPLANE2=!1,this.CLIPPLANE3=!1,this.CLIPPLANE4=!1,this.CLIPPLANE5=!1,this.CLIPPLANE6=!1,this.POINTSIZE=!1,this.FOG=!1,this.NORMAL=!1,this.NUM_BONE_INFLUENCERS=0,this.BonesPerMesh=0,this.INSTANCES=!1,this.SHADOWFLOAT=!1,this.LOGARITHMICDEPTH=!1,this.NONUNIFORMSCALING=!1,this.ALPHATEST=!1,this.rebuild()}},ht=class extends Ie(Pe){},gt=(()=>{var r,i,a,o,s,c,l,u,d,f,p,m,h,S,D,O,k,A,j;let Ae=ht,je,Me=[],Ne=[],Pe,Fe=[],Ie=[],Le,Re=[],ze=[],Be,Ve=[],He=[],M,N=[],Ue=[],We,Ge=[],Ke=[],qe,Je=[],Ye=[],Xe,Ze=[],Qe=[],et,tt=[],nt=[],rt,P=[],it=[],at,F=[],I=[],L,R=[],ot=[],z,B=[],st=[],ct,V=[],H=[],lt,U=[],W=[],ut,G=[],K=[],dt,ft=[],pt=[],gt,q=[],J=[],Y,X=[],Z=[],Q,$=[],_t=[],vt,yt=[],bt=[],xt,St=[],Ct=[],wt,Tt=[],Et=[],Dt,Ot=[],kt=[],At,jt=[],Mt=[],Nt,Pt=[],Ft=[],It,Lt=[],Rt=[],zt,Bt=[],Vt=[],Ht,Ut=[],Wt=[],Gt,Kt=[],qt=[],Jt,Yt=[],Xt=[],Zt,Qt=[],$t=[],en,tn=[],nn=[],rn,an=[],on=[],sn,cn=[],ln=[],un,dn=[],fn=[],pn,mn=[],hn=[],gn,_n=[],vn=[],yn,bn=[],xn=[];return r=class extends Ae{get primaryColor(){return y(this,i,`f`)}set primaryColor(e){x(this,i,e,`f`)}get _perceptualColor(){return this.__perceptualColor}set _perceptualColor(e){this.__perceptualColor=e,this._computePrimaryColorFromPerceptualColor(),this._markAllSubMeshesAsLightsDirty()}get primaryColorShadowLevel(){return this._primaryColorShadowLevel}set primaryColorShadowLevel(e){this._primaryColorShadowLevel=e,this._computePrimaryColors(),this._markAllSubMeshesAsLightsDirty()}get primaryColorHighlightLevel(){return this._primaryColorHighlightLevel}set primaryColorHighlightLevel(e){this._primaryColorHighlightLevel=e,this._computePrimaryColors(),this._markAllSubMeshesAsLightsDirty()}get reflectionTexture(){return y(this,a,`f`)}set reflectionTexture(e){x(this,a,e,`f`)}get reflectionBlur(){return y(this,o,`f`)}set reflectionBlur(e){x(this,o,e,`f`)}get diffuseTexture(){return y(this,s,`f`)}set diffuseTexture(e){x(this,s,e,`f`)}get shadowLights(){return y(this,c,`f`)}set shadowLights(e){x(this,c,e,`f`)}get shadowLevel(){return y(this,l,`f`)}set shadowLevel(e){x(this,l,e,`f`)}get sceneCenter(){return y(this,u,`f`)}set sceneCenter(e){x(this,u,e,`f`)}get opacityFresnel(){return y(this,d,`f`)}set opacityFresnel(e){x(this,d,e,`f`)}get reflectionFresnel(){return y(this,f,`f`)}set reflectionFresnel(e){x(this,f,e,`f`)}get reflectionFalloffDistance(){return y(this,p,`f`)}set reflectionFalloffDistance(e){x(this,p,e,`f`)}get reflectionAmount(){return y(this,m,`f`)}set reflectionAmount(e){x(this,m,e,`f`)}get reflectionReflectance0(){return y(this,h,`f`)}set reflectionReflectance0(e){x(this,h,e,`f`)}get reflectionReflectance90(){return y(this,S,`f`)}set reflectionReflectance90(e){x(this,S,e,`f`)}set reflectionStandardFresnelWeight(e){let t=e;t<.5?(t*=2,this.reflectionReflectance0=r.StandardReflectance0*t,this.reflectionReflectance90=r.StandardReflectance90*t):(t=t*2-1,this.reflectionReflectance0=r.StandardReflectance0+(1-r.StandardReflectance0)*t,this.reflectionReflectance90=r.StandardReflectance90+(1-r.StandardReflectance90)*t)}get useRGBColor(){return y(this,D,`f`)}set useRGBColor(e){x(this,D,e,`f`)}get enableNoise(){return y(this,O,`f`)}set enableNoise(e){x(this,O,e,`f`)}get fovMultiplier(){return this._fovMultiplier}set fovMultiplier(e){isNaN(e)&&(e=1),this._fovMultiplier=Math.max(0,Math.min(2,e))}get maxSimultaneousLights(){return y(this,k,`f`)}set maxSimultaneousLights(e){x(this,k,e,`f`)}get shadowOnly(){return y(this,A,`f`)}set shadowOnly(e){x(this,A,e,`f`)}get enableGroundProjection(){return y(this,j,`f`)}set enableGroundProjection(e){x(this,j,e,`f`)}constructor(e,r,ee=!1){super(e,r,void 0,ee),this._primaryColor=b(this,Me,void 0),i.set(this,(b(this,Ne),b(this,Fe,C.White()))),this.__perceptualColor=(b(this,Ie),b(this,Re,void 0)),this._primaryColorShadowLevel=(b(this,ze),b(this,Ve,0)),this._primaryColorHighlightLevel=(b(this,He),b(this,N,0)),this._reflectionTexture=(b(this,Ue),b(this,Ge,void 0)),a.set(this,(b(this,Ke),b(this,Je,null))),this._reflectionBlur=(b(this,Ye),b(this,Ze,void 0)),o.set(this,(b(this,Qe),b(this,tt,0))),this._diffuseTexture=(b(this,nt),b(this,P,void 0)),s.set(this,(b(this,it),b(this,F,null))),this._shadowLights=(b(this,I),null),c.set(this,b(this,R,null)),this._shadowLevel=(b(this,ot),b(this,B,void 0)),l.set(this,(b(this,st),b(this,V,0))),this._sceneCenter=(b(this,H),b(this,U,void 0)),u.set(this,(b(this,W),b(this,G,t.Zero()))),this._opacityFresnel=(b(this,K),b(this,ft,void 0)),d.set(this,(b(this,pt),b(this,q,!0))),this._reflectionFresnel=(b(this,J),b(this,X,void 0)),f.set(this,(b(this,Z),b(this,$,!1))),this._reflectionFalloffDistance=(b(this,_t),b(this,yt,void 0)),p.set(this,(b(this,bt),b(this,St,0))),this._reflectionAmount=(b(this,Ct),b(this,Tt,void 0)),m.set(this,(b(this,Et),b(this,Ot,1))),this._reflectionReflectance0=(b(this,kt),b(this,jt,void 0)),h.set(this,(b(this,Mt),b(this,Pt,.05))),this._reflectionReflectance90=(b(this,Ft),b(this,Lt,void 0)),S.set(this,(b(this,Rt),b(this,Bt,.5))),this._useRGBColor=(b(this,Vt),b(this,Ut,void 0)),D.set(this,(b(this,Wt),b(this,Kt,!0))),this._enableNoise=(b(this,qt),b(this,Yt,void 0)),O.set(this,(b(this,Xt),b(this,Qt,!1))),this._fovMultiplier=(b(this,$t),1),this.useEquirectangularFOV=!1,this._maxSimultaneousLights=b(this,tn,4),k.set(this,(b(this,nn),b(this,an,4))),this._shadowOnly=(b(this,on),b(this,cn,!1)),A.set(this,(b(this,ln),b(this,dn,!1))),this.switchToBGR=(b(this,fn),!1),this._enableGroundProjection=!1,j.set(this,b(this,mn,!1)),this.projectedGroundRadius=(b(this,hn),b(this,_n,1e3)),this.projectedGroundHeight=(b(this,vn),b(this,bn,10)),this._renderTargets=(b(this,xn),new ie(16)),this._reflectionControls=n.Zero(),this._white=C.White(),this._primaryShadowColor=C.Black(),this._primaryHighlightColor=C.Black(),this._shadersLoaded=!1,this._attachImageProcessingConfiguration(null),this.getRenderTargetTextures=()=>(this._renderTargets.reset(),this._diffuseTexture&&this._diffuseTexture.isRenderTarget&&this._renderTargets.push(this._diffuseTexture),this._reflectionTexture&&this._reflectionTexture.isRenderTarget&&this._renderTargets.push(this._reflectionTexture),this._renderTargets)}get hasRenderTargetTextures(){return!!(this._diffuseTexture&&this._diffuseTexture.isRenderTarget||this._reflectionTexture&&this._reflectionTexture.isRenderTarget)}needAlphaTesting(){return!0}needAlphaBlending(){return this.alpha<1||this._diffuseTexture!=null&&this._diffuseTexture.hasAlpha||this._shadowOnly}isReadyForSubMesh(e,t,n=!1){let r=t._drawWrapper;if(r.effect&&this.isFrozen&&r._wasPreviouslyReady&&r._wasPreviouslyUsingInstances===n)return!0;t.materialDefines||=new mt;let i=this.getScene(),a=t.materialDefines;if(this._isReadyForSubMesh(t))return!0;let o=i.getEngine();if(Oe(i,e,a,!1,this._maxSimultaneousLights),a._needNormals=!0,!Se(i,e,this._maxSimultaneousLights))return!1;if(De(i,a),a._areTexturesDirty){if(a._needUVs=!1,i.texturesEnabled){if(i.getEngine().getCaps().textureLOD&&(a.TEXTURELODSUPPORT=!0),this._diffuseTexture&&T.DiffuseTextureEnabled){if(!this._diffuseTexture.isReadyOrNotBlocking())return!1;fe(this._diffuseTexture,a,`DIFFUSE`),a.DIFFUSEHASALPHA=this._diffuseTexture.hasAlpha,a.GAMMADIFFUSE=this._diffuseTexture.gammaSpace,a.OPACITYFRESNEL=this._opacityFresnel}else a.DIFFUSE=!1,a.DIFFUSEDIRECTUV=0,a.DIFFUSEHASALPHA=!1,a.GAMMADIFFUSE=!1,a.OPACITYFRESNEL=!1;let e=this._reflectionTexture;if(me(i,e,a),e&&T.ReflectionTextureEnabled){if(!e.isReadyOrNotBlocking())return!1;a.EQUIRECTANGULAR_RELFECTION_FOV=this.useEquirectangularFOV,a.REFLECTIONBGR=this.switchToBGR,a.REFLECTIONBLUR=this._reflectionBlur>0,this.reflectionFresnel?(a.REFLECTIONFRESNEL=!0,a.REFLECTIONFALLOFF=this.reflectionFalloffDistance>0,this._reflectionControls.x=this.reflectionAmount,this._reflectionControls.y=this.reflectionReflectance0,this._reflectionControls.z=this.reflectionReflectance90,this._reflectionControls.w=1/this.reflectionFalloffDistance):(a.REFLECTIONFRESNEL=!1,a.REFLECTIONFALLOFF=!1)}else a.REFLECTIONFRESNEL=!1,a.REFLECTIONFALLOFF=!1,a.REFLECTIONBLUR=!1}a.PREMULTIPLYALPHA=this.alphaMode===7||this.alphaMode===8,a.USERGBCOLOR=this._useRGBColor,a.NOISE=this._enableNoise}if(a._areLightsDirty&&(a.USEHIGHLIGHTANDSHADOWCOLORS=!this._useRGBColor&&(this._primaryColorShadowLevel!==0||this._primaryColorHighlightLevel!==0),a.BACKMAT_SHADOWONLY=this._shadowOnly),a._areImageProcessingDirty&&this._imageProcessingConfiguration){if(!this._imageProcessingConfiguration.isReady())return!1;this._imageProcessingConfiguration.prepareDefines(a)}if(a._areMiscDirty&&(a.REFLECTIONMAP_3D&&this._enableGroundProjection?(a.PROJECTED_GROUND=!0,a.REFLECTIONMAP_SKYBOX=!0):a.PROJECTED_GROUND=!1),se(e,i,this._useLogarithmicDepth,this.pointsCloud,this.fogEnabled,this.needAlphaTestingForMesh(e),a,void 0,void 0,void 0,this._isVertexOutputInvariant),ke(i,o,this,a,n,null,t.getRenderingMesh().hasThinInstances),Ee(e,a,!1,!0,!1)&&e&&!i.getEngine().getCaps().standardDerivatives&&!e.isVerticesDataPresent(w.NormalKind)&&(e.createNormals(!0),ee.Warn(`BackgroundMaterial: Normals have been created for the mesh: `+e.name)),a.isDirty){a.markAsProcessed(),i.resetCachedMaterial();let n=new $e;a.FOG&&n.addFallback(0,`FOG`),a.POINTSIZE&&n.addFallback(1,`POINTSIZE`),a.MULTIVIEW&&n.addFallback(0,`MULTIVIEW`),_e(a,n,this._maxSimultaneousLights);let r=[w.PositionKind];a.NORMAL&&r.push(w.NormalKind),a.UV1&&r.push(w.UVKind),a.UV2&&r.push(w.UV2Kind),xe(r,e,a,n),ve(r,a);let s=[`world`,`view`,`viewProjection`,`vEyePosition`,`vLightsType`,`vFogInfos`,`vFogColor`,`pointSize`,`mBones`,`vPrimaryColor`,`vPrimaryColorShadow`,`fFovMultiplier`,`shadowLevel`,`alpha`,`vBackgroundCenter`,`vReflectionControl`,`vDiffuseInfos`,`diffuseMatrix`,`projectedGroundInfos`,`logarithmicDepthConstant`];le(s);let c=[`diffuseSampler`];de(s,c,!1);let l=[`Material`,`Scene`];oe&&(oe.PrepareUniforms(s,a),oe.PrepareSamplers(c,a)),be({uniformsNames:s,uniformBuffersNames:l,samplers:c,defines:a,maxSimultaneousLights:this._maxSimultaneousLights,shaderLanguage:this._shaderLanguage});let u=a.toString(),d=i.getEngine().createEffect(`background`,{attributes:r,uniformsNames:s,uniformBuffersNames:l,samplers:c,defines:u,fallbacks:n,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:this._maxSimultaneousLights},shaderLanguage:this._shaderLanguage,extraInitializationsAsync:this._shadersLoaded?void 0:async()=>{this.shaderLanguage===1?await Promise.all([E(()=>import(`./background.vertex-CX5h_gQT.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),E(()=>import(`./background.fragment-DHyskF3V.js`),__vite__mapDeps([12,1,13,6,7,8,14,15,16,17,9,18,19]),import.meta.url)]):await Promise.all([E(()=>import(`./background.vertex-C4qXYiGP.js`),[],import.meta.url),E(()=>import(`./background.fragment-C2Fk-Dkg.js`),[],import.meta.url)]),this._shadersLoaded=!0}},o);t.setEffect(d,a,this._materialContext),this.buildUniformLayout()}return!t.effect||!t.effect.isReady()?!1:(a._renderId=i.getRenderId(),r._wasPreviouslyReady=!0,r._wasPreviouslyUsingInstances=n,this._checkScenePerformancePriority(),!0)}_computePrimaryColorFromPerceptualColor(){this.__perceptualColor&&(this._primaryColor.copyFrom(this.__perceptualColor),this._primaryColor.toLinearSpaceToRef(this._primaryColor,this.getScene().getEngine().useExactSrgbConversions),this._imageProcessingConfiguration&&this._primaryColor.scaleToRef(1/this._imageProcessingConfiguration.exposure,this._primaryColor),this._computePrimaryColors())}_computePrimaryColors(){(this._primaryColorShadowLevel!==0||this._primaryColorHighlightLevel!==0)&&(this._primaryColor.scaleToRef(this._primaryColorShadowLevel,this._primaryShadowColor),this._primaryColor.subtractToRef(this._primaryShadowColor,this._primaryShadowColor),this._white.subtractToRef(this._primaryColor,this._primaryHighlightColor),this._primaryHighlightColor.scaleToRef(this._primaryColorHighlightLevel,this._primaryHighlightColor),this._primaryColor.addToRef(this._primaryHighlightColor,this._primaryHighlightColor))}buildUniformLayout(){this._uniformBuffer.addUniform(`vPrimaryColor`,4),this._uniformBuffer.addUniform(`vPrimaryColorShadow`,4),this._uniformBuffer.addUniform(`vDiffuseInfos`,2),this._uniformBuffer.addUniform(`diffuseMatrix`,16),this._uniformBuffer.addUniform(`fFovMultiplier`,1),this._uniformBuffer.addUniform(`pointSize`,1),this._uniformBuffer.addUniform(`shadowLevel`,1),this._uniformBuffer.addUniform(`alpha`,1),this._uniformBuffer.addUniform(`vBackgroundCenter`,3),this._uniformBuffer.addUniform(`vReflectionControl`,4),this._uniformBuffer.addUniform(`projectedGroundInfos`,2),ce(this._uniformBuffer,!0,!1,!1),this._uniformBuffer.create()}unbind(){this._diffuseTexture&&this._diffuseTexture.isRenderTarget&&this._uniformBuffer.setTexture(`diffuseSampler`,null),this._reflectionTexture&&this._reflectionTexture.isRenderTarget&&this._uniformBuffer.setTexture(`reflectionSampler`,null),super.unbind()}bindOnlyWorldMatrix(e){this._activeEffect.setMatrix(`world`,e)}bindForSubMesh(t,n,r){let i=this.getScene(),a=r.materialDefines;if(!a)return;let o=r.effect;if(!o)return;this._activeEffect=o,this.bindOnlyWorldMatrix(t),we(n,this._activeEffect);let s=this._mustRebind(i,o,r,n.visibility),c=i.getEngine()._features.needToAlwaysBindUniformBuffers;if(s){this._uniformBuffer.bindToEffect(o,`Material`),this.bindViewProjection(o);let t=this._reflectionTexture;if((!this._uniformBuffer.useUbo||!this.isFrozen||!this._uniformBuffer.isSync||r._drawWrapper._forceRebindOnNextCall)&&(i.texturesEnabled&&(this._diffuseTexture&&T.DiffuseTextureEnabled&&(this._uniformBuffer.updateFloat2(`vDiffuseInfos`,this._diffuseTexture.coordinatesIndex,this._diffuseTexture.level),ge(this._diffuseTexture,this._uniformBuffer,`diffuse`)),pe(i,a,this._uniformBuffer,C.White(),t,!1,!0,!1,!1,!1,!1,this._reflectionBlur)),this.shadowLevel>0&&this._uniformBuffer.updateFloat(`shadowLevel`,this.shadowLevel),this._uniformBuffer.updateFloat(`alpha`,this.alpha),this.pointsCloud&&this._uniformBuffer.updateFloat(`pointSize`,this.pointSize),a.USEHIGHLIGHTANDSHADOWCOLORS?(this._uniformBuffer.updateColor4(`vPrimaryColor`,this._primaryHighlightColor,1),this._uniformBuffer.updateColor4(`vPrimaryColorShadow`,this._primaryShadowColor,1)):this._uniformBuffer.updateColor4(`vPrimaryColor`,this._primaryColor,1)),this._uniformBuffer.updateFloat(`fFovMultiplier`,this._fovMultiplier),a.REFLECTIONFRESNEL&&this._uniformBuffer.updateFloat4(`vReflectionControl`,this._reflectionControls.x,this._reflectionControls.y,this._reflectionControls.z,this._reflectionControls.w),a.REFLECTIONFRESNEL&&a.REFLECTIONFALLOFF||a.OPACITYFRESNEL){let t=e.Vector3[0].copyFrom(this.sceneCenter).subtractInPlace(i.floatingOriginOffset);this._uniformBuffer.updateFloat3(`vBackgroundCenter`,t.x,t.y,t.z)}i.texturesEnabled&&(this._diffuseTexture&&T.DiffuseTextureEnabled&&this._uniformBuffer.setTexture(`diffuseSampler`,this._diffuseTexture),t&&T.ReflectionTextureEnabled&&Ce(i,a,this._uniformBuffer,t),a.PROJECTED_GROUND&&this._uniformBuffer.updateFloat2(`projectedGroundInfos`,this.projectedGroundRadius,this.projectedGroundHeight)),ue(this._activeEffect,this,i),i.bindEyePosition(o)}else c&&(this._uniformBuffer.bindToEffect(o,`Material`),this._needToBindSceneUbo=!0);(s||!this.isFrozen||c)&&i.lightsEnabled&&Te(i,n,this._activeEffect,a,this._maxSimultaneousLights),(s||!this.isFrozen)&&(this.bindView(o),ye(i,n,this._activeEffect,!0),this._useLogarithmicDepth&&he(a,o,i),this._imageProcessingConfiguration&&this._imageProcessingConfiguration.bind(this._activeEffect)),this._afterBind(n,this._activeEffect,r),this._uniformBuffer.update()}hasTexture(e){return!!(super.hasTexture(e)||this._reflectionTexture===e||this._diffuseTexture===e)}dispose(e=!1,t=!1){t&&(this.diffuseTexture&&this.diffuseTexture.dispose(),this.reflectionTexture&&this.reflectionTexture.dispose()),this._renderTargets.dispose(),this._imageProcessingConfiguration&&this._imageProcessingObserver&&this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver),super.dispose(e)}clone(e){return ae.Clone(()=>new r(e,this.getScene()),this)}serialize(){let e=super.serialize();return e.customType=`BABYLON.BackgroundMaterial`,e}getClassName(){return`BackgroundMaterial`}static Parse(e,t,n){return ae.Parse(()=>new r(e.name,t),e,t,n)}},i=new WeakMap,a=new WeakMap,o=new WeakMap,s=new WeakMap,c=new WeakMap,l=new WeakMap,u=new WeakMap,d=new WeakMap,f=new WeakMap,p=new WeakMap,m=new WeakMap,h=new WeakMap,S=new WeakMap,D=new WeakMap,O=new WeakMap,k=new WeakMap,A=new WeakMap,j=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(Ae[Symbol.metadata]??null):void 0;je=[ne()],Pe=[v(`_markAllSubMeshesAsLightsDirty`)],Le=[ne()],Be=[_()],M=[_()],We=[re()],qe=[v(`_markAllSubMeshesAsTexturesDirty`)],Xe=[_()],et=[v(`_markAllSubMeshesAsTexturesDirty`)],rt=[re()],at=[v(`_markAllSubMeshesAsTexturesDirty`)],L=[v(`_markAllSubMeshesAsTexturesDirty`)],z=[_()],ct=[v(`_markAllSubMeshesAsTexturesDirty`)],lt=[te()],ut=[v(`_markAllSubMeshesAsTexturesDirty`)],dt=[_()],gt=[v(`_markAllSubMeshesAsTexturesDirty`)],Y=[_()],Q=[v(`_markAllSubMeshesAsTexturesDirty`)],vt=[_()],xt=[v(`_markAllSubMeshesAsTexturesDirty`)],wt=[_()],Dt=[v(`_markAllSubMeshesAsTexturesDirty`)],At=[_()],Nt=[v(`_markAllSubMeshesAsTexturesDirty`)],It=[_()],zt=[v(`_markAllSubMeshesAsTexturesDirty`)],Ht=[_()],Gt=[v(`_markAllSubMeshesAsTexturesDirty`)],Jt=[_()],Zt=[v(`_markAllSubMeshesAsTexturesDirty`)],en=[_()],rn=[v(`_markAllSubMeshesAsTexturesDirty`)],sn=[_()],un=[v(`_markAllSubMeshesAsLightsDirty`)],pn=[_(),v(`_markAllSubMeshesAsMiscDirty`)],gn=[_()],yn=[_()],g(r,null,Pe,{kind:`accessor`,name:`primaryColor`,static:!1,private:!1,access:{has:e=>`primaryColor`in e,get:e=>e.primaryColor,set:(e,t)=>{e.primaryColor=t}},metadata:e},Fe,Ie),g(r,null,qe,{kind:`accessor`,name:`reflectionTexture`,static:!1,private:!1,access:{has:e=>`reflectionTexture`in e,get:e=>e.reflectionTexture,set:(e,t)=>{e.reflectionTexture=t}},metadata:e},Je,Ye),g(r,null,et,{kind:`accessor`,name:`reflectionBlur`,static:!1,private:!1,access:{has:e=>`reflectionBlur`in e,get:e=>e.reflectionBlur,set:(e,t)=>{e.reflectionBlur=t}},metadata:e},tt,nt),g(r,null,at,{kind:`accessor`,name:`diffuseTexture`,static:!1,private:!1,access:{has:e=>`diffuseTexture`in e,get:e=>e.diffuseTexture,set:(e,t)=>{e.diffuseTexture=t}},metadata:e},F,I),g(r,null,L,{kind:`accessor`,name:`shadowLights`,static:!1,private:!1,access:{has:e=>`shadowLights`in e,get:e=>e.shadowLights,set:(e,t)=>{e.shadowLights=t}},metadata:e},R,ot),g(r,null,ct,{kind:`accessor`,name:`shadowLevel`,static:!1,private:!1,access:{has:e=>`shadowLevel`in e,get:e=>e.shadowLevel,set:(e,t)=>{e.shadowLevel=t}},metadata:e},V,H),g(r,null,ut,{kind:`accessor`,name:`sceneCenter`,static:!1,private:!1,access:{has:e=>`sceneCenter`in e,get:e=>e.sceneCenter,set:(e,t)=>{e.sceneCenter=t}},metadata:e},G,K),g(r,null,gt,{kind:`accessor`,name:`opacityFresnel`,static:!1,private:!1,access:{has:e=>`opacityFresnel`in e,get:e=>e.opacityFresnel,set:(e,t)=>{e.opacityFresnel=t}},metadata:e},q,J),g(r,null,Q,{kind:`accessor`,name:`reflectionFresnel`,static:!1,private:!1,access:{has:e=>`reflectionFresnel`in e,get:e=>e.reflectionFresnel,set:(e,t)=>{e.reflectionFresnel=t}},metadata:e},$,_t),g(r,null,xt,{kind:`accessor`,name:`reflectionFalloffDistance`,static:!1,private:!1,access:{has:e=>`reflectionFalloffDistance`in e,get:e=>e.reflectionFalloffDistance,set:(e,t)=>{e.reflectionFalloffDistance=t}},metadata:e},St,Ct),g(r,null,Dt,{kind:`accessor`,name:`reflectionAmount`,static:!1,private:!1,access:{has:e=>`reflectionAmount`in e,get:e=>e.reflectionAmount,set:(e,t)=>{e.reflectionAmount=t}},metadata:e},Ot,kt),g(r,null,Nt,{kind:`accessor`,name:`reflectionReflectance0`,static:!1,private:!1,access:{has:e=>`reflectionReflectance0`in e,get:e=>e.reflectionReflectance0,set:(e,t)=>{e.reflectionReflectance0=t}},metadata:e},Pt,Ft),g(r,null,zt,{kind:`accessor`,name:`reflectionReflectance90`,static:!1,private:!1,access:{has:e=>`reflectionReflectance90`in e,get:e=>e.reflectionReflectance90,set:(e,t)=>{e.reflectionReflectance90=t}},metadata:e},Bt,Vt),g(r,null,Gt,{kind:`accessor`,name:`useRGBColor`,static:!1,private:!1,access:{has:e=>`useRGBColor`in e,get:e=>e.useRGBColor,set:(e,t)=>{e.useRGBColor=t}},metadata:e},Kt,qt),g(r,null,Zt,{kind:`accessor`,name:`enableNoise`,static:!1,private:!1,access:{has:e=>`enableNoise`in e,get:e=>e.enableNoise,set:(e,t)=>{e.enableNoise=t}},metadata:e},Qt,$t),g(r,null,rn,{kind:`accessor`,name:`maxSimultaneousLights`,static:!1,private:!1,access:{has:e=>`maxSimultaneousLights`in e,get:e=>e.maxSimultaneousLights,set:(e,t)=>{e.maxSimultaneousLights=t}},metadata:e},an,on),g(r,null,un,{kind:`accessor`,name:`shadowOnly`,static:!1,private:!1,access:{has:e=>`shadowOnly`in e,get:e=>e.shadowOnly,set:(e,t)=>{e.shadowOnly=t}},metadata:e},dn,fn),g(r,null,pn,{kind:`accessor`,name:`enableGroundProjection`,static:!1,private:!1,access:{has:e=>`enableGroundProjection`in e,get:e=>e.enableGroundProjection,set:(e,t)=>{e.enableGroundProjection=t}},metadata:e},mn,hn),g(null,null,je,{kind:`field`,name:`_primaryColor`,static:!1,private:!1,access:{has:e=>`_primaryColor`in e,get:e=>e._primaryColor,set:(e,t)=>{e._primaryColor=t}},metadata:e},Me,Ne),g(null,null,Le,{kind:`field`,name:`__perceptualColor`,static:!1,private:!1,access:{has:e=>`__perceptualColor`in e,get:e=>e.__perceptualColor,set:(e,t)=>{e.__perceptualColor=t}},metadata:e},Re,ze),g(null,null,Be,{kind:`field`,name:`_primaryColorShadowLevel`,static:!1,private:!1,access:{has:e=>`_primaryColorShadowLevel`in e,get:e=>e._primaryColorShadowLevel,set:(e,t)=>{e._primaryColorShadowLevel=t}},metadata:e},Ve,He),g(null,null,M,{kind:`field`,name:`_primaryColorHighlightLevel`,static:!1,private:!1,access:{has:e=>`_primaryColorHighlightLevel`in e,get:e=>e._primaryColorHighlightLevel,set:(e,t)=>{e._primaryColorHighlightLevel=t}},metadata:e},N,Ue),g(null,null,We,{kind:`field`,name:`_reflectionTexture`,static:!1,private:!1,access:{has:e=>`_reflectionTexture`in e,get:e=>e._reflectionTexture,set:(e,t)=>{e._reflectionTexture=t}},metadata:e},Ge,Ke),g(null,null,Xe,{kind:`field`,name:`_reflectionBlur`,static:!1,private:!1,access:{has:e=>`_reflectionBlur`in e,get:e=>e._reflectionBlur,set:(e,t)=>{e._reflectionBlur=t}},metadata:e},Ze,Qe),g(null,null,rt,{kind:`field`,name:`_diffuseTexture`,static:!1,private:!1,access:{has:e=>`_diffuseTexture`in e,get:e=>e._diffuseTexture,set:(e,t)=>{e._diffuseTexture=t}},metadata:e},P,it),g(null,null,z,{kind:`field`,name:`_shadowLevel`,static:!1,private:!1,access:{has:e=>`_shadowLevel`in e,get:e=>e._shadowLevel,set:(e,t)=>{e._shadowLevel=t}},metadata:e},B,st),g(null,null,lt,{kind:`field`,name:`_sceneCenter`,static:!1,private:!1,access:{has:e=>`_sceneCenter`in e,get:e=>e._sceneCenter,set:(e,t)=>{e._sceneCenter=t}},metadata:e},U,W),g(null,null,dt,{kind:`field`,name:`_opacityFresnel`,static:!1,private:!1,access:{has:e=>`_opacityFresnel`in e,get:e=>e._opacityFresnel,set:(e,t)=>{e._opacityFresnel=t}},metadata:e},ft,pt),g(null,null,Y,{kind:`field`,name:`_reflectionFresnel`,static:!1,private:!1,access:{has:e=>`_reflectionFresnel`in e,get:e=>e._reflectionFresnel,set:(e,t)=>{e._reflectionFresnel=t}},metadata:e},X,Z),g(null,null,vt,{kind:`field`,name:`_reflectionFalloffDistance`,static:!1,private:!1,access:{has:e=>`_reflectionFalloffDistance`in e,get:e=>e._reflectionFalloffDistance,set:(e,t)=>{e._reflectionFalloffDistance=t}},metadata:e},yt,bt),g(null,null,wt,{kind:`field`,name:`_reflectionAmount`,static:!1,private:!1,access:{has:e=>`_reflectionAmount`in e,get:e=>e._reflectionAmount,set:(e,t)=>{e._reflectionAmount=t}},metadata:e},Tt,Et),g(null,null,At,{kind:`field`,name:`_reflectionReflectance0`,static:!1,private:!1,access:{has:e=>`_reflectionReflectance0`in e,get:e=>e._reflectionReflectance0,set:(e,t)=>{e._reflectionReflectance0=t}},metadata:e},jt,Mt),g(null,null,It,{kind:`field`,name:`_reflectionReflectance90`,static:!1,private:!1,access:{has:e=>`_reflectionReflectance90`in e,get:e=>e._reflectionReflectance90,set:(e,t)=>{e._reflectionReflectance90=t}},metadata:e},Lt,Rt),g(null,null,Ht,{kind:`field`,name:`_useRGBColor`,static:!1,private:!1,access:{has:e=>`_useRGBColor`in e,get:e=>e._useRGBColor,set:(e,t)=>{e._useRGBColor=t}},metadata:e},Ut,Wt),g(null,null,Jt,{kind:`field`,name:`_enableNoise`,static:!1,private:!1,access:{has:e=>`_enableNoise`in e,get:e=>e._enableNoise,set:(e,t)=>{e._enableNoise=t}},metadata:e},Yt,Xt),g(null,null,en,{kind:`field`,name:`_maxSimultaneousLights`,static:!1,private:!1,access:{has:e=>`_maxSimultaneousLights`in e,get:e=>e._maxSimultaneousLights,set:(e,t)=>{e._maxSimultaneousLights=t}},metadata:e},tn,nn),g(null,null,sn,{kind:`field`,name:`_shadowOnly`,static:!1,private:!1,access:{has:e=>`_shadowOnly`in e,get:e=>e._shadowOnly,set:(e,t)=>{e._shadowOnly=t}},metadata:e},cn,ln),g(null,null,gn,{kind:`field`,name:`projectedGroundRadius`,static:!1,private:!1,access:{has:e=>`projectedGroundRadius`in e,get:e=>e.projectedGroundRadius,set:(e,t)=>{e.projectedGroundRadius=t}},metadata:e},_n,vn),g(null,null,yn,{kind:`field`,name:`projectedGroundHeight`,static:!1,private:!1,access:{has:e=>`projectedGroundHeight`in e,get:e=>e.projectedGroundHeight,set:(e,t)=>{e.projectedGroundHeight=t}},metadata:e},bn,xn),e&&Object.defineProperty(r,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),r.StandardReflectance0=.05,r.StandardReflectance90=.5,r})(),q=class e extends k{get texture(){return this._texture}set texture(e){this._texture!==e&&(this._texture=e,this._useDirectMapping?(this._texture.wrapU=O.CLAMP_ADDRESSMODE,this._texture.wrapV=O.CLAMP_ADDRESSMODE,this._material.diffuseTexture=this._texture):(this._texture.coordinatesMode=O.FIXED_EQUIRECTANGULAR_MIRRORED_MODE,this._texture.wrapV=O.CLAMP_ADDRESSMODE,this._material.reflectionTexture=this._texture),this._changeTextureMode(this._textureMode))}get mesh(){return this._mesh}get fovMultiplier(){return this._material.fovMultiplier}set fovMultiplier(e){this._material.fovMultiplier=e}get textureMode(){return this._textureMode}set textureMode(e){this._textureMode!==e&&this._changeTextureMode(e)}get halfDome(){return this._halfDome}set halfDome(e){this._halfDome=e,this._halfDomeMask.setEnabled(e),this._changeTextureMode(this._textureMode)}set crossEye(e){this._crossEye=e,this._changeTextureMode(this._textureMode)}get crossEye(){return this._crossEye}get material(){return this._material}constructor(n,i,a,o,s=null){super(n,o),this.onError=s,this._halfDome=!1,this._crossEye=!1,this._useDirectMapping=!1,this._textureMode=e.MODE_MONOSCOPIC,this._onBeforeCameraRenderObserver=null,this.onLoadErrorObservable=new r,this.onLoadObservable=new r,o=this.getScene(),n||=`textureDome`,a.resolution=Math.abs(a.resolution)|0||32,a.clickToPlay=!!a.clickToPlay,a.autoPlay=a.autoPlay===void 0||!!a.autoPlay,a.loop=a.loop===void 0||!!a.loop,a.size=Math.abs(a.size)||(o.activeCamera?o.activeCamera.maxZ*.48:1e3),this._useDirectMapping=a.useDirectMapping===void 0||a.useDirectMapping,a.faceForward===void 0&&(a.faceForward=!0),this._setReady(!1),this._mesh=a.mesh?a.mesh:M(n+`_mesh`,{segments:a.resolution,diameter:a.size,updatable:!1,sideOrientation:A.BACKSIDE},o);let c=this._material=new gt(n+`_material`,o);c.useEquirectangularFOV=!0,c.fovMultiplier=1,c.opacityFresnel=!1;let l=this._initTexture(i,o,a);if(this.texture=l,this._mesh.material=c,this._mesh.parent=this,this._halfDomeMask=M(``,{slice:.5,diameter:a.size*.98,segments:a.resolution*2,sideOrientation:A.BACKSIDE},o),this._halfDomeMask.rotate(j.X,-Math.PI/2),this._halfDomeMask.parent=this._mesh,this._halfDome=!!a.halfDomeMode,this._halfDomeMask.setEnabled(this._halfDome),this._crossEye=!!a.crossEyeMode,this._texture.anisotropicFilteringLevel=1,this._texture.onLoadObservable.addOnce(()=>{this._setReady(!0)}),a.faceForward&&o.activeCamera){let e=o.activeCamera,n=t.Forward(),r=t.TransformNormal(n,e.getViewMatrix());r.normalize(),this.rotation.y=Math.acos(t.Dot(n,r))}this._changeTextureMode(this._textureMode)}_changeTextureMode(t){switch(this._scene.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver),this._textureMode=t,this._texture.uScale=1,this._texture.vScale=1,this._texture.uOffset=0,this._texture.vOffset=0,this._texture.vAng=0,t){case e.MODE_MONOSCOPIC:this._halfDome&&(this._texture.uScale=2,this._texture.uOffset=-1);break;case e.MODE_SIDEBYSIDE:{this._texture.uScale=this._halfDome?.99999:.5;let e=this._halfDome?0:.5,t=this._halfDome?-.5:0;this._onBeforeCameraRenderObserver=this._scene.onBeforeCameraRenderObservable.add(n=>{let r=n.isRightCamera;this._crossEye&&(r=!r),r?this._texture.uOffset=e:this._texture.uOffset=t});break}case e.MODE_TOPBOTTOM:this._texture.vScale=this._halfDome?.99999:.5,this._onBeforeCameraRenderObserver=this._scene.onBeforeCameraRenderObservable.add(e=>{let t=e.isRightCamera;this._crossEye&&(t=!t),this._texture.vOffset=t?.5:0})}}dispose(e,t=!1){this._texture.dispose(),this._mesh.dispose(),this._material.dispose(),this._scene.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver),this.onLoadErrorObservable.clear(),this.onLoadObservable.clear(),super.dispose(e,t)}};q.MODE_MONOSCOPIC=0,q.MODE_TOPBOTTOM=1,q.MODE_SIDEBYSIDE=2;var J=class extends q{get photoTexture(){return this.texture}set photoTexture(e){this.texture=e}get imageMode(){return this.textureMode}set imageMode(e){this.textureMode=e}_initTexture(e,t,n){return new O(e,t,!n.generateMipMaps,!this._useDirectMapping,void 0,()=>{this.onLoadObservable.notifyObservers()},(e,t)=>{this.onLoadErrorObservable.notifyObservers(e||`Unknown error occured`),this.onError&&this.onError(e,t)})}};J.MODE_MONOSCOPIC=q.MODE_MONOSCOPIC,J.MODE_TOPBOTTOM=q.MODE_TOPBOTTOM,J.MODE_SIDEBYSIDE=q.MODE_SIDEBYSIDE;var Y=class{static ConvertPanoramaToCubemap(e,t,n,r,i=!1,a=!0){if(!e)throw`ConvertPanoramaToCubemap: input cannot be null`;let o;if(e.length!=t*n*3){if(e.length!=t*n*4)throw`ConvertPanoramaToCubemap: input size is wrong`;o=4}else o=3;return{front:this.CreateCubemapTexture(r,this.FACE_FRONT,e,t,n,i,a,o),back:this.CreateCubemapTexture(r,this.FACE_BACK,e,t,n,i,a,o),left:this.CreateCubemapTexture(r,this.FACE_LEFT,e,t,n,i,a,o),right:this.CreateCubemapTexture(r,this.FACE_RIGHT,e,t,n,i,a,o),up:this.CreateCubemapTexture(r,this.FACE_UP,e,t,n,i,a,o),down:this.CreateCubemapTexture(r,this.FACE_DOWN,e,t,n,i,a,o),size:r,type:1,format:4,gammaSpace:!1}}static CreateCubemapTexture(e,t,n,r,i,a,o,s){let c=new ArrayBuffer(e*e*4*3),l=new Float32Array(c),u=a?Math.max(1,Math.round(r/4/e)):1,d=1/u,f=d*d,p=t[1].subtract(t[0]).scale(d/e),ee=t[3].subtract(t[2]).scale(d/e),m=1/e,h=0;for(let a=0;a<e;a++)for(let c=0;c<u;c++){let c=t[0],g=t[2];for(let t=0;t<e;t++)for(let d=0;d<u;d++){let u=g.subtract(c).scale(h).add(c);u.normalize();let d=this.CalcProjectionSpherical(u,n,r,i,s,o);l[a*e*3+t*3+0]+=d.r*f,l[a*e*3+t*3+1]+=d.g*f,l[a*e*3+t*3+2]+=d.b*f,c=c.add(p),g=g.add(ee)}h+=m*d}return l}static CalcProjectionSpherical(e,t,n,r,i,a){let o=Math.atan2(e.z,e.x),s=Math.acos(e.y);for(;o<-Math.PI;)o+=2*Math.PI;for(;o>Math.PI;)o-=2*Math.PI;let c=o/Math.PI,l=s/Math.PI;c=c*.5+.5;let u=Math.round(c*n);u<0?u=0:u>=n&&(u=n-1);let d=Math.round(l*r);d<0?d=0:d>=r&&(d=r-1);let f=a?r-d-1:d;return{r:t[f*n*i+u*i+0],g:t[f*n*i+u*i+1],b:t[f*n*i+u*i+2]}}};Y.FACE_LEFT=[new t(-1,-1,-1),new t(1,-1,-1),new t(-1,1,-1),new t(1,1,-1)],Y.FACE_RIGHT=[new t(1,-1,1),new t(-1,-1,1),new t(1,1,1),new t(-1,1,1)],Y.FACE_FRONT=[new t(1,-1,-1),new t(1,-1,1),new t(1,1,-1),new t(1,1,1)],Y.FACE_BACK=[new t(-1,-1,1),new t(-1,-1,-1),new t(-1,1,1),new t(-1,1,-1)],Y.FACE_DOWN=[new t(1,1,-1),new t(1,1,1),new t(-1,1,-1),new t(-1,1,1)],Y.FACE_UP=[new t(-1,-1,-1),new t(-1,-1,1),new t(1,-1,-1),new t(1,-1,1)];var X=class e extends D{constructor(e,t,n,r=!1,i=!0,a=null,o=null,s=!1,c=0){if(super(t),this._onLoad=null,this._onError=null,!e)throw Error(`Image url is not set`);this._coordinatesMode=O.CUBIC_MODE,this.name=e,this.url=e,this._size=n,this._supersample=s,this._noMipmap=r,this.gammaSpace=i,this._onLoad=a,this._onError=o,this._sphericalPolynomialTargetSize=c,this.hasAlpha=!1,this.isCube=!0,this._texture=this._getFromCache(e,this._noMipmap,void 0,void 0,void 0,this.isCube),this._texture?a&&(this._texture.isReady?h.SetImmediate(()=>a()):this._texture.onLoadedObservable.add(a)):t.useDelayedTextureLoading?this.delayLoadState=4:this._loadImage(()=>this._loadTexture(),this._onError)}_loadImage(e,t){let n=this.getScene();if(!n)return;let r=n.getEngine().createRawCubeTexture(null,this._size,4,n.getEngine().getCaps().textureFloat?1:7,!this._noMipmap,!1,3);r.generateMipMaps=!this._noMipmap,n.addPendingData(r),r.url=this.url,r.isReady=!1,n.getEngine()._internalTexturesCache.push(r),this._texture=r,S(this.url,t=>{this._width=t.width,this._height=t.height;let n;m()?(n=document.createElement(`canvas`),n.width=this._width,n.height=this._height):n=new OffscreenCanvas(this._width,this._height);let r=n.getContext(`2d`);r.drawImage(t,0,0);let i=r.getImageData(0,0,t.width,t.height);this._buffer=i.data.buffer,n.remove&&n.remove(),e()},(e,i)=>{n.removePendingData(r),t&&t(`${this.getClassName()} could not be loaded`,i)},n?n.offlineProvider:null)}_loadTexture(){let t=this.getScene(),n=()=>{let t=this._getFloat32ArrayFromArrayBuffer(this._buffer),n=Y.ConvertPanoramaToCubemap(t,this._width,this._height,this._size,this._supersample),r=[];for(let t=0;t<6;t++){let i=n[e._FacesMapping[t]];r.push(i)}return r};if(!t)return;let r=n(),i=this._texture;t.getEngine().updateRawCubeTexture(i,r,i.format,i.type,i.invertY),i.isReady=!0,t.removePendingData(i),i.onLoadedObservable.notifyObservers(i),i.onLoadedObservable.clear(),this._onLoad&&this._onLoad()}_getFloat32ArrayFromArrayBuffer(e){let t=new DataView(e),n=new Float32Array(e.byteLength*3/4),r=0;for(let i=0;i<e.byteLength;i++)(i+1)%4!=0&&(n[r++]=t.getUint8(i)/255);return n}getClassName(){return`EquiRectangularCubeTexture`}clone(){let t=this.getScene();if(!t)return this;let n=new e(this.url,t,this._size,this._noMipmap,this.gammaSpace);return n.level=this.level,n.wrapU=this.wrapU,n.wrapV=this.wrapV,n.coordinatesIndex=this.coordinatesIndex,n.coordinatesMode=this.coordinatesMode,n}delayLoad(){this.delayLoadState===4&&(this._texture=this._getFromCache(this.url,this._noMipmap,void 0,void 0,void 0,this.isCube),this.delayLoadState=1,this._texture||this._loadImage(()=>{this._loadTexture()},this._onError))}};X._FacesMapping=[`right`,`left`,`up`,`down`,`front`,`back`],I();function Z(e){try{return new URL(e).pathname}catch{return e.split(/[?#]/)[0]??e}}function Q(e){return/\.(hdr|exr)$/i.test(Z(e))}function $(e){return/\.exr$/i.test(Z(e))}async function _t(){await Promise.all([E(()=>import(`./background.vertex-CX5h_gQT.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),E(()=>import(`./background.fragment-DHyskF3V.js`),__vite__mapDeps([12,1,13,6,7,8,14,15,16,17,9,18,19]),import.meta.url)])}var vt=1,yt=1,bt=128,xt=.9,St=9e3;async function Ct(e,t,n){n===`webgpu`&&await _t();let r=new J(`panoramaDome`,N(e)?e:``,{size:t.activeCamera?t.activeCamera.maxZ*xt:St,useDirectMapping:!0},t);r.mesh.infiniteDistance=!0,$(e)?(r.texture.wrapV=vt,r.texture.vScale=-1):Q(e)&&!t.getEngine().getCaps().textureFloatLinearFiltering&&(r.texture.updateSamplingMode(yt),P.warn(`[webverse] panorama: this device cannot smooth a float image, so the high-dynamic-range sky is drawn unsmoothed.`));let i=Q(e),a=t.getEngine().getCaps().textureFloatLinearFiltering,o=!i&&a,s=null,c=e=>{s=new X(e,t,bt),s.metadata={[Ze]:!0},t.environmentTexture=s};!i&&!a&&P.warn(`[webverse] panorama IBL skipped: this device cannot linearly filter float textures, and the equirect env cube would render black. The sky dome is unaffected; PBR reflections fall back to the neutral environment.`);let l;return N(e)?o&&c(e):Ue(t,e).then(t=>{if(l===``)return URL.revokeObjectURL(t);l=t,r.texture.updateURL(t,void 0,void 0,$(e)?`.exr`:i?`.hdr`:void 0),o&&c(t)},t=>{r.texture.isBlocking=!1,P.warn(`[webverse] panorama failed to load ${e}: ${t instanceof Error?t.message:String(t)}`)}),{iblApplied:o,setPickableFalse(){let e=[r.mesh,...r.mesh.getChildMeshes(!1)];for(let t of e)t.isPickable=!1},dispose(){l&&URL.revokeObjectURL(l),l=``,s!==null&&t.environmentTexture===s&&(t.environmentTexture=null),s?.dispose(),r.dispose(!1,!0)}}}export{Ct as createPanoramaDome,ct as n,ft as t};
//# sourceMappingURL=photoDomeChunk-5sYTRc8G.js.map