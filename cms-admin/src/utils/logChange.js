import { appendToChangelog } from '../github/githubApi'

function trunc(s, max = 60) {
  return s.length <= max ? s : s.slice(0, max - 1) + '…'
}

function flatDiff(before, after, prefix = '', depth = 0) {
  if (depth > 3) return []
  const changes = []
  const isArr = v => Array.isArray(v)
  const isObj = v => v !== null && typeof v === 'object' && !isArr(v)

  if (isArr(before) || isArr(after)) {
    const b = isArr(before) ? before : []
    const a = isArr(after)  ? after  : []
    if (JSON.stringify(b) !== JSON.stringify(a)) {
      if (b.length !== a.length)
        changes.push({ field: prefix, from: `${b.length} item${b.length !== 1 ? 's' : ''}`, to: `${a.length} item${a.length !== 1 ? 's' : ''}` })
      else
        changes.push({ field: prefix, from: '[list modified]', to: '[list modified]' })
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
