import { useState } from 'react'
import { Link } from 'react-router-dom'
export default function Login() {
  const [tab,      setTab]      = useState('traveler') // 'traveler' | 'host'
  const [isSignup, setIsSignup] = useState(false)
  const [form,     setForm]     = useState({ name: '', email: '', password: '' })
  const [show,     setShow]     = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    alert(`${isSignup ? 'Sign up' : 'Sign in'} as ${tab} — backend coming in Week 4!`)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdf8f2] dark:bg-[#0a1f14] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white dark:bg-[#1a4a31] rounded-2xl border border-[#e8dfc8] dark:border-[#2d7a4f]/30 shadow-sm overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-[#e8dfc8]">
            {['traveler', 'host'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors
                  ${tab === t
                    ? 'text-[#2d7a4f] border-b-2 border-[#2d7a4f] -mb-px bg-[#f7fdf9]'
                    : 'text-[#999] hover:text-[#555]'}`}
              >
                {t === 'host' ? '🏡 Host login' : '🧳 Traveler login'}
              </button>
            ))}
          </div>

          <div className="p-8">

            {/* Heading */}
            <h1 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-1">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-[#888] mb-7">
              {isSignup
                ? `Join as a ${tab} and get started`
                : `Sign in to your ${tab} account`}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {isSignup && (
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ramesh Rawat"
                    required
                    className="w-full border border-[#e8dfc8] focus:border-[#2d7a4f] outline-none rounded-xl px-4 py-3 text-sm text-[#1c1c1c] placeholder-[#ccc] bg-[#fafaf8]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-[#e8dfc8] focus:border-[#2d7a4f] outline-none rounded-xl px-4 py-3 text-sm text-[#1c1c1c] placeholder-[#ccc] bg-[#fafaf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full border border-[#e8dfc8] dark:border-[#2d7a4f]/30 focus:border-[#2d7a4f] outline-none rounded-xl px-4 py-3 text-sm text-[#1c1c1c] dark:text-white placeholder-[#ccc] bg-[#fafaf8] dark:bg-[#0d2b1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] text-xs"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Host extra note */}
              {tab === 'host' && isSignup && (
                <div className="bg-[#faeeda] rounded-xl p-3 text-xs text-[#a96f2b] border border-[#a96f2b]/20">
                  🏡 As a host, you'll be able to list your Uttarakhand property and start receiving bookings. Your listing goes live after a quick verification call.
                </div>
              )}

              <button type="submit" className="btn-primary w-full justify-center mt-2">
                {isSignup ? 'Create account' : 'Sign in'} →
              </button>
            </form>

            {/* Toggle signup/login */}
            <p className="text-center text-xs text-[#888] mt-5">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignup(s => !s)}
                className="text-[#2d7a4f] font-semibold hover:underline"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center text-xs text-[#aaa] mt-4">
          <Link to="/" className="hover:text-[#555] transition-colors">← Back to VanaVas</Link>
        </p>
      </div>
    </div>
  )
}
