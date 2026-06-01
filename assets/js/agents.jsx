/* AI Agent Orbit — orchestrator core + 6 orbiting agents, hover to pause & expand */

const AGENTS = [
  { key: 'designer', name: 'System Designer', role: 'decompose', ico: 'designer',
    body: 'Takes a high-level requirement — "the brake actuator shall respond within 50 ms under ASIL-D conditions" — and emits low-level design items, interfaces, and traceability stubs.',
    cmd: 'noyce decompose REQ-014 --target stm32h7' },
  { key: 'engineer', name: 'Software Engineer', role: 'implement', ico: 'engineer',
    body: 'Drafts the implementation with the SVD and HAL in context, fixed-point aware, ISR-safe, and wired to the deviation register from the first line.',
    cmd: 'noyce impl LLR-072 --hal stm32h7 --misra' },
  { key: 'test', name: 'Test Engineer', role: 'prove', ico: 'test',
    body: 'Generates MC/DC harnesses, fault-injection scenarios, and hardware-in-the-loop scripts, then ties each verification artifact back to the originating requirement.',
    cmd: 'noyce verify TST-204 --mcdc --hil' },
  { key: 'review', name: 'Code Reviewer', role: 'scrutinise', ico: 'review',
    body: 'Pushes back against MISRA C, fixed-point arithmetic, ISR safety, and the project deviation register — every comment cites a rule, not an opinion.',
    cmd: 'noyce review --rule R.11.5 --explain' },
  { key: 'doc', name: 'Doc Generator', role: 'capture', ico: 'doc',
    body: 'Writes the SDP, SDD, SVP, and review minutes from the live workspace — section numbers, deviations, and signatures stay linked, not reconstructed from memory.',
    cmd: 'noyce doc SDP --section 4.2 --sign' },
  { key: 'trace', name: 'Traceability Monitor', role: 'stitch', ico: 'trace',
    body: 'Maintains the REQ → Design → Code → Test thread continuously, breaks the build when a requirement loses a downstream artifact, and records every link in the audit log.',
    cmd: 'noyce trace --audit --fail-on-orphan' },
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
          <h2>Six specialist agents,<br />one auditable thread.</h2>
          <p>Bring your own provider — Anthropic, OpenAI, Google Gemini, or Mistral — or run fully on-prem through Ollama or LM Studio. The orchestrator routes by latency, cost, and confidence, and signs every action against the requirements graph.</p>
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
