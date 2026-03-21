'use client'
import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  Calculator, Bot, Sparkles, Send, Loader2, TrendingUp,
  CheckCircle2, AlertCircle, ArrowRight, RefreshCw,
  DollarSign, Home, Percent, Calendar, Shield, BarChart3,
  Info, ChevronDown, MessageSquare, Building2, Users
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface CalcInputs {
  propertyPrice: number
  downPayment: number
  downPaymentPct: number
  loanType: string
  interestRate: number
  tenureYears: number
  monthlyIncome: number
  otherDebts: number
}

interface Message { role: 'user' | 'assistant'; content: string }

// ── Config ─────────────────────────────────────────────────────────────────────
const LOAN_TYPES = [
  { value: 'commercial', label: 'Commercial Bank Mortgage',    rate: 22,  desc: 'Access Bank, GTB, Zenith, UBA', minDown: 20 },
  { value: 'nhf',        label: 'NHF (Federal Mortgage Bank)', rate: 6,   desc: 'National Housing Fund — 6% fixed', minDown: 10 },
  { value: 'fmbn',       label: 'FMBN Cooperative',           rate: 9,   desc: 'Federal Mortgage Bank of Nigeria', minDown: 10 },
  { value: 'mortgage_co',label: 'Primary Mortgage Bank',       rate: 18,  desc: 'Abbey, Homebase, etc.', minDown: 15 },
  { value: 'developer',  label: 'Developer Finance',           rate: 15,  desc: 'Off-plan instalment plan', minDown: 20 },
]

const SUGGESTIONS = [
  'Can I afford a ₦120M property on ₦500K/month income?',
  'What\'s the NHF loan limit in 2026?',
  'How does the 22% commercial rate affect repayments vs NHF 6%?',
  'What deposit do I need for a ₦50M property?',
  'What income do I need to qualify for a ₦200M mortgage?',
  'Is it better to save for a larger deposit or buy now?',
]

const AI_CONTEXT = `You are Naya AI Mortgage Advisor — a specialist in Nigerian property finance for Port Harcourt and Rivers State.

CURRENT NIGERIA MORTGAGE DATA (2026):
- Commercial bank rates: 20–25% p.a. (most common: 22%)
- NHF (National Housing Fund) rate: 6% fixed (capped at ₦15M loan, ₦50M max property)
- FMBN cooperative mortgage: 9% (members only)
- Primary Mortgage Banks: 16–20%
- Developer finance (off-plan): 12–18%
- Max loan tenure: 20 years (commercial), 30 years (NHF)
- Typical down payment: 20–30% (commercial), 10% (NHF)
- Debt-to-income ratio limit: 33% (most banks), 40% (some lenders)
- Standard DSCR requirement: 1.2x

NHF ELIGIBILITY:
- Must be employed or self-employed contributing to NHF
- Min 6 months contributions at 2.5% of monthly salary
- Max loan: ₦15M (employees), ₦5M (self-employed)
- Property value limit: ₦50M

QUALIFICATION RULE OF THUMB:
- Monthly payment should not exceed 33% of gross monthly income
- Total debt payments (including mortgage) should not exceed 40% of income
- Minimum income for ₦50M property (22% rate, 20yr): ~₦250K/month
- Minimum income for ₦100M property (22% rate, 20yr): ~₦500K/month
- Minimum income for ₦200M property (22% rate, 20yr): ~₦1M/month

PORT HARCOURT CONTEXT:
- Average 3-bed in GRA: ₦385M (sale) — typically purchased by corporates outright
- Average 3-bed in Woji: ₦165M — popular with mortgage buyers
- Average 2-bed in Rumuola: ₦75M — most accessible for first-time buyers with NHF
- Most PH buyers at ₦50–100M use NHF or developer finance
- Above ₦100M, most buyers are cash or commercial mortgage

INSTRUCTIONS:
- Be direct, practical, and Nigeria-specific
- Always mention which loan type is best for the scenario
- Use ₦ for all naira amounts
- Highlight NHF as the best rate (6%) whenever applicable
- Warn if DTI ratio exceeds 33%
- Keep responses under 200 words unless detailed analysis requested
- Always include a practical next step`

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toFixed(0)}`
}
function fmtInput(n: number) {
  return n === 0 ? '' : n.toLocaleString()
}
function parseInput(s: string) {
  return Number(s.replace(/,/g, '')) || 0
}

// ── Mortgage maths ─────────────────────────────────────────────────────────────
function calcMortgage(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return null
  const r = annualRate / 100 / 12
  const n = years * 12
  if (annualRate === 0) return { monthly: principal / n, total: principal, interest: 0, schedule: [] }
  const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const total = monthly * n
  const interest = total - principal

  // Amortisation schedule — yearly summary
  const schedule: { year: number; principal: number; interest: number; balance: number }[] = []
  let balance = principal
  for (let yr = 1; yr <= years; yr++) {
    let yrPrincipal = 0, yrInterest = 0
    for (let mo = 0; mo < 12; mo++) {
      const intPmt = balance * r
      const prinPmt = monthly - intPmt
      yrInterest += intPmt
      yrPrincipal += prinPmt
      balance -= prinPmt
    }
    schedule.push({ year: yr, principal: yrPrincipal, interest: yrInterest, balance: Math.max(0, balance) })
  }
  return { monthly, total, interest, schedule }
}

// ── Typing dots ────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-surface-subtle rounded-2xl rounded-tl-sm w-fit">
      {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-obsidian-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </div>
  )
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function AmortChart({ schedule }: { schedule: { year: number; principal: number; interest: number; balance: number }[] }) {
  if (!schedule.length) return null
  const maxYrPmt = Math.max(...schedule.map(s => s.principal + s.interest))
  return (
    <div>
      <div className="flex items-end gap-0.5 h-24 mb-1">
        {schedule.map((s, i) => {
          const total = s.principal + s.interest
          const prinH = (s.principal / maxYrPmt) * 100
          const intH = (s.interest / maxYrPmt) * 100
          return (
            <div key={i} className="flex-1 flex flex-col justify-end gap-0" title={`Year ${s.year}: Principal ${fmt(s.principal)}, Interest ${fmt(s.interest)}`}>
              <div className="w-full bg-gold-500 rounded-sm" style={{ height: `${prinH}%` }} />
              <div className="w-full bg-gold-200 rounded-sm" style={{ height: `${intH}%` }} />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] text-obsidian-400 font-mono">
        <span>Yr 1</span>
        <span>Yr {Math.floor(schedule.length / 2)}</span>
        <span>Yr {schedule.length}</span>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gold-500" /><span className="text-[10px] text-obsidian-500">Principal</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gold-200" /><span className="text-[10px] text-obsidian-500">Interest</span></div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MortgagePage() {
  const [inputs, setInputs] = useState<CalcInputs>({
    propertyPrice: 85000000, downPayment: 17000000, downPaymentPct: 20,
    loanType: 'commercial', interestRate: 22, tenureYears: 20,
    monthlyIncome: 500000, otherDebts: 0,
  })
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "I'm **Naya AI Mortgage Advisor** — I can help you understand Nigerian mortgage options, calculate affordability, and find the best loan for your situation.\n\nAsk me anything about NHF loans, commercial bank rates, or what income you need to qualify for a specific property.",
  }])
  const [chatInput, setChatInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedLoan = LOAN_TYPES.find(l => l.value === inputs.loanType) || LOAN_TYPES[0]

  const update = (field: keyof CalcInputs, val: number | string) => {
    setInputs(prev => {
      const next = { ...prev, [field]: val }
      // Sync down payment / pct
      if (field === 'propertyPrice' || field === 'downPaymentPct') {
        const price = field === 'propertyPrice' ? Number(val) : prev.propertyPrice
        const pct = field === 'downPaymentPct' ? Number(val) : prev.downPaymentPct
        next.downPayment = Math.round(price * pct / 100)
      }
      if (field === 'downPayment') {
        next.downPaymentPct = prev.propertyPrice > 0 ? Math.round((Number(val) / prev.propertyPrice) * 100) : 0
      }
      if (field === 'loanType') {
        const loan = LOAN_TYPES.find(l => l.value === val)
        if (loan) next.interestRate = loan.rate
      }
      return next
    })
  }

  const loanAmount = inputs.propertyPrice - inputs.downPayment
  const result = useMemo(() => calcMortgage(loanAmount, inputs.interestRate, inputs.tenureYears), [loanAmount, inputs.interestRate, inputs.tenureYears])

  const dti = result ? ((result.monthly + inputs.otherDebts) / inputs.monthlyIncome) * 100 : 0
  const canAfford = dti <= 33
  const borderlineAfford = dti > 33 && dti <= 40
  const affordStatus = canAfford ? 'good' : borderlineAfford ? 'borderline' : 'poor'

  const minRequiredIncome = result ? ((result.monthly + inputs.otherDebts) / 0.33) : 0
  const maxAffordableProperty = useMemo(() => {
    // Work backwards from 33% DTI
    const maxMonthly = inputs.monthlyIncome * 0.33 - inputs.otherDebts
    if (maxMonthly <= 0) return 0
    const r = inputs.interestRate / 100 / 12
    const n = inputs.tenureYears * 12
    const maxLoan = r === 0 ? maxMonthly * n : maxLoan => maxLoan
    // Newton approximation
    const maxLoanCalc = maxMonthly * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
    return maxLoanCalc / (1 - inputs.downPaymentPct / 100)
  }, [inputs.monthlyIncome, inputs.otherDebts, inputs.interestRate, inputs.tenureYears, inputs.downPaymentPct])

  const sendAI = async (text?: string) => {
    const msg = text || chatInput.trim()
    if (!msg || aiLoading) return
    setChatInput('')
    const context = result ? `\n\nCURRENT CALCULATION: Property ₦${inputs.propertyPrice.toLocaleString()}, Loan ₦${loanAmount.toLocaleString()}, Rate ${inputs.interestRate}%, ${inputs.tenureYears}yrs, Monthly payment ${fmt(result.monthly)}, DTI ${dti.toFixed(1)}%, Income ₦${inputs.monthlyIncome.toLocaleString()}/mo` : ''
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setAiLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: AI_CONTEXT + context,
          messages: [...messages, { role: 'user', content: msg }].map(m => ({ role: m.role, content: m.content })),
        })
      })
      const data = await response.json()
      const reply = data.content || 'Sorry, I could not generate a response. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting. Please try again in a moment.' }])
    } finally {
      setAiLoading(false)
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const renderMsg = (content: string) => content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')

  const faqs = [
    { q: 'What is the NHF mortgage and who qualifies?', a: 'The National Housing Fund (NHF) is administered by the Federal Mortgage Bank of Nigeria (FMBN). It offers 6% fixed-rate mortgages to Nigerians who have been contributing 2.5% of their salary to the fund for at least 6 months. The maximum loan is ₦15M for employees and ₦5M for self-employed, with a property value cap of ₦50M. It is the best rate available in Nigeria by far.' },
    { q: 'What is the typical down payment in Nigeria?', a: 'Commercial banks require 20–30% down payment. NHF and FMBN require as little as 10%. Developer finance varies from 20–40%. Some new developments offer 5–10% deposit with balance on completion. The larger your deposit, the lower your monthly payment and interest burden.' },
    { q: 'Can self-employed people get a mortgage in Nigeria?', a: 'Yes, but it is harder. Banks typically require 2 years of audited accounts, bank statements, and evidence of consistent income. Self-employed borrowers often face higher rates and may be capped at lower loan-to-value ratios. NHF is available to self-employed contributors but capped at ₦5M.' },
    { q: 'What is the debt-to-income (DTI) ratio?', a: 'DTI is your total monthly debt payments divided by your gross monthly income. Most Nigerian banks will not approve mortgages where total debt exceeds 33% of your income. Some lenders go to 40%. If your DTI exceeds 33%, you either need a higher income, a larger deposit, or a longer tenure to bring monthly payments down.' },
    { q: 'What documents do I need to apply for a mortgage in Nigeria?', a: 'Typically: 6 months bank statements, 3 months payslips (or 2 years audited accounts for self-employed), employment letter, tax clearance certificate, means of identification, property title documents (C of O or equivalent), and property valuation report from an NIESV-registered valuer.' },
  ]

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Bot className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">AI-Powered · Nigeria Mortgage Calculator</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-5">
              Mortgage<br /><span className="gold-text">Calculator</span>
            </h1>
            <p className="text-white/40 text-xl font-light max-w-2xl mx-auto mb-6">
              Calculate NHF, commercial, and developer finance repayments instantly. Then ask Naya AI for personalised advice on Nigerian mortgages.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/30">
              {[
                { icon: Calculator, label: 'NHF 6% & Commercial rates' },
                { icon: BarChart3, label: 'Amortisation schedule' },
                { icon: Bot, label: 'AI mortgage advisor' },
                { icon: Shield, label: 'Affordability check' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2"><item.icon className="w-4 h-4 text-gold-500" />{item.label}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── INPUTS (left) ─────────────────────────────────────────── */}
            <div className="lg:col-span-1 space-y-5">

              {/* Loan type selector */}
              <div className="card p-5">
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4">Loan Type</h3>
                <div className="space-y-2">
                  {LOAN_TYPES.map(lt => (
                    <button key={lt.value} onClick={() => update('loanType', lt.value)}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${inputs.loanType === lt.value ? 'bg-gold-500 border-gold-500' : 'bg-surface-subtle border-surface-border hover:border-gold-300'}`}>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${inputs.loanType === lt.value ? 'text-obsidian-900' : 'text-obsidian-800'}`}>{lt.label}</div>
                        <div className={`text-[10px] mt-0.5 ${inputs.loanType === lt.value ? 'text-obsidian-700' : 'text-obsidian-400'}`}>{lt.desc}</div>
                      </div>
                      <div className={`font-mono text-sm font-bold flex-shrink-0 mt-0.5 ${inputs.loanType === lt.value ? 'text-obsidian-900' : 'text-gold-600'}`}>{lt.rate}%</div>
                    </button>
                  ))}
                </div>
                {inputs.loanType === 'nhf' && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 leading-relaxed">
                    <strong>NHF Note:</strong> Capped at ₦15M loan for employees, ₦50M max property value. Requires active NHF contributions.
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display text-lg font-medium text-obsidian-900">Loan Details</h3>

                <div>
                  <label className="input-label">Property Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 font-mono text-sm">₦</span>
                    <input type="text" className="input-field pl-7 text-sm font-mono"
                      value={fmtInput(inputs.propertyPrice)}
                      onChange={e => update('propertyPrice', parseInput(e.target.value))} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="input-label mb-0">Down Payment</label>
                    <span className="font-mono text-xs font-bold text-gold-600">{inputs.downPaymentPct}%</span>
                  </div>
                  <input type="range" min={selectedLoan.minDown} max={50} step={5} value={inputs.downPaymentPct}
                    onChange={e => update('downPaymentPct', Number(e.target.value))}
                    className="w-full accent-gold-500 mb-2" />
                  <div className="flex justify-between text-[10px] text-obsidian-400 font-mono">
                    <span>{selectedLoan.minDown}% (min)</span>
                    <span className="text-gold-600 font-bold">{fmt(inputs.downPayment)}</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="input-label">Interest Rate (% p.a.)</label>
                  <div className="relative">
                    <input type="number" step="0.5" className="input-field pr-8 text-sm font-mono"
                      value={inputs.interestRate}
                      onChange={e => update('interestRate', Number(e.target.value))} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="input-label mb-0">Tenure</label>
                    <span className="font-mono text-xs font-bold text-gold-600">{inputs.tenureYears} years</span>
                  </div>
                  <input type="range" min={5} max={30} step={1} value={inputs.tenureYears}
                    onChange={e => update('tenureYears', Number(e.target.value))}
                    className="w-full accent-gold-500 mb-1" />
                  <div className="flex justify-between text-[10px] text-obsidian-400 font-mono">
                    <span>5 yrs</span><span>30 yrs</span>
                  </div>
                </div>
              </div>

              {/* Affordability inputs */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display text-lg font-medium text-obsidian-900">Affordability Check</h3>
                <div>
                  <label className="input-label">Gross Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 font-mono text-sm">₦</span>
                    <input type="text" className="input-field pl-7 text-sm font-mono"
                      value={fmtInput(inputs.monthlyIncome)}
                      onChange={e => update('monthlyIncome', parseInput(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Other Monthly Debts</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 font-mono text-sm">₦</span>
                    <input type="text" className="input-field pl-7 text-sm font-mono"
                      placeholder="Car loan, personal loan..."
                      value={fmtInput(inputs.otherDebts)}
                      onChange={e => update('otherDebts', parseInput(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RESULTS + AI (right) ───────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Primary Result Card */}
              <div className="card overflow-hidden">
                <div className="bg-obsidian-900 relative overflow-hidden px-6 py-6">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Monthly Repayment</div>
                        <div className="font-display text-5xl font-light text-gold-400">
                          {result ? fmt(result.monthly) : '—'}
                        </div>
                        <div className="text-white/30 text-sm mt-1">per month for {inputs.tenureYears} years</div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div>
                          <div className="text-white/30 text-xs">Loan Amount</div>
                          <div className="text-white font-display text-xl">{fmt(loanAmount)}</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-xs">Total Interest</div>
                          <div className="text-rose-400 font-display text-xl">{result ? fmt(result.interest) : '—'}</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-xs">Total Repayable</div>
                          <div className="text-white/80 font-display text-xl">{result ? fmt(result.total) : '—'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-surface-border">
                  {[
                    { label: 'Down Payment', value: fmt(inputs.downPayment), sub: `${inputs.downPaymentPct}% of price` },
                    { label: 'Loan-to-Value', value: `${100 - inputs.downPaymentPct}%`, sub: 'LTV ratio' },
                    { label: 'Rate (p.a.)', value: `${inputs.interestRate}%`, sub: selectedLoan.label.split(' ')[0] },
                    { label: 'Total Payments', value: `${inputs.tenureYears * 12}`, sub: 'monthly instalments' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 text-center">
                      <div className="font-display text-lg font-medium text-obsidian-900">{s.value}</div>
                      <div className="text-xs font-medium text-obsidian-600 mt-0.5">{s.label}</div>
                      <div className="text-[10px] text-obsidian-400">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affordability Meter */}
              {inputs.monthlyIncome > 0 && result && (
                <div className={`card p-5 border-l-4 ${affordStatus === 'good' ? 'border-emerald-500 bg-emerald-50' : affordStatus === 'borderline' ? 'border-amber-500 bg-amber-50' : 'border-rose-500 bg-rose-50'}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {affordStatus === 'good'
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          : <AlertCircle className="w-5 h-5 text-amber-600" />}
                        <span className={`font-semibold text-sm ${affordStatus === 'good' ? 'text-emerald-900' : affordStatus === 'borderline' ? 'text-amber-900' : 'text-rose-900'}`}>
                          {affordStatus === 'good' ? 'Affordable ✓' : affordStatus === 'borderline' ? 'Borderline — banks may decline' : 'Too expensive at current income'}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${affordStatus === 'good' ? 'text-emerald-700' : affordStatus === 'borderline' ? 'text-amber-700' : 'text-rose-700'}`}>
                        {affordStatus === 'good'
                          ? `Your mortgage payments represent ${dti.toFixed(1)}% of your income — within the 33% guideline.`
                          : affordStatus === 'borderline'
                          ? `At ${dti.toFixed(1)}% of income, most banks will decline. Target below 33%.`
                          : `At ${dti.toFixed(1)}% of income, this is not financeable. You need ₦${fmt(minRequiredIncome)}/month income.`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-mono text-2xl font-bold ${affordStatus === 'good' ? 'text-emerald-700' : affordStatus === 'borderline' ? 'text-amber-700' : 'text-rose-700'}`}>{dti.toFixed(1)}%</div>
                      <div className="text-xs text-obsidian-500">DTI ratio</div>
                    </div>
                  </div>

                  {/* DTI bar */}
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all duration-500 ${affordStatus === 'good' ? 'bg-emerald-500' : affordStatus === 'borderline' ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(dti, 60) / 60 * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-obsidian-500">
                    <span>0%</span><span className="text-emerald-600">33% ideal</span><span className="text-amber-600">40% max</span><span>60%</span>
                  </div>

                  {/* Max affordable property */}
                  {maxAffordableProperty > 0 && (
                    <div className={`mt-4 pt-4 border-t ${affordStatus === 'good' ? 'border-emerald-200' : affordStatus === 'borderline' ? 'border-amber-200' : 'border-rose-200'}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className={affordStatus === 'good' ? 'text-emerald-700' : 'text-rose-700'}>
                          Max affordable property at your income:
                        </span>
                        <span className="font-mono font-bold text-obsidian-900">{fmt(maxAffordableProperty)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rate comparison */}
              <div className="card p-5">
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gold-500" />Rate Comparison
                </h3>
                <div className="space-y-3">
                  {LOAN_TYPES.map(lt => {
                    const r = calcMortgage(loanAmount, lt.rate, inputs.tenureYears)
                    const maxMonthly = Math.max(...LOAN_TYPES.map(l => calcMortgage(loanAmount, l.rate, inputs.tenureYears)?.monthly || 0))
                    const pct = r ? (r.monthly / maxMonthly) * 100 : 0
                    const isSelected = lt.value === inputs.loanType
                    return (
                      <div key={lt.value} className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${isSelected ? 'bg-gold-50 border border-gold-200' : 'hover:bg-surface-subtle'}`}
                        onClick={() => update('loanType', lt.value)}>
                        <div className="w-24 flex-shrink-0">
                          <div className="font-semibold text-xs text-obsidian-800">{lt.label.split(' ')[0] === 'NHF' ? 'NHF 6%' : `${lt.rate}% ${lt.label.split(' ')[0]}`}</div>
                          <div className="font-mono text-sm font-bold text-gold-600">{r ? fmt(r.monthly) : '—'}/mo</div>
                        </div>
                        <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isSelected ? 'bg-gold-500' : 'bg-obsidian-200'}`} style={{ width: `${pct}%` }} />
                        </div>
                        {isSelected && <span className="text-[10px] text-gold-600 font-medium flex-shrink-0">Selected</span>}
                        {lt.value === 'nhf' && <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">Best rate</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Amortisation chart */}
              {result && (
                <div className="card p-5">
                  <button className="w-full flex items-center justify-between mb-4" onClick={() => setShowSchedule(!showSchedule)}>
                    <h3 className="font-display text-lg font-medium text-obsidian-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold-500" />Amortisation Schedule
                    </h3>
                    <ChevronDown className={`w-4 h-4 text-gold-500 transition-transform ${showSchedule ? 'rotate-180' : ''}`} />
                  </button>

                  <AmortChart schedule={result.schedule} />

                  {showSchedule && (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b-2 border-obsidian-900">
                            <th className="text-left py-2 px-2 font-mono text-obsidian-400 uppercase tracking-wider">Year</th>
                            <th className="text-right py-2 px-2 font-mono text-obsidian-400 uppercase tracking-wider">Principal</th>
                            <th className="text-right py-2 px-2 font-mono text-obsidian-400 uppercase tracking-wider">Interest</th>
                            <th className="text-right py-2 px-2 font-mono text-obsidian-400 uppercase tracking-wider">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.map((s, i) => (
                            <tr key={i} className={`border-b border-surface-border ${i % 2 === 0 ? 'bg-surface-subtle/30' : ''}`}>
                              <td className="py-2 px-2 font-mono font-bold text-obsidian-900">Yr {s.year}</td>
                              <td className="py-2 px-2 text-right font-mono text-emerald-600">{fmt(s.principal)}</td>
                              <td className="py-2 px-2 text-right font-mono text-rose-500">{fmt(s.interest)}</td>
                              <td className="py-2 px-2 text-right font-mono text-obsidian-700">{fmt(s.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── AI ADVISOR ──────────────────────────────────────────── */}
              <div className="card overflow-hidden border-gold-200">
                {/* Header */}
                <div className="bg-obsidian-900 relative overflow-hidden px-5 py-4">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gold-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-obsidian-900" />
                    </div>
                    <div>
                      <div className="text-white font-semibold flex items-center gap-2 text-sm">
                        Naya AI Mortgage Advisor
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Online
                        </span>
                      </div>
                      <div className="text-white/40 text-xs">Powered by Claude · Nigerian mortgage expert</div>
                    </div>
                  </div>
                </div>

                {/* Suggested questions */}
                <div className="p-4 border-b border-surface-border bg-surface-subtle/50">
                  <div className="text-xs text-obsidian-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-gold-500" />Ask instantly
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((q, i) => (
                      <button key={i} onClick={() => sendAI(q)}
                        className="text-[10px] px-2.5 py-1.5 rounded-full bg-white text-obsidian-600 border border-surface-border hover:border-gold-400 hover:text-gold-600 transition-all text-left">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-xl bg-gold-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3.5 h-3.5 text-obsidian-900" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-obsidian-900 text-white rounded-tr-sm' : 'bg-surface-subtle text-obsidian-700 rounded-tl-sm border border-surface-border'}`}
                        dangerouslySetInnerHTML={{ __html: renderMsg(msg.content) }} />
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-xl bg-obsidian-200 flex items-center justify-center flex-shrink-0 mt-1">
                          <Users className="w-3.5 h-3.5 text-obsidian-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gold-500 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-obsidian-900" /></div>
                      <TypingDots />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-surface-border bg-white">
                  <div className="flex gap-2">
                    <input className="flex-1 input-field text-sm"
                      placeholder="Ask about NHF eligibility, bank rates, affordability..."
                      value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendAI()}
                      disabled={aiLoading} />
                    <button onClick={() => sendAI()} disabled={!chatInput.trim() || aiLoading}
                      className="btn-primary px-4 flex-shrink-0 disabled:opacity-50">
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-obsidian-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-gold-500" />Powered by Claude AI · Not financial advice
                    </span>
                    <button onClick={() => setMessages([messages[0]])} className="text-[10px] text-obsidian-400 hover:text-gold-600 flex items-center gap-1 transition-colors">
                      <RefreshCw className="w-2.5 h-2.5" />Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-number">Mortgage Knowledge</span>
              <h2 className="section-title">Nigerian Mortgage FAQs</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-subtle transition-colors">
                    <span className="font-medium text-obsidian-900 text-sm pr-4">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gold-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-surface-border pt-4">
                      <p className="text-sm text-obsidian-500 leading-relaxed">{f.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER + CTA ─────────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="card p-5 bg-amber-50 border-amber-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 text-sm mb-1">Disclaimer</div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    This calculator provides estimates only and does not constitute financial advice. Actual loan terms, rates, and eligibility depend on your lender, credit history, and property valuation. Always consult a licensed mortgage advisor or bank before making financial decisions. Interest rates shown are indicative based on Q1 2026 market data.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-3">Ready to Apply?</h2>
              <p className="text-obsidian-400 text-sm mb-6 max-w-md mx-auto">Our agents can connect you with verified mortgage advisors and bank representatives in Port Harcourt.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact" className="btn-primary">Speak to a Mortgage Advisor <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/tools/valuation" className="btn-secondary">Value Your Property</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
