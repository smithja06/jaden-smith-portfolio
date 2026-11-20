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
  /** One sentence: the station panel intro and the full page's subtitle. */
  summary: string;
  /** Two or three representative highlights for the station panel. */
  highlights: string[];
  /** Set false to keep the summary in the 3D panel but leave it off the full page. */
  showSummaryOnPage?: boolean;
}

export const stations: StationDef[] = [
  {
    id: 'experience',
    letter: '01',
    title: 'Experience',
    category: 'Career timeline',
    tooltip: 'RBC co-op, student design teams, leadership and work history',
    summary: 'Where I’ve worked and led, and what I was responsible for in each role.',
    highlights: [
      'AI / Machine Learning Engineer Co-op at RBC',
      'System Control Subteam Lead, McMaster MED-T',
      'Built the full web app for BMETT’s ACL rehabilitation platform',
    ],
  },
  {
    id: 'projects',
    letter: '02',
    title: 'Projects',
    category: 'Gallery',
    tooltip: 'Featured case studies, more projects and interactive experiments',
    summary: 'Featured case studies first, then more projects, a technical archive and interactive experiments.',
    highlights: [
      'MED-T: a working 4×4 vision-to-output bench prototype',
      'custodyOS: an AI chain-of-custody platform built at the MongoDB Hackathon',
      'BMETT: real-time BLE streaming into an ACL rehabilitation dashboard',
    ],
  },
  {
    id: 'skills',
    letter: '03',
    title: 'Skills',
    category: 'Workstation',
    tooltip: 'Technologies, linked to the work that used them',
    summary: 'The technologies I use, each linked to the projects and roles where I used it.',
    highlights: [
      'Python, TypeScript, React and Java / Spring Boot',
      'ESP32 firmware, OpenCV and embedded protocols',
      'AI agents, RAG and FastAPI backends',
    ],
  },
  {
    id: 'education',
    letter: '04',
    title: 'Education',
    category: 'Research desk',
    tooltip: 'McMaster iBioMed, coursework, awards and earlier schooling',
    summary: 'Electrical & Biomedical Engineering at McMaster, with the coursework and awards behind it.',
    highlights: [
      'McMaster iBioMed · B.Eng. Electrical & Biomedical (Co-op)',
      'GPA 3.9 / 4.0 · expected 2030',
      'McMaster Award of Excellence',
    ],
  },
  {
    id: 'contact',
    letter: '05',
    title: 'Contact',
    category: 'Comms terminal',
    tooltip: 'Email, GitHub and LinkedIn',
    summary: 'Email, GitHub and LinkedIn.',
    highlights: [
      'smithja741@icloud.com',
      'github.com/smithja06',
      'LinkedIn: jaden-smith-577325267',
    ],
    showSummaryOnPage: false,
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
