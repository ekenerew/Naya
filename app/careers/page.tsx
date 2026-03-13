'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, ArrowRight, ChevronDown, Zap, Heart, TrendingUp, Users, Star, CheckCircle2 } from 'lucide-react'

const openRoles = [
  {
    id: 1, title: 'Senior Full-Stack Engineer', dept: 'Engineering', type: 'Full-time', location: 'Port Harcourt / Remote', level: 'Senior',
    desc: 'Build the core marketplace infrastructure powering Nigeria\'s most trusted property platform. You will own end-to-end features from database to UI.',
    skills: ['React / Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 2, title: 'Product Designer (UI/UX)', dept: 'Design', type: 'Full-time', location: 'Port Harcourt / Hybrid', level: 'Mid-Senior',
    desc: 'Design experiences that make finding a home in Nigeria feel effortless and trustworthy. Own the design system and user research process.',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
  },
  {
    id: 3, title: 'Agent Relations Manager', dept: 'Operations', type: 'Full-time', location: 'Port Harcourt', level: 'Mid',
    desc: 'Be the face of Naya to our agent community. Onboard, verify, train, and retain RSSPC-certified agents across Port Harcourt and Rivers State.',
    skills: ['Real Estate Knowledge', 'Relationship Management', 'KYC Processes'],
  },
  {
    id: 4, title: 'Growth & Marketing Lead', dept: 'Marketing', type: 'Full-time', location: 'Port Harcourt / Remote', level: 'Senior',
    desc: 'Own user acquisition and brand growth for Naya. Drive SEO, paid campaigns, social media, and partnerships with developers and agencies.',
    skills: ['Digital Marketing', 'SEO/SEM', 'Analytics', 'Content Strategy'],
  },
  {
    id: 5, title: 'Backend Engineer (API)', dept: 'Engineering', type: 'Full-time', location: 'Remote', level: 'Mid',
    desc: 'Build the APIs, integrations, and data pipelines that power Naya\'s listings, agent verification, and payment flows.',
    skills: ['Node.js / Python', 'REST APIs', 'PostgreSQL', 'Paystack Integration'],
  },
  {
    id: 6, title: 'Customer Success Associate', dept: 'Operations', type: 'Full-time', location: 'Port Harcourt', level: 'Junior',
    desc: 'Be the first point of contact for property seekers and agents. Resolve issues, gather feedback, and champion the user experience internally.',
    skills: ['Customer Service', 'CRM Tools', 'Problem Solving'],
  },
]

const perks = [
  { icon: TrendingUp, title: 'Equity Participation', desc: 'Every team member gets a stake in Naya. We build this together, we win together.', color: 'text-gold-600', bg: 'bg-gold-50' },
  { icon: Zap, title: 'Remote-Friendly', desc: 'Most roles are hybrid or remote. We care about output, not office hours.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Heart, title: 'Health Coverage', desc: 'Full HMO for you and your immediate family. Your wellbeing is not negotiable.', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Star, title: 'Learning Budget', desc: '₦200,000 annual budget for courses, conferences, and certifications.', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Users, title: 'Small, Elite Team', desc: 'Work alongside exceptional people. No bureaucracy. High ownership. Real impact.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: CheckCircle2, title: 'Mission That Matters', desc: 'Every line of code, every deal closed, every listing verified helps protect real Nigerians.', color: 'text-obsidian-600', bg: 'bg-obsidian-50' },
]

const depts = ['All', 'Engineering', 'Design', 'Operations', 'Marketing']

export default function CareersPage() {
  const [activeDept, setActiveDept] = useState('All')
  const [openRole, setOpenRole] = useState<number | null>(null)

  const filtered = activeDept === 'All' ? openRoles : openRoles.filter(r => r.dept === activeDept)

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Join the Team</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-tight mb-6">
            Help Us Fix<br />
            <span className="gold-text">Nigerian Real Estate</span>
          </h1>
          <p className="text-white/40 text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Naya is building the most trusted property marketplace in Nigeria. We are looking for exceptional people who want their work to matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#roles" className="btn-primary btn-lg">View Open Roles <ArrowRight className="w-5 h-5" /></a>
            <a href="mailto:careers@naya.ng" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">Send Speculative CV</a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* MISSION STATEMENT */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-number">Why Join Naya</span>
            <h2 className="section-title mb-6">We Are Not Just Building a Website</h2>
            <p className="text-obsidian-500 text-lg leading-relaxed mb-6">
              Millions of Nigerians are exploited every year by a broken property market — fake listings, ghost agents, inflated prices, stolen deposits. Naya is the infrastructure that fixes this.
            </p>
            <p className="text-obsidian-500 leading-relaxed">
              If you join us, your work will directly protect real families. That is not a line on a pitch deck — it is the reason this company exists.
            </p>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Life at Naya</span>
            <h2 className="section-title">What We Offer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map((p, i) => (
              <div key={i} className="card p-6">
                <div className={`w-12 h-12 rounded-2xl ${p.bg} flex items-center justify-center mb-4`}>
                  <p.icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-2">{p.title}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section id="roles" className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Open Positions</span>
            <h2 className="section-title">Current Openings</h2>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {depts.map(d => (
              <button key={d} onClick={() => setActiveDept(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeDept === d ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-white text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {filtered.map(role => (
              <div key={role.id} className="card overflow-hidden">
                <button onClick={() => setOpenRole(openRole === role.id ? null : role.id)}
                  className="w-full p-6 text-left hover:bg-surface-subtle transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200 font-medium">{role.dept}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{role.level}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{role.type}</span>
                      </div>
                      <h3 className="font-display text-xl font-medium text-obsidian-900 mb-1">{role.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                        <MapPin className="w-3.5 h-3.5" />{role.location}
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gold-500 flex-shrink-0 mt-1 transition-transform duration-200 ${openRole === role.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {openRole === role.id && (
                  <div className="px-6 pb-6 border-t border-surface-border pt-5">
                    <p className="text-sm text-obsidian-500 leading-relaxed mb-4">{role.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {role.skills.map(s => (
                        <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-obsidian-900 text-white">{s}</span>
                      ))}
                    </div>
                    <a href={`mailto:careers@naya.ng?subject=Application: ${role.title}`}
                      className="btn-primary">
                      Apply for this Role <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-obsidian-400">No open roles in this department right now.</div>
            )}
          </div>

          {/* Speculative */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="card p-6 bg-obsidian-900 text-center">
              <h3 className="font-display text-xl font-medium text-white mb-2">Do Not See Your Role?</h3>
              <p className="text-white/40 text-sm mb-4">We hire for talent, not just open positions. Send your CV and tell us how you would contribute.</p>
              <a href="mailto:careers@naya.ng" className="btn-primary">Send Speculative Application</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">How We Hire</span>
            <h2 className="section-title">Our Hiring Process</h2>
            <p className="section-desc mx-auto">Transparent, fast, and respectful of your time. Most roles close within 3 weeks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Application', desc: 'Submit your CV and a short note on why Naya. We read every application personally.' },
              { step: '02', title: 'Screening Call', desc: '30 minutes with our team to discuss your background, the role, and mutual fit.' },
              { step: '03', title: 'Skills Assessment', desc: 'A focused, paid task relevant to the role. We value your time and compensate for it.' },
              { step: '04', title: 'Final Interview', desc: 'Meet the founder and team. We make decisions within 5 business days.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-obsidian-900 text-white font-mono text-sm font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-2">{s.title}</h3>
                <p className="text-xs text-obsidian-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
