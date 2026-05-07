import { Link } from 'react-router-dom'
import {
  Monitor, Zap, Power, Box, Radio, Wrench,
  Signal, Globe, ArrowLeftRight, Network, Shield, Tv, Plug, Settings2,
  BarChart3, Smartphone, Receipt, Bell, TrendingUp, Cloud,
  ArrowRight
} from 'lucide-react'
import CtaBanner from '../components/shared/CtaBanner'

const hardwareProducts = [
  {
    icon: Monitor,
    badge: 'Flagship',
    badgeRed: false,
    title: 'iSense RMS Controller',
    desc: 'The heart of Invendis\'s telecom monitoring. Dual SIM, multi-protocol, modular design with 5G-ready architecture and pluggable RS485 cards.',
    tags: ['4G / 5G Ready', 'Modular', 'Linux OS', 'RS485 / RS232'],
  },
  {
    icon: Zap,
    badge: null,
    title: 'Multi-Function Energy Meters',
    desc: 'Tariff-grade smart meters for utility billing and industrial energy monitoring. Compatible with major DIN standards.',
    tags: ['Tariff Grade', 'Modbus', 'RS485'],
  },
  {
    icon: Power,
    badge: 'New',
    badgeRed: true,
    title: 'Smart ATS Controller',
    desc: 'Generator ATS control unit with digital output control, auto-switching logic, and remote visibility via RMS platform.',
    tags: ['DG Control', 'Relay Output', 'Remote'],
  },
  {
    icon: Box,
    badge: null,
    title: 'Telecom Gateways',
    desc: 'Packaged telecom site gateway solutions integrating monitoring, control, and communication in a single ruggedised enclosure.',
    tags: ['SNMP', 'Ethernet', 'DIN Rail'],
  },
  {
    icon: Radio,
    badge: null,
    title: 'GSM Energy Meter',
    desc: 'GSM-connected energy meter for remote monitoring of consumption at distributed utility and telecom sites.',
    tags: ['GSM/GPRS', 'Solar', 'Grid'],
  },
  {
    icon: Wrench,
    badge: null,
    title: 'Sensors & Accessories',
    desc: 'Surveillance cameras, environmental sensors, fuel sensors, BMS interfaces, and door/access control units for complete site visibility.',
    tags: ['CCTV', 'Fuel Sensors', 'BMS'],
  },
]

const silboProducts = [
  { icon: Signal,         title: 'Multi-WAN Router',     desc: '4G/5G, Wi-Fi 4/5/6, and dual-SIM with load balancing and VPN support for secure industrial connectivity.' },
  { icon: Globe,          title: 'Industrial Gateway',   desc: 'Edge computing gateways for data aggregation, local processing, and cloud connectivity at industrial sites.' },
  { icon: ArrowLeftRight, title: 'Protocol Converter',   desc: 'Modbus, DNP3, IEC, and SNMP protocol bridging for legacy equipment integration and industrial automation.' },
  { icon: Network,        title: 'Network Switch',       desc: 'Industrial managed and unmanaged Ethernet switches rated for -40°C to +75°C operating environments.' },
  { icon: Shield,         title: 'SD-WAN Gateway',       desc: 'Software-defined WAN with centralised management, traffic prioritisation, and zero-touch provisioning.' },
  { icon: Tv,             title: 'Cloud NMS',            desc: 'Centralised network management platform for monitoring, configuration, and troubleshooting SILBO devices remotely.' },
  { icon: Plug,           title: '4G Dongle',            desc: 'Compact plug-and-play 4G dongle for rapid deployment of cellular connectivity at remote industrial sites.' },
  { icon: Settings2,      title: 'Controllers',          desc: 'Programmable industrial controllers for automation, digital I/O, and site equipment management.' },
]

const softwarePlatforms = [
  { icon: BarChart3,   accent: 'blue', title: 'PizGloria RMS Platform',      desc: 'Cloud-based Remote Monitoring System with graphical site views, executive dashboards, energy analytics, and Power BI integration. Deployed for telecom and solar customers globally.' },
  { icon: Smartphone,  accent: 'red',  title: 'Mobile App',                   desc: 'Field operations mobile application for real-time alarm acknowledgment, site visits, trouble ticketing, and manager-level executive views — iOS and Android.' },
  { icon: Receipt,     accent: 'blue', title: 'Utility Billing Platform',     desc: 'End-to-end energy utility billing solution with meter data management, tariff configuration, invoice generation, and customer portal.' },
  { icon: Bell,        accent: 'red',  title: 'Alarm & Notification Engine',  desc: 'Automated escalation matrix delivering SMS, email, and push notifications based on configurable alarm thresholds and SLA windows.' },
  { icon: TrendingUp,  accent: 'blue', title: 'Analytics & Reporting',        desc: 'Backend analytics layer with customised algorithms for predictive maintenance, energy anomaly detection, and executive KPI reporting via Power BI.' },
  { icon: Cloud,       accent: 'red',  title: 'NMS – Network Management',     desc: 'Centralised network management system for SILBO devices, providing configuration management, performance monitoring, and fault management.' },
]

const designPartners = ['MediaTek', 'Intel', 'Qualcomm', 'Realtek', 'Renesas']

export default function Products() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 60%, #1a1aff 100%)' }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-3xl">
          <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            Hardware · Software · Services
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            Our <span className="text-red-300">Products</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-2xl">
            A complete portfolio of industrial-grade hardware, software platforms, and managed services — all designed and built in-house at our Bangalore R&D centre.
          </p>
          <Link
            to="/products/product-selector"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-sora font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            Product Selector <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Invendis Hardware */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Hardware Products</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            Invendis <span className="text-brand-blue">Hardware Portfolio</span>
          </h2>
          <p className="text-brand-muted max-w-xl">Rugged, industrial-grade devices designed for reliability in demanding field environments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hardwareProducts.map(({ icon: Icon, badge, badgeRed, title, desc, tags }) => (
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
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* SILBO Section */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">An Invendis Brand</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            SILBO <span className="text-brand-blue">Networking Products</span>
          </h2>
          <p className="text-brand-muted max-w-xl">Industrial networking hardware for mission-critical industrial and telecom environments.</p>
        </div>

        <div
          className="relative rounded-2xl p-8 mb-10 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 100%)' }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
          <p className="relative text-blue-100 text-lg font-light leading-relaxed max-w-2xl">
            SILBO is Invendis's dedicated industrial networking brand — delivering rugged routers, gateways, protocol converters, and switches purpose-built for Industry 4.0 connectivity challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {silboProducts.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 border border-gray-200 rounded-xl bg-brand-light hover:border-brand-blue hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-4 group-hover:bg-brand-blue transition-colors">
                <Icon size={18} strokeWidth={1.75} className="text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-sora font-semibold text-brand-text mb-2">{title}</h4>
              <p className="text-brand-muted text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Software Platforms */}
      <section className="py-20 px-8 lg:px-16 bg-brand-light">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Proprietary Software</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            Software <span className="text-brand-blue">Platforms</span>
          </h2>
          <p className="text-brand-muted max-w-xl">Cloud-based and on-premise platforms for monitoring, analytics, and operations management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwarePlatforms.map(({ icon: Icon, accent, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-red'}`}>
                <Icon size={20} strokeWidth={1.75} className="text-white" />
              </div>
              <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design Partners */}
      <section className="py-16 px-8 lg:px-16 bg-white text-center">
        <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">Design Partners</p>
        <h2 className="font-sora text-2xl font-bold text-brand-text mb-10">
          Built with <span className="text-brand-blue">Industry-Leading Silicon</span>
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
        heading="Find the Right Hardware for Your Deployment"
        description="Use our interactive Product Selector to filter, compare, and download datasheets for every SILBO and Invendis device."
        primaryLabel="Open Product Selector"
        primaryTo="/products/product-selector"
        secondaryLabel="Contact Sales"
        secondaryTo="/company"
      />

    </div>
  )
}
