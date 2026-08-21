import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'
import { getAllPosts, CATEGORIES } from '../utils/blog'
import { getGradient } from '../utils/styleMap'

const categoryColors = {
  'Technical Article': 'bg-brand-blue/10 text-brand-blue',
  'Application Note':  'bg-emerald-50 text-emerald-700',
  'Industry Insight':  'bg-amber-50 text-amber-700',
  'Case Study':        'bg-red-50 text-brand-red',
}

function ArticleCard({ post }) {
  const { slug, title, date, category, excerpt, readTime } = post
  const formatted = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <Link
      to={`/resources/${slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[category] || 'bg-gray-100 text-gray-600'}`}>
            {category}
          </span>
        </div>
        <h3 className="font-sora font-bold text-brand-text text-base leading-snug mb-3 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>
        <p className="text-brand-muted text-sm leading-relaxed flex-1 mb-5 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatted}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {readTime} min read
            </span>
          </div>
          <span className="text-xs font-semibold text-brand-blue flex items-center gap-1 group-hover:gap-2 transition-all">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Resources() {
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    getAllPosts().then(posts => {
      setAllPosts(posts)
      setLoading(false)
    })
  }, [])

  const filtered = activeCategory === 'All'
    ? allPosts
    : allPosts.filter(p => p.category === activeCategory)

  const usedCategories = ['All', ...new Set(allPosts.map(p => p.category))]

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Technical Resources & Articles"
        description="Explore technical articles, application notes, and industry insights from Invendis on IIoT, industrial connectivity, energy metering, and telecom infrastructure."
        path="/resources"
      />

      {/* Hero */}
      <section
        className="relative text-white py-24 px-8 lg:px-16 overflow-hidden"
        style={{ background: getGradient('blue') }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-blue-200 font-sora text-sm font-semibold uppercase tracking-widest mb-3">
            Resources
          </p>
          <h1 className="font-sora text-5xl font-bold mb-5 leading-tight">
            Technical Articles <span className="text-blue-200">&amp; Insights</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Deep-dives into IIoT hardware, industrial connectivity, energy metering, and infrastructure monitoring — written by the Invendis engineering team.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 px-8 lg:px-16 bg-brand-light min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-10">
              {usedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'bg-white text-brand-muted border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'opacity-70' : 'text-brand-muted'}`}>
                      ({allPosts.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-brand-muted text-center py-20">No articles in this category yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(post => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div
          className="relative rounded-3xl px-12 py-16 text-center overflow-hidden"
          style={{ background: getGradient('cta') }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <h2 className="font-sora text-3xl lg:text-4xl font-bold text-white mb-4">
              Have a Technical Question?
            </h2>
            <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
              Our engineering team is happy to discuss your application, recommend the right hardware, or share application notes specific to your use case.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-blue font-sora font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Contact the team <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
