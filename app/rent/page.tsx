export const dynamic = 'force-dynamic';

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, TrendingUp, Minus, X, ArrowRight, CheckCircle2, Map, LayoutGrid, List, Phone, MessageCircle, Star, Shield } from 'lucide-react'
import { properties, rentalListings, neighborhoods } from '@/lib/data'
import type { Property } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const rentalCategories = [
  { value: 'all',               label: 'All Types',            emoji: '🏠', group: 'all' },
  { value: 'single_room',       label: 'Single Room',          emoji: '🚪', group: 'rooms' },
  { value: 'two_rooms',         label: 'Two Rooms',            emoji: '🚪', group: 'rooms' },
  { value: 'room_parlour',      label: 'Room & Parlour',       emoji: '🛋', group: 'rooms' },
  { value: 'self_contained',    label: 'Self Contained',       emoji: '🔑', group: 'rooms' },
  { value: 'bedsitter',         label: 'Bedsitter',            emoji: '🛏', group: 'rooms' },
  { value: 'mini_flat',         label: 'Mini Flat',            emoji: '🏠', group: 'flats' },
  { value: 'studio',            label: 'Studio Apartment',     emoji: '✨', group: 'flats' },
  { value: 'one_bedroom_flat',  label: '1-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'two_bedroom_flat',  label: '2-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'three_bedroom_flat',label: '3-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'four_bedroom_flat', label: '4-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'apartment',         label: 'Apartment',            emoji: '🏢', group: 'flats' },
  { value: 'three_room_duplex', label: '3-Room Duplex',        emoji: '🏡', group: 'houses' },
  { value: 'duplex',            label: '4-5 Bed Duplex',       emoji: '🏡', group: 'houses' },
  { value: 'bungalow',          label: 'Bungalow',             emoji: '🏡', group: 'houses' },
  { value: 'terrace',           label: 'Terrace House',        emoji: '🏘', group: 'houses' },
  { value: 'mansion',           label: 'Mansion / Villa',      emoji: '🏰', group: 'houses' },
  { value: 'store',             label: 'Store / Warehouse',    emoji: '🏭', group: 'commercial' },
  { value: 'commercial',        label: 'Office / Commercial',  emoji: '🏢', group: 'commercial' },
]

const categoryGroups = [
  { key: 'all',        label: 'All' },
  { key: 'rooms',      label: 'Rooms' },
  { key: 'flats',      label: 'Flats & Apts' },
  { key: 'houses',     label: 'Houses' },
  { key: 'commercial', label: 'Commercial' },
]

const priceRanges = [
  { label: 'Under ₦500K/yr', min: 0, max: 500000 },
  { label: '₦500K – ₦1M/yr', min: 500000, max: 1000000 },
  { label: '₦1M – ₦3M/yr', min: 1000000, max: 3000000 },
  { label: '₦3M – ₦8M/yr', min: 3000000, max: 8000000 },
  { label: 'Above ₦8M/yr', min: 8000000, max: Infinity },
]

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Listed' },
  { value: 'popular', label: 'Most Viewed' },
]

const mapPins = [
  { neighborhood: 'GRA Phase 2', x: 68, y: 35, count: 12, avgPrice: '₦8.5M/yr', color: 'bg-gold-500' },
  { neighborhood: 'Old GRA',     x: 58, y: 42, count: 8,  avgPrice: '₦6.2M/yr', color: 'bg-gold-400' },
  { neighborhood: 'Woji',        x: 74, y: 52, count: 18, avgPrice: '₦2.8M/yr', color: 'bg-emerald-500' },
  { neighborhood: 'Trans Amadi', x: 52, y: 55, count: 22, avgPrice: '₦1.9M/yr', color: 'bg-blue-500' },
  { neighborhood: 'Rumuola',     x: 42, y: 62, count: 31, avgPrice: '₦850K/yr', color: 'bg-purple-500' },
  { neighborhood: 'Eleme',       x: 82, y: 72, count: 14, avgPrice: '₦3.1M/yr', color: 'bg-rose-500' },
]

const rentStats = [
  { label: 'Avg. 1-Bed (GRA)', value: '₦3.5M', change: '+9