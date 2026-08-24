import { useState, useEffect, useCallback } from 'react'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
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

function getItemsPerPage() {
  const w = window.innerWidth
  if (w >= 1024) return 9   
  if (w >= 640)  return 6   
  return 4                   
}


export default function Gallery() {
  const content = useContent('pages/gallery.json')
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentPage, setCurrentPage]       = useState(1)
  const [itemsPerPage, setItemsPerPage]     = useState(getItemsPerPage)

  const updateItemsPerPage = useCallback(() => {
    setItemsPerPage(getItemsPerPage())
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [updateItemsPerPage])

  if (!content) return <div className="min-h-screen" />

  const { hero, gallerySection, categories, photos, ctaBanner } = content

  const filtered = activeCategory === 'all'
  ? photos
  : photos.filter(p => p.category === activeCategory)

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage   = Math.min(currentPage, totalPages)
  const pagePhotos = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)

  function handleCategoryChange(id) {
    setActiveCategory(id)
    setCurrentPage(1)
  }

  function goTo(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function buildPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (safePage > 3) pages.push('…')
    for (let p = Math.max(2, safePage - 1); p <= Math.min(totalPages - 1, safePage + 1); p++) pages.push(p)
    if (safePage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
    return pages
  }

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
                onClick={() => handleCategoryChange(id)}
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
          {pagePhotos.map((photo) => (
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
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              className="p-2 rounded-lg border border-gray-200 text-brand-muted hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {buildPages().map((item, i) =>
              item === '…' ? (
                <span key={`ellipsis-${i}`} className="px-1 text-brand-muted font-sora text-sm select-none">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => goTo(item)}
                  className={`w-9 h-9 rounded-lg font-sora text-sm font-semibold transition-all ${
                    item === safePage
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'border border-gray-200 text-brand-muted hover:text-brand-blue hover:border-brand-blue'
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-brand-muted hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Page count summary */}
        {totalPages > 1 && (
          <p className="mt-4 text-center text-brand-muted font-sora text-xs">
            Showing {(safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, filtered.length)} of {filtered.length} photos
          </p>
        )}
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
