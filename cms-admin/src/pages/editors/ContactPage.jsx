import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH = 'public/content/pages/contact.json'
const GH_PAGES_PATH = 'content/pages/contact.json'
const TABS = ['Hero', 'Contact Items', 'Quick Facts', 'Form Labels', 'Map Section']

export default function ContactPage() {
  const { token, toast, userEmail, setDirty } = useAdmin()
  const [data,      setData]      = useState(null)
  const [sha,       setSha]       = useState('')
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [activeTab, setActiveTab] = useState('Hero')
  const [originalData, setOriginalData] = useState(null)

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

      // Write directly to gh-pages → live in seconds, no build needed
      let ghSha = null
      try { ghSha = (await readFileDirect(GH_PAGES_PATH, token)).sha } catch {}
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update contact page', ghSha, token)

      // Write to main with [skip ci] → keeps source in sync, no rebuild triggered
      const result = await writeFile(FILE_PATH, json, 'CMS: update contact page [skip ci]', sha, token)
      setSha(result.content.sha)

      logChange({ userEmail, page: 'Contact', section: activeTab, token, before: originalData, after: data })
      setOriginalData(structuredClone(data))
      toast('Saved — live in seconds', 'ok')

    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  function patch(updater) {
    setData(prev => updater(structuredClone(prev)))
  }

  if (loading) return (
    <div className="tab-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading contact page…</span>
    </div>
  )
  if (!data) return null

  return (
    <>
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t} className={`tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Publishing…' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div className="tab-panel">
        {activeTab === 'Hero'          && <HeroTab          data={data} patch={patch} />}
        {activeTab === 'Contact Items' && <ContactItemsTab  data={data} patch={patch} />}
        {activeTab === 'Quick Facts'   && <QuickFactsTab    data={data} patch={patch} />}
        {activeTab === 'Form Labels'   && <FormLabelsTab    data={data} patch={patch} />}
        {activeTab === 'Map Section'   && <MapSectionTab    data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Hero ───────────────────────────────────────────── */

function HeroTab({ data, patch }) {
  const s = (field, val) => patch(d => { d.hero[field] = val; return d })
  return (
    <div className="form-section">
      <p className="form-section-title">Hero Section</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Shown at the top of the Contact page.
      </p>
      <div className="field">
        <label>Eyebrow <span className="hint">— small label above the headline</span></label>
        <input value={data.hero.eyebrow} onChange={e => s('eyebrow', e.target.value)} />
      </div>
      <div className="field-grid">
        <div className="field">
          <label>Headline</label>
          <input value={data.hero.headline} onChange={e => s('headline', e.target.value)} />
        </div>
        <div className="field">
          <label>Headline Accent <span className="hint">— highlighted word in blue</span></label>
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

/* ── Contact Items ──────────────────────────────────── */

const ICON_OPTIONS  = 'building · phone · mail · globe · map-pin · clock · users'
const COLOR_OPTIONS = 'blue · red · green · purple · amber'

function ContactItemsTab({ data, patch }) {
  const [addModal, setAddModal] = useState(false)
  function update(i, field, val) {
    patch(d => { d.contactItems[i][field] = val; return d })
  }
  function handleAdd(item) {
    patch(d => { d.contactItems.push(item); return d })
    setAddModal(false)
  }
  function remove(i) {
    patch(d => { d.contactItems.splice(i, 1); return d })
  }

  return (
    <div className="form-section">
      <p className="form-section-title">Contact Items</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        The info cards shown on the Contact page (address, phone, email, etc.).
      </p>

      {data.contactItems.map((item, i) => (
        <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item {i + 1}</span>
            <div style={{ flex: 1 }} />
            <button className="btn-del" onClick={() => remove(i)}>Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 90px 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Icon</label>
              <input value={item.icon} onChange={e => update(i, 'icon', e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Color</label>
              <input value={item.color} onChange={e => update(i, 'color', e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Label</label>
              <input value={item.label} onChange={e => update(i, 'label', e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Href <span className="hint">— optional</span></label>
              <input value={item.href ?? ''} onChange={e => update(i, 'href', e.target.value)} placeholder="tel:… or mailto:…" />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Content</label>
            <textarea rows={2} value={item.content} onChange={e => update(i, 'content', e.target.value)} />
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={() => setAddModal(true)}>+ Add Contact Item</button>
      {addModal && <AddContactItemModal onSave={handleAdd} onCancel={() => setAddModal(false)} />}
    </div>
  )
}

function AddContactItemModal({ onSave, onCancel }) {
  const [icon,    setIcon]    = useState('mail')
  const [color,   setColor]   = useState('blue')
  const [label,   setLabel]   = useState('')
  const [href,    setHref]    = useState('')
  const [content, setContent] = useState('')

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
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Add Contact Item</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 24, color: '#9ca3af', cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Icon <span className="hint">— building · phone · mail · globe · map-pin · clock</span></label>
              <input value={icon} onChange={e => setIcon(e.target.value)} autoFocus />
            </div>
            <div className="field" style={{ width: 140, marginBottom: 0 }}>
              <label>Color</label>
              <select value={color} onChange={e => setColor(e.target.value)} style={{ width: '100%' }}>
                {['blue','red','green','purple','amber'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Label</label>
              <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Email" />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>Href <span className="hint">— optional</span></label>
              <input value={href} onChange={e => setHref(e.target.value)} placeholder="mailto:…" />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Content</label>
            <textarea rows={3} value={content} onChange={e => setContent(e.target.value)} placeholder="info@invendis.com" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px 18px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-save" onClick={() => onSave({ icon, color, label, href: href || undefined, content })} style={{ minWidth: 100 }}>Add Item</button>
        </div>
      </div>
    </div>
  )
}



/* ── Quick Facts ────────────────────────────────────── */

function QuickFactsTab({ data, patch }) {
  function update(i, val) {
    patch(d => { d.quickFacts[i] = val; return d })
  }
  function add() {
    patch(d => { d.quickFacts.push(''); return d })
  }
  function remove(i) {
    patch(d => { d.quickFacts.splice(i, 1); return d })
  }

  return (
    <div className="form-section">
      <p className="form-section-title">Quick Facts</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Short badges shown on the Contact page (e.g. "54+ Countries", "Est. 2007").
      </p>
      {data.quickFacts.map((fact, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            {i === 0 && <label>Fact</label>}
            <input value={fact} onChange={e => update(i, e.target.value)} placeholder="e.g. 54+ Countries" />
          </div>
          <button className="btn-del" style={{ marginTop: i === 0 ? 18 : 0 }} onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button className="btn-add" style={{ marginTop: 8 }} onClick={add}>+ Add Fact</button>
    </div>
  )
}

/* ── Form Labels ────────────────────────────────────── */

function FormLabelsTab({ data, patch }) {
  function s(field, val) {
    patch(d => { d.form[field] = val; return d })
  }
  const f = data.form
  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Form Heading</p>
        <div className="field" style={{ maxWidth: 360 }}>
          <label>Heading</label>
          <input value={f.heading} onChange={e => s('heading', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Field Labels &amp; Placeholders</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          These control what visitors see in the contact form on the website.
        </p>
        {[
          ['nameLabel',        'namePlaceholder',    'Name Field'],
          ['companyLabel',     'companyPlaceholder', 'Company Field'],
          ['emailLabel',       'emailPlaceholder',   'Email Field'],
          ['messageLabel',     'messagePlaceholder', 'Message Field'],
        ].map(([labelKey, placeholderKey, title]) => (
          <div key={labelKey} style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              {title}
            </p>
            <div className="field-grid">
              <div className="field">
                <label>Label</label>
                <input value={f[labelKey]} onChange={e => s(labelKey, e.target.value)} />
              </div>
              <div className="field">
                <label>Placeholder</label>
                <input value={f[placeholderKey]} onChange={e => s(placeholderKey, e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <div className="field" style={{ maxWidth: 280 }}>
          <label>Submit Button Label</label>
          <input value={f.submitLabel} onChange={e => s('submitLabel', e.target.value)} />
        </div>
      </div>
    </>
  )
}

/* ── Map Section ────────────────────────────────────── */

function MapSectionTab({ data, patch }) {
  const s = (field, val) => patch(d => { d.mapSection[field] = val; return d })
  return (
    <div className="form-section">
      <p className="form-section-title">Map Section</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        The world map section at the bottom of the Contact page.
        Use <code style={{ background: '#f4f6f9', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>{'{count}'}</code> in the description — it is replaced automatically with the number of served countries.
      </p>
      <div className="field">
        <label>Eyebrow</label>
        <input value={data.mapSection.eyebrow} onChange={e => s('eyebrow', e.target.value)} />
      </div>
      <div className="field-grid">
        <div className="field">
          <label>Heading</label>
          <input value={data.mapSection.heading} onChange={e => s('heading', e.target.value)} />
        </div>
        <div className="field">
          <label>Heading Accent <span className="hint">— highlighted word in blue</span></label>
          <input value={data.mapSection.headingAccent} onChange={e => s('headingAccent', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={3} value={data.mapSection.description} onChange={e => s('description', e.target.value)} />
        <span className="hint">Tip: keep {'{count}'} in the text — it auto-fills with the countries count</span>
      </div>
    </div>
  )
}
