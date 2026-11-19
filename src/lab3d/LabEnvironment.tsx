import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { ContactShadows, Environment, Grid, Lightformer } from '@react-three/drei';
import { mats, palette } from './materials/labMaterials';

/** Floor, grid, lit intersections, fog and lighting for the whole facility. */
export function LabEnvironment({ highQuality }: { highQuality: boolean }) {
  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 48, 120]} />

      {/* Lighting: soft ambient fill, a clear cool key, a camera-side fill so
          silhouettes read from the overview, and a cobalt rim from behind. */}
      <hemisphereLight args={['#3a5ea8', '#03060f', 0.32]} />
      <directionalLight position={[8, 16, 5]} intensity={1.35} color="#e2ecff" />
      <directionalLight position={[14, 8, 14]} intensity={0.3} color="#a9c6ff" />
      <directionalLight position={[-12, 7, -9]} intensity={0.8} color={palette.signal} />

      {/* Locally generated reflections for the metallic surfaces — no network fetch. */}
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={1.3} color="#9cc3ff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={0.9} color={palette.cobalt} position={[-10, 2, 0]} rotation-y={Math.PI / 2} scale={[20, 4, 1]} />
        <Lightformer form="rect" intensity={0.55} color="#ffffff" position={[10, 3, 6]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position-y={-0.01} material={mats.floor}>
        <planeGeometry args={[140, 140]} />
      </mesh>
      <Grid
        position={[0, 0.002, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.55}
        cellColor="#0f2048"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#1a3a7c"
        fadeDistance={30}
        fadeStrength={1.4}
        fadeFrom={0}
        infiniteGrid
      />
      <GridNodes />
      {highQuality && (
        <ContactShadows position={[0, 0.006, 0]} scale={36} resolution={512} blur={2.2} opacity={0.7} far={3.5} frames={1} color="#00030c" />
      )}
    </>
  );
}

/** Tiny lit points on section intersections near the facility (instanced). */
function GridNodes() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const pts: [number, number][] = [];
  for (let x = -16; x <= 16; x += 4) for (let z = -16; z <= 16; z += 4) if (Math.hypot(x, z) < 17 && Math.hypot(x, z) > 3) pts.push([x, z]);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    pts.forEach(([x, z], i) => { m.makeTranslation(x, 0.006, z); ref.current?.setMatrixAt(i, m); });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <instancedMesh ref={ref} args={[undefined, mats.edgeSoft, pts.length]} rotation-x={0}>
      <cylinderGeometry args={[0.05, 0.05, 0.004, 10]} />
    </instancedMesh>
  );
}
