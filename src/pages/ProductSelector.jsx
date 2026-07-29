import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import PageSEO from '../components/shared/PageSEO'
import Breadcrumbs from '../components/shared/Breadcrumbs'
import { breadcrumbSchema } from '../utils/breadcrumbSchema'
import products from '../data/products'
import productImages from '../data/productImages'
import productUseCases from '../data/productUseCases'
import { productDatasheets } from '../data/productDatasheets'
import { partDatasheets } from '../data/partDatasheets'
import { CATS } from '../utils/productHelpers'
import { useCompareList } from '../hooks/useCompareList'
import CategoryTabs from '../components/products/CategoryTabs'
import FilterBar from '../components/products/FilterBar'
import ProductGrid from '../components/products/ProductGrid'
import CompareBar from '../components/products/CompareBar'
import ProductModal from '../components/products/ProductModal'
import CompareModal from '../components/products/CompareModal'

const PAGE_SIZE = 12

export default function ProductSelector() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [filters, setFilters] = useState({ cell: '', wifi: '', ports: '', serial: '' })
  const [page, setPage] = useState(1)
  const validProductIds = useMemo(() => new Set(products.map(p => p.id)), [])
  const { compareIds, toggleCompare, clearCompare } = useCompareList(validProductIds)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === id)
      if (product) setSelectedProduct(product)
      else navigate('/products/product-selector', { replace: true })
    } else {
      setSelectedProduct(null)
    }
  }, [id])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter(p => {
      if (activeCat !== 'All' && p.cat !== activeCat) return false
      if (q && !p.name.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q) &&
          !p.cat.toLowerCase().includes(q) && !p.cpu.toLowerCase().includes(q)) return false
      if (filters.cell === '5G' && p.cellular_gen !== '5G') return false
      if (filters.cell === '4G' && p.cellular_gen !== '4G') return false
      if (filters.cell === 'none' && p.cellular_gen !== 'none') return false
      if (filters.wifi === 'WiFi6' && p.wifi !== 'WiFi6') return false
      if (filters.wifi === 'WiFi5' && p.wifi !== 'WiFi5') return false
      if (filters.wifi === 'WiFi24' && p.wifi !== 'WiFi24') return false
      if (filters.wifi === 'none' && p.wifi !== 'none') return false
      if (filters.ports === '2' && p.ports > 2) return false
      if (filters.ports === '5' && (p.ports < 3 || p.ports > 5)) return false
      if (filters.ports === '8' && (p.ports < 6 || p.ports > 8)) return false
      if (filters.ports === '10' && p.ports < 9) return false
      if (filters.serial === 'rs485' && !p.rs485) return false
      if (filters.serial === 'rs232' && !p.rs232) return false
      if (filters.serial === 'both' && !(p.rs485 && p.rs232)) return false
      return true
    })
  }, [search, activeCat, filters])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasActiveFilters = !!(search || Object.values(filters).some(v => v) || activeCat !== 'All')

  function handleCat(cat) { setActiveCat(cat); setPage(1) }
  function handleFilter(key, value) { setFilters(f => ({ ...f, [key]: value })); setPage(1) }
  function clearFilters() {
    setSearch(''); setFilters({ cell: '', wifi: '', ports: '', serial: '' }); setActiveCat('All'); setPage(1)
  }
  const catCounts = useMemo(() => {
    const counts = {}
    CATS.forEach(c => { counts[c] = c === 'All' ? products.length : products.filter(p => p.cat === c).length })
    return counts
  }, [])

  // Per-product SEO: when a product is open (via /products/product-selector/:id),
  // give it its own title, description, canonical, OG image and Product JSON-LD
  // instead of the generic "Product Finder" metadata every other product shared.
  const seo = useMemo(() => {
    const baseCrumbs = [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Product Finder', path: '/products/product-selector' },
    ]

    if (!selectedProduct) {
      const path = '/products/product-selector'
      const breadcrumbs = baseCrumbs.slice(0, -1).concat({ label: 'Product Finder', path: null })
      return {
        title: 'Product Finder',
        description: `Find and compare ${products.length}+ Invendis IIoT hardware products — industrial routers, gateways, controllers, and meters. Filter by 5G/4G, WiFi6, ports, and connectivity options.`,
        path,
        image: undefined,
        breadcrumbs,
        structuredData: breadcrumbSchema(breadcrumbs, path),
      }
    }
    const p = selectedProduct
    const image = productImages[p.id]?.[0]
    const path = `/products/product-selector/${p.id}`
    const breadcrumbs = baseCrumbs.concat({ label: p.name, path: null })
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.desc,
      category: p.cat,
      image: image ? `${window.location.origin}${image}` : undefined,
      brand: { '@type': 'Brand', name: 'Invendis Technologies' },
      manufacturer: { '@type': 'Organization', name: 'Invendis Technologies' },
    }
    return {
      title: p.name,
      description: `${p.desc} ${p.cat} from Invendis Technologies — view full specs, datasheet, and connectivity options.`.slice(0, 300),
      path,
      image,
      breadcrumbs,
      structuredData: [productSchema, breadcrumbSchema(breadcrumbs, path)],
    }
  }, [selectedProduct])

  return (
    <div className="min-h-screen bg-brand-light">
      <PageSEO
        title={seo.title}
        description={seo.description}
        path={seo.path}
        image={seo.image}
        structuredData={seo.structuredData}
      />
            <div className="bg-brand-blue text-white py-12 px-8 lg:px-16">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-brand-red text-white font-sora font-bold text-sm px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 mb-6"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <p className="text-brand-red font-sora text-sm font-semibold uppercase tracking-widest mb-2">Products</p>
        <h1 className="font-sora text-4xl font-bold mb-3">Product Selector</h1>
        <p className="text-blue-200 text-lg max-w-2xl">
          Browse and compare our full range of industrial networking and IoT hardware
        </p>
        <p className="mt-4 text-blue-300 text-sm font-sora font-semibold">
          {products.length} products across {CATS.length - 1} categories
        </p>
      </div>


      <div className="px-8 lg:px-16 py-8 pb-28">
        <div className="mb-6">
          <Breadcrumbs items={seo.breadcrumbs} />
        </div>
        <CategoryTabs cats={CATS} activeCat={activeCat} counts={catCounts} onCat={handleCat} />
        <FilterBar
          search={search} filters={filters} hasActiveFilters={hasActiveFilters}
          filtered={filtered} onSearch={v => { setSearch(v); setPage(1) }}
          onFilter={handleFilter} onClear={clearFilters}
          page={safePage} totalPages={totalPages}
        />
        <ProductGrid
          products={paginated} images={productImages} useCases={productUseCases}
          compareIds={compareIds}
          onDetail={p => navigate(`/products/product-selector/${p.id}`, { state: { noScroll: true } })}
          onToggleCompare={toggleCompare}
          page={safePage} totalPages={totalPages}
          onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          filtered={filtered}
        />
      </div>

      <CompareBar
        compareIds={compareIds} products={products}
        onRemove={toggleCompare} onClear={clearCompare}
        onCompare={() => setCompareOpen(true)}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct} images={productImages} useCases={productUseCases}
          datasheets={productDatasheets} partDatasheets={partDatasheets}
          compareIds={compareIds} onClose={() => navigate('/products/product-selector')}
          onToggleCompare={toggleCompare}
        />
      )}

      {compareOpen && (
        <CompareModal
          compareIds={compareIds} products={products}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  )
}
