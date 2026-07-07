import { Search, X } from 'lucide-react'

export default function FilterBar({
  search, filters, hasActiveFilters, filtered,
  onSearch, onFilter, onClear,
  page, totalPages,
}) {
  const PAGE_SIZE = 12
  const start = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const end = Math.min(page * PAGE_SIZE, filtered.length)

  const selectCls = active =>
    `px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-brand-blue cursor-pointer transition-colors
     ${active ? 'border-brand-blue text-brand-blue bg-blue-50' : 'border-gray-200 text-brand-muted bg-white'}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
          />
        </div>

        <select value={filters.cell} onChange={e => onFilter('cell', e.target.value)} className={selectCls(filters.cell)}>
          <option value="">Cellular: All</option>
          <option value="5G">5G</option>
          <option value="4G">4G</option>
          <option value="none">No cellular</option>
        </select>

        <select value={filters.wifi} onChange={e => onFilter('wifi', e.target.value)} className={selectCls(filters.wifi)}>
          <option value="">Wi-Fi: All</option>
          <option value="WiFi6">Wi-Fi 6</option>
          <option value="WiFi5">Wi-Fi 5</option>
          <option value="WiFi24">Wi-Fi 2.4 GHz</option>
          <option value="none">No Wi-Fi</option>
        </select>

        <select value={filters.ports} onChange={e => onFilter('ports', e.target.value)} className={selectCls(filters.ports)}>
          <option value="">Ports: All</option>
          <option value="2">1–2 ports</option>
          <option value="5">3–5 ports</option>
          <option value="8">6–8 ports</option>
          <option value="10">9+ ports</option>
        </select>

        <select value={filters.serial} onChange={e => onFilter('serial', e.target.value)} className={selectCls(filters.serial)}>
          <option value="">Serial: All</option>
          <option value="rs485">RS485</option>
          <option value="rs232">RS232</option>
          <option value="both">RS485 + RS232</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-brand-red hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-brand-muted">
        {filtered.length
          ? <>Showing <strong className="text-brand-text">{start}–{end}</strong> of <strong className="text-brand-text">{filtered.length}</strong> products</>
          : <strong className="text-brand-text">0 products found</strong>
        }
      </div>
    </div>
  )
}
