import { useState } from 'react'
import { Camera } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import CTABanner from '../components/shared/CTABanner'
import { useContent } from '../hooks/useContent'
import { getGradient } from '../utils/styleMap'

const categoryGradients = {
  events:    'blue',
  expos:     'navy',
  awards:    'amber',
  team:      'green',
  festivals: 'crimson',
}

export default function Gallery() {
  const content = useContent('pages/gallery.json')
  const [activeCategory, setActiveCategory] = useState('all')

  if (!content) return <div className="min-h-screen" />

  const { hero, gallerySection, categories, photos, ctaBanner } = content

  const filtered = activeCategory === 'all'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Gallery"
        description="Photos from Invendis events, expos, award ceremonies, team outings, and company celebrations."
        path="/gallery"
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
          <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-3">{hero.eyebrow}</p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            {hero.headline} <span className="text-red-300">{hero.headlineAccent}</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="mb-10">
          <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-2">{gallerySection.eyebrow}</p>
          <h2 className="font-sora text-3xl font-bold text-brand-text mb-8">
            {gallerySection.heading} <span className="text-brand-blue">{gallerySection.headingAccent}</span>
          </h2>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2 rounded-full font-sora text-sm font-semibold transition-all ${
                  activeCategory === id
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-brand-light text-brand-muted hover:text-brand-blue hover:bg-brand-blue/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {photo.src ? (
                  <img
                    src={photo.src.startsWith('http') ? photo.src : `${import.meta.env.BASE_URL}${photo.src}`}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{ background: getGradient(categoryGradients[photo.category] || 'blue') }}
                  >
                    <Camera size={48} strokeWidth={1} className="text-white/30 mb-3" />
                    <span className="text-white/40 text-xs font-sora font-semibold uppercase tracking-widest">
                      Photo coming soon
                    </span>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-blue font-sora text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                  {photo.category}
                </span>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-sora font-bold text-brand-text text-sm mb-1">{photo.title}</h3>
                <p className="text-brand-muted text-xs leading-relaxed">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner
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
