import { Link } from 'react-router-dom';
import { isProvided, type Evidence, type MediaItem, type Metric } from '../../content/types';

/** Small status pill: '● Working prototype'. */
export function StatusBadge({ children }: { children: string }) {
  return <p className="sec-badge mono"><span className="sec-badge-dot" aria-hidden="true" />{children}</p>;
}

/** Reported figures. A note (how it was measured) is shown as smaller text. */
export function MetricList({ metrics, compact }: { metrics?: Metric[]; compact?: boolean }) {
  if (!metrics?.length) return null;
  return (
    <dl className={`metrics ${compact ? 'is-compact' : ''}`}>
      {metrics.map((m) => (
        <div key={m.label} className="metric">
          <dt className="metric-label">{m.label}</dt>
          <dd className="metric-value">{m.value}</dd>
          {!compact && m.note && <dd className="metric-note">{m.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function TechList({ tech, label = 'Technologies' }: { tech?: string[]; label?: string }) {
  if (!tech?.length) return null;
  return (
    <ul className="sec-tags" aria-label={label}>
      {tech.map((t) => <li key={t} className="mono">{t}</li>)}
    </ul>
  );
}

const evidenceLabels: Record<'repo' | 'demo' | 'video' | 'report', string> = {
  repo: 'Source code',
  demo: 'Live demo',
  video: 'Video',
  report: 'Report',
};

/** Only links that hold a real URL. Returns null when there are none. */
export function evidenceItems(e?: Evidence): { label: string; href: string }[] {
  if (!e) return [];
  const items = (Object.keys(evidenceLabels) as (keyof typeof evidenceLabels)[])
    .filter((k) => isProvided(e[k]))
    .map((k) => ({ label: evidenceLabels[k], href: e[k] as string }));
  for (const o of e.other ?? []) if (isProvided(o.href)) items.push({ label: o.label, href: o.href });
  return items;
}

export function EvidenceLinks({ evidence, className = 'evidence' }: { evidence?: Evidence; className?: string }) {
  const items = evidenceItems(evidence);
  if (!items.length) return null;
  return (
    <ul className={className}>
      {items.map((l) => (
        <li key={l.href}>
          {l.href.startsWith('/')
            ? <Link to={l.href} className="btn btn-ghost btn-sm">{l.label}</Link>
            : <a href={l.href} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">{l.label} <span aria-hidden="true">↗</span></a>}
        </li>
      ))}
    </ul>
  );
}

/** Photos, screenshots, videos, diagrams and PDFs. Renders nothing when empty. */
export function MediaGallery({ media }: { media?: MediaItem[] }) {
  if (!media?.length) return null;
  return (
    <div className="media-grid">
      {media.map((m) => (
        <figure key={m.src} className={`media-item media-${m.kind}`}>
          {m.kind === 'video' ? (
            <video src={m.src} poster={m.poster} controls preload="metadata" aria-label={m.alt} />
          ) : m.kind === 'pdf' ? (
            <a href={m.src} target="_blank" rel="noreferrer" className="media-pdf">
              <span className="mono">PDF</span> {m.caption ?? m.alt}
            </a>
          ) : (
            <img src={m.src} alt={m.alt} loading="lazy" decoding="async" />
          )}
          {m.caption && m.kind !== 'pdf' && <figcaption className="muted">{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
