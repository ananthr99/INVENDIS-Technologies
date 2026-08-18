import { createContext, useContext, useState, useCallback } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [token, setTokenState] = useState(
    () => localStorage.getItem('gh_pat') ?? ''
  )
  const [toastMsg, setToastMsg]         = useState('')
  const [toastType, setToastType]       = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  function saveToken(t) {
    localStorage.setItem('gh_pat', t)
    setTokenState(t)
  }

  const toast = useCallback((msg, type = '') => {
    setToastMsg(msg)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }, [])

  return (
    <AdminContext.Provider value={{ token, saveToken, toast }}>
      {children}
      <div className={`toast${toastType ? ` ${toastType}` : ''}${toastVisible ? ' show' : ''}`}>
        {toastMsg}
      </div>
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
