import { Link } from 'react-router-dom';
import type { FeaturedCard as Card } from '../../content/featured';
import { ProjectArt } from '../art/ProjectArt';
import { Arrow } from '../Icons';
import { MetricList, StatusBadge, TechList } from './Meta';

/** One verified outcome, as a single line: a metric if there is one, else the first highlight. */
function outcomeLine(card: Card): string | undefined {
  const m = card.metrics[0];
  if (m) return `${m.value} ${m.label}`;
  return card.highlights[0];
}

/**
 * Flagship card. `home` keeps it to the essentials — title, one sentence,
 * one outcome, three technologies. `full` (Projects page) adds the status
 * and up to two figures.
 */
export function FeaturedCard({
  card,
  headingLevel: H = 'h3',
  variant = 'full',
}: {
  card: Card;
  headingLevel?: 'h2' | 'h3' | 'h4';
  variant?: 'home' | 'full';
}) {
  const home = variant === 'home';
  const outcome = home ? outcomeLine(card) : undefined;
  return (
    <article className={`project-card is-featured feat-card ${home ? 'is-home' : ''}`}>
      <Link to={card.href} className="project-card-link">
        {card.art && (
          <div className="project-art">
            <ProjectArt art={card.art} />
            <span className="concept-badge project-art-badge">Illustration</span>
          </div>
        )}
        <div className="project-body">
          <div className="feat-meta">
            <span className="feat-category mono">{card.category}</span>
            {!home && <StatusBadge>{card.status}</StatusBadge>}
          </div>
          <H className="project-title">{card.title}</H>
          {!home && <p className="feat-context">{card.context}</p>}
          <p className="project-text">{card.summary}</p>
          {home ? (
            outcome && <p className="feat-outcome">{outcome}</p>
          ) : card.metrics.length > 0 ? (
            <MetricList metrics={card.metrics.slice(0, 2)} compact />
          ) : (
            card.highlights.length > 0 && (
              <ul className="feat-highlights">{card.highlights.slice(0, 2).map((h) => <li key={h}>{h}</li>)}</ul>
            )
          )}
          <TechList tech={card.tech.slice(0, home ? 3 : 4)} />
          <span className="project-cta">
            {card.href.startsWith('/experience') ? 'Read about the role' : 'Read the case study'} <Arrow />
            <span className="sr-only">: {card.title}</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
