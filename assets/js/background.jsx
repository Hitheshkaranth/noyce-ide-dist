/* Dynamic background: grid + drifting blobs + particle canvas + telemetry ticker */

function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let w, h, raf, parts = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function init() {
      const n = Math.min(46, Math.round(w * h / 42000));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.5, hue: Math.random() > 0.5 ? '125,211,252' : '167,139,250',
        a: Math.random() * 0.5 + 0.2,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = `rgba(${p.hue},${p.a})`; ctx.fill();
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 11000) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(125,211,252,${0.07 * (1 - d / 11000)})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); init();
    if (!reduce) draw(); else { /* one static frame */ draw(); cancelAnimationFrame(raf); }
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className="bg-particles" aria-hidden="true" />;
}

function Background() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-blob b1" />
      <div className="bg-blob b2" />
      <div className="bg-blob b3" />
      <div className="bg-grid" />
      <PCBTraces />
      <Scope />
      <ParticleField />
      <div className="bg-vignette" />
    </div>
  );
}

function Telemetry() {
  const items = [
    ['REQ-014', 'linked'], ['MC/DC', '87.3%'], ['MISRA', 'clean'], ['sign', 'ed25519'],
    ['STM32', 'flash ready'], ['trace', '1,284 links'], ['sidecar', '412ms reindex'],
    ['stack', '412/1024 B'], ['build', 'hermetic'], ['TST-204', '128 iter'],
    ['orphans', '0'], ['DAL', 'A'],
  ];
  const row = items.map(([k, v], i) => (<span key={i}>{k} <b>{v}</b></span>));
  return (
    <div className="telemetry" aria-hidden="true">
      <div className="track">{row}{row}</div>
    </div>
  );
}

Object.assign(window, { Background, Telemetry });
