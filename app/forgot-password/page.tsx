'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Home, Lock, Eye, EyeOff, X } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [step, setStep]       = useState<'email'|'sent'|'done'>('email')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setError(''); setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStep('sent')
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center"><Home className="w-5 h-5 text-obsidian-900"/></div>
            <span className="font-display text-2xl font-light text-obsidian-900">NAYA</span>
          </Link>
        </div>
        <div className="card p-8">
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8 text-gold-600"/></div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Forgot your password?</h2>
                <p className="text-obsidian-500 text-sm">Enter your email and we'll send a reset link.</p>
              </div>
              {error && <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4"><AlertCircle className="w-4 h-4 text-rose-500"/><p className="text-sm text-rose-700 flex-1">{error}</p><button onClick={()=>setError('')}><X className="w-4 h-4 text-rose-400"/></button></div>}
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                    <input type="email" className="input-field pl-10 text-sm" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 disabled:opacity-70">
                  {loading?<><Loader2 className="w-4 h-4 animate-spin"/>Sending...</>:<>Send Reset Link <ArrowRight className="w-4 h-4"/></>}
                </button>
              </form>
              <p className="text-center text-sm text-obsidian-400 mt-4">Remember it? <Link href="/login" className="text-gold-600 font-medium">Sign in</Link></p>
            </>
          )}
          {step === 'sent' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="w-8 h-8 text-emerald-500"/></div>
              <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-3">Check your inbox</h2>
              <p className="text-obsidian-500 text-sm mb-2">Reset link sent to:</p>
              <p className="font-semibold text-gold-600 mb-6">{email}</p>
              <p className="text-obsidian-400 text-xs mb-8">Link expires in 30 minutes. Check your spam folder if you don't see it.</p>
              <Link href="/login" className="btn-primary w-full justify-center">Back to Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
