export const dynamic = 'force-dynamic';

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, MapPin, ArrowRight, CheckCircle2, SlidersHorizontal,
  Building2, Home, Layers, TrendingUp, Shield, FileText, Users,
  Clock, Zap, ChevronDown, MessageCircle, Phone, Star, Calendar,
  BarChart3, Award, Hammer, Key
} from 'lucide-react'
import { newDevelopments } from '@/lib/data'
import type { Development } from '@/lib/data'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(0)}M`
  return `₦${n.toLocaleString()}`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const statusConfig = {
  off_plan:           { label: 'Off-Plan',            color: 'bg-purple-500', text: 'text-white',        dot: 'bg-purple-400' },
  under_construction: { label: 'Under Construction',  color: 'bg-amber-500',  text: 'text-obsidian-900', dot: 'bg-amber-400' },
  ready:              { label: 'Ready Now',            color: 'bg-emerald-500', text: 'text-white',       dot: 'bg-emerald-400' },
  sold_out:           { label: 'Sold Out',             color: 'bg-obsidian-400', text: 'text-white',      dot: 'bg-obsidian-300' },
}

const typeConfig = {
  residential: { label: 'Residential', icon: Home },
  mixed_use:   { label: 'Mixed-Use',   icon: Layers },
  commercial:  { label: 'Commercial',  icon: Building2 },
  estate:      { label: 'Gated Estate', icon: Home },
}

const filterStatuses = [
  { value: 'all', label: 'All Stages' },
  { value: 'off_plan', label: 'Off-Plan' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready', label: 'Ready Now' },
]

const filterTypes = [
  { value: 'all',         label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'estate',      label: 'Gated Estate' },
  { value: 'mixed_use',   label: 'Mixed-Use' },
  { value: 'commercial',  label: 'Commercial' },
]

const sortOptions = [
  { value: 'featured',   label: 'Featured First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'completion', label: 'Completing Soonest' },
  { value: 'popular',    label: 'Most Enquired' },
]

const investmentReasons = [
  { icon: TrendingUp, title: 'Capital Growth',       desc: 'PH off-plan prices have grown 18–24etween contract and completion over the past 3 years.', stat: '+21