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
  floor: new THREE.MeshStandardMaterial({ color: '#040918', metalness: 0.1, roughness: 0.95 }),
  /** Main body: dark matte metal. */
  structure: new THREE.MeshStandardMaterial({ color: '#1a2f5c', metalness: 0.62, roughness: 0.46 }),
  /** Bases and recesses. */
  structureDark: new THREE.MeshStandardMaterial({ color: '#0a1430', metalness: 0.5, roughness: 0.62 }),
  /** Highlights / trims: lighter brushed metal. */
  structureLight: new THREE.MeshStandardMaterial({ color: '#3a5893', metalness: 0.72, roughness: 0.3 }),
  /** Pad tops: dark, low-sheen so platforms never outshine the stations. */
  padTop: new THREE.MeshStandardMaterial({ color: '#0b1631', metalness: 0.3, roughness: 0.7 }),
  /** Slightly glossy blue-black panels (screens off, tabletops, covers). */
  panel: new THREE.MeshPhysicalMaterial({ color: '#0c1733', metalness: 0.35, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
  /** Soft matte "plastic" parts (books, cable sheaths, keycaps). */
  matte: new THREE.MeshStandardMaterial({ color: '#22396b', metalness: 0.1, roughness: 0.75 }),
  /** Translucent glass (screen covers, enclosures). */
  glass: new THREE.MeshPhysicalMaterial({
    color: '#9cc3ff', metalness: 0, roughness: 0.08, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide,
  }),
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
