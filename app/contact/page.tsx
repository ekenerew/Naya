'use client'
import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'How do I list my property on Naya?', a: 'Create a free agent account on our portal, complete your RSSPC verification, and you can start listing within 24 hours. Our team reviews every listing before it goes live.' },
  { q: 'How are agents verified on Naya?', a: 'Every agent must provide their RSSPC licence number, CAC registration, and a valid government ID. Our team manually verifies each document before approving the account.' },
  { q: 'Is Naya free to use for property seekers?', a: 'Yes — searching, saving listings, and contacting agents is completely free for property seekers. We charge agents and landlords for premium listing features.' },
  { q: 'How do I report a fake or fraudulent listing?', a: 'Tap the Report button on any listing page or email us at trust@naya.ng. We investigate all reports within 24 hours and remove fraudulent listings immediately.' },
  { q: 'Can I list my property without an agent?', a: 'Yes. Landlords can list directly on Naya. You will need to complete a basic verification and your listing will be reviewed before going live.' },
  { q: 'Which areas does Naya currently cover?', a: 'We currently cover 6 major neighbourhoods in Port Harcourt — GRA Phase 2, Old GRA, Trans Amadi, Rumuola, Woji, and Eleme. We are expanding to Lagos and Abuja in 2026.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', type: 'General Enquiry' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Get In Touch</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-5">
            We Are Here<br />
            <span className="gold-text">to Help You</span>
          </h1>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Whether you have a question about a listing, need help as an agent, or want to report a suspicious property — our team responds within 2 hours.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              { icon: Phone, label: 'Call Us', value: '+234 816 811 7004', sub: 'Mon–Fri, 8am–6pm', href: 'tel:+2348168117004', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', sub: 'Typically replies in 1hr', href: 'https://wa.me/2348168117004', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: Mail, label: 'Email Us', value: 'hello@naya.ng', sub: 'We reply within 2 hours', href: 'mailto:hello@naya.ng', color: 'text-gold-600', bg: 'bg-gold-50' },
              { icon: MapPin, label: 'Visit Us', value: 'GRA Phase 2, PH', sub: '23 Aba Road, Rivers State', href: '#map', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <a key={i} href={item.href} className="card p-6 flex flex-col items-center text-center hover:border-gold-200 group">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="font-mono text-xs text-obsidian-400 tracking-widest uppercase mb-1">{item.label}</div>
                <div className="font-semibold text-obsidian-900 text-sm mb-1">{item.value}</div>
                <div className="text-xs text-obsidian-400">{item.sub}</div>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="card p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Message Received!</h3>
                    <p className="text-obsidian-400 mb-2">Thank you, <span className="font-semibold text-obsidian-700">{form.name}</span>.</p>
                    <p className="text-obsidian-400 text-sm mb-8">Our team will respond to <span className="text-gold-600">{form.email}</span> within 2 hours during business hours.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '', type: 'General Enquiry' }) }} className="btn-secondary">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Send Us a Message</h2>
                      <p className="text-obsidian-400 text-sm">Fill in the form and we will get back to you within 2 hours.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="input-label">What can we help with?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['General Enquiry', 'Property Listing', 'Agent Support', 'Report Fraud', 'Partnership', 'Press'].map(type => (
                            <button key={type} type="button" onClick={() => setForm({ ...form, type })}
                              className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${form.type === type ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="input-label">Full Name *</label>
                          <input required className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                          <label className="input-label">Phone Number</label>
                          <input className="input-field" placeholder="+234 xxx xxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="input-label">Email Address *</label>
                        <input required type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">Subject</label>
                        <input className="input-field" placeholder="Brief subject of your message" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">Message *</label>
                        <textarea required className="input-field resize-none h-32" placeholder="Tell us how we can help you..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                      </div>
                      <button type="submit" className="btn-primary w-full justify-center">
                        <Send className="w-4 h-4" />Send Message
                      </button>
                      <p className="text-xs text-obsidian-300 text-center">We respect your privacy. Your details are never shared with third parties.</p>
                    </form>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div className="card p-6">
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-500" />Port Harcourt HQ
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3"><MapPin className="w-4 h-4 text-obsidian-300 flex-shrink-0 mt-0.5" /><span className="text-sm text-obsidian-500">23 Aba Road, GRA Phase 2, Port Harcourt, Rivers State</span></div>
                  <a href="tel:+2348168117004" className="flex gap-3 hover:text-gold-600 transition-colors group"><Phone className="w-4 h-4 text-obsidian-300 flex-shrink-0 mt-0.5 group-hover:text-gold-500" /><span className="text-sm text-obsidian-500 group-hover:text-gold-600">+234 816 811 7004</span></a>
                  <a href="mailto:hello@naya.ng" className="flex gap-3 hover:text-gold-600 transition-colors group"><Mail className="w-4 h-4 text-obsidian-300 flex-shrink-0 mt-0.5 group-hover:text-gold-500" /><span className="text-sm text-obsidian-500 group-hover:text-gold-600">hello@naya.ng</span></a>
                  <div className="flex gap-3"><Clock className="w-4 h-4 text-obsidian-300 flex-shrink-0 mt-0.5" /><span className="text-sm text-obsidian-500">Mon – Fri: 8am – 6pm</span></div>
                </div>
                <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-5">
                  <MessageCircle className="w-4 h-4" />WhatsApp Us Now
                </a>
              </div>

              <div className="card p-6">
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4">Specific Enquiries</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Agent Onboarding', email: 'agents@naya.ng' },
                    { label: 'Report Fraud', email: 'trust@naya.ng' },
                    { label: 'Press and Media', email: 'press@naya.ng' },
                    { label: 'Investor Relations', email: 'invest@naya.ng' },
                    { label: 'Partnerships', email: 'partners@naya.ng' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                      <span className="text-xs text-obsidian-500">{item.label}</span>
                      <a href={`mailto:${item.email}`} className="text-xs text-gold-600 font-mono hover:text-gold-500 transition-colors">{item.email}</a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5 bg-gold-50 border-gold-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-obsidian-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-obsidian-900 text-sm">Fast Response Guarantee</div>
                    <div className="text-xs text-obsidian-500 mt-0.5">All messages answered within 2 hours on business days. WhatsApp is fastest for urgent enquiries.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="bg-white py-8">
        <div className="page-container">
          <div className="rounded-3xl overflow-hidden border border-surface-border h-64 bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 flex items-center justify-center relative">
            <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            <div className="text-center relative z-10">
              <div className="text-5xl mb-3">📍</div>
              <p className="text-white/60 text-sm">23 Aba Road, GRA Phase 2</p>
              <p className="text-white/40 text-xs mt-1">Port Harcourt, Rivers State</p>
              <a href="https://maps.google.com?q=GRA+Phase+2+Port+Harcourt" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm mt-4 inline-flex">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-number">FAQs</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-subtle transition-colors">
                    <span className="font-medium text-obsidian-900 text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gold-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-surface-border">
                      <p className="text-sm text-obsidian-500 leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
