import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import {
  readFile, writeFile,
  readFileDirect, writeFileDirect,
  deleteFile, deleteFileDirect,
} from '../../github/githubApi'
import { logChange } from '../../utils/logChange'

const INDEX_MAIN = 'public/content/blog/_index.json'
const INDEX_GH   = 'content/blog/_index.json'

const CATEGORIES = ['Technical Article', 'Application Note', 'Industry Insight', 'Case Study']

const CAT_COLORS = {
  'Technical Article': { bg: '#eff6ff', color: '#1d4ed8' },
  'Application Note':  { bg: '#ecfdf5', color: '#065f46' },
  'Industry Insight':  { bg: '#fffbeb', color: '#92400e' },
  'Case Study':        { bg: '#fef2f2', color: '#991b1b' },
}

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function readingTime(text) {
  return Math.max(1, Math.ceil((text || '').trim().split(/\s+/).length / 200))
}

const EMPTY = {
  slug: '', title: '', date: '', category: 'Technical Article',
  author: 'Invendis Team', excerpt: '', body: '', tags: '',
}

const card = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: '24px 28px',
  marginBottom: 16,
}

const sectionTitle = {
  fontSize: 10,
  fontWeight: 700,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: 16,
}

export default function BlogPage() {
  const { token, toast, userEmail } = useAdmin()
  const [view, setView]         = useState('list')
  const [posts, setPosts]       = useState([])
  const [indexSha, setIndexSha] = useState('')
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [isNew, setIsNew]       = useState(true)
  const [postSha, setPostSha]   = useState('')
  const [slugLocked, setSlugLocked] = useState(false)

  useEffect(() => { loadIndex() }, [])

  async function loadIndex() {
    setLoading(true)
    try {
      const result = await readFile(INDEX_MAIN, token)
      const parsed = JSON.parse(result.content)
      setPosts(parsed.sort((a, b) => new Date(b.date) - new Date(a.date)))
      setIndexSha(result.sha)
    } catch {
      setPosts([])
      setIndexSha('')
    } finally {
      setLoading(false)
    }
  }

  async function saveIndex(newPosts) {
    const json = JSON.stringify(newPosts, null, 2)
    let ghSha = null
    try { ghSha = (await readFileDirect(INDEX_GH, token)).sha } catch {}
    await writeFileDirect(INDEX_GH, json, 'CMS: update blog index', ghSha, token)
    const result = await writeFile(INDEX_MAIN, json, 'CMS: update blog index [skip ci]', indexSha || undefined, token)
    setIndexSha(result.content.sha)
  }

  function handleNew() {
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) })
    setIsNew(true)
    setPostSha('')
    setSlugLocked(false)
    setView('edit')
  }

  async function handleEdit(post) {
    try {
      const result = await readFile(`public/content/blog/${post.slug}.json`, token)
      const data = JSON.parse(result.content)
      setForm({
        slug:     post.slug,
        title:    data.title    || '',
        date:     data.date     || '',
        category: data.category || 'Technical Article',
        author:   data.author   || '',
        excerpt:  data.excerpt  || '',
        body:     data.body     || '',
        tags:     Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
      })
      setPostSha(result.sha)
      setIsNew(false)
      setSlugLocked(true)
      setView('edit')
    } catch (e) {
      toast(e.message, 'err')
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"?\n\nThis cannot be undone.`)) return
    setDeleting(post.slug)
    try {
      const mainPath = `public/content/blog/${post.slug}.json`
      const ghPath   = `content/blog/${post.slug}.json`
      const { sha: mSha } = await readFile(mainPath, token)
      await deleteFile(mainPath, mSha, `CMS: delete blog post ${post.slug}`, token)
      try {
        const { sha: gSha } = await readFileDirect(ghPath, token)
        await deleteFileDirect(ghPath, gSha, `CMS: delete blog post ${post.slug}`, token)
      } catch {}
      const newPosts = posts.filter(p => p.slug !== post.slug)
      await saveIndex(newPosts)
      setPosts(newPosts)
      logChange({ userEmail, page: 'Blog', section: post.title, token, before: post, after: null })
      toast('Post deleted', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setDeleting(null)
    }
  }

  async function handleSave() {
    const { title, date, category, author, excerpt, body, tags } = form
    if (!title.trim())  { toast('Title is required', 'err');   return }
    if (!date)          { toast('Date is required', 'err');    return }
    if (!excerpt.trim()){ toast('Excerpt is required', 'err'); return }
    if (!body.trim())   { toast('Body is required', 'err');    return }

    const slug = form.slug.trim() || slugify(title)
    if (!slug) { toast('Could not generate a slug from the title', 'err'); return }
    if (isNew && posts.some(p => p.slug === slug)) {
      toast(`A post with slug "${slug}" already exists`, 'err'); return
    }

    setSaving(true)
    try {
      const tagsArr  = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
      const postData = { title: title.trim(), date, category, author: author.trim(), excerpt: excerpt.trim(), body: body.trim(), tags: tagsArr }
      const json     = JSON.stringify(postData, null, 2)
      const mainPath = `public/content/blog/${slug}.json`
      const ghPath   = `content/blog/${slug}.json`

      let ghPostSha = null
      try { ghPostSha = (await readFileDirect(ghPath, token)).sha } catch {}
      await writeFileDirect(ghPath, json, `CMS: ${isNew ? 'create' : 'update'} blog post ${slug}`, ghPostSha, token)
      const saved = await writeFile(mainPath, json, `CMS: ${isNew ? 'create' : 'update'} blog post ${slug} [skip ci]`, postSha || undefined, token)
      setPostSha(saved.content.sha)

      const entry = { slug, title: title.trim(), date, category, author: author.trim(), excerpt: excerpt.trim(), readTime: readingTime(body) }
      const newPosts = isNew
        ? [entry, ...posts]
        : posts.map(p => p.slug === slug ? entry : p)
      const sorted = [...newPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
      await saveIndex(sorted)
      setPosts(sorted)

      logChange({ userEmail, page: 'Blog', section: title, token, before: isNew ? null : posts.find(p => p.slug === slug), after: entry })
      setIsNew(false)
      setSlugLocked(true)
      setForm(prev => ({ ...prev, slug }))
      toast('Saved — live in seconds', 'ok')
    } catch (e) {
      toast(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  function patch(key, val) {
    setForm(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'title' && !slugLocked) next.slug = slugify(val)
      return next
    })
  }

  function backToList() {
    setView('list')
    setForm(EMPTY)
    setIsNew(true)
    setSlugLocked(false)
    setPostSha('')
  }

  if (loading) return (
    <div className="tab-panel" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="spinner" />
      <span style={{ fontSize: 13, color: '#6b7280' }}>Loading blog posts…</span>
    </div>
  )

  // ── List view ────────────────────────────────────────────────────────────────
  if (view === 'list') return (
    <>
      <div className="tab-bar">
        <span style={{ padding: '0 4px', fontSize: 14, fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center' }}>
          Blog Posts
          {posts.length > 0 && (
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, background: '#f3f4f6', color: '#6b7280', padding: '1px 7px', borderRadius: 10 }}>
              {posts.length}
            </span>
          )}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <button className="btn-save" onClick={handleNew}>+ New Post</button>
        </div>
      </div>

      <div className="tab-panel">
        {posts.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '56px 28px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>✍️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1d23', marginBottom: 6 }}>No blog posts yet</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Create your first article to start publishing content.</p>
            <button className="btn-save" onClick={handleNew}>+ New Post</button>
          </div>
        ) : (
          <div style={card}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {[['Date', '120px'], ['Category', '160px'], ['Title', ''], ['Author', '130px'], ['', '100px']].map(([h, w]) => (
                    <th key={h} style={{ padding: '8px 12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em', textAlign: h === '' ? 'right' : 'left', width: w || undefined }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(post => {
                  const cc = CAT_COLORS[post.category] || { bg: '#f3f4f6', color: '#374151' }
                  return (
                    <tr key={post.slug} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 12px', color: '#6b7280', whiteSpace: 'nowrap', fontSize: 12 }}>{post.date}</td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: cc.bg, color: cc.color }}>
                          {post.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <p style={{ fontWeight: 600, color: '#111827', marginBottom: 2 }}>{post.title}</p>
                        <p style={{ fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 340 }}>{post.excerpt}</p>
                      </td>
                      <td style={{ padding: '12px 12px', color: '#6b7280', fontSize: 12 }}>{post.author}</td>
                      <td style={{ padding: '12px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleEdit(post)}
                          style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#374151', cursor: 'pointer', marginRight: 6, fontFamily: 'inherit', transition: 'border-color .15s' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={deleting === post.slug}
                          style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          {deleting === post.slug ? '…' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )

  // ── Edit view ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="tab-bar">
        <button
          onClick={backToList}
          style={{ padding: '0 12px', fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}
        >
          ← All Posts
        </button>
        <div style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
        <span style={{ padding: '0 8px', fontSize: 13, fontWeight: 600, color: '#111827' }}>
          {isNew ? 'New Post' : 'Edit Post'}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Publishing…' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div className="tab-panel">
        <div style={{ maxWidth: 840 }}>

          {/* ── Basic info card ── */}
          <div style={card}>
            <p style={sectionTitle}>Basic Information</p>

            <div className="field">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={e => patch('title', e.target.value)}
                placeholder="e.g. How to Deploy an IIoT Gateway in a Remote Site"
              />
            </div>

            <div className="field">
              <label>
                Slug (URL path)
                {slugLocked
                  ? <span className="hint"> — locked after first save</span>
                  : <span className="hint"> — auto-filled from title, edit before saving if needed</span>}
              </label>
              <input
                value={form.slug}
                onChange={e => !slugLocked && setForm(prev => ({ ...prev, slug: e.target.value }))}
                readOnly={slugLocked}
                style={slugLocked ? { background: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed' } : {}}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="field-grid-3">
              <div className="field">
                <label>Date *</label>
                <input type="date" value={form.date} onChange={e => patch('date', e.target.value)} />
              </div>
              <div className="field">
                <label>Category *</label>
                <select value={form.category} onChange={e => patch('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Author *</label>
                <input value={form.author} onChange={e => patch('author', e.target.value)} placeholder="e.g. Invendis Team" />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>
                Excerpt *
                <span className="hint"> — 1–2 sentences shown on the listing page</span>
              </label>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={e => patch('excerpt', e.target.value)}
                placeholder="A short summary of what this article covers and why it's useful."
              />
            </div>
          </div>

          {/* ── Body card ── */}
          <div style={card}>
            <p style={sectionTitle}>
              Article Body
              {form.body && (
                <span style={{ marginLeft: 8, fontWeight: 500, color: '#6b7280', textTransform: 'none', letterSpacing: 0 }}>
                  · ~{readingTime(form.body)} min read · {form.body.trim().split(/\s+/).length} words
                </span>
              )}
            </p>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>
                Content *
                <span className="hint"> — Markdown: ## Heading, **bold**, `code`, - list item, | table |</span>
              </label>
              <textarea
                rows={28}
                value={form.body}
                onChange={e => patch('body', e.target.value)}
                placeholder={'## Introduction\n\nWrite the full article content here using Markdown...\n\n## Section 1\n\nYour content...'}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7 }}
              />
            </div>
          </div>

          {/* ── Tags card ── */}
          <div style={{ ...card, marginBottom: 0 }}>
            <p style={sectionTitle}>Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#b0b8c4' }}>(optional)</span></p>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>
                Tags
                <span className="hint"> — comma-separated, e.g. IIoT, Gateway, 5G, Energy Meter</span>
              </label>
              <input value={form.tags} onChange={e => patch('tags', e.target.value)} placeholder="IIoT, Gateway, 5G" />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
