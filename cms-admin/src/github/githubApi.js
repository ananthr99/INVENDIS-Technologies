const OWNER  = 'ananthr99'
const REPO   = 'INVENDIS-Technologies'
const BRANCH = 'main'
const BASE   = `https://api.github.com/repos/${OWNER}/${REPO}`

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

export async function testConnection(token) {
  const res = await fetch(BASE, { headers: headers(token) })
  if (!res.ok) throw new Error(`Authentication failed (${res.status})`)
  return res.json()
}

export async function readFile(path, token) {
  const res = await fetch(`${BASE}/contents/${path}?ref=${BRANCH}`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(`Could not read ${path} (${res.status})`)
  const data = await res.json()
  const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))))
  return { content: decoded, sha: data.sha }
}

export async function writeFile(path, content, commitMsg, sha, token) {
  const body = {
    message: commitMsg,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  }
  const res = await fetch(`${BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Could not write ${path} (${res.status})`)
  }
  return res.json()
}

export async function readFileDirect(path, token) {
  const res = await fetch(`${BASE}/contents/${path}?ref=gh-pages`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(`Could not read ${path} from gh-pages (${res.status})`)
  const data = await res.json()
  const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))))
  return { content: decoded, sha: data.sha }
}

export async function writeFileDirect(path, content, commitMsg, sha, token) {
  const body = {
    message: commitMsg,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: 'gh-pages',
    ...(sha ? { sha } : {}),
  }
  const res = await fetch(`${BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Could not write ${path} (${res.status})`)
  }
  return res.json()
}

const CHANGELOG_PATH = 'cms-admin/changelog.json'

export async function readChangelog(token) {
  try {
    const { content } = await readFile(CHANGELOG_PATH, token)
    return JSON.parse(content)
  } catch {
    return []
  }
}

export async function appendToChangelog(entry, token) {
  let sha = null
  let entries = []
  try {
    const file = await readFile(CHANGELOG_PATH, token)
    entries = JSON.parse(file.content)
    sha = file.sha
  } catch {}

  entries.unshift(entry)
  if (entries.length > 500) entries = entries.slice(0, 500)

  await writeFile(
    CHANGELOG_PATH,
    JSON.stringify(entries, null, 2),
    'CMS: update changelog [skip ci]',
    sha,
    token
  )
}

export async function writeChangelog(entries, token) {
  let sha = null
  try {
    const file = await readFile(CHANGELOG_PATH, token)
    sha = file.sha
  } catch {}

  await writeFile(
    CHANGELOG_PATH,
    JSON.stringify(entries, null, 2),
    'CMS: update changelog [skip ci]',
    sha,
    token
  )
}

export async function writeFileRaw(path, base64Content, commitMsg, sha, token) {
  const body = {
    message: commitMsg,
    content: base64Content,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  }
  const res = await fetch(`${BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Could not write ${path} (${res.status})`)
  }
  return res.json()
}

export async function writeFileRawDirect(path, base64Content, commitMsg, sha, token) {
  const body = {
    message: commitMsg,
    content: base64Content,
    branch: 'gh-pages',
    ...(sha ? { sha } : {}),
  }
  const res = await fetch(`${BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Could not write ${path} (${res.status})`)
  }
  return res.json()
}
