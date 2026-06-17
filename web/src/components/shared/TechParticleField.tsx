'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type RefObject,
} from 'react';
import * as THREE from 'three';
import { FAMILIES, FAMILY_ORDER, familyIndex, type Family, type Tech } from '@/data/techStack';
import { resolveParticleScene } from '@/data/particleScenes';
import { sampleIcon, sampleText, type IconPoint } from '@/lib/sampleIcon';
import { useActiveTech } from '@/context/ActiveTechContext';
import { GenerativeField } from './GenerativeField';

/**
 * Stack tecnológico dibujado por escenas de logos-partícula. Cada ruta o
 * sección resuelve una colección distinta y la transición conserva como máximo
 * dos geometrías activas. Una segunda capa ambiental aporta profundidad.
 */

const COUNT_DESKTOP = 18000;
const COUNT_MOBILE = 6500;
const AMBIENT_DESKTOP = 500;
const AMBIENT_MOBILE = 140;

type Pointer = { x: number; y: number; active: boolean };
type Environment = { mode: 'webgl' | 'fallback'; isMobile: boolean };

interface Slot {
    x: number;
    y: number;
    scale: number;
}

interface GeoArrays {
    position: Float32Array;
    logo: Float32Array;
    color: Float32Array;
    family: Float32Array;
    seed: Float32Array;
    logoSeed: Float32Array;
    size: Float32Array;
}

interface SceneLayer {
    sceneId: string;
    geo: GeoArrays;
    targetOpacity: number;
}

// Flancos y esquinas sostienen la composición, dejando libre el centro (título +
// núcleo 3D). Posiciones ya dentro de la zona segura; `fitSlot` actúa de backstop.
const DESKTOP_SLOTS: Slot[] = [
    { x: -0.82, y: 0.50, scale: 0.30 },
    { x: 0.82, y: 0.54, scale: 0.26 },
    { x: 0.86, y: 0.02, scale: 0.28 },
    { x: -0.86, y: -0.06, scale: 0.28 },
    { x: 0.66, y: -0.62, scale: 0.30 },
    { x: -0.64, y: -0.64, scale: 0.28 },
    { x: -0.34, y: 0.82, scale: 0.20 },
    { x: 0.36, y: 0.82, scale: 0.19 },
    { x: -0.36, y: -0.84, scale: 0.20 },
    { x: 0.38, y: -0.84, scale: 0.22 },
    { x: -0.88, y: 0.30, scale: 0.18 },
    { x: 0.88, y: 0.32, scale: 0.18 },
];

const MOBILE_SLOTS: Slot[] = [
    { x: -0.62, y: 0.70, scale: 0.24 },
    { x: 0.62, y: 0.64, scale: 0.22 },
    { x: -0.68, y: 0.06, scale: 0.20 },
    { x: 0.68, y: -0.04, scale: 0.22 },
    { x: -0.58, y: -0.66, scale: 0.22 },
    { x: 0.58, y: -0.70, scale: 0.22 },
    { x: 0.06, y: 0.84, scale: 0.18 },
];

// Mantiene el logo ENTERO dentro de [-1,1]: clampa el centro del slot según su
// media-extensión (0.5·scale con bbox-fit) + flotación + drift + margen de punto.
// minAspect = aspect ratio más angosto esperado (desktop ~1.15, móvil ~0.5), que
// es el peor caso para la extensión horizontal (aLogo.x se divide por uAspect).
function fitSlot(slot: Slot, minAspect: number): Slot {
    const SAFE = 0.985;
    const xExt = (0.5 * slot.scale) / minAspect + 0.052 + 0.006 + 0.012;
    const yExt = 0.5 * slot.scale + 0.072 + 0.006 + 0.012;
    const xLim = Math.max(0, SAFE - xExt);
    const yLim = Math.max(0, SAFE - yExt);
    return {
        x: Math.max(-xLim, Math.min(xLim, slot.x)),
        y: Math.max(-yLim, Math.min(yLim, slot.y)),
        scale: slot.scale,
    };
}

const sampledTechCache = new Map<string, Promise<IconPoint[]>>();

function sampleTech(tech: Tech): Promise<IconPoint[]> {
    const cached = sampledTechCache.get(tech.name);
    if (cached) return cached;

    const sampled = tech.Icon
        ? sampleIcon(tech.Icon, { resolution: 160, max: 3600, fit: true })
        : Promise.resolve(sampleText(tech.fallback ?? tech.name, { resolution: 160, max: 3600, fit: true }));
    sampledTechCache.set(tech.name, sampled);
    return sampled;
}

async function buildLogoGeometry(techs: Tech[], slots: Slot[], totalCount: number, minAspect: number): Promise<GeoArrays> {
    const weights = slots.map((slot) => slot.scale * slot.scale);
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    const perLogo = weights.map((weight) => Math.max(300, Math.round((totalCount * weight) / weightSum)));
    const sampled = await Promise.all(techs.map(sampleTech));
    const total = perLogo.reduce((sum, count) => sum + count, 0);

    const position = new Float32Array(total * 3);
    const logo = new Float32Array(total * 2);
    const color = new Float32Array(total * 3);
    const family = new Float32Array(total);
    const seed = new Float32Array(total);
    const logoSeed = new Float32Array(total);
    const size = new Float32Array(total);

    let index = 0;
    techs.forEach((tech, logoIndex) => {
        const points = sampled[logoIndex];
        const slot = fitSlot(slots[logoIndex], minAspect);
        const familyId = familyIndex(tech.category);
        const familyColor = new THREE.Color(FAMILIES[familyId].color);
        const sharedSeed = Math.random();
        const count = perLogo[logoIndex];

        for (let pointIndex = 0; pointIndex < count; pointIndex++) {
            // Paso uniforme sobre TODO el ícono: si el presupuesto es menor que la
            // nube muestreada, baja-muestrea parejo (cubre arriba Y abajo) en vez de
            // tomar sólo los primeros puntos (que están ordenados top→bottom).
            const point = points.length
                ? points[Math.min(points.length - 1, Math.floor((pointIndex * points.length) / count))]
                : { x: 0, y: 0 };
            position[index * 3] = slot.x;
            position[index * 3 + 1] = slot.y;
            logo[index * 2] = point.x * slot.scale + (Math.random() - 0.5) * 0.004;
            logo[index * 2 + 1] = point.y * slot.scale + (Math.random() - 0.5) * 0.004;
            color[index * 3] = familyColor.r;
            color[index * 3 + 1] = familyColor.g;
            color[index * 3 + 2] = familyColor.b;
            family[index] = familyId;
            seed[index] = Math.random();
            logoSeed[index] = sharedSeed;
            size[index] = 1.35 + Math.random() * 1.05;
            index++;
        }
    });

    return { position, logo, color, family, seed, logoSeed, size };
}

const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
`;

const LOGO_VERTEX = /* glsl */ `
attribute vec2 aLogo;
attribute vec3 aColor;
attribute float aSeed;
attribute float aLogoSeed;
attribute float aFamily;
attribute float aSize;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uMouseR;
uniform float uPush;
uniform float uVortex;
uniform float uDrift;
uniform float uAspect;
uniform float uPixelRatio;
uniform float uPointScale;
uniform float uFamilyWeight[8];
varying vec3 vColor;
varying float vAlpha;
${SNOISE}
void main() {
    float ls = aLogoSeed * 6.2831853;
    // Flotación con más rango (lateral + altura) y deriva propia por logo: dos
    // sinusoides desfasadas por ls → ningún logo en fase. Amplitud máx ~0.052/0.072
    // (debe coincidir con los términos de flotación de fitSlot para no salirse).
    vec2 floatOff = vec2(
        sin(uTime * 0.14 + ls) * 0.034 + sin(uTime * 0.07 + ls * 2.3) * 0.018,
        sin(uTime * 0.11 + ls * 1.7) * 0.046 + cos(uTime * 0.05 + ls * 1.3) * 0.026
    );
    vec2 base = position.xy + floatOff + vec2(aLogo.x / uAspect, aLogo.y);
    float ph = aSeed * 6.2831853;
    vec2 n = vec2(
        snoise(vec2(base.x * 2.2 + uTime * 0.18, base.y * 2.2 + ph)),
        snoise(vec2(base.y * 2.2 - uTime * 0.16 + ph, base.x * 2.2))
    );
    vec2 pos = base + n * uDrift;
    vec2 tm = pos - uMouse;
    float d = length(tm);
    float infl = (1.0 - smoothstep(0.0, uMouseR, d)) * uMouseActive;
    vec2 dir = d > 0.0001 ? tm / d : vec2(0.0);
    vec2 tang = vec2(-dir.y, dir.x);
    pos += dir * infl * uPush + tang * infl * uVortex;

    int fi = int(aFamily + 0.5);
    float famW = uFamilyWeight[fi];
    float act = mix(0.4, 1.0, famW);
    vColor = aColor;
    vAlpha = (0.14 + 0.42 * famW) + infl * 0.34;
    gl_PointSize = aSize * act * (1.0 + infl * 1.2) * uPointScale * uPixelRatio;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const AMBIENT_VERTEX = /* glsl */ `
attribute vec3 aColor;
attribute float aSeed;
attribute float aFamily;
attribute float aSize;
attribute float aDepth;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uPixelRatio;
uniform float uFamilyWeight[8];
varying vec3 vColor;
varying float vAlpha;
void main() {
    float phase = aSeed * 6.2831853;
    vec2 pos = position.xy + vec2(
        sin(uTime * (0.045 + aDepth * 0.035) + phase) * (0.025 + aDepth * 0.03),
        cos(uTime * (0.035 + aDepth * 0.03) + phase * 1.6) * (0.035 + aDepth * 0.04)
    );
    pos += uMouse * aDepth * 0.012 * uMouseActive;
    vec2 delta = pos - uMouse;
    float distanceToMouse = length(delta);
    float influence = (1.0 - smoothstep(0.0, 0.34, distanceToMouse)) * uMouseActive;
    pos += normalize(delta + vec2(0.0001)) * influence * 0.035;

    int fi = int(aFamily + 0.5);
    float famW = uFamilyWeight[fi];
    vColor = aColor;
    vAlpha = mix(0.08, 0.28, famW) + influence * 0.2;
    gl_PointSize = aSize * (0.75 + aDepth * 0.8 + influence) * uPixelRatio;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const PARTICLE_FRAGMENT = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(vColor, a);
}
`;

// Capa de constelación: nodos (Points) con física CPU y líneas (LineSegments)
// que se dibujan entre vecinos cerca del cursor. Coordenadas en clip space.
const NODE_VERTEX = /* glsl */ `
attribute vec3 aColor;
attribute float aAlpha;
attribute float aSize;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vAlpha;
void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const LINK_VERTEX = /* glsl */ `
attribute vec3 aColor;
attribute float aAlpha;
varying vec3 vColor;
varying float vAlpha;
void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const LINK_FRAGMENT = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
    gl_FragColor = vec4(vColor, vAlpha);
}
`;

function familyWeights(activeFamilies: Family[], neutralWeight: number): number[] {
    return FAMILY_ORDER.map((family) =>
        activeFamilies.length === 0 ? neutralWeight : activeFamilies.includes(family) ? 1 : 0.14,
    );
}

function seededValue(index: number, salt: number): number {
    const raw = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return raw - Math.floor(raw);
}

function LogoParticleSystem({
    geo,
    pointer,
    activeFamilies,
    isMobile,
    targetOpacity,
    onFadedOut,
}: {
    geo: GeoArrays;
    pointer: RefObject<Pointer>;
    activeFamilies: Family[];
    isMobile: boolean;
    targetOpacity: number;
    onFadedOut: () => void;
}) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const fadeReported = useRef(false);
    const targetWeights = useRef<number[]>(familyWeights(activeFamilies, 0.6));
    const geometry = useMemo(() => {
        const next = new THREE.BufferGeometry();
        next.setAttribute('position', new THREE.BufferAttribute(geo.position, 3));
        next.setAttribute('aLogo', new THREE.BufferAttribute(geo.logo, 2));
        next.setAttribute('aColor', new THREE.BufferAttribute(geo.color, 3));
        next.setAttribute('aFamily', new THREE.BufferAttribute(geo.family, 1));
        next.setAttribute('aSeed', new THREE.BufferAttribute(geo.seed, 1));
        next.setAttribute('aLogoSeed', new THREE.BufferAttribute(geo.logoSeed, 1));
        next.setAttribute('aSize', new THREE.BufferAttribute(geo.size, 1));
        next.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
        return next;
    }, [geo]);
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uMouseActive: { value: 0 },
        uMouseR: { value: isMobile ? 0.2 : 0.26 },
        uPush: { value: 0.08 },
        uVortex: { value: 0.04 },
        uDrift: { value: 0.006 },
        uAspect: { value: 1.6 },
        uPixelRatio: { value: 1.5 },
        uPointScale: { value: isMobile ? 1.3 : 1.5 },
        uFamilyWeight: { value: familyWeights(activeFamilies, 0.6) },
        uOpacity: { value: 0 },
    }), [activeFamilies, isMobile]);

    useEffect(() => {
        targetWeights.current = familyWeights(activeFamilies, 0.6);
    }, [activeFamilies]);

    useEffect(() => {
        if (targetOpacity > 0) fadeReported.current = false;
    }, [targetOpacity]);

    useFrame((state, delta) => {
        const material = materialRef.current;
        const currentPointer = pointer.current;
        if (!material || !currentPointer) return;

        const values = material.uniforms;
        values.uTime.value += delta;
        values.uPixelRatio.value = state.gl.getPixelRatio();
        values.uAspect.value = state.size.height > 0 ? state.size.width / state.size.height : 1.6;
        values.uMouse.value.set(currentPointer.x, currentPointer.y);
        values.uMouseActive.value += ((currentPointer.active ? 1 : 0) - values.uMouseActive.value) * Math.min(1, delta * 6);
        values.uOpacity.value += (targetOpacity - values.uOpacity.value) * Math.min(1, delta * 4.5);

        const weights = values.uFamilyWeight.value as number[];
        const weightStep = Math.min(1, delta * 2.5);
        for (let index = 0; index < weights.length; index++) {
            weights[index] += (targetWeights.current[index] - weights[index]) * weightStep;
        }

        if (targetOpacity === 0 && values.uOpacity.value < 0.015 && !fadeReported.current) {
            fadeReported.current = true;
            onFadedOut();
        }
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
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function AmbientParticleSystem({
    pointer,
    activeFamilies,
    isMobile,
}: {
    pointer: RefObject<Pointer>;
    activeFamilies: Family[];
    isMobile: boolean;
}) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const targetWeights = useRef<number[]>(familyWeights(activeFamilies, 0.52));
    const geometry = useMemo(() => {
        const count = isMobile ? AMBIENT_MOBILE : AMBIENT_DESKTOP;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const families = new Float32Array(count);
        const seeds = new Float32Array(count);
        const sizes = new Float32Array(count);
        const depths = new Float32Array(count);

        for (let index = 0; index < count; index++) {
            const familyId = index % FAMILIES.length;
            const color = new THREE.Color(FAMILIES[familyId].color);
            positions[index * 3] = seededValue(index, 1) * 2.2 - 1.1;
            positions[index * 3 + 1] = seededValue(index, 2) * 2.2 - 1.1;
            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;
            families[index] = familyId;
            seeds[index] = seededValue(index, 3);
            sizes[index] = 0.65 + seededValue(index, 4) * 1.8;
            depths[index] = seededValue(index, 5);
        }

        const next = new THREE.BufferGeometry();
        next.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        next.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        next.setAttribute('aFamily', new THREE.BufferAttribute(families, 1));
        next.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
        next.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        next.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));
        next.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
        return next;
    }, [isMobile]);
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uMouseActive: { value: 0 },
        uPixelRatio: { value: 1.5 },
        uFamilyWeight: { value: familyWeights(activeFamilies, 0.52) },
        uOpacity: { value: isMobile ? 0.3 : 0.36 },
    }), [activeFamilies, isMobile]);

    useEffect(() => {
        targetWeights.current = familyWeights(activeFamilies, 0.52);
    }, [activeFamilies]);

    useFrame((state, delta) => {
        const material = materialRef.current;
        const currentPointer = pointer.current;
        if (!material || !currentPointer) return;

        const values = material.uniforms;
        values.uTime.value += delta;
        values.uPixelRatio.value = state.gl.getPixelRatio();
        values.uMouse.value.set(currentPointer.x, currentPointer.y);
        values.uMouseActive.value += ((currentPointer.active ? 1 : 0) - values.uMouseActive.value) * Math.min(1, delta * 3);

        const weights = values.uFamilyWeight.value as number[];
        const weightStep = Math.min(1, delta * 2);
        for (let index = 0; index < weights.length; index++) {
            weights[index] += (targetWeights.current[index] - weights[index]) * weightStep;
        }
    });

    return (
        <points geometry={geometry} frustumCulled={false}>
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={AMBIENT_VERTEX}
                fragmentShader={PARTICLE_FRAGMENT}
                transparent
                depthWrite={false}
                depthTest={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

const CONSTELLATION_DESKTOP = 90;
const CONSTELLATION_MOBILE = 40;
const MAX_LINKS_DESKTOP = 260;
const MAX_LINKS_MOBILE = 110;

// Partículas flotantes que reaccionan con fuerza al cursor (vórtice + repulsión)
// y se conectan con líneas de constelación entre vecinas cercanas al puntero
// —recreando la sensación de la primera versión (GenerativeField), pero en WebGL.
function ConstellationLayer({
    pointer,
    isMobile,
}: {
    pointer: RefObject<Pointer>;
    isMobile: boolean;
}) {
    const nodeMatRef = useRef<THREE.ShaderMaterial>(null);
    const nodeRef = useRef<THREE.Points>(null);
    const linkRef = useRef<THREE.LineSegments>(null);

    const count = isMobile ? CONSTELLATION_MOBILE : CONSTELLATION_DESKTOP;
    const maxLinks = isMobile ? MAX_LINKS_MOBILE : MAX_LINKS_DESKTOP;

    // Semilla determinista (cómputo puro): posiciones/colores/tamaños iniciales.
    const seed = useMemo(() => {
        const px = new Float32Array(count);
        const py = new Float32Array(count);
        const phase = new Float32Array(count);
        const baseColor = new Float32Array(count * 3);
        const baseSize = new Float32Array(count);
        const white = new THREE.Color('#ffffff');
        for (let i = 0; i < count; i++) {
            px[i] = seededValue(i, 11) * 2 - 1;
            py[i] = seededValue(i, 12) * 2 - 1;
            phase[i] = seededValue(i, 15) * 6.2831853;
            const c = seededValue(i, 16) < 0.54
                ? white
                : new THREE.Color(FAMILIES[i % FAMILIES.length].color);
            baseColor[i * 3] = c.r;
            baseColor[i * 3 + 1] = c.g;
            baseColor[i * 3 + 2] = c.b;
            baseSize[i] = 1.6 + seededValue(i, 17) * 1.8;
        }
        return { px, py, phase, baseColor, baseSize };
    }, [count]);

    // Estado físico mutable (clip space [-1,1]). Se inicializa de forma perezosa
    // dentro de useFrame para no leer/mutar refs durante el render.
    const simRef = useRef<{ px: Float32Array; py: Float32Array; vx: Float32Array; vy: Float32Array } | null>(null);

    // Geometría de nodos: posición + color + alpha + size. La mutación por frame
    // se hace a través de nodeRef (no del valor memoizado directamente).
    const nodeGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(seed.baseColor), 3));
        geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(count), 1));
        geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(seed.baseSize), 1));
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
        return geo;
    }, [count, seed]);

    // Geometría de líneas: buffers de tamaño fijo, draw range dinámico por frame.
    const linkGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxLinks * 2 * 3), 3));
        geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(maxLinks * 2 * 3), 3));
        geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(maxLinks * 2), 1));
        geo.setDrawRange(0, 0);
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
        return geo;
    }, [maxLinks]);

    const nodeUniforms = useMemo(() => ({
        uPixelRatio: { value: 1.5 },
        uOpacity: { value: 1 },
    }), []);

    // Radios en unidades de altura (la x se corrige por aspect para que el campo
    // de interacción sea isótropo en pantallas anchas).
    const MOUSE_R = isMobile ? 0.5 : 0.45;
    const LINK_R = isMobile ? 0.34 : 0.3;
    const LINK_DIST = isMobile ? 0.2 : 0.16;
    const VORTEX = 0.011;
    const REPEL = 0.006;

    useFrame((state) => {
        const ptr = pointer.current;
        const nodeGeo = nodeRef.current?.geometry;
        const linkGeo = linkRef.current?.geometry;
        if (!ptr || !nodeGeo || !linkGeo) return;

        // Init perezoso del estado mutable (copia las posiciones de la semilla).
        if (simRef.current == null || simRef.current.px.length !== count) {
            simRef.current = {
                px: new Float32Array(seed.px),
                py: new Float32Array(seed.py),
                vx: new Float32Array(count),
                vy: new Float32Array(count),
            };
        }
        const sim = simRef.current;
        const t = state.clock.elapsedTime;
        const aspect = state.size.height > 0 ? state.size.width / state.size.height : 1.6;

        const nodePos = nodeGeo.attributes.position.array as Float32Array;
        const nodeAlpha = nodeGeo.attributes.aAlpha.array as Float32Array;
        const { px, py, vx, vy } = sim;
        const { phase } = seed;
        const active = ptr.active ? 1 : 0;

        for (let i = 0; i < count; i++) {
            // Deriva orgánica suave (cada partícula con su fase).
            vx[i] += Math.sin(t * 0.3 + phase[i]) * 0.00006;
            vy[i] += Math.cos(t * 0.26 + phase[i] * 1.3) * 0.00006;

            let proximity = 0;
            if (active) {
                const dx = px[i] - ptr.x;
                const dy = py[i] - ptr.y;
                const cdx = dx * aspect;
                const cdy = dy;
                const d = Math.hypot(cdx, cdy) || 1e-4;
                if (d < MOUSE_R) {
                    const f = 1 - d / MOUSE_R;
                    proximity = f;
                    const ux = cdx / d;
                    const uy = cdy / d;
                    const vortex = f * VORTEX;
                    const repel = f * f * REPEL;
                    // tangencial (-uy, ux) + radial (ux, uy), de vuelta a clip space.
                    vx[i] += (-uy * vortex + ux * repel) / aspect;
                    vy[i] += (ux * vortex + uy * repel);
                }
            }

            vx[i] *= 0.92;
            vy[i] *= 0.92;
            px[i] += vx[i];
            py[i] += vy[i];

            // Wrap-around dentro del clip space.
            if (px[i] < -1.05) px[i] = 1.05;
            else if (px[i] > 1.05) px[i] = -1.05;
            if (py[i] < -1.05) py[i] = 1.05;
            else if (py[i] > 1.05) py[i] = -1.05;

            nodePos[i * 3] = px[i];
            nodePos[i * 3 + 1] = py[i];
            nodePos[i * 3 + 2] = 0;
            nodeAlpha[i] = Math.min(0.08 + proximity * 0.42, 0.56);
        }
        nodeGeo.attributes.position.needsUpdate = true;
        nodeGeo.attributes.aAlpha.needsUpdate = true;

        // ── Líneas de constelación entre vecinos cercanos al cursor ──
        const linkPos = linkGeo.attributes.position.array as Float32Array;
        const linkColor = linkGeo.attributes.aColor.array as Float32Array;
        const linkAlpha = linkGeo.attributes.aAlpha.array as Float32Array;
        let links = 0;

        if (active) {
            // Recolectar índices cerca del cursor.
            const near: number[] = [];
            for (let i = 0; i < count; i++) {
                const cdx = (px[i] - ptr.x) * aspect;
                const cdy = py[i] - ptr.y;
                if (cdx * cdx + cdy * cdy < LINK_R * LINK_R) near.push(i);
            }
            const { baseColor } = seed;
            for (let a = 0; a < near.length && links < maxLinks; a++) {
                for (let b = a + 1; b < near.length && links < maxLinks; b++) {
                    const ia = near[a];
                    const ib = near[b];
                    const cdx = (px[ia] - px[ib]) * aspect;
                    const cdy = py[ia] - py[ib];
                    const d = Math.hypot(cdx, cdy);
                    if (d < LINK_DIST) {
                        const alpha = (1 - d / LINK_DIST) * 0.22;
                        const o = links * 2;
                        linkPos[o * 3] = px[ia];
                        linkPos[o * 3 + 1] = py[ia];
                        linkPos[o * 3 + 2] = 0;
                        linkPos[(o + 1) * 3] = px[ib];
                        linkPos[(o + 1) * 3 + 1] = py[ib];
                        linkPos[(o + 1) * 3 + 2] = 0;
                        for (let k = 0; k < 2; k++) {
                            linkColor[(o + k) * 3] = baseColor[ia * 3];
                            linkColor[(o + k) * 3 + 1] = baseColor[ia * 3 + 1];
                            linkColor[(o + k) * 3 + 2] = baseColor[ia * 3 + 2];
                            linkAlpha[o + k] = alpha;
                        }
                        links++;
                    }
                }
            }
        }

        linkGeo.setDrawRange(0, links * 2);
        linkGeo.attributes.position.needsUpdate = true;
        linkGeo.attributes.aColor.needsUpdate = true;
        linkGeo.attributes.aAlpha.needsUpdate = true;

        if (nodeMatRef.current) {
            nodeMatRef.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
        }
    });

    return (
        <>
            <lineSegments ref={linkRef} geometry={linkGeometry} frustumCulled={false}>
                <shaderMaterial
                    vertexShader={LINK_VERTEX}
                    fragmentShader={LINK_FRAGMENT}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
            <points ref={nodeRef} geometry={nodeGeometry} frustumCulled={false}>
                <shaderMaterial
                    ref={nodeMatRef}
                    uniforms={nodeUniforms}
                    vertexShader={NODE_VERTEX}
                    fragmentShader={PARTICLE_FRAGMENT}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </>
    );
}

function hasWebGL(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext
            && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch {
        return false;
    }
}

export function TechParticleField() {
    const pathname = usePathname();
    const { activeFamilies } = useActiveTech();
    const [environment, setEnvironment] = useState<Environment | null>(null);
    const [visible, setVisible] = useState(true);
    const [layers, setLayers] = useState<SceneLayer[]>([]);
    const pointer = useRef<Pointer>({ x: -10, y: -10, active: false });
    const geometryCache = useRef(new Map<string, Promise<GeoArrays>>());
    const scene = useMemo(
        () => environment ? resolveParticleScene(pathname, activeFamilies, environment.isMobile) : null,
        [activeFamilies, environment, pathname],
    );

    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 768px)');
        const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const syncEnvironment = () => {
            setEnvironment({
                isMobile: mobileQuery.matches,
                mode: reduceQuery.matches || !hasWebGL() ? 'fallback' : 'webgl',
            });
        };
        const initialFrame = window.requestAnimationFrame(syncEnvironment);
        const onMove = (event: PointerEvent) => {
            pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
            pointer.current.active = true;
        };
        const onLeave = () => {
            pointer.current.active = false;
        };
        const onVisibility = () => setVisible(!document.hidden);

        mobileQuery.addEventListener('change', syncEnvironment);
        reduceQuery.addEventListener('change', syncEnvironment);
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.cancelAnimationFrame(initialFrame);
            mobileQuery.removeEventListener('change', syncEnvironment);
            reduceQuery.removeEventListener('change', syncEnvironment);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    useEffect(() => {
        if (!environment || environment.mode !== 'webgl' || !scene) return;
        let cancelled = false;
        const slots = environment.isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
        const count = environment.isMobile ? COUNT_MOBILE : COUNT_DESKTOP;
        let pendingGeometry = geometryCache.current.get(scene.id);

        if (!pendingGeometry) {
            pendingGeometry = buildLogoGeometry(scene.techs, slots.slice(0, scene.techs.length), count, environment.isMobile ? 0.5 : 1.15);
            geometryCache.current.set(scene.id, pendingGeometry);
        }

        pendingGeometry.then((geo) => {
            if (cancelled) return;
            setLayers((current) => {
                const existing = current.find((layer) => layer.sceneId === scene.id);
                if (existing) {
                    return current.map((layer) => ({
                        ...layer,
                        targetOpacity: layer.sceneId === scene.id ? 0.68 : 0,
                    }));
                }
                return [
                    ...current.map((layer) => ({ ...layer, targetOpacity: 0 })),
                    { sceneId: scene.id, geo, targetOpacity: 0.68 },
                ].slice(-2);
            });
        });

        return () => {
            cancelled = true;
        };
    }, [environment, scene]);

    const removeFadedLayer = useCallback((sceneId: string) => {
        setLayers((current) => current.filter(
            (layer) => layer.sceneId !== sceneId || layer.targetOpacity > 0,
        ));
    }, []);

    if (!environment) return null;
    if (environment.isMobile) return null;
    if (environment.mode === 'fallback') return <GenerativeField activeFamilies={activeFamilies} />;

    return (
        <Canvas
            aria-hidden
            dpr={[1, 1.5]}
            frameloop={visible ? 'always' : 'never'}
            gl={{ alpha: true, antialias: false, depth: false, powerPreference: 'low-power' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
            <AmbientParticleSystem
                pointer={pointer}
                activeFamilies={activeFamilies}
                isMobile={environment.isMobile}
            />
            <ConstellationLayer pointer={pointer} isMobile={environment.isMobile} />
            {layers.map((layer) => (
                <LogoParticleSystem
                    key={layer.sceneId}
                    geo={layer.geo}
                    pointer={pointer}
                    activeFamilies={activeFamilies}
                    isMobile={environment.isMobile}
                    targetOpacity={layer.targetOpacity}
                    onFadedOut={() => removeFadedLayer(layer.sceneId)}
                />
            ))}
        </Canvas>
    );
}
