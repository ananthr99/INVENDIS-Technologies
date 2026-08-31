import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { catColors, wifiLabel, viewFile, downloadFile } from '../../utils/productHelpers'

function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-[#F0F4F9] last:border-0 gap-4 text-[13px]">
      <span className="text-[#5A6E87] shrink-0 w-[140px]">{label}</span>
      <span className="font-medium text-right text-[#0B1F3A]">{value}</span>
    </div>
  )
}

function SpecSection({ title, children }) {
  return (
    <div className="mb-5">
      <h4 className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#8DA0B8] mb-[10px] pb-[6px] border-b border-[#DDE5EF]">
        {title}
      </h4>
      {children}
    </div>
  )
}

function VariantsTable({ variants, partDatasheets }) {
  if (!variants?.headers || !variants?.rows) return null
  const dsKey = cell => cell.replace(/\s*\(.*\)$/, '').trim()
  const hasDs = variants.rows.some(row => !!partDatasheets[dsKey(row[row.length - 1])])
  const partNoIdx = variants.headers.length - 1

  return (
    <div className="mb-5">
      <h4 className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#8DA0B8] mb-[10px] pb-[6px] border-b border-[#DDE5EF]">
        Product Variants
      </h4>
      {variants.note && (
        <p className="text-[11.5px] text-[#5A6E87] bg-[#F7F9FC] border border-[#DDE5EF] rounded-[6px] px-3 py-2 mb-3 leading-[1.6] font-mono">
          {variants.note}
        </p>
      )}
      <div className="overflow-x-auto rounded-[6px] border border-[#DDE5EF]">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#03037a] text-white">
              {variants.headers.map((h, i) => (
                <th key={i} className={`px-[10px] py-[7px] text-center font-semibold text-[11.5px] tracking-[0.04em] whitespace-nowrap ${i === partNoIdx ? 'font-mono' : ''}`}>{h}</th>
              ))}
              {hasDs && <th className="px-[10px] py-[7px] text-center font-semibold text-[11.5px]">Data Sheet</th>}
            </tr>
          </thead>
          <tbody>
            {variants.rows.map((row, ri) => {
              const pn = dsKey(row[row.length - 1])
              const file = hasDs ? partDatasheets[pn] : null
              return (
                <tr key={ri} className="border-t border-[#DDE5EF] even:bg-[#F7F9FC] hover:bg-[#EAF2FB]">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-[10px] py-[6px] text-center
                      ${ci === partNoIdx ? 'font-mono font-semibold text-[12px] text-[#03037a]' : ''}
                      ${cell === '✓' ? 'text-[#1A6B3C] font-bold text-[15px]' : ''}
                      ${cell === '—' ? 'text-[#8DA0B8]' : 'text-[#0B1F3A]'}`}>
                      {cell}
                    </td>
                  ))}
                  {hasDs && (
                    <td className="px-[10px] py-[6px] text-center whitespace-nowrap">
                      {file && file !== 'contact_us' ? (
                        <div className="flex gap-1 justify-center">
                          <button onClick={e => viewFile(file, e.currentTarget)}
                            className="text-[11px] font-semibold px-[9px] py-[3px] rounded-[6px] bg-white text-[#1A6FC4] border border-[#1A6FC4] hover:bg-[#1A6FC4] hover:text-white transition-colors">View</button>
                          <button onClick={() => downloadFile(file)}
                            className="text-[13px] font-semibold px-2 py-[3px] rounded-[6px] bg-[#1A6FC4] text-white border border-[#1A6FC4] hover:bg-[#05059b] transition-colors">↓</button>
                        </div>
                      ) : (
                        <a href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Datasheet Request: ' + pn)}&body=${encodeURIComponent('Hi Invendis team,\n\nI would like to request the datasheet for ' + pn + '.\n\nThank you.')}`}
                          className="text-[11px] font-semibold px-[9px] py-[3px] rounded-[6px] bg-white text-[#1A6FC4] border border-[#1A6FC4] hover:bg-[#1A6FC4] hover:text-white transition-colors">
                          Contact us
                        </a>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ProductModal({
  product: p, images, useCases, datasheets, partDatasheets,
  compareIds, onClose, onToggleCompare,
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const [loadedSet, setLoadedSet] = useState(() => new Set())
  const imgLoaded = loadedSet.has(imgIdx)
  const imgRef = useRef(null)

  useLayoutEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoadedSet(prev => { const s = new Set(prev); s.add(imgIdx); return s })
    }
  }, [imgIdx])
  const imgs = images[p.id] || []
  const uc = useCases[p.id] || []
  const mainDs = datasheets[p.id]
  const inCompare = compareIds.has(p.id)

  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const titleId = `product-modal-title-${p.id}`

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeBtnRef.current?.focus()

    function getFocusable() {
      if (!dialogRef.current) return []
      return Array.from(
        dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      )
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Tab') {
        const focusable = getFocusable()
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [onClose])

  const hf = new Set(p.hidden_fields || [])
  const isHf = k => hf.has(k)
  const anyVisible = (...keys) => keys.some(k => !isHf(k))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 animate-[fadeIn_0.15s_ease]">
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div className="absolute inset-0 bg-[rgba(11,31,58,0.45)]" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white w-full sm:max-w-[860px] max-h-[88vh] overflow-y-auto rounded-t-[14px] sm:rounded-[14px] shadow-[0_8px_40px_rgba(11,31,58,0.16)] animate-[slideUp_0.18s_ease]"
      >
        {/* Floating close button — sticky at top, height 0, overflows */}
        <div className="sticky top-0 z-10 h-0 overflow-visible flex justify-end pointer-events-none">
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close product details"
            className="pointer-events-auto relative top-3 mr-[14px] w-[30px] h-[30px] bg-[#F7F9FC] rounded-full border-none cursor-pointer flex items-center justify-center text-[18px] text-[#5A6E87] leading-none transition-colors shadow-[0_1px_4px_rgba(11,31,58,0.12)] hover:bg-[#DDE5EF] hover:text-[#0B1F3A]"
          >
            ×
          </button>
        </div>

        {/* Modal header */}
        <div className="px-6 py-4 pb-[18px] border-b border-[#DDE5EF]">
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase mb-2 ${catColors[p.cat] || catColors.Other}`}>
            {p.cat}
          </span>
          <h2 id={titleId} className="text-[20px] font-bold text-[#0B1F3A] mt-2 tracking-[-0.2px]">{p.name}</h2>
          <p className="text-[13px] text-[#5A6E87] mt-[6px] leading-[1.5]">{p.desc}</p>
        </div>

        {/* Image carousel */}
        {imgs.length > 0 && (
          <div className={`relative flex items-center justify-center min-h-[220px] ${!imgLoaded ? 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-pulse' : ''}`}>
            {imgs[imgIdx].startsWith('http') ? (
              <img
                ref={imgRef}
                src={imgs[imgIdx]}
                alt={p.name}
                className={`max-h-[260px] max-w-full object-contain block transition-opacity duration-[250ms] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoadedSet(prev => { const s = new Set(prev); s.add(imgIdx); return s })}
              />
            ) : (
              <picture style={{ display: 'contents' }}>
                <source srcSet={imgs[imgIdx].replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />
                <img
                  ref={imgRef}
                  src={imgs[imgIdx]}
                  alt={p.name}
                  className={`max-h-[260px] max-w-full object-contain block transition-opacity duration-[250ms] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setLoadedSet(prev => { const s = new Set(prev); s.add(imgIdx); return s })}
                />
              </picture>
            )}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/92 border border-[#DDE5EF] rounded-full w-9 h-9 text-[22px] cursor-pointer text-[#05059b] flex items-center justify-center shadow-[0_1px_4px_rgba(11,31,58,0.1)] hover:border-[#1A6FC4] hover:text-[#1A6FC4] transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/92 border border-[#DDE5EF] rounded-full w-9 h-9 text-[22px] cursor-pointer text-[#05059b] flex items-center justify-center shadow-[0_1px_4px_rgba(11,31,58,0.1)] hover:border-[#1A6FC4] hover:text-[#1A6FC4] transition-colors"
                >
                  ›
                </button>
                <div className="absolute bottom-2 right-3 text-[11px] text-[#8DA0B8] bg-white/85 rounded px-[6px] py-[2px] font-mono">
                  {imgIdx + 1} / {imgs.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Use cases — separate section with background */}
        {uc.length > 0 && (
          <div className="px-6 py-[14px] border-b border-[#DDE5EF] bg-[#FAFCFF]">
            <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#5A6E87] mb-2">Typical Use Cases</p>
            <div className="flex flex-wrap gap-[6px]">
              {uc.map(u => (
                <span key={u} className="text-[12px] font-medium px-[10px] py-1 rounded-full bg-[#EAF2FB] text-[#1A6FC4] border border-[#C4DCF5]">{u}</span>
              ))}
            </div>
          </div>
        )}

        {/* Spec sections */}
        <div className="px-6 py-5">
          {p.cat === 'Energy Meter' ? (
            <>
              {anyVisible('rs485', 'rs232', 'power') && (
                <SpecSection title="Communication">
                  {!isHf('rs485') && <SpecRow label="RS485 / Modbus" value={p.rs485 ? 'Yes' : 'No'} />}
                  {!isHf('rs232') && <SpecRow label="RS232" value={p.rs232 ? 'Yes' : 'No'} />}
                  {!isHf('power') && <SpecRow label="Power supply" value={p.power} />}
                </SpecSection>
              )}
              {anyVisible('housing', 'ip', 'dims', 'weight', 'op_temp') && (
                <SpecSection title="Physical">
                  {!isHf('housing') && <SpecRow label="Enclosure" value={p.housing} />}
                  {p.ip && !isHf('ip') && <SpecRow label="IP Rating" value={p.ip} />}
                  {!isHf('dims') && <SpecRow label="Dimensions" value={p.dims || '—'} />}
                  {!isHf('weight') && <SpecRow label="Weight" value={p.weight || '—'} />}
                  {!isHf('op_temp') && <SpecRow label="Operating temp" value={p.op_temp || '—'} />}
                </SpecSection>
              )}
            </>
          ) : (
            <>
              {anyVisible('cellular_gen', 'wifi', 'ports', 'rs485', 'rs232') && (
                <SpecSection title="Connectivity">
                  {!isHf('cellular_gen') && <SpecRow label="Cellular" value={p.cellular_gen === 'none' ? '-' : p.cell} />}
                  {!isHf('wifi') && <SpecRow label="Wi-Fi" value={wifiLabel(p.wifi)} />}
                  {!isHf('ports') && <SpecRow label="Ethernet ports" value={p.ports > 0 ? `${p.ports} ports` : '-'} />}
                  {!isHf('rs485') && <SpecRow label="RS485" value={p.rs485 ? 'Yes' : 'No'} />}
                  {!isHf('rs232') && <SpecRow label="RS232" value={p.rs232 ? 'Yes' : 'No'} />}
                </SpecSection>
              )}
              {anyVisible('cpu', 'ram', 'storage', 'power', 'ip', 'housing', 'dims', 'weight', 'op_temp') && (
                <SpecSection title="Hardware">
                  {!isHf('cpu') && <SpecRow label="CPU" value={p.cpu} />}
                  {!isHf('ram') && <SpecRow label="RAM" value={p.ram || '—'} />}
                  {!isHf('storage') && <SpecRow label="Storage" value={p.storage || '—'} />}
                  {!isHf('power') && <SpecRow label="Power input" value={p.power} />}
                  {!isHf('ip') && <SpecRow label="IP / Housing" value={p.ip || '-'} />}
                  {!isHf('housing') && <SpecRow label="Enclosure" value={p.housing} />}
                  {!isHf('dims') && <SpecRow label="Dimensions" value={p.dims || '—'} />}
                  {!isHf('weight') && <SpecRow label="Weight" value={p.weight || '—'} />}
                  {!isHf('op_temp') && <SpecRow label="Operating temp" value={p.op_temp || '—'} />}
                </SpecSection>
              )}
              {p.os && p.os !== '—' && !isHf('os') && (
                <SpecSection title="Software">
                  <SpecRow label="Operating system" value={p.os} />
                </SpecSection>
              )}
            </>
          )}

          {p.additional_specs?.length > 0 && (
            <SpecSection title="Additional Specifications">
              {p.additional_specs.map((s, i) => <SpecRow key={i} label={s.k} value={s.v || '—'} />)}
            </SpecSection>
          )}

          {p.variants && <VariantsTable variants={p.variants} partDatasheets={{ ...partDatasheets, ...(p.part_datasheets || {}) }} />}

          {mainDs && (
            <div className="border-t border-[#DDE5EF] mt-0">
              <h4 className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#8DA0B8] mb-[10px] pb-[6px] border-b border-[#DDE5EF] mt-5">
                Datasheet
              </h4>
              <div className="flex items-center gap-[10px] p-[8px_10px] rounded-[6px] bg-[#F7F9FC] border border-[#DDE5EF]">
                <svg className="w-[18px] h-[18px] shrink-0 text-[#e63946]" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="8" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="flex-1 text-[13px] font-medium text-[#0B1F3A] overflow-hidden text-ellipsis whitespace-nowrap">Product Datasheet</span>
                <div className="flex gap-[6px] shrink-0">
                  <button onClick={e => viewFile(mainDs, e.currentTarget)}
                    className="text-[12px] font-semibold px-3 py-1 rounded-[6px] bg-white text-[#1A6FC4] border border-[#1A6FC4] hover:bg-[#1A6FC4] hover:text-white transition-colors">
                    View
                  </button>
                  <button onClick={() => downloadFile(mainDs)}
                    className="text-[12px] font-semibold px-3 py-1 rounded-[6px] bg-[#1A6FC4] text-white border border-[#1A6FC4] hover:bg-[#05059b] transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 pb-[22px] border-t border-[#DDE5EF] flex gap-[10px] items-center">
          <a
            href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Enquiry: ' + p.name)}&body=${encodeURIComponent('Hi Invendis team,\n\nI would like to enquire about the ' + p.name + '.\n\nPlease send me more details.\n\nThank you.')}`}
            className="flex-1 text-center bg-[#1A6FC4] text-white border-none rounded-[6px] px-5 py-[10px] text-[14px] font-semibold cursor-pointer hover:bg-[#05059b] transition-colors no-underline"
          >
            Enquire about this product
          </a>
          <button
            onClick={() => onToggleCompare(p.id)}
            className="bg-transparent border border-[#DDE5EF] text-[#5A6E87] rounded-[6px] px-4 py-[9px] text-[13px] font-medium cursor-pointer hover:border-[#1A6FC4] hover:text-[#1A6FC4] transition-colors whitespace-nowrap"
          >
            {inCompare ? 'Added to compare' : '+ Compare'}
          </button>
        </div>
      </div>
    </div>
  )
}
