import type { Ownership, Project, ProjectCategory, ProjectStatus } from '../types';
import { aiSoftwareProjects } from './ai-software';
import { embeddedBiomedicalProjects } from './embedded-biomedical';
import { webCreativeProjects } from './web-creative';
import { experimentProjects } from './experiments';

/**
 * Every project, one authoritative record each. To add a project, append a
 * record to the file for its category; it appears in the archive, search,
 * filters, Skills explorer and at /work/<id> automatically.
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
  'ai-software': 'Enterprise tooling, AI agents, retrieval and backend systems.',
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

/** Old URLs that should keep working. */
export const legacyProjectRedirects: Record<string, string> = {
  'ai-developer-tooling': '/experience/rbc',
};

export function getProject(id: string): Project | undefined {
  return byId.get(id);
}

export function projectsByIds(ids: string[] = []): Project[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Project => !!p);
}

export function projectsInCategory(c: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === c);
}

/** Sub-modules that name this project as their parent. */
export function childProjects(id: string): Project[] {
  return projects.filter((p) => p.parent === id);
}

/** Previous / next within the same category, wrapping around. */
export function siblingProjects(p: Project): { prev: Project; next: Project } {
  const list = projectsInCategory(p.category);
  const i = list.indexOf(p);
  return { prev: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
}

/** Case-insensitive search over title, summary, context, category and technologies. */
export function searchProjects(query: string, list: Project[] = projects): Project[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  return list.filter((p) => {
    const hay = [p.title, p.summary, p.context, categoryLabels[p.category], statusLabels[p.status], ...p.tech, ...(p.highlights ?? [])]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
