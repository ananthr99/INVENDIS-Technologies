import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'
import { usePagination, ListHeader, Pager } from '../../components/Pagination'

const FILE_PATH     = 'public/content/pages/products.json'
const GH_PAGES_PATH = 'content/pages/products.json'
const TABS = ['Hero', 'Hardware', 'SILBO Products', 'Software', 'Design Partners', 'CTA Banner']

export default function ProductsPage() {
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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update products page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update products page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Products', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading products page…</span>
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
        {activeTab === 'Hero'            && <HeroTab           data={data} patch={patch} />}
        {activeTab === 'Hardware'        && <HardwareTab       data={data} patch={patch} />}
        {activeTab === 'SILBO Products'  && <SilboProductsTab  data={data} patch={patch} />}
        {activeTab === 'Software'        && <SoftwareTab       data={data} patch={patch} />}
        {activeTab === 'Design Partners' && <DesignPartnersTab data={data} patch={patch} />}
        {activeTab === 'CTA Banner'      && <CTABannerTab      data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Hero ── */
function HeroTab({ data, patch }) {
  const s  = (f, v) => patch(d => { d.hero[f] = v; return d })
  const sc = (f, v) => patch(d => { d.hero.cta[f] = v; return d })
  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Hero Text</p>
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
      <div className="form-section">
        <p className="form-section-title">CTA Button</p>
        <div className="field-grid">
          <div className="field">
            <label>Label</label>
            <input value={data.hero.cta.label} onChange={e => sc('label', e.target.value)} />
          </div>
          <div className="field">
            <label>Link</label>
            <input value={data.hero.cta.to} onChange={e => sc('to', e.target.value)} />
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Hardware ── */
function HardwareTab({ data, patch }) {
  const [addModal, setAddModal] = useState(false)
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.hardwareProducts, 5)
  const sh = (f, v) => patch(d => { d.hardwareSection[f] = v; return d })
  function update(i, f, v) {
    patch(d => { d.hardwareProducts[i][f] = (f === 'badge' && v === '') ? null : v; return d })
  }
  function addTag(i)          { patch(d => { d.hardwareProducts[i].tags.push(''); return d }) }
  function updateTag(i, ti, v){ patch(d => { d.hardwareProducts[i].tags[ti] = v; return d }) }
  function removeTag(i, ti)   { patch(d => { d.hardwareProducts[i].tags.splice(ti, 1); return d }) }
  function handleAdd(item) {
    patch(d => { d.hardwareProducts.push({ ...item, tags: [] }); return d })
    setAddModal(false)
  }
  function remove(i){ patch(d => { d.hardwareProducts.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.hardwareSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.hardwareSection.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.hardwareSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={data.hardwareSection.description} onChange={e => sh('description', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <ListHeader title="Hardware Products" count={data.hardwareProducts.length} onAdd={() => setAddModal(true)} addLabel="+ Add Product" />
        {pageItems.map(({ item: product, index: i }) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product {i + 1}</span>
              <div style={{ flex: 1 }} />
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 150px auto 1fr', gap: 8, alignItems: 'end', marginBottom: 8 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Icon</label>
                <input value={product.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="monitor" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Badge <span className="hint">— optional</span></label>
                <input value={product.badge ?? ''} onChange={e => update(i, 'badge', e.target.value)} placeholder="Flagship" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', cursor: 'pointer', paddingBottom: 7, whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={product.badgeRed} onChange={e => update(i, 'badgeRed', e.target.checked)} />
                Red badge
              </label>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Title</label>
                <input value={product.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <label>Description</label>
              <textarea rows={2} value={product.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Tags / Pills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: product.tags.length ? 8 : 0 }}>
                {product.tags.map((tag, ti) => (
                  <div key={ti} style={{ display: 'flex', alignItems: 'center', background: '#e0e7ff', borderRadius: 20, padding: '3px 10px', gap: 4 }}>
                    <input
                      value={tag}
                      onChange={e => updateTag(i, ti, e.target.value)}
                      style={{ border: 'none', background: 'transparent', fontSize: 12, color: '#1e40af', width: Math.max(40, tag.length * 8), outline: 'none' }}
                      placeholder="tag"
                    />
                    <button onClick={() => removeTag(i, ti)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
              <button className="btn-add" onClick={() => addTag(i)}>+ Add Tag</button>
            </div>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
        {addModal && <AddHardwareProductModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}
      </div>
    </>
  )
}

function AddHardwareProductModal({ onSave, onCancel }) {
  const [icon,     setIcon]     = useState('cpu')
  const [badge,    setBadge]    = useState('')
  const [badgeRed, setBadgeRed] = useState(false)
  const [title,    setTitle]    = useState('')
  const [desc,     setDesc]     = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Hardware Product</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Icon</label>
              <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="monitor" autoFocus />
            </div>
            <div className="field" style={{ width: 170, marginBottom: 0 }}>
              <label>Badge <span className="hint">— leave empty for none</span></label>
              <input value={badge} onChange={e => setBadge(e.target.value)} placeholder="Flagship" />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={badgeRed} onChange={e => setBadgeRed(e.target.checked)} />
              Red badge <span className="hint">— unchecked = blue</span>
            </label>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Description</label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>Tags can be added after saving.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ icon, badge: badge || null, badgeRed, title, desc })} style={{ minWidth: 120 }}>Add Product</button>
        </div>
      </div>
    </div>
  )
}

/* ── SILBO Products ── */
function SilboProductsTab({ data, patch }) {
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.silboProducts, 10)
  const sh = (f, v) => patch(d => { d.silboSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.silboProducts[i][f] = v; return d }) }
  function add()    { patch(d => { d.silboProducts.push({ icon: 'signal', title: '', desc: '' }); return d }) }
  function remove(i){ patch(d => { d.silboProducts.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.silboSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.silboSection.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.silboSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={data.silboSection.description} onChange={e => sh('description', e.target.value)} />
        </div>
        <div className="field">
          <label>Intro <span className="hint">— longer paragraph shown below description</span></label>
          <textarea rows={3} value={data.silboSection.intro} onChange={e => sh('intro', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <ListHeader title="SILBO Products" count={data.silboProducts.length} onAdd={add} addLabel="+ Add Product" />
        {pageItems.map(({ item: product, index: i }) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px' }}>
            <div className="field" style={{ width: 110, marginBottom: 0 }}>
              {i === 0 && <label>Icon</label>}
              <input value={product.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="signal" />
            </div>
            <div className="field" style={{ width: 180, marginBottom: 0 }}>
              {i === 0 && <label>Title</label>}
              <input value={product.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Description</label>}
              <input value={product.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
            <button className="btn-del" onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
      </div>
    </>
  )
}

/* ── Software ── */
function SoftwareTab({ data, patch }) {
  const [addModal, setAddModal] = useState(false)
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.softwarePlatforms, 5)
  const sh = (f, v) => patch(d => { d.softwareSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.softwarePlatforms[i][f] = v; return d }) }
  function handleAdd(item) {
    patch(d => { d.softwarePlatforms.push(item); return d })
    setAddModal(false)
  }
  function remove(i){ patch(d => { d.softwarePlatforms.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.softwareSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.softwareSection.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.softwareSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={data.softwareSection.description} onChange={e => sh('description', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <ListHeader title="Software Platforms" count={data.softwarePlatforms.length} onAdd={() => setAddModal(true)} addLabel="+ Add Platform" />
        {pageItems.map(({ item: platform, index: i }) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform {i + 1}</span>
              <div style={{ flex: 1 }} />
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 90px 1fr', gap: 8, marginBottom: 8 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Icon</label>
                <input value={platform.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="bar_chart" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Accent</label>
                <select value={platform.accent} onChange={e => update(i, 'accent', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Title</label>
                <input value={platform.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Description</label>
              <textarea rows={2} value={platform.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
        {addModal && <AddSoftwarePlatformModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}
      </div>
    </>
  )
}

function AddSoftwarePlatformModal({ onSave, onCancel }) {
  const [icon,   setIcon]   = useState('bar_chart')
  const [accent, setAccent] = useState('blue')
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
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Software Platform</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Icon</label>
              <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="bar_chart" autoFocus />
            </div>
            <div className="field" style={{ width: 130, marginBottom: 0 }}>
              <label>Accent</label>
              <select value={accent} onChange={e => setAccent(e.target.value)} style={{ width: '100%' }}>
                <option value="blue">blue</option>
                <option value="red">red</option>
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
          <button className="btn-save" onClick={() => onSave({ icon, accent, title, desc })} style={{ minWidth: 120 }}>Add Platform</button>
        </div>
      </div>
    </div>
  )
}

/* ── Design Partners ── */
function DesignPartnersTab({ data, patch }) {
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(data.designPartners, 10)
  const sh = (f, v) => patch(d => { d.designPartnersSection[f] = v; return d })
  function update(i, v) { patch(d => { d.designPartners[i] = v; return d }) }
  function add()    { patch(d => { d.designPartners.push(''); return d }) }
  function remove(i){ patch(d => { d.designPartners.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.designPartnersSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.designPartnersSection.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.designPartnersSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <ListHeader title="Design Partners" count={data.designPartners.length} onAdd={add} addLabel="+ Add Partner" />
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Chip and silicon partners shown as logo/name badges.</p>
        {pageItems.map(({ item: partner, index: i }) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Partner Name</label>}
              <input value={partner} onChange={e => update(i, e.target.value)} placeholder="Intel" />
            </div>
            <button className="btn-del" style={{ marginTop: i === 0 ? 18 : 0 }} onClick={() => remove(i)}>Remove</button>
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
      <div className="field-grid">
        <div className="field">
          <label>Secondary Button Label</label>
          <input value={b.secondaryLabel} onChange={e => s('secondaryLabel', e.target.value)} />
        </div>
        <div className="field">
          <label>Secondary Button Link</label>
          <input value={b.secondaryTo} onChange={e => s('secondaryTo', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
