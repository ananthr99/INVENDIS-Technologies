import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { readChangelog, writeChangelog } from '../github/githubApi'

const PAGE_SIZE = 20

function fullDate(ts) {
  return new Date(ts).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function timeLabel(ts) {
  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const raw = fmt(new Date(ts))
  const today = fmt(new Date())
  const yesterday = fmt(new Date(Date.now() - 86400000))
  return raw === today ? 'Today' : raw === yesterday ? 'Yesterday' : raw
}

function timeOfDay(ts) {
  const d = new Date(ts)
  const p = n => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function ActivityLog() {
  const { token, toast } = useAdmin()
  const [allEntries, setAllEntries] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterWhen, setFilterWhen] = useState('')
  const [filterType, setFilterType] = useState('')
  const [page,       setPage]       = useState(1)
  const [selected,   setSelected]   = useState(new Set())
  const [selectAll,  setSelectAll]  = useState(false)
  const [modal,      setModal]      = useState(null)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    load()
  }, [])

  function load() {
    setLoading(true)
    readChangelog(token)
      .then(data => setAllEntries(data))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false))
  }

  const filteredWithIdx = allEntries
    .map((e, idx) => ({ e, idx }))
    .filter(({ e }) => {
      if (filterUser && e.user !== filterUser) return false
      if (filterType) {
        const a = (e.action || '').toLowerCase()
        if (filterType === 'added'   && !a.includes('add'))   return false
        if (filterType === 'updated' && !a.includes('updat')) return false
        if (filterType === 'deleted' && !a.includes('delet')) return false
      }
      if (filterWhen) {
        const ts = new Date(e.ts)
        const now = Date.now()
        const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
        const startOfYest = new Date(startOfToday.getTime() - 86400000)
        if (filterWhen === 'today'     && ts < startOfToday) return false
        if (filterWhen === 'yesterday' && (ts < startOfYest || ts >= startOfToday)) return false
        if (filterWhen === 'week'  && ts < new Date(now - 7  * 86400000)) return false
        if (filterWhen === 'month' && ts < new Date(now - 30 * 86400000)) return false
      }
      if (search) {
        const q = search.toLowerCase()
        if (![(e.user || ''), (e.action || ''), (e.page || ''), (e.section || '')]
              .some(s => s.toLowerCase().includes(q))) return false
      }
      return true
    })

  const totalPages = Math.max(1, Math.ceil(filteredWithIdx.length / PAGE_SIZE))
  const pageItems  = filteredWithIdx.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const uniqueUsers = [...new Set(allEntries.map(e => e.user).filter(Boolean))].sort()
  const hasFilters  = search || filterUser || filterWhen || filterType

  const start = filteredWithIdx.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const end   = Math.min(page * PAGE_SIZE, filteredWithIdx.length)

  function clearFilters() {
    setSearch(''); setFilterUser(''); setFilterWhen(''); setFilterType('')
    setPage(1); setSelected(new Set()); setSelectAll(false)
  }

  function toggleSelect(idx) {
    setSelected(prev => {
      const s = new Set(prev)
      s.has(idx) ? s.delete(idx) : s.add(idx)
      return s
    })
  }

  function toggleSelectAll(checked) {
    setSelectAll(checked)
    setSelected(checked ? new Set(pageItems.map(({ idx }) => idx)) : new Set())
  }

  async function deleteSelected() {
    if (!selected.size) { toast('Select entries to delete first', 'err'); return }
    if (!confirm(`Delete ${selected.size} selected log ${selected.size === 1 ? 'entry' : 'entries'}?`)) return
    const remaining = allEntries.filter((_, i) => !selected.has(i))
    try {
      await writeChangelog(remaining, token)
      setAllEntries(remaining)
      setSelected(new Set()); setSelectAll(false)
      toast(`Deleted ${selected.size} log ${selected.size === 1 ? 'entry' : 'entries'}`, 'ok')
    } catch (e) {
      toast('Delete failed: ' + e.message, 'err')
    }
  }

  async function deleteAll() {
    if (!confirm('Delete all activity log entries? This cannot be undone.')) return
    try {
      await writeChangelog([], token)
      setAllEntries([])
      setSelected(new Set()); setSelectAll(false)
      toast('Activity log cleared', 'ok')
    } catch (e) {
      toast('Failed: ' + e.message, 'err')
    }
  }

  const groups = {}
  pageItems.forEach(({ e, idx }) => {
    const label = timeLabel(e.ts)
    if (!groups[label]) groups[label] = []
    groups[label].push({ e, idx })
  })

  if (loading) return (
    <div className="changelog-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" />
      <span style={{ fontSize: 13, color: '#6b7280' }}>Loading activity log…</span>
    </div>
  )

  return (
    <div className="changelog-panel">

      {/* Header */}
      <div className="changelog-header">
        <h2>Activity Log</h2>
        <button className="btn-refresh" onClick={load}>Refresh</button>
      </div>

      {/* Filters */}
      {allEntries.length > 0 && (
        <div className="log-filters">
          <input
            type="text"
            placeholder="Search by page, user or change…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          <select value={filterUser} onChange={e => { setFilterUser(e.target.value); setPage(1) }}>
            <option value="">All users</option>
            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={filterWhen} onChange={e => { setFilterWhen(e.target.value); setPage(1) }}>
            <option value="">All time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}>
            <option value="">All types</option>
            <option value="added">Added</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
          </select>
          {hasFilters && (
            <button className="btn-clear-filters" onClick={clearFilters}>Clear</button>
          )}
        </div>
      )}

      {/* Toolbar */}
      {allEntries.length > 0 && (
        <div className="log-toolbar">
          <div className="log-toolbar-left">
            <input
              type="checkbox"
              id="logSelectAll"
              checked={selectAll}
              onChange={e => toggleSelectAll(e.target.checked)}
            />
            <label htmlFor="logSelectAll">Select all</label>
          </div>
          <button className="btn-log-del" onClick={deleteSelected}>Delete Selected</button>
          <button className="btn-log-del danger" onClick={deleteAll}>Delete All</button>
        </div>
      )}

      {/* Content */}
      {!token ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>GitHub token not configured — go to Setup first.</p>
      ) : allEntries.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>No activity recorded yet — changes will appear here after the first save.</p>
      ) : filteredWithIdx.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>No entries match the current filters.</p>
      ) : (
        Object.entries(groups).map(([label, items]) => (
          <div className="log-date-group" key={label}>
            <div className="log-date-label">{label}</div>
            {items.map(({ e, idx }) => (
              <div className="log-entry" key={idx}>
                <input
                  type="checkbox"
                  className="log-entry-cb"
                  checked={selected.has(idx)}
                  onChange={() => toggleSelect(idx)}
                />
                <div className="log-entry-dot" />
                <div className="log-body">
                  <div className="log-action">{e.action}</div>
                  {e.changes?.length > 0 && (
                    <div className="log-changes">
                      {e.changes.map(c => `${c.field}: ${c.from} → ${c.to}`).join(' · ')}
                    </div>
                  )}
                  <div className="log-meta-row">
                    {e.user} · {timeOfDay(e.ts)}
                    {e.changes?.length > 0 && (
                      <button className="btn-log-details" onClick={() => setModal(e)}>Details</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="log-pagination">
          <span className="log-page-info">Showing {start}–{end} of {filteredWithIdx.length}</span>
          <div className="log-page-btns">
            <button className="log-pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            <span className="log-page-cur">{page} / {totalPages}</span>
            <button className="log-pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          </div>
        </div>
      )}

      {/* Details modal */}
      {modal && (
        <div
          className="log-diff-overlay"
          onClick={ev => { if (ev.target === ev.currentTarget) setModal(null) }}
        >
          <div className="log-diff-box">
            <div className="log-diff-header">
              <div className="log-diff-header-text">
                <div className="log-diff-title">{modal.action}</div>
                <div className="log-diff-meta">{modal.user} · {fullDate(modal.ts)}</div>
              </div>
              <button className="log-diff-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="log-diff-body">
              {!modal.changes?.length ? (
                <p className="diff-empty">No detailed changes recorded for this entry.</p>
              ) : (
                <div className="diff-section">
                  <div className="diff-section-title">Changed Fields</div>
                  <table className="diff-table">
                    <thead>
                      <tr>
                        <th>Field</th><th>Before</th><th></th><th>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modal.changes.map((c, i) => (
                        <tr key={i}>
                          <td className="diff-key">{c.field}</td>
                          <td className="diff-old">{c.from}</td>
                          <td className="diff-arrow">→</td>
                          <td className="diff-new">{c.to}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="log-diff-footer">
              <button className="confirm-btn-cancel" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
