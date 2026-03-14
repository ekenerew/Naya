'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Shield, CheckCircle2, Upload, AlertCircle, Clock,
  ArrowRight, FileText, Camera, Phone, Star, Award,
  ChevronRight, Loader2, Eye, EyeOff, Lock
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Personal Identity',       desc: 'Government-issued ID verification',          icon: FileText, done: true  },
  { id: 2, title: 'RSSPC Licence Number',     desc: 'Rivers State Real Estate Practitioners Council', icon: Award, done: true  },
  { id: 3, title: 'CAC Registration',         desc: 'Business registration certificate',          icon: Shield,   done: false },
  { id: 4, title: 'Proof of Address',         desc: 'Utility bill or bank statement',             icon: FileText, done: false },
  { id: 5, title: 'Professional References',  desc: 'Two client references',                      icon: Star,     done: false },
]

const benefits = [
  'RSSPC verification badge on all listings and your profile',
  'Priority placement in search results',
  'Access to Pro and Premium listing plans',
  'Trusted Agent seal on WhatsApp communication',
  'Eligibility for Top Agent and Platinum programme',
  'Downloadable Certificate of Verification from Naya',
]

const faq = [
  { q: 'What is the RSSPC?', a: 'The Rivers State Real Estate Practitioners Council (RSSPC) is the official regulatory body for estate agents operating in Rivers State. All legitimate agents in Port Harcourt are required to be registered with the RSSPC.' },
  { q: 'How long does verification take?', a: 'Identity and RSSPC verification typically takes 24–48 hours during business days. Full verification (all 5 steps) takes 3–5 business days depending on document quality.' },
  { q: 'What if my RSSPC licence has expired?', a: 'You can still start the process, but you will need to renew your RSSPC licence before full verification can be completed. We recommend renewing with the RSSPC first.' },
  { q: 'Is my personal information secure?', a: 'All documents are encrypted using AES-256 and stored in accordance with Nigeria\'s Data Protection Act 2023. Documents are only accessed by our verification team and are never shared with third parties.' },
]

export default function VerificationPage() {
  const [rsspcNumber, setRsspcNumber] = useState('')
  const [showNumber, setShowNumber] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const completedSteps = steps.filter(s => s.done).length
  const progress = Math.round((completedSteps / steps.length) * 100)

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => { setUploading(false); setUploaded(true) }, 2000)
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/portal/dashboard" className="text-white/40 text-sm hover:text-white/60 transition-colors">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              <span className="text-white/60 text-sm">RSSPC Verification</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase">Agent Verification Centre</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-4">
              Get Your<br /><span className="text-emerald-400">Verification Badge</span>
            </h1>
            <p className="text-white/40 text-lg font-light leading-relaxed max-w-xl">
              Verified agents on Naya get 4x more enquiries. Complete your RSSPC and identity verification to unlock the full power of the platform.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      <section className="section-padding">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* MAIN FORM */}
            <div className="lg:col-span-2 space-y-5">

              {/* Progress */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-medium text-obsidian-900">Verification Progress</h2>
                  <span className="font-mono text-sm font-bold text-obsidian-900">{completedSteps}/{steps.length} Complete</span>
                </div>
                <div className="h-3 bg-surface-subtle rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-3">
                  {steps.map((s, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${s.done ? 'bg-emerald-50 border-emerald-200' : i === completedSteps ? 'bg-gold-50 border-gold-300' : 'bg-surface-subtle border-surface-border'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-emerald-500' : i === completedSteps ? 'bg-gold-500' : 'bg-obsidian-100'}`}>
                        {s.done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <s.icon className={`w-5 h-5 ${i === completedSteps ? 'text-obsidian-900' : 'text-obsidian-400'}`} />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${s.done ? 'text-emerald-800' : 'text-obsidian-900'}`}>{s.title}</div>
                        <div className="text-xs text-obsidian-400">{s.desc}</div>
                      </div>
                      {s.done && <span className="text-xs text-emerald-600 font-medium">Verified ✓</span>}
                      {!s.done && i === completedSteps && <span className="text-xs text-gold-600 font-medium">Next →</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* RSSPC Number Input */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-medium text-obsidian-900 mb-2">Step 3: CAC Registration</h2>
                <p className="text-obsidian-400 text-sm mb-6">Upload your Corporate Affairs Commission (CAC) business registration certificate. This confirms you are operating a legitimate business in Nigeria.</p>

                <div className="mb-5">
                  <label className="input-label">CAC Registration Number</label>
                  <div className="relative">
                    <input type={showNumber ? 'text' : 'password'}
                      className="input-field pr-10 text-sm font-mono"
                      placeholder="e.g. RC-884721"
                      value={rsspcNumber} onChange={e => setRsspcNumber(e.target.value)} />
                    <button onClick={() => setShowNumber(!showNumber)} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400">
                      {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Upload area */}
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${uploaded ? 'border-emerald-400 bg-emerald-50' : 'border-surface-border hover:border-gold-400 bg-surface-subtle'}`}>
                  {uploaded ? (
                    <div>
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <div className="font-semibold text-emerald-800 mb-1">Document Uploaded Successfully</div>
                      <div className="text-xs text-emerald-600">CAC_Certificate.pdf · Under review</div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-obsidian-300 mx-auto mb-3" />
                      <div className="font-medium text-obsidian-700 mb-1">Upload CAC Certificate</div>
                      <div className="text-xs text-obsidian-400 mb-4">PDF, JPG, or PNG · Max 5MB · Certificate must be clearly visible</div>
                      <button onClick={handleUpload} disabled={uploading}
                        className="btn-primary btn-sm gap-2 disabled:opacity-50">
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4" />Choose File</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">Your documents are encrypted with AES-256 and stored in compliance with Nigeria's Data Protection Act 2023. Only our verification team can access them.</p>
                </div>

                <button className="btn-primary w-full justify-center mt-5" disabled={!uploaded}>
                  Submit for Review <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* FAQ */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-medium text-obsidian-900 mb-5">Verification FAQs</h2>
                <div className="space-y-2">
                  {faq.map((f, i) => (
                    <div key={i} className="border border-surface-border rounded-xl overflow-hidden">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-subtle transition-colors">
                        <span className="font-medium text-obsidian-900 text-sm">{f.q}</span>
                        <ChevronRight className={`w-4 h-4 text-gold-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 border-t border-surface-border">
                          <p className="text-sm text-obsidian-500 leading-relaxed pt-3">{f.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-5">

              {/* Status card */}
              <div className="card p-5">
                <h3 className="font-display text-base font-medium text-obsidian-900 mb-4">Verification Status</h3>
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-amber-900 text-sm">In Progress</div>
                    <div className="text-xs text-amber-600">2 of 5 steps complete</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs">
                      {s.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-obsidian-200 flex-shrink-0" />}
                      <span className={s.done ? 'text-emerald-700 font-medium' : 'text-obsidian-500'}>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="card p-5">
                <h3 className="font-display text-base font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />Verification Benefits
                </h3>
                <div className="space-y-2.5">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-obsidian-600 leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                <div className="relative z-10">
                  <div className="text-2xl mb-3">🤝</div>
                  <h3 className="font-display text-base font-medium text-white mb-2">Need Help?</h3>
                  <p className="text-white/40 text-xs leading-relaxed mb-4">Our verification team is available to guide you through the process.</p>
                  <a href="mailto:verification@naya.ng" className="btn-primary btn-sm w-full justify-center">Contact Verification Team</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
