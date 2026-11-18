import { describe, expect, it } from 'vitest';
import { featuredProjects, projects } from './projects';
import { site } from './site';
import { timeline } from './experience';

const json = JSON.stringify({ projects, site, timeline });

describe('content integrity', () => {
  it('has unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it('features 4–6 projects in explicit order', () => {
    const f = featuredProjects(6);
    expect(f.length).toBeGreaterThanOrEqual(4);
    expect(f[0].slug).toBe('med-t-sensory-substitution');
  });

  it('every project has 2–3 tags and a full case study', () => {
    for (const p of projects) {
      expect(p.tags.length).toBeGreaterThanOrEqual(2);
      expect(p.tags.length).toBeLessThanOrEqual(3);
      expect(p.caseStudy.problem.length).toBeGreaterThan(0);
      expect(p.caseStudy.system.nodes.length).toBeGreaterThan(1);
    }
  });

  it('contains no placeholder text or decorative fake metrics', () => {
    expect(json).not.toMatch(/lorem ipsum|example\.com|32×32|32x32/i);
    expect(json).not.toMatch(/\d+(\.\d+)?\s?%|\d+\s?ms\b|\d+K\+|\d+\+ projects|uptime/i);
  });

  it('only links to real-looking URLs', () => {
    for (const p of projects) for (const l of p.links) expect(l.href).toMatch(/^https?:\/\//);
    for (const s of site.socials) expect(s.href).toMatch(/^https?:\/\//);
  });
});
