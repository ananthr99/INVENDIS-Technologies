import { Link } from 'react-router-dom'
import { ArrowRight, Globe } from 'lucide-react'

const stats = [
  { value: '150K+', label: 'Telecom sites deployed' },
  { value: '54',    label: 'Partner countries' },
  { value: '180+',  label: 'Team strength' },
]

const heroCards = [
  {
    title: 'Hardware Products',
    tags: [
      { label: 'Routers & Gateways',    accent: false },
      { label: 'iSense RMS Controller', accent: false },
      { label: 'Energy Meters',         accent: true  },
      { label: 'Protocol Converters',   accent: false },
      { label: 'Network Switches',      accent: false },
      { label: '5G Ready',              accent: true  },
    ],
  },
  {
    title: 'Software Platforms',
    tags: [
      { label: 'PizGloria RMS Platform', accent: false },
      { label: 'Mobile Apps',            accent: true  },
      { label: 'Utility Billing',        accent: false },
      { label: 'NMS · Cloud SaaS',       accent: false },
    ],
  },
  {
    title: 'Key Clients',
    tags: [
      { label: 'Nokia',               accent: false },
      { label: 'Ericsson',            accent: false },
      { label: 'American Tower',      accent: true  },
      { label: 'Infosys · Capgemini', accent: false },
    ],
  },
]

export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #05059b 0%, #1a1a8a 30%, #2a0a7a 55%, #ff5050 100%)',
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 70% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-8 lg:px-16 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <div>

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-7">
              <span className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
                <Globe size={13} className="text-white" />
              </span>
              <span className="text-sm text-white/90 font-medium">
                IIoT Solutions · 17+ Years · 26 Countries
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-sora text-4xl lg:text-[58px] font-extrabold text-white leading-[1.1] mb-6">
              Industrial IoT for a{' '}
              <span className="text-red-300">Smarter World</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-white/75 leading-relaxed font-light mb-10 max-w-xl">
              Invendis delivers end-to-end hardware, software, and managed services
              for telecom, energy, and industrial sectors — from Bangalore to 26 countries worldwide.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-brand-blue font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              >
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link
                to="/case-studies"
                className="inline-flex items-center gap-2 text-white font-sora font-semibold text-base px-7 py-3.5 rounded-xl border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                View Case Studies
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/10 border border-white/15 rounded-2xl px-5 py-5 backdrop-blur-sm"
                >
                  <div className="font-sora text-3xl font-extrabold text-white leading-none mb-1.5">
                    {value}
                  </div>
                  <div className="text-xs text-white/65 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: info cards ── */}
          <div className="hidden lg:flex flex-col gap-4">
            {heroCards.map(({ title, tags }) => (
              <div
                key={title}
                className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl px-6 py-5"
              >
                <p className="font-sora text-xs font-semibold text-white/55 uppercase tracking-widest mb-3">
                  {title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(({ label, accent }) => (
                    <span
                      key={label}
                      className={
                        'text-sm font-medium px-3.5 py-1.5 rounded-full border ' +
                        (accent
                          ? 'bg-brand-red/30 border-brand-red/40 text-white'
                          : 'bg-white/15 border-white/20 text-white')
                      }
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
