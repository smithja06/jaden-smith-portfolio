/**
 * "Path so far" on /about: a short story of how the work developed, oldest
 * first. Each milestone is one line; the detail lives on the Experience and
 * Projects pages, linked by id, so the two never repeat each other.
 *
 * DRAFT (Nov 2026): wording and date ranges are inferred from the existing
 * experience and project records, to be refined by the author. Milestones
 * marked `inferred` still need confirming.
 */
export interface Milestone {
  id: string;
  /** Shown above the title, e.g. '2024 – 2025'. */
  date: string;
  title: string;
  /** One sentence. */
  text: string;
  /** Experience ids this milestone points to (role pages). */
  experience?: string[];
  /** Project ids this milestone points to (case studies / archive). */
  projects?: string[];
  /** Marks the milestone that is happening now. */
  current?: boolean;
  /** Date or wording not yet confirmed by the author. */
  inferred?: boolean;
}

export const pathMilestones: Milestone[] = [
  {
    id: 'first-code',
    date: '2023 – 2024',
    title: 'Robotics and my first apps',
    text: 'Led software for my high school’s FIRST Robotics team and built four iOS apps in Swift through an Apple-partnered co-op program.',
    experience: ['first-robotics', 'swift-coop'],
    inferred: true,
  },
  {
    id: 'ibiomed',
    date: '2024 – 2025',
    title: 'Engineering for real patients',
    text: 'Started Electrical & Biomedical Engineering in McMaster’s iBioMed program, where four design projects were each built around a real person’s needs.',
    projects: ['cycle-buddy', 'spinealign-posture-feedback'],
    inferred: true,
  },
  {
    id: 'design-teams',
    date: '2025 – 2026',
    title: 'Student design teams',
    text: 'Joined MED-T and BMETT, writing firmware, vision and web software for assistive and rehabilitation devices, then stepped up to lead MED-T’s system-control subteam.',
    experience: ['med-t', 'bmett'],
    inferred: true,
  },
  {
    id: 'hackathon',
    date: '2026',
    title: 'Shipping under pressure',
    text: 'Built the frontend, custody simulator and voice-agent controls for custodyOS at the MongoDB Hackathon, and pitched the demo.',
    projects: ['custodyos'],
    inferred: true,
  },
  {
    id: 'rbc',
    date: 'Sep 2026 – present',
    title: 'AI and machine learning engineering at RBC',
    text: 'A 12-month co-op building validation tooling, agent-readiness assessments and AI automation, and teaching spec-driven development to engineers.',
    experience: ['rbc'],
    current: true,
    inferred: true,
  },
];
