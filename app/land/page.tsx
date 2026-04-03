export const dynamic = 'force-dynamic';

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, MapPin, SlidersHorizontal, ArrowRight, CheckCircle2,
  Trees, Building2, Layers, TrendingUp, Shield, FileText, Award,
  MessageCircle, Phone, ChevronDown, ChevronUp, BarChart3,
  Maximize, Compass, Zap, Droplets, Navigation, AlertCircle, Star
} from 'lucide-react'
import { landListings, neighborhoods } from '@/lib/data'
import type { LandListing } from '@/lib/data'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(0)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}
function fmtSqm(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(2)} ha`
  return `${n.toLocaleString()} sqm`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const titleConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  cof_o:             { label: 'Certificate of Occupancy', color: 'text-emerald-700', bg: 'bg-emerald-50',  icon: '🏛' },
  deed_of_assignment:{ label: 'Deed of Assignment',       color: 'text-blue-700',    bg: 'bg-blue-50',    icon: '📜' },
  governors_consent: { label: "Governor's Consent",       color: 'text-gold-700',    bg: 'bg-gold-50',    icon: '⚖️' },
  survey_plan:       { label: 'Survey Plan Only',          color: 'text-amber-700',   bg: 'bg-amber-50',   icon: '📐' },
  gazette:           { label: 'Gazette Title',             color: 'text-purple-700',  bg: 'bg-purple-50',  icon: '📋' },
  family_land:       { label: 'Family Land',               color: 'text-rose-700',    bg: 'bg-rose-50',    icon: '👨‍👩‍👧' },
}

const landUseConfig: Record<string, { label: string; emoji: string; gradient: string }> = {
  residential:  { label: 'Residential',  emoji: '🏡', gradient: 'from-emerald-950 to-teal-950' },
  commercial:   { label: 'Commercial',   emoji: '🏢', gradient: 'from-blue-950 to-cyan-950' },
  industrial:   { label: 'Industrial',   emoji: '🏭', gradient: 'from-slate-900 to-zinc-900' },
  agricultural: { label: 'Agricultural', emoji: '🌾', gradient: 'from-green-950 to-lime-950' },
  mixed_use:    { label: 'Mixed-Use',    emoji: '🏙', gradient: 'from-violet-950 to-indigo-950' },
  institutional:{ label: 'Institutional',emoji: '🏛', gradient: 'from-amber-950 to-orange-950' },
}

const topographyConfig: Record<string, { label: string; icon: string }> = {
  flat:          { label: 'Flat Terrain',    icon: '⬜' },
  gentle_slope:  { label: 'Gentle Slope',    icon: '📐' },
  elevated:      { label: 'Elevated',        icon: '⛰' },
  waterfront:    { label: 'Waterfront',      icon: '🌊' },
  corner_plot:   { label: 'Corner Plot',     icon: '📍' },
}

const filterLandUse = [
  { value: 'all',          label: 'All Land Types', icon: Trees },
  { value: 'residential',  label: 'Residential',    icon: Trees },
  { value: 'commercial',   label: 'Commercial',     icon: Building2 },
  { value: 'industrial',   label: 'Industrial',     icon: Building2 },
  { value: 'mixed_use',    label: 'Mixed-Use',      icon: Layers },
  { value: 'agricultural', label: 'Agricultural',   icon: Trees },
]

const filterTitle = [
  { value: 'all',              label: 'Any Title' },
  { value: 'cof_o',            label: 'C of O' },
  { value: 'deed_of_assignment', label: 'Deed of Assignment' },
  { value: 'governors_consent', label: "Gov's Consent" },
  { value: 'gazette',          label: 'Gazette' },
]

const sizeRanges = [
  { label: 'Under 400 sqm',       min: 0,     max: 400 },
  { label: '400 – 800 sqm',       min: 400,   max: 800 },
  { label: '800 – 2,000 sqm',     min: 800,   max: 2000 },
  { label: '2,000 – 10,000 sqm',  min: 2000,  max: 10000 },
  { label: 'Above 10,000 sqm',    min: 10000, max: Infinity },
]

const priceRanges = [
  { label: 'Under ₦30M',      min: 0,          max: 30000000 },
  { label: '₦30M – ₦100M',   min: 30000000,   max: 100000000 },
  { label: '₦100M – ₦300M',  min: 100000000,  max: 300000000 },
  { label: 'Above ₦300M',    min: 300000000,  max: Infinity },
]

const sortOptions = [
  { value: 'featured',       label: 'Featured First' },
  { value: 'price_asc',      label: 'Price: Low to High' },
  { value: 'price_desc',     label: 'Price: High to Low' },
  { value: 'size_asc',       label: 'Size: Smallest First' },
  { value: 'size_desc',      label: 'Size: Largest First' },
  { value: 'price_sqm_asc',  label: '₦/sqm: Cheapest First' },
  { value: 'newest',         label: 'Newest Listed' },
  { value: 'popular',        label: 'Most Enquired' },
]

const marketStats = [
  { label: 'Avg ₦/sqm — GRA Phase 2', value: '₦400K', change: '+22