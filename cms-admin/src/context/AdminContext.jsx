import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const { accounts } = useMsal()
  const userEmail = accounts[0]?.username ?? ''
  const [token, setTokenState] = useState(
    () => localStorage.getItem('gh_pat') ?? ''
  )
  const [toastMsg,     setToastMsg]     = useState('')
  const [toastType,    setToastType]    = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [confirmState, setConfirmState] = useState(null)
  const isDirtyRef = useRef(false)

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

  function setDirty(val) { isDirtyRef.current = val }
  function isDirty()     { return isDirtyRef.current }

  function showConfirm(message, onOk) {
    setConfirmState({ message, onOk })
  }

  function handleConfirmOk() {
    const cb = confirmState?.onOk
    setConfirmState(null)
    cb?.()
  }

  function handleConfirmCancel() {
    setConfirmState(null)
  }

  useEffect(() => {
    function handler(e) {
      if (isDirtyRef.current) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  return (
    <AdminContext.Provider value={{ token, saveToken, toast, userEmail, setDirty, isDirty, showConfirm }}>
      {children}
      <div className={`toast${toastType ? ` ${toastType}` : ''}${toastVisible ? ' show' : ''}`}>
        {toastMsg}
      </div>
      {confirmState && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Unsaved Changes</h3>
            <p>{confirmState.message}</p>
            <div className="confirm-actions">
              <button className="confirm-btn-cancel" onClick={handleConfirmCancel}>Keep editing</button>
              <button className="confirm-btn-ok" onClick={handleConfirmOk}>Discard changes</button>
            </div>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
