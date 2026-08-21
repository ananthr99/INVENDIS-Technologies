import { useState, useEffect } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import { useContent } from '../hooks/useContent'
import { getIcon } from '../utils/iconMap'
import { getGradient } from '../utils/styleMap'

const PROJ = geoNaturalEarth1().scale(153).translate([480, 250])
const PATH = geoPath(PROJ)

const INDIA_ID     = '356'
const INDIA_COORDS = [78.9, 20.6]

function WorldMap() {
  const servedData = useContent('servedCountries.json')
  const SERVED = servedData?.countries ?? []
  const servedSet = new Set(SERVED.map(c => c.id))
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}world-110m.json`)
      .then(r => r.json())
      .then(world => setCountries(feature(world, world.objects.countries).features))
      .catch(() => {})
  }, [])

  const indPt = PROJ(INDIA_COORDS)

  return (
    <svg viewBox="0 0 960 500" style={{ width: '100%', height: 'auto' }}>
      {countries.map(geo => (
        <path
          key={geo.id}
          d={PATH(geo) || ''}
          fill={
            String(geo.id) === INDIA_ID   ? '#05059b' :
            servedSet.has(String(geo.id)) ? '#ff5050' :
            '#dde3f0'
          }
          stroke="#ffffff"
          strokeWidth={0.5}
        />
      ))}
      {SERVED.map(({ name, coords }) => {
        const pt = PROJ(coords)
        return pt ? (
          <circle key={name} cx={pt[0]} cy={pt[1]} r={4} fill="#ff5050" stroke="#fff" strokeWidth={1} />
        ) : null
      })}
      {indPt && (
        <circle cx={indPt[0]} cy={indPt[1]} r={5.5} fill="#fff" stroke="#05059b" strokeWidth={2} />
      )}
    </svg>
  )
}

export default function Contact() {
  const content = useContent('pages/contact.json')
  const servedData = useContent('servedCountries.json')
  const [formState, setFormState] = useState({ name: '', company: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  if (!content) return <div className="min-h-screen" />
  const { hero, contactItems, quickFacts, form, mapSection } = content
  const SERVED = servedData?.countries ?? []

  function handleSubmit(e) {
    e.preventDefault()
    const { name, company, email, message } = formState
    const subject = encodeURIComponent(`Website enquiry from ${name}${company ? ` (${company})` : ''}`)
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nReply-to: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:sales@invendis.com?subject=${subject}&body=${body}`
    setStatus('success')
    setFormState({ name: '', company: '', email: '', message: '' })
  }

  const field    = key => e => setFormState(p => ({ ...p, [key]: e.target.value }))
  const inputCls = 'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors'

  return (
    <div>
      <PageSEO
        title="Contact Us"
        description="Contact Invendis Technologies for IIoT solutions, product demos, or partnership inquiries. Bangalore HQ, global presence in 54 countries. Email: sales@invendis.com"
        path="/contact"
      />

      {/* ── Hero ── */}
      <section
        className="relative py-20 px-8 lg:px-16 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #05059b 0%, #2929c8 60%, #3a3ad4 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <p className="font-sora text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
            {hero.eyebrow}
          </p>
          <h1 className="font-sora text-4xl lg:text-5xl font-bold mb-4">
            {hero.headline} <span className="text-brand-red">{hero.headlineAccent}</span>
          </h1>
          <p className="text-lg text-white/75 leading-relaxed max-w-xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* ── Contact info + Form ── */}
      <section className="py-16 px-8 lg:px-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Left — contact cards */}
          <div>
            <h2 className="font-sora text-2xl font-bold text-brand-text mb-6">Get In Touch</h2>
            <div className="space-y-5 mb-8">
              {contactItems.map(({ icon, color, label, content: itemContent, href }) => {
                const Icon = getIcon(icon)
                return (
                  <div key={label} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${color === 'red' ? 'bg-brand-red' : 'bg-brand-blue'} flex items-center justify-center shrink-0`}>
                      <Icon size={18} strokeWidth={1.75} className="text-white" />
                    </div>
                    <div>
                      <p className="font-sora font-semibold text-brand-text text-sm mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-brand-blue text-sm hover:underline">{itemContent}</a>
                      ) : (
                        <p className="text-brand-muted text-sm leading-relaxed">{itemContent}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="bg-brand-light rounded-2xl p-5">
              <p className="font-sora text-sm font-semibold text-brand-text mb-3">Quick Facts</p>
              <div className="flex flex-wrap gap-2">
                {quickFacts.map(f => (
                  <span key={f} className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-brand-muted border border-gray-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="font-sora text-2xl font-bold text-brand-text mb-6">{form.heading}</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-start gap-4 p-6 bg-green-50 border border-green-200 rounded-2xl">
                <CheckCircle size={32} className="text-green-600" />
                <div>
                  <p className="font-sora font-bold text-brand-text mb-1">Message sent!</p>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Thank you for reaching out. Our team will get back to you within 1–2 business days.
                  </p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-sm text-brand-blue hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                name="contact"
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">{form.nameLabel}</label>
                    <input
                      required name="name" value={formState.name} onChange={field('name')}
                      placeholder={form.namePlaceholder} className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">{form.companyLabel}</label>
                    <input
                      name="company" value={formState.company} onChange={field('company')}
                      placeholder={form.companyPlaceholder} className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1.5">{form.emailLabel}</label>
                  <input
                    required type="email" name="email" value={formState.email} onChange={field('email')}
                    placeholder={form.emailPlaceholder} className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1.5">{form.messageLabel}</label>
                  <textarea
                    required rows={5} name="message" value={formState.message} onChange={field('message')}
                    placeholder={form.messagePlaceholder}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 bg-brand-blue text-white font-sora font-bold text-sm px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                >
                  {status === 'sending' ? 'Sending…' : form.submitLabel}
                  {status !== 'sending' && <Send size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── World Map ── */}
      <section className="py-16 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
            {mapSection.eyebrow}
          </p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {mapSection.heading} <span className="text-brand-blue">{mapSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted text-base max-w-xl mx-auto">
            {mapSection.description.replace('{count}', SERVED.length)}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 lg:p-8 shadow-sm border border-gray-100">
          <WorldMap />
          <div className="flex flex-wrap gap-5 justify-center mt-2 pt-4 border-t border-gray-100 text-xs text-brand-muted">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-blue inline-block" />
              HQ — India
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-red inline-block" />
              Countries Served
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#dde3f0] border border-gray-200 inline-block" />
              Other regions
            </span>
          </div>
        </div>
      </section>

    </div>
  )
}
