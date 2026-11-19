import { TODO_USER_CONTENT, type Maybe } from './types';
import { education } from './education';

export interface TimelineEntry {
  kind: 'education' | 'work' | 'team';
  title: string;
  org: string;
  /** Only real dates. Hidden while TODO. */
  period: Maybe<string>;
  description: string;
  /** Case-study slug for related work, if any. */
  project?: string;
  /** Specific, verified responsibilities/outcomes. Rendered as bullets when provided. */
  highlights?: string[];
}

/**
 * Wording is intentionally general until exact titles and dates are confirmed.
 */
export const timeline: TimelineEntry[] = [
  {
    kind: 'education',
    title: education.program,
    org: education.school,
    period: education.period,
    description: education.summary,
  },
  {
    kind: 'work',
    title: 'AI / Software Developer (Co-op)',
    org: 'RBC',
    period: TODO_USER_CONTENT,
    description:
      'Professional software work focused on developer tooling and AI-assisted engineering workflows. Described here at a public, non-confidential level.',
    project: 'ai-developer-tooling',
  },
  {
    kind: 'team',
    title: 'System Control',
    org: 'MED-T',
    period: TODO_USER_CONTENT,
    description:
      'Involvement and leadership on the system-control side of a sensory-substitution prototype: turning image-derived states into a small LED/tactile output.',
    project: 'med-t-sensory-substitution',
  },
  {
    kind: 'team',
    title: 'Software',
    org: 'BMETT',
    period: TODO_USER_CONTENT,
    description:
      'Software contributions to an ACL-rehabilitation technology project exploring sensor data pipelines and companion-app concepts.',
    project: 'bmett-acl-rehabilitation',
  },
];

export const practiceAreas = [
  {
    title: 'AI & developer tooling',
    body: 'Making engineers faster and calmer: tooling, workflows, and AI assistance that fits how people already work.',
  },
  {
    title: 'Embedded & sensor systems',
    body: 'Microcontrollers, sensors, and the messy edge between a signal and a decision.',
  },
  {
    title: 'Front-end & product engineering',
    body: 'Interfaces that explain themselves — from data-heavy tools to playful commerce experiments.',
  },
  {
    title: 'Biomedical applications',
    body: 'Human-centered prototypes for rehabilitation, posture, and sensory substitution.',
  },
];

export const approach = [
  { step: 'Understand', body: 'Who is this for, and what does “working” mean in their context?' },
  { step: 'Prototype', body: 'Build the smallest thing that can be wrong in an interesting way.' },
  { step: 'Test', body: 'Put it in front of real signals, real hardware, real people.' },
  { step: 'Iterate', body: 'Keep what earns its place; cut what doesn’t.' },
  { step: 'Communicate', body: 'Explain the tradeoffs clearly enough that others can build on it.' },
];
