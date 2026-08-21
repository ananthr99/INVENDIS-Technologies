// src/utils/githubApi.js
//
// Thin wrapper around the GitHub Contents API used by the main site
// for any direct GitHub reads. Auth uses a fine-grained Personal Access
// Token stored in sessionStorage — never a shared secret.

const OWNER = 'ananthr99'
const REPO = 'INVENDIS-Technologies'
const BRANCH = 'main'
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`

export const TOKEN_SESSION_KEY = 'invendis_admin_pat'

export function getToken() {
  return sessionStorage.getItem(TOKEN_SESSION_KEY) || ''
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_SESSION_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_SESSION_KEY)
}

async function ghFetch(path, options = {}) {
  const token = getToken()
  if (!token) throw new Error('Not signed in')

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.message || `GitHub API error (${res.status})`)
    err.status = res.status
    throw err
  }

  // 204 No Content (e.g. some deletes) has no body
  if (res.status === 204) return null
  return res.json()
}

/** Verify the token works and has access to this repo. Returns the GitHub login. */
export async function verifyAccess() {
  const data = await ghFetch('')
  return data.full_name
}

/** List files in a repo directory (non-recursive). */
export async function listDir(path) {
  const data = await ghFetch(`/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${BRANCH}`)
  return Array.isArray(data) ? data : [data]
}

/** Get a file's decoded text content + its sha (sha is required to update it). */
export async function getFile(path) {
  const data = await ghFetch(`/contents/${path}?ref=${BRANCH}`)
  const content = new TextDecoder().decode(Uint8Array.from(atob(data.content.replace(/\n/g, '')), c => c.charCodeAt(0)))
  return { content, sha: data.sha }
}

/** Get a file's raw base64 content (for images/binary — no decoding). */
export async function getFileBase64(path) {
  const data = await ghFetch(`/contents/${path}?ref=${BRANCH}`)
  return { base64: data.content.replace(/\n/g, ''), sha: data.sha }
}

/**
 * Create or update a text file (e.g. a product JSON). Pass the existing
 * `sha` when updating an existing file; omit it when creating a new one.
 */
export async function putTextFile(path, textContent, message, sha) {
  const base64 = btoa(String.fromCharCode(...new TextEncoder().encode(textContent)))
  return ghFetch(`/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: base64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  })
}

/**
 * Create or update a binary file (image/datasheet) from a base64 string
 * (strip any "data:...;base64," prefix before calling this).
 */
export async function putBinaryFile(path, base64Content, message, sha) {
  return ghFetch(`/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  })
}

/** Read a File/Blob as a bare base64 string (no data: prefix). */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function deployWorkflowUrl() {
  return `https://github.com/${OWNER}/${REPO}/actions/workflows/deploy.yml`
}
