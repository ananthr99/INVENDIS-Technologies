const GA_ID = import.meta.env.VITE_GA_ID

export function loadGA4() {
  if (!GA_ID || window.__ga4Loaded) return
  window.__ga4Loaded = true

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID, { anonymize_ip: true })

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)
}

export function trackPageView(path) {
  if (!window.gtag || !GA_ID) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  })
}

export function getConsent() {
  return localStorage.getItem('cookie_consent')
}

export function setConsent(accepted) {
  localStorage.setItem('cookie_consent', accepted ? 'accepted' : 'declined')
}
