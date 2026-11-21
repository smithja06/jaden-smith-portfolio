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

/**
 * One photo, drawing or video with its caption. The file's own width and
 * height reserve its box, so nothing shifts as it loads and nothing is
 * stretched. Videos never autoplay and load nothing until played.
 */
export function MediaFigure({ m, className = '', zoom }: { m: MediaItem; className?: string; zoom?: boolean }) {
  const portrait = !!m.width && !!m.height && m.height > m.width;
  const box = m.width && m.height ? { aspectRatio: `${m.width} / ${m.height}` } : undefined;
  const cls = ['media-item', `media-${m.kind}`, portrait && 'is-portrait', m.fit === 'contain' && 'is-contain', className].filter(Boolean).join(' ');
  return (
    <figure className={cls}>
      {m.kind === 'video' ? (
        <video
          src={m.src}
          poster={m.poster}
          width={m.width}
          height={m.height}
          style={box}
          controls
          playsInline
          preload="none"
          aria-label={m.alt}
        />
      ) : m.kind === 'pdf' ? (
        <a href={m.src} target="_blank" rel="noreferrer" className="media-pdf">
          <span className="mono">PDF</span> {m.caption ?? m.alt}
        </a>
      ) : (
        zoom ? (
          <a href={m.src} target="_blank" rel="noreferrer" className="media-zoom" aria-label={`${m.alt} (opens full size in a new tab)`}>
            <img src={m.src} alt="" width={m.width} height={m.height} style={box} loading="lazy" decoding="async" />
          </a>
        ) : (
          <img src={m.src} alt={m.alt} width={m.width} height={m.height} style={box} loading="lazy" decoding="async" />
        )
      )}
      {(m.title || m.caption) && m.kind !== 'pdf' && (
        <figcaption>
          {m.title && <span className="media-title">{m.title}</span>}
          {m.caption && <span className="muted">{m.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** Photos, screenshots, videos, diagrams and PDFs. Renders nothing when empty. */
export function MediaGallery({ media, className = '', zoom }: { media?: MediaItem[]; className?: string; zoom?: boolean }) {
  if (!media?.length) return null;
  return (
    <div className={`media-grid ${className}`}>
      {media.map((m) => <MediaFigure key={m.src} m={m} zoom={zoom} />)}
    </div>
  );
}
