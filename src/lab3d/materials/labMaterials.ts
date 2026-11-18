import * as THREE from 'three';

export const palette = {
  bg: '#060D20',
  navy: '#0B1F45',
  cobalt: '#155EEF',
  signal: '#2F8CFF',
  ice: '#80B9FF',
  white: '#F5F8FF',
};

/** Colour pushed above 1.0 so it reaches the (restrained) bloom threshold. */
const hot = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);

/**
 * Shared, module-level materials. They live for the app's lifetime and are
 * reused by every station, so they are intentionally never disposed.
 */
export const mats = {
  floor: new THREE.MeshStandardMaterial({ color: '#050b1c', metalness: 0.2, roughness: 0.92 }),
  structure: new THREE.MeshStandardMaterial({ color: '#15284f', metalness: 0.78, roughness: 0.36 }),
  structureDark: new THREE.MeshStandardMaterial({ color: '#081128', metalness: 0.55, roughness: 0.6 }),
  structureLight: new THREE.MeshStandardMaterial({ color: '#2a4478', metalness: 0.7, roughness: 0.3 }),
  edge: new THREE.MeshBasicMaterial({ color: hot(palette.ice, 1.5), toneMapped: false }),
  edgeSoft: new THREE.MeshBasicMaterial({ color: palette.ice, transparent: true, opacity: 0.3, toneMapped: false, depthWrite: false }),
  core: new THREE.MeshBasicMaterial({ color: hot(palette.signal, 1.6), toneMapped: false }),
  glow: new THREE.MeshBasicMaterial({ color: palette.signal, transparent: true, opacity: 0.12, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending }),
  holo: new THREE.MeshStandardMaterial({
    color: palette.ice, emissive: palette.cobalt, emissiveIntensity: 0.45,
    transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide,
  }),
  screen: new THREE.MeshStandardMaterial({ color: '#050b1c', emissive: '#0b1f45', emissiveIntensity: 0.6, roughness: 0.25, metalness: 0.2 }),
  white: new THREE.MeshBasicMaterial({ color: hot(palette.white, 1.4), toneMapped: false }),
  ledOff: new THREE.MeshStandardMaterial({ color: '#0d1834', roughness: 0.4, metalness: 0.3 }),
  hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
};

/** Per-station accent material whose glow is animated on hover / selection. */
export function makeAccent() {
  return new THREE.MeshStandardMaterial({
    color: '#1d3f86', emissive: palette.signal, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.32,
  });
}

/** Per-station edge-ring material whose opacity is animated. */
export function makeRing() {
  return new THREE.MeshBasicMaterial({ color: hot(palette.ice, 1.3), transparent: true, opacity: 0.35, toneMapped: false, depthWrite: false });
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Frame-rate independent approach: move `a` toward `b` with time constant `rate`. */
export const damp = (a: number, b: number, rate: number, dt: number) => a + (b - a) * (1 - Math.exp(-rate * dt));
