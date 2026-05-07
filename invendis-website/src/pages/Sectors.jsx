import { Radio, Sun, Zap, Cpu, Leaf, Globe } from 'lucide-react'
import CtaBanner from '../components/shared/CtaBanner'

const sectors = [
  {
    icon: Radio,
    iconBg: 'linear-gradient(135deg, #05059b, #2929c8)',
    featured: true,
    chip: 'Core Vertical',
    title: 'Telecom Tower Infrastructure',
    desc: "Invendis's flagship vertical with 150,000+ sites deployed across Africa, the Middle East, and South & Southeast Asia. Our end-to-end telecom OA solution covers passive infrastructure monitoring, energy management, battery optimisation, and predictive maintenance.",
    solutions: [
      'Remote Monitoring (RMS)', 'Battery & Rectifier Optimisation',
      'Power Source Management', 'Site Visit Efficiency',
      'Energy Measurement & Billing', 'Equipment Performance Prediction',
    ],
    clients: 'Nokia · Ericsson · American Tower · Airtel · Helios Towers',
  },
  {
    icon: Sun,
    iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    title: 'Solar & Renewable Energy',
    desc: 'Comprehensive solar monitoring with real-time data on generation, consumption, and anomaly detection. Launched in 2016 with ongoing deployments for telecom and utility clients.',
    solutions: ['Solar Controller Monitoring', 'Anomaly Detection', 'Energy Analytics'],
  },
  {
    icon: Zap,
    iconBg: 'linear-gradient(135deg, #05059b, #2929c8)',
    alt: true,
    title: 'Smart Energy & Utilities',
    desc: 'Smart metering, tariff-grade energy measurement, and utility billing platforms for distribution companies and industrial consumers.',
    solutions: ['Smart Energy Meters', 'Generator ATS Control', 'Utility Billing Platform', 'Energy Monitoring'],
  },
  {
    icon: Cpu,
    iconBg: 'linear-gradient(135deg, #059669, #34d399)',
    title: 'Edge Compute & Industrial Networks',
    desc: 'Industrial networking solutions for edge computation, protocol bridging, and secure connectivity — including 4G/5G routers, SD-WAN, and Modbus/DNP3 converters.',
    solutions: ['Multi-WAN Routers', 'SD-WAN Gateways', 'Protocol Converters', 'Cloud NMS'],
  },
  {
    icon: Leaf,
    iconBg: 'linear-gradient(135deg, #05059b, #2929c8)',
    alt: true,
    title: 'ESG & Sustainability',
    desc: 'Enabling customers to meet ESG targets through real-time energy monitoring, carbon tracking, and automated sustainability reporting across large site portfolios.',
    solutions: ['Carbon Footprint Tracking', 'ESG Reporting', 'Energy Efficiency Analytics'],
  },
]

const regions = [
  {
    title: 'Africa',
    countries: 'Nigeria, Ghana, Tanzania, Niger, Malawi, Kenya, South Africa',
  },
  {
    title: 'Middle East',
    countries: 'Oman, Qatar, Saudi Arabia',
  },
  {
    title: 'South & SE Asia',
    countries: 'India, Bangladesh, Sri Lanka, Myanmar, Malaysia, Indonesia, Philippines',
  },
]

export default function Sectors() {
  const featured = sectors[0]
  const rest = sectors.slice(1)

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 60%, #1a1aff 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            Industries We Serve
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            Sector <span className="text-red-300">Solutions</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl">
            From telecom towers to smart energy — Invendis delivers purpose-built IIoT solutions across multiple industrial verticals with proven global deployments.
          </p>
        </div>
      </section>

      {/* Sector Cards */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="space-y-6">

          {/* Featured card */}
          <div className="bg-brand-light rounded-2xl border border-gray-100 p-8 flex flex-col lg:flex-row gap-8 hover:shadow-lg transition-all">
            <div className="shrink-0">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: featured.iconBg }}
              >
                <featured.icon size={28} strokeWidth={1.75} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <span className="inline-block text-xs font-semibold font-sora px-3 py-1 bg-brand-blue text-white rounded-full mb-3">
                {featured.chip}
              </span>
              <h3 className="font-sora font-bold text-2xl text-brand-text mb-3">{featured.title}</h3>
              <p className="text-brand-muted leading-relaxed mb-5">{featured.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {featured.solutions.map(s => (
                  <span key={s} className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-brand-text font-medium">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-sm text-brand-muted">
                Key clients: <strong className="text-brand-text">{featured.clients}</strong>
              </p>
            </div>
          </div>

          {/* Regular cards 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map(({ icon: Icon, iconBg, alt, title, desc, solutions }) => (
              <div
                key={title}
                className={`rounded-2xl border p-7 hover:shadow-lg hover:-translate-y-1 transition-all
                  ${alt ? 'bg-brand-blue text-white border-transparent' : 'bg-brand-light border-gray-100'}`}
              >
                <div
                  className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: alt ? 'rgba(255,255,255,0.15)' : iconBg }}
                >
                  <Icon size={22} strokeWidth={1.75} className="text-white" />
                </div>
                <h3 className={`font-sora font-bold text-xl mb-3 ${alt ? 'text-white' : 'text-brand-text'}`}>
                  {title}
                </h3>
                <p className={`text-sm leading-relaxed mb-5 ${alt ? 'text-blue-200' : 'text-brand-muted'}`}>
                  {desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {solutions.map(s => (
                    <span
                      key={s}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium
                        ${alt ? 'bg-white/10 text-blue-100 border border-white/20' : 'bg-white border border-gray-200 text-brand-text'}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section
        className="py-20 px-8 lg:px-16"
        style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 100%)' }}
      >
        <div className="text-center mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Global Reach</p>
          <h2 className="font-sora text-3xl font-bold text-white mb-3">
            Present in <span className="text-red-300">54 Countries</span>
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Partner ecosystem spanning Africa, Middle East, South & Southeast Asia, and North America.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {regions.map(({ title, countries }) => (
            <div
              key={title}
              className="rounded-2xl p-7 text-center"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Globe size={22} strokeWidth={1.75} className="text-blue-200" />
              </div>
              <h3 className="font-sora font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-blue-300 text-sm leading-relaxed">{countries}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        heading="Solving Challenges in Your Industry?"
        description="Let's discuss how Invendis can tailor a solution for your specific sector requirements."
        primaryLabel="Talk to an Expert"
        primaryTo="/company"
        secondaryLabel="View Products"
        secondaryTo="/products"
      />

    </div>
  )
}
