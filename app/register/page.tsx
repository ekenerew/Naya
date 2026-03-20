'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight, Shield, CheckCircle2, AlertCircle, Loader2, Home, X } from 'lucide-react'

type AccountType = 'SEEKER' | 'AGENT' | 'LANDLORD'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirmPassword:'', agencyName:'', rsspcNumber:'', agreeTerms:false, agreeMarketing:false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.agreeTerms) { setError('Please agree to the Terms of Service.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone || undefined,
          password: form.password, accountType: accountType || 'SEEKER',
          agencyName: form.agencyName || undefined,
          rsspcNumber: form.rsspcNumber || undefined,
          marketingConsent: form.agreeMarketing,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); return }
      setSuccess(true)
    } catch { setError('Network error. Please check your connection.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500"/>
        </div>
        <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Account Created!</h2>
        <p className="text-obsidian-500 text-sm mb-8">Welcome to Naya, <strong>{form.firstName}</strong>! Your account is ready.</p>
        <Link href={accountType === 'AGENT' || accountType === 'LANDLORD' ? '/portal/dashboard' : '/search'} className="btn-primary w-full justify-center">
          Get Started <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center"><Home className="w-5 h-5 text-obsidian-900"/></div>
            <span className="font-display text-2xl font-light text-obsidian-900">NAYA</span>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-2">Create your account</h2>
          <p className="text-obsidian-400 text-sm">Already have an account?{' '}<Link href="/login" className="text-gold-600 font-medium">Sign in</Link></p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-5">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0"/>
            <p className="text-sm text-rose-700 flex-1">{error}</p>
            <button onClick={()=>setError('')}><X className="w-4 h-4 text-rose-400"/></button>
          </div>
        )}

        {step === 1 && (
          <div className="card p-8 space-y-4">
            <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">I am a...</h3>
            {[
              { v:'SEEKER' as AccountType, e:'🔍', t:'Property Seeker', d:'Looking to rent, buy or lease a property' },
              { v:'AGENT' as AccountType, e:'🏢', t:'Agent / Broker', d:'RSSPC-certified estate agent listing properties' },
              { v:'LANDLORD' as AccountType, e:'🏠', t:'Landlord / Owner', d:'I own properties and want to list them directly' },
            ].map(opt => (
              <button key={opt.v} onClick={()=>setAccountType(opt.v)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${accountType===opt.v?'border-gold-500 bg-gold-50':'border-surface-border hover:border-gold-300'}`}>
                <span className="text-3xl">{opt.e}</span>
                <div>
                  <div className="font-semibold text-obsidian-900">{opt.t}</div>
                  <div className="text-xs text-obsidian-400 mt-0.5">{opt.d}</div>
                </div>
                {accountType===opt.v && <CheckCircle2 className="w-5 h-5 text-gold-600 ml-auto flex-shrink-0 mt-0.5"/>}
              </button>
            ))}
            <button onClick={()=>accountType&&setStep(2)} disabled={!accountType} className="btn-primary w-full justify-center disabled:opacity-50">
              Continue <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card p-8 space-y-4">
            <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">Personal Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">First Name *</label>
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                  <input type="text" className="input-field pl-10 text-sm" placeholder="Ekene" value={form.firstName} onChange={e=>set('firstName',e.target.value)} required/></div>
              </div>
              <div>
                <label className="input-label">Last Name *</label>
                <input type="text" className="input-field text-sm" placeholder="Akpapunam" value={form.lastName} onChange={e=>set('lastName',e.target.value)} required/>
              </div>
            </div>
            <div>
              <label className="input-label">Email *</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                <input type="email" className="input-field pl-10 text-sm" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} required/></div>
            </div>
            <div>
              <label className="input-label">Phone</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                <input type="tel" className="input-field pl-10 text-sm" placeholder="+234 080..." value={form.phone} onChange={e=>set('phone',e.target.value)}/></div>
            </div>
            {(accountType==='AGENT'||accountType==='LANDLORD') && (
              <div>
                <label className="input-label">Agency Name *</label>
                <div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                  <input type="text" className="input-field pl-10 text-sm" placeholder="Your Agency Name" value={form.agencyName} onChange={e=>set('agencyName',e.target.value)}/></div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="btn-secondary px-5">← Back</button>
              <button onClick={()=>form.firstName&&form.lastName&&form.email&&setStep(3)} disabled={!form.firstName||!form.lastName||!form.email} className="btn-primary flex-1 justify-center disabled:opacity-50">Continue <ArrowRight className="w-4 h-4"/></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="card p-8 space-y-4">
            <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">Set Your Password</h3>
            <div>
              <label className="input-label">Password *</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                <input type={showPass?'text':'password'} className="input-field pl-10 pr-10 text-sm" placeholder="Min. 8 characters" value={form.password} onChange={e=>set('password',e.target.value)} required/>
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">{showPass?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
              </div>
              {form.password && (
                <div className="flex gap-3 mt-2 flex-wrap">
                  {[{l:'8+ chars',p:form.password.length>=8},{l:'Uppercase',p:/[A-Z]/.test(form.password)},{l:'Number',p:/\d/.test(form.password)},{l:'Special',p:/[!@#$%^&*]/.test(form.password)}].map((c,i)=>(
                    <span key={i} className={`text-[10px] flex items-center gap-1 ${c.p?'text-emerald-600':'text-obsidian-400'}`}>
                      {c.p?<CheckCircle2 className="w-3 h-3"/>:<div className="w-3 h-3 rounded-full border border-current"/>}{c.l}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="input-label">Confirm Password *</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300"/>
                <input type="password" className="input-field pl-10 text-sm" placeholder="Re-enter password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} required/></div>
              {form.confirmPassword && form.password!==form.confirmPassword && <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>}
              {form.confirmPassword && form.password===form.confirmPassword && <p className="text-xs text-emerald-600 mt-1">✓ Passwords match</p>}
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <button type="button" onClick={()=>set('agreeTerms',!form.agreeTerms)} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.agreeTerms?'bg-gold-500 border-gold-500':'border-obsidian-300'}`}>
                {form.agreeTerms&&<CheckCircle2 className="w-3 h-3 text-obsidian-900"/>}
              </button>
              <span className="text-sm text-obsidian-600">I agree to Naya's <Link href="/terms-of-service" target="_blank" className="text-gold-600">Terms</Link> and <Link href="/privacy-policy" target="_blank" className="text-gold-600">Privacy Policy</Link> *</span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={()=>setStep(2)} className="btn-secondary px-5">← Back</button>
              <button type="submit" disabled={loading||!form.agreeTerms} className="btn-primary flex-1 justify-center gap-2 disabled:opacity-70">
                {loading?<><Loader2 className="w-4 h-4 animate-spin"/>Creating...</>:<>Create Account <ArrowRight className="w-4 h-4"/></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
