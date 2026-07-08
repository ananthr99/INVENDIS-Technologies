import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import { getPost, getAllPosts } from '../utils/blog'

const categoryColors = {
  'Technical Article': 'bg-brand-blue/10 text-brand-blue',
  'Application Note':  'bg-emerald-50 text-emerald-700',
  'Industry Insight':  'bg-amber-50 text-amber-700',
  'Case Study':        'bg-red-50 text-brand-red',
}

export default function ResourceDetail() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) return <Navigate to="/resources" replace />

  const { title, date, category, author, readTime, content, excerpt } = post
  const formatted = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const allPosts = getAllPosts()
  const related = allPosts.filter(p => p.slug !== slug && p.category === category).slice(0, 2)

  return (
    <div className="min-h-screen bg-white">
      <PageSEO
        title={title}
        description={excerpt}
        path={`/resources/${slug}`}
      />

      {/* Article header */}
      <div className="bg-brand-light border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
          <Link
            to="/resources"
            className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-blue transition-colors mb-8"
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
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatted}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none
          prose-headings:font-sora prose-headings:text-brand-text
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-brand-text prose-p:leading-relaxed
          prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
          prose-strong:text-brand-text prose-strong:font-semibold
          prose-ul:text-brand-text prose-ol:text-brand-text
          prose-li:my-1
          prose-blockquote:border-brand-blue prose-blockquote:text-brand-muted
          prose-code:text-brand-blue prose-code:bg-brand-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-brand-text prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:text-sm
          prose-table:text-sm prose-th:text-brand-text prose-th:font-semibold prose-td:text-brand-muted
          prose-img:rounded-xl
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-brand-light text-brand-muted border border-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related articles */}
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

        {/* CTA */}
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
