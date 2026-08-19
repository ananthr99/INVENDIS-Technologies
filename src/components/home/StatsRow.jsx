import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useContent } from '../../hooks/useContent'

function parseValue(str) {
  const match = str.match(/^(\d+)(.*)$/)
  return match ? { num: parseInt(match[1], 10), suffix: match[2] } : { num: 0, suffix: str }
}

function AnimatedCounter({ value, className }) {
  const { num, suffix } = parseValue(value)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const display = useTransform(count, v => Math.round(v))

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
  const content = useContent('pages/home.json')
  if (!content) return null
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
