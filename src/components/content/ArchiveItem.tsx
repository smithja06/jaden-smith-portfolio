import { useLocation } from 'react-router-dom';
import type { Project } from '../../content/types';
import { archiveAnchor, statusLabels } from '../../content/projects';
import { EvidenceLinks, MediaGallery, TechList } from './Meta';
import { noBreakHyphens } from '../../lib/text';

/**
 * Compact, expandable Technical-archive row. Closed: title, one line and
 * context. Open: the record's details and any evidence. Archive projects have
 * no page of their own; links to them land here (#archive-<id>) and open it.
 */
export function ArchiveRow({ project: p }: { project: Project }) {
  const { hash } = useLocation();
  const anchor = archiveAnchor(p.id);
  const cs = p.caseStudy ?? {};
  const paras = [...(cs.problem ?? []), ...(cs.implementation ?? []), ...(cs.validation ?? []), ...(cs.outcomes ?? [])];
  const notes = [...(cs.decisions ?? []).map((d) => `${d.title}: ${d.body}`), ...(cs.limitations ?? [])];
  const hasDetail = paras.length > 0 || notes.length > 0 || p.tech.length > 0 || !!p.media?.length;

  const head = (
    <>
      <span className="arch-main">
        <span className="arch-title">{noBreakHyphens(p.title)}</span>
        <span className="arch-sum">{p.summary}</span>
      </span>
      <span className="arch-side">
        <span className="arch-status mono">{statusLabels[p.status]}</span>
        <span className="arch-context">{p.context}</span>
      </span>
    </>
  );

  return (
    <li id={anchor} className="arch-item" tabIndex={-1}>
      {hasDetail ? (
        // Sharing a `name` makes the rows an exclusive accordion: opening one closes the others.
        <details className="arch-row" name="archive" open={hash === `#${anchor}` || undefined}>
          <summary className="arch-link arch-summary">{head}<span className="arch-toggle" aria-hidden="true" /></summary>
          {/* With media: text left, images right (stacked below on narrow screens). */}
          <div className={`arch-detail ${p.media?.length ? 'has-media' : ''}`}>
            <div className="arch-text">
              {paras.map((t) => <p key={t}>{t}</p>)}
              {notes.length > 0 && <ul className="sec-dash">{notes.map((t) => <li key={t}>{t}</li>)}</ul>}
              <TechList tech={p.tech} />
              <EvidenceLinks evidence={p.evidence} className="case-evidence" />
            </div>
            {/* Only loaded once the row is opened; each image opens full size. */}
            <MediaGallery media={p.media} className="arch-media" zoom />
          </div>
        </details>
      ) : (
        <div className="arch-link">{head}</div>
      )}
    </li>
  );
}
