import { useEffect } from 'react'

export default function CompareBar({ compareIds, products, onRemove, onClear, onCompare }) {
  const selected = products.filter(p => compareIds.has(p.id))
  const visible = compareIds.size > 0

  useEffect(() => {
    document.body.style.setProperty('--compare-tray-offset', visible ? '64px' : '0px')
    return () => document.body.style.setProperty('--compare-tray-offset', '0px')
  }, [visible])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-brand-blue text-white px-8 py-[14px] flex items-center gap-4 z-40
        shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-transform duration-[250ms] ease-in-out flex-wrap
        ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <span className="text-[13px] text-white/60 shrink-0">Compare:</span>
      <div className="flex gap-2 flex-1 flex-wrap">
        {selected.map(p => (
          <div key={p.id} className="flex items-center gap-[6px] bg-white/[0.12] border border-white/20 rounded-[6px] px-[10px] py-1 text-[13px]">
            {p.name}
            <button
              onClick={() => onRemove(p.id)}
              className="text-white/60 hover:text-white text-base leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onCompare}
        disabled={compareIds.size < 2}
        className="bg-[#2E88E5] hover:bg-[#1A6FC4] text-white rounded-[6px] px-5 py-[9px] text-[14px] font-semibold cursor-pointer transition-colors shrink-0 disabled:opacity-50 disabled:cursor-default"
      >
        Compare now
      </button>
      <button
        onClick={onClear}
        className="bg-transparent border border-white/25 text-white/75 hover:bg-white/[0.08] rounded-[6px] px-4 py-2 text-[13px] cursor-pointer shrink-0 transition-colors"
      >
        Clear
      </button>
    </div>
  )
}