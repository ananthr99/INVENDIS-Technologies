import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { readFile, writeFile, readFileDirect, writeFileDirect, writeFileRaw, writeFileRawDirect } from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const FILE_PATH     = 'public/content/pages/silbo.json'
const GH_PAGES_PATH = 'content/pages/silbo.json'
const PREVIEW_BASE  = 'https://raw.githubusercontent.com/ananthr99/INVENDIS-Technologies/gh-pages/'
const TABS = ['Hero', 'About', 'Capabilities', 'Use Cases', 'Products', 'Market Fit', 'Partners', 'CTA Banner']

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function SilboPage() {
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

        // Migrate: productIds (string[]) → products (object[])
        if (parsed.intelSection.productIds && !parsed.intelSection.products) {
          parsed.intelSection.products = parsed.intelSection.productIds.map(id => ({
            id, title: '', image: null, tags: [],
          }))
        }
        if (!parsed.intelSection.products) parsed.intelSection.products = []

        // Migrate: ensure latestLaunch has image + tags
        if (!parsed.latestLaunch.tags)               parsed.latestLaunch.tags  = []
        if (!('image' in parsed.latestLaunch))        parsed.latestLaunch.image = null

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
      await writeFileDirect(GH_PAGES_PATH, json, 'CMS: update SILBO page', ghSha, token)
      const result = await writeFile(FILE_PATH, json, 'CMS: update SILBO page [skip ci]', sha, token)
      setSha(result.content.sha)
      logChange({ userEmail, page: 'SILBO', section: activeTab, token, before: originalData, after: data })
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
      <div className="spinner" /><span style={{ fontSize: 13, color: '#6b7280' }}>Loading SILBO page…</span>
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
        {activeTab === 'About'        && <AboutTab        data={data} patch={patch} />}
        {activeTab === 'Capabilities' && <CapabilitiesTab data={data} patch={patch} />}
        {activeTab === 'Use Cases'    && <UseCasesTab     data={data} patch={patch} />}
        {activeTab === 'Products'     && <ProductsTab     data={data} patch={patch} token={token} toast={toast} />}
        {activeTab === 'Market Fit'   && <MarketFitTab    data={data} patch={patch} />}
        {activeTab === 'Partners'     && <PartnersTab     data={data} patch={patch} />}
        {activeTab === 'CTA Banner'   && <CTABannerTab    data={data} patch={patch} />}
      </div>
    </>
  )
}

/* ── Hero ── */
function HeroTab({ data, patch }) {
  const s  = (f, v) => patch(d => { d.hero[f] = v; return d })
  const sc = (cta, f, v) => patch(d => { d.hero[cta][f] = v; return d })
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
        <p className="form-section-title">CTA Buttons</p>
        <div className="field-grid">
          <div className="field">
            <label>Primary Label</label>
            <input value={data.hero.primaryCta.label} onChange={e => sc('primaryCta', 'label', e.target.value)} />
          </div>
          <div className="field">
            <label>Primary Link</label>
            <input value={data.hero.primaryCta.to} onChange={e => sc('primaryCta', 'to', e.target.value)} />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Secondary Label</label>
            <input value={data.hero.secondaryCta.label} onChange={e => sc('secondaryCta', 'label', e.target.value)} />
          </div>
          <div className="field">
            <label>Secondary Link</label>
            <input value={data.hero.secondaryCta.to} onChange={e => sc('secondaryCta', 'to', e.target.value)} />
          </div>
        </div>
      </div>
    </>
  )
}

/* ── About ── */
function AboutTab({ data, patch }) {
  const s = (f, v) => patch(d => { d.aboutSection[f] = v; return d })
  return (
    <div className="form-section">
      <p className="form-section-title">About Section</p>
      <div className="field">
        <label>Eyebrow</label>
        <input value={data.aboutSection.eyebrow} onChange={e => s('eyebrow', e.target.value)} />
      </div>
      <div className="field">
        <label>Heading</label>
        <input value={data.aboutSection.heading} onChange={e => s('heading', e.target.value)} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={6} value={data.aboutSection.description} onChange={e => s('description', e.target.value)} />
      </div>
    </div>
  )
}

/* ── Capabilities ── */
function CapabilitiesTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.capabilities[f] = v; return d })
  function update(i, f, v) { patch(d => { d.capabilities.items[i][f] = v; return d }) }
  function add()     { patch(d => { d.capabilities.items.push({ icon: 'cpu', title: '', desc: '' }); return d }) }
  function remove(i) { patch(d => { d.capabilities.items.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.capabilities.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.capabilities.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.capabilities.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Capability Cards</p>
        {data.capabilities.items.map((item, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Card {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Icon</label>
                <input value={item.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="cpu" />
              </div>
              <div className="field">
                <label>Title</label>
                <input value={item.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={3} value={item.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Card</button>
      </div>
    </>
  )
}

/* ── Use Cases ── */
function UseCasesTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.useCases[f] = v; return d })
  function update(i, f, v) { patch(d => { d.useCases.items[i][f] = v; return d }) }
  function add()     { patch(d => { d.useCases.items.push({ icon: 'zap', sector: '', title: '', desc: '' }); return d }) }
  function remove(i) { patch(d => { d.useCases.items.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.useCases.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.useCases.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.useCases.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Use Case Cards</p>
        {data.useCases.items.map((item, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Use Case {i + 1}</span>
              <button className="btn-del" onClick={() => remove(i)}>Remove</button>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Icon</label>
                <input value={item.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="zap" />
              </div>
              <div className="field">
                <label>Sector <span className="hint">— e.g. Energy and Utility</span></label>
                <input value={item.sector} onChange={e => update(i, 'sector', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={item.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={3} value={item.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={add}>+ Add Use Case</button>
      </div>
    </>
  )
}

/* ── Products (Latest Launch + Intel Edge + Product Range) ── */
function ProductsTab({ data, patch, token, toast }) {
  const sl = (f, v) => patch(d => { d.latestLaunch[f] = v; return d })
  const si = (f, v) => patch(d => { d.intelSection[f] = v; return d })

  /* ── Latest Launch image ── */
  async function handleLaunchImage(file) {
    if (!file) return
    const ext  = file.name.split('.').pop().toLowerCase()
    const name = `latest-launch.${ext}`
    const b64  = await toBase64(file)
    try {
      toast('Uploading…', '')
      let ghSha = null
      try { ghSha = (await readFileDirect(`images/silbo/${name}`, token)).sha } catch {}
      await writeFileRawDirect(`images/silbo/${name}`, b64, `CMS: upload SILBO launch image`, ghSha, token)
      let mainSha = null
      try { mainSha = (await readFile(`public/images/silbo/${name}`, token)).sha } catch {}
      await writeFileRaw(`public/images/silbo/${name}`, b64, `CMS: upload SILBO launch image [skip ci]`, mainSha, token)
      patch(d => { d.latestLaunch.image = `images/silbo/${name}`; return d })
      toast('Uploaded — click Save & Publish', 'ok')
    } catch (e) { toast(e.message, 'err') }
  }

  /* ── Latest Launch tags ── */
  const addLaunchTag    = ()        => patch(d => { d.latestLaunch.tags.push(''); return d })
  const updateLaunchTag = (i, v)    => patch(d => { d.latestLaunch.tags[i] = v; return d })
  const removeLaunchTag = i         => patch(d => { d.latestLaunch.tags.splice(i, 1); return d })

  /* ── Intel products ── */
  const addProduct    = ()        => patch(d => { d.intelSection.products.push({ id: '', title: '', image: null, tags: [] }); return d })
  const removeProduct = i         => patch(d => { d.intelSection.products.splice(i, 1); return d })
  const updateProduct = (i, f, v) => patch(d => { d.intelSection.products[i][f] = v; return d })
  const addTag        = i         => patch(d => { d.intelSection.products[i].tags.push(''); return d })
  const updateTag     = (i, ti, v)=> patch(d => { d.intelSection.products[i].tags[ti] = v; return d })
  const removeTag     = (i, ti)   => patch(d => { d.intelSection.products[i].tags.splice(ti, 1); return d })

  async function handleProductImage(i, file) {
    if (!file) return
    const id   = data.intelSection.products[i].id || `product-${i + 1}`
    const slug = id.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const ext  = file.name.split('.').pop().toLowerCase()
    const name = `${slug}.${ext}`
    const b64  = await toBase64(file)
    try {
      toast('Uploading…', '')
      let ghSha = null
      try { ghSha = (await readFileDirect(`images/silbo/${name}`, token)).sha } catch {}
      await writeFileRawDirect(`images/silbo/${name}`, b64, `CMS: upload SILBO product image ${name}`, ghSha, token)
      let mainSha = null
      try { mainSha = (await readFile(`public/images/silbo/${name}`, token)).sha } catch {}
      await writeFileRaw(`public/images/silbo/${name}`, b64, `CMS: upload SILBO product image ${name} [skip ci]`, mainSha, token)
      patch(d => { d.intelSection.products[i].image = `images/silbo/${name}`; return d })
      toast('Uploaded — click Save & Publish', 'ok')
    } catch (e) { toast(e.message, 'err') }
  }

  const products   = data.intelSection.products || []
  const launchTags = data.latestLaunch.tags     || []

  return (
    <>
      {/* ── Latest Launch ── */}
      <div className="form-section">
        <p className="form-section-title">Latest Launch</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Highlighted product banner shown in the hero area.</p>
        <div className="field-grid">
          <div className="field">
            <label>Product ID</label>
            <input value={data.latestLaunch.productId} onChange={e => sl('productId', e.target.value)} placeholder="inv-ceb-xx" />
          </div>
          <div className="field">
            <label>Badge Label</label>
            <input value={data.latestLaunch.badge} onChange={e => sl('badge', e.target.value)} placeholder="Latest Launch" />
          </div>
        </div>
        <div className="field">
          <label>Highlight Text</label>
          <textarea rows={3} value={data.latestLaunch.highlight} onChange={e => sl('highlight', e.target.value)} />
        </div>

        <div className="field">
          <label>Product Image</label>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 4 }}>
            <div style={{ width: 110, height: 80, borderRadius: 8, background: '#e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {data.latestLaunch.image
                ? <img src={`${PREVIEW_BASE}${data.latestLaunch.image}`} alt="launch" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none' }} />
                : <span style={{ fontSize: 11, color: '#9ca3af' }}>No image</span>
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
              <label style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
                {data.latestLaunch.image ? 'Change image' : 'Upload image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleLaunchImage(e.target.files?.[0])} />
              </label>
              {data.latestLaunch.image && (
                <button onClick={() => sl('image', null)} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0, textAlign: 'left' }}>
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="field">
          <label>Tags / Pills</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: launchTags.length ? 8 : 0 }}>
            {launchTags.map((tag, ti) => (
              <div key={ti} style={{ display: 'flex', alignItems: 'center', background: '#e0e7ff', borderRadius: 20, padding: '3px 10px', gap: 4 }}>
                <input
                  value={tag}
                  onChange={e => updateLaunchTag(ti, e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontSize: 12, color: '#1e40af', width: Math.max(40, tag.length * 8), outline: 'none' }}
                  placeholder="tag"
                />
                <button onClick={() => removeLaunchTag(ti)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
          <button className="btn-add" onClick={addLaunchTag}>+ Add Tag</button>
        </div>
      </div>

      {/* ── Intel Edge ── */}
      <div className="form-section">
        <p className="form-section-title">Intel Edge Compute Section</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.intelSection.eyebrow} onChange={e => si('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.intelSection.heading} onChange={e => si('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.intelSection.headingAccent} onChange={e => si('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={data.intelSection.description} onChange={e => si('description', e.target.value)} />
        </div>

        <p className="form-section-title" style={{ marginTop: 8 }}>Products</p>
        {products.map((product, i) => (
          <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Product {i + 1}</span>
              <button className="btn-del" onClick={() => removeProduct(i)}>Remove</button>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Image column */}
              <div style={{ flexShrink: 0, textAlign: 'center', width: 88 }}>
                <div style={{ width: 88, height: 66, borderRadius: 8, background: '#e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  {product.image
                    ? <img src={`${PREVIEW_BASE}${product.image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none' }} />
                    : <span style={{ fontSize: 10, color: '#9ca3af' }}>No image</span>
                  }
                </div>
                <label style={{ fontSize: 11, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', display: 'block' }}>
                  {product.image ? 'Change' : 'Upload'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleProductImage(i, e.target.files?.[0])} />
                </label>
                {product.image && (
                  <button onClick={() => updateProduct(i, 'image', null)} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '2px 0', width: '100%' }}>
                    Remove
                  </button>
                )}
              </div>

              {/* Fields column */}
              <div style={{ flex: 1 }}>
                <div className="field-grid">
                  <div className="field">
                    <label>Product ID</label>
                    <input value={product.id} onChange={e => updateProduct(i, 'id', e.target.value)} placeholder="inv-ce-xx" />
                  </div>
                  <div className="field">
                    <label>Title</label>
                    <input value={product.title} onChange={e => updateProduct(i, 'title', e.target.value)} placeholder="Intel Edge Gateway" />
                  </div>
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
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={addProduct}>+ Add Product</button>
      </div>

    </>
  )
}

/* ── Market Fit ── */
function MarketFitTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.marketFit[f] = v; return d })
  function update(i, f, v) { patch(d => { d.marketFit.items[i][f] = v; return d }) }
  function add()     { patch(d => { d.marketFit.items.push({ icon: 'radio', title: '', desc: '' }); return d }) }
  function remove(i) { patch(d => { d.marketFit.items.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.marketFit.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.marketFit.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.marketFit.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Deployment Cards</p>
        {data.marketFit.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px' }}>
            <div className="field" style={{ width: 110, marginBottom: 0 }}>
              {i === 0 && <label>Icon</label>}
              <input value={item.icon} onChange={e => update(i, 'icon', e.target.value)} placeholder="radio" />
            </div>
            <div className="field" style={{ width: 200, marginBottom: 0 }}>
              {i === 0 && <label>Title</label>}
              <input value={item.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Description</label>}
              <input value={item.desc} onChange={e => update(i, 'desc', e.target.value)} />
            </div>
            <button className="btn-del" onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 4 }} onClick={add}>+ Add Card</button>
      </div>
    </>
  )
}

/* ── Partners ── */
function PartnersTab({ data, patch }) {
  const sh = (f, v) => patch(d => { d.partners[f] = v; return d })
  function update(i, f, v) { patch(d => { d.partners.items[i][f] = v; return d }) }
  function add()     { patch(d => { d.partners.items.push({ name: '', role: '' }); return d }) }
  function remove(i) { patch(d => { d.partners.items.splice(i, 1); return d }) }

  return (
    <>
      <div className="form-section">
        <p className="form-section-title">Section Header</p>
        <div className="field">
          <label>Eyebrow</label>
          <input value={data.partners.eyebrow} onChange={e => sh('eyebrow', e.target.value)} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Heading</label>
            <input value={data.partners.heading} onChange={e => sh('heading', e.target.value)} />
          </div>
          <div className="field">
            <label>Heading Accent</label>
            <input value={data.partners.headingAccent} onChange={e => sh('headingAccent', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={data.partners.description} onChange={e => sh('description', e.target.value)} />
        </div>
      </div>
      <div className="form-section">
        <p className="form-section-title">Technology Partners</p>
        {data.partners.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-end' }}>
            <div className="field" style={{ width: 160, marginBottom: 0 }}>
              {i === 0 && <label>Partner Name</label>}
              <input value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Intel" />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              {i === 0 && <label>Role / Contribution</label>}
              <input value={item.role} onChange={e => update(i, 'role', e.target.value)} placeholder="Edge Compute & x86 Processing" />
            </div>
            <button className="btn-del" style={{ marginTop: i === 0 ? 18 : 0 }} onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 8 }} onClick={add}>+ Add Partner</button>
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
