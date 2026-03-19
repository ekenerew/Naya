'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Shield,
  CheckCircle2, AlertCircle, Loader2, Home, Phone
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (f: string, v: any) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Sign in failed. Please try again.'); return }
      // Redirect based on account type
      const type = data.data?.user?.accountType
      if (type === 'AGENT' || type === 'LANDLORD') {
        router.push('/portal/dashboard')
      } else {
        router.push('/search')
      }
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
            <span className="font-display text-2xl font-light text-white tracking-wide">NAYA</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-light text-white leading-tight mb-6">
            Nigeria's Most<br />
            <span className="gold-text">Trusted Property</span><br />
            Marketplace
          </h1>
          <p className="text-white/40 text-base leading-relaxed mb-10 max-w-sm">
            Sign in to manage your listings, track enquiries, and access the full power of Naya's property tools.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm">
            {[
              { value: '2,847', label: 'Active Listings' },
              { value: '7,200+', label: 'Monthly Enquiries' },
              { value: '156+', label: 'Verified Agents' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="font-display text-2xl font-light text-gold-400">{s.value}</div>
                <div className="text-[10px] text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-6">
          {[
            { icon: Shield, label: 'RSSPC Verified' },
            { icon: CheckCircle2, label: 'Secure & Encrypted' },
            { icon: Lock, label: 'NDPR Compliant' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 text-white/30 text-xs">
              <b.icon className="w-3.5 h-3.5 text-gold-500" />{b.label}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
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

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2.5 px-4 py-3 border border-surface-border rounded-xl text-sm font-medium text-obsidian-700 hover:border-gold-300 hover:bg-surface-subtle transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2.5 px-4 py-3 border border-surface-border rounded-xl text-sm font-medium text-obsidian-700 hover:border-gold-300 hover:bg-surface-subtle transition-all">
              <Phone className="w-4 h-4 text-emerald-500" />Phone OTP
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-xs text-obsidian-400">or sign in with email</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                <input type="email" className="input-field pl-10 text-sm" placeholder="your@email.com"
                  value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" required />
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
                  placeholder="Enter your password" value={form.password}
                  onChange={e => update('password', e.target.value)} autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button type="button" onClick={() => update('remember', !form.remember)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${form.remember ? 'bg-gold-500 border-gold-500' : 'border-obsidian-300 hover:border-gold-400'}`}>
                {form.remember && <CheckCircle2 className="w-3 h-3 text-obsidian-900" />}
              </button>
              <span className="text-sm text-obsidian-600 cursor-pointer select-none" onClick={() => update('remember', !form.remember)}>
                Remember me for 30 days
              </span>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-obsidian-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-gold-600 hover:text-gold-500 font-medium">Create account</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-surface-border text-center">
            <p className="text-[10px] text-obsidian-300 leading-relaxed">
              By signing in you agree to Naya's{' '}
              <Link href="/terms-of-service" className="text-gold-600 hover:underline">Terms</Link>{' '}and{' '}
              <Link href="/privacy-policy" className="text-gold-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
