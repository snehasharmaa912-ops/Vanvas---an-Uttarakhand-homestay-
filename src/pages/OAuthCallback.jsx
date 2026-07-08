import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from '../components/ui'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const oauthError = searchParams.get('error')

    if (oauthError) {
      setError('Google sign-in was cancelled or failed. Please try again.')
      return
    }
    if (!token) {
      setError('Missing sign-in token. Please try again.')
      return
    }

    loginWithToken(token).then(result => {
      if (!result.success) {
        setError(result.error || 'Sign-in failed. Please try again.')
        return
      }
      navigate(result.user.role === 'admin' ? '/admin' : '/', { replace: true })
    })
  }, [])

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-[#c0392b] font-medium">{error}</p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="text-sm text-[#2d7a4f] font-semibold hover:underline"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader />
      <p className="text-sm text-[#888]">Finishing sign-in…</p>
    </div>
  )
}
