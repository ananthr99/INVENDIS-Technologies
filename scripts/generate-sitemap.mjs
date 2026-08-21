// Regenerates public/sitemap.xml from the site's actual routes, blog posts,
// and product catalog, so the sitemap can't silently drift out of sync with
// the app (e.g. a stale GitHub Pages path baked into Netlify URLs, or new
// products/blog posts never being added).
//
// Run with: node scripts/generate-sitemap.mjs
// Consider wiring this into the build ("prebuild") or CMS-publish CI step
// so it regenerates automatically whenever content or the catalog changes.

import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import products from '../src/data/products.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Canonical domain — must match PageSEO's SITE_URL default / robots.txt.
// Override with SITEMAP_URL env var if the canonical domain ever changes.
const SITE_URL = process.env.SITEMAP_URL || 'https://invendis-technologies-cms.netlify.app'

const today = new Date().toISOString().slice(0, 10)

function blogSlugs() {
  try {
    const index = JSON.parse(readFileSync(join(ROOT, 'public/content/blog/_index.json'), 'utf8'))
    return index.map(e => e.slug)
  } catch {
    return []
  }
}


const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/sectors', changefreq: 'monthly', priority: '0.9' },
  { path: '/products', changefreq: 'weekly', priority: '0.9' },
  { path: '/products/product-selector', changefreq: 'weekly', priority: '0.8' },
  { path: '/silbo', changefreq: 'monthly', priority: '0.8' },
  { path: '/case-studies', changefreq: 'monthly', priority: '0.8' },
  { path: '/company', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/resources', changefreq: 'weekly', priority: '0.8' },
  { path: '/careers', changefreq: 'monthly', priority: '0.7' },
]

const blogRoutes = blogSlugs().map(slug => ({
  path: `/resources/${slug}`,
  changefreq: 'monthly',
  priority: '0.7',
}))

const productRoutes = products.map(p => ({
  path: `/products/product-selector/${p.id}`,
  changefreq: 'monthly',
  priority: '0.6',
}))

const allRoutes = [...staticRoutes, ...blogRoutes, ...productRoutes]

const body = allRoutes
  .map(
    r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml written with ${allRoutes.length} URLs (${staticRoutes.length} static, ${blogRoutes.length} blog, ${productRoutes.length} products).`)
