import { useRef } from 'react';
import type * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

/**
 * About — profile station: a tall portrait frame with an abstract figure on
 * its screen, a slow orbit ring around it, and three small floating tags for
 * the areas I work across (software & AI, embedded, human-centered design).
 */
export function AboutStation({ accent, reduced }: StationVisualProps) {
  const orbit = useRef<THREE.Group>(null);
  const tags = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    if (orbit.current) orbit.current.rotation.y = t * 0.25;
    tags.current.forEach((g, i) => {
      if (g) g.position.y = 0.95 + i * 0.42 + (reduced ? 0 : Math.sin(t * 0.9 + i * 1.7) * 0.05);
    });
  });

  return (
    <group>
      {/* Portrait frame on a short plinth */}
      <group position={[-0.2, 0, -0.15]}>
        <mesh position-y={0.26} material={mats.structure}><boxGeometry args={[1.0, 0.22, 0.5]} /></mesh>
        <mesh position-y={0.38} material={mats.structureLight}><boxGeometry args={[1.06, 0.03, 0.56]} /></mesh>
        <mesh position-y={1.35} material={mats.structure}><boxGeometry args={[0.92, 1.9, 0.08]} /></mesh>
        <mesh position={[0, 1.35, 0.041]} material={mats.screen}><planeGeometry args={[0.8, 1.76]} /></mesh>
        {/* Abstract figure: head and shoulders */}
        <mesh position={[0, 1.62, 0.043]} material={mats.edgeSoft}><circleGeometry args={[0.17, 40]} /></mesh>
        <mesh position={[0, 1.13, 0.043]} material={mats.edgeSoft}><circleGeometry args={[0.32, 40, 0, Math.PI]} /></mesh>
        {/* Name strip */}
        <mesh position={[0, 0.72, 0.043]} material={accent}><planeGeometry args={[0.5, 0.05]} /></mesh>
        <mesh position={[0, 0.62, 0.043]} material={mats.edgeSoft}><planeGeometry args={[0.34, 0.02]} /></mesh>
        {/* Frame edge light */}
        <mesh position={[0, 2.31, 0]} material={mats.edge}><boxGeometry args={[0.92, 0.012, 0.09]} /></mesh>

        {/* Slow orbit ring with a single marker */}
        <group ref={orbit} position-y={1.35}>
          <mesh rotation-x={Math.PI / 2} material={mats.edgeSoft}><torusGeometry args={[0.78, 0.006, 6, 96]} /></mesh>
          <mesh position={[0.78, 0, 0]} material={mats.core}><sphereGeometry args={[0.035, 12, 10]} /></mesh>
        </group>
      </group>

      {/* Three floating tags beside the frame */}
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(el) => { tags.current[i] = el; }} position={[0.95, 0.95 + i * 0.42, 0.35]} rotation-y={-0.5}>
          <mesh material={mats.panel}><boxGeometry args={[0.5, 0.2, 0.03]} /></mesh>
          <mesh position={[-0.17, 0, 0.017]} material={i === 0 ? accent : mats.core}><circleGeometry args={[0.03, 16]} /></mesh>
          <mesh position={[0.05, 0, 0.017]} material={mats.edgeSoft}><planeGeometry args={[0.28, 0.025]} /></mesh>
        </group>
      ))}
      <mesh position={[0.95, 0.5, 0.35]} material={mats.structure}><cylinderGeometry args={[0.012, 0.012, 0.75, 6]} /></mesh>
      <mesh position={[0.95, 0.17, 0.35]} material={mats.structureLight}><cylinderGeometry args={[0.1, 0.12, 0.06, 16]} /></mesh>
    </group>
  );
}
