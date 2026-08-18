import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { testConnection } from '../github/githubApi'

export default function Setup() {
  const { token, saveToken, toast } = useAdmin()
  const [draft,   setDraft]   = useState(token)
  const [testing, setTesting] = useState(false)
  const [status,  setStatus]  = useState(token ? 'saved' : 'none')
  const [errMsg,  setErrMsg]  = useState('')

  async function handleTest() {
    if (!draft.trim()) return
    setTesting(true)
    setStatus('testing')
    setErrMsg('')
    try {
      await testConnection(draft.trim())
      saveToken(draft.trim())
      setStatus('ok')
      toast('GitHub token verified and saved', 'ok')
    } catch (e) {
      setStatus('err')
      setErrMsg(e.message)
      toast(e.message, 'err')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="tab-panel">
      <div className="setup-box">
        <h3 className="setup-box-title">GitHub Configuration</h3>
        <p className="setup-box-desc">
          Enter a GitHub Personal Access Token with <strong>repo</strong> scope.
          This is required to read and publish content changes to the live website.
        </p>

        <div style={{ marginBottom: 20 }}>
          <p className="field-label-upper">Connected Repository</p>
          <div className="mono-box">
            owner: ananthr99<br />
            repo:&nbsp; INVENDIS-Technologies<br />
            branch: main
          </div>
        </div>

        <div className="field" style={{ marginBottom: 16 }}>
          <label>
            GitHub Personal Access Token
            <span className="hint"> — needs repo scope</span>
          </label>
          <input
            type="password"
            value={draft}
            onChange={e => { setDraft(e.target.value); setStatus('none') }}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          />
          <span className="hint">
            Generate at github.com → Settings → Developer settings →
            Personal access tokens → Classic → select repo scope
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn-save"
            onClick={handleTest}
            disabled={testing || !draft.trim()}
          >
            {testing ? 'Testing…' : 'Test & Save'}
          </button>

          {status === 'ok' && (
            <span style={{ fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="dot ok" /> Token verified and saved
            </span>
          )}
          {status === 'saved' && (
            <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="dot ok" /> Token saved
            </span>
          )}
          {status === 'err' && (
            <span style={{ fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="dot err" /> {errMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
