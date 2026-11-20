/**
 * Marker for facts or links that have not been supplied yet.
 * Any field holding this value is hidden by the UI, never rendered.
 * Search the codebase for TODO_USER_CONTENT to find everything still missing.
 */
export const TODO_USER_CONTENT = 'TODO_USER_CONTENT' as const;
export type Todo = typeof TODO_USER_CONTENT;
export type Maybe<T> = T | Todo;

export function isProvided<T>(value: Maybe<T> | undefined | null): value is T {
  if (value === undefined || value === null || value === TODO_USER_CONTENT || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/** A reported number. `note` explains how it was measured. */
export interface Metric {
  value: string;
  label: string;
  note?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
}

export interface Decision {
  title: string;
  body: string;
}

/**
 * Evidence links. Put TODO_USER_CONTENT in a slot when the item exists
 * but the URL hasn't been supplied; the slot stays hidden until it holds a real URL.
 * External URLs must start with https://; internal files start with "/".
 */
export interface Evidence {
  repo?: Maybe<string>;
  demo?: Maybe<string>;
  video?: Maybe<string>;
  report?: Maybe<string>;
  /** Anything else, e.g. { label: 'Pitch deck', href: '…' }. */
  other?: { label: string; href: Maybe<string> }[];
}

export type MediaKind = 'image' | 'video' | 'diagram' | 'pdf';

/**
 * Photos, screenshots, videos, diagrams or PDFs. Files go in
 * /public/media/projects/<project-id>/ and `src` is the public path,
 * e.g. '/media/projects/med-t-sensory-substitution/bench.jpg'.
 * Only real project media — never stand-in images.
 */
export interface MediaItem {
  kind: MediaKind;
  src: string;
  /** Required for images and diagrams: describe what the picture shows. */
  alt: string;
  caption?: string;
  /** Optional poster frame for videos. */
  poster?: string;
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectCategory = 'ai-software' | 'embedded-biomedical' | 'web-creative' | 'experiments';

export type ProjectStatus =
  | 'validated' // working and checked against a reference, not deployed
  | 'in-progress' // actively being built
  | 'prototype' // working, demonstrated prototype
  | 'mvp' // minimum viable version complete
  | 'hackathon' // working hackathon demonstration
  | 'complete' // finished
  | 'launch-pending' // finished, awaiting public launch
  | 'concept' // design concept / early stage
  | 'employer' // employer initiative; individual scope noted separately
  | 'coursework'; // lab or course exercise

/** How much of the project was mine. Rendered as a short label. */
export type Ownership = 'sole' | 'lead' | 'major' | 'team' | 'contributor';

export type ArtKey = 'medt' | 'tooling' | 'bmett' | 'brthday' | 'spinealign' | 'custody' | 'cobalt';

/** Interactive experiments that already run on this site. */
export type ExperimentId = 'vision-matrix' | 'signal-playground';

/**
 * Long-form case-study content. Every field is optional; empty fields are
 * hidden, so a project can start as a short record and grow over time.
 */
export interface CaseStudy {
  problem?: string[];
  /** What I personally built or did. */
  contributions?: string[];
  /** What teammates built, so credit stays accurate. */
  team?: string[];
  architecture?: { caption: string; nodes: DiagramNode[] };
  implementation?: string[];
  decisions?: Decision[];
  challenges?: string[];
  validation?: string[];
  outcomes?: string[];
  limitations?: string[];
  future?: string[];
}

export interface Project {
  /** Stable URL id: /work/<id>. Never rename once published. */
  id: string;
  /** Number in the master inventory (P01–P30). */
  inventory: number;
  title: string;
  /** One sentence, shown on every card. */
  summary: string;
  /** Organization or setting, e.g. 'RBC co-op' or 'McMaster MED-T'. */
  context: string;
  dates: Maybe<string>;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Omit when it isn't documented yet; nothing is shown. */
  ownership?: Ownership;
  /** Short, specific note on what was mine vs. the team's. */
  ownershipNote?: string;
  /** Canonical skill names (must exist in skills.ts) — drives the Skills explorer. */
  tech: string[];
  /** One or two headline facts for the card. */
  highlights?: string[];
  metrics?: Metric[];
  caseStudy?: CaseStudy;
  /** Employer work: description is public, artifacts are not. */
  restricted?: boolean;
  /** Experience ids this project belongs to. */
  experience?: string[];
  /** Other project ids worth reading next. */
  related?: string[];
  /** For sub-modules, e.g. the LED driver inside MED-T. */
  parent?: string;
  art?: ArtKey;
  evidence?: Evidence;
  media?: MediaItem[];
  /** A working experiment on this site that relates to the project. */
  simulation?: { id: ExperimentId; label: string };
  /** Future experiment idea. Internal note only — never rendered. */
  plannedSimulation?: string;
  /** Internal: details still missing. Never rendered. */
  todo?: string[];
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export type ExperienceGroup = 'technical' | 'leadership' | 'other';

export interface Initiative {
  title: string;
  ownership: Ownership;
  ownershipNote?: string;
  summary: string;
  points?: string[];
  metrics?: Metric[];
  /** Project ids with the full write-up. */
  projects?: string[];
}

export interface ExperienceEntry {
  /** Stable URL id: /experience/<id>. */
  id: string;
  group: ExperienceGroup;
  org: Maybe<string>;
  title: string;
  location: Maybe<string>;
  dates: Maybe<string>;
  /** Sort key, 'YYYY-MM'. Newest first. */
  start: string;
  /** One or two sentences, always visible. */
  summary: string;
  /** Revealed on demand. */
  contributions?: string[];
  initiatives?: Initiative[];
  tech?: string[];
  metrics?: Metric[];
  projects?: string[];
  /** For leadership/competition entries that extend a technical entry. */
  seeAlso?: string;
  evidence?: Evidence;
  /** Rendered as a short line under the title, e.g. 'Apple-partnered program'. */
  note?: string;
  todo?: string[];
}
