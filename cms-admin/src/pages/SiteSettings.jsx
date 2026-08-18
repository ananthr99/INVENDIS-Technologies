import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { readFile, writeFile } from '../github/githubApi'

const FILE_PATH = 'src/content/siteSettings.json'
const TABS = ['Navigation', 'Contact', 'WhatsApp', 'Footer', 'Logos']

export default function SiteSettings() {
  const { token, toast } = useAdmin()
  const [data,      setData]      = useState(null)
  const [sha,       setSha]       = useState('')
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [activeTab, setActiveTab] = useState('Navigation')

  useEffect(() => {
    async function load() {
      try {
        const result = await readFile(FILE_PATH, token)
        setData(JSON.parse(result.content))
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
      const result = await writeFile(
        FILE_PATH,
        JSON.stringify(data, null, 2),
        'CMS: update site settings',
        sha,
        token
      )
      setSha(result.content.sha)
      toast('Site settings saved — publishing in ~1 min', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  function patch(updater) {
    setData(prev => updater(structuredClone(prev)))
  }

  if (loading) return <LoadingPanel />
  if (!data)   return null

  return (
    <>
      <div className="tab-bar">
        {TABS.map(t => (
          <button
            key={t}
            className={`tab${activeTab === t ? ' active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
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
        {activeTab === 'Navigation' && <NavTab    data={data} patch={patch} />}
        {activeTab === 'Contact'    && <ContactTab data={data} patch={patch} />}
        {activeTab === 'WhatsApp'   && <WhatsAppTab data={data} patch={patch} />}
        {activeTab === 'Footer'     && <FooterTab  data={data} patch={patch} />}
        {activeTab === 'Logos'      && <LogosTab   data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Navigation Tab ─────────────────────────────── */

function NavTab({ data, patch }) {
  function updateLink(i, field, value) {
    patch(d => { d.nav.links[i][field] = value; return d })
  }
  function addLink() {
    patch(d => { d.nav.links.push({ label: '', to: '/' }); return d })
  }
  function removeLink(i) {
    patch(d => { d.nav.links.splice(i, 1); return d })
  }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Navigation Links</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          These appear in the top navigation bar of the website.
        </p>
        {data.nav.links.map((link, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Display Label</label>}
              <input
                value={link.label}
                onChange={e => updateLink(i, 'label', e.target.value)}
                placeholder="Label"
              />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>URL Path</label>}
              <input
                value={link.to}
                onChange={e => updateLink(i, 'to', e.target.value)}
                placeholder="/path"
              />
            </div>
            <button className="btn-del" onClick={() => removeLink(i)}>
              Remove
            </button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 8 }} onClick={addLink}>
          + Add Nav Link
        </button>
      </div>

      <div className="form-section">
        <p className="form-section-title">Header CTA Button</p>
        <div className="field" style={{ maxWidth: 280 }}>
          <label>Button Label</label>
          <input
            value={data.nav.contactCta}
            onChange={e => patch(d => { d.nav.contactCta = e.target.value; return d })}
          />
            <span className="hint">⚠ Mobile only — this button appears at the bottom of the hamburger menu on small screens. It is not visible on desktop. Test changes by resizing your browser to mobile width.</span>
        </div>
      </div>
    </>
  )
}

/* ── Contact Tab ────────────────────────────────── */

function ContactTab({ data, patch }) {
  function updateWebsite(i, field, value) {
    patch(d => { d.contact.websites[i][field] = value; return d })
  }
  function addWebsite() {
    patch(d => { d.contact.websites.push({ label: '', url: '' }); return d })
  }
  function removeWebsite(i) {
    patch(d => { d.contact.websites.splice(i, 1); return d })
  }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Contact Details</p>
        <div className="field-grid">
          <div className="field">
            <label>Email Address</label>
            <input
              value={data.contact.email}
              onChange={e => patch(d => { d.contact.email = e.target.value; return d })}
            />
          </div>
          <div className="field">
            <label>Phone (display)</label>
            <input
              value={data.contact.phone}
              onChange={e => patch(d => { d.contact.phone = e.target.value; return d })}
            />
          </div>
        </div>
        <div className="field">
          <label>
            Phone href
            <span className="hint"> — used for the tel: link (e.g. tel:+916361509463)</span>
          </label>
          <input
            value={data.contact.phoneHref}
            onChange={e => patch(d => { d.contact.phoneHref = e.target.value; return d })}
          />
        </div>
        <div className="field">
          <label>Office Address</label>
          <textarea
            value={data.contact.address}
            onChange={e => patch(d => { d.contact.address = e.target.value; return d })}
            rows={3}
          />
        </div>
        <div className="field">
          <label>Foreign Office</label>
          <input
            value={data.contact.foreignOffice}
            onChange={e => patch(d => { d.contact.foreignOffice = e.target.value; return d })}
          />
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Website Links</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          Website URLs shown in the contact section.
        </p>
        {data.contact.websites.map((site, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Display Label</label>}
              <input
                value={site.label}
                onChange={e => updateWebsite(i, 'label', e.target.value)}
                placeholder="www.example.com"
              />
            </div>
            <div className="field" style={{ flex: 2, marginBottom: 0 }}>
              {i === 0 && <label>Full URL</label>}
              <input
                value={site.url}
                onChange={e => updateWebsite(i, 'url', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
            <button className="btn-del" onClick={() => removeWebsite(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 8 }} onClick={addWebsite}>
          + Add Website
        </button>
      </div>
    </>
  )
}

/* ── WhatsApp Tab ───────────────────────────────── */

function WhatsAppTab({ data, patch }) {
  return (
    <div className="form-section">
      <p className="form-section-title">WhatsApp Contact</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Used for the WhatsApp chat button on the website.
      </p>
      <div className="field" style={{ maxWidth: 320 }}>
        <label>
          WhatsApp Number
          <span className="hint"> — country code + number, no spaces or + (e.g. 916361509463)</span>
        </label>
        <input
          value={data.whatsapp.number}
          onChange={e => patch(d => { d.whatsapp.number = e.target.value; return d })}
          placeholder="916361509463"
        />
      </div>
      <div className="field">
        <label>Pre-filled Message</label>
        <textarea
          value={data.whatsapp.message}
          onChange={e => patch(d => { d.whatsapp.message = e.target.value; return d })}
          rows={3}
        />
        <span className="hint">This message is pre-filled when a visitor opens the WhatsApp chat</span>
      </div>
    </div>
  )
}

/* ── Footer Tab ─────────────────────────────────── */

function FooterTab({ data, patch }) {
  function updateGroupTitle(gi, value) {
    patch(d => { d.footer.linkGroups[gi].title = value; return d })
  }
  function updateGroupLink(gi, li, field, value) {
    patch(d => { d.footer.linkGroups[gi].links[li][field] = value; return d })
  }
  function addGroupLink(gi) {
    patch(d => { d.footer.linkGroups[gi].links.push({ label: '', to: '/' }); return d })
  }
  function removeGroupLink(gi, li) {
    patch(d => { d.footer.linkGroups[gi].links.splice(li, 1); return d })
  }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Footer Text</p>
        <div className="field">
          <label>Tagline</label>
          <input
            value={data.footer.tagline}
            onChange={e => patch(d => { d.footer.tagline = e.target.value; return d })}
          />
          <span className="hint">Short description shown below the logo in the footer</span>
        </div>
        <div className="field">
          <label>Copyright</label>
          <input
            value={data.footer.copyright}
            onChange={e => patch(d => { d.footer.copyright = e.target.value; return d })}
          />
        </div>
      </div>

      {data.footer.linkGroups.map((group, gi) => (
        <div key={gi} className="form-section" style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px' }}>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Column Title</label>
            <input
              value={group.title}
              style={{ maxWidth: 240 }}
              onChange={e => updateGroupTitle(gi, e.target.value)}
            />
          </div>
          {group.links.map((link, li) => (
            <div key={li} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2, marginBottom: 0 }}>
                {li === 0 && <label>Link Label</label>}
                <input
                  value={link.label}
                  onChange={e => updateGroupLink(gi, li, 'label', e.target.value)}
                  placeholder="Label"
                />
              </div>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                {li === 0 && <label>Path</label>}
                <input
                  value={link.to}
                  onChange={e => updateGroupLink(gi, li, 'to', e.target.value)}
                  placeholder="/path"
                />
              </div>
              <button className="btn-del" onClick={() => removeGroupLink(gi, li)}>
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn-add"
            style={{ marginTop: 8 }}
            onClick={() => addGroupLink(gi)}
          >
            + Add Link to {group.title}
          </button>
        </div>
      ))}
    </>
  )
}

/* ── Logos Tab ──────────────────────────────────── */

function LogosTab({ data, patch }) {
  return (
    <div className="form-section">
      <p className="form-section-title">Logo Paths</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
        Enter the file path relative to the public folder. Image upload will be added in a later step.
      </p>
      <div className="field">
        <label>INVENDIS Logo</label>
        <input
          value={data.logos.invendis}
          onChange={e => patch(d => { d.logos.invendis = e.target.value; return d })}
          placeholder="/images/logos/invendis-logo.png"
        />
      </div>
      <div className="field">
        <label>SILBO Logo</label>
        <input
          value={data.logos.silbo}
          onChange={e => patch(d => { d.logos.silbo = e.target.value; return d })}
          placeholder="/images/logos/silbo-logo.png"
        />
      </div>
      <div className="field">
        <label>Make in India Badge</label>
        <input
          value={data.logos.makeInIndia}
          onChange={e => patch(d => { d.logos.makeInIndia = e.target.value; return d })}
          placeholder="/images/logos/make-in-india.png"
        />
      </div>
    </div>
  )
}

/* ── Shared ─────────────────────────────────────── */

function LoadingPanel() {
  return (
    <div className="tab-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" />
      <span style={{ fontSize: 13, color: '#6b7280' }}>Loading site settings…</span>
    </div>
  )
}
