'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Núcleo de orquestación 3D — la pieza firma del hero. Un icosaedro de puntos en
 * verde señal envuelto en un wireframe cyan que gira, "respira" y se inclina hacia
 * el cursor. Es el "core" que late detrás del título.
 *
 * Se monta sólo en desktop sin reduced-motion (ver el gate en HeroPortfolio) y se
 * carga con dynamic(ssr:false) para mantener three fuera del bundle inicial.
 */
const SIGNAL = '#9be63a';
const ACCENT = '#2ec8d8';

function Core({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
    const outer = useRef<THREE.Group>(null);
    const inner = useRef<THREE.Group>(null);

    const pointsGeo = useMemo(() => new THREE.IcosahedronGeometry(2.05, 4), []);
    const wireGeo = useMemo(
        () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.35, 1)),
        [],
    );

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        if (inner.current) {
            inner.current.rotation.y += delta * 0.14;
            inner.current.rotation.x += delta * 0.05;
            inner.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.035);
        }
        if (outer.current && pointer.current) {
            outer.current.rotation.y += (pointer.current.x * 0.5 - outer.current.rotation.y) * 0.05;
            outer.current.rotation.x += (pointer.current.y * 0.4 - outer.current.rotation.x) * 0.05;
        }
    });

    return (
        <group ref={outer}>
            <group ref={inner}>
                <points geometry={pointsGeo}>
                    <pointsMaterial
                        color={SIGNAL}
                        size={0.028}
                        sizeAttenuation
                        transparent
                        opacity={0.85}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </points>
                <lineSegments geometry={wireGeo}>
                    <lineBasicMaterial
                        color={ACCENT}
                        transparent
                        opacity={0.16}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </lineSegments>
            </group>
        </group>
    );
}

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
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
        >
            <Core pointer={pointer} />
        </Canvas>
    );
}
