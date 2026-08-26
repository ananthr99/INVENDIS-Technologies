import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

const base = import.meta.env.BASE_URL
const asset = (path) => base + path.replace(/^\//, '')

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: site, loading } = useContent('siteSettings.json', { withLoading: true })
  if (loading) return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/95 backdrop-blur-md border-b border-brand-blue/10 shadow-sm">
      <div className="px-8 lg:px-16 h-20 flex items-center justify-between gap-8">
        <div className="h-10 w-36 bg-brand-blue/10 rounded-lg animate-pulse" />
        <div className="hidden md:flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-brand-blue/10 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-20 bg-brand-blue/10 rounded-lg animate-pulse hidden md:block" />
      </div>
    </nav>
  )
  const { logos, nav } = site

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-blue/10 shadow-sm">
      <div className="px-8 lg:px-16 h-20 flex items-center justify-between gap-8">

        {/* Left — Invendis logo + Make in India */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/" onClick={() => setOpen(false)}>
            <img src={asset(logos.invendis)} alt="Invendis Technologies" className="h-12 w-auto" loading="eager" decoding="sync" />
          </Link>
          <img src={asset(logos.makeInIndia)} alt="Make in India" className="h-10 w-auto" loading="eager" decoding="sync" />
        </div>

        {/* Centre — desktop nav links */}
        <ul className="hidden md:flex items-center gap-2 list-none m-0 p-0 flex-1 justify-center">
          {nav.links.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  'text-lg font-medium px-5 py-2 rounded-lg transition-colors duration-200 ' +
                  (isActive
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-brand-text hover:bg-brand-blue/10 hover:text-brand-blue')
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right — SILBO logo + mobile hamburger */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/silbo" className="hidden md:block">
            <img src={asset(logos.silbo)} alt="SILBO — An Invendis Product" className="h-10 w-auto" loading="eager" decoding="sync" />
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-brand-text hover:bg-brand-light transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="md:hidden bg-white border-t border-brand-blue/10 px-8 py-4 flex flex-col gap-1"
        >
          {nav.links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                'block text-base font-medium px-4 py-3 rounded-lg transition-colors duration-200 ' +
                (isActive
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'text-brand-text hover:bg-brand-light')
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 text-center bg-brand-blue text-white text-base font-semibold px-4 py-3 rounded-lg"
          >
            {nav.contactCta}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
    </nav>
  )
}
