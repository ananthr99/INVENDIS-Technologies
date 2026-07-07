import { X } from 'lucide-react'
import { catColors, wifiLabel } from '../../utils/productHelpers'

const FIELDS = [
  { label: 'Category',       key: 'cat' },
  { label: 'CPU',            key: 'cpu' },
  { label: 'RAM',            key: 'ram' },
  { label: 'Cellular',       key: 'cellular_gen' },
  { label: 'Wi-Fi',          special: 'wifi' },
  { label: 'Ethernet ports', special: 'ports' },
  { label: 'Power input',    key: 'power' },
  { label: 'RS485',          key: 'rs485', bool: true },
  { label: 'RS232',          key: 'rs232', bool: true },
  { label: 'IP rating',      key: 'ip' },
  { label: 'Enclosure',      key: 'housing' },
  { label: 'Dimensions',     key: 'dims' },
  { label: 'Weight',         key: 'weight' },
  { label: 'Operating temp', key: 'op_temp' },
  { label: 'OS',             key: 'os' },
]

function getVal(p, field) {
  if (field.special === 'wifi') return wifiLabel(p.wifi)
  if (field.special === 'ports') return p.ports > 0 ? `${p.ports} ports` : 'N/A'
  if (field.bool) return p[field.key] ? 'Yes' : 'No'
  return p[field.key] || '—'
}

export default function CompareModal({ compareIds, products, onClose }) {
  const selected = products.filter(p => compareIds.has(p.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-sora font-bold text-xl text-brand-text">Product Comparison</h2>
            <p className="text-brand-muted text-sm">Rows highlighted in yellow differ between products.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X size={20} className="text-brand-muted" />
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-brand-muted font-medium min-w-36">Specification</th>
                {selected.map(p => (
                  <th key={p.id} className="px-4 py-3 text-left min-w-44">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${catColors[p.cat] || catColors.Other}`}>
                      {p.cat}
                    </span>
                    <div className="font-sora font-bold text-brand-text">{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(field => {
                const vals = selected.map(p => getVal(p, field))
                const allSame = vals.every(v => v === vals[0])
                return (
                  <tr key={field.label} className={`border-t border-gray-100 ${!allSame ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-2.5 text-brand-muted font-medium">{field.label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`px-4 py-2.5 text-brand-text ${!allSame ? 'font-semibold' : ''}`}>{v}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <a
            href={`mailto:sales@invendis.com?subject=${encodeURIComponent('Enquiry: ' + selected.map(p => p.name).join(', '))}`}
            className="flex-1 text-center py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
          >
            Enquire about these products
          </a>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-brand-muted text-sm font-semibold rounded-xl hover:border-brand-blue hover:text-brand-blue transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
