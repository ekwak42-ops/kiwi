/**
 * Geocoding 유틸리티 함수
 * 주소를 좌표로 변환하는 기능 제공
 */

interface GeocodingResult {
  lat: number
  lng: number
}

/**
 * 주소를 좌표로 변환 (Google Geocoding API 사용)
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key is not set')
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address + ', South Korea'
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )

    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return { lat: location.lat, lng: location.lng }
    }

    // Geocoding 실패 시 기본 좌표 반환 (서울시청)
    console.warn(`Geocoding failed for address: ${address}`)
    return { lat: 37.5665, lng: 126.978 }
  } catch (error) {
    console.error('Geocoding error:', error)
    // 에러 발생 시 기본 좌표 반환 (서울시청)
    return { lat: 37.5665, lng: 126.978 }
  }
}

/**
 * 지역명(구, 동)을 대략적인 좌표로 변환
 * 개인정보 보호를 위해 정확한 주소가 아닌 구/동 단위로만 변환
 */
export async function geocodeRegion(
  gu: string,
  dong: string
): Promise<GeocodingResult> {
  const address = `서울시 ${gu} ${dong}`
  return geocodeAddress(address)
}

/**
 * 미리 정의된 서울시 주요 지역 좌표 (빠른 로딩을 위한 캐싱)
 */
export const SEOUL_REGIONS: Record<string, GeocodingResult> = {
  '강남구': { lat: 37.5172, lng: 127.0473 },
  '강동구': { lat: 37.5301, lng: 127.1238 },
  '강북구': { lat: 37.6398, lng: 127.0256 },
  '강서구': { lat: 37.5509, lng: 126.8495 },
  '관악구': { lat: 37.4784, lng: 126.9516 },
  '광진구': { lat: 37.5384, lng: 127.0822 },
  '구로구': { lat: 37.4954, lng: 126.8874 },
  '금천구': { lat: 37.4519, lng: 126.8955 },
  '노원구': { lat: 37.6542, lng: 127.0568 },
  '도봉구': { lat: 37.6688, lng: 127.0471 },
  '동대문구': { lat: 37.5744, lng: 127.0396 },
  '동작구': { lat: 37.5124, lng: 126.9393 },
  '마포구': { lat: 37.5663, lng: 126.9019 },
  '서대문구': { lat: 37.5791, lng: 126.9368 },
  '서초구': { lat: 37.4837, lng: 127.0324 },
  '성동구': { lat: 37.5634, lng: 127.0368 },
  '성북구': { lat: 37.5894, lng: 127.0167 },
  '송파구': { lat: 37.5145, lng: 127.1059 },
  '양천구': { lat: 37.5170, lng: 126.8664 },
  '영등포구': { lat: 37.5264, lng: 126.8962 },
  '용산구': { lat: 37.5324, lng: 126.9900 },
  '은평구': { lat: 37.6027, lng: 126.9291 },
  '종로구': { lat: 37.5730, lng: 126.9794 },
  '중구': { lat: 37.5641, lng: 126.9979 },
  '중랑구': { lat: 37.6063, lng: 127.0925 },
}

/**
 * 구 이름으로 좌표 가져오기 (캐시 우선, 없으면 API 호출)
 */
export async function getRegionCoordinates(
  gu: string,
  dong?: string
): Promise<GeocodingResult> {
  // 캐시된 좌표가 있으면 사용
  if (SEOUL_REGIONS[gu]) {
    return SEOUL_REGIONS[gu]
  }

  // 캐시에 없으면 API 호출
  if (dong) {
    return geocodeRegion(gu, dong)
  }

  return geocodeAddress(`서울시 ${gu}`)
}
