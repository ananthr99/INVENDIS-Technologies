import { useAdmin } from '../context/AdminContext'

const CHARS = [
  { char: '·',  title: 'Middle dot — separator (Nokia · Ericsson)' },
  { char: '—',  title: 'Em dash' },
  { char: '→',  title: 'Arrow right' },
  { char: '←',  title: 'Arrow left' },
  { char: '…',  title: 'Ellipsis' },
  { char: '°',  title: 'Degree sign (-40°C)' },
  { char: '×',  title: 'Multiplication (6× ports)' },
  { char: '±',  title: 'Plus-minus' },
]

export default function SpecialCharsBar() {
  const { toast } = useAdmin()

  function insert(char) {
    const el = document.activeElement
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      document.execCommand('insertText', false, char)
    } else {
      navigator.clipboard.writeText(char)
        .then(() => toast(`Copied ${char} — paste with Ctrl+V`, ''))
        .catch(() => {})
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 16px', borderBottom: '1px solid #f3f4f6',
      background: '#fafafa', flexShrink: 0,
    }}>
      <span style={{ fontSize: 11, color: '#9ca3af', marginRight: 2, whiteSpace: 'nowrap' }}>
        Special chars:
      </span>
      {CHARS.map(({ char, title }) => (
        <button
          key={char}
          title={title}
          onMouseDown={e => { e.preventDefault(); insert(char) }}
          style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 5,
            padding: '2px 9px', fontSize: 14, cursor: 'pointer',
            color: '#374151', lineHeight: 1.6, fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          {char}
        </button>
      ))}
      <span style={{ fontSize: 11, color: '#d1d5db', marginLeft: 4 }}>
        Focus a field then click to insert · or click to copy
      </span>
    </div>
  )
}
