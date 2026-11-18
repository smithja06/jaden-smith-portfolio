import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stations, stationPosition, type StationId } from './config/stations';
import { damp, palette } from './materials/labMaterials';

const HUB_EDGE = 2.95;
const PAD_EDGE = 2.2;

interface Props {
  selected: StationId | null;
  hovered: StationId | null;
  reduced: boolean;
}

/** Thin radial floor paths hub → station, each carrying an occasional pulse. */
export function SignalPaths({ selected, hovered, reduced }: Props) {
  const paths = useMemo(() => stations.map((s, i) => {
    const [x, , z] = stationPosition(i);
    const angle = Math.atan2(z, x);
    const dist = Math.hypot(x, z);
    const length = dist - HUB_EDGE - PAD_EDGE;
    const mid = HUB_EDGE + length / 2;
    return { id: s.id, angle, length, mid, dir: new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)) };
  }), []);

  // One material per path so selection can brighten just that path.
  const lineMats = useMemo(() => paths.map(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(palette.ice).multiplyScalar(1.2), transparent: true, opacity: 0.2, toneMapped: false, depthWrite: false,
  })), [paths]);
  const pulseMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.white).multiplyScalar(2), toneMapped: false }), []);
  useEffect(() => () => { lineMats.forEach((m) => m.dispose()); pulseMat.dispose(); }, [lineMats, pulseMat]);

  const pulses = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    paths.forEach((p, i) => {
      const target = p.id === selected ? 0.95 : p.id === hovered ? 0.5 : selected ? 0.1 : 0.2;
      lineMats[i].opacity = reduced ? target : damp(lineMats[i].opacity, target, 5, dt);

      const pulse = pulses.current[i];
      if (!pulse) return;
      if (reduced) { pulse.visible = false; return; }
      // Each path fires a pulse every few seconds, offset so they don't sync up.
      const speed = p.id === selected ? 0.75 : 0.32;
      const cycle = (t * speed + i * 0.61) % 2.4;
      pulse.visible = cycle < 1;
      if (pulse.visible) {
        // travel outward from the hub toward the station
        const r = HUB_EDGE + cycle * p.length;
        pulse.position.set(p.dir.x * r, 0.03, p.dir.z * r);
      }
    });
  });

  return (
    <group>
      {paths.map((p, i) => (
        <group key={p.id}>
          <mesh
            position={[p.dir.x * p.mid, 0.012, p.dir.z * p.mid]}
            rotation={[-Math.PI / 2, 0, -p.angle]}
            material={lineMats[i]}
          >
            <planeGeometry args={[p.length, p.id === selected ? 0.07 : 0.045]} />
          </mesh>
          <mesh ref={(el) => { pulses.current[i] = el; }} material={pulseMat} visible={false}>
            <sphereGeometry args={[0.055, 10, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
