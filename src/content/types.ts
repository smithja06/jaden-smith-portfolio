/**
 * Marker for personal facts that have not been provided yet.
 * Any field holding this value is hidden by the UI, never rendered.
 * Search the codebase for TODO_USER_CONTENT to find everything still missing.
 */
export const TODO_USER_CONTENT = 'TODO_USER_CONTENT' as const;
export type Todo = typeof TODO_USER_CONTENT;
export type Maybe<T> = T | Todo;

export function isProvided<T>(value: Maybe<T> | undefined | null): value is T {
  return value !== undefined && value !== null && value !== TODO_USER_CONTENT && value !== '';
}

export type Category = 'ai-software' | 'embedded' | 'biomedical' | 'creative';

export type ProjectStatus =
  | 'prototype'
  | 'in development'
  | 'student project'
  | 'conceptual demo'
  | 'professional work'
  | 'shipped product';

export type ArtKey = 'medt' | 'tooling' | 'bmett' | 'brthday' | 'spinealign';

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
}

export interface Decision {
  title: string;
  body: string;
}

export interface CaseStudy {
  problem: string[];
  role: string[];
  /** Left-to-right pipeline; rendered as an original SVG/HTML diagram. */
  system: { caption: string; nodes: DiagramNode[] };
  decisions: Decision[];
  implementation: string[];
  outcome: string[];
  /** Shown as a quiet note when parts of the story are pending review or detail. */
  contentNote?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One-line value statement. */
  summary: string;
  /** Short problem → solution description used on cards. */
  cardText: string;
  categories: Category[];
  tags: string[];
  status: ProjectStatus;
  role: Maybe<string>;
  timeline: Maybe<string>;
  stack: Maybe<string[]>;
  links: ProjectLink[];
  art: ArtKey;
  /** True when the cover art is an original illustration, not a real screenshot. */
  conceptVisual: boolean;
  /** Homepage curation: lower numbers appear first. Omit to keep off the homepage. */
  featuredOrder?: number;
  /** Optional lab experiment that relates to this project. */
  labLink?: { label: string; to: string };
  caseStudy: CaseStudy;
}
