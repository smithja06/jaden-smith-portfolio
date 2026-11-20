import { Link, useSearchParams } from 'react-router-dom';
import { allSkills, coreSkills, skillGroups, skillId, type Skill } from '../../content/skills';
import { experienceUsing, projectsUsing, skillUsage } from '../../content/relations';
import { categoryLabels, projectHref, statusLabels } from '../../content/projects';
import { isProvided } from '../../content/types';
import { Arrow } from '../Icons';

/**
 * Skills grouped by capability. Selecting a skill reveals the projects and
 * roles that used it — derived from their `tech` fields. Selection is kept in
 * ?skill= so it can be linked to.
 */
export function SkillExplorer() {
  const [params, setParams] = useSearchParams();
  const selected = allSkills.find((s) => skillId(s.name) === params.get('skill')) ?? null;

  const select = (name: string | null) => {
    const p = new URLSearchParams(params);
    if (name && selected?.name !== name) p.set('skill', skillId(name));
    else p.delete('skill');
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const chip = (s: Skill) => {
    const n = skillUsage.get(s.name) ?? 0;
    const on = selected?.name === s.name;
    const body = <>{s.name}{s.note && <span className="skx-note">{s.note}</span>}</>;
    if (n === 0) return <span className="skx-chip is-static">{body}</span>;
    return (
      <button type="button" className={`skx-chip ${on ? 'is-on' : ''}`} aria-pressed={on} aria-controls="skx-panel" onClick={() => select(s.name)}>
        {body}
        <span className="skx-count mono"><span className="sr-only">, used in </span>{n}<span className="sr-only"> items</span></span>
      </button>
    );
  };

  const projects = selected ? projectsUsing(selected.name) : [];
  const roles = selected ? experienceUsing(selected.name) : [];

  return (
    <div className="skx">
      <p className="skx-hint">Start with the core technologies, or browse every category below. Select one to see the projects and roles where it was used.</p>

      <div className="skx-layout">
        <div className="skx-groups">
          <section className="skx-group skx-core" aria-labelledby="skx-core">
            <h2 id="skx-core" className="skx-group-title">Core technologies</h2>
            <ul className="skx-chips">
              {coreSkills.map((name) => allSkills.find((s) => s.name === name)).filter((s): s is Skill => !!s).map((s) => (
                <li key={s.name}>{chip(s)}</li>
              ))}
            </ul>
          </section>

          <h2 className="skx-all-title mono">All technologies, by category</h2>
          {skillGroups.map((g) => (
            <section key={g.id} className="skx-group" aria-labelledby={`skx-${g.id}`}>
              <h3 id={`skx-${g.id}`} className="skx-group-title">{g.label}</h3>
              <ul className="skx-chips">
                {g.skills.map((s) => <li key={s.name}>{chip(s)}</li>)}
              </ul>
            </section>
          ))}
        </div>

        <aside id="skx-panel" className={`skx-panel ${selected ? 'has-selection' : ''}`} aria-live="polite" aria-label="Where this skill was used">
          {selected ? (
            <>
              <div className="skx-panel-head">
                <h2 className="skx-panel-title">{selected.name}</h2>
                <button type="button" className="text-link skx-clear" onClick={() => select(null)}>Clear</button>
              </div>
              {projects.length > 0 && (
                <>
                  <p className="skx-label mono">Projects · {projects.length}</p>
                  <ul className="skx-links">
                    {projects.map((p) => (
                      <li key={p.id}>
                        <Link to={projectHref(p)} className="skx-link">
                          <span className="skx-link-text">
                            <span className="skx-link-title">{p.title}</span>
                            <span className="skx-link-meta">{categoryLabels[p.category]} · {statusLabels[p.status]}</span>
                          </span>
                          <Arrow />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {roles.length > 0 && (
                <>
                  <p className="skx-label mono">Experience · {roles.length}</p>
                  <ul className="skx-links">
                    {roles.map((e) => (
                      <li key={e.id}>
                        <Link to={`/experience/${e.id}`} className="skx-link">
                          <span className="skx-link-text">
                            <span className="skx-link-title">{e.title}</span>
                            {isProvided(e.org) && <span className="skx-link-meta">{e.org}</span>}
                          </span>
                          <Arrow />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="skx-empty">Nothing selected. Try <b>Python</b>, <b>React</b>, <b>ESP32</b> or <b>AI agents</b>.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
