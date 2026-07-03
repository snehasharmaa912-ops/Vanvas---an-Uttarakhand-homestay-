import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleSubmit = e => {
    e.preventDefault()
    const result = login(email, password)
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f2] dark:bg-[#0a1f14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="bg-[#2d7a4f] px-8 py-6 text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h1 className="display-font text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-white/70 text-sm mt-1">VanaVas admin panel login</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#555] dark:text-white/70 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="admin@email.com"
                  required
                  className="w-full border border-[#e8dfc8] dark:border-[#2d7a4f]/30 focus:border-[#2d7a4f] outline-none rounded-xl px-4 py-3 text-sm bg-white dark:bg-[#0d2b1a] text-[#1c1c1c] dark:text-white placeholder-[#ccc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] dark:text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    required
                    className="w-full border border-[#e8dfc8] dark:border-[#2d7a4f]/30 focus:border-[#2d7a4f] outline-none rounded-xl px-4 py-3 pr-16 text-sm bg-white dark:bg-[#0d2b1a] text-[#1c1c1c] dark:text-white placeholder-[#ccc]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#aaa] hover:text-[#555]"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center mt-2">
                Sign in to Admin →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
