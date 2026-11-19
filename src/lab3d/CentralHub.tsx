import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import { damp, mats, palette } from './materials/labMaterials';
import { stations, stationPosition } from './config/stations';

interface Props {
  reduced: boolean;
  onReset: () => void;
  showLabel: boolean;
}

const SEGMENTS = 10;

/**
 * The heart of the Lab: a layered platform, a faceted glass shell around a
 * pulsing core, a slowly turning segmented halo, and docking notches where
 * each signal path arrives. Click to return to the overview.
 */
export function CentralHub({ reduced, onReset, showLabel }: Props) {
  const [hovered, setHovered] = useState(false);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  // Angles at which the floor paths meet the hub, for the docking notches.
  const docks = useMemo(() => stations.map((_, i) => {
    const [x, , z] = stationPosition(i);
    return Math.atan2(z, x);
  }), []);

  useFrame((state, dt) => {
    const t = reduced ? 1.2 : state.clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.2);
    if (core.current) core.current.scale.setScalar(1 + pulse * 0.06);
    if (glowMat.current) glowMat.current.opacity = damp(glowMat.current.opacity, (hovered ? 0.11 : 0.05) + pulse * 0.02, 6, dt);
    if (!reduced) {
      if (halo.current) halo.current.rotation.y += dt * 0.07;
      if (shell.current) shell.current.rotation.y -= dt * 0.12;
    }
    if (light.current) light.current.intensity = damp(light.current.intensity, hovered ? 6.5 : 4, 6, dt);
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; };
  const out = () => { setHovered(false); document.body.style.cursor = ''; };
  const click = (e: ThreeEvent<MouseEvent>) => { if (e.delta > 6) return; e.stopPropagation(); onReset(); };

  return (
    <group onPointerOver={over} onPointerOut={out} onClick={click}>
      {/* Base tier with lit rim and path docks */}
      <mesh position-y={0.09} material={mats.structureDark}><cylinderGeometry args={[2.75, 2.95, 0.18, 72]} /></mesh>
      <mesh position-y={0.185} rotation-x={-Math.PI / 2} material={mats.edge}><ringGeometry args={[2.68, 2.72, 96]} /></mesh>
      {docks.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 2.82, 0.19, Math.sin(a) * 2.82]} rotation-y={-a} material={mats.edge}>
          <boxGeometry args={[0.22, 0.015, 0.09]} />
        </mesh>
      ))}

      {/* Middle tier: glossy panel with fins */}
      <mesh position-y={0.31} material={mats.panel}><cylinderGeometry args={[2.0, 2.15, 0.24, 72]} /></mesh>
      <mesh position-y={0.432} rotation-x={-Math.PI / 2} material={mats.edgeSoft}><ringGeometry args={[1.94, 1.97, 96]} /></mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.68, 0.46, Math.sin(a) * 1.68]} rotation-y={-a} material={mats.structureLight}>
            <boxGeometry args={[0.46, 0.05, 0.07]} />
          </mesh>
        );
      })}

      {/* Hex tier with vertical light ribs at each corner */}
      <mesh position-y={0.56} material={mats.structure}><cylinderGeometry args={[1.22, 1.38, 0.24, 6]} /></mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 1.3, 0.56, Math.cos(a) * 1.3]} material={mats.edgeSoft}>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
          </mesh>
        );
      })}
      <mesh position-y={0.685} rotation-x={-Math.PI / 2} material={mats.edge}><ringGeometry args={[1.14, 1.17, 6, 1, -Math.PI / 2]} /></mesh>

      {/* Core column */}
      <mesh position-y={0.92} material={mats.structureLight}><cylinderGeometry args={[0.2, 0.32, 0.46, 24]} /></mesh>
      <mesh position-y={1.16} material={mats.structure}><cylinderGeometry args={[0.34, 0.34, 0.04, 32]} /></mesh>

      {/* Core + faceted glass shell */}
      <mesh ref={core} position-y={1.62} material={mats.core}><icosahedronGeometry args={[0.26, 1]} /></mesh>
      <group ref={shell} position-y={1.62}>
        <mesh material={mats.glass}>
          <icosahedronGeometry args={[0.5, 0]} />
          <Edges color={palette.ice} threshold={1} />
        </mesh>
      </group>
      <mesh position-y={1.62}>
        <sphereGeometry args={[0.42, 32, 16]} />
        <meshBasicMaterial ref={glowMat} color={palette.signal} transparent opacity={0.05} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Segmented halo, turning slowly */}
      <group ref={halo} position-y={1.62}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i / SEGMENTS) * Math.PI * 2]} material={i % 5 === 0 ? mats.edge : mats.edgeSoft}>
            <torusGeometry args={[0.92, 0.008, 4, 12, (Math.PI * 2) / SEGMENTS - 0.12]} />
          </mesh>
        ))}
      </group>
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
