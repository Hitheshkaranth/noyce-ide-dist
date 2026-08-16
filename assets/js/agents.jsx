/* AI Agent Orbit — orchestrator core + 9 personas, hover to pause & expand */

const AGENTS = [
  { key: 'designer', name: 'System Designer', role: 'SRS / SDD', ico: 'designer',
    body: 'Drafts Software Design Descriptions and hardware dependencies. Handoff to Coder and Traceability Monitor.',
    cmd: 'noyce decompose REQ-014 --target tm4c1294' },
  { key: 'coder', name: 'Coder', role: 'implement', ico: 'engineer',
    body: 'Implements from the SDD in MISRA C:2025, annotates @req / @verification, and refactors for MISRA. Handoff to Tester and Reviewer.',
    cmd: 'noyce impl LLR-072 --hal tiva --misra' },
  { key: 'test', name: 'Tester', role: 'Unity · HIL', ico: 'test',
    body: 'Generates Unity tests and module test plans. Compliance A-6 test-case objectives land here.',
    cmd: 'noyce verify TST-204 --mcdc --hil' },
  { key: 'review', name: 'Reviewer', role: 'MISRA · A-7', ico: 'review',
    body: 'MISRA C:2025 audit and DO-178C safety review. Routed as Compliance Reviewer for A-7 records.',
    cmd: 'noyce review --rule 15.5 --explain' },
  { key: 'doc', name: 'Doc Generator', role: 'plans · records', ico: 'doc',
    body: 'Extracts SRS entries and writes plans, standards, and QA/CM records as Documentation Engineer.',
    cmd: 'noyce doc SDP --section 4.2 --sign' },
  { key: 'trace', name: 'Traceability Monitor', role: 'graph · orphans', ico: 'trace',
    body: 'Keeps the REQ / design / code / test graph current and lists orphans. Completions are hash-chained.',
    cmd: 'noyce trace --audit --fail-on-orphan' },
  { key: 'ux', name: 'UI/UX Designer', role: 'spec · critique', ico: 'pin',
    body: 'Turns a user story into hierarchy, flow, and component spec. Handoff to Frontend Developer.',
    cmd: 'noyce design --story onboard-pin-mux' },
  { key: 'fe', name: 'Frontend Developer', role: 'React · TS', ico: 'reg',
    body: 'Implements React + TypeScript from the design spec. Handoff to API Integrator and Tester.',
    cmd: 'noyce ui impl --spec pin-card' },
  { key: 'api', name: 'API Integrator', role: 'REST · types', ico: 'rtos',
    body: 'Defines REST endpoints and wires fetch with types and error handling for the attached frontend.',
    cmd: 'noyce api wire --surface serial-monitor' },
];

function AgentOrbit() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const R = 6, a = AGENTS[active];
  const Icon = Ico[a.ico];
  const [typed, setTyped] = useState('');
  useEffect(() => {
    setTyped('');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(a.cmd); return; }
    let i = 0, id = setInterval(() => {
      i++; setTyped(a.cmd.slice(0, i));
      if (i >= a.cmd.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section className="section-pad" id="ai">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">Noyce Agents</span>
          <h2>Nine specialist agents,<br />one auditable thread.</h2>
          <p>The extension registry ships nine personas with coded handoffs: six for the firmware loop, three for workbench UI. Bring your own provider. Completions are signed against the graph.</p>
        </div>

        <div className={'orbit-wrap reveal d1' + (paused ? ' paused' : '')}>
          {/* Orbit visualization */}
          <div className="orbit-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            style={{ '--orbit-r': '188px' }}>
            <div className="orbit-ring r1" />
            <div className="orbit-ring r2" />
            <div className="core">
              <div className="label">ORCH<b>Orchestrator</b><small>routing · signing</small></div>
            </div>
            <div className="orbit-rotor">
              {AGENTS.map((ag, i) => {
                const ang = (i * 360) / AGENTS.length;
                const AIcon = Ico[ag.ico];
                return (
                  <React.Fragment key={ag.key}>
                    {/* task packet */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `rotate(${ang}deg)`, width: 0, height: 0 }}>
                      <span className="packet" style={{ animation: `packet-out 3.2s ${(i * 0.5)}s ease-in infinite` }} />
                    </div>
                    {/* agent node */}
                    <div className="agent-node" style={{ transform: `rotate(${ang}deg) translateY(calc(-1 * var(--orbit-r)))` }}>
                      <div style={{ transform: `rotate(${-ang}deg)` }}>
                        <div className="counter">
                          <div className={'agent-card' + (active === i ? ' active' : '')}
                            onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
                            <div className="ac-top">
                              <span className="ac-ico"><AIcon style={{ color: 'var(--ice)' }} /></span>
                              <div><div className="ac-name">{ag.name}</div><div className="ac-role">{ag.role}</div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="agent-detail glass" style={{ padding: 30 }}>
            <div className="ad-head">
              <span className="ad-ico"><Icon style={{ color: 'var(--ice)' }} /></span>
              <div><h3>{a.name}</h3><div className="ad-role">{a.role}</div></div>
            </div>
            <p>{a.body}</p>
            <div className="ad-cmd">{typed}<span className="caret" /></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <span className="chip ice"><span className="dot" />routes by confidence</span>
              <span className="chip violet"><span className="dot" />signs against graph</span>
              <span className="chip ok"><span className="dot" />audit-logged</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AgentOrbit });
