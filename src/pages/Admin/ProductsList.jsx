import { useEffect, useState } from 'react'
import { listDir } from '../../utils/githubApi'

const PRODUCTS_DIR = 'src/content/products'

export default function ProductsList({ onSelect, onCreateNew }) {
  const [files, setFiles] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    listDir(PRODUCTS_DIR)
      .then((entries) =>
        setFiles(
          entries
            .filter((f) => f.name.endsWith('.json'))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
      )
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="text-sm text-[#ff5050]">{error}</p>
  if (!files) return <p className="text-sm text-slate-500">Loading products…</p>

  const visible = files.filter((f) =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter products…"
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#05059b] focus:outline-none"
        />
        <button
          onClick={onCreateNew}
          className="whitespace-nowrap rounded-lg bg-[#ff5050] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + New product
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((f) => (
          <button
            key={f.sha}
            onClick={() => onSelect(f.path)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm hover:border-[#05059b] hover:text-[#05059b]"
          >
            {f.name.replace(/\.json$/, '')}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">No products match "{filter}".</p>
      )}
    </div>
  )
}
