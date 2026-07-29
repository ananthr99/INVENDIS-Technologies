import { useState, useEffect } from 'react'

const STORAGE_KEY = 'compare_products'
const MAX_COMPARE = 3

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? new Set(arr) : new Set()
  } catch {
    return new Set()
  }
}

// Persists the user's product-compare selection to localStorage so it
// survives page reloads and navigation away from the product selector.
// `validIds` (optional) is used to drop any stored ids that no longer
// exist in the catalog (e.g. a product was removed since the last visit).
export function useCompareList(validIds) {
  const [compareIds, setCompareIds] = useState(() => readStored())

  useEffect(() => {
    if (!validIds) return
    setCompareIds(prev => {
      const filtered = new Set([...prev].filter(id => validIds.has(id)))
      return filtered.size === prev.size ? prev : filtered
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...compareIds]))
    } catch {
      // localStorage may be unavailable (private browsing, quota); fail silently
    }
  }, [compareIds])

  function toggleCompare(id) {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= MAX_COMPARE) return prev
        next.add(id)
      }
      return next
    })
  }

  function clearCompare() {
    setCompareIds(new Set())
  }

  return { compareIds, toggleCompare, clearCompare }
}
