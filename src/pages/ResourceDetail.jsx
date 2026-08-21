import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import Breadcrumbs from '../components/shared/Breadcrumbs'
import { breadcrumbSchema } from '../utils/breadcrumbSchema'
import { getPost, getAllPosts } from '../utils/blog'

const categoryColors = {
  'Technical Article': 'bg-brand-blue/10 text-brand-blue',
  'Application Note':  'bg-emerald-50 text-emerald-700',
  'Industry Insight':  'bg-amber-50 text-amber-700',
  'Case Study':        'bg-red-50 text-brand-red',
}

function Inline({ text }) {
  const parts = []
  const pattern = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0, m, i = 0
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      parts.push(<strong key={i++} className="font-semibold text-brand-text">{m[1]}</strong>)
    } else if (m[2] !== undefined) {
      parts.push(<code key={i++} className="text-brand-blue bg-brand-light px-1.5 py-0.5 rounded text-sm font-mono">{m[2]}</code>)
    } else if (m[3] !== undefined) {
      const href = m[4]
      parts.push(href.startsWith('/')
        ? <Link key={i++} to={href} className="text-brand-blue hover:underline">{m[3]}</Link>
        : <a key={i++} href={href} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{m[3]}</a>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

function MarkdownBody({ content }) {
  const lines = content.split(/\r?\n/)
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-sora font-bold text-2xl text-brand-text mt-10 mb-4 leading-snug">
          <Inline text={line.slice(3)} />
        </h2>
      )
      i++; continue
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-sora font-semibold text-xl text-brand-text mt-8 mb-3">
          <Inline text={line.slice(4)} />
        </h3>
      )
      i++; continue
    }

    if (line.startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-brand-text text-gray-100 rounded-xl p-4 text-sm overflow-x-auto my-5 font-mono leading-relaxed">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++; continue
    }

    if (line.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const headers = tableLines[0].split('|').slice(1, -1).map(h => h.trim())
      const rows = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()))
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-light">
                {headers.map((h, ci) => (
                  <th key={ci} className="px-4 py-2.5 text-left font-semibold text-brand-text border border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-t border-gray-100 hover:bg-gray-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-brand-muted border border-gray-200">
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="my-4 space-y-2 pl-5 text-brand-text">
          {items.map((item, ii) => (
            <li key={ii} className="leading-relaxed list-disc"><Inline text={item} /></li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={i} className="my-4 space-y-2 pl-5 text-brand-text list-decimal">
          {items.map((item, ii) => (
            <li key={ii} className="leading-relaxed"><Inline text={item} /></li>
          ))}
        </ol>
      )
      continue
    }

    if (line.trim() === '') { i++; continue }

    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('|') &&
      !lines[i].startsWith('```') &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={i} className="text-brand-text leading-relaxed my-4">
          <Inline text={paraLines.join(' ')} />
        </p>
      )
    }
  }

  return <div>{elements}</div>
}

export default function ResourceDetail() {
  const { slug } = useParams()
  const [post, setPost]       = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    Promise.all([getPost(slug), getAllPosts()]).then(([p, all]) => {
      if (!p) {
        setNotFound(true)
      } else {
        setPost(p)
        setRelated(all.filter(a => a.slug !== slug && a.category === p.category).slice(0, 2))
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (notFound || !post) return <Navigate to="/resources" replace />

  const { title, date, category, author, readTime, content, excerpt, tags } = post
  const formatted = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const path = `/resources/${slug}`
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Resources', path: '/resources' },
    { label: title, path: null },
  ]

  return (
    <div className="min-h-screen bg-white">
      <PageSEO
        title={title}
        description={excerpt}
        path={path}
        structuredData={breadcrumbSchema(breadcrumbs, path)}
      />

      <div className="bg-brand-light border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <Link
            to="/resources"
            className="flex w-fit items-center gap-1.5 text-sm text-brand-muted hover:text-brand-blue transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Resources
          </Link>

          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${categoryColors[category] || 'bg-gray-100 text-gray-600'}`}>
            {category}
          </span>

          <h1 className="font-sora font-bold text-3xl lg:text-4xl text-brand-text leading-tight mb-5">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-brand-muted">
            <span className="flex items-center gap-1.5"><User size={14} />{author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} />{formatted}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />{readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <MarkdownBody content={content || ''} />

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-brand-light text-brand-muted border border-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="font-sora font-bold text-brand-text mb-5">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/resources/${r.slug}`}
                  className="p-4 rounded-xl border border-gray-100 hover:border-brand-blue hover:shadow-sm transition-all group"
                >
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[r.category] || 'bg-gray-100 text-gray-600'}`}>
                    {r.category}
                  </span>
                  <p className="font-sora font-semibold text-sm text-brand-text mt-2 group-hover:text-brand-blue transition-colors leading-snug">
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 p-6 rounded-2xl bg-brand-light border border-gray-200 text-center">
          <p className="font-sora font-bold text-brand-text mb-2">Ready to discuss your application?</p>
          <p className="text-brand-muted text-sm mb-4">Our team can recommend the right hardware and integration approach for your site.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-blue text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
