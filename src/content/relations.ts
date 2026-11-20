import { projects, publicProjects } from './projects';
import { experience } from './experience';
import { allSkills, skillGroups } from './skills';
import type { ExperienceEntry, Project } from './types';

/**
 * Skill ↔ work relationships, derived from the `tech` arrays on projects and
 * experience entries. Nothing here is maintained by hand. Only public
 * projects are listed; private (employer) work is reached through Experience.
 */
export function projectsUsing(skill: string): Project[] {
  return publicProjects.filter((p) => p.tech.includes(skill));
}

export function experienceUsing(skill: string): ExperienceEntry[] {
  return experience.filter((e) => e.tech?.includes(skill));
}

/** Number of projects + roles that cite each skill. */
export const skillUsage: Map<string, number> = new Map(
  allSkills.map((s) => [s.name, projectsUsing(s.name).length + experienceUsing(s.name).length]),
);

export function groupOfSkill(name: string) {
  return skillGroups.find((g) => g.skills.some((s) => s.name === name));
}

/** Tech names used by projects/experience that aren't listed in skills.ts (should be empty). */
export function unknownTech(): string[] {
  const known = new Set(allSkills.map((s) => s.name));
  const used = [...projects.flatMap((p) => p.tech), ...experience.flatMap((e) => e.tech ?? [])];
  return [...new Set(used.filter((t) => !known.has(t)))];
}
