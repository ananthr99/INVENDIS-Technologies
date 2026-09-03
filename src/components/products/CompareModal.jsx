import { useState } from 'react'
import { catColors, wifiLabel } from '../../utils/productHelpers'

// hKey = the key checked inside a product's hidden_fields array.
// null means the field is never hideable (e.g. Category).
const FIELDS = [
  { label: 'Category',       key: 'cat',          hKey: null },
  { label: 'CPU',            key: 'cpu',          hKey: 'cpu' },
  { label: 'RAM',            key: 'ram',          hKey: 'ram' },
  { label: 'Cellular',       key: 'cellular_gen', hKey: 'cellular_gen' },
  { label: 'Wi-Fi',          special: 'wifi',     hKey: 'wifi' },
  { label: 'Ethernet ports', special: 'ports',    hKey: 'ports' },
  { label: 'Power input',    key: 'power',        hKey: 'power' },
  { label: 'RS485',          key: 'rs485', bool: true, hKey: 'rs485' },
  { label: 'RS232',          key: 'rs232', bool: true, hKey: 'rs232' },
  { label: 'IP rating',      key: 'ip',           hKey: 'ip' },
  { label: 'Enclosure',      key: 'housing',      hKey: 'housing' },
  { label: 'Dimensions',     key: 'dims',         hKey: 'dims' },
  { label: 'Weight',         key: 'weight',       hKey: 'weight' },
  { label: 'Operating temp', key: 'op_temp',      hKey: 'op_temp' },
  { label: 'OS',             key: 'os',           hKey: 'os' },
]

function isFieldHidden(p, hKey) {
  return hKey != null && (p.hidden_fields || []).includes(hKey)
}

function getVal(p, field) {
  if (field.special === 'wifi') return wifiLabel(p.wifi)
  if (field.special === 'ports') return p.ports > 0 ? `${p.ports} ports` : '-'
  if (field.bool) return p[field.key] ? 'Yes' : 'No'
  return p[field.key] || '—'
}

export default function CompareModal({ compareIds, products, onClose }) {
  const selected = products.filter(p => compareIds.has(p.id))
  const [copyLabel, setCopyLabel] = useState('Copy table')

  function copyTable() {
    // Only include rows visible in the table (skip all-hidden rows)
    const visibleFields = FIELDS.filter(f =>
      f.hKey == null || !selected.every(p => isFieldHidden(p, f.hKey))
    )
    const rows = [
      ['Specification', ...selected.map(p => p.name)],
      ...visibleFields.map(f => [
        f.label,
        ...selected.map(p => isFieldHidden(p, f.hKey) ? 'Not applicable' : getVal(p, f)),
      ]),
    ]
    const text = rows.map(r => r.join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy table'), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(11,31,58,0.45)]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[900px] max-h-[90vh] overflow-hidden rounded-[14px] shadow-[0_8px_40px_rgba(11,31,58,0.16)] flex flex-col">

        {/* Floating close button */}
        <div className="sticky top-0 z-10 h-0 overflow-visible flex justify-end pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto relative top-3 mr-[14px] w-[30px] h-[30px] bg-[#F7F9FC] rounded-full border-none cursor-pointer flex items-center justify-center text-[18px] text-[#5A6E87] leading-none shadow-[0_1px_4px_rgba(11,31,58,0.12)] hover:bg-[#DDE5EF] hover:text-[#0B1F3A] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 pb-[18px] border-b border-[#DDE5EF]">
          <h2 className="text-[20px] font-bold text-[#0B1F3A] mt-2 tracking-[-0.2px]">Product comparison</h2>
          <p className="text-[13px] text-[#5A6E87] mt-[6px]">Rows highlighted in yellow have differing values between products.</p>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-[13px] border-collapse">
            <thead className="sticky top-0 bg-white border-b-2 border-[#DDE5EF] z-10">
              <tr>
                <th className="px-4 py-3 text-left text-[#5A6E87] font-medium min-w-[140px] bg-[#F7F9FC]">Specification</th>
                {selected.map(p => (
                  <th key={p.id} className="px-4 py-3 text-left min-w-[180px] font-semibold text-[#0B1F3A] whitespace-nowrap">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded tracking-[0.04em] uppercase mb-1 ${catColors[p.cat] || catColors.Other}`}>
                      {p.cat}
                    </span>
                    <br />{p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(field => {
                // Hide the entire row when every compared product has this field hidden
                if (field.hKey != null && selected.every(p => isFieldHidden(p, field.hKey))) return null

                const vals = selected.map(p =>
                  isFieldHidden(p, field.hKey) ? null : getVal(p, field)
                )
                // Row is "diff" when values differ — null (N/A) counts as different from any real value
                const allSame = vals.every(v => v !== null) && vals.every(v => v === vals[0])

                return (
                  <tr key={field.label} className={`border-t border-[#DDE5EF] ${!allSame ? 'bg-[#FEFDF0]' : 'hover:bg-[#F7F9FC]'}`}>
                    <td className="px-4 py-[10px] text-[#5A6E87] font-medium text-[12px] bg-[#F7F9FC]">{field.label}</td>
                    {vals.map((v, i) => (
                      v === null
                        ? <td key={i} className="px-4 py-[10px] text-[#A0AABF] italic text-[12px]">Not applicable</td>
                        : <td key={i} className={`px-4 py-[10px] text-[#0B1F3A] ${!allSame ? 'font-semibold' : ''}`}>{v}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#DDE5EF] flex gap-[10px] flex-wrap">
          <a
            href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Enquiry: ' + selected.map(p => p.name).join(', '))}`}
            className="flex-1 text-center bg-[#1A6FC4] text-white rounded-[6px] px-5 py-[10px] text-[14px] font-semibold hover:bg-[#05059b] transition-colors no-underline"
          >
            Enquire about these products
          </a>
          <button onClick={copyTable}
            className="bg-transparent border border-[#DDE5EF] text-[#5A6E87] rounded-[6px] px-4 py-[9px] text-[13px] font-medium hover:border-[#1A6FC4] hover:text-[#1A6FC4] transition-colors cursor-pointer">
            {copyLabel}
          </button>
          <button onClick={() => window.print()}
            className="bg-transparent border border-[#DDE5EF] text-[#5A6E87] rounded-[6px] px-4 py-[9px] text-[13px] font-medium hover:border-[#1A6FC4] hover:text-[#1A6FC4] transition-colors cursor-pointer">
            Print / PDF
          </button>
          <button onClick={onClose}
            className="bg-transparent border border-[#DDE5EF] text-[#5A6E87] rounded-[6px] px-4 py-[9px] text-[13px] font-medium hover:border-[#1A6FC4] hover:text-[#1A6FC4] transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
