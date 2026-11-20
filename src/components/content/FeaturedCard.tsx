import { Link } from 'react-router-dom';
import type { FeaturedCard as Card } from '../../content/featured';
import { ProjectArt } from '../art/ProjectArt';
import { Arrow } from '../Icons';
import { TechList } from './Meta';

/**
 * Illustrated card for the Projects hub's Featured collection: illustration,
 * category, title, one sentence, one verified result and three technologies.
 * The homepage uses the text-only ProjectGridCard.
 */
export function FeaturedCard({
  card,
  headingLevel: H = 'h3',
  linkState,
}: {
  card: Card;
  headingLevel?: 'h2' | 'h3' | 'h4';
  linkState?: object;
}) {
  return (
    <article className="project-card is-featured feat-card">
      <Link to={card.href} state={linkState} className="project-card-link">
        {card.art && (
          <div className="project-art">
            <ProjectArt art={card.art} />
            <span className="concept-badge project-art-badge">Illustration</span>
          </div>
        )}
        <div className="project-body">
          <span className="feat-category mono">{card.category}</span>
          <H className="project-title">{card.title}</H>
          <p className="project-text">{card.summary}</p>
          {card.result && <p className="feat-outcome">{card.result}</p>}
          <TechList tech={card.tech} />
          <span className="project-cta">
            Read the case study <Arrow />
            <span className="sr-only">: {card.title}</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
