import content from '../../content/pages/home.json'
import { getIcon } from '../../utils/iconMap'

export default function WhatWeDo() {
  const { whatWeDo } = content

  return (
    <section className="py-20 px-8 lg:px-16 bg-white">

      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-brand-red mb-4">
          <span className="block w-6 h-[2px] bg-brand-red rounded" />
          {whatWeDo.eyebrow}
        </div>
        <h2 className="font-sora text-3xl lg:text-[42px] font-bold text-brand-text leading-tight mb-4">
          {whatWeDo.heading} <span className="text-brand-blue">{whatWeDo.headingAccent}</span>
        </h2>
        <p className="text-brand-muted text-lg leading-relaxed max-w-2xl mx-auto">
          {whatWeDo.description}
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whatWeDo.features.map(({ icon, accent, title, description }) => {
          const Icon = getIcon(icon)
          return (
            <div
              key={title}
              className="group relative bg-white border border-brand-blue/10 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-blue/20"
            >
              {/* Hover accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-blue to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div
                className={
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-5 ' +
                  (accent === 'red'
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'bg-brand-blue/10 text-brand-blue')
                }
              >
                <Icon size={22} strokeWidth={1.75} />
              </div>

              <h3 className="font-sora text-lg font-semibold text-brand-text mb-3">
                {title}
              </h3>
              <p className="text-brand-muted text-[15px] leading-relaxed">
                {description}
              </p>
            </div>
          )
        })}
      </div>

    </section>
  )
}
