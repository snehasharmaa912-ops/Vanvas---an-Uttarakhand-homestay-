import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 bg-[#fdf8f2] dark:bg-[#0a1f14]">
      <div className="text-6xl mb-4">🏔️</div>
      <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white mb-2">
        Lost on the trail
      </h1>
      <p className="text-[#777] dark:text-white/60 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist, or may have moved. Let's get you back home.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Back to Home →
        </Button>
      </Link>
    </div>
  )
}
