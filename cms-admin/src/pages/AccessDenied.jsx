import { useMsal } from '@azure/msal-react'

export default function AccessDenied({ email }) {
  const { instance } = useMsal()

  function handleSignOut() {
    instance.logoutRedirect()
  }

  return (
    <div className="login-root">
      <div className="login-box">
        <div className="denied-icon">✕</div>
        <p className="login-title">Access Denied</p>
        <p className="login-subtitle">
          <strong>{email}</strong> is not authorised to access this system.
          Contact your administrator to request access.
        </p>
        <button className="btn-ms" style={{ marginTop: '20px' }} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  )
}
