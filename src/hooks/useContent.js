import { useState, useEffect } from 'react'

const BASE = import.meta.env.BASE_URL

export function useContent(path, { withLoading = false } = {}) {
  const key = `cms_${path}`
  const cached = (() => { try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null } })()
  const [data, setData] = useState(cached)
  const [loading, setLoading] = useState(cached === null)

  useEffect(() => {
    fetch(`${BASE}content/${path}?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(json => { sessionStorage.setItem(key, JSON.stringify(json)); setData(json); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [path])

  return withLoading ? { data, loading } : data
}
