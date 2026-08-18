import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { ALLOWED_EMAILS } from './msalConfig'
import LoginPage from '../pages/LoginPage'
import AccessDenied from '../pages/AccessDenied'

export default function AuthGuard({ children }) {
  const isAuthenticated = useIsAuthenticated()
  const { accounts } = useMsal()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const userEmail = accounts[0]?.username?.toLowerCase() ?? ''
  const isAllowed = ALLOWED_EMAILS.some(
    email => email.toLowerCase() === userEmail
  )

  if (!isAllowed) {
    return <AccessDenied email={userEmail} />
  }

  return children
}
