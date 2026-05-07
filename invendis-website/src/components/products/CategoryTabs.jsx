import { catColors } from '../../utils/productHelpers'

export default function CategoryTabs({ cats, activeCat, counts, onCat }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {cats.map(cat => (
        <button
          key={cat}
          onClick={() => onCat(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium font-sora transition-all border
            ${activeCat === cat
              ? 'bg-brand-blue text-white border-brand-blue shadow-md'
              : 'bg-white text-brand-muted border-gray-200 hover:border-brand-blue hover:text-brand-blue'
            }`}
        >
          {cat}
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full
            ${activeCat === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-brand-muted'}`}>
            {counts[cat]}
          </span>
        </button>
      ))}
    </div>
  )
}
