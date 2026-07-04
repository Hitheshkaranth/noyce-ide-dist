import { useEffect, useRef, useState } from 'react'
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react'

const HERO_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'

function animateOpacity(el: HTMLElement, from: number, to: number, duration: number) {
  const startTime = performance.now()
  el.style.opacity = String(from)

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = from + (to - from) * progress
    el.style.opacity = String(current)
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

export default function Hero() {
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
    if (email) {
      console.log('Submitted:', email)
      setEmail('')
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        src={HERO_VIDEO_URL}
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
      />

      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Asme</span>
            <div className="hidden md:flex items-center gap-8 ml-8">
              <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Pricing</a>
              <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white text-sm font-medium cursor-pointer hover:text-white/80 transition-colors">Sign Up</span>
            <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8">
          Know it <em className="italic">all</em>
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
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </p>

        <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
          Manifesto
        </button>
      </div>

      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}
