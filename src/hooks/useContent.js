import { useState, useEffect } from 'react'

const BASE = import.meta.env.BASE_URL

export function useContent(path) {
  const key = `cms_${path}`
  const [data, setData] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(key)) }
    catch { return null }
  })

  useEffect(() => {
    fetch(`${BASE}content/${path}?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(json => { sessionStorage.setItem(key, JSON.stringify(json)); setData(json) })
      .catch(() => {})
  }, [path])

  return data
}
