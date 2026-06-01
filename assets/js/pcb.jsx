/* PCB circuit-trace background + oscilloscope waveform + circuit-bus divider */

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

/* Build orthogonal Z-routed traces across the board */
function buildTraces(W, H, rng) {
  const traces = [], vias = [], pads = [];
  const rows = 16;
  for (let i = 0; i < rows; i++) {
    const y0 = (i + 0.5) * H / rows + (rng() - 0.5) * 18;
    const xb1 = W * (0.18 + rng() * 0.18);
    const y1 = y0 + (rng() - 0.5) * H * 0.18;
    const xb2 = W * (0.6 + rng() * 0.2);
    const y2 = y1 + (rng() - 0.5) * H * 0.12;
    const d = `M 0 ${y0.toFixed(1)} H ${xb1.toFixed(1)} V ${y1.toFixed(1)} H ${xb2.toFixed(1)} V ${y2.toFixed(1)} H ${W}`;
    const kind = i % 7 === 0 ? 'copper' : i % 5 === 0 ? 'violet' : 'ice';
    traces.push({ d, kind, i });
    vias.push({ x: xb1, y: y1 }, { x: xb2, y: y2 });
  }
  // some SMD pads
  for (let i = 0; i < 10; i++) {
    pads.push({ x: rng() * W, y: rng() * H, w: 14 + rng() * 22, h: 8 + rng() * 8 });
  }
  return { traces, vias, pads };
}

function PCBTraces() {
  const W = 1440, H = 900;
  const { traces, vias, pads } = React.useMemo(() => buildTraces(W, H, seededRand(20260601)), []);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <svg className="pcb" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {pads.map((p, i) => (
        <rect key={'pad' + i} className="pad" x={p.x} y={p.y} width={p.w} height={p.h} rx="2" />
      ))}
      {traces.map((t) => (<path key={'t' + t.i} className={'wire ' + t.kind} d={t.d} strokeWidth={t.kind === 'copper' ? 1.6 : 1.2} />))}
      {vias.map((v, i) => (
        <g key={'v' + i}>
          <circle className="via-glow" cx={v.x} cy={v.y} r="6" style={{ animationDelay: (i * 0.21) + 's' }} />
          <circle className="via" cx={v.x} cy={v.y} r="3.2" />
        </g>
      ))}
      {!reduce && traces.filter((t) => t.i % 3 === 0).map((t) => (
        <circle key={'p' + t.i} className={'pulse' + (t.kind === 'copper' ? ' cu' : '')} r={t.kind === 'copper' ? 2.6 : 2.2}>
          <animateMotion dur={(5 + (t.i % 4) * 1.4) + 's'} repeatCount="indefinite" path={t.d} begin={(t.i * 0.4) + 's'} />
        </circle>
      ))}
    </svg>
  );
}

/* Oscilloscope waveform — repeating signal sweeping left */
function Scope() {
  // build a wide waveform path (two periods of a mixed signal), tiled so it loops seamlessly
  const seg = (x0) => {
    let d = `M ${x0} 60`;
    const step = 30;
    const pts = [0, -34, -10, -10, 40, 6, 6, 6, -26, 2, 2, 30, 30, -8, 0];
    pts.forEach((p, i) => { d += ` L ${x0 + (i + 1) * step} ${60 + p}`; });
    return d;
  };
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <svg className="scope" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true">
      {[24, 60, 96].map((y) => (<line key={y} className="grid-h" x1="0" y1={y} x2="900" y2={y} />))}
      <g className={reduce ? '' : 'sweep'}>
        <path className="trace" d={seg(0) + ' ' + seg(450).replace('M', 'L')} />
      </g>
    </svg>
  );
}

/* Circuit-bus divider between sections */
function Bus({ label = 'BUS · 32b', flip = false }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y = 32;
  const railD = `M 0 ${y} H 360 L 392 ${y - 16} H 1048 L 1080 ${y} H 1440`;
  return (
    <div className="bus" aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="xMidYMid meet">
        <path className="rail" d={railD} />
        <path className="rail cu" d={`M 0 ${y + 8} H 1440`} strokeDasharray="2 10" />
        {[180, 392, 720, 1048, 1280].map((x, i) => (
          <circle key={x} className={'node' + (i % 2 ? ' cu' : '')} cx={x} cy={i === 1 || i === 3 ? y - 16 : (i === 2 ? y - 16 : y)} r="3.4" />
        ))}
        <text className="lbl" x="720" y={y - 24} textAnchor="middle">{label}</text>
        {!reduce && (
          <circle className="flow" r="2.6">
            <animateMotion dur="6s" repeatCount="indefinite" path={railD} keyPoints={flip ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear" />
          </circle>
        )}
      </svg>
    </div>
  );
}

Object.assign(window, { PCBTraces, Scope, Bus });
