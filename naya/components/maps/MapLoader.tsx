'use client'
// Loads Google Maps script once globally
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type MapCtx = { loaded: boolean; error: boolean }
const MapContext = createContext<MapCtx>({ loaded: false, error: false })

export function MapProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  useEffect(() => {
    // Already loaded
    if ((window as any).google?.maps) { setLoaded(true); return }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) { setError(true); return }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&callback=__nayaMapsReady`
    script.async = true
    script.defer = true;
    (window as any).__nayaMapsReady = () => setLoaded(true)
    script.onerror = () => setError(true)
    document.head.appendChild(script)

    return () => {
      delete (window as any).__nayaMapsReady
    }
  }, [])

  return <MapContext.Provider value={{ loaded, error }}>{children}</MapContext.Provider>
}

export const useMapLoader = () => useContext(MapContext)
