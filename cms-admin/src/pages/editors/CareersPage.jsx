import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH     = 'public/content/pages/careers.json'
const GH_PAGES_PATH = 'content/pages/careers.json'
const TABS = ['Hero', 'Culture & Perks', 'Openings', 'CTA Banner']

export default function CareersPage() {
  const { token, toast, userEmail } = useAdmin()
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
  const sh = (f, v) => patch(d => { d.cultureSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.perks[i][f] = v; return d }) }
  function add()    { patch(d => { d.perks.push({ icon: 'star', accent: 'blue', title: '', description: '' }); return d }) }
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
        <p className="form-section-title">Perks / Benefits</p>
        {data.perks.map((perk, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Perk {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field"><label>Icon</label><input value={perk.icon} onChange={e => update(i, 'icon', e.target.value)} /></div>
              <div className="field">
                <label>Accent</label>
                <select value={perk.accent} onChange={e => update(i, 'accent', e.target.value)} style={{ width: '100%' }}>
                  {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="field"><label>Title</label><input value={perk.title} onChange={e => update(i, 'title', e.target.value)} /></div>
            <div className="field"><label>Description</label><textarea rows={2} value={perk.description} onChange={e => update(i, 'description', e.target.value)} /></div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Perk</button>
      </div>
    </>
  )
}

/* ── Openings ── */
function OpeningsTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.openingsSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.openings[i][f] = v; return d }) }
  function add()    { patch(d => { d.openings.push({ title: '', department: '', location: 'Bangalore, India', type: 'Full-time', description: '' }); return d }) }
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
        <p className="form-section-title">Open Positions</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          Leave empty to show the "no openings" message above.
        </p>
        {data.openings.map((job, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Position {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field"><label>Job Title</label><input value={job.title} onChange={e => update(i, 'title', e.target.value)} /></div>
              <div className="field"><label>Department</label><input value={job.department ?? ''} onChange={e => update(i, 'department', e.target.value)} /></div>
            </div>
            <div className="field-grid">
              <div className="field"><label>Location</label><input value={job.location ?? ''} onChange={e => update(i, 'location', e.target.value)} placeholder="Bangalore, India" /></div>
              <div className="field"><label>Type</label><input value={job.type ?? ''} onChange={e => update(i, 'type', e.target.value)} placeholder="Full-time" /></div>
            </div>
            <div className="field"><label>Description</label><textarea rows={3} value={job.description ?? ''} onChange={e => update(i, 'description', e.target.value)} /></div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Position</button>
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
        <div className="field"><label>Primary Button Link <span className="hint">— can be mailto:…</span></label><input value={b.primaryTo} onChange={e => s('primaryTo', e.target.value)} /></div>
      </div>
    </div>
  )
}
