import type { DiagramNode } from '../content/types';

/**
 * Responsive pipeline diagram built from HTML (so it reflows on mobile)
 * with SVG-free CSS connectors. Each node's detail is visible text, not hover-only.
 */
export function SystemDiagram({ nodes, caption }: { nodes: DiagramNode[]; caption: string }) {
  return (
    <figure className="sysdiag">
      <ol className="sysdiag-list" style={{ ['--n' as string]: nodes.length }}>
        {nodes.map((n, i) => (
          <li key={n.id} className="sysdiag-node">
            <span className="sysdiag-index mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="sysdiag-label">{n.label}</span>
            <span className="sysdiag-detail">{n.detail}</span>
          </li>
        ))}
      </ol>
      <figcaption className="muted sysdiag-caption">{caption}</figcaption>
    </figure>
  );
}
