/* Project Graph + Traceability Monitor data and showcase section */

/* ---------- PROJECT GRAPH (files + functions + calls) ---------- */
const PROJECT_NODES = [
  { id: 'main.c', label: 'main.c', sub: 'src/app', type: 'file', ico: 'doc',
    meta: [['path', 'src/app/main.c'], ['lines', '142'], ['functions', '1'], ['MISRA', '0 open'], ['MC/DC', '—'], ['indexed', '412 ms ago']],
    chips: [['ice', 'entry'], ['ok', 'clean']] },
  { id: 'sched.c', label: 'sched.c', sub: 'src/rtos', type: 'file', ico: 'doc',
    meta: [['path', 'src/rtos/sched.c'], ['lines', '211'], ['functions', '1'], ['MISRA', '1 advisory'], ['MC/DC', '84.5 %'], ['indexed', '412 ms ago']],
    chips: [['violet', 'rtos'], ['warn', '1 advisory']] },
  { id: 'brake.c', label: 'brake.c', sub: 'src/ctrl', type: 'file', ico: 'doc',
    meta: [['path', 'src/ctrl/brake.c'], ['lines', '318'], ['functions', '4'], ['MISRA', '2 required'], ['MC/DC', '91.2 %'], ['ASIL', 'D']],
    chips: [['ice', 'ASIL D'], ['warn', '2 MISRA']] },
  { id: 'gpio.c', label: 'gpio.c', sub: 'src/hal', type: 'file', ico: 'doc',
    meta: [['path', 'src/hal/gpio.c'], ['lines', '74'], ['functions', '1'], ['MISRA', '0 open'], ['MC/DC', '100 %'], ['indexed', '412 ms ago']],
    chips: [['ok', '100% MC/DC']] },
  { id: 'timer.c', label: 'timer.c', sub: 'src/hal', type: 'file', ico: 'doc',
    meta: [['path', 'src/hal/timer.c'], ['lines', '96'], ['functions', '1'], ['MISRA', '0 open'], ['MC/DC', '88.0 %'], ['isr', 'TIM4_IRQn']],
    chips: [['ice', 'ISR'], ['ok', 'clean']] },

  { id: 'main', label: 'main()', sub: 'main.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'int main(void)'], ['file', 'main.c'], ['lines', '58'], ['fan-out', '2'], ['fan-in', '0'], ['MC/DC', '—']],
    chips: [['ice', 'entry point']] },
  { id: 'sched_init', label: 'sched_init()', sub: 'sched.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void sched_init(void)'], ['file', 'sched.c'], ['lines', '44'], ['fan-out', '0'], ['fan-in', '1'], ['MC/DC', '84.5 %']],
    chips: [['warn', 'R.15.5 advisory']] },
  { id: 'brake_init', label: 'brake_init()', sub: 'brake.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void brake_init(cfg_t*)'], ['file', 'brake.c'], ['lines', '37'], ['fan-out', '0'], ['fan-in', '1'], ['MC/DC', '93.0 %']],
    chips: [['ok', 'verified']] },
  { id: 'brake_step', label: 'brake_step()', sub: 'brake.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void brake_step(u32 dt)'], ['file', 'brake.c'], ['lines', '92'], ['fan-out', '2'], ['fan-in', '1'], ['req', 'REQ-014'], ['MC/DC', '90.1 %']],
    chips: [['ice', 'REQ-014'], ['warn', 'R.11.5']] },
  { id: 'actuator_drive', label: 'actuator_drive()', sub: 'brake.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void actuator_drive(pwm_t)'], ['file', 'brake.c'], ['lines', '61'], ['fan-out', '1'], ['fan-in', '1'], ['MC/DC', '89.7 %']],
    chips: [['ok', 'verified']] },
  { id: 'fault_latch', label: 'fault_latch()', sub: 'brake.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void fault_latch(asil_t)'], ['file', 'brake.c'], ['lines', '28'], ['fan-out', '0'], ['fan-in', '1'], ['safety', 'ASIL D']],
    chips: [['ice', 'safety']] },
  { id: 'gpio_set', label: 'gpio_set()', sub: 'gpio.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void gpio_set(port_t,u8)'], ['file', 'gpio.c'], ['lines', '19'], ['fan-out', '0'], ['fan-in', '1'], ['MC/DC', '100 %']],
    chips: [['ok', '100% MC/DC']] },
  { id: 'timer_isr', label: 'timer_isr()', sub: 'timer.c', type: 'fn', ico: 'engineer',
    meta: [['signature', 'void TIM4_IRQHandler(void)'], ['file', 'timer.c'], ['lines', '40'], ['fan-out', '1'], ['fan-in', '0'], ['isr', 'yes']],
    chips: [['ice', 'ISR'], ['ok', 'isr-safe']] },
];
const PROJECT_LINKS = [
  { s: 'main.c', e: 'main', kind: 'contains' },
  { s: 'sched.c', e: 'sched_init', kind: 'contains' },
  { s: 'brake.c', e: 'brake_init', kind: 'contains' },
  { s: 'brake.c', e: 'brake_step', kind: 'contains' },
  { s: 'brake.c', e: 'actuator_drive', kind: 'contains' },
  { s: 'brake.c', e: 'fault_latch', kind: 'contains' },
  { s: 'gpio.c', e: 'gpio_set', kind: 'contains' },
  { s: 'timer.c', e: 'timer_isr', kind: 'contains' },
  { s: 'main', e: 'sched_init', kind: 'calls' },
  { s: 'main', e: 'brake_init', kind: 'calls' },
  { s: 'brake_step', e: 'fault_latch', kind: 'calls' },
  { s: 'brake_step', e: 'actuator_drive', kind: 'calls' },
  { s: 'actuator_drive', e: 'gpio_set', kind: 'calls' },
  { s: 'timer_isr', e: 'brake_step', kind: 'calls' },
];

/* ---------- TRACEABILITY MONITOR ---------- */
const TRACE_NODES = [
  { id: 'REQ-014', label: 'REQ-014', sub: 'HLR', type: 'req', ico: 'doc', status: 'linked',
    meta: [['kind', 'High-level req'], ['text', 'brake ≤ 50 ms'], ['downstream', '4 artifacts'], ['status', 'linked'], ['ASIL', 'D']], chips: [['ice', 'linked'], ['ok', 'tested']] },
  { id: 'REQ-031', label: 'REQ-031', sub: 'HLR', type: 'req', ico: 'doc', status: 'linked',
    meta: [['kind', 'High-level req'], ['text', 'timer accuracy'], ['downstream', '4 artifacts'], ['status', 'linked']], chips: [['ice', 'linked'], ['ok', 'tested']] },
  { id: 'REQ-052', label: 'REQ-052', sub: 'HLR', type: 'req', ico: 'fault', status: 'orphan', orphan: true,
    meta: [['kind', 'High-level req'], ['text', 'watchdog reset'], ['downstream', '0 artifacts'], ['status', 'ORPHAN'], ['gate', 'build blocked']], chips: [['warn', 'orphan'], ['warn', 'no test']] },
  { id: 'DSN-07', label: 'DSN-07', sub: 'LLR', type: 'dsn', ico: 'designer', status: 'linked',
    meta: [['kind', 'Low-level design'], ['parent', 'REQ-014'], ['impl', 'brake.c'], ['status', 'linked']], chips: [['violet', 'design'], ['ok', 'linked']] },
  { id: 'DSN-12', label: 'DSN-12', sub: 'LLR', type: 'dsn', ico: 'designer', status: 'review',
    meta: [['kind', 'Low-level design'], ['parent', 'REQ-031'], ['impl', 'timer.c'], ['status', 'review-pending']], chips: [['violet', 'design'], ['warn', 'review']] },
  { id: 'brake.c', label: 'brake.c', sub: 'SRC', type: 'src', ico: 'engineer', status: 'linked',
    meta: [['kind', 'Source'], ['design', 'DSN-07'], ['MC/DC', '91.2 %'], ['MISRA', '2 required']], chips: [['ice', 'impl'], ['warn', '2 MISRA']] },
  { id: 'timer.c', label: 'timer.c', sub: 'SRC', type: 'src', ico: 'engineer', status: 'linked',
    meta: [['kind', 'Source'], ['design', 'DSN-12'], ['MC/DC', '88.0 %'], ['MISRA', '0 open']], chips: [['ice', 'impl'], ['ok', 'clean']] },
  { id: 'TST-204', label: 'TST-204', sub: 'TST', type: 'tst', ico: 'test', status: 'tested',
    meta: [['kind', 'Verification'], ['covers', 'brake.c'], ['type', 'MC/DC · 128 iter'], ['result', 'pass']], chips: [['ok', '184 pass']] },
  { id: 'TST-219', label: 'TST-219', sub: 'TST', type: 'tst', ico: 'test', status: 'tested',
    meta: [['kind', 'Verification'], ['covers', 'timer.c'], ['type', 'HIL'], ['result', 'pass']], chips: [['ok', 'pass']] },
  { id: 'EVD-A8', label: 'A-8', sub: 'EVD', type: 'evd', ico: 'review', status: 'signed',
    meta: [['kind', 'DO-178C A-8'], ['artifact', 'Object code'], ['sign', 'ed25519'], ['status', 'signed']], chips: [['ok', 'signed']] },
  { id: 'EVD-A7', label: 'A-7', sub: 'EVD', type: 'evd', ico: 'review', status: 'signed',
    meta: [['kind', 'DO-178C A-7'], ['artifact', 'Source review'], ['sign', 'ed25519'], ['status', 'signed']], chips: [['ok', 'signed']] },
];
const TRACE_LINKS = [
  { s: 'REQ-014', e: 'DSN-07', kind: 'trace' }, { s: 'DSN-07', e: 'brake.c', kind: 'trace' },
  { s: 'brake.c', e: 'TST-204', kind: 'trace' }, { s: 'TST-204', e: 'EVD-A8', kind: 'trace' },
  { s: 'REQ-031', e: 'DSN-12', kind: 'trace' }, { s: 'DSN-12', e: 'timer.c', kind: 'trace' },
  { s: 'timer.c', e: 'TST-219', kind: 'trace' }, { s: 'TST-219', e: 'EVD-A7', kind: 'trace' },
];
const AUDIT_FEED = [
  ['12:04:18', 'REQ-014 → TST-204 link verified', 'ok'],
  ['12:04:18', 'MC/DC brake.c 91.2% recorded', 'ok'],
  ['12:04:19', 'REQ-052 orphan detected', 'wn'],
  ['12:04:19', 'build gate: orphan blocks merge', 'wn'],
  ['12:04:20', 'ed25519 sign EVD-A8 · ok', 'ok'],
  ['12:04:20', 'audit-log appended · SHA-256', 'ok'],
];

function GraphShowcase() {
  const [tab, setTab] = useState('project');
  const [selProject, setSelProject] = useState(null);
  const [selTrace, setSelTrace] = useState(null);
  const [filter, setFilter] = useState('all');
  const tabRefs = useRef({});
  const [ul, setUl] = useState({ left: 12, width: 120 });

  useEffect(() => {
    const el = tabRefs.current[tab];
    if (el) setUl({ left: el.offsetLeft, width: el.offsetWidth });
  }, [tab]);

  const isProject = tab === 'project';
  const sel = isProject ? selProject : selTrace;

  // trace filter -> muted set
  const muted = React.useMemo(() => {
    if (isProject || filter === 'all') return null;
    const s = new Set();
    TRACE_NODES.forEach((n) => {
      const keep = filter === 'orphan' ? n.status === 'orphan' : n.status === 'review';
      if (!keep) s.add(n.id);
    });
    return s;
  }, [isProject, filter]);

  const tabs = [['project', 'Project Graph', 'reg'], ['trace', 'Traceability Monitor', 'trace']];

  return (
    <section className="section-pad gx-wrap" id="graph">
      <div className="wrap">
        <div className="section-head reveal" style={{ margin: '0 auto 48px', textAlign: 'center' }}>
          <span className="kicker">Showcase</span>
          <h2>The whole project,<br />as one live graph.</h2>
          <p style={{ margin: '20px auto 0' }}>The Rust sidecar indexes every file, function, and requirement on save and exposes them as one navigable graph. Switch between the call graph and the certification thread — drag nodes, hover to trace, click to inspect.</p>
        </div>

        <div className="ide-win glass reveal d1">
          <div className="ide-bar">
            <span className="lights"><i /><i /><i /></span>
            <span className="fname"><b>{isProject ? 'project-graph' : 'traceability-monitor'}</b>.noyce</span>
            <span className="ide-live">sidecar · live</span>
          </div>

          <div className="gx-tabs">
            {tabs.map(([id, label, ico]) => {
              const TIco = Ico[ico];
              return (
                <button key={id} ref={(el) => (tabRefs.current[id] = el)}
                  className={'gx-tab' + (tab === id ? ' active' : '')} onClick={() => setTab(id)}>
                  <TIco /> {label}
                </button>
              );
            })}
            <span className="gx-underline" style={{ left: ul.left, width: ul.width }} />
          </div>

          <div className="gx-body">
            <ForceGraph
              graphId={tab}
              nodes={isProject ? PROJECT_NODES : TRACE_NODES}
              links={isProject ? PROJECT_LINKS : TRACE_LINKS}
              springLen={isProject ? { contains: 66, calls: 132 } : { trace: 128 }}
              muted={muted}
              onSelect={isProject ? setSelProject : setSelTrace}>
              <div className="gx-hint">drag · hover to trace · click to inspect</div>
              {!isProject && (
                <div className="gx-filters">
                  {[['all', 'All'], ['orphan', 'Orphans'], ['review', 'Review']].map(([id, l]) => (
                    <button key={id} className={'gx-filter' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{l}</button>
                  ))}
                </div>
              )}
              <div className="gx-legend">
                {(isProject
                  ? [['file', 'file', 'var(--violet)'], ['fn', 'function', 'var(--ice)'], ['calls', 'calls', 'var(--violet)']]
                  : [['req', 'REQ', 'var(--ice)'], ['dsn', 'design', 'var(--violet)'], ['src', 'source', 'var(--copper)'], ['tst', 'test', 'var(--ice)'], ['evd', 'evidence', 'var(--green)'], ['orphan', 'orphan', 'var(--red)']]
                ).map(([k, l, c]) => (
                  <span className="chip" key={k}><span className="dot" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />{l}</span>
                ))}
              </div>
            </ForceGraph>

            <aside className="gx-inspector">
              {!sel ? (
                <div className="gx-empty">
                  <div className="gx-insp-section-t" style={{ marginBottom: 8 }}>Inspector</div>
                  Select a node to inspect {isProject ? 'its source, coverage, and call relationships' : 'its requirement thread and verification status'}.
                </div>
              ) : (
                <React.Fragment>
                  <div className="gx-insp-head">
                    <span className={'gi-ico gn-ico ' + sel.type}>{React.createElement(Ico[sel.ico] || Ico.doc)}</span>
                    <div><div className="gi-name">{sel.label}</div><div className="gi-type">{sel.type === 'fn' ? 'function' : sel.type === 'file' ? 'source file' : sel.type}</div></div>
                  </div>
                  <div className="gx-chips">
                    {sel.chips.map(([c, t], i) => <span key={i} className={'chip ' + c}><span className="dot" />{t}</span>)}
                  </div>
                  <div>
                    <div className="gx-insp-section-t">Properties</div>
                    <div className="gx-insp-rows">
                      {sel.meta.map(([k, v], i) => (
                        <div className="gx-insp-row" key={i}><span className="k">{k}</span><span className="v">{v}</span></div>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              )}

              {!isProject && (
                <div className="gx-feed">
                  <div className="gx-insp-section-t" style={{ marginBottom: 8 }}>Audit feed</div>
                  {AUDIT_FEED.map(([t, msg, st], i) => (
                    <div className="gf-line" key={i} style={{ animationDelay: (i * 0.08) + 's' }}>
                      <span className="t">{t}</span><span className={st}>{msg}</span>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { GraphShowcase });
