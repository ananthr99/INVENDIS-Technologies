import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

function findImages(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findImages(fullPath))
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

const images = findImages('public')
let converted = 0

for (const imgPath of images) {
  const webpPath = imgPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  try {
    await sharp(imgPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(webpPath)
    const origKB = (fs.statSync(imgPath).size / 1024).toFixed(0)
    const webpKB = (fs.statSync(webpPath).size / 1024).toFixed(0)
    const saving = Math.round((1 - webpKB / origKB) * 100)
    console.log(`✓  ${path.basename(imgPath).padEnd(40)} ${origKB}KB → ${webpKB}KB  (${saving}% smaller)`)
    converted++
  } catch (e) {
    console.error(`✗  ${imgPath}: ${e.message}`)
  }
}

console.log(`\nDone. Converted: ${converted}`)
