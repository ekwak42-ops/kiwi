import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function PurchasesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // TODO: 구매 내역 가져오기
  // const { data: purchases } = await supabase
  //   .from('transactions')
  //   .select('*, products(*)')
  //   .eq('buyer_id', user.id)
  //   .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">구매 내역</h1>

        <Card>
          <CardHeader>
            <CardTitle>아직 구매한 상품이 없습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              우리 동네 중고 거래를 시작해보세요!
            </p>
            <Link href="/products">
              <Button>상품 둘러보기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
