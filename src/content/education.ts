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
  { title: 'Director’s Award of Excellence', detail: '4 times', school: 'cathedral', kind: 'received' },
  { title: 'Certificate of Distinction', school: 'cathedral', kind: 'received' },
  { title: 'St. Albertus Magnus Science Award', school: 'cathedral', kind: 'received' },
  { title: 'Carl & Rose Rocky Memorial Award', school: 'cathedral', kind: 'received' },
  { title: 'FIRST Robotics Award', school: 'cathedral', kind: 'received' },
  { title: 'Loran Scholarship', detail: 'Candidate', school: 'other', kind: 'candidate' },
  { title: 'Schulich Leader Scholarship', detail: 'Candidate', school: 'other', kind: 'candidate' },
  { title: 'DELF B2 — French', detail: '83%', school: 'other', kind: 'certification' },
];

export interface CourseArea {
  id: string;
  label: string;
  topics: string[];
  /** Project ids that came out of this area. */
  projects?: string[];
}

export const coursework: CourseArea[] = [
  {
    id: 'software',
    label: 'Software & algorithms',
    topics: ['Data Structures and Algorithms', 'Python programming', 'Data integration'],
  },
  {
    id: 'electrical',
    label: 'Electrical engineering',
    topics: ['Circuits & Systems', 'Microelectronics', 'Microcontroller systems and serial communication'],
    projects: ['cmos-transmission-gate'],
  },
  {
    id: 'electronics',
    label: 'Electronics & circuits',
    topics: ['CMOS transmission gates and CD4007 switching', 'Op-amp integrators and differentiators', 'Rectifier and power-supply design', 'Analog measurement'],
    projects: ['cmos-transmission-gate', 'center-tap-power-supply', 'op-amp-integrator-differentiator'],
  },
  {
    id: 'math',
    label: 'Mathematics & statistics',
    topics: [
      'Probability and statistics: distributions, sampling, confidence intervals, hypothesis tests, power, chi-square, regression, ANOVA',
      'Numerical methods in MATLAB',
    ],
  },
  {
    id: 'design',
    label: 'Engineering design',
    topics: ['iBioMed design projects (DP-3, DP-4)', 'Prototyping and CAD'],
    projects: ['spinealign-posture-feedback', 'cycle-buddy'],
  },
  {
    id: 'biomedical',
    label: 'Biomedical engineering',
    topics: ['Assistive technology', 'Rehabilitation', 'Designing for patient needs', 'Implant design'],
    projects: ['hip-implant-design-case', 'ostoflow'],
  },
  {
    id: 'analysis',
    label: 'Other engineering analysis',
    topics: [
      'Materials testing',
      'Cost accounting, budgeting and financial statements (course exposure)',
    ],
  },
];
