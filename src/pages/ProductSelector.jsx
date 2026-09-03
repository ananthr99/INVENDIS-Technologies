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
import ProductList from '../components/products/ProductList'
import CompareBar from '../components/products/CompareBar'
import ProductModal from '../components/products/ProductModal'
import CompareModal from '../components/products/CompareModal'

const PAGE_SIZE = 12

// Respect the admin-set hidden flag — hidden products are excluded everywhere on the site
const visibleProducts = products.filter(p => !p.hidden)

export default function ProductSelector() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [filters, setFilters] = useState({ cell: '', wifi: '', ports: '', serial: '' })
  const [page, setPage] = useState(1)
  const [view, setView] = useState('grid')
  const [toast, setToast] = useState('')
  const validProductIds = useMemo(() => new Set(visibleProducts.map(p => p.id)), [])
  const { compareIds, toggleCompare, clearCompare } = useCompareList(validProductIds)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => {
    if (id) {
      const product = visibleProducts.find(p => p.id === id)
      if (product) setSelectedProduct(product)
      else navigate('/products/product-selector', { replace: true })
    } else {
      setSelectedProduct(null)
    }
  }, [id])

  function handleView(v) {
    if (v === 'list' && window.innerWidth <= 640) {
      setToast('List view is not available on small screens.')
      setTimeout(() => setToast(''), 3000)
      return
    }
    setView(v)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return visibleProducts.filter(p => {
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
    }).sort((a, b) => {
      const aO = a.order ?? Infinity
      const bO = b.order ?? Infinity
      if (aO !== bO) return aO - bO
      const aImg = !!(productImages[a.id]?.length)
      const bImg = !!(productImages[b.id]?.length)
      return aImg === bImg ? 0 : aImg ? -1 : 1
    })
  }, [search, activeCat, filters])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasActiveFilters = !!(search || Object.values(filters).some(v => v) || activeCat !== 'All')
  const start = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0
  const end = Math.min(safePage * PAGE_SIZE, filtered.length)

  function handleCat(cat) { setActiveCat(cat); setPage(1) }
  function handleFilter(key, value) { setFilters(f => ({ ...f, [key]: value })); setPage(1) }
  function clearFilters() {
    setSearch(''); setFilters({ cell: '', wifi: '', ports: '', serial: '' }); setActiveCat('All'); setPage(1)
  }

  const catCounts = useMemo(() => {
    const counts = {}
    CATS.forEach(c => { counts[c] = c === 'All' ? visibleProducts.length : visibleProducts.filter(p => p.cat === c).length })
    return counts
  }, [])

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
        description: `Find and compare ${visibleProducts.length}+ Invendis IIoT hardware products — industrial routers, gateways, controllers, and meters. Filter by 5G/4G, WiFi6, ports, and connectivity options.`,
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
    <div className="min-h-screen bg-[#F7F9FC]">
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
          {visibleProducts.length} products across {CATS.length - 1} categories
        </p>
      </div>

      <div className="px-8 lg:px-16 py-7 pb-20">
        <div className="mb-6">
          <Breadcrumbs items={seo.breadcrumbs} />
        </div>

        {/* Filter bar — first */}
        <FilterBar
          search={search}
          filters={filters}
          view={view}
          onSearch={v => { setSearch(v); setPage(1) }}
          onFilter={handleFilter}
          onView={handleView}
        />

        {/* Category tabs — second */}
        <CategoryTabs cats={CATS} activeCat={activeCat} counts={catCounts} onCat={handleCat} />

        {/* Results bar — between tabs and grid */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <p className="text-[13px] text-[#5A6E87]">
            {filtered.length
              ? <>Showing <strong className="text-[#0B1F3A]">{start}–{end}</strong> of <strong className="text-[#0B1F3A]">{filtered.length}</strong> products</>
              : <strong className="text-[#0B1F3A]">0 products found</strong>
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[13px] text-[#1A6FC4] bg-none border-none cursor-pointer underline hover:text-[#05059b] font-[inherit]"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Grid or list */}
        {view === 'grid' ? (
          <ProductGrid
            products={paginated}
            images={productImages}
            useCases={productUseCases}
            compareIds={compareIds}
            onDetail={p => navigate(`/products/product-selector/${p.id}`, { state: { noScroll: true } })}
            onToggleCompare={toggleCompare}
            page={safePage}
            totalPages={totalPages}
            onPage={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            filtered={filtered}
          />
        ) : (
          <>
            <ProductList
              products={paginated}
              images={productImages}
              compareIds={compareIds}
              onDetail={p => navigate(`/products/product-selector/${p.id}`, { state: { noScroll: true } })}
              onToggleCompare={toggleCompare}
            />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 flex-wrap mt-7">
                {/* Reuse same pagination from ProductGrid — inline here for list view */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`min-w-9 h-9 px-1.5 border rounded-[6px] text-[13px] font-medium flex items-center justify-center transition-all
                      ${n === safePage
                        ? 'bg-brand-blue border-brand-blue text-white'
                        : 'border-[#DDE5EF] bg-white text-[#0B1F3A] hover:border-[#1A6FC4] hover:text-[#1A6FC4] hover:bg-[#EAF2FB]'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast for mobile list-view warning */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#FFF4E0] text-[#7A5000] border border-[#f0d080] px-5 py-[10px] rounded-[10px] text-[13px] font-medium shadow-md z-[9999] pointer-events-none whitespace-nowrap">
          {toast}
        </div>
      )}

      <CompareBar
        compareIds={compareIds}
        products={visibleProducts}
        onRemove={toggleCompare}
        onClear={clearCompare}
        onCompare={() => setCompareOpen(true)}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          images={productImages}
          useCases={productUseCases}
          datasheets={productDatasheets}
          partDatasheets={partDatasheets}
          compareIds={compareIds}
          onClose={() => navigate('/products/product-selector')}
          onToggleCompare={toggleCompare}
        />
      )}

      {compareOpen && (
        <CompareModal
          compareIds={compareIds}
          products={visibleProducts}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  )
}
