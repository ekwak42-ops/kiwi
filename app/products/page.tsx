import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Tables } from '@/types/supabase'

type Product = Tables<'products'>

export default async function ProductsPage() {
  const supabase = await createClient()

  // 상품 목록 조회 (판매 가능한 상품만)
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      profiles:seller_id (
        name,
        region_gu,
        region_dong
      )
    `)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('상품 조회 오류:', error)
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">상품을 불러올 수 없습니다</h2>
          <p className="text-muted-foreground mt-2">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">상품 목록</h1>
          <p className="text-muted-foreground mt-1">
            지역 기반 중고 거래 상품들을 둘러보세요
          </p>
        </div>
        <Link
          href="/sell"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          상품 등록하기
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            등록된 상품이 없습니다
          </h2>
          <p className="text-muted-foreground mt-2">
            첫 번째 상품을 등록해보세요!
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
          >
            상품 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                {/* 이미지 영역 (향후 구현) */}
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      <svg
                        className="w-16 h-16"
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

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {product.price.toLocaleString()}원
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {product.description}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {product.location_gu} {product.location_dong}
                  </div>
                  <Badge variant="secondary">
                    {product.status === 'available' && '판매중'}
                    {product.status === 'reserved' && '예약중'}
                    {product.status === 'sold' && '판매완료'}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
