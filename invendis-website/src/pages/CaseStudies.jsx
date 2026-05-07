import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Zap, Globe, Sun, BarChart3, Lock } from 'lucide-react'

const caseStudies = [
  {
    style: 'blue',
    sector: 'Telecom · Africa',
    title: 'Large-Scale Tower Monitoring for Major TowerCo – Africa',
    client: 'American Tower Corporation',
    desc: 'Deployed Invendis iSense RMS controllers across a large portfolio of towers in Sub-Saharan Africa, integrating generator monitoring, fuel management, rectifier parameters, and access control into a single unified platform.',
    resultNum: '40%',
    resultLabel: 'Reduction in unnecessary site visits through remote diagnostics',
  },
  {
    style: 'mix',
    sector: 'Telecom · India',
    title: 'Tower OA & Field Efficiency Platform – 70,000+ Sites',
    client: 'ATC India',
    desc: 'Invendis monitors tower operations for ATC India across 70,000+ towers. The solution includes process automation, real-time alarm ticketing, and a mobile field interface — driving significant operational efficiency gains.',
    resultNum: '70K+',
    resultLabel: 'Towers actively monitored on Invendis RMS Platform',
  },
  {
    style: 'red',
    sector: 'Telecom · Myanmar',
    title: 'Integrated Enterprise Operations – RMS + ERP + WO System',
    client: 'IGT Myanmar',
    desc: 'Invendis RMS integrated with AMS (ERP), ClickOnSite WO & TT System, and an Electronic Key System to create a fully automated operations ecosystem. Alarm-to-ticket creation is automatic, end-to-end.',
    resultNum: '100%',
    resultLabel: 'Automated alarm-to-ticket workflow with zero manual intervention',
  },
  {
    style: 'blue',
    sector: 'Telecom · Global',
    title: 'Global Frame Agreement for Tower Passive Asset Monitoring',
    client: 'Nokia',
    desc: "Nokia's global frame agreement for Invendis monitoring hardware and software covers tower passive assets across multiple regions. Invendis provides bespoke solutions aligned to Nokia's evolving requirements.",
    resultNum: 'Global',
    resultLabel: 'Multi-region deployment under a Strategic Global Agreement',
  },
  {
    style: 'mix',
    sector: 'Telecom · Saudi Arabia',
    title: '3-Year MFA for IIoT Networking Hardware – KSA',
    client: 'Major Client, Saudi Arabia (2025)',
    desc: 'Invendis signed a 3-year Master Framework Agreement in 2025 to supply industrial networking devices — routers, gateways, and switches — for a major telecommunications operator in the Kingdom of Saudi Arabia.',
    resultNum: '3 Yrs',
    resultLabel: 'Framework agreement for continuous hardware supply in KSA',
  },
  {
    style: 'red',
    sector: 'Technology · USA',
    title: 'Intel-Based Router Development for US Client',
    client: 'US Technology Client (2024)',
    desc: 'Invendis designed and delivered a custom Intel-based industrial router for a US technology client — demonstrating in-house hardware R&D capability for bespoke product design and OEM manufacturing.',
    resultNum: 'OEM',
    resultLabel: 'Custom Intel-based router designed and manufactured in-house',
  },
]

const cardHeader = {
  blue: 'linear-gradient(135deg, #05059b 0%, #2929c8 100%)',
  mix:  'linear-gradient(135deg, #05059b 0%, #cc2020 100%)',
  red:  'linear-gradient(135deg, #8a0000 0%, #ff5050 100%)',
}

const whitepapers = [
  {
    icon: FileText,
    iconBg: 'linear-gradient(135deg, #05059b, #2929c8)',
    title: 'Telecom RMS Architecture Guide',
    desc: 'A comprehensive guide to the Invendis Telecom Remote Monitoring Solution — covering architecture, data flows, RMS adapters, analytics layers, and integration with third-party systems.',
  },
  {
    icon: Zap,
    iconBg: 'linear-gradient(135deg, #cc2020, #ff5050)',
    title: 'iSense Gateway – Technical Datasheet',
    desc: 'Full technical specification for the iSense RMS Controller including hardware interfaces, firmware capabilities, communication protocols, and third-party equipment compatibility list.',
  },
  {
    icon: Globe,
    iconBg: 'linear-gradient(135deg, #05059b, #2929c8)',
    title: 'SILBO Industrial Networking Catalogue',
    desc: 'Complete product catalogue for the SILBO brand — routers, gateways, protocol converters, and switches — including specifications, environmental ratings, and deployment scenarios.',
  },
  {
    icon: Sun,
    iconBg: 'linear-gradient(135deg, #059669, #34d399)',
    title: 'Solar Monitoring Solution Brief',
    desc: "Overview of Invendis's solar monitoring platform — covering controller integration, anomaly detection algorithms, energy yield analytics, and billing module integration for renewable energy sites.",
  },
  {
    icon: BarChart3,
    iconBg: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    title: 'ESG & Energy Analytics White Paper',
    desc: 'How IIoT-enabled monitoring supports ESG target setting, carbon footprint measurement, and automated sustainability reporting for large telecom and industrial site portfolios.',
  },
  {
    icon: Lock,
    iconBg: 'linear-gradient(135deg, #cc2020, #8a0000)',
    title: 'ISO 27001 Security Framework',
    desc: "Overview of Invendis's information security management practices, covering secure data transmission, access control, and compliance with ISO/IEC 27001:2022 for remote monitoring systems.",
  },
]

export default function CaseStudies() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #8a0000 0%, #cc2020 50%, #ff5050 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-red-200 font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            Proven Impact
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            Case Studies & <span className="text-red-200">White Papers</span>
          </h1>
          <p className="text-red-100 text-lg leading-relaxed max-w-2xl">
            Real-world deployments, measurable outcomes, and technical insights from 17+ years of IIoT innovation across 26 countries.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Deployments</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            Case <span className="text-brand-blue">Studies</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map(({ style, sector, title, client, desc, resultNum, resultLabel }) => (
            <div key={title} className="rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="px-6 py-5 text-white" style={{ background: cardHeader[style] }}>
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
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Technical Resources</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            White Papers & <span className="text-brand-blue">Technical Notes</span>
          </h2>
          <p className="text-brand-muted max-w-xl">
            In-depth technical documentation, solution architectures, and industry insights from the Invendis engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {whitepapers.map(({ icon: Icon, iconBg, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-5 hover:shadow-md transition-all group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: iconBg }}
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div
          className="relative rounded-3xl px-12 py-16 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #8a0000 0%, #cc2020 60%, #ff5050 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <h2 className="font-sora text-3xl lg:text-4xl font-bold text-white mb-4">Want the Full Story?</h2>
            <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
              Request a detailed case study pack or speak to our team about your specific use case.
            </p>
            <Link
              to="/company"
              className="inline-flex items-center gap-2 bg-white text-brand-red font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Request Case Studies <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
