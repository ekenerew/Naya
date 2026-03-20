'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Shield,
  CheckCircle2, AlertCircle, Loader2, Home,
  Phone, X, ChevronLeft, Sparkles
} from 'lucide-react'

type AuthMode = 'email' | 'phone'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const [mode, setMode]         = useState<AuthMode>('email')
  const [phoneStep, setPhoneStep] = useState<'number' | 'otp'>('number')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)

  const [phone, setPhone]   = useState('')
  const [otp, setOtp]       = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(
    urlError === 'google_cancelled'       ? '' :
    urlError === 'google_not_configured'  ? 'Google sign-in is not configured yet.' :
    urlError === 'google_failed'          ? 'Google sign-in failed. Please try again.' :
    urlError === 'account_disabled'       ? 'Your account has been disabled. Contact support.' : ''
  )

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid email or password.'); return }
      const type = data.data?.user?.accountType
      router.push(type === 'AGENT' || type === 'LANDLORD' ? '/portal/dashboard' : '/search')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setLoading(true)
    window.location.href = '/api/auth/google'
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.replace(/\D/g,'').length < 10) {
      setError('Please enter a valid phone number.'); return
    }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to send OTP.'); return }
      setPhoneStep('otp')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) { setError('Please enter the 6-digit code.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid code. Please try again.'); return }
      router.push('/search')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-bg flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-obsidian-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/10 blur-[100px]" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-obsidian-900" />
            </div>
            <span className="font-display text-2xl font-light text-white">NAYA</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-light text-white leading-tight mb-6">
            Nigeria's Most<br />
            <span className="gold-text">Trusted Property</span><br />
            Marketplace
          </h1>
          <p className="text-white/40 text-base leading-relaxed mb-10 max-w-sm">
            Sign in to manage listings, track enquiries, and access the full power of Naya's property tools.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm">
            {[{ v: '2,847', l: 'Active Listings' }, { v: '7,200+', l: 'Monthly Enquiries' }, { v: '156+', l: 'Verified Agents' }].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="font-display text-2xl font-light text-gold-400">{s.v}</div>
                <div className="text-[10px] text-white/40 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-6">
          {[{ icon: Shield, l: 'RSSPC Verified' }, { icon: CheckCircle2, l: 'Encrypted' }, { icon: Lock, l: 'NDPR Compliant' }].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 text-white/30 text-xs">
              <b.icon className="w-3.5 h-3.5 text-gold-500" />{b.l}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-obsidian-900" />
              </div>
              <span className="font-display text-2xl font-light text-obsidian-900">NAYA</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-2">Welcome back</h2>
            <p className="text-obsidian-400 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-gold-600 hover:text-gold-500 font-medium">Create one free</Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
            </div>
          )}

          {/* EMAIL MODE */}
          {mode === 'email' && (
            <>
              <button onClick={handleGoogleSignIn} disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-surface-border rounded-2xl text-sm font-medium text-obsidian-700 hover:border-gold-300 hover:bg-surface-subtle transition-all mb-3 disabled:opacity-60">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? 'Redirecting...' : 'Continue with Google'}
              </button>

              <button onClick={() => { setMode('phone'); setError('') }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-surface-border rounded-2xl text-sm font-medium text-obsidian-700 hover:border-gold-300 hover:bg-surface-subtle transition-all mb-6">
                <Phone className="w-5 h-5 text-emerald-500" />
                Continue with Phone Number
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-surface-border" />
                <span className="text-xs text-obsidian-400">or sign in with email</span>
                <div className="flex-1 h-px bg-surface-border" />
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type="email" className="input-field pl-10 text-sm" placeholder="your@email.com"
                      value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="input-label mb-0">Password</label>
                    <Link href="/forgot-password" className="text-xs text-gold-600 hover:text-gold-500">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type={showPass ? 'text' : 'password'} className="input-field pl-10 pr-10 text-sm"
                      placeholder="Enter your password" value={password}
                      onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <button type="button" onClick={() => setRemember(!remember)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${remember ? 'bg-gold-500 border-gold-500' : 'border-obsidian-300'}`}>
                    {remember && <CheckCircle2 className="w-3 h-3 text-obsidian-900" />}
                  </button>
                  <span className="text-sm text-obsidian-600">Remember me for 30 days</span>
                </label>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* PHONE MODE */}
          {mode === 'phone' && (
            <div>
              <button onClick={() => { setMode('email'); setPhoneStep('number'); setOtp(''); setPhone(''); setError('') }}
                className="flex items-center gap-2 text-obsidian-400 hover:text-obsidian-700 text-sm mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" />Back to sign in options
              </button>

              {phoneStep === 'number' && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Phone Sign In</h3>
                    <p className="text-obsidian-400 text-sm">We'll send a 6-digit code to your number.</p>
                  </div>
                  <div>
                    <label className="input-label">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <span className="text-sm">🇳🇬</span>
                        <span className="text-sm text-obsidian-400 font-medium">+234</span>
                        <div className="w-px h-4 bg-surface-border" />
                      </div>
                      <input type="tel" className="input-field pl-24 text-sm font-mono"
                        placeholder="080 1234 5678"
                        value={phone} onChange={e => setPhone(e.target.value)} required />
                    </div>
                    <p className="text-xs text-obsidian-400 mt-1.5">Nigerian mobile number only. Code sent via SMS.</p>
                  </div>
                  <button type="submit" disabled={loading || phone.replace(/\D/g,'').length < 10}
                    className="btn-primary w-full justify-center gap-2 disabled:opacity-70">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <>Send OTP Code <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}

              {phoneStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-gold-600" />
                    </div>
                    <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Enter Your Code</h3>
                    <p className="text-obsidian-400 text-sm">
                      Sent to <span className="font-semibold text-obsidian-700">{phone}</span>
                    </p>
                  </div>
                  <div>
                    <label className="input-label">6-Digit Code</label>
                    <input type="text" inputMode="numeric" maxLength={6}
                      className="input-field text-center text-2xl font-mono tracking-[0.5em] font-bold"
                      placeholder="000000"
                      value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                      autoFocus required />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-obsidian-400">Expires in 5 minutes</p>
                      <button type="button" onClick={() => { setPhoneStep('number'); setOtp(''); setError('') }}
                        className="text-xs text-gold-600 hover:text-gold-500 font-medium">
                        Resend code
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="btn-primary w-full justify-center gap-2 disabled:opacity-70">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <button type="button" onClick={() => { setPhoneStep('number'); setOtp(''); setError('') }}
                    className="w-full text-center text-sm text-obsidian-400 hover:text-obsidian-600">
                    ← Wrong number? Change it
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-sm text-obsidian-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-gold-600 hover:text-gold-500 font-medium">Create account</Link>
          </p>
          <div className="mt-6 pt-5 border-t border-surface-border text-center">
            <p className="text-[10px] text-obsidian-300 leading-relaxed">
              By signing in you agree to Naya's{' '}
              <Link href="/terms-of-service" className="text-gold-600 hover:underline">Terms</Link> and{' '}
              <Link href="/privacy-policy" className="text-gold-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
