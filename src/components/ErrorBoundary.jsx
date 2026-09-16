import { Component } from 'react'

const CHUNK_ERROR = /Loading chunk|Failed to fetch dynamically imported|Importing a module script failed/i

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (CHUNK_ERROR.test(error?.message || '') && !sessionStorage.getItem('chunk_reload')) {
      sessionStorage.setItem('chunk_reload', '1')
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-8 text-center">
          <h2 className="font-sora text-2xl font-bold text-brand-text mb-3">Something went wrong</h2>
          <p className="text-brand-muted mb-6">This page encountered an error. Please try refreshing.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = import.meta.env.BASE_URL }}
            className="bg-brand-blue text-white font-sora font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
