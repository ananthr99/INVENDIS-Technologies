import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'
import { usePagination, ListHeader, Pager } from '../../components/Pagination'

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
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.caseStudies, 5)
  const [addModal, setAddModal] = useState(false)
  const sh = (f, v) => patch(d => { d.caseStudiesSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.caseStudies[i][f] = v; return d }) }
  function handleAdd(item) {
    patch(d => { d.caseStudies.push(item); return d })
    setAddModal(false)
  }
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
        <ListHeader title="Case Studies" count={data.caseStudies.length} onAdd={() => setAddModal(true)} addLabel="+ Add Case Study" />
        {pageItems.map(({ item: cs, index: i }) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Case Study {i + 1}</span>
              <div style={{ flex: 1 }} />
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 160px 1fr 180px', gap: 8, marginBottom: 8 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Style</label>
                <select value={cs.style} onChange={e => update(i, 'style', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                  <option value="mix">mix</option>
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Sector</label>
                <input value={cs.sector} onChange={e => update(i, 'sector', e.target.value)} placeholder="Telecom · Africa" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Title</label>
                <input value={cs.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Client</label>
                <input value={cs.client} onChange={e => update(i, 'client', e.target.value)} />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <label>Description</label>
              <textarea rows={2} value={cs.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
            <div className="field-grid" style={{ marginBottom: 0 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Result # <span className="hint">— e.g. 40%</span></label>
                <input value={cs.resultNum} onChange={e => update(i, 'resultNum', e.target.value)} placeholder="40%" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Result Label</label>
                <input value={cs.resultLabel} onChange={e => update(i, 'resultLabel', e.target.value)} placeholder="Reduction in site visits" />
              </div>
            </div>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
        {addModal && <AddCaseStudyModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}    
      </div>
    </>
  )
}

function AddCaseStudyModal({ onSave, onCancel }) {
  const [style,       setStyle]       = useState('blue')
  const [sector,      setSector]      = useState('')
  const [title,       setTitle]       = useState('')
  const [client,      setClient]      = useState('')
  const [desc,        setDesc]        = useState('')
  const [resultNum,   setResultNum]   = useState('')
  const [resultLabel, setResultLabel] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Case Study</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ width: 130, marginBottom: 0 }}>
              <label>Card Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} style={{ width: '100%' }}>
                <option value="blue">blue</option>
                <option value="red">red</option>
                <option value="mix">mix</option>
              </select>
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Sector <span className="hint">— e.g. Telecom · Africa</span></label>
              <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Telecom · Africa" autoFocus />
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>Client</label>
            <input value={client} onChange={e => setClient(e.target.value)} placeholder="American Tower Corporation" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Result Number <span className="hint">— e.g. 40%</span></label>
              <input value={resultNum} onChange={e => setResultNum(e.target.value)} placeholder="40%" />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Result Label</label>
              <input value={resultLabel} onChange={e => setResultLabel(e.target.value)} placeholder="Reduction in site visits" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ style, sector, title, client, desc, resultNum, resultLabel })} style={{ minWidth: 130 }}>Add Case Study</button>
        </div>
      </div>
    </div>
  )
}


/* ── White Papers ── */
function WhitePapersTab({ data, patch }) {
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.whitepapers, 5)
  const [addModal, setAddModal] = useState(false)
  const sh = (f, v) => patch(d => { d.whitepapersSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.whitepapers[i][f] = v; return d }) }
  function handleAdd(item) {
    patch(d => { d.whitepapers.push(item); return d })
    setAddModal(false)
  }
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
        <ListHeader title="White Papers" count={data.whitepapers.length} onAdd={() => setAddModal(true)} addLabel="+ Add White Paper" />
        {pageItems.map(({ item: wp, index: i }) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paper {i + 1}</span>
              <div style={{ flex: 1 }} />
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 110px 1fr', gap: 8, marginBottom: 8 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Icon</label>
                <input value={wp.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="file_text" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>BG Color</label>
                <select value={wp.iconBg} onChange={e => update(i, 'iconBg', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                  <option value="green">green</option>
                  <option value="purple">purple</option>
                  <option value="amber">amber</option>
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Title</label>
                <input value={wp.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Description</label>
              <textarea rows={2} value={wp.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
        {addModal && <AddWhitePaperModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}    
      </div>
    </>
  )
}

function AddWhitePaperModal({ onSave, onCancel }) {
  const [icon,   setIcon]   = useState('file_text')
  const [iconBg, setIconBg] = useState('blue')
  const [title,  setTitle]  = useState('')
  const [desc,   setDesc]   = useState('')

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
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add White Paper</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Icon</label>
              <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="file_text" autoFocus />
            </div>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              <label>Icon Background</label>
              <select value={iconBg} onChange={e => setIconBg(e.target.value)} style={{ width: '100%' }}>
                {['blue','red','green','purple','amber'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Description</label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ icon, iconBg, title, desc })} style={{ minWidth: 120 }}>Add White Paper</button>
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
