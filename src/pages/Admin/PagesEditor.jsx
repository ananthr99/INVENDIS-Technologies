import { useEffect, useState } from 'react'
import { listDir, getFile, putTextFile } from '../../utils/githubApi'
import { DynamicField } from './DynamicJsonForm'

const PAGES_DIR = 'src/content/pages'

export default function PagesEditor() {
  const [files, setFiles] = useState(null)
  const [selected, setSelected] = useState(null)
  const [data, setData] = useState(null)
  const [sha, setSha] = useState(null)
  const [showJson, setShowJson] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listDir(PAGES_DIR)
      .then((entries) => setFiles(entries.filter((f) => f.name.endsWith('.json'))))
      .catch((e) => setError(e.message))
  }, [])

  const open = async (path) => {
    setError('')
    setStatus('')
    setShowJson(false)
    setSelected(path)
    setData(null)
    try {
      const { content, sha } = await getFile(path)
      setData(JSON.parse(content))
      setSha(sha)
    } catch (e) {
      setError(e.message)
    }
  }

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      const body = JSON.stringify(data, null, 2)
      await putTextFile(selected, body, `Update page content: ${selected}`, sha)
      setStatus('Saved — live site will update shortly via the deploy workflow.')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!files) return <p className="text-sm text-slate-500">Loading pages…</p>

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <div className="space-y-1">
        {files.map((f) => (
          <button
            key={f.sha}
            onClick={() => open(f.path)}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
              selected === f.path
                ? 'bg-[#05059b] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {f.name.replace(/\.json$/, '')}
          </button>
        ))}
      </div>

      <div>
        {!selected && (
          <p className="text-sm text-slate-500">Pick a page on the left to edit its content.</p>
        )}

        {selected && !data && !error && (
          <p className="text-sm text-slate-500">Loading page content…</p>
        )}

        {selected && data && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#05059b]">
                {selected.split('/').pop().replace(/\.json$/, '')}
              </h2>
              <button
                type="button"
                onClick={() => setShowJson((s) => !s)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                {showJson ? 'Hide' : 'Preview'} JSON
              </button>
            </div>

            <DynamicField fieldKey={null} value={data} onChange={setData} depth={0} />

            {showJson && (
              <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}

            {error && <p className="mt-4 text-sm text-[#ff5050]">{error}</p>}
            {status && <p className="mt-4 text-sm text-emerald-600">{status}</p>}

            <button
              onClick={save}
              disabled={saving}
              className="mt-4 rounded-lg bg-[#05059b] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save & publish (goes live immediately)'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
