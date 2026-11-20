import type { ArtKey, Metric } from './types';
import { categoryLabels, getProject, statusLabels } from './projects';
import { getExperience } from './experience';

/**
 * Homepage curation — the six flagship pieces, in order.
 * Each entry points at an existing record (no copied content); `title`,
 * `summary` and `art` only override how the card reads.
 */
type FeaturedRef = { onHomepage?: boolean } & (
  | { kind: 'project'; id: string; title?: string; summary?: string }
  | { kind: 'experience'; id: string; title: string; summary: string; art: ArtKey; label: string; status: string }
);

export const featuredRefs: FeaturedRef[] = [
  {
    kind: 'experience',
    id: 'rbc',
    title: 'RBC — Software & AI Engineering',
    summary:
      'Validation and explainability tooling for a payment-routing engine, a legacy rules application rebuilt from compiled code, and an AI agent-readiness framework.',
    art: 'tooling',
    label: 'AI & Software Systems',
    status: 'Co-op · in progress',
    onHomepage: true,
  },
  { kind: 'project', id: 'med-t-sensory-substitution', onHomepage: true },
  { kind: 'project', id: 'custodyos', onHomepage: true },
  { kind: 'project', id: 'bmett-acl-rehabilitation' },
  { kind: 'project', id: 'brthday-interactive-commerce' },
  { kind: 'project', id: 'cobalt-lab-portfolio' },
];

/** Card-ready shape shared by projects and the RBC experience entry. */
export interface FeaturedCard {
  key: string;
  href: string;
  title: string;
  summary: string;
  context: string;
  category: string;
  status: string;
  art?: ArtKey;
  highlights: string[];
  metrics: Metric[];
  tech: string[];
  /** Project id when the card is a project (for "Featured" marks in the archive). */
  projectId?: string;
  onHomepage: boolean;
}

export function featuredCards(): FeaturedCard[] {
  return featuredRefs.flatMap((ref): FeaturedCard[] => {
    if (ref.kind === 'experience') {
      const e = getExperience(ref.id);
      if (!e) return [];
      return [{
        key: `exp-${e.id}`,
        href: `/experience/${e.id}`,
        title: ref.title,
        summary: ref.summary,
        context: `${e.title} · ${e.dates}`,
        category: ref.label,
        status: ref.status,
        art: ref.art,
        highlights: [],
        metrics: e.metrics ?? [],
        tech: (e.tech ?? []).slice(0, 4),
        onHomepage: !!ref.onHomepage,
      }];
    }
    const p = getProject(ref.id);
    if (!p) return [];
    return [{
      key: p.id,
      href: `/work/${p.id}`,
      title: ref.title ?? p.title,
      summary: ref.summary ?? p.summary,
      context: p.context,
      category: categoryLabels[p.category],
      status: statusLabels[p.status],
      art: p.art,
      highlights: p.highlights ?? [],
      metrics: [],
      tech: p.tech.slice(0, 4),
      projectId: p.id,
      onHomepage: !!ref.onHomepage,
    }];
  });
}

/** The cards marked `onHomepage` (three, in order). Change the flags above to swap them. */
export function homepageCards(): FeaturedCard[] {
  return featuredCards().filter((c) => c.onHomepage);
}

/** Roles summarized on the homepage, in order. Everything else lives on /lab/experience. */
export const homepageExperienceIds = ['rbc', 'med-t', 'bmett'];

export const featuredProjectIds = new Set(featuredRefs.filter((r) => r.kind === 'project').map((r) => r.id));
