"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type RefObject,
} from "react";
import * as THREE from "three";
import { useActiveTech } from "@/context/ActiveTechContext";
import { useTheme } from "@/context/ThemeContext";
import { PARTICLE_SCENE_LIMITS } from "@/data/particleSceneConfig";
import { resolveParticleScene, themedAccent } from "@/data/particleScenes";
import { TECH_STACK, type Tech } from "@/data/techStack";
import {
  PARTICLE_IDENTIFIABLE_PROGRESS,
  createParticleSequenceState,
  nextParticleSequenceIndex,
  reduceParticleSequence,
  type ParticleSequenceEvent,
  type ParticleSequenceState,
  type ParticleSequenceTarget,
} from "@/lib/particleSequence";
import { sampleIcon, sampleText, type IconPoint } from "@/lib/sampleIcon";
import type { ParticleSceneDefinition } from "@/types/site";

const LOGO_COUNT = { desktop: 16000, tablet: 8200, mobile: 2600 } as const;
type PointerState = { x: number; y: number; active: boolean; pressed: boolean };
type Environment = {
  mode: "webgl" | "fallback";
  isMobile: boolean;
  isTablet: boolean;
};
type LogoPhase = "assemble" | "hold" | "dissolve";

interface LogoGeometryData {
  cloud: Float32Array;
  logo: Float32Array;
  seed: Float32Array;
  size: Float32Array;
}

const sampledTechCache = new Map<string, Promise<IconPoint[]>>();
const logoGeometryCache = new Map<string, Promise<LogoGeometryData>>();

function seededValue(index: number, salt: number): number {
  const raw = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function sampleTech(tech: Tech): Promise<IconPoint[]> {
  const cached = sampledTechCache.get(tech.name);
  if (cached) return cached;
  const request = tech.Icon
    ? sampleIcon(tech.Icon, { resolution: 220, max: 5200, fit: true })
    : Promise.resolve(sampleText(tech.fallback ?? tech.name, { resolution: 220, max: 5200, fit: true }));
  sampledTechCache.set(tech.name, request);
  void request.catch(() => {
    if (sampledTechCache.get(tech.name) === request) sampledTechCache.delete(tech.name);
  });
  return request;
}

async function buildLogoGeometry(tech: Tech, count: number): Promise<LogoGeometryData> {
  const cacheKey = `${tech.name}:${count}`;
  const cached = logoGeometryCache.get(cacheKey);
  if (cached) return cached;

  const request = sampleTech(tech)
    .then((points) => {
      if (points.length === 0) {
        sampledTechCache.delete(tech.name);
        throw new Error(`Particle sampling failed for ${tech.name}`);
      }

      const cloud = new Float32Array(count * 3);
      const logo = new Float32Array(count * 2);
      const seed = new Float32Array(count);
      const size = new Float32Array(count);

      for (let index = 0; index < count; index++) {
        const point = points[Math.min(points.length - 1, Math.floor((index * points.length) / count))];
        const radius = Math.sqrt(seededValue(index, 2));
        const angle = seededValue(index, 3) * Math.PI * 2;
        cloud[index * 3] = Math.cos(angle) * radius;
        cloud[index * 3 + 1] = Math.sin(angle) * radius;
        cloud[index * 3 + 2] = seededValue(index, 4);
        logo[index * 2] = point.x + (seededValue(index, 5) - 0.5) * 0.004;
        logo[index * 2 + 1] = point.y + (seededValue(index, 6) - 0.5) * 0.004;
        seed[index] = seededValue(index, 7);
        size[index] = 1.15 + seededValue(index, 8) * 1.65;
      }
      return { cloud, logo, seed, size };
    })
    .catch((error: unknown) => {
      if (logoGeometryCache.get(cacheKey) === request) logoGeometryCache.delete(cacheKey);
      throw error;
    });

  logoGeometryCache.set(cacheKey, request);
  return request;
}

const SIMPLEX_NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
`;

const LOGO_VERTEX = /* glsl */ `
attribute vec2 aLogo;
attribute float aSeed;
attribute float aSize;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uPressed;
uniform float uFormation;
uniform float uOpacity;
uniform float uAspect;
uniform float uPixelRatio;
uniform vec2 uCenter;
uniform float uScale;
varying float vAlpha;
${SIMPLEX_NOISE}
void main(){
  float phase=aSeed*6.2831853;
  vec2 cloud=uCenter+vec2(position.x/uAspect,position.y)*0.72;
  cloud+=vec2(sin(uTime*0.12+phase),cos(uTime*0.1+phase*1.4))*0.035;
  vec2 target=uCenter+vec2(aLogo.x/uAspect,aLogo.y)*uScale;
  vec2 grain=vec2(
    snoise(vec2(target.x*3.0+uTime*0.18,phase)),
    snoise(vec2(target.y*3.0-uTime*0.16,phase+2.4))
  )*0.008;
  float formed=smoothstep(0.0,1.0,uFormation);
  vec2 pos=mix(cloud,target+grain,formed);

  vec2 delta=pos-uMouse;
  float corrected=length(vec2(delta.x*uAspect,delta.y));
  float influence=(1.0-smoothstep(0.0,0.32,corrected))*uMouseActive;
  vec2 direction=normalize(delta+vec2(0.0001));
  vec2 tangent=vec2(-direction.y,direction.x);
  float pull=mix(1.0,-0.72,uPressed);
  pos+=direction*influence*0.075*pull+tangent*influence*0.026;

  float depthFade=mix(0.35,1.0,position.z);
  vAlpha=(mix(0.055,0.62,formed)+influence*0.24)*uOpacity*depthFade;
  gl_PointSize=aSize*(0.7+formed*0.85+influence)*uPixelRatio;
  gl_Position=vec4(pos,0.0,1.0);
}
`;

const AMBIENT_VERTEX = /* glsl */ `
attribute float aDepth;
attribute float aSize;
attribute float aMix;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uPixelRatio;
uniform float uPointScale;
varying float vAlpha;
varying float vMix;
void main(){
  float phase=aDepth*6.2831853+position.x*2.1;
  vec2 drift=vec2(sin(uTime*(0.025+aDepth*0.03)+phase),cos(uTime*(0.02+aDepth*0.026)+phase*1.3));
  vec2 pos=position.xy+drift*(0.008+aDepth*0.018);
  pos+=uMouse*(0.006+aDepth*0.018)*uMouseActive;
  vAlpha=(0.15+aDepth*0.38);
  vMix=aMix;
  gl_PointSize=aSize*uPointScale*(0.65+aDepth)*uPixelRatio;
  gl_Position=vec4(pos,0.45-aDepth*0.25,1.0);
}
`;

const AMBIENT_FRAGMENT = /* glsl */ `
precision mediump float;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vAlpha;
varying float vMix;
void main(){
  float distanceToCenter=length(gl_PointCoord-vec2(0.5));
  if(distanceToCenter>0.5) discard;
  float soft=smoothstep(0.5,0.02,distanceToCenter);
  vec3 color=mix(uBase,uAccent,vMix);
  gl_FragColor=vec4(color,soft*vAlpha*uOpacity);
}
`;

const PARTICLE_FRAGMENT = /* glsl */ `
precision mediump float;
uniform vec3 uBase;
varying float vAlpha;
void main(){
  float distanceToCenter=length(gl_PointCoord-vec2(0.5));
  if(distanceToCenter>0.5) discard;
  float soft=smoothstep(0.5,0.04,distanceToCenter);
  gl_FragColor=vec4(uBase,soft*vAlpha);
}
`;

const LINE_VERTEX = /* glsl */ `
attribute float aDepth;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
varying float vAlpha;
void main(){
  vec2 pos=position.xy;
  pos+=vec2(sin(uTime*0.035+aDepth*5.0),cos(uTime*0.03+aDepth*4.0))*0.008;
  pos+=uMouse*(0.008+aDepth*0.012)*uMouseActive;
  vAlpha=0.06+aDepth*0.08;
  gl_Position=vec4(pos,0.3,1.0);
}
`;

const LINE_FRAGMENT = /* glsl */ `
precision mediump float;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vAlpha;
void main(){gl_FragColor=vec4(uAccent,vAlpha*uOpacity);}
`;

function anchorForViewport(isMobile: boolean, isTablet: boolean): { center: [number, number]; scale: number } {
  if (isMobile) return { center: [0, -0.55], scale: 0.62 };
  if (isTablet) return { center: [0.42, -0.06], scale: 0.9 };
  return { center: [0.56, -0.02], scale: 1.18 };
}

/* Física del campo por tema. En Deep Space las partículas son LUZ: marfil con
   blending aditivo (los solapes suman brillo). En Master Print son TINTA:
   grafito con blending normal — lo aditivo se lava hasta desaparecer sobre
   papel, y la tinta necesita un poco más de densidad para la misma presencia. */
const PARTICLE_PHYSICS: Record<"dark" | "light", { base: string; blending: THREE.Blending; opacityBoost: number }> = {
  dark: { base: "#F3F0E8", blending: THREE.AdditiveBlending, opacityBoost: 1 },
  light: { base: "#1F2429", blending: THREE.NormalBlending, opacityBoost: 1.25 },
};

function LogoFormation({
  data,
  pointer,
  phase,
  opacity,
  environment,
  physics,
}: {
  data: LogoGeometryData;
  pointer: RefObject<PointerState>;
  phase: LogoPhase;
  opacity: number;
  environment: Environment;
  physics: (typeof PARTICLE_PHYSICS)["dark"];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(data.cloud, 3));
    next.setAttribute("aLogo", new THREE.BufferAttribute(data.logo, 2));
    next.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
    next.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    next.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return next;
  }, [data]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const anchor = useMemo(
    () => anchorForViewport(environment.isMobile, environment.isTablet),
    [environment.isMobile, environment.isTablet],
  );
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uMouseActive: { value: 0 },
    uPressed: { value: 0 },
    uFormation: { value: 0 },
    uOpacity: { value: 0 },
    uAspect: { value: 1.6 },
    uPixelRatio: { value: 1.5 },
    uCenter: { value: new THREE.Vector2(...anchor.center) },
    uScale: { value: anchor.scale },
    uBase: { value: new THREE.Color(physics.base) },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uBase se sincroniza en useFrame
  }), [anchor.center, anchor.scale]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const currentPointer = pointer.current;
    if (!material || !currentPointer) return;
    const values = material.uniforms;
    const targetFormation = phase === "dissolve" ? 0 : 1;
    values.uTime.value += delta;
    values.uAspect.value = state.size.height > 0 ? state.size.width / state.size.height : 1.6;
    values.uPixelRatio.value = state.gl.getPixelRatio();
    values.uMouse.value.set(currentPointer.x, currentPointer.y);
    values.uMouseActive.value += ((currentPointer.active ? 1 : 0) - values.uMouseActive.value) * Math.min(1, delta * 6);
    values.uPressed.value += ((currentPointer.pressed ? 1 : 0) - values.uPressed.value) * Math.min(1, delta * 8);
    values.uFormation.value += (targetFormation - values.uFormation.value) * Math.min(1, delta * (targetFormation ? 4.2 : 5.2));
    values.uOpacity.value += (opacity - values.uOpacity.value) * Math.min(1, delta * 5);
    values.uBase.value.set(physics.base);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={LOGO_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={physics.blending}
      />
    </points>
  );
}

function AmbientPoints({
  pointer,
  accent,
  count,
  opacity,
  pointScale,
  salt,
  physics,
}: {
  pointer: RefObject<PointerState>;
  accent: string;
  count: number;
  opacity: number;
  pointScale: number;
  salt: number;
  physics: (typeof PARTICLE_PHYSICS)["dark"];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const depths = new Float32Array(count);
    const sizes = new Float32Array(count);
    const mixes = new Float32Array(count);
    for (let index = 0; index < count; index++) {
      positions[index * 3] = seededValue(index, salt) * 2.3 - 1.15;
      positions[index * 3 + 1] = seededValue(index, salt + 1) * 2.25 - 1.1;
      depths[index] = seededValue(index, salt + 2);
      sizes[index] = 0.65 + seededValue(index, salt + 3) * 1.8;
      mixes[index] = seededValue(index, salt + 4) > 0.72 ? 0.75 : 0.04;
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    next.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));
    next.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    next.setAttribute("aMix", new THREE.BufferAttribute(mixes, 1));
    next.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return next;
  }, [count, salt]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uMouseActive: { value: 0 },
    uPixelRatio: { value: 1.5 },
    uPointScale: { value: pointScale },
    uAccent: { value: new THREE.Color(accent) },
    uBase: { value: new THREE.Color(physics.base) },
    uOpacity: { value: opacity },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uBase se sincroniza en useFrame
  }), [accent, opacity, pointScale]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const currentPointer = pointer.current;
    if (!material || !currentPointer) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    material.uniforms.uMouse.value.set(currentPointer.x, currentPointer.y);
    material.uniforms.uMouseActive.value += ((currentPointer.active ? 1 : 0) - material.uniforms.uMouseActive.value) * Math.min(1, delta * 2.5);
    material.uniforms.uAccent.value.set(accent);
    material.uniforms.uBase.value.set(physics.base);
    material.uniforms.uOpacity.value = opacity;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={AMBIENT_VERTEX}
        fragmentShader={AMBIENT_FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={physics.blending}
      />
    </points>
  );
}

function ConstellationLines({
  pointer,
  accent,
  isMobile,
  opacity,
  physics,
}: {
  pointer: RefObject<PointerState>;
  accent: string;
  isMobile: boolean;
  opacity: number;
  physics: (typeof PARTICLE_PHYSICS)["dark"];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const nodeCount = isMobile ? 34 : 74;
    const nodes = Array.from({ length: nodeCount }, (_, index) => ({
      x: seededValue(index, 31) * 2.1 - 1.05,
      y: seededValue(index, 32) * 2.05 - 1.025,
      depth: seededValue(index, 33),
    }));
    const segments: number[] = [];
    const depths: number[] = [];
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        if (dx * dx + dy * dy < 0.055 && segments.length < (isMobile ? 180 : 520)) {
          segments.push(nodes[a].x, nodes[a].y, 0, nodes[b].x, nodes[b].y, 0);
          depths.push(nodes[a].depth, nodes[b].depth);
        }
      }
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segments), 3));
    next.setAttribute("aDepth", new THREE.BufferAttribute(new Float32Array(depths), 1));
    next.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return next;
  }, [isMobile]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uMouseActive: { value: 0 },
    uAccent: { value: new THREE.Color(accent) },
    uOpacity: { value: opacity },
  }), [accent, opacity]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    const currentPointer = pointer.current;
    if (!material || !currentPointer) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uMouse.value.set(currentPointer.x, currentPointer.y);
    material.uniforms.uMouseActive.value += ((currentPointer.active ? 1 : 0) - material.uniforms.uMouseActive.value) * Math.min(1, delta * 2.5);
    material.uniforms.uAccent.value.set(accent);
    material.uniforms.uOpacity.value = opacity;
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={LINE_VERTEX}
        fragmentShader={LINE_FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={physics.blending}
      />
    </lineSegments>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function StaticTechnologyMark({ scene, tech }: { scene: ParticleSceneDefinition; tech?: Tech }) {
  const { setActiveTechName } = useActiveTech();
  useEffect(() => {
    setActiveTechName(scene.mode === "ambient" ? null : tech?.name ?? null);
    return () => setActiveTechName(null);
  }, [scene.mode, setActiveTechName, tech?.name]);

  if (scene.mode === "ambient" || !tech) return null;
  const Icon = tech.Icon;
  const mist = (pct: number) => `color-mix(in srgb, var(--color-background) ${pct}%, transparent)`;
  return (
    <div className="absolute inset-0 opacity-45">
      <div className="absolute bottom-[10vh] left-1/2 grid h-[30vh] w-[84vw] -translate-x-1/2 place-items-center text-foreground sm:bottom-auto sm:left-auto sm:right-[5vw] sm:top-[17vh] sm:h-[62vh] sm:w-[40vw] sm:translate-x-0">
        {Icon ? <Icon className="h-full max-h-[54vh] w-full max-w-[35vw]" /> : <span className="font-heading text-[clamp(5rem,18vw,15rem)] font-black tracking-[-.1em]">{tech.fallback}</span>}
      </div>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 76% 28%, transparent 0%, ${mist(20)} 42%, var(--color-background) 88%)` }}
      />
    </div>
  );
}

type LogoSequenceTarget = ParticleSequenceTarget<LogoGeometryData>;

function waitForTick(milliseconds: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }

    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve(true);
    }, milliseconds);
    const onAbort = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function waitForActiveDuration(
  milliseconds: number,
  isActive: () => boolean,
  signal: AbortSignal,
): Promise<boolean> {
  let remaining = Math.max(0, milliseconds);
  while (remaining > 0 && !signal.aborted) {
    const step = Math.min(64, remaining);
    const startedAt = performance.now();
    if (!(await waitForTick(step, signal))) return false;
    const elapsed = Math.min(performance.now() - startedAt, step * 2);
    if (isActive()) remaining -= elapsed;
  }
  return !signal.aborted;
}

function ParticleCanvas({
  scene,
  techs,
  environment,
  pointer,
  pageVisible,
  heroVisible,
  setActiveTechName,
}: {
  scene: ParticleSceneDefinition;
  techs: Tech[];
  environment: Environment;
  pointer: RefObject<PointerState>;
  pageVisible: boolean;
  heroVisible: boolean;
  setActiveTechName: (name: string | null) => void;
}) {
  const [controller, reactDispatch] = useReducer(
    reduceParticleSequence<LogoGeometryData>,
    createParticleSequenceState<LogoGeometryData>(),
  );
  const controllerRef = useRef<ParticleSequenceState<LogoGeometryData>>(controller);
  const pageVisibleRef = useRef(pageVisible);
  const heroVisibleRef = useRef(heroVisible);

  useEffect(() => {
    controllerRef.current = controller;
  }, [controller]);
  useEffect(() => {
    pageVisibleRef.current = pageVisible;
  }, [pageVisible]);
  useEffect(() => {
    heroVisibleRef.current = heroVisible;
  }, [heroVisible]);

  const applySequenceEvent = useCallback((event: ParticleSequenceEvent<LogoGeometryData>) => {
    controllerRef.current = reduceParticleSequence(controllerRef.current, event);
    reactDispatch(event);
  }, []);

  const baseCount = environment.isMobile
    ? LOGO_COUNT.mobile
    : environment.isTablet
      ? LOGO_COUNT.tablet
      : LOGO_COUNT.desktop;
  const geometryCount = Math.round(baseCount * scene.density);
  const techSignature = techs.map((tech) => tech.name).join("|");

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const isActive = () => pageVisibleRef.current && heroVisibleRef.current;

    const loadTarget = async (tech: Tech, index: number): Promise<LogoSequenceTarget> => ({
      name: tech.name,
      index,
      cacheKey: `${tech.name}:${geometryCount}`,
      payload: await buildLogoGeometry(tech, geometryCount),
    });

    const assembleCurrent = async (): Promise<boolean> => {
      const confirmationMs = scene.timing.assembleMs * PARTICLE_IDENTIFIABLE_PROGRESS;
      if (!(await waitForActiveDuration(confirmationMs, isActive, signal))) return false;
      applySequenceEvent({ type: "confirm" });
      setActiveTechName(controllerRef.current.confirmedName);
      if (!(await waitForActiveDuration(scene.timing.assembleMs - confirmationMs, isActive, signal))) return false;
      applySequenceEvent({ type: "hold" });
      return true;
    };

    const run = async () => {
      applySequenceEvent({ type: "discard-incoming" });

      if (scene.mode === "ambient" || techs.length === 0) {
        setActiveTechName(null);
        if (controllerRef.current.current) {
          applySequenceEvent({ type: "begin-dissolve" });
          if (!(await waitForActiveDuration(scene.timing.dissolveMs, isActive, signal))) return;
        }
        if (!signal.aborted) applySequenceEvent({ type: "clear" });
        return;
      }

      let currentIndex = 0;
      let needsAssembly = false;
      const firstTech = techs[0];
      const firstCacheKey = `${firstTech.name}:${geometryCount}`;
      const existing = controllerRef.current.current;

      if (existing?.cacheKey !== firstCacheKey) {
        if (existing) applySequenceEvent({ type: "retain-current" });

        let firstTarget: LogoSequenceTarget;
        try {
          firstTarget = await loadTarget(firstTech, 0);
        } catch {
          if (!signal.aborted) applySequenceEvent({ type: "retain-current" });
          return;
        }
        if (signal.aborted) return;

        if (controllerRef.current.current) {
          applySequenceEvent({ type: "queue", target: firstTarget });
          applySequenceEvent({ type: "begin-dissolve" });
          if (!(await waitForActiveDuration(scene.timing.dissolveMs, isActive, signal))) return;
          applySequenceEvent({ type: "promote" });
        } else {
          applySequenceEvent({ type: "mount", target: firstTarget });
        }
        needsAssembly = true;
      } else if (existing) {
        const alignedTarget = { ...existing, index: 0 };
        applySequenceEvent({ type: "align-current", target: alignedTarget });
        currentIndex = 0;
        if (controllerRef.current.confirmedName !== existing.name) {
          applySequenceEvent({ type: "mount", target: alignedTarget });
          needsAssembly = true;
        } else {
          applySequenceEvent({ type: "hold" });
          setActiveTechName(existing.name);
        }
      }

      if (needsAssembly && !(await assembleCurrent())) return;
      currentIndex = controllerRef.current.current?.index ?? currentIndex;

      if (scene.mode === "locked" || techs.length < 2) return;

      while (!signal.aborted) {
        const nextIndex = nextParticleSequenceIndex(currentIndex, techs.length);
        const pendingTarget = loadTarget(techs[nextIndex], nextIndex)
          .then((target) => ({ target, failed: false as const }))
          .catch(() => ({ target: null, failed: true as const }));

        if (!(await waitForActiveDuration(scene.timing.holdMs, isActive, signal))) return;
        const result = await pendingTarget;
        if (signal.aborted) return;
        if (result.failed || !result.target) {
          applySequenceEvent({ type: "retain-current" });
          continue;
        }

        applySequenceEvent({ type: "queue", target: result.target });
        applySequenceEvent({ type: "begin-dissolve" });
        if (!(await waitForActiveDuration(scene.timing.dissolveMs, isActive, signal))) return;
        applySequenceEvent({ type: "promote" });
        currentIndex = nextIndex;
        if (!(await assembleCurrent())) return;
      }
    };

    void run();
    return () => abortController.abort();
  }, [
    applySequenceEvent,
    geometryCount,
    scene.mode,
    scene.timing.assembleMs,
    scene.timing.dissolveMs,
    scene.timing.holdMs,
    setActiveTechName,
    techSignature,
    techs,
  ]);

  useEffect(() => () => setActiveTechName(null), [setActiveTechName]);

  const { theme } = useTheme();
  const physics = PARTICLE_PHYSICS[theme];
  const accent = themedAccent(scene.accent, theme);
  const ambientOpacity = (scene.mode === "ambient" ? 0.32 : 0.46) * physics.opacityBoost;
  const logoPhase: LogoPhase = controller.phase === "dissolve"
    ? "dissolve"
    : controller.phase === "hold"
      ? "hold"
      : "assemble";
  const loadedTargetCount = Number(Boolean(controller.current)) + Number(Boolean(controller.incoming));
  return (
    <Canvas
      aria-hidden
      data-particle-canvas="global"
      data-particle-current={controller.current?.name ?? ""}
      data-particle-incoming={controller.incoming?.name ?? ""}
      data-particle-confirmed={controller.confirmedName ?? ""}
      data-particle-phase={controller.phase}
      data-particle-target-count={loadedTargetCount}
      dpr={[1, environment.isMobile ? 1.2 : 1.5]}
      frameloop={pageVisible ? "always" : "never"}
      gl={{ alpha: true, antialias: false, depth: false, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <AmbientPoints pointer={pointer} accent={accent} count={environment.isMobile ? 90 : 220} opacity={ambientOpacity * 0.55} pointScale={0.7} salt={41} physics={physics} />
      <ConstellationLines pointer={pointer} accent={accent} isMobile={environment.isMobile} opacity={ambientOpacity} physics={physics} />
      <AmbientPoints pointer={pointer} accent={accent} count={environment.isMobile ? 70 : 150} opacity={ambientOpacity} pointScale={1.45} salt={61} physics={physics} />
      {controller.current && (
        <LogoFormation
          data={controller.current.payload}
          pointer={pointer}
          phase={heroVisible ? logoPhase : "dissolve"}
          opacity={heroVisible ? scene.intensity * physics.opacityBoost : 0}
          environment={environment}
          physics={physics}
        />
      )}
    </Canvas>
  );
}

export function TechParticleField() {
  const pathname = usePathname();
  const { activeFamilies, heroVisible, setActiveTechName } = useActiveTech();
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const pointer = useRef<PointerState>({ x: -10, y: -10, active: false, pressed: false });
  const scene = useMemo(() => resolveParticleScene(pathname, activeFamilies), [activeFamilies, pathname]);
  const allTechs = useMemo(
    () => scene.techNames.map((name) => TECH_STACK.find((tech) => tech.name === name)).filter((tech): tech is Tech => Boolean(tech)),
    [scene.techNames],
  );
  const techs = useMemo(
    () => allTechs.slice(0, environment?.isMobile ? PARTICLE_SCENE_LIMITS.mobile : PARTICLE_SCENE_LIMITS.desktop),
    [allTechs, environment?.isMobile],
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const tabletQuery = window.matchMedia("(max-width: 1100px)");
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncEnvironment = () => setEnvironment({
      isMobile: mobileQuery.matches,
      isTablet: !mobileQuery.matches && tabletQuery.matches,
      mode: reduceQuery.matches || !hasWebGL() ? "fallback" : "webgl",
    });
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
      pointer.current.pressed = false;
    };
    const onDown = () => { pointer.current.pressed = true; };
    const onUp = () => { pointer.current.pressed = false; };
    const onVisibility = () => setPageVisible(!document.hidden);
    syncEnvironment();
    mobileQuery.addEventListener("change", syncEnvironment);
    tabletQuery.addEventListener("change", syncEnvironment);
    reduceQuery.addEventListener("change", syncEnvironment);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mobileQuery.removeEventListener("change", syncEnvironment);
      tabletQuery.removeEventListener("change", syncEnvironment);
      reduceQuery.removeEventListener("change", syncEnvironment);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!environment) return null;
  if (environment.mode === "fallback") return <StaticTechnologyMark scene={scene} tech={techs[0]} />;

  return (
    <ParticleCanvas
      scene={scene}
      techs={techs}
      environment={environment}
      pointer={pointer}
      pageVisible={pageVisible}
      heroVisible={heroVisible}
      setActiveTechName={setActiveTechName}
    />
  );
}
