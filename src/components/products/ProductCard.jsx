import { useState } from 'react'
import { catColors, wifiLabel } from '../../utils/productHelpers'

export default function ProductCard({ product: p, images, useCases, compareIds, onDetail, onToggleCompare }) {
  const imgs = images[p.id]
  const uc = useCases[p.id] || []
  const inCompare = compareIds.has(p.id)
  const isHf = k => (p.hidden_fields || []).includes(k)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div
      onClick={() => onDetail(p)}
      className={`bg-white rounded-[14px] border cursor-pointer transition-all flex flex-col gap-2 relative p-[18px]
        hover:shadow-[0_4px_20px_rgba(11,31,58,0.10)] hover:border-[#B8CCE4] hover:-translate-y-px
        ${inCompare
          ? 'border-2 border-[#1A6FC4] shadow-[0_0_0_3px_rgba(26,111,196,0.12)]'
          : 'border-[#DDE5EF]'}`}
    >
      {imgs?.length > 0 && (
        <div className="mx-[-18px] mt-[-18px] mb-1 rounded-t-[14px] overflow-hidden border-b border-[#DDE5EF] h-40 flex items-center justify-center bg-white relative">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-[#F0F4F8] animate-pulse rounded-t-[14px]" />
          )}
          {imgs[0].startsWith('http') ? (
            <img
              src={imgs[0]}
              alt={p.name}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-contain p-3 box-border transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <picture style={{ display: 'contents' }}>
              <source srcSet={imgs[0].replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />
              <img
                src={imgs[0]}
                alt={p.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain p-3 box-border transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                decoding="async"
              />
            </picture>
          )}
        </div>
      )}

      <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${catColors[p.cat] || catColors.Other}`}>
        {p.cat}
      </span>

      <div className="text-[15px] font-semibold text-[#0B1F3A] leading-tight">{p.name}</div>
      <div className="text-[12px] text-[#5A6E87] leading-[1.5] min-w-0 break-words">{p.desc}</div>

      <div className="flex flex-wrap gap-1 mt-1">
        {p.cellular_gen !== 'none' && !isHf('cellular_gen') && (
          <span className="text-[11px] px-2 py-0.5 rounded border bg-[#E8F7EE] text-[#1A6B3C] border-[#B4DFC5]">{p.cellular_gen}</span>
        )}
        {p.wifi !== 'none' && !isHf('wifi') && (
          <span className="text-[11px] px-2 py-0.5 rounded border bg-[#E8F7EE] text-[#1A6B3C] border-[#B4DFC5]">{wifiLabel(p.wifi)}</span>
        )}
        {p.rs485 && !isHf('rs485') && (
          <span className="text-[11px] px-2 py-0.5 rounded border bg-[#FFF4E0] text-[#7A5000] border-[#F0D090]">RS485</span>
        )}
        {p.rs232 && !isHf('rs232') && (
          <span className="text-[11px] px-2 py-0.5 rounded border bg-[#FFF4E0] text-[#7A5000] border-[#F0D090]">RS232</span>
        )}
        {p.ports > 0 && !isHf('ports') && (
          <span className="text-[11px] px-2 py-0.5 rounded border border-[#DDE5EF] text-[#5A6E87] bg-[#F7F9FC]">{p.ports} ports</span>
        )}
        {p.ip && !isHf('ip') && (
          <span className="text-[11px] px-2 py-0.5 rounded border border-[#DDE5EF] text-[#5A6E87] bg-[#F7F9FC]">{p.ip}</span>
        )}
      </div>

      {uc.length > 0 && (
        <div className="flex flex-wrap gap-1 my-1">
          {uc.slice(0, 2).map(u => (
            <span key={u} className="text-[10px] font-medium px-[7px] py-0.5 rounded-full bg-[#EAF2FB] text-[#1A6FC4] border border-[#C4DCF5] whitespace-nowrap">{u}</span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2.5 border-t border-[#DDE5EF] flex items-center gap-2">
        <label
          className="flex items-center gap-[5px] text-[12px] text-[#5A6E87] cursor-pointer select-none"
          onClick={e => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={inCompare}
            onChange={() => onToggleCompare(p.id)}
            className="w-[14px] h-[14px] accent-[#1A6FC4] cursor-pointer"
          />
          Compare
        </label>
        <button
          onClick={e => { e.stopPropagation(); onDetail(p) }}
          className="ml-auto text-[12px] text-[#1A6FC4] font-medium hover:underline bg-transparent border-0 p-0 cursor-pointer"
        >
          Details →
        </button>
      </div>
    </div>
  )
}
