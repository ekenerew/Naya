'use client'
import { useState } from 'react'
import { Shield, TrendingUp, Droplets, Building2, Star, ChevronDown, ChevronUp, Award } from 'lucide-react'
import type { NayaScoreBreakdown } from '@/lib/naya-score'

type Props = { score: NayaScoreBreakdown; compact?: boolean }

function ScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-2 bg-surface-border rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(value/max)*100}%`, background: color }} />
    </div>
  )
}

// Circular score ring
function ScoreRing({ score, grade, label, color }: { score: number; grade: string; label: string; color: string }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#E8E3D8" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-obsidian-900" style={{ color }}>{score}</span>
          <span className="text-xs font-bold text-obsidian-500">/100</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white"
          style={{ background: color }}>
          <Award className="w-3.5 h-3.5" />{grade} · {label}
        </span>
      </div>
    </div>
  )
}

export default function NayaScore({ score, compact = false }: Props) {
  const [expanded, setExpanded] = useState(!compact)

  const metrics = [
    { label: 'Title Strength',   value: score.titleStrength,  max: 25, icon: Shield,    desc: 'Document quality and legal standing' },
    { label: 'Flood Risk',       value: score.floodRisk,      max: 20, icon: Droplets,  desc: 'Area drainage and flood history' },
    { label: 'Neighbourhood',    value: score.neighbourhood,  max: 20, icon: Building2, desc: 'Safety, amenities, lifestyle score' },
    { label: 'Value for Money',  value: score.valueForMoney,  max: 20, icon: TrendingUp,desc: 'Price vs area market rate' },
    { label: 'Infrastructure',   value: score.infrastructure, max: 15, icon: Star,      desc: 'Roads, power, internet quality' },
  ]

  if (compact) return (
    <button onClick={() => setExpanded(!expanded)}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 w-full text-left transition-all"
      style={{ borderColor: score.color + '40', background: score.color + '08' }}>
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold"
          style={{ background: score.color, color: '#fff' }}>
          <span className="text-xl leading-none">{score.total}</span>
          <span className="text-[10px] font-medium">{score.grade}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-obsidian-900">Naya Score™</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: score.color }}>
            {score.label}
          </span>
        </div>
        <p className="text-xs text-obsidian-400 mt-0.5">Tap to see full breakdown</p>
      </div>
      {expanded ? <ChevronUp className="w-4 h-4 text-obsidian-400" /> : <ChevronDown className="w-4 h-4 text-obsidian-400" />}
    </button>
  )

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-surface-border bg-gradient-to-r from-obsidian-900 to-obsidian-800">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-400" />
            <span className="font-semibold text-white">Naya Score™</span>
          </div>
          <span className="text-xs text-white/40 font-mono">PROPRIETARY RATING</span>
        </div>
        <p className="text-xs text-white/40">Algorithm-based property quality rating by Naya</p>
      </div>

      <div className="p-6">
        {/* Score ring */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <ScoreRing score={score.total} grade={score.grade} label={score.label} color={score.color} />
          <div className="flex-1 space-y-3 w-full">
            {metrics.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <m.icon className="w-3.5 h-3.5 text-obsidian-400" />
                    <span className="text-xs font-semibold text-obsidian-700">{m.label}</span>
                  </div>
                  <span className="text-xs font-bold text-obsidian-900">{m.value}/{m.max}</span>
                </div>
                <ScoreBar value={m.value} max={m.max} color={score.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        {score.highlights.length > 0 && (
          <div className="space-y-2 mb-4">
            {score.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px]">✓</span>
                </div>
                {h}
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {score.warnings.length > 0 && (
          <div className="space-y-2">
            {score.warnings.map((w, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px]">!</span>
                </div>
                {w}
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-obsidian-300 mt-4 pt-4 border-t border-surface-border">
          Naya Score™ is a proprietary rating based on publicly available data and market analysis. It is not a substitute for professional property inspection or legal due diligence.
        </p>
      </div>
    </div>
  )
}
