import CtaBanner from '../components/shared/CTABanner'
import PageSEO from '../components/shared/PageSEO'
import { useContent } from '../hooks/useContent'
import { getIcon } from '../utils/iconMap'
import { getGradient } from '../utils/styleMap'

const colorClass = {
  blue: 'bg-brand-blue',
  red: 'bg-brand-red',
  muted: 'bg-brand-muted',
}

const avatarGradients = ['blue', 'red', 'green', 'purple', 'blue', 'red']

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Company() {
    const { data: content, loading } = useContent('pages/company.json', { withLoading: true })
  if (loading) return (
    <div className="min-h-screen">
      <div className="h-64 animate-pulse" style={{ background: 'linear-gradient(135deg, #02026b 0%, #05059b 100%)' }}>
        <div className="px-8 lg:px-16 py-24 flex flex-col gap-4 max-w-3xl">
          <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
          <div className="h-10 w-2/3 bg-white/20 rounded-xl animate-pulse" />
          <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="py-20 px-8 lg:px-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-brand-light rounded-2xl p-8 flex flex-col gap-4">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-xl animate-pulse" />
              <div className="h-5 w-1/2 bg-brand-blue/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-brand-blue/5 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-brand-blue/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const {
    hero, missionSection, mission, valuesSection, values,
    timelineSection, timeline, facilitiesSection, facilities,
    certifications, teamSection, team, ctaBanner,
  } = content

  return (
    <div className="min-h-screen">
      <PageSEO
        title="About Us"
        description="Invendis Technologies is a Bangalore-based IIoT company with 17+ years of experience, 180+ employees, ISO 9001/14001/27001 certifications, and global operations across 54 countries."
        path="/company"
      />

      {/* Hero */}
      <section
        className="relative text-white py-16 px-8 lg:px-16 overflow-hidden"
        style={{ background: getGradient('navy') }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {hero.heroImage ? (
          /* ── Two-column: text left, image right ── */
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">{hero.eyebrow}</p>
              <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
                {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed">
                {hero.description}
              </p>
            </div>
            <div className="hidden lg:block">
              <img
                src={hero.heroImage.startsWith('http') ? hero.heroImage : `${import.meta.env.BASE_URL}${hero.heroImage}`}
                alt="Invendis Technologies"
                className="w-full max-h-[420px] object-cover rounded-2xl shadow-2xl border border-white/10"
                loading="eager"
              />
            </div>
          </div>
        ) : (
          /* ── Full-width: text spans the whole header ── */
          <div className="relative">
            <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">{hero.eyebrow}</p>
            <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
              {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed max-w-4xl">
              {hero.description}
            </p>
          </div>
        )}
      </section>

      {/* Mission / Vision / Tagline */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="text-center mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{missionSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            {missionSection.heading} <span className="text-brand-blue">{missionSection.headingAccent}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mission.map(({ icon, bg, title, tagline, body }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="bg-brand-light rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${colorClass[bg] || colorClass.blue}`}>
                  <Icon size={22} strokeWidth={1.75} className="text-white" />
                </div>
                <h3 className="font-sora font-bold text-xl text-brand-text mb-3">{title}</h3>
                {tagline && (
                  <p className="font-sora font-bold text-xl text-brand-blue mb-3">{tagline}</p>
                )}
                <p className="text-brand-muted text-sm leading-relaxed">{body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{valuesSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text">
            {valuesSection.heading} <span className="text-brand-blue">{valuesSection.headingAccent}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ icon, title, body }) => {
            const Icon = getIcon(icon)
            return (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} strokeWidth={1.75} className="text-brand-blue" />
                </div>
                <h3 className="font-sora font-bold text-brand-text mb-2">{title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Timeline + Facilities */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Timeline */}
          <div>
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{timelineSection.eyebrow}</p>
            <h2 className="font-sora text-3xl font-bold text-brand-text mb-10">
              {timelineSection.heading} <span className="text-brand-blue">{timelineSection.headingAccent}</span>
            </h2>
            <div className="relative">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-brand-blue/10" />
              <div className="space-y-6">
                {timeline.map(({ year, title, body }) => (
                  <div key={year} className="flex gap-5">
                    <div className="shrink-0 w-24 text-right">
                      <span className="font-sora font-bold text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-full whitespace-nowrap">
                        {year}
                      </span>
                    </div>
                    <div className="relative pt-0.5">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-brand-blue border-2 border-white shadow" />
                      <h4 className="font-sora font-semibold text-brand-text text-sm mb-1">{title}</h4>
                      <p className="text-brand-muted text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Facilities + Certs */}
          <div>
            <div className="bg-brand-light rounded-2xl p-8 border border-gray-100">
              <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{facilitiesSection.eyebrow}</p>
              <h3 className="font-sora font-bold text-xl text-brand-text mb-2">{facilitiesSection.heading}</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-7">
                {facilitiesSection.description}
              </p>
              <div className="space-y-4 mb-8">
                {facilities.map(({ icon, color, label, detail }) => {
                  const Icon = getIcon(icon)
                  return (
                    <div key={label} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass[color] || colorClass.blue}`}>
                        <Icon size={18} strokeWidth={1.75} className="text-white" />
                      </div>
                      <div className="text-sm text-brand-text">
                        <strong>{label}</strong> — {detail}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-3">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {certifications.map(cert => (
                  <span key={cert} className="text-xs font-semibold px-3 py-1.5 border-2 border-brand-blue text-brand-blue rounded-lg font-sora">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-20 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-12">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{teamSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {teamSection.heading} <span className="text-brand-blue">{teamSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl mx-auto">
            {teamSection.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {team.map(({ name, role, photo }, i) => (
            <div key={i} className="flex flex-col items-center text-center group w-36">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                {photo ? (
                  <img src={photo.startsWith('http') ? photo : `${import.meta.env.BASE_URL}${photo}`} alt={name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-sora font-bold text-2xl"
                    style={{ background: getGradient(avatarGradients[i % avatarGradients.length]) }}
                  >
                    {initials(name)}
                  </div>
                )}
              </div>
              <h4 className="font-sora font-bold text-brand-text text-sm">{name}</h4>
              <p className="text-brand-muted text-xs mt-1 leading-snug">{role}</p>
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
