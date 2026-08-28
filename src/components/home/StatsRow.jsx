import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useContent } from '../../hooks/useContent'

function parseValue(str) {
  const match = str.match(/^(\d+\.?\d*)(.*)$/)
  return match ? { num: parseFloat(match[1]), suffix: match[2] } : { num: 0, suffix: str }
}

function AnimatedCounter({ value, className }) {
  const { num, suffix } = parseValue(value)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const decimals = Number.isInteger(num) ? 0 : 1
  const display = useTransform(count, v => decimals ? v.toFixed(decimals) : Math.round(v))
  
  useEffect(() => {
    if (inView) animate(count, num, { duration: 1.8, ease: 'easeOut' })
  }, [inView, count, num])

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>{suffix}
    </span>
  )
}

export default function StatsRow() {
    const { data: content, loading } = useContent('pages/home.json', { withLoading: true })
  if (loading) return (
    <section className="bg-brand-light py-4 border-y border-brand-blue/8">
      <div className="px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-brand-blue/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center py-12 px-6 flex flex-col items-center gap-3">
              <div className="h-16 w-32 bg-brand-blue/10 rounded-xl animate-pulse" />
              <div className="h-4 w-24 bg-brand-blue/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
  const { stats } = content

  return (
    <section className="bg-brand-light py-4 border-y border-brand-blue/8">
      <div className="px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-brand-blue/10">
          {stats.map(({ value, accent, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="text-center py-12 px-6"
            >
              <AnimatedCounter
                value={value}
                className={
                  'font-sora text-5xl lg:text-6xl font-extrabold leading-none mb-3 ' +
                  (accent === 'red' ? 'text-brand-red' : 'text-brand-blue')
                }
              />
              <p className="text-sm text-brand-muted leading-snug max-w-[200px] mx-auto">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
