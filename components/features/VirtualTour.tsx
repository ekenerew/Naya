'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Maximize2, Minimize2, X, Play, RotateCcw, ZoomIn, ZoomOut, Move, Eye, Camera } from 'lucide-react'

type Scene = {
  id: string
  label: string
  imageUrl: string
  hotspots?: Array<{ x: number; y: number; targetScene: string; label: string }>
}

type Props = {
  scenes: Scene[]
  propertyTitle: string
  isModal?: boolean
  onClose?: () => void
}

export function VirtualTourViewer({ scenes, propertyTitle, isModal, onClose }: Props) {
  const [currentScene, setCurrentScene] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const scene = scenes[currentScene]

  // Auto-rotate
  useEffect(() => {
    if (isDragging) return
    const interval = setInterval(() => {
      setRotation(r => ({ ...r, y: (r.y + 0.2) % 360 }))
    }, 50)
    return () => clearInterval(interval)
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y
    setRotation(r => ({ x: Math.max(-45, Math.min(45, r.x - dy * 0.3)), y: (r.y + dx * 0.3) % 360 }))
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastMouse])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
  }, [handleMouseMove, handleMouseUp])

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const dx = e.touches[0].clientX - lastMouse.x
    const dy = e.touches[0].clientY - lastMouse.y
    setRotation(r => ({ x: Math.max(-45, Math.min(45, r.x - dy*0.3)), y: (r.y + dx*0.3) % 360 }))
    setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  return (
    <div className={`${fullscreen || isModal ? 'fixed inset-0 z-[500] bg-black' : 'relative w-full aspect-video rounded-2xl overflow-hidden'}`}
      ref={containerRef}>

      {/* 360 viewer */}
      <div className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}>
        {!loaded && (
          <div className="absolute inset-0 bg-obsidian-900 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 rounded-full border-4 border-gold-500/30 border-t-gold-500 animate-spin mb-4" />
            <p className="text-white/60 text-sm">Loading 360° view...</p>
          </div>
        )}
        <img
          ref={imgRef}
          src={scene.imageUrl}
          alt={scene.label}
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-none"
          style={{
            transform: `scale(${zoom}) rotateX(${rotation.x}deg)`,
            objectPosition: `${50 - (rotation.y / 360) * 100}% 50%`,
          }}
          draggable={false}
        />

        {/* Hotspots */}
        {scene.hotspots?.map((h, i) => (
          <button key={i} onClick={() => setCurrentScene(scenes.findIndex(s => s.id === h.targetScene))}
            className="absolute flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-obsidian-900 text-xs font-semibold shadow-lg hover:scale-105 transition-transform"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%,-50%)' }}>
            <Eye className="w-3 h-3" />{h.label}
          </button>
        ))}

        {/* Drag hint */}
        {!isDragging && loaded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur rounded-full text-white text-xs animate-pulse">
            <Move className="w-3.5 h-3.5" />Drag to look around
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {(isModal || onClose) && (
          <button onClick={onClose}
            className="w-9 h-9 bg-black/60 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => setFullscreen(!fullscreen)}
          className="w-9 h-9 bg-black/60 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button onClick={() => setZoom(z => Math.min(2, z+0.25))}
          className="w-9 h-9 bg-black/60 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom(z => Math.max(0.5, z-0.25))}
          className="w-9 h-9 bg-black/60 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => { setRotation({ x:0, y:0 }); setZoom(1) }}
          className="w-9 h-9 bg-black/60 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Scene info */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur rounded-xl">
          <Camera className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-white text-xs font-semibold">{scene.label}</span>
          <span className="text-white/40 text-xs">{currentScene+1}/{scenes.length}</span>
        </div>
      </div>

      {/* Scene navigator */}
      {scenes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur rounded-2xl">
          {scenes.map((s, i) => (
            <button key={i} onClick={() => { setCurrentScene(i); setLoaded(false) }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-all ${i===currentScene?'bg-gold-500 text-obsidian-900':'text-white/60 hover:text-white'}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* 360 badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 rounded-full">
          <RotateCcw className="w-3.5 h-3.5 text-obsidian-900" />
          <span className="text-obsidian-900 text-xs font-black">360° VIRTUAL TOUR</span>
        </div>
      </div>
    </div>
  )
}

// ── Tour Launch Button ────────────────────────────────────────
export function VirtualTourButton({ scenes, propertyTitle }: { scenes: Scene[]; propertyTitle: string }) {
  const [open, setOpen] = useState(false)

  if (!scenes?.length) return null

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg group">
        <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-3 h-3 text-obsidian-900 ml-0.5" />
        </div>
        360° Virtual Tour
      </button>

      {open && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl aspect-video relative">
            <VirtualTourViewer
              scenes={scenes}
              propertyTitle={propertyTitle}
              isModal
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

// ── Upload Tour (for agents) ──────────────────────────────────
export function VirtualTourUpload({ listingId, onSave }: { listingId?: string; onSave?: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method:'POST', body:fd })
      const data = await res.json()
      if (data.url) { setUrl(data.url); onSave?.(data.url) }
    } catch {}
    finally { setUploading(false) }
  }

  return (
    <div className="p-4 border-2 border-dashed border-surface-border rounded-2xl hover:border-gold-300 transition-colors">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      {url ? (
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Camera className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-emerald-700">360° image uploaded!</p>
          <button onClick={() => { setUrl(''); if (fileRef.current) fileRef.current.value='' }}
            className="text-xs text-obsidian-400 hover:text-obsidian-700 mt-1">Upload different image</button>
        </div>
      ) : (
        <div className="text-center" onClick={() => fileRef.current?.click()}>
          <div className="w-12 h-12 bg-surface-subtle rounded-xl flex items-center justify-center mx-auto mb-2">
            {uploading ? <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              : <Camera className="w-6 h-6 text-obsidian-400" />}
          </div>
          <p className="text-sm font-semibold text-obsidian-700 mb-0.5">{uploading ? 'Uploading...' : 'Upload 360° Photo'}</p>
          <p className="text-xs text-obsidian-400">Use a 360° camera or panoramic photo · Max 20MB</p>
        </div>
      )}
    </div>
  )
}
