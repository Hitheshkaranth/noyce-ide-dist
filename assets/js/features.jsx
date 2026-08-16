/* Features intro — Noyce Core three-up with hover-tilt glass cards */

function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div ref={ref} className={className} style={{ transition: 'transform .3s var(--ease)', ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>
  );
}

function Features() {
  const cards = [
    { tag: 'Compliance', tagc: 'ok', ico: 'doc', h: 'Evidence in the editor',
      p: 'DO-178C Table A objectives, ISO 26262 work products, MISRA C:2012 advisories, and MC/DC coverage — surfaced inline alongside the code they govern.' },
    { tag: 'Hardware', tagc: 'violet', ico: 'pin', h: 'Aware of the silicon',
      p: 'Pin mux, SVD-driven peripheral registers, an RTOS task viewer, debug-probe sessions, a Cortex-M fault decoder, and linker memory maps — wired into the workbench.' },
    { tag: 'AI', tagc: 'ice', ico: 'designer', h: 'A team, not a chatbot',
      p: 'Six specialist personas, from System Designer to Traceability Monitor, orchestrated against the safety case rather than your blank line.' },
  ];
  return (
    <section className="section-pad" id="features">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">Noyce Core</span>
          <h2>Code, evidence, and silicon,<br />finally on the same desk.</h2>
          <p>Noyce extends the Code-OSS shell you already trust with first-class surfaces for requirements, traceability, MISRA, MC/DC, pin configuration, and on-target debug. No tab-hopping across five tools.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="feat-grid">
          {cards.map((c, i) => {
            const CIco = Ico[c.ico];
            return (
              <TiltCard key={i} className={'glass board reveal d' + (i + 1)} style={{ padding: 26 }}>
                <span className="corner-pad tl" /><span className="corner-pad tr" /><span className="corner-pad bl" /><span className="corner-pad br" />
                <span className="silk" style={{ bottom: 10, right: 14 }}>{'U' + (i + 1)} · REV C</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'rgba(125,211,252,0.1)', border: '1px solid var(--glass-brd)', color: 'var(--ice)' }}><CIco style={{ width: 22, height: 22 }} /></span>
                  <span className={'chip ' + c.tagc}><span className="dot" />{c.tag}</span>
                </div>
                <h4 style={{ fontSize: 21, marginBottom: 12 }}>{c.h}</h4>
                <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>{c.p}</p>
              </TiltCard>
            );
          })}
        </div>
      </div>
      <style>{`@media (max-width: 820px){ .feat-grid{ grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}

function Release201() {
  const shots = [
    { label: 'Register Knowledge', title: 'The part\u2019s reference manual indexed to 876 page-cited registers', src: 'docs/screenshots/2.0.3/register-knowledge-indexed.png' },
    { label: 'Formal verification', title: 'CBMC 6.9.0 over the firmware harness \u2014 70 properties, all proved', src: 'docs/screenshots/2.0.3/formal-verification-run.png' },
    { label: 'Traceability graph', title: 'Every surface opens full pane, fitted so its labels are readable', src: 'docs/screenshots/2.0.3/traceability-full-pane.png' },
    { label: 'Editor', title: 'Code viewing is the native Code-OSS editor, with the evidence layered on', src: 'docs/screenshots/2.0.3/editor-native-codeoss.png' },
  ];
  return (
    <section className="section-pad product-shots" id="release-201">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">New in 2.0.3</span>
          <h2>Native Code-OSS fixes,<br />verified on real firmware projects.</h2>
          <p>2.0.3 opens every tool as its own surface, leaves code viewing to the Code-OSS editor, and fixes the two paths that stopped Register Knowledge and Code Scanning producing real results. Each capture is the running Code-OSS build with a real /office firmware project loaded, taken after the analysis had run.</p>
        </div>
        <div className="shot-grid release-grid">
          {shots.map((s, i) => (
            <div key={s.src} className={'glass board reveal d' + (i + 1)} style={{ padding: 10 }}>
              <img className="shot-main" src={s.src} alt={s.title} loading="lazy" />
              <div className="shot-caption">
                <span className="chip ice"><span className="dot" />{s.label}</span>
                <strong>{s.title}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SCREENSHOTS = [
  {
    src: 'screenshots/01-project-graph.png',
    label: 'Project Graph',
    title: 'Call graph, files, and safety metadata in one surface',
  },
  {
    src: 'screenshots/02-compliance-dashboard.png',
    label: 'Compliance',
    title: 'DO-178C, ISO 26262, MISRA, and MC/DC status',
  },
  {
    src: 'screenshots/03-traceability-graph.png',
    label: 'Traceability',
    title: 'Requirements through evidence, without spreadsheet drift',
  },
  {
    src: 'screenshots/04-ai-orchestrator.png',
    label: 'AI Orchestrator',
    title: 'Specialist agents routed against project context',
  },
  {
    src: 'screenshots/05-ai-models.png',
    label: 'Models',
    title: 'Provider and local model control for engineering teams',
  },
  {
    src: 'screenshots/06-build-pipeline.png',
    label: 'Build Pipeline',
    title: 'Signed builds, lint, tests, and release evidence',
  },
  {
    src: 'screenshots/07-project-templates.png',
    label: 'Templates',
    title: 'Embedded project starters with safety structure built in',
  },
  {
    src: 'screenshots/08-review-workflow.png',
    label: 'Review',
    title: 'Rule-cited code review and deviation workflow',
  },
  {
    src: 'screenshots/10-pin-configurator.png',
    label: 'Pin Configurator',
    title: 'Pin-aware hardware setup beside the firmware',
  },
  {
    src: 'screenshots/11-misra-diagnostics.png',
    label: 'MISRA',
    title: 'Rule-decoded findings with one-click agent auto-fix',
  },
  {
    src: 'screenshots/12-quality-trend.png',
    label: 'Quality Trend',
    title: 'Maintainability and complexity tracked in-IDE',
  },
];

function ProductScreenshots() {
  const [active, setActive] = useState(0);
  const shot = SCREENSHOTS[active];
  return (
    <section className="section-pad product-shots" id="product">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">Product Screens</span>
          <h2>The same workbench,<br />shown through real project views.</h2>
          <p>These project screenshots sit inside the updated 2.0.3 page so the visual story matches the product surfaces: graph, compliance, traceability, AI, build, templates, review, coupling, quality, and pin configuration.</p>
        </div>

        <div className="shot-stage glass reveal d1">
          <div className="ide-bar">
            <span className="lights"><i /><i /><i /></span>
            <span className="fname"><b>{shot.label.toLowerCase().replaceAll(' ', '-')}</b>.noyce</span>
            <span className="ide-live">project view</span>
          </div>
          <img className="shot-main" src={shot.src} alt={shot.title} loading="eager" />
          <div className="shot-caption">
            <span className="chip ice"><span className="dot" />{shot.label}</span>
            <strong>{shot.title}</strong>
          </div>
        </div>

        <div className="shot-strip reveal d2" role="list" aria-label="Project screenshots">
          {SCREENSHOTS.map((s, i) => (
            <button
              key={s.src}
              className={'shot-thumb glass' + (active === i ? ' active' : '')}
              onClick={() => setActive(i)}
              role="listitem"
              aria-pressed={active === i}>
              <img src={s.src} alt="" loading="lazy" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Features, TiltCard, Release201, ProductScreenshots });
