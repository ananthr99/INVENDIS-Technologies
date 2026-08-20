import { useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { useAdmin } from '../context/AdminContext'
import Setup from './Setup'
import SiteSettings from './SiteSettings'
import ContactPage from './editors/ContactPage'
import ActivityLog from './ActivityLog'
import HomePage from './editors/HomePage'
import CompanyPage from './editors/CompanyPage'
import SectorsPage from './editors/SectorsPage'
import CareersPage from './editors/CareersPage'


const NAV = [
  { key: 'dashboard', label: 'Dashboard' },
  { type: 'sep', label: 'CONTENT' },
  { key: 'settings', label: 'Site Settings' },
  { type: 'sep', label: 'PAGES' },
  { key: 'page-contact',    label: 'Contact' },
  { key: 'page-home',       label: 'Home' },
  { key: 'page-company',    label: 'Company' },
  { key: 'page-sectors',    label: 'Sectors' },
  { key: 'page-products',   label: 'Products',    soon: true },
  { key: 'page-silbo',      label: 'SILBO',       soon: true },
  { key: 'page-careers',    label: 'Careers' },
  { key: 'page-casestudies',label: 'Case Studies',soon: true },
  { type: 'sep', label: 'ADMIN' },
  { key: 'products',  label: 'Products Catalogue', soon: true },
  { key: 'blog',      label: 'Blog',               soon: true },
  { key: 'countries', label: 'Countries',          soon: true },
  { key: 'setup',     label: 'Setup' },
  { key: 'activity-log', label: 'Activity Log' },
]

export default function Dashboard() {
  const { accounts, instance } = useMsal()
  const { token } = useAdmin()
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState({ CONTENT: false, PAGES: false, ADMIN: false })
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
            {(() => {
              let currentSection = null
              return NAV.map((item, i) => {
                if (item.type === 'sep') {
                  currentSection = item.label
                  const isCollapsed = collapsed[item.label] ?? false
                  return (
                    <div
                      key={i}
                      onClick={() => setCollapsed(prev => ({ ...prev, [item.label]: !prev[item.label] }))}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 10px 4px', cursor: 'pointer', userSelect: 'none',
                      }}
                    >
                      <p className="sidebar-section-label" style={{ margin: 0, padding: 0 }}>{item.label}</p>
                                            <span style={{
                        fontSize: 18, color: '#374151', fontWeight: 600,
                        transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block', lineHeight: 1,
                      }}>
                        ›
                      </span>
                    </div>
                  )
                }

                if (currentSection && collapsed[currentSection]) return null

                const isPage = item.key.startsWith('page-')
                return (
                  <div
                    key={item.key}
                    className={[
                      'sidebar-item',
                      active === item.key ? 'active' : '',
                      item.soon ? 'disabled' : '',
                    ].join(' ').trim()}
                    style={isPage ? { paddingLeft: 20 } : {}}
                    onClick={() => !item.soon && setActive(item.key)}
                  >
                    {item.label}
                    {item.soon && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9ca3af' }}>soon</span>
                    )}
                  </div>
                )
              })
          })()}
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

          {active === 'dashboard'     && <DashboardHome user={user} onSetup={() => setActive('setup')} token={token} />}
          {active === 'setup'         && <Setup />}
          {active === 'settings'      && <SiteSettings />}
          {active === 'page-contact'  && <ContactPage />}
          {active === 'page-home'     && <HomePage />}
          {active === 'page-company'   && <CompanyPage />}
          {active === 'page-sectors'   && <SectorsPage />}
          {active === 'page-careers'   && <CareersPage />}
          {active === 'activity-log' && <ActivityLog />}
        </div>
      </div>
    </>
  )
}

function DashboardHome({ user, onSetup, token }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const FLOW = [
    {
      step: '1',
      title: 'Edit Content',
      desc: 'Open any page editor from the sidebar and make your changes.',
      color: '#2563eb',
    },
    {
      step: '2',
      title: 'Save & Publish',
      desc: 'Click the Save & Publish button — this triggers the update.',
      color: '#7c3aed',
    },
    {
      step: '3',
      title: 'GitHub Updated',
      desc: 'Changes are written directly to the live branch (gh-pages) in seconds, and synced to the source branch (main) with no rebuild triggered.',
      color: '#059669',
    },
    {
      step: '4',
      title: 'Live on Website',
      desc: 'The website fetches content at runtime — your changes are visible immediately. No build required.',
      color: '#dc2626',
    },
  ]

  const TIPS = [
    'Always click Save & Publish to apply changes — navigating away without saving will lose your edits.',
    'If a change doesn\'t appear on the site, do a hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac).',
    'Team member photos are uploaded immediately when selected, but the path is only saved when you click Save & Publish.',
    'Every save is logged in the Activity Log — you can see who changed what and when.',
    'The source code (main branch) stays in sync automatically after every save, but does not trigger a site rebuild.',
  ]

  return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <div style={{ maxWidth: 860 }}>

      {/* ── User card ── */}
      <div style={{ background: 'linear-gradient(135deg, #05059b 0%, #2929c8 100%)', borderRadius: 16, padding: '24px 28px', color: '#fff', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, opacity: 0.65, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Logged in as</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{user?.name ?? 'Admin'}</h2>
          <p style={{ fontSize: 13, opacity: 0.8 }}>{user?.username ?? ''}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{timeStr}</p>
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>{dateStr}</p>
        </div>
      </div>
      </div>

      {!token && (
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>⚠</span>
          <p style={{ fontSize: 13, color: '#92400e' }}>
            GitHub token not configured.{' '}
            <span style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={onSetup}>Go to Setup</span>
            {' '}before making any changes.
          </p>
        </div>
      )}

      {/* ── How it works ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>How It Works</p>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap' }}>
          {FLOW.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 160px', minWidth: 140 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 14px', flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: f.color, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  {f.step}
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 5 }}>{f.title}</p>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
              {i < FLOW.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: '#d1d5db', fontSize: 20, flexShrink: 0 }}>›</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips ── */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Key Things to Remember</p>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '6px 0' }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 18px', borderBottom: i < TIPS.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563eb', fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>·</span>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
