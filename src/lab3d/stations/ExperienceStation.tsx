import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

const racks = [
  { x: -0.5, h: 2.05, units: 8 },
  { x: 0.5, h: 1.55, units: 6 },
];

/** F — software infrastructure: two server racks with status lights and a bridge. */
export function ExperienceStation({ accent, reduced }: StationVisualProps) {
  const lights = useRef<THREE.InstancedMesh>(null);
  const slots = useMemo(() => racks.flatMap((r) => Array.from({ length: r.units }, (_, u) => ({ x: r.x, y: 0.32 + u * ((r.h - 0.35) / r.units) }))), []);
  const ledMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const on = useMemo(() => new THREE.Color(palette.ice).multiplyScalar(1.9), []);
  const dim = useMemo(() => new THREE.Color('#1a3570'), []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    slots.forEach((s, i) => { m.makeTranslation(s.x + 0.24, s.y, 0.315); lights.current?.setMatrixAt(i, m); lights.current?.setColorAt(i, dim); });
    if (lights.current) lights.current.instanceMatrix.needsUpdate = true;
  }, [slots, dim]);

  const last = useRef(-1);
  useFrame((state) => {
    if (!lights.current) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const step = Math.floor(t * 3);
    if (step === last.current) return;
    last.current = step;
    slots.forEach((_, i) => {
      const lit = Math.sin(i * 12.9898 + step * 0.7) * 43758.5453 % 1;
      lights.current!.setColorAt(i, Math.abs(lit) > 0.45 ? on : dim);
    });
    if (lights.current.instanceColor) lights.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {racks.map((r) => (
        <group key={r.x} position-x={r.x}>
          <mesh position-y={0.15 + r.h / 2} material={mats.structure}><boxGeometry args={[0.72, r.h, 0.6]} /></mesh>
          <mesh position={[0, 0.15 + r.h + 0.01, 0]} material={mats.edgeSoft}><boxGeometry args={[0.72, 0.01, 0.6]} /></mesh>
          {/* vertical accent strip */}
          <mesh position={[-0.3, 0.15 + r.h / 2, 0.302]} material={accent}><boxGeometry args={[0.035, r.h - 0.15, 0.01]} /></mesh>
          {Array.from({ length: r.units }, (_, u) => (
            <mesh key={u} position={[0.02, 0.32 + u * ((r.h - 0.35) / r.units), 0.302]} material={mats.screen}>
              <boxGeometry args={[0.5, 0.11, 0.01]} />
            </mesh>
          ))}
        </group>
      ))}
      <instancedMesh ref={lights} args={[undefined, ledMat, slots.length]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
      </instancedMesh>
      {/* Holographic career timeline above the racks: one node per role. */}
      <group position={[0, 2.55, 0]}>
        <mesh material={mats.edgeSoft}><boxGeometry args={[1.6, 0.012, 0.012]} /></mesh>
        {[-0.6, 0, 0.6].map((x, i) => (
          <group key={x} position-x={x}>
            <mesh material={i === 0 ? mats.core : mats.white}><sphereGeometry args={[0.045, 12, 10]} /></mesh>
            <mesh position-y={-0.16} material={mats.edgeSoft}><cylinderGeometry args={[0.004, 0.004, 0.3, 6]} /></mesh>
          </group>
        ))}
      </group>
      {/* bridge / cable tray between racks */}
      <mesh position={[0, 1.6, -0.1]} material={mats.structureLight}><boxGeometry args={[0.3, 0.05, 0.22]} /></mesh>
      <mesh position={[0, 1.6, 0.02]} material={mats.edge}><boxGeometry args={[0.3, 0.008, 0.008]} /></mesh>
    </group>
  );
}
