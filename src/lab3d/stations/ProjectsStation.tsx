import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mats, palette } from '../materials/labMaterials';
import { defaultSettings, levelToDuty, mapField, presetField } from '../../lab/visionMatrix';
import type { StationVisualProps } from '../Station';

const DESK_Y = 0.86;
/** Three screens hung from one mast, arranged in a gentle arc. */
const screens = [
  { x: -0.98, z: 0.02, ry: 0.42, w: 0.78 },
  { x: 0, z: -0.14, ry: 0, w: 0.96 },
  { x: 0.98, z: 0.02, ry: -0.42, w: 0.78 },
];
const SCREEN_Y = 1.42;

/**
 * Projects — a showcase workstation: desk, keyboard, a mast holding three
 * screens, and a small working 4×4 prototype board (the MED-T idea in miniature).
 */
export function ProjectsStation({ accent, reduced }: StationVisualProps) {
  const flicker = useRef<THREE.MeshBasicMaterial>(null);
  const leds = useRef<THREE.InstancedMesh>(null);
  const ledMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const dark = useMemo(() => new THREE.Color('#0f1d40'), []);
  const bright = useMemo(() => new THREE.Color(palette.ice).multiplyScalar(2), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  useEffect(() => () => ledMat.dispose(), [ledMat]);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < 16; i++) {
      m.makeTranslation(-0.084 + (i % 4) * 0.056, 0.014, -0.084 + Math.floor(i / 4) * 0.056);
      leds.current?.setMatrixAt(i, m);
      leds.current?.setColorAt(i, dark);
    }
    if (leds.current) leds.current.instanceMatrix.needsUpdate = true;
  }, [dark]);

  const lastStep = useRef(-1);
  useFrame((state) => {
    const t = reduced ? 2 : state.clock.elapsedTime;
    if (flicker.current) flicker.current.opacity = 0.75 + 0.2 * Math.sin(t * 3.1) * Math.sin(t * 1.7);
    const step = Math.floor(t * 8);
    if (!leds.current || step === lastStep.current) return;
    lastStep.current = step;
    const { levels } = mapField(presetField('moving', t * 0.8), defaultSettings);
    levels.forEach((l, i) => leds.current!.setColorAt(i, tmp.copy(dark).lerp(bright, levelToDuty(l))));
    if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {/* Desk: glossy top, lit front edge, slab legs, modesty panel */}
      <mesh position={[0, DESK_Y, 0.28]} material={mats.panel}><boxGeometry args={[2.15, 0.055, 0.82]} /></mesh>
      <mesh position={[0, DESK_Y - 0.035, 0.28]} material={mats.structure}><boxGeometry args={[2.1, 0.03, 0.78]} /></mesh>
      <mesh position={[0, DESK_Y + 0.003, 0.695]} material={accent}><boxGeometry args={[2.15, 0.012, 0.012]} /></mesh>
      {[-0.98, 0.98].map((x) => (
        <mesh key={x} position={[x, (DESK_Y - 0.05) / 2 + 0.15, 0.28]} material={mats.structure}><boxGeometry args={[0.07, DESK_Y - 0.2, 0.72]} /></mesh>
      ))}
      <mesh position={[0, 0.58, -0.08]} material={mats.structureDark}><boxGeometry args={[1.88, 0.42, 0.03]} /></mesh>

      {/* Keyboard + trackpad */}
      <mesh position={[-0.1, DESK_Y + 0.04, 0.47]} rotation-x={-0.06} material={mats.matte}><boxGeometry args={[0.6, 0.022, 0.19]} /></mesh>
      <mesh position={[0.36, DESK_Y + 0.035, 0.47]} material={mats.panel}><boxGeometry args={[0.16, 0.01, 0.13]} /></mesh>

      {/* Monitor mast + crossbar */}
      <mesh position={[0, DESK_Y + 0.05, -0.02]} material={mats.structureLight}><cylinderGeometry args={[0.13, 0.15, 0.04, 24]} /></mesh>
      <mesh position={[0, (DESK_Y + SCREEN_Y + 0.42) / 2, -0.02]} material={mats.structure}><cylinderGeometry args={[0.03, 0.035, SCREEN_Y + 0.42 - DESK_Y, 12]} /></mesh>
      <mesh position={[0, SCREEN_Y + 0.42, -0.02]} rotation-z={Math.PI / 2} material={mats.structure}><cylinderGeometry args={[0.022, 0.022, 1.7, 10]} /></mesh>

      {screens.map((s, i) => (
        <group key={i} position={[s.x * 0.92, SCREEN_Y, s.z]} rotation-y={s.ry}>
          {/* hanger */}
          <mesh position-y={0.3} material={mats.structure}><boxGeometry args={[0.03, 0.2, 0.03]} /></mesh>
          {/* bezel + display */}
          <mesh material={mats.structure}><boxGeometry args={[s.w, 0.5, 0.035]} /></mesh>
          <mesh position-z={0.019} material={mats.screen}><planeGeometry args={[s.w - 0.06, 0.44]} /></mesh>
          {/* content: a title bar, an image block, body lines */}
          <mesh position={[-s.w / 2 + 0.16, 0.16, 0.021]} material={mats.edge}><planeGeometry args={[0.18, 0.025]} /></mesh>
          <mesh position={[s.w / 2 - 0.2, -0.02, 0.021]}>
            <planeGeometry args={[0.26, 0.24]} />
            <meshBasicMaterial ref={i === 1 ? flicker : undefined} color={palette.cobalt} transparent opacity={0.75} toneMapped={false} />
          </mesh>
          {[0.06, -0.02, -0.1].map((y, k) => (
            <mesh key={y} position={[-s.w / 2 + 0.06 + (s.w * 0.42) / 2 - k * 0.02, y, 0.021]} material={mats.edgeSoft}>
              <planeGeometry args={[s.w * 0.42 - k * 0.04, 0.016]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Prop: tiny working 4×4 prototype board */}
      <group position={[0.78, DESK_Y + 0.03, 0.42]} rotation-y={-0.3}>
        <mesh material={mats.structureLight}><boxGeometry args={[0.28, 0.02, 0.28]} /></mesh>
        <instancedMesh ref={leds} args={[undefined, ledMat, 16]}>
          <boxGeometry args={[0.038, 0.012, 0.038]} />
        </instancedMesh>
      </group>
    </group>
  );
}
