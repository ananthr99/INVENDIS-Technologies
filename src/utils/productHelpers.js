export const CATS = ['All', 'Router', 'Gateway', 'Switch', 'Energy Meter', 'Other']

export const catColors = {
  Router:         'bg-blue-100 text-blue-700',
  Gateway:        'bg-violet-100 text-violet-700',
  Switch:         'bg-emerald-100 text-emerald-700',
  'Energy Meter': 'bg-amber-100 text-amber-700',
  Other:          'bg-gray-100 text-gray-600',
}

export function wifiLabel(w) {
  return { WiFi6: 'Wi-Fi 6', WiFi5: 'Wi-Fi 5', WiFi24: 'Wi-Fi 2.4 GHz', none: '—' }[w] || w
}

export function downloadFile(url) {
  const filename = decodeURIComponent(url.split('/').pop())
  fetch(url)
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    })
    .catch(() => {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
}
