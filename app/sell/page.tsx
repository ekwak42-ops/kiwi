import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createProduct } from '@/actions/products'

export default async function SellPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>상품 등록</CardTitle>
          <CardDescription>
            판매하실 상품 정보를 입력해주세요. 상하좌우 사진을 등록하면 구매자가 더 신뢰할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">상품명 *</Label>
              <Input
                id="title"
                name="title"
                placeholder="예: 아이폰 15 Pro"
                required
                maxLength={100}
              />
            </div>

            {/* 가격 */}
            <div className="space-y-2">
              <Label htmlFor="price">가격 (원) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="0"
                required
                min="0"
                step="1000"
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">상품 설명 *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="상품의 상태, 구매 시기, 사용 빈도 등을 자세히 알려주세요."
                required
                rows={6}
                maxLength={2000}
              />
              <p className="text-sm text-muted-foreground">
                최대 2,000자까지 입력 가능합니다.
              </p>
            </div>

            {/* 지역 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_gu">구 *</Label>
                <Input
                  id="location_gu"
                  name="location_gu"
                  placeholder="예: 강남구"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_dong">동 *</Label>
                <Input
                  id="location_dong"
                  name="location_dong"
                  placeholder="예: 역삼동"
                  required
                />
              </div>
            </div>

            {/* 이미지 업로드 섹션 (향후 구현) */}
            <div className="space-y-2">
              <Label>상품 이미지 (상하좌우)</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <p className="mb-2">이미지 업로드 기능은 곧 추가됩니다.</p>
                <p className="text-sm">
                  상품의 상, 하, 좌, 우 4방향 사진을 준비해주세요.
                </p>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                상품 등록하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                취소
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              * 필수 입력 항목입니다. 등록된 상품은 같은 지역 사용자에게만 노출됩니다.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
