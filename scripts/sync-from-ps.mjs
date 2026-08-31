import { writeFileSync, readdirSync, unlinkSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const PS_URL     = 'https://raw.githubusercontent.com/ananthr99/INVENDIS-ProductSelector/main/data/products.json'
const PS_PAGES   = 'https://ananthr99.github.io/INVENDIS-ProductSelector/'
// All raw GitHub URL patterns that the PS CMS may produce — normalised to GitHub Pages on ingest.
const RAW_PATS   = [
  'https://raw.githubusercontent.com/ananthr99/INVENDIS-ProductSelector/main/',
  'https://github.com/ananthr99/INVENDIS-ProductSelector/raw/main/',
]
const WIFI_MAP   = { 'WiFi6': 'WiFi6', 'WiFi5': 'WiFi5', 'WiFi4/2.4GHz': 'WiFi24', 'WiFi4': 'WiFi4', '-': 'none' }
const WORD_PORTS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 }

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT   = join(__dirname, '..', 'src/content/products')
mkdirSync(CONTENT, { recursive: true })

function parsePorts(v) {
  if (typeof v === 'number') return v
  if (!v || v === '-') return 0
  const s = String(v)
  const word = s.toLowerCase().match(/^(one|two|three|four|five|six|seven|eight)\b/)
  if (word) return WORD_PORTS[word[1]]
  const head = s.match(/^(\d+)\s*[xX×]/)
  if (head) return parseInt(head[1])
  const parens = [...s.matchAll(/\((\d+)[xX]/g)].map(m => parseInt(m[1]))
  return parens.length ? parens.reduce((a, b) => a + b, 0) : 0
}

function normalCell(v) { return (!v || v === '-') ? 'none' : v }
function normalWifi(v)  { return WIFI_MAP[v] ?? (v || 'none') }
function normalBool(v)  { return v === 'Yes' || v === 'Optional' }
function toPages(url)   {
  for (const pat of RAW_PATS) {
    if (url.startsWith(pat)) return PS_PAGES + url.slice(pat.length)
  }
  return url
}
function fullUrl(path)  {
  if (!path) return ''
  if (path.startsWith('http')) return toPages(path)
  return PS_PAGES + path
}

function normalize(p) {
  return {
    id:           p.id,
    name:         p.name,
    cat:          p.cat,
    cpu:          p.cpu    || '—',
    ram:          p.ram    || '—',
    storage:      p.storage|| '—',
    cell:         normalCell(p.cell),
    cellular_gen: normalCell(p.cellular_gen),
    wifi:         normalWifi(p.wifi),
    rs485:        normalBool(p.rs485),
    rs232:        normalBool(p.rs232),
    ip:           p.ip       || '',
    power:        p.power    || '',
    ports:        parsePorts(p.ports),
    os:           p.os       || '—',
    desc:         p.desc     || '',
    housing:      p.housing  || '',
    dims:         p.dims     || '',
    weight:       p.weight   || '',
    op_temp:      p.op_temp  || '',
    images:           (p.images  || []).map(fullUrl),
    datasheet:        fullUrl(p.datasheet),
    use_cases:        p.use_cases        || [],
    hidden_fields:    p.hidden_fields    || [],
    additional_specs: p.additional_specs || [],
    variants:         p.variants         || null,
    order:            p.order            ?? null,
  }
}


async function main() {
  console.log('Fetching from Product Selector…')
  const res = await fetch(PS_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { products } = await res.json()
  console.log(`  ${products.length} products received`)

  const existing = new Set(readdirSync(CONTENT).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)))
  const incoming = new Set(products.map(p => p.id))

  for (const p of products) {
    writeFileSync(join(CONTENT, `${p.id}.json`), JSON.stringify(normalize(p), null, 2) + '\n')
  }
  for (const id of existing) {
    if (!incoming.has(id)) {
      console.log(`  Removing ${id}.json`)
      unlinkSync(join(CONTENT, `${id}.json`))
    }
  }
  console.log('✓ Done')
}

main().catch(e => { console.error(e); process.exit(1) })
