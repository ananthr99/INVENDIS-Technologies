import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'
import { usePagination, ListHeader, Pager } from '../../components/Pagination'

const FILE_PATH     = 'public/content/pages/careers.json'
const GH_PAGES_PATH = 'content/pages/careers.json'
const TABS = ['Hero', 'Culture & Perks', 'Openings', 'CTA Banner']

export default function CareersPage() {
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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update careers page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update careers page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Careers', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading careers page…</span>
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
        {activeTab === 'Hero'             && <HeroTab    data={data} patch={patch} />}
        {activeTab === 'Culture & Perks'  && <CultureTab data={data} patch={patch} />}
        {activeTab === 'Openings'         && <OpeningsTab data={data} patch={patch} />}
        {activeTab === 'CTA Banner'       && <CTABannerTab data={data} patch={patch} />}
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

/* ── Culture & Perks ── */
function CultureTab({ data, patch }) {
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.perks, 5)
  const [addModal, setAddModal] = useState(false)
  const sh = (f, v) => patch(d => { d.cultureSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.perks[i][f] = v; return d }) }
  function handleAdd(item) {
    patch(d => { d.perks.push(item); return d })
    setAddModal(false)
  }
  function remove(i){ patch(d => { d.perks.splice(i, 1); return d }) }

  const ACCENTS = ['blue', 'green', 'purple', 'amber', 'red']
  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Culture Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.cultureSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.cultureSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.cultureSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
        <div className="field"><label>Description</label><textarea rows={2} value={data.cultureSection.description} onChange={e => sh('description', e.target.value)} /></div>
      </div>
      <div className="form-section">
        <ListHeader title="Perks / Benefits" count={data.perks.length} onAdd={() => setAddModal(true)} addLabel="+ Add Perk" />
        {pageItems.map(({ item: perk, index: i }) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Perk {i + 1}</span>
              <div style={{ flex: 1 }} />
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 100px 1fr', gap: 8, marginBottom: 8 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Icon</label>
                <input value={perk.icon} onChange={e => update(i, 'icon', e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Accent</label>
                <select value={perk.accent} onChange={e => update(i, 'accent', e.target.value)} style={{ width: '100%' }}>
                  {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Title</label>
                <input value={perk.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Description</label>
              <textarea rows={2} value={perk.description} onChange={e => update(i, 'description', e.target.value)} />
            </div>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
        {addModal && <AddPerkModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}      
      </div>
    </>
  )
}

function AddPerkModal({ onSave, onCancel }) {
  const [icon,        setIcon]        = useState('star')
  const [accent,      setAccent]      = useState('blue')
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 460, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Perk / Benefit</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Icon</label>
              <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="star" autoFocus />
            </div>
            <div className="field" style={{ width: 150, marginBottom: 0 }}>
              <label>Accent</label>
              <select value={accent} onChange={e => setAccent(e.target.value)} style={{ width: '100%' }}>
                {['blue','green','purple','amber','red'].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Description</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ icon, accent, title, description })} style={{ minWidth: 100 }}>Add Perk</button>
        </div>
      </div>
    </div>
  )
}


/* ── Openings ── */
function OpeningsTab({ data, patch }) {
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.openings, 5)
  const [addModal, setAddModal] = useState(false)
  const sh = (f, v) => patch(d => { d.openingsSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.openings[i][f] = v; return d }) }
  function handleAdd(item) {
    patch(d => { d.openings.push(item); return d })
    setAddModal(false)
  }
  function remove(i){ patch(d => { d.openings.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.openingsSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.openingsSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.openingsSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">No-Openings Message</p>
        <div className="field">
          <label>Message shown when there are no open roles</label>
          <textarea rows={2} value={data.noOpeningsMessage} onChange={e => patch(d => { d.noOpeningsMessage = e.target.value; return d })} />
        </div>
      </div>
      <div className="form-section">
        <ListHeader title="Open Positions" count={data.openings.length} onAdd={() => setAddModal(true)} addLabel="+ Add Position" />
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          Leave empty to show the "no openings" message above.
        </p>
        {pageItems.map(({ item: job, index: i }) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position {i + 1}</span>
              <div style={{ flex: 1 }} />
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 100px', gap: 8, marginBottom: 8 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Job Title</label>
                <input value={job.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Department</label>
                <input value={job.department ?? ''} onChange={e => update(i, 'department', e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Location</label>
                <input value={job.location ?? ''} onChange={e => update(i, 'location', e.target.value)} placeholder="Bangalore, India" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Type</label>
                <input value={job.type ?? ''} onChange={e => update(i, 'type', e.target.value)} placeholder="Full-time" />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Description</label>
              <textarea rows={2} value={job.description ?? ''} onChange={e => update(i, 'description', e.target.value)} />
            </div>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
        {addModal && <AddOpeningModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}    
      </div>
    </>
  )
}

function AddOpeningModal({ onSave, onCancel }) {
  const [title,       setTitle]       = useState('')
  const [department,  setDepartment]  = useState('')
  const [location,    setLocation]    = useState('Bangalore, India')
  const [type,        setType]        = useState('Full-time')
  const [description, setDescription] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Open Position</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Job Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            </div>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              <label>Department</label>
              <input value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Bangalore, India" />
            </div>
            <div className="field" style={{ width: 150, marginBottom: 0 }}>
              <label>Type</label>
              <input value={type} onChange={e => setType(e.target.value)} placeholder="Full-time" />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Description</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ title, department, location, type, description })} style={{ minWidth: 120 }}>Add Position</button>
        </div>
      </div>
    </div>
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
        <div className="field"><label>Primary Button Link <span className="hint">— can be mailto:…</span></label><input value={b.primaryTo} onChange={e => s('primaryTo', e.target.value)} /></div>
      </div>
    </div>
  )
}
