import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GoogleMap } from '@/components/map/GoogleMap'
import { getRegionCoordinates } from '@/lib/geocoding'
import { ArrowLeft, MapPin, Package, User } from 'lucide-react'

interface PurchaseDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PurchaseDetailPage({ params }: PurchaseDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 사용자 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 거래 상세 정보 조회
  const { data: transaction, error } = await supabase
    .from('transactions')
    .select(`
      *,
      product:products (
        id,
        title,
        price,
        images,
        description,
        location_gu,
        location_dong
      ),
      seller:profiles!transactions_seller_id_fkey (
        name,
        email,
        region_gu,
        region_dong
      ),
      buyer:profiles!transactions_buyer_id_fkey (
        name,
        region_gu,
        region_dong
      )
    `)
    .eq('id', id)
    .eq('buyer_id', user.id) // 본인의 거래만 조회 가능
    .single()

  if (error || !transaction) {
    notFound()
  }

  // 출발지/도착지 좌표 가져오기
  let departureCoords = null
  let destinationCoords = null

  if (transaction.delivery_departure) {
    try {
      departureCoords = await getRegionCoordinates(
        transaction.seller?.region_gu || '',
        transaction.seller?.region_dong || ''
      )
    } catch (error) {
      console.error('출발지 좌표 변환 실패:', error)
    }
  }

  if (transaction.delivery_destination) {
    try {
      destinationCoords = await getRegionCoordinates(
        transaction.buyer?.region_gu || '',
        transaction.buyer?.region_dong || ''
      )
    } catch (error) {
      console.error('도착지 좌표 변환 실패:', error)
    }
  }

  // 지도 중심점 (출발지와 도착지의 중간)
  const centerCoords = departureCoords && destinationCoords
    ? {
        lat: (departureCoords.lat + destinationCoords.lat) / 2,
        lng: (departureCoords.lng + destinationCoords.lng) / 2,
      }
    : departureCoords || destinationCoords || { lat: 37.5665, lng: 126.9780 }

  // 마커 배열
  const markers = []
  if (departureCoords) {
    markers.push({ ...departureCoords, label: '출발' })
  }
  if (destinationCoords) {
    markers.push({ ...destinationCoords, label: '도착' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mypage/purchases">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">배송 조회</h1>
            <p className="text-muted-foreground mt-1">
              거래 번호: {transaction.id.slice(0, 8)}...
            </p>
          </div>
          <Badge
            variant={
              transaction.status === 'completed'
                ? 'default'
                : transaction.status === 'cancelled'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {transaction.status === 'completed'
              ? '거래완료'
              : transaction.status === 'cancelled'
                ? '취소됨'
                : '진행중'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 배송 지도 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                배송 경로
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departureCoords || destinationCoords ? (
                <div className="h-96 rounded-lg overflow-hidden">
                  <GoogleMap
                    center={centerCoords}
                    zoom={12}
                    markers={markers}
                  />
                </div>
              ) : (
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">배송 정보가 아직 등록되지 않았습니다.</p>
                </div>
              )}
              
              {(transaction.delivery_departure || transaction.delivery_destination) && (
                <div className="mt-4 space-y-2">
                  {transaction.delivery_departure && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        출
                      </div>
                      <div>
                        <p className="font-medium">출발지</p>
                        <p className="text-sm text-muted-foreground">{transaction.delivery_departure}</p>
                      </div>
                    </div>
                  )}
                  {transaction.delivery_destination && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FF8A00] text-white flex items-center justify-center text-sm font-bold">
                        도
                      </div>
                      <div>
                        <p className="font-medium">도착지</p>
                        <p className="text-sm text-muted-foreground">{transaction.delivery_destination}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                상품 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.product?.images && transaction.product.images.length > 0 && (
                <img
                  src={transaction.product.images[0]}
                  alt={transaction.product.title || '상품 이미지'}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">
                {transaction.product?.title || '상품 정보 없음'}
              </h3>
              <p className="text-2xl font-bold text-primary mb-4">
                {transaction.product?.price.toLocaleString()}원
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {transaction.product?.description || '설명 없음'}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {transaction.product?.location_gu} {transaction.product?.location_dong}
              </div>
              <div className="mt-4">
                <Link href={`/products/${transaction.product_id}`}>
                  <Button variant="outline" className="w-full">
                    상품 상세보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 거래 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                거래 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">판매자</p>
                <p className="font-medium">{transaction.seller?.name || '알 수 없음'}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.seller?.region_gu} {transaction.seller?.region_dong}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">거래 시작일</p>
                <p className="font-medium">
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '정보 없음'}
                </p>
              </div>

              {transaction.completed_at && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">거래 완료일</p>
                  <p className="font-medium">
                    {new Date(transaction.completed_at).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">거래 상태</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaction.status === 'completed'
                        ? 'bg-green-500'
                        : transaction.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                    }`}
                  />
                  <p className="font-medium">
                    {transaction.status === 'completed'
                      ? '거래가 완료되었습니다'
                      : transaction.status === 'cancelled'
                        ? '거래가 취소되었습니다'
                        : '거래가 진행 중입니다'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mt-8">
          <Link href="/mypage/purchases">
            <Button variant="outline">구매 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

