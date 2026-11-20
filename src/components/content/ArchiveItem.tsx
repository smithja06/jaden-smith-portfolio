import { Link } from 'react-router-dom';
import type { Project } from '../../content/types';
import { statusLabels } from '../../content/projects';
import { featuredProjectIds } from '../../content/featured';
import { Arrow } from '../Icons';

/** Compact archive row: title, context, one line, status. The whole row is the link. */
export function ArchiveItem({ project: p, headingLevel: H = 'h4' }: { project: Project; headingLevel?: 'h3' | 'h4' | 'h5' }) {
  return (
    <li className="arch-item">
      <Link to={`/work/${p.id}`} className="arch-link">
        <div className="arch-main">
          <H className="arch-title">
            {p.title}
            {featuredProjectIds.has(p.id) && <span className="arch-star mono" title="Featured project">Featured</span>}
          </H>
          <span className="arch-sum">{p.summary}</span>
        </div>
        <span className="arch-side">
          <span className="arch-status mono">{statusLabels[p.status]}</span>
          <span className="arch-context">{p.context}</span>
        </span>
        <Arrow />
      </Link>
    </li>
  );
}
