import logoInvendis from '../../assets/invendis_logo.png'
import logoSilbo from '../../assets/silbo_logo.png'

const productLinks = [
  { label: 'iSense RMS Controller', to: '/products' },
  { label: 'Energy Meters',         to: '/products' },
  { label: 'SILBO Routers',         to: '/products' },
  { label: 'Industrial Gateways',   to: '/products' },
  { label: 'PizGloria Platform',    to: '/products' },
  { label: 'Mobile App',            to: '/products' },
]

const sectorLinks = [
  { label: 'Telecom Infrastructure', to: '/sectors' },
  { label: 'Solar & Renewables',     to: '/sectors' },
  { label: 'Smart Energy',           to: '/sectors' },
  { label: 'Industrial Networks',    to: '/sectors' },
  { label: 'ESG & Sustainability',   to: '/sectors' },
]

const companyLinks = [
  { label: 'About Us',     to: '/company' },
  { label: 'Our Journey',  to: '/company' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'White Papers', to: '/case-studies' },
  { label: 'Contact',      to: '/contact' },
]

import { Link } from 'react-router-dom'

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
  return (
    <footer className="bg-brand-blue border-t-4 border-brand-red">
      <div className="px-8 lg:px-16 pt-12 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-5 mb-5">
              <img
                src={logoInvendis}
                alt="Invendis Technologies"
                className="h-10 w-auto brightness-0 invert"
              />
              <img
                src={logoSilbo}
                alt="SILBO — An Invendis Product"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Industrial IoT hardware — routers, gateways, switches, and energy meters. Made in India.
            </p>
          </div>

          {/* Nav link groups */}
          <FooterLinkGroup title="Products" links={productLinks} />
          <FooterLinkGroup title="Sectors"  links={sectorLinks} />
          <FooterLinkGroup title="Company"  links={companyLinks} />

          {/* Contact Us — far right */}
          <div>
            <h4 className="font-sora font-bold text-xs text-brand-red uppercase tracking-widest mb-5">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:sales@invendis.com"
                className="text-sm text-white font-medium hover:text-white/80 transition-colors duration-200"
              >
                sales@invendis.com
              </a>
              <a
                href="tel:+916361509463"
                className="text-sm text-white font-medium hover:text-white/80 transition-colors duration-200"
              >
                +91 6361509463
              </a>
              <p className="text-sm text-white/55 leading-relaxed mt-1">
                No. 230, 1st Cross, 38th Main<br />
                BOOHBCS Layout, BTM 2nd Stage<br />
                Bangalore – 560 068
              </p>
              <div className="border-t border-white/15 pt-3 mt-1 flex flex-col gap-2">
                <a
                  href="https://www.invendis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  www.invendis.com
                </a>
                <a
                  href="https://www.silbonetworks.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  www.silbonetworks.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 mt-10 pt-6">
          <p className="text-xs text-white/45">
            © 2026 Invendis Technologies India Private Limited. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
