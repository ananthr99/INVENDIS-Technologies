import { Link } from 'react-router-dom'
import site from '../../content/siteSettings.json'

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
            <p className="text-sm text-white/60 leading-relaxed">
              {footer.tagline}
            </p>
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
        <div className="border-t border-white/15 mt-10 pt-6">
          <p className="text-xs text-white/45">
            {footer.copyright}
          </p>
        </div>

      </div>
    </footer>
  )
}
