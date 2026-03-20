'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Home, Lock, Eye, EyeOff, X } from 'lucide-react'

export default function ForgotClient() {
  const [step, setStep] = useState<'email' | 'sent' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false); setStep('sent')
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false); setStep('done')
  }

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-obsidian-900" />
            </div>
            <span className="font-display text-2xl font-light text-obsidian-900">NAYA</span>
          </Link>
        </div>

        <div className="card p-8">

          {/* EMAIL STEP */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gold-600" />
                </div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Forgot your password?</h2>
                <p className="text-obsidian-500 text-sm leading-relaxed">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <p className="text-sm text-rose-700 flex-1">{error}</p>
                  <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type="email" className="input-field pl-10 text-sm" placeholder="your@email.com"
                      value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-center text-sm text-obsidian-400 mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-gold-600 hover:text-gold-500 font-medium">Sign in</Link>
              </p>
            </>
          )}

          {/* SENT STEP */}
          {step === 'sent' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-3">Check your inbox</h2>
              <p className="text-obsidian-500 text-sm mb-2">We've sent a password reset link to:</p>
              <p className="font-semibold text-gold-600 mb-6">{email}</p>
              <p className="text-obsidian-400 text-xs mb-8 leading-relaxed">
                The link expires in 30 minutes. Check your spam folder if you don't see it.
              </p>
              <div className="space-y-3">
                <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000) }}
                  disabled={loading}
                  className="btn-secondary w-full justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Resending...</> : 'Resend email'}
                </button>
                <Link href="/login" className="btn-primary w-full justify-center">Back to Sign In</Link>
              </div>
              {/* Demo: show reset form */}
              <button onClick={() => setStep('reset')} className="text-xs text-obsidian-400 underline mt-4 block mx-auto">
                Demo: Enter new password →
              </button>
            </div>
          )}

          {/* RESET STEP */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-gold-600" />
                </div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Set new password</h2>
                <p className="text-obsidian-500 text-sm">Choose a strong password for your Naya account.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="input-label">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type={showPass ? 'text' : 'password'} className="input-field pl-10 pr-10 text-sm"
                      placeholder="Min. 8 characters" value={password}
                      onChange={e => setPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type="password" className="input-field pl-10 text-sm"
                      placeholder="Re-enter password" value={confirm}
                      onChange={e => setConfirm(e.target.value)} required />
                  </div>
                  {confirm && password !== confirm && <p className="text-xs text-rose-500 mt-1.5">Passwords do not match</p>}
                  {confirm && password === confirm && <p className="text-xs text-emerald-600 mt-1.5">✓ Passwords match</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 disabled:opacity-70 mt-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : <>Update Password <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* DONE STEP */}
          {step === 'done' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-3">Password updated!</h2>
              <p className="text-obsidian-500 text-sm mb-8">Your password has been changed successfully. Sign in with your new password.</p>
              <Link href="/login" className="btn-primary w-full justify-center">Sign In Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
