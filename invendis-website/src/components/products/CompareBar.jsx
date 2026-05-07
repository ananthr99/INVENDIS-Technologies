import { X, GitCompare } from 'lucide-react'

export default function CompareBar({ compareIds, products, onRemove, onClear, onCompare }) {
  if (compareIds.size === 0) return null
  const selected = products.filter(p => compareIds.has(p.id))

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-brand-blue shadow-2xl">
      <div className="px-8 lg:px-16 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <span className="text-sm font-sora font-semibold text-brand-blue shrink-0">
            Compare ({compareIds.size}/3):
          </span>
          {selected.map(p => (
            <div key={p.id} className="flex items-center gap-1.5 bg-brand-light rounded-full px-3 py-1 text-sm">
              <span className="font-medium text-brand-text">{p.name}</span>
              <button onClick={() => onRemove(p.id)} className="text-brand-muted hover:text-brand-red ml-1">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-sm text-brand-muted hover:text-brand-red border border-gray-200 rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onCompare}
            disabled={compareIds.size < 2}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-800 disabled:opacity-40 transition-colors"
          >
            <GitCompare size={15} />
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}
