import { useState, useEffect } from 'react'

/**
 * Returns paginated slice of `items` with original indices preserved.
 * pageItems: Array of { item, index } where index is the position in the full array.
 */
export function usePagination(items, pageSize = 5) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1))
  }, [items.length, pageCount])

  const start     = page * pageSize
  const end       = Math.min(start + pageSize, items.length)
  const pageItems = items.slice(start, end).map((item, i) => ({ item, index: start + i }))

  return { page, setPage, pageCount, pageItems, start, end, total: items.length }
}

/** Section title row with item count badge and a top-aligned + Add button. */
export function ListHeader({ title, count, onAdd, addLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <p className="form-section-title" style={{ marginBottom: 0 }}>
        {title}
        {count > 0 && (
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, background: '#f3f4f6', color: '#6b7280', padding: '1px 7px', borderRadius: 10 }}>
            {count}
          </span>
        )}
      </p>
      {onAdd && (
        <button className="btn-add" style={{ marginBottom: 0 }} onClick={onAdd}>
          {addLabel || '+ Add'}
        </button>
      )}
    </div>
  )
}

/** Prev / Next pagination bar. Renders nothing when all items fit on one page. */
export function Pager({ page, setPage, pageCount, start, end, total }) {
  if (pageCount <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
      <span style={{ fontSize: 12, color: '#9ca3af' }}>{start + 1}–{end} of {total}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={navBtnStyle(page === 0)}>
          ‹ Prev
        </button>
        <span style={{ fontSize: 12, color: '#374151', padding: '0 8px' }}>
          {page + 1} / {pageCount}
        </span>
        <button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page === pageCount - 1} style={navBtnStyle(page === pageCount - 1)}>
          Next ›
        </button>
      </div>
    </div>
  )
}

function navBtnStyle(disabled) {
  return {
    padding: '4px 10px',
    fontSize: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    background: disabled ? '#f9fafb' : '#fff',
    color: disabled ? '#d1d5db' : '#374151',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
  }
}
