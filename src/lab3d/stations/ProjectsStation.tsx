import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

const panels = [
  { x: -0.98, y: 1.62, z: 0.05, ry: 0.38, w: 0.86 },
  { x: 0, y: 1.82, z: -0.12, ry: 0, w: 1.0 },
  { x: 0.98, y: 1.62, z: 0.05, ry: -0.38, w: 0.86 },
];

/** A — holographic workstation with three floating project displays. */
export function ProjectsStation({ accent, reduced }: StationVisualProps) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((g, i) => { if (g) g.position.y = panels[i].y + Math.sin(t * 0.8 + i * 1.7) * 0.035; });
  });

  return (
    <group>
      {/* Desk */}
      <mesh position={[0, 0.9, 0.35]} material={mats.structure}><boxGeometry args={[2.3, 0.07, 0.85]} /></mesh>
      <mesh position={[0, 0.937, 0.775]} material={mats.edge}><boxGeometry args={[2.3, 0.012, 0.012]} /></mesh>
      {[-1.02, 1.02].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.35]} material={mats.structureDark}><boxGeometry args={[0.08, 0.76, 0.75]} /></mesh>
      ))}
      <mesh position={[0, 0.96, 0.45]} rotation-x={-0.25} material={accent}><boxGeometry args={[0.7, 0.03, 0.28]} /></mesh>

      {/* Floating displays */}
      {panels.map((p, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }} position={[p.x, p.y, p.z]} rotation-y={p.ry}>
          <mesh material={mats.holo}>
            <boxGeometry args={[p.w, 0.62, 0.015]} />
            <Edges color={palette.ice} threshold={15} />
          </mesh>
          {/* abstract content lines */}
          {[0.16, 0.04, -0.08, -0.18].map((y, k) => (
            <mesh key={k} position={[-p.w / 2 + 0.1 + (k === 0 ? 0.18 : 0.28) / 2 + (k === 0 ? 0 : 0.05), y, 0.012]} material={k === 0 ? mats.edge : mats.edgeSoft}>
              <boxGeometry args={[k === 0 ? 0.18 : p.w * (0.65 - k * 0.1), 0.022, 0.004]} />
            </mesh>
          ))}
          <mesh position={[p.w / 2 - 0.16, 0.16, 0.012]} material={i === 1 ? mats.core : mats.edgeSoft}><circleGeometry args={[0.05, 16]} /></mesh>
        </group>
      ))}
      {/* light stems from desk to displays */}
      {panels.map((p, i) => (
        <mesh key={i} position={[p.x, (0.94 + p.y - 0.31) / 2, p.z]} material={mats.edgeSoft}>
          <cylinderGeometry args={[0.006, 0.006, p.y - 0.31 - 0.94, 6]} />
        </mesh>
      ))}
    </group>
  );
}
