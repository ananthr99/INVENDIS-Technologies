import { catColors, wifiLabel } from '../../utils/productHelpers'

const colStyle = { gridTemplateColumns: '48px 160px 1fr 80px 80px 68px 68px 80px' }

export default function ProductList({ products, images, compareIds, onDetail, onToggleCompare }) {
  if (!products.length) return null

  const hasCellular = v => v && v !== 'none'
  const hasWifi = v => v && v !== 'none'

  const YesPill = ({ label }) => (
    <span className="bg-[#E8F7EE] text-[#1A6B3C] border border-[#B4DFC5] text-[11px] font-semibold px-[7px] py-0.5 rounded">{label}</span>
  )
  const NoPill = () => <span className="text-[#8DA0B8] text-xs">-</span>

  return (
    <div className="flex flex-col gap-[6px]">
      <div className="hidden md:grid gap-[10px] px-4 py-2 text-[11px] font-semibold text-[#8DA0B8] tracking-[0.06em] uppercase border-b border-[#DDE5EF] mb-1" style={colStyle}>
        <span />
        <span>Model</span>
        <span>Description</span>
        <span className="text-center">Cellular</span>
        <span className="text-center">Wi-Fi</span>
        <span className="text-center">RS485</span>
        <span className="text-center">Ports</span>
        <span className="text-center">Compare</span>
      </div>

      {products.map(p => {
        const imgs = images[p.id]
        const inCompare = compareIds.has(p.id)
        const isHf = k => (p.hidden_fields || []).includes(k)

        return (
          <div
            key={p.id}
            onClick={() => onDetail(p)}
            className={`bg-white border rounded-[10px] px-4 py-3 grid gap-[10px] items-center cursor-pointer transition-all
              hover:shadow-[0_1px_4px_rgba(11,31,58,0.07)] hover:border-[#B8CCE4]
              ${inCompare ? 'border-2 border-[#1A6FC4]' : 'border-[#DDE5EF]'}
              grid-cols-[48px_1fr] md:grid-cols-[48px_160px_1fr_80px_80px_68px_68px_80px]`}
          >
            {imgs?.length ? (
              <img src={imgs[0]} alt={p.name} className="w-10 h-10 object-contain rounded-[6px] bg-[#f5f7fa] block" loading="lazy" />
            ) : (
              <span className="w-10 h-10 block" />
            )}
            <div>
              <div className="text-[13px] font-semibold text-[#0B1F3A]">{p.name}</div>
              <div className="mt-[3px]">
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase ${catColors[p.cat] || catColors.Other}`}>
                  {p.cat}
                </span>
              </div>
            </div>
            <div className="hidden md:block text-[12px] text-[#5A6E87] leading-[1.4]">{p.desc}</div>
            <div className="hidden md:flex justify-center">
              {hasCellular(p.cellular_gen) && !isHf('cellular_gen') ? <YesPill label={p.cellular_gen} /> : <NoPill />}
            </div>
            <div className="hidden md:flex justify-center">
              {hasWifi(p.wifi) && !isHf('wifi') ? <YesPill label={wifiLabel(p.wifi)} /> : <NoPill />}
            </div>
            <div className="hidden md:flex justify-center">
              {p.rs485 && !isHf('rs485') ? <YesPill label="Yes" /> : <NoPill />}
            </div>
            <div className="hidden md:block text-center text-[12px] text-[#0B1F3A]">
              {p.ports > 0 ? p.ports : '-'}
            </div>
            <div className="hidden md:flex justify-center" onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={inCompare}
                onChange={() => onToggleCompare(p.id)}
                className="w-[14px] h-[14px] accent-[#1A6FC4] cursor-pointer"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
