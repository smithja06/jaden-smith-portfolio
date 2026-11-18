import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { damp, mats, palette } from './materials/labMaterials';

interface Props {
  reduced: boolean;
  onReset: () => void;
  showLabel: boolean;
}

/** Layered platform with a glowing core. Click to return to the overview. */
export function CentralHub({ reduced, onReset, showLabel }: Props) {
  const [hovered, setHovered] = useState(false);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame((state, dt) => {
    const t = reduced ? 1.2 : state.clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.3);
    if (core.current) core.current.scale.setScalar(1 + pulse * 0.05);
    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = damp(m.opacity, (hovered ? 0.1 : 0.04) + pulse * 0.02, 6, dt);
    }
    if (!reduced) {
      if (ringA.current) ringA.current.rotation.z += dt * 0.25;
      if (ringB.current) ringB.current.rotation.z -= dt * 0.18;
    }
    if (light.current) light.current.intensity = damp(light.current.intensity, hovered ? 7 : 4, 6, dt);
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; };
  const out = () => { setHovered(false); document.body.style.cursor = ''; };
  const click = (e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onReset(); };

  return (
    <group onPointerOver={over} onPointerOut={out} onClick={click}>
      {/* Layered platform */}
      <mesh position-y={0.1} material={mats.structureDark}><cylinderGeometry args={[2.7, 2.9, 0.2, 72]} /></mesh>
      <mesh position-y={0.205} rotation-x={Math.PI / 2} material={mats.edge}><torusGeometry args={[2.7, 0.014, 6, 120]} /></mesh>
      <mesh position-y={0.32} material={mats.structure}><cylinderGeometry args={[2.0, 2.15, 0.24, 72]} /></mesh>
      <mesh position-y={0.445} rotation-x={Math.PI / 2} material={mats.edgeSoft}><torusGeometry args={[2.0, 0.012, 6, 100]} /></mesh>
      <mesh position-y={0.55} material={mats.structureLight}><cylinderGeometry args={[1.25, 1.4, 0.22, 6]} /></mesh>
      <mesh position-y={0.665} rotation-x={Math.PI / 2} rotation-z={Math.PI / 6} material={mats.edge}><torusGeometry args={[1.25, 0.012, 4, 6]} /></mesh>

      {/* Six radial fins on the middle tier */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.7, 0.47, Math.sin(a) * 1.7]} rotation-y={-a} material={mats.structureLight}>
            <boxGeometry args={[0.5, 0.06, 0.08]} />
          </mesh>
        );
      })}

      {/* Core column */}
      <mesh position-y={0.95} material={mats.structure}><cylinderGeometry args={[0.16, 0.26, 0.6, 24]} /></mesh>
      <mesh ref={core} position-y={1.62} material={mats.core}><icosahedronGeometry args={[0.3, 1]} /></mesh>
      <mesh ref={halo} position-y={1.62}>
        <sphereGeometry args={[0.46, 32, 16]} />
        <meshBasicMaterial color={palette.signal} transparent opacity={0.06} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringA} position-y={1.62} rotation={[Math.PI / 2.6, 0, 0]} material={mats.edgeSoft}><torusGeometry args={[0.78, 0.008, 6, 90]} /></mesh>
      <mesh ref={ringB} position-y={1.62} rotation={[Math.PI / 2, 0.5, 0]} material={mats.edgeSoft}><torusGeometry args={[0.98, 0.006, 6, 90]} /></mesh>
      <pointLight ref={light} position-y={1.7} color={palette.signal} intensity={4} distance={10} decay={1.6} />

      {showLabel && (
        <Html position={[2.3, 0.25, 2.3]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`lab3d-label lab3d-hub-label ${hovered ? 'is-hovered' : ''}`} aria-hidden="true">
            <span className="lab3d-dot" />COBALT LAB / SYSTEM ONLINE
            {hovered && <span className="lab3d-label-tip">Return to overview</span>}
          </div>
        </Html>
      )}
    </group>
  );
}
