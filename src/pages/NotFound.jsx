import { Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import PageSEO from '../components/shared/PageSEO'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-8">
      <PageSEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or may have moved."
        path="/404"
        noindex
      />
      <div className="text-center max-w-lg">
        <p className="font-sora text-brand-red text-sm font-semibold uppercase tracking-widest mb-3">
          404
        </p>
        <h1 className="font-sora text-3xl lg:text-4xl font-bold text-brand-text mb-4">
          We couldn't find that page
        </h1>
        <p className="text-brand-muted text-base leading-relaxed mb-8">
          The page you're looking for doesn't exist, may have been moved, or the link might be
          out of date. Try heading back home or browsing our products.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-blue text-white font-sora font-bold text-sm px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            <Home size={16} /> Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-red text-white font-sora font-bold text-sm px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
