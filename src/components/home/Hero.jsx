import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContent } from '../../hooks/useContent'
import { getGradient } from '../../utils/styleMap'

function CountUp({ value, delay = 0 }) {
  const match = value.match(/^(\d+)(.*)/)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!match) return
    const target = parseInt(match[1], 10)
    const duration = 1400
    let raf
    const startTime = performance.now() + delay * 1000

    function tick(now) {
      if (now < startTime) { raf = requestAnimationFrame(tick); return }
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  if (!match) return <>{value}</>
  return <>{count}{match[2]}</>
}

export default function Hero() {
    const { data: content, loading } = useContent('pages/home.json', { withLoading: true })
  if (loading) return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden" style={{ background: getGradient('hero') }}>
      <div className="relative z-10 px-8 lg:px-16 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <div className="h-8 w-64 bg-white/15 rounded-full animate-pulse" />
            <div className="h-16 w-full bg-white/15 rounded-2xl animate-pulse" />
            <div className="h-6 w-3/4 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-6 w-1/2 bg-white/10 rounded-lg animate-pulse" />
            <div className="flex gap-4 mt-4">
              <div className="h-12 w-40 bg-white/20 rounded-xl animate-pulse" />
              <div className="h-12 w-40 bg-white/10 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white/10 rounded-2xl animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  
  const { hero } = content

  return (
    <section
      className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden"
      style={{ background: getGradient('hero') }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 70% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-8 lg:px-16 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <div>

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-7">
              <span className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
                <Globe size={13} className="text-white" />
              </span>
              <span className="text-sm text-white/90 font-medium">
                {hero.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-sora text-4xl lg:text-[58px] font-extrabold text-white leading-[1.1] mb-6">
              {hero.headline}{' '}
              <span className="text-red-300">{hero.headlineAccent}</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-white/75 leading-relaxed font-light mb-10 max-w-xl">
              {hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to={hero.primaryCta.to}
                className="inline-flex items-center gap-2 bg-white text-brand-blue font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              >
                {hero.primaryCta.label} <ArrowRight size={18} />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {hero.stats.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
                  className="bg-white/10 border border-white/15 rounded-2xl px-5 py-5 backdrop-blur-sm cursor-default"
                >
                  <div className="font-sora text-3xl font-extrabold text-white leading-none mb-1.5">
                    <CountUp value={value} delay={0.5 + i * 0.12} />
                  </div>
                  <div className="text-xs text-white/65 leading-snug">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: info cards ── */}
          <div className="hidden lg:flex flex-col gap-4">
            {hero.cards.map(({ title, tags }) => (
              <div
                key={title}
                className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl px-6 py-5"
              >
                <p className="font-sora text-xs font-semibold text-white/55 uppercase tracking-widest mb-3">
                  {title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(({ label, accent }) => (
                    <span
                      key={label}
                      className={
                        'text-sm font-medium px-3.5 py-1.5 rounded-full border ' +
                        (accent
                          ? 'bg-brand-red/30 border-brand-red/40 text-white'
                          : 'bg-white/15 border-white/20 text-white')
                      }
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
            </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/90 transition-colors duration-200"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} strokeWidth={1.5} />
      </motion.button>
    </section>
  )
}
