import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import CtaBanner from '../components/shared/CTABanner'
import { useContent } from '../hooks/useContent'
import products from '../data/products'
import productImages from '../data/productImages'
import { getIcon } from '../utils/iconMap'
import { wifiLabel } from '../utils/productHelpers'

const base = import.meta.env.BASE_URL
const asset = p => base + p.replace(/^\//, '')

const SILBO_CATS = ['Router', 'Gateway', 'Switch']
const CAT_META = {
  Router:  { icon: 'signal',  desc: '4G/5G, dual-SIM, Wi-Fi 6, SD-WAN and outdoor variants' },
  Gateway: { icon: 'network', desc: 'RS485, RS232, DIO, AI inputs for industrial integration' },
  Switch:  { icon: 'box',     desc: 'Managed and unmanaged PoE switches, DIN rail mount' },
}

export default function Silbo() {
  const content = useContent('pages/silbo.json')
  const site = useContent('siteSettings.json')
  if (!content || !site) return <div className="min-h-screen" />

  const { aboutSection, capabilities, useCases, hero, latestLaunch, intelSection, categoriesSection, marketFit, partners, ctaBanner } = content

  const silboProducts = products.filter(p => SILBO_CATS.includes(p.cat))
  const latestProduct = products.find(p => p.id === latestLaunch.productId)
  const intelProducts = intelSection.productIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  const catCounts = Object.fromEntries(
    SILBO_CATS.map(cat => [cat, silboProducts.filter(p => p.cat === cat).length])
  )

  return (
    <div className="min-h-screen">
      <PageSEO
        title="SILBO — Industrial Networking"
        description="SILBO by Invendis: rugged industrial routers, gateways, and switches for telecom, SD-WAN, and IIoT deployments. 5G, Wi-Fi 6, Intel-powered edge compute."
        path="/silbo"
      />

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 50%, #02026b 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-4xl">
          <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-5">
            {hero.eyebrow}
          </p>
          <img
            src={asset(site.logos.silbo)}
            alt="SILBO"
            className="h-12 w-auto mb-6 brightness-0 invert"
          />
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={hero.primaryCta.to}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-sora font-semibold rounded-xl hover:bg-red-600 transition-colors"
            >
              {hero.primaryCta.label} <ArrowRight size={18} />
            </Link>
            <Link
              to={hero.secondaryCta.to}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-sora font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/10">
            {SILBO_CATS.map(cat => (
              <div key={cat}>
                <p className="font-sora text-3xl font-bold">{catCounts[cat]}+</p>
                <p className="text-blue-300 text-sm mt-0.5">{cat} models</p>
              </div>
            ))}
            <div>
              <p className="font-sora text-3xl font-bold">{silboProducts.length}+</p>
              <p className="text-blue-300 text-sm mt-0.5">Total products</p>
            </div>
          </div>
        </div>
      </section>

      {/* About + Capabilities */}
      <section className="py-14 px-8 lg:px-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-brand-blue font-sora text-sm font-semibold uppercase tracking-widest mb-3">
              {aboutSection.eyebrow}
            </p>
            <h2 className="font-sora text-4xl font-bold text-brand-text mb-5">
              {aboutSection.heading}
            </h2>
            <p className="text-brand-muted leading-relaxed">
              {aboutSection.description}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest">
              {capabilities.eyebrow}
            </p>
            {capabilities.items.map(({ icon, title, desc }) => {
              const Icon = getIcon(icon)
              return (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} strokeWidth={1.75} className="text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-brand-blue mb-1">{title}</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Latest Launch */}
      {latestProduct && (
        <section className="py-14 px-8 lg:px-16 bg-brand-light">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-brand-light rounded-2xl p-10 flex items-center justify-center" style={{ minHeight: '360px' }}>
              {productImages[latestProduct.id]?.[0] && (
                <img
                  src={productImages[latestProduct.id][0]}
                  alt={latestProduct.name}
                  className="max-h-64 w-auto object-contain"
                />
              )}
            </div>
            <div>
              <span className="inline-block bg-brand-red text-white text-xs font-sora font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                {latestLaunch.badge}
              </span>
              <p className="text-brand-blue font-sora text-sm font-semibold uppercase tracking-widest mb-2">
                {latestProduct.cat}
              </p>
              <h2 className="font-sora text-4xl font-bold text-brand-text mb-4">
                {latestProduct.name}
              </h2>
              <p className="text-brand-muted text-lg leading-relaxed mb-6">
                {latestLaunch.highlight}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  latestProduct.cellular_gen,
                  latestProduct.wifi !== 'none' ? wifiLabel(latestProduct.wifi) : null,
                  `${latestProduct.ports} Ports`,
                  latestProduct.rs485 ? 'RS485' : null,
                  latestProduct.rs232 ? 'RS232' : null,
                ].filter(Boolean).map(tag => (
                  <span key={tag} className="text-sm px-3 py-1.5 bg-brand-light border border-gray-200 rounded-full text-brand-text font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/products/product-selector/${latestProduct.id}`}
                state={{ noScroll: true }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-sora font-semibold rounded-xl hover:bg-blue-800 transition-colors"
              >
                View Full Specs <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Intel-Powered Edge Compute */}
      <section className="py-14 px-8 lg:px-16 bg-white">
        <div className="mb-8">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
            {intelSection.eyebrow}
          </p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {intelSection.heading}{' '}
            <span className="text-brand-blue">{intelSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl">{intelSection.description}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {intelProducts.map(product => (
            <Link
              key={product.id}
              to={`/products/product-selector/${product.id}`}
              state={{ noScroll: true }}
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              {productImages[product.id]?.[0] && (
                <div className="bg-brand-light rounded-xl p-3 mb-4 flex items-center justify-center h-28">
                  <img
                    src={productImages[product.id][0]}
                    alt={product.name}
                    className="max-h-20 w-auto object-contain"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-xs bg-blue-100 text-brand-blue font-semibold px-2 py-0.5 rounded-full">Intel</span>
                <span className="text-xs bg-gray-100 text-brand-muted px-2 py-0.5 rounded-full">{product.cellular_gen}</span>
              </div>
              <h3 className="font-sora font-bold text-brand-text text-sm mb-1">{product.name}</h3>
              <p className="text-brand-muted text-xs leading-relaxed line-clamp-2">{product.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-14 px-8 lg:px-16 bg-brand-light">
        <div className="mb-8">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
            {categoriesSection.eyebrow}
          </p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            {categoriesSection.heading}{' '}
            <span className="text-brand-blue">{categoriesSection.headingAccent}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SILBO_CATS.map(cat => {
            const Icon = getIcon(CAT_META[cat].icon)
            return (
              <div
                key={cat}
                className="rounded-2xl p-8 bg-brand-light border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center mb-5">
                  <Icon size={22} strokeWidth={1.75} className="text-white" />
                </div>
                <p className="font-sora text-4xl font-bold text-brand-blue mb-1">{catCounts[cat]}</p>
                <h3 className="font-sora text-xl font-bold text-brand-text mb-3">{cat}s</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">{CAT_META[cat].desc}</p>
                <Link
                  to="/products/product-selector"
                  className="inline-flex items-center gap-1.5 text-brand-blue font-sora font-semibold text-sm hover:gap-3 transition-all"
                >
                  Browse {cat}s <ArrowRight size={16} />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Market Fit */}
      <section className="py-14 px-8 lg:px-16 bg-white">
        <div className="mb-8">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
            {marketFit.eyebrow}
          </p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {marketFit.heading}{' '}
            <span className="text-brand-blue">{marketFit.headingAccent}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {marketFit.items.map(({ icon, title, desc }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="bg-white rounded-2xl p-7 border border-gray-100 flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} strokeWidth={1.75} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-14 px-8 lg:px-16 bg-brand-light">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
              {useCases.eyebrow}
            </p>
            <h2 className="font-sora text-3xl font-bold text-brand-text">
              {useCases.heading}{' '}
              <span className="text-brand-blue">{useCases.headingAccent}</span>
            </h2>
          </div>
          <Link
            to="/case-studies"
            className="hidden sm:inline-flex items-center gap-1.5 text-brand-blue font-sora font-semibold text-sm hover:gap-3 transition-all flex-shrink-0"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-8 px-8 lg:-mx-16 lg:px-16 snap-x snap-mandatory scrollbar-hide">
          {useCases.items.map(({ icon, sector, title, desc }) => {
            const Icon = getIcon(icon)
            return (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all flex flex-col flex-shrink-0 w-72 snap-start"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                  <Icon size={18} strokeWidth={1.75} className="text-brand-blue" />
                </div>
                <h3 className="font-sora font-bold text-brand-text text-sm mb-2 leading-snug">{title}</h3>
                <p className="text-brand-muted text-xs leading-relaxed flex-1">{desc}</p>
                <span className="mt-4 inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue">
                  {sector}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Technology Collaborations */}
      <section
        className="py-14 px-8 lg:px-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 50%, #02026b 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative">
          <div className="mb-8">
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
              {partners.eyebrow}
            </p>
            <h2 className="font-sora text-3xl font-bold text-white mb-3">
              {partners.heading} <span className="text-red-300">{partners.headingAccent}</span>
            </h2>
            <p className="text-blue-200 max-w-xl">{partners.description}</p>
          </div>
          <div className="flex flex-wrap gap-5">
            {partners.items.map(({ name, role }) => (
              <div
                key={name}
                className="bg-white/10 border border-white/20 rounded-2xl px-8 py-6 backdrop-blur-sm hover:bg-white/15 transition-colors min-w-[160px]"
              >
                <p className="font-sora text-2xl font-bold text-white mb-1">{name}</p>
                <p className="text-blue-300 text-sm">{role}</p>
              </div>
            ))}
          </div>
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
