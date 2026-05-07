import testimonials from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="bg-brand-light py-20 px-8 lg:px-16">

      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-brand-red mb-4">
          <span className="block w-6 h-[2px] bg-brand-red rounded" />
          Testimonials
        </div>
        <h2 className="font-sora text-3xl lg:text-[42px] font-bold text-brand-text leading-tight">
          What Our <span className="text-brand-blue">Clients Say</span>
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(({ initials, name, role, quote }) => (
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
