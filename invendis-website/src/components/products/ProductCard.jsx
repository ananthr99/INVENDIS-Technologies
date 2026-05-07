import { catColors, wifiLabel } from '../../utils/productHelpers'

export default function ProductCard({ product: p, images, useCases, compareIds, onDetail, onToggleCompare }) {
  const imgs = images[p.id]
  const uc = useCases[p.id] || []
  const inCompare = compareIds.has(p.id)

  return (
    <div
      onClick={() => onDetail(p)}
      className={`bg-white rounded-xl border transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-lg
        ${inCompare ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-200'}`}
    >
      {imgs?.length > 0 && (
        <div className="h-40 flex items-center justify-center p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <img src={imgs[0]} alt={p.name} className="max-h-full max-w-full object-contain" />
        </div>
      )}

      <div className="p-4">
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${catColors[p.cat] || catColors.Other}`}>
          {p.cat}
        </span>
        <div className="font-sora font-semibold text-brand-text text-sm mb-1">{p.name}</div>
        <div className="text-brand-muted text-xs leading-relaxed line-clamp-2 mb-3">{p.desc}</div>

        <div className="flex flex-wrap gap-1 mb-3">
          {p.cellular_gen !== 'none' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue text-white font-medium">{p.cellular_gen}</span>
          )}
          {p.wifi !== 'none' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue font-medium">{wifiLabel(p.wifi)}</span>
          )}
          {p.rs485 && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">RS485</span>}
          {p.rs232 && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">RS232</span>}
          {p.ports > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.ports} ports</span>}
          {p.ip && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.ip}</span>}
        </div>

        {uc.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {uc.slice(0, 2).map(u => (
              <span key={u} className="text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-brand-muted">{u}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <label
            className="flex items-center gap-1.5 cursor-pointer text-xs text-brand-muted hover:text-brand-blue"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={inCompare}
              onChange={() => onToggleCompare(p.id)}
              className="accent-brand-blue w-3.5 h-3.5"
            />
            Compare
          </label>
          <span className="text-xs font-medium text-brand-blue group-hover:underline">Details →</span>
        </div>
      </div>
    </div>
  )
}
