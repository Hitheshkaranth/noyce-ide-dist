import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ---- ICONS ----
const Icons = {
  designer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 7h18M3 12h18M3 17h10"/><circle cx="18" cy="17" r="3"/>
    </svg>
  ),
  engineer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16"/>
    </svg>
  ),
  test: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 3h6M10 3v6L5 19a2 2 0 002 3h10a2 2 0 002-3l-5-10V3"/>
    </svg>
  ),
  review: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  doc: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 2v6h6M8 13h8M8 17h5"/>
    </svg>
  ),
  trace: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/>
      <path d="M7 6h10M6 8l5 8M18 8l-5 8"/>
    </svg>
  ),
  pin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="6" y="6" width="12" height="12" rx="2"/>
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>
    </svg>
  ),
  github: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0022 12.25C22 6.58 17.52 2 12 2z"/>
    </svg>
  ),
  download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>
    </svg>
  ),
  arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
}

const Icon = ({ name, className = 'w-5 h-5' }: { name: keyof typeof Icons; className?: string }) => {
  const IconComponent = Icons[name]
  return <span className={className}><IconComponent /></span>
}

// ---- BACKGROUND ----
function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = canvas.clientWidth, h = canvas.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 7)
        ctx.fillStyle = 'rgba(125,211,252,0.4)'
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
}

function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1020] via-[#06080c] to-[#080c14]" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(125,211,252,0.15),transparent_70%)]" />
      <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(167,139,250,0.12),transparent_70%)]" />
      <ParticleField />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  )
}

// ---- NAV ----
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[rgba(6,8,12,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]' : ''}`}>
      <div className="max-w-[1240px] mx-auto px-7 h-[66px] flex items-center gap-8">
        <a href="#top" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7dd3fc] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[rgba(125,211,252,0.3)]">
            <span className="w-4 h-4 rounded bg-[#06080c]" />
          </div>
          <span className="text-lg font-semibold text-white">Noyce IDE</span>
          <span className="text-[10px] font-mono text-[#8a94a6] border border-[rgba(255,255,255,0.1)] rounded px-2 py-0.5 ml-1">1.0.7</span>
        </a>
        <div className="hidden md:flex items-center gap-2 ml-4">
          {['Features', 'AI', 'Hardware', 'Compliance', 'Graph', 'Download'].map((link, i) => (
            <a key={link} href={`#${['features','ai','hardware','compliance','graph','download'][i]}`} className="text-sm text-[#8a94a6] hover:text-white px-3 py-2 rounded-lg transition-colors">{link}</a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
            <Icon name="github" /> GitHub
          </a>
          <a href="#download" className="btn btn-primary text-sm">Download</a>
        </div>
      </div>
    </nav>
  )
}

// ---- HERO ----
function Hero() {
  const stats = [
    ['10+', 'First-party extensions'],
    ['6', 'AI personas, one orchestrator'],
    ['6', 'MCU families, pin-aware'],
    ['A', 'DO-178C Level A ready'],
  ]
  return (
    <header id="top" className="relative min-h-screen pt-[100px] pb-[80px] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="max-w-[1240px] mx-auto px-7 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-[560px]">
            <span className="kicker">Noyce IDE · 1.0.7</span>
            <h1 className="mt-6 text-[clamp(38px,5.4vw,68px)] font-semibold leading-[0.98] tracking-tight text-white">
              The IDE built for firmware that <span className="bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#7dd3fc] bg-clip-text text-transparent">has to be right.</span>
            </h1>
            <p className="mt-6 text-lg text-[#c4ccda] max-w-[500px] leading-relaxed">
              An AI-native, Code-OSS workbench for embedded and safety-critical teams. Certification evidence, multi-agent review, and pin-aware editing live in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a href="#download" className="btn btn-primary">
                <Icon name="download" /> Download for macOS
              </a>
              <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Icon name="github" /> View on GitHub
              </a>
              <span className="text-xs font-mono text-[#5b6678]">arm64 · 142 MB</span>
            </div>
            <div className="mt-12 grid grid-cols-4 gap-5 max-w-[520px]">
              {stats.map(([n, l], i) => (
                <div key={i}>
                  <div className="text-3xl font-semibold bg-gradient-to-b from-white to-[#7dd3fc] bg-clip-text text-transparent">{n}</div>
                  <div className="text-[11px] text-[#8a94a6] mt-1 leading-tight">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] perspective-[1600px]">
            <div className="absolute inset-0 transform-gpu animate-[float_7s_ease-in-out_infinite]">
              <div className="glass absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] p-4 shadow-2xl" style={{ transform: 'translate3d(-50%,-50%,80px)' }}>
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#8a94a6] border-b border-[rgba(255,255,255,0.08)] pb-2 mb-3">
                  <span className="flex gap-1.5"><i className="w-2 h-2 rounded-full bg-[#ff5f57]"/><i className="w-2 h-2 rounded-full bg-[#febc2e]"/><i className="w-2 h-2 rounded-full bg-[#28c840]"/></span>
                  brake_actuator.c
                  <span className="ml-auto text-[#4ade80] flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"/>live</span>
                </div>
                <pre className="text-[11px] font-mono leading-relaxed text-[#c4ccda]">
                  <span className="text-[#a78bfa]">void</span> <span className="text-[#7dd3fc]">brake_step</span>(u32 dt) {'{\n'}
                  {'  '}<span className="text-[#a78bfa]">if</span> (dt &gt; DEADLINE_MS)\n
                  {'    '}fault_latch(ASIL_D);\n
                  {'  '}actuator_drive(pwm);\n{'}'}\n
                  <span className="text-[#4ade80]">✓ verified</span> <span className="text-[#5b6678]">· REQ-014 · 50ms</span>
                </pre>
              </div>
              <div className="glass absolute left-[5%] top-[15%] w-[180px] p-3 shadow-xl animate-[float_9s_ease-in-out_infinite_-2s]">
                <div className="text-[10px] font-mono text-[#4ade80] mb-2">compliance</div>
                <div className="flex justify-between text-[10px] font-mono"><span className="text-[#8a94a6]">DO-178C A</span><span className="text-[#4ade80]">10/12</span></div>
                <div className="flex justify-between text-[10px] font-mono mt-1"><span className="text-[#8a94a6]">MISRA</span><span className="text-[#fbbf24]">170</span></div>
              </div>
              <div className="glass absolute right-[5%] top-[10%] w-[170px] p-3 shadow-xl animate-[float_7.5s_ease-in-out_infinite_-1s]">
                <div className="text-[10px] font-mono text-[#a78bfa] mb-2">pin-mux</div>
                <div className="text-[10px] font-mono text-[#c4ccda]">PA9 · USART1_TX</div>
                <div className="text-[10px] font-mono text-[#c4ccda]">PB6 · I2C1_SCL</div>
                <div className="text-[10px] font-mono text-[#4ade80] mt-1">✓ resolved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ---- FEATURES ----
function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const features = [
    { tag: 'Compliance', ico: 'doc', title: 'Evidence in the editor', desc: 'DO-178C Table A objectives, ISO 26262 work products, MISRA C:2012 advisories, and MC/DC coverage — surfaced inline alongside the code they govern.' },
    { tag: 'Hardware', ico: 'pin', title: 'Aware of the silicon', desc: 'Pin mux, SVD-driven peripheral registers, an RTOS task viewer, debug-probe sessions, a Cortex-M fault decoder, and linker memory maps — wired into the workbench.' },
    { tag: 'AI', ico: 'designer', title: 'A team, not a chatbot', desc: 'Six specialist personas, from System Designer to Traceability Monitor, orchestrated against the safety case rather than your blank line.' },
  ]
  return (
    <section id="features" ref={ref} className="relative py-28">
      <div className="max-w-[1240px] mx-auto px-7">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-[720px]">
          <span className="kicker">Noyce Core</span>
          <h2 className="mt-5 text-[clamp(30px,4.2vw,52px)] font-semibold leading-tight">Code, evidence, and silicon,<br/>finally on the same desk.</h2>
          <p className="mt-5 text-[#8a94a6] max-w-[600px] text-lg leading-relaxed">
            Noyce extends the Code-OSS shell you already trust with first-class surfaces for requirements, traceability, MISRA, MC/DC, pin configuration, and on-target debug.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 * (i + 1) }} className="glass p-6 group hover:border-[rgba(125,211,252,0.3)] transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-[rgba(125,211,252,0.1)] border border-[rgba(125,211,252,0.2)] flex items-center justify-center text-[#7dd3fc]">
                  <Icon name={f.ico as keyof typeof Icons} className="w-5 h-5" />
                </div>
                <span className={`chip ${i === 0 ? 'ok' : i === 1 ? 'violet' : 'ice'}`}><span className="dot"/>{f.tag}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-[#8a94a6] text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- AGENTS ----
const AGENTS = [
  { key: 'designer', name: 'System Designer', role: 'decompose', desc: 'Takes high-level requirements and emits low-level design items, interfaces, and traceability stubs.' },
  { key: 'engineer', name: 'Software Engineer', role: 'implement', desc: 'Drafts implementation with SVD and HAL in context, fixed-point aware, ISR-safe.' },
  { key: 'test', name: 'Test Engineer', role: 'prove', desc: 'Generates MC/DC harnesses, fault-injection scenarios, and HIL scripts.' },
  { key: 'review', name: 'Code Reviewer', role: 'scrutinise', desc: 'Pushes back against MISRA C, fixed-point, ISR safety — citing rules, not opinions.' },
  { key: 'doc', name: 'Doc Generator', role: 'capture', desc: 'Writes SDP, SDD, SVP from the live workspace with linked signatures.' },
  { key: 'trace', name: 'Traceability Monitor', role: 'stitch', desc: 'Maintains the REQ→Design→Code→Test thread continuously, breaks the build on orphan.' },
]

function Agents() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActiv] = useState(0)
  const agent = AGENTS[active]
  return (
    <section id="ai" ref={ref} className="relative py-28">
      <div className="max-w-[1240px] mx-auto px-7">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-[720px]">
          <span className="kicker">Noyce Agents</span>
          <h2 className="mt-5 text-[clamp(30px,4.2vw,52px)] font-semibold leading-tight">Six specialist agents,<br/>one auditable thread.</h2>
          <p className="mt-5 text-[#8a94a6] max-w-[600px] text-lg leading-relaxed">
            Bring your own provider — Anthropic, OpenAI, Google Gemini, or run fully on-prem through Ollama or LM Studio.
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-10 mt-14">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }} className="relative h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-[#7dd3fc] via-[#a78bfa] to-[#7dd3fc] shadow-2xl shadow-[rgba(125,211,252,0.4)] animate-pulse flex items-center justify-center">
                <div className="text-center font-mono text-[10px] text-white tracking-wider">
                  <div>ORCH</div>
                  <div className="text-sm font-semibold mt-1">Orchestrator</div>
                  <div className="text-[8px] opacity-60 mt-1">routing · signing</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0" style={{ animation: 'spin 44s linear infinite' }}>
              {AGENTS.map((a, i) => {
                const angle = (i * 360) / AGENTS.length
                const radius = 160
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius
                return (
                  <div key={a.key} className="absolute left-1/2 top-1/2" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                    <button onClick={() => setActiv(i)} className={`glass px-4 py-2 text-center ${active === i ? 'border-[#7dd3fc]' : ''}`} style={{ animation: 'spin 44s linear infinite reverse' }}>
                      <div className="text-xs font-semibold">{a.name}</div>
                      <div className="text-[9px] font-mono text-[#7dd3fc]">{a.role}</div>
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="glass p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(125,211,252,0.2)] to-[rgba(167,139,250,0.2)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#7dd3fc]">
                <Icon name={agent.key as keyof typeof Icons} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{agent.name}</h3>
                <div className="text-[11px] font-mono text-[#7dd3fc] tracking-wider uppercase">{agent.role}</div>
              </div>
            </div>
            <p className="text-[#c4ccda] text-base leading-relaxed">{agent.desc}</p>
            <div className="mt-auto flex gap-2 pt-5">
              <span className="chip ice"><span className="dot"/>routes by confidence</span>
              <span className="chip violet"><span className="dot"/>signs against graph</span>
              <span className="chip ok"><span className="dot"/>audit-logged</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ---- HARDWARE MCU ----
function Hardware() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const mcus = ['STM32', 'TI Tiva', 'PIC32', 'RP2040', 'i.MX RT', 'Cortex-M']
  const features = [
    { ico: 'pin', title: 'Pin mux that knows the board', desc: 'Drag a peripheral onto the chip and Noyce resolves the alternate function, conflicts, and pin-level electrical constraints.' },
    { ico: 'designer', title: 'Peripheral registers, SVD-aware', desc: 'Hover any MMIO write to see the register, its fields, reset value, and access semantics.' },
    { ico: 'trace', title: 'RTOS task viewer', desc: 'Live task list, stack high-watermark, and deadline misses for FreeRTOS, Zephyr, and ThreadX.' },
  ]
  return (
    <section id="hardware" ref={ref} className="relative py-28">
      <div className="max-w-[1240px] mx-auto px-7">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-[720px]">
          <span className="kicker">Noyce Hardware</span>
          <h2 className="mt-5 text-[clamp(30px,4.2vw,52px)] font-semibold leading-tight">The editor reads the datasheet<br/>so you don't have to.</h2>
          <p className="mt-5 text-[#8a94a6] max-w-[600px] text-lg leading-relaxed">
            First-class support for STM32, TI Tiva, Microchip PIC32, Raspberry Pi RP2040, NXP i.MX RT, and generic Cortex-M.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {mcus.map(m => <span key={m} className="chip ice"><span className="dot"/>{m}</span>)}
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-10 mt-14">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }} className="relative h-[350px] flex items-center justify-center">
            <div className="relative w-[220px] h-[220px] rounded-2xl bg-gradient-to-br from-[#1a2230] to-[#0c1019] border border-[rgba(255,255,255,0.12)] shadow-2xl animate-[float_7s_ease-in-out_infinite] perspective-[1400px]" style={{ transform: 'rotateX(46deg) rotateZ(0deg)' }}>
              <div className="absolute inset-[30px] rounded-xl bg-[#0a0e16] border border-[rgba(125,211,252,0.18)] grid place-items-center">
                <div className="text-center font-mono text-[10px] text-[#7dd3fc]">
                  <div className="text-[13px] text-white font-semibold tracking-widest">STM32H743</div>
                  <div>Cortex-M7 · 480 MHz</div>
                  <div className="mt-1">LQFP176</div>
                </div>
              </div>
              {Array.from({ length: 36 }).map((_, i) => {
                const side = Math.floor(i / 9)
                const pos = (i % 9) / 8
                const style = side === 0 ? { top: -5, left: `${10 + pos * 80}%`, width: 14, height: 5 } :
                              side === 1 ? { right: -5, top: `${10 + pos * 80}%`, width: 5, height: 14 } :
                              side === 2 ? { bottom: -5, left: `${10 + pos * 80}%`, width: 14, height: 5 } :
                                           { left: -5, top: `${10 + pos * 80}%`, width: 5, height: 14 }
                return <div key={i} className="absolute bg-gradient-to-r from-[#3a4458] to-[#6b7890] rounded-sm shadow" style={style} />
              })}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="flex flex-col gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 p-4 border-b border-[rgba(255,255,255,0.07)] last:border-0">
                <div className="w-9 h-9 rounded-lg bg-[rgba(125,211,252,0.1)] border border-[rgba(125,211,252,0.2)] flex items-center justify-center text-[#7dd3fc]">
                  <Icon name={f.ico as keyof typeof Icons} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1">{f.title}</h4>
                  <p className="text-[#8a94a6] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ---- COMPLIANCE / TRACE ----
function Compliance() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const metrics = [
    { value: '1,284', label: 'live REQ, Design, and Test links' },
    { value: '412ms', label: 'Sidecar full-workspace re-index' },
    { value: '0', label: 'orphan requirements before merge' },
    { value: 'SHA', label: 'cryptographic audit log per change' },
  ]
  return (
    <section id="compliance" ref={ref} className="relative py-28">
      <div className="max-w-[1240px] mx-auto px-7">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-[720px] mx-auto text-center">
          <span className="kicker">Traceability</span>
          <h2 className="mt-5 text-[clamp(30px,4.2vw,52px)] font-semibold leading-tight">REQ → Design → Test,<br/>kept honest.</h2>
          <p className="mt-5 text-[#8a94a6] max-w-[600px] mx-auto text-lg leading-relaxed">
            Built from the actual workspace, not a side spreadsheet. The Rust sidecar re-indexes on save, the orchestrator audits the thread, and broken links fail the build.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="glass mt-14 p-8 h-[340px] relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300">
            <text x="60" y="40" fill="rgba(125,211,252,0.5)" fontSize="10" fontFamily="monospace">REQ</text>
            <text x="280" y="40" fill="rgba(167,139,250,0.5)" fontSize="10" fontFamily="monospace">DESIGN</text>
            <text x="500" y="40" fill="rgba(205,160,102,0.5)" fontSize="10" fontFamily="monospace">CODE</text>
            <text x="720" y="40" fill="rgba(74,222,128,0.5)" fontSize="10" fontFamily="monospace">TEST</text>
            {[0,1,2].map(row => (
              <g key={row}>
                <circle cx="80" cy={80+row*70} r="20" fill="rgba(6,8,12,0.8)" stroke="rgba(125,211,252,0.4)" strokeWidth="1.5"/>
                <text x="80" y={84+row*70} fill="#7dd3fc" fontSize="8" fontFamily="monospace" textAnchor="middle">REQ</text>
                <path d={`M100 ${80+row*70} L260 ${80+row*70}`} stroke="rgba(125,211,252,0.3)" strokeWidth="1" strokeDasharray="4 4"/>
                <circle cx="280" cy={80+row*70} r="20" fill="rgba(6,8,12,0.8)" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
                <text x="280" y={84+row*70} fill="#a78bfa" fontSize="8" fontFamily="monospace" textAnchor="middle">DSN</text>
                <path d={`M300 ${80+row*70} L480 ${80+row*70}`} stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="4 4"/>
                <circle cx="500" cy={80+row*70} r="20" fill="rgba(6,8,12,0.8)" stroke="rgba(205,160,102,0.4)" strokeWidth="1.5"/>
                <text x="500" y={84+row*70} fill="#d9a066" fontSize="8" fontFamily="monospace" textAnchor="middle">SRC</text>
                <path d={`M520 ${80+row*70} L700 ${80+row*70}`} stroke="rgba(205,160,102,0.3)" strokeWidth="1" strokeDasharray="4 4"/>
                <circle cx="720" cy={80+row*70} r="20" fill="rgba(6,8,12,0.8)" stroke="rgba(74,222,128,0.4)" strokeWidth="1.5"/>
                <text x="720" y={84+row*70} fill="#4ade80" fontSize="8" fontFamily="monospace" textAnchor="middle">TST</text>
              </g>
            ))}
          </svg>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }} className="glass p-4">
              <div className="text-2xl font-bold bg-gradient-to-b from-white to-[#7dd3fc] bg-clip-text text-transparent">{m.value}</div>
              <div className="text-xs text-[#8a94a6] mt-2">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- GRAPH SHOWCASE ----
function Graph() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section id="graph" ref={ref} className="relative py-28">
      <div className="max-w-[1240px] mx-auto px-7">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-[720px] mx-auto text-center">
          <span className="kicker">Project Graph</span>
          <h2 className="mt-5 text-[clamp(30px,4.2vw,52px)] font-semibold leading-tight">The whole project,<br/>as one live graph.</h2>
          <p className="mt-5 text-[#8a94a6] max-w-[600px] mx-auto text-lg leading-relaxed">
            The Rust sidecar indexes every file, function, and requirement on save and exposes them as one navigable graph.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.1 }} className="glass mt-14 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,14,22,0.34)]">
            <span className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/><i className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"/><i className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/></span>
            <span className="text-xs font-mono text-[#8a94a6]"><b className="text-white">project-graph</b>.noyce</span>
            <span className="ml-auto text-[10px] font-mono text-[#4ade80] flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"/>sidecar · live</span>
          </div>
          <div className="h-[400px] relative bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.04),transparent_62%)]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
              {[[200,100],[400,80],[600,120],[300,200],[500,220],[150,300],[350,320],[550,300],[700,280]].map((node, i) => (
                <g key={i}>
                  <circle cx={node[0]} cy={node[1]} r="24" fill="rgba(12,16,24,0.9)" stroke="rgba(125,211,252,0.4)" strokeWidth="1.5"/>
                  <text x={node[0]} y={node[1]+4} fill="white" fontSize="9" fontFamily="monospace" textAnchor="middle">{['main.c','brake.c','timer.c','gpio.c','uart.c','spi.c','i2c.c','can.c','usb.c'][i]}</text>
                </g>
              ))}
              {[[0,3],[0,4],[1,4],[1,5],[2,5],[2,6],[3,7],[4,7],[5,8],[6,7],[7,8]].map((edge, i) => {
                const nodes = [[200,100],[400,80],[600,120],[300,200],[500,220],[150,300],[350,320],[550,300],[700,280]]
                return <line key={i} x1={nodes[edge[0]][0]} y1={nodes[edge[0]][1]} x2={nodes[edge[1]][0]} y2={nodes[edge[1]][1]} stroke="rgba(125,211,252,0.2)" strokeWidth="1"/>
              })}
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ---- DOWNLOAD ----
function Download() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const platforms = [
    { os: 'macOS', status: 'Released', statusClass: 'ok', arch: 'arm64 · 142 MB', desc: 'macOS 13 Ventura or later. arm64 native, x86_64 supported.', cmd: 'brew install --cask noyce-ide' },
    { os: 'Windows', status: 'Beta', statusClass: 'warn', arch: 'x64 · 168 MB', desc: 'Windows 11 · x64 · code-signed · MSI and portable.', cmd: 'winget install Noyce.IDE' },
    { os: 'Linux', status: 'Roadmap', statusClass: 'ice', arch: 'AppImage · deb', desc: 'Ubuntu 22.04+, Fedora 39+ · Q3 2026.', cmd: 'flatpak install dev.noyce.IDE' },
  ]
  return (
    <section id="download" ref={ref} className="relative py-28">
      <div className="max-w-[1240px] mx-auto px-7">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="max-w-[720px] mx-auto text-center">
          <span className="kicker">Get Noyce</span>
          <h2 className="mt-5 text-[clamp(30px,4.2vw,52px)] font-semibold leading-tight">Install. Open a template.<br/>Ship a certified binary.</h2>
          <p className="mt-5 text-[#8a94a6] max-w-[600px] mx-auto text-lg leading-relaxed">
            Noyce is free during beta. macOS arm64 ships today, Windows is in beta, and Linux is on the roadmap.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {platforms.map((p, i) => (
            <motion.div key={p.os} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 * (i + 1) }} className="glass p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="text-2xl font-semibold">{p.os}</div>
                <span className={`chip ${p.statusClass}`}><span className="dot"/>{p.status}</span>
              </div>
              <p className="text-[#8a94a6] text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="bg-[#06080c] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 font-mono text-[11px] text-[#c4ccda] mb-4">
                $ {p.cmd}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#5b6678] mb-4">
                <span>package</span>
                <span>{p.arch}</span>
              </div>
              <a href="#download" className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'} mt-auto justify-center text-sm`}>
                <Icon name="download" /> {i === 2 ? 'Notify me' : `Download · ${p.os}`}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- FOOTER ----
function Footer() {
  const links = [
    { title: 'Product', items: ['Features', 'AI orchestrator', 'Hardware support', 'Compliance', 'Download'] },
    { title: 'Resources', items: ['Docs', 'Changelog', 'DO-178C guide', 'ISO 26262 guide'] },
    { title: 'Community', items: ['GitHub', 'Discussions', 'Issues'] },
  ]
  return (
    <footer className="relative pt-20 pb-16 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1240px] mx-auto px-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7dd3fc] to-[#a78bfa]" />
              <span className="font-semibold">Noyce IDE</span>
            </div>
            <p className="text-[#8a94a6] text-sm max-w-[280px] leading-relaxed">
              An AI-native Code-OSS workbench for safety-critical embedded firmware.
            </p>
            <p className="text-[11px] font-mono text-[#5b6678] mt-4">v1.0.7 · Free during beta</p>
          </div>
          {links.map(col => (
            <div key={col.title}>
              <h5 className="text-[11px] font-mono text-[#5b6678] uppercase tracking-wider mb-4">{col.title}</h5>
              <ul className="space-y-2">
                {col.items.map(item => (
                  <li key={item}><a href="#" className="text-sm text-[#8a94a6] hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-[#5b6678]">© 2026 Noyce · All rights reserved · Built with Code-OSS, Rust, and React</p>
          <div className="flex gap-3">
            <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noreferrer" className="text-[#5b6678] hover:text-white transition-colors">
              <Icon name="github" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ---- APP ----
export default function App() {
  return (
    <div className="relative min-h-screen bg-[#06080c] text-white">
      <Background />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Agents />
        <Hardware />
        <Compliance />
        <Graph />
        <Download />
      </main>
      <Footer />
    </div>
  )
}
