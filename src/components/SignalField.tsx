import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Info } from './Icons';

/**
 * Signal Field — original decorative visualization. Canvas 2D only.
 *
 * Default (homepage hero): three sparse node groups (perceive → process →
 * respond) joined by arcs that carry small pulses, over a faint contour surface.
 *
 * With `clusters` (About page): four discipline clusters around a central core.
 * Each cluster gets a small focusable label; hovering or focusing it brightens
 * that cluster and its connections and reveals a one-line description.
 */

export interface SignalCluster { label: string; detail: string; }

interface Node { x: number; y: number; r: number; group: number; }
interface Arc { a: Node; b: Node; c1: [number, number]; c2: [number, number]; speed: number; offset: number; }

function buildScene() {
  const nodes: Node[] = [
    // perceive — loose scatter on the left
    { x: 0.14, y: 0.30, r: 2.2, group: 0 },
    { x: 0.09, y: 0.47, r: 1.8, group: 0 },
    { x: 0.18, y: 0.58, r: 2.4, group: 0 },
    { x: 0.12, y: 0.72, r: 1.6, group: 0 },
    { x: 0.24, y: 0.40, r: 1.7, group: 0 },
    // process — a tight core
    { x: 0.50, y: 0.46, r: 4.6, group: 1 },
    { x: 0.44, y: 0.36, r: 2.0, group: 1 },
    { x: 0.56, y: 0.58, r: 2.2, group: 1 },
    // respond — a small 2×2 lattice (nod to the 4×4 output idea)
    { x: 0.80, y: 0.40, r: 2.6, group: 2 },
    { x: 0.88, y: 0.40, r: 2.6, group: 2 },
    { x: 0.80, y: 0.50, r: 2.6, group: 2 },
    { x: 0.88, y: 0.50, r: 2.6, group: 2 },
  ];
  const core = nodes[5];
  const arcs: Arc[] = [];
  let k = 0;
  for (const n of nodes) {
    if (n.group === 0) {
      arcs.push({ a: n, b: core, c1: [n.x + 0.14, n.y - 0.12 + (n.y - 0.5) * 0.2], c2: [core.x - 0.16, core.y + (n.y - 0.5) * 0.5], speed: 0.07 + (k % 3) * 0.015, offset: k * 0.21 });
    }
    if (n.group === 2) {
      arcs.push({ a: core, b: n, c1: [core.x + 0.14, core.y - 0.18 + (n.y - 0.45) * 0.8], c2: [n.x - 0.12, n.y + (n.x - 0.84) * 1.2], speed: 0.06 + (k % 2) * 0.02, offset: k * 0.17 });
    }
    k++;
  }
  arcs.push({ a: nodes[6], b: core, c1: [0.46, 0.4], c2: [0.48, 0.42], speed: 0.1, offset: 0.4 });
  arcs.push({ a: core, b: nodes[7], c1: [0.53, 0.5], c2: [0.55, 0.54], speed: 0.1, offset: 0.7 });
  return { nodes, arcs };
}

/** Cluster centres for the four-discipline layout (fractions of width / height). */
const CLUSTER_POS: [number, number][] = [[0.2, 0.26], [0.8, 0.26], [0.2, 0.74], [0.8, 0.74]];

function buildClusterScene() {
  const core: Node = { x: 0.5, y: 0.5, r: 4.6, group: -1 };
  const nodes: Node[] = [core];
  const arcs: Arc[] = [];
  const offsets: [number, number, number][] = [[0, 0, 3], [-0.06, 0.07, 1.8], [0.06, 0.06, 2.1], [0.03, -0.08, 1.6]];
  CLUSTER_POS.forEach(([cx, cy], g) => {
    offsets.forEach(([dx, dy, r], i) => {
      const n: Node = { x: cx + dx * (cx < 0.5 ? 1 : -1), y: cy + dy * (cy < 0.5 ? 1 : -1), r, group: g };
      nodes.push(n);
      // Every cluster node feeds the core; the main node also receives a signal back.
      const bend = (cy < 0.5 ? -1 : 1) * 0.1;
      arcs.push({ a: n, b: core, c1: [n.x + (0.5 - n.x) * 0.35, n.y + bend], c2: [0.5 + (n.x - 0.5) * 0.3, 0.5 + bend * 0.6], speed: 0.055 + ((g + i) % 3) * 0.012, offset: g * 0.23 + i * 0.11 });
      if (i === 0) arcs.push({ a: core, b: n, c1: [0.5 + (n.x - 0.5) * 0.3, 0.5 - bend * 0.6], c2: [n.x + (0.5 - n.x) * 0.35, n.y - bend], speed: 0.05, offset: 0.5 + g * 0.19 });
    });
  });
  return { nodes, arcs };
}

function bez(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

export function SignalField({ clusters }: { clusters?: SignalCluster[] } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const redrawRef = useRef<() => void>(() => {});
  const hasClusters = !!clusters?.length;
  useEffect(() => { activeRef.current = active; redrawRef.current(); }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, arcs } = hasClusters ? buildClusterScene() : buildScene();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const pointer = { x: -1, y: -1, tx: 0, ty: 0, px: 0, py: 0 };
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now(), time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // ease parallax
      pointer.px += (pointer.tx - pointer.px) * 0.06;
      pointer.py += (pointer.ty - pointer.py) * 0.06;
      const par = (depth: number) => [pointer.px * depth, pointer.py * depth] as const;

      // contour surface (homepage scene only)
      const [sx, sy] = par(3);
      ctx.lineWidth = 1;
      const lines = hasClusters ? 0 : 11;
      for (let i = 0; i < lines; i++) {
        const f = i / (lines - 1);
        const baseY = h * (0.62 + f * f * 0.34);
        const amp = h * (0.012 + f * 0.022);
        ctx.strokeStyle = `rgba(128,185,255,${0.035 + f * 0.06})`;
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 12) {
          const nx = x / w;
          const y = baseY + Math.sin(nx * 5.2 + t * 0.25 + i * 0.6) * amp + Math.sin(nx * 11 - t * 0.17 + i) * amp * 0.35;
          if (x === -10) ctx.moveTo(x + sx, y + sy); else ctx.lineTo(x + sx, y + sy);
        }
        ctx.stroke();
      }

      // arcs
      const [ax, ay] = par(6);
      const act = activeRef.current;
      const inActive = (arc: Arc) => act !== null && (arc.a.group === act || arc.b.group === act);
      const nearArc = (arc: Arc) => {
        if (pointer.x < 0) return 0;
        const mx = bez(0.5, arc.a.x, arc.c1[0], arc.c2[0], arc.b.x) * w;
        const my = bez(0.5, arc.a.y, arc.c1[1], arc.c2[1], arc.b.y) * h;
        return Math.max(0, 1 - Math.hypot(mx - pointer.x, my - pointer.y) / 180);
      };
      for (const arc of arcs) {
        const lift = Math.max(inActive(arc) ? 1 : 0, nearArc(arc));
        ctx.strokeStyle = `rgba(128,185,255,${0.14 + lift * 0.26})`;
        ctx.lineWidth = 1 + lift * 0.4;
        ctx.beginPath();
        ctx.moveTo(arc.a.x * w + ax, arc.a.y * h + ay);
        ctx.bezierCurveTo(arc.c1[0] * w + ax, arc.c1[1] * h + ay, arc.c2[0] * w + ax, arc.c2[1] * h + ay, arc.b.x * w + ax, arc.b.y * h + ay);
        ctx.stroke();
      }

      // pulses travelling along arcs
      for (const arc of arcs) {
        const p = (t * arc.speed + arc.offset) % 1;
        for (let j = 0; j < 6; j++) {
          const q = p - j * 0.012;
          if (q < 0) continue;
          const x = bez(q, arc.a.x, arc.c1[0], arc.c2[0], arc.b.x) * w + ax;
          const y = bez(q, arc.a.y, arc.c1[1], arc.c2[1], arc.b.y) * h + ay;
          const fade = Math.sin(Math.PI * p) * (act === null || inActive(arc) ? 1 : 0.45);
          ctx.fillStyle = `rgba(178,212,255,${(0.75 - j * 0.12) * fade})`;
          ctx.beginPath();
          ctx.arc(x, y, j === 0 ? 1.8 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes, brighter near the pointer
      const [nx, ny] = par(8);
      for (const n of nodes) {
        const x = n.x * w + nx;
        const y = n.y * h + ny;
        const d = pointer.x < 0 ? Infinity : Math.hypot(x - pointer.x, y - pointer.y);
        const near = Math.max(n.group === act ? 0.8 : 0, Math.max(0, 1 - d / 160));
        const isCore = hasClusters ? n.group === -1 : n.group === 1 && n.r > 4;
        const pulse = isCore ? 0.5 + 0.5 * Math.sin(t * 1.4) : 0;
        const glowR = n.r * (5 + near * 5 + pulse * 2);
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        g.addColorStop(0, `rgba(50,126,255,${0.35 + near * 0.35 + pulse * 0.15})`);
        g.addColorStop(1, 'rgba(50,126,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = near > 0.2 ? '#F5F8FF' : '#B8D6FF';
        ctx.beginPath();
        ctx.arc(x, y, n.r + near * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduced || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    time = 4; // start mid-flow so the first frame isn't empty
    draw(time);
    redrawRef.current = () => { if (!raf) draw(time); };
    setReady(true);
    start();

    const ro = new ResizeObserver(() => { resize(); draw(time); });
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (!coarse) {
        pointer.tx = ((pointer.x / r.width) - 0.5) * -1.6;
        pointer.ty = ((pointer.y / r.height) - 0.5) * -1.6;
      }
      if (reduced) draw(time);
    };
    const onLeave = () => { pointer.x = -1; pointer.tx = 0; pointer.ty = 0; if (reduced) draw(time); };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      redrawRef.current = () => {};
    };
  }, [reduced, hasClusters]);

  return (
    <figure className={`signal-field ${hasClusters ? 'is-clusters' : ''}`} aria-labelledby="sf-caption">
      <div ref={wrapRef} className="signal-field-canvas">
        <canvas ref={canvasRef} className={ready ? 'is-ready' : ''} aria-hidden="true" />
        {hasClusters && (
          <ul className="sf-clusters">
            {clusters!.slice(0, 4).map((c, i) => (
              <li
                key={c.label}
                className={`sf-cluster ${active === i ? 'is-on' : ''} ${CLUSTER_POS[i][0] < 0.5 ? 'is-left' : 'is-right'} ${CLUSTER_POS[i][1] < 0.5 ? 'is-top' : 'is-bottom'}`}
                style={{ left: `${CLUSTER_POS[i][0] * 100}%`, top: `${CLUSTER_POS[i][1] * 100}%` }}
              >
                <button
                  type="button"
                  className="sf-cluster-btn"
                  aria-expanded={active === i}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                >
                  {c.label}
                </button>
                <span className="sf-cluster-detail">{c.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <figcaption id="sf-caption" className="sr-only">
        {hasClusters
          ? `Decorative animation: four clusters (${clusters!.map((c) => c.label).join(', ')}) each connected to a shared central core by flowing signals.`
          : 'Decorative animation: signals flow from a scattered group of input nodes on the left, through a central processing core, to a small grid of output nodes on the right.'}
      </figcaption>
      <div className="signal-field-label">
        <span className="mono">SIGNAL FIELD / INTERACTIVE</span>
        <button
          type="button"
          className="sf-info"
          aria-expanded={noteOpen}
          aria-controls="sf-note"
          onClick={() => setNoteOpen((o) => !o)}
        >
          <Info /><span className="sr-only">About this visualization</span>
        </button>
      </div>
      <div id="sf-note" className="sf-note glass" hidden={!noteOpen}>
        <p><b>Perceive → process → respond.</b> Inputs on the left converge on a core, which drives a small output grid — the shape of most systems I build. It’s an illustration, not live data.</p>
        <Link to="/lab" className="text-link">See working experiments in the Lab</Link>
      </div>
    </figure>
  );
}
