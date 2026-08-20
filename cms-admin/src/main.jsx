import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const _favicon = document.createElement('link')
_favicon.rel = 'icon'
_favicon.type = 'image/png'
_favicon.href = `${import.meta.env.BASE_URL}invendis_logo.png?t=${Date.now()}`
document.head.appendChild(_favicon)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
