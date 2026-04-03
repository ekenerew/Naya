export const dynamic = 'force-dynamic';

'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Minus, Bot, Send, Loader2,
  BarChart3, MapPin, Home, Building2, ArrowRight,
  RefreshCw, Sparkles, MessageSquare, X, ChevronDown,
  Activity, DollarSign, Users, Eye
} from 'lucide-react'
import { marketStats, neighborhoods } from '@/lib/data'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

function pct(a: number, b: number) {
  return (((a - b) / b) * 100).toFixed(1)
}

// ── Market context for AI ──────────────────────────────────────────────────────
const MARKET_CONTEXT = `
You are Naya AI — a specialist property market analyst for Port Harcourt, Rivers State, Nigeria, embedded in the Naya Real Estate platform.

CURRENT MARKET DATA (Q1 2026):
- Average rent (1-bed, PH): ₦2.65M/yr (up 26