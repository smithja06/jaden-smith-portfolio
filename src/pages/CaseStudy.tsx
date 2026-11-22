import { useId, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  caseStudiesByIds,
  categoryLabels,
  coreTechOf,
  getProject,
  hasCaseStudy,
  moduleAnchor,
  modulesOf,
  ownershipLabels,
  statusLabels,
  workRedirect,
} from '../content/projects';
import { experienceHref, getExperience } from '../content/experience';
import { isProvided, type Decision, type Metric, type Project } from '../content/types';
import { experiments } from '../lab3d/config/stations';
import { ProjectArt } from '../components/art/ProjectArt';
import { SystemDiagram } from '../components/SystemDiagram';
import { Arrow, ArrowLeft } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { MediaFigure, MediaGallery, MetricList, TechList, evidenceItems } from '../components/content/Meta';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProjectsReturn } from '../hooks/useProjectsReturn';
import NotFound from './NotFound';
import { noBreakHyphens } from '../lib/text';

/** Outcomes shown under Results; anything beyond lives in the record. */
const MAX_RESULTS = 3;
/** Id of the one technical disclosure on each page. */
const TECH_ID = 'technical-details';
const techSubId = (key: string) => `tech-${key}`;

/**
 * One template for every case study: Overview, What I built, How it works,
 * Results, Explore. Each layout adapts to how much content there is — a
 * single result, subsystem or resource gets a single intentional treatment,
 * never the first slot of an empty grid. All low-level detail lives in one
 * "Explore technical details" disclosure. /work/<slug> for anything without
 * its own page redirects to where it now lives.
 */
export default function CaseStudy() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  const live = p && hasCaseStudy(p) ? p : undefined;
  usePageTitle(live?.title ?? 'Page not found', live?.summary);
  if (!live) {
    const to = workRedirect(slug);
    return to ? <Navigate to={to} replace /> : <NotFound />;
  }
  return <ProjectDetail key={live.id} p={live} />;
}

const para = (items?: string[]) => (items?.length ? items.map((t, i) => <p key={i}>{t}</p>) : null);
const bullets = (items?: string[]) => (items?.length ? <ul className="sec-dash">{items.map((t) => <li key={t}>{t}</li>)}</ul> : null);
const textLength = (items?: string[]) => (items ?? []).join(' ').length;

/** Below this many words, project-wide technical content is shown directly rather than behind a disclosure. */
const INLINE_WORDS = 45;
const words = (items: (string | undefined)[]) => items.join(' ').split(/\s+/).filter(Boolean).length;

const isCovered = (cs: { covered?: string[] }, field: 'contributions' | 'validation' | 'limitations') => !!cs.covered?.includes(field);

/** Numbered ownership list: one column up to three items, two balanced columns from four. */
function Points({ items }: { items: string[] }) {
  return (
    <ol className={`case-points ${items.length >= 4 ? 'is-split' : ''}`}>
      {items.map((t, i) => (
        <li key={t}><span className="case-points-n mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>
      ))}
    </ol>
  );
}

function Decisions({ items }: { items: Decision[] }) {
  return (
    <dl className="case-dl">
      {items.map((d) => (
        <div key={d.title}>
          <dt>{d.title}</dt>
          <dd>{d.body}</dd>
        </div>
      ))}
    </dl>
  );
}

type Part = { key: string; title: string; body: ReactNode };

/**
 * Project-wide technical content (anything not owned by a subsystem card).
 * Substantial content sits behind one disclosure; a little is shown inline.
 */
function TechnicalDetails({ parts, inline }: { parts: Part[]; inline?: boolean }) {
  const shown = parts.filter((x) => x.body);
  if (!shown.length) return null;
  if (inline) {
    return (
      <div className="case-tech-inline">
        {shown.map((x) => (
          <div key={x.key} className="case-tech-sub">
            <h3 className="case-subh mono">{x.title}</h3>
            {x.body}
          </div>
        ))}
      </div>
    );
  }
  return (
    <details id={TECH_ID} className="disclose case-disclose">
      <summary className="disclose-summary">
        Explore technical details
        <span className="case-disclose-hint mono">{shown.map((x) => x.title).join(' · ')}</span>
      </summary>
      <div className="case-breakdown">
        {shown.map((x) => (
          <section key={x.key} id={techSubId(x.key)} className="case-tech-sub" aria-labelledby={`${techSubId(x.key)}-h`}>
            <h3 id={`${techSubId(x.key)}-h`} className="case-subh mono">{x.title}</h3>
            {x.body}
          </section>
        ))}
      </div>
    </details>
  );
}

interface Resource {
  key: string;
  kind: string;
  title: string;
  text?: string;
  cta: string;
  href: string;
  external?: boolean;
  /** Router state for internal links (e.g. the Projects return path). */
  state?: unknown;
}

/** Action wording for evidence links, by label; anything else just opens. */
const evidenceCta: Record<string, string> = {
  'Source code': 'View repository',
  'Live demo': 'Open demo',
  Video: 'Watch video',
  Report: 'Read report',
};

/**
 * Explore: one card per resource (experiment, evidence, role, related
 * project), all with the same structure — type label, title, optional
 * context, action pinned to the bottom. Cards in a row share a height; the
 * column count follows the number of cards so no row has an empty cell.
 */
function Resources({ items }: { items: Resource[] }) {
  const layout = items.length === 1 ? 'is-one' : items.length === 2 ? 'is-two' : items.length === 3 ? 'is-three' : 'is-many';
  return (
    <ul className={`case-res ${layout}`}>
      {items.map((r) => {
        const body = (
          <>
            <span className="case-res-kind mono">{r.kind}</span>
            <span className="case-res-title">{noBreakHyphens(r.title)}</span>
            {r.text && <span className="case-res-text">{r.text}</span>}
            <span className="case-res-cta">{r.cta} {r.external ? <span aria-hidden="true">↗</span> : <Arrow />}</span>
          </>
        );
        return (
          <li key={r.key}>
            {r.external
              ? <a href={r.href} className="case-res-link" target="_blank" rel="noreferrer">{body}</a>
              : <Link to={r.href} state={r.state} className="case-res-link">{body}</Link>}
          </li>
        );
      })}
    </ul>
  );
}

function ProjectDetail({ p }: { p: Project }) {
  const cs = p.caseStudy ?? {};
  const back = useProjectsReturn();
  const modules = modulesOf(p.id);
  const related = caseStudiesByIds(p.related).filter((r) => r.id !== p.id);
  const roles = (p.experience ?? []).map(getExperience).filter((e) => !!e);
  const sim = p.simulation ? experiments.find((e) => e.id === p.simulation!.id) : undefined;
  const core = coreTechOf(p).slice(0, 4);
  const outcomes: Metric[] = (p.metrics ?? []).filter((m) => !m.detail).slice(0, MAX_RESULTS);
  const parameters: Metric[] = (p.metrics ?? []).filter((m) => m.detail);
  // With a short `built` list, the full contribution detail moves into the technical details.
  const summarized = !!cs.built?.length;
  // Shown in the disclosure only when it adds detail not already on the page.
  const showContributionDetail = summarized && !isCovered(cs, 'contributions') && !!(p.ownershipNote || cs.contributions?.length);
  // Decisions and parameters tagged with a subsystem live in that subsystem's card.
  const moduleIds = new Set(modules.map((m) => m.id));
  const ownedBy = (s?: string) => !!s && moduleIds.has(s);
  const projectDecisions = (cs.decisions ?? []).filter((d) => !ownedBy(d.subsystem));
  const projectParameters = parameters.filter((m) => !ownedBy(m.subsystem));
  const moduleTech = new Set(modules.flatMap((m) => m.tech));
  const extraTech = p.tech.filter((t) => !core.includes(t) && !moduleTech.has(t));
  const projectWords = words([
    ...(showContributionDetail ? [p.ownershipNote, ...(cs.contributions ?? [])] : []),
    ...projectDecisions.flatMap((d) => [d.title, d.body]),
    ...(cs.technical ?? []),
    ...projectParameters.flatMap((m) => [m.value, m.label]),
  ]);
  const evidence = [...(cs.validation ?? []), ...(cs.outcomes ?? [])];
  // Planned work alone is not a result: it then closes How it works instead.
  const hasResults = outcomes.length > 0 || evidence.length > 0 || !!cs.limitations?.length;
  const [overview, ...context] = cs.problem ?? [];
  // Media sits beside the work it documents; only unplaced items fall through to Explore.
  const media = p.media ?? [];
  const heroImage = media.find((m) => m.placement === 'hero' && m.kind === 'image');
  const placed = (where: 'how' | 'results') => media.filter((m) => m.placement === where).map((m) => <MediaFigure key={m.src} m={m} className="case-figure" />);

  const meta: [string, string | undefined][] = [
    ['Context', p.context],
    ['Role', p.ownership ? ownershipLabels[p.ownership] : undefined],
    ['Status', statusLabels[p.status]],
    ['Dates', isProvided(p.dates) ? p.dates : undefined],
  ];

  const sections: { id: string; title: string; body: ReactNode }[] = [];
  const add = (id: string, title: string, parts: ReactNode[]) => {
    const body = parts.filter(Boolean);
    if (body.length) sections.push({ id, title, body: <>{body}</> });
  };

  /* ---------- Overview ---------- */
  add('overview', 'Overview', [overview && <p key="o" className="case-intro">{overview}</p>]);

  /* ---------- What I built ---------- */
  const mine = summarized ? cs.built! : cs.contributions ?? [];
  add('built', 'What I built', [
    !summarized && p.ownershipNote && <p key="own" className="case-text">{p.ownershipNote}</p>,
    mine.length > 0 && <Points key="pts" items={mine} />,
    cs.team?.length ? (
      <aside key="team" className="case-team" aria-label="Team context">
        <p className="case-subh mono">Team context</p>
        {para(cs.team)}
      </aside>
    ) : null,
  ]);

  /* ---------- How it works ---------- */
  const singleModule = modules.length === 1;
  const projectParts: Part[] = [
    { key: 'implementation', title: 'Implementation', body: showContributionDetail ? (
      <div className="case-text">{p.ownershipNote && <p>{p.ownershipNote}</p>}{bullets(cs.contributions)}</div>
    ) : null },
    { key: 'decisions', title: modules.length ? 'System design decisions' : 'Design decisions', body: (projectDecisions.length || cs.technical?.length) ? (
      <>
        {projectDecisions.length ? <Decisions items={projectDecisions} /> : null}
        {cs.technical?.length ? <div className="case-text">{bullets(cs.technical)}</div> : null}
      </>
    ) : null },
    { key: 'parameters', title: 'Parameters', body: projectParameters.length ? <MetricList metrics={projectParameters} compact /> : null },
    { key: 'stack', title: 'Additional technologies', body: extraTech.length ? <TechList tech={extraTech} label="Additional technologies" /> : null },
  ];
  add('how', 'How it works', [
    context.length ? <div key="ctx" className="case-text">{para(context)}</div> : null,
    cs.architecture && <SystemDiagram key="arch" nodes={cs.architecture.nodes} caption={cs.architecture.caption} />,
    ...placed('how'),
    cs.implementation?.length ? <div key="impl" className="case-text">{para(cs.implementation)}</div> : null,
    cs.challenges?.length ? (
      <div key="ch" className="case-text">
        <p className="case-subh mono">Challenges</p>
        {para(cs.challenges)}
      </div>
    ) : null,
    modules.length > 0 && (
      <div key="mods" className={`case-modules ${modules.length === 1 ? 'is-one' : modules.length === 2 ? 'is-two' : 'is-many'}`}>
        {modules.map((m) => (
          <ModuleCard
            key={m.id}
            m={m}
            parentSim={p.simulation?.id}
            decisions={(cs.decisions ?? []).filter((d) => d.subsystem === m.id)}
            parameters={parameters.filter((x) => x.subsystem === m.id)}
            extra={singleModule ? projectParts : []}
          />
        ))}
      </div>
    ),
    !hasResults && cs.future?.length ? (
      <div key="next" className="case-text">
        <p className="case-subh mono">Next steps</p>
        {bullets(cs.future)}
      </div>
    ) : null,
    // With exactly one subsystem card, project-wide details live inside that card's dropdown.
    !singleModule && <TechnicalDetails key="tech" inline={projectWords <= INLINE_WORDS} parts={projectParts} />,
  ]);

  /* ---------- Results ---------- */
  const balanced = !!cs.limitations?.length && !!cs.future?.length
    && Math.max(textLength(cs.limitations), textLength(cs.future)) <= 2.2 * Math.min(textLength(cs.limitations), textLength(cs.future));
  const outcomeBlock = outcomes.length === 1 ? (
    <div key="one" className="case-outcome">
      <p className="case-outcome-head"><span className="case-outcome-value">{outcomes[0].value}</span> <span className="case-outcome-label">{outcomes[0].label}</span></p>
      {evidence.length > 0 && <div className="case-text">{para(evidence)}</div>}
    </div>
  ) : (outcomes.length > 1 || evidence.length > 0) && (
    <div key="many" className="case-results">
      {outcomes.length > 1 && <MetricList metrics={outcomes} />}
      {evidence.length > 0 && <div className="case-text">{para(evidence)}</div>}
    </div>
  );
  const limitsBlock = hasResults && (cs.limitations?.length || cs.future?.length) ? (
    <div key="lf" className={`case-pair ${balanced ? 'is-split' : ''}`}>
      {cs.limitations?.length ? <div className="case-pair-item"><h3 className="case-subh mono">Limitations</h3>{bullets(cs.limitations)}</div> : null}
      {cs.future?.length ? <div className="case-pair-item"><h3 className="case-subh mono">Next steps</h3>{bullets(cs.future)}</div> : null}
    </div>
  ) : null;
  // A vertical clip is narrow: it sits beside the results text instead of below it.
  const resultsMedia = media.filter((m) => m.placement === 'results');
  const sideMedia = resultsMedia.length > 0 && resultsMedia.every((m) => !!m.width && !!m.height && m.height > m.width);
  add('results', 'Results', sideMedia ? [
    <div key="split" className="case-split">
      <div className="case-split-main">{outcomeBlock}{limitsBlock}</div>
      <div className="case-split-media">{placed('results')}</div>
    </div>,
  ] : [outcomeBlock, ...placed('results'), limitsBlock]);

  /* ---------- Explore ---------- */
  const resources: Resource[] = [
    ...(sim && p.simulation ? [{ key: 'sim', kind: 'Interactive experiment', title: sim.title, text: sim.blurb, cta: 'Open experiment', href: sim.route }] : []),
    ...evidenceItems(p.evidence).map((e) => ({ key: e.href, kind: 'Project evidence', title: e.label, cta: evidenceCta[e.label] ?? 'Open', href: e.href, external: !e.href.startsWith('/') })),
    ...roles.map((e) => ({
      key: `exp-${e!.id}`,
      kind: 'Related experience',
      title: e!.title,
      text: isProvided(e!.org) ? e!.org : undefined,
      cta: 'View experience',
      href: experienceHref(e!),
    })),
    // Related case studies, as cards here rather than a separate list below.
    ...related.map((r) => ({
      key: `rel-${r.id}`,
      kind: 'Related project',
      title: r.title,
      text: `${categoryLabels[r.category]} · ${r.context}`,
      cta: 'View project',
      href: `/work/${r.id}`,
      state: back.carry,
    })),
  ];
  add('explore', 'Explore', [
    resources.length > 0 && <Resources key="res" items={resources} />,
    <MediaGallery key="media" media={media.filter((m) => !m.placement)} />,
  ]);

  return (
    <article className="page case case-study">
      <div className="container">
        <Link to={back.to} state={back.state} className="case-back">
          <ArrowLeft /> All Projects
        </Link>

        <header className={`case-hero ${heroImage || p.art ? 'has-media' : ''}`}>
          <div className="case-hero-copy">
            <p className="eyebrow">{categoryLabels[p.category]}</p>
            <h1 className="h-section">{noBreakHyphens(p.title)}</h1>
            <p className="lead">{p.summary}</p>
            {core.length > 0 && <TechList tech={core} label="Core technologies" />}
            <dl className="case-meta">
              {meta.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
          {heroImage ? (
            <figure className="case-hero-media is-photo" style={heroImage.width && heroImage.height ? { aspectRatio: `${heroImage.width} / ${heroImage.height}` } : undefined}>
              <img src={heroImage.src} alt={heroImage.alt} width={heroImage.width} height={heroImage.height} decoding="async" fetchPriority="high" />
            </figure>
          ) : p.art ? (
            <div className="case-hero-media case-art">
              <ProjectArt art={p.art} />
              <span className="concept-badge project-art-badge">Illustration</span>
            </div>
          ) : null}
        </header>

        {sections.length > 0 && (
          <div className="case-body">
            {sections.map((s) => (
              <Reveal key={s.id} as="section" id={`cs-${s.id}-sec`} className={`case-section case-${s.id}`} aria-labelledby={`cs-${s.id}`}>
                <h2 id={`cs-${s.id}`} className="case-h">{s.title}</h2>
                <div className="case-stack">{s.body}</div>
              </Reveal>
            ))}
          </div>
        )}

        <nav className="case-next" aria-label="Back to projects">
          <Link to={back.to} state={back.state} className="case-back case-back-end">
            <ArrowLeft /> All Projects
          </Link>
        </nav>
      </div>
    </article>
  );
}

/**
 * A subsystem (consolidated module) that expands inside its own card. Holds
 * everything technical that belongs to it: implementation, the parent's
 * decisions and parameters tagged with its id, testing and its stack.
 * Each card keeps its own open state; there is no link to anything elsewhere.
 */
function ModuleCard({ m, parentSim, decisions, parameters, extra }: { m: Project; parentSim?: string; decisions: Decision[]; parameters: Metric[]; extra: Part[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const cs = m.caseStudy ?? {};
  const sim = m.simulation && m.simulation.id !== parentSim ? experiments.find((e) => e.id === m.simulation!.id) : undefined;
  const parts: Part[] = [
    { key: 'impl', title: cs.implementation?.length ? 'Implementation' : 'Context', body: (cs.problem?.length || cs.implementation?.length) ? <div className="case-text">{para(cs.problem)}{para(cs.implementation)}</div> : null },
    { key: 'spec', title: 'Specifications', body: parameters.length ? <MetricList metrics={parameters} compact /> : null },
    { key: 'dec', title: 'Design decisions', body: decisions.length ? <Decisions items={decisions} /> : null },
    { key: 'test', title: 'Testing', body: cs.validation?.length && !isCovered(cs, 'validation') ? <div className="case-text">{para(cs.validation)}</div> : null },
    { key: 'lim', title: 'Limitations', body: cs.limitations?.length && !isCovered(cs, 'limitations') ? <div className="case-text">{bullets(cs.limitations)}</div> : null },
    { key: 'tech', title: 'Technologies', body: m.tech.length ? <TechList tech={m.tech} /> : null },
    // Project-wide details, moved in unchanged when this is the page's only subsystem.
    ...extra.map((x) => ({ ...x, key: `project-${x.key}` })),
  ].filter((x) => x.body);
  return (
    <section id={moduleAnchor(m.id)} className={`case-module ${open ? 'is-open' : ''}`} aria-labelledby={`${moduleAnchor(m.id)}-t`} tabIndex={-1}>
      <div className="case-module-head">
        <p className="case-module-kicker mono">Key subsystem{m.ownership ? ` · ${ownershipLabels[m.ownership]}` : ''}</p>
        <h3 id={`${moduleAnchor(m.id)}-t`} className="case-module-title">{noBreakHyphens(m.title)}</h3>
      </div>
      <div className="case-module-body">
        <p>{m.summary}</p>
        <p className="case-module-links">
          {parts.length > 0 && (
            <button type="button" className="text-link case-module-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
              {open ? 'Hide implementation details' : 'Explore implementation details'}
              <span className="case-chevron" aria-hidden="true" />
            </button>
          )}
          {sim && m.simulation && <Link to={sim.route} className="text-link">{m.simulation.label} <Arrow /></Link>}
        </p>
      </div>
      {parts.length > 0 && (
        <div id={panelId} className="case-module-panel" role="region" aria-label={`${m.title}: implementation details`}>
          <div className="case-module-panel-inner">
            {parts.map((x) => (
              <div key={x.key} className="case-module-part">
                <h4 className="case-subh mono">{x.title}</h4>
                {x.body}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
