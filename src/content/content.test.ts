import { describe, expect, it } from 'vitest';
import { projects, getProject, categoryOrder } from './projects';
import { experience, getExperience } from './experience';
import { awards, coursework, schools } from './education';
import { allSkills } from './skills';
import { featuredCards, featuredRefs, homepageCards, homepageExperienceIds } from './featured';
import { coreSkills } from './skills';
import { projectsUsing, unknownTech } from './relations';
import { site } from './site';
import { TODO_USER_CONTENT, isProvided, type Evidence } from './types';

const json = JSON.stringify({ projects, experience, schools, awards, coursework, site });

function evidenceUrls(e?: Evidence): string[] {
  if (!e) return [];
  return [e.repo, e.demo, e.video, e.report, ...(e.other ?? []).map((o) => o.href)].filter(
    (v): v is string => isProvided(v),
  );
}

describe('projects', () => {
  it('has a record for every one of the 30 inventory entries', () => {
    const nums = projects.map((p) => p.inventory).sort((a, b) => a - b);
    expect(nums).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  it('has unique ids', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
  });

  it('uses only the four archive categories, each non-empty', () => {
    for (const c of categoryOrder) expect(projects.some((p) => p.category === c)).toBe(true);
    for (const p of projects) expect(categoryOrder).toContain(p.category);
  });

  it('resolves every relationship', () => {
    for (const p of projects) {
      for (const id of p.related ?? []) expect(getProject(id), `${p.id} → ${id}`).toBeDefined();
      if (p.parent) expect(getProject(p.parent), `${p.id} parent`).toBeDefined();
      for (const id of p.experience ?? []) expect(getExperience(id), `${p.id} → ${id}`).toBeDefined();
    }
  });

  it('keeps RBC work restricted, with no shared artifacts', () => {
    for (const p of projects.filter((x) => x.id.startsWith('rbc-'))) {
      expect(p.restricted).toBe(true);
      expect(evidenceUrls(p.evidence)).toEqual([]);
      expect(p.media ?? []).toEqual([]);
    }
  });
});

describe('featured', () => {
  it('features exactly six pieces in the agreed order', () => {
    expect(featuredRefs.map((r) => r.id)).toEqual([
      'rbc',
      'med-t-sensory-substitution',
      'custodyos',
      'bmett-acl-rehabilitation',
      'brthday-interactive-commerce',
      'cobalt-lab-portfolio',
    ]);
    expect(featuredCards()).toHaveLength(6);
  });

  it('puts exactly three on the homepage: RBC, MED-T, custodyOS', () => {
    expect(homepageCards().map((c) => c.key)).toEqual(['exp-rbc', 'med-t-sensory-substitution', 'custodyos']);
  });

  it('summarizes three technical roles on the homepage', () => {
    expect(homepageExperienceIds).toEqual(['rbc', 'med-t', 'bmett']);
    for (const id of homepageExperienceIds) expect(getExperience(id)?.group).toBe('technical');
  });

  it('core skills are 8–12 listed skills', () => {
    expect(coreSkills.length).toBeGreaterThanOrEqual(8);
    expect(coreSkills.length).toBeLessThanOrEqual(12);
    for (const n of coreSkills) expect(allSkills.some((s) => s.name === n)).toBe(true);
  });
});

describe('experience', () => {
  it('has unique ids and resolves links', () => {
    expect(new Set(experience.map((e) => e.id)).size).toBe(experience.length);
    for (const e of experience) {
      for (const id of e.projects ?? []) expect(getProject(id), `${e.id} → ${id}`).toBeDefined();
      for (const i of e.initiatives ?? []) for (const id of i.projects ?? []) expect(getProject(id)).toBeDefined();
      if (e.seeAlso) expect(getExperience(e.seeAlso)).toBeDefined();
    }
  });

  it('preserves every inventory entry', () => {
    const ids = experience.map((e) => e.id);
    for (const id of [
      'rbc', 'med-t', 'bmett', 'swift-coop',
      'med-t-leadership', 'bmett-team', 'gael-guides', 'first-robotics', 'ibiomed-showcase', 'medsprint', 'mongodb-hackathon', 'true-north',
      'shakespeares', 'hgcc', 'french-camp',
    ]) expect(ids).toContain(id);
  });

  it('lists all seven RBC initiatives', () => {
    expect(getExperience('rbc')?.initiatives).toHaveLength(7);
  });
});

describe('skills', () => {
  it('every technology on a project or role is a listed skill', () => {
    expect(unknownTech()).toEqual([]);
  });

  it('has unique skill names', () => {
    expect(new Set(allSkills.map((s) => s.name)).size).toBe(allSkills.length);
  });

  it('derives the expected relationships', () => {
    const react = projectsUsing('React').map((p) => p.id);
    for (const id of ['custodyos', 'bmett-acl-rehabilitation', 'brthday-interactive-commerce', 'cobalt-lab-portfolio']) expect(react).toContain(id);
    expect(projectsUsing('ESP32').map((p) => p.id)).toContain('med-t-sensory-substitution');
    const agents = projectsUsing('AI agents').map((p) => p.id);
    expect(agents).toContain('custodyos');
    expect(agents).toContain('rbc-agent-readiness-framework');
  });
});

describe('education & contact', () => {
  it('distinguishes scholarship candidacies from awards', () => {
    const loran = awards.find((a) => a.title.startsWith('Loran'));
    expect(loran?.kind).toBe('candidate');
    expect(awards.filter((a) => a.kind === 'received').length).toBeGreaterThanOrEqual(6);
  });

  it('matches the verified contact details', () => {
    expect(site.email).toBe('smithja741@icloud.com');
    expect(site.phoneHref).toBe('+12894402161');
    expect(site.location).toBe('Hamilton, Ontario, Canada');
  });
});

describe('integrity', () => {
  it('contains no filler text', () => {
    expect(json).not.toMatch(/lorem ipsum|example\.com|coming soon|passionate about|cutting-edge|revolutionary|seamless/i);
  });

  it('never renders the TODO marker as visible copy', () => {
    for (const p of projects) {
      expect(p.title).not.toContain(TODO_USER_CONTENT);
      expect(p.summary).not.toContain(TODO_USER_CONTENT);
    }
  });

  it('only links to real URLs or internal paths', () => {
    const urls = [
      ...projects.flatMap((p) => evidenceUrls(p.evidence)),
      ...experience.flatMap((e) => evidenceUrls(e.evidence)),
      ...site.socials.map((s) => s.href).filter((h): h is string => isProvided(h)),
    ];
    for (const u of urls) expect(u).toMatch(/^(https:\/\/|\/)/);
  });

  it('keeps development stages honest', () => {
    expect(getProject('rbc-payment-routing-simulation')?.status).toBe('in-progress');
    expect(getProject('brthday-interactive-commerce')?.status).toBe('launch-pending');
    expect(getProject('workout-tracker')?.status).toBe('mvp');
    expect(json).not.toMatch(/clinically proven|FDA|Health Canada approved/i);
  });
});
