'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { FAMILIES, FAMILY_ORDER, LOGO_TECHS, familyIndex, type Tech } from '@/data/techStack';
import { sampleIcon, sampleText, type IconPoint } from '@/lib/sampleIcon';
import { useActiveTech } from '@/context/ActiveTechContext';
import { GenerativeField } from './GenerativeField';

/**
 * TechParticleField — el stack tecnológico dibujado por partículas.
 *
 * Las partículas se agrupan formando los logos del stack (constelación en el
 * fondo), cada uno con el color de su familia. Distribución dispersa con
 * jerarquía de tamaños; cada logo FLOTA (cambia de altura) de forma orgánica.
 * El vertex shader los mantiene en su silueta con respiración de noise, los
 * dispersa al pasar el mouse y resalta la familia activa (uFamilyWeight).
 *
 * Fallback: sin WebGL o con prefers-reduced-motion → GenerativeField 2D.
 */

const COUNT_DESKTOP = 13000;
const COUNT_MOBILE = 4500;

type Pointer = { x: number; y: number; active: boolean };

interface Slot {
    x: number;
    y: number;
    scale: number;
}

// Posiciones dispersas (no grilla), repartidas en altura, evitando el centro
// (zona de texto). Tamaños variados → jerarquía: grandes en los bordes, chicos
// intercalados. Mismo orden que LOGO_TECHS.
const SLOTS: Slot[] = [
    { x: -0.74, y: 0.5, scale: 0.42 }, // grande arriba-izq
    { x: 0.7, y: 0.62, scale: 0.22 }, // chico arriba-der
    { x: 0.8, y: 0.02, scale: 0.34 }, // medio der
    { x: -0.84, y: -0.22, scale: 0.2 }, // chico izq-medio
    { x: 0.52, y: -0.58, scale: 0.4 }, // grande abajo-der
    { x: -0.46, y: -0.66, scale: 0.28 }, // medio abajo-izq
    { x: 0.1, y: 0.82, scale: 0.18 }, // chico arriba-centro
    { x: -0.28, y: -0.38, scale: 0.18 }, // chico centro-bajo
    { x: 0.33, y: 0.24, scale: 0.16 }, // muy chico lateral del centro
    { x: 0.9, y: -0.82, scale: 0.2 }, // chico esquina abajo-der
];

interface GeoArrays {
    count: number;
    position: Float32Array; // vec3 = centro del slot (x,y,0)
    logo: Float32Array; // vec2 = offset del punto (ya escalado)
    color: Float32Array; // vec3 = color de familia
    family: Float32Array; // 1
    seed: Float32Array; // 1 (por partícula, para la respiración)
    logoSeed: Float32Array; // 1 (por logo, para la flotación coherente)
    size: Float32Array; // 1
}

async function buildLogoGeometry(techs: Tech[], slots: Slot[], totalCount: number): Promise<GeoArrays> {
    // Partículas por logo proporcionales al área (scale²) → los grandes se ven nítidos.
    const w = slots.map((s) => s.scale * s.scale);
    const wSum = w.reduce((a, b) => a + b, 0);
    const nPer = w.map((wi) => Math.max(200, Math.round((totalCount * wi) / wSum)));

    const sampled: IconPoint[][] = await Promise.all(
        techs.map((t, i) =>
            t.Icon
                ? sampleIcon(t.Icon, { resolution: 120, max: nPer[i] })
                : Promise.resolve(sampleText(t.fallback ?? t.name, { resolution: 120, max: nPer[i] })),
        ),
    );

    const total = nPer.reduce((a, b) => a + b, 0);
    const position = new Float32Array(total * 3);
    const logo = new Float32Array(total * 2);
    const color = new Float32Array(total * 3);
    const family = new Float32Array(total);
    const seed = new Float32Array(total);
    const logoSeed = new Float32Array(total);
    const size = new Float32Array(total);

    let idx = 0;
    techs.forEach((t, li) => {
        const pts = sampled[li];
        const slot = slots[li];
        const fi = familyIndex(t.category);
        const c = new THREE.Color(FAMILIES[fi].color);
        const ls = Math.random(); // semilla de flotación, compartida por el logo
        for (let k = 0; k < nPer[li]; k++) {
            const pt = pts.length ? pts[k % pts.length] : { x: 0, y: 0 };
            position[idx * 3] = slot.x;
            position[idx * 3 + 1] = slot.y;
            position[idx * 3 + 2] = 0;
            logo[idx * 2] = pt.x * slot.scale + (Math.random() - 0.5) * 0.004;
            logo[idx * 2 + 1] = pt.y * slot.scale + (Math.random() - 0.5) * 0.004;
            color[idx * 3] = c.r;
            color[idx * 3 + 1] = c.g;
            color[idx * 3 + 2] = c.b;
            family[idx] = fi;
            seed[idx] = Math.random();
            logoSeed[idx] = ls;
            size[idx] = 1.4 + Math.random() * 1.0;
            idx++;
        }
    });

    return { count: total, position, logo, color, family, seed, logoSeed, size };
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

const VERTEX = /* glsl */ `
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
uniform float uFamilyWeight[7];
varying vec3 vColor;
varying float vAlpha;
${SNOISE}
void main() {
    // Flotación del logo entero (compartida por aLogoSeed) — más en Y (altura).
    float ls = aLogoSeed * 6.2831853;
    vec2 floatOff = vec2(
        sin(uTime * 0.16 + ls) * 0.035,
        sin(uTime * 0.12 + ls * 1.7) * 0.06
    );
    // position.xy = centro del slot; aLogo = offset (X corregido por aspecto).
    vec2 base = position.xy + floatOff + vec2(aLogo.x / uAspect, aLogo.y);

    // Respiración por partícula que no deshace el logo.
    float ph = aSeed * 6.2831853;
    vec2 n = vec2(
        snoise(vec2(base.x * 2.2 + uTime * 0.18, base.y * 2.2 + ph)),
        snoise(vec2(base.y * 2.2 - uTime * 0.16 + ph, base.x * 2.2))
    );
    vec2 pos = base + n * uDrift;

    // Mouse: dispersa el logo cercano (vuelve solo al alejarse).
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
    vAlpha = (0.22 + 0.55 * famW) + infl * 0.4;

    float size = aSize * act * (1.0 + infl * 1.2) * uPointScale;
    gl_PointSize = size * uPixelRatio;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
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

function ParticleSystem({
    geo,
    pointer,
    activeFamilies,
    isMobile,
}: {
    geo: GeoArrays;
    pointer: React.RefObject<Pointer>;
    activeFamilies: string[];
    isMobile: boolean;
}) {
    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(geo.position, 3));
        g.setAttribute('aLogo', new THREE.BufferAttribute(geo.logo, 2));
        g.setAttribute('aColor', new THREE.BufferAttribute(geo.color, 3));
        g.setAttribute('aFamily', new THREE.BufferAttribute(geo.family, 1));
        g.setAttribute('aSeed', new THREE.BufferAttribute(geo.seed, 1));
        g.setAttribute('aLogoSeed', new THREE.BufferAttribute(geo.logoSeed, 1));
        g.setAttribute('aSize', new THREE.BufferAttribute(geo.size, 1));
        g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10);
        return g;
    }, [geo]);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2(-10, -10) },
                    uMouseActive: { value: 0 },
                    uMouseR: { value: isMobile ? 0.2 : 0.26 },
                    uPush: { value: 0.08 },
                    uVortex: { value: 0.04 },
                    uDrift: { value: 0.012 },
                    uAspect: { value: 1.6 },
                    uPixelRatio: { value: 1.5 },
                    uPointScale: { value: isMobile ? 1.2 : 1.4 },
                    uFamilyWeight: { value: new Array(7).fill(0.6) },
                    uOpacity: { value: 0.92 },
                },
                vertexShader: VERTEX,
                fragmentShader: FRAGMENT,
                transparent: true,
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending,
            }),
        [isMobile],
    );

    const targetWeights = useRef<number[]>(new Array(7).fill(0.6));
    useEffect(() => {
        targetWeights.current = FAMILY_ORDER.map((f) =>
            activeFamilies.length === 0 ? 0.6 : activeFamilies.includes(f) ? 1.0 : 0.16,
        );
    }, [activeFamilies]);

    useFrame((state, delta) => {
        const u = material.uniforms;
        u.uTime.value += delta;
        u.uPixelRatio.value = state.gl.getPixelRatio();
        u.uAspect.value = state.size.height > 0 ? state.size.width / state.size.height : 1.6;

        const w = u.uFamilyWeight.value as number[];
        const k = Math.min(1, delta * 2.5);
        for (let i = 0; i < 7; i++) w[i] += (targetWeights.current[i] - w[i]) * k;

        const p = pointer.current;
        if (p) {
            u.uMouse.value.set(p.x, p.y);
            const target = p.active ? 1 : 0;
            u.uMouseActive.value += (target - u.uMouseActive.value) * Math.min(1, delta * 6);
        }
    });

    return <points geometry={geometry} material={material} frustumCulled={false} />;
}

function hasWebGL(): boolean {
    try {
        const c = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (c.getContext('webgl') || c.getContext('experimental-webgl'))
        );
    } catch {
        return false;
    }
}

export function TechParticleField() {
    const { activeFamilies } = useActiveTech();
    const [mode, setMode] = useState<'pending' | 'webgl' | 'fallback'>('pending');
    const [visible, setVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [geo, setGeo] = useState<GeoArrays | null>(null);
    const pointer = useRef<Pointer>({ x: -10, y: -10, active: false });

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        setMode(reduce || !hasWebGL() ? 'fallback' : 'webgl');

        const onMove = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
            pointer.current.active = true;
        };
        const onLeave = () => {
            pointer.current.active = false;
        };
        const onVisibility = () => setVisible(!document.hidden);

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    // Samplea los logos y arma la geometría (async) una vez decidido el modo.
    useEffect(() => {
        if (mode !== 'webgl') return;
        let cancelled = false;
        const n = isMobile ? 6 : SLOTS.length;
        const techs = LOGO_TECHS.slice(0, n);
        const slots = SLOTS.slice(0, n);
        buildLogoGeometry(techs, slots, isMobile ? COUNT_MOBILE : COUNT_DESKTOP).then((g) => {
            if (!cancelled) setGeo(g);
        });
        return () => {
            cancelled = true;
        };
    }, [mode, isMobile]);

    if (mode === 'pending') return null;
    if (mode === 'fallback') return <GenerativeField />;
    if (!geo) return null; // sampling de logos en curso

    return (
        <Canvas
            aria-hidden
            dpr={[1, 1.5]}
            frameloop={visible ? 'always' : 'never'}
            gl={{ alpha: true, antialias: false, depth: false, powerPreference: 'low-power' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
            <ParticleSystem
                geo={geo}
                pointer={pointer}
                activeFamilies={activeFamilies}
                isMobile={isMobile}
            />
        </Canvas>
    );
}
