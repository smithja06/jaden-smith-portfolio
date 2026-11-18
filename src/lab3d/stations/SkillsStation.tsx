import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

const smooth = (x: number) => x * x * (3 - 2 * x);
/** Hold, move, hold, move back — purposeful rather than constant motion. */
function stepWave(t: number, period: number) {
  const p = (t % period) / period;
  if (p < 0.3) return 0;
  if (p < 0.5) return smooth((p - 0.3) / 0.2);
  if (p < 0.8) return 1;
  return 1 - smooth((p - 0.8) / 0.2);
}

/** Skills — robotic workstation: an arm beside a control board with one status key per skill category. */
export function SkillsStation({ accent, reduced }: StationVisualProps) {
  const yaw = useRef<THREE.Group>(null);
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const ledMats = useMemo(() => Array.from({ length: 5 }, () => new THREE.MeshBasicMaterial({ color: palette.signal, toneMapped: false })), []);
  const on = useMemo(() => new THREE.Color(palette.ice).multiplyScalar(2), []);
  const off = useMemo(() => new THREE.Color('#132a5c'), []);
  useEffect(() => () => ledMats.forEach((m) => m.dispose()), [ledMats]);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const k = stepWave(t, 9);
    if (yaw.current) yaw.current.rotation.y = -0.5 + k * 1.1;
    if (shoulder.current) shoulder.current.rotation.z = 0.35 - k * 0.25;
    if (elbow.current) elbow.current.rotation.z = -1.0 + k * 0.45;
    ledMats.forEach((m, i) => m.color.copy(Math.sin(t * (1.1 + i * 0.37) + i * 2) > 0.2 ? on : off));
  });

  return (
    <group>
      {/* Arm */}
      <group position={[-0.65, 0.14, 0.1]}>
        <mesh position-y={0.12} material={mats.structure}><cylinderGeometry args={[0.36, 0.44, 0.24, 32]} /></mesh>
        <group ref={yaw} position-y={0.24}>
          <mesh position-y={0.08} material={mats.structureLight}><cylinderGeometry args={[0.24, 0.28, 0.16, 24]} /></mesh>
          <group ref={shoulder} position-y={0.24}>
            <mesh rotation-x={Math.PI / 2} material={accent}><cylinderGeometry args={[0.13, 0.13, 0.3, 20]} /></mesh>
            <mesh position-y={0.45} material={mats.structure}><boxGeometry args={[0.15, 0.9, 0.16]} /></mesh>
            <group ref={elbow} position-y={0.9}>
              <mesh rotation-x={Math.PI / 2} material={accent}><cylinderGeometry args={[0.1, 0.1, 0.24, 18]} /></mesh>
              <mesh position-y={0.32} material={mats.structureLight}><boxGeometry args={[0.11, 0.64, 0.12]} /></mesh>
              <group position-y={0.66}>
                <mesh material={mats.structure}><cylinderGeometry args={[0.07, 0.07, 0.08, 14]} /></mesh>
                {[-0.05, 0.05].map((x) => (
                  <mesh key={x} position={[x, 0.1, 0]} material={mats.structureLight}><boxGeometry args={[0.025, 0.16, 0.06]} /></mesh>
                ))}
                <mesh position-y={0.05} material={mats.core}><sphereGeometry args={[0.025, 10, 8]} /></mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Control board on a stand */}
      <group position={[0.75, 0, 0.15]}>
        <mesh position-y={0.36} material={mats.structureDark}><boxGeometry args={[1.0, 0.44, 0.72]} /></mesh>
        <mesh position-y={0.62} rotation-x={-0.18} material={mats.structure}>
          <boxGeometry args={[1.12, 0.06, 0.82]} />
        </mesh>
        <group position-y={0.66} rotation-x={-0.18}>
          {/* chips */}
          <mesh position={[-0.2, 0.02, -0.05]} material={mats.screen}><boxGeometry args={[0.32, 0.04, 0.32]} /></mesh>
          <mesh position={[0.28, 0.02, -0.18]} material={mats.screen}><boxGeometry args={[0.2, 0.04, 0.14]} /></mesh>
          <mesh position={[0.28, 0.02, 0.1]} material={mats.screen}><boxGeometry args={[0.2, 0.04, 0.14]} /></mesh>
          {/* traces */}
          {[-0.2, -0.1, 0, 0.1].map((z) => (
            <mesh key={z} position={[0.05, 0.004, z]} material={mats.edgeSoft}><boxGeometry args={[0.3, 0.004, 0.01]} /></mesh>
          ))}
          <mesh position={[-0.2, 0.004, 0.22]} material={mats.edgeSoft}><boxGeometry args={[0.01, 0.004, 0.22]} /></mesh>
          {/* status LEDs */}
          {ledMats.map((m, i) => (
            <mesh key={i} position={[-0.44 + i * 0.11, 0.02, 0.3]} material={m}><boxGeometry args={[0.05, 0.03, 0.05]} /></mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
