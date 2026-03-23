'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Home, Calculator, TrendingUp, ArrowRight, CheckCircle2, Info, ChevronRight } from 'lucide-react'

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n/1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `₦${(n/1_000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

const banks = [
  { name: 'Federal Mortgage Bank', rate: 6, maxTenure: 30, minDeposit: 10, logo: '🏛' },
  { name: 'Family Homes Fund',     rate: 9, maxTenure: 20, minDeposit: 5,  logo: '🏠' },
  { name: 'First Bank Mortgage',   rate: 18, maxTenure: 15, minDeposit: 20, logo: '🏦' },
  { name: 'GTB Mortgage',          rate: 19, maxTenure: 15, minDeposit: 20, logo: '🏦' },
  { name: 'LAPO Mortgage',         rate: 15, maxTenure: 10, minDeposit: 15, logo: '🏦' },
]

export default function RentToOwnPage() {
  const [propertyPrice, setPropertyPrice] = useState('15000000')
  const [deposit, setDeposit] = useState('20')
  const [tenure, setTenure] = useState('15')
  const [selectedBank, setSelectedBank] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState('500000')
  const [tab, setTab] = useState<'mortgage'|'rent-to-own'|'compare'>('mortgage')

  const bank = banks[selectedBank]
  const price = Number(propertyPrice.replace(/,/g,'')) || 0
  const depositAmt = price * (Number(deposit)/100)
  const loanAmt = price - depositAmt
  const monthlyRate = bank.rate / 100 / 12
  const months = Number(tenure) * 12
  const monthlyPayment = loanAmt * (monthlyRate * Math.pow(1+monthlyRate,months)) / (Math.pow(1+monthlyRate,months)-1)
  const totalPaid = monthlyPayment * months + depositAmt
  const totalInterest = totalPaid - price
  const income = Number(monthlyIncome.replace(/,/g,'')) || 1
  const affordabilityRatio = (monthlyPayment/income)*100
  const affordable = affordabilityRatio <= 33

  // Rent-to-own scenario
  const monthlyRent = price * 0.06 / 12  // 6% annual rent yield
  const rentApplied = 0.3  // 30% of rent applied to purchase
  const rentCredit = monthlyRent * rentApplied
  const rtoMonths = (depositAmt / rentCredit)
  const rtoYears = rtoMonths / 12

  // Compare scenarios
  const scenarios = [
    { label: 'Full Mortgage', monthly: Math.round(monthlyPayment), total: Math.round(totalPaid), years: Number(tenure), owns: true },
    { label: 'Rent-to-Own', monthly: Math.round(monthlyRent), total: Math.round(monthlyRent * rtoMonths + loanAmt * 1.2), years: Math.round(rtoYears + Number(tenure)/2), owns: true },
    { label: 'Renting Only', monthly: Math.round(monthlyRent), total: Math.round(monthlyRent * 12 * Number(tenure)), years: Number(tenure), owns: false },
  ]

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <section className="bg-obsidian-900 relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
        <div className="page-container relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-5">
              <Calculator className="w-3.5 h-3.5" />Rent-to-Own & Mortgage Calculator
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              Your Path to<br /><span className="gold-text">Property Ownership</span>
            </h1>
            <p className="text-white/50 text-base max-w-lg">Calculate mortgage repayments, rent-to-own timelines, and compare ownership paths for Port Harcourt properties.</p>
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-subtle rounded-2xl w-fit mb-8">
          {(['mortgage','rent-to-own','compare'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${tab===t?'bg-white text-obsidian-900 shadow':'text-obsidian-500 hover:text-obsidian-700'}`}>
              {t.replace('-',' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-obsidian-900">Property Details</h3>
              <div>
                <label className="input-label">Property Price (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400">₦</span>
                  <input className="input-field pl-7 text-sm font-mono" value={propertyPrice}
                    onChange={e => setPropertyPrice(e.target.value)} placeholder="15,000,000" />
                </div>
              </div>
              <div>
                <label className="input-label">Monthly Income (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400">₦</span>
                  <input className="input-field pl-7 text-sm font-mono" value={monthlyIncome}
                    onChange={e => setMonthlyIncome(e.target.value)} placeholder="500,000" />
                </div>
              </div>
              <div>
                <label className="input-label">Initial Deposit: {deposit}%</label>
                <input type="range" min="5" max="50" value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  className="w-full accent-gold-500" />
                <div className="flex justify-between text-xs text-obsidian-400 mt-1">
                  <span>5%</span><span className="font-semibold text-gold-600">{fmt(depositAmt)}</span><span>50%</span>
                </div>
              </div>
              <div>
                <label className="input-label">Loan Tenure: {tenure} years</label>
                <input type="range" min="1" max="30" value={tenure}
                  onChange={e => setTenure(e.target.value)}
                  className="w-full accent-gold-500" />
                <div className="flex justify-between text-xs text-obsidian-400 mt-1">
                  <span>1yr</span><span>30yrs</span>
                </div>
              </div>
              <div>
                <label className="input-label">Mortgage Provider</label>
                <div className="space-y-2">
                  {banks.map((b, i) => (
                    <button key={i} onClick={() => setSelectedBank(i)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left ${selectedBank===i?'border-gold-400 bg-gold-50':'border-surface-border hover:border-obsidian-300'}`}>
                      <div className="flex items-center gap-2">
                        <span>{b.logo}</span>
                        <div>
                          <p className="text-xs font-semibold text-obsidian-900">{b.name}</p>
                          <p className="text-[10px] text-obsidian-400">{b.rate}% pa · Max {b.maxTenure}yrs</p>
                        </div>
                      </div>
                      {selectedBank===i && <CheckCircle2 className="w-4 h-4 text-gold-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-5">

            {/* MORTGAGE TAB */}
            {tab === 'mortgage' && (
              <>
                {/* Affordability banner */}
                <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${affordable?'bg-emerald-50 border-emerald-200':'bg-rose-50 border-rose-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${affordable?'bg-emerald-100':'bg-rose-100'}`}>
                    {affordable ? '✅' : '⚠️'}
                  </div>
                  <div>
                    <p className={`font-semibold ${affordable?'text-emerald-700':'text-rose-700'}`}>
                      {affordable ? 'You can afford this property' : 'This may be a stretch'}
                    </p>
                    <p className={`text-sm ${affordable?'text-emerald-600':'text-rose-600'}`}>
                      Monthly repayment is {affordabilityRatio.toFixed(0)}% of your income. {affordable?'Below the 33% recommended threshold.':'Lenders typically require below 33%.'}
                    </p>
                  </div>
                </div>

                {/* Key numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Monthly Payment', value: fmt(Math.round(monthlyPayment)), highlight: true },
                    { label: 'Loan Amount',      value: fmt(Math.round(loanAmt)) },
                    { label: 'Total Paid',        value: fmt(Math.round(totalPaid)) },
                    { label: 'Total Interest',    value: fmt(Math.round(totalInterest)) },
                  ].map((s,i) => (
                    <div key={i} className={`card p-4 text-center ${s.highlight?'border-2 border-gold-300 bg-gold-50':''}`}>
                      <p className={`font-display text-xl font-medium ${s.highlight?'text-gold-700':'text-obsidian-900'}`}>{s.value}</p>
                      <p className="text-xs text-obsidian-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Amortization preview */}
                <div className="card p-5">
                  <h3 className="font-semibold text-obsidian-900 mb-4">Payment Breakdown Over Time</h3>
                  <div className="space-y-3">
                    {[1,5,10,Math.min(15,Number(tenure)),Number(tenure)].filter((v,i,a)=>a.indexOf(v)===i && v<=Number(tenure)).map(yr => {
                      const mPaid = yr*12
                      const principalPaid = loanAmt - (loanAmt * Math.pow(1+monthlyRate, mPaid) - monthlyPayment * (Math.pow(1+monthlyRate, mPaid)-1)/monthlyRate)
                      const equityPct = Math.min(100, ((depositAmt + Math.max(0,principalPaid))/price)*100)
                      return (
                        <div key={yr}>
                          <div className="flex justify-between text-xs text-obsidian-600 mb-1">
                            <span>Year {yr}</span>
                            <span className="font-semibold">{equityPct.toFixed(0)}% equity · {fmt(depositAmt + Math.max(0,principalPaid))} owned</span>
                          </div>
                          <div className="h-2.5 bg-surface-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all"
                              style={{ width: `${equityPct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* RENT-TO-OWN TAB */}
            {tab === 'rent-to-own' && (
              <>
                <div className="card p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <Home className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-medium text-obsidian-900 mb-1">How Rent-to-Own Works</h3>
                      <p className="text-sm text-obsidian-500">Pay rent monthly. 30% of each payment builds towards your deposit. After {rtoYears.toFixed(1)} years you have enough deposit to secure a mortgage.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label:'Monthly Rent', value: fmt(Math.round(monthlyRent)), sub:'Based on 6% annual yield' },
                      { label:'Monthly Credit', value: fmt(Math.round(rentCredit)), sub:'30% applied to deposit' },
                      { label:'Time to Deposit', value: `${rtoYears.toFixed(1)} yrs`, sub:`${Math.round(rtoMonths)} months total` },
                    ].map((s,i) => (
                      <div key={i} className="p-4 bg-surface-subtle rounded-2xl text-center">
                        <p className="font-display text-2xl font-medium text-obsidian-900">{s.value}</p>
                        <p className="text-xs font-semibold text-obsidian-700 mt-1">{s.label}</p>
                        <p className="text-[10px] text-obsidian-400">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3">
                    {[
                      { phase:'Rent & Save', duration:`0 – ${rtoYears.toFixed(1)} years`, desc:`Pay ${fmt(Math.round(monthlyRent))}/month. ${fmt(Math.round(rentCredit))}/month builds your deposit.`, icon:'🏠', color:'bg-blue-50 border-blue-200' },
                      { phase:'Deposit Ready', duration:`Year ${rtoYears.toFixed(1)}`, desc:`You have ${fmt(depositAmt)} (${deposit}%) deposit saved through rent credits.`, icon:'✅', color:'bg-emerald-50 border-emerald-200' },
                      { phase:'Mortgage Phase', duration:`${rtoYears.toFixed(1)} – ${(rtoYears + Number(tenure)).toFixed(0)} years`, desc:`Secure mortgage for remaining ${fmt(loanAmt)} at ${bank.rate}%. Pay ${fmt(Math.round(monthlyPayment))}/month.`, icon:'🏦', color:'bg-gold-50 border-gold-200' },
                      { phase:'Full Ownership', duration:`Year ${(rtoYears + Number(tenure)).toFixed(0)}`, desc:'Property is fully yours. No more rent or mortgage payments.', icon:'🎉', color:'bg-purple-50 border-purple-200' },
                    ].map((step,i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${step.color} flex items-start gap-3`}>
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-obsidian-900 text-sm">{step.phase}</span>
                            <span className="text-xs text-obsidian-400">{step.duration}</span>
                          </div>
                          <p className="text-xs text-obsidian-600">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* COMPARE TAB */}
            {tab === 'compare' && (
              <div className="space-y-4">
                <div className="card overflow-hidden">
                  <div className="p-5 border-b border-surface-border">
                    <h3 className="font-semibold text-obsidian-900">Compare Ownership Paths</h3>
                    <p className="text-xs text-obsidian-400 mt-0.5">Over {tenure} years for a {fmt(price)} property</p>
                  </div>
                  <div className="divide-y divide-surface-border">
                    {scenarios.map((s,i) => (
                      <div key={i} className={`p-5 ${i===0?'bg-gold-50/50':''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-obsidian-900">{s.label}</span>
                              {i===0 && <span className="px-2 py-0.5 bg-gold-500 text-obsidian-900 text-[10px] font-bold rounded-full">RECOMMENDED</span>}
                            </div>
                            <p className="text-2xl font-display font-medium text-obsidian-900">{fmt(s.monthly)}<span className="text-sm text-obsidian-400">/mo</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-obsidian-500">Total cost</p>
                            <p className="font-semibold text-obsidian-900">{fmt(s.total)}</p>
                            <p className={`text-xs mt-1 font-semibold ${s.owns?'text-emerald-600':'text-rose-500'}`}>
                              {s.owns?'✓ You own it after':'✗ No ownership after'} {s.years}yrs
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-obsidian-900 rounded-2xl">
                  <p className="text-white font-semibold mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold-400" />Our Recommendation
                  </p>
                  <p className="text-white/60 text-sm">
                    Based on your income of {fmt(income)}/month, {affordable ? `a full mortgage at ${fmt(Math.round(monthlyPayment))}/month is affordable and builds equity fastest.` : `consider the rent-to-own path to build your deposit while keeping payments manageable.`}
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-obsidian-900">Ready to find your property?</p>
                <p className="text-sm text-obsidian-400">Browse {fmt(price)} properties in Port Harcourt</p>
              </div>
              <Link href={`/buy?maxPrice=${price}`} className="btn-primary gap-2 whitespace-nowrap">
                Browse Properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
