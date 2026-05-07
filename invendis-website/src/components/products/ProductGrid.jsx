import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import ProductCard from './ProductCard'

export default function ProductGrid({
  products, images, useCases, compareIds,
  onDetail, onToggleCompare,
  page, totalPages, onPage, filtered,
}) {
  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <SearchX size={48} strokeWidth={1} className="text-gray-300 mb-4" />
        <h3 className="font-sora font-semibold text-brand-text text-lg mb-2">No products found</h3>
        <p className="text-brand-muted text-sm">Try adjusting your search or filters above.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            images={images}
            useCases={useCases}
            compareIds={compareIds}
            onDetail={onDetail}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-blue hover:text-brand-blue transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => onPage(n)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                ${n === page
                  ? 'bg-brand-blue text-white'
                  : 'border border-gray-200 hover:border-brand-blue hover:text-brand-blue'}`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => onPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-blue hover:text-brand-blue transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  )
}
