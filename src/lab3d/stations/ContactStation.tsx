import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

/** G — communication terminal: a dish antenna broadcasting soft rings, plus a small desk. */
export function ContactStation({ accent, reduced }: StationVisualProps) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const ringMats = useMemo(() => [0, 1, 2].map(() => new THREE.MeshBasicMaterial({
    color: palette.ice, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide,
  })), []);
  const beacon = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = reduced ? 0.4 : state.clock.elapsedTime;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const p = ((t * 0.35 + i / 3) % 1);
      m.scale.setScalar(0.4 + p * 1.5);
      ringMats[i].opacity = reduced ? 0.15 : (1 - p) * 0.35;
    });
    if (beacon.current) beacon.current.scale.setScalar(1 + 0.25 * Math.max(0, Math.sin(t * 2.2)));
  });

  return (
    <group>
      {/* Dish on a pedestal */}
      <group position={[-0.35, 0, -0.15]}>
        <mesh position-y={0.62} material={mats.structure}><cylinderGeometry args={[0.16, 0.3, 1.0, 24]} /></mesh>
        <mesh position-y={1.16} material={accent}><sphereGeometry args={[0.13, 20, 14]} /></mesh>
        <group position-y={1.2} rotation={[0.6, 0, 0]}>
          {/* Bowl: a flipped sphere cap, lifted so its lowest point sits at y=0 (rim at ~0.215). */}
          <mesh position-y={0.8} rotation-x={Math.PI} material={mats.structureLight}>
            <sphereGeometry args={[0.8, 40, 16, 0, Math.PI * 2, 0, 0.75]} />
          </mesh>
          <mesh position-y={0.215} rotation-x={Math.PI / 2} material={mats.edge}><torusGeometry args={[0.545, 0.01, 6, 80]} /></mesh>
          <mesh position-y={0.3} material={mats.structureDark}><cylinderGeometry args={[0.015, 0.015, 0.6, 8]} /></mesh>
          <mesh ref={beacon} position-y={0.62} material={mats.core}><sphereGeometry args={[0.055, 14, 10]} /></mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} ref={(el) => { rings.current[i] = el; }} position-y={0.66} rotation-x={Math.PI / 2} material={ringMats[i]}>
              <ringGeometry args={[0.3, 0.315, 48]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Small terminal desk */}
      <group position={[0.8, 0, 0.35]} rotation-y={-0.3}>
        <mesh position-y={0.42} material={mats.structureDark}><boxGeometry args={[0.7, 0.56, 0.5]} /></mesh>
        <mesh position={[0, 0.98, -0.08]} rotation-x={-0.2} material={mats.structure}><boxGeometry args={[0.62, 0.44, 0.04]} /></mesh>
        <mesh position={[0, 0.98, -0.055]} rotation-x={-0.2} material={mats.screen}><planeGeometry args={[0.54, 0.36]} /></mesh>
        {[0.08, 0, -0.08].map((y, i) => (
          <mesh key={y} position={[-0.08 + i * 0.03, 0.99 + y, -0.03]} rotation-x={-0.2} material={i === 0 ? mats.edge : mats.edgeSoft}>
            <boxGeometry args={[0.3 - i * 0.06, 0.018, 0.004]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
