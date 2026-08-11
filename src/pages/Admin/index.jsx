import { useState } from 'react'
import { AdminAuthProvider, AdminLogin } from './AdminAuth'
import { useAdminAuth } from './adminAuthContext'
import ProductsList from './ProductsList'
import ProductEditor from './ProductEditor'
import PagesEditor from './PagesEditor'
import { deployWorkflowUrl } from '../../utils/githubApi'

function AdminShell() {
  const { repoFullName, signOut } = useAdminAuth()
  const [tab, setTab] = useState('products') // 'products' | 'pages'
  const [productView, setProductView] = useState({ mode: 'list' }) // list | edit | new

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#05059b]">Invendis Content Admin</h1>
            <p className="text-xs text-slate-500">{repoFullName} · main branch · publishes instantly</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={deployWorkflowUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-[#05059b]"
            >
              View deploy status →
            </a>
            <button onClick={signOut} className="text-xs font-medium text-[#ff5050]">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <nav className="mx-auto flex max-w-6xl gap-1 px-6 pt-4">
        {[
          ['products', 'Products'],
          ['pages', 'Page Content'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setTab(key)
              setProductView({ mode: 'list' })
            }}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
              tab === key
                ? 'bg-white text-[#05059b] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl rounded-tl-none bg-white p-6 shadow-sm">
        {tab === 'products' && productView.mode === 'list' && (
          <ProductsList
            onSelect={(path) => setProductView({ mode: 'edit', path })}
            onCreateNew={() => setProductView({ mode: 'new' })}
          />
        )}
        {tab === 'products' && productView.mode === 'edit' && (
          <ProductEditor
            path={productView.path}
            isNew={false}
            onDone={() => setProductView({ mode: 'list' })}
            onCancel={() => setProductView({ mode: 'list' })}
          />
        )}
        {tab === 'products' && productView.mode === 'new' && (
          <ProductEditor
            isNew={true}
            onDone={() => setProductView({ mode: 'list' })}
            onCancel={() => setProductView({ mode: 'list' })}
          />
        )}
        {tab === 'pages' && <PagesEditor />}
      </main>
    </div>
  )
}

function AdminGate() {
  const { repoFullName } = useAdminAuth()
  return repoFullName ? <AdminShell /> : <AdminLogin />
}

export default function Admin() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  )
}
