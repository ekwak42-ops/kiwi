'use client'

import { useEffect, useRef, useState } from 'react'

interface GoogleMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{ lat: number; lng: number; label?: string }>
  className?: string
}

// Google Maps API 로더
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드되었는지 확인
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    // 스크립트가 이미 로딩 중인지 확인
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    )
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps'))
      )
      return
    }

    // 새 스크립트 생성
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

export function GoogleMap({
  center,
  zoom = 14,
  markers = [],
  className = '',
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        setError('Google Maps API key is not set')
        setIsLoading(false)
        return
      }

      try {
        // Google Maps 스크립트 로드
        await loadGoogleMapsScript(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

        if (mapRef.current && window.google) {
          // 지도 생성
          const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          })

          // 마커 추가
          markers.forEach((markerPosition) => {
            new window.google.maps.Marker({
              position: markerPosition,
              map,
              title: markerPosition.label,
            })
          })

          setIsLoading(false)
        }
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err)
        setError('지도를 불러올 수 없습니다')
        setIsLoading(false)
      }
    }

    initMap()
  }, [center, zoom, markers])

  if (error) {
    return (
      <div className={`w-full h-full min-h-[400px] rounded-lg bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-muted flex items-center justify-center rounded-lg ${className}`}>
          <p className="text-muted-foreground">지도 로딩 중...</p>
        </div>
      )}
      <div
        ref={mapRef}
        className={`w-full h-full min-h-[400px] rounded-lg ${className}`}
      />
    </div>
  )
}
