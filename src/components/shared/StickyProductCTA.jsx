import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../../hooks/useContent'

export default function StickyProductCTA() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const content = useContent('pages/home.json')
  const hero = content?.hero

  const excluded =
    pathname === '/products' ||
    pathname === '/silbo' ||
    pathname.startsWith('/products/product-selector')

  useEffect(() => {
    setVisible(false)
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (excluded || !hero) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-20 left-0 right-0 z-40 bg-brand-blue/95 backdrop-blur-md border-b border-white/10 px-8 lg:px-16 py-3 flex items-center justify-between gap-4 shadow-lg"
        >
          <p className="text-white/80 text-sm font-medium hidden sm:block">
            {hero.eyebrow}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Link
              to={hero.primaryCta.to}
              className="inline-flex items-center gap-1.5 bg-brand-red text-white text-sm font-sora font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              {hero.primaryCta.label} <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
