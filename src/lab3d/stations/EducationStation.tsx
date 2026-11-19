import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

const DESK_Y = 0.84;

/**
 * Education — a research desk: a monitor showing a circuit schematic, an
 * angled drafting board with an engineering drawing, an open notebook and a
 * desk lamp. Grounded and quiet, nothing floating.
 */
export function EducationStation({ accent, reduced }: StationVisualProps) {
  const trace = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!trace.current || reduced) return;
    // A single "signal" dot running along the schematic's main trace.
    const p = (state.clock.elapsedTime * 0.25) % 1;
    trace.current.position.x = -0.34 + p * 0.68;
  });

  return (
    <group>
      {/* Desk */}
      <mesh position={[0, DESK_Y, 0.12]} material={mats.panel}><boxGeometry args={[2.0, 0.05, 0.86]} /></mesh>
      <mesh position={[0, DESK_Y + 0.002, 0.552]} material={mats.edgeSoft}><boxGeometry args={[2.0, 0.008, 0.01]} /></mesh>
      <mesh position={[0.68, (DESK_Y - 0.03) / 2 + 0.11, 0.12]} material={mats.structure}><boxGeometry args={[0.6, DESK_Y - 0.25, 0.8]} /></mesh>
      {[0.36, 0.56].map((y) => (
        <mesh key={y} position={[0.68, y, 0.525]} material={mats.structureLight}><boxGeometry args={[0.18, 0.02, 0.015]} /></mesh>
      ))}
      <mesh position={[-0.93, (DESK_Y - 0.03) / 2 + 0.11, 0.12]} material={mats.structure}><boxGeometry args={[0.06, DESK_Y - 0.25, 0.78]} /></mesh>

      {/* Monitor with a schematic */}
      <group position={[0.12, DESK_Y, -0.12]}>
        <mesh position-y={0.02} material={mats.structureLight}><boxGeometry args={[0.24, 0.02, 0.16]} /></mesh>
        <mesh position-y={0.17} material={mats.structure}><boxGeometry args={[0.04, 0.28, 0.04]} /></mesh>
        <group position-y={0.5} rotation-x={-0.06}>
          <mesh material={mats.structure}><boxGeometry args={[0.92, 0.56, 0.03]} /></mesh>
          <mesh position-z={0.016} material={mats.screen}><planeGeometry args={[0.86, 0.5]} /></mesh>
          {/* schematic: rails, two components, a trace with a moving signal */}
          <mesh position={[0, 0.14, 0.018]} material={mats.edgeSoft}><planeGeometry args={[0.7, 0.008]} /></mesh>
          <mesh position={[0, -0.14, 0.018]} material={mats.edgeSoft}><planeGeometry args={[0.7, 0.008]} /></mesh>
          {[-0.2, 0.2].map((x) => (
            <group key={x} position={[x, 0, 0.018]}>
              <mesh material={mats.edgeSoft}><planeGeometry args={[0.008, 0.28]} /></mesh>
              <mesh material={accent}><planeGeometry args={[0.07, 0.1]} /></mesh>
            </group>
          ))}
          <mesh position={[0, 0, 0.018]} material={mats.edgeSoft}><planeGeometry args={[0.68, 0.006]} /></mesh>
          <mesh ref={trace} position={[0, 0, 0.02]} material={mats.white}><circleGeometry args={[0.014, 12]} /></mesh>
        </group>
      </group>

      {/* Drafting board with an engineering drawing */}
      <group position={[-0.6, DESK_Y + 0.03, 0.18]} rotation-y={0.18}>
        <mesh position={[0, 0.08, -0.12]} rotation-x={0.35} material={mats.structureDark}><boxGeometry args={[0.04, 0.16, 0.04]} /></mesh>
        <group position-y={0.1} rotation-x={-0.95}>
          <mesh material={mats.structureLight}><boxGeometry args={[0.56, 0.42, 0.02]} /></mesh>
          <mesh position-z={0.011}>
            <planeGeometry args={[0.5, 0.36]} />
            <meshStandardMaterial color="#1b315f" roughness={0.85} />
          </mesh>
          <mesh position={[-0.06, 0.02, 0.013]} material={mats.edgeSoft}><ringGeometry args={[0.07, 0.078, 40]} /></mesh>
          <mesh position={[-0.06, 0.02, 0.013]} material={mats.edgeSoft}><planeGeometry args={[0.24, 0.004]} /></mesh>
          <mesh position={[-0.06, 0.02, 0.013]} material={mats.edgeSoft}><planeGeometry args={[0.004, 0.24]} /></mesh>
          <mesh position={[0.16, -0.08, 0.013]} material={mats.edgeSoft}><planeGeometry args={[0.12, 0.08]} /></mesh>
        </group>
      </group>

      {/* Open notebook */}
      <group position={[0.18, DESK_Y + 0.032, 0.36]} rotation-y={-0.15}>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.11, 0, 0]} rotation-z={side * -0.04} material={mats.matte}>
            <boxGeometry args={[0.21, 0.012, 0.28]} />
          </mesh>
        ))}
        {[0.06, 0.02, -0.02, -0.06].map((z) => (
          <mesh key={z} position={[0.11, 0.008, z]} rotation-x={-Math.PI / 2} material={mats.edgeSoft}><planeGeometry args={[0.15, 0.004]} /></mesh>
        ))}
      </group>

      {/* Desk lamp */}
      <group position={[0.78, DESK_Y, 0.02]}>
        <mesh position-y={0.02} material={mats.structure}><cylinderGeometry args={[0.09, 0.11, 0.04, 20]} /></mesh>
        <mesh position={[-0.04, 0.24, 0]} rotation-z={0.25} material={mats.structureLight}><cylinderGeometry args={[0.014, 0.014, 0.46, 8]} /></mesh>
        <mesh position={[-0.2, 0.5, 0]} rotation-z={1.15} material={mats.structureLight}><cylinderGeometry args={[0.014, 0.014, 0.36, 8]} /></mesh>
        <mesh position={[-0.37, 0.55, 0]} rotation-z={-0.55} material={mats.structure}><coneGeometry args={[0.085, 0.13, 20, 1, true]} /></mesh>
        <mesh position={[-0.4, 0.5, 0]} material={mats.white}><sphereGeometry args={[0.026, 10, 8]} /></mesh>
      </group>
    </group>
  );
}
