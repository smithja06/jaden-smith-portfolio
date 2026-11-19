import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

const smooth = (x: number) => x * x * (3 - 2 * x);
/** Hold, move, hold, return — slow and purposeful rather than constant motion. */
function stepWave(t: number, period: number) {
  const p = (t % period) / period;
  if (p < 0.35) return 0;
  if (p < 0.5) return smooth((p - 0.35) / 0.15);
  if (p < 0.85) return 1;
  return 1 - smooth((p - 0.85) / 0.15);
}

const BENCH_Y = 0.66;

/**
 * Skills — robotic workstation: an articulated arm inspecting a circuit board
 * on a small workbench, with five indicator lights (one per skill category).
 */
export function SkillsStation({ accent, reduced }: StationVisualProps) {
  const yaw = useRef<THREE.Group>(null);
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const wrist = useRef<THREE.Group>(null);
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  const ledMats = useMemo(() => Array.from({ length: 5 }, () => new THREE.MeshBasicMaterial({ toneMapped: false })), []);
  const on = useMemo(() => new THREE.Color(palette.ice).multiplyScalar(2), []);
  const off = useMemo(() => new THREE.Color('#16306a'), []);
  useEffect(() => () => ledMats.forEach((m) => m.dispose()), [ledMats]);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const k = stepWave(t, 10);
    const idle = reduced ? 0 : Math.sin(t * 0.8) * 0.02;
    // Two inspection poses over the board, with a little breathing in between.
    if (yaw.current) yaw.current.rotation.y = -0.12 + k * 0.28;
    if (shoulder.current) shoulder.current.rotation.z = -0.62 + k * 0.08 + idle;
    if (elbow.current) elbow.current.rotation.z = -1.05 - k * 0.12 - idle;
    if (wrist.current) wrist.current.rotation.z = -1.42 + k * 0.04;
    if (beam.current) beam.current.opacity = 0.06 + 0.04 * Math.sin(t * 2.4);
    // One category light active at a time, stepping slowly.
    const active = Math.floor(t / 1.6) % ledMats.length;
    ledMats.forEach((m, i) => m.color.copy(i === active ? on : off));
  });

  return (
    <group>
      {/* Workbench */}
      <group position={[0.62, 0, 0.12]}>
        <mesh position-y={BENCH_Y} material={mats.panel}><boxGeometry args={[1.15, 0.05, 0.8]} /></mesh>
        <mesh position-y={BENCH_Y - 0.04} material={mats.structure}><boxGeometry args={[1.1, 0.03, 0.75]} /></mesh>
        {[[-0.5, -0.32], [0.5, -0.32], [-0.5, 0.32], [0.5, 0.32]].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, (BENCH_Y - 0.05) / 2 + 0.08, z]} material={mats.structure}><boxGeometry args={[0.05, BENCH_Y - 0.2, 0.05]} /></mesh>
        ))}
        <mesh position={[0, 0.32, 0]} material={mats.structureDark}><boxGeometry args={[1.0, 0.03, 0.65]} /></mesh>
        {/* circuit board being inspected */}
        <group position={[-0.08, BENCH_Y + 0.035, 0.02]} rotation-y={0.2}>
          <mesh material={mats.structureLight}><boxGeometry args={[0.46, 0.018, 0.32]} /></mesh>
          <mesh position={[-0.06, 0.02, 0]} material={mats.panel}><boxGeometry args={[0.14, 0.025, 0.14]} /></mesh>
          <mesh position={[0.14, 0.018, -0.08]} material={mats.panel}><boxGeometry args={[0.08, 0.02, 0.06]} /></mesh>
          {[-0.1, -0.03, 0.04, 0.11].map((z) => (
            <mesh key={z} position={[0.08, 0.011, z]} material={mats.edgeSoft}><boxGeometry args={[0.16, 0.003, 0.006]} /></mesh>
          ))}
        </group>
        {/* parts tray */}
        <mesh position={[0.36, BENCH_Y + 0.04, 0.22]} material={mats.structureDark}><boxGeometry args={[0.26, 0.04, 0.2]} /></mesh>
      </group>

      {/* Arm */}
      <group position={[-0.62, 0.15, 0.05]}>
        <mesh position-y={0.08} material={mats.structure}><cylinderGeometry args={[0.38, 0.44, 0.16, 32]} /></mesh>
        {/* category indicator lights on the base */}
        {ledMats.map((m, i) => {
          const a = Math.PI / 2 - 0.5 + i * 0.25;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.4, 0.1, Math.sin(a) * 0.4]} material={m}>
              <boxGeometry args={[0.04, 0.025, 0.04]} />
            </mesh>
          );
        })}
        <group ref={yaw} position-y={0.16}>
          <mesh position-y={0.08} material={mats.structureLight}><cylinderGeometry args={[0.25, 0.3, 0.16, 28]} /></mesh>
          <group ref={shoulder} position-y={0.26}>
            <mesh rotation-x={Math.PI / 2} material={mats.structure}><cylinderGeometry args={[0.15, 0.15, 0.34, 24]} /></mesh>
            <mesh rotation-x={Math.PI / 2} material={accent}><cylinderGeometry args={[0.09, 0.09, 0.36, 20]} /></mesh>
            <mesh position-y={0.42} material={mats.structureLight}><cylinderGeometry args={[0.065, 0.095, 0.84, 18]} /></mesh>
            <group ref={elbow} position-y={0.84}>
              <mesh rotation-x={Math.PI / 2} material={mats.structure}><cylinderGeometry args={[0.11, 0.11, 0.26, 20]} /></mesh>
              <mesh rotation-x={Math.PI / 2} material={accent}><cylinderGeometry args={[0.06, 0.06, 0.28, 16]} /></mesh>
              <mesh position-y={0.3} material={mats.structureLight}><cylinderGeometry args={[0.05, 0.07, 0.6, 16]} /></mesh>
              <group ref={wrist} position-y={0.6}>
                <mesh rotation-x={Math.PI / 2} material={mats.structure}><cylinderGeometry args={[0.065, 0.065, 0.16, 16]} /></mesh>
                <mesh position-y={0.1} material={mats.structure}><cylinderGeometry args={[0.055, 0.045, 0.12, 14]} /></mesh>
                {[-0.045, 0.045].map((x) => (
                  <mesh key={x} position={[x, 0.22, 0]} material={mats.structureLight}><boxGeometry args={[0.022, 0.12, 0.05]} /></mesh>
                ))}
                {/* inspection light */}
                <mesh position-y={0.17} material={mats.white}><sphereGeometry args={[0.02, 10, 8]} /></mesh>
                <mesh position-y={0.36} rotation-x={Math.PI}>
                  <coneGeometry args={[0.14, 0.38, 20, 1, true]} />
                  <meshBasicMaterial ref={beam} color={palette.ice} transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} blending={THREE.AdditiveBlending} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
