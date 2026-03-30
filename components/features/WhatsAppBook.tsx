'use client'
import { useState } from 'react'
import { MessageCircle, Calendar, Clock, CheckCircle2, User, Phone } from 'lucide-react'

type Props = {
  agentPhone?: string
  agentName?: string
  propertyTitle: string
  propertyId: string
  neighborhood?: string
  price?: number
  compact?: boolean
}

const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
const DAYS = ['Today','Tomorrow','In 2 days','In 3 days']

export default function WhatsAppBook({ agentPhone, agentName, propertyTitle, propertyId, neighborhood, price, compact = false }: Props) {
  const [step, setStep]     = useState<'idle'|'form'|'done'>('idle')
  const [name, setName]     = useState('')
  const [phone, setPhone]   = useState('')
  const [day, setDay]       = useState('')
  const [time, setTime]     = useState('')

  const fmtPrice = price ? (price >= 1e6 ? `₦${(price/1e6).toFixed(1)}M` : `₦${(price/1e3).toFixed(0)}K`) : ''

  const buildMessage = () => {
    const lines = [
      `Hi ${agentName || 'there'}! 👋`,
      ``,
      `I'm interested in booking a viewing for:`,
      `🏠 *${propertyTitle}*`,
      neighborhood ? `📍 ${neighborhood}, Port Harcourt` : '',
      fmtPrice ? `💰 ${fmtPrice}` : '',
      `🔗 naya-fawn.vercel.app/properties/${propertyId}`,
      ``,
      name ? `My name: *${name}*` : '',
      phone ? `My phone: *${phone}*` : '',
      day && time ? `Preferred viewing: *${day} at ${time}*` : '',
      ``,
      `Please confirm availability. Thank you!`,
    ].filter(Boolean).join('\n')
    return encodeURIComponent(lines)
  }

  const openWhatsApp = () => {
    const number = agentPhone?.replace(/\D/g,'') || '2348168117004'
    const msg = buildMessage()
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank')
    setStep('done')
  }

  if (compact) return (
    <a href={`https://wa.me/${(agentPhone||'2348168117004').replace(/\D/g,'')}?text=${buildMessage()}`}
      target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg hover:shadow-emerald-200">
      <MessageCircle className="w-4 h-4" />WhatsApp Viewing Request
    </a>
  )

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-emerald-500">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Book a Viewing Instantly</p>
          <p className="text-white/70 text-xs">WhatsApp the agent directly</p>
        </div>
      </div>

      <div className="p-4">
        {step === 'done' ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-obsidian-900 mb-1">Message Sent!</p>
            <p className="text-sm text-obsidian-400 mb-3">The agent will reply on WhatsApp shortly.</p>
            <button onClick={() => setStep('idle')} className="btn-secondary btn-sm">Book Another Time</button>
          </div>
        ) : step === 'form' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-obsidian-300" />
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-field pl-8 text-xs py-2" />
              </div>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-obsidian-300" />
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Your phone"
                  className="input-field pl-8 text-xs py-2" />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-obsidian-600 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />Preferred day
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {DAYS.map(d => (
                  <button key={d} onClick={() => setDay(d)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${day===d?'border-emerald-500 bg-emerald-50 text-emerald-700':'border-surface-border text-obsidian-600 hover:border-emerald-300'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-obsidian-600 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />Preferred time
              </p>
              <div className="grid grid-cols-4 gap-1">
                {TIME_SLOTS.map(t => (
                  <button key={t} onClick={() => setTime(t)}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border transition-all ${time===t?'border-emerald-500 bg-emerald-50 text-emerald-700':'border-surface-border text-obsidian-500 hover:border-emerald-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-semibold text-sm transition-all">
              <MessageCircle className="w-4 h-4" />
              Send to Agent on WhatsApp
            </button>
            <button onClick={() => setStep('idle')} className="w-full text-xs text-obsidian-400 hover:text-obsidian-700 py-1 transition-colors">Cancel</button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-obsidian-500 mb-3 leading-relaxed">
              Instantly send the agent a pre-formatted viewing request with your details and preferred time — all in one tap.
            </p>
            <button onClick={() => setStep('form')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-semibold text-sm transition-all shadow-md hover:shadow-emerald-200">
              <MessageCircle className="w-4 h-4" />Book a Viewing via WhatsApp
            </button>
            <p className="text-[10px] text-obsidian-300 text-center mt-2">Opens WhatsApp · Pre-filled message</p>
          </div>
        )}
      </div>
    </div>
  )
}
