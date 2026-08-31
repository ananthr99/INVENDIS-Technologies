export const CATS = ['All', 'Router', 'Gateway', 'Switch', 'Energy Meter', 'PCB', 'Intel Based Devices', 'Other']

export const catColors = {
  Router:                'bg-[#EAF2FB] text-[#1260A8]',
  Gateway:               'bg-[#E4F5EE] text-[#0F6040]',
  Switch:                'bg-[#FFF3E0] text-[#8B5200]',
  'Energy Meter':        'bg-[#F9EAF3] text-[#7B2563]',
  PCB:                   'bg-[#ECFDF5] text-[#065F46]',
  'Intel Based Devices': 'bg-red-100 text-red-700',
  Other:                 'bg-[#EEF0F3] text-[#3A4D63]',
}

export function wifiLabel(w) {
  return { WiFi6: 'Wi-Fi 6', WiFi5: 'Wi-Fi 5', WiFi24: 'Wi-Fi 2.4 GHz', WiFi4: 'Wi-Fi 4', none: '—' }[w] || w
}

export function viewFile(url, btn) {
  const origHtml = btn ? btn.innerHTML : null
  if (btn) { btn.disabled = true; btn.textContent = '…' }

  // Open the tab immediately while the user gesture is active (avoids popup blocker).
  // Then navigate it to a blob URL so Content-Disposition: attachment is bypassed.
  const newTab = window.open('', '_blank')
  if (!newTab) {
    if (btn) { btn.disabled = false; btn.innerHTML = origHtml }
    return
  }

  fetch(url)
    .then(r => r.blob())
    .then(blob => {
      // raw.githubusercontent.com returns application/octet-stream, not application/pdf,
      // so we force the type so Chrome's PDF viewer opens it instead of downloading.
      const pdfBlob = new Blob([blob], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(pdfBlob)
      newTab.location.href = blobUrl
      if (btn) { btn.disabled = false; btn.innerHTML = origHtml }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    })
    .catch(() => {
      newTab.location.href = url
      if (btn) { btn.disabled = false; btn.innerHTML = origHtml }
    })
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
