import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

/**
 * Contact — comms station: a yoke-mounted dish emitting soft signal rings,
 * a slim antenna mast with a slow beacon, and an elegant message terminal.
 */
export function ContactStation({ accent, reduced }: StationVisualProps) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const ringMats = useMemo(() => [0, 1, 2].map(() => new THREE.MeshBasicMaterial({
    color: palette.ice, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide,
  })), []);
  useEffect(() => () => ringMats.forEach((m) => m.dispose()), [ringMats]);
  const beacon = useRef<THREE.Mesh>(null);
  const cursor = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = reduced ? 0.4 : state.clock.elapsedTime;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const p = (t * 0.3 + i / 3) % 1;
      m.scale.setScalar(0.5 + p * 1.4);
      ringMats[i].opacity = reduced ? 0.1 : (1 - p) * 0.18;
    });
    if (beacon.current) beacon.current.scale.setScalar(1 + 0.35 * Math.max(0, Math.sin(t * 1.6)));
    if (cursor.current) cursor.current.visible = reduced || Math.sin(t * 4) > 0;
  });

  return (
    <group>
      {/* Dish on a yoke */}
      <group position={[-0.45, 0, -0.25]}>
        <mesh position-y={0.32} material={mats.structure}><cylinderGeometry args={[0.2, 0.32, 0.36, 24]} /></mesh>
        <mesh position-y={0.55} material={mats.structureLight}><cylinderGeometry args={[0.24, 0.24, 0.08, 24]} /></mesh>
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.86, 0]} material={mats.structure}><boxGeometry args={[0.06, 0.58, 0.12]} /></mesh>
        ))}
        <mesh position-y={1.1} rotation-z={Math.PI / 2} material={accent}><cylinderGeometry args={[0.05, 0.05, 0.66, 14]} /></mesh>
        <group position-y={1.1} rotation-x={0.62}>
          {/* Bowl: flipped sphere cap, lowest point at y=0 */}
          <mesh position-y={0.8} rotation-x={Math.PI} material={mats.structureLight}>
            <sphereGeometry args={[0.8, 40, 16, 0, Math.PI * 2, 0, 0.75]} />
          </mesh>
          <mesh position-y={0.215} rotation-x={Math.PI / 2} material={mats.edge}><torusGeometry args={[0.545, 0.01, 6, 80]} /></mesh>
          {/* three struts to the feed */}
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2;
            const base = new THREE.Vector3(Math.cos(a) * 0.5, 0.2, Math.sin(a) * 0.5);
            const tip = new THREE.Vector3(0, 0.6, 0);
            const mid = base.clone().add(tip).multiplyScalar(0.5);
            const len = base.distanceTo(tip);
            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tip.clone().sub(base).normalize());
            return (
              <mesh key={i} position={mid} quaternion={q} material={mats.structure}>
                <cylinderGeometry args={[0.008, 0.008, len, 6]} />
              </mesh>
            );
          })}
          <mesh position-y={0.62} material={mats.structure}><cylinderGeometry args={[0.035, 0.05, 0.08, 14]} /></mesh>
          <mesh position-y={0.68} material={mats.core}><sphereGeometry args={[0.03, 12, 10]} /></mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} ref={(el) => { rings.current[i] = el; }} position-y={0.72} rotation-x={Math.PI / 2} material={ringMats[i]}>
              <ringGeometry args={[0.3, 0.312, 56]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Antenna mast */}
      <group position={[0.95, 0, -0.55]}>
        <mesh position-y={0.2} material={mats.structure}><cylinderGeometry args={[0.1, 0.13, 0.12, 16]} /></mesh>
        <mesh position-y={1.2} material={mats.structureLight}><cylinderGeometry args={[0.014, 0.022, 1.9, 8]} /></mesh>
        {[0.95, 1.35, 1.75].map((y, i) => (
          <mesh key={y} position-y={y} rotation-z={Math.PI / 2} material={mats.structure}><cylinderGeometry args={[0.008, 0.008, 0.34 - i * 0.08, 6]} /></mesh>
        ))}
        <mesh ref={beacon} position-y={2.18} material={mats.core}><sphereGeometry args={[0.04, 12, 10]} /></mesh>
      </group>

      {/* Message terminal */}
      <group position={[0.75, 0, 0.6]} rotation-y={-0.4}>
        <mesh position-y={0.48} material={mats.structure}><boxGeometry args={[0.36, 0.66, 0.26]} /></mesh>
        <mesh position-y={0.82} material={mats.structureLight}><boxGeometry args={[0.42, 0.03, 0.32]} /></mesh>
        <group position={[0, 1.04, -0.02]} rotation-x={-0.4}>
          <mesh material={mats.structure}><boxGeometry args={[0.6, 0.4, 0.035]} /></mesh>
          <mesh position-z={0.019} material={mats.screen}><planeGeometry args={[0.53, 0.33]} /></mesh>
          {/* message bubbles */}
          <mesh position={[-0.1, 0.08, 0.021]} material={mats.edgeSoft}><planeGeometry args={[0.26, 0.06]} /></mesh>
          <mesh position={[0.1, -0.01, 0.021]} material={accent}><planeGeometry args={[0.24, 0.06]} /></mesh>
          <mesh position={[-0.13, -0.1, 0.021]} material={mats.edgeSoft}><planeGeometry args={[0.18, 0.012]} /></mesh>
          <mesh ref={cursor} position={[-0.03, -0.1, 0.022]} material={mats.white}><planeGeometry args={[0.008, 0.03]} /></mesh>
        </group>
      </group>
    </group>
  );
}
