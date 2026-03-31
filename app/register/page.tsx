'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Home, Building2, User, ArrowRight, ArrowLeft,
  Eye, EyeOff, CheckCircle2, Loader2, AlertCircle,
  Shield, Star, Sparkles, Phone, Mail, Lock,
  ChevronRight, X
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
type AccountType = 'SEEKER' | 'AGENT' | 'LANDLORD'
type Step = 1 | 2 | 3

type FormData = {
  accountType:      AccountType
  firstName:        string
  lastName:         string
  email:            string
  phone:            string
  password:         string
  confirmPassword:  string
  agencyName:       string
  rsspcNumber:      string
  specializations:  string[]
  neighborhoods:    string[]
  marketingConsent: boolean
  terms:            boolean
}

const INIT: FormData = {
  accountType: 'SEEKER', firstName: '', lastName: '',
  email: '', phone: '', password: '', confirmPassword: '',
  agencyName: '', rsspcNumber: '', specializations: [],
  neighborhoods: [], marketingConsent: false, terms: false,
}

// ── Constants ─────────────────────────────────────────────────
const ACCOUNT_TYPES = [
  {
    type: 'SEEKER' as AccountType,
    icon: Home,
    emoji: '🏠',
    title: 'Property Seeker',
    subtitle: 'I want to rent, buy or find a shortlet',
    perks: ['Browse all listings free', 'Save favourites', 'Contact agents directly', 'Set price alerts'],
    color: 'border-blue-300 bg-blue-50',
    activeColor: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500',
    iconColor: 'text-blue-600',
  },
  {
    type: 'AGENT' as AccountType,
    icon: Building2,
    emoji: '🏢',
    title: 'Agent / Realtor',
    subtitle: 'I list and sell properties professionally',
    perks: ['List unlimited properties', 'Agent dashboard & analytics', 'RSSPC verification badge', 'Featured on Agent League'],
    color: 'border-gold-300 bg-gold-50',
    activeColor: 'border-gold-500 bg-gold-50 ring-2 ring-gold-500',
    iconColor: 'text-gold-600',
  },
  {
    type: 'LANDLORD' as AccountType,
    icon: User,
    emoji: '🏡',
    title: 'Landlord / Owner',
    subtitle: 'I own property and want to rent or sell it',
    perks: ['List your own properties', 'Receive tenant enquiries', 'Manage your portfolio', 'Use Naya Managed service'],
    color: 'border-emerald-300 bg-emerald-50',
    activeColor: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500',
    iconColor: 'text-emerald-600',
  },
]

const PH_AREAS = [
  'GRA Phase 2','Old GRA','GRA Phase 1','Woji','Trans Amadi',
  'Rumuola','Eleme','D-Line','Stadium Road','Peter Odili Road',
  'Rumuokoro','Choba','Bonny Island','Oyigbo','Diobu',
]

const SPECIALIZATIONS = [
  'Residential','Commercial','Shortlets','Land',
  'New Developments','Luxury','Industrial',
]

// ── Password strength ─────────────────────────────────────────
function getPasswordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
const strengthColors = ['', 'bg-rose-500', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500']

// ── Step indicator ────────────────────────────────────────────
function StepIndicator({ step, accountType }: { step: Step; accountType: AccountType }) {
  const steps = accountType === 'SEEKER'
    ? [{ n:1, label:'Account Type' }, { n:2, label:'Your Details' }]
    : [{ n:1, label:'Account Type' }, { n:2, label:'Your Details' }, { n:3, label:'Agent Profile' }]

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            step === s.n ? 'bg-obsidian-900 text-white' :
            step > s.n  ? 'bg-emerald-500 text-white' :
            'bg-surface-subtle text-obsidian-400'
          }`}>
            {step > s.n
              ? <CheckCircle2 className="w-3.5 h-3.5" />
              : <span className="w-4 h-4 flex items-center justify-center">{s.n}</span>
            }
            <span className="hidden md:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 ${step > s.n ? 'bg-emerald-400' : 'bg-surface-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function RegisterPage() {
  const router  = useRouter()
  const [step, setStep]         = useState<Step>(1)
  const [form, setForm]         = useState<FormData>(INIT)
  const [showPw, setShowPw]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({})

  const set = (k: keyof FormData, v: any) => {
    setForm(p => ({ ...p, [k]: v }))
    setFieldErrors(p => { const n = {...p}; delete n[k as string]; return n })
    setError('')
  }

  const toggleArr = (k: 'specializations'|'neighborhoods', val: string) => {
    setForm(p => ({
      ...p,
      [k]: p[k].includes(val) ? p[k].filter(x => x !== val) : [...p[k], val]
    }))
  }

  const pwStrength = getPasswordStrength(form.password)
  const isAgent    = form.accountType === 'AGENT' || form.accountType === 'LANDLORD'

  // ── Validation ─────────────────────────────────────────────
  const validateStep2 = (): boolean => {
    const errs: Record<string,string> = {}
    if (!form.firstName.trim())      errs.firstName = 'First name is required'
    if (!form.lastName.trim())       errs.lastName  = 'Last name is required'
    if (!form.email.trim())          errs.email     = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)              errs.password  = 'Password is required'
    if (form.password.length < 8)   errs.password  = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.terms)                 errs.terms     = 'You must agree to the Terms of Service'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep2()) return
    setLoading(true); setError('')

    try {
      const payload = {
        firstName:        form.firstName.trim(),
        lastName:         form.lastName.trim(),
        email:            form.email.toLowerCase().trim(),
        phone:            form.phone.trim() || undefined,
        password:         form.password,
        accountType:      form.accountType,
        agencyName:       form.agencyName.trim() || undefined,
        rsspcNumber:      form.rsspcNumber.trim() || undefined,
        marketingConsent: form.marketingConsent,
      }

      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          const fe: Record<string,string> = {}
          for (const [k, msgs] of Object.entries(data.errors as Record<string,string[]>)) {
            fe[k] = msgs[0]
          }
          setFieldErrors(fe)
        } else {
          setError(data.error || 'Registration failed. Please try again.')
        }
        return
      }

      // Success — redirect based on account type
      if (isAgent) {
        router.push('/portal/profile?welcome=1')
      } else {
        router.push('/search?welcome=1')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = () => {
    if (step === 1) { setStep(2); return }
    if (step === 2) {
      if (!validateStep2()) return
      if (isAgent) { setStep(3); return }
      handleSubmit()
    }
    if (step === 3) { handleSubmit() }
  }

  const handleBack = () => {
    if (step > 1) setStep(p => (p - 1) as Step)
  }

  return (
    <div className="min-h-screen bg-surface-bg flex">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-obsidian-900 relative overflow-hidden p-10">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/8 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <Link href="/">
            <Image src="/naya-logo.png" alt="Naya" width={140} height={56} className="h-12 w-auto object-contain" />
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-light text-white mb-4 leading-tight">
            Port Harcourt's<br />Most Trusted<br /><span className="gold-text">Property Platform</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Join thousands of property seekers, agents and landlords already using Naya to buy, rent and sell property across Rivers State.
          </p>
          <div className="space-y-3">
            {[
              { icon:'🔐', label:'RSSPC-verified agents only' },
              { icon:'🤝', label:'Secure escrow payments' },
              { icon:'🗺', label:'Neighbourhood intelligence' },
              { icon:'⭐', label:'Tenant credit scoring (coming Q3)' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                <span className="text-lg">{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/20 text-xs">
          © 2026 Naya Real Estate Technologies Ltd
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border lg:hidden bg-white sticky top-0 z-10">
          <Link href="/">
            <Image src="/naya-logo.png" alt="Naya" width={100} height={40} className="h-8 w-auto object-contain" />
          </Link>
          <Link href="/login" className="text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
            Sign In
          </Link>
        </div>

        <div className="flex-1 flex items-start justify-center px-5 py-8 md:py-12">
          <div className="w-full max-w-lg">

            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="font-display text-3xl font-medium text-obsidian-900 mb-1">Create your account</h1>
              <p className="text-obsidian-400 text-sm">
                Already have one?{' '}
                <Link href="/login" className="text-gold-600 hover:text-gold-500 font-semibold">Sign in</Link>
              </p>
            </div>

            {/* Step indicator */}
            <StepIndicator step={step} accountType={form.accountType} />

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-5">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700 flex-1">{error}</p>
                <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
              </div>
            )}

            {/* ── STEP 1: Account Type ── */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-obsidian-700 text-center mb-5">
                  How will you use Naya?
                </p>
                {ACCOUNT_TYPES.map(at => (
                  <button key={at.type} type="button"
                    onClick={() => set('accountType', at.type)}
                    className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                      form.accountType === at.type ? at.activeColor : `${at.color} hover:border-opacity-60`
                    }`}>
                    <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-2xl`}>
                      {at.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-semibold text-obsidian-900">{at.title}</p>
                        {form.accountType === at.type && (
                          <div className="w-5 h-5 rounded-full bg-obsidian-900 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-obsidian-500 mb-2">{at.subtitle}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {at.perks.map((p, i) => (
                          <span key={i} className="text-[10px] text-obsidian-500 bg-white/80 px-2 py-0.5 rounded-full border border-white">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ── STEP 2: Personal Details ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">First Name *</label>
                    <input
                      className={`input-field text-sm ${fieldErrors.firstName ? 'border-rose-400 bg-rose-50' : ''}`}
                      placeholder="Emeka"
                      value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      autoComplete="given-name"
                    />
                    {fieldErrors.firstName && <p className="text-xs text-rose-600 mt-1">{fieldErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="input-label">Last Name *</label>
                    <input
                      className={`input-field text-sm ${fieldErrors.lastName ? 'border-rose-400 bg-rose-50' : ''}`}
                      placeholder="Okafor"
                      value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      autoComplete="family-name"
                    />
                    {fieldErrors.lastName && <p className="text-xs text-rose-600 mt-1">{fieldErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="input-label">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type="email"
                      className={`input-field pl-9 text-sm ${fieldErrors.email ? 'border-rose-400 bg-rose-50' : ''}`}
                      placeholder="emeka@example.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  {fieldErrors.email && <p className="text-xs text-rose-600 mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="input-label">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🇳🇬</span>
                    <input type="tel"
                      className="input-field pl-9 text-sm"
                      placeholder="08012345678"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  <p className="text-xs text-obsidian-400 mt-1">Used for property alerts and account recovery</p>
                </div>

                <div>
                  <label className="input-label">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type={showPw ? 'text' : 'password'}
                      className={`input-field pl-9 pr-10 text-sm ${fieldErrors.password ? 'border-rose-400 bg-rose-50' : ''}`}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-obsidian-700">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? strengthColors[pwStrength] : 'bg-surface-border'}`} />
                        ))}
                      </div>
                      <p className={`text-xs ${pwStrength >= 4 ? 'text-emerald-600' : pwStrength >= 3 ? 'text-amber-600' : 'text-rose-500'}`}>
                        {strengthLabels[pwStrength]}
                      </p>
                    </div>
                  )}
                  {fieldErrors.password && <p className="text-xs text-rose-600 mt-1">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label className="input-label">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input type={showConfirm ? 'text' : 'password'}
                      className={`input-field pl-9 pr-10 text-sm ${fieldErrors.confirmPassword ? 'border-rose-400 bg-rose-50' : ''}`}
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={e => set('confirmPassword', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-obsidian-700">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{fieldErrors.confirmPassword}</p>}
                </div>

                {/* Consent checkboxes */}
                <div className="space-y-3 pt-1">
                  <label className={`flex items-start gap-3 cursor-pointer ${fieldErrors.terms ? 'text-rose-600' : ''}`}>
                    <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-obsidian-900 flex-shrink-0" />
                    <span className="text-xs text-obsidian-600">
                      I agree to Naya's{' '}
                      <Link href="/terms" target="_blank" className="text-gold-600 hover:underline font-semibold">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" target="_blank" className="text-gold-600 hover:underline font-semibold">Privacy Policy</Link> *
                    </span>
                  </label>
                  {fieldErrors.terms && <p className="text-xs text-rose-600">{fieldErrors.terms}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.marketingConsent}
                      onChange={e => set('marketingConsent', e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-obsidian-900 flex-shrink-0" />
                    <span className="text-xs text-obsidian-500">
                      Email me property alerts, market updates and Naya news
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ── STEP 3: Agent Profile ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 bg-gold-50 border border-gold-200 rounded-2xl flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-obsidian-700 leading-relaxed">
                    This information helps build your agent profile. You can always update it later from your dashboard.
                  </p>
                </div>

                <div>
                  <label className="input-label">Agency / Company Name</label>
                  <input className="input-field text-sm"
                    placeholder="e.g. Premier Properties Port Harcourt"
                    value={form.agencyName}
                    onChange={e => set('agencyName', e.target.value)} />
                </div>

                {form.accountType === 'AGENT' && (
                  <div>
                    <label className="input-label">RSSPC Licence Number</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                      <input className="input-field pl-9 text-sm font-mono"
                        placeholder="RSSPC/2024/XXXX"
                        value={form.rsspcNumber}
                        onChange={e => set('rsspcNumber', e.target.value)} />
                    </div>
                    <p className="text-xs text-obsidian-400 mt-1">
                      Your Rivers State Society of Property and Construction licence number. Required for verification badge.
                    </p>
                  </div>
                )}

                <div>
                  <label className="input-label">Areas You Cover</label>
                  <p className="text-xs text-obsidian-400 mb-2">Select all neighbourhoods where you operate</p>
                  <div className="flex flex-wrap gap-2">
                    {PH_AREAS.map(area => (
                      <button key={area} type="button"
                        onClick={() => toggleArr('neighborhoods', area)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          form.neighborhoods.includes(area)
                            ? 'border-obsidian-900 bg-obsidian-900 text-white'
                            : 'border-surface-border text-obsidian-600 hover:border-obsidian-400'
                        }`}>
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALIZATIONS.map(spec => (
                      <button key={spec} type="button"
                        onClick={() => toggleArr('specializations', spec)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          form.specializations.includes(spec)
                            ? 'border-gold-500 bg-gold-50 text-gold-700'
                            : 'border-surface-border text-obsidian-600 hover:border-gold-300'
                        }`}>
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center gap-3 mt-8">
              {step > 1 && (
                <button type="button" onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-surface-border text-obsidian-700 text-sm font-semibold hover:border-obsidian-400 transition-all">
                  <ArrowLeft className="w-4 h-4" />Back
                </button>
              )}
              <button type="button" onClick={handleNextStep} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-full font-semibold text-sm transition-all disabled:opacity-60">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
                ) : step === 1 ? (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                ) : step === 2 && isAgent ? (
                  <>Continue to Agent Profile <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Create Account <CheckCircle2 className="w-4 h-4" /></>
                )}
              </button>
            </div>

            {/* Google OAuth option */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-bg px-3 text-xs text-obsidian-400">or</span>
              </div>
            </div>
            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full py-3.5 border-2 border-surface-border rounded-full text-sm font-semibold text-obsidian-700 hover:border-obsidian-400 hover:bg-surface-subtle transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>

            <p className="text-center text-xs text-obsidian-300 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-600 hover:underline font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
