import Link from 'next/link'
import { MapPin, Star, CheckCircle2, Phone, MessageCircle } from 'lucide-react'
import { Agent } from '@/lib/data'
import clsx from 'clsx'

const badgeLabels: Record<string, { label: string; class: string }> = {
  platinum:  { label: '💎 Platinum', class: 'badge-gold' },
  top_agent: { label: '🏆 Top Agent', class: 'badge-gold' },
  verified:  { label: '✓ Verified', class: 'badge-verify' },
  none:      { label: '', class: '' },
}

const avatarColors = ['from-gold-500 to-gold-300', 'from-emerald-500 to-teal-400', 'from-violet-500 to-purple-400', 'from-rose-500 to-pink-400', 'from-blue-500 to-cyan-400', 'from-amber-500 to-yellow-400']

export default function AgentCard({ agent, className }: { agent: Agent; className?: string }) {
  const colorIdx = agent.id.charCodeAt(1) % avatarColors.length
  const badge = badgeLabels[agent.badge]

  return (
    <div className={clsx('card p-5 flex gap-4', className)}>
      {/* Avatar */}
      <Link href={`/agents/${agent.username}`} className="flex-shrink-0">
        <div className={clsx('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center font-display text-xl font-medium text-obsidian-900 border-2 border-white shadow-card', avatarColors[colorIdx])}>
          {agent.initials}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <Link href={`/agents/${agent.username}`}>
            <h3 className="font-body font-semibold text-obsidian-900 text-sm hover:text-gold-600 transition-colors truncate">
              {agent.name}
            </h3>
          </Link>
          {badge.label && <span className={clsx('badge text-[10px] py-0.5 flex-shrink-0', badge.class)}>{badge.label}</span>}
        </div>

        <p className="text-xs text-obsidian-400 mb-2 truncate">{agent.agencyName}</p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({length: 5}).map((_, i) => (
              <Star key={i} className={clsx('w-3 h-3', i < Math.floor(agent.rating) ? 'fill-gold-400 text-gold-400' : 'text-obsidian-200')} />
            ))}
          </div>
          <span className="font-mono text-xs text-obsidian-400">{agent.rating} ({agent.reviewCount})</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="text-center">
            <div className="font-mono text-sm font-semibold text-gold-600">{agent.totalListings}</div>
            <div className="text-[10px] text-obsidian-400">Listings</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm font-semibold text-gold-600">{agent.totalSales}</div>
            <div className="text-[10px] text-obsidian-400">Sold</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm font-semibold text-gold-600">{agent.yearsActive}yr</div>
            <div className="text-[10px] text-obsidian-400">Active</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-obsidian-400 mb-3">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />
          <span className="truncate">{agent.neighborhoods.slice(0, 2).join(', ')}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a href={`tel:${agent.phone}`} className="btn-dark btn-sm flex-1 justify-center">
            <Phone className="w-3 h-3" />
            Call
          </a>
          <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
            className="btn-primary btn-sm flex-1 justify-center">
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
