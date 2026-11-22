import { useState, type ComponentType } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { stations, stationPosition, type StationId } from './config/stations';
import { LabEnvironment } from './LabEnvironment';
import { CentralHub } from './CentralHub';
import { SignalPaths } from './SignalPaths';
import { Station, type StationVisualProps } from './Station';
import type { PadVariant } from './StationPad';
import { LabCameraController, OVERVIEW_AZIMUTH, OVERVIEW_POLAR } from './LabCameraController';
import { ProjectsStation } from './stations/ProjectsStation';
import { ExperienceStation } from './stations/ExperienceStation';
import { SkillsStation } from './stations/SkillsStation';
import { EducationStation } from './stations/EducationStation';
import { ContactStation } from './stations/ContactStation';
import { AboutStation } from './stations/AboutStation';

const pads: Record<StationId, PadVariant> = {
  about: 'disc',
  experience: 'octagon',
  projects: 'hexagon',
  skills: 'square',
  education: 'tiered',
  contact: 'radar',
};

const visuals: Record<StationId, ComponentType<StationVisualProps>> = {
  about: AboutStation,
  projects: ProjectsStation,
  experience: ExperienceStation,
  skills: SkillsStation,
  education: EducationStation,
  contact: ContactStation,
};

export interface LabSceneProps {
  selected: StationId | null;
  hovered: StationId | null;
  onHover: (id: StationId | null) => void;
  onSelect: (id: StationId) => void;
  onHome: () => void;
  /** True while flying to the hub on the way home. */
  hubSelected: boolean;
  reduced: boolean;
  highQuality: boolean;
  zoom: number;
  isDesktop: boolean;
  paused: boolean;
}

export default function LabScene(p: LabSceneProps) {
  const maxDpr = p.highQuality ? Math.min(1.75, window.devicePixelRatio || 1) : 1;
  const [dpr, setDpr] = useState(maxDpr);
  const focusIndex = p.hubSelected ? 'hub' as const : p.selected ? stations.findIndex((s) => s.id === p.selected) : null;

  return (
    <Canvas
      dpr={Math.min(dpr, maxDpr)}
      frameloop={p.paused ? 'never' : 'always'}
      camera={{ fov: 35, near: 0.5, far: 220, position: [24, 28, 24] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      aria-hidden="true"
    >
      {/* Real measurement: lowers resolution when the frame rate drops. Nothing is displayed. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      <LabEnvironment highQuality={p.highQuality} />
      <CentralHub reduced={p.reduced} onHome={p.onHome} showLabel={p.isDesktop} />
      <SignalPaths selected={p.selected} hovered={p.hovered} reduced={p.reduced} />

      {stations.map((s, i) => {
        const Visual = visuals[s.id];
        return (
          <Station
            key={s.id}
            def={s}
            position={stationPosition(i)}
            pad={pads[s.id]}
            hovered={p.hovered === s.id}
            selected={p.selected === s.id}
            anySelected={p.selected !== null}
            reduced={p.reduced}
            compactLabels={!p.isDesktop}
            onHover={p.onHover}
            onSelect={p.onSelect}
          >
            {(v) => <Visual {...v} />}
          </Station>
        );
      })}

      {p.isDesktop && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.45}
          minPolarAngle={OVERVIEW_POLAR - 0.3}
          maxPolarAngle={OVERVIEW_POLAR + 0.22}
          minAzimuthAngle={OVERVIEW_AZIMUTH - 0.75}
          maxAzimuthAngle={OVERVIEW_AZIMUTH + 0.75}
        />
      )}
      <LabCameraController
        focusIndex={focusIndex}
        zoom={p.zoom}
        reduced={p.reduced}
        panelOnRight={false}
        listOnLeft={p.isDesktop}
        panelBelow={false}
      />

      {p.highQuality && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.95} luminanceSmoothing={0.15} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
