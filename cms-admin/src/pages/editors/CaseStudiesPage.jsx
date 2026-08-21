import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH     = 'public/content/pages/caseStudies.json'
const GH_PAGES_PATH = 'content/pages/caseStudies.json'
const TABS = ['Hero', 'Case Studies', 'White Papers', 'CTA Banner']

export default function CaseStudiesPage() {
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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update case studies page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update case studies page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Case Studies', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading case studies…</span>
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
        {activeTab === 'Case Studies' && <CaseStudiesTab  data={data} patch={patch} />}
        {activeTab === 'White Papers' && <WhitePapersTab  data={data} patch={patch} />}
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
      <div className="field">
        <label>Eyebrow</label>
        <input value={data.hero.eyebrow} onChange={e => s('eyebrow', e.target.value)} />
      </div>
      <div className="field-grid">
        <div className="field">
          <label>Headline</label>
          <input value={data.hero.headline} onChange={e => s('headline', e.target.value)} />
        </div>
        <div className="field">
          <label>Headline Accent <span className="hint">— highlighted in blue</span></label>
          <input value={data.hero.headlineAccent} onChange={e => s('headlineAccent', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={3} value={data.hero.description} onChange={e => s('description', e.target.value)} />
      </div>
    </div>
  )
}

/* ── Case Studies ── */
function CaseStudiesTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.caseStudiesSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.caseStudies[i][f] = v; return d }) }
  function add()    { patch(d => { d.caseStudies.push({ style: 'blue', sector: '', title: '', client: '', desc: '', resultNum: '', resultLabel: '' }); return d }) }
  function remove(i){ patch(d => { d.caseStudies.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.caseStudiesSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.caseStudiesSection.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.caseStudiesSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Case Studies</p>
        {data.caseStudies.map((cs, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Case Study {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Card Style</label>
                <select value={cs.style} onChange={e => update(i, 'style', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                  <option value="mix">mix</option>
                </select>
              </div>
              <div className="field">
                <label>Sector <span className="hint">— e.g. Telecom · Africa</span></label>
                <input value={cs.sector} onChange={e => update(i, 'sector', e.target.value)} placeholder="Telecom · Africa" />
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={cs.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field">
              <label>Client</label>
              <input value={cs.client} onChange={e => update(i, 'client', e.target.value)} placeholder="American Tower Corporation" />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={3} value={cs.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Result Number <span className="hint">— e.g. 40% or 70K+</span></label>
                <input value={cs.resultNum} onChange={e => update(i, 'resultNum', e.target.value)} placeholder="40%" />
              </div>
              <div className="field">
                <label>Result Label</label>
                <input value={cs.resultLabel} onChange={e => update(i, 'resultLabel', e.target.value)} placeholder="Reduction in site visits" />
              </div>
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Case Study</button>
      </div>
    </>
  )
}

/* ── White Papers ── */
function WhitePapersTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.whitepapersSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.whitepapers[i][f] = v; return d }) }
  function add()    { patch(d => { d.whitepapers.push({ icon: 'file_text', iconBg: 'blue', title: '', desc: '' }); return d }) }
  function remove(i){ patch(d => { d.whitepapers.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.whitepapersSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.whitepapersSection.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.whitepapersSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={data.whitepapersSection.description} onChange={e => sh('description', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">White Papers</p>
        {data.whitepapers.map((wp, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Paper {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Icon</label>
                <input value={wp.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="file_text" />
              </div>
              <div className="field">
                <label>Icon Background</label>
                <select value={wp.iconBg} onChange={e => update(i, 'iconBg', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                  <option value="green">green</option>
                  <option value="purple">purple</option>
                  <option value="amber">amber</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={wp.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={2} value={wp.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add White Paper</button>
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
      <div className="field">
        <label>Heading</label>
        <input value={b.heading} onChange={e => s('heading', e.target.value)} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={2} value={b.description} onChange={e => s('description', e.target.value)} />
      </div>
      <div className="field-grid">
        <div className="field">
          <label>Primary Button Label</label>
          <input value={b.primaryLabel} onChange={e => s('primaryLabel', e.target.value)} />
        </div>
        <div className="field">
          <label>Primary Button Link</label>
          <input value={b.primaryTo} onChange={e => s('primaryTo', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
