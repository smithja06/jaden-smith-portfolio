import { describe, expect, it } from 'vitest';
import {
  projects, getProject, categoryOrder, publicProjects, caseStudyProjects, searchProjects,
  workRedirect, modulesOf, caseStudiesByIds, projectHref, coreTechOf,
} from './projects';
import { EXPERIENCE_HUB, experience, experienceHref, getExperience, hasExperiencePage, roleAnchor } from './experience';
import { MOCK_CODE, awards, coursework, schools } from './education';
import { allSkills, focusAreas, homepageSkills, skillGroups, spokenLanguages } from './skills';
import { experienceUsing } from './relations';
import { experiments } from '../lab3d/config/stations';
import { featuredCards, featuredRefs, homepageCards, homepageExperienceIds } from './featured';
import { coreSkills } from './skills';
import { projectsUsing, unknownTech } from './relations';
import { site } from './site';
import { pathMilestones } from './about';
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
    expect(e?.initiatives).toHaveLength(8);
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

  it('core skills are 6–8 listed skills', () => {
    expect(coreSkills.length).toBeGreaterThanOrEqual(6);
    expect(coreSkills.length).toBeLessThanOrEqual(8);
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
      'med-t-leadership', 'gael-guides', 'first-robotics', 'ibiomed-showcase', 'medsprint',
      'shakespeares', 'hgcc', 'french-camp',
    ]) expect(ids).toContain(id);
  });

  it('keeps BMETT as one entry and the hackathon in Projects only', () => {
    const ids = experience.map((e) => e.id);
    // True North is BMETT's 2026–27 season, not a separate role.
    for (const gone of ['bmett-team', 'true-north', 'mongodb-hackathon']) expect(ids).not.toContain(gone);
    const bmett = getExperience('bmett')!;
    expect(bmett.org).toBe('McMaster BMETT');
    expect(bmett.title).toBe('Software Team Member');
    expect(bmett.contributions?.some((c) => c.includes('True North'))).toBe(true);
    expect(getProject('custodyos')?.experience ?? []).not.toContain('mongodb-hackathon');
  });

  it('lists all eight RBC initiatives, including the Spec Kit bug-fix extension', () => {
    const inits = getExperience('rbc')?.initiatives ?? [];
    expect(inits).toHaveLength(8);
    expect(inits.find((i) => i.title === 'Spec Kit Bug-Fix Extension')?.ownership).toBe('sole');
  });

  it('gives each primary role its own page, and sends everything else somewhere real', () => {
    for (const id of ['rbc', 'med-t', 'bmett', 'swift-coop']) {
      expect(hasExperiencePage(getExperience(id)!), id).toBe(true);
      expect(experienceHref(getExperience(id)!)).toBe(`/experience/${id}`);
    }
    // Leadership entries that extend a role go to that role's page.
    expect(experienceHref(getExperience('med-t-leadership')!)).toBe('/experience/med-t');
    // Short entries go to their row on the hub.
    for (const id of ['first-robotics', 'gael-guides', 'medsprint', 'hgcc']) {
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

  it('every core technology has linked evidence', () => {
    for (const n of coreSkills) expect(projectsUsing(n).length + experienceUsing(n).length, n).toBeGreaterThan(0);
  });

  it('keeps all 82 skills: six technical categories plus spoken languages', () => {
    expect(skillGroups).toHaveLength(6);
    expect(allSkills).toHaveLength(82);
    expect(skillGroups.flatMap((g) => g.skills).map((s) => s.name)).not.toContain('English');
    expect(spokenLanguages.map((s) => s.name)).toEqual(['English', 'French']);
  });

  it('keeps in-progress integrations labelled', () => {
    for (const n of ['IBM MQ', 'Microsoft Entra ID']) expect(allSkills.find((s) => s.name === n)?.note).toMatch(/in progress/);
  });

  it('has three focus areas', () => {
    expect(focusAreas.map((f) => f.title)).toEqual(['Software Engineering', 'AI & Machine Learning', 'Embedded & Biomedical Systems']);
  });

  it('lists the toy network with the other browser experiments', () => {
    expect(experiments.map((e) => e.route)).toContain('/lab/neural-network');
  });
});

describe('education & contact', () => {
  it('lists only the official courses, with every project link kept', () => {
    const titles = coursework.flatMap((c) => c.topics.map((t) => (typeof t === 'string' ? t : t.title)));
    expect(titles).toHaveLength(12);
    expect(titles).not.toContain('Materials testing');
    expect(new Set(titles).size).toBe(titles.length);
    const linked = coursework.flatMap((c) => c.projects ?? []);
    expect(new Set(linked).size).toBe(linked.length);
    expect([...linked].sort()).toEqual([
      'center-tap-power-supply', 'cmos-transmission-gate', 'cycle-buddy', 'hip-implant-design-case',
      'op-amp-integrator-differentiator', 'ostoflow', 'spinealign-posture-feedback',
    ]);
    for (const id of linked) expect(getProject(id), id).toBeDefined();
  });

  it('shows neither materials testing nor cost accounting', () => {
    const titles = coursework.flatMap((c) => c.topics.map((t) => (typeof t === 'string' ? t : t.title)));
    expect(titles.some((t) => /materials testing|cost accounting/i.test(t))).toBe(false);
  });

  it('gives every course an official code, with no placeholders left', () => {
    for (const t of coursework.flatMap((c) => c.topics)) {
      expect(typeof t, String(t)).toBe('object');
      if (typeof t === 'string') continue;
      expect(t.code?.trim(), t.title).toBeTruthy();
      expect(MOCK_CODE.test(t.code!), t.title).toBe(false);
      expect(t.code, t.title).toMatch(/^(COMPENG|ELECENG|IBEHS|MATH) \d[A-Z0-9]{3}( \/ \d[A-Z0-9]{3})?$/);
    }
  });

  it('separates university awards from high-school ones', () => {
    const at = (school: string) => awards.filter((a) => a.kind === 'received' && a.school === school).map((a) => a.title);
    expect(at('mcmaster')).toEqual(['McMaster Award of Excellence', 'Dean’s Honour List']);
    for (const t of ['Director’s Award of Excellence', 'Certificate of Distinction', 'St. Albertus Magnus Science Award', 'Carl & Rose Rocky Memorial Award', 'FIRST Robotics Award']) {
      expect(at('cathedral')).toContain(t);
    }
  });

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

describe('project media', () => {
  // Keys only: nothing is imported, this just lists what is in public/.
  const shipped = new Set(Object.keys(import.meta.glob('/public/media/projects/**/*')));
  const withMedia = projects.filter((p) => p.media?.length);

  it('only points at files that ship in public/', () => {
    for (const p of withMedia) {
      for (const m of p.media!) {
        for (const src of [m.src, m.poster].filter(Boolean) as string[]) {
          expect(src.startsWith(`/media/projects/${p.id}/`), src).toBe(true);
          expect(shipped.has(`/public${src}`), src).toBe(true);
        }
      }
    }
  });

  it('gives every image and video alt text and its size, and every video a poster', () => {
    for (const m of withMedia.flatMap((p) => p.media!)) {
      expect(m.alt.length, m.src).toBeGreaterThan(20);
      expect(m.width && m.height, m.src).toBeTruthy();
      if (m.kind === 'video') expect(m.poster, m.src).toBeTruthy();
    }
  });

  it('keeps the iBioMed archive projects as archive rows with two images each', () => {
    for (const id of ['ostoflow', 'hip-implant-design-case']) {
      const p = projects.find((x) => x.id === id)!;
      expect(p.listing).toBe('archive');
      expect(p.media?.filter((m) => m.kind === 'image')).toHaveLength(2);
    }
  });
});

describe('homepage skills overview', () => {
  it('shows five or six catalogue skills for every group', () => {
    for (const g of skillGroups) {
      const picks = homepageSkills[g.id];
      expect(picks, g.id).toBeDefined();
      expect(picks.length, g.id).toBeGreaterThanOrEqual(5);
      expect(picks.length, g.id).toBeLessThanOrEqual(6);
      const names = g.skills.map((k) => k.name);
      for (const n of picks) expect(names, `${g.id}: ${n}`).toContain(n);
    }
    expect(Object.keys(homepageSkills).sort()).toEqual(skillGroups.map((g) => g.id).sort());
  });
});

describe('About page path', () => {
  it('links every milestone to records that exist, with one current step', () => {
    expect(pathMilestones.length).toBeGreaterThanOrEqual(3);
    expect(pathMilestones.length).toBeLessThanOrEqual(6);
    for (const m of pathMilestones) {
      for (const id of m.experience ?? []) expect(getExperience(id), `${m.id}: ${id}`).toBeDefined();
      for (const id of m.projects ?? []) expect(getProject(id), `${m.id}: ${id}`).toBeDefined();
      expect(m.text.length, m.id).toBeLessThan(220);
    }
    expect(pathMilestones.filter((m) => m.current)).toHaveLength(1);
  });
});
