import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../github/githubApi'
import { logChange } from '../utils/logChange'

const FILE_PATH     = 'public/content/servedCountries.json'
const GH_PAGES_PATH = 'content/servedCountries.json'

export default function Countries() {
  const { token, toast, userEmail } = useAdmin()
  const [data,         setData]         = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [sha,          setSha]          = useState('')
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [search,       setSearch]       = useState('')

  useEffect(() => {
    async function load() {
      try {
        const result = await readFile(FILE_PATH, token)
        const parsed = JSON.parse(result.content)
        setData(parsed)
        setOriginalData(parsed)
        setSha(result.sha)
      } catch (e) {
        toast(e.message, 'err')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const json = JSON.stringify(data, null, 2)
      let ghSha = null
      try { ghSha = (await readFileDirect(GH_PAGES_PATH, token)).sha } catch {}
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update served countries', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update served countries [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Countries', section: 'Countries List', token, before: originalData, after: data })
      setOriginalData(structuredClone(data))
      toast('Saved — live in seconds', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  function update(i, field, value) {
    setData(prev => {
      const next = structuredClone(prev)
      next.countries[i][field] = value
      return next
    })
  }

  function updateCoord(i, axis, value) {
    setData(prev => {
      const next = structuredClone(prev)
      const coords = [...next.countries[i].coords]
      coords[axis] = value === '' ? '' : Number(value)
      next.countries[i].coords = coords
      return next
    })
  }

  function add() {
    setData(prev => {
      const next = structuredClone(prev)
      next.countries.push({ name: '', flag: '', coords: [0, 0], id: '' })
      return next
    })
  }

  function remove(i) {
    setData(prev => {
      const next = structuredClone(prev)
      next.countries.splice(i, 1)
      return next
    })
  }

  function sortAlpha() {
    setData(prev => {
      const next = structuredClone(prev)
      next.countries.sort((a, b) => a.name.localeCompare(b.name))
      return next
    })
  }

  if (loading) return (
    <div className="tab-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading countries…</span>
    </div>
  )
  if (!data) return null

  const filtered = search.trim()
    ? data.countries.map((c, i) => ({ c, i })).filter(({ c }) => c.name.toLowerCase().includes(search.toLowerCase()))
    : data.countries.map((c, i) => ({ c, i }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Toolbar */}
      <div className="tab-bar" style={{ flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', padding: '0 12px' }}>
          {data.countries.length} {data.countries.length === 1 ? 'Country' : 'Countries'}
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          style={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', width: 180, outline: 'none' }}
        />
        <div style={{ flex: 1 }} />
        <button
          onClick={sortAlpha}
          style={{ fontSize: 12, color: '#374151', background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', marginRight: 8 }}
        >
          Sort A–Z
        </button>
        <button className="btn-add" style={{ margin: '0 8px' }} onClick={add}>+ Add Country</button>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Publishing…' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Info note */}
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, margin: '12px 20px 0', padding: '10px 14px', fontSize: 12, color: '#0369a1', flexShrink: 0 }}>
        The <strong>UN ID</strong> is used to highlight the country on the world map. Find IDs at <code style={{ background: '#e0f2fe', padding: '1px 4px', borderRadius: 3 }}>topojson/world-atlas</code> on GitHub. Coordinates are approximate [longitude, latitude] — precision is not critical at map scale.
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 90px 90px 90px 80px', gap: 6, padding: '10px 20px 4px', flexShrink: 0 }}>
        {['Flag', 'Country Name', 'UN ID', 'Longitude', 'Latitude', '', ''].map((h, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
        ))}
      </div>

      {/* Country list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, color: '#9ca3af' }}>
            {search ? 'No countries match your search.' : 'No countries yet — click + Add Country.'}
          </div>
        )}
        {filtered.map(({ c, i }) => (
          <div
            key={i}
            style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 90px 90px 90px 80px', gap: 6, alignItems: 'center', marginBottom: 5 }}
          >
            <input
              value={c.flag}
              onChange={e => update(i, 'flag', e.target.value)}
              placeholder="🇮🇳"
              style={{ fontSize: 18, textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 4px', width: '100%', outline: 'none' }}
            />
            <input
              value={c.name}
              onChange={e => update(i, 'name', e.target.value)}
              placeholder="Country name"
              style={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px', width: '100%', outline: 'none' }}
            />
            <input
              value={c.id}
              onChange={e => update(i, 'id', e.target.value)}
              placeholder="356"
              style={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px', width: '100%', outline: 'none' }}
            />
            <input
              type="number"
              value={c.coords[0]}
              onChange={e => updateCoord(i, 0, e.target.value)}
              placeholder="Lon"
              style={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 8px', width: '100%', outline: 'none' }}
            />
            <input
              type="number"
              value={c.coords[1]}
              onChange={e => updateCoord(i, 1, e.target.value)}
              placeholder="Lat"
              style={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 8px', width: '100%', outline: 'none' }}
            />
            <span style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>{c.flag}</span>
            <button className="btn-del" onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
