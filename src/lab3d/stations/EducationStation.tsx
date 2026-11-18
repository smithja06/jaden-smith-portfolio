import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

/**
 * Education — a research desk: book stack, articulated lamp, a holographic
 * "transcript" sheet above the desk, and a slowly turning achievement crystal.
 */
export function EducationStation({ accent, reduced }: StationVisualProps) {
  const sheet = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    if (sheet.current) sheet.current.position.y = 1.78 + Math.sin(t * 0.7) * 0.03;
    if (crystal.current && !reduced) {
      crystal.current.rotation.y += dt * 0.5;
      crystal.current.position.y = 1.55 + Math.sin(t * 0.9 + 1) * 0.04;
    }
  });

  return (
    <group>
      {/* Desk */}
      <mesh position={[0, 0.86, 0.15]} material={mats.structure}><boxGeometry args={[2.2, 0.07, 0.95]} /></mesh>
      <mesh position={[0, 0.897, 0.625]} material={mats.edge}><boxGeometry args={[2.2, 0.01, 0.012]} /></mesh>
      {/* pedestal drawers on the right, slim leg on the left */}
      <mesh position={[0.72, 0.43, 0.15]} material={mats.structureDark}><boxGeometry args={[0.66, 0.8, 0.85]} /></mesh>
      {[0.25, 0.5].map((y) => (
        <mesh key={y} position={[0.72, y, 0.58]} material={mats.edgeSoft}><boxGeometry args={[0.4, 0.008, 0.008]} /></mesh>
      ))}
      <mesh position={[-1.02, 0.43, 0.15]} material={mats.structureDark}><boxGeometry args={[0.08, 0.8, 0.8]} /></mesh>

      {/* Book stack */}
      {[
        { y: 0.93, w: 0.5, r: 0.05, m: mats.structureLight },
        { y: 0.99, w: 0.46, r: -0.12, m: accent },
        { y: 1.05, w: 0.42, r: 0.18, m: mats.structureLight },
      ].map((b, i) => (
        <mesh key={i} position={[-0.68, b.y, 0.25]} rotation-y={b.r} material={b.m}>
          <boxGeometry args={[b.w, 0.055, 0.34]} />
        </mesh>
      ))}

      {/* Articulated lamp */}
      <group position={[0.85, 0.9, -0.15]}>
        <mesh position-y={0.02} material={mats.structure}><cylinderGeometry args={[0.1, 0.12, 0.04, 20]} /></mesh>
        <mesh position={[0, 0.25, 0]} rotation-z={0.25} material={mats.structureLight}><cylinderGeometry args={[0.015, 0.015, 0.5, 8]} /></mesh>
        <mesh position={[-0.17, 0.55, 0]} rotation-z={1.2} material={mats.structureLight}><cylinderGeometry args={[0.015, 0.015, 0.4, 8]} /></mesh>
        <mesh position={[-0.36, 0.6, 0]} rotation-z={-0.6} material={mats.structure}><coneGeometry args={[0.09, 0.14, 20, 1, true]} /></mesh>
        <mesh position={[-0.39, 0.55, 0]} material={mats.white}><sphereGeometry args={[0.03, 10, 8]} /></mesh>
      </group>
      {/* soft pool of lamp light on the desk */}
      <mesh position={[0.4, 0.897, 0.05]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.32, 32]} />
        <meshBasicMaterial color={palette.ice} transparent opacity={0.035} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Holographic transcript sheet */}
      <group ref={sheet} position={[-0.05, 1.78, -0.15]} rotation-x={-0.12}>
        <mesh material={mats.holo}>
          <boxGeometry args={[1.0, 0.72, 0.012]} />
          <Edges color={palette.ice} threshold={15} />
        </mesh>
        <mesh position={[-0.28, 0.24, 0.01]} material={mats.edge}><boxGeometry args={[0.3, 0.03, 0.004]} /></mesh>
        {[0.12, 0.04, -0.04, -0.12, -0.2].map((y, i) => (
          <group key={y}>
            <mesh position={[-0.18, y, 0.01]} material={mats.edgeSoft}><boxGeometry args={[0.5 - (i % 2) * 0.12, 0.016, 0.004]} /></mesh>
            <mesh position={[0.36, y, 0.01]} material={i === 1 ? mats.core : mats.edgeSoft}><boxGeometry args={[0.08, 0.016, 0.004]} /></mesh>
          </group>
        ))}
        <mesh position={[0, -0.36 - 0.25, 0]} material={mats.edgeSoft}><cylinderGeometry args={[0.005, 0.005, 0.5, 6]} /></mesh>
      </group>

      {/* Achievement crystal */}
      <group ref={crystal} position={[-0.68, 1.55, 0.25]}>
        <mesh material={mats.core}><octahedronGeometry args={[0.13, 0]} /></mesh>
        <mesh rotation-x={Math.PI / 2} material={mats.edgeSoft}><torusGeometry args={[0.22, 0.006, 6, 48]} /></mesh>
      </group>
    </group>
  );
}
