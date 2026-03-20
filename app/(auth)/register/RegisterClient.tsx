'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2,
  ArrowRight, Shield, CheckCircle2, AlertCircle,
  Loader2, Home, ChevronRight, X
} from 'lucide-react'

type AccountType = 'seeker' | 'agent' | 'landlord'

const accountTypes = [
  {
    value: 'seeker' as AccountType,
    emoji: '🔍',
    title: 'Property Seeker',
    desc: 'I want to find a property to rent, buy, or lease.',
    features: ['Search verified listings', 'Save favourites', 'Contact agents directly', 'Get price alerts'],
  },
  {
    value: 'agent' as AccountType,
    emoji: '🏢',
    title: 'Agent / Broker',
    desc: 'I am an RSSPC-certified estate agent listing properties.',
    features: ['List up to 3 properties free', 'RSSPC verification badge', 'Analytics dashboard', 'Lead management'],
  },
  {
    value: 'landlord' as AccountType,
    emoji: '🏠',
    title: 'Landlord / Owner',
    desc: 'I own properties and want to list them directly.',
    features: ['List your own properties', 'Direct tenant enquiries', 'Basic analytics', 'No agent commission'],
  },
]

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special character', pass: /[!@#$%^&*]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-500']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full ${i <= score ? colors[score] : 'bg-surface-border'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map((c, i) => (
            <span key={i} className={`flex items-center gap-1 text-[10px] ${c.pass ? 'text-emerald-600' : 'text-obsidian-400'}`}>
              {c.pass ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-obsidian-300" />}
              {c.label}
            </span>
          ))}
        </div>
        <span className={`text-[10px] font-bold ${score <= 1 ? 'text-rose-500' : score <= 2 ? 'text-amber-500' : 'text-emerald-600'}`}>{labels[score]}</span>
      </div>
    </div>
  )
}

export default function RegisterClient() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    agencyName: '', rsspcNumber: '',
    agreeTerms: false, agreeMarketing: false,
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (f: string, v: any) => setForm(p => ({ ...p, [f]: v }))

  const validateStep2 = () => {
    if (!form.firstName || !form.lastName) return 'Please enter your full name.'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.phone || form.phone.length < 10) return 'Please enter a valid phone number.'
    if (accountType === 'agent' && !form.agencyName) return 'Please enter your agency name.'
    return ''
  }

  const validateStep3 = () => {
    if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    if (!form.agreeTerms) return 'You must agree to the Terms of Service to continue.'
    return ''
  }

  const handleNext = () => {
    if (step === 1 && !accountType) { setError('Please select an account type.'); return }
    if (step === 2) {
      const err = validateStep2()
      if (err) { setError(err); return }
    }
    setError('')
    setStep(s => s + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateStep3()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:        form.firstName,
          lastName:         form.lastName,
          email:            form.email,
          phone:            form.phone || undefined,
          password:         form.password,
          accountType:      accountType?.toUpperCase(),
          agencyName:       form.agencyName || undefined,
          rsspcNumber:      form.rsspcNumber || undefined,
          marketingConsent: form.agreeMarketing,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed. Please try again.'); return }
      setSuccess(true)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Account Created!</h2>
          <p className="text-obsidian-500 text-sm mb-2">Welcome to Naya, <strong>{form.firstName}</strong>.</p>
          <p className="text-obsidian-400 text-sm mb-8">
            We've sent a verification email to <span className="text-gold-600">{form.email}</span>.
            Please verify your email to activate your account.
          </p>
          {accountType === 'agent' && (
            <div className="p-4 bg-gold-50 border border-gold-200 rounded-2xl mb-6 text-left">
              <div className="font-semibold text-obsidian-900 text-sm mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold-600" />Next: Complete RSSPC Verification
              </div>
              <p className="text-xs text-obsidian-500 leading-relaxed">Your agent account is pending RSSPC verification. Complete it to start listing and earn your verified badge.</p>
            </div>
          )}
          <div className="space-y-3">
            <Link href={accountType === 'agent' ? '/portal/dashboard' : '/search'} className="btn-primary w-full justify-center">
              {accountType === 'agent' ? 'Go to Dashboard' : 'Start Searching'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-secondary w-full justify-center">Sign In Instead</Link>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { n: 1, label: 'Account Type' },
    { n: 2, label: 'Personal Info' },
    { n: 3, label: 'Security' },
  ]

  return (
    <div className="min-h-screen bg-surface-bg flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-obsidian-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
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
          <h1 className="font-display text-4xl font-light text-white leading-tight mb-5">
            Join Nigeria's<br />
            <span className="gold-text">Most Trusted</span><br />
            Property Platform
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
            Whether you're looking for a home, listing a property, or growing your agency — Naya is where it starts.
          </p>

          {/* Step indicators on desktop */}
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 ${step === s.n ? 'opacity-100' : step > s.n ? 'opacity-60' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > s.n ? 'bg-emerald-500 text-white' : step === s.n ? 'bg-gold-500 text-obsidian-900' : 'bg-white/10 text-white/50'}`}>
                  {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-sm font-medium ${step === s.n ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/30 text-xs"><Shield className="w-3 h-3 text-gold-500" />Secure & Encrypted</div>
          <div className="flex items-center gap-1.5 text-white/30 text-xs"><CheckCircle2 className="w-3 h-3 text-gold-500" />NDPR Compliant</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg py-6">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-obsidian-900" />
            </div>
            <span className="font-display text-2xl font-light text-obsidian-900">NAYA</span>
          </div>

          {/* Mobile progress */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > s.n ? 'bg-emerald-500 text-white' : step === s.n ? 'bg-gold-500 text-obsidian-900' : 'bg-surface-subtle text-obsidian-400 border border-surface-border'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 w-8 ${step > s.n ? 'bg-emerald-500' : 'bg-surface-border'}`} />}
              </div>
            ))}
            <span className="text-xs text-obsidian-500 ml-2">{steps[step - 1]?.label}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-2">
              {step === 1 ? 'Create your account' : step === 2 ? 'Personal details' : 'Set your password'}
            </h2>
            <p className="text-obsidian-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-600 hover:text-gold-500 font-medium transition-colors">Sign in</Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
            </div>
          )}

          {/* ── STEP 1: Account Type ──────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              {accountTypes.map(t => (
                <button key={t.value} onClick={() => { setAccountType(t.value); setError('') }}
                  className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${accountType === t.value ? 'border-gold-500 bg-gold-50' : 'border-surface-border bg-white hover:border-gold-300'}`}>
                  <div className="text-3xl flex-shrink-0 mt-0.5">{t.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-lg font-medium text-obsidian-900">{t.title}</span>
                      {accountType === t.value && <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-obsidian-500 mb-3">{t.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {t.features.map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-obsidian-900/5 text-obsidian-600 border border-obsidian-900/10">{f}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
              <button onClick={handleNext} className="btn-primary w-full justify-center mt-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Personal Info ─────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type="text" className="input-field pl-10 text-sm" placeholder="Ekene"
                      value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Last Name *</label>
                  <input type="text" className="input-field text-sm" placeholder="Akpapunam"
                    value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="input-label">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                  <input type="email" className="input-field pl-10 text-sm" placeholder="your@email.com"
                    value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" required />
                </div>
              </div>

              <div>
                <label className="input-label">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                  <input type="tel" className="input-field pl-10 text-sm" placeholder="+234 xxx xxxx xxx"
                    value={form.phone} onChange={e => update('phone', e.target.value)} autoComplete="tel" required />
                </div>
              </div>

              {accountType === 'agent' && (
                <>
                  <div>
                    <label className="input-label">Agency Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                      <input type="text" className="input-field pl-10 text-sm" placeholder="e.g. Okeke Premium Properties"
                        value={form.agencyName} onChange={e => update('agencyName', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">RSSPC Licence Number <span className="text-obsidian-400">(optional — verify later)</span></label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                      <input type="text" className="input-field pl-10 text-sm font-mono" placeholder="RS-2024-XXXX"
                        value={form.rsspcNumber} onChange={e => update('rsspcNumber', e.target.value)} />
                    </div>
                    <p className="text-xs text-obsidian-400 mt-1.5">You can complete RSSPC verification later from your dashboard.</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setStep(1); setError('') }} className="btn-secondary px-5">← Back</button>
                <button type="button" onClick={handleNext} className="btn-primary flex-1 justify-center">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Password ──────────────────────────────────────── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="input-label">Create Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                  <input type={showPass ? 'text' : 'password'}
                    className="input-field pl-10 pr-10 text-sm"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    autoComplete="new-password" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              <div>
                <label className="input-label">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                  <input type={showConfirm ? 'text' : 'password'}
                    className="input-field pl-10 pr-10 text-sm"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    autoComplete="new-password" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                    <X className="w-3 h-3" />Passwords do not match
                  </p>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />Passwords match
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <button type="button" onClick={() => update('agreeTerms', !form.agreeTerms)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form.agreeTerms ? 'bg-gold-500 border-gold-500' : 'border-obsidian-300 hover:border-gold-400'}`}>
                    {form.agreeTerms && <CheckCircle2 className="w-3 h-3 text-obsidian-900" />}
                  </button>
                  <span className="text-sm text-obsidian-600 leading-relaxed">
                    I agree to Naya's{' '}
                    <Link href="/terms-of-service" target="_blank" className="text-gold-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy-policy" target="_blank" className="text-gold-600 hover:underline">Privacy Policy</Link>
                    . I understand my data is protected under the Nigeria Data Protection Act 2023. *
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <button type="button" onClick={() => update('agreeMarketing', !form.agreeMarketing)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form.agreeMarketing ? 'bg-gold-500 border-gold-500' : 'border-obsidian-300 hover:border-gold-400'}`}>
                    {form.agreeMarketing && <CheckCircle2 className="w-3 h-3 text-obsidian-900" />}
                  </button>
                  <span className="text-sm text-obsidian-500 leading-relaxed">
                    I'd like to receive property alerts, market reports, and updates from Naya. <span className="text-obsidian-400">(Optional)</span>
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setStep(2); setError('') }} className="btn-secondary px-5">← Back</button>
                <button type="submit" disabled={loading || !form.agreeTerms}
                  className="btn-primary flex-1 justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
                    : <>Create Account <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <p className="text-center text-[10px] text-obsidian-300 mt-6 leading-relaxed">
            Your account is protected by AES-256 encryption. We never share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}
