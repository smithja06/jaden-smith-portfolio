import { isProvided, type ArtKey } from './types';
import { categoryLabels, coreTechOf, getProject } from './projects';

/**
 * Curation only — every card reads from an existing project record.
 * The first entries are the Projects hub's Featured collection, in order;
 * `onHomepage` picks the homepage's Selected work. Every id must be a
 * `case-study` project. Professional work (RBC) belongs in Experience, not here.
 */
interface FeaturedRef {
  id: string;
  onHomepage?: boolean;
}

/** Card technologies come from each project's `coreTech` (first three). */
export const featuredRefs: FeaturedRef[] = [
  { id: 'med-t-sensory-substitution', onHomepage: true },
  { id: 'custodyos', onHomepage: true },
  { id: 'bmett-acl-rehabilitation', onHomepage: true },
  { id: 'brthday-interactive-commerce' },
];

/** Card-ready shape for the homepage grid and the hub's Featured collection. */
export interface FeaturedCard {
  key: string;
  href: string;
  title: string;
  summary: string;
  /** Two-line badge: where it was built, then a smaller detail. */
  badge: { title: string; sub?: string };
  category: string;
  art?: ArtKey;
  /** One verified result, when the record has one. */
  result?: string;
  tech: string[];
  /** Public repository, when one has been supplied. */
  repo?: string;
  projectId: string;
  onHomepage: boolean;
}

/** "MongoDB Hackathon 2026 · team project" → { title: 'MongoDB Hackathon 2026', sub: 'team project' } */
function splitContext(context: string): { title: string; sub?: string } {
  const i = context.indexOf(' · ');
  return i < 0 ? { title: context } : { title: context.slice(0, i), sub: context.slice(i + 3) };
}

export function featuredCards(): FeaturedCard[] {
  return featuredRefs.flatMap((ref): FeaturedCard[] => {
    const p = getProject(ref.id);
    if (!p) return [];
    return [{
      key: p.id,
      href: `/work/${p.id}`,
      title: p.title,
      summary: p.summary,
      badge: splitContext(p.context),
      category: categoryLabels[p.category],
      art: p.art,
      result: p.highlights?.[0],
      tech: coreTechOf(p).slice(0, 3),
      repo: isProvided(p.evidence?.repo) ? p.evidence!.repo : undefined,
      projectId: p.id,
      onHomepage: !!ref.onHomepage,
    }];
  });
}

/** The cards marked `onHomepage`, in order. */
export function homepageCards(): FeaturedCard[] {
  return featuredCards().filter((c) => c.onHomepage);
}

export const featuredProjectIds = new Set(featuredRefs.map((r) => r.id));

/** Roles summarized on the homepage, in order. Everything else lives on /lab/experience. */
export const homepageExperienceIds = ['rbc', 'med-t', 'bmett'];
