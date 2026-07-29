import { useEffect } from 'react'
import { absoluteUrl } from '../../utils/siteUrl'

export default function PageSEO({ title, description, path = '', structuredData, image, noindex = false }) {
  const fullTitle = title
    ? `${title} | Invendis Technologies`
    : 'Invendis Technologies | Industrial IoT Solutions'
  const canonical = absoluteUrl(path)
  const ogImage = image ? absoluteUrl(image) : absoluteUrl('/invendis_logo.png')

  useEffect(() => {
    if (!structuredData) return
    // Accept either a single schema object or an array of them (e.g. Product
    // schema + BreadcrumbList together) — each gets its own <script> tag,
    // which is the pattern Google's structured data docs recommend over
    // combining unrelated types into one block.
    const blocks = Array.isArray(structuredData) ? structuredData : [structuredData]
    const scripts = blocks.map(block => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(block)
      document.head.appendChild(script)
      return script
    })
    return () => {
      scripts.forEach(script => {
        if (document.head.contains(script)) document.head.removeChild(script)
      })
    }
  }, [structuredData])

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Invendis Technologies" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}
