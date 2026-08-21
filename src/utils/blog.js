const BLOG_BASE = '/content/blog'

export const CATEGORIES = ['All', 'Technical Article', 'Application Note', 'Industry Insight', 'Case Study']

export async function getAllPosts() {
  try {
    const res = await fetch(`${BLOG_BASE}/_index.json`)
    if (!res.ok) return []
    const posts = await res.json()
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch {
    return []
  }
}

export async function getPost(slug) {
  try {
    const res = await fetch(`${BLOG_BASE}/${slug}.json`)
    if (!res.ok) return null
    const data = await res.json()
    const words = (data.body || '').trim().split(/\s+/).length
    return {
      ...data,
      slug,
      content: data.body,
      readTime: Math.max(1, Math.ceil(words / 200)),
    }
  } catch {
    return null
  }
}
