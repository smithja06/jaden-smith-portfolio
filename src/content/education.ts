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
       * Official course code, shown after the title. Never invent one; a
       * placeholder must use the form 'MOCK ####' (see MOCK_CODE), which a
       * test rejects.
       */
      code?: string;
      /** One short line, if it adds something the title doesn't. */
      description?: string;
      /** Omit for completed coursework. 'planned' is kept in data but not displayed. */
      status?: 'in-progress' | 'planned';
      /** Kept as a record but not shown in Relevant coursework. */
      hidden?: boolean;
    };

/** Placeholder course-code form. None should remain: a test fails on any. */
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
      { title: 'Data Structures and Algorithms', code: 'COMPENG 2SI3' },
      { title: 'Principles of Programming (C/C++)', code: 'COMPENG 2SH4' },
      { title: 'Python Programming', code: 'IBEHS 1P10' },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical engineering & circuits',
    topics: [
      { title: 'Introduction to Circuit Analysis', code: 'ELECENG 2CI4' },
      { title: 'Circuits & Systems', code: 'ELECENG 2CJ4' },
      { title: 'Electronic Devices and Circuits I', code: 'ELECENG 2EI4' },
      { title: 'Electromagnetics I', code: 'ELECENG 2FH4' },
    ],
    projects: ['cmos-transmission-gate', 'center-tap-power-supply', 'op-amp-integrator-differentiator'],
  },
  {
    id: 'math',
    label: 'Mathematics & statistics',
    topics: [
      { title: 'Engineering Mathematics II (Linear Algebra)', code: 'MATH 1ZC3' },
      { title: 'Engineering Mathematics III', code: 'MATH 2Z03' },
      { title: 'Statistical Methods in Biomedical Engineering', code: 'IBEHS 3S03' },
    ],
  },
  {
    id: 'biomedical',
    label: 'Biomedical engineering & design',
    topics: [
      { title: 'iBioMed Design Projects', code: 'IBEHS 1P10' },
      { title: 'Design Projects II — Genetic Engineering', code: 'IBEHS 2PB2 / 2PA2' },
    ],
    projects: ['spinealign-posture-feedback', 'cycle-buddy', 'hip-implant-design-case', 'ostoflow'],
  },
];
