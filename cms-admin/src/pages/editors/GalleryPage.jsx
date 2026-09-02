import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect, writeFileRaw, writeFileRawDirect, getFileSha, getFileShaDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'
import { usePagination, ListHeader, Pager } from '../../components/Pagination'

const FILE_PATH     = 'public/content/pages/gallery.json'
const GH_PAGES_PATH = 'content/pages/gallery.json'
const PREVIEW_BASE  = 'https://raw.githubusercontent.com/ananthr99/INVENDIS-Technologies/gh-pages/'
const TABS = ['Hero', 'Categories', 'Photos', 'CTA Banner']

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
    if (data.photos.length > 0) {
      const orders = data.photos.map(p => p.order)
      if (orders.some(o => o === '' || o == null)) {
        toast('Every photo must have an order number before publishing', 'err')
        return
      }
      if (new Set(orders).size !== orders.length) {
        toast('Two or more photos share the same order number — fix before publishing', 'err')
        return
      }
    }
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
        {activeTab === 'Hero'       && <HeroTab        data={data} patch={patch} />}
        {activeTab === 'Categories' && <CategoriesTab data={data} patch={patch} />}
        {activeTab === 'Photos'     && <PhotosTab     data={data} patch={patch} />}
        {activeTab === 'CTA Banner' && <CTABannerTab  data={data} patch={patch} />}
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

/* ── Categories ── */
function CategoriesTab({ data, patch }) {
  const [newLabel, setNewLabel] = useState('')
  const editable = data.categories.filter(c => c.id !== 'all')
  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(editable, 10)

  function toId(label) {
    return label.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  function updateLabel(realIdx, label) {
    patch(d => {
      const id = toId(label)
      const oldId = d.categories[realIdx].id
      d.categories[realIdx] = { id, label }
      // keep photos in sync if id changed
      if (id !== oldId) {
        d.photos.forEach(p => { if (p.category === oldId) p.category = id })
      }
      return d
    })
  }

  function remove(realIdx) {
    const removedId = data.categories[realIdx].id
    patch(d => {
      d.categories.splice(realIdx, 1)
      // reassign orphaned photos to first non-all category
      const fallback = d.categories.find(c => c.id !== 'all')?.id ?? ''
      d.photos.forEach(p => { if (p.category === removedId) p.category = fallback })
      return d
    })
  }

  function add() {
    const label = newLabel.trim()
    if (!label) return
    const id = toId(label)
    if (data.categories.some(c => c.id === id)) return
    patch(d => { d.categories.push({ id, label }); return d })
    setNewLabel('')
  }


  return (
    <div className="form-section">
      <p className="form-section-title">Categories</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>
        The <strong>All</strong> filter is always present and cannot be removed. Add, rename, or remove custom categories below.
        Renaming a category automatically updates all photos assigned to it.
      </p>

      {/* Fixed "All" row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', width: 80 }}>ID</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', flex: 1 }}>Label</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', width: 60 }}></span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', marginBottom: 6, opacity: 0.6 }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#6b7280', width: 80 }}>all</span>
        <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>All</span>
        <span style={{ fontSize: 11, color: '#9ca3af', width: 60 }}>built-in</span>
      </div>

      {/* Editable categories (paginated) */}
      {pageItems.map(({ item, index: rowIdx }) => {
        const realIdx = data.categories.indexOf(item)
        return (
          <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#6b7280', width: 80, flexShrink: 0 }}>{item.id}</span>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {rowIdx === 0 && <label style={{ marginBottom: 4 }}>Label</label>}
              <input
                value={item.label}
                onChange={e => updateLabel(realIdx, e.target.value)}
                placeholder="Category name"
              />
            </div>
            <button
              className="btn-del"
              style={{ marginTop: rowIdx === 0 ? 18 : 0 }}
              onClick={() => remove(realIdx)}
            >
              Remove
            </button>
          </div>
        )
      })}
      <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />

      {/* Add new — stays below Pager */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 14, paddingTop: 14, borderTop: '1px solid #e5e7eb' }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <label>New Category Name</label>
          <input
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="e.g. Conferences"
          />
        </div>
        <button className="btn-add" style={{ marginBottom: 0 }} onClick={add}>+ Add</button>
      </div>
    </div>
  )
}

/* ── Photos ── */
function PhotosTab({ data, patch }) {
  const { token, toast } = useAdmin()
  const categories   = (data.categories || []).filter(c => c.id !== 'all')
  const sortedPhotos = [...data.photos].sort((a, b) => ((a.order || Infinity) - (b.order || Infinity)))
  const nextOrder    = data.photos.reduce((max, p) => Math.max(max, p.order ?? 0), 0) + 1

  const orderCount = {}
  data.photos.forEach(p => { if (p.order) orderCount[p.order] = (orderCount[p.order] || 0) + 1 })
  const duplicateOrders = new Set(Object.keys(orderCount).filter(k => orderCount[k] > 1).map(Number))
  const existingOrders  = new Set(data.photos.map(p => p.order).filter(Boolean))

  const { page, setPage, pageCount, pageItems, start, end, total } = usePagination(sortedPhotos, 5)
  const [addModal, setAddModal] = useState(false)

  function update(id, f, v) { patch(d => { const p = d.photos.find(p => p.id === id); if (p) p[f] = v; return d }) }
  function removePhoto(id)  { patch(d => { const p = d.photos.find(p => p.id === id); if (p) p.src = null; return d }) }
  function remove(id)       { patch(d => { d.photos = d.photos.filter(p => p.id !== id); return d }) }

  async function handlePhotoUpload(photoId, file) {
    if (!file) return
    const photo    = data.photos.find(p => p.id === photoId)
    const title    = photo?.title || `photo-${photoId}`
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

      const ghSha = await getFileShaDirect(`images/gallery/${filename}`, token)
      await writeFileRawDirect(`images/gallery/${filename}`, base64, `CMS: upload gallery photo ${filename}`, ghSha, token)

      const mainSha = await getFileSha(`public/images/gallery/${filename}`, token)
      await writeFileRaw(`public/images/gallery/${filename}`, base64, `CMS: upload gallery photo ${filename} [skip ci]`, mainSha, token)

      patch(d => { const p = d.photos.find(p => p.id === photoId); if (p) p.src = `images/gallery/${filename}`; return d })
      toast('Photo uploaded — click Save & Publish to store the path', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    }
  }

  function handleAdd(photo) {
    patch(d => {
      const nextId = d.photos.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1
      d.photos.push({ id: nextId, ...photo })
      return d
    })
    setAddModal(false)
  }


  return (
    <div className="form-section">
      <ListHeader title="Gallery Photos" count={data.photos.length} onAdd={() => setAddModal(true)} addLabel="+ Add Photo" />
      {data.photos.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>No photos yet. Click "+ Add Photo" to get started.</p>
      )}
      {pageItems.map(({ item: photo }) => (
        <div key={photo.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
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
                  onChange={e => handlePhotoUpload(photo.id, e.target.files?.[0])}
                />
              </label>
              {photo.src && (
                <button
                  onClick={() => removePhoto(photo.id)}
                  style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '2px 0', width: '100%' }}
                >
                  Remove photo
                </button>
              )}
            </div>

            {/* Fields */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div className="field" style={{ width: 72, marginBottom: 0, flexShrink: 0 }}>
                  <label>Order</label>
                  <input
                    type="number"
                    min="1"
                    value={photo.order ?? ''}
                    onChange={e => update(photo.id, 'order', e.target.value === '' ? '' : Number(e.target.value))}
                    style={{
                      textAlign: 'center',
                      borderColor: (!photo.order || duplicateOrders.has(photo.order)) ? '#ef4444' : undefined,
                      boxShadow:   (!photo.order || duplicateOrders.has(photo.order)) ? '0 0 0 2px #fecaca' : undefined,
                    }}
                  />
                  {(!photo.order || duplicateOrders.has(photo.order)) && (
                    <span style={{ fontSize: 10, color: '#ef4444', display: 'block', marginTop: 2, textAlign: 'center', lineHeight: 1.3 }}>
                      {!photo.order ? 'Required' : 'Duplicate'}
                    </span>
                  )}
                </div>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Title</label>
                  <input value={photo.title} onChange={e => update(photo.id, 'title', e.target.value)} placeholder="e.g. India Telecom Expo 2024" />
                </div>
                <div className="field" style={{ width: 150, marginBottom: 0 }}>
                  <label>Category</label>
                  <select value={photo.category} onChange={e => update(photo.id, 'category', e.target.value)}>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Caption</label>
                <textarea rows={2} value={photo.caption} onChange={e => update(photo.id, 'caption', e.target.value)} placeholder="Short description of the photo" />
              </div>
            </div>

            <button className="btn-del" onClick={() => remove(photo.id)} style={{ marginTop: 20 }}>Remove</button>
          </div>
        </div>
      ))}
      <Pager page={page} setPage={setPage} pageCount={pageCount} start={start} end={end} total={total} />
      {addModal && (
        <AddPhotoModal
          categories={categories}
          token={token}
          toast={toast}
          onSave={handleAdd}
          onCancel={() => setAddModal(false)}
          nextOrder={nextOrder}
          existingOrders={existingOrders}
        />
      )}
    </div>
  )
}
/* ── Add Photo Modal ── */
function AddPhotoModal({ categories, token, toast, onSave, onCancel, nextOrder, existingOrders }) {
  const [title,      setTitle]      = useState('')
  const [caption,    setCaption]    = useState('')
  const [category,   setCategory]   = useState(categories[0]?.id || '')
  const [order,      setOrder]      = useState(nextOrder)
  const [file,       setFile]       = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const [dragOver,   setDragOver]   = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function pickFile(f) {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  async function handleSave() {
    setUploading(true)
    try {
      let src = null
      if (file) {
        const t    = title.trim() || `photo-${Date.now()}`
        const slug = t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40)
        const ext  = file.name.split('.').pop().toLowerCase()
        const filename = `${slug}.${ext}`

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload  = () => resolve(reader.result.split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        toast('Uploading photo…', '')
        const ghSha = await getFileShaDirect(`images/gallery/${filename}`, token)
        await writeFileRawDirect(`images/gallery/${filename}`, base64, `CMS: upload gallery photo ${filename}`, ghSha, token)
        const mainSha = await getFileSha(`public/images/gallery/${filename}`, token)
        await writeFileRaw(`public/images/gallery/${filename}`, base64, `CMS: upload gallery photo ${filename} [skip ci]`, mainSha, token)
        src = `images/gallery/${filename}`
      }

      onSave({ category, title: title.trim(), caption: caption.trim(), src, order: Number(order) || nextOrder })
      toast(src ? 'Photo added — click Save & Publish to go live' : 'Photo added (no image yet)', 'ok')
    } catch (e) {
      toast(e.message, 'err')
      setUploading(false)
    }
  }

  const orderNum   = Number(order)
  const orderEmpty = order === '' || order == null
  const orderDup   = !orderEmpty && existingOrders.has(orderNum)
  const orderError = orderEmpty || orderDup

  const dropZoneStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    border: `2px dashed ${dragOver ? '#2563eb' : previewUrl ? '#10b981' : '#d1d5db'}`,
    borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.15s',
    background: dragOver ? '#eff6ff' : previewUrl ? '#f0fdf4' : '#f9fafb',
    minHeight: previewUrl ? 0 : 130,
    overflow: 'hidden',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Photo</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Upload area */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
              Photo <span className="hint">— optional, can be added later</span>
            </label>
            <label
              style={dropZoneStyle}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', display: 'block' }} />
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8, lineHeight: 1 }}>📷</div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 4 }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>JPG, PNG, WEBP, GIF</div>
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => pickFile(e.target.files?.[0])} />
            </label>
            {previewUrl && (
              <button
                onClick={() => { setFile(null); setPreviewUrl(null) }}
                style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginTop: 5, padding: 0 }}
              >
                Remove image
              </button>
            )}
          </div>

          {/* Order + Title + Category */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ width: 72, marginBottom: 0, flexShrink: 0 }}>
              <label>Order</label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={e => setOrder(e.target.value)}
                style={{
                  textAlign: 'center',
                  borderColor: orderError ? '#ef4444' : undefined,
                  boxShadow:   orderError ? '0 0 0 2px #fecaca' : undefined,
                }}
              />
              {orderError && (
                <span style={{ fontSize: 10, color: '#ef4444', display: 'block', marginTop: 2, textAlign: 'center', lineHeight: 1.3 }}>
                  {orderEmpty ? 'Required' : 'Duplicate'}
                </span>
              )}
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. India Telecom Expo 2024" autoFocus />
            </div>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                {categories.length === 0 && <option value="">No categories yet</option>}
              </select>
            </div>
          </div>

          {/* Caption */}
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Caption <span className="hint">— optional</span></label>
            <textarea rows={3} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Short description shown below the photo" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button
            onClick={onCancel}
            disabled={uploading}
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={uploading || orderError} style={{ minWidth: 110 }}>
            {uploading ? 'Uploading…' : 'Add Photo'}
          </button>
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
        <div className="field"><label>Primary Button Link</label><input value={b.primaryTo} onChange={e => s('primaryTo', e.target.value)} /></div>
      </div>
      <div className="field-grid">
        <div className="field"><label>Secondary Button Label <span className="hint">— optional</span></label><input value={b.secondaryLabel ?? ''} onChange={e => s('secondaryLabel', e.target.value)} /></div>
        <div className="field"><label>Secondary Button Link</label><input value={b.secondaryTo ?? ''} onChange={e => s('secondaryTo', e.target.value)} /></div>
      </div>
    </div>
  )
}
