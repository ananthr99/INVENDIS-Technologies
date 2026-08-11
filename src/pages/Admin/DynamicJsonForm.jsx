// Generic, schema-driven form fields for editing arbitrary page-content JSON.
// Walks whatever shape the JSON has (string/number/boolean/array/object) and
// renders the right input for each — no raw JSON editing in the normal flow.

function humanize(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
}

function emptyLike(value) {
  if (typeof value === 'string') return ''
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return value.length ? [emptyLike(value[0])] : []
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, emptyLike(v)]))
  }
  return ''
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#05059b] focus:outline-none focus:ring-1 focus:ring-[#05059b]'

function FieldWrap({ label, children }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

/** A single value of any type, rendered with the right control and wired to onChange. */
export function DynamicField({ fieldKey, value, onChange, depth = 0 }) {
  const label = fieldKey ? humanize(fieldKey) : null

  if (typeof value === 'string') {
    const long = value.length > 60 || value.includes('\n')
    return (
      <FieldWrap label={label}>
        {long ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        )}
      </FieldWrap>
    )
  }

  if (typeof value === 'number') {
    return (
      <FieldWrap label={label}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
      </FieldWrap>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    )
  }

  if (Array.isArray(value)) {
    return <ArrayField label={label} items={value} onChange={onChange} depth={depth} />
  }

  if (value && typeof value === 'object') {
    return <ObjectField label={label} obj={value} onChange={onChange} depth={depth} />
  }

  // null / undefined — fall back to a plain text box so it's still editable
  return (
    <FieldWrap label={label}>
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </FieldWrap>
  )
}

function ObjectField({ label, obj, onChange, depth }) {
  const setKey = (key, newVal) => onChange({ ...obj, [key]: newVal })
  const keys = Object.keys(obj)

  const body = (
    <div className="space-y-4 pl-3">
      {keys.map((key) => (
        <DynamicField
          key={key}
          fieldKey={key}
          value={obj[key]}
          onChange={(v) => setKey(key, v)}
          depth={depth + 1}
        />
      ))}
    </div>
  )

  if (!label) return body // root object: no extra wrapper

  return (
    <details open={depth < 2} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-[#05059b]">{label}</summary>
      <div className="mt-3">{body}</div>
    </details>
  )
}

function ArrayField({ label, items, onChange, depth }) {
  const setItem = (i, newVal) => {
    const next = [...items]
    next[i] = newVal
    onChange(next)
  }
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i))
  const addItem = () => onChange([...items, items.length ? emptyLike(items[0]) : ''])

  const itemsAreObjects = items.length > 0 && typeof items[0] === 'object' && items[0] !== null

  return (
    <details open={depth < 2} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-[#05059b]">
        {label} <span className="font-normal text-slate-400">({items.length})</span>
      </summary>

      <div className="mt-3 space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={
              itemsAreObjects
                ? 'rounded-lg border border-slate-200 bg-white p-3'
                : 'flex items-center gap-2'
            }
          >
            {itemsAreObjects ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Item {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-xs text-[#ff5050]"
                  >
                    Remove
                  </button>
                </div>
                <DynamicField
                  fieldKey={null}
                  value={item}
                  onChange={(v) => setItem(i, v)}
                  depth={depth + 1}
                />
              </>
            ) : (
              <>
                <div className="flex-1">
                  <DynamicField
                    fieldKey={null}
                    value={item}
                    onChange={(v) => setItem(i, v)}
                    depth={depth + 1}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-xs text-[#ff5050]"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-xs font-medium text-[#05059b] hover:underline"
        >
          + Add {label ? label.replace(/s$/, '') : 'item'}
        </button>
      </div>
    </details>
  )
}
