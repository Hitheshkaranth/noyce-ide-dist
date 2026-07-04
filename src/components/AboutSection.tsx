import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function AboutSection() {
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
            About Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
          >
            Pioneering{' '}
            <em className="italic text-white/60">ideas for</em>
            <br className="hidden md:block" />
            minds that{' '}
            <em className="italic text-white/60">create, build, and inspire.</em>
          </motion.h2>
        </div>
      </div>
    </section>
  )
}
