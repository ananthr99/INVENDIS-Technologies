import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

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
  function update(i, f, v) { patch(d => { d.sectors[i][f] = v; return d }) }
  function updateSolution(i, si, v) { patch(d => { d.sectors[i].solutions[si] = v; return d }) }
  function addSolution(i)  { patch(d => { d.sectors[i].solutions.push(''); return d }) }
  function removeSolution(i, si) { patch(d => { d.sectors[i].solutions.splice(si, 1); return d }) }
  function add()    { patch(d => { d.sectors.push({ icon: 'cpu', iconBg: 'blue', title: '', desc: '', solutions: [] }); return d }) }
  function remove(i){ patch(d => { d.sectors.splice(i, 1); return d }) }

  return (
    <div className="form-section">
      <p className="form-section-title">Sector Cards</p>
      {data.sectors.map((sector, i) => (
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
      <button className="btn-add" onClick={add}>+ Add Sector</button>
    </div>
  )
}

/* ── Global Reach ── */
function GlobalReachTab({ data, patch }) {
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
        <p className="form-section-title">Regions</p>
        {data.regions.map((region, i) => (
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
        <button className="btn-add" style={{ marginTop: 4 }} onClick={add}>+ Add Region</button>
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
