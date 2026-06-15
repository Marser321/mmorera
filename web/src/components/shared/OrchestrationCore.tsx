'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { LOGO_MM_PATHS, LOGO_MM_VIEWBOX } from '@/lib/logoMMPaths';

/**
 * OrchestrationCore — Versión Minimal Premium.
 * 
 * Filosofía: menos es más. Dos capas orgánicas + respuesta viva al cursor.
 * Sin etiquetas, sin bloom, sin anillos. Solo geometría pura que respira.
 * 
 * Microinteracciones:
 * 1. Paralaje 3D con inercia suave (traslación + tilt)
 * 2. Proximidad del cursor → los puntos cercanos se iluminan y expanden
 * 3. Respiración orgánica asimétrica (escala pulsante desfasada por eje)
 */

const SIGNAL = '#9be63a';
const ACCENT = '#2ec8d8';

// ─────────────────────────────────────────────
// ESFERA INTERACTIVA DE PUNTOS
// Los puntos reaccionan individualmente al cursor
// ─────────────────────────────────────────────
function InteractivePoints({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
    const ref = useRef<THREE.Points>(null);

    // Geometría base: icosaedro de alta subdivisión → distribución uniforme de puntos.
    // Esfera achicada: actúa como "campo de contención" alrededor del logo central.
    const baseGeo = useMemo(() => new THREE.IcosahedronGeometry(1.7, 4), []);

    // Copiar posiciones base y crear atributos para tamaño y color dinámicos
    const { geometry, count } = useMemo(() => {
        const positions = baseGeo.attributes.position.array as Float32Array;
        const cnt = positions.length / 3;

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(positions), 3));

        // Tamaños dinámicos (se modifican en useFrame). Base más chica: la esfera
        // es campo de apoyo, no protagonista → puntos finos.
        const sizes = new Float32Array(cnt).fill(0.6);
        geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        // Colores dinámicos (base: mezcla verde-cyan, se iluminan cerca del cursor)
        const colors = new Float32Array(cnt * 3);
        const baseColor = new THREE.Color(SIGNAL);
        const accentColor = new THREE.Color(ACCENT);
        for (let i = 0; i < cnt; i++) {
            // Mezcla sutil: ~70% signal, ~30% accent, con variación
            const raw = Math.sin((i + 1) * 12.9898) * 43758.5453;
            const mix = (raw - Math.floor(raw)) * 0.35;
            const c = baseColor.clone().lerp(accentColor, mix);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return { geometry: geo, count: cnt };
    }, [baseGeo]);

    // Shader material personalizado para tamaños variables por punto
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uOpacity: { value: 0.30 },
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vAlpha;
                void main() {
                    vColor = color;
                    vAlpha = smoothstep(0.8, 2.5, size);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (46.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float uOpacity;
                varying vec3 vColor;
                varying float vAlpha;
                void main() {
                    // Punto circular suave con borde difuso
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    float alpha = smoothstep(0.5, 0.15, d) * uOpacity * (0.4 + vAlpha * 0.6);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Vector reutilizable para proyección del cursor en 3D
    const cursorWorld = useRef(new THREE.Vector3());
    const tempVec = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;

        // ── Rotación lenta y orgánica ──
        ref.current.rotation.y += delta * 0.08;
        ref.current.rotation.x += delta * 0.025;

        // ── Respiración asimétrica ──
        const breathX = 1 + Math.sin(t * 0.9) * 0.03;
        const breathY = 1 + Math.sin(t * 1.1 + 0.5) * 0.035;
        const breathZ = 1 + Math.cos(t * 0.7) * 0.025;
        ref.current.scale.set(breathX, breathY, breathZ);

        // ── Microinteracción: Proximidad del cursor ──
        // Proyectamos el cursor normalizado al espacio 3D aproximado
        if (pointer.current) {
            cursorWorld.current.set(
                pointer.current.x * 3.5,
                -pointer.current.y * 3.5,
                1.5
            );
        }

        const posAttr = ref.current.geometry.attributes.position;
        const sizeAttr = ref.current.geometry.attributes.size;
        const colorAttr = ref.current.geometry.attributes.color;
        const positions = posAttr.array as Float32Array;
        const sizes = sizeAttr.array as Float32Array;
        const colors = colorAttr.array as Float32Array;

        const highlightColor = new THREE.Color('#ffffff');
        const baseSignal = new THREE.Color(SIGNAL);
        const baseAccent = new THREE.Color(ACCENT);

        for (let i = 0; i < count; i++) {
            // Posición del punto en espacio mundo (aproximado sin considerar rotación completa)
            tempVec.current.set(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );

            // Distancia al cursor proyectado
            const dist = tempVec.current.distanceTo(cursorWorld.current);
            const influence = Math.max(0, 1 - dist / 2.2); // Radio de influencia más focalizado
            const influenceSq = influence * influence; // Curva cuadrática = suave

            // Tamaño: base 0.6 (campo tenue), expansión contenida cerca del cursor
            const targetSize = 0.6 + influenceSq * 0.7;
            sizes[i] += (targetSize - sizes[i]) * 0.05;

            // Color: se acerca al blanco cerca del cursor
            const mix = (i % 3 === 0) ? 0.25 : 0;
            const baseC = baseSignal.clone().lerp(baseAccent, mix);
            const targetColor = baseC.clone().lerp(highlightColor, influenceSq * 0.7);

            colors[i * 3] += (targetColor.r - colors[i * 3]) * 0.04;
            colors[i * 3 + 1] += (targetColor.g - colors[i * 3 + 1]) * 0.04;
            colors[i * 3 + 2] += (targetColor.b - colors[i * 3 + 2]) * 0.04;
        }

        sizeAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
    });

    return <points ref={ref} geometry={geometry} material={material} />;
}

// ─────────────────────────────────────────────
// WIREFRAME SUTIL (capa de profundidad)
// ─────────────────────────────────────────────
function SubtleWireframe() {
    const ref = useRef<THREE.LineSegments>(null);
    const geo = useMemo(
        () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.9, 1)),
        [],
    );

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y -= delta * 0.05;
        ref.current.rotation.z += delta * 0.02;
    });

    return (
        <lineSegments ref={ref} geometry={geo}>
            <lineBasicMaterial
                color={ACCENT}
                transparent
                opacity={0.045}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </lineSegments>
    );
}

// ─────────────────────────────────────────────
// LOGO MM 3D — extruido, llega en 3 partes y se ensambla
// ─────────────────────────────────────────────
const LOGO_TARGET_SIZE = 1.9; // ancho del logo en unidades de mundo
const ASSEMBLY_DUR = 1.15;    // segundos por parte
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Llegada de cada parte (espacio local pre-escala). dir × tamaño = offset inicial.
const ASSEMBLY = [
    { delay: 0.0, dir: new THREE.Vector3(1.1, 0.1, 1.4), rot: new THREE.Euler(0, 0.9, 0.2) },
    { delay: 0.25, dir: new THREE.Vector3(1.0, -1.1, 0.6), rot: new THREE.Euler(-0.4, 0.5, 0.3) },
    { delay: 0.5, dir: new THREE.Vector3(-1.1, 1.0, 0.6), rot: new THREE.Euler(0.4, -0.5, -0.3) },
];

function AssemblingLogo() {
    const groupRef = useRef<THREE.Group>(null);
    const partsRef = useRef<(THREE.Mesh | null)[]>([]);
    const startRef = useRef<number | null>(null);

    // Extrusión de los 3 subpaths + centrado/escala compartidos (una sola vez).
    const { geometries, materials, fitScale, offsets } = useMemo(() => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO_MM_VIEWBOX.width} ${LOGO_MM_VIEWBOX.height}">${LOGO_MM_PATHS.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
        const parsed = new SVGLoader().parse(svg);
        const geos = parsed.paths.map((path) => {
            const shapes = SVGLoader.createShapes(path);
            return new THREE.ExtrudeGeometry(shapes, {
                depth: 150,
                bevelEnabled: true,
                bevelThickness: 18,
                bevelSize: 10,
                bevelSegments: 2,
                steps: 1,
            });
        });

        // bbox unión → centrar y escalar todas las partes con el MISMO transform.
        const box = new THREE.Box3();
        geos.forEach((g) => { g.computeBoundingBox(); if (g.boundingBox) box.union(g.boundingBox); });
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        geos.forEach((g) => g.translate(-center.x, -center.y, -center.z));

        const maxDim = Math.max(size.x, size.y);
        const fit = LOGO_TARGET_SIZE / maxDim;
        const offs = ASSEMBLY.map((a) => a.dir.clone().multiplyScalar(maxDim));
        // Poco metalness (sin env map el metal se ve negro) + emisión sutil → mark claro.
        const mats = geos.map(() => new THREE.MeshStandardMaterial({
            color: '#f3f7f8',
            metalness: 0.18,
            roughness: 0.38,
            emissive: new THREE.Color(ACCENT),
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0,
        }));

        return { geometries: geos, materials: mats, fitScale: fit, offsets: offs };
    }, []);

    useFrame((state) => {
        if (startRef.current === null) startRef.current = state.clock.elapsedTime;
        const elapsed = state.clock.elapsedTime - startRef.current;

        let lastProgress = 0;
        ASSEMBLY.forEach((a, i) => {
            const mesh = partsRef.current[i];
            if (!mesh) return;
            const p = Math.min(1, Math.max(0, (elapsed - a.delay) / ASSEMBLY_DUR));
            const e = easeOutCubic(p);
            if (i === ASSEMBLY.length - 1) lastProgress = e;
            const inv = 1 - e;
            mesh.position.set(offsets[i].x * inv, offsets[i].y * inv, offsets[i].z * inv);
            mesh.rotation.set(a.rot.x * inv, a.rot.y * inv, a.rot.z * inv);
            mesh.scale.setScalar(0.2 + 0.8 * e);
            materials[i].opacity = e;
        });

        // Idle suave una vez ensamblado (escalado por el progreso de la última parte).
        if (groupRef.current) {
            const t = state.clock.elapsedTime;
            groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.22 * lastProgress;
            groupRef.current.rotation.x = Math.sin(t * 0.27 + 1.0) * 0.08 * lastProgress;
        }
    });

    return (
        <group ref={groupRef} scale={[fitScale, -fitScale, fitScale]}>
            {geometries.map((geo, i) => (
                <mesh
                    key={i}
                    ref={(m) => { partsRef.current[i] = m; }}
                    geometry={geo}
                    material={materials[i]}
                />
            ))}
        </group>
    );
}

// ─────────────────────────────────────────────
// ESCENA COMPLETA
// ─────────────────────────────────────────────
function Scene({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
    const outer = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!outer.current || !pointer.current) return;

        // ── Paralaje con inercia suave ──
        const targetX = pointer.current.x * 0.7;
        const targetY = -pointer.current.y * 0.7;
        outer.current.position.x += (targetX - outer.current.position.x) * 0.05;
        outer.current.position.y += (targetY - outer.current.position.y) * 0.05;

        // ── Tilt rotacional sutil ──
        const targetRotX = -pointer.current.y * 0.35;
        const targetRotY = pointer.current.x * 0.4;
        outer.current.rotation.x += (targetRotX - outer.current.rotation.x) * 0.05;
        outer.current.rotation.y += (targetRotY - outer.current.rotation.y) * 0.05;
    });

    return (
        <group ref={outer}>
            {/* Luces para el logo extruido (los puntos usan su propio shader y las ignoran) */}
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 4, 5]} intensity={1.3} color="#ffffff" />
            <pointLight position={[-3, -2, 2]} intensity={0.8} color={ACCENT} />
            <InteractivePoints pointer={pointer} />
            <SubtleWireframe />
            <AssemblingLogo />
        </group>
    );
}

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
export function OrchestrationCore() {
    const pointer = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6], fov: 42 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
        >
            <Scene pointer={pointer} />
        </Canvas>
    );
}
