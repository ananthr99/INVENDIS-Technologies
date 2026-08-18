import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import AuthProvider from './auth/AuthProvider'
import AuthGuard from './auth/AuthGuard'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AuthGuard>
            <Routes>
              <Route path="/*" element={<Dashboard />} />
            </Routes>
          </AuthGuard>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  )
}
