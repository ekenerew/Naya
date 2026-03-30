'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Maximize2, X, RotateCcw, Ruler, Camera, AlertTriangle, CheckCircle2, Smartphone, Move } from 'lucide-react'

type Point = { x: number; y: number }
type Measurement = { start: Point; end: Point; pixels: number; metres?: number }

// Pixels-per-metre calibration (rough estimate for phone camera at ~1.5m viewing distance)
const PPM_DEFAULT = 280

export default function ARMeasure() {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [active, setActive]       = useState(false)
  const [supported, setSupported] = useState(true)
  const [streaming, setStreaming] = useState(false)
  const [points, setPoints]       = useState<Point[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [calibrating, setCalibrating]   = useState(false)
  const [ppm, setPpm]             = useState(PPM_DEFAULT)
  const [refDist, setRefDist]     = useState('1.0')
  const [calPoint1, setCalPoint1] = useState<Point|null>(null)
  const [permission, setPermission] = useState<'pending'|'granted'|'denied'>('pending')
  const streamRef = useRef<MediaStream|null>(null)

  useEffect(() => {
    if (!navigator?.mediaDevices?.getUserMedia) setSupported(false)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setStreaming(true)
        setPermission('granted')
      }
    } catch (e: any) {
      setPermission('denied')
      console.error(e)
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setStreaming(false)
    setActive(false)
    setPoints([])
    setMeasurements([])
    setCalibrating(false)
    setCalPoint1(null)
  }, [])

  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = video.videoWidth  || video.clientWidth
    canvas.height = video.videoHeight || video.clientHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw existing measurements
    measurements.forEach((m, i) => {
      const dist = m.metres ? `${m.metres.toFixed(2)}m` : `${m.pixels}px`
      ctx.beginPath()
      ctx.moveTo(m.start.x, m.start.y)
      ctx.lineTo(m.end.x, m.end.y)
      ctx.strokeStyle = '#C8A84B'
      ctx.lineWidth   = 3
      ctx.setLineDash([8, 4])
      ctx.stroke()
      ctx.setLineDash([])

      // Endpoint dots
      [m.start, m.end].forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, 2*Math.PI)
        ctx.fillStyle = '#C8A84B'
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Label
      const midX = (m.start.x + m.end.x) / 2
      const midY = (m.start.y + m.end.y) / 2 - 14
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.roundRect(midX - 28, midY - 14, 56, 22, 6)
      ctx.fill()
      ctx.fillStyle = '#C8A84B'
      ctx.font = 'bold 13px Outfit, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(dist, midX, midY + 2)
    })

    // Draw active point
    if (points[0]) {
      ctx.beginPath()
      ctx.arc(points[0].x, points[0].y, 10, 0, 2*Math.PI)
      ctx.fillStyle = 'rgba(200,168,75,0.5)'
      ctx.fill()
      ctx.strokeStyle = '#C8A84B'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('A', points[0].x, points[0].y + 4)
    }

    // Calibration line
    if (calPoint1) {
      ctx.beginPath()
      ctx.arc(calPoint1.x, calPoint1.y, 10, 0, 2*Math.PI)
      ctx.fillStyle = 'rgba(59,130,246,0.5)'
      ctx.fill()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // Crosshair
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(cx-20, cy); ctx.lineTo(cx+20, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy-20); ctx.lineTo(cx, cy+20); ctx.stroke()
    ctx.setLineDash([])
  }, [measurements, points, calPoint1])

  useEffect(() => {
    if (!streaming) return
    const loop = setInterval(drawOverlay, 50)
    return () => clearInterval(loop)
  }, [streaming, drawOverlay])

  const getRelativePoint = (e: React.TouchEvent|React.MouseEvent): Point => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY }
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY }
  }

  const handleTap = (e: React.TouchEvent|React.MouseEvent) => {
    e.preventDefault()
    const pt = getRelativePoint(e)

    if (calibrating) {
      if (!calPoint1) { setCalPoint1(pt) }
      else {
        const dx = pt.x - calPoint1.x
        const dy = pt.y - calPoint1.y
        const pixels = Math.sqrt(dx*dx + dy*dy)
        const metres = parseFloat(refDist) || 1.0
        setPpm(pixels / metres)
        setCalPoint1(null)
        setCalibrating(false)
      }
      return
    }

    if (points.length === 0) {
      setPoints([pt])
    } else {
      const start = points[0]
      const dx = pt.x - start.x
      const dy = pt.y - start.y
      const pixels = Math.sqrt(dx*dx + dy*dy)
      const metres = ppm > 0 ? pixels / ppm : undefined
      setMeasurements(p => [...p, { start, end:pt, pixels:Math.round(pixels), metres }])
      setPoints([])
    }
  }

  const clearAll = () => { setMeasurements([]); setPoints([]) }
  const removeLastMeasurement = () => setMeasurements(p => p.slice(0,-1))

  if (!supported) return (
    <div className="card p-6 text-center">
      <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
      <h3 className="font-semibold text-obsidian-900 mb-2">Camera not available</h3>
      <p className="text-sm text-obsidian-500">AR Measurement requires camera access on a mobile device.</p>
    </div>
  )

  if (!active) return (
    <div className="card overflow-hidden">
      <div className="p-5 bg-gradient-to-br from-obsidian-900 to-obsidian-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center">
              <Ruler className="w-6 h-6 text-obsidian-900" />
            </div>
            <div>
              <p className="text-white font-semibold">AR Property Measurement</p>
              <p className="text-white/40 text-xs">Measure rooms with your camera</p>
            </div>
          </div>
          <p className="text-white/50 text-xs leading-relaxed mb-4">
            Point your camera at any surface and tap to place measurement points. Get instant room dimensions without a tape measure.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Tap to measure','Works on any surface','Shareable results','No download needed'].map((f,i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] text-white/60 bg-white/10 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-gold-400" />{f}
              </span>
            ))}
          </div>
          <button onClick={() => { setActive(true); startCamera() }}
            className="btn-primary w-full justify-center gap-2">
            <Camera className="w-4 h-4" />Launch AR Measurement
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <Smartphone className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Tips for best accuracy:</strong> Hold your phone steady at waist height (~1m from ground). Tap two points to measure. For room walls, stand facing the wall directly. Calibrate first for greater precision.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black z-[600] flex flex-col">
      {/* AR View */}
      <div className="relative flex-1 overflow-hidden"
        onTouchStart={handleTap}
        onClick={handleTap}>
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ touchAction:'none' }} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gold-400" />
            <span className="text-white font-semibold text-sm">AR Measurement</span>
          </div>
          <button onClick={stopCamera} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Instruction bar */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-2 bg-black/60 backdrop-blur rounded-full text-white text-xs text-center">
            {calibrating
              ? calPoint1 ? '📍 Tap the END point of the reference object' : '📍 Tap the START point of the reference object'
              : points.length === 0 ? '👆 Tap to place START point' : '👆 Tap to place END point'
            }
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pb-6 pt-10 px-4">
          {/* Measurements list */}
          {measurements.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {measurements.map((m,i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 rounded-full text-obsidian-900 text-xs font-bold shadow">
                  <Ruler className="w-3 h-3" />
                  {m.metres ? `${m.metres.toFixed(2)} m` : `${m.pixels} px`}
                </div>
              ))}
            </div>
          )}

          {/* Calibration */}
          {!calibrating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                <span className="text-white/50 text-xs">Ref dist (m):</span>
                <input type="number" step="0.1" min="0.1" value={refDist}
                  onChange={e => setRefDist(e.target.value)}
                  className="bg-transparent text-white text-xs w-12 outline-none font-mono"
                  onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} />
              </div>
              <button onClick={e => { e.stopPropagation(); setCalibrating(true) }}
                className="px-3 py-2 bg-blue-500 rounded-xl text-white text-xs font-bold">
                Calibrate
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 justify-center">
            <button onClick={e => { e.stopPropagation(); removeLastMeasurement() }}
              disabled={measurements.length===0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/20 rounded-xl text-white text-xs font-semibold disabled:opacity-40">
              <RotateCcw className="w-3.5 h-3.5" />Undo
            </button>
            <button onClick={e => { e.stopPropagation(); clearAll() }}
              disabled={measurements.length===0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500/80 rounded-xl text-white text-xs font-semibold disabled:opacity-40">
              <X className="w-3.5 h-3.5" />Clear All
            </button>
            {measurements.length > 0 && (
              <button onClick={e => { e.stopPropagation()
                const txt = measurements.map((m,i) => `M${i+1}: ${m.metres?`${m.metres.toFixed(2)}m`:`${m.pixels}px`}`).join(', ')
                navigator.share ? navigator.share({ title:'Room Measurements — Naya', text:txt }) : navigator.clipboard?.writeText(txt)
              }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 rounded-xl text-obsidian-900 text-xs font-bold">
                <Move className="w-3.5 h-3.5" />Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
