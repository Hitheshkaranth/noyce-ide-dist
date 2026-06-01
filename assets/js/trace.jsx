/* 3D Traceability graph — REQ→Design→Code→Test→Evidence, particles + hover path */

const TNODES = {
  'REQ-014': { fx: 0.06, fy: 0.20, t: 'REQ', label: 'REQ-014', c: 'var(--ice)' },
  'REQ-031': { fx: 0.06, fy: 0.50, t: 'REQ', label: 'REQ-031', c: 'var(--ice)' },
  'REQ-052': { fx: 0.06, fy: 0.80, t: 'REQ', label: 'REQ-052', c: 'var(--amber)', orphan: true },
  'DSN-07':  { fx: 0.30, fy: 0.26, t: 'DSN', label: 'DSN-07', c: 'var(--violet)' },
  'DSN-12':  { fx: 0.30, fy: 0.62, t: 'DSN', label: 'DSN-12', c: 'var(--violet)' },
  'brake.c': { fx: 0.52, fy: 0.23, t: 'SRC', label: 'brake.c', c: 'var(--ice)' },
  'timer.c': { fx: 0.52, fy: 0.60, t: 'SRC', label: 'timer.c', c: 'var(--ice)' },
  'TST-204': { fx: 0.74, fy: 0.24, t: 'TST', label: 'TST-204', c: 'var(--ice)' },
  'TST-219': { fx: 0.74, fy: 0.62, t: 'TST', label: 'TST-219', c: 'var(--ice)' },
  'EVD-A8':  { fx: 0.94, fy: 0.30, t: 'EVD', label: 'A-8', c: 'var(--green)' },
  'EVD-A7':  { fx: 0.94, fy: 0.62, t: 'EVD', label: 'A-7', c: 'var(--green)' },
};
const TLINKS = [
  ['REQ-014', 'DSN-07'], ['DSN-07', 'brake.c'], ['brake.c', 'TST-204'], ['TST-204', 'EVD-A8'],
  ['REQ-031', 'DSN-12'], ['DSN-12', 'timer.c'], ['timer.c', 'TST-219'], ['TST-219', 'EVD-A7'],
];
const TPATHS = {
  'REQ-014': { nodes: ['REQ-014', 'DSN-07', 'brake.c', 'TST-204', 'EVD-A8'], links: [0, 1, 2, 3] },
  'REQ-031': { nodes: ['REQ-031', 'DSN-12', 'timer.c', 'TST-219', 'EVD-A7'], links: [4, 5, 6, 7] },
  'REQ-052': { nodes: ['REQ-052'], links: [] },
};

function curve(a, b, w, h) {
  const x1 = a.fx * w, y1 = a.fy * h, x2 = b.fx * w, y2 = b.fy * h;
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function TraceGraph() {
  const stageRef = useRef(null);
  const [dim, setDim] = useState({ w: 900, h: 480 });
  const [hot, setHot] = useState(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setDim({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setDim({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  const path = hot ? TPATHS[hot] : null;
  const nodeHot = (id) => path && path.nodes.includes(id);
  const linkHot = (i) => path && path.links.includes(i);

  return (
    <section className="section-pad" id="compliance">
      <div className="wrap">
        <div className="section-head reveal" style={{ margin: '0 auto 56px', textAlign: 'center' }}>
          <span className="kicker">Traceability</span>
          <h2>REQ → Design → Test,<br />kept honest.</h2>
          <p style={{ margin: '20px auto 0' }}>Built from the actual workspace, not a side spreadsheet. The Rust sidecar re-indexes on save, the orchestrator audits the thread, and broken links fail the build. Hover a requirement to light its evidence path.</p>
        </div>

        <div className="trace-stage glass reveal d1" ref={stageRef} style={{ padding: 0 }}>
          <svg className="trace-svg" width={dim.w} height={dim.h}>
            {TLINKS.map(([s, e], i) => {
              const d = curve(TNODES[s], TNODES[e], dim.w, dim.h);
              return (
                <g key={i}>
                  <path className={'trace-link' + (linkHot(i) ? ' hot' : '')} d={d} />
                  {!reduce && (
                    <circle className="trace-particle" r={linkHot(i) ? 3.4 : 2.2}>
                      <animateMotion dur={(2.2 + (i % 3) * 0.5) + 's'} repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {Object.entries(TNODES).map(([id, n]) => (
            <div key={id}
              className={'trace-node' + (n.orphan ? ' orphan' : '') + (hot ? (nodeHot(id) ? ' hot' : ' dim') : '')}
              style={{ left: (n.fx * dim.w) + 'px', top: (n.fy * dim.h) + 'px' }}
              onMouseEnter={() => n.t === 'REQ' && setHot(id)}
              onMouseLeave={() => setHot(null)}>
              <div className="tn-box" style={{ color: n.c }}>
                <b>{n.t}</b>
                <span style={{ fontSize: 9, color: 'var(--ink-1)' }}>{n.label}</span>
              </div>
            </div>
          ))}

          {/* orphan warning callout */}
          <div style={{ position: 'absolute', left: '8%', bottom: 18, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ico.fault style={{ width: 13, height: 13 }} /> REQ-052 · orphan — no downstream artifact · build blocked
          </div>
        </div>

        <div className="trace-legend reveal d2">
          <span className="chip ice"><span className="dot" />linked</span>
          <span className="chip ok"><span className="dot" />tested</span>
          <span className="chip violet"><span className="dot" />signed</span>
          <span className="chip warn"><span className="dot" />review-pending</span>
          <span className="chip warn"><span className="dot" style={{ background: 'var(--red)', boxShadow: '0 0 8px var(--red)' }} />orphan</span>
        </div>

        <div className="trace-meta">
          {[
            { n: <CountUp to={1284} suffix=" links" />, l: 'live REQ, Design, and Test links' },
            { n: <CountUp to={412} suffix=" ms" />, l: 'Sidecar full-workspace re-index' },
            { n: <CountUp to={0} suffix="" />, l: 'orphan requirements before merge' },
            { n: 'SHA', l: 'cryptographic audit log per change' },
          ].map((m, i) => (
            <div className="tm glass reveal" key={i} style={{ transitionDelay: (0.1 * i) + 's' }}>
              <div className="n">{m.n}</div><div className="l">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TraceGraph });
