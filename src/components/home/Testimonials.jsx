import { useContent } from '../../hooks/useContent'

export default function Testimonials() {
    const { data: content, loading } = useContent('pages/home.json', { withLoading: true })
  if (loading) return (
    <section className="bg-brand-light py-20 px-8 lg:px-16">
      <div className="h-8 w-48 bg-brand-blue/10 rounded-lg animate-pulse mx-auto mb-14" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-brand-blue/10 rounded-2xl p-8 flex flex-col gap-4">
            <div className="h-4 w-full bg-brand-blue/5 rounded animate-pulse" />
            <div className="h-4 w-full bg-brand-blue/5 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-brand-blue/5 rounded animate-pulse" />
            <div className="flex items-center gap-3 mt-4">
              <div className="w-11 h-11 rounded-full bg-brand-blue/10 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-brand-blue/10 rounded animate-pulse" />
                <div className="h-3 w-32 bg-brand-blue/5 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
  const { testimonials } = content

  return (
    <section className="bg-brand-light py-20 px-8 lg:px-16">

      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-brand-red mb-4">
          <span className="block w-6 h-[2px] bg-brand-red rounded" />
          {testimonials.eyebrow}
        </div>
        <h2 className="font-sora text-3xl lg:text-[42px] font-bold text-brand-text leading-tight">
          {testimonials.heading} <span className="text-brand-blue">{testimonials.headingAccent}</span>
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.items.map(({ initials, name, role, quote }) => (
          <div
            key={name}
            className="relative bg-white border border-brand-blue/10 rounded-2xl p-8 overflow-hidden"
          >
            {/* Decorative quote mark */}
            <span className="absolute top-4 right-6 font-sora text-[80px] font-extrabold leading-none text-brand-blue/[0.06] select-none pointer-events-none">
              "
            </span>

            {/* Quote */}
            <p className="relative text-brand-text text-[15px] leading-relaxed mb-8">
              "{quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-blue to-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="font-sora font-bold text-sm text-white">
                  {initials}
                </span>
              </div>
              <div>
                <h4 className="font-sora font-bold text-sm text-brand-text">
                  {name}
                </h4>
                <p className="text-xs text-brand-muted mt-0.5">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
