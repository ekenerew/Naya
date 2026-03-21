'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, BellOff, CheckCheck, X, Home, MessageCircle, Shield, Award, Loader2 } from 'lucide-react'

type Notification = {
  id: string; type: string; title: string; message: string
  href?: string; readAt?: string; createdAt: string
}

const typeIcons: Record<string,any> = {
  new_enquiry: MessageCircle, listing_approved: Home,
  verification_approved: Shield, verification_rejected: Shield,
  review_received: Award, alert_match: Bell,
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs/24)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen]             = useState(false)
  const [notifications, setNotifs]  = useState<Notification[]>([])
  const [unread, setUnread]         = useState(0)
  const [loading, setLoading]       = useState(false)
  const [pushEnabled, setPush]      = useState(false)
  const [pushLoading, setPushLoad]  = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
    if ('Notification' in window) setPush(Notification.permission === 'granted')
  }, [])

  const fetchNotifs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications/list')
      if (!res.ok) return
      const json = await res.json()
      setNotifs(json.data?.notifications || [])
      setUnread(json.data?.unreadCount || 0)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchNotifs()
    const t = setInterval(fetchNotifs, 30000)
    return () => clearInterval(t)
  }, [fetchNotifs])

  const markAllRead = async () => {
    await fetch('/api/notifications/read', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' })
    setUnread(0)
    setNotifs(p => p.map(n => ({ ...n, readAt: new Date().toISOString() })))
  }

  const markRead = async (id: string, href?: string) => {
    await fetch('/api/notifications/read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) })
    setNotifs(p => p.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    setUnread(p => Math.max(0, p-1))
    if (href) { setOpen(false); window.location.href = href }
  }

  const enablePush = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return
    setPushLoad(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setPushLoad(false); return }
      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      if (!vapidKey) { setPush(true); setPushLoad(false); return }
      const keyBytes = Uint8Array.from(atob(vapidKey.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0))
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes })
      const s = sub.toJSON()
      await fetch('/api/notifications/subscribe', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ endpoint: s.endpoint, keys: s.keys })
      })
      setPush(true)
    } catch(e) { console.error('[PUSH]', e) } finally { setPushLoad(false) }
  }

  const disablePush = async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await fetch('/api/notifications/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ endpoint: sub.endpoint, action: 'unsubscribe' }) })
      await sub.unsubscribe()
    }
    setPush(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => { setOpen(!open); if (!open) fetchNotifs() }}
        className="relative flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all">
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-surface-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-subtle">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-obsidian-900 text-sm">Notifications</h3>
              {unread > 0 && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">{unread} new</span>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-gold-600 font-medium">
                  <CheckCheck className="w-3 h-3" />All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-obsidian-400 hover:text-obsidian-700"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Push toggle */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-b border-surface-border text-xs ${pushEnabled ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <div className="flex items-center gap-2">
              {pushEnabled ? <Bell className="w-3.5 h-3.5 text-emerald-600" /> : <BellOff className="w-3.5 h-3.5 text-amber-600" />}
              <span className="font-medium text-obsidian-700">{pushEnabled ? 'Push notifications on' : 'Enable push alerts'}</span>
            </div>
            {pushLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-obsidian-400" />
              : pushEnabled
                ? <button onClick={disablePush} className="text-rose-500 font-medium">Off</button>
                : <button onClick={enablePush} className="px-3 py-1 bg-gold-500 text-obsidian-900 font-bold rounded-full">Enable</button>
            }
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-obsidian-300" /></div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="w-10 h-10 text-obsidian-200 mx-auto mb-3" />
                <p className="text-sm text-obsidian-400 font-medium">No notifications yet</p>
                <p className="text-xs text-obsidian-300 mt-1">New enquiries and updates will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {notifications.map(n => {
                  const Icon = typeIcons[n.type] || Bell
                  const isUnread = !n.readAt
                  return (
                    <button key={n.id} onClick={() => markRead(n.id, n.href)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-subtle transition-colors ${isUnread ? 'bg-gold-50/40' : ''}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnread ? 'bg-gold-100' : 'bg-surface-subtle'}`}>
                        <Icon className={`w-4 h-4 ${isUnread ? 'text-gold-600' : 'text-obsidian-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-xs font-semibold leading-tight ${isUnread ? 'text-obsidian-900' : 'text-obsidian-600'}`}>{n.title}</p>
                          {isUnread && <div className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 mt-0.5" />}
                        </div>
                        <p className="text-xs text-obsidian-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-obsidian-300 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-surface-border px-4 py-2.5 bg-surface-subtle text-center">
              <button onClick={fetchNotifs} className="text-xs text-gold-600 font-medium">Refresh</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
