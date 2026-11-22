import { useEffect, useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { StationDef, StationId } from './config/stations';
import { damp, makeAccent, makeRing, mats } from './materials/labMaterials';
import { StationPad, type PadVariant } from './StationPad';

export interface StationVisualProps {
  accent: THREE.MeshStandardMaterial;
  reduced: boolean;
  active: boolean;
}

interface Props {
  def: StationDef;
  position: [number, number, number];
  pad: PadVariant;
  hovered: boolean;
  selected: boolean;
  anySelected: boolean;
  reduced: boolean;
  compactLabels: boolean;
  onHover: (id: StationId | null) => void;
  onSelect: (id: StationId) => void;
  children: (p: StationVisualProps) => ReactNode;
}

/**
 * Shared shell for every installation: platform pad with a lit edge, an
 * invisible enlarged hit volume (friendly to touch), hover/selection glow,
 * and a DOM label. Installations face the overview camera so each reads as
 * part of one architectural model.
 */
export function Station({
  def, position, pad, hovered, selected, anySelected, reduced, compactLabels, onHover, onSelect, children,
}: Props) {
  const accent = useMemo(makeAccent, []);
  const ring = useMemo(makeRing, []);
  useEffect(() => () => { accent.dispose(); ring.dispose(); }, [accent, ring]);

  useFrame((_, dt) => {
    const glow = selected ? 1.25 : hovered ? 0.95 : anySelected ? 0.18 : 0.38;
    const edge = selected ? 0.95 : hovered ? 0.8 : anySelected ? 0.15 : 0.38;
    accent.emissiveIntensity = reduced ? glow : damp(accent.emissiveIntensity, glow, 7, dt);
    ring.opacity = reduced ? edge : damp(ring.opacity, edge, 7, dt);
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(def.id); document.body.style.cursor = 'pointer'; };
  const out = () => { onHover(null); document.body.style.cursor = ''; };
  const click = (e: ThreeEvent<MouseEvent>) => {
    // Ignore clicks that were really drags (prevents accidental selection while orbiting).
    if (e.delta > 6) return;
    e.stopPropagation();
    onSelect(def.id);
  };

  return (
    <group position={position} rotation-y={Math.PI / 4}>
      <group onPointerOver={over} onPointerOut={out} onClick={click}>
        <StationPad variant={pad} ring={ring} />
        {children({ accent, reduced, active: selected || hovered })}
        {/* Generous invisible hit volume so small details aren't required targets. */}
        <mesh position-y={1.3} material={mats.hit}><cylinderGeometry args={[2.2, 2.2, 2.6, 16]} /></mesh>
      </group>

      <Html position={[0, 0.2, 2.45]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`lab3d-label ${hovered || selected ? 'is-hovered' : ''} ${anySelected && !selected ? 'is-dim' : ''}`} aria-hidden="true">
          <span className="lab3d-label-head">
            <span className="lab3d-letter">{def.letter}</span>
            {!compactLabels && <span>{def.title}</span>}
          </span>
          {hovered && !selected && !compactLabels && <span className="lab3d-label-tip">{def.tooltip}</span>}
        </div>
      </Html>
    </group>
  );
}
