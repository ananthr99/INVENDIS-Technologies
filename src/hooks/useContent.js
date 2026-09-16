import { useState, useEffect } from 'react'

const BASE = import.meta.env.BASE_URL

const memCache = {}

export function useContent(path, { withLoading = false } = {}) {
  const [data, setData] = useState(() => memCache[path] ?? null)
  const [loading, setLoading] = useState(!memCache[path])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${BASE}content/${path}?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(json => { memCache[path] = json; setData(json); setLoading(false) })
      .catch(err => { setError(err); setLoading(false) })
  }, [path])

  return withLoading ? { data, loading, error } : data
}
