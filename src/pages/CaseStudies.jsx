import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import content from '../content/pages/caseStudies.json'
import { getIcon } from '../utils/iconMap'
import { getGradient, getCardHeader } from '../utils/styleMap'

export default function CaseStudies() {
  const {
    hero, caseStudiesSection, caseStudies,
    whitepapersSection, whitepapers, ctaBanner,
  } = content

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Case Studies & White Papers"
        description="Read how Invendis has deployed IIoT solutions for Nokia, American Tower, ATC India, and clients across 26 countries. Browse case studies and technical white papers."
        path="/case-studies"
      />

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: getGradient('crimson') }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-red-200 font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            {hero.eyebrow}
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            {hero.headline} <span className="text-red-200">{hero.headlineAccent}</span>
          </h1>
          <p className="text-red-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{caseStudiesSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            {caseStudiesSection.heading} <span className="text-brand-blue">{caseStudiesSection.headingAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map(({ style, sector, title, client, desc, resultNum, resultLabel }) => (
            <div key={title} className="rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="px-6 py-5 text-white" style={{ background: getCardHeader(style) }}>
                <p className="text-xs font-semibold opacity-80 mb-2 uppercase tracking-wider">{sector}</p>
                <h3 className="font-sora font-bold text-base leading-snug mb-3">{title}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/60 shrink-0" />
                  <span className="text-sm opacity-80">{client}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 bg-brand-light">
                <p className="text-brand-muted text-sm leading-relaxed flex-1 mb-5">{desc}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="font-sora font-bold text-3xl text-brand-blue shrink-0">{resultNum}</div>
                  <p className="text-xs text-brand-muted leading-snug">{resultLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* White Papers */}
      <section className="py-20 px-8 lg:px-16 bg-brand-light">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{whitepapersSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {whitepapersSection.heading} <span className="text-brand-blue">{whitepapersSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl">
            {whitepapersSection.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {whitepapers.map(({ icon, iconBg, title, desc }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-5 hover:shadow-md transition-all group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: getGradient(iconBg) }}
                >
                  <Icon size={20} strokeWidth={1.75} className="text-white" />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-3">{desc}</p>
                  <a
                    href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Document Request: ' + title)}`}
                    className="text-sm font-semibold text-brand-blue hover:text-brand-red transition-colors inline-flex items-center gap-1"
                  >
                    Request PDF <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div
          className="relative rounded-3xl px-12 py-16 text-center overflow-hidden"
          style={{ background: getGradient('ctaRed') }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <h2 className="font-sora text-3xl lg:text-4xl font-bold text-white mb-4">{ctaBanner.heading}</h2>
            <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
              {ctaBanner.description}
            </p>
            <Link
              to={ctaBanner.primaryTo}
              className="inline-flex items-center gap-2 bg-white text-brand-red font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              {ctaBanner.primaryLabel} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
