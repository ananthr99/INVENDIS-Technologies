import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CtaBanner from '../components/shared/CTABanner'
import content from '../content/pages/products.json'
import { getIcon } from '../utils/iconMap'
import { getGradient } from '../utils/styleMap'

export default function Products() {
  const {
    hero, hardwareSection, hardwareProducts,
    silboSection, silboProducts,
    softwareSection, softwarePlatforms,
    designPartnersSection, designPartners,
    ctaBanner,
  } = content

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: getGradient('navy') }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-3xl">
          <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            {hero.eyebrow}
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-2xl">
            {hero.description}
          </p>
          <Link
            to={hero.cta.to}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-sora font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            {hero.cta.label} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Invendis Hardware */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{hardwareSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {hardwareSection.heading} <span className="text-brand-blue">{hardwareSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl">{hardwareSection.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hardwareProducts.map(({ icon, badge, badgeRed, title, desc, tags }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="bg-brand-light rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badgeRed ? 'bg-brand-red' : 'bg-brand-blue'}`}>
                    <Icon size={22} strokeWidth={1.75} className="text-white" />
                  </div>
                  {badge && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeRed ? 'bg-red-100 text-brand-red' : 'bg-blue-100 text-brand-blue'}`}>
                      {badge}
                    </span>
                  )}
                </div>
                <h3 className="font-sora font-bold text-brand-text text-lg mb-2">{title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-full text-brand-muted font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* SILBO Section */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{silboSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {silboSection.heading} <span className="text-brand-blue">{silboSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl">{silboSection.description}</p>
        </div>

        <div
          className="relative rounded-2xl p-8 mb-10 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 100%)' }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
          <p className="relative text-blue-100 text-lg font-light leading-relaxed max-w-2xl">
            {silboSection.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {silboProducts.map(({ icon, title, desc }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="p-5 border border-gray-200 rounded-xl bg-brand-light hover:border-brand-blue hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-4 group-hover:bg-brand-blue transition-colors">
                  <Icon size={18} strokeWidth={1.75} className="text-brand-blue group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-sora font-semibold text-brand-text mb-2">{title}</h4>
                <p className="text-brand-muted text-xs leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Software Platforms */}
      <section className="py-20 px-8 lg:px-16 bg-brand-light">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{softwareSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {softwareSection.heading} <span className="text-brand-blue">{softwareSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl">{softwareSection.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwarePlatforms.map(({ icon, accent, title, desc }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-red'}`}>
                  <Icon size={20} strokeWidth={1.75} className="text-white" />
                </div>
                <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Design Partners */}
      <section className="py-16 px-8 lg:px-16 bg-white text-center">
        <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{designPartnersSection.eyebrow}</p>
        <h2 className="font-sora text-2xl font-bold text-brand-text mb-10">
          {designPartnersSection.heading} <span className="text-brand-blue">{designPartnersSection.headingAccent}</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {designPartners.map(name => (
            <div key={name} className="px-8 py-4 border border-gray-200 rounded-xl text-brand-muted font-sora font-semibold text-sm hover:border-brand-blue hover:text-brand-blue transition-colors">
              {name}
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        heading={ctaBanner.heading}
        description={ctaBanner.description}
        primaryLabel={ctaBanner.primaryLabel}
        primaryTo={ctaBanner.primaryTo}
        secondaryLabel={ctaBanner.secondaryLabel}
        secondaryTo={ctaBanner.secondaryTo}
      />

    </div>
  )
}
