import type * as THREE from 'three';
import { mats } from './materials/labMaterials';

/**
 * Installation pads. All share one language — a dark base slab, a slightly
 * inset upper tier, and a lit channel that follows the outline — but each
 * station gets its own footprint and one small detail, so platforms read as
 * custom without competing with the objects on top.
 */
export type PadVariant = 'disc' | 'octagon' | 'hexagon' | 'square' | 'tiered' | 'radar';

// Cylinder vertices start at +z; ring vertices start at +x. This offset aligns them.
const RING_ALIGN = -Math.PI / 2;

interface Props {
  variant: PadVariant;
  /** Animated edge material (brightens on hover / selection). */
  ring: THREE.Material;
}

function Outline({ r, w, segs, y, material, rot = 0 }: { r: number; w: number; segs: number; y: number; material: THREE.Material; rot?: number }) {
  return (
    <mesh position-y={y} rotation={[-Math.PI / 2, 0, rot]} material={material}>
      <ringGeometry args={[r - w, r, segs, 1, RING_ALIGN]} />
    </mesh>
  );
}

function Slabs({ segs, r, rot = 0 }: { segs: number; r: number; rot?: number }) {
  return (
    <group rotation-y={rot}>
      <mesh position-y={0.05} material={mats.structureDark}><cylinderGeometry args={[r, r + 0.12, 0.1, segs]} /></mesh>
      <mesh position-y={0.125} material={mats.padTop}><cylinderGeometry args={[r - 0.2, r - 0.12, 0.05, segs]} /></mesh>
    </group>
  );
}

export function StationPad({ variant, ring }: Props) {
  switch (variant) {
    // About — round, with a front arc that frames the portrait.
    case 'disc':
      return (
        <group>
          <Slabs segs={64} r={2.0} />
          <Outline r={1.9} w={0.035} segs={64} y={0.152} material={ring} />
          <mesh position-y={0.153} rotation-x={-Math.PI / 2} material={mats.edgeSoft}>
            <ringGeometry args={[1.3, 1.33, 48, 1, Math.PI * 0.15, Math.PI * 0.7]} />
          </mesh>
        </group>
      );
    // Experience — octagon with a raised rear plinth for the racks.
    case 'octagon':
      return (
        <group>
          <Slabs segs={8} r={2.1} rot={Math.PI / 8} />
          <Outline r={1.98} w={0.035} segs={8} y={0.152} material={ring} rot={Math.PI / 8} />
          <mesh position={[0, 0.2, -0.75]} material={mats.structureDark}><boxGeometry args={[2.4, 0.1, 1.1]} /></mesh>
          <mesh position={[0, 0.252, -0.2]} material={mats.edgeSoft}><boxGeometry args={[2.4, 0.005, 0.02]} /></mesh>
        </group>
      );
    // Projects — hexagon with a shallow front step.
    case 'hexagon':
      return (
        <group>
          <Slabs segs={6} r={2.15} rot={Math.PI / 6} />
          <Outline r={2.02} w={0.035} segs={6} y={0.152} material={ring} rot={Math.PI / 6} />
          <Outline r={1.4} w={0.012} segs={6} y={0.152} material={mats.edgeSoft} rot={Math.PI / 6} />
          <mesh position={[0, 0.035, 2.05]} material={mats.structure}><boxGeometry args={[1.1, 0.07, 0.3]} /></mesh>
        </group>
      );
    // Skills — square workshop floor with corner anchors.
    case 'square':
      return (
        <group>
          <Slabs segs={4} r={2.35} rot={Math.PI / 4} />
          <Outline r={2.2} w={0.035} segs={4} y={0.152} material={ring} rot={Math.PI / 4} />
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x * 1.32, 0.17, z * 1.32]} material={mats.structureLight}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
            </mesh>
          ))}
        </group>
      );
    // Education — round, two-tier, with a half-arc reading light channel.
    case 'tiered':
      return (
        <group>
          <Slabs segs={64} r={2.05} />
          <mesh position-y={0.18} material={mats.structureDark}><cylinderGeometry args={[1.45, 1.5, 0.06, 64]} /></mesh>
          <Outline r={1.95} w={0.035} segs={64} y={0.152} material={ring} />
          <mesh position-y={0.212} rotation-x={-Math.PI / 2} material={mats.edgeSoft}>
            <ringGeometry args={[1.38, 1.41, 48, 1, 0, Math.PI]} />
          </mesh>
        </group>
      );
    // Contact — circular with concentric "radar" rings.
    case 'radar':
      return (
        <group>
          <Slabs segs={64} r={2.05} />
          <Outline r={1.95} w={0.035} segs={64} y={0.152} material={ring} />
          {[1.55, 1.15, 0.75].map((r) => <Outline key={r} r={r} w={0.01} segs={64} y={0.153} material={mats.edgeSoft} />)}
        </group>
      );
  }
}
