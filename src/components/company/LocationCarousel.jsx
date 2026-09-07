import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function LocationCarousel({ eyebrow, heading, images }) {
  const [idx, setIdx] = useState(0)

  if (!images?.length) return null

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)
  const img = images[idx]

  return (
    <div className="bg-brand-light rounded-2xl border border-gray-100 overflow-hidden">
      {(eyebrow || heading) && (
        <div className="px-6 pt-5 pb-4">
          {eyebrow && (
            <p className="text-brand-red font-sora text-xs font-semibold uppercase tracking-widest mb-1">{eyebrow}</p>
          )}
          {heading && (
            <h3 className="font-sora font-bold text-brand-text text-base">{heading}</h3>
          )}
        </div>
      )}

      <div className="relative" style={{ aspectRatio: '16/9' }}>
        <img
          key={idx}
          src={img.src.startsWith('http') ? img.src : `${import.meta.env.BASE_URL}${img.src}`}
          alt={img.alt || ''}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {(images.length > 1 || img.caption) && (
        <div className="px-4 py-3 flex flex-col items-center gap-2">
          {img.caption && (
            <p className="text-brand-muted text-xs text-center">{img.caption}</p>
          )}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-brand-blue' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
