import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Toast } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register, requestAdminOtp, verifyAdminOtp } = useAuth()
  const navigate = useNavigate()
  const [tab,       setTab]       = useState('traveler') // 'traveler' | 'host' | 'admin'
  const [isSignup,  setIsSignup]  = useState(false)
  const [form,      setForm]      = useState({ name: '', email: '', password: '' })
  const [errors,    setErrors]    = useState({})
  const [show,      setShow]      = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast,     setToast]     = useState({ visible: false, message: '', type: 'success' })
  const [adminEmail, setAdminEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  const switchTab = t => {
    setTab(t)
    setErrors({})
    setOtpSent(false)
    setOtp('')
  }

  const validate = () => {
    const newErrors = {}
    if (isSignup && !form.name.trim()) newErrors.name = 'Please enter your full name'
    if (!form.email.includes('@')) newErrors.email = 'Please enter a valid email'
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    return newErrors
  }

  const routeByRole = user => {
    navigate(user.role === 'admin' ? '/admin' : '/')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    const result = isSignup
      ? await register({ name: form.name, email: form.email, password: form.password, userType: tab })
      : await login(form.email, form.password)
    setSubmitting(false)

    if (!result.success) {
      setToast({ visible: true, message: result.error, type: 'error' })
      return
    }

    setToast({ visible: true, message: isSignup ? 'Account created!' : 'Signed in!', type: 'success' })
    routeByRole(result.user)
  }

  const handleSendOtp = async e => {
    e.preventDefault()
    if (!adminEmail.includes('@')) {
      setErrors({ adminEmail: 'Please enter a valid email' })
      return
    }
    setSubmitting(true)
    const result = await requestAdminOtp(adminEmail)
    setSubmitting(false)

    if (!result.success) {
      setToast({ visible: true, message: result.error, type: 'error' })
      return
    }
    setOtpSent(true)
    setToast({ visible: true, message: 'If that email is authorized, a code was sent to it.', type: 'success' })
  }

  const handleVerifyOtp = async e => {
    e.preventDefault()
    if (otp.trim().length !== 6) {
      setErrors({ otp: 'Enter the 6-digit code' })
      return
    }
    setSubmitting(true)
    const result = await verifyAdminOtp(adminEmail, otp.trim())
    setSubmitting(false)

    if (!result.success) {
      setToast({ visible: true, message: result.error, type: 'error' })
      return
    }
    setToast({ visible: true, message: 'Welcome, admin!', type: 'success' })
    routeByRole(result.user)
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] dark:bg-[#0a1f14] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white dark:bg-[#1a4a31] rounded-2xl border border-[#e8dfc8] dark:border-[#2d7a4f]/30 shadow-sm overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-[#e8dfc8]">
            {[
              { key: 'traveler', label: 'Traveler Login', icon: '🧳' },
              { key: 'host',     label: 'Host Login',     icon: '🏡' },
              { key: 'admin',    label: 'Admin Panel',    icon: '🔑' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`flex-1 py-4 text-xs sm:text-sm font-semibold transition-colors
                  ${tab === key
                    ? 'text-[#2d7a4f] border-b-2 border-[#2d7a4f] -mb-px bg-[#f7fdf9]'
                    : 'text-[#999] hover:text-[#555]'}`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="p-8">

            {tab !== 'admin' ? (
              <>
                {/* Heading */}
                <h1 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-1">
                  {isSignup ? 'Create account' : 'Welcome back'}
                </h1>
                <p className="text-sm text-[#888] mb-7">
                  {isSignup
                    ? `Join as a ${tab} and get started`
                    : `Sign in to your ${tab} account`}
                </p>

                {/* Traveler / Host form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {isSignup && (
                    <Input
                      label="Full name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ramesh Rawat"
                      error={errors.name}
                    />
                  )}

                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    error={errors.email}
                  />

                  <div>
                    <Input
                      label="Password"
                      type={show ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(s => !s)}
                      className="text-xs text-[#aaa] hover:text-[#555] mt-1"
                    >
                      {show ? 'Hide password' : 'Show password'}
                    </button>
                  </div>

                  {tab === 'host' && isSignup && (
                    <div className="bg-[#faeeda] rounded-xl p-3 text-xs text-[#a96f2b] border border-[#a96f2b]/20">
                      🏡 As a host, you'll be able to list your Uttarakhand property and start receiving bookings. Your listing goes live after a quick verification call.
                    </div>
                  )}

                  <Button variant="primary" size="lg" type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Please wait...' : `${isSignup ? 'Create account' : 'Sign in'} →`}
                  </Button>
                </form>

                <p className="text-center text-xs text-[#888] mt-5">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setIsSignup(s => !s)}
                    className="text-[#2d7a4f] font-semibold hover:underline"
                  >
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </>
            ) : (
              <>
                {/* Admin heading */}
                <h1 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-1">
                  Admin access
                </h1>
                <p className="text-sm text-[#888] mb-7">
                  {otpSent
                    ? 'Enter the 6-digit code we emailed you'
                    : 'Sign in with a one-time code sent to your email'}
                </p>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <Input
                      label="Admin email address"
                      type="email"
                      name="adminEmail"
                      value={adminEmail}
                      onChange={e => { setAdminEmail(e.target.value); setErrors({}) }}
                      placeholder="you@example.com"
                      error={errors.adminEmail}
                    />
                    <Button variant="primary" size="lg" type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Sending...' : 'Send code →'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <Input
                      label="6-digit code"
                      name="otp"
                      value={otp}
                      onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }}
                      placeholder="123456"
                      error={errors.otp}
                    />
                    <Button variant="primary" size="lg" type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Verifying...' : 'Verify & sign in →'}
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp('') }}
                      className="text-xs text-[#888] hover:text-[#555] block mx-auto"
                    >
                      Use a different email
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
    </div>
  )
}
