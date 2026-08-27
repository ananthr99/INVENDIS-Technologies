import { appendToChangelog } from '../github/githubApi'

function trunc(s, max = 60) {
  return s.length <= max ? s : s.slice(0, max - 1) + '…'
}

function flatDiff(before, after, prefix = '', depth = 0) {
  if (depth > 4) return []
  const changes = []
  const isArr = v => Array.isArray(v)
  const isObj = v => v !== null && typeof v === 'object' && !isArr(v)

  if (isArr(before) || isArr(after)) {
    const b = isArr(before) ? before : []
    const a = isArr(after)  ? after  : []
    if (JSON.stringify(b) === JSON.stringify(a)) return []

    // Try to match items by a stable key field
    const KEY_FIELDS = ['id', 'label', 'title', 'name', 'key']
    const keyField = KEY_FIELDS.find(k =>
      b.some(x => x?.[k] != null) || a.some(x => x?.[k] != null)
    )

    if (keyField) {
      const bMap = new Map(b.filter(x => x?.[keyField] != null).map(x => [String(x[keyField]), x]))
      const aMap = new Map(a.filter(x => x?.[keyField] != null).map(x => [String(x[keyField]), x]))

      for (const [k, aItem] of aMap)
        if (!bMap.has(k)) changes.push({ field: prefix, from: '—', to: `added "${aItem?.label || k}"` })

      for (const [k, bItem] of bMap)
        if (!aMap.has(k)) changes.push({ field: prefix, from: `removed "${bItem?.label || k}"`, to: '—' })

      for (const [k, aItem] of aMap) {
        const bItem = bMap.get(k)
        if (bItem && JSON.stringify(bItem) !== JSON.stringify(aItem))
          changes.push(...flatDiff(bItem, aItem, `${prefix}["${k}"]`, depth + 1))
      }
    } else if (b.every(x => typeof x !== 'object' || x === null) &&
               a.every(x => typeof x !== 'object' || x === null)) {
      // Primitive array — show added/removed values
      const added   = a.filter(x => !b.includes(x)).slice(0, 5)
      const removed = b.filter(x => !a.includes(x)).slice(0, 5)
      if (removed.length) changes.push({ field: prefix, from: removed.map(trunc).join(', '), to: '—' })
      if (added.length)   changes.push({ field: prefix, from: '—', to: added.map(trunc).join(', ') })
      if (!removed.length && !added.length)
        changes.push({ field: prefix, from: `${b.length} items`, to: `${a.length} items` })
    } else {
      // Fallback — diff by index
      if (b.length !== a.length)
        changes.push({ field: prefix, from: `${b.length} item${b.length !== 1 ? 's' : ''}`, to: `${a.length} item${a.length !== 1 ? 's' : ''}` })
      for (let i = 0; i < Math.min(Math.max(b.length, a.length), 5); i++) {
        if (JSON.stringify(b[i]) !== JSON.stringify(a[i]))
          changes.push(...flatDiff(b[i] ?? null, a[i] ?? null, `${prefix}[${i + 1}]`, depth + 1))
      }
    }
    return changes
  }

  if (isObj(before) && isObj(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)])
    for (const key of keys) {
      if (changes.length >= 10) break
      changes.push(...flatDiff(before[key], after[key], prefix ? `${prefix}.${key}` : key, depth + 1))
    }
    return changes
  }

  const bStr = String(before ?? '')
  const aStr = String(after  ?? '')
  if (bStr !== aStr) changes.push({ field: prefix, from: trunc(bStr), to: trunc(aStr) })
  return changes
}

export async function logChange({ userEmail, page, section, token, before, after }) {
  const changes = (before && after) ? flatDiff(before, after).slice(0, 10) : []
  const entry = {
    ts: new Date().toISOString(),
    user: (userEmail ?? 'unknown').toLowerCase(),
    page,
    section,
    action: `Updated ${page}${section ? ` — ${section}` : ''}`,
    changes,
  }
  try { await appendToChangelog(entry, token) } catch {}
}
