import { Link } from 'react-router-dom';
import type { Project } from '../content/types';
import { ProjectArt } from './art/ProjectArt';
import { Arrow } from './Icons';

interface Props {
  project: Project;
  variant?: 'featured' | 'standard';
  headingLevel?: 'h3' | 'h2';
}

/** Whole card is one link; content is always visible (no hover-only info). */
export function ProjectCard({ project: p, variant = 'standard', headingLevel: H = 'h3' }: Props) {
  return (
    <article className={`project-card ${variant === 'featured' ? 'is-featured' : ''}`}>
      <Link to={`/work/${p.slug}`} className="project-card-link" aria-label={`${p.title} — view case study`}>
        <div className="project-art">
          <ProjectArt art={p.art} />
          {p.conceptVisual && <span className="concept-badge project-art-badge">Concept visual</span>}
        </div>
        <div className="project-body">
          <div className="project-meta">
            <span className="status">{p.status}</span>
          </div>
          <H className="project-title">{p.title}</H>
          <p className="project-text">{p.cardText}</p>
          <ul className="tags" aria-label="Tags">
            {p.tags.map((t) => <li key={t} className="tag">{t}</li>)}
          </ul>
          <span className="project-cta">View case study <Arrow /></span>
        </div>
      </Link>
    </article>
  );
}
