import type { Metric } from './types';

export interface School {
  id: string;
  institution: string;
  location: string;
  /** Program name, e.g. 'Integrated Biomedical Engineering & Health Sciences (iBioMed)'. */
  program?: string;
  credential: string;
  dates: string;
  stats: Metric[];
  summary: string;
  /** Project ids done as part of this program. */
  projects?: string[];
  /** Experience ids (student teams, clubs) from this period. */
  teams?: string[];
}

export const schools: School[] = [
  {
    id: 'mcmaster',
    institution: 'McMaster University',
    location: 'Hamilton, Ontario',
    program: 'Integrated Biomedical Engineering & Health Sciences (iBioMed)',
    credential: 'Bachelor of Engineering — Electrical Engineering & Biomedical Engineering (Co-op)',
    dates: '2024 – 2030 (expected)',
    stats: [
      { value: '3.9 / 4.0', label: 'GPA' },
      { value: '2030', label: 'Expected graduation' },
    ],
    summary:
      'Electrical and biomedical engineering with a co-op stream — software, AI / ML, circuits and electronics, embedded systems, biomedical devices and human-centered design.',
    projects: ['spinealign-posture-feedback', 'cycle-buddy', 'ostoflow', 'hip-implant-design-case'],
    teams: ['med-t', 'bmett'],
  },
  {
    id: 'cathedral',
    institution: 'Cathedral High School',
    location: 'Hamilton, Ontario',
    credential: 'Ontario Secondary School Diploma',
    dates: 'Class of 2024',
    stats: [{ value: '98%', label: 'Graduating average' }],
    summary: 'Graduated with a 98% average while leading the FIRST Robotics software team and serving as president and chair of the Gael Guides leadership group.',
    teams: ['first-robotics', 'gael-guides'],
  },
];

export interface Award {
  title: string;
  detail?: string;
  school: 'mcmaster' | 'cathedral' | 'other';
  /** 'received' = awarded. 'candidate' = nominated / shortlisted only, never a recipient. */
  kind: 'received' | 'candidate' | 'certification';
}

export const awards: Award[] = [
  { title: 'McMaster Award of Excellence', school: 'mcmaster', kind: 'received' },
  { title: 'Dean’s Honour List', detail: '2 times', school: 'mcmaster', kind: 'received' },
  { title: 'Director’s Award of Excellence', detail: '4 times', school: 'cathedral', kind: 'received' },
  { title: 'Certificate of Distinction', school: 'cathedral', kind: 'received' },
  { title: 'St. Albertus Magnus Science Award', school: 'cathedral', kind: 'received' },
  { title: 'Carl & Rose Rocky Memorial Award', school: 'cathedral', kind: 'received' },
  { title: 'FIRST Robotics Award', school: 'cathedral', kind: 'received' },
  { title: 'Loran Scholarship', detail: 'Candidate', school: 'other', kind: 'candidate' },
  { title: 'Schulich Leader Scholarship', detail: 'Candidate', school: 'other', kind: 'candidate' },
  { title: 'DELF B2 — French', detail: '83%', school: 'other', kind: 'certification' },
];

/**
 * One coursework entry. A plain string is a topic title; use the object form
 * when official details are known. Only populated fields are displayed.
 */
export type CourseTopic =
  | string
  | {
      title: string;
      /**
       * Official course code, shown after the title. Never invent one: until
       * the official list arrives these are placeholders in the form
       * 'MOCK ####' (see MOCK_CODE), which a test reports.
       */
      code?: string;
      /** One short line, if it adds something the title doesn't. */
      description?: string;
      /** Omit for completed coursework. 'planned' is kept in data but not displayed. */
      status?: 'in-progress' | 'planned';
      /** Kept as a record but not shown in Relevant coursework. */
      hidden?: boolean;
    };

/** Placeholder course codes, to be replaced with official ones. */
export const MOCK_CODE = /^MOCK \d{4}$/;

export interface CourseArea {
  id: string;
  label: string;
  topics: CourseTopic[];
  /** Project ids that came out of this area (shown once, as "Related work"). */
  projects?: string[];
}

/**
 * Relevant coursework by discipline. Rendered in content-height columns, so
 * any number of areas and topics lays out without stretched or empty cells.
 */
export const coursework: CourseArea[] = [
  {
    id: 'software',
    label: 'Software & algorithms',
    topics: [
      { title: 'Data Structures and Algorithms', code: 'MOCK 1001' },
      { title: 'Python programming', code: 'MOCK 1002' },
      { title: 'Data integration', code: 'MOCK 1003' },
    ],
  },
  {
    // Formerly two areas: "Electrical engineering" and "Electronics & circuits".
    id: 'electrical',
    label: 'Electrical engineering & circuits',
    topics: [
      { title: 'Circuits & Systems', code: 'MOCK 2001' },
      { title: 'Microelectronics', code: 'MOCK 2002' },
      { title: 'Microcontroller systems and serial communication', code: 'MOCK 2003' },
      // Lab topics below move to their project archive entries once the official list arrives.
      'CMOS transmission gates and CD4007 switching',
      'Op-amp integrators and differentiators',
      'Rectifier and power-supply design',
      'Analog measurement',
    ],
    projects: ['cmos-transmission-gate', 'center-tap-power-supply', 'op-amp-integrator-differentiator'],
  },
  {
    id: 'math',
    label: 'Mathematics & statistics',
    topics: [
      { title: 'Probability and statistics', code: 'MOCK 3001' },
      { title: 'Numerical methods in MATLAB', code: 'MOCK 3002' },
    ],
  },
  {
    // Formerly two areas: "Engineering design" and "Biomedical engineering".
    id: 'biomedical',
    label: 'Biomedical engineering & design',
    topics: [
      { title: 'iBioMed design projects (DP-3, DP-4)', code: 'MOCK 4001' },
      { title: 'Prototyping and CAD', code: 'MOCK 4002' },
      { title: 'Assistive technology', code: 'MOCK 4003' },
      { title: 'Rehabilitation', code: 'MOCK 4004' },
      { title: 'Designing for patient needs', code: 'MOCK 4005' },
      { title: 'Implant design', code: 'MOCK 4006' },
    ],
    projects: ['spinealign-posture-feedback', 'cycle-buddy', 'hip-implant-design-case', 'ostoflow'],
  },
];
