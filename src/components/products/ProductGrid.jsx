import ProductCard from './ProductCard'

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null

  const maxVisible = 5
  let pages = []
  if (totalPages <= maxVisible + 2) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else {
    pages = [1]
    let start = Math.max(2, page - 1)
    let end = Math.min(totalPages - 1, page + 1)
    if (page <= 3) { start = 2; end = Math.min(totalPages - 1, maxVisible) }
    if (page >= totalPages - 2) { start = Math.max(2, totalPages - maxVisible + 1); end = totalPages - 1 }
    if (start > 2) pages.push('…')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('…')
    pages.push(totalPages)
  }

  const btnCls = (active) =>
    `min-w-9 h-9 px-1.5 border rounded-[6px] text-[13px] font-medium flex items-center justify-center transition-all
     ${active
       ? 'bg-brand-blue border-brand-blue text-white'
       : 'border-[#DDE5EF] bg-white text-[#0B1F3A] hover:border-[#1A6FC4] hover:text-[#1A6FC4] hover:bg-[#EAF2FB]'}`

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap mt-7">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className={`${btnCls(false)} disabled:opacity-35 disabled:cursor-default`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      {pages.map((p, i) =>
        p === '…'
          ? <span key={`e${i}`} className="min-w-9 text-center text-[13px] text-[#8DA0B8]">…</span>
          : <button key={p} onClick={() => onPage(p)} className={btnCls(p === page)}>{p}</button>
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className={`${btnCls(false)} disabled:opacity-35 disabled:cursor-default`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  )
}

export default function ProductGrid({
  products, images, useCases, compareIds,
  onDetail, onToggleCompare,
  page, totalPages, onPage, filtered,
}) {
  if (!filtered.length) {
    return (
      <div className="text-center py-16 text-[#5A6E87]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-[#8DA0B8] mx-auto mb-[14px]">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6M11 8v6"/>
        </svg>
        <h3 className="text-[16px] font-semibold text-[#0B1F3A] mb-[6px]">No Products Found</h3>
        <p className="text-[14px]">Try adjusting your search filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[14px]">
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
      <Pagination page={page} totalPages={totalPages} onPage={onPage} />
    </>
  )
}
