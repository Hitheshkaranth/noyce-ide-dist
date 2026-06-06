/* 3D Hero Command Center — layered glass panels, mouse parallax, idle float */

function Panel({ className, style, edge, edgeglow, dur, delay, scandelay, title, live, children }) {
  return (
    <div className={'panel ' + (className || '')} style={{ '--edge': edge, '--edgeglow': edgeglow, '--dur': dur, '--delay': delay, ...style }}>
      <div className="scan" style={{ '--scandelay': scandelay }} />
      <div className="panel-hd">
        <span className="dots"><i /><i /><i /></span>
        <span>{title}</span>
        {live && <span className="live">live</span>}
      </div>
      <div className="panel-bd">{children}</div>
    </div>
  );
}

function CommandCenter() {
  const stageRef = useRef(null);
  useEffect(() => {
    const scene = stageRef.current?.parentElement;
    const stage = stageRef.current;
    if (!scene || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const onMove = (e) => {
      const r = scene.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5);
      ty = ((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      stage.style.transform = `rotateY(${cx * 14}deg) rotateX(${-cy * 12}deg)`;
      raf = requestAnimationFrame(loop);
    };
    scene.addEventListener('mousemove', onMove);
    scene.addEventListener('mouseleave', onLeave);
    loop();
    return () => { cancelAnimationFrame(raf); scene.removeEventListener('mousemove', onMove); scene.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div className="scene">
      <div className="scene-stage" ref={stageRef}>
        {/* Central code editor */}
        <Panel title="brake_actuator.c" live edge="rgba(125,211,252,0.30)" edgeglow="rgba(125,211,252,0.09)" dur="8s" delay="0s" scandelay="0s"
          style={{ width: 300, height: 196, left: '50%', top: '50%', transform: 'translate3d(-50%,-50%,80px)', zIndex: 6 }}>
          <div className="codeline"><span className="cm">/* MISRA C:2012 R.11.5 */</span></div>
          <div className="codeline"><span className="c1">void</span> <span className="c2">brake_step</span>(<span className="c1">u32</span> dt) {'{'}</div>
          <div className="codeline">{'  '}<span className="c1">if</span> (dt &gt; <span className="c3">DEADLINE_MS</span>)</div>
          <div className="codeline">{'    '}fault_latch(<span className="c3">ASIL_D</span>);</div>
          <div className="codeline">{'  '}actuator_drive(pwm);</div>
          <div className="codeline">{'}'}</div>
          <div className="codeline" style={{ marginTop: 6 }}><span className="c3">✓ verified</span> <span className="cm">· REQ-014 · 50ms</span></div>
        </Panel>

        {/* Compliance evidence (back left) */}
        <Panel title="compliance" edge="rgba(74,222,128,0.28)" edgeglow="rgba(74,222,128,0.07)" dur="9s" delay="-2s" scandelay="-1.5s"
          style={{ width: 188, height: 150, left: '2%', top: '8%', transform: 'translate3d(0,0,-40px) rotateY(16deg)', zIndex: 3 }}>
          <div className="metric-row"><span className="k">DO-178C A</span><span className="v" style={{ color: 'var(--green)' }}>10/12</span></div>
          <div className="metric-row"><span className="k">ISO 26262</span><span className="v">ASIL D</span></div>
          <div className="metric-row"><span className="k">MISRA open</span><span className="v" style={{ color: 'var(--amber)' }}>170</span></div>
          <div className="metric-row"><span className="k">verified</span><span className="v">6/12</span></div>
          <div className="minibar"><i style={{ width: '83%' }} /></div>
        </Panel>

        {/* MCU pinout (back right) */}
        <Panel title="pin-mux" edge="rgba(167,139,250,0.30)" edgeglow="rgba(167,139,250,0.08)" dur="7.5s" delay="-1s" scandelay="-3s"
          style={{ width: 178, height: 158, right: '0%', top: '4%', transform: 'translate3d(0,0,-30px) rotateY(-16deg)', zIndex: 3 }}>
          <div className="codeline"><span className="c2">PA9</span> <span className="cm">USART1_TX</span></div>
          <div className="codeline"><span className="c2">PB6</span> <span className="cm">I2C1_SCL</span></div>
          <div className="codeline"><span className="c2">PC13</span> <span className="cm">GPIO_EXTI</span></div>
          <div className="codeline" style={{ marginTop: 6 }}><span className="c1">alt-fn</span> 7 · drive=high</div>
          <div className="codeline"><span className="c3">✓ resolved</span> <span className="cm">· 0 conflicts</span></div>
        </Panel>

        {/* Traceability graph (front left) */}
        <Panel title="trace-graph" live edge="rgba(125,211,252,0.26)" edgeglow="rgba(125,211,252,0.06)" dur="8.5s" delay="-3s" scandelay="-2s"
          style={{ width: 196, height: 130, left: '6%', bottom: '4%', transform: 'translate3d(0,0,30px) rotateY(12deg)', zIndex: 5 }}>
          <svg viewBox="0 0 170 70" style={{ width: '100%', height: 78 }}>
            <line x1="14" y1="35" x2="60" y2="14" stroke="rgba(125,211,252,0.5)" strokeWidth="1.4" />
            <line x1="14" y1="35" x2="60" y2="56" stroke="rgba(125,211,252,0.5)" strokeWidth="1.4" />
            <line x1="60" y1="14" x2="110" y2="35" stroke="rgba(125,211,252,0.5)" strokeWidth="1.4" />
            <line x1="60" y1="56" x2="110" y2="35" stroke="rgba(167,139,250,0.5)" strokeWidth="1.4" />
            <line x1="110" y1="35" x2="156" y2="35" stroke="rgba(74,222,128,0.6)" strokeWidth="1.4" />
            {[[14,35,'var(--ice)'],[60,14,'var(--ice)'],[60,56,'var(--violet)'],[110,35,'var(--ice)'],[156,35,'var(--green)']].map(([x,y,c],i)=>(<circle key={i} cx={x} cy={y} r="5" fill="#0a0e16" stroke={c} strokeWidth="1.8" />))}
          </svg>
          <div className="codeline" style={{ marginTop: 2 }}><span className="c3">REQ→Test</span> <span className="cm">· 1,284 links</span></div>
        </Panel>

        {/* Build pipeline (front right) */}
        <Panel title="build-pipeline" live edge="rgba(74,222,128,0.26)" edgeglow="rgba(74,222,128,0.06)" dur="7.8s" delay="-4s" scandelay="-1s"
          style={{ width: 190, height: 128, right: '4%', bottom: '8%', transform: 'translate3d(0,0,50px) rotateY(-12deg)', zIndex: 5 }}>
          {[['Compile','arm-gcc','ok'],['Lint','0 viol','ok'],['Test','184 pass','ok'],['Sign','ed25519','ok']].map(([s,d,st],i)=>(
            <div className="metric-row" key={i}><span className="k">{s} <span style={{ color: 'var(--ink-3)' }}>{d}</span></span><span className="v" style={{ color: 'var(--green)' }}>✓</span></div>
          ))}
        </Panel>

        {/* AI agent activity (top center, floating high) */}
        <Panel title="orchestrator" live edge="rgba(167,139,250,0.32)" edgeglow="rgba(167,139,250,0.10)" dur="6.8s" delay="-1.5s" scandelay="-4s"
          style={{ width: 168, height: 96, left: '52%', top: '-6%', transform: 'translate3d(-50%,0,110px)', zIndex: 7 }}>
          <div className="codeline"><span className="c1">●</span> System Designer <span className="cm">busy</span></div>
          <div className="codeline"><span className="c2">●</span> Test Engineer <span className="cm">128 iter</span></div>
          <div className="codeline"><span className="c3">●</span> Traceability <span className="cm">audit-ok</span></div>
        </Panel>
      </div>
    </div>
  );
}

function Hero() {
  const stats = [
    ['10+', 'First-party extensions'],
    ['6', 'AI personas, one orchestrator'],
    ['6', 'MCU families, pin-aware'],
    ['A', 'DO-178C Level A ready'],
  ];
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker">Noyce IDE · 1.0.7</span>
          <h1 style={{ marginTop: 22 }}>The IDE built for firmware that <span className="grad">has to be right.</span></h1>
          <p className="lede">An AI-native, Code-OSS workbench for embedded and safety-critical teams. Certification evidence, multi-agent review, and pin-aware editing live in one place.</p>
          <div className="hero-actions">
            <a href="#download" className="btn btn-primary btn-sweep"><Ico.download style={{ width: 17, height: 17 }} /> Download for macOS</a>
            <a href="https://github.com/Hitheshkaranth/noyce_ide" className="btn btn-ghost" target="_blank" rel="noreferrer"><Ico.github style={{ width: 16, height: 16 }} /> View on GitHub</a>
            <span className="meta">arm64 · 142 MB</span>
          </div>
          <div className="hero-stats">
            {stats.map(([n, l], i) => (
              <div className="stat" key={i}><div className="n">{n}</div><div className="l">{l}</div></div>
            ))}
          </div>
        </div>
        <CommandCenter />
      </div>
    </header>
  );
}

Object.assign(window, { Hero });
