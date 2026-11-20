import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { allSkills, coreSkills, focusAreas, skillGroups, skillId, spokenLanguages, type Skill } from '../../content/skills';
import { experienceUsing, projectsUsing } from '../../content/relations';
import { projectHref, statusLabels } from '../../content/projects';
import { isProvided } from '../../content/types';
import { experienceHref } from '../../content/experience';
import { Arrow } from '../Icons';

/**
 * The Skills page, in reading order:
 *   A. three engineering focus areas
 *   B. core technologies (selectable)
 *   C. "Where I've used it": projects and roles for the selected skill,
 *      derived from their `tech` fields; selection lives in ?skill=
 *   D. the full catalogue, one disclosure per category
 *   E. spoken languages
 * Nothing implies proficiency: no levels, years or percentages.
 */
export function SkillExplorer() {
  const [params, setParams] = useSearchParams();
  const selected = allSkills.find((s) => skillId(s.name) === params.get('skill')) ?? null;
  const panelRef = useRef<HTMLElement>(null);
  // A shared ?skill= link opens that skill's category once; afterwards the visitor controls the disclosures.
  const [linkedGroup] = useState(() => (selected && !coreSkills.includes(selected.name) ? skillGroups.find((g) => g.skills.some((s) => s.name === selected.name))?.id : undefined));
  const fromCatalogue = useRef(false);

  const select = (name: string | null, source: 'core' | 'catalogue' = 'core') => {
    const p = new URLSearchParams(params);
    if (name && selected?.name !== name) p.set('skill', skillId(name));
    else p.delete('skill');
    fromCatalogue.current = source === 'catalogue' && !!name;
    setParams(p, { replace: true, preventScrollReset: true });
  };

  // A choice made down in the catalogue brings its results into view; a core choice is already beside them.
  useEffect(() => {
    if (!fromCatalogue.current || !panelRef.current) return;
    fromCatalogue.current = false;
    const r = panelRef.current.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.6) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      panelRef.current.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [selected?.name]);

  const projects = selected ? projectsUsing(selected.name) : [];
  // A leadership entry that extends a role links to that role's page; list each destination once.
  const roles = (selected ? experienceUsing(selected.name) : []).filter((e, i, all) => all.findIndex((x) => experienceHref(x) === experienceHref(e)) === i);
  const hasEvidence = (s: Skill) => projectsUsing(s.name).length + experienceUsing(s.name).length > 0;

  const chip = (s: Skill, source: 'core' | 'catalogue') => {
    const on = selected?.name === s.name;
    const body = <>{s.name}{s.note && <span className="skx-note">{s.note}</span>}</>;
    // Recorded skill without a linked public case study: plain text, not a dead button.
    if (!hasEvidence(s)) return <span className="skx-chip is-static">{body}</span>;
    return (
      <button type="button" className={`skx-chip ${on ? 'is-on' : ''}`} aria-pressed={on} aria-controls="skx-panel" onClick={() => select(s.name, source)}>
        {body}
      </button>
    );
  };

  const core = coreSkills.map((n) => allSkills.find((s) => s.name === n)).filter((s): s is Skill => !!s);
  const counts = [
    projects.length ? `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}` : null,
    roles.length ? `${roles.length} ${roles.length === 1 ? 'role' : 'roles'}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="skx">
      {/* A. Focus areas */}
      <ul className="skx-focus" aria-label="Engineering focus areas">
        {focusAreas.map((f) => (
          <li key={f.id} className="skx-focus-item">
            <h2 className="skx-focus-title">{f.title}</h2>
            <p className="skx-focus-text">{f.text}</p>
          </li>
        ))}
      </ul>

      {/* B + C. Core technologies and where they were used */}
      <section className="skx-evidence" aria-labelledby="skx-core">
        <div className="skx-core">
          <h2 id="skx-core" className="skx-h">Core technologies</h2>
          <p className="skx-hint">Select one to see where I’ve used it.</p>
          <ul className="skx-chips">
            {core.map((s) => <li key={s.name}>{chip(s, 'core')}</li>)}
          </ul>
        </div>

        <section ref={panelRef} id="skx-panel" className={`skx-panel ${selected ? 'has-selection' : ''}`} aria-labelledby="skx-used">
          <div className="skx-panel-head">
            <h2 id="skx-used" className="skx-h">Where I’ve used it</h2>
            {selected && <button type="button" className="text-link skx-clear" onClick={() => select(null)}>Clear<span className="sr-only"> selection</span></button>}
          </div>
          <div aria-live="polite">
            {selected ? (
              <>
                <p className="skx-selected">
                  <span className="skx-selected-name">{selected.name}</span>
                  {selected.note && <span className="skx-note">{selected.note}</span>}
                  {counts && <span className="skx-counts mono">{counts}</span>}
                </p>
                {projects.length + roles.length === 0 ? (
                  <p className="skx-empty">No public case study is linked to this skill yet.</p>
                ) : (
                  <div className="skx-results">
                    {projects.length > 0 && (
                      <div>
                        <h3 className="skx-label mono">Projects</h3>
                        <ul className="skx-links">
                          {projects.map((p) => (
                            <li key={p.id}>
                              <Link to={projectHref(p)} className="skx-link">
                                <span className="skx-link-text">
                                  <span className="skx-link-title">{p.title}</span>
                                  <span className="skx-link-meta">{p.context} · {statusLabels[p.status]}</span>
                                </span>
                                <Arrow />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {roles.length > 0 && (
                      <div>
                        <h3 className="skx-label mono">Experience</h3>
                        <ul className="skx-links">
                          {roles.map((e) => (
                            <li key={e.id}>
                              <Link to={experienceHref(e)} className="skx-link">
                                <span className="skx-link-text">
                                  <span className="skx-link-title">{e.title}</span>
                                  <span className="skx-link-meta">{[isProvided(e.org) ? e.org : null, isProvided(e.dates) ? e.dates : null].filter(Boolean).join(' · ')}</span>
                                </span>
                                <Arrow />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="skx-empty">Select a core technology, or any linked skill in the catalogue, to list the projects and roles that used it.</p>
            )}
          </div>
        </section>
      </section>

      {/* D. Full catalogue */}
      <section className="skx-catalogue" aria-labelledby="skx-all">
        <h2 id="skx-all" className="skx-h">Full skills catalogue</h2>
        <p className="skx-hint">
          Skills shown as buttons link to projects or roles. Plain entries are recorded skills without a linked public case study.
        </p>
        <div className="skx-cats">
          {skillGroups.map((g) => (
            <details key={g.id} className="skx-cat" open={g.id === linkedGroup || undefined}>
              <summary className="skx-cat-summary">
                <span className="skx-cat-label">{g.label}</span>
                <span className="skx-cat-count mono">{g.skills.length}</span>
                <span className="skx-cat-preview">{g.skills.slice(0, 3).map((s) => s.name).join(', ')}…</span>
              </summary>
              <div className="skx-cat-body">
                <p className="skx-cat-text">{g.summary}</p>
                <ul className="skx-chips">
                  {g.skills.map((s) => <li key={s.name}>{chip(s, 'catalogue')}</li>)}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* E. Spoken languages */}
      <section className="skx-spoken" aria-labelledby="skx-spoken">
        <h2 id="skx-spoken" className="skx-label mono">Spoken languages</h2>
        <ul className="skx-spoken-list">
          {spokenLanguages.map((s) => <li key={s.name}><span className="skx-spoken-name">{s.name}</span>{s.note && <span className="muted"> — {s.note}</span>}</li>)}
        </ul>
      </section>
    </div>
  );
}
