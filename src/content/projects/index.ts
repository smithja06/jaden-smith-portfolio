import type { Ownership, Project, ProjectCategory, ProjectStatus } from '../types';
import { aiSoftwareProjects } from './ai-software';
import { embeddedBiomedicalProjects } from './embedded-biomedical';
import { webCreativeProjects } from './web-creative';
import { experimentProjects } from './experiments';

/**
 * Every project, one authoritative record each. To add a project, append a
 * record to the file for its category and set `listing`: a `case-study` gets
 * a card on the hub and a page at /work/<id>; an `archive` record gets a
 * compact row. Both appear in search, filters and the Skills explorer.
 */
export const projects: Project[] = [
  ...aiSoftwareProjects,
  ...embeddedBiomedicalProjects,
  ...webCreativeProjects,
  ...experimentProjects,
];

export const categoryOrder: ProjectCategory[] = ['ai-software', 'embedded-biomedical', 'web-creative', 'experiments'];

export const categoryLabels: Record<ProjectCategory, string> = {
  'ai-software': 'AI & Software Systems',
  'embedded-biomedical': 'Embedded & Biomedical',
  'web-creative': 'Web, Mobile & Creative',
  experiments: 'Experiments & Coursework',
};

export const categoryBlurbs: Record<ProjectCategory, string> = {
  'ai-software': 'AI agents, retrieval and backend systems.',
  'embedded-biomedical': 'Firmware, sensors and assistive or rehabilitation prototypes.',
  'web-creative': 'Web, iOS, 3D and interaction-led products.',
  experiments: 'Circuits labs, benchmarks, analyses and browser experiments.',
};

export const statusLabels: Record<ProjectStatus, string> = {
  validated: 'Validated in testing',
  'in-progress': 'In development',
  prototype: 'Working prototype',
  mvp: 'MVP complete',
  hackathon: 'Hackathon demo',
  complete: 'Complete',
  'launch-pending': 'Complete · launch pending',
  concept: 'Concept',
  employer: 'Employer initiative',
  coursework: 'Course project',
};

export const ownershipLabels: Record<Ownership, string> = {
  sole: 'Sole contributor',
  lead: 'Lead',
  major: 'Major contributor',
  team: 'Team project',
  contributor: 'Contributor',
};

const byId = new Map(projects.map((p) => [p.id, p]));

/** The canonical Projects hub. */
export const PROJECTS_HUB = '/lab/projects';

/** Has its own page at /work/<id>. */
export const hasCaseStudy = (p: Project) => p.listing === 'case-study';
/** Appears in the public Projects hub (as a card or an archive row) and in search. */
export const isPublicProject = (p: Project) => p.listing === 'case-study' || p.listing === 'archive';

/** Everything a visitor can browse or search: case studies and archive rows. */
export const publicProjects: Project[] = projects.filter(isPublicProject);
export const caseStudyProjects: Project[] = projects.filter(hasCaseStudy);
export const archiveProjects: Project[] = projects.filter((p) => p.listing === 'archive');

/** Anchor id of an archive row on the hub; the row opens when the URL hash matches. */
export const archiveAnchor = (id: string) => `archive-${id}`;
/** Anchor id of a module's subsection inside its parent case study. */
export const moduleAnchor = (id: string) => `module-${id}`;

/** Where a public project lives: its case study, or its row in the archive. */
export function projectHref(p: Project): string {
  return hasCaseStudy(p) ? `/work/${p.id}` : `${PROJECTS_HUB}#${archiveAnchor(p.id)}`;
}

/**
 * Where an old /work/<id> URL now points, for every record without its own
 * page. Derived from `listing`, so consolidating a page never breaks a link.
 */
export function retiredProjectTarget(p: Project): string | undefined {
  switch (p.listing) {
    case 'case-study':
      return undefined;
    case 'archive':
      return projectHref(p);
    case 'module':
      return p.parent ? `/work/${p.parent}#${moduleAnchor(p.id)}` : PROJECTS_HUB;
    case 'experiment': {
      const demo = p.evidence?.demo;
      return typeof demo === 'string' && demo.startsWith('/') ? demo : `${PROJECTS_HUB}#experiments`;
    }
    case 'private':
      return p.experience?.[0] ? `/experience/${p.experience[0]}` : PROJECTS_HUB;
  }
}

/** Old URLs that predate the current records. */
const legacyRedirects: Record<string, string> = {
  'ai-developer-tooling': '/experience/rbc',
};

/** Redirect target for /work/<slug> when it has no case study; undefined means 404. */
export function workRedirect(slug: string): string | undefined {
  const p = byId.get(slug);
  return p ? retiredProjectTarget(p) : legacyRedirects[slug];
}

export function getProject(id: string): Project | undefined {
  return byId.get(id);
}

export function projectsByIds(ids: string[] = []): Project[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Project => !!p);
}

/** Three to five primary technologies for headers and cards (cards take the first three). */
export function coreTechOf(p: Project): string[] {
  return p.coreTech ?? p.tech.slice(0, 5);
}

/** Only the ids that have a public case study — use for every visible project link list. */
export function caseStudiesByIds(ids: string[] = []): Project[] {
  return projectsByIds(ids).filter(hasCaseStudy);
}

/** Modules rendered as subsections of this project's case study. */
export function modulesOf(id: string): Project[] {
  return projects.filter((p) => p.listing === 'module' && p.parent === id);
}

/** Case-insensitive search over title, summary, context, category and technologies (and folded-in modules). */
export function searchProjects(query: string, list: Project[] = publicProjects): Project[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  return list.filter((p) => {
    const mods = modulesOf(p.id).flatMap((m) => [m.title, m.summary, ...m.tech]);
    const hay = [p.title, p.summary, p.context, categoryLabels[p.category], statusLabels[p.status], ...p.tech, ...(p.highlights ?? []), ...mods]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
