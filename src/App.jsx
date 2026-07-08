import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CookieBanner from './components/shared/CookieBanner'
import { trackPageView } from './utils/analytics'
import Home from './pages/Home'
import Sectors from './pages/Sectors'
import Products from './pages/Products'
import ProductSelector from './pages/ProductSelector'
import CaseStudies from './pages/CaseStudies'
import Company from './pages/Company'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sectors" element={<Sectors />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/product-selector" element={<ProductSelector />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}

export default App