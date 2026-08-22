import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect, writeFileRaw, writeFileRawDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH     = 'public/content/pages/gallery.json'
const GH_PAGES_PATH = 'content/pages/gallery.json'
const PREVIEW_BASE  = 'https://raw.githubusercontent.com/ananthr99/INVENDIS-Technologies/gh-pages/'
const TABS = ['Hero', 'Photos', 'CTA Banner']

export default function GalleryPage() {
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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update gallery page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update gallery page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Gallery', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading gallery page…</span>
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
        {activeTab === 'Hero'       && <HeroTab      data={data} patch={patch} />}
        {activeTab === 'Photos'     && <PhotosTab    data={data} patch={patch} />}
        {activeTab === 'CTA Banner' && <CTABannerTab data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Hero ── */
function HeroTab({ data, patch }) {
  const s  = (f, v) => patch(d => { d.hero[f] = v; return d })
  const sg = (f, v) => patch(d => { d.gallerySection[f] = v; return d })
  return (
    <>
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
            <label>Headline Accent <span className="hint">— highlighted in red</span></label>
            <input value={data.hero.headlineAccent} onChange={e => s('headlineAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={3} value={data.hero.description} onChange={e => s('description', e.target.value)} />
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Gallery Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.gallerySection.eyebrow} onChange={e => sg('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.gallerySection.heading} onChange={e => sg('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent <span className="hint">— highlighted in blue</span></label>
            <input value={data.gallerySection.headingAccent} onChange={e => sg('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Photos ── */
function PhotosTab({ data, patch }) {
  const { token, toast } = useAdmin()
  const categories = (data.categories || []).filter(c => c.id !== 'all')

  function update(i, f, v) { patch(d => { d.photos[i][f] = v; return d }) }
  function removePhoto(i)  { patch(d => { d.photos[i].src = null; return d }) }
  function remove(i)       { patch(d => { d.photos.splice(i, 1); return d }) }
  function add() {
    patch(d => {
      const nextId = d.photos.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1
      d.photos.push({ id: nextId, category: categories[0]?.id || 'events', title: '', caption: '', src: null })
      return d
    })
  }

  async function handlePhotoUpload(i, file) {
    if (!file) return
    const title    = data.photos[i].title || `photo-${data.photos[i].id ?? i + 1}`
    const slug     = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40)
    const ext      = file.name.split('.').pop().toLowerCase()
    const filename = `${slug}.${ext}`

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload  = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    try {
      toast('Uploading photo…', '')

      let ghSha = null
      try { ghSha = (await readFileDirect(`images/gallery/${filename}`, token)).sha } catch {}
      await writeFileRawDirect(`images/gallery/${filename}`, base64, `CMS: upload gallery photo ${filename}`, ghSha, token)

      let mainSha = null
      try { mainSha = (await readFile(`public/images/gallery/${filename}`, token)).sha } catch {}
      await writeFileRaw(`public/images/gallery/${filename}`, base64, `CMS: upload gallery photo ${filename} [skip ci]`, mainSha, token)

      patch(d => { d.photos[i].src = `images/gallery/${filename}`; return d })
      toast('Photo uploaded — click Save & Publish to store the path', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    }
  }

  return (
    <div className="form-section">
      <p className="form-section-title">Gallery Photos</p>
      {data.photos.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>No photos yet. Click "+ Add Photo" to get started.</p>
      )}
      {data.photos.map((photo, i) => (
        <div key={photo.id ?? i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

            {/* Thumbnail + upload */}
            <div style={{ flexShrink: 0, textAlign: 'center', width: 96 }}>
              <div style={{ width: 96, height: 72, borderRadius: 8, overflow: 'hidden', background: '#e5e7eb', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photo.src ? (
                  <img
                    src={`${PREVIEW_BASE}${photo.src}`}
                    alt={photo.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <span style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', lineHeight: 1.4, padding: '0 6px' }}>No photo</span>
                )}
              </div>
              <label style={{ fontSize: 11, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', display: 'block' }}>
                {photo.src ? 'Change' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handlePhotoUpload(i, e.target.files?.[0])}
                />
              </label>
              {photo.src && (
                <button
                  onClick={() => removePhoto(i)}
                  style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '2px 0', width: '100%' }}
                >
                  Remove photo
                </button>
              )}
            </div>

            {/* Fields */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Title</label>
                  <input value={photo.title} onChange={e => update(i, 'title', e.target.value)} placeholder="e.g. India Telecom Expo 2024" />
                </div>
                <div className="field" style={{ width: 150, marginBottom: 0 }}>
                  <label>Category</label>
                  <select value={photo.category} onChange={e => update(i, 'category', e.target.value)}>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Caption</label>
                <textarea rows={2} value={photo.caption} onChange={e => update(i, 'caption', e.target.value)} placeholder="Short description of the photo" />
              </div>
            </div>

            <button className="btn-del" onClick={() => remove(i)} style={{ marginTop: 20 }}>Remove</button>
          </div>
        </div>
      ))}
      <button className="btn-add" style={{ marginTop: 8 }} onClick={add}>+ Add Photo</button>
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
        <div className="field"><label>Primary Button Link</label><input value={b.primaryTo} onChange={e => s('primaryTo', e.target.value)} /></div>
      </div>
      <div className="field-grid">
        <div className="field"><label>Secondary Button Label <span className="hint">— optional</span></label><input value={b.secondaryLabel ?? ''} onChange={e => s('secondaryLabel', e.target.value)} /></div>
        <div className="field"><label>Secondary Button Link</label><input value={b.secondaryTo ?? ''} onChange={e => s('secondaryTo', e.target.value)} /></div>
      </div>
    </div>
  )
}
