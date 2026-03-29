'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles, Home, MapPin, TrendingUp, ChevronDown } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string; timestamp: Date }

const SUGGESTIONS = [
  '3 bedroom apartment in GRA under ₦3M/yr',
  'What are the best areas for expats in PH?',
  'Compare Woji vs GRA Phase 2 prices',
  'Is Eleme a good investment area?',
  'Shortlets near Trans Amadi industrial area',
  'Average rent in Old GRA for 2 bedrooms',
]

const SYSTEM_PROMPT = `You are Naya AI — Port Harcourt's smartest property assistant. You help users find properties, understand neighbourhoods, compare prices and make real estate decisions in Port Harcourt, Rivers State, Nigeria.

Key knowledge:
- Port Harcourt neighbourhoods: GRA Phase 2 (premium, ₦5M+ 3-bed rent), Old GRA (established, ₦3.8M), Woji (growing, ₦2.5M), Trans Amadi (industrial/commercial), Rumuola (mid-range), Eleme (oil/gas), Peter Odili Road (luxury corridor), Choba (university), Bonny Island (NLNG)
- Electricity: Nigeria uses PHED bands A-E. Band A = 20+ hours, Band B = 16-20hrs, Band C = 12-16hrs (most common in PH), Band D = 8-12hrs
- Market: PH property prices rose ~15-25% in 2024-2025 driven by oil sector and infrastructure
- Currency: All prices in Naira (₦). 1 USD ≈ ₦1,600

Be concise, warm and genuinely helpful. Give specific prices and area names. When recommending properties, suggest they search on Naya at naya-fawn.vercel.app. Always end with a follow-up question to keep the conversation going.`

export default function AIChat() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role:'assistant', content:"Hi! I'm Naya AI 👋 I know everything about property in Port Harcourt — prices, neighbourhoods, electricity, flood risk and more. What are you looking for?", timestamp: new Date() }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, open, minimized])

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: Message = { role:'user', content:msg, timestamp:new Date() }
    setMessages(p => [...p, userMsg])
    setLoading(true)

    try {
      const res  = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          max_tokens: 600,
          messages: [...messages.map(m => ({ role:m.role, content:m.content })), { role:'user', content:msg }]
        })
      })
      const data = await res.json()
      setMessages(p => [...p, { role:'assistant', content: data.content || 'I had trouble answering that. Please try again.', timestamp:new Date() }])
    } catch {
      setMessages(p => [...p, { role:'assistant', content:"Connection issue. Please check your internet and try again.", timestamp:new Date() }])
    } finally { setLoading(false) }
  }

  const formatContent = (content: string) =>
    content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-[400] flex items-center gap-2.5 px-4 py-3 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-full shadow-2xl transition-all hover:scale-105 border border-white/10"
          style={{ boxShadow:'0 8px 32px rgba(200,168,75,0.3)' }}>
          <div className="relative">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
          </div>
          <span className="text-sm font-semibold">Ask Naya AI</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`fixed right-4 z-[400] w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-surface-border overflow-hidden transition-all duration-300 ${minimized ? 'bottom-4 h-auto' : 'bottom-4'}`}
          style={{ boxShadow:'0 20px 60px rgba(10,10,11,0.2)' }}>

          {/* Header */}
          <div className="bg-obsidian-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-obsidian-900" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Naya AI</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-white/40 text-[10px]">Property Intelligence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(p => !p)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:bg-white/10 transition-colors">
                <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-surface-bg">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <Sparkles className="w-3 h-3 text-obsidian-900" />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-obsidian-900 text-white rounded-tr-sm'
                        : 'bg-white text-obsidian-800 rounded-tl-sm border border-surface-border shadow-sm'
                    }`}
                      dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 mr-2">
                      <Sparkles className="w-3 h-3 text-obsidian-900" />
                    </div>
                    <div className="bg-white border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay:'0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay:'150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay:'300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-3 pb-2 bg-surface-bg">
                  <p className="text-[10px] text-obsidian-400 uppercase tracking-wider mb-2 px-1">Quick questions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.slice(0,3).map((s, i) => (
                      <button key={i} onClick={() => send(s)}
                        className="px-2.5 py-1.5 bg-white border border-surface-border rounded-full text-[10px] text-obsidian-600 hover:border-gold-400 hover:text-gold-600 transition-all text-left">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-surface-border bg-white">
                <div className="flex gap-2">
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                    placeholder="Ask about any area in PH..."
                    className="flex-1 text-sm bg-surface-subtle border border-surface-border rounded-xl px-3 py-2.5 outline-none focus:border-gold-400 placeholder:text-obsidian-300" />
                  <button onClick={() => send()} disabled={!input.trim() || loading}
                    className="w-10 h-10 flex items-center justify-center bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl disabled:opacity-40 transition-all flex-shrink-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9px] text-obsidian-300 text-center mt-1.5">Powered by Claude AI · Not financial advice</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
