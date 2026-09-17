import CtaBanner from '../components/shared/CTABanner'
import LocationCarousel from '../components/company/LocationCarousel'
import PageSEO from '../components/shared/PageSEO'
import { useContent } from '../hooks/useContent'
import { getIcon } from '../utils/iconMap'
import { getGradient } from '../utils/styleMap'

const CARD_COLORS = [
  '#02026b', '#be123c', '#15803d', '#7c3aed',
  '#0284c7', '#c2410c', '#0f766e', '#a21caf',
]

const colorClass = {
  blue: 'bg-brand-blue',
  red: 'bg-brand-red',
  muted: 'bg-brand-muted',
}


function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function TeamCard({ name, role, photo, linkedin, gi }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center p-5">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-3 flex-shrink-0 shadow-sm"
        style={{ background: CARD_COLORS[gi % CARD_COLORS.length] }}
      >
        {photo ? (
          <img
            src={photo.startsWith('http') ? photo : `${import.meta.env.BASE_URL}${photo}`}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="font-sora font-bold text-white text-xl select-none">
            {initials(name)}
          </span>
        )}
      </div>
      <h4 className="font-sora font-bold text-brand-text text-sm leading-tight">{name}</h4>
      <p className="text-brand-blue text-xs font-medium mt-1 leading-snug">{role}</p>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-white bg-[#0077b5] hover:bg-[#005885] px-2.5 py-1 rounded-full transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Connect
        </a>
      )}
    </div>
  )
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

  if (!content) return null

  const {
    hero, missionSection, mission, valuesSection, values,
    timelineSection, timeline, facilitiesSection, facilities,
    certifications, locationGallery, teamSection, team, ctaBanner,
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
        className="relative text-white min-h-[calc(100vh-80px)] flex items-center px-8 lg:px-16 overflow-hidden py-12"
        style={{ background: getGradient('navy') }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {hero.heroImage ? (
          /* ── Two-column: text gets 2/3, image gets 1/3 ── */
          <div className="relative w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">{hero.eyebrow}</p>
              <h1 className="font-sora text-5xl font-bold mb-4 leading-tight">
                {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
              </h1>
              <div className="space-y-3">
                {hero.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-blue-200 text-base leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <img
                src={hero.heroImage.startsWith('http') ? hero.heroImage : `${import.meta.env.BASE_URL}${hero.heroImage}`}
                alt="Invendis Technologies"
                className="w-full object-cover rounded-2xl shadow-2xl border border-white/10"
                style={{ maxHeight: 'calc(100vh - 160px)' }}
                loading="eager"
              />
            </div>
          </div>
        ) : (
          /* ── Full-width: text spans the whole header ── */
          <div className="relative w-full">
            <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">{hero.eyebrow}</p>
            <h1 className="font-sora text-5xl font-bold mb-4 leading-tight">
              {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
            </h1>
            <div className="space-y-3 max-w-5xl">
              {hero.description.split('\n\n').map((para, i) => (
                <p key={i} className="text-blue-200 text-base leading-relaxed">{para}</p>
              ))}
            </div>
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
          <div className="flex flex-col">
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{timelineSection.eyebrow}</p>
            <h2 className="font-sora text-3xl font-bold text-brand-text mb-10">
              {timelineSection.heading} <span className="text-brand-blue">{timelineSection.headingAccent}</span>
            </h2>
            <div className="relative flex-1 flex flex-col">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-brand-blue/10" />
              <div className="flex flex-col flex-1 justify-between">
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

          {/* Facilities + Certs + Location Gallery */}
          <div className="flex flex-col gap-6">
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
            {locationGallery?.images?.length > 0 && (
              <LocationCarousel {...locationGallery} />
            )}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-10 px-8 lg:px-16 bg-brand-light">
        <div className="text-center mb-8">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{teamSection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-3">
            {teamSection.heading} <span className="text-brand-blue">{teamSection.headingAccent}</span>
          </h2>
          <p className="text-brand-muted max-w-xl mx-auto">
            {teamSection.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {team.map(({ name, role, photo, linkedin }, i) => (
            <div key={i} className="basis-[calc(50%-8px)] sm:basis-[calc(33.333%-11px)] lg:basis-[calc(20%-13px)]">
              <TeamCard name={name} role={role} photo={photo} linkedin={linkedin} gi={i} />
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
