import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// items: [{ label: 'Products', path: '/products' }, { label: 'RN50-4G', path: null }]
// The last item is treated as the current page — rendered as plain text
// (not a link) with aria-current="page", per breadcrumb accessibility
// conventions. Give it `path: null` (or omit it) for the current page.
export default function Breadcrumbs({ items }) {
  if (!items || items.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-brand-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={13} className="text-gray-300 shrink-0" aria-hidden="true" />}
              {isLast || !item.path ? (
                <span className="text-brand-text font-medium truncate max-w-[220px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-brand-blue transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
