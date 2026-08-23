import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'
import { usePagination, ListHeader, Pager } from '../../components/Pagination'

const FILE_PATH     = 'public/content/pages/sectors.json'
const GH_PAGES_PATH = 'content/pages/sectors.json'
const TABS = ['Hero', 'Sectors', 'Global Reach', 'CTA Banner']

export default function SectorsPage() {
  const { token, toast, userEmail, setDirty } = useAdmin()
  const [data,         setData]         = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [sha,          setSha]          = useState('')
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [activeTab,    setActiveTab]    = useState('Hero')

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

  useEffect(() => {
    if (data && originalData) {
      setDirty(JSON.stringify(data) !== JSON.stringify(originalData))
    }
  }, [data, originalData])

  useEffect(() => () => setDirty(false), [])

  async function handleSave() {
    setSaving(true)
    try {
      const json = JSON.stringify(data, null, 2)
      let ghSha = null
      try { ghSha = (await readFileDirect(GH_PAGES_PATH, token)).sha } catch {}
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update sectors page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update sectors page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Sectors', section: activeTab, token, before: originalData, after: data })
      setOriginalData(structuredClone(data))
      toast('Saved — live in seconds', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  function patch(updater) { setData(prev => updater(structuredClone(prev))) }

  if (loading) return (
    <div className="tab-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading sectors page…</span>
    </div>
  )
  if (!data) return null

  return (
    <>
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t} className={`tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Publishing…' : 'Save & Publish'}</button>
        </div>
      </div>
      <div className="tab-panel">
        {activeTab === 'Hero'         && <HeroTab         data={data} patch={patch} />}
        {activeTab === 'Sectors'      && <SectorsTab      data={data} patch={patch} />}
        {activeTab === 'Global Reach' && <GlobalReachTab  data={data} patch={patch} />}
        {activeTab === 'CTA Banner'   && <CTABannerTab    data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Hero ── */
function HeroTab({ data, patch }) {
  const s = (f, v) => patch(d => { d.hero[f] = v; return d })
  return (
    <div className="form-section">
      <p className="form-section-title">Hero Section</p>
      <div className="field"><label>Eyebrow</label><input value={data.hero.eyebrow} onChange={e => s('eyebrow', e.target.value)} /></div>
      <div className="field-grid">
        <div className="field"><label>Headline</label><input value={data.hero.headline} onChange={e => s('headline', e.target.value)} /></div>
        <div className="field"><label>Headline Accent</label><input value={data.hero.headlineAccent} onChange={e => s('headlineAccent', e.target.value)} /></div>
      </div>
      <div className="field"><label>Description</label><textarea rows={3} value={data.hero.description} onChange={e => s('description', e.target.value)} /></div>
    </div>
  )
}

/* ── Sectors ── */
function SectorsTab({ data, patch }) {
  const [addModal, setAddModal] = useState(false)
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.sectors, 5)
  function update(i, f, v) { patch(d => { d.sectors[i][f] = v; return d }) }
  function updateSolution(i, si, v) { patch(d => { d.sectors[i].solutions[si] = v; return d }) }
  function addSolution(i)  { patch(d => { d.sectors[i].solutions.push(''); return d }) }
  function removeSolution(i, si) { patch(d => { d.sectors[i].solutions.splice(si, 1); return d }) }
  function handleAdd(item) {
    patch(d => { d.sectors.push({ ...item, solutions: [] }); return d })
    setAddModal(false)
  }
  function remove(i){ patch(d => { d.sectors.splice(i, 1); return d }) }

  return (
    <div className="form-section">
      <ListHeader title="Sector Cards" count={data.sectors.length} onAdd={() => setAddModal(true)} addLabel="+ Add Sector" />
      {pageItems.map(({ item: sector, index: i }) => (
        <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sector {i + 1}</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!sector.featured} onChange={e => update(i, 'featured', e.target.checked)} />
                Featured
              </label>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label>Icon <span className="hint">— radio · sun · zap · cpu · leaf</span></label>
              <input value={sector.icon} onChange={e => update(i, 'icon', e.target.value)} />
            </div>
            <div className="field">
              <label>Icon Background <span className="hint">— blue · amber · green · red</span></label>
              <input value={sector.iconBg} onChange={e => update(i, 'iconBg', e.target.value)} />
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label>Title</label>
              <input value={sector.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field">
              <label>Chip <span className="hint">— optional badge (e.g. "Core Vertical")</span></label>
              <input value={sector.chip ?? ''} onChange={e => update(i, 'chip', e.target.value)} placeholder="optional" />
            </div>
          </div>
          <div className="field"><label>Clients <span className="hint">— optional, shown below solutions</span></label><input value={sector.clients ?? ''} onChange={e => update(i, 'clients', e.target.value)} placeholder="Nokia · Ericsson" /></div>
          <div className="field"><label>Description</label><textarea rows={3} value={sector.desc} onChange={e => update(i, 'desc', e.target.value)} /></div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Solutions</p>
          {sector.solutions.map((sol, si) => (
            <div key={si} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'center' }}>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                <input value={sol} onChange={e => updateSolution(i, si, e.target.value)} placeholder="Solution name" />
              </div>
              <button className="btn-del" onClick={() => removeSolution(i, si)}>×</button>
            </div>
          ))}
          <button className="btn-add" style={{ marginTop: 4 }} onClick={() => addSolution(i)}>+ Add Solution</button>
        </div>
      ))}
      <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
      {addModal && <AddSectorModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}
    </div>
  )
}

function AddSectorModal({ onSave, onCancel }) {
  const [icon,     setIcon]     = useState('cpu')
  const [iconBg,   setIconBg]   = useState('blue')
  const [title,    setTitle]    = useState('')
  const [chip,     setChip]     = useState('')
  const [clients,  setClients]  = useState('')
  const [desc,     setDesc]     = useState('')
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 500, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Sector</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Icon <span className="hint">— radio · sun · zap · cpu · leaf</span></label>
              <input value={icon} onChange={e => setIcon(e.target.value)} autoFocus />
            </div>
            <div className="field" style={{ width: 150, marginBottom: 0 }}>
              <label>Icon Background</label>
              <input value={iconBg} onChange={e => setIconBg(e.target.value)} placeholder="blue · amber · green" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              <label>Chip <span className="hint">— optional badge</span></label>
              <input value={chip} onChange={e => setChip(e.target.value)} placeholder="Core Vertical" />
            </div>
          </div>
          <div className="field">
            <label>Clients <span className="hint">— optional</span></label>
            <input value={clients} onChange={e => setClients(e.target.value)} placeholder="Nokia · Ericsson" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
            Mark as Featured
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ icon, iconBg, title, chip: chip || undefined, clients: clients || undefined, desc, featured })} style={{ minWidth: 110 }}>Add Sector</button>
        </div>
      </div>
    </div>
  )
}


/* ── Global Reach ── */
function GlobalReachTab({ data, patch }) {
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.regions, 10)
  const sh = (f, v) => patch(d => { d.globalReachSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.regions[i][f] = v; return d }) }
  function add()    { patch(d => { d.regions.push({ title: '', countries: '' }); return d }) }
  function remove(i){ patch(d => { d.regions.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.globalReachSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.globalReachSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.globalReachSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
        <div className="field"><label>Description</label><input value={data.globalReachSection.description} onChange={e => sh('description', e.target.value)} /></div>
      </div>
      <div className="form-section">
        <ListHeader title="Regions" count={data.regions.length} onAdd={add} addLabel="+ Add Region" />
        {pageItems.map(({ item: region, index: i }) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px' }}>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              {i === 0 && <label>Region</label>}
              <input value={region.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Africa" />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Countries <span className="hint">— comma or · separated</span></label>}
              <input value={region.countries} onChange={e => update(i, 'countries', e.target.value)} placeholder="Nigeria, Ghana, Tanzania" />
            </div>
            <button className="btn-del" onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
      </div>
    </>
  )
}

/* ── CTA Banner ── */
function CTABannerTab({ data, patch }) {
  const s = (f, v) => patch(d => { d.ctaBanner[f] = v; return d })
  const b = data.ctaBanner
  return (
    <div className="form-section">
      <p className="form-section-title">CTA Banner</p>
      <div className="field"><label>Heading</label><input value={b.heading} onChange={e => s('heading', e.target.value)} /></div>
      <div className="field"><label>Description</label><textarea rows={2} value={b.description} onChange={e => s('description', e.target.value)} /></div>
      <div className="field-grid">
        <div className="field"><label>Primary Button Label</label><input value={b.primaryLabel} onChange={e => s('primaryLabel', e.target.value)} /></div>
        <div className="field"><label>Primary Button Link</label><input value={b.primaryTo} onChange={e => s('primaryTo', e.target.value)} /></div>
      </div>
      <div className="field-grid">
        <div className="field"><label>Secondary Button Label</label><input value={b.secondaryLabel} onChange={e => s('secondaryLabel', e.target.value)} /></div>
        <div className="field"><label>Secondary Button Link</label><input value={b.secondaryTo} onChange={e => s('secondaryTo', e.target.value)} /></div>
      </div>
    </div>
  )
}
