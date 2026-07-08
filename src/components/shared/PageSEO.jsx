import { useEffect } from 'react'

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://invendis-technologies-cms.netlify.app'
const rawBase = import.meta.env.BASE_URL
const BASE_PATH = rawBase === '/' ? '' : rawBase.replace(/\/$/, '')

export default function PageSEO({ title, description, path = '', structuredData }) {
  const fullTitle = title
    ? `${title} | Invendis Technologies`
    : 'Invendis Technologies | Industrial IoT Solutions'
  const canonical = `${SITE_URL}${BASE_PATH}${path}`
  const ogImage = `${SITE_URL}/invendis_logo.png`

  useEffect(() => {
    if (!structuredData) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [structuredData])

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
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
