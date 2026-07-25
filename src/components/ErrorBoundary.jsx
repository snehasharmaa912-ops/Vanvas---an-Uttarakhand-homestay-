import { Component } from 'react'
import { Button } from './ui'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Logged here so a crash is still visible during development / in the console.
    console.error('Uncaught render error:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdf8f2] dark:bg-[#0a1f14] px-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">🌲</div>
            <h1 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#777] dark:text-white/60 mb-6">
              This page ran into an unexpected error. Try heading back home.
            </p>
            <Button variant="primary" size="md" onClick={this.handleReload}>
              Back to home
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
