import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function PurchasesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 구매 내역 가져오기
  const { data: purchases, error } = await supabase
    .from('transactions')
    .select(`
      *,
      product:products (
        id,
        title,
        price,
        images,
        location_gu,
        location_dong,
        status
      ),
      seller:profiles!transactions_seller_id_fkey (
        name,
        email
      )
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('구매 내역 조회 오류:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">구매 내역</h1>

        {!purchases || purchases.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>아직 구매한 상품이 없습니다</CardTitle>
              <CardDescription>
                우리 동네 중고 거래를 시작해보세요!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/products">
                <Button>상품 둘러보기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {purchase.product?.images && purchase.product.images.length > 0 && (
                      <img
                        src={purchase.product.images[0]}
                        alt={purchase.product.title || '상품 이미지'}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {purchase.product?.title || '상품 정보 없음'}
                        </h3>
                        <Badge
                          variant={
                            purchase.status === 'completed'
                              ? 'default'
                              : purchase.status === 'cancelled'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {purchase.status === 'completed'
                            ? '거래완료'
                            : purchase.status === 'cancelled'
                              ? '취소됨'
                              : '진행중'}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-primary mb-2">
                        {purchase.product?.price.toLocaleString()}원
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        판매자: {purchase.seller?.name || '알 수 없음'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.product?.location_gu} {purchase.product?.location_dong}
                      </p>
                      {purchase.created_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          거래 시작: {new Date(purchase.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/products/${purchase.product_id}`}>
                        <Button variant="outline" size="sm">
                          상품 보기
                        </Button>
                      </Link>
                      {purchase.status === 'completed' && purchase.delivery_departure && (
                        <Link href={`/mypage/purchases/${purchase.id}`}>
                          <Button variant="outline" size="sm">
                            배송 조회
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
