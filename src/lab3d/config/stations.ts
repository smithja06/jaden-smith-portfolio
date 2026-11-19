/**
 * Station metadata — shared by the 3D world, the HTML station list, and the
 * non-WebGL fallback. No three.js imports here, so it stays out of the
 * homepage bundle.
 *
 * Each station owns one kind of content and opens its own full page at
 * /lab/<id>, so nothing is repeated between them.
 */

export type StationId = 'experience' | 'projects' | 'skills' | 'education' | 'contact';

export interface StationDef {
  id: StationId;
  /** Two-digit index shown in labels and the section pager, e.g. '01'. */
  letter: string;
  title: string;
  category: string;
  /** One line shown on hover / in the station list. */
  tooltip: string;
  /** Short paragraph at the top of the station panel. */
  summary: string;
}

export const stations: StationDef[] = [
  {
    id: 'experience',
    letter: '01',
    title: 'Experience',
    category: 'Career timeline',
    tooltip: 'Professional roles and student teams',
    summary: 'Where I’ve worked, the student design teams I’ve contributed to, and what I was responsible for.',
  },
  {
    id: 'projects',
    letter: '02',
    title: 'Projects',
    category: 'Gallery',
    tooltip: 'Prototypes, case studies and live demos',
    summary: 'Every project with a full case study, plus interactive prototypes that run in your browser.',
  },
  {
    id: 'skills',
    letter: '03',
    title: 'Skills',
    category: 'Workstation',
    tooltip: 'Technologies, grouped by what they’re for',
    summary: 'Tools and techniques, grouped by capability.',
  },
  {
    id: 'education',
    letter: '04',
    title: 'Education',
    category: 'Research desk',
    tooltip: 'McMaster studies, coursework and achievements',
    summary: 'Academic background — the engineering foundation under the projects.',
  },
  {
    id: 'contact',
    letter: '05',
    title: 'Contact',
    category: 'Comms terminal',
    tooltip: 'Contact links and résumé',
    summary: 'The quickest ways to get in touch.',
  },
];

/** Full-page route for each station. */
export const stationPath = (id: StationId) => `/lab/${id}`;

export const stationById = (id: string | null | undefined) => stations.find((s) => s.id === id) ?? null;

/** Radial layout around the hub (world units). Starts at the far side of the overview. */
export const STATION_RADIUS = 7.4;
export function stationPosition(index: number): [number, number, number] {
  const angle = (-3 * Math.PI) / 4 + (index * 2 * Math.PI) / stations.length;
  return [Math.cos(angle) * STATION_RADIUS, 0, Math.sin(angle) * STATION_RADIUS];
}

export type ExperimentId = 'vision-matrix' | 'signal-playground';

export const experiments: { id: ExperimentId; title: string; blurb: string; route: string; project: string }[] = [
  {
    id: 'vision-matrix',
    title: 'Vision → 4×4 Matrix',
    blurb: 'Reduce a brightness field to sixteen output levels — threshold or four-level quantization, smoothing, ramping, or your own image.',
    route: '/lab/vision-matrix',
    project: 'MED-T',
  },
  {
    id: 'signal-playground',
    title: 'Signal Playground',
    blurb: 'Add noise to a waveform, filter it with a moving average, and compare raw vs smoothed with computed readouts.',
    route: '/lab/signal-playground',
    project: 'BMETT / SpineAlign sensing',
  },
];
