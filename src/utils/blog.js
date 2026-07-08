const modules = import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw', import: 'default' })

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// Minimal YAML frontmatter parser — handles strings and string arrays only.
// Replaces gray-matter to avoid Node.js `Buffer` dependency in the browser.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/)
  if (!match) return { data: {}, content: raw.trim() }

  const content = match[2].trim()
  const data = {}
  let currentKey = null

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue
    const arrayItem = line.match(/^-\s+(.+)$/)
    if (arrayItem && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(arrayItem[1].replace(/^["'](.*)["']$/, '$1'))
      continue
    }
    const kv = line.match(/^([\w]+):\s*(.*)$/)
    if (kv) {
      currentKey = kv[1]
      const val = kv[2].trim()
      data[currentKey] = val === '' ? [] : val.replace(/^["'](.*)["']$/, '$1')
    }
  }

  return { data, content }
}

export function getAllPosts() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = slugFromPath(path)
      const { data, content } = parseFrontmatter(raw)
      return { slug, content, readTime: readingTime(content), ...data }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPost(slug) {
  const entry = Object.entries(modules).find(
    ([path]) => slugFromPath(path) === slug
  )
  if (!entry) return null
  const [, raw] = entry
  const { data, content } = parseFrontmatter(raw)
  return { slug, content, readTime: readingTime(content), ...data }
}

export const CATEGORIES = ['All', 'Technical Article', 'Application Note', 'Industry Insight', 'Case Study']
