'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Shield, CheckCircle2, Upload, AlertCircle, Clock,
  FileText, Award, ChevronRight, Loader2, Eye, EyeOff,
  Building2, Phone, User, Star, ArrowRight, X,
  RefreshCw, Lock, Info, Camera, File
} from 'lucide-react'

type VerifData = {
  agentId: string
  agencyName?: string
  rsspcNumber?: string
  rsspcStatus: string
  rsspcVerifiedAt?: string
  rsspcExpiresAt?: string
  idVerified: boolean
  cacVerified: boolean
  plan: string
  badge: string
  docs: Array<{ id:string; docType:string; fileName:string; status:string; createdAt:string }>
}

const docTypes = [
  { key:'rsspc_licence',    label:'RSSPC Licence',          desc:'Your current RSSPC licence certificate',      icon:Award,    required:true  },
  { key:'govt_id',          label:'Government-Issued ID',   desc:'NIN slip, passport, or driver\'s licence',   icon:User,     required:true  },
  { key:'cac_cert',         label:'CAC Registration',        desc:'Business registration certificate (optional)',icon:Building2,required:false },
  { key:'proof_of_address', label:'Proof of Address',        desc:'Utility bill or bank statement (3 months)',  icon:FileText, required:false },
]

const statusConfig: Record<string,{ label:string; color:string; bg:string; icon:any; desc:string }> = {
  PENDING:      { label:'Not Started',   color:'text-obsidian-500', bg:'bg-obsidian-50',  icon:Clock,        desc:'Submit your RSSPC details to begin verification.' },
  SUBMITTED:    { label:'Submitted',     color:'text-blue-600',     bg:'bg-blue-50',      icon:Clock,        desc:'Your details have been received. Upload your documents to continue.' },
  UNDER_REVIEW: { label:'Under Review',  color:'text-amber-600',    bg:'bg-amber-50',     icon:Clock,        desc:'Our team is reviewing your documents. This takes 24–48 hours.' },
  VERIFIED:     { label:'Verified ✓',    color:'text-emerald-600',  bg:'bg-emerald-50',   icon:CheckCircle2, desc:'You are a verified Naya agent. Your badge is now active.' },
  REJECTED:     { label:'Rejected',      color:'text-rose-600',     bg:'bg-rose-50',      icon:AlertCircle,  desc:'Your verification was rejected. Please resubmit with correct documents.' },
  EXPIRED:      { label:'Expired',       color:'text-orange-600',   bg:'bg-orange-50',    icon:AlertCircle,  desc:'Your verification has expired. Please renew your RSSPC licence.' },
}

export default function ProfilePage() {
  const router = useRouter()
  const [data, setData]           = useState<VerifData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeDocType, setActiveDocType] = useState<string | null>(null)

  const [form, setForm] = useState({
    rsspcNumber: '', agencyName: '', cacNumber: '',
    whatsapp: '', bio: '', yearsActive: '',
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portal/verification')
      if (res.status === 401) { router.push('/login'); return }
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setForm({
          rsspcNumber: json.data.rsspcNumber || '',
          agencyName:  json.data.agencyName  || '',
          cacNumber:   '',
          whatsapp:    '',
          bio:         '',
          yearsActive: '',
        })
      }
    } catch { setError('Failed to load verification data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.rsspcNumber.trim()) { setError('RSSPC number is required'); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/portal/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Submission failed'); return }
      setSuccess(json.data?.message || 'Details saved!')
      fetchData()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDocType || !e.target.files?.[0]) return
    const file = e.target.files[0]
    setUploadingDoc(activeDocType)
    setError(''); setSuccess('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('docType', activeDocType)
      const res = await fetch('/api/portal/verification/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Upload failed'); return }
      setSuccess(`${json.data?.label} uploaded successfully!`)
      fetchData()
    } catch { setError('Upload failed. Please try again.') }
    finally {
      setUploadingDoc(null)
      setActiveDocType(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (docType: string) => {
    setActiveDocType(docType)
    setTimeout(() => fileInputRef.current?.click(), 100)
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
    </div>
  )

  const status = data?.rsspcStatus || 'PENDING'
  const cfg = statusConfig[status] || statusConfig.PENDING
  const isVerified = status === 'VERIFIED'
  const canEdit = !['VERIFIED','UNDER_REVIEW'].includes(status)

  const uploadedDocs = data?.docs || []
  const getDoc = (type: string) => uploadedDocs.find(d => d.docType === type)
  const requiredDocsDone = docTypes.filter(d => d.required).every(d => !!getDoc(d.key))

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* Hidden file input */}
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
          <Link href="/portal/dashboard" className="text-white/50 hover:text-white text-sm">← Dashboard</Link>
        </div>
      </header>

      <div className="page-container py-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Status banner */}
          <div className={`rounded-3xl p-6 ${cfg.bg} border ${isVerified ? 'border-emerald-200' : status === 'UNDER_REVIEW' ? 'border-amber-200' : status === 'REJECTED' ? 'border-rose-200' : 'border-obsidian-200'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isVerified ? 'bg-emerald-100' : status === 'UNDER_REVIEW' ? 'bg-amber-100' : 'bg-white'}`}>
                <cfg.icon className={`w-7 h-7 ${cfg.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className={`font-semibold text-lg ${cfg.color}`}>Status: {cfg.label}</h2>
                  {data?.rsspcNumber && (
                    <span className="px-3 py-0.5 bg-white/80 border border-obsidian-200 rounded-full text-xs font-mono font-bold text-obsidian-700">
                      {data.rsspcNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-obsidian-600">{cfg.desc}</p>
                {isVerified && data?.rsspcExpiresAt && (
                  <p className="text-xs text-obsidian-400 mt-1">
                    Verified on {new Date(data.rsspcVerifiedAt!).toLocaleDateString('en-NG', { day:'numeric', month:'long', year:'numeric' })} · 
                    Expires {new Date(data.rsspcExpiresAt).toLocaleDateString('en-NG', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                )}
              </div>
              {!isVerified && (
                <button onClick={fetchData} className="flex items-center gap-1.5 text-xs text-obsidian-400 hover:text-obsidian-700 transition-colors flex-shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />Refresh
                </button>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-emerald-700">{success}</p>
            </div>
          )}

          {/* STEP 1 — RSSPC Details */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-surface-border flex items-center gap-3 bg-surface-subtle">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${data?.rsspcNumber ? 'bg-emerald-500 text-white' : 'bg-obsidian-900 text-white'}`}>
                {data?.rsspcNumber ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <div>
                <h3 className="font-semibold text-obsidian-900">RSSPC Licence Details</h3>
                <p className="text-xs text-obsidian-400">Enter your Rivers State Real Estate Practitioners Council number</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Your RSSPC number is on your licence certificate (format: RS-YYYY-XXXX). 
                  Contact the RSSPC at <strong>+234 84 123456</strong> or visit their office in GRA Phase 1 if you need to register or renew.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">RSSPC Licence Number *</label>
                  <input className="input-field text-sm font-mono uppercase" placeholder="RS-2024-XXXX"
                    value={form.rsspcNumber} onChange={e => set('rsspcNumber', e.target.value.toUpperCase())}
                    disabled={!canEdit} required />
                  <p className="text-xs text-obsidian-400 mt-1">Format: RS-YYYY-NNNN</p>
                </div>
                <div>
                  <label className="input-label">Agency / Business Name *</label>
                  <input className="input-field text-sm" placeholder="Your Agency Name Ltd"
                    value={form.agencyName} onChange={e => set('agencyName', e.target.value)}
                    disabled={!canEdit} />
                </div>
                <div>
                  <label className="input-label">CAC Registration Number</label>
                  <input className="input-field text-sm font-mono" placeholder="RC-XXXXXX"
                    value={form.cacNumber} onChange={e => set('cacNumber', e.target.value)}
                    disabled={!canEdit} />
                </div>
                <div>
                  <label className="input-label">WhatsApp Business Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">🇳🇬</span>
                    <input className="input-field pl-8 text-sm" placeholder="+234 080..."
                      value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                      disabled={!canEdit} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Years Active in Real Estate</label>
                  <select className="input-field text-sm" value={form.yearsActive}
                    onChange={e => set('yearsActive', e.target.value)} disabled={!canEdit}>
                    <option value="">Select</option>
                    {['Less than 1','1-2','3-5','5-10','10+'].map((v,i) => <option key={i} value={i}>{v} years</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Professional Bio</label>
                <textarea className="input-field resize-none h-24 text-sm"
                  placeholder="Describe your experience, specializations, and areas you cover in Port Harcourt..."
                  value={form.bio} onChange={e => set('bio', e.target.value)}
                  disabled={!canEdit} />
              </div>

              {canEdit && (
                <button type="submit" disabled={saving || !form.rsspcNumber.trim()}
                  className="btn-primary gap-2 disabled:opacity-60">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4" />Save RSSPC Details</>}
                </button>
              )}
            </form>
          </div>

          {/* STEP 2 — Document Upload */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-surface-border flex items-center gap-3 bg-surface-subtle">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${requiredDocsDone ? 'bg-emerald-500 text-white' : 'bg-obsidian-900 text-white'}`}>
                {requiredDocsDone ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <div>
                <h3 className="font-semibold text-obsidian-900">Upload Documents</h3>
                <p className="text-xs text-obsidian-400">Upload clear photos or scans of your documents (JPG, PNG, PDF · Max 5MB each)</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {docTypes.map(doc => {
                const uploaded = getDoc(doc.key)
                const isUploading = uploadingDoc === doc.key
                return (
                  <div key={doc.key} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${uploaded ? 'border-emerald-200 bg-emerald-50' : 'border-surface-border bg-surface-subtle hover:border-gold-200'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${uploaded ? 'bg-emerald-100' : 'bg-white'}`}>
                      {uploaded ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <doc.icon className="w-6 h-6 text-obsidian-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-obsidian-900 text-sm">{doc.label}</p>
                        {doc.required && <span className="text-[10px] text-rose-500 font-bold">REQUIRED</span>}
                        {!doc.required && <span className="text-[10px] text-obsidian-400">Optional</span>}
                      </div>
                      <p className="text-xs text-obsidian-400 mt-0.5">{doc.desc}</p>
                      {uploaded && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          ✓ {uploaded.fileName} · {uploaded.status === 'VERIFIED' ? 'Verified' : uploaded.status === 'REJECTED' ? 'Rejected — please reupload' : 'Under review'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => triggerUpload(doc.key)}
                      disabled={isUploading || isVerified}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${uploaded ? 'bg-white border border-obsidian-200 text-obsidian-600 hover:border-gold-300' : 'bg-obsidian-900 text-white hover:bg-obsidian-800'} disabled:opacity-50`}>
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isUploading ? 'Uploading...' : uploaded ? 'Replace' : 'Upload'}
                    </button>
                  </div>
                )
              })}

              {/* Progress indicator */}
              <div className="mt-2 p-4 bg-surface-subtle rounded-xl">
                <div className="flex justify-between text-xs text-obsidian-600 mb-2">
                  <span>Documents uploaded</span>
                  <span className="font-semibold">{uploadedDocs.length} / {docTypes.length} ({docTypes.filter(d=>d.required).length} required)</span>
                </div>
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 rounded-full transition-all"
                    style={{ width: `${(uploadedDocs.length / docTypes.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 — Review */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-surface-border flex items-center gap-3 bg-surface-subtle">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isVerified ? 'bg-emerald-500 text-white' : status === 'UNDER_REVIEW' ? 'bg-amber-500 text-white' : 'bg-obsidian-200 text-obsidian-500'}`}>
                {isVerified ? <CheckCircle2 className="w-4 h-4" /> : '3'}
              </div>
              <div>
                <h3 className="font-semibold text-obsidian-900">Naya Review</h3>
                <p className="text-xs text-obsidian-400">Our team verifies with RSSPC and reviews your documents</p>
              </div>
            </div>
            <div className="p-6">
              {isVerified ? (
                <div className="text-center py-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-emerald-700 mb-2">Fully Verified ✓</h3>
                  <p className="text-obsidian-500 text-sm max-w-sm mx-auto">
                    Your RSSPC badge is now active on your profile and all your listings. Buyers and renters can trust you are a verified professional.
                  </p>
                </div>
              ) : status === 'UNDER_REVIEW' ? (
                <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-700">Under Review</p>
                    <p className="text-sm text-amber-600 mt-1">Our team is reviewing your submission. This typically takes 24–48 business hours. You'll receive a notification when complete.</p>
                    <p className="text-xs text-amber-500 mt-2">Questions? Email <strong>verify@naya.ng</strong> with your RSSPC number as the subject.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-obsidian-600">Once you complete Steps 1 and 2, our team will:</p>
                  {[
                    'Cross-check your RSSPC number with the official RSSPC register',
                    'Verify your identity documents match your RSSPC registration',
                    'Confirm your agency details and CAC registration if provided',
                    'Activate your verified badge within 24–48 business hours',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-obsidian-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-obsidian-400">{i+1}</span>
                      </div>
                      <p className="text-sm text-obsidian-600">{item}</p>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-gold-50 border border-gold-200 rounded-xl">
                    <p className="text-xs text-gold-700">
                      <strong>Not registered with RSSPC yet?</strong> Visit the Rivers State Real Estate Practitioners Council office at Plot 27, Stadium Road, Port Harcourt or call <strong>+234 803 000 0000</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          {!isVerified && (
            <div className="card p-6">
              <h3 className="font-semibold text-obsidian-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-600" />Why get verified?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '✅ RSSPC badge on all your listings',
                  '✅ Priority placement in search results',
                  '✅ Access to Pro & Premium plans',
                  '✅ Trusted Agent seal on WhatsApp',
                  '✅ Eligibility for Top Agent programme',
                  '✅ Downloadable Verification Certificate',
                ].map((b, i) => (
                  <p key={i} className="text-sm text-obsidian-600">{b}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
