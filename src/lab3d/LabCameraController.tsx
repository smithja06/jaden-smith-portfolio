import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { stationPosition } from './config/stations';
import { easeInOutCubic } from './materials/labMaterials';

/** Overview viewing direction: ~40° down, looking across the diagonal. */
export const VIEW_DIR = new THREE.Vector3(1, 1.2, 1).normalize();
export const OVERVIEW_POLAR = Math.acos(VIEW_DIR.y);
export const OVERVIEW_AZIMUTH = Math.atan2(VIEW_DIR.x, VIEW_DIR.z);

const UP = new THREE.Vector3(0, 1, 0);
const DURATION = 950; // ms — within the 700–1100ms brief

interface Props {
  focusIndex: number | null;
  zoom: number;
  reduced: boolean;
  /** Desktop: shift the framing so the station sits left of the side panel. */
  panelOnRight: boolean;
  /** Mobile: the bottom sheet covers the lower part of the canvas. */
  panelBelow: boolean;
  /** Desktop overview: the station list occupies the left edge, so frame the ring slightly right. */
  listOnLeft: boolean;
}

function goalFor(focusIndex: number | null, zoom: number, aspect: number, panelOnRight: boolean, panelBelow: boolean, listOnLeft: boolean) {
  const target = new THREE.Vector3();
  const right = new THREE.Vector3().crossVectors(VIEW_DIR.clone().negate(), UP).normalize();
  let dist: number;
  if (focusIndex === null) {
    target.set(0, 0.6, 0);
    if (listOnLeft) target.addScaledVector(right, -2.4);
    // Desktop: aim slightly in front of the hub so near stations clear the bottom edge.
    // Mobile: aim slightly behind it so the far stations clear the toolbar.
    target.add(new THREE.Vector3(VIEW_DIR.x, 0, VIEW_DIR.z).normalize().multiplyScalar(listOnLeft ? 1.6 : -1.2));
    // Fit the whole ring: wide screens are height-limited, tall screens width-limited.
    dist = Math.max(29, (listOnLeft ? 22 : 18.5) / (0.63 * aspect)) * zoom;
  } else {
    const [x, , z] = stationPosition(focusIndex);
    target.set(x, 1.3, z);
    dist = Math.max(14, 7.5 / (0.63 * aspect)) * zoom;
    // Station list sits left and the panel right; nudge so the model lands in the gap.
    if (panelOnRight) target.addScaledVector(right, 1.1);
    if (panelBelow) target.y -= 1.0;
  }
  return { target, position: target.clone().addScaledVector(VIEW_DIR, dist) };
}

/**
 * Guided camera. Every selection animates position + look target together;
 * user orbit (desktop only) is disabled during a transition so the two never fight.
 */
export function LabCameraController({ focusIndex, zoom, reduced, panelOnRight, panelBelow, listOnLeft }: Props) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;
  const lookAt = useRef(new THREE.Vector3());
  const anim = useRef<{ fromP: THREE.Vector3; fromT: THREE.Vector3; toP: THREE.Vector3; toT: THREE.Vector3; start: number } | null>(null);
  const placed = useRef(false);

  useEffect(() => {
    const goal = goalFor(focusIndex, zoom, size.width / Math.max(1, size.height), panelOnRight, panelBelow, listOnLeft);
    const currentTarget = controls ? controls.target : lookAt.current;
    if (!placed.current || reduced) {
      placed.current = true;
      camera.position.copy(goal.position);
      currentTarget.copy(goal.target);
      lookAt.current.copy(goal.target);
      camera.lookAt(goal.target);
      controls?.update();
      anim.current = null;
      return;
    }
    anim.current = {
      fromP: camera.position.clone(),
      fromT: currentTarget.clone(),
      toP: goal.position,
      toT: goal.target,
      start: performance.now(),
    };
    if (controls) controls.enabled = false;
  }, [focusIndex, zoom, size.width, size.height, panelOnRight, panelBelow, listOnLeft, reduced, camera, controls]);

  useFrame(() => {
    const a = anim.current;
    if (!a) return;
    const k = Math.min(1, (performance.now() - a.start) / DURATION);
    const e = easeInOutCubic(k);
    camera.position.lerpVectors(a.fromP, a.toP, e);
    lookAt.current.lerpVectors(a.fromT, a.toT, e);
    if (controls) {
      controls.target.copy(lookAt.current);
      controls.update();
    } else {
      camera.lookAt(lookAt.current);
    }
    if (k >= 1) {
      anim.current = null;
      if (controls) controls.enabled = true;
    }
  });

  return null;
}
