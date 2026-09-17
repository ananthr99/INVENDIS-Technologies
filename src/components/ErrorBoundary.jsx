import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-8 text-center">
          <h2 className="font-sora text-2xl font-bold text-brand-text mb-3">Something went wrong</h2>
          <p className="text-brand-muted mb-6">This page encountered an error. Please try refreshing.</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white font-sora font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Refresh page
            </button>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = import.meta.env.BASE_URL }}
              className="border border-brand-blue text-brand-blue font-sora font-semibold px-6 py-3 rounded-xl hover:bg-brand-blue/5 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
