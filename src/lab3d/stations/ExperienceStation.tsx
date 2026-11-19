import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import type { StationVisualProps } from '../Station';

const PLINTH_TOP = 0.25;
const racks = [
  { x: -0.5, h: 1.85, units: 7 },
  { x: 0.42, h: 1.45, units: 5 },
];
const RACK_Z = -0.75;
const unitY = (r: (typeof racks)[number], u: number) => PLINTH_TOP + 0.2 + u * ((r.h - 0.36) / r.units);

function Cable({ points, radius = 0.018 }: { points: [number, number, number][]; radius?: number }) {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), 24, radius, 6), [points, radius]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh geometry={geo} material={mats.matte} />;
}

/**
 * Experience — infrastructure: two framed server racks on a raised plinth,
 * status lights, a cable run, and a small side console showing a timeline.
 */
export function ExperienceStation({ accent, reduced }: StationVisualProps) {
  const lights = useRef<THREE.InstancedMesh>(null);
  const slots = useMemo(() => racks.flatMap((r) => Array.from({ length: r.units }, (_, u) => ({ x: r.x, y: unitY(r, u) }))), []);
  const ledMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const on = useMemo(() => new THREE.Color(palette.ice).multiplyScalar(1.8), []);
  const dim = useMemo(() => new THREE.Color('#1d3a78'), []);
  const activeNode = useRef<THREE.Mesh>(null);
  useEffect(() => () => ledMat.dispose(), [ledMat]);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    slots.forEach((s, i) => { m.makeTranslation(s.x + 0.22, s.y, RACK_Z + 0.318); lights.current?.setMatrixAt(i, m); lights.current?.setColorAt(i, dim); });
    if (lights.current) lights.current.instanceMatrix.needsUpdate = true;
  }, [slots, dim]);

  const last = useRef(-1);
  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    if (activeNode.current) activeNode.current.scale.setScalar(1 + 0.3 * Math.max(0, Math.sin(t * 2)));
    if (!lights.current) return;
    const step = Math.floor(t * 1.5);
    if (step === last.current) return;
    last.current = step;
    slots.forEach((_, i) => {
      const r = Math.abs(Math.sin(i * 12.9898 + step * 0.7) * 43758.5453) % 1;
      lights.current!.setColorAt(i, r > 0.4 ? on : dim);
    });
    if (lights.current.instanceColor) lights.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {racks.map((r) => (
        <group key={r.x} position={[r.x, 0, RACK_Z]}>
          {/* body */}
          <mesh position-y={PLINTH_TOP + r.h / 2} material={mats.structureDark}><boxGeometry args={[0.7, r.h, 0.6]} /></mesh>
          {/* front frame */}
          {[-0.33, 0.33].map((x) => (
            <mesh key={x} position={[x, PLINTH_TOP + r.h / 2, 0.3]} material={mats.structure}><boxGeometry args={[0.05, r.h, 0.04]} /></mesh>
          ))}
          <mesh position={[0, PLINTH_TOP + r.h - 0.03, 0.3]} material={mats.structure}><boxGeometry args={[0.7, 0.06, 0.04]} /></mesh>
          {/* top cap with vents */}
          <mesh position-y={PLINTH_TOP + r.h + 0.02} material={mats.structureLight}><boxGeometry args={[0.74, 0.04, 0.64]} /></mesh>
          {[-0.12, 0, 0.12].map((z) => (
            <mesh key={z} position={[0, PLINTH_TOP + r.h + 0.042, z]} material={mats.structureDark}><boxGeometry args={[0.5, 0.004, 0.04]} /></mesh>
          ))}
          {/* rack units */}
          {Array.from({ length: r.units }, (_, u) => (
            <mesh key={u} position={[-0.02, unitY(r, u), 0.312]} material={mats.panel}><boxGeometry args={[0.54, 0.13, 0.015]} /></mesh>
          ))}
          {/* accent light strip */}
          <mesh position={[-0.29, PLINTH_TOP + r.h / 2, 0.325]} material={accent}><boxGeometry args={[0.018, r.h - 0.2, 0.008]} /></mesh>
        </group>
      ))}
      <instancedMesh ref={lights} args={[undefined, ledMat, slots.length]}>
        <boxGeometry args={[0.035, 0.035, 0.01]} />
      </instancedMesh>

      {/* cable run between racks and down to the console */}
      <Cable points={[[-0.5, 2.12, -0.9], [-0.05, 2.32, -0.9], [0.42, 1.72, -0.9]]} />
      <Cable points={[[0.7, 0.4, -0.5], [0.95, 0.22, -0.1], [1.1, 0.25, 0.35]]} radius={0.022} />

      {/* side console with a career timeline */}
      <group position={[1.12, 0, 0.55]} rotation-y={-0.35}>
        <mesh position-y={0.5} material={mats.structure}><boxGeometry args={[0.32, 0.7, 0.28]} /></mesh>
        <mesh position-y={0.86} material={mats.structureLight}><boxGeometry args={[0.36, 0.03, 0.32]} /></mesh>
        <group position={[0, 1.06, 0]} rotation-x={-0.45}>
          <mesh material={mats.structure}><boxGeometry args={[0.66, 0.4, 0.04]} /></mesh>
          <mesh position-z={0.021} material={mats.screen}><planeGeometry args={[0.58, 0.32]} /></mesh>
          <mesh position={[0, -0.02, 0.024]} material={mats.edgeSoft}><boxGeometry args={[0.46, 0.008, 0.002]} /></mesh>
          {[-0.2, 0, 0.2].map((x, i) => (
            <group key={x} position={[x, -0.02, 0.026]}>
              <mesh ref={i === 0 ? activeNode : undefined} material={i === 0 ? mats.core : mats.white}><circleGeometry args={[0.022, 16]} /></mesh>
              <mesh position-y={0.07} material={mats.edgeSoft}><planeGeometry args={[0.1, 0.012]} /></mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
