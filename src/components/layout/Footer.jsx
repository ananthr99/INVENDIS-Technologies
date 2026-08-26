import { Link } from 'react-router-dom'
import { useContent } from '../../hooks/useContent'

const base = import.meta.env.BASE_URL
const asset = (path) => base + path.replace(/^\//, '')

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4 className="font-sora font-bold text-xs text-brand-red uppercase tracking-widest mb-5">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const { data: site, loading } = useContent('siteSettings.json', { withLoading: true })
  if (loading) return (
    <footer className="bg-brand-blue border-t-4 border-brand-red px-8 lg:px-16 pt-12 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
            <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </footer>
  )
  const { logos, footer, contact } = site

  return (
    <footer className="bg-brand-blue border-t-4 border-brand-red">
      <div className="px-8 lg:px-16 pt-12 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-5 mb-5">
              <img
                src={asset(logos.invendis)}
                alt="Invendis Technologies"
                className="h-10 w-auto brightness-0 invert"
              />
              <img
                src={asset(logos.silbo)}
                alt="SILBO — An Invendis Product"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              {footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/invendis"
                target="_blank"
                rel="noreferrer"
                aria-label="Invendis on LinkedIn"
                className="w-10 h-10 rounded-lg bg-[#0A66C2] hover:bg-[#0A66C2]/80 flex items-center justify-center text-white transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav link groups */}
          {footer.linkGroups.map(group => (
            <FooterLinkGroup key={group.title} title={group.title} links={group.links} />
          ))}

          {/* Contact Us — far right */}
          <div>
            <h4 className="font-sora font-bold text-xs text-brand-red uppercase tracking-widest mb-5">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="text-sm text-white font-medium hover:text-white/80 transition-colors duration-200"
              >
                {contact.email}
              </a>
              <a
                href={contact.phoneHref}
                className="text-sm text-white font-medium hover:text-white/80 transition-colors duration-200"
              >
                {contact.phone}
              </a>
              <p className="text-sm text-white/55 leading-relaxed mt-1">
                {contact.address}
              </p>
              <div className="border-t border-white/15 pt-3 mt-1 flex flex-col gap-2">
                {contact.websites.map(({ label, url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/45">
            {footer.copyright}
          </p>
          <div className="flex gap-5">
            <Link to="/privacy" className="text-xs text-white/45 hover:text-white/70 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-white/45 hover:text-white/70 transition-colors duration-200">
              Terms of Use
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
