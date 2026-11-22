import { Link } from 'react-router-dom';
import type { FeaturedCard } from '../../content/featured';
import { Arrow } from '../Icons';
import { noBreakHyphens } from '../../lib/text';

const MAX_TAGS = 6;

/**
 * Text-only project card for the homepage grid: title, a two-line "where it
 * was built" badge, a short description, technology tags, and a footer link
 * pinned to the bottom so every card in a row lines up.
 * The whole card is clickable through the case-study link; a repository
 * link (when supplied) sits above it in the footer.
 */
export function ProjectGridCard({ card }: { card: FeaturedCard }) {
  const tags = card.tech.slice(0, MAX_TAGS);
  return (
    <li className="pgc">
      <h3 className="pgc-title">{noBreakHyphens(card.title)}</h3>
      <p className="pgc-badge">
        <svg className="pgc-badge-icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="7" cy="7" r="2" fill="currentColor" />
        </svg>
        <span className="pgc-badge-text">
          <span className="pgc-badge-title">{card.badge.title}</span>
          {card.badge.sub && <span className="pgc-badge-sub">{card.badge.sub}</span>}
        </span>
      </p>
      <p className="pgc-text">{card.summary}</p>
      {tags.length > 0 && (
        <ul className="pgc-tags" aria-label="Technologies">
          {tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}
      <div className="pgc-foot">
        <Link to={card.href} className="pgc-link">
          {card.href.startsWith('/experience') ? 'Read about the role' : 'Read the case study'} <Arrow />
          <span className="sr-only">: {card.title}</span>
        </Link>
        {card.repo && (
          <a href={card.repo} className="pgc-repo" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span><span className="sr-only"> repository for {card.title}</span>
          </a>
        )}
      </div>
    </li>
  );
}
