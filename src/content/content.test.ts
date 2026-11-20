import { describe, expect, it } from 'vitest';
import {
  projects, getProject, categoryOrder, publicProjects, caseStudyProjects, searchProjects,
  workRedirect, modulesOf, caseStudiesByIds, projectHref, coreTechOf,
} from './projects';
import { EXPERIENCE_HUB, experience, experienceHref, getExperience, hasExperiencePage, roleAnchor } from './experience';
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
  it('gives every record a unique inventory number', () => {
    const nums = projects.map((p) => p.inventory);
    expect(new Set(nums).size).toBe(nums.length);
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

  it('gives every module a parent case study, and no other listing a parent', () => {
    for (const p of projects) {
      if (p.listing === 'module') expect(getProject(p.parent ?? '')?.listing, p.id).toBe('case-study');
      else expect(p.parent, p.id).toBeUndefined();
    }
  });

  it('folds the LED driver into MED-T and movement classification into BMETT', () => {
    expect(modulesOf('med-t-sensory-substitution').map((p) => p.id)).toEqual(['esp32-led-matrix-driver']);
    expect(modulesOf('bmett-acl-rehabilitation').map((p) => p.id)).toEqual(['bmett-acl-movement-classification']);
  });

  it('keeps RBC work restricted, with no shared artifacts', () => {
    for (const p of projects.filter((x) => x.id.startsWith('rbc-'))) {
      expect(p.restricted).toBe(true);
      expect(evidenceUrls(p.evidence)).toEqual([]);
      expect(p.media ?? []).toEqual([]);
    }
  });
});

describe('RBC is Experience, not a project', () => {
  const rbc = projects.filter((p) => p.id.startsWith('rbc-'));

  it('keeps all six RBC records in the data, marked private', () => {
    expect(rbc).toHaveLength(6);
    for (const p of rbc) expect(p.listing).toBe('private');
  });

  it('leaves RBC out of every public list, search and link', () => {
    const ids = new Set(rbc.map((p) => p.id));
    for (const list of [publicProjects, caseStudyProjects, searchProjects('rbc'), searchProjects('payment')]) {
      for (const p of list) expect(ids.has(p.id), p.id).toBe(false);
    }
    expect(featuredCards().some((c) => /rbc|royal bank/i.test(`${c.title} ${c.badge.title}`))).toBe(false);
    expect(caseStudiesByIds(getExperience('rbc')?.projects)).toEqual([]);
    for (const s of allSkills) for (const p of projectsUsing(s.name)) expect(ids.has(p.id)).toBe(false);
  });

  it('sends old RBC project URLs to the RBC experience page', () => {
    for (const p of rbc) expect(workRedirect(p.id)).toBe('/experience/rbc');
    expect(workRedirect('ai-developer-tooling')).toBe('/experience/rbc');
  });

  it('keeps the RBC experience entry intact and on the homepage', () => {
    const e = getExperience('rbc');
    expect(e?.metrics?.length).toBeGreaterThan(0);
    expect(e?.initiatives).toHaveLength(7);
    expect(homepageExperienceIds[0]).toBe('rbc');
  });
});

describe('routes', () => {
  it('redirects every record without a page somewhere real', () => {
    for (const p of projects) {
      if (p.listing === 'case-study') { expect(workRedirect(p.id)).toBeUndefined(); continue; }
      const to = workRedirect(p.id);
      expect(to, p.id).toMatch(/^\/(work\/[a-z0-9-]+#module-|lab\/projects#archive-|lab\/(vision-matrix|signal-playground)$|experience\/)/);
      const target = to!.match(/^\/work\/([^#]+)/)?.[1];
      if (target) expect(getProject(target)?.listing).toBe('case-study');
    }
    expect(workRedirect('esp32-led-matrix-driver')).toBe('/work/med-t-sensory-substitution#module-esp32-led-matrix-driver');
    expect(workRedirect('vision-matrix-simulator')).toBe('/lab/vision-matrix');
    expect(workRedirect('not-a-project')).toBeUndefined();
  });

  it('links archive records to their hub row, case studies to their page', () => {
    expect(projectHref(getProject('cmos-transmission-gate')!)).toBe('/lab/projects#archive-cmos-transmission-gate');
    expect(projectHref(getProject('custodyos')!)).toBe('/work/custodyos');
  });

  it('only links to public case studies from project link lists', () => {
    for (const p of projects) for (const r of caseStudiesByIds(p.related)) expect(r.listing).toBe('case-study');
  });
});

describe('case-study density', () => {
  it('gives every case study three to five core technologies drawn from its stack', () => {
    for (const p of caseStudyProjects) {
      const core = coreTechOf(p);
      if (!p.tech.length) continue;
      expect(core.length, p.id).toBeGreaterThanOrEqual(Math.min(3, p.tech.length));
      expect(core.length, p.id).toBeLessThanOrEqual(5);
      for (const t of core) expect(p.tech, p.id).toContain(t);
    }
  });

  it('keeps What I built to three to five items when summarized, with the full detail retained', () => {
    for (const p of caseStudyProjects) {
      const built = p.caseStudy?.built;
      if (!built) continue;
      expect(built.length, p.id).toBeGreaterThanOrEqual(3);
      expect(built.length, p.id).toBeLessThanOrEqual(5);
      expect(p.caseStudy?.contributions?.length, p.id).toBeGreaterThan(0);
    }
  });

  it('only marks fields as covered when they exist, and never hides a project’s only results', () => {
    for (const p of projects) {
      const cs = p.caseStudy;
      for (const f of cs?.covered ?? []) expect(cs?.[f]?.length, `${p.id}.${f}`).toBeGreaterThan(0);
      // A case study's own validation and limitations are its Results; they are never suppressed.
      if (p.listing === 'case-study') expect(cs?.covered ?? []).not.toContain('validation');
      if (p.listing === 'case-study') expect(cs?.covered ?? []).not.toContain('limitations');
    }
  });

  it('tags decisions and parameters only with subsystems of the same project', () => {
    for (const p of projects) {
      const mods = new Set(modulesOf(p.id).map((m) => m.id));
      const tags = [...(p.caseStudy?.decisions ?? []), ...(p.metrics ?? [])].map((x) => x.subsystem).filter(Boolean);
      for (const t of tags) expect(mods.has(t!), `${p.id} → ${t}`).toBe(true);
    }
  });

  it('shows outcomes, not parameters, as results', () => {
    const med = getProject('med-t-sensory-substitution')!;
    expect(med.metrics?.filter((m) => !m.detail).map((m) => m.value)).toEqual(['4×4']);
    expect(getProject('custodyos')!.metrics?.find((m) => m.value === '1,024')?.detail).toBe(true);
  });

  it('keeps the maturity distinctions accurate', () => {
    expect(getProject('med-t-sensory-substitution')!.caseStudy?.limitations?.join(' ')).toMatch(/6×4.*not been built/);
    expect(getProject('custodyos')!.caseStudy?.limitations?.join(' ')).toMatch(/not a deployed/);
    expect(getProject('bmett-acl-rehabilitation')!.caseStudy?.validation?.join(' ')).toMatch(/No classifier accuracy or clinical-efficacy/);
    expect(getProject('brthday-interactive-commerce')!.caseStudy?.outcomes?.join(' ')).toMatch(/waiting for the owner’s approval/);
  });
});

describe('featured', () => {
  it('features four case studies on the hub, in order', () => {
    expect(featuredRefs.map((r) => r.id)).toEqual([
      'med-t-sensory-substitution',
      'custodyos',
      'bmett-acl-rehabilitation',
      'brthday-interactive-commerce',
    ]);
    for (const r of featuredRefs) expect(getProject(r.id)?.listing).toBe('case-study');
    for (const c of featuredCards()) expect(c.tech).toHaveLength(3);
  });

  it('shows MED-T, custodyOS and BMETT on the homepage', () => {
    expect(homepageCards().map((c) => c.key)).toEqual(['med-t-sensory-substitution', 'custodyos', 'bmett-acl-rehabilitation']);
    for (const c of homepageCards()) expect(c.badge.title.length).toBeGreaterThan(0);
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

  it('gives each primary role its own page, and sends everything else somewhere real', () => {
    for (const id of ['rbc', 'med-t', 'bmett', 'swift-coop']) {
      expect(hasExperiencePage(getExperience(id)!), id).toBe(true);
      expect(experienceHref(getExperience(id)!)).toBe(`/experience/${id}`);
    }
    // Leadership entries that extend a role go to that role's page.
    expect(experienceHref(getExperience('med-t-leadership')!)).toBe('/experience/med-t');
    expect(experienceHref(getExperience('bmett-team')!)).toBe('/experience/bmett');
    // Short entries go to their row on the hub.
    for (const id of ['first-robotics', 'gael-guides', 'medsprint', 'mongodb-hackathon', 'hgcc']) {
      expect(experienceHref(getExperience(id)!)).toBe(`${EXPERIENCE_HUB}#${roleAnchor(id)}`);
    }
  });

  it('keeps MED-T leadership duties on the MED-T role page', () => {
    expect(getExperience('med-t')?.leadership).toEqual(getExperience('med-t-leadership')?.contributions);
  });

  it('keeps hub badges to a short subset of each role’s technologies', () => {
    for (const e of experience.filter((x) => x.coreTech)) {
      expect(e.coreTech!.length, e.id).toBeLessThanOrEqual(4);
      for (const t of e.coreTech!) expect(e.tech, `${e.id}: ${t}`).toContain(t);
    }
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
    expect(agents).not.toContain('rbc-agent-readiness-framework');
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
    expect(JSON.stringify(site)).not.toMatch(/289|tel:/);
    expect(site.socials.map((s) => s.href)).toEqual([
      'https://github.com/smithja06',
      'https://www.linkedin.com/in/jaden-smith-577325267/',
    ]);
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
