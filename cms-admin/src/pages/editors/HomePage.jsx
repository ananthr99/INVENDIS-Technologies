import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH     = 'public/content/pages/home.json'
const GH_PAGES_PATH = 'content/pages/home.json'
const TABS = ['Hero', 'Clients Bar', 'What We Do', 'Stats', 'Testimonials', 'CTA Banner']

export default function HomePage() {
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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update home page', ghSha, token)

      const result = await writeFile(FILE_PATH, json, 'CMS: update home page [skip ci]', sha, token)
      setSha(result.content.sha)

      logChange({ userEmail, page: 'Home', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading home page…</span>
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
        {activeTab === 'Hero'         && <HeroTab          data={data} patch={patch} />}
        {activeTab === 'Clients Bar'  && <ClientsBarTab    data={data} patch={patch} />}
        {activeTab === 'What We Do'   && <WhatWeDoTab      data={data} patch={patch} />}
        {activeTab === 'Stats'        && <StatsTab         data={data} patch={patch} />}
        {activeTab === 'Testimonials' && <TestimonialsTab  data={data} patch={patch} />}
        {activeTab === 'CTA Banner'   && <CTABannerTab     data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Hero ──────────────────────────────────────────────── */

function HeroTab({ data, patch }) {
  const h = data.hero
  const s = (path, val) => patch(d => {
    const keys = path.split('.')
    let obj = d
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]] = val
    return d
  })

  function updateStat(i, field, val) { patch(d => { d.hero.stats[i][field] = val; return d }) }
  function addStat()                  { patch(d => { d.hero.stats.push({ value: '', label: '' }); return d }) }
  function removeStat(i)              { patch(d => { d.hero.stats.splice(i, 1); return d }) }

  function updateCardTitle(ci, val)          { patch(d => { d.hero.cards[ci].title = val; return d }) }
  function updateTag(ci, ti, field, val)     { patch(d => { d.hero.cards[ci].tags[ti][field] = val; return d }) }
  function addTag(ci)                        { patch(d => { d.hero.cards[ci].tags.push({ label: '', accent: false }); return d }) }
  function removeTag(ci, ti)                 { patch(d => { d.hero.cards[ci].tags.splice(ti, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Hero Text</p>
        <div className="field">
          <label>Eyebrow <span className="hint">— small label above headline</span></label>
          <input value={h.eyebrow} onChange={e => s('hero.eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Headline</label>
            <input value={h.headline} onChange={e => s('hero.headline', e.target.value)} />
          </div>
          <div className="field">
            <label>Headline Accent <span className="hint">— highlighted in red</span></label>
            <input value={h.headlineAccent} onChange={e => s('hero.headlineAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={3} value={h.description} onChange={e => s('hero.description', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">CTA Buttons</p>
        <div className="field-grid">
          <div className="field">
            <label>Primary Label</label>
            <input value={h.primaryCta.label} onChange={e => s('hero.primaryCta.label', e.target.value)} />
          </div>
          <div className="field">
            <label>Primary Link</label>
            <input value={h.primaryCta.to} onChange={e => s('hero.primaryCta.to', e.target.value)} />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Secondary Label</label>
            <input value={h.secondaryCta.label} onChange={e => s('hero.secondaryCta.label', e.target.value)} />
          </div>
          <div className="field">
            <label>Secondary Link</label>
            <input value={h.secondaryCta.to} onChange={e => s('hero.secondaryCta.to', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Hero Stats</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Three numbers shown inside the hero section.</p>
        {h.stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-end' }}>
            <div className="field" style={{ width: 100, marginBottom: 0 }}>
              {i === 0 && <label>Value</label>}
              <input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="150K+" />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Label</label>}
              <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Telecom sites deployed" />
            </div>
            <button className="btn-del" onClick={() => removeStat(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 8 }} onClick={addStat}>+ Add Stat</button>
      </div>

      <div className="form-section">
        <p className="form-section-title">Hero Cards</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          Three floating cards in the hero (Hardware Products, Software Platforms, Key Clients).
        </p>
        {h.cards.map((card, ci) => (
          <div key={ci} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
            <div className="field" style={{ marginBottom: 10 }}>
              <label>Card Title</label>
              <input style={{ maxWidth: 280 }} value={card.title} onChange={e => updateCardTitle(ci, e.target.value)} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Tags</p>
            {card.tags.map((tag, ti) => (
              <div key={ti} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'center' }}>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <input value={tag.label} onChange={e => updateTag(ci, ti, 'label', e.target.value)} placeholder="Tag label" />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <input type="checkbox" checked={tag.accent} onChange={e => updateTag(ci, ti, 'accent', e.target.checked)} />
                  Accent
                </label>
                <button className="btn-del" onClick={() => removeTag(ci, ti)}>×</button>
              </div>
            ))}
            <button className="btn-add" style={{ marginTop: 4 }} onClick={() => addTag(ci)}>+ Add Tag</button>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Clients Bar ───────────────────────────────────────── */

function ClientsBarTab({ data, patch }) {
  function update(i, val) { patch(d => { d.clientsBar.clients[i] = val; return d }) }
  function add()           { patch(d => { d.clientsBar.clients.push(''); return d }) }
  function remove(i)       { patch(d => { d.clientsBar.clients.splice(i, 1); return d }) }

  return (
    <div className="form-section">
      <p className="form-section-title">Clients Bar</p>
      <div className="field" style={{ maxWidth: 420, marginBottom: 20 }}>
        <label>Heading</label>
        <input value={data.clientsBar.heading} onChange={e => patch(d => { d.clientsBar.heading = e.target.value; return d })} />
      </div>
      <p className="form-section-title" style={{ marginBottom: 8 }}>Client Names</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
        Logos are matched by name — spelling must match the logo filename.
      </p>
      {data.clientsBar.clients.map((client, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            {i === 0 && <label>Client Name</label>}
            <input value={client} onChange={e => update(i, e.target.value)} placeholder="e.g. Nokia" />
          </div>
          <button className="btn-del" style={{ marginTop: i === 0 ? 18 : 0 }} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button className="btn-add" style={{ marginTop: 8 }} onClick={add}>+ Add Client</button>
    </div>
  )
}

/* ── What We Do ────────────────────────────────────────── */

const ICON_OPTIONS = 'signal · sun · zap · network · dashboard · cpu · building · globe · users · mail · map-pin'

function WhatWeDoTab({ data, patch }) {
  const w = data.whatWeDo
  const s = (field, val) => patch(d => { d.whatWeDo[field] = val; return d })

  function update(i, field, val) { patch(d => { d.whatWeDo.features[i][field] = val; return d }) }
  function add()                  { patch(d => { d.whatWeDo.features.push({ icon: 'cpu', accent: 'blue', title: '', description: '' }); return d }) }
  function remove(i)              { patch(d => { d.whatWeDo.features.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={w.eyebrow} onChange={e => s('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={w.heading} onChange={e => s('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent <span className="hint">— highlighted in blue</span></label>
            <input value={w.headingAccent} onChange={e => s('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={w.description} onChange={e => s('description', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Feature Cards</p>
        {w.features.map((f, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Feature {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Icon <span className="hint">— {ICON_OPTIONS}</span></label>
                <input value={f.icon} onChange={e => update(i, 'icon', e.target.value)} />
              </div>
              <div className="field">
                <label>Accent</label>
                <select value={f.accent} onChange={e => update(i, 'accent', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={f.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={2} value={f.description} onChange={e => update(i, 'description', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Feature</button>
      </div>
    </>
  )
}

/* ── Stats ─────────────────────────────────────────────── */

function StatsTab({ data, patch }) {
  function update(i, field, val) { patch(d => { d.stats[i][field] = val; return d }) }
  function add()                  { patch(d => { d.stats.push({ value: '', accent: 'blue', label: '' }); return d }) }
  function remove(i)              { patch(d => { d.stats.splice(i, 1); return d }) }

  return (
    <div className="form-section">
      <p className="form-section-title">Stats Row</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>The four headline numbers shown in the stats band.</p>
      {data.stats.map((stat, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px' }}>
          <div className="field" style={{ width: 90, marginBottom: 0 }}>
            {i === 0 && <label>Value</label>}
            <input value={stat.value} onChange={e => update(i, 'value', e.target.value)} placeholder="17+" />
          </div>
          <div className="field" style={{ width: 90, marginBottom: 0 }}>
            {i === 0 && <label>Accent</label>}
            <select value={stat.accent} onChange={e => update(i, 'accent', e.target.value)}>
              <option value="blue">blue</option>
              <option value="red">red</option>
            </select>
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            {i === 0 && <label>Label</label>}
            <input value={stat.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Years of successful operations" />
          </div>
          <button className="btn-del" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button className="btn-add" style={{ marginTop: 4 }} onClick={add}>+ Add Stat</button>
    </div>
  )
}

/* ── Testimonials ──────────────────────────────────────── */

function TestimonialsTab({ data, patch }) {
  const t = data.testimonials
  const s = (field, val) => patch(d => { d.testimonials[field] = val; return d })

  function update(i, field, val) { patch(d => { d.testimonials.items[i][field] = val; return d }) }
  function add()                  { patch(d => { d.testimonials.items.push({ initials: '', name: '', role: '', quote: '' }); return d }) }
  function remove(i)              { patch(d => { d.testimonials.items.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={t.eyebrow} onChange={e => s('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={t.heading} onChange={e => s('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={t.headingAccent} onChange={e => s('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Testimonials</p>
        {t.items.map((item, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Testimonial {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Initials <span className="hint">— shown in avatar circle</span></label>
                <input style={{ maxWidth: 80 }} value={item.initials} onChange={e => update(i, 'initials', e.target.value)} placeholder="SI" />
              </div>
              <div className="field">
                <label>Name</label>
                <input value={item.name} onChange={e => update(i, 'name', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Role / Company</label>
              <input value={item.role} onChange={e => update(i, 'role', e.target.value)} placeholder="VP Technology, ATC India" />
            </div>
            <div className="field">
              <label>Quote</label>
              <textarea rows={3} value={item.quote} onChange={e => update(i, 'quote', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Testimonial</button>
      </div>
    </>
  )
}

/* ── CTA Banner ────────────────────────────────────────── */

function CTABannerTab({ data, patch }) {
  const b = data.ctaBanner
  const s = (field, val) => patch(d => { d.ctaBanner[field] = val; return d })

  return (
    <div className="form-section">
      <p className="form-section-title">CTA Banner</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        The call-to-action strip at the bottom of the Home page.
      </p>
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
