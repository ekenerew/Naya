export const dynamic = 'force-dynamic';

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin, Zap, Droplets, Shield, Search, Star,
  TrendingUp, Home, School, ShoppingBag, Building2,
  ChevronRight, Filter, ArrowUpRight, Wifi, AlertTriangle
} from 'lucide-react'
import NEIGHBOURHOODS, { ELECTRICITY_BAND_INFO, FLOOD_RISK_INFO } from '@/lib/neighbourhoods-data'

const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n}`

function ScoreBar({ value, max = 10, color = 'bg-gold-500' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${(value/max)*100}