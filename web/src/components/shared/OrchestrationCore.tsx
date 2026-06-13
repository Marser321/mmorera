'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

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

    // Geometría base: icosaedro de alta subdivisión → distribución uniforme de puntos
    const baseGeo = useMemo(() => new THREE.IcosahedronGeometry(2.1, 4), []);

    // Copiar posiciones base y crear atributos para tamaño y color dinámicos
    const { geometry, basePositions, count } = useMemo(() => {
        const positions = baseGeo.attributes.position.array as Float32Array;
        const cnt = positions.length / 3;

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(positions), 3));

        // Tamaños dinámicos (se modifican en useFrame)
        const sizes = new Float32Array(cnt).fill(1.0);
        geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        // Colores dinámicos (base: mezcla verde-cyan, se iluminan cerca del cursor)
        const colors = new Float32Array(cnt * 3);
        const baseColor = new THREE.Color(SIGNAL);
        const accentColor = new THREE.Color(ACCENT);
        for (let i = 0; i < cnt; i++) {
            // Mezcla sutil: ~70% signal, ~30% accent, con variación
            const mix = Math.random() * 0.35;
            const c = baseColor.clone().lerp(accentColor, mix);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return { geometry: geo, basePositions: new Float32Array(positions), count: cnt };
    }, [baseGeo]);

    // Shader material personalizado para tamaños variables por punto
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uOpacity: { value: 0.55 },
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
                    gl_PointSize = size * (80.0 / -mvPosition.z);
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

            // Tamaño: base 1.0, expansión sutil cerca del cursor
            const targetSize = 1.0 + influenceSq * 1.2;
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
        () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.3, 1)),
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
                opacity={0.07}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </lineSegments>
    );
}

// ─────────────────────────────────────────────
// CENTRO BRILLANTE (punto focal mínimo)
// ─────────────────────────────────────────────
function CenterGlow() {
    const ref = useRef<THREE.Points>(null);
    const geo = useMemo(() => new THREE.IcosahedronGeometry(0.5, 2), []);

    useFrame((state, delta) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.y += delta * 0.2;
        ref.current.rotation.z -= delta * 0.1;
        const pulse = 1 + Math.sin(t * 2.2) * 0.08;
        ref.current.scale.setScalar(pulse);
    });

    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial
                color="#ffffff"
                size={0.015}
                sizeAttenuation
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
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
            <InteractivePoints pointer={pointer} />
            <SubtleWireframe />
            <CenterGlow />
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
