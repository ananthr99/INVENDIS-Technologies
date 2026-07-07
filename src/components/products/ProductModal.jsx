import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { catColors, wifiLabel, downloadFile } from '../../utils/productHelpers'

function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-brand-muted shrink-0 w-36">{label}</span>
      <span className="text-sm text-brand-text text-right">{value}</span>
    </div>
  )
}

function SpecSection({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="font-sora font-semibold text-brand-blue text-xs uppercase tracking-wider mb-3 pb-1 border-b-2 border-brand-blue/10">
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
    <div className="mb-6">
      <h4 className="font-sora font-semibold text-brand-blue text-xs uppercase tracking-wider mb-3 pb-1 border-b-2 border-brand-blue/10">
        Product Variants
      </h4>
      {variants.note && <p className="text-sm text-brand-muted mb-3">{variants.note}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              {variants.headers.map((h, i) => (
                <th key={i} className={`px-3 py-2 text-left font-semibold text-brand-text ${i === partNoIdx ? 'font-mono' : ''}`}>{h}</th>
              ))}
              {hasDs && <th className="px-3 py-2 text-left font-semibold text-brand-text">Data Sheet</th>}
            </tr>
          </thead>
          <tbody>
            {variants.rows.map((row, ri) => {
              const pn = dsKey(row[row.length - 1])
              const file = hasDs ? partDatasheets[pn] : null
              return (
                <tr key={ri} className="border-t border-gray-100 hover:bg-gray-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-2
                      ${ci === partNoIdx ? 'font-mono' : ''}
                      ${cell === '✓' ? 'text-emerald-600 font-semibold' : ''}
                      ${cell === '—' ? 'text-gray-300' : 'text-brand-text'}`}>
                      {cell}
                    </td>
                  ))}
                  {hasDs && (
                    <td className="px-3 py-2">
                      {file ? (
                        <div className="flex gap-2">
                          <a href={file} target="_blank" rel="noopener" className="text-brand-blue hover:underline">View</a>
                          <button onClick={() => downloadFile(file)} className="text-brand-muted hover:text-brand-blue">↓</button>
                        </div>
                      ) : (
                        <a
                          href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Datasheet Request: ' + pn)}&body=${encodeURIComponent('Hi Invendis team,\n\nI would like to request the datasheet for ' + pn + '.\n\nThank you.')}`}
                          className="text-brand-muted hover:text-brand-blue"
                        >Contact us</a>
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
  const imgs = images[p.id] || []
  const uc = useCases[p.id] || []
  const mainDs = datasheets[p.id]
  const inCompare = compareIds.has(p.id)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl">

        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-3 flex justify-end z-10">
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-brand-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="mb-4 pt-2">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${catColors[p.cat] || catColors.Other}`}>
              {p.cat}
            </span>
            <h2 className="font-sora font-bold text-2xl text-brand-text mb-1">{p.name}</h2>
            <p className="text-brand-muted text-sm leading-relaxed">{p.desc}</p>
          </div>

          {imgs.length > 0 && (
            <div className="relative flex items-center justify-center bg-gray-50 rounded-xl mb-5 p-6 h-56">
              <img src={imgs[imgIdx]} alt={p.name} className="max-h-full max-w-full object-contain" />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 p-1.5 bg-white rounded-full shadow hover:shadow-md"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                    className="absolute right-3 p-1.5 bg-white rounded-full shadow hover:shadow-md"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 right-4 text-xs text-brand-muted">
                    {imgIdx + 1} / {imgs.length}
                  </div>
                </>
              )}
            </div>
          )}

          {uc.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Typical Use Cases</p>
              <div className="flex flex-wrap gap-2">
                {uc.map(u => (
                  <span key={u} className="text-xs px-2.5 py-1 rounded-full bg-brand-light text-brand-text border border-gray-200">{u}</span>
                ))}
              </div>
            </div>
          )}

          <SpecSection title="Connectivity">
            <SpecRow label="Cellular" value={p.cellular_gen === 'none' ? 'None' : p.cell} />
            <SpecRow label="Wi-Fi" value={wifiLabel(p.wifi)} />
            <SpecRow label="Ethernet ports" value={p.ports > 0 ? `${p.ports} ports` : 'N/A'} />
            <SpecRow label="RS485" value={p.rs485 ? 'Yes' : 'No'} />
            <SpecRow label="RS232" value={p.rs232 ? 'Yes' : 'No'} />
          </SpecSection>

          <SpecSection title="Hardware">
            <SpecRow label="CPU" value={p.cpu} />
            <SpecRow label="RAM" value={p.ram || '—'} />
            <SpecRow label="Storage" value={p.storage || '—'} />
            <SpecRow label="Power input" value={p.power} />
            <SpecRow label="IP / Housing" value={p.ip || 'Not specified'} />
            <SpecRow label="Enclosure" value={p.housing} />
            <SpecRow label="Dimensions" value={p.dims || '—'} />
            <SpecRow label="Weight" value={p.weight || '—'} />
            <SpecRow label="Operating temp" value={p.op_temp || '—'} />
          </SpecSection>

          {p.os && p.os !== '—' && (
            <SpecSection title="Software">
              <SpecRow label="Operating system" value={p.os} />
            </SpecSection>
          )}

          {p.variants && <VariantsTable variants={p.variants} partDatasheets={partDatasheets} />}

          {mainDs && (
            <div className="mb-5 p-4 bg-brand-light rounded-xl flex items-center gap-3">
              <FileText size={20} className="text-brand-blue shrink-0" />
              <span className="text-sm font-medium text-brand-text flex-1">Product Datasheet</span>
              <div className="flex gap-2">
                <a href={mainDs} target="_blank" rel="noopener"
                  className="text-xs px-3 py-1.5 bg-brand-blue text-white rounded-lg hover:bg-blue-800 transition-colors">
                  View
                </a>
                <button onClick={() => downloadFile(mainDs)}
                  className="text-xs px-3 py-1.5 border border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors">
                  Download
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <a
              href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Enquiry: ' + p.name)}&body=${encodeURIComponent('Hi Invendis team,\n\nI would like to enquire about the ' + p.name + '.\n\nPlease send me more details.\n\nThank you.')}`}
              className="flex-1 text-center py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
            >
              Enquire about this product
            </a>
            <button
              onClick={() => onToggleCompare(p.id)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors
                ${inCompare
                  ? 'bg-brand-blue/10 text-brand-blue border-brand-blue'
                  : 'border-gray-200 text-brand-muted hover:border-brand-blue hover:text-brand-blue'}`}
            >
              {inCompare ? 'Added to compare' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
