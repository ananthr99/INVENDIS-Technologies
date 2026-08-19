import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect, writeFileRaw, writeFileRawDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH     = 'public/content/pages/company.json'
const GH_PAGES_PATH = 'content/pages/company.json'
const TABS = ['Hero', 'Mission', 'Values', 'Timeline', 'Facilities', 'Team', 'CTA Banner']

export default function CompanyPage() {
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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update company page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update company page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'Company', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading company page…</span>
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
        {activeTab === 'Hero'       && <HeroTab       data={data} patch={patch} />}
        {activeTab === 'Mission'    && <MissionTab    data={data} patch={patch} />}
        {activeTab === 'Values'     && <ValuesTab     data={data} patch={patch} />}
        {activeTab === 'Timeline'   && <TimelineTab   data={data} patch={patch} />}
        {activeTab === 'Facilities' && <FacilitiesTab data={data} patch={patch} />}
        {activeTab === 'Team'       && <TeamTab       data={data} patch={patch} />}
        {activeTab === 'CTA Banner' && <CTABannerTab  data={data} patch={patch} />}
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

/* ── Mission ── */
function MissionTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.missionSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.mission[i][f] = v; return d }) }
  function add()    { patch(d => { d.mission.push({ icon: 'target', bg: 'blue', title: '', body: '' }); return d }) }
  function remove(i){ patch(d => { d.mission.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.missionSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.missionSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.missionSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Mission Cards</p>
        {data.mission.map((item, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Card {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Icon <span className="hint">— target · eye · lightbulb · etc.</span></label>
                <input value={item.icon} onChange={e => update(i, 'icon', e.target.value)} />
              </div>
              <div className="field">
                <label>Background <span className="hint">— blue or red</span></label>
                <select value={item.bg} onChange={e => update(i, 'bg', e.target.value)} style={{ width: '100%' }}>
                  <option value="blue">blue</option>
                  <option value="red">red</option>
                </select>
              </div>
            </div>
            <div className="field"><label>Title</label><input value={item.title} onChange={e => update(i, 'title', e.target.value)} /></div>
            <div className="field">
              <label>Tagline <span className="hint">— optional, shown in quotes above body</span></label>
              <input value={item.tagline ?? ''} onChange={e => update(i, 'tagline', e.target.value)} placeholder='e.g. "Invent. Discover."' />
            </div>
            <div className="field"><label>Body</label><textarea rows={3} value={item.body} onChange={e => update(i, 'body', e.target.value)} /></div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Card</button>
      </div>
    </>
  )
}

/* ── Values ── */
function ValuesTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.valuesSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.values[i][f] = v; return d }) }
  function add()    { patch(d => { d.values.push({ icon: 'star', title: '', body: '' }); return d }) }
  function remove(i){ patch(d => { d.values.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.valuesSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.valuesSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.valuesSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Values</p>
        {data.values.map((v, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
            <div className="field" style={{ width: 130, marginBottom: 0 }}>
              {i === 0 && <label>Icon</label>}
              <input value={v.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="flask" />
            </div>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              {i === 0 && <label>Title</label>}
              <input value={v.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Body</label>}
              <input value={v.body} onChange={e => update(i, 'body', e.target.value)} />
            </div>
            <button className="btn-del" onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 4 }} onClick={add}>+ Add Value</button>
      </div>
    </>
  )
}

/* ── Timeline ── */
function TimelineTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.timelineSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.timeline[i][f] = v; return d }) }
  function add()    { patch(d => { d.timeline.push({ year: '', title: '', body: '' }); return d }) }
  function remove(i){ patch(d => { d.timeline.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.timelineSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.timelineSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.timelineSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Timeline Events</p>
        {data.timeline.map((item, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
              <div className="field" style={{ width: 110, marginBottom: 0 }}>
                <label>Year</label>
                <input value={item.year} onChange={e => update(i, 'year', e.target.value)} placeholder="2007" />
              </div>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                <label>Title</label>
                <input value={item.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Body</label>
              <textarea rows={2} value={item.body} onChange={e => update(i, 'body', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 4 }} onClick={add}>+ Add Event</button>
      </div>
    </>
  )
}

/* ── Facilities ── */
function FacilitiesTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.facilitiesSection[f] = v; return d })
  function updateFac(i, f, v) { patch(d => { d.facilities[i][f] = v; return d }) }
  function addFac()    { patch(d => { d.facilities.push({ icon: 'building', color: 'blue', label: '', detail: '' }); return d }) }
  function removeFac(i){ patch(d => { d.facilities.splice(i, 1); return d }) }
  function updateCert(i, v) { patch(d => { d.certifications[i] = v; return d }) }
  function addCert()        { patch(d => { d.certifications.push(''); return d }) }
  function removeCert(i)    { patch(d => { d.certifications.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.facilitiesSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.facilitiesSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Description</label><input value={data.facilitiesSection.description} onChange={e => sh('description', e.target.value)} /></div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Facilities</p>
        {data.facilities.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px' }}>
            <div className="field" style={{ width: 110, marginBottom: 0 }}>
              {i === 0 && <label>Icon</label>}
              <input value={f.icon} onChange={e => updateFac(i, 'icon', e.target.value)} />
            </div>
            <div className="field" style={{ width: 90, marginBottom: 0 }}>
              {i === 0 && <label>Color</label>}
              <select value={f.color} onChange={e => updateFac(i, 'color', e.target.value)}>
                <option value="blue">blue</option>
                <option value="red">red</option>
                <option value="muted">muted</option>
              </select>
            </div>
            <div className="field" style={{ width: 130, marginBottom: 0 }}>
              {i === 0 && <label>Label</label>}
              <input value={f.label} onChange={e => updateFac(i, 'label', e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Detail</label>}
              <input value={f.detail} onChange={e => updateFac(i, 'detail', e.target.value)} />
            </div>
            <button className="btn-del" onClick={() => removeFac(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 4 }} onClick={addFac}>+ Add Facility</button>
      </div>
      <div className="form-section">
        <p className="form-section-title">Certifications</p>
        {data.certifications.map((cert, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Certification</label>}
              <input value={cert} onChange={e => updateCert(i, e.target.value)} placeholder="ISO 9001:2015" />
            </div>
            <button className="btn-del" style={{ marginTop: i === 0 ? 18 : 0 }} onClick={() => removeCert(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 8 }} onClick={addCert}>+ Add Certification</button>
      </div>
    </>
  )
}

/* ── Team ── */
const PREVIEW_BASE = 'https://raw.githubusercontent.com/ananthr99/INVENDIS-Technologies/gh-pages/'

function TeamTab({ data, patch }) {
  const { token, toast } = useAdmin()
  const sh = (f, v) => patch(d => { d.teamSection[f] = v; return d })
  function update(i, f, v) { patch(d => { d.team[i][f] = v; return d }) }
  function add()    { patch(d => { d.team.push({ name: '', role: '', photo: null }); return d }) }
  function remove(i){ patch(d => { d.team.splice(i, 1); return d }) }
  function removePhoto(i) { patch(d => { d.team[i].photo = null; return d }) }

  async function handlePhotoUpload(i, file) {
    if (!file) return
    const name = data.team[i].name || `member-${i + 1}`
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const ext  = file.name.split('.').pop().toLowerCase()
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
      try { ghSha = (await readFileDirect(`images/team/${filename}`, token)).sha } catch {}
      await writeFileRawDirect(`images/team/${filename}`, base64, `CMS: upload team photo ${filename}`, ghSha, token)

      let mainSha = null
      try { mainSha = (await readFile(`public/images/team/${filename}`, token)).sha } catch {}
      await writeFileRaw(`public/images/team/${filename}`, base64, `CMS: upload team photo ${filename} [skip ci]`, mainSha, token)

      patch(d => { d.team[i].photo = `images/team/${filename}`; return d })
      toast('Photo uploaded — click Save & Publish to store the path', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    }
  }

  function previewInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()
  }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field"><label>Eyebrow</label><input value={data.teamSection.eyebrow} onChange={e => sh('eyebrow', e.target.value)} /></div>
        <div className="field-grid">
          <div className="field"><label>Heading</label><input value={data.teamSection.heading} onChange={e => sh('heading', e.target.value)} /></div>
          <div className="field"><label>Heading Accent</label><input value={data.teamSection.headingAccent} onChange={e => sh('headingAccent', e.target.value)} /></div>
        </div>
        <div className="field"><label>Description</label><textarea rows={2} value={data.teamSection.description} onChange={e => sh('description', e.target.value)} /></div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Team Members</p>
        {data.team.map((member, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

              {/* Photo upload */}
              <div style={{ flexShrink: 0, textAlign: 'center', width: 72 }}>
                <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', background: '#e5e7eb', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {member.photo ? (
                    <img
                      src={`${PREVIEW_BASE}${member.photo}`}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#9ca3af' }}>{previewInitials(member.name)}</span>
                  )}
                </div>
                <label style={{ fontSize: 11, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', display: 'block' }}>
                  {member.photo ? 'Change' : 'Upload'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotoUpload(i, e.target.files?.[0])} />
                </label>
                {member.photo && (
                  <button onClick={() => removePhoto(i)} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '2px 0', width: '100%' }}>
                    Remove
                  </button>
                )}
              </div>

              {/* Name + Role */}
              <div style={{ flex: 1 }}>
                <div className="field" style={{ marginBottom: 8 }}>
                  <label>Name</label>
                  <input value={member.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Full name" />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Role</label>
                  <input value={member.role} onChange={e => update(i, 'role', e.target.value)} placeholder="CEO" />
                </div>
              </div>

              <button className="btn-del" onClick={() => remove(i)} style={{ marginTop: 20 }}>Remove</button>
            </div>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 8 }} onClick={add}>+ Add Member</button>
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
