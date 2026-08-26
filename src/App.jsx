import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CookieBanner from './components/shared/CookieBanner'
import WhatsAppButton from './components/shared/WhatsAppButton'
import ErrorBoundary from './components/ErrorBoundary'
import { trackPageView } from './utils/analytics'
import StickyProductCTA from './components/shared/StickyProductCTA'

const Home            = lazy(() => import('./pages/Home'))
const Sectors         = lazy(() => import('./pages/Sectors'))
const Products        = lazy(() => import('./pages/Products'))
const ProductSelector = lazy(() => import('./pages/ProductSelector'))
const CaseStudies     = lazy(() => import('./pages/CaseStudies'))
const Company         = lazy(() => import('./pages/Company'))
const Contact         = lazy(() => import('./pages/Contact'))
const Privacy         = lazy(() => import('./pages/Privacy'))
const Terms           = lazy(() => import('./pages/Terms'))
const Resources       = lazy(() => import('./pages/Resources'))
const ResourceDetail  = lazy(() => import('./pages/ResourceDetail'))
const Careers         = lazy(() => import('./pages/Careers'))
const Silbo           = lazy(() => import('./pages/Silbo'))
const Gallery         = lazy(() => import('./pages/Gallery'))
const NotFound        = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ScrollToTop() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (!state?.noScroll) window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])
  return null
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-24 right-5 z-50 w-10 h-10 rounded-full bg-[#FD1D1E] text-white shadow-lg hover:bg-[#e01010] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  )
}

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <Navbar />
      <StickyProductCTA />
      <main id="main-content" className="pt-20">
        <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/product-selector" element={<ProductSelector />} />
            <Route path="/products/product-selector/:id" element={<ProductSelector />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/company" element={<Company />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourceDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/silbo" element={<Silbo />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <CookieBanner />
    </>
  )
}

export default App