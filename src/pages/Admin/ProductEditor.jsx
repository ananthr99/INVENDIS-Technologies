import { useEffect, useState } from 'react'
import { getFile, putTextFile, putBinaryFile, fileToBase64 } from '../../utils/githubApi'

const PRODUCTS_DIR = 'src/content/products'
const IMAGES_DIR = 'public/products/images'
const DATASHEETS_DIR = 'public/products/datasheets'

const EMPTY_PRODUCT = {
  id: '',
  name: '',
  cat: '',
  cpu: '—',
  ram: '—',
  storage: '—',
  cell: 'none',
  cellular_gen: 'none',
  wifi: 'none',
  rs485: false,
  rs232: false,
  ip: '',
  ports: 0,
  power: '',
  os: '—',
  desc: '',
  housing: '',
  dims: '—',
  weight: '—',
  op_temp: '—',
  images: [],
  datasheet: '',
  use_cases: [],
}

const TEXT_FIELDS = [
  ['name', 'Name'],
  ['cat', 'Category'],
  ['cpu', 'CPU'],
  ['ram', 'RAM'],
  ['storage', 'Storage'],
  ['cell', 'Cellular'],
  ['cellular_gen', 'Cellular Gen'],
  ['wifi', 'WiFi'],
  ['ip', 'IP Rating'],
  ['power', 'Power'],
  ['os', 'OS'],
  ['housing', 'Housing'],
  ['dims', 'Dimensions'],
  ['weight', 'Weight'],
  ['op_temp', 'Operating Temp'],
]

export default function ProductEditor({ path, isNew, onDone, onCancel }) {
  const [product, setProduct] = useState(isNew ? EMPTY_PRODUCT : null)
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (isNew) return
    getFile(path)
      .then(({ content, sha }) => {
        setProduct(JSON.parse(content))
        setSha(sha)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [path, isNew])

  const set = (key, value) => setProduct((p) => ({ ...p, [key]: value }))

  const setListItem = (key, index, value) => {
    setProduct((p) => {
      const list = [...p[key]]
      list[index] = value
      return { ...p, [key]: list }
    })
  }
  const addListItem = (key) => setProduct((p) => ({ ...p, [key]: [...p[key], ''] }))
  const removeListItem = (key, index) =>
    setProduct((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }))

  const handleImageUpload = async (file) => {
    setStatus('Uploading image…')
    try {
      const base64 = await fileToBase64(file)
      const imgPath = `${IMAGES_DIR}/${file.name}`
      await putBinaryFile(imgPath, base64, `Add product image: ${file.name}`)
      set('images', [...product.images, `/products/images/${file.name}`])
      setStatus('Image uploaded — remember to Save Product.')
    } catch (e) {
      setError(e.message)
      setStatus('')
    }
  }

  const handleDatasheetUpload = async (file) => {
    setStatus('Uploading datasheet…')
    try {
      const base64 = await fileToBase64(file)
      const dsPath = `${DATASHEETS_DIR}/${file.name}`
      await putBinaryFile(dsPath, base64, `Add datasheet: ${file.name}`)
      set('datasheet', `/products/datasheets/${file.name}`)
      setStatus('Datasheet uploaded — remember to Save Product.')
    } catch (e) {
      setError(e.message)
      setStatus('')
    }
  }

  const handleSave = async () => {
    setError('')
    if (isNew && !product.id.trim()) {
      setError('Product id is required for a new product (used as the filename).')
      return
    }
    setSaving(true)
    try {
      const targetPath = isNew ? `${PRODUCTS_DIR}/${product.id.trim()}.json` : path
      const message = isNew
        ? `Add product: ${product.id}`
        : `Update product: ${product.id}`
      const body = JSON.stringify(product, null, 2)
      await putTextFile(targetPath, body, message, isNew ? undefined : sha)
      setStatus('Saved — live site will update shortly via the deploy workflow.')
      setTimeout(() => onDone(), 900)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading product…</p>
  if (!product) return <p className="text-sm text-[#ff5050]">{error || 'Not found'}</p>

  return (
    <div className="max-w-3xl">
      <button onClick={onCancel} className="mb-4 text-sm text-slate-500 hover:text-[#05059b]">
        ← Back to products
      </button>

      <h2 className="mb-4 text-lg font-semibold text-[#05059b]">
        {isNew ? 'New product' : `Edit: ${product.name || product.id}`}
      </h2>

      <div className="space-y-4">
        <Field label="Product ID (filename — cannot change after creation)">
          <input
            disabled={!isNew}
            value={product.id}
            onChange={(e) => set('id', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />
        </Field>

        {TEXT_FIELDS.map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              value={product[key] ?? ''}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#05059b] focus:outline-none"
            />
          </Field>
        ))}

        <Field label="Ports (number)">
          <input
            type="number"
            value={product.ports ?? 0}
            onChange={(e) => set('ports', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#05059b] focus:outline-none"
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={3}
            value={product.desc ?? ''}
            onChange={(e) => set('desc', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#05059b] focus:outline-none"
          />
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!product.rs485}
              onChange={(e) => set('rs485', e.target.checked)}
            />
            RS485
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!product.rs232}
              onChange={(e) => set('rs232', e.target.checked)}
            />
            RS232
          </label>
        </div>

        <Field label="Images">
          <div className="space-y-2">
            {product.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={img}
                  onChange={(e) => setListItem('images', i, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => removeListItem('images', i)}
                  className="text-xs text-[#ff5050]"
                >
                  Remove
                </button>
              </div>
            ))}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
              className="text-sm"
            />
          </div>
        </Field>

        <Field label="Datasheet">
          <div className="space-y-2">
            <input
              value={product.datasheet ?? ''}
              onChange={(e) => set('datasheet', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => e.target.files[0] && handleDatasheetUpload(e.target.files[0])}
              className="text-sm"
            />
          </div>
        </Field>

        <Field label="Use cases">
          <div className="space-y-2">
            {product.use_cases.map((uc, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={uc}
                  onChange={(e) => setListItem('use_cases', i, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={() => removeListItem('use_cases', i)}
                  className="text-xs text-[#ff5050]"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem('use_cases')}
              className="text-xs font-medium text-[#05059b]"
            >
              + Add use case
            </button>
          </div>
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-[#ff5050]">{error}</p>}
      {status && <p className="mt-4 text-sm text-emerald-600">{status}</p>}

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#05059b] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save product (goes live immediately)'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  )
}
