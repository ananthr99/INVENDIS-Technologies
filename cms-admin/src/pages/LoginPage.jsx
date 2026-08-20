import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/msalConfig'

export default function LoginPage() {
  const { instance } = useMsal()

  function handleLogin() {
    instance.loginRedirect(loginRequest)
  }

  return (
    <div className="login-root">
      <div className="login-box">
        <img
          src={`${import.meta.env.BASE_URL}invendis_logo.png`}
          className="login-logo"
          alt="Invendis"
          onError={e => e.currentTarget.style.display = 'none'}
        />
        <h1 className="login-title">Invendis Technologies Admin</h1>
        <p className="login-subtitle">Sign in with your Microsoft account to manage Invendis website</p>
        <button className="btn-ms" onClick={handleLogin}>
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>
      </div>
    </div>
  )
}
