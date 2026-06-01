/* Force-directed graph engine — drag, hover-highlight, select, gentle settle */

function ForceGraph({ graphId, nodes, links, springLen, onSelect, muted, children }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const nodeEls = useRef({});
  const edgeEls = useRef([]);
  const pos = useRef({});
  const vel = useRef({});
  const dragId = useRef(null);
  const alpha = useRef(1);
  const sizeRef = useRef({ w: 800, h: 540 });
  const [hover, setHover] = useState(null);
  const [sel, setSel] = useState(null);
  const selRef = useRef(null);

  // adjacency for highlight
  const adj = React.useMemo(() => {
    const m = {}; nodes.forEach((n) => (m[n.id] = new Set()));
    links.forEach((l) => { m[l.s]?.add(l.e); m[l.e]?.add(l.s); });
    return m;
  }, [graphId]);

  const lenFor = (kind) => (kind === 'contains' ? (springLen?.contains ?? 72) : kind === 'calls' ? (springLen?.calls ?? 120) : (springLen?.trace ?? 112));

  function step() {
    const { w, h } = sizeRef.current;
    const P = pos.current, V = vel.current, a = alpha.current;
    const ids = nodes.map((n) => n.id);
    // repulsion
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const p = P[ids[i]], q = P[ids[j]];
        let dx = p.x - q.x, dy = p.y - q.y; let d2 = dx * dx + dy * dy; if (d2 < 1) d2 = 1;
        const f = 2800 / d2; const d = Math.sqrt(d2); const fx = (dx / d) * f, fy = (dy / d) * f;
        V[ids[i]].x += fx * a; V[ids[i]].y += fy * a; V[ids[j]].x -= fx * a; V[ids[j]].y -= fy * a;
      }
    }
    // springs
    links.forEach((l) => {
      const p = P[l.s], q = P[l.e]; if (!p || !q) return;
      let dx = q.x - p.x, dy = q.y - p.y; const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const target = lenFor(l.kind); const f = (d - target) * 0.045;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      V[l.s].x += fx * a; V[l.s].y += fy * a; V[l.e].x -= fx * a; V[l.e].y -= fy * a;
    });
    // gravity to center
    ids.forEach((id) => { V[id].x += (w / 2 - P[id].x) * 0.012 * a; V[id].y += (h / 2 - P[id].y) * 0.012 * a; });
    // integrate
    const pad = 64;
    ids.forEach((id) => {
      if (dragId.current === id) { V[id].x = 0; V[id].y = 0; return; }
      V[id].x *= 0.85; V[id].y *= 0.85;
      P[id].x += V[id].x * 0.18; P[id].y += V[id].y * 0.18;
      P[id].x = Math.max(pad, Math.min(w - pad, P[id].x));
      P[id].y = Math.max(36, Math.min(h - 36, P[id].y));
    });
  }

  function paint() {
    const P = pos.current;
    nodes.forEach((n) => {
      const el = nodeEls.current[n.id]; if (!el) return;
      const p = P[n.id];
      el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)` + (selRef.current === n.id ? ' scale(1.06)' : '');
    });
    links.forEach((l, i) => {
      const ln = edgeEls.current[i]; if (!ln) return;
      const p = P[l.s], q = P[l.e]; if (!p || !q) return;
      ln.setAttribute('x1', p.x); ln.setAttribute('y1', p.y); ln.setAttribute('x2', q.x); ln.setAttribute('y2', q.y);
    });
  }

  // (re)initialise on graph change
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const measure = () => { sizeRef.current = { w: wrap.clientWidth, h: wrap.clientHeight }; };
    measure();
    const { w, h } = sizeRef.current;
    let seed = 99 + graphId.length;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    pos.current = {}; vel.current = {};
    nodes.forEach((n, i) => {
      const ang = (i / nodes.length) * Math.PI * 2;
      pos.current[n.id] = { x: w / 2 + Math.cos(ang) * (90 + rnd() * 120), y: h / 2 + Math.sin(ang) * (70 + rnd() * 100) };
      vel.current[n.id] = { x: 0, y: 0 };
    });
    alpha.current = 1;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const warm = reduce ? 260 : 180;
    for (let i = 0; i < warm; i++) { step(); alpha.current = Math.max(0.04, alpha.current * 0.97); }
    paint();
    setSel(null); selRef.current = null;

    let raf;
    if (!reduce) {
      const loop = () => { step(); alpha.current = Math.max(0.03, alpha.current * 0.992); paint(); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    const ro = new ResizeObserver(measure); ro.observe(wrap);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [graphId]);

  // drag handlers
  const startDrag = (id) => (e) => {
    e.preventDefault();
    dragId.current = id; alpha.current = Math.max(alpha.current, 0.5);
    wrapRef.current?.classList.add('dragging');
    const move = (ev) => {
      const r = wrapRef.current.getBoundingClientRect();
      const cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      const cy = (ev.touches ? ev.touches[0].clientY : ev.clientY) - r.top;
      pos.current[id] = { x: cx, y: cy }; vel.current[id] = { x: 0, y: 0 };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) paint();
    };
    const up = () => {
      dragId.current = null; wrapRef.current?.classList.remove('dragging');
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  const focus = hover || sel;
  const isNeighbor = (id) => focus && (focus === id || adj[focus]?.has(id));
  const edgeState = (l) => {
    if (focus) { return (l.s === focus || l.e === focus) ? ' hot' : ' dim'; }
    if (muted && (muted.has(l.s) || muted.has(l.e))) return ' dim';
    return '';
  };

  const selectNode = (n) => { setSel(n.id); selRef.current = n.id; onSelect && onSelect(n); };

  return (
    <div className="gx-canvas" ref={wrapRef}>
      <svg className="gx-svg" ref={svgRef}>
        {links.map((l, i) => (
          <line key={i} ref={(el) => (edgeEls.current[i] = el)}
            className={'gx-edge ' + (l.kind === 'calls' ? 'calls' : '') + (l.orphan ? ' orphan' : '') + edgeState(l)} />
        ))}
      </svg>
      {nodes.map((n) => {
        const NIco = Ico[n.ico] || Ico.doc;
        const cls = 'gx-node' + (n.orphan ? ' orphan' : '') + (sel === n.id ? ' sel' : '')
          + (focus ? (isNeighbor(n.id) ? ' hot' : ' dim') : (muted && muted.has(n.id) ? ' dim' : ''));
        return (
          <div key={n.id} ref={(el) => (nodeEls.current[n.id] = el)} className={cls}
            onPointerDown={startDrag(n.id)}
            onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
            onClick={() => selectNode(n)}>
            <span className={'gn-ico ' + n.type}><NIco /></span>
            <span>
              <span className="gn-name">{n.label}</span>
              {n.sub && <span className="gn-sub" style={{ display: 'block' }}>{n.sub}</span>}
            </span>
          </div>
        );
      })}
      {children}
    </div>
  );
}

Object.assign(window, { ForceGraph });
