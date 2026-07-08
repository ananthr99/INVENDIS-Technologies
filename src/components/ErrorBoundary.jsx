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
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
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
