import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function SalesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 판매 중인 상품 가져오기
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">판매 내역</h1>
          <Link href="/sell">
            <Button>상품 등록하기</Button>
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>아직 등록한 상품이 없습니다</CardTitle>
              <CardDescription>
                첫 상품을 등록하고 거래를 시작해보세요!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sell">
                <Button>상품 등록하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{product.title}</h3>
                        <Badge
                          variant={
                            product.status === 'sold'
                              ? 'secondary'
                              : product.status === 'reserved'
                                ? 'outline'
                                : 'default'
                          }
                        >
                          {product.status === 'sold'
                            ? '거래완료'
                            : product.status === 'reserved'
                              ? '예약중'
                              : '판매중'}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-primary mb-2">
                        {product.price.toLocaleString()}원
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.location_gu} {product.location_dong}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
                      </Link>
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
