import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoInvendis from '../../assets/invendis_logo.png'
import logoSilbo from '../../assets/silbo_logo.png'
import logoMakeInIndia from '../../assets/MakeInIndia.png'

const navLinks = [
  { label: 'Home',         to: '/' },
  { label: 'Sectors',      to: '/sectors' },
  { label: 'Products',     to: '/products' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Company',      to: '/company' },
  { label: 'Contact',      to: '/contact'}
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-blue/10 shadow-sm">
      <div className="px-8 lg:px-16 h-20 flex items-center justify-between gap-8">

        {/* Left — Invendis logo + Make in India */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/" onClick={() => setOpen(false)}>
            <img src={logoInvendis} alt="Invendis Technologies" className="h-12 w-auto" />
          </Link>
          <img src={logoMakeInIndia} alt="Make in India" className="h-18 w-16" />
        </div>

        {/* Centre — desktop nav links */}
        <ul className="hidden md:flex items-center gap-2 list-none m-0 p-0 flex-1 justify-center">
          {navLinks.map(({ label, to }) => (
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
          <Link to="/products" className="hidden md:block">
            <img src={logoSilbo} alt="SILBO — An Invendis Product" className="h-10 w-auto" />
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
      {open && (
        <div className="md:hidden bg-white border-t border-brand-blue/10 px-8 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, to }) => (
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
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
