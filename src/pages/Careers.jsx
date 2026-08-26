import { ArrowRight, MapPin, Briefcase, Clock } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import { useContent } from '../hooks/useContent'
import { getIcon } from '../utils/iconMap'
import { getGradient } from '../utils/styleMap'

const accentStyles = {
  blue:   { icon: 'text-brand-blue',  bg: 'bg-brand-blue/10'  },
  green:  { icon: 'text-emerald-600', bg: 'bg-emerald-50'     },
  purple: { icon: 'text-violet-600',  bg: 'bg-violet-50'      },
  amber:  { icon: 'text-amber-600',   bg: 'bg-amber-50'       },
}

const deptColors = {
  'Engineering':          'bg-brand-blue/10 text-brand-blue',
  'Sales & Applications': 'bg-emerald-50 text-emerald-700',
  'Operations':           'bg-amber-50 text-amber-700',
}

function PerkCard({ icon, accent, title, description }) {
  const Icon = getIcon(icon)
  const style = accentStyles[accent] || accentStyles.blue
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${style.bg}`}>
        <Icon size={20} strokeWidth={1.75} className={style.icon} />
      </div>
      <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
      <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function JobCard({ title, department, location, type, description, skills }) {
  const subject = encodeURIComponent(`Application: ${title}`)
  const body = encodeURIComponent(`Hi Invendis team,\n\nI would like to apply for the ${title} position.\n\nPlease find my CV attached.\n\nThank you.`)
  const href = `mailto:careers@invendis.com?subject=${subject}&body=${body}`

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${deptColors[department] || 'bg-gray-100 text-gray-600'}`}>
            {department}
          </span>
          <h3 className="font-sora font-bold text-lg text-brand-text">{title}</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-brand-muted mb-4">
        <span className="flex items-center gap-1"><MapPin size={12} />{location}</span>
        <span className="flex items-center gap-1"><Briefcase size={12} />{type}</span>
      </div>

      <p className="text-brand-muted text-sm leading-relaxed mb-5 flex-1">{description}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {skills.map(skill => (
          <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-brand-light text-brand-text border border-gray-200">
            {skill}
          </span>
        ))}
      </div>

      <a
        href={href}
        className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
      >
        Apply for this role <ArrowRight size={14} />
      </a>
    </div>
  )
}

export default function Careers() {
    const { data: content, loading } = useContent('pages/careers.json', { withLoading: true })
  if (loading) return (
    <div className="min-h-screen">
      <div className="h-64 animate-pulse" style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 100%)' }}>
        <div className="px-8 lg:px-16 py-24 flex flex-col gap-4 max-w-3xl">
          <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
          <div className="h-10 w-2/3 bg-white/20 rounded-xl animate-pulse" />
          <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-16 px-8 lg:px-16 bg-white flex flex-col gap-4 max-w-4xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-brand-light rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )

  const { hero, cultureSection, perks, openingsSection, openings, noOpeningsMessage, ctaBanner } = content

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Careers"
        description="Join the Invendis engineering team and build Industrial IoT hardware that powers telecom towers, solar farms, and smart infrastructure across 26 countries."
        path="/careers"
      />

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: getGradient('navy') }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-blue-200 font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            {hero.eyebrow}
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            {hero.headline} <span className="text-blue-300">{hero.headlineAccent}</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Culture / Why Invendis */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{cultureSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-4">
            {cultureSection.heading} <span className="text-brand-blue">{cultureSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted leading-relaxed">{cultureSection.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perks.map(perk => <PerkCard key={perk.title} {...perk} />)}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Open Positions */}
      <section className="py-20 px-8 lg:px-16 bg-brand-light">
        <div className="mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{openingsSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            {openingsSection.heading} <span className="text-brand-blue">{openingsSection.headingAccent}</span>
          </h2>
        </div>

        {openings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openings.map(job => <JobCard key={job.title} {...job} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center max-w-lg mx-auto">
            <Clock size={32} className="text-brand-muted mx-auto mb-4" />
            <p className="font-sora font-semibold text-brand-text mb-2">No open roles right now</p>
            <p className="text-brand-muted text-sm leading-relaxed">{noOpeningsMessage}</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div
          className="relative rounded-3xl px-12 py-16 text-center overflow-hidden"
          style={{ background: getGradient('cta') }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <h2 className="font-sora text-3xl lg:text-4xl font-bold text-white mb-4">{ctaBanner.heading}</h2>
            <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">{ctaBanner.description}</p>
            <a
              href={ctaBanner.primaryTo}
              className="inline-flex items-center gap-2 bg-white text-brand-blue font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              {ctaBanner.primaryLabel} <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
