import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { readChangelog } from '../github/githubApi'

const PAGE_SIZE = 20

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fullDate(ts) {
  const d = new Date(ts)
  const p = n => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}


const PAGE_COLORS = {
  'Contact':       { bg: '#eff6ff', color: '#1a6fc4' },
  'Site Settings': { bg: '#f0fdf4', color: '#16a34a' },
  'Home':          { bg: '#fef3c7', color: '#d97706' },
  'Company':       { bg: '#faf5ff', color: '#7c3aed' },
  'Sectors':       { bg: '#fff1f2', color: '#e11d48' },
  'Products':      { bg: '#ecfdf5', color: '#059669' },
  'SILBO':         { bg: '#f0f9ff', color: '#0369a1' },
  'Careers':       { bg: '#fff7ed', color: '#c2410c' },
  'Case Studies':  { bg: '#fdf4ff', color: '#9333ea' },
}
function badge(page) {
  return PAGE_COLORS[page] ?? { bg: '#f3f4f6', color: '#6b7280' }
}

const inputSel = {
  padding: '6px 10px', border: '1.5px solid #d1d5db',
  borderRadius: 6, fontSize: 13, background: '#fff', color: '#374151',
}

export default function ActivityLog() {
  const { token, toast } = useAdmin()
  const [entries,    setEntries]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterPage, setFilterPage] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [page,       setPage]       = useState(1)
  const [expanded, setExpanded] = useState(new Set())


  useEffect(() => {
    if (!token) { setLoading(false); return }
    readChangelog(token)
      .then(data => setEntries(data))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = entries.filter(e => {
    if (filterPage && e.page !== filterPage) return false
    if (filterUser && e.user !== filterUser) return false
    if (filterDate) {
      const d = new Date(e.ts), now = new Date()
      if (filterDate === 'today'     && d.toDateString() !== now.toDateString()) return false
      if (filterDate === 'yesterday') {
        const y = new Date(now); y.setDate(y.getDate() - 1)
        if (d.toDateString() !== y.toDateString()) return false
      }
      if (filterDate === 'week')  { const w = new Date(now); w.setDate(w.getDate() - 7);  if (d < w) return false }
      if (filterDate === 'month') { const m = new Date(now); m.setDate(m.getDate() - 30); if (d < m) return false }
    }
    if (search) {
      const q = search.toLowerCase()
      if (![e.user, e.page, e.section, e.action].filter(Boolean).join(' ').toLowerCase().includes(q)) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const uniquePages = [...new Set(entries.map(e => e.page))].filter(Boolean).sort()
  const uniqueUsers = [...new Set(entries.map(e => e.user))].filter(Boolean).sort()
  const hasFilters  = search || filterPage || filterUser || filterDate

  function reset() { setSearch(''); setFilterPage(''); setFilterUser(''); setFilterDate(''); setPage(1) }

  if (loading) return (
    <div className="tab-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" />
      <span style={{ fontSize: 13, color: '#6b7280' }}>Loading activity log…</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Filter bar ── */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', background: '#fafafa' }}>
        <input
          placeholder="Search…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputSel, flex: '1 1 160px', minWidth: 140 }}
        />
        <select value={filterPage} onChange={e => { setFilterPage(e.target.value); setPage(1) }} style={inputSel}>
          <option value="">All Pages</option>
          {uniquePages.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterUser} onChange={e => { setFilterUser(e.target.value); setPage(1) }} style={inputSel}>
          <option value="">All Users</option>
          {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1) }} style={inputSel}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        {hasFilters && (
          <button onClick={reset} style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* ── Entry list ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {!token ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '48px 0' }}>
            GitHub token not configured — go to Setup first.
          </p>
        ) : visible.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '48px 0' }}>
            {hasFilters ? 'No entries match your filters.' : 'No activity recorded yet.'}
          </p>
        ) : visible.map((e, i) => {
          const { bg, color } = badge(e.page)
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 0', borderBottom: '1px solid #f3f4f6' }}>

              {/* WHERE */}
              <div style={{ minWidth: 112, flexShrink: 0 }}>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: bg, color, borderRadius: 4, padding: '2px 8px' }}>
                  {e.page}
                </span>
                {e.section && (
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{e.section}</p>
                )}
              </div>

              {/* WHAT */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>{e.action}</p>
                {e.changes?.length > 0 && (() => {
                  const key = `${e.ts}-${e.user}`
                  const isOpen = expanded.has(key)
                  const shown = isOpen ? e.changes : e.changes.slice(0, 2)
                  return (
                    <div style={{ marginTop: 5 }}>
                      {shown.map((c, ci) => (
                        <div key={ci} style={{ display: 'flex', gap: 4, fontSize: 11, color: '#6b7280', marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'monospace', color: '#374151', background: '#f3f4f6', padding: '1px 5px', borderRadius: 3, flexShrink: 0 }}>{c.field}</span>
                          <span style={{ background: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: 3, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.from}</span>
                          <span style={{ color: '#9ca3af' }}>→</span>
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: 3, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.to}</span>
                        </div>
                      ))}
                      {e.changes.length > 2 && (
                        <button
                          onClick={() => setExpanded(prev => { const s = new Set(prev); isOpen ? s.delete(key) : s.add(key); return s })}
                          style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginTop: 2, textDecoration: 'underline' }}
                        >
                          {isOpen ? 'Show less' : `+${e.changes.length - 2} more`}
                        </button>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* WHO + WHEN */}
              <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 160 }}>
                <p style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{e.user}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>{timeAgo(e.ts)}</p>
                <p style={{ fontSize: 10, color: '#d1d5db', marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>{fullDate(e.ts)}</p>
              </div>

            </div>
          )
        })}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '10px 16px', borderTop: '1px solid #e5e7eb' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{ padding: '5px 14px', border: '1.5px solid #d1d5db', borderRadius: 6, fontSize: 13, background: page === 1 ? '#f9fafb' : '#fff', color: page === 1 ? '#d1d5db' : '#374151', cursor: page === 1 ? 'default' : 'pointer' }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: '#6b7280' }}>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: '5px 14px', border: '1.5px solid #d1d5db', borderRadius: 6, fontSize: 13, background: page === totalPages ? '#f9fafb' : '#fff', color: page === totalPages ? '#d1d5db' : '#374151', cursor: page === totalPages ? 'default' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  )
}
