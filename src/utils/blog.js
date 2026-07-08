import matter from 'gray-matter'

const modules = import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw', import: 'default' })

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function getAllPosts() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = slugFromPath(path)
      const { data, content } = matter(raw)
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
  const { data, content } = matter(raw)
  return { slug, content, readTime: readingTime(content), ...data }
}

export const CATEGORIES = ['All', 'Technical Article', 'Application Note', 'Industry Insight', 'Case Study']
