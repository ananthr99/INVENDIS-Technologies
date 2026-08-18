import { useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { useAdmin } from '../context/AdminContext'
import Setup from './Setup'
import SiteSettings from './SiteSettings'


const NAV = [
  { key: 'dashboard', label: 'Dashboard' },
  { type: 'sep', label: 'CONTENT' },
  { key: 'settings',  label: 'Site Settings' },
  { key: 'pages',     label: 'Pages',         soon: true },
  { key: 'products',  label: 'Products',      soon: true },
  { key: 'blog',      label: 'Blog',          soon: true },
  { key: 'countries', label: 'Countries',     soon: true },
  { type: 'sep', label: 'ADMIN' },
  { key: 'setup', label: 'Setup' },
]

export default function Dashboard() {
  const { accounts, instance } = useMsal()
  const { token } = useAdmin()
  const [active, setActive] = useState('dashboard')
  const user = accounts[0]

  function handleSignOut() {
    instance.logoutRedirect()
  }

  return (
    <>
      <header className="admin-header">
        <span className="admin-header-title">INVENDIS CMS</span>
        <div className="admin-header-user">
          <span>{user?.name ?? user?.username}</span>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      <div className="dash-body">
        <aside className="sidebar">
          <div style={{ padding: '10px 6px 6px' }}>
            {NAV.map((item, i) => {
              if (item.type === 'sep') {
                return (
                  <p key={i} className="sidebar-section-label">{item.label}</p>
                )
              }
              return (
                <div
                  key={item.key}
                  className={[
                    'sidebar-item',
                    active === item.key ? 'active' : '',
                    item.soon ? 'disabled' : '',
                  ].join(' ').trim()}
                  onClick={() => !item.soon && setActive(item.key)}
                >
                  {item.label}
                  {item.soon && (
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9ca3af' }}>
                      soon
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        <div className="content">
          {!token && active !== 'setup' && (
            <div className="token-banner">
              ⚠ GitHub token not configured —{' '}
              <span
                style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setActive('setup')}
              >
                go to Setup
              </span>{' '}
              before publishing any changes.
            </div>
          )}

          {active === 'dashboard' && <DashboardHome user={user} onSetup={() => setActive('setup')} token={token} />}
          {active === 'setup'     && <Setup />}
          {active === 'dashboard' && <DashboardHome user={user} onSetup={() => setActive('setup')} token={token} />}
          {active === 'setup'     && <Setup />}
          {active === 'settings'  && <SiteSettings />}
        </div>
      </div>
    </>
  )
}

function DashboardHome({ user, onSetup, token }) {
  return (
    <div className="tab-panel">
      <div className="info-card">
        <h2>Welcome, {user?.name?.split(' ')[0] ?? 'Admin'}</h2>
        <p>
          {token
            ? 'GitHub token is configured. Content editors will be enabled here one section at a time.'
            : 'GitHub token is not set. Click Setup in the sidebar to configure it before making any changes.'}
        </p>
        {!token && (
          <button className="btn-save" style={{ marginTop: 14 }} onClick={onSetup}>
            Go to Setup
          </button>
        )}
      </div>
    </div>
  )
}
