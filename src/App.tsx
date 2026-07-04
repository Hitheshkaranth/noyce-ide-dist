import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Instagram, Twitter, Globe, ArrowUpRight } from 'lucide-react'

// ---- VIDEO URLs ----
const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'
const FEATURED_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4'
const PHILOSOPHY_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4'
const STRATEGY_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'
const CRAFT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4'

// ---- ANIMATE OPACITY ----
function animateOpacity(el: HTMLElement, from: number, to: number, duration: number) {
  const startTime = performance.now()
  el.style.opacity = String(from)

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = from + (to - from) * progress
    el.style.opacity = String(current)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// ---- HERO ----
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener('canplay', () => {
      video.play().catch(() => {})
      animateOpacity(video, 0, 1, 500)
    })

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return
      const remaining = video.duration - video.currentTime
      if (remaining <= 0.55 && remaining > 0.5) {
        const currentOpacity = parseFloat(video.style.opacity || '1')
        animateOpacity(video, currentOpacity, 0, 500)
      }
    })

    video.addEventListener('ended', () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        animateOpacity(video, 0, 1, 500)
      }, 100)
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribed:', email)
    setEmail('')
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        src={HERO_VIDEO}
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
      />

      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons_resources/icon.svg" alt="Noyce IDE" className="w-8 h-8" />
            <span className="text-white font-semibold text-lg hidden sm:block">Noyce IDE</span>
            <div className="hidden md:flex items-center gap-8 ml-8">
              <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="#philosophy" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Philosophy</a>
              <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noreferrer" className="text-white text-sm font-medium hover:text-white/80 transition-colors hidden sm:block">GitHub</a>
            <a href="#download" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Download
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 className="font-['Instrument_Serif'] text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8">
          Build it <em className="italic">right.</em>
        </h1>

        <form onSubmit={handleSubmit} className="max-w-xl w-full mb-6">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-sm"
            />
            <button type="submit" className="bg-white rounded-full p-3 text-black flex-shrink-0 hover:bg-white/90 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-white text-sm leading-relaxed px-4 mb-6 max-w-md">
          The AI-native IDE for safety-critical embedded firmware. DO-178C, ISO 26262, and MISRA evidence built in.
        </p>

        <a href="#philosophy" className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
          Learn More
        </a>
      </div>

      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}

// ---- ABOUT SECTION ----
function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="about"
      className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden"
    >
      <div className="bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]">
        <div className="max-w-6xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-sm tracking-widest uppercase block mb-6"
          >
            About Noyce IDE
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Instrument_Serif'] text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
          >
            Engineering firmware{' '}
            <em className="italic text-white/60">for minds that</em>
            <br className="hidden md:block" />
            <em className="italic text-white/60">create, build, and certify.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 text-white/60 text-lg max-w-2xl leading-relaxed"
          >
            Modern safety-critical firmware work is fragmented across requirements managers, static analyzers, traceability matrices, CI dashboards, AI assistants, and a stack of vendor IDEs. Noyce IDE collapses all of that into one Code-OSS workbench.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

// ---- FEATURED VIDEO SECTION ----
function FeaturedVideoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="features"
      className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9 }}
          className="rounded-3xl overflow-hidden aspect-video relative"
        >
          <video
            className="w-full h-full object-cover"
            src={FEATURED_VIDEO}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end">
              <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
                <span className="text-white/50 text-xs tracking-widest uppercase block mb-3">
                  Hardware-Aware Editing
                </span>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  Pin maps, peripheral registers, RTOS thread state, schematic views, signal/protocol decoders. Bring requirements, code, certification evidence, hardware tooling, and a multi-agent AI pipeline into one workbench.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Explore Features
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ---- PHILOSOPHY SECTION ----
function PhilosophySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="philosophy"
      className="bg-black py-28 md:py-40 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="font-['Instrument_Serif'] text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Compliance{' '}
          <em className="italic text-white/40">x</em>{' '}
          Automation
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <video
              className="w-full h-full object-cover"
              src={PHILOSOPHY_VIDEO}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="text-white/40 text-xs tracking-widest uppercase block mb-4">
                Certification Evidence Built-In
              </span>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                DO-178C Table A objectives, MISRA rule decoding, MC/DC coverage, immutable audit trail. Each objective routes to its specialist agent — System Designer, Test Engineer, Compliance Reviewer — to generate the artifact.
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div>
              <span className="text-white/40 text-xs tracking-widest uppercase block mb-4">
                A 755-Tool Static Analysis Catalog
              </span>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Browse the vendored analysis-tools-dev catalog filtered to your stack, run a curated executable subset—cppcheck, clang-tidy, ESLint, Ruff, ShellCheck—and apply MISRA single-exit auto-fixes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ---- SERVICES SECTION ----
function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const services = [
    {
      video: STRATEGY_VIDEO,
      tag: 'AI Orchestrator',
      title: 'Multi-Agent Pipeline',
      description: 'System designer, coder, reviewer, tester, doc generator, traceability monitor—each with its own configurable model provider. Generated objectives sync straight into the AI Orchestrator kanban.',
    },
    {
      video: CRAFT_VIDEO,
      tag: 'Compliance',
      title: 'DO-178C & ISO 26262',
      description: 'Requirements linked, design evidence, verification evidence, and open static-analysis findings—all derived live from the active project. Export a one-click DO-178C evidence pack.',
    },
  ]

  return (
    <section
      ref={ref}
      id="services"
      className="bg-black py-28 md:py-40 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <h2 className="font-['Instrument_Serif'] text-3xl md:text-5xl text-white tracking-tight">
            What Noyce Does
          </h2>
          <span className="hidden md:block text-white/40 text-sm">
            Core Features
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.15 * (index + 1) }}
              className="liquid-glass rounded-3xl overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden">
                <video
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={service.video}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/40 text-xs tracking-widest uppercase">
                    {service.tag}
                  </span>
                  <span className="liquid-glass rounded-full p-2">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </div>
                <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-semibold">
                  {service.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 md:mt-16"
        >
          <div className="liquid-glass rounded-3xl p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <span className="text-white/40 text-xs tracking-widest uppercase block mb-4">
                  Hardware Support
                </span>
                <p className="text-white/70 text-base leading-relaxed">
                  STM32, TI Tiva, Microchip PIC32, Raspberry Pi RP2040, NXP i.MX RT, and generic Cortex-M. Pin-aware editing, SVD-driven peripheral registers, RTOS task viewer, debug probe panel.
                </p>
              </div>
              <div>
                <span className="text-white/40 text-xs tracking-widest uppercase block mb-4">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {['React 18', 'TypeScript 5.6', 'Vite 5', 'Tailwind 3', 'Code-OSS', 'Electron', 'Rust Sidecar', 'Monaco', 'D3.js'].map(tech => (
                    <span key={tech} className="liquid-glass rounded-full px-3 py-1 text-white/60 text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ---- DOWNLOAD SECTION ----
function DownloadSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const platforms = [
    { os: 'macOS', status: 'Released', arch: 'arm64', size: '142 MB', cmd: 'brew install --cask noyce-ide' },
    { os: 'Windows', status: 'Beta', arch: 'x64', size: '168 MB', cmd: 'winget install Noyce.IDE' },
    { os: 'Linux', status: 'Roadmap', arch: 'AppImage', size: 'Coming Q3', cmd: 'flatpak install dev.noyce.IDE' },
  ]

  return (
    <section
      ref={ref}
      id="download"
      className="bg-black py-28 md:py-40 px-6 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="font-['Instrument_Serif'] text-4xl md:text-6xl text-white tracking-tight mb-6"
        >
          Get Noyce IDE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/60 text-lg mb-12 max-w-2xl mx-auto"
        >
          Free during beta. macOS arm64 ships today, Windows is in beta, and Linux is on the roadmap.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.os}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: 0.15 * (index + 1) }}
              className="liquid-glass rounded-2xl p-6 text-center"
            >
              <div className="text-2xl font-semibold text-white mb-2">{platform.os}</div>
              <div className={`text-xs font-medium mb-4 ${platform.status === 'Released' ? 'text-green-400' : platform.status === 'Beta' ? 'text-yellow-400' : 'text-blue-400'}`}>
                {platform.status}
              </div>
              <div className="text-white/40 text-sm mb-4">{platform.arch} · {platform.size}</div>
              <div className="bg-black/50 rounded-lg px-3 py-2 text-xs font-mono text-white/60 mb-4">
                $ {platform.cmd}
              </div>
              <button className="w-full bg-white text-black rounded-full py-3 text-sm font-medium hover:bg-white/90 transition-colors">
                {platform.status === 'Roadmap' ? 'Notify Me' : `Download`}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- FOOTER ----
function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/icons_resources/icon.svg" alt="Noyce IDE" className="w-8 h-8" />
            <span className="text-white font-semibold">Noyce IDE</span>
            <span className="text-white/40 text-sm">v1.0.7</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/Hitheshkaranth/noyce_ide" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white text-sm transition-colors">
              GitHub
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Documentation
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Changelog
            </a>
          </div>

          <div className="text-white/40 text-sm">
            © 2026 Noyce IDE. Built for engineers who ship firmware that has to be right.
          </div>
        </div>
      </div>
    </footer>
  )
}

// ---- APP ----
export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
      <DownloadSection />
      <Footer />
    </div>
  )
}
