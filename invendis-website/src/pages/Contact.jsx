import { useState, useEffect } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { Mail, Phone, Globe, Building2, Send } from 'lucide-react'

const PROJ = geoNaturalEarth1().scale(153).translate([480, 250])
const PATH = geoPath(PROJ)

const INDIA_ID     = '356'
const INDIA_COORDS = [78.9, 20.6]

const SERVED = [
  // Americas
  { name: 'Canada',              flag: '🇨🇦', coords: [-96,   60],    id: '124' },
  { name: 'USA',                 flag: '🇺🇸', coords: [-100,  38],    id: '840' },
  { name: 'Colombia',            flag: '🇨🇴', coords: [-74,    4],    id: '170' },
  // West Africa
  { name: 'Guinea-Bissau',       flag: '🇬🇼', coords: [-15.2, 11.8], id: '624' },
  { name: 'Guinea',              flag: '🇬🇳', coords: [-11.8, 11],   id: '324' },
  { name: 'Ivory Coast',         flag: '🇨🇮', coords: [-5.5,   7.5], id: '384' },
  { name: 'Liberia',             flag: '🇱🇷', coords: [-9.4,   6.4], id: '430' },
  { name: 'Ghana',               flag: '🇬🇭', coords: [-1.0,   8.0], id: '288' },
  { name: 'Benin',               flag: '🇧🇯', coords: [2.3,    9.3], id: '204' },
  { name: 'Nigeria',             flag: '🇳🇬', coords: [8.7,    9.0], id: '566' },
  { name: 'Cameroon',            flag: '🇨🇲', coords: [12.4,   5.7], id: '120' },
  { name: 'Congo (Brazzaville)', flag: '🇨🇬', coords: [15.2,  -0.7], id: '178' },
  // East & Southern Africa
  { name: 'Uganda',              flag: '🇺🇬', coords: [32.3,   1.3], id: '800' },
  { name: 'South Sudan',         flag: '🇸🇸', coords: [31.3,   7.0], id: '728' },
  { name: 'Sudan',               flag: '🇸🇩', coords: [30.2,  15.6], id: '729' },
  { name: 'Rwanda',              flag: '🇷🇼', coords: [29.9,  -1.9], id: '646' },
  { name: 'Zambia',              flag: '🇿🇲', coords: [27.8, -13.1], id: '894' },
  { name: 'Eswatini',            flag: '🇸🇿', coords: [31.5, -26.5], id: '748' },
  { name: 'Namibia',             flag: '🇳🇦', coords: [18.5, -22.0], id: '516' },
  { name: 'South Africa',        flag: '🇿🇦', coords: [25.0, -29.0], id: '710' },
  // Europe
  { name: 'Romania',             flag: '🇷🇴', coords: [24.9,  45.9], id: '642' },
  { name: 'Montenegro',          flag: '🇲🇪', coords: [19.4,  42.7], id: '499' },
  { name: 'Greece',              flag: '🇬🇷', coords: [21.8,  39.1], id: '300' },
  // Middle East & Central Asia
  { name: 'Yemen',               flag: '🇾🇪', coords: [47.6,  15.9], id: '887' },
  { name: 'Iran',                flag: '🇮🇷', coords: [53.7,  32.4], id: '364' },
  { name: 'Afghanistan',         flag: '🇦🇫', coords: [67.7,  33.9], id: '4'   },
  // South & Southeast Asia
  { name: 'Bangladesh',          flag: '🇧🇩', coords: [90.4,  23.7], id: '50'  },
  { name: 'Vietnam',             flag: '🇻🇳', coords: [108.3, 14.1], id: '704' },
  { name: 'Myanmar',             flag: '🇲🇲', coords: [96.9,  19.2], id: '104' },
  { name: 'Malaysia',            flag: '🇲🇾', coords: [109.7,  4.2], id: '458' },
  { name: 'Philippines',         flag: '🇵🇭', coords: [121.8, 12.9], id: '608' },
  { name: 'Indonesia',           flag: '🇮🇩', coords: [117.9, -2.5], id: '360' },
]

const servedSet = new Set(SERVED.map(c => c.id))

const CONTACT_ITEMS = [
  {
    Icon: Building2, color: 'bg-brand-blue',
    label: 'Headquarters',
    content: 'No 230, 1st Cross 36th Main, BCOMBCS Layout, BTM 2nd Stage, Bangalore – 560 068, India',
  },
  {
    Icon: Phone, color: 'bg-brand-blue',
    label: 'Phone',
    content: '+91 6361509463',
    href: 'tel:+916361509463',
  },
  {
    Icon: Mail, color: 'bg-brand-blue',
    label: 'Email',
    content: 'sales@invendis.com',
    href: 'mailto:sales@invendis.com',
  },
  {
    Icon: Globe, color: 'bg-brand-red',
    label: 'Foreign Office',
    content: 'Accra, Ghana (West Africa operations)',
  },
]

function WorldMap() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}world-110m.json`)
      .then(r => r.json())
      .then(world => setCountries(feature(world, world.objects.countries).features))
      .catch(console.error)
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
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })

  function handleSubmit(e) {
    e.preventDefault()
    const { name, company, email, message } = form
    const sub  = encodeURIComponent(`Enquiry from ${name}${company ? ` (${company})` : ''}`)
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\n${message}`)
    window.open(`mailto:sales@invendis.com?subject=${sub}&body=${body}`)
  }

  const field    = key => e => setForm(p => ({ ...p, [key]: e.target.value }))
  const inputCls = 'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors'

  return (
    <div>

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
            Contact Us
          </p>
          <h1 className="font-sora text-4xl lg:text-5xl font-bold mb-4">
            Let's Build Something <span className="text-brand-red">Together</span>
          </h1>
          <p className="text-lg text-white/75 leading-relaxed max-w-xl">
            Reach out to our team of IIoT experts. Whether it's a product enquiry, partnership,
            or a custom deployment — we're here to help.
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
              {CONTACT_ITEMS.map(({ Icon, color, label, content, href }) => (
                <div key={label} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={18} strokeWidth={1.75} className="text-white" />
                  </div>
                  <div>
                    <p className="font-sora font-semibold text-brand-text text-sm mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-brand-blue text-sm hover:underline">{content}</a>
                    ) : (
                      <p className="text-brand-muted text-sm leading-relaxed">{content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-brand-light rounded-2xl p-5">
              <p className="font-sora text-sm font-semibold text-brand-text mb-3">Quick Facts</p>
              <div className="flex flex-wrap gap-2">
                {['54+ Countries', 'Est. 2007', 'Bangalore HQ', 'ISO Certified', 'Make In India'].map(f => (
                  <span key={f} className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-brand-muted border border-gray-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="font-sora text-2xl font-bold text-brand-text mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1.5">Your Name *</label>
                  <input
                    required value={form.name} onChange={field('name')}
                    placeholder="John Doe" className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1.5">Company</label>
                  <input
                    value={form.company} onChange={field('company')}
                    placeholder="Your Company" className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Email Address *</label>
                <input
                  required type="email" value={form.email} onChange={field('email')}
                  placeholder="johndoe@company.com" className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Message *</label>
                <textarea
                  required rows={5} value={form.message} onChange={field('message')}
                  placeholder="Tell us about your project or requirements…"
                  className={`${inputCls} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-brand-blue text-white font-sora font-bold text-sm px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                Send Message <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── World Map ── */}
      <section className="py-16 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">
            Global Presence
          </p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            Countries <span className="text-brand-blue">We Serve</span>
          </h2>
          <p className="text-brand-muted text-base max-w-xl mx-auto">
            Invendis has deployed IIoT solutions across {SERVED.length}+ countries spanning
            Africa, the Middle East, Asia Pacific, and beyond.
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

        {/* Country flag chips
        <div className="mt-10">
          <h3 className="font-sora text-xs font-semibold uppercase tracking-widest text-brand-muted text-center mb-5">
            All Countries
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[{ name: 'India (HQ)', flag: '🇮🇳' }, ...SERVED].map(({ name, flag }) => (
              <div
                key={name}
                className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-100 hover:border-brand-blue/30 transition-colors"
              >
                <span className="text-lg leading-none">{flag}</span>
                <span className="text-xs font-medium text-brand-text truncate">{name}</span>
              </div>
            ))}
          </div>
        </div> */}
      </section>

    </div>
  )
}
