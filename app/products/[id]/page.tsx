import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StartChatButton } from '@/components/products/StartChatButton'
import Link from 'next/link'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 상품 상세 정보 조회
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!products_seller_id_fkey (
        id,
        name,
        email,
        region_gu,
        region_dong
      )
    `)
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  // 현재 사용자 정보
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === product.seller_id
  const isSold = product.status === 'sold'

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이미지 영역 */}
          <div className="space-y-4">
            <Card>
              <div className="aspect-square bg-muted flex items-center justify-center rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <svg
                      className="w-32 h-32"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
            
            {/* 이미지 썸네일 (향후 구현) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isSold ? 'secondary' : 'default'}>
                  {product.status === 'available' && '판매중'}
                  {product.status === 'reserved' && '예약중'}
                  {product.status === 'sold' && '판매완료'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(product.created_at!).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-4xl font-bold text-primary">
                {product.price.toLocaleString()}원
              </p>
            </div>

            <Separator />

            {/* 상품 설명 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">상품 설명</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* 거래 위치 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">거래 위치</h2>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {product.location_gu} {product.location_dong}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                지도 기능은 곧 추가됩니다.
              </p>
            </div>

            <Separator />

            {/* 판매자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">판매자 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">이름</span>
                    <span className="font-medium">{product.seller.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">지역</span>
                    <span className="font-medium">
                      {product.seller.region_gu} {product.seller.region_dong}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex gap-4">
              {isOwner ? (
                <>
                  <Button variant="outline" className="flex-1">
                    상품 수정
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    삭제
                  </Button>
                </>
              ) : user ? (
                <>
                  <StartChatButton
                    productId={product.id}
                    sellerId={product.seller_id}
                    isSold={isSold}
                  />
                  <Button variant="outline" disabled={isSold}>
                    관심 상품
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="flex-1" disabled>
                    <Link href="/login">
                      로그인 필요
                    </Link>
                  </Button>
                  <Button variant="outline" disabled>
                    관심 상품
                  </Button>
                </>
              )}
            </div>

            {!user && (
              <p className="text-sm text-muted-foreground text-center">
                채팅을 하려면{' '}
                <Link href="/login" className="text-primary underline">
                  로그인
                </Link>
                이 필요합니다.
              </p>
            )}
          </div>
        </div>

        {/* 비슷한 상품 (향후 구현) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">같은 지역의 다른 상품</h2>
          <p className="text-muted-foreground">추천 상품 기능은 곧 추가됩니다.</p>
        </div>
      </div>
    </div>
  )
}
