import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTABanner({
  heading,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <section className="py-20 px-8 lg:px-16 bg-white">
      <div
        className="relative rounded-3xl px-12 py-16 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #05059b 0%, #2929c8 60%, #ff5050 100%)',
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10">
          <h2 className="font-sora text-3xl lg:text-4xl font-bold text-white mb-4">
            {heading}
          </h2>
          <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to={primaryTo}
              className="inline-flex items-center gap-2 bg-white text-brand-blue font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            >
              {primaryLabel} <ArrowRight size={18} />
            </Link>

            {secondaryLabel && secondaryTo && (
              <Link
                to={secondaryTo}
                className="inline-flex items-center gap-2 text-white font-sora font-semibold text-base px-7 py-3.5 rounded-xl border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
