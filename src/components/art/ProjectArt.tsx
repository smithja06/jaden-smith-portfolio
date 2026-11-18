import type { ArtKey } from '../../content/types';

/** Original, project-specific cover illustrations. All SVG, no external images. */

const S = { line: 'rgba(128,185,255,0.28)', soft: '#80B9FF', strong: '#327EFF', white: '#F5F8FF' };

function Frame({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="art-svg" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-glow`} cx="65%" cy="35%" r="70%">
          <stop offset="0" stopColor="#155EEF" stopOpacity="0.42" />
          <stop offset="1" stopColor="#060D20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1F45" />
          <stop offset="1" stopColor="#060D20" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#${id}-bg)`} />
      <rect width="600" height="400" fill={`url(#${id}-glow)`} />
      {children}
    </svg>
  );
}

function MedT() {
  const levels = [0, 1, 1, 0, 1, 2, 3, 1, 1, 3, 2, 1, 0, 1, 1, 0];
  return (
    <Frame id="medt">
      {/* lens */}
      <circle cx="150" cy="200" r="74" fill="none" stroke={S.line} />
      <circle cx="150" cy="200" r="46" fill="none" stroke={S.line} />
      <circle cx="150" cy="200" r="16" fill={S.strong} opacity="0.85" />
      <circle cx="150" cy="200" r="6" fill={S.white} />
      {/* rays converging */}
      {[-60, -30, 0, 30, 60].map((dy) => (
        <path key={dy} d={`M226 ${200 + dy * 0.6} C 290 ${200 + dy * 0.6}, 300 ${200 + dy}, 350 ${200 + dy * 1.1}`} stroke={S.line} fill="none" />
      ))}
      {/* 4×4 output */}
      {levels.map((l, i) => {
        const x = 370 + (i % 4) * 40;
        const y = 120 + Math.floor(i / 4) * 40;
        return (
          <g key={i}>
            <rect x={x} y={y} width="30" height="30" rx="7" fill="#08142B" stroke="rgba(209,227,255,0.14)" />
            {l > 0 && <rect x={x} y={y} width="30" height="30" rx="7" fill={S.strong} opacity={l / 3} />}
            {l === 3 && <rect x={x + 10} y={y + 10} width="10" height="10" rx="3" fill={S.white} opacity="0.9" />}
          </g>
        );
      })}
    </Frame>
  );
}

function Tooling() {
  const rows = [140, 90, 180, 120, 60, 160, 100];
  return (
    <Frame id="tool">
      <rect x="70" y="80" width="280" height="240" rx="16" fill="#08142B" stroke="rgba(209,227,255,0.14)" />
      {[0, 1, 2].map((i) => <circle key={i} cx={94 + i * 16} cy="102" r="4" fill={S.line} />)}
      {rows.map((wd, i) => (
        <rect key={i} x={i % 3 === 1 ? 118 : 96} y={134 + i * 24} width={wd} height="8" rx="4" fill={i === 3 ? S.strong : 'rgba(128,185,255,0.22)'} />
      ))}
      {/* assist flow */}
      <path d="M350 200 C 400 200, 400 140, 450 140" stroke={S.line} fill="none" />
      <path d="M350 200 C 400 200, 400 260, 450 260" stroke={S.line} fill="none" />
      <circle cx="470" cy="140" r="20" fill="none" stroke={S.soft} strokeOpacity="0.5" />
      <circle cx="470" cy="140" r="6" fill={S.strong} />
      <rect x="450" y="242" width="40" height="36" rx="9" fill="none" stroke={S.soft} strokeOpacity="0.5" />
      <path d="M461 260 l6 6 l12 -13" stroke={S.white} strokeWidth="2" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

function Bmett() {
  const pts: string[] = [];
  for (let x = 0; x <= 600; x += 4) {
    const burst = Math.exp(-((x - 330) ** 2) / 3000) * 46 + Math.exp(-((x - 470) ** 2) / 1500) * 26;
    const y = 300 + Math.sin(x * 0.9) * (3 + burst) * Math.cos(x * 0.37);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return (
    <Frame id="bmett">
      {/* leg segments */}
      <line x1="210" y1="60" x2="280" y2="190" stroke={S.soft} strokeOpacity="0.55" strokeWidth="10" strokeLinecap="round" />
      <line x1="280" y1="190" x2="230" y2="320" stroke={S.soft} strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" />
      <circle cx="280" cy="190" r="16" fill="#08142B" stroke={S.soft} strokeOpacity="0.7" />
      <circle cx="280" cy="190" r="5" fill={S.white} />
      {/* angle arc */}
      <path d="M265 162 A 32 32 0 0 1 300 214" fill="none" stroke={S.strong} strokeWidth="2" />
      {/* sensors */}
      <rect x="236" y="104" width="22" height="14" rx="4" fill={S.strong} />
      <rect x="248" y="244" width="22" height="14" rx="4" fill={S.strong} opacity="0.7" />
      <polyline points={pts.join(' ')} fill="none" stroke={S.soft} strokeOpacity="0.7" strokeWidth="1.4" />
      <line x1="0" y1="300" x2="600" y2="300" stroke={S.line} strokeDasharray="2 6" />
    </Frame>
  );
}

function Brthday() {
  const items = [0, 1, 2, 3, 4, 5];
  return (
    <Frame id="brth">
      <line x1="60" y1="110" x2="540" y2="110" stroke={S.soft} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      {items.map((i) => {
        const x = 110 + i * 76;
        const active = i === 2;
        const lift = active ? -8 : 0;
        return (
          <g key={i} transform={`translate(0 ${lift})`} opacity={active ? 1 : 0.55 + (i % 2) * 0.1}>
            <path d={`M${x} 110 q 0 -14 10 -14 q 10 0 10 10`} fill="none" stroke={S.soft} strokeOpacity="0.6" strokeWidth="2" transform={`translate(-10 0)`} />
            <path d={`M${x - 28} 128 L${x} 116 L${x + 28} 128 L${x + 34} ${active ? 300 : 280} L${x - 34} ${active ? 300 : 280} Z`}
              fill={active ? S.strong : '#0B1F45'} fillOpacity={active ? 0.7 : 1} stroke="rgba(209,227,255,0.2)" />
          </g>
        );
      })}
      <line x1="60" y1="340" x2="540" y2="340" stroke={S.line} />
    </Frame>
  );
}

function SpineAlign() {
  const vert = Array.from({ length: 9 }, (_, i) => i);
  return (
    <Frame id="spine">
      <line x1="300" y1="40" x2="300" y2="360" stroke={S.line} strokeDasharray="3 7" />
      {vert.map((i) => {
        const y = 60 + i * 34;
        const x = 300 + Math.sin(i * 0.5) * 22;
        const tilt = Math.cos(i * 0.5) * 8;
        return (
          <g key={i} transform={`rotate(${tilt} ${x} ${y})`}>
            <rect x={x - 34} y={y} width="68" height="24" rx="8" fill="#0B1F45" stroke="rgba(209,227,255,0.2)" />
          </g>
        );
      })}
      {[1, 4, 7].map((i) => {
        const y = 72 + i * 34;
        const x = 300 + Math.sin(i * 0.5) * 22;
        return (
          <g key={i}>
            <circle cx={x + 60} cy={y} r="5" fill={S.strong} />
            <line x1={x + 34} y1={y} x2={x + 55} y2={y} stroke={S.line} />
          </g>
        );
      })}
      <path d="M430 150 q 20 50 0 100" fill="none" stroke={S.soft} strokeOpacity="0.5" />
      <path d="M450 135 q 30 65 0 130" fill="none" stroke={S.soft} strokeOpacity="0.3" />
    </Frame>
  );
}

const map: Record<ArtKey, () => JSX.Element> = {
  medt: MedT,
  tooling: Tooling,
  bmett: Bmett,
  brthday: Brthday,
  spinealign: SpineAlign,
};

export function ProjectArt({ art }: { art: ArtKey }) {
  const C = map[art];
  return <C />;
}
