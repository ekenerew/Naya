'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Shield, CheckCircle2, Upload, AlertCircle, Clock,
  FileText, Award, ChevronRight, Loader2, ArrowRight,
  Building2, Phone, User, X, RefreshCw, Info, Lock,
  ChevronLeft, Sparkles
} from 'lucide-react'

type Doc = { id:string; docType:string; fileName:string; status:string; createdAt:string }
type VerifData = {
  agentId: string; agencyName?: string; rsspcNumber?: string
  rsspcStatus: string; rsspcVerifiedAt?: string; rsspcExpiresAt?: string
  idVerified: boolean; cacVerified: boolean; plan: string; badge: string; docs: Doc[]
}

const docTypes = [
  { key:'rsspc_licence',    label:'RSSPC Licence Certificate', desc:'Your current valid RSSPC licence',              required:true  },
  { key:'govt_id',          label:'Government-Issued ID',      desc:'NIN slip, International Passport, or Driver\'s Licence', required:true  },
  { key:'cac_cert',         label:'CAC Registration Certificate', desc:'Business registration certificate',         required:false },
  { key:'proof_of_address', label:'Proof of Address',          desc:'Utility bill or bank statement (within 3 months)', required:false },
]

const statusConfig: Record<string,{ label:string; color:string; bg:string; border:string }> = {
  PENDING:      { label:'Not Started',  color:'text-obsidian-500', bg:'bg-obsidian-50',  border:'border-obsidian-200' },
  SUBMITTED:    { label:'Submitted',    color:'text-blue-600',     bg:'bg-blue-50',      border:'border-blue-200' },
  UNDER_REVIEW: { label:'Under Review', color:'text-amber-600',    bg:'bg-amber-50',     border:'border-amber-200' },
  VERIFIED:     { label:'Verified ✓',   color:'text-emerald-600',  bg:'bg-emerald-50',   border:'border-emerald-200' },
  REJECTED:     { label:'Rejected',     color:'text-rose-600',     bg:'bg-rose-50',      border:'border-rose-200' },
  EXPIRED:      { label:'Expired',      color:'text-orange-600',   bg:'bg-orange-50',    border:'border-orange-200' },
}

const wizardSteps = [
  { n:1, label:'RSSPC Details',    desc:'Enter your licence information' },
  { n:2, label:'Agency Profile',   desc:'Business and contact details' },
  { n:3, label:'Upload Documents', desc:'Licence, ID and supporting docs' },
  { n:4, label:'Submit for Review',desc:'Final review and submission' },
]

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [data, setData]         = useState<VerifData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [step, setStep]         = useState(1)
  const [saving, setSaving]     = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState<string|null>(null)
  const [activeDocType, setActiveDocType] = useState<string|null>(null)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    rsspcNumber:'', agencyName:'', cacNumber:'',
    whatsapp:'', bio:'', yearsActive:'',
  })
  const set = (k:string, v:string) => setForm(p => ({ ...p, [k]: v }))

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portal/verification')
      if (res.status === 401) { router.push('/login'); return }
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setForm(p => ({
          ...p,
          rsspcNumber: json.data.rsspcNumber || '',
          agencyName:  json.data.agencyName  || '',
        }))
        // Resume from correct step if already started
        if (json.data.rsspcStatus === 'VERIFIED') setSubmitted(true)
        else if (json.data.docs?.length > 0) setStep(4)
        else if (json.data.rsspcStatus === 'SUBMITTED') setStep(3)
        else if (json.data.rsspcNumber) setStep(2)
        else setStep(1)
      }
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const saveStep1 = async () => {
    if (!form.rsspcNumber.trim()) { setError('Please enter your RSSPC licence number'); return }
    if (!form.rsspcNumber.match(/^RS-\d{4}-\d+$/i)) {
      setError('RSSPC number format should be RS-YYYY-NNNN (e.g. RS-2024-1847)')
      return
    }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/portal/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Save failed'); return }
      setSuccess('RSSPC details saved!')
      await fetchData()
      setStep(2)
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const saveStep2 = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/portal/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Save failed'); return }
      setSuccess('Agency profile saved!')
      await fetchData()
      setStep(3)
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDocType || !e.target.files?.[0]) return
    const file = e.target.files[0]
    setUploadingDoc(activeDocType); setError(''); setSuccess('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('docType', activeDocType)
      const res = await fetch('/api/portal/verification/upload', { method:'POST', body:fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Upload failed'); return }
      setSuccess(`${json.data?.label || 'Document'} uploaded successfully!`)
      await fetchData()
    } catch { setError('Upload failed. Please try again.') }
    finally {
      setUploadingDoc(null); setActiveDocType(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (docType:string) => {
    setActiveDocType(docType)
    setTimeout(() => fileInputRef.current?.click(), 100)
  }

  const handleFinalSubmit = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/portal/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, finalSubmit: true }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Submission failed'); return }
      setSubmitted(true)
      await fetchData()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
    </div>
  )

  const status = data?.rsspcStatus || 'PENDING'
  const cfg = statusConfig[status] || statusConfig.PENDING
  const uploadedDocs = data?.docs || []
  const getDoc = (type:string) => uploadedDocs.find(d => d.docType === type)
  const requiredDone = docTypes.filter(d=>d.required).every(d=>!!getDoc(d.key))
  const isVerified = status === 'VERIFIED'

  // Verified state
  if (isVerified) return (
    <div className="min-h-screen bg-surface-bg">
      <header className="bg-obsidian-900 border-b border-white/10 sticky top-0 z-40">
        <div className="page-container py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-light text-white">NAYA</Link>
          <Link href="/portal/dashboard" className="text-white/50 hover:text-white text-sm">← Dashboard</Link>
        </div>
      </header>
      <div className="page-container py-16 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-14 h-14 text-emerald-500" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
            <CheckCircle2 className="w-4 h-4" />RSSPC VERIFIED AGENT
          </div>
          <h1 className="font-display text-4xl font-medium text-obsidian-900 mb-4">You're Verified!</h1>
          <p className="text-obsidian-500 mb-2">
            Your RSSPC number <strong className="font-mono text-obsidian-900">{data?.rsspcNumber}</strong> has been confirmed.
          </p>
          <p className="text-obsidian-400 text-sm mb-8">
            Your verified badge is now active on your profile and all your listings.
            {data?.rsspcExpiresAt && ` Verification expires ${new Date(data.rsspcExpiresAt).toLocaleDateString('en-NG', {day:'numeric',month:'long',year:'numeric'})}.`}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/portal/dashboard" className="btn-primary justify-center gap-2">
              <ArrowRight className="w-4 h-4" />Dashboard
            </Link>
            <Link href="/portal/list" className="btn-secondary justify-center gap-2">
              List a Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  // Submitted state
  if (submitted) return (
    <div className="min-h-screen bg-surface-bg">
      <header className="bg-obsidian-900 border-b border-white/10 sticky top-0 z-40">
        <div className="page-container py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-light text-white">NAYA</Link>
          <Link href="/portal/dashboard" className="text-white/50 hover:text-white text-sm">← Dashboard</Link>
        </div>
      </header>
      <div className="page-container py-16 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="font-display text-3xl font-medium text-obsidian-900 mb-4">Application Submitted!</h1>
          <p className="text-obsidian-500 mb-2">
            Your RSSPC verification application is under review.
          </p>
          <p className="text-obsidian-400 text-sm mb-8">
            Our team typically completes review within <strong>24–48 business hours</strong>. 
            You'll be notified when your badge is activated.
          </p>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left mb-6">
            <p className="text-sm text-amber-700 font-semibold mb-1">What happens next?</p>
            {['We cross-check your RSSPC number with the official register','We verify your uploaded identity documents','We activate your verified badge and send you a confirmation email'].map((s,i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700 flex-shrink-0">{i+1}</div>
                <p className="text-sm text-amber-700">{s}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-obsidian-400 mb-6">Questions? Email <strong>verify@naya.ng</strong> with your RSSPC number as the subject.</p>
          <Link href="/portal/dashboard" className="btn-primary justify-center gap-2 w-full">
            Back to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-bg">
      <input ref={fileInputRef} type="file" className="hidden"
        accept="image/*,application/pdf" onChange={handleDocUpload} />

      {/* Header */}
      <header className="bg-obsidian-900 border-b border-white/10 sticky top-0 z-40">
        <div className="page-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display text-xl font-light text-white">NAYA</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <Link href="/portal/dashboard" className="text-white/40 text-sm hover:text-white/60">Dashboard</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-white/60 text-sm">RSSPC Verification</span>
          </div>
          {/* Status pill */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            <Shield className="w-3.5 h-3.5" />{cfg.label}
          </div>
        </div>
      </header>

      <div className="page-container py-8">
        <div className="max-w-2xl mx-auto">

          {/* Page title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-obsidian-900 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="font-display text-3xl font-medium text-obsidian-900 mb-2">
              RSSPC Agent Verification
            </h1>
            <p className="text-obsidian-400 text-sm max-w-md mx-auto">
              Get your verified badge to build trust with buyers and renters in Port Harcourt.
              Complete all 4 steps below.
            </p>
          </div>

          {/* Step progress */}
          <div className="flex items-start gap-0 mb-8">
            {wizardSteps.map((s, i) => {
              const done = step > s.n
              const active = step === s.n
              return (
                <div key={s.n} className="flex items-start flex-1">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center w-full">
                      {i > 0 && <div className={`flex-1 h-0.5 ${done || active ? 'bg-gold-500' : 'bg-surface-border'}`} />}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all flex-shrink-0 ${done ? 'bg-emerald-500 border-emerald-500 text-white' : active ? 'bg-obsidian-900 border-obsidian-900 text-white' : 'bg-white border-surface-border text-obsidian-300'}`}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                      </div>
                      {i < wizardSteps.length - 1 && <div className={`flex-1 h-0.5 ${done ? 'bg-gold-500' : 'bg-surface-border'}`} />}
                    </div>
                    <div className="text-center mt-2 px-1">
                      <p className={`text-xs font-semibold ${active ? 'text-obsidian-900' : done ? 'text-emerald-600' : 'text-obsidian-400'}`}>{s.label}</p>
                      <p className="text-[10px] text-obsidian-400 hidden md:block">{s.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-emerald-700 flex-1">{success}</p>
              <button onClick={() => setSuccess('')}><X className="w-4 h-4 text-emerald-400" /></button>
            </div>
          )}

          {/* ── STEP 1 — RSSPC Details ─────────────────────────── */}
          {step === 1 && (
            <div className="card p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">
                  Enter Your RSSPC Details
                </h2>
                <p className="text-obsidian-400 text-sm">
                  The Rivers State Real Estate Practitioners Council (RSSPC) is the official regulatory body for estate agents in Rivers State.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Where to find your RSSPC number</p>
                  <p className="text-xs text-blue-600">Your RSSPC number is printed on your licence certificate in the format <strong className="font-mono">RS-YYYY-NNNN</strong> (e.g. RS-2024-1847). Contact RSSPC at <strong>+234 84 000000</strong> if you need assistance.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="input-label">RSSPC Licence Number *</label>
                  <input className="input-field font-mono text-sm uppercase tracking-widest"
                    placeholder="RS-2024-1847"
                    value={form.rsspcNumber}
                    onChange={e => set('rsspcNumber', e.target.value.toUpperCase())} />
                  <p className="text-xs text-obsidian-400 mt-1.5">Must match exactly what's on your licence certificate</p>
                </div>
              </div>

              <div className="p-4 bg-gold-50 border border-gold-200 rounded-2xl">
                <p className="text-sm font-semibold text-obsidian-900 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-600" />Not yet registered with RSSPC?
                </p>
                <p className="text-xs text-obsidian-600">Visit the RSSPC office at <strong>Plot 27, Stadium Road, GRA Phase 1, Port Harcourt</strong> or call <strong>+234 803 000 0000</strong> to register. Registration typically takes 5–7 working days.</p>
              </div>

              <button onClick={saveStep1} disabled={saving || !form.rsspcNumber.trim()}
                className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* ── STEP 2 — Agency Profile ────────────────────────── */}
          {step === 2 && (
            <div className="card p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Agency Profile</h2>
                <p className="text-obsidian-400 text-sm">Tell buyers about your agency and how to reach you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="input-label">Agency / Business Name *</label>
                  <input className="input-field text-sm" placeholder="e.g. Okeke Premium Properties Ltd"
                    value={form.agencyName} onChange={e => set('agencyName', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">CAC Registration Number</label>
                  <input className="input-field text-sm font-mono" placeholder="RC-123456"
                    value={form.cacNumber} onChange={e => set('cacNumber', e.target.value)} />
                  <p className="text-xs text-obsidian-400 mt-1">Optional but increases trust</p>
                </div>
                <div>
                  <label className="input-label">WhatsApp Business Number</label>
                  <input className="input-field text-sm" placeholder="+234 080 1234 5678"
                    value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Years Active in Real Estate</label>
                  <select className="input-field text-sm" value={form.yearsActive}
                    onChange={e => set('yearsActive', e.target.value)}>
                    <option value="">Select experience</option>
                    <option value="0">Less than 1 year</option>
                    <option value="1">1–2 years</option>
                    <option value="3">3–5 years</option>
                    <option value="5">5–10 years</option>
                    <option value="10">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Professional Bio</label>
                <textarea className="input-field resize-none h-28 text-sm"
                  placeholder="Describe your experience, specializations, and the areas of Port Harcourt you cover. This appears on your public profile."
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
                <p className="text-xs text-obsidian-400 mt-1">{form.bio.length}/500 characters</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setError(''); setSuccess('') }}
                  className="btn-secondary px-5 gap-2">
                  <ChevronLeft className="w-4 h-4" />Back
                </button>
                <button onClick={saveStep2} disabled={saving || !form.agencyName.trim()}
                  className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 — Upload Documents ──────────────────────── */}
          {step === 3 && (
            <div className="card p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Upload Documents</h2>
                <p className="text-obsidian-400 text-sm">Clear photos or scans are accepted. JPG, PNG or PDF · Max 5MB each.</p>
              </div>

              <div className="space-y-3">
                {docTypes.map(doc => {
                  const uploaded = getDoc(doc.key)
                  const isUploading = uploadingDoc === doc.key
                  const docStatus = uploaded?.status

                  return (
                    <div key={doc.key} className={`rounded-2xl border-2 p-4 transition-all ${uploaded ? docStatus === 'REJECTED' ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50' : 'border-surface-border hover:border-gold-200 bg-white'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${uploaded ? docStatus === 'REJECTED' ? 'bg-rose-100' : 'bg-emerald-100' : 'bg-surface-subtle'}`}>
                          {uploaded
                            ? docStatus === 'REJECTED'
                              ? <AlertCircle className="w-6 h-6 text-rose-500" />
                              : <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            : <FileText className="w-6 h-6 text-obsidian-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-obsidian-900 text-sm">{doc.label}</p>
                            {doc.required
                              ? <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">REQUIRED</span>
                              : <span className="px-2 py-0.5 bg-obsidian-100 text-obsidian-500 text-[10px] font-medium rounded-full">Optional</span>
                            }
                          </div>
                          <p className="text-xs text-obsidian-400 mt-0.5">{doc.desc}</p>
                          {uploaded && (
                            <p className={`text-xs mt-1.5 font-medium ${docStatus==='REJECTED' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {docStatus === 'REJECTED' ? '✗ Rejected — please upload a clearer copy' : `✓ ${uploaded.fileName}`}
                            </p>
                          )}
                        </div>
                        <button onClick={() => triggerUpload(doc.key)} disabled={isUploading}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${uploaded && docStatus !== 'REJECTED' ? 'bg-white border border-obsidian-200 text-obsidian-600 hover:border-gold-400' : 'bg-obsidian-900 text-white hover:bg-obsidian-700'} disabled:opacity-50`}>
                          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          {isUploading ? 'Uploading...' : uploaded && docStatus !== 'REJECTED' ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="p-4 bg-surface-subtle rounded-2xl">
                <div className="flex justify-between text-xs text-obsidian-600 mb-2">
                  <span className="font-medium">Documents uploaded</span>
                  <span className="font-bold">{uploadedDocs.length} of {docTypes.length}</span>
                </div>
                <div className="h-2.5 bg-surface-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${requiredDone ? 'bg-emerald-500' : 'bg-gold-500'}`}
                    style={{ width: `${Math.max(5, (uploadedDocs.length / docTypes.length) * 100)}%` }} />
                </div>
                {!requiredDone && (
                  <p className="text-xs text-obsidian-400 mt-2">Upload the 2 required documents to continue.</p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep(2); setError(''); setSuccess('') }}
                  className="btn-secondary px-5 gap-2">
                  <ChevronLeft className="w-4 h-4" />Back
                </button>
                <button onClick={() => { setStep(4); setError(''); setSuccess('') }}
                  disabled={!requiredDone}
                  className="btn-primary flex-1 justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4 — Review & Submit ───────────────────────── */}
          {step === 4 && (
            <div className="card p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Review & Submit</h2>
                <p className="text-obsidian-400 text-sm">Check your details before submitting for review.</p>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <div className="p-4 bg-surface-subtle rounded-2xl">
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-wider mb-3">RSSPC Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-obsidian-400 text-xs">RSSPC Number</p>
                      <p className="font-mono font-bold text-obsidian-900">{data?.rsspcNumber || form.rsspcNumber}</p>
                    </div>
                    <div>
                      <p className="text-obsidian-400 text-xs">Agency Name</p>
                      <p className="font-medium text-obsidian-900">{form.agencyName || data?.agencyName || '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-subtle rounded-2xl">
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-wider mb-3">Documents</p>
                  <div className="space-y-2">
                    {docTypes.map(doc => {
                      const uploaded = getDoc(doc.key)
                      return (
                        <div key={doc.key} className="flex items-center gap-3">
                          {uploaded
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            : <div className="w-4 h-4 rounded-full border-2 border-obsidian-200 flex-shrink-0" />
                          }
                          <span className={`text-sm ${uploaded ? 'text-obsidian-900 font-medium' : 'text-obsidian-400'}`}>
                            {doc.label} {doc.required && !uploaded ? <span className="text-rose-500 text-xs">(required)</span> : ''}
                          </span>
                          {uploaded && <span className="text-xs text-obsidian-400 ml-auto">{uploaded.fileName}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Process info */}
              <div className="p-4 bg-obsidian-50 border border-obsidian-200 rounded-2xl">
                <p className="text-sm font-semibold text-obsidian-900 mb-3">What happens after you submit?</p>
                {[
                  { time:'0–2 hrs',   step:'We acknowledge your application by email' },
                  { time:'24–48 hrs', step:'We verify your RSSPC number with the official register' },
                  { time:'48–72 hrs', step:'Documents reviewed and verification badge activated' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
                    <span className="px-2 py-0.5 bg-gold-100 text-gold-700 text-[10px] font-bold rounded-full whitespace-nowrap mt-0.5">{item.time}</span>
                    <p className="text-sm text-obsidian-600">{item.step}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-700">
                  By submitting, you confirm that all information provided is accurate and that you are a registered member of the RSSPC. Providing false information may result in permanent account suspension.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep(3); setError(''); setSuccess('') }}
                  className="btn-secondary px-5 gap-2">
                  <ChevronLeft className="w-4 h-4" />Back
                </button>
                <button onClick={handleFinalSubmit} disabled={saving}
                  className="btn-primary flex-1 justify-center gap-2 disabled:opacity-70">
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                    : <><Shield className="w-4 h-4" />Submit for Verification</>}
                </button>
              </div>
            </div>
          )}

          {/* Benefits footer */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              '🏅 RSSPC Badge on all listings',
              '🔝 Priority in search results',
              '💬 Trusted Agent WhatsApp seal',
              '📋 Verification Certificate',
              '⭐ Top Agent eligibility',
              '🔓 Access to Pro & Premium plans',
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-white border border-surface-border rounded-xl text-xs text-obsidian-600">
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
