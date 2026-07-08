import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CookieBanner from './components/shared/CookieBanner'
import WhatsAppButton from './components/shared/WhatsAppButton'
import { trackPageView } from './utils/analytics'

const Home            = lazy(() => import('./pages/Home'))
const Sectors         = lazy(() => import('./pages/Sectors'))
const Products        = lazy(() => import('./pages/Products'))
const ProductSelector = lazy(() => import('./pages/ProductSelector'))
const CaseStudies     = lazy(() => import('./pages/CaseStudies'))
const Company         = lazy(() => import('./pages/Company'))
const Contact         = lazy(() => import('./pages/Contact'))
const Privacy         = lazy(() => import('./pages/Privacy'))
const Terms           = lazy(() => import('./pages/Terms'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}

export default App