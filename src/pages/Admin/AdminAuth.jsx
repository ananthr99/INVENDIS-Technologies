import { useState, useCallback, useEffect } from 'react'
import { getToken, setToken, clearToken, verifyAccess } from '../../utils/githubApi'
import { AdminAuthContext, useAdminAuth } from './adminAuthContext'

export function AdminAuthProvider({ children }) {
  const [repoFullName, setRepoFullName] = useState(null)
  // Lazy-init: only start in "checking" state if there's actually a token to verify.
  const [checking, setChecking] = useState(() => !!getToken())
  const [error, setError] = useState('')

  // On mount, if a token is already in this session, verify it still works.
  useEffect(() => {
    if (!getToken()) return
    verifyAccess()
      .then((name) => setRepoFullName(name))
      .catch(() => clearToken())
      .finally(() => setChecking(false))
  }, [])

  const signIn = useCallback(async (token) => {
    setError('')
    setToken(token)
    try {
      const name = await verifyAccess()
      setRepoFullName(name)
      return true
    } catch (e) {
      clearToken()
      setError(
        e.status === 404 || e.status === 403
          ? "Token doesn't have access to this repo — check it's scoped to ananthr99/INVENDIS-Technologies with Contents read/write."
          : e.message
      )
      return false
    }
  }, [])

  const signOut = useCallback(() => {
    clearToken()
    setRepoFullName(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ repoFullName, checking, error, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function AdminLogin() {
  const { signIn, error, checking } = useAdminAuth()
  const [tokenInput, setTokenInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tokenInput.trim()) return
    setSubmitting(true)
    await signIn(tokenInput.trim())
    setSubmitting(false)
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Checking session…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-[#05059b]">Invendis Content Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with a personal access token scoped to this repo. Nothing is shared or
          stored anywhere except this browser tab.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              GitHub token
            </label>
            <input
              type="password"
              autoComplete="off"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="github_pat_..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#05059b] focus:outline-none focus:ring-1 focus:ring-[#05059b]"
            />
          </div>

          {error && <p className="text-sm text-[#ff5050]">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !tokenInput.trim()}
            className="w-full rounded-lg bg-[#05059b] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Checking…' : 'Sign in'}
          </button>
        </form>

        <details className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-medium text-slate-600">
            Don't have a token yet?
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              Go to{' '}
              <span className="font-mono">
                github.com → Settings → Developer settings → Fine-grained tokens
              </span>
            </li>
            <li>New token → Resource owner: ananthr99 → Only select repositories → INVENDIS-Technologies</li>
            <li>Permissions → Repository permissions → Contents: Read and write</li>
            <li>Set an expiry (e.g. 90 days) and generate</li>
            <li>Paste the token here — it's kept only in this browser tab's session storage</li>
          </ol>
        </details>
      </div>
    </div>
  )
}
