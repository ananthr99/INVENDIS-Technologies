// ONE-TIME MIGRATION — run once to convert the existing hand-maintained
// product data files into the new CMS-owned layout:
//   src/content/products/<id>.json   → one file per product, owned by Decap CMS
//   src/data/productVariants.js      → developer-only, variant tables (kept out
//                                       of the CMS since Decap has no widget for
//                                       a genuinely free-form table)
//   src/data/partDatasheets.js       → developer-only, per-variant datasheets
//
// After running this once and verifying the output, this script and the old
// products.js/productImages.js/productDatasheets.js/productUseCases.js source
// files are no longer needed — scripts/generate-products.mjs regenerates
// products.js/productImages.js/productDatasheets.js/productUseCases.js from
// src/content/products/*.json + productVariants.js on every build.

import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import products from '../src/data/products.js'
import productImages from '/tmp/node-shim/productImages.js'
import productUseCases from '../src/data/productUseCases.js'
import { partDatasheets, productDatasheets } from '/tmp/node-shim/productDatasheets.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Strip the Vite BASE_URL prefix that's baked into the source arrays
// (`${base}products/images/...`) back down to a plain `/products/images/...`
// path — this is the form Decap's image/file widgets store and read.
function toPublicPath(p) {
  return p.replace(/^.*?(\/products\/)/, '$1')
}

mkdirSync(join(ROOT, 'src/content/products'), { recursive: true })

const variants = {}
let written = 0

for (const p of products) {
  const { variants: v, ...flat } = p
  if (v) variants[p.id] = v

  const entry = {
    ...flat,
    images: (productImages[p.id] || []).map(toPublicPath),
    datasheet: productDatasheets[p.id] ? toPublicPath(productDatasheets[p.id]) : '',
    use_cases: productUseCases[p.id] || [],
  }

  writeFileSync(
    join(ROOT, 'src/content/products', `${p.id}.json`),
    JSON.stringify(entry, null, 2) + '\n'
  )
  written++
}

writeFileSync(
  join(ROOT, 'src/data/productVariants.js'),
  `// Developer-maintained. Variant tables are free-form (different products use\n` +
  `// different column sets) and aren't exposed in the CMS — add/edit new variant\n` +
  `// tables here by hand, keyed by product id.\n` +
  `const productVariants = ${JSON.stringify(variants, null, 2)}\n\n` +
  `export default productVariants\n`
)

writeFileSync(
  join(ROOT, 'src/data/partDatasheets.js'),
  `// Developer-maintained. Per-variant/part-number datasheets, tied to the\n` +
  `// free-form variant tables in productVariants.js — kept out of the CMS for\n` +
  `// the same reason variants are.\n` +
  `export const partDatasheets = ${JSON.stringify(partDatasheets, null, 2)}\n`
)

console.log(`Migrated ${written} products to src/content/products/*.json`)
console.log(`Extracted ${Object.keys(variants).length} variant tables to src/data/productVariants.js`)
console.log(`Copied ${Object.keys(partDatasheets).length} part datasheets to src/data/partDatasheets.js`)
